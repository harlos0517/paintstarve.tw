import { Carousel } from '@mantine/carousel'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import Autoplay from 'embla-carousel-autoplay'

import { IdCardImage, IdCardImageProps } from '@/components/IdCardImage'

import styles from './CharacterIdCardDisplay.module.sass'

export interface CharacterIdCardDisplayProps extends Omit<IdCardImageProps, 'src'> {
  mode?: 'auto' | 'controlled'
  idCardImageUrls: string[]
  idCardDisplayMode: 'SINGLE' | 'CAROUSEL'
}

// Public-facing: single image (today's behavior) or a carousel through all
// of them, per the character owner's choice (see IdCardImageManager).
export const CharacterIdCardDisplay = (props: CharacterIdCardDisplayProps) => {
  const { mode = 'auto', idCardImageUrls, idCardDisplayMode, ...idCardImageProps } = props

  const headBoxRatio = 666 / 545

  const autoplay = Autoplay({ delay: 4000 })

  if (idCardDisplayMode !== 'CAROUSEL' || idCardImageUrls.length <= 1)
    return <IdCardImage src={idCardImageUrls[0]} {...idCardImageProps} />

  return <Carousel
    classNames={{
      root: styles.root,
      controls: styles.controls,
      indicators: styles.indicators,
      control: styles.control,
    }}
    controlsOffset={0}
    withControls={mode === 'controlled'}
    withIndicators={mode === 'controlled'}
    slideSize="100%"
    emblaOptions={{ loop: true }}
    nextControlIcon={<CaretRightIcon size={16} />}
    previousControlIcon={<CaretLeftIcon size={16} />}
    w={`calc(${idCardImageProps.size ?? 12}rem / ${headBoxRatio})`}
    bdrs={idCardImageProps.bdrs}
    style={{ overflow: 'hidden' }}
    plugins={mode === 'auto' ? [autoplay] : []}
  >
    {idCardImageUrls.map(url => (
      <Carousel.Slide key={url}>
        <IdCardImage src={url} {...idCardImageProps} bdrs={0} />
      </Carousel.Slide>
    ))}
  </Carousel>
}

export default CharacterIdCardDisplay
