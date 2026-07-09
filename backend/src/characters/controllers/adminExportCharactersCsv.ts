import { z } from 'zod'

import { Character } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import { characterSelect } from '../services/characterOutput'
import { stringifyCharactersToCsv } from '../services/characterCsv'
import { csvEndpointsFactory } from '../services/csvResultHandler'

const adminExportCharactersCsv = csvEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    method: 'get',
    input: z.object({}),
    output: z.object({
      csv: z.string(),
    }),
    handler: async() => {
      const characters = await Character.findMany({ select: characterSelect })

      return { csv: stringifyCharactersToCsv(characters) }
    },
  })

export default adminExportCharactersCsv
