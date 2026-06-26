import { Anchor, Text, Title } from '@mantine/core'
import { TwitterLogoIcon } from '@phosphor-icons/react'

import { Student } from '@/api/types'
import { YEAR_MAP } from '@/lib/classes'

export type StudentBasicInfoProps = Student

const StudentBasicInfo = (props: StudentBasicInfoProps) => {
  const {
    name,
    nameEn,
    studentId,
    year,
    class: studentClass,
    seatRow,
    seatColumn,
    race,
    major,
    birthday,
    twitter,
  } = props

  const [birthdayMonth, birthdayDay] = (birthday?.split('-').map(Number)) || []

  return <>
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
    {birthday && <Text size="sm">生日：{birthdayMonth} 月 {birthdayDay} 日</Text>}
  </>
}

export default StudentBasicInfo
