import backendClient from '@/api/backendClient'

export type CharacterRole = 'STUDENT' | 'STAFF'

export interface Character {
  id: string
  createdAt: string
  updatedAt: string
  season: string
  seatId: string
  userId: string | null
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
  idCardDisplayMode: 'SINGLE' | 'CAROUSEL'
  idCardImageUrls: string[]
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

export interface CharacterListResult<T> {
  characters: T[]
  total: number
}

export interface CharacterOwner {
  id: string
  name: string
  email: string
}

export interface CharacterIdCardImage {
  id: string
  url: string
  createdAt: string
}

export interface CharacterDetail extends Character {
  user: CharacterOwner | null
  primaryIdCardImageId: string | null
  idCardImages: CharacterIdCardImage[]
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

// Admins can edit every column except season/seatId - a character's seat
// identity is fixed once created (also enforced by a DB unique constraint).
export interface AdminCharacterUpdateInput extends MeCharacterUpdateInput {
  userId?: string | null
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
  const { data } = await backendClient.get<CharacterListResult<ListCharacter>>(
    '/api/v1/me/characters', { params: filters },
  )
  return data
}

export const getMeCharacter = async(characterId: string) => {
  const { data } = await backendClient.get<{ character: CharacterDetail }>(
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
  const { data } = await backendClient.get<CharacterListResult<ListCharacter>>(
    '/api/v1/admin/characters', { params: filters },
  )
  return data
}

export const getAdminCharacter = async(characterId: string) => {
  const { data } = await backendClient.get<{ character: CharacterDetail }>(
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

export const listPublicCharacters = async(filters: CharacterListFilters = {}) => {
  const { data } = await backendClient.get<CharacterListResult<Character>>(
    '/api/v1/public/characters', { params: filters },
  )
  return data
}

export interface ImportCharactersRowError {
  row: number
  message: string
}

export interface ImportCharactersResult {
  created: number
  updated: number
  errors: ImportCharactersRowError[]
}

// The export endpoint returns a raw text/csv body, not the usual JSON envelope.
export const exportCharactersCsv = async() => {
  const { data } = await backendClient.get<string>(
    '/api/v1/admin/characters/export',
    { responseType: 'text' },
  )
  return data
}

export const importCharactersCsv = async(file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await backendClient.post<ImportCharactersResult>(
    '/api/v1/admin/characters/import',
    formData,
  )
  return data
}
