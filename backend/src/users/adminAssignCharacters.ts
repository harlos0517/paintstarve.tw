import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { User } from '../db'
import { adminAuthMiddleware } from '../middlewares/auth'

const adminAssignCharacters = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: z.object({
      userId: z.string(),
      characterIds: z.array(z.string()),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input }) => {
      const { userId, characterIds } = input

      await User.updateMany({
        where: { id: userId },
        data: { characterIds },
      })

      return { success: true }
    },
  })

export default adminAssignCharacters
