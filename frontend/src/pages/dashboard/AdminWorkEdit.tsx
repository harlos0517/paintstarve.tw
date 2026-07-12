import { useParams } from 'react-router-dom'

import AdminOnly from '@/components/dashboard/AdminOnly'
import WorkEditor from '@/components/dashboard/WorkEditor'

const DashboardAdminWorkEdit = () => {
  const { workId } = useParams<{ workId: string }>()

  return <AdminOnly>
    {workId && <WorkEditor workId={workId} mode="admin" />}
  </AdminOnly>
}

export default DashboardAdminWorkEdit
