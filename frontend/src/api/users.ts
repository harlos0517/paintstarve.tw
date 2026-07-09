import backendClient from '@/api/backendClient'

export type UserRole = 'USER' | 'ADMIN'
export type UserVerifyStatus = 'PENDING' | 'VERIFIED' | 'REJECTED'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  verifyStatus: UserVerifyStatus
}

export interface UserListFilters {
  name?: string
  role?: UserRole
  verifyStatus?: UserVerifyStatus
  page?: number
  per?: number
}

export const listAdminUsers = async(filters: UserListFilters = {}) => {
  const { data } = await backendClient.get<{ users: AdminUser[] }>(
    '/api/v1/admin/users', { params: filters },
  )
  return data.users
}

export const approveUser = async(userId: string, action: 'APPROVE' | 'REJECT') => {
  const { data } = await backendClient.patch<{ success: boolean }>(
    `/api/v1/admin/users/${userId}/approval`, { action },
  )
  return data
}

export const adjustUserRole = async(userId: string, role: UserRole) => {
  const { data } = await backendClient.patch<{ success: boolean }>(
    `/api/v1/admin/users/${userId}/role`, { role },
  )
  return data
}
