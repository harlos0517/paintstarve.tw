import { stringify } from 'csv-stringify/sync'
import { z } from 'zod'

import { formatMonthDay, monthDayInput } from './birthday'

interface CharacterCsvRow {
  id: string
  createdAt: Date
  updatedAt: Date
  season: string
  seatId: string
  userId: string
  role: 'STUDENT' | 'STAFF'
  name: string
  nameEn: string | null
  cardId: string | null
  year: number | null
  class: string | null
  seatRow: number | null
  seatColumn: number | null
  title: string | null
  unit: string | null
  race: string | null
  major: string | null
  birthday: Date | null
  description: string | null
  verified: boolean
  twitter: string | null
}

const CSV_EXPORT_COLUMNS = [
  'id', 'season', 'seatId', 'userId', 'role', 'name', 'nameEn', 'cardId',
  'year', 'class', 'seatRow', 'seatColumn', 'title', 'unit', 'race', 'major',
  'birthday', 'description', 'verified', 'twitter', 'createdAt', 'updatedAt',
] as const

export const stringifyCharactersToCsv = (characters: CharacterCsvRow[]) => {
  const rows = characters.map(character => ({
    id: character.id,
    season: character.season,
    seatId: character.seatId,
    userId: character.userId,
    role: character.role,
    name: character.name,
    nameEn: character.nameEn ?? '',
    cardId: character.cardId ?? '',
    year: character.year ?? '',
    class: character.class ?? '',
    seatRow: character.seatRow ?? '',
    seatColumn: character.seatColumn ?? '',
    title: character.title ?? '',
    unit: character.unit ?? '',
    race: character.race ?? '',
    major: character.major ?? '',
    birthday: character.birthday ? formatMonthDay(character.birthday) : '',
    description: character.description ?? '',
    verified: character.verified ? 'true' : 'false',
    twitter: character.twitter ?? '',
    createdAt: character.createdAt.toISOString(),
    updatedAt: character.updatedAt.toISOString(),
  }))

  return stringify(rows, { header: true, columns: CSV_EXPORT_COLUMNS })
}

// Columns accepted on import. `id` is only used to look up an existing
// character to update; createdAt/updatedAt are managed automatically and
// intentionally left out here, even though they exist on the table.
export const csvImportColumns = [
  'id', 'season', 'seatId', 'userId', 'role', 'name', 'nameEn', 'cardId',
  'year', 'class', 'seatRow', 'seatColumn', 'title', 'unit', 'race', 'major',
  'birthday', 'description', 'verified', 'twitter',
] as const

export const cleanCsvRow = (rawRow: Record<string, string>, allowedColumns: readonly string[]) => {
  const cleaned: Record<string, string> = {}
  for (const column of allowedColumns) {
    const value = rawRow[column]
    if (value !== undefined && value.trim() !== '') cleaned[column] = value.trim()
  }
  return cleaned
}

const upperIfString = (value: unknown) => (typeof value === 'string' ? value.toUpperCase() : value)
const lowerIfString = (value: unknown) => (typeof value === 'string' ? value.toLowerCase() : value)

export const csvRowInput = z.object({
  id: z.string().optional(),
  season: z.string().optional(),
  seatId: z.string().optional(),
  userId: z.string().optional(),
  role: z.preprocess(upperIfString, z.enum(['STUDENT', 'STAFF'])).optional(),
  name: z.string().optional(),
  nameEn: z.string().optional(),
  cardId: z.string().optional(),
  year: z.coerce.number().int().optional(),
  class: z.string().optional(),
  seatRow: z.coerce.number().int().optional(),
  seatColumn: z.coerce.number().int().optional(),
  title: z.string().optional(),
  unit: z.string().optional(),
  race: z.string().optional(),
  major: z.string().optional(),
  birthday: monthDayInput.optional(),
  description: z.string().optional(),
  verified: z.preprocess(
    lowerIfString,
    z.enum(['true', 'false', '1', '0']).transform(value => value === 'true' || value === '1'),
  ).optional(),
  twitter: z.string().optional(),
})

export const formatZodIssues = (error: z.ZodError) =>
  error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ')
