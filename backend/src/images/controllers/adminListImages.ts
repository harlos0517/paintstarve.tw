import { defaultEndpointsFactory } from 'express-zod-api'
import { z } from 'zod'

import { Image } from '../../db'
import { adminAuthMiddleware } from '../../middlewares/auth'
import { adminImageListFilterInput } from '../services/imageFilters'
import { imageDetailOutput, imageDetailSelect, toImageDetailOutput } from '../services/imageOutput'

const adminListImages = defaultEndpointsFactory
  .addMiddleware(adminAuthMiddleware)
  .build({
    input: adminImageListFilterInput,
    output: z.object({
      images: z.array(imageDetailOutput),
      total: z.number().int(),
    }),
    handler: async({ input }) => {
      const where = { uploadedByUserId: input.uploadedByUserId }

      const [images, total] = await Promise.all([
        Image.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: (input.page - 1) * input.per,
          take: input.per,
          select: imageDetailSelect,
        }),
        Image.count({ where }),
      ])

      return { images: images.map(toImageDetailOutput), total }
    },
  })

export default adminListImages
