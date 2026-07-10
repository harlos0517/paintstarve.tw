import { ez } from 'express-zod-api'
import { z } from 'zod'

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
})

// Used for single-character detail endpoints that need to display/reassign
// the linked account. Left out of the public output/select - the account's
// name and email aren't meant to be publicly exposed.
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
