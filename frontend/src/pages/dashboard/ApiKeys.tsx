import {
  Alert, Badge, Button, Checkbox, CopyButton, Group, Modal, Stack, Table, Text, TextInput, Title,
} from '@mantine/core'
import { useState } from 'react'

import { ApiKey, ApiKeyScope, CreateApiKeyResult } from '@/api/apiKeys'
import { getErrorMessage } from '@/api/backendClient'
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton'
import AdminOnly from '@/components/dashboard/AdminOnly'
import UserPicker from '@/components/dashboard/UserPicker'
import { useAdminApiKeys, useCreateAdminApiKey, useRevokeAdminApiKey } from '@/hooks/useApiKeys'
import { CheckIcon, CopyIcon } from '@phosphor-icons/react'

const SCOPE_LABEL: Record<ApiKeyScope, string> = {
  'characters:read': '讀取角色資料 (characters:read)',
  'characters:write': '寫入角色資料 (characters:write)',
}

const ApiKeyStatusBadge = ({ apiKey }: { apiKey: ApiKey }) => {
  if (apiKey.revokedAt) return <Badge color="gray" variant="light">已撤銷</Badge>
  if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date())
    return <Badge color="orange" variant="light">已過期</Badge>
  return <Badge color="green" variant="light">使用中</Badge>
}

interface RevealTokenModalProps {
  result: CreateApiKeyResult | undefined
  onClose: () => void
}

// Closing is only possible via the explicit button - not the backdrop or a
// close icon - since the full token is never retrievable again after this.
const RevealTokenModal = ({ result, onClose }: RevealTokenModalProps) => (
  <Modal
    opened={!!result}
    onClose={() => {}}
    closeOnClickOutside={false}
    closeOnEscape={false}
    withCloseButton={false}
    title="API 金鑰已建立"
    centered
  >
    <Stack>
      <Alert color="yellow">
        請立即複製這組金鑰，關閉此視窗後將無法再次查看完整內容
        （之後只會顯示 {result?.keyPrefix}... 這樣的前綴）。
      </Alert>
      <Group wrap="nowrap">
        <TextInput
          readOnly flex={1} value={result?.token ?? ''}
          styles={{ input: { fontFamily: 'monospace' } }}
        />
        <CopyButton value={result?.token ?? ''}>
          {({ copied, copy }) => (
            <Button
              onClick={copy}
              color={copied ? 'teal' : 'blue'}
              leftSection={copied ? <CheckIcon /> : <CopyIcon />}
            >
              {copied ? '已複製' : '複製'}
            </Button>
          )}
        </CopyButton>
      </Group>
      <Group justify="flex-end">
        <Button onClick={onClose}>我已複製，關閉</Button>
      </Group>
    </Stack>
  </Modal>
)

