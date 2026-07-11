import { Box, Image, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ReactNode } from 'react'

export interface ImagePreviewProps {
  src: string
  alt?: string
  children: ReactNode
}

// Wraps a thumbnail (whatever it is - AspectRatio+Image, a bare Image, etc.)
// so clicking it opens a bigger view of the same image, without needing to
// change the thumbnail's own markup/styling.
const ImagePreview = ({ src, alt, children }: ImagePreviewProps) => {
  const [opened, { open, close }] = useDisclosure(false)

  return <>
    <Box onClick={open} style={{ cursor: 'zoom-in' }}>{children}</Box>
    <Modal opened={opened} onClose={close} size="auto" centered padding={0} withCloseButton={false}>
      <Image src={src} alt={alt} fit="contain" mah="85vh" mx="auto" />
    </Modal>
  </>
}

export default ImagePreview
