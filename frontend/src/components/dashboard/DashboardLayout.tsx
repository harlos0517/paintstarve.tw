import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Space,
  Stack,
  Tabs,
  Text,
} from '@mantine/core'
import { GoogleLogoIcon } from '@phosphor-icons/react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import CharacterClaimPicker from '@/components/dashboard/CharacterClaimPicker'
import { authClient } from '@/lib/auth-client'

const Login = () => <Container size="xs" pt="xl">
  <Stack align="center">
    <Text>請先登入以繼續。</Text>
    <Button
      leftSection={<GoogleLogoIcon size={16} />}
      onClick={() => authClient.signIn.social({
        provider: 'google',
        callbackURL: window.location.href,
      })}
    >
      使用 Google 登入
    </Button>
  </Stack>
</Container>

const VerifyStatusAlert = ({ status }: { status: 'PENDING' | 'REJECTED' }) => {
  const message = status === 'REJECTED'
    ? '您的帳號申請已被拒絕，請聯繫管理員。'
    : '您的帳號正在等待管理員審核，請稍後再試。你可以先提出角色認領申請，帳號審核通過後會自動連結。'

  return <Container size="xs" pt="xl">
    <Stack align="center">
      <Alert color={status === 'REJECTED' ? 'red' : 'yellow'} title="帳號尚未啟用">
        {message}
      </Alert>
      <Button variant="default" onClick={() => authClient.signOut()}>登出</Button>
      {status === 'PENDING' && <CharacterClaimPicker />}
    </Stack>
  </Container>
}

const NavTabs = ({ isAdmin }: { isAdmin: boolean }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const userTabs = [
    { key: 'me', label: '我的資料', path: '/dashboard/me' },
    { key: 'me-characters', label: '我的角色', path: '/dashboard/me/characters', priority: 2 },
  ]

  const adminTabs = [
    { key: 'characters', label: '角色管理', path: '/dashboard/characters', priority: 3 },
    {
      key: 'characters-import-export',
      label: '角色匯入匯出',
      path: '/dashboard/characters/import-export',
      priority: 1,
    },
    { key: 'users', label: '使用者管理', path: '/dashboard/users' },
    { key: 'character-claims', label: '角色認領申請', path: '/dashboard/character-claims' },
  ]

  const tabs = isAdmin ? [...userTabs, ...adminTabs] : userTabs
  const tabsByPriority = [...tabs].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100))
  const currentKey = tabsByPriority.find(tab => pathname.startsWith(tab.path))?.key

  return <Group justify="space-between" mb="md">
    <Tabs
      value={currentKey}
      onChange={value => navigate(tabs.find(tab => tab.key === value)?.path ?? '/dashboard/me')}
    >
      <Tabs.List>
        {tabs.map(tab => <Tabs.Tab key={tab.key} value={tab.key}>{tab.label}</Tabs.Tab>)}
      </Tabs.List>
    </Tabs>
    <Space flex="1" />
    <Button variant="default" onClick={() => authClient.signOut()}>登出</Button>
    <NavLink to="/"><Button variant="default">回首頁</Button></NavLink>
  </Group>
}

const DashboardLayout = () => {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <Center h="50vh"><Loader /></Center>

  if (!session) return <Login />

  if (session.user.verifyStatus !== 'VERIFIED')
    return <VerifyStatusAlert status={session.user.verifyStatus} />

  return <Container p="xl" size="1100px">
    <NavTabs isAdmin={session.user.role === 'ADMIN'} />
    <Outlet />
  </Container>
}

export default DashboardLayout
