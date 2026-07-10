import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Character } from '../../db'
import { buildCharacterListWhere, characterListFilterInput } from '../services/characterFilters'
import { characterOutput, characterSelect } from '../services/characterOutput'

const publicListCharacters = defaultEndpointsFactory
  .build({
    input: characterListFilterInput,
    output: z.object({
      characters: z.array(characterOutput),
      total: z.number().int(),
    }),
    handler: async({ input }) => {
      const where = buildCharacterListWhere(input)

      const [characters, total] = await Promise.all([
        Character.findMany({
          where,
          skip: (input.page - 1) * input.per,
          take: input.per,
          select: characterSelect,
        }),
        Character.count({ where }),
      ])

      return { characters, total }
    },
  })

export default publicListCharacters
