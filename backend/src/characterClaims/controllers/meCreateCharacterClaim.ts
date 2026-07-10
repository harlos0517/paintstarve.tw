import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Character, CharacterClaimRequest } from '../../db'
import { authenticatedMiddleware } from '../../middlewares/auth'

const meCreateCharacterClaim = defaultEndpointsFactory
  .addMiddleware(authenticatedMiddleware)
  .build({
    method: 'post',
    input: z.object({
      characterId: z.string(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input, ctx }) => {
      const character = await Character.findUnique({
        where: { id: input.characterId },
        select: { userId: true },
      })

      if (!character) throw createHttpError(404)
      if (character.userId === ctx.user.id) throw createHttpError(409, '你已經是此角色的擁有者')
      if (character.userId) throw createHttpError(409, '此角色已被其他使用者連結')

      const existing = await CharacterClaimRequest.findUnique({
        where: {
          userId_characterId: { userId: ctx.user.id, characterId: input.characterId },
        },
      })

      if (existing) {
        if (existing.status !== 'REJECTED') throw createHttpError(409, '你已經提出過此角色的認領申請')

        // A previously rejected claim can be re-submitted (e.g. rejected by
        // mistake, or circumstances changed) instead of being stuck forever -
        // the unique constraint on (userId, characterId) means we can't just
        // insert a second row for the same pair.
        await CharacterClaimRequest.update({
          where: { id: existing.id },
          data: { status: 'PENDING' },
        })
        return { success: true }
      }

      await CharacterClaimRequest.create({
        data: { userId: ctx.user.id, characterId: input.characterId },
      })

      return { success: true }
    },
  })

export default meCreateCharacterClaim
