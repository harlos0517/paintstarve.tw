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
          characterClaims: z.array(z.object({
            id: z.string(),
            character: z.object({
              id: z.string(),
              name: z.string(),
            }),
          })),
        }),
      ),
      total: z.number().int(),
    }),
    handler: async({ input }) => {
      const where = {
        name: input.name ? { contains: input.name } : undefined,
        role: input.role,
        verifyStatus: input.verifyStatus,
      }

      const [users, total] = await Promise.all([
        User.findMany({
          where,
          skip: (input.page - 1) * input.per,
          take: input.per,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            verifyStatus: true,
            characterClaims: {
              where: { status: 'PENDING' },
              select: {
                id: true,
                character: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        }),
        User.count({ where }),
      ])

      return { users, total }
    },
  })

export default adminListUsers
