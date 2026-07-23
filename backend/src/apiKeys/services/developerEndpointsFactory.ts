import rateLimit, { ipKeyGenerator, type ValueDeterminingMiddleware } from 'express-rate-limit'
import { defaultEndpointsFactory } from 'express-zod-api'

import apiKeyAuthMiddleware from '../../middlewares/apiKeyAuth'

// Buckets by the raw X-API-Key header value, not ApiKey.id - the token text
// already maps 1:1 to a single key, and this runs before apiKeyAuthMiddleware
// does the DB lookup, so an abusive caller gets throttled without costing a
// query per request. Falls back to IP only for requests with no key at all
// (they'll 401 at apiKeyAuthMiddleware right after anyway).
const keyGenerator: ValueDeterminingMiddleware<string> = request => {
  const rawKey = request.headers['x-api-key']
  return typeof rawKey === 'string' ? rawKey : ipKeyGenerator(request.ip ?? 'unknown')
}

// Each tier gets its own rate limiter instance (i.e. its own independent
// counter store) - read/patch/upload traffic don't share a bucket, so a burst
// of one kind of call can't eat into another endpoint's quota.
const buildDeveloperEndpointsFactory = (limit: number) => {
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
  })

  return defaultEndpointsFactory
    .use(limiter)
    .addMiddleware(apiKeyAuthMiddleware)
}

// characters:read (get character, find user by email) - cheap reads, generous quota.
export const developerReadEndpointsFactory = buildDeveloperEndpointsFactory(1200)
// characters:write (PATCH character) - mutates data, tighter quota.
export const developerUpdateEndpointsFactory = buildDeveloperEndpointsFactory(300)
// id-card image upload - creates a DB row + R2 presigned URL per call, tightest quota.
export const developerImageUploadEndpointsFactory = buildDeveloperEndpointsFactory(60)
