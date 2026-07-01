import {
    Box,
    Button,
    Checkbox,
    Collapse,
    Container,
    Group,
    MultiSelect,
    Pagination,
    Select,
    SimpleGrid,
    Stack,
    TextInput,
    Title,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useContext, useState } from 'react'

import GlobalContext from '@/components/GlobalContext'
import ParticipantListCard from '@/components/ParticipantListCard'

const Students = () => {
  const { students: allStudents } = useContext(GlobalContext)

  const [filterExpanded, { toggle: toggleFilter }] = useDisclosure(false)

  const [nameFilter, setNameFilter] = useState('')
  const [yearFilter, setYearFilter] = useState<string[]>([])
  const [classFilter, setClassFilter] = useState<string[]>([])
  const [rowFilter, setRowFilter] = useState<string[]>([])
  const [columnFilter, setColumnFilter] = useState<string[]>([])
  const [raceFilter, setRaceFilter] = useState('')
  const [majorFilter, setMajorFilter] = useState('')
  const [birthdayTodayFilter, setBirthdayFilter] = useState(false)
  const [verifiedFilter, setVerifiedFilter] = useState(false)
  const filteredStudents = allStudents
    .filter(s => s.name && s.name !== '#N/A')
    .filter(s => !nameFilter || s.name.includes(nameFilter) || s.nameEn?.includes(nameFilter))
    .filter(s => !yearFilter.length || yearFilter.includes(s.year.toString()))
    .filter(s => !classFilter.length || classFilter.includes(s.class))
    .filter(s => !rowFilter.length || rowFilter.includes(s.seatRow.toString()))
    .filter(s => !columnFilter.length || columnFilter.includes(s.seatColumn.toString()))
    .filter(s => !raceFilter || s.race?.includes(raceFilter))
    .filter(s => !majorFilter || s.major?.includes(majorFilter))
    .filter(s => {
      const [mm, dd] = (s.birthday?.split('-').map(Number)) || []
      return !birthdayTodayFilter ||
        (mm === new Date().getMonth() + 1 && dd === new Date().getDate())
    })
    .filter(s => !verifiedFilter || s.verified)

  const sortedStudents = [...filteredStudents] // TODO: sorting

  const [pageSize, setPageSize] = useState(18)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(sortedStudents.length / pageSize)
  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * pageSize, currentPage * pageSize,
  )

  return <Container p="md" size="1440px">
    <Stack>
      <Group justify="space-between" w="100%" mb={5} >
        <Title order={2}>學生檔案</Title>
        <Button onClick={toggleFilter}>篩選</Button>
      </Group>
      <Collapse expanded={filterExpanded}>
        <Group>
          <TextInput
            flex="1"
            label="姓名"
            value={nameFilter}
            onChange={event => {
              setNameFilter(event.currentTarget.value)
              setCurrentPage(1)
            }}
          />
          <TextInput
            flex="1"
            label="種族"
            value={raceFilter}
            onChange={event => {
              setRaceFilter(event.currentTarget.value)
              setCurrentPage(1)
            }}
          />
          <TextInput
            flex="1"
            label="主修"
            value={majorFilter}
            onChange={event => {
              setMajorFilter(event.currentTarget.value)
              setCurrentPage(1)
            }}
          />
          <Checkbox
            label="今天生日"
            checked={birthdayTodayFilter}
            onChange={event => {
              setBirthdayFilter(event.currentTarget.checked)
              setCurrentPage(1)
            }}
            pt="1.5rem"
          />
          <Checkbox
            label="已認證"
            checked={verifiedFilter}
            onChange={event => {
              setVerifiedFilter(event.currentTarget.checked)
              setCurrentPage(1)
            }}
            pt="1.5rem"
          />
        </Group>
        <Group wrap="nowrap" mt="sm">
          <MultiSelect
            flex="1"
            label="年級"
            value={yearFilter}
            onChange={v => {
              setYearFilter(v)
              setCurrentPage(1)
            }}
            data={['1', '2', '3']}
          />
          <MultiSelect
            flex="1"
            label="班級"
            value={classFilter}
            onChange={v => {
              setClassFilter(v)
              setCurrentPage(1)
            }}
            data={['A', 'B', 'C', 'D', 'E', 'F', 'G']}
          />
          <MultiSelect
            flex="1"
            label="排"
            value={rowFilter}
            onChange={v => {
              setRowFilter(v)
              setCurrentPage(1)
            }}
            data={['1', '2', '3', '4', '5', '6', '7', '8']}
          />
          <MultiSelect
            flex="1"
            label="號"
            value={columnFilter}
            onChange={v => {
              setColumnFilter(v)
              setCurrentPage(1)
            }}
            data={['1', '2', '3', '4', '5']}
          />
        </Group>
      </Collapse>
      <Group align="end" justify="space-between" w="100%">
        <Pagination value={currentPage} onChange={setCurrentPage} total={totalPages} />
        <Box></Box>
        <Select
          label="每頁顯示"
          value={pageSize}
          onChange={v => {
            setPageSize(v || 12)
            setCurrentPage(1)
          }}
          data={[
            { value: 5, label: '5' },
            { value: 12, label: '12' },
            { value: 18, label: '18' },
            { value: 24, label: '24' },
            { value: 48, label: '48' },
          ]}
        />
      </Group>
      <SimpleGrid cols={{ xs: 1, sm: 2, lg: 3 }} spacing="md">
        {paginatedStudents.map(student =>
          <ParticipantListCard key={student.seatId} {...student} />,
        )}
      </SimpleGrid>
      <Pagination value={currentPage} onChange={setCurrentPage} total={totalPages} />
    </Stack>
  </Container>
}

export default Students
