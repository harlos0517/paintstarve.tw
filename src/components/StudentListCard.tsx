import { Box, Card } from '@mantine/core'
import { useState } from 'react'

import { Student } from '@/api/types'
import { IdCardImage } from '@/components/IdCardImage'
import StudentBasicInfo from '@/components/StudentBasicInfo'
import StudentInfoCard from '@/components/StudentInfoCard'

export type StudentListCardProps = Student

const StudentListCard = (props: StudentListCardProps) => {
  const {
    name,
    idCardImageUrl,
  } = props

  const [showDetail, setShowDetail] = useState(false)

  return <Box>
    <Card
      shadow="sm"
      radius="md"
      padding="0"
      withBorder
      style={{ cursor: 'pointer', overflowY: 'auto' }}
      onClick={() => setShowDetail(true)}
      orientation="horizontal"
    >
      <Card.Section><IdCardImage src={idCardImageUrl} bdrs="0" alt={name} /></Card.Section>
      <Card.Section p="sm" h="12rem" style={{ overflow: 'auto' }} flex="1">
        <StudentBasicInfo {...props} />
      </Card.Section>
    </Card>
    {showDetail && <StudentInfoCard {...props} setShowDetail={setShowDetail} />}
  </Box>
}

export default StudentListCard
