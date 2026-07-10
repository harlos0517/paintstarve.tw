import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Character } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import { monthDayInput } from '../services/birthday'

const adminUpdateCharacter = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: z.object({
      characterId: z.string(),
      userId: z.string().nullable().optional(),
      role: z.enum(['STUDENT', 'STAFF']).optional(),
      name: z.string().optional(),
      nameEn: z.string().nullable().optional(),
      cardId: z.string().nullable().optional(),
      year: z.number().int().nullable().optional(),
      class: z.string().nullable().optional(),
      seatRow: z.number().int().nullable().optional(),
      seatColumn: z.number().int().nullable().optional(),
      title: z.string().nullable().optional(),
      unit: z.string().nullable().optional(),
      race: z.string().nullable().optional(),
      major: z.string().nullable().optional(),
      birthday: monthDayInput.nullable().optional(),
      description: z.string().nullable().optional(),
      verified: z.boolean().optional(),
      twitter: z.string().nullable().optional(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input }) => {
      const { characterId, ...data } = input

      const { count } = await Character.updateMany({
        where: { id: characterId },
        data,
      })

      if (count === 0) throw createHttpError(404)

      return { success: true }
    },
  })

export default adminUpdateCharacter
