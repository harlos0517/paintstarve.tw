import { apiReference } from '@scalar/express-api-reference'
import { toNodeHandler } from 'better-auth/node'
import { createConfig } from 'express-zod-api'
import createHttpError from 'http-errors'

import { buildDeveloperDocs } from './apiKeys/services/developerDocs'
import authControllers from './utils/authControllers'

const config = createConfig({
  http: { listen: 8088 },
  cors: ({ defaultHeaders }) => ({
    ...defaultHeaders,
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL!,
    'Access-Control-Allow-Credentials': 'true',
  }),
  upload: {
    limits: { fileSize: 10 * 1024 * 1024 },
    limitError: createHttpError(413, 'The uploaded file is too large'),
  },
  beforeRouting: ({ app }) => {
    // better-auth is mounted directly on the app, bypassing express-zod-api's
    // own `cors` option, so it needs its own CORS handling with credentials.
    app.use('/api/auth', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL!)
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
      res.header('Access-Control-Allow-Headers', 'Content-Type')
      if (req.method === 'OPTIONS') {
        res.sendStatus(204)
        return
      }
      next()
    })
    app.all('/api/auth/{*any}', toNodeHandler(authControllers))

    // Developer API docs: raw spec + a Scalar UI to browse/try it, both
    // public (no API key needed to view - only actual calls require one).
    const developerDocs = buildDeveloperDocs(config)
    app.get('/api/v1/developer/openapi.json', (_req, res) => {
      res.json(developerDocs.getSpec())
    })
    app.get('/api/v1/developer/docs', apiReference({
      url: '/api/v1/developer/openapi.json',
      pageTitle: 'Paint Starve Developer API',
    }))
  },
  gracefulShutdown: {
    timeout: 1000,
    events: ['SIGINT', 'SIGTERM'],
  },
})

export default config

export { authControllers as auth }
