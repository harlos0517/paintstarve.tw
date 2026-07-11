import { ez } from 'express-zod-api'
import { z } from 'zod'

import { buildImagePublicUrl } from './r2Storage'

export const imageSelect = {
  id: true,
  createdAt: true,
  storageKey: true,
  idCardForCharacterId: true,
} as const

export const imageOutput = z.object({
  id: z.string(),
  createdAt: ez.dateOut(),
  url: z.string(),
  idCardForCharacterId: z.string().nullable(),
})

type ImageRow = {
  id: string
  createdAt: Date
  storageKey: string
  idCardForCharacterId: string | null
}

export const toImageOutput = (image: ImageRow) => ({
  id: image.id,
  createdAt: image.createdAt,
  url: buildImagePublicUrl(image.storageKey),
  idCardForCharacterId: image.idCardForCharacterId,
})

// Used for the admin list, which also needs to show who uploaded each image.
export const imageDetailSelect = {
  ...imageSelect,
  uploadedByUser: {
    select: { id: true, name: true, email: true },
  },
} as const

export const imageDetailOutput = imageOutput.extend({
  uploadedByUser: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }).nullable(),
})

export const toImageDetailOutput = (image: ImageRow & {
  uploadedByUser: { id: string, name: string, email: string } | null
}) => ({
  ...toImageOutput(image),
  uploadedByUser: image.uploadedByUser,
})
