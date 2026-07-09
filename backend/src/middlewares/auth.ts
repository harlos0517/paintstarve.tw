import { fromNodeHeaders } from 'better-auth/node'
import { Middleware } from 'express-zod-api'
import createHttpError from 'http-errors'

import auth from '../utils/auth'

const userAuthMiddleware = new Middleware({
  handler: async({ request }) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    })

    if (!session) throw createHttpError(401)
    if (session.user.verifyStatus !== 'VERIFIED') throw createHttpError(403)
    return session
  },
})

const adminAuthMiddleware = new Middleware({
  handler: async({ request }) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    })

    if (!session) throw createHttpError(401)
    if (session.user.role !== 'ADMIN') throw createHttpError(403)
    return session
  },
})

export { adminAuthMiddleware, userAuthMiddleware }

