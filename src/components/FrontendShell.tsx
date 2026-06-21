import { AppShell, Box, Container } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Drawer from './Drawer'
import NavTabs from './NavTabs'

export default function FrontendShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure()

  return (
    <AppShell
      header={{ height: 80, offset: true }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="0"
      withBorder={false}
      styles={{
        header: { backgroundColor: 'transparent' },
        navbar: { backgroundColor: '#362f36', opacity: 0.95, overflow: 'auto' },
      }}
    >
      <AppShell.Header zIndex={1000}>
        <NavTabs opened={opened} toggle={toggle} close={close} />
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Drawer opened={opened} toggle={toggle} />
      </AppShell.Navbar>

      <AppShell.Main
        style={{ overflow: 'auto' }}
        pos="relative"
        h="100lvh"
      >
        <Box pt="md" pb="60px">
          <Container>
            {children}
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}
