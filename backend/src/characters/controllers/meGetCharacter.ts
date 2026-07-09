import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Character } from '../../db'
import { userAuthMiddleware } from '../../middlewares/auth'
import { characterOutput, characterSelect } from '../services/characterOutput'

const meGetCharacter = defaultEndpointsFactory
  .addMiddleware(userAuthMiddleware)
  .build({
    input: z.object({
      characterId: z.string(),
    }),
    output: z.object({
      character: characterOutput,
    }),
    handler: async({ input, ctx }) => {
      const character = await Character.findFirst({
        where: { id: input.characterId, userId: ctx.user.id },
        select: characterSelect,
      })

      if (!character) throw createHttpError(404)

      return { character }
    },
  })

export default meGetCharacter
