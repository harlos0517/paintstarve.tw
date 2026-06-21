import { routes } from '@/lib/routes'
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
  const currentRoute = routes.find(route => pathname === route.path)

  return <Tabs
    className={styles['drawer']}
    value={currentRoute?.key}
    onChange={value => {
      toggle?.()
      navigate(routes.find(r => r.key === value)?.path ?? '/')
    }}
    orientation="vertical"
    px="md"
  >
    <Tabs.List
      display="flex"
      style={{ alignItems: 'center' }}
      w="100%"
    >
      {routes.filter(r => r.path !== '/').map(route =>
        <Tabs.Tab key={route.key} value={route.key} w="100%" p="md" my="xs">
          {route.name}
        </Tabs.Tab>,
      )}
    </Tabs.List>
  </Tabs>
}

export default memo(Drawer)
