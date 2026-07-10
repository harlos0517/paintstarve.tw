import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Character } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import {
  characterDetailOutput,
  characterDetailSelect,
  toCharacterOutput,
} from '../services/characterOutput'

const adminGetCharacter = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: z.object({
      characterId: z.string(),
    }),
    output: z.object({
      character: characterDetailOutput,
    }),
    handler: async({ input }) => {
      const character = await Character.findUnique({
        where: { id: input.characterId },
        select: characterDetailSelect,
      })

      if (!character) throw createHttpError(404)

      return { character: toCharacterOutput(character) }
    },
  })

export default adminGetCharacter
