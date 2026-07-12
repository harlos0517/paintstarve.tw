import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Work } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'

const adminResolveWorkApproval = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    method: 'patch',
    input: z.object({
      workId: z.string(),
      action: z.enum(['APPROVE', 'REJECT']),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input }) => {
      const { count } = await Work.updateMany({
        where: { id: input.workId },
        data: { verifyStatus: input.action === 'APPROVE' ? 'VERIFIED' : 'REJECTED' },
      })

      if (count === 0) throw createHttpError(404)

      return { success: true }
    },
  })

export default adminResolveWorkApproval
