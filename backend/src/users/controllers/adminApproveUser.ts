import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { UserVerifiedStatus } from '../../../generated/prisma/enums'
import { rejectClaim, resolveClaim } from '../../characterClaims/services/resolveClaim'
import db from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'

const adminApproveUser = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    method: 'patch',
    input: z.object({
      userId: z.string(),
      action: z.enum(['APPROVE', 'REJECT']),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input }) => {
      const { userId, action } = input

      const updateData = action === 'APPROVE'
        ? { verifyStatus: UserVerifiedStatus.VERIFIED }
        : { verifyStatus: UserVerifiedStatus.REJECTED }

      // Approving the user also auto-processes their pending character claims,
      // so admins don't have to separately go link characters afterward.
      await db.$transaction(async tx => {
        await tx.user.updateMany({ where: { id: userId }, data: updateData })

        const pendingClaims = await tx.characterClaimRequest.findMany({
          where: { userId, status: 'PENDING' },
          select: { id: true, characterId: true },
        })

        for (const claim of pendingClaims) {
          if (action === 'REJECT') await rejectClaim(tx, claim.id)
          else await resolveClaim(tx, { id: claim.id, userId, characterId: claim.characterId })
        }
      })

      return { success: true }
    },
  })

export default adminApproveUser
