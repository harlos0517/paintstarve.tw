import createHttpError from 'http-errors'

import { Prisma } from '../../../generated/prisma/client'
import { Character, Image, Tag } from '../../db'

export const MAX_IMAGES_PER_WORK = 10
export const MAX_CHARACTERS_PER_WORK = 50

export const validateWorkImageIds = async(userId: string, imageIds: string[]) => {
  if (imageIds.length === 0) return
  const count = await Image.count({ where: { id: { in: imageIds }, uploadedByUserId: userId } })
  if (count !== imageIds.length)
    throw createHttpError(400, '包含不存在或不屬於你的圖片')
}

export const validateWorkCharacterIds = async(characterIds: string[]) => {
  if (characterIds.length === 0) return
  const count = await Character.count({ where: { id: { in: characterIds } } })
  if (count !== characterIds.length)
    throw createHttpError(400, '包含不存在的角色')
}

// Any verified user can create tags inline while tagging their own work - no
// admin-only gate. Junk/typo tags just never surface in the public tag filter
// (that list is scoped to tags used by at least one VERIFIED+show work).
export const upsertTagsByName = async(tagNames: string[]): Promise<string[]> => {
  const names = [...new Set(tagNames.map(name => name.trim()).filter(Boolean))]
  const tags = await Promise.all(
    names.map(name => Tag.upsert({ where: { name }, create: { name }, update: {} })),
  )
  return tags.map(tag => tag.id)
}

// imageIds/characterIds/tagIds are always set wholesale (not appended one at
// a time like character ID-card uploads), so replace-the-whole-set is simpler
// than diffing. Dedupe while preserving order first so a client-sent
// duplicate doesn't collide with the @@id([workId, imageId]) composite PK,
// and so `position` reflects the caller's intended (deduped) order.
export const replaceWorkImages = async(
  tx: Prisma.TransactionClient, workId: string, imageIds: string[],
) => {
  const ids = [...new Set(imageIds)]
  await tx.workImage.deleteMany({ where: { workId } })
  if (ids.length === 0) return
  await tx.workImage.createMany({
    data: ids.map((imageId, position) => ({ workId, imageId, position })),
  })
}

export const replaceWorkCharacters = async(
  tx: Prisma.TransactionClient, workId: string, characterIds: string[],
) => {
  const ids = [...new Set(characterIds)]
  await tx.workCharacter.deleteMany({ where: { workId } })
  if (ids.length === 0) return
  await tx.workCharacter.createMany({
    data: ids.map(characterId => ({ workId, characterId })),
  })
}

export const replaceWorkTags = async(
  tx: Prisma.TransactionClient, workId: string, tagIds: string[],
) => {
  const ids = [...new Set(tagIds)]
  await tx.workTag.deleteMany({ where: { workId } })
  if (ids.length === 0) return
  await tx.workTag.createMany({
    data: ids.map(tagId => ({ workId, tagId })),
  })
}

interface WorkContentInput {
  title?: string
  description?: string | null
  link?: string | null
  tagNames?: string[]
  imageIds?: string[]
  characterIds?: string[]
}

export const hasWorkContentFieldsProvided = (input: WorkContentInput) =>
  input.title !== undefined
  || input.description !== undefined
  || input.link !== undefined
  || input.tagNames !== undefined
  || input.imageIds !== undefined
  || input.characterIds !== undefined
