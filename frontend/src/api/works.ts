import backendClient from '@/api/backendClient'

export type WorkVerifyStatus = 'PENDING' | 'VERIFIED' | 'REJECTED'

export interface WorkAuthor {
  id: string
  name: string
}

export interface WorkCharacterStub {
  id: string
  name: string
}

export interface Work {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  description: string | null
  link: string | null
  author: WorkAuthor
  imageUrls: string[]
  characters: WorkCharacterStub[]
  tags: string[]
}

export interface WorkImage {
  id: string
  url: string
}

export interface WorkDetail extends Omit<Work, 'author'> {
  author: WorkAuthor & { email: string }
  verifyStatus: WorkVerifyStatus
  show: boolean
  images: WorkImage[]
}

export interface WorkListFilters {
  title?: string
  tag?: string
  characterId?: string
  authorId?: string
  page?: number
  per?: number
}

export interface AdminWorkListFilters extends WorkListFilters {
  verifyStatus?: WorkVerifyStatus
}

export interface WorkListResult<T> {
  works: T[]
  total: number
}

export interface MeWorkCreateInput {
  title: string
  description?: string | null
  link?: string | null
  tagNames?: string[]
  imageIds?: string[]
  characterIds?: string[]
}

export interface MeWorkUpdateInput {
  title?: string
  description?: string | null
  link?: string | null
  tagNames?: string[]
  imageIds?: string[]
  characterIds?: string[]
  show?: boolean
}

export type AdminWorkUpdateInput = MeWorkUpdateInput

export type WorkApprovalAction = 'APPROVE' | 'REJECT'

export const listPublicWorks = async(filters: WorkListFilters = {}) => {
  const { data } = await backendClient.get<WorkListResult<Work>>(
    '/api/v1/public/works', { params: filters },
  )
  return data
}

export const getPublicWork = async(workId: string) => {
  const { data } = await backendClient.get<{ work: Work }>(
    `/api/v1/public/works/${workId}`,
  )
  return data.work
}

export const listPublicWorkTags = async() => {
  const { data } = await backendClient.get<{ tags: string[] }>(
    '/api/v1/public/works/tags',
  )
  return data.tags
}

export const listPublicWorkCharacters = async() => {
  const { data } = await backendClient.get<{ characters: WorkCharacterStub[] }>(
    '/api/v1/public/works/characters',
  )
  return data.characters
}

export const listMeWorks = async(filters: AdminWorkListFilters = {}) => {
  const { data } = await backendClient.get<WorkListResult<WorkDetail>>(
    '/api/v1/me/works', { params: filters },
  )
  return data
}

export const createMeWork = async(input: MeWorkCreateInput) => {
  const { data } = await backendClient.post<{ workId: string }>(
    '/api/v1/me/works', input,
  )
  return data
}

export const getMeWork = async(workId: string) => {
  const { data } = await backendClient.get<{ work: WorkDetail }>(
    `/api/v1/me/works/${workId}`,
  )
  return data.work
}

export const updateMeWork = async(workId: string, input: MeWorkUpdateInput) => {
  const { data } = await backendClient.patch<{ success: boolean }>(
    `/api/v1/me/works/${workId}`, input,
  )
  return data
}

export const deleteMeWork = async(workId: string) => {
  const { data } = await backendClient.delete<{ success: boolean }>(
    `/api/v1/me/works/${workId}`,
  )
  return data
}

export const listAdminWorks = async(filters: AdminWorkListFilters = {}) => {
  const { data } = await backendClient.get<WorkListResult<WorkDetail>>(
    '/api/v1/admin/works', { params: filters },
  )
  return data
}

export const getAdminWork = async(workId: string) => {
  const { data } = await backendClient.get<{ work: WorkDetail }>(
    `/api/v1/admin/works/${workId}`,
  )
  return data.work
}

export const updateAdminWork = async(workId: string, input: AdminWorkUpdateInput) => {
  const { data } = await backendClient.patch<{ success: boolean }>(
    `/api/v1/admin/works/${workId}`, input,
  )
  return data
}

export const resolveWorkApproval = async(workId: string, action: WorkApprovalAction) => {
  const { data } = await backendClient.patch<{ success: boolean }>(
    `/api/v1/admin/works/${workId}/approval`, { action },
  )
  return data
}

export const deleteAdminWork = async(workId: string) => {
  const { data } = await backendClient.delete<{ success: boolean }>(
    `/api/v1/admin/works/${workId}`,
  )
  return data
}
