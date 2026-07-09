import { z } from 'zod'

// Query-string params always arrive as strings (over GET), so numbers and
// booleans need explicit coercion/parsing rather than plain z.number()/z.boolean().
const booleanQueryParam = z.enum(['true', 'false']).transform(value => value === 'true')

export const characterListFilterInput = z.object({
  name: z.string().optional(),
  role: z.enum(['STUDENT', 'STAFF']).optional(),
  verified: booleanQueryParam.optional(),
  year: z.coerce.number().int().optional(),
  class: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  per: z.coerce.number().int().min(1).max(100).default(10),
})

type CharacterListFilters = Pick<
  z.infer<typeof characterListFilterInput>,
  'name' | 'role' | 'verified' | 'year' | 'class'
>

export const buildCharacterListWhere = (input: CharacterListFilters) => ({
  name: input.name ? { contains: input.name } : undefined,
  role: input.role,
  verified: input.verified,
  year: input.year,
  class: input.class,
})
