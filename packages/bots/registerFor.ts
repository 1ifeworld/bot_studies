// import {
//   type EIP1193Provider,
//   type Hex,
//   createWalletClient,
//   custom,
//   Hash,
// } from 'viem'
// import { privateKeyToAccount } from 'viem/accounts'
// import { optimism } from 'viem/chains'

// export async function registerFor(privateKey: Hash) {

//     // load in private key for bot
//     // viem get privatee
//     const account = privateKeyToAccount(privateKey) 


//     // instantiate eip1193 provider




//     const customEip1193Client = createWalletClient({
//       chain: optimism,
//       transport: custom(eip1193Provider as EIP1193Provider),
//     })
//     // generate signature for register txn + username set
//     const deadline = getExpiration()
//     const ID_REGISTRY_EIP_712_DOMAIN = {
//       name: 'River IdRegistry',
//       version: '1',
//       chainId: 10,
//       verifyingContract: addresses.idRegistry.optimism,
//     } as const
//     const REGISTER_TYPE = [
//       { name: 'to', type: 'address' },
//       { name: 'recovery', type: 'address' },
//       { name: 'nonce', type: 'uint256' },
//       { name: 'deadline', type: 'uint256' },
//     ] as const
//     const sig = await customEip1193Client.signTypedData({
//       account: embeddedWallet?.address as Hex,
//       domain: ID_REGISTRY_EIP_712_DOMAIN,
//       types: { Register: REGISTER_TYPE },
//       primaryType: 'Register',
//       message: {
//         to: embeddedWallet?.address as Hex,
//         recovery: addresses.riverRecovery.optimism,
//         // assumes all wallets calling this have 0 previous transactions
//         // CURRENTLY this is fine because username db sig will not be rejected
//         // if the nonce is off (since its still a valid recoverable message)
//         nonce: BigInt(0),
//         deadline: deadline,
//       },
//     })
//     // if no userId/usernmae, then go thru the reg + username flow
//     // if no username, only go through username flow
//     // we can lean on userContext since thats whats dictating header
//     let inFlightUserId = userId ? userId.toString() : ''
//     // check if inflightUserId was overwritten from valid userId in user context
//     if (!inFlightUserId) {
//       const registeredId = await processRegisterFor({
//         signer: embeddedWallet?.address as Hex,
//         recovery: addresses.riverRecovery.optimism,
//         deadline: deadline,
//         sig: sig,
//       })
//       if (registeredId) inFlightUserId = registeredId
//     }
//     // If userId is still null here, skip username set process
//     let success = false
//     if (inFlightUserId) {
//       const resp = await setUsername({
//         userIdRegistered: inFlightUserId,
//         signature: sig,
//         timestamp: deadline.toString(),
//         username: form.getValues().username,
//         registerForRecipient: embeddedWallet?.address as Hex,
//       })
//       if (resp.success) success = true
//     }
//     // reset context embeddedWallet + userId + username
//     await fetchUserData()
//     // set is processing to false. re enables ability to submit form
//     setIsProcessing(false)
//     // return success state
//     return success
//   }
// }