import { defaultEndpointsFactory, ez } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { ApiKey, User } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import { API_KEY_SCOPES } from '../services/apiKeyScopes'
import { generateApiKeyToken } from '../services/apiKeyToken'

const adminCreateApiKey = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    method: 'post',
    input: z.object({
      userId: z.string(),
      name: z.string().min(1),
      description: z.string().nullable().optional(),
      scopes: z.array(z.enum(API_KEY_SCOPES)).min(1),
      expiresAt: ez.dateIn().nullable().optional(),
    }),
    output: z.object({
      id: z.string(),
      // Only returned once, at creation time - the DB only keeps hashedKey/keyPrefix.
      token: z.string(),
      keyPrefix: z.string(),
    }),
    handler: async({ input }) => {
      const user = await User.findUnique({ where: { id: input.userId }, select: { id: true } })
      if (!user) throw createHttpError(404)

      const { token, keyPrefix, hashedKey } = generateApiKeyToken()

      const apiKey = await ApiKey.create({
        data: {
          userId: input.userId,
          name: input.name,
          description: input.description,
          scopes: input.scopes,
          expiresAt: input.expiresAt,
          keyPrefix,
          hashedKey,
        },
      })

      return { id: apiKey.id, token, keyPrefix }
    },
  })

export default adminCreateApiKey
