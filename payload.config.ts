import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    user: 'users',
  },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [],
    },
    {
      slug: 'students',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'nameEn', type: 'text' },
        { name: 'studentId', type: 'text' },
        { name: 'year', type: 'number' },
        { name: 'class', type: 'text' },
        { name: 'gender', type: 'text' },
        { name: 'race', type: 'text' },
        { name: 'major', type: 'text' },
        { name: 'seatRow', type: 'number' },
        { name: 'seatColumn', type: 'number' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
})
