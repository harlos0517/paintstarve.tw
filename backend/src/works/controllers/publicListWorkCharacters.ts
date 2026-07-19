import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Character } from '../../db'

const publicListWorkCharacters = defaultEndpointsFactory
  .build({
    input: z.object({}),
    output: z.object({
      characters: z.array(z.object({ id: z.string(), name: z.string() })),
    }),
    handler: async() => {
      const characters = await Character.findMany({
        where: { works: { some: { work: { verifyStatus: 'VERIFIED', show: true } } } },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      })

      return { characters }
    },
  })

export default publicListWorkCharacters
