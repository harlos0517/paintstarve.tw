import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Work } from '../../db'
import { userAuthMiddleware } from '../../middlewares/auth'

const meDeleteWork = defaultEndpointsFactory
  .addMiddleware(userAuthMiddleware)
  .build({
    method: 'delete',
    input: z.object({
      workId: z.string(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input, ctx }) => {
      const { count } = await Work.deleteMany({
        where: { id: input.workId, authorId: ctx.user.id },
      })

      if (count === 0) throw createHttpError(404)

      return { success: true }
    },
  })

export default meDeleteWork
