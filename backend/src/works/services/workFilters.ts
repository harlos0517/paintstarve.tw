import { z } from 'zod'

export const workListFilterInput = z.object({
  title: z.string().optional(),
  tag: z.string().optional(),
  authorId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  per: z.coerce.number().int().min(1).max(100).default(10),
})

export const adminWorkListFilterInput = workListFilterInput.extend({
  verifyStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).optional(),
})

type WorkListFilters = Pick<
  z.infer<typeof workListFilterInput>, 'title' | 'tag' | 'authorId'
>

export const buildWorkListWhere = (input: WorkListFilters) => ({
  title: input.title ? { contains: input.title } : undefined,
  authorId: input.authorId,
  tags: input.tag ? { some: { tag: { name: input.tag } } } : undefined,
})
