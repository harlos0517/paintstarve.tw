import { Box, Card } from '@mantine/core'
import { useState } from 'react'

import { Character } from '@/api/characters'
import CharacterIdCardDisplay from '@/components/CharacterIdCardDisplay'
import CharacterInfoCard from '@/components/CharacterInfoCard'
import StaffBasicInfo from '@/components/StaffBasicInfo'
import StudentBasicInfo from '@/components/StudentBasicInfo'

export type CharacterListCardProps = Character

const CharacterListCard = (props: CharacterListCardProps) => {
  const {
    role,
    name,
    idCardDisplayMode,
    idCardImageUrls,
  } = props

  const [showDetail, setShowDetail] = useState(false)

  const basicInfo = role === 'STUDENT'
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
      <Card.Section>
        <CharacterIdCardDisplay
          idCardImageUrls={idCardImageUrls}
          idCardDisplayMode={idCardDisplayMode}
          alt={name}
          bdrs={0}
        />
      </Card.Section>
      <Card.Section p="sm" h="12rem" style={{ overflow: 'auto' }} flex="1">
        {basicInfo}
      </Card.Section>
    </Card>
    {showDetail && <CharacterInfoCard {...props} setShowDetail={setShowDetail} />}
  </Box>
}

export default CharacterListCard
