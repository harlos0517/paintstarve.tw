import { randomUUID } from 'node:crypto'

import { defaultEndpointsFactory } from 'express-zod-api'
import createHttpError from 'http-errors'
import { z } from 'zod'

import {
  assertUnderIdCardImageLimit, assertUnderUserImageLimit,
} from '../../images/services/imageLimits'
import {
  buildImagePublicUrl,
  buildNewUploadStorageKey,
  IMAGE_EXTENSION_BY_CONTENT_TYPE,
  imageContentTypeInput,
  presignImageUpload,
} from '../../images/services/r2Storage'
import { Character, Image } from '../../db'
import { userAuthMiddleware } from '../../middlewares/auth'

const mePresignIdCardImageUpload = defaultEndpointsFactory
  .addMiddleware(userAuthMiddleware)
  .build({
    method: 'post',
    input: z.object({
      characterId: z.string(),
      contentType: imageContentTypeInput,
    }),
    output: z.object({
      imageId: z.string(),
      uploadUrl: z.string(),
      publicUrl: z.string(),
    }),
    handler: async({ input, ctx }) => {
      const character = await Character.findFirst({
        where: { id: input.characterId, userId: ctx.user.id },
        select: { id: true },
      })
      if (!character) throw createHttpError(404)

      await assertUnderUserImageLimit(ctx.user.id)
      await assertUnderIdCardImageLimit(character.id)

      const extension = IMAGE_EXTENSION_BY_CONTENT_TYPE[input.contentType]
      const storageKey = buildNewUploadStorageKey(`id_card/${randomUUID()}.${extension}`)

      const image = await Image.create({
        data: {
          uploadedByUserId: ctx.user.id,
          idCardForCharacterId: character.id,
          storageKey,
        },
      })

      const uploadUrl = await presignImageUpload(storageKey, input.contentType)

      return {
        imageId: image.id,
        uploadUrl,
        publicUrl: buildImagePublicUrl(storageKey),
      }
    },
  })

export default mePresignIdCardImageUpload
