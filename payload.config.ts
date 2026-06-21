import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { exportStudentsCSV, importStudentsCSV } from './src/collections/students/csvHandlers'

export default buildConfig({
  admin: {
    user: 'users',
    components: {
      afterNavLinks: [
        '@/components/admin/StudentsCSVNavLink',
      ],
      views: {
        studentsCSV: {
          Component: '@/components/admin/StudentsCSVView',
          path: '/students-csv',
        },
      },
    },
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
      endpoints: [
        { path: '/export-csv', method: 'get', handler: exportStudentsCSV },
        { path: '/import-csv', method: 'post', handler: importStudentsCSV },
      ],
      access: {
        delete: () => true,
      },
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
