import { Box } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ReactNode, useState } from 'react'

import { getErrorMessage } from '@/api/backendClient'
import ConfirmModal from '@/components/ConfirmModal'

export interface ConfirmDeleteButtonProps {
  onConfirm: () => Promise<unknown>
  message?: string
  title?: string
  confirmLabel?: string
  children: ReactNode
}

// Wraps any trigger element (an icon button, a text button, etc.) so
// clicking it opens a confirmation modal first - owns its own open/loading/
// error state, so call sites just provide the async action and the trigger.
// title/confirmLabel default to ConfirmModal's own "確認刪除"/"刪除" - override
// them for actions that aren't a literal delete (e.g. revoking an API key).
const ConfirmDeleteButton = ({
  onConfirm, message, title, confirmLabel, children,
}: ConfirmDeleteButtonProps) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const handleConfirm = async() => {
    setError(undefined)
    setLoading(true)
    try {
      await onConfirm()
      close()
    } catch(err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return <>
    <Box component="span" onClick={open} style={{ display: 'contents' }}>
      {children}
    </Box>
    <ConfirmModal
      opened={opened}
      onClose={close}
      onConfirm={handleConfirm}
      loading={loading}
      error={error}
      message={message}
      title={title}
      confirmLabel={confirmLabel}
    />
  </>
}

export default ConfirmDeleteButton
