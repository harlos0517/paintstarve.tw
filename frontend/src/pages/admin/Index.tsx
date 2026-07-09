import { Button, Group, Text } from '@mantine/core'
import { GoogleLogoIcon } from '@phosphor-icons/react'

import { authClient } from '@/lib/auth-client'

const AdminIndex = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return null

  if (session) {
    return <Group>
      <Text>已登入：{session.user.email}</Text>
      <Button variant="default" onClick={() => authClient.signOut()}>登出</Button>
    </Group>
  }

  return <Button
    leftSection={<GoogleLogoIcon size={16} />}
    onClick={() => authClient.signIn.social({
      provider: 'google',
      callbackURL: window.location.href,
    })}
  >
    使用 Google 登入
  </Button>
}

export default AdminIndex
