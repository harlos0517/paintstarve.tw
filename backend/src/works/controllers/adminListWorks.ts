import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Work } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import { adminWorkListFilterInput, buildWorkListWhere } from '../services/workFilters'
import { toWorkDetailOutput, workDetailOutput, workDetailSelect } from '../services/workOutput'

const adminListWorks = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: adminWorkListFilterInput,
    output: z.object({
      works: z.array(workDetailOutput),
      total: z.number().int(),
    }),
    handler: async({ input }) => {
      const where = { ...buildWorkListWhere(input), verifyStatus: input.verifyStatus }

      const [works, total] = await Promise.all([
        Work.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.per,
          take: input.per,
          select: workDetailSelect,
        }),
        Work.count({ where }),
      ])

      return { works: works.map(toWorkDetailOutput), total }
    },
  })

export default adminListWorks
