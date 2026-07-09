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
    }),
    handler: async({ input }) => {
      const characters = await Character.findMany({
        where: buildCharacterListWhere(input),
        skip: (input.page - 1) * input.per,
        take: input.per,
        select: characterListSelect,
      })

      return { characters }
    },
  })

export default adminListCharacters
