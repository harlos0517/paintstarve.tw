import {
  Button, Checkbox, Grid, Group, NumberInput, Select, Stack, Text, TextInput, Textarea,
} from '@mantine/core'
import { useState } from 'react'

import { AdminCharacterUpdateInput, Character, MeCharacterUpdateInput } from '@/api/characters'

interface CharacterFormProps {
  character: Character
  mode: 'me' | 'admin'
  saving: boolean
  onSubmit: (input: MeCharacterUpdateInput | AdminCharacterUpdateInput) => void
}

const splitBirthday = (birthday: string | null) => {
  if (!birthday) return { month: '' as number | '', day: '' as number | '' }
  const [month, day] = birthday.split('-').map(Number)
  return { month, day }
}

const CharacterForm = ({ character, mode, saving, onSubmit }: CharacterFormProps) => {
  const isAdmin = mode === 'admin'
  const isStudent = character.role === 'STUDENT'

  const [nameEn, setNameEn] = useState(character.nameEn ?? '')
  const [title, setTitle] = useState(character.title ?? '')
  const [unit, setUnit] = useState(character.unit ?? '')
  const [race, setRace] = useState(character.race ?? '')
  const [major, setMajor] = useState(character.major ?? '')
  const [description, setDescription] = useState(character.description ?? '')
  const [twitter, setTwitter] = useState(character.twitter ?? '')
  const [birthday, setBirthday] = useState(splitBirthday(character.birthday))

  const [name, setName] = useState(character.name)
  const [season, setSeason] = useState(character.season)
  const [seatId, setSeatId] = useState(character.seatId)
  const [role, setRole] = useState<Character['role']>(character.role)
  const [year, setYear] = useState<number | ''>(character.year ?? '')
  const [studentClass, setStudentClass] = useState(character.class ?? '')
  const [seatRow, setSeatRow] = useState<number | ''>(character.seatRow ?? '')
  const [seatColumn, setSeatColumn] = useState<number | ''>(character.seatColumn ?? '')
  const [cardId, setCardId] = useState(character.cardId ?? '')
  const [verified, setVerified] = useState(character.verified)
  const [userId, setUserId] = useState(character.userId)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const birthdayValue = birthday.month !== '' && birthday.day !== ''
      ? `${String(birthday.month).padStart(2, '0')}-${String(birthday.day).padStart(2, '0')}`
      : null

    const base: MeCharacterUpdateInput = {
      nameEn: nameEn || null,
      title: title || null,
      unit: unit || null,
      race: race || null,
      major: major || null,
      birthday: birthdayValue,
      description: description || null,
      twitter: twitter || null,
    }

    if (!isAdmin) {
      onSubmit(base)
      return
    }

    const adminInput: AdminCharacterUpdateInput = {
      ...base,
      name,
      season,
      seatId,
      role,
      year: year === '' ? null : year,
      class: studentClass || null,
      seatRow: seatRow === '' ? null : seatRow,
      seatColumn: seatColumn === '' ? null : seatColumn,
      cardId: cardId || null,
      verified,
      userId,
    }
    onSubmit(adminInput)
  }

  return <form onSubmit={handleSubmit}>
    <Stack>
      <Text fw={700}>基本資料{!isAdmin && '（唯讀，如有錯誤請聯繫管理員）'}</Text>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="名字" value={name} disabled={!isAdmin} required
            onChange={e => setName(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="英文名/別名" value={nameEn}
            onChange={e => setNameEn(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="梯次" value={season} disabled={!isAdmin} required
            onChange={e => setSeason(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="座位編號" value={seatId} disabled={!isAdmin} required
            onChange={e => setSeatId(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            label="身份" value={role} disabled={!isAdmin}
            data={[{ value: 'STUDENT', label: '學生' }, { value: 'STAFF', label: '教職員' }]}
            onChange={value => setRole((value as Character['role']) ?? role)}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <NumberInput
            label="年級" value={year} disabled={!isAdmin}
            onChange={v => setYear(v === '' ? '' : Number(v))}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            label="班級" value={studentClass} disabled={!isAdmin}
            onChange={e => setStudentClass(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <NumberInput
            label="排" value={seatRow} disabled={!isAdmin}
            onChange={v => setSeatRow(v === '' ? '' : Number(v))}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <NumberInput
            label="號" value={seatColumn} disabled={!isAdmin}
            onChange={v => setSeatColumn(v === '' ? '' : Number(v))}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label={isStudent ? '學生證編號' : '教職證編號'} value={cardId} disabled={!isAdmin}
            onChange={e => setCardId(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="所屬使用者 ID" value={userId} disabled={!isAdmin}
            onChange={e => setUserId(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Checkbox
            mt="1.5rem" label="已認證" checked={verified} disabled={!isAdmin}
            onChange={e => setVerified(e.currentTarget.checked)}
          />
        </Grid.Col>
      </Grid>

      <Text fw={700} mt="md">角色設定</Text>
      <Grid>
        {isStudent ? null : <>
          <Grid.Col span={6}>
            <TextInput label="任職單位" value={unit} onChange={e => setUnit(e.currentTarget.value)} />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="稱號" value={title} onChange={e => setTitle(e.currentTarget.value)} />
          </Grid.Col>
        </>}
        <Grid.Col span={4}>
          <TextInput label="種族" value={race} onChange={e => setRace(e.currentTarget.value)} />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label={isStudent ? '主修' : '主要任教科目'}
            value={major}
            onChange={e => setMajor(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <NumberInput
            label="生日 - 月" min={1} max={12} value={birthday.month}
            onChange={v => setBirthday(prev => ({ ...prev, month: v === '' ? '' : Number(v) }))}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <NumberInput
            label="生日 - 日" min={1} max={31} value={birthday.day}
            onChange={v => setBirthday(prev => ({ ...prev, day: v === '' ? '' : Number(v) }))}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Twitter/X 連結" value={twitter}
            onChange={e => setTwitter(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label="簡介" value={description} minRows={4} autosize
            onChange={e => setDescription(e.currentTarget.value)}
          />
        </Grid.Col>
      </Grid>

      <Group justify="flex-end">
        <Button type="submit" loading={saving}>儲存</Button>
      </Group>
    </Stack>
  </form>
}

export default CharacterForm
