import { parse } from 'csv-parse/sync'
import { defaultEndpointsFactory, ez } from 'express-zod-api'
import { z } from 'zod'

import { Character } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import {
  cleanCsvRow, csvImportColumns, csvRowInput, formatZodIssues,
} from '../services/characterCsv'

const adminImportCharactersCsv = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    method: 'post',
    input: z.object({
      file: ez.upload(),
    }),
    output: z.object({
      created: z.number().int(),
      updated: z.number().int(),
      errors: z.array(z.object({
        row: z.number().int(),
        message: z.string(),
      })),
    }),
    handler: async({ input, ctx }) => {
      const records: Record<string, string>[] = parse(input.file.data, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })

      let created = 0
      let updated = 0
      const errors: { row: number, message: string }[] = []

      for (const [index, rawRow] of records.entries()) {
        const row = index + 2 // account for the header line

        const parsed = csvRowInput.safeParse(cleanCsvRow(rawRow, csvImportColumns))
        if (!parsed.success) {
          errors.push({ row, message: formatZodIssues(parsed.error) })
          continue
        }

        const { id, userId, ...rest } = parsed.data
        const existing = id ? await Character.findUnique({ where: { id } }) : null

        if (existing) {
          await Character.update({
            where: { id: existing.id },
            data: {
              ...rest,
              ...(userId ? { userId } : {}),
            },
          })
          updated += 1
          continue
        }

        if (!rest.season || !rest.seatId || !rest.name) {
          const missing = []
          if (!rest.season) missing.push('season')
          if (!rest.seatId) missing.push('seatId')
          if (!rest.name) missing.push('name')
          errors.push({
            row,
            message: `Missing required fields: ${missing.join(', ')}`,
          })
          continue
        }

        await Character.create({
          data: {
            ...rest,
            season: rest.season,
            seatId: rest.seatId,
            name: rest.name,
            userId: userId ?? ctx.user.id,
          },
        })
        created += 1
      }

      return { created, updated, errors }
    },
  })

export default adminImportCharactersCsv
