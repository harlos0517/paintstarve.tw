import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Image, WorkImage } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import { deleteStoredImage } from '../services/r2Storage'

const adminDeleteImage = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    method: 'delete',
    input: z.object({
      imageId: z.string(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
    handler: async({ input }) => {
      const image = await Image.findUnique({
        where: { id: input.imageId },
        select: { storageKey: true },
      })

      if (!image) throw createHttpError(404)

      // WorkImage.imageId is ON DELETE RESTRICT, so deleting an image still
      // attached to a work would otherwise surface as a raw Prisma FK error.
      const workImageCount = await WorkImage.count({ where: { imageId: input.imageId } })
      if (workImageCount > 0) throw createHttpError(409, '此圖片仍被作品使用，請先從作品中移除')

      await Image.delete({ where: { id: input.imageId } })
      await deleteStoredImage(image.storageKey)

      return { success: true }
    },
  })

export default adminDeleteImage
