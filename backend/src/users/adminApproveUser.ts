import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { UserVerifiedStatus } from '../../generated/prisma/enums'
import { User } from '../db'
import { adminAuthMiddleware } from '../middlewares/auth'

const adminApproveUser = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
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

      await User.updateMany({
        where: { id: userId },
        data: updateData,
      })

      return { success: true }
    },
  })

export default adminApproveUser
