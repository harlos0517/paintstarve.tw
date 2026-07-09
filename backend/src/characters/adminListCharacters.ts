import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Character } from '../db'
import { adminAuthMiddleware } from '../middlewares/auth'

const adminListCharacters = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: z.object({
      name: z.string().optional(),
      page: z.number().int().min(1).default(1),
      per: z.number().int().min(1).max(100).default(10),
    }),
    output: z.object({
      characters: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        }),
      ),
    }),
    handler: async({ input }) => {
      const characters = await Character.findMany({
        where: {
          name: input.name ? { contains: input.name } : undefined,
        },
        skip: (input.page - 1) * input.per,
        take: input.per,
        select: {
          id: true,
          name: true,
        },
      })

      return { characters }
    },
  })

export default adminListCharacters