const DashboardApiKeysContent = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const { data: apiKeys, loading, error, refetch } = useAdminApiKeys(userId)
  const { mutate: createKey, loading: creating } = useCreateAdminApiKey()
  const { mutate: revokeKey } = useRevokeAdminApiKey()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [scopes, setScopes] = useState<ApiKeyScope[]>([])
  const [expiresAt, setExpiresAt] = useState('')
  const [formError, setFormError] = useState<string>()
  const [revealResult, setRevealResult] = useState<CreateApiKeyResult>()

  const resetForm = () => {
    setName('')
    setDescription('')
    setScopes([])
    setExpiresAt('')
  }

  const handleCreate = async() => {
    setFormError(undefined)
    if (!userId) return
    if (!name.trim()) { setFormError('請輸入名稱'); return }
    if (scopes.length === 0) { setFormError('請至少選擇一個權限範圍'); return }

    try {
      const result = await createKey(userId, {
        name: name.trim(),
        description: description.trim() || undefined,
        scopes,
        expiresAt: expiresAt || undefined,
      })
      setRevealResult(result)
      resetForm()
      refetch()
    } catch(err) {
      setFormError(getErrorMessage(err))
    }
  }

  const handleRevoke = async(apiKeyId: string) => {
    if (!userId) return
    await revokeKey(userId, apiKeyId)
    refetch()
  }

  return <>
    <Title order={2} mb="md">API 金鑰管理</Title>

    <UserPicker
      userId={userId} onChange={setUserId}
      label="選擇使用者" placeholder="請選擇使用者"
    />

    {userId && <>
      {error && <Alert color="red" mt="md">無法載入 API 金鑰列表。</Alert>}

      <Table striped highlightOnHover mt="md">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>名稱</Table.Th>
            <Table.Th>權限範圍</Table.Th>
            <Table.Th>金鑰前綴</Table.Th>
            <Table.Th>狀態</Table.Th>
            <Table.Th>上次使用</Table.Th>
            <Table.Th>到期時間</Table.Th>
            <Table.Th>建立時間</Table.Th>
            <Table.Th>操作</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!loading && apiKeys?.length === 0 && <Table.Tr>
            <Table.Td colSpan={8}>
              <Text size="sm" c="dimmed">此使用者尚未建立任何 API 金鑰。</Text>
            </Table.Td>
          </Table.Tr>}
          {!loading && apiKeys?.map(key => <Table.Tr key={key.id}>
            <Table.Td>
              <Text size="sm">{key.name}</Text>
              {key.description && <Text size="xs" c="dimmed">{key.description}</Text>}
            </Table.Td>
            <Table.Td>
              <Group gap={4}>
                {key.scopes.map(scope => (
                  <Badge key={scope} variant="outline" size="sm">{scope}</Badge>
                ))}
              </Group>
            </Table.Td>
            <Table.Td><Text size="sm" ff="monospace">{key.keyPrefix}...</Text></Table.Td>
            <Table.Td><ApiKeyStatusBadge apiKey={key} /></Table.Td>
            <Table.Td>
              <Text size="sm">
                {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : '尚未使用'}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm">
                {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : '永不過期'}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{new Date(key.createdAt).toLocaleDateString()}</Text>
            </Table.Td>
            <Table.Td>
              {!key.revokedAt && <ConfirmDeleteButton
                onConfirm={() => handleRevoke(key.id)}
                title="確認撤銷"
                confirmLabel="撤銷"
                message="確定要撤銷此 API 金鑰嗎？此操作無法復原，撤銷後該金鑰將立即失效。"
              >
                <Button size="xs" variant="outline" color="red">撤銷</Button>
              </ConfirmDeleteButton>}
            </Table.Td>
          </Table.Tr>)}
        </Table.Tbody>
      </Table>

      <Title order={3} mt="xl" mb="md">建立新的 API 金鑰</Title>
      <Stack maw={480}>
        {formError && <Alert color="red">{formError}</Alert>}
        <TextInput
          label="名稱" placeholder="例如：Discord Bot"
          value={name} onChange={e => setName(e.currentTarget.value)}
        />
        <TextInput
          label="說明（選填）"
          value={description} onChange={e => setDescription(e.currentTarget.value)}
        />
        <Checkbox.Group
          label="權限範圍"
          value={scopes}
          onChange={value => setScopes(value as ApiKeyScope[])}
        >
          <Stack gap="xs" mt="xs">
            {(Object.keys(SCOPE_LABEL) as ApiKeyScope[]).map(scope => (
              <Checkbox key={scope} value={scope} label={SCOPE_LABEL[scope]} />
            ))}
          </Stack>
        </Checkbox.Group>
        <TextInput
          label="到期時間（選填）" type="date"
          value={expiresAt} onChange={e => setExpiresAt(e.currentTarget.value)}
        />
        <Group justify="flex-end">
          <Button onClick={handleCreate} loading={creating}>建立</Button>
        </Group>
      </Stack>
    </>}

    <RevealTokenModal result={revealResult} onClose={() => setRevealResult(undefined)} />
  </>
}

const DashboardApiKeys = () => <AdminOnly><DashboardApiKeysContent /></AdminOnly>

export default DashboardApiKeys
