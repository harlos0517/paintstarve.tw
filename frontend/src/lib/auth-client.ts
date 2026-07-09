import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) throw new Error('VITE_API_URL missing.')

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: ['USER', 'ADMIN'], input: false },
        verifyStatus: {
          type: ['PENDING', 'VERIFIED', 'REJECTED'],
          input: false,
        },
      },
    }),
  ],
})
