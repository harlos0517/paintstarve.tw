import {
  deleteImage,
  ImageContentType,
  ImageListFilters,
  listMeImages,
  presignCharacterIdCardImageUpload,
  presignImageUpload,
  UpdateCharacterIdCardDisplayInput,
  updateCharacterIdCardDisplay,
} from '@/api/images'
import { useMutation, useQuery } from '@/hooks/useApi'

export const useMeImages = (filters: ImageListFilters = {}) =>
  useQuery(() => listMeImages(filters), [JSON.stringify(filters)])

export const usePresignImageUpload = () =>
  useMutation((contentType: ImageContentType) => presignImageUpload(contentType))

export const useDeleteImage = () =>
  useMutation((imageId: string) => deleteImage(imageId))

export const usePresignCharacterIdCardImageUpload = () =>
  useMutation((characterId: string, contentType: ImageContentType) =>
    presignCharacterIdCardImageUpload(characterId, contentType))

export const useUpdateCharacterIdCardDisplay = () =>
  useMutation((characterId: string, input: UpdateCharacterIdCardDisplayInput) =>
    updateCharacterIdCardDisplay(characterId, input))
