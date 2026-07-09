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
    }),
    handler: async({ input }) => {
      const characters = await Character.findMany({
        where: buildCharacterListWhere(input),
        skip: (input.page - 1) * input.per,
        take: input.per,
        select: characterSelect,
      })

      return { characters }
    },
  })

export default publicListCharacters
