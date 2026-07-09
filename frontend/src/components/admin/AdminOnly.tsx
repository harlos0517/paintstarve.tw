import { Alert } from '@mantine/core'

import { authClient } from '@/lib/auth-client'

const AdminOnly = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = authClient.useSession()

  if (session?.user.role !== 'ADMIN') {
    return <Alert color="red" title="權限不足">
      此頁面僅限管理員使用。
    </Alert>
  }

  return children
}

export default AdminOnly
