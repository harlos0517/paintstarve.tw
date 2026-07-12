import backendClient from '@/api/backendClient'

export interface Image {
  id: string
  url: string
  createdAt: string
  idCardForCharacterId: string | null
}

export interface ImageListFilters {
  page?: number
  per?: number
}

export interface ImageListResult {
  images: Image[]
  total: number
}

export type ImageContentType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif'

export interface PresignedUpload {
  imageId: string
  uploadUrl: string
  publicUrl: string
}

export const listMeImages = async(filters: ImageListFilters = {}) => {
  const { data } = await backendClient.get<ImageListResult>(
    '/api/v1/me/images', { params: filters },
  )
  return data
}

export const presignImageUpload = async(contentType: ImageContentType) => {
  const { data } = await backendClient.post<PresignedUpload>(
    '/api/v1/me/images/presign-upload', { contentType },
  )
  return data
}

export const deleteImage = async(imageId: string) => {
  const { data } = await backendClient.delete<{ success: boolean }>(
    `/api/v1/me/images/${imageId}`,
  )
  return data
}

export const presignCharacterIdCardImageUpload = async(
  characterId: string, contentType: ImageContentType,
) => {
  const { data } = await backendClient.post<PresignedUpload>(
    `/api/v1/me/characters/${characterId}/id-card-images/presign-upload`, { contentType },
  )
  return data
}

export interface UpdateCharacterIdCardDisplayInput {
  idCardDisplayMode?: 'SINGLE' | 'CAROUSEL'
  primaryIdCardImageId?: string | null
}

export const updateCharacterIdCardDisplay = async(
  characterId: string, input: UpdateCharacterIdCardDisplayInput,
) => {
  const { data } = await backendClient.patch<{ success: boolean }>(
    `/api/v1/me/characters/${characterId}/id-card-display`, input,
  )
  return data
}
