import { fromNodeHeaders } from 'better-auth/node'
import { Middleware } from 'express-zod-api'
import createHttpError from 'http-errors'

import authControllers from '../utils/authControllers'

// Requires only a logged-in session - no verifyStatus check. Used where a
// not-yet-approved user still needs to act (e.g. submitting character claims).
const authenticatedMiddleware = new Middleware({
  handler: async({ request }) => {
    const session = await authControllers.api.getSession({
      headers: fromNodeHeaders(request.headers),
    })

    if (!session) throw createHttpError(401)
    return session
  },
})

const userAuthMiddleware = new Middleware({
  handler: async({ request }) => {
    const session = await authControllers.api.getSession({
      headers: fromNodeHeaders(request.headers),
    })

    if (!session) throw createHttpError(401)
    if (session.user.verifyStatus !== 'VERIFIED') throw createHttpError(403)
    return session
  },
})

const adminAuthMiddleware = new Middleware({
  handler: async({ request }) => {
    const session = await authControllers.api.getSession({
      headers: fromNodeHeaders(request.headers),
    })

    if (!session) throw createHttpError(401)
    if (session.user.role !== 'ADMIN') throw createHttpError(403)
    return session
  },
})

export { adminAuthMiddleware, authenticatedMiddleware, userAuthMiddleware }

