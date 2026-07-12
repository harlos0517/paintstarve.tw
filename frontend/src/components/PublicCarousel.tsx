import { Carousel, CarouselProps } from '@mantine/carousel'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import Autoplay from 'embla-carousel-autoplay'

import { AspectRatio, Center } from '@mantine/core'
import React from 'react'
import styles from './PublicCarousel.module.sass'

export interface PublicCarouselProps extends CarouselProps {
  items: { key: string, element: React.ReactNode }[]
  mode?: 'auto' | 'controlled'
  delay?: number
  aspectRatio?: number
}

// Public-facing: single image (today's behavior) or a carousel through all
// of them, per the character owner's choice (see IdCardImageManager).
export const PublicCarousel = (props: PublicCarouselProps) => {
  const { mode = 'auto', items, delay = 4000, aspectRatio = 1, ...carouselProps } = props

  const autoplay = Autoplay({ delay })

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
    plugins={mode === 'auto' ? [autoplay] : []}
    {...carouselProps}
  >
    {items.map(item => (
      <Carousel.Slide key={item.key}>
        <AspectRatio ratio={aspectRatio}>
          <Center h="100%" w="100%">
            {item.element}
          </Center>
        </AspectRatio>
      </Carousel.Slide>
    ))}
  </Carousel>
}

export default PublicCarousel
