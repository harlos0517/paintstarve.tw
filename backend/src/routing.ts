import { type Routing } from 'express-zod-api'

import adminListCharacterClaims from './characterClaims/controllers/adminListCharacterClaims.js'
import adminResolveCharacterClaim from './characterClaims/controllers/adminResolveCharacterClaim.js'
import meCreateCharacterClaim from './characterClaims/controllers/meCreateCharacterClaim.js'
import meDeleteCharacterClaim from './characterClaims/controllers/meDeleteCharacterClaim.js'
import meListCharacterClaims from './characterClaims/controllers/meListCharacterClaims.js'
import adminExportCharactersCsv from './characters/controllers/adminExportCharactersCsv.js'
import adminGetCharacter from './characters/controllers/adminGetCharacter.js'
import adminImportCharactersCsv from './characters/controllers/adminImportCharactersCsv.js'
import adminListCharacters from './characters/controllers/adminListCharacters.js'
import adminUpdateCharacter from './characters/controllers/adminUpdateCharacter.js'
import meGetCharacter from './characters/controllers/meGetCharacter.js'
import meListCharacters from './characters/controllers/meListCharacters.js'
import meUpdateCharacter from './characters/controllers/meUpdateCharacter.js'
import publicGetCharacter from './characters/controllers/publicGetCharacter.js'
import publicListCharacters from './characters/controllers/publicListCharacters.js'
import adminDeleteImage from './images/controllers/adminDeleteImage.js'
import adminListImages from './images/controllers/adminListImages.js'
import meDeleteImage from './images/controllers/meDeleteImage.js'
import meListImages from './images/controllers/meListImages.js'
import mePresignImageUpload from './images/controllers/mePresignImageUpload.js'
import adminAdjustUserRoles from './users/controllers/adminAdjustUserRoles.js'
import adminApproveUser from './users/controllers/adminApproveUser.js'
import adminListUsers from './users/controllers/adminListUsers.js'

const routing: Routing = {
  '/api/v1': {
    public: {
      characters: {
        '/': publicListCharacters,
        ':characterId': publicGetCharacter,
      },
    },
    me: {
      characters: {
        '/': meListCharacters,
        ':characterId': {
          get: meGetCharacter,
          patch: meUpdateCharacter,
        },
      },
      'character-claims': {
        '/': {
          get: meListCharacterClaims,
          post: meCreateCharacterClaim,
        },
        ':claimId': {
          delete: meDeleteCharacterClaim,
        },
      },
      images: {
        '/': meListImages,
        'presign-upload': mePresignImageUpload,
        ':imageId': {
          delete: meDeleteImage,
        },
      },
    },
    admin: {
      users: {
        '/': adminListUsers,
        ':userId': {
          approval: adminApproveUser,
          role: adminAdjustUserRoles,
        },
      },
      characters: {
        '/': adminListCharacters,
        export: adminExportCharactersCsv,
        import: adminImportCharactersCsv,
        ':characterId': {
          get: adminGetCharacter,
          patch: adminUpdateCharacter,
        },
      },
      'character-claims': {
        '/': adminListCharacterClaims,
        ':claimId': {
          patch: adminResolveCharacterClaim,
        },
      },
      images: {
        '/': adminListImages,
        ':imageId': {
          delete: adminDeleteImage,
        },
      },
    },
  },
}

export default routing

// TODO API

// GET /api/v1/public/works - List all works (public) with filter and pagination support
// GET /api/v1/public/works/:workId - Get work details (public)

// GET /api/v1/me/works - List all works the user has access to
// GET /api/v1/me/works/:workId - Get work details the user has access to
// PATCH /api/v1/me/works/:workId - Update work details the user has access to
// DELETE /api/v1/me/works/:workId - Delete a work the user has access to

// GET /api/v1/admin/works - List all works (admin) with filter and pagination support
// GET /api/v1/admin/works/:workId - Get work details (admin)
// PATCH /api/v1/admin/works/:workId - Update any work details
// PATCH /api/v1/admin/works/:workId/approval - Approve or reject a work
// DELETE /api/v1/admin/works/:workId - Delete a work
