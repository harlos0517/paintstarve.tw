import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Work } from '../../db'
import { userAuthMiddleware } from '../../middlewares/auth'
import { toWorkDetailOutput, workDetailOutput, workDetailSelect } from '../services/workOutput'

const meGetWork = defaultEndpointsFactory
  .addMiddleware(userAuthMiddleware)
  .build({
    input: z.object({
      workId: z.string(),
    }),
    output: z.object({
      work: workDetailOutput,
    }),
    handler: async({ input, ctx }) => {
      const work = await Work.findFirst({
        where: { id: input.workId, authorId: ctx.user.id },
        select: workDetailSelect,
      })

      if (!work) throw createHttpError(404)

      return { work: toWorkDetailOutput(work) }
    },
  })

export default meGetWork
