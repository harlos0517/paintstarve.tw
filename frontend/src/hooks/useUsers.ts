import { adjustUserRole, approveUser, listAdminUsers, UserListFilters, UserRole } from '@/api/users'
import { useMutation, useQuery } from '@/hooks/useApi'

export const useAdminUserList = (filters: UserListFilters = {}) =>
  useQuery(() => listAdminUsers(filters), [JSON.stringify(filters)])

export const useApproveUser = () =>
  useMutation((userId: string, action: 'APPROVE' | 'REJECT') => approveUser(userId, action))

export const useAdjustUserRole = () =>
  useMutation((userId: string, role: UserRole) => adjustUserRole(userId, role))
