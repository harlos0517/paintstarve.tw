import {
  Alert,
  Box,
  Button,
  Center,
  Checkbox,
  Collapse,
  Container,
  Group,
  Loader,
  Pagination,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'

import { CharacterRole } from '@/api/characters'
import ParticipantListCard from '@/components/ParticipantListCard'
import { usePublicCharacterList } from '@/hooks/useCharacters'

const Students = () => {
  const [filterExpanded, { toggle: toggleFilter }] = useDisclosure(false)

  const [name, setName] = useState('')
  const [role, setRole] = useState<CharacterRole | null>(null)
  const [year, setYear] = useState<number | null>(null)
  const [studentClass, setStudentClass] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)
  const [page, setPage] = useState(1)
  const [per, setPer] = useState(18)

  const resetPage = () => setPage(1)

  const filters = {
    name: name || undefined,
    role: role ?? undefined,
    year: year ?? undefined,
    class: studentClass ?? undefined,
    verified: verified || undefined,
    page,
    per,
  }
  const { data, loading, error } = usePublicCharacterList(filters)
  const totalPages = data ? Math.ceil(data.total / per) : 0

  return <Container p="md" size="1440px">
    <Stack>
      <Group justify="space-between" w="100%" mb={5} >
        <Title order={2}>學生檔案</Title>
        <Button onClick={toggleFilter}>篩選</Button>
      </Group>
      <Collapse expanded={filterExpanded}>
        <Group wrap="nowrap">
          <TextInput
            flex="1"
            label="姓名"
            value={name}
            onChange={event => { setName(event.currentTarget.value); resetPage() }}
          />
          <Select
            flex="1"
            label="角色"
            clearable
            value={role}
            onChange={v => { setRole(v as CharacterRole | null); resetPage() }}
            data={[
              { value: 'STUDENT', label: '學生' },
              { value: 'STAFF', label: '教職員' },
            ]}
          />
          <Select
            flex="1"
            label="年級"
            clearable
            value={year}
            onChange={v => { setYear(v === null ? null : Number(v)); resetPage() }}
            data={[
              { value: 1, label: '一年級' },
              { value: 2, label: '二年級' },
              { value: 3, label: '三年級' },
            ]}
          />
          <Select
            flex="1"
            label="班級"
            clearable
            value={studentClass}
            onChange={v => { setStudentClass(v); resetPage() }}
            data={['A', 'B', 'C', 'D', 'E', 'F', 'G']}
          />
          <Checkbox
            label="已認證"
            checked={verified}
            onChange={event => { setVerified(event.currentTarget.checked); resetPage() }}
            pt="1.5rem"
          />
        </Group>
      </Collapse>

      {Boolean(error) && <Alert color="red">無法載入學生資料。</Alert>}

      <Group align="end" justify="space-between" w="100%">
        <Pagination value={page} onChange={setPage} total={totalPages} />
        <Box></Box>
        <Select
          label="每頁顯示"
          value={per}
          onChange={v => { setPer(v ? Number(v) : 12); resetPage() }}
          data={[
            { value: 5, label: '5' },
            { value: 12, label: '12' },
            { value: 18, label: '18' },
            { value: 24, label: '24' },
            { value: 48, label: '48' },
          ]}
        />
      </Group>

      {loading
        ? <Center h="30vh"><Loader /></Center>
        : <SimpleGrid cols={{ xs: 1, sm: 2, lg: 3 }} spacing="md">
          {data?.characters.map(student => (
            <ParticipantListCard key={student.seatId} {...student} />
          ))}
        </SimpleGrid>}

      <Pagination value={page} onChange={setPage} total={totalPages} />
    </Stack>
  </Container>
}

export default Students
