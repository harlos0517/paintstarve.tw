import { randomUUID } from 'node:crypto'

import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Image } from '../../db'
import { userAuthMiddleware } from '../../middlewares/auth'
import { buildImagePublicUrl, presignImageUpload } from '../services/r2Storage'

const EXTENSION_BY_CONTENT_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
} as const

const mePresignImageUpload = defaultEndpointsFactory
  .addMiddleware(userAuthMiddleware)
  .build({
    method: 'post',
    input: z.object({
      contentType: z.enum(
        Object.keys(EXTENSION_BY_CONTENT_TYPE) as (keyof typeof EXTENSION_BY_CONTENT_TYPE)[],
      ),
    }),
    output: z.object({
      imageId: z.string(),
      uploadUrl: z.string(),
      publicUrl: z.string(),
    }),
    handler: async({ input, ctx }) => {
      const storageKey = `images/${randomUUID()}.${EXTENSION_BY_CONTENT_TYPE[input.contentType]}`

      const image = await Image.create({
        data: { uploadedByUserId: ctx.user.id, storageKey },
      })

      const uploadUrl = await presignImageUpload(storageKey, input.contentType)

      return {
        imageId: image.id,
        uploadUrl,
        publicUrl: buildImagePublicUrl(storageKey),
      }
    },
  })

export default mePresignImageUpload
