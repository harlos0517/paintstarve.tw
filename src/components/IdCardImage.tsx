import { Box, Image } from '@mantine/core'

import BlankIdCardImage from '@/assets/images/blank_id_card.png'

export interface IdCardImageProps {
  src?: string
  alt?: string
  brds: number | string
}

export const IdCardImage = (props: IdCardImageProps) => {
  const { src = BlankIdCardImage, alt, brds } = props

  const headBoxRatio = 666 / 545
  const scale = 1.53

  return <Box
    w={`calc(10rem / ${headBoxRatio})`}
    h="10rem"
    style={{ overflow: 'hidden' }}
    pos="relative"
    bdrs={brds}
  >
    {src &&
      <Image
        pos="absolute"
        style={{ top: '-1.1rem', left: '-2.2rem' }}
        h={`calc(10rem * ${scale})`}
        w={`calc(10rem * ${scale} / ${headBoxRatio})`}
        src={src}
        fallbackSrc={BlankIdCardImage}
        alt={alt || 'ID Card'}
      />
    }
  </Box>
}
