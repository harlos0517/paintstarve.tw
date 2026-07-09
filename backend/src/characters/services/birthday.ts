import { z } from 'zod'

// Birthdays on the roster only ever carry month/day (no birth year), but
// Character.birthday is a full DateTime column, so a fixed placeholder year
// is used for storage. The wire format (API input/output, CSV) is always
// plain "MM-DD" - the placeholder year is an internal storage detail only.
const PLACEHOLDER_YEAR = 2000
const MONTH_DAY_PATTERN = /^(\d{1,2})-(\d{1,2})$/

export const parseMonthDay = (value: string): Date | null => {
  const match = value.match(MONTH_DAY_PATTERN)
  if (!match) return null

  const month = Number(match[1])
  const day = Number(match[2])
  const date = new Date(Date.UTC(PLACEHOLDER_YEAR, month - 1, day))

  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return date
}

export const formatMonthDay = (date: Date): string => {
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${month}-${day}`
}

export const monthDayInput = z.string().transform((value, ctx) => {
  const date = parseMonthDay(value)
  if (!date) {
    ctx.addIssue({ code: 'custom', message: 'Expected a date in MM-DD format' })
    return z.NEVER
  }
  return date
})
