import {
  AdminCharacterUpdateInput,
  CharacterListFilters,
  exportCharactersCsv,
  getAdminCharacter,
  getMeCharacter,
  importCharactersCsv,
  listAdminCharacters,
  listMeCharacters,
  listPublicCharacters,
  MeCharacterUpdateInput,
  updateAdminCharacter,
  updateMeCharacter,
} from '@/api/characters'
import { useMutation, useQuery } from '@/hooks/useApi'

export const usePublicCharacterList = (filters: CharacterListFilters = {}) =>
  useQuery(() => listPublicCharacters(filters), [JSON.stringify(filters)])

export const useMeCharacterList = (filters: CharacterListFilters = {}) =>
  useQuery(() => listMeCharacters(filters), [JSON.stringify(filters)])

export const useMeCharacter = (characterId: string | undefined) =>
  useQuery(async() => (characterId ? getMeCharacter(characterId) : undefined), [characterId])

export const useUpdateMeCharacter = () =>
  useMutation((characterId: string, input: MeCharacterUpdateInput) =>
    updateMeCharacter(characterId, input))

export const useAdminCharacterList = (filters: CharacterListFilters = {}) =>
  useQuery(() => listAdminCharacters(filters), [JSON.stringify(filters)])

export const useAdminCharacter = (characterId: string | undefined) =>
  useQuery(async() => (characterId ? getAdminCharacter(characterId) : undefined), [characterId])

export const useUpdateAdminCharacter = () =>
  useMutation((characterId: string, input: AdminCharacterUpdateInput) =>
    updateAdminCharacter(characterId, input))

export const useExportCharactersCsv = () => useMutation(() => exportCharactersCsv())

export const useImportCharactersCsv = () => useMutation((file: File) => importCharactersCsv(file))
