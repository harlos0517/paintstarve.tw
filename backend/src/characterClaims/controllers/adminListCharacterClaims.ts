import { defaultEndpointsFactory, ez } from 'express-zod-api'
import { z } from 'zod'

import { CharacterClaimRequest } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'

const adminListCharacterClaims = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: z.object({
      status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
      page: z.coerce.number().int().min(1).default(1),
      per: z.coerce.number().int().min(1).max(100).default(20),
    }),
    output: z.object({
      claims: z.array(z.object({
        id: z.string(),
        status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
        createdAt: ez.dateOut(),
        user: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        }),
        character: z.object({
          id: z.string(),
          name: z.string(),
        }),
      })),
      total: z.number().int(),
    }),
    handler: async({ input }) => {
      const where = { status: input.status }

      const [claims, total] = await Promise.all([
        CharacterClaimRequest.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.per,
          take: input.per,
          select: {
            id: true,
            status: true,
            createdAt: true,
            user: { select: { id: true, name: true, email: true } },
            character: { select: { id: true, name: true } },
          },
        }),
        CharacterClaimRequest.count({ where }),
      ])

      return { claims, total }
    },
  })

export default adminListCharacterClaims
