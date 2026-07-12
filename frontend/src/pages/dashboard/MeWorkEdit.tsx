import { useParams } from 'react-router-dom'

import WorkEditor from '@/components/dashboard/WorkEditor'

const DashboardMeWorkEdit = () => {
  const { workId } = useParams<{ workId: string }>()

  return workId && <WorkEditor workId={workId} mode="me" />
}

export default DashboardMeWorkEdit
