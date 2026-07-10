import { Alert, Badge, Button, Group, Stack, Text, TextInput, Title } from '@mantine/core'
import { useState } from 'react'

import CharacterClaimPicker from '@/components/admin/CharacterClaimPicker'
import { authClient } from '@/lib/auth-client'

const ROLE_LABEL: Record<string, string> = { USER: '使用者', ADMIN: '管理員' }
const VERIFY_STATUS_LABEL: Record<string, string> = {
  PENDING: '審核中', VERIFIED: '已認證', REJECTED: '已拒絕',
}
const VERIFY_STATUS_COLOR: Record<string, string> = {
  PENDING: 'yellow', VERIFIED: 'green', REJECTED: 'red',
}

const AdminMe = () => {
  const { data: session, refetch } = authClient.useSession()
  const user = session!.user

  const [name, setName] = useState(user.name)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()
  const [saved, setSaved] = useState(false)

  const handleSubmit = async() => {
    setSaving(true)
    setError(undefined)
    setSaved(false)
    const { error: updateError } = await authClient.updateUser({ name })
    setSaving(false)
    if (updateError) setError(updateError.message ?? '更新失敗')
    else {
      setSaved(true)
      refetch()
    }
  }

  return <Stack>
    <Title order={2}>我的資料</Title>
    <Group>
      <Text size="sm" c="dimmed">Email</Text>
      <Text>{user.email}</Text>
    </Group>
    <Group>
      <Text size="sm" c="dimmed">身份</Text>
      <Badge variant="light">{ROLE_LABEL[user.role] ?? user.role}</Badge>
    </Group>
    <Group>
      <Text size="sm" c="dimmed">審核狀態</Text>
      <Badge color={VERIFY_STATUS_COLOR[user.verifyStatus]} variant="light">
        {VERIFY_STATUS_LABEL[user.verifyStatus] ?? user.verifyStatus}
      </Badge>
    </Group>

    <Group align="flex-end">
      <TextInput
        label="顯示名稱" value={name} required
        onChange={e => setName(e.currentTarget.value)}
      />
      <Button type="submit" loading={saving} onClick={handleSubmit}>儲存</Button>
    </Group>
    {error && <Alert color="red">{error}</Alert>}
    {saved && <Alert color="green">已儲存</Alert>}
    <CharacterClaimPicker />
  </Stack>
}

export default AdminMe
