import { Box, Button, Container, Divider, Group, SimpleGrid, Stack, Title } from '@mantine/core'
import { useHover, useMediaQuery } from '@mantine/hooks'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useContext, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'

import { Student } from '@/api/types'
import GlobalContext from '@/components/GlobalContext'
import { IdCardImage } from '@/components/IdCardImage'
import StudentInfoCard from '@/components/StudentInfoCard'
import { COLS, getClass, ROWS, YEAR_MAP } from '@/lib/classes'

type SeatProps = {
  student?: Student
}

const Seat = ({ student }: SeatProps) => {
  const isXs = useMediaQuery('(max-width: 480px)')
  const isSm = useMediaQuery('(max-width: 960px)')
  const seatSize = isXs ? 6 : isSm ? 8 : 12

  const [showDetail, setShowDetail] = useState(false)
  const { hovered, ref } = useHover()

  return <>
    <Stack
      align="center" gap="xs"
      style={{ cursor: 'pointer' }}
      bdrs="md" bg={hovered ? '#FFFFFF33' : 'transparent'}
      ref={ref} onClick={() => setShowDetail(true)}
    >
      <IdCardImage
        src={student?.idCardImageUrl}
        alt={student?.name}
        size={seatSize}
        bdrs="md"
      />
      <Title order={4} mah="3rem" ta="center" style={{ overflow: 'hidden' }}>
        {student?.name || '空位'}
      </Title>
    </Stack>
    {showDetail && student && <StudentInfoCard {...student} setShowDetail={setShowDetail} />}
  </>
}

const Clazz = () => {
  const { clazz } = useParams()
  const { students: allStudents } = useContext(GlobalContext)

  const year = Number(clazz?.[0])
  const clazzName = clazz?.[1]
  const clazzInfo = getClass(year, clazzName || '')

  if (!clazzInfo) return <Container p="md"><Title order={2}>{'404 :('}</Title></Container>

  const classCode = clazzName ? clazzName.charCodeAt(0) - 64 : 0
  const fullClassCode = `${year}0${classCode}`
  const classStudents = allStudents.filter(s => s.class === clazzName && s.year === year)

  return <Container p="md">
    <Group justify="space-between" mb="md">
      <NavLink to="/classes"><Button variant="outline" w="6rem">
        <ArrowLeftIcon weight="bold"  style={{ marginRight: '0.8rem' }} />
        返回
      </Button></NavLink>
      <Title order={2} ta="center">{`${YEAR_MAP[year]}年 ${clazzName} 班`}</Title>
      <Box w="6rem" />
    </Group>
    <Divider my="md" />
    <SimpleGrid cols={5} spacing="md">
      {ROWS.slice(0, clazzInfo?.rows).map(row => {
        return COLS.map(column => {
          const student = classStudents.find(s => s.seatRow === row && s.seatColumn === column)
          return <Seat
            key={student?.seatId || `${fullClassCode}0${row}0${column}`}
            student={student}
          />
        })
      })}
    </SimpleGrid>
  </Container>
}

export default Clazz
