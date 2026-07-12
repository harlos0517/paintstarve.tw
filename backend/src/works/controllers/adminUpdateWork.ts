import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import db, { Work } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import {
  MAX_CHARACTERS_PER_WORK,
  MAX_IMAGES_PER_WORK,
  replaceWorkCharacters,
  replaceWorkImages,
  replaceWorkTags,
  upsertTagsByName,
  validateWorkCharacterIds,
  validateWorkImageIds,
} from '../services/workMutation'

// Deliberately excludes verifyStatus (owned exclusively by
// adminResolveWorkApproval.ts) and does not auto-reset it on content edits
// the way meUpdateWork does - the admin editing IS the review here.
const adminUpdateWork = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: z.object({
      workId: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().nullable().optional(),
      link: z.string().nullable().optional(),
      tagNames: z.array(z.string()).optional(),
      imageIds: z.array(z.string()).max(MAX_IMAGES_PER_WORK).optional(),
      characterIds: z.array(z.string()).max(MAX_CHARACTERS_PER_WORK).optional(),
      show: z.boolean().optional(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input }) => {
      const { workId, title, description, link, tagNames, imageIds, characterIds, show } = input

      const work = await Work.findUnique({
        where: { id: workId },
        select: { authorId: true },
      })
      if (!work) throw createHttpError(404)

      if (imageIds !== undefined) await validateWorkImageIds(work.authorId, imageIds)
      if (characterIds !== undefined) await validateWorkCharacterIds(characterIds)
      const tagIds = tagNames !== undefined ? await upsertTagsByName(tagNames) : undefined

      await db.$transaction(async tx => {
        await tx.work.update({
          where: { id: workId },
          data: { title, description, link, show },
        })

        if (imageIds !== undefined) await replaceWorkImages(tx, workId, imageIds)
        if (characterIds !== undefined) await replaceWorkCharacters(tx, workId, characterIds)
        if (tagIds !== undefined) await replaceWorkTags(tx, workId, tagIds)
      })

      return { success: true }
    },
  })

export default adminUpdateWork
