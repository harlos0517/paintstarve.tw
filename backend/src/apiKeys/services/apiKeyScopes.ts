export const API_KEY_SCOPES = ['characters:read', 'characters:write'] as const

export type ApiKeyScope = typeof API_KEY_SCOPES[number]
