import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import db from '../../db'
import { userAuthMiddleware } from '../../middlewares/auth'
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

const meCreateWork = defaultEndpointsFactory
  .addMiddleware(userAuthMiddleware)
  .build({
    method: 'post',
    input: z.object({
      title: z.string().min(1),
      description: z.string().nullable().optional(),
      link: z.string().nullable().optional(),
      tagNames: z.array(z.string()).optional(),
      imageIds: z.array(z.string()).max(MAX_IMAGES_PER_WORK).optional(),
      characterIds: z.array(z.string()).max(MAX_CHARACTERS_PER_WORK).optional(),
    }),
    output: z.object({
      workId: z.string(),
    }),
    handler: async({ input, ctx }) => {
      const imageIds = input.imageIds ?? []
      const characterIds = input.characterIds ?? []

      await validateWorkImageIds(ctx.user.id, imageIds)
      await validateWorkCharacterIds(characterIds)
      const tagIds = await upsertTagsByName(input.tagNames ?? [])

      const workId = await db.$transaction(async tx => {
        const work = await tx.work.create({
          data: {
            title: input.title,
            description: input.description,
            link: input.link,
            authorId: ctx.user.id,
          },
        })

        await replaceWorkImages(tx, work.id, imageIds)
        await replaceWorkCharacters(tx, work.id, characterIds)
        await replaceWorkTags(tx, work.id, tagIds)

        return work.id
      })

      return { workId }
    },
  })

export default meCreateWork
