import { Box, Card } from '@mantine/core'
import { useState } from 'react'

import { Participant } from '@/api/types'
import { IdCardImage } from '@/components/IdCardImage'
import ParticipantInfoCard from '@/components/ParticipantInfoCard'
import StaffBasicInfo from '@/components/StaffBasicInfo'
import StudentBasicInfo from '@/components/StudentBasicInfo'

export type ParticipantListCardProps = Participant

const ParticipantListCard = (props: ParticipantListCardProps) => {
  const {
    role,
    name,
    idCardImageUrl,
  } = props

  const [showDetail, setShowDetail] = useState(false)

  const basicInfo = role === 'student'
    ? <StudentBasicInfo {...props} />
    : <StaffBasicInfo {...props} />

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
        {basicInfo}
      </Card.Section>
    </Card>
    {showDetail && <ParticipantInfoCard {...props} setShowDetail={setShowDetail} />}
  </Box>
}

export default ParticipantListCard
