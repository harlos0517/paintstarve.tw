import { Anchor, Image, Text, Title } from '@mantine/core'
import { CakeIcon, TwitterLogoIcon } from '@phosphor-icons/react'

import { Participant } from '@/api/types'
import { YEAR_MAP } from '@/lib/classes'

import verifiedImage from '@/assets/images/verified.png'

export type StudentBasicInfoProps = Participant

const StudentBasicInfo = (props: StudentBasicInfoProps) => {
  const {
    name,
    nameEn,
    cardId: studentId,
    year,
    class: studentClass,
    title,
    unit,
    race,
    major,
    birthday,
    twitter,
    verified,
  } = props

  const [birthdayMonth, birthdayDay] = (birthday?.split('-').map(Number)) || []
  const birthdayIsToday =
    birthdayMonth === new Date().getMonth() + 1 && birthdayDay === new Date().getDate()

  return <>
    <Title order={3} mt="-0.4rem">
      {name}
      {twitter && <Anchor href={twitter} target="_blank" rel="noopener noreferrer">
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
      </Anchor>}
      {verified && <Image
        src={verifiedImage}
        alt="已認證"
        w="1.5rem" h="1.5rem"
        display="inline"
        style={{
          marginLeft: '0.25rem',
          position: 'relative',
          top: '0.4rem',
        }}
      />}
      {birthdayIsToday && <CakeIcon
        size="1.5rem"
        weight="fill"
        style={{
          marginLeft: '0.25rem',
          position: 'relative',
          top: '0.3rem',
        }}
        color="#FFFF88"
      />}
    </Title>
    <Title order={6}>{nameEn}</Title>
    <Text c="dimmed" size="xs" ff="monospace">{studentId}</Text>
    <Text size="sm"></Text>
    {unit && <Text size="sm">單位：{unit}</Text>}
    {title && <Text size="sm">
      {year && <>{YEAR_MAP[year]}年 {studentClass} 班</>}
      {title}</Text>}
    {major && <Text size="sm">{major}</Text>}
    {race && <Text size="sm">種族：{race}</Text>}
    {birthday && <Text size="sm">生日：{birthdayMonth} 月 {birthdayDay} 日</Text>}
  </>
}

export default StudentBasicInfo
