import backendClient from '@/api/backendClient'

export type CharacterRole = 'STUDENT' | 'STAFF'

export interface Character {
  id: string
  createdAt: string
  updatedAt: string
  season: string
  seatId: string
  userId: string
  role: CharacterRole
  name: string
  nameEn: string | null
  cardId: string | null
  year: number | null
  class: string | null
  seatRow: number | null
  seatColumn: number | null
  title: string | null
  unit: string | null
  race: string | null
  major: string | null
  birthday: string | null // MM-DD
  description: string | null
  verified: boolean
  twitter: string | null
}

export interface CharacterListFilters {
  name?: string
  role?: CharacterRole
  verified?: boolean
  year?: number
  class?: string
  page?: number
  per?: number
}

export interface ListCharacter {
  id: string
  season: string
  role: CharacterRole
  name: string
  year: number | null
  class: string | null
  verified: boolean
}

// Fields a character owner ("me") is allowed to edit about their own character.
export interface MeCharacterUpdateInput {
  nameEn?: string | null
  title?: string | null
  unit?: string | null
  race?: string | null
  major?: string | null
  birthday?: string | null // MM-DD
  description?: string | null
  twitter?: string | null
}

// Admins can edit every column.
export interface AdminCharacterUpdateInput extends MeCharacterUpdateInput {
  season?: string
  seatId?: string
  userId?: string
  role?: CharacterRole
  name?: string
  cardId?: string | null
  year?: number | null
  class?: string | null
  seatRow?: number | null
  seatColumn?: number | null
  verified?: boolean
}

export const listMeCharacters = async(filters: CharacterListFilters = {}) => {
  const { data } = await backendClient.get<{ characters: ListCharacter[] }>(
    '/api/v1/me/characters', { params: filters },
  )
  return data.characters
}

export const getMeCharacter = async(characterId: string) => {
  const { data } = await backendClient.get<{ character: Character }>(
    `/api/v1/me/characters/${characterId}`,
  )
  return data.character
}

export const updateMeCharacter = async(characterId: string, input: MeCharacterUpdateInput) => {
  const { data } = await backendClient.patch<{ success: boolean }>(
    `/api/v1/me/characters/${characterId}`, input,
  )
  return data
}

export const listAdminCharacters = async(filters: CharacterListFilters = {}) => {
  const { data } = await backendClient.get<{ characters: ListCharacter[] }>(
    '/api/v1/admin/characters', { params: filters },
  )
  return data.characters
}

export const getAdminCharacter = async(characterId: string) => {
  const { data } = await backendClient.get<{ character: Character }>(
    `/api/v1/admin/characters/${characterId}`,
  )
  return data.character
}

export const updateAdminCharacter = async(
  characterId: string, input: AdminCharacterUpdateInput,
) => {
  const { data } = await backendClient.patch<{ success: boolean }>(
    `/api/v1/admin/characters/${characterId}`, input,
  )
  return data
}
