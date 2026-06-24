import { Box, Button, Container, Divider, Group, SimpleGrid, Stack, Title } from '@mantine/core'
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { useContext } from 'react'
import { NavLink, useParams } from 'react-router-dom'

import { Student } from '@/api/types'
import GlobalContext from '@/components/GlobalContext'
import { IdCardImage } from '@/components/IdCardImage'
import { classes, COLS, getClass, getColor, getPath, ROWS, YEAR_MAP } from '@/lib/classes'

type SeatProps = {
  student?: Student
}

const Seat = ({ student }: SeatProps) => {
  return <Stack align="center" gap="xs">
    <IdCardImage
      src={student?.idCardImageUrl}
      alt={student?.name}
      brds="md"
    />
    <Title order={4} ta="center">{student?.name || '空位'}</Title>
  </Stack>
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

  const classIndex = classes.findIndex(c => c.year === year && c.class === clazzName)
  const prevClass = classes[classIndex - 1]
  const nextClass = classes[classIndex + 1]
  const prevClassPath = prevClass ? getPath(prevClass.year, prevClass.class) : null
  const nextClassPath = nextClass ? getPath(nextClass.year, nextClass.class) : null

  return <Container p="md">
    <Group justify="space-between" mb="md">
      {prevClassPath
        ? <NavLink to={prevClassPath}><Button
          variant="outline"
          color={getColor(prevClass.year)}
          w="8rem"
        >
          <ArrowLeftIcon weight="bold"  style={{ marginRight: '0.8rem' }} />
          {`${YEAR_MAP[prevClass.year]}年 ${prevClass.class} 班`}
        </Button></NavLink>
        : <Box w="8rem" />
      }
      <Title order={2} ta="center">{`${YEAR_MAP[year]}年 ${clazzName} 班`}</Title>
      {nextClassPath
        ? <NavLink to={nextClassPath}><Button
          variant="outline"
          color={getColor(nextClass.year)}
          w="8rem"
        >
          {`${YEAR_MAP[nextClass.year]}年 ${nextClass.class} 班`}
          <ArrowRightIcon weight="bold" style={{ marginLeft: '0.8rem' }} />
        </Button></NavLink>
        : <Box w="8rem" />
      }
    </Group>
    <Divider my="md" />
    <SimpleGrid cols={5} spacing="md">
      {ROWS.slice(0, clazzInfo?.rows).map(row => {
        return COLS.map(column => {
          const student = classStudents.find(s => s.seatRow === row && s.seatColumn === column)
          return <Seat
            key={student?.id || `${fullClassCode}0${row}0${column}`}
            student={student}
          />
        })
      })}
    </SimpleGrid>
  </Container>
}

export default Clazz
