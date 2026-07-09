import { navlinks } from '@/lib/navlinks'
import { Tabs } from '@mantine/core'
import React, { memo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './Drawer.module.sass'

type DrawerProps = {
  opened?: boolean
  toggle?: () => void
}

const Drawer: React.FC<DrawerProps> = ({ toggle }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const currentRoute = navlinks.find(link => pathname === link.path)

  return <Tabs
    className={styles['drawer']}
    value={currentRoute?.key}
    onChange={value => {
      toggle?.()
      navigate(navlinks.find(link => link.key === value)?.path ?? '/')
    }}
    orientation="vertical"
    px="md"
  >
    <Tabs.List
      display="flex"
      style={{ alignItems: 'center' }}
      w="100%"
    >
      {navlinks.filter(link => link.path !== '/').map(link =>
        <Tabs.Tab key={link.key} value={link.key} w="100%" p="md" my="xs">
          {link.name}
        </Tabs.Tab>,
      )}
    </Tabs.List>
  </Tabs>
}

export default memo(Drawer)
