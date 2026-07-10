import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { CharacterClaimRequest } from '../../db'
import { authenticatedMiddleware } from '../../middlewares/auth'

const meListCharacterClaims = defaultEndpointsFactory
  .addMiddleware(authenticatedMiddleware)
  .build({
    input: z.object({}),
    output: z.object({
      claims: z.array(z.object({
        id: z.string(),
        status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
        character: z.object({
          id: z.string(),
          name: z.string(),
          seatId: z.string(),
          season: z.string(),
          role: z.enum(['STUDENT', 'STAFF']),
          year: z.number().int().nullable(),
          class: z.string().nullable(),
          unit: z.string().nullable(),
          title: z.string().nullable(),
        }),
      })),
    }),
    handler: async({ ctx }) => {
      const claims = await CharacterClaimRequest.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          character: {
            select: {
              id: true,
              name: true,
              seatId: true,
              season: true,
              role: true,
              year: true,
              class: true,
              unit: true,
              title: true,
            },
          },
        },
      })

      return { claims }
    },
  })

export default meListCharacterClaims
