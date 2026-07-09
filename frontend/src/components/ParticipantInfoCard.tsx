import { Affix, Box, Card, Center, Divider, Group, Stack, Text } from '@mantine/core'

import { Participant } from '@/api/types'
import { IdCardImage } from '@/components/IdCardImage'
import StaffBasicInfo from '@/components/StaffBasicInfo'
import StudentBasicInfo from '@/components/StudentBasicInfo'

export interface ParticipantInfoCardProps extends Participant {
  setShowDetail: (show: boolean) => void
}

const ParticipantInfoCard = (props: ParticipantInfoCardProps) => {
  const {
    role,
    name,
    idCardImageUrl,
    description,
    setShowDetail,
  } = props

  const basicInfo = role === 'student'
    ? <StudentBasicInfo {...props} />
    : <StaffBasicInfo {...props} />

  return <Affix
    position={{ top: 0, left: 0 }}
    w="100%"
    h="100dvh"
    zIndex={10000}
  >
    <Box
      pos="absolute"
      w="100%" h="100%"
      bg="rgba(0, 0, 0, 0.5)"
      onClick={() => setShowDetail(false)}
    />
    <Center h="100%">
      <Card
        w="calc(100% - 8rem)" maw="32rem"
        mah="calc(100dvh - 4rem)"
        shadow="sm"
        p="xl"
        radius="md"
        withBorder
      >
        <Card.Section>
          <Stack>
            <Group wrap="nowrap">
              <IdCardImage src={idCardImageUrl} bdrs="md" alt={name} />
              <Box mih="12rem">{basicInfo}</Box>
            </Group>
            {description && <>
              <Divider />
              <Box
                mah="calc(100dvh - 20rem)"
                style={{ overflow: 'auto' }}
              >
                <Text
                  size="sm"
                  style={{ whiteSpace: 'pre-wrap' }}
                >{description}</Text>
              </Box>
            </>}
          </Stack>
        </Card.Section>
      </Card>
    </Center>
  </Affix>
}

export default ParticipantInfoCard
