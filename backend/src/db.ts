import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export default prisma

export const User = prisma.user
export const Session = prisma.session
export const Account = prisma.account
export const Verification = prisma.verification

export const Character = prisma.character
export const CharacterClaimRequest = prisma.characterClaimRequest
export const Image = prisma.image
export const Work = prisma.work
export const WorkImage = prisma.workImage
export const WorkCharacter = prisma.workCharacter

export {
  CharacterClaimStatus,
  CharacterRole,
  UserRole,
  UserVerifiedStatus,
} from '../generated/prisma/enums'

