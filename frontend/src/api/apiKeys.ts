import backendClient from '@/api/backendClient'

export type ApiKeyScope = 'characters:read' | 'characters:write'

export interface ApiKey {
  id: string
  name: string
  description: string | null
  keyPrefix: string
  scopes: ApiKeyScope[]
  lastUsedAt: string | null
  lastUsedIp: string | null
  expiresAt: string | null
  revokedAt: string | null
  createdAt: string
}

export const listAdminApiKeys = async(userId: string) => {
  const { data } = await backendClient.get<{ apiKeys: ApiKey[] }>(
    `/api/v1/admin/users/${userId}/api-keys`,
  )
  return data.apiKeys
}

export interface CreateApiKeyInput {
  name: string
  description?: string
  scopes: ApiKeyScope[]
  expiresAt?: string
}

export interface CreateApiKeyResult {
  id: string
  token: string
  keyPrefix: string
}

export const createAdminApiKey = async(userId: string, input: CreateApiKeyInput) => {
  const { data } = await backendClient.post<CreateApiKeyResult>(
    `/api/v1/admin/users/${userId}/api-keys`, input,
  )
  return data
}

export const revokeAdminApiKey = async(userId: string, apiKeyId: string) => {
  const { data } = await backendClient.delete<{ success: boolean }>(
    `/api/v1/admin/users/${userId}/api-keys/${apiKeyId}`,
  )
  return data
}
