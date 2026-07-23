import { Middleware } from 'express-zod-api'
import createHttpError from 'http-errors'

import { hashApiKeyToken } from '../apiKeys/services/apiKeyToken'
import { ApiKey } from '../db'

const apiKeyAuthMiddleware = new Middleware({
  security: { type: 'header', name: 'X-API-Key' },
  handler: async({ request }) => {
    const rawKey = request.headers['x-api-key']
    if (!rawKey || typeof rawKey !== 'string') throw createHttpError(401)

    const apiKey = await ApiKey.findUnique({ where: { hashedKey: hashApiKeyToken(rawKey) } })

    if (!apiKey) throw createHttpError(401)
    if (apiKey.revokedAt) throw createHttpError(401)
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) throw createHttpError(401)

    // Fire-and-forget: last-used tracking shouldn't slow down or fail the request.
    void ApiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date(), lastUsedIp: request.ip },
    }).catch(() => {})

    return { apiKey }
  },
})

export default apiKeyAuthMiddleware
