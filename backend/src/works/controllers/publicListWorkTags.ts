import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Tag } from '../../db'

const publicListWorkTags = defaultEndpointsFactory
  .build({
    input: z.object({}),
    output: z.object({
      tags: z.array(z.string()),
    }),
    handler: async() => {
      const tags = await Tag.findMany({
        where: { works: { some: { work: { verifyStatus: 'VERIFIED', show: true } } } },
        select: { name: true },
        orderBy: { name: 'asc' },
      })

      return { tags: tags.map(tag => tag.name) }
    },
  })

export default publicListWorkTags
