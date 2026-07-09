import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Character } from '../../db'
import { userAuthMiddleware } from '../../middlewares/auth'
import { buildCharacterListWhere, characterListFilterInput } from '../services/characterFilters'
import { characterListOutput, characterListSelect } from '../services/characterOutput'

const meListCharacters = defaultEndpointsFactory
  .addMiddleware(userAuthMiddleware)
  .build({
    input: characterListFilterInput,
    output: z.object({
      characters: z.array(characterListOutput),
    }),
    handler: async({ input, ctx }) => {
      const characters = await Character.findMany({
        where: {
          ...buildCharacterListWhere(input),
          userId: ctx.user.id,
        },
        skip: (input.page - 1) * input.per,
        take: input.per,
        select: characterListSelect,
      })

      return { characters }
    },
  })

export default meListCharacters
