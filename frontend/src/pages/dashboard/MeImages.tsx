import {
  ActionIcon,
  Alert,
  AspectRatio,
  Box,
  FileInput,
  Group,
  Image,
  Pagination,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useState } from 'react'

import { getErrorMessage } from '@/api/backendClient'
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton'
import ImagePreview from '@/components/ImagePreview'
import { useDeleteImage, useMeImages, usePresignImageUpload } from '@/hooks/useImages'
import { uploadImageFile } from '@/lib/uploadImage'
import { TrashIcon } from '@phosphor-icons/react'

import styles from './MeImages.module.sass'

const ASPECT_RATIO_BY_VIEW = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
  '3:4': 3 / 4,
  '證件': 827 / 1181,
  '9:16': 9 / 16,
} as const

type ImageView = keyof typeof ASPECT_RATIO_BY_VIEW

const DashboardMeImages = () => {
  const [page, setPage] = useState(1)
  const per = 24
  const [view, setView] = useState<ImageView>('1:1')

  const { data, loading, error, refetch } = useMeImages({ page, per })
  const totalPages = data ? Math.ceil(data.total / per) : 0

  const { mutate: presignUpload, loading: uploading } = usePresignImageUpload()
  const { mutate: deleteImage } = useDeleteImage()

  const [file, setFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string>()

  const handleUpload = async(selected: File | null) => {
    setFile(selected)
    if (!selected) return
    setUploadError(undefined)
    try {
      await uploadImageFile(selected, presignUpload)
      setFile(null)
      setPage(1)
      refetch()
    } catch(err) {
      setUploadError(getErrorMessage(err))
    }
  }

  return <Stack>
    <Title order={2}>我的圖片</Title>

    <FileInput
      label="上傳新圖片"
      placeholder="選擇圖片檔案"
      description="上限 10MB"
      accept="image/png,image/jpeg,image/webp,image/gif"
      value={file}
      onChange={handleUpload}
      disabled={uploading}
      maw="24rem"
    />

    {(error || uploadError) && <Alert color="red">{uploadError ?? '無法載入圖片列表。'}</Alert>}

    {!loading && data?.images.length === 0 && (
      <Text size="sm" c="dimmed">尚未上傳任何圖片。</Text>
    )}

    <SegmentedControl
      value={view}
      onChange={value => setView(value as ImageView)}
      data={['16:9', '4:3', '1:1', '3:4', '證件', '9:16']}
      w="fit-content"
    />

    <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 6 }}>
      {data?.images.map(image => (
        <Box key={image.id} className={styles.thumbnail}>
          <ImagePreview src={image.url}>
            <AspectRatio ratio={ASPECT_RATIO_BY_VIEW[view]}>
              <Image src={image.url} fit="cover" radius="sm" />
            </AspectRatio>
          </ImagePreview>
          <ConfirmDeleteButton
            onConfirm={async() => { await deleteImage(image.id); refetch() }}
            message="確定要刪除此圖片嗎？此操作無法復原。"
          >
            <ActionIcon className={styles.deleteButton} color="red" variant="filled" size="sm">
              <TrashIcon />
            </ActionIcon>
          </ConfirmDeleteButton>
        </Box>
      ))}
    </SimpleGrid>

    <Group justify="center">
      <Pagination value={page} onChange={setPage} total={totalPages} />
    </Group>
  </Stack>
}

export default DashboardMeImages
