import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { CharacterClaimRequest } from '../../db'
import { authenticatedMiddleware } from '../../middlewares/auth'

const meDeleteCharacterClaim = defaultEndpointsFactory
  .addMiddleware(authenticatedMiddleware)
  .build({
    method: 'delete',
    input: z.object({
      claimId: z.string(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input, ctx }) => {
      const { count } = await CharacterClaimRequest.deleteMany({
        where: { id: input.claimId, userId: ctx.user.id, status: 'PENDING' },
      })

      if (count === 0) throw createHttpError(404)

      return { success: true }
    },
  })

export default meDeleteCharacterClaim
