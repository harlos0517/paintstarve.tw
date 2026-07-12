import { IdCardImage, IdCardImageProps } from '@/components/IdCardImage'

import PublicCarousel from '@/components/PublicCarousel'

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

  const items = idCardImageUrls.map(url => ({
    key: url,
    element: <IdCardImage src={url} {...idCardImageProps} bdrs={0} />,
  }))

  if (idCardDisplayMode !== 'CAROUSEL' || idCardImageUrls.length <= 1)
    return <IdCardImage src={idCardImageUrls[0]} {...idCardImageProps} />

  return  <PublicCarousel
    items={items}
    mode={mode}
    delay={4000}
    aspectRatio={headBoxRatio}
    w={`calc(${idCardImageProps.size ?? 12}rem / ${headBoxRatio})`}
    bdrs={idCardImageProps.bdrs}
    style={{ overflow: 'hidden' }}
  />
}

export default CharacterIdCardDisplay
