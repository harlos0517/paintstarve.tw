import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import db from '../db'

const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  trustedOrigins: [process.env.FRONTEND_URL!],
  user: {
    additionalFields: {
      role: {
        type: ['USER', 'ADMIN'],
        input: false,
      },
      verifyStatus: {
        type: ['PENDING', 'VERIFIED', 'REJECTED'],
        input: false,
      },
    },
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ['openid', 'email', 'profile'],
    },
  },
})

export default auth
