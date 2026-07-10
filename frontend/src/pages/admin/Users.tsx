import {
  Alert, Badge, Button, Group, Pagination, Select, Table, TextInput, Title,
} from '@mantine/core'
import { useState } from 'react'

import { getErrorMessage } from '@/api/backendClient'
import { UserRole, UserVerifyStatus } from '@/api/users'
import AdminOnly from '@/components/admin/AdminOnly'
import { useAdjustUserRole, useAdminUserList, useApproveUser } from '@/hooks/useUsers'

const VERIFY_STATUS_LABEL: Record<UserVerifyStatus, string> = {
  PENDING: '審核中', VERIFIED: '已認證', REJECTED: '已拒絕',
}
const VERIFY_STATUS_COLOR: Record<UserVerifyStatus, string> = {
  PENDING: 'yellow', VERIFIED: 'green', REJECTED: 'red',
}

const AdminUsersContent = () => {
  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole | null>(null)
  const [verifyStatus, setVerifyStatus] = useState<UserVerifyStatus | null>(null)
  const [page, setPage] = useState(1)
  const per = 20

  const filters = {
    name: name || undefined,
    role: role ?? undefined,
    verifyStatus: verifyStatus ?? undefined,
    page,
    per,
  }
  const { data, loading, error, refetch } = useAdminUserList(filters)
  const totalPages = data ? Math.ceil(data.total / per) : 0
  const { mutate: approve } = useApproveUser()
  const { mutate: adjustRole } = useAdjustUserRole()
  const [rowError, setRowError] = useState<string>()

  const handleApproval = async(userId: string, action: 'APPROVE' | 'REJECT') => {
    setRowError(undefined)
    try {
      await approve(userId, action)
      refetch()
    } catch(err) {
      setRowError(getErrorMessage(err))
    }
  }

  const handleRoleChange = async(userId: string, newRole: UserRole) => {
    setRowError(undefined)
    try {
      await adjustRole(userId, newRole)
      refetch()
    } catch(err) {
      setRowError(getErrorMessage(err))
    }
  }

  return <>
    <Title order={2} mb="md">使用者管理</Title>
    <Group mb="md">
      <TextInput
        label="姓名" value={name}
        onChange={e => { setName(e.currentTarget.value); setPage(1) }}
      />
      <Select
        label="身份" clearable value={role}
        data={[{ value: 'USER', label: '一般使用者' }, { value: 'ADMIN', label: '管理員' }]}
        onChange={value => { setRole(value as UserRole | null); setPage(1) }}
      />
      <Select
        label="審核狀態" clearable value={verifyStatus}
        data={[
          { value: 'PENDING', label: '審核中' },
          { value: 'VERIFIED', label: '已認證' },
          { value: 'REJECTED', label: '已拒絕' },
        ]}
        onChange={value => { setVerifyStatus(value as UserVerifyStatus | null); setPage(1) }}
      />
    </Group>

    {error && <Alert color="red" mb="md">無法載入使用者列表。</Alert>}
    {rowError && <Alert color="red" mb="md">{rowError}</Alert>}

    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>姓名</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>審核狀態</Table.Th>
          <Table.Th>審核</Table.Th>
          <Table.Th>身份</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {!loading && data?.users.map(user => <Table.Tr key={user.id}>
          <Table.Td>{user.name}</Table.Td>
          <Table.Td>{user.email}</Table.Td>
          <Table.Td>
            <Badge color={VERIFY_STATUS_COLOR[user.verifyStatus]} variant="light">
              {VERIFY_STATUS_LABEL[user.verifyStatus]}
            </Badge>
          </Table.Td>
          <Table.Td>
            <Group gap="xs">
              <Button
                size="xs" variant="light" color="green"
                disabled={user.verifyStatus === 'VERIFIED'}
                onClick={() => handleApproval(user.id, 'APPROVE')}
              >
                核准
              </Button>
              <Button
                size="xs" variant="light" color="red"
                disabled={user.verifyStatus === 'REJECTED'}
                onClick={() => handleApproval(user.id, 'REJECT')}
              >
                拒絕
              </Button>
            </Group>
          </Table.Td>
          <Table.Td>
            <Select
              value={user.role}
              data={[{ value: 'USER', label: '一般使用者' }, { value: 'ADMIN', label: '管理員' }]}
              onChange={value => value && handleRoleChange(user.id, value as UserRole)}
              w="10rem"
            />
          </Table.Td>
        </Table.Tr>)}
      </Table.Tbody>
    </Table>

    <Group mt="md" justify="center">
      <Pagination value={page} onChange={setPage} total={totalPages} />
    </Group>
  </>
}

const AdminUsers = () => <AdminOnly><AdminUsersContent /></AdminOnly>

export default AdminUsers
