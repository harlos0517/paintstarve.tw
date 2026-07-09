import { Affix, AppShell, Box, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { InfoIcon } from '@phosphor-icons/react'

import Drawer from './Drawer'
import NavTabs from './NavTabs'

export default function FrontendShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure()

  return <>
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
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
    <Affix position={{ bottom: 20, right: 20 }}>
      <Button leftSection={<InfoIcon size={16} />}
        component="a"
        href="https://forms.gle/Tbuqq6wi9Bcuj1Q3A"
        target="_blank"
        rel="noopener noreferrer"
      >
        回報資料錯誤缺失
      </Button>
    </Affix>
  </>
}
