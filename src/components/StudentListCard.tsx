import { Affix, Anchor, Box, Card, Center, Divider, Group, Text, Title } from '@mantine/core'
import { useState } from 'react'

import { Student } from '@/api/types'
import { IdCardImage } from '@/components/IdCardImage'
import { TwitterLogoIcon } from '@phosphor-icons/react'

const YEAR_MAP: Record<number, string> = {
  1: '一',
  2: '二',
  3: '三',
}

export type StudentListCardProps = Student

const StudentListCard = (props: StudentListCardProps) => {
  const {
    name,
    nameEn,
    studentId,
    year,
    class: studentClass,
    race,
    major,
    seatRow,
    seatColumn,
    twitter,
    idCardImageUrl,
    description,
  } = props

  const [showDetail, setShowDetail] = useState(false)

  const basicInformation = <>
    <Title order={3} mt="-0.4rem">
      {name}
      <Anchor href={twitter} target="_blank" rel="noopener noreferrer">
        <TwitterLogoIcon
          size="1.5rem"
          weight="fill"
          style={{
            marginLeft: '0.25rem',
            position: 'relative',
            top: '0.2rem',
            marginTop: '-0.2rem',
          }}
          color="#1DA1F2"
        />
      </Anchor>
    </Title>
    <Title order={6}>{nameEn}</Title>
    <Text c="dimmed" size="xs" ff="monospace">{studentId}</Text>
    <Text size="sm">{YEAR_MAP[year]}年 {studentClass} 班 - {seatRow} 排 {seatColumn} 號</Text>
    {race && <Text size="sm">種族：{race}</Text>}
    {major && <Text size="sm">主修：{major}</Text>}
  </>

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
      <Card.Section><IdCardImage src={idCardImageUrl} brds="0" alt={name} /></Card.Section>
      <Card.Section
        p="sm" h="10rem"
        style={{ overflow: 'auto' }}
        flex="1"
      >{basicInformation}</Card.Section>
    </Card>
    <Affix
      position={{ top: 0, left: 0 }}
      w="100%"
      h="100dvh"
      zIndex={10000}
      style={{ display: showDetail ? 'block' : 'none' }}
    >
      <Center h="100%" bg="rgba(0, 0, 0, 0.5)" onClick={() => setShowDetail(false)}>
        <Card
          w="calc(100% - 8rem)" maw="32rem"
          mah="calc(100dvh - 4rem)"
          shadow="sm"
          p="xl"
          radius="md"
          withBorder
        >
          <Card.Section>
            <Group wrap="nowrap">
              <IdCardImage src={idCardImageUrl} brds="md" alt={name} />
              <Box mih="10rem">{basicInformation}</Box>
            </Group>
            {description && <>
              <Divider my="sm" />
              <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{description}</Text>
            </>}
          </Card.Section>
        </Card>
      </Center>
    </Affix>
  </Box>
}

export default StudentListCard
