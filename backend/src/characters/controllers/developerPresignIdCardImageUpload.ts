import { randomUUID } from 'node:crypto'

import createHttpError from 'http-errors'
import { z } from 'zod'

import {
  developerImageUploadEndpointsFactory,
} from '../../apiKeys/services/developerEndpointsFactory'
import { Character, Image } from '../../db'
import { assertUnderIdCardImageLimit } from '../../images/services/imageLimits'
import {
  buildImagePublicUrl,
  buildNewUploadStorageKey,
  IMAGE_EXTENSION_BY_CONTENT_TYPE,
  imageContentTypeInput,
  presignImageUpload,
} from '../../images/services/r2Storage'

// No per-user image count cap here (unlike mePresignIdCardImageUpload) -
// there's no single "acting user" to charge the upload to, same reasoning as
// the CSV importer skipping that cap. uploadedByUserId reflects the
// character's *current* owner (null if unclaimed), never the API caller -
// see README "給未來實作的重要提醒" for why that distinction matters.
const developerPresignIdCardImageUpload = developerImageUploadEndpointsFactory
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
      if (!ctx.apiKey.scopes.includes('characters:write')) throw createHttpError(403)

      const character = await Character.findUnique({
        where: { id: input.characterId },
        select: { id: true, userId: true },
      })
      if (!character) throw createHttpError(404)

      await assertUnderIdCardImageLimit(character.id)

      const extension = IMAGE_EXTENSION_BY_CONTENT_TYPE[input.contentType]
      const storageKey = buildNewUploadStorageKey(`id_card/${randomUUID()}.${extension}`)

      const image = await Image.create({
        data: {
          uploadedByUserId: character.userId,
          idCardForCharacterId: character.id,
          storageKey,
        },
      })

      // New upload always becomes the primary photo, per the developer API's spec.
      await Character.update({
        where: { id: character.id },
        data: { primaryIdCardImageId: image.id },
      })

      const uploadUrl = await presignImageUpload(storageKey, input.contentType)

      return {
        imageId: image.id,
        uploadUrl,
        publicUrl: buildImagePublicUrl(storageKey),
      }
    },
  })

export default developerPresignIdCardImageUpload
