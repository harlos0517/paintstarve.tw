import {
  ActionIcon,
  AspectRatio,
  Box,
  Button,
  FileInput,
  Group,
  Image,
  Modal,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { CheckCircleIcon } from '@phosphor-icons/react'
import { useState } from 'react'

import { useMeImages, usePresignImageUpload } from '@/hooks/useImages'
import { useImageUpload } from '@/hooks/useImageUpload'
import { usePagination } from '@/hooks/usePagination'

export interface ImageSelectorImage {
  id: string
  url: string
}

interface ImageSelectorModalProps {
  selected: ImageSelectorImage[]
  onChange: (images: ImageSelectorImage[]) => void
  max: number
}

// Grid picker over the user's own image library, backed by the same
// /me/images list used by MeImages.tsx. Own ID-card scans are filtered out -
// those aren't meant to be selectable as work artwork.
const ImageSelectorModal = ({ selected, onChange, max }: ImageSelectorModalProps) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [pending, setPending] = useState<Map<string, string>>(new Map())
  const { page, setPage, per, resetPage, totalPages } = usePagination(12)

  const { data, loading, error, refetch } = useMeImages({ page, per })
  const images = data?.images.filter(image => !image.idCardForCharacterId) ?? []

  const { mutate: presignUpload, loading: uploading } = usePresignImageUpload()

  const handleOpen = () => {
    setPending(new Map(selected.map(image => [image.id, image.url])))
    resetPage()
    open()
  }

  const toggle = (id: string, url: string) => {
    setPending(prev => {
      const next = new Map(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < max) next.set(id, url)
      return next
    })
  }

  const { file, error: uploadError, handleUpload } = useImageUpload(
    presignUpload,
    ({ imageId, publicUrl }) => {
      setPending(prev => {
        if (prev.size >= max) return prev
        const next = new Map(prev)
        next.set(imageId, publicUrl)
        return next
      })
      resetPage()
      refetch()
    },
  )

  const handleConfirm = () => {
    onChange(Array.from(pending.entries()).map(([id, url]) => ({ id, url })))
    close()
  }

  const atMax = pending.size >= max

  return <>
    <Button variant="default" size="xs" onClick={handleOpen}>從圖庫選擇圖片</Button>
    <Modal opened={opened} onClose={close} title="選擇圖片" size="lg" centered>
      <Stack>
        <Text size="sm" c="dimmed">已選擇 {pending.size} / {max} 張</Text>

        {(error || uploadError) && (
          <Text c="red" size="sm">{uploadError ?? '無法載入圖片列表。'}</Text>
        )}

        {atMax
          ? <Text size="sm" c="dimmed">已達上限，請先取消選擇其他圖片再上傳新的。</Text>
          : <FileInput
            label="上傳新圖片"
            placeholder="選擇圖片檔案"
            accept="image/png,image/jpeg,image/webp,image/gif"
            value={file}
            onChange={handleUpload}
            disabled={uploading}
          />}

        {!loading && images.length === 0 && (
          <Text size="sm" c="dimmed">圖庫中沒有可選擇的圖片。</Text>
        )}

        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }}>
          {images.map(image => {
            const isSelected = pending.has(image.id)
            return <Box
              key={image.id}
              pos="relative"
              onClick={() => toggle(image.id, image.url)}
              style={{
                cursor: 'pointer',
                outline: isSelected ? '3px solid var(--mantine-color-blue-6)' : undefined,
                borderRadius: 'var(--mantine-radius-sm)',
                opacity: !isSelected && atMax ? 0.4 : 1,
              }}
            >
              <AspectRatio ratio={1}>
                <Image src={image.url} fit="cover" radius="sm" />
              </AspectRatio>
              {isSelected && (
                <ActionIcon
                  pos="absolute" top={4} right={4} color="blue" variant="filled" size="sm"
                >
                  <CheckCircleIcon weight="fill" />
                </ActionIcon>
              )}
            </Box>
          })}
        </SimpleGrid>

        <Group justify="center">
          <Pagination value={page} onChange={setPage} total={totalPages(data?.total)} />
        </Group>

        <Group justify="flex-end">
          <Button variant="default" onClick={close}>取消</Button>
          <Button onClick={handleConfirm}>確認選擇</Button>
        </Group>
      </Stack>
    </Modal>
  </>
}

export default ImageSelectorModal
