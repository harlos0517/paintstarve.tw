import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import { Image } from '../../db'
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

      await Image.delete({ where: { id: input.imageId } })
      await deleteStoredImage(image.storageKey)

      return { success: true }
    },
  })

export default adminDeleteImage
