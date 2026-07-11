import { ez } from 'express-zod-api'
import { z } from 'zod'

import { buildImagePublicUrl } from '../../images/services/r2Storage'
import { formatMonthDay } from './birthday'

export const characterSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  season: true,
  seatId: true,
  userId: true,
  role: true,
  name: true,
  nameEn: true,
  cardId: true,
  year: true,
  class: true,
  seatRow: true,
  seatColumn: true,
  title: true,
  unit: true,
  race: true,
  major: true,
  birthday: true,
  description: true,
  verified: true,
  twitter: true,
  idCardDisplayMode: true,
  primaryIdCardImageId: true,
  idCardImages: {
    select: { id: true, storageKey: true, createdAt: true },
  },
} as const

export const characterOutput = z.object({
  id: z.string(),
  createdAt: ez.dateOut(),
  updatedAt: ez.dateOut(),
  season: z.string(),
  seatId: z.string(),
  userId: z.string().nullable(),
  role: z.enum(['STUDENT', 'STAFF']),
  name: z.string(),
  nameEn: z.string().nullable(),
  cardId: z.string().nullable(),
  year: z.number().int().nullable(),
  class: z.string().nullable(),
  seatRow: z.number().int().nullable(),
  seatColumn: z.number().int().nullable(),
  title: z.string().nullable(),
  unit: z.string().nullable(),
  race: z.string().nullable(),
  major: z.string().nullable(),
  birthday: z.date().nullable().transform(date => (date ? formatMonthDay(date) : null)),
  description: z.string().nullable(),
  verified: z.boolean(),
  twitter: z.string().nullable(),
  idCardDisplayMode: z.enum(['SINGLE', 'CAROUSEL']),
  idCardImageUrls: z.array(z.string()),
})

// All character data (including ID card images) is fictional role-play
// content and meant to be public. The linked account is the one exception -
// that's a real person's real name/email, so it's kept out of the public
// select/output and only added for the me/admin detail endpoints, which also
// need real Image ids (not just URLs) and the current primary pointer so an
// owner's management UI has something to act on.
export const characterDetailSelect = {
  ...characterSelect,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} as const

export const characterDetailOutput = characterOutput.extend({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }).nullable(),
  primaryIdCardImageId: z.string().nullable(),
  idCardImages: z.array(z.object({
    id: z.string(),
    url: z.string(),
    createdAt: ez.dateOut(),
  })),
})

type IdCardImageRow = { id: string, storageKey: string, createdAt: Date }

// Puts the primary image (if set) first, otherwise leaves DB order as-is.
const sortIdCardImages = <T extends { id: string }>(
  images: T[], primaryIdCardImageId: string | null,
): T[] => {
  const primaryIndex = primaryIdCardImageId
    ? images.findIndex(image => image.id === primaryIdCardImageId)
    : -1
  if (primaryIndex <= 0) return images

  const reordered = [...images]
  const [primary] = reordered.splice(primaryIndex, 1)
  reordered.unshift(primary)
  return reordered
}

export const toCharacterOutput = <T extends {
  idCardImages: IdCardImageRow[]
  primaryIdCardImageId: string | null
}>(character: T) => {
  const { idCardImages, ...rest } = character
  const ordered = sortIdCardImages(idCardImages, character.primaryIdCardImageId)
  return {
    ...rest,
    idCardImageUrls: ordered.map(image => buildImagePublicUrl(image.storageKey)),
  }
}

export const toCharacterDetailOutput = <T extends {
  idCardImages: IdCardImageRow[]
  primaryIdCardImageId: string | null
}>(character: T) => {
  const ordered = sortIdCardImages(character.idCardImages, character.primaryIdCardImageId)
  return {
    ...toCharacterOutput(character),
    primaryIdCardImageId: character.primaryIdCardImageId,
    idCardImages: ordered.map(image => ({
      id: image.id,
      url: buildImagePublicUrl(image.storageKey),
      createdAt: image.createdAt,
    })),
  }
}

export const characterListSelect = {
  id: true,
  season: true,
  role: true,
  name: true,
  year: true,
  class: true,
  verified: true,
} as const

export const characterListOutput = z.object({
  id: z.string(),
  season: z.string(),
  role: z.enum(['STUDENT', 'STAFF']),
  name: z.string(),
  year: z.number().int().nullable(),
  class: z.string().nullable(),
  verified: z.boolean(),
})
