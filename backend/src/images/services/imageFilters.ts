import { z } from 'zod'

export const imageListFilterInput = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per: z.coerce.number().int().min(1).max(100).default(20),
})

export const adminImageListFilterInput = imageListFilterInput.extend({
  uploadedByUserId: z.string().optional(),
})
