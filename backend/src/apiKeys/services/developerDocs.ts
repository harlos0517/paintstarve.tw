import { type CommonConfig, Documentation } from 'express-zod-api'

import { developerRouting } from '../../routing'

// Used by config.ts to serve the live /docs (Scalar) and /openapi.json routes.
export const buildDeveloperDocs = (config: CommonConfig) => new Documentation({
  title: 'Paint Starve Developer API',
  version: '1.0.0',
  serverUrl: process.env.BETTER_AUTH_URL ?? 'http://localhost:8088',
  routing: { '/api/v1/developer': developerRouting },
  config,
})
