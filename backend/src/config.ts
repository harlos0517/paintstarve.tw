import { toNodeHandler } from 'better-auth/node'
import { createConfig } from 'express-zod-api'

import auth from './utils/auth'

const config = createConfig({
  http: { listen: 8088 },
  cors: false,
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
    app.all('/api/auth/{*any}', toNodeHandler(auth))
  },
  gracefulShutdown: {
    timeout: 1000,
    events: ['SIGINT', 'SIGTERM'],
  },
})

export default config

export { auth }
