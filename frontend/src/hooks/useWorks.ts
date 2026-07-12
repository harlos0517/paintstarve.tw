import {
  AdminWorkListFilters,
  AdminWorkUpdateInput,
  createMeWork,
  deleteAdminWork,
  deleteMeWork,
  getAdminWork,
  getMeWork,
  getPublicWork,
  listAdminWorks,
  listMeWorks,
  listPublicWorks,
  listPublicWorkTags,
  MeWorkCreateInput,
  MeWorkUpdateInput,
  resolveWorkApproval,
  updateAdminWork,
  updateMeWork,
  WorkApprovalAction,
  WorkListFilters,
} from '@/api/works'
import { useMutation, useQuery } from '@/hooks/useApi'

export const usePublicWorks = (filters: WorkListFilters = {}) =>
  useQuery(() => listPublicWorks(filters), [JSON.stringify(filters)])

export const usePublicWork = (workId: string) =>
  useQuery(() => getPublicWork(workId), [workId])

export const usePublicWorkTags = () =>
  useQuery(() => listPublicWorkTags(), [])

export const useMeWorks = (filters: AdminWorkListFilters = {}) =>
  useQuery(() => listMeWorks(filters), [JSON.stringify(filters)])

export const useMeWork = (workId: string | undefined) =>
  useQuery(async() => (workId ? getMeWork(workId) : undefined), [workId])

export const useCreateMeWork = () =>
  useMutation((input: MeWorkCreateInput) => createMeWork(input))

export const useUpdateMeWork = () =>
  useMutation((workId: string, input: MeWorkUpdateInput) => updateMeWork(workId, input))

export const useDeleteMeWork = () =>
  useMutation((workId: string) => deleteMeWork(workId))

export const useAdminWorks = (filters: AdminWorkListFilters = {}) =>
  useQuery(() => listAdminWorks(filters), [JSON.stringify(filters)])

export const useAdminWork = (workId: string | undefined) =>
  useQuery(async() => (workId ? getAdminWork(workId) : undefined), [workId])

export const useUpdateAdminWork = () =>
  useMutation((workId: string, input: AdminWorkUpdateInput) => updateAdminWork(workId, input))

export const useResolveWorkApproval = () =>
  useMutation((workId: string, action: WorkApprovalAction) => resolveWorkApproval(workId, action))

export const useDeleteAdminWork = () =>
  useMutation((workId: string) => deleteAdminWork(workId))
