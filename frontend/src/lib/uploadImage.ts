import { ImageContentType, PresignedUpload } from '@/api/images'

const isImageContentType = (type: string): type is ImageContentType =>
  ['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(type)

// Client-side only - a determined user could bypass this by hitting the
// presigned URL directly, but that's an acceptable risk for an authenticated,
// verified-user-only feature (not public/anonymous upload).
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

// Shared by every upload flow: ask the backend to presign a PUT URL (and
// create the Image row), then PUT the file straight to R2 - the backend
// never sees the file bytes.
export const uploadImageFile = async(
  file: File, presign: (contentType: ImageContentType) => Promise<PresignedUpload>,
) => {
  if (!isImageContentType(file.type)) throw new Error(`不支援的圖片格式：${file.type}`)
  if (file.size > MAX_FILE_SIZE_BYTES) throw new Error('圖片檔案過大，請壓縮後再上傳（上限 10MB）')

  const presigned = await presign(file.type)

  const uploadRes = await fetch(presigned.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!uploadRes.ok) throw new Error('圖片上傳失敗')

  return { imageId: presigned.imageId, publicUrl: presigned.publicUrl }
}
