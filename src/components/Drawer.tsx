'use client'

import { Tabs } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'
import React, { memo } from 'react'
import { routes } from '@/lib/routes'

import styles from './Drawer.module.sass'

type DrawerProps = {
  opened?: boolean
  toggle?: () => void
}

const Drawer: React.FC<DrawerProps> = ({ toggle }) => {
  const router = useRouter()
  const currentPath = usePathname()
  const currentRoute = routes.find(route => currentPath === route.path)

  return <Tabs
    className={styles['drawer']}
    value={currentRoute?.key}
    onChange={value => {
      toggle?.()
      router.push(routes.find(r => r.key === value)?.path ?? '/')
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
