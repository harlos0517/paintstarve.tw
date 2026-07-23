import { defaultEndpointsFactory, ez } from 'express-zod-api'
import { z } from 'zod'

import { ApiKey } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'

const adminListApiKeys = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: z.object({
      userId: z.string(),
    }),
    output: z.object({
      apiKeys: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        keyPrefix: z.string(),
        scopes: z.array(z.string()),
        lastUsedAt: ez.dateOut().nullable(),
        lastUsedIp: z.string().nullable(),
        expiresAt: ez.dateOut().nullable(),
        revokedAt: ez.dateOut().nullable(),
        createdAt: ez.dateOut(),
      })),
    }),
    handler: async({ input }) => {
      const apiKeys = await ApiKey.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          keyPrefix: true,
          scopes: true,
          lastUsedAt: true,
          lastUsedIp: true,
          expiresAt: true,
          revokedAt: true,
          createdAt: true,
        },
      })

      return { apiKeys }
    },
  })

export default adminListApiKeys
