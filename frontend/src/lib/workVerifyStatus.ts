import { WorkVerifyStatus } from '@/api/works'

export const WORK_VERIFY_STATUS_BADGE:
Record<WorkVerifyStatus, { color: string, label: string }> = {
  PENDING: { color: 'yellow', label: '審核中' },
  VERIFIED: { color: 'green', label: '已通過' },
  REJECTED: { color: 'red', label: '已退回' },
}
