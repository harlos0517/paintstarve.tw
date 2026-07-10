import {
  AdminCharacterClaimListFilters,
  adminResolveCharacterClaim,
  createCharacterClaim,
  deleteCharacterClaim,
  listAdminCharacterClaims,
  listMeCharacterClaims,
} from '@/api/characterClaims'
import { useMutation, useQuery } from '@/hooks/useApi'

export const useMeCharacterClaims = () => useQuery(() => listMeCharacterClaims(), [])

export const useCreateCharacterClaim = () =>
  useMutation((characterId: string) => createCharacterClaim(characterId))

export const useDeleteCharacterClaim = () =>
  useMutation((claimId: string) => deleteCharacterClaim(claimId))

export const useAdminCharacterClaimList = (filters: AdminCharacterClaimListFilters = {}) =>
  useQuery(() => listAdminCharacterClaims(filters), [JSON.stringify(filters)])

export const useAdminResolveCharacterClaim = () =>
  useMutation((claimId: string, action: 'APPROVE' | 'REJECT') =>
    adminResolveCharacterClaim(claimId, action))
