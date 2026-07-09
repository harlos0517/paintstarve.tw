import { Burger, Center, Group, Image, Overlay, Space, Tabs, Title } from '@mantine/core'
import React, { memo } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { navlinks } from '@/lib/navlinks'

import styles from './NavTabs.module.sass'

import Logo from '@/assets/images/school_logo.png'

type NavTabsProps = {
  opened?: boolean
  toggle?: () => void
  close?: () => void
}

const NavTabs: React.FC<NavTabsProps> = ({ opened, toggle, close }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const currentRoute = navlinks.find(link => pathname === link.path)

  return <Tabs
    className={styles['nav-tabs']}
    value={currentRoute?.key}
    onChange={value => navigate(navlinks.find(link => link.key === value)?.path ?? '/')}
    h="100%"
    pos="sticky"
    top={0}
    style={{ zIndex: 1000, transition: 'opacity 0.2s ease-in-out' }}
    opacity={1}
  >
    <Overlay
      color="#362f36"
      backgroundOpacity={opened ? 0.95 : 0.5}
      style={{ transition: 'background-color 0.2s ease-in-out' }}
      pos="relative"
      blur={10}
      h="100%"
    >
      <Center h="100%" px="xl" py="lg">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" p={0} flex={1} />
        <NavLink to="/" onClick={close}>
          <Group gap="sm">
            <Image src={Logo} alt="繪俄史高等藝術學院" w="60px" />
            <Title order={2} px="lg">
              繪俄史高等藝術學院
            </Title>
          </Group>
        </NavLink>
        <Space flex="1 0 0" />
        <Tabs.List
          display="flex"
          visibleFrom="sm"
          style={{ alignItems: 'center' }}
        >
          {navlinks.filter(link => link.path !== '/').map(link =>
            <Tabs.Tab key={link.key} value={link.key}>
              {link.name}
            </Tabs.Tab>,
          )}
        </Tabs.List>
      </Center>
    </Overlay>
  </Tabs>
}

export default memo(NavTabs)
