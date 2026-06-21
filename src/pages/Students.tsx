import { Box } from "@mantine/core"

import { Sheet } from "@/api/types"
import useData from "@/hooks/useData"

const Students = () => {
  const students = useData(Sheet.STUDENTS)

  return <Box>
    {students.map(student => (
      <Box key={student.studentId}>
        {student.name} ({student.studentId})
      </Box>
    ))}
  </Box>
}

export default Students
