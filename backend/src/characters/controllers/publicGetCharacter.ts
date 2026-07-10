import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Character } from '../../db'
import { characterOutput, characterSelect, toCharacterOutput } from '../services/characterOutput'

const publicGetCharacter = defaultEndpointsFactory
  .build({
    input: z.object({
      characterId: z.string(),
    }),
    output: z.object({
      character: characterOutput,
    }),
    handler: async({ input }) => {
      const character = await Character.findUnique({
        where: { id: input.characterId },
        select: characterSelect,
      })

      if (!character) throw createHttpError(404)

      return { character: toCharacterOutput(character) }
    },
  })

export default publicGetCharacter
