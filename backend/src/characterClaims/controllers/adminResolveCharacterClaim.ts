import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { rejectClaim, resolveClaim } from '../services/resolveClaim'
import db, { CharacterClaimRequest } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'

const adminResolveCharacterClaim = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    method: 'patch',
    input: z.object({
      claimId: z.string(),
      action: z.enum(['APPROVE', 'REJECT']),
    }),
    output: z.object({
      success: z.boolean(),
      // false when an APPROVE couldn't actually link the character (e.g. it
      // got claimed by someone else in the meantime) - the claim was still
      // rejected, just not for the reason the admin clicked.
      linked: z.boolean(),
    }),
    handler: async({ input }) => {
      const claim = await CharacterClaimRequest.findUnique({
        where: { id: input.claimId },
        select: { id: true, userId: true, characterId: true, status: true },
      })

      if (!claim) throw createHttpError(404)
      if (claim.status !== 'PENDING') throw createHttpError(409, '此申請已被處理過')

      const linked = await db.$transaction(async tx => {
        if (input.action === 'REJECT') {
          await rejectClaim(tx, claim.id)
          return false
        }
        return resolveClaim(tx, claim)
      })

      return { success: true, linked }
    },
  })

export default adminResolveCharacterClaim
