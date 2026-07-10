import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Character } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import { buildCharacterListWhere, characterListFilterInput } from '../services/characterFilters'
import { characterListOutput, characterListSelect } from '../services/characterOutput'

const adminListCharacters = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: characterListFilterInput,
    output: z.object({
      characters: z.array(characterListOutput),
      total: z.number().int(),
    }),
    handler: async({ input }) => {
      const where = buildCharacterListWhere(input)

      const [characters, total] = await Promise.all([
        Character.findMany({
          where,
          skip: (input.page - 1) * input.per,
          take: input.per,
          select: characterListSelect,
        }),
        Character.count({ where }),
      ])

      return { characters, total }
    },
  })

export default adminListCharacters
