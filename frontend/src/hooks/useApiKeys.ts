import {
  CreateApiKeyInput, createAdminApiKey, listAdminApiKeys, revokeAdminApiKey,
} from '@/api/apiKeys'
import { useMutation, useQuery } from '@/hooks/useApi'

export const useAdminApiKeys = (userId: string | null) =>
  useQuery(() => (userId ? listAdminApiKeys(userId) : Promise.resolve(undefined)), [userId])

export const useCreateAdminApiKey = () =>
  useMutation((userId: string, input: CreateApiKeyInput) => createAdminApiKey(userId, input))

export const useRevokeAdminApiKey = () =>
  useMutation((userId: string, apiKeyId: string) => revokeAdminApiKey(userId, apiKeyId))
