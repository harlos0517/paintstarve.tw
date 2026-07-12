import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Work } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import { toWorkDetailOutput, workDetailOutput, workDetailSelect } from '../services/workOutput'

const adminGetWork = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: z.object({
      workId: z.string(),
    }),
    output: z.object({
      work: workDetailOutput,
    }),
    handler: async({ input }) => {
      const work = await Work.findUnique({
        where: { id: input.workId },
        select: workDetailSelect,
      })

      if (!work) throw createHttpError(404)

      return { work: toWorkDetailOutput(work) }
    },
  })

export default adminGetWork
