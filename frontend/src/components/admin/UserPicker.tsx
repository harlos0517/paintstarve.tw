import { Group, Select, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'

import { CharacterOwner } from '@/api/characters'
import { listAdminUsers } from '@/api/users'
import { CheckIcon } from '@phosphor-icons/react'

interface UserPickerProps {
  currentUser?: CharacterOwner | null
  userId?: string | null
  onChange: (userId: string) => void
  disabled?: boolean
}

// Type-to-search combobox over admin users, backed by the paginated/name-
// searchable admin user list. The currently-assigned user's name/email come
// from the character's own embedded relation (currentUser), not a separate
// lookup - so this never has to call the admin user API when disabled (e.g.
// on a non-admin's own character page, where it's shown but not editable).
const UserPicker = ({
  userId,
  currentUser,
  disabled,
  onChange,
}: UserPickerProps) => {
  const [options, setOptions] = useState<{ value: string, label: string }[]>([])
  const [userMap, setUserMap] = useState<Record<string, CharacterOwner>>({})

  const [search, setSearch] = useState(currentUser?.name || '')
  const [email, setEmail] = useState(currentUser?.email || '')


  useEffect(() => {
    if (disabled) return
    let cancelled = false
    listAdminUsers({ name: search || undefined, per: 10 }).then(result => {
      if (cancelled) return
      setOptions(result.users.map(u => ({ value: u.id, label: u.name })))
      setUserMap(result.users.reduce((acc, u) => {
        acc[u.id] = u
        return acc
      }, {} as Record<string, CharacterOwner>))
    })
    return () => { cancelled = true }
  }, [search, disabled, currentUser])

  return <Group>
    <Select
      flex={1}
      label="所屬使用者"
      disabled={disabled}
      searchable
      value={userId}
      data={options}
      renderOption={({ option, checked }) => {
        const user = userMap[option.value]
        return <>
          {checked && <CheckIcon />}
          {`${user?.name} (${user?.email})`}
        </>
      }}
      searchValue={search}
      onChange={v => {
        if (!v) return
        onChange(v)
        const selected = options.find(o => o.value === v)
        if (selected) {
          setSearch(userMap[v]?.name || '')
          setEmail(userMap[v]?.email || '')
        }
      }}
      onSearchChange={setSearch}
      nothingFoundMessage="找不到符合的使用者"
    />
    <TextInput flex={1} label="所屬使用者 Email" value={email} disabled />
  </Group>
}

export default UserPicker
