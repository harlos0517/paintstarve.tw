import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { User } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'

const adminAdjustUserRoles = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    method: 'patch',
    input: z.object({
      userId: z.string(),
      role: z.enum(['ADMIN', 'USER']),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input, ctx }) => {
      const { userId, role } = input

      if (role !== 'ADMIN' && userId === ctx.user.id)
        throw createHttpError(409, '無法移除自身管理員權限')

      await User.updateMany({
        where: { id: userId },
        data: { role },
      })

      return { success: true }
    },
  })

export default adminAdjustUserRoles
