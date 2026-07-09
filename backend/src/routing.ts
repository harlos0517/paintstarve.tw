import { type Routing } from 'express-zod-api'

import adminListCharacters from './characters/adminListCharacters.js'
import adminAdjustUserRoles from './users/adminAdjustUserRoles.js'
import adminApproveUser from './users/adminApproveUser.js'
import adminListUsers from './users/adminListUsers.js'

const routing: Routing = {
  '/api/v1': {
    admin: {
      users: {
        '/': adminListUsers,
        ':userId': {
          'PATCH /approval': adminApproveUser,
          'PATCH /role': adminAdjustUserRoles,
        },
      },
      characters: {
        '/': adminListCharacters,
      },
    },
  },
}

export default routing
