import createHttpError from 'http-errors'
import { z } from 'zod'

import { developerReadEndpointsFactory } from '../../apiKeys/services/developerEndpointsFactory'
import {
  characterOutput, characterSelect, toCharacterOutput,
} from '../../characters/services/characterOutput'
import { Character, User } from '../../db'

const developerFindUserCharacters = developerReadEndpointsFactory
  .build({
    input: z.object({
      email: z.email(),
    }),
    output: z.object({
      userId: z.string(),
      characters: z.array(characterOutput),
    }),
    handler: async({ input, ctx }) => {
      if (!ctx.apiKey.scopes.includes('characters:read')) throw createHttpError(403)

      const user = await User.findUnique({ where: { email: input.email }, select: { id: true } })
      if (!user) throw createHttpError(404)

      const characters = await Character.findMany({
        where: { userId: user.id },
        select: characterSelect,
      })

      return { userId: user.id, characters: characters.map(toCharacterOutput) }
    },
  })

export default developerFindUserCharacters
