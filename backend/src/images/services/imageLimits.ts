import createHttpError from 'http-errors'

import { Image } from '../../db'

export const MAX_ID_CARD_IMAGES_PER_CHARACTER = 5
export const MAX_IMAGES_PER_USER = 100

export const assertUnderIdCardImageLimit = async(characterId: string) => {
  const count = await Image.count({ where: { idCardForCharacterId: characterId } })
  if (count >= MAX_ID_CARD_IMAGES_PER_CHARACTER)
    throw createHttpError(409, `每個角色最多只能有 ${MAX_ID_CARD_IMAGES_PER_CHARACTER} 張證件照`)
}

export const assertUnderUserImageLimit = async(userId: string) => {
  const count = await Image.count({ where: { uploadedByUserId: userId } })
  if (count >= MAX_IMAGES_PER_USER)
    throw createHttpError(429, `圖片數量已達上限（${MAX_IMAGES_PER_USER} 張），請先刪除不需要的圖片`)
}
