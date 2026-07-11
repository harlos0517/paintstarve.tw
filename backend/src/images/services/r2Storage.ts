import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'

const bucket = process.env.R2_BUCKET!
const publicUrl = process.env.R2_PUBLIC_URL!
// Lets multiple environments share one bucket without colliding, e.g.
// "dev/" in dev, unset/empty in prod. Only meant for *new* uploads - CSV
// import's fileId-based lookup references pre-existing legacy files at a
// fixed path and must never be prefixed, or it'd stop finding them.
const keyPrefix = process.env.R2_KEY_PREFIX ?? ''

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const UPLOAD_URL_EXPIRY_SECONDS = 5 * 60

export const IMAGE_EXTENSION_BY_CONTENT_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
} as const

export type ImageContentType = keyof typeof IMAGE_EXTENSION_BY_CONTENT_TYPE

export const imageContentTypeInput = z.enum(
  Object.keys(IMAGE_EXTENSION_BY_CONTENT_TYPE) as [ImageContentType, ...ImageContentType[]],
)

export const presignImageUpload = (storageKey: string, contentType: string) =>
  getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: storageKey, ContentType: contentType }),
    { expiresIn: UPLOAD_URL_EXPIRY_SECONDS },
  )

export const deleteStoredImage = async(storageKey: string) => {
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: storageKey }))
}

export const buildImagePublicUrl = (storageKey: string) => `${publicUrl}/${storageKey}`

// For new uploads only - prefixes the key with keyPrefix so dev/prod can
// share a bucket without colliding. Do not use this for keys that reference
// pre-existing objects (e.g. the CSV import's fileId-based id_card lookup).
export const buildNewUploadStorageKey = (path: string) => `${keyPrefix}${path}`
