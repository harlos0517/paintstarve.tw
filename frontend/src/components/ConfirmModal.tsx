import { Alert, Button, Group, Modal, Text } from '@mantine/core'

export interface ConfirmModalProps {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmLabel?: string
  loading?: boolean
  error?: string
}

const ConfirmModal = ({
  opened,
  onClose,
  onConfirm,
  title = '確認刪除',
  message = '此操作無法復原，確定要繼續嗎？',
  confirmLabel = '刪除',
  loading,
  error,
}: ConfirmModalProps) => (
  <Modal opened={opened} onClose={onClose} title={title} centered size="sm">
    <Text size="sm" mb="md">{message}</Text>
    {error && <Alert color="red" mb="md">{error}</Alert>}
    <Group justify="flex-end">
      <Button variant="default" onClick={onClose}>取消</Button>
      <Button color="red" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
    </Group>
  </Modal>
)

export default ConfirmModal
