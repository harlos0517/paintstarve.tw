import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { ApiKey } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'

const adminRevokeApiKey = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    method: 'delete',
    input: z.object({
      userId: z.string(),
      apiKeyId: z.string(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input }) => {
      const apiKey = await ApiKey.findUnique({ where: { id: input.apiKeyId } })
      if (!apiKey || apiKey.userId !== input.userId) throw createHttpError(404)

      await ApiKey.update({
        where: { id: input.apiKeyId },
        data: { revokedAt: new Date() },
      })

      return { success: true }
    },
  })

export default adminRevokeApiKey
