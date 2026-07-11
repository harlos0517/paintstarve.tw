import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Character, Image } from '../../db'
import { userAuthMiddleware } from '../../middlewares/auth'

const meUpdateCharacterIdCardDisplay = defaultEndpointsFactory
  .addMiddleware(userAuthMiddleware)
  .build({
    method: 'patch',
    input: z.object({
      characterId: z.string(),
      idCardDisplayMode: z.enum(['SINGLE', 'CAROUSEL']).optional(),
      primaryIdCardImageId: z.string().nullable().optional(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input, ctx }) => {
      const { characterId, ...data } = input

      const character = await Character.findFirst({
        where: { id: characterId, userId: ctx.user.id },
        select: { id: true },
      })
      if (!character) throw createHttpError(404)

      if (data.primaryIdCardImageId) {
        const image = await Image.findFirst({
          where: { id: data.primaryIdCardImageId, idCardForCharacterId: characterId },
          select: { id: true },
        })
        if (!image) throw createHttpError(409, '該圖片不屬於此角色的證件照')
      }

      await Character.update({ where: { id: characterId }, data })

      return { success: true }
    },
  })

export default meUpdateCharacterIdCardDisplay
