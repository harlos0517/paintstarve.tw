import { Alert, Badge, Button, Group, Pagination, Select, Table, Title } from '@mantine/core'
import { useState } from 'react'

import { getErrorMessage } from '@/api/backendClient'
import { CharacterClaimStatus } from '@/api/characterClaims'
import AdminOnly from '@/components/dashboard/AdminOnly'
import {
  useAdminCharacterClaimList,
  useAdminResolveCharacterClaim,
} from '@/hooks/useCharacterClaims'

const STATUS_LABEL: Record<CharacterClaimStatus, string> = {
  PENDING: '審核中', APPROVED: '已核准', REJECTED: '已拒絕',
}
const STATUS_COLOR: Record<CharacterClaimStatus, string> = {
  PENDING: 'yellow', APPROVED: 'green', REJECTED: 'red',
}

const DashboardCharacterClaimsContent = () => {
  const [status, setStatus] = useState<CharacterClaimStatus | null>('PENDING')
  const [page, setPage] = useState(1)
  const per = 20

  const filters = { status: status ?? undefined, page, per }
  const { data, loading, error, refetch } = useAdminCharacterClaimList(filters)
  const totalPages = data ? Math.ceil(data.total / per) : 0
  const { mutate: resolve } = useAdminResolveCharacterClaim()
  const [rowError, setRowError] = useState<string>()
  const [resolvingId, setResolvingId] = useState<string>()

  const handleResolve = async(claimId: string, action: 'APPROVE' | 'REJECT') => {
    setRowError(undefined)
    setResolvingId(claimId)
    try {
      await resolve(claimId, action)
      refetch()
    } catch(err) {
      setRowError(getErrorMessage(err))
    } finally {
      setResolvingId(undefined)
    }
  }

  return <>
    <Title order={2} mb="md">角色認領申請</Title>
    <Group mb="md">
      <Select
        label="狀態" clearable value={status}
        data={[
          { value: 'PENDING', label: '審核中' },
          { value: 'APPROVED', label: '已核准' },
          { value: 'REJECTED', label: '已拒絕' },
        ]}
        onChange={value => { setStatus(value as CharacterClaimStatus | null); setPage(1) }}
      />
    </Group>

    {error && <Alert color="red" mb="md">無法載入認領申請列表。</Alert>}
    {rowError && <Alert color="red" mb="md">{rowError}</Alert>}

    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>申請人</Table.Th>
          <Table.Th>角色</Table.Th>
          <Table.Th>狀態</Table.Th>
          <Table.Th>審核</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {!loading && data?.claims.map(claim => <Table.Tr key={claim.id}>
          <Table.Td>{claim.user.name}（{claim.user.email}）</Table.Td>
          <Table.Td>
            {claim.character.name}
          </Table.Td>
          <Table.Td>
            <Badge color={STATUS_COLOR[claim.status]} variant="light">
              {STATUS_LABEL[claim.status]}
            </Badge>
          </Table.Td>
          <Table.Td>
            <Group gap="xs">
              <Button
                size="xs" variant="light" color="green"
                disabled={claim.status !== 'PENDING'}
                loading={resolvingId === claim.id}
                onClick={() => handleResolve(claim.id, 'APPROVE')}
              >
                核准
              </Button>
              <Button
                size="xs" variant="light" color="red"
                disabled={claim.status !== 'PENDING'}
                loading={resolvingId === claim.id}
                onClick={() => handleResolve(claim.id, 'REJECT')}
              >
                拒絕
              </Button>
            </Group>
          </Table.Td>
        </Table.Tr>)}
      </Table.Tbody>
    </Table>

    <Group mt="md" justify="center">
      <Pagination value={page} onChange={setPage} total={totalPages} />
    </Group>
  </>
}

const DashboardCharacterClaims = () => <AdminOnly><DashboardCharacterClaimsContent /></AdminOnly>

export default DashboardCharacterClaims
