import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const bucket = process.env.R2_BUCKET!
const publicUrl = process.env.R2_PUBLIC_URL!

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const UPLOAD_URL_EXPIRY_SECONDS = 5 * 60

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
