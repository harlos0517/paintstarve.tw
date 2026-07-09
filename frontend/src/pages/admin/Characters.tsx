import { Alert, Badge, Button, Group, Select, Table, Text, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CharacterRole } from '@/api/characters'
import AdminOnly from '@/components/admin/AdminOnly'
import { useAdminCharacterList } from '@/hooks/useCharacters'

const AdminCharactersContent = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [role, setRole] = useState<CharacterRole | null>(null)
  const [verified, setVerified] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const per = 20

  const filters = {
    name: name || undefined,
    role: role ?? undefined,
    verified: verified === null ? undefined : verified === 'true',
    page,
    per,
  }
  const { data: characters, loading, error } = useAdminCharacterList(filters)

  return <>
    <Title order={2} mb="md">角色管理</Title>
    <Group mb="md">
      <TextInput
        label="姓名" value={name}
        onChange={e => { setName(e.currentTarget.value); setPage(1) }}
      />
      <Select
        label="身份" clearable value={role}
        data={[{ value: 'STUDENT', label: '學生' }, { value: 'STAFF', label: '教職員' }]}
        onChange={value => { setRole(value as CharacterRole | null); setPage(1) }}
      />
      <Select
        label="認證狀態" clearable value={verified}
        data={[{ value: 'true', label: '已認證' }, { value: 'false', label: '未認證' }]}
        onChange={value => { setVerified(value); setPage(1) }}
      />
    </Group>

    {error && <Alert color="red" mb="md">無法載入角色列表。</Alert>}

    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>姓名</Table.Th>
          <Table.Th>英文名</Table.Th>
          <Table.Th>身份</Table.Th>
          <Table.Th>梯次</Table.Th>
          <Table.Th>班級</Table.Th>
          <Table.Th>認證狀態</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {!loading && characters?.map(character => <Table.Tr
          key={character.id}
          onClick={() => navigate(`/admin/characters/${character.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <Table.Td>{character.name}</Table.Td>
          <Table.Td>{character.nameEn}</Table.Td>
          <Table.Td>{character.role === 'STUDENT' ? '學生' : '教職員'}</Table.Td>
          <Table.Td>{character.season}</Table.Td>
          <Table.Td>
            {character.year ? `${character.year}年${character.class ?? ''}班` : character.class}
          </Table.Td>
          <Table.Td>
            <Badge color={character.verified ? 'green' : 'gray'} variant="light">
              {character.verified ? '已認證' : '未認證'}
            </Badge>
          </Table.Td>
        </Table.Tr>)}
      </Table.Tbody>
    </Table>

    <Group mt="md" justify="center">
      <Button variant="default" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
        上一頁
      </Button>
      <Text size="sm">第 {page} 頁</Text>
      <Button
        variant="default"
        disabled={!characters || characters.length < per}
        onClick={() => setPage(p => p + 1)}
      >
        下一頁
      </Button>
    </Group>
  </>
}

const AdminCharacters = () => <AdminOnly><AdminCharactersContent /></AdminOnly>

export default AdminCharacters
