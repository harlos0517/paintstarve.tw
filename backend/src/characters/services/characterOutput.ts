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
  idCardImages: {
    select: { storageKey: true },
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
  idCardImageUrls: z.array(z.string()),
})

// All character data (including ID card images) is fictional role-play
// content and meant to be public. The linked account is the one exception -
// that's a real person's real name/email, so it's kept out of the public
// select/output and only added for the me/admin detail endpoints.
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
})

export const toCharacterOutput = <T extends { idCardImages: { storageKey: string }[] }>(
  character: T,
) => {
  const { idCardImages, ...rest } = character
  return {
    ...rest,
    idCardImageUrls: idCardImages.map(image => buildImagePublicUrl(image.storageKey)),
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
