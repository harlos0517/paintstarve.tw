import { Center, Image } from '@mantine/core'

import BlankIdCardImage from '@/assets/images/blank_id_card.png'

export interface IdCardImageProps {
  src?: string
  alt?: string
  size?: number
  bdrs: number | string
}

export const IdCardImage = (props: IdCardImageProps) => {
  const { src = BlankIdCardImage, alt, bdrs, size = 12 } = props

  const headBoxRatio = 666 / 545
  const scale = 1.55

  return <Center
    w={`calc(${size}rem / ${headBoxRatio})`}
    h={`${size}rem`}
    style={{ overflow: 'hidden' }}
    pos="relative"
    bdrs={bdrs}
  >
    {src &&
      <Image
        pos="absolute"
        style={{ top: `calc(-0.11rem * ${size})` }}
        h={`calc(${size}rem * ${scale})`}
        w={`calc(${size}rem * ${scale} / ${headBoxRatio})`}
        src={src}
        fallbackSrc={BlankIdCardImage}
        alt={alt || 'ID Card'}
      />
    }
  </Center>
}
