import {
  EndpointsFactory, ensureHttpError, getMessageFromError, ResultHandler,
} from 'express-zod-api'
import { z } from 'zod'

export const csvResultHandler = new ResultHandler({
  positive: { schema: z.string(), mimeType: 'text/csv' },
  negative: { schema: z.string(), mimeType: 'text/plain' },
  handler: ({ error, output, response }) => {
    if (error) {
      const { statusCode } = ensureHttpError(error)
      response.status(statusCode).send(getMessageFromError(error))
      return
    }

    if (output && 'csv' in output && typeof output.csv === 'string') {
      response.attachment('characters.csv').type('text/csv').send(output.csv)
      return
    }

    response.status(500).send('Failed to generate CSV')
  },
})

export const csvEndpointsFactory = new EndpointsFactory(csvResultHandler)
