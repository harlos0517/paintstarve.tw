import backendClient from '@/api/backendClient'
import { CharacterRole } from '@/api/characters'

export type CharacterClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface CharacterClaimCharacterSummary {
  id: string
  name: string
  seatId: string
  season: string
  role: CharacterRole
  year: number | null
  class: string | null
  unit: string | null
  title: string | null
}

export interface CharacterClaim {
  id: string
  status: CharacterClaimStatus
  character: CharacterClaimCharacterSummary
}

export const listMeCharacterClaims = async() => {
  const { data } = await backendClient.get<{ claims: CharacterClaim[] }>(
    '/api/v1/me/character-claims',
  )
  return data.claims
}

export const createCharacterClaim = async(characterId: string) => {
  const { data } = await backendClient.post<{ success: boolean }>(
    '/api/v1/me/character-claims', { characterId },
  )
  return data
}

export const deleteCharacterClaim = async(claimId: string) => {
  const { data } = await backendClient.delete<{ success: boolean }>(
    `/api/v1/me/character-claims/${claimId}`,
  )
  return data
}

export interface AdminCharacterClaim {
  id: string
  status: CharacterClaimStatus
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  character: {
    id: string
    name: string
  }
}

export interface AdminCharacterClaimListFilters {
  status?: CharacterClaimStatus
  page?: number
  per?: number
}

export interface AdminCharacterClaimListResult {
  claims: AdminCharacterClaim[]
  total: number
}

export const listAdminCharacterClaims = async(filters: AdminCharacterClaimListFilters = {}) => {
  const { data } = await backendClient.get<AdminCharacterClaimListResult>(
    '/api/v1/admin/character-claims', { params: filters },
  )
  return data
}

export interface ResolveCharacterClaimResult {
  success: boolean
  linked: boolean
}

export const adminResolveCharacterClaim = async(claimId: string, action: 'APPROVE' | 'REJECT') => {
  const { data } = await backendClient.patch<ResolveCharacterClaimResult>(
    `/api/v1/admin/character-claims/${claimId}`, { action },
  )
  return data
}
