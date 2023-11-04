import * as React from 'react'
import {
  Button,
  Dialog,
  DialogPortal,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from '@/design-system'
import { UploadDialog } from '@/server'

export function AddNew() {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false)

  const dropdownTriggerRef = React.useRef(null)
  const focusRef = React.useRef<HTMLButtonElement | null>(null)

  function handleDialogItemSelect() {
    focusRef.current = dropdownTriggerRef.current
  }

  function handleDialogItemOpenChange(open: boolean) {
    setHasOpenDialog(open)
    if (open === false) {
      setDropdownOpen(false)
    }
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        {/* TODO: Adjust spacing between the plus icon and "New" */}
        <Button variant="link" ref={dropdownTriggerRef}>
          +New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        hidden={hasOpenDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus()
            focusRef.current = null
            event.preventDefault()
          }
        }}
      >
        <DropdownMenuGroup>
          {/* Item */}
          <UploadDialog
            triggerChildren="Upload"
            onSelect={handleDialogItemSelect}
            onOpenChange={handleDialogItemOpenChange}
          />
          {/* Channel */}
          <DialogItem
            triggerChildren="Channel"
            onSelect={handleDialogItemSelect}
            onOpenChange={handleDialogItemOpenChange}
          >
            <DialogTitle>Delete</DialogTitle>
          </DialogItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface DialogItemProps {
  triggerChildren: React.ReactNode
  children: React.ReactNode
  onSelect: () => void
  onOpenChange: (open: boolean) => void
}

const DialogItem = React.forwardRef<HTMLDivElement, DialogItemProps>(
  ({ triggerChildren, children, onSelect, onOpenChange }, forwardedRef) => {
    return (
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            ref={forwardedRef}
            onSelect={(event) => {
              event.preventDefault()
              onSelect && onSelect()
            }}
          >
            {triggerChildren}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent className="focus:outline-none">
            {children}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    )
  },
)