import { useState } from 'react'

import { getErrorMessage } from '@/api/backendClient'
import { ImageContentType, PresignedUpload } from '@/api/images'
import { uploadImageFile } from '@/lib/uploadImage'

type UploadResult = Awaited<ReturnType<typeof uploadImageFile>>

// Shared by every upload button (MeImages.tsx, IdCardImageManager.tsx,
// ImageSelectorModal.tsx): owns the selected-file/error state and the
// presign+PUT dance via uploadImageFile, leaving each call site to only
// supply its own presign function and what should happen once a new image
// exists (refetch a list, merge it into local selection, etc).
export const useImageUpload = (
  presign: (contentType: ImageContentType) => Promise<PresignedUpload>,
  onUploaded?: (result: UploadResult) => void,
) => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string>()

  const handleUpload = async(selected: File | null) => {
    setFile(selected)
    if (!selected) return
    setError(undefined)
    try {
      const result = await uploadImageFile(selected, presign)
      setFile(null)
      onUploaded?.(result)
    } catch(err) {
      setError(getErrorMessage(err))
    }
  }

  return { file, error, handleUpload }
}
