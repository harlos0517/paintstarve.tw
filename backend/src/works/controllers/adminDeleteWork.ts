import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Work } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'

const adminDeleteWork = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    method: 'delete',
    input: z.object({
      workId: z.string(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input }) => {
      const { count } = await Work.deleteMany({
        where: { id: input.workId },
      })

      if (count === 0) throw createHttpError(404)

      return { success: true }
    },
  })

export default adminDeleteWork
