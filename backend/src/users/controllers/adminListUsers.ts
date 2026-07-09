import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { User } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'

const adminListUsers = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: z.object({
      name: z.string().optional(),
      role: z.enum(['USER', 'ADMIN']).optional(),
      verifyStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional(),
      page: z.coerce.number().int().min(1).default(1),
      per: z.coerce.number().int().min(1).max(100).default(10),
    }),
    output: z.object({
      users: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          role: z.enum(['USER', 'ADMIN']),
          verifyStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']),
        }),
      ),
    }),
    handler: async({ input }) => {
      const users = await User.findMany({
        where: {
          name: input.name ? { contains: input.name } : undefined,
          role: input.role,
          verifyStatus: input.verifyStatus,
        },
        skip: (input.page - 1) * input.per,
        take: input.per,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          verifyStatus: true,
        },
      })

      return { users }
    },
  })

export default adminListUsers
