import { Button, Container, Group, Stack } from '@mantine/core'

import { classes, getColor, getName, getPath, YEARS } from '@/lib/classes'
import { NavLink } from 'react-router-dom'

const Classes = () => {
  const classButtons = YEARS.map(year => {
    const buttons = classes
      .filter(c => c.year === year)
      .map(classInfo => (
        <NavLink
          key={getName(classInfo.year, classInfo.class)}
          to={getPath(classInfo.year, classInfo.class)}
        >
          <Button
            color={getColor(classInfo.year)}
          >
            {getName(classInfo.year, classInfo.class)}
          </Button>
        </NavLink>
      ))
    return <Group key={year}>{buttons}</Group>
  })


  return <Container p="md">
    <h1>班級</h1>
    <Stack>
      {classButtons}
    </Stack>
  </Container>
}

export default Classes
