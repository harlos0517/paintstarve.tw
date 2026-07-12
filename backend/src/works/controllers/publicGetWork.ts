import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Work } from '../../db'
import { toWorkOutput, workOutput, workSelect } from '../services/workOutput'

const publicGetWork = defaultEndpointsFactory
  .build({
    input: z.object({
      workId: z.string(),
    }),
    output: z.object({
      work: workOutput,
    }),
    handler: async({ input }) => {
      const work = await Work.findFirst({
        where: { id: input.workId, verifyStatus: 'VERIFIED', show: true },
        select: workSelect,
      })

      if (!work) throw createHttpError(404)

      return { work: toWorkOutput(work) }
    },
  })

export default publicGetWork
