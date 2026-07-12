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
import mePresignIdCardImageUpload from './characters/controllers/mePresignIdCardImageUpload.js'
import meUpdateCharacter from './characters/controllers/meUpdateCharacter.js'
import meUpdateCharacterIdCardDisplay
  from './characters/controllers/meUpdateCharacterIdCardDisplay.js'
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
import adminDeleteWork from './works/controllers/adminDeleteWork.js'
import adminGetWork from './works/controllers/adminGetWork.js'
import adminListWorks from './works/controllers/adminListWorks.js'
import adminResolveWorkApproval from './works/controllers/adminResolveWorkApproval.js'
import adminUpdateWork from './works/controllers/adminUpdateWork.js'
import meCreateWork from './works/controllers/meCreateWork.js'
import meDeleteWork from './works/controllers/meDeleteWork.js'
import meGetWork from './works/controllers/meGetWork.js'
import meListWorks from './works/controllers/meListWorks.js'
import meUpdateWork from './works/controllers/meUpdateWork.js'
import publicGetWork from './works/controllers/publicGetWork.js'
import publicListWorks from './works/controllers/publicListWorks.js'
import publicListWorkTags from './works/controllers/publicListWorkTags.js'

const routing: Routing = {
  '/api/v1': {
    public: {
      characters: {
        '/': publicListCharacters,
        ':characterId': publicGetCharacter,
      },
      works: {
        '/': publicListWorks,
        tags: publicListWorkTags,
        ':workId': publicGetWork,
      },
    },
    me: {
      characters: {
        '/': meListCharacters,
        ':characterId': {
          '/': {
            get: meGetCharacter,
            patch: meUpdateCharacter,
          },
          'id-card-images': {
            'presign-upload': mePresignIdCardImageUpload,
          },
          'id-card-display': meUpdateCharacterIdCardDisplay,
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
      works: {
        '/': {
          get: meListWorks,
          post: meCreateWork,
        },
        ':workId': {
          get: meGetWork,
          patch: meUpdateWork,
          delete: meDeleteWork,
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
      works: {
        '/': adminListWorks,
        ':workId': {
          '/': {
            get: adminGetWork,
            patch: adminUpdateWork,
            delete: adminDeleteWork,
          },
          approval: adminResolveWorkApproval,
        },
      },
    },
  },
}

export default routing
