import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Character } from '../../db'
import { userAuthMiddleware } from '../../middlewares/auth'
import { monthDayInput } from '../services/birthday'

const meUpdateCharacter = defaultEndpointsFactory
  .addMiddleware(userAuthMiddleware)
  .build({
    input: z.object({
      characterId: z.string(),
      nameEn: z.string().nullable().optional(),
      title: z.string().nullable().optional(),
      unit: z.string().nullable().optional(),
      race: z.string().nullable().optional(),
      major: z.string().nullable().optional(),
      birthday: monthDayInput.nullable().optional(),
      description: z.string().nullable().optional(),
      twitter: z.string().nullable().optional(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input, ctx }) => {
      const { characterId, ...data } = input

      const { count } = await Character.updateMany({
        where: { id: characterId, userId: ctx.user.id },
        data,
      })

      if (count === 0) throw createHttpError(404)

      return { success: true }
    },
  })

export default meUpdateCharacter
