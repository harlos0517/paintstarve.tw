import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { User } from '../db'
import { adminAuthMiddleware } from '../middlewares/auth'

const adminAdjustUserRoles = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: z.object({
      userId: z.string(),
      role: z.enum(['ADMIN', 'USER']),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input }) => {
      const { userId, role } = input

      await User.updateMany({
        where: { id: userId },
        data: { role },
      })

      return { success: true }
    },
  })

export default adminAdjustUserRoles
