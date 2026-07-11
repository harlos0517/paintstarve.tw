import { parse } from 'csv-parse/sync'
import { defaultEndpointsFactory, ez } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Character, Image } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import {
  cleanCsvRow, csvImportColumns, csvRowInput, formatZodIssues,
} from '../services/characterCsv'

// `fileId` isn't a Character column - it's the legacy spreadsheet's reference
// to the character's ID card scan, already sitting in R2 at id_card/{fileId}.jpg.
// Handled separately from csvImportColumns/csvRowInput since it doesn't map
// onto the Character table at all. Upserting on storageKey (which is unique)
// keeps re-imports idempotent instead of erroring on a duplicate key.
//
// uploadedByUserId tracks the character's *current owner* (null if
// unclaimed) - not the admin running the import. Otherwise every legacy scan
// would be permanently attributed to whoever happened to import the CSV,
// the same mistake already fixed once for Character.userId.
const linkIdCardImage = async(
  characterId: string, fileId: string | undefined, uploadedByUserId: string | null,
) => {
  if (!fileId) return

  const storageKey = `id_card/${fileId}.jpg`
  await Image.upsert({
    where: { storageKey },
    create: { storageKey, uploadedByUserId, idCardForCharacterId: characterId },
    update: { idCardForCharacterId: characterId, uploadedByUserId },
  })
}

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
    handler: async({ input }) => {
      let records: Record<string, string>[]
      try {
        records = parse(input.file.data, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      } catch(err) {
        const message = err instanceof Error ? err.message : String(err)
        throw createHttpError(400, `無法解析 CSV 檔案：${message}`)
      }

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

        try {
          // Fall back to (season, seatId) when id is not present
          const existing = id
            ? await Character.findUnique({ where: { id } })
            : rest.season && rest.seatId
              ? await Character.findUnique({
                where: { season_seatId: { season: rest.season, seatId: rest.seatId } },
              })
              : null

          if (existing) {
            await Character.update({
              where: { id: existing.id },
              data: {
                ...rest,
                ...(userId ? { userId } : {}),
              },
            })
            await linkIdCardImage(existing.id, rawRow.fileId?.trim(), userId ?? existing.userId)
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

          const character = await Character.create({
            data: {
              ...rest,
              season: rest.season,
              seatId: rest.seatId,
              name: rest.name,
              userId,
            },
          })
          await linkIdCardImage(character.id, rawRow.fileId?.trim(), character.userId)
          created += 1
        } catch(err) {
          errors.push({ row, message: err instanceof Error ? err.message : String(err) })
        }
      }

      return { created, updated, errors }
    },
  })

export default adminImportCharactersCsv
