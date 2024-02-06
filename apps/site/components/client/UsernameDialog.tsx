import { SubmitButton } from '@/client'
import { useUserContext } from '@/context'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Separator,
  Stack,
  Toast,
  Typography,
} from '@/design-system'
import {
  type UsernameSchemaValues,
  checkUsernameAvailability,
  processRegisterFor,
  usernameSchema,
  setUsername
} from '@/lib'
import { addresses } from 'scrypt'
import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'debounce'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Hex,
  createWalletClient,
  custom,
  EIP1193Provider,
} from 'viem'
import { optimism } from 'viem/chains'
import { getExpiration, ID_REGISTRY_EIP_712_DOMAIN, REGISTER_TYPE } from 'scrypt'

interface UsernameDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function UsernameDialog({ open, setOpen }: UsernameDialogProps) {
  const form = useForm<UsernameSchemaValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: '',
    },
  })

  const { userId, username, signMessage, embeddedWallet, fetchUserData } = useUserContext()

  const [usernameExists, setUsernameExists] = useState(false)
  const [validationComplete, setValidationComplete] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

  // Subscribe to changes to the username input
  const watchUsername = debounce(() => form.watch('username'), 500)

  const triggerValidation = React.useMemo(
    () =>
      debounce(() => {
        form.trigger('username')
        setValidationComplete(true)
      }, 500),
    [form],
  )

  useEffect(() => {
    if (form.formState.isValid && validationComplete) {
      checkUsernameAvailability(form.getValues().username).then((result) => {
        setUsernameExists(result.exists)
        setIsCheckingAvailability(false)
      })
      return () => {
        setValidationComplete(false)
      }
    }
  }, [validationComplete, watchUsername])

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <Stack className="items-center gap-5">
          <DialogTitle>
            <Typography>Choose a username</Typography>
          </DialogTitle>
          <Form {...form}>
            <form
              action={async () => {
                if (!embeddedWallet || !signMessage || !fetchUserData) return
                const eip1193Provider =
                  await embeddedWallet.getEthereumProvider()
                const customEip1193Client = createWalletClient({
                  chain: optimism,
                  transport: custom(eip1193Provider as EIP1193Provider),
                })
                const deadline = getExpiration()
                // generate signature for use in both register txn + username set
                const sig = await customEip1193Client.signTypedData({
                  account: embeddedWallet.address as Hex,
                  domain: ID_REGISTRY_EIP_712_DOMAIN,
                  types: { Register: REGISTER_TYPE },
                  primaryType: 'Register',
                  message: {
                    to: embeddedWallet.address as Hex,
                    recovery: addresses.riverRecovery.optimism,
                    // assumes all wallets calling this have 0 previous transactions
                    // CURRENTLY this is fine because username db sig will not be rejected
                    // if the nonce is off (since its still a valid recoverable message)
                    nonce: BigInt(0), 
                    deadline: deadline,
                  },
                })
                // setup default false values for success
                // let userIdSuccess = false
                // let userNameSuccess = false

                // if no userId/usernmae, then go thru the reg + username flow
                // if no username, only go through username flow
                // we can lean on userContext since thats whats dictating header
                let usernameSuccess = ""
                let userIdSuccess = userId ? userId.toString() : ""
                if (!userIdSuccess) {
                  const registeredId = await processRegisterFor({
                    signer: embeddedWallet.address as Hex,
                    recovery: addresses.riverRecovery.optimism,
                    deadline: deadline,
                    sig: sig,
                  })  
                  if (registeredId) userIdSuccess = registeredId
                }
                const registeredUsername = await setUsername({
                  userIdRegistered: userIdSuccess,
                  signature: sig,
                  timestamp: deadline.toString(),
                  username: form.getValues().username,
                  registerForRecipient: embeddedWallet.address as Hex,                  
                })
                if (registeredUsername) usernameSuccess = registeredUsername.name
                // Close the dialog
                setOpen(false)
                // Render a toast
                if (usernameSuccess) {
                  toast.custom((t) => (
                    <Toast>
                      Welcome to River{' '}
                      <span className="font-bold">
                        {form.getValues().username}
                      </span>
                    </Toast>
                  ))
                } else {
                  toast.custom((t) => (
                    <Toast>
                      Error setting username
                    </Toast>
                  ))                  
                }
              }}
              className="w-full"
            >
              <Stack className="gap-8">
                <Separator />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="mx-5 text-center">
                      <FormControl>
                        <Input
                          placeholder="Enter username..."
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            setIsCheckingAvailability(true)
                            triggerValidation()
                          }}
                        />
                      </FormControl>
                      <div className="h-3">
                        {usernameExists ? (
                          <FormMessage className="pt-2 text-red-500">
                            Username not available, please try another
                          </FormMessage>
                        ) : (
                          <FormMessage className="pt-2 text-red-500" />
                        )}
                      </div>
                    </FormItem>
                  )}
                />
                <Separator className="-mt-3" />
              </Stack>
              <DialogFooter className="text-center pt-[18px]">
                <SubmitButton
                  type="submit"
                  variant="link"
                  disabled={
                    !form.formState.isValid ||
                    usernameExists ||
                    isCheckingAvailability
                  }
                >
                  Complete
                </SubmitButton>
              </DialogFooter>
            </form>
          </Form>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
