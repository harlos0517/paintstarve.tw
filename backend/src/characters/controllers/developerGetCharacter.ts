import createHttpError from 'http-errors'
import { z } from 'zod'

import { developerReadEndpointsFactory } from '../../apiKeys/services/developerEndpointsFactory'
import { Character } from '../../db'
import { characterOutput, characterSelect, toCharacterOutput } from '../services/characterOutput'

const developerGetCharacter = developerReadEndpointsFactory
  .build({
    input: z.object({
      characterId: z.string(),
    }),
    output: z.object({
      character: characterOutput,
    }),
    handler: async({ input, ctx }) => {
      if (!ctx.apiKey.scopes.includes('characters:read')) throw createHttpError(403)

      const character = await Character.findUnique({
        where: { id: input.characterId },
        select: characterSelect,
      })

      if (!character) throw createHttpError(404)

      return { character: toCharacterOutput(character) }
    },
  })

export default developerGetCharacter
