import { Alert, Button, Group, Pagination, Table, Title } from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ConfirmDeleteButton from '@/components/ConfirmDeleteButton'
import WorkVerifyStatusBadge from '@/components/dashboard/WorkVerifyStatusBadge'
import { useDeleteMeWork, useMeWorks } from '@/hooks/useWorks'

const DashboardMeWorks = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const per = 20

  const { data, loading, error, refetch } = useMeWorks({ page, per })
  const totalPages = data ? Math.ceil(data.total / per) : 0

  const { mutate: deleteWork } = useDeleteMeWork()

  return <>
    <Group justify="space-between" mb="md">
      <Title order={2}>我的作品</Title>
      <Button onClick={() => navigate('/dashboard/me/works/new')}>新增作品</Button>
    </Group>

    {error && <Alert color="red" mb="md">無法載入作品列表。</Alert>}

    {!loading && data?.works.length === 0 && (
      <Alert mb="md">你尚未新增任何作品。</Alert>
    )}

    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>標題</Table.Th>
          <Table.Th>審核狀態</Table.Th>
          <Table.Th>公開顯示</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {!loading && data?.works.map(work => <Table.Tr key={work.id}>
          <Table.Td
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/dashboard/me/works/${work.id}`)}
          >
            {work.title}
          </Table.Td>
          <Table.Td>
            <WorkVerifyStatusBadge status={work.verifyStatus} variant="light" />
          </Table.Td>
          <Table.Td>{work.show ? '是' : '否'}</Table.Td>
          <Table.Td>
            <ConfirmDeleteButton
              onConfirm={async() => { await deleteWork(work.id); refetch() }}
              message="確定要刪除此作品嗎？此操作無法復原。"
            >
              <Button size="xs" variant="outline" color="red">刪除</Button>
            </ConfirmDeleteButton>
          </Table.Td>
        </Table.Tr>)}
      </Table.Tbody>
    </Table>

    <Group mt="md" justify="center">
      <Pagination value={page} onChange={setPage} total={totalPages} />
    </Group>
  </>
}

export default DashboardMeWorks
