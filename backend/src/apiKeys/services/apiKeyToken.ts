import { createHash, randomBytes } from 'crypto'

// Shown to the user once at creation time, then only kept as keyPrefix/hashedKey in the DB.
const KEY_PREFIX_LENGTH = 'ak_live_'.length + 4

export const hashApiKeyToken = (token: string) =>
  createHash('sha256').update(token).digest('hex')

export const generateApiKeyToken = () => {
  const token = `ak_live_${randomBytes(24).toString('base64url')}`
  return {
    token,
    keyPrefix: token.slice(0, KEY_PREFIX_LENGTH),
    hashedKey: hashApiKeyToken(token),
  }
}
