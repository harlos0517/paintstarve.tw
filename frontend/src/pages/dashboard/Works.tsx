import {
  Alert, Button, Group, Pagination, Select, Table, TextInput, Title,
} from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { WorkVerifyStatus } from '@/api/works'
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton'
import AdminOnly from '@/components/dashboard/AdminOnly'
import WorkVerifyStatusBadge from '@/components/dashboard/WorkVerifyStatusBadge'
import { useAdminWorks, useDeleteAdminWork, useResolveWorkApproval } from '@/hooks/useWorks'

const DashboardWorksContent = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [verifyStatus, setVerifyStatus] = useState<WorkVerifyStatus | null>(null)
  const [page, setPage] = useState(1)
  const per = 20

  const filters = {
    title: title || undefined,
    verifyStatus: verifyStatus ?? undefined,
    page,
    per,
  }
  const { data, loading, error, refetch } = useAdminWorks(filters)
  const totalPages = data ? Math.ceil(data.total / per) : 0

  const { mutate: resolveApproval } = useResolveWorkApproval()
  const { mutate: deleteWork } = useDeleteAdminWork()

  return <>
    <Title order={2} mb="md">作品管理</Title>
    <Group mb="md">
      <TextInput
        label="標題" value={title}
        onChange={e => { setTitle(e.currentTarget.value); setPage(1) }}
      />
      <Select
        label="審核狀態" clearable value={verifyStatus}
        data={[
          { value: 'PENDING', label: '審核中' },
          { value: 'VERIFIED', label: '已通過' },
          { value: 'REJECTED', label: '已退回' },
        ]}
        onChange={value => { setVerifyStatus(value as WorkVerifyStatus | null); setPage(1) }}
      />
    </Group>

    {error && <Alert color="red" mb="md">無法載入作品列表。</Alert>}

    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>標題</Table.Th>
          <Table.Th>作者</Table.Th>
          <Table.Th>審核狀態</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {!loading && data?.works.map(work => <Table.Tr key={work.id}>
          <Table.Td
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/dashboard/works/${work.id}`)}
          >
            {work.title}
          </Table.Td>
          <Table.Td>{work.author.name}</Table.Td>
          <Table.Td>
            <WorkVerifyStatusBadge status={work.verifyStatus} variant="light" />
          </Table.Td>
          <Table.Td>
            <Group gap={4}>
              {work.verifyStatus !== 'VERIFIED' && (
                <Button
                  size="xs" variant="outline" color="green"
                  onClick={async() => { await resolveApproval(work.id, 'APPROVE'); refetch() }}
                >
                  核准
                </Button>
              )}
              {work.verifyStatus !== 'REJECTED' && (
                <Button
                  size="xs" variant="outline" color="orange"
                  onClick={async() => { await resolveApproval(work.id, 'REJECT'); refetch() }}
                >
                  退回
                </Button>
              )}
              <ConfirmDeleteButton
                onConfirm={async() => { await deleteWork(work.id); refetch() }}
                message="確定要刪除此作品嗎？此操作無法復原。"
              >
                <Button size="xs" variant="outline" color="red">刪除</Button>
              </ConfirmDeleteButton>
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

const DashboardWorks = () => <AdminOnly><DashboardWorksContent /></AdminOnly>

export default DashboardWorks
