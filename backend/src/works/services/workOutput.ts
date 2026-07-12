import { ez } from 'express-zod-api'
import { z } from 'zod'

import { buildImagePublicUrl } from '../../images/services/r2Storage'

// Work's public output is already lean (at most 10 image URLs, 50 character
// stubs, a handful of tag names), unlike Character - so unlike
// characterOutput.ts there's no need for a separate light "list" projection,
// list endpoints just reuse workSelect/workOutput.
export const workSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  description: true,
  link: true,
  author: {
    select: { id: true, name: true },
  },
  images: {
    select: { image: { select: { storageKey: true } } },
    orderBy: { position: 'asc' },
  },
  characters: {
    select: { character: { select: { id: true, name: true } } },
  },
  tags: {
    select: { tag: { select: { name: true } } },
  },
} as const

export const workOutput = z.object({
  id: z.string(),
  createdAt: ez.dateOut(),
  updatedAt: ez.dateOut(),
  title: z.string(),
  description: z.string().nullable(),
  link: z.string().nullable(),
  author: z.object({ id: z.string(), name: z.string() }),
  imageUrls: z.array(z.string()),
  characters: z.array(z.object({ id: z.string(), name: z.string() })),
  tags: z.array(z.string()),
})

type WorkRow = {
  id: string
  createdAt: Date
  updatedAt: Date
  title: string
  description: string | null
  link: string | null
  author: { id: string, name: string }
  images: { image: { storageKey: string } }[]
  characters: { character: { id: string, name: string } }[]
  tags: { tag: { name: string } }[]
}

export const toWorkOutput = (work: WorkRow) => ({
  id: work.id,
  createdAt: work.createdAt,
  updatedAt: work.updatedAt,
  title: work.title,
  description: work.description,
  link: work.link,
  author: work.author,
  imageUrls: work.images.map(({ image }) => buildImagePublicUrl(image.storageKey)),
  characters: work.characters.map(({ character }) => character),
  tags: work.tags.map(({ tag }) => tag.name),
})

// Owner/admin-only: real author email, moderation fields, and real image ids
// (so the owner's management UI has something to reorder/delete).
export const workDetailSelect = {
  ...workSelect,
  verifyStatus: true,
  show: true,
  author: {
    select: { id: true, name: true, email: true },
  },
  images: {
    select: { image: { select: { id: true, storageKey: true } } },
    orderBy: { position: 'asc' },
  },
} as const

export const workDetailOutput = workOutput.extend({
  author: z.object({ id: z.string(), name: z.string(), email: z.string() }),
  verifyStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']),
  show: z.boolean(),
  images: z.array(z.object({ id: z.string(), url: z.string() })),
})

type WorkDetailRow = Omit<WorkRow, 'author' | 'images'> & {
  author: { id: string, name: string, email: string }
  verifyStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  show: boolean
  images: { image: { id: string, storageKey: string } }[]
}

export const toWorkDetailOutput = (work: WorkDetailRow) => ({
  ...toWorkOutput(work),
  author: work.author,
  verifyStatus: work.verifyStatus,
  show: work.show,
  images: work.images.map(({ image }) => ({
    id: image.id,
    url: buildImagePublicUrl(image.storageKey),
  })),
})
