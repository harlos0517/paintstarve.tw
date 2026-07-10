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
      total: z.number().int(),
    }),
    handler: async({ input, ctx }) => {
      const where = { ...buildCharacterListWhere(input), userId: ctx.user.id }

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

export default meListCharacters
