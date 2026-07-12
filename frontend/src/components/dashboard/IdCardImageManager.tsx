import {
  Alert,
  Box,
  Button,
  FileInput,
  Group,
  Image,
  Modal,
  SegmentedControl,
  Stack,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'

import { getErrorMessage } from '@/api/backendClient'
import { CharacterDetail } from '@/api/characters'
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton'
import ImagePreview from '@/components/ImagePreview'
import {
  useDeleteImage,
  usePresignCharacterIdCardImageUpload,
  useUpdateCharacterIdCardDisplay,
} from '@/hooks/useImages'
import { useImageUpload } from '@/hooks/useImageUpload'

interface IdCardImageManagerProps {
  character: CharacterDetail
  refetch: () => void
}

// Kept in sync with backend/src/images/services/imageLimits.ts
const MAX_ID_CARD_IMAGES_PER_CHARACTER = 5

const IdCardImageManager = ({ character, refetch }: IdCardImageManagerProps) => {
  const [opened, { open, close }] = useDisclosure(false)

  const { mutate: presignUpload, loading: uploading } = usePresignCharacterIdCardImageUpload()
  const { mutate: deleteImage } = useDeleteImage()
  const { mutate: updateDisplay, loading: updatingDisplay } = useUpdateCharacterIdCardDisplay()

  const { file, error: uploadError, handleUpload } = useImageUpload(
    contentType => presignUpload(character.id, contentType),
    refetch,
  )

  const [actionError, setActionError] = useState<string>()
  const error = actionError ?? uploadError

  const handleSetPrimary = async(imageId: string) => {
    setActionError(undefined)
    try {
      await updateDisplay(character.id, { primaryIdCardImageId: imageId })
      refetch()
    } catch(err) {
      setActionError(getErrorMessage(err))
    }
  }

  const handleDisplayModeChange = async(value: string) => {
    setActionError(undefined)
    try {
      await updateDisplay(character.id, { idCardDisplayMode: value as 'SINGLE' | 'CAROUSEL' })
      refetch()
    } catch(err) {
      setActionError(getErrorMessage(err))
    }
  }

  return <>
    <Button variant="default" size="xs" onClick={open}>管理證件照</Button>
    <Modal opened={opened} onClose={close} title="管理證件照" size="lg" centered>
      <Stack>
        {error && <Alert color="red">{error}</Alert>}

        {character.idCardImages.length > 0
          ? <Group align="flex-start">
            {character.idCardImages.map(image => {
              const isPrimary = character.primaryIdCardImageId === image.id
              return <Box key={image.id} w="8rem">
                <ImagePreview src={image.url}>
                  <Image src={image.url} h="12rem" fit="contain" radius="sm" />
                </ImagePreview>
                <Stack gap={4} mt="xs" align="stretch">
                  {isPrimary
                    ? <Button color="blue" size="xs" variant="subtle" disabled>
                      主要顯示
                    </Button>
                    : <Button
                      size="xs" variant="outline"
                      loading={updatingDisplay}
                      onClick={() => handleSetPrimary(image.id)}
                    >
                      設為主要
                    </Button>}
                  <ConfirmDeleteButton
                    onConfirm={async() => { await deleteImage(image.id); refetch() }}
                    message="確定要刪除這張證件照嗎？此操作無法復原。"
                  >
                    <Button size="xs" variant="outline" color="red">刪除</Button>
                  </ConfirmDeleteButton>
                </Stack>
              </Box>
            })}
          </Group>
          : <Text size="sm" c="dimmed">尚未上傳任何證件照。</Text>}

        {character.idCardImages.length >= MAX_ID_CARD_IMAGES_PER_CHARACTER
          ? <Text size="sm" c="dimmed">
            已達每個角色最多 {MAX_ID_CARD_IMAGES_PER_CHARACTER} 張證件照的上限，
            請先刪除不需要的圖片再上傳新的。
          </Text>
          : <>
            <FileInput
              label="上傳新的證件照"
              placeholder="選擇圖片檔案"
              accept="image/png,image/jpeg,image/webp,image/gif"
              value={file}
              onChange={handleUpload}
              disabled={uploading}
            />
            <Text size="xs" c="dimmed">
              為確保顯示正確，建議尺寸符合官方提供學生證尺寸 827px x 1181px 。上限 10MB。
            </Text>
          </>}

        <Stack gap={4}>
          <Text size="sm" fw={500}>公開顯示方式</Text>
          <SegmentedControl
            value={character.idCardDisplayMode}
            onChange={handleDisplayModeChange}
            disabled={character.idCardImages.length < 2}
            data={[
              { label: '只顯示一張', value: 'SINGLE' },
              { label: '輪播全部', value: 'CAROUSEL' },
            ]}
          />
        </Stack>
      </Stack>
    </Modal>
  </>
}

export default IdCardImageManager
