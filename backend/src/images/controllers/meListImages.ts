import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Image } from '../../db'
import { userAuthMiddleware } from '../../middlewares/auth'
import { imageListFilterInput } from '../services/imageFilters'
import { imageOutput, imageSelect, toImageOutput } from '../services/imageOutput'

const meListImages = defaultEndpointsFactory
  .addMiddleware(userAuthMiddleware)
  .build({
    input: imageListFilterInput,
    output: z.object({
      images: z.array(imageOutput),
      total: z.number().int(),
    }),
    handler: async({ input, ctx }) => {
      const where = { uploadedByUserId: ctx.user.id }

      const [images, total] = await Promise.all([
        Image.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.per,
          take: input.per,
          select: imageSelect,
        }),
        Image.count({ where }),
      ])

      return { images: images.map(toImageOutput), total }
    },
  })

export default meListImages
