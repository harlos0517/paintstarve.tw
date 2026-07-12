import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Work } from '../../db'
import { buildWorkListWhere, workListFilterInput } from '../services/workFilters'
import { toWorkOutput, workOutput, workSelect } from '../services/workOutput'

const publicListWorks = defaultEndpointsFactory
  .build({
    input: workListFilterInput,
    output: z.object({
      works: z.array(workOutput),
      total: z.number().int(),
    }),
    handler: async({ input }) => {
      const where = { ...buildWorkListWhere(input), verifyStatus: 'VERIFIED' as const, show: true }

      const [works, total] = await Promise.all([
        Work.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.per,
          take: input.per,
          select: workSelect,
        }),
        Work.count({ where }),
      ])

      return { works: works.map(toWorkOutput), total }
    },
  })

export default publicListWorks
