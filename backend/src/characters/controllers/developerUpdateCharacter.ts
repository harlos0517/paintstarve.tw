import createHttpError from 'http-errors'
import { z } from 'zod'

import { developerUpdateEndpointsFactory } from '../../apiKeys/services/developerEndpointsFactory'
import { Character } from '../../db'
import { monthDayInput } from '../services/birthday'

// Same editable field set as meUpdateCharacter, plus cardId - deliberately
// excludes name/class/year/verified/season/seatId and the id-card image
// fields, which stay admin/import/claim-controlled.
const developerUpdateCharacter = developerUpdateEndpointsFactory
  .build({
    method: 'patch',
    input: z.object({
      characterId: z.string(),
      nameEn: z.string().nullable().optional(),
      cardId: z.string().nullable().optional(),
      title: z.string().nullable().optional(),
      unit: z.string().nullable().optional(),
      race: z.string().nullable().optional(),
      major: z.string().nullable().optional(),
      birthday: monthDayInput.nullable().optional(),
      description: z.string().nullable().optional(),
      twitter: z.string().nullable().optional(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input, ctx }) => {
      if (!ctx.apiKey.scopes.includes('characters:write')) throw createHttpError(403)

      const { characterId, ...data } = input

      const { count } = await Character.updateMany({
        where: { id: characterId },
        data,
      })

      if (count === 0) throw createHttpError(404)

      return { success: true }
    },
  })

export default developerUpdateCharacter
