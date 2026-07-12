import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Work } from '../../db'
import { userAuthMiddleware } from '../../middlewares/auth'
import { adminWorkListFilterInput, buildWorkListWhere } from '../services/workFilters'
import { toWorkDetailOutput, workDetailOutput, workDetailSelect } from '../services/workOutput'

// Reuses adminWorkListFilterInput (adds an optional verifyStatus filter) so
// an owner can filter their own list down to e.g. just PENDING works.
const meListWorks = defaultEndpointsFactory
  .addMiddleware(userAuthMiddleware)
  .build({
    input: adminWorkListFilterInput,
    output: z.object({
      works: z.array(workDetailOutput),
      total: z.number().int(),
    }),
    handler: async({ input, ctx }) => {
      const where = {
        ...buildWorkListWhere(input),
        authorId: ctx.user.id,
        verifyStatus: input.verifyStatus,
      }

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

export default meListWorks
