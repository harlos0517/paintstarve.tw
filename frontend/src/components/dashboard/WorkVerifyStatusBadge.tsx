import { Badge, BadgeProps } from '@mantine/core'

import { WorkVerifyStatus } from '@/api/works'
import { WORK_VERIFY_STATUS_BADGE } from '@/lib/workVerifyStatus'

interface WorkVerifyStatusBadgeProps extends Omit<BadgeProps, 'color' | 'children'> {
  status: WorkVerifyStatus
}

const WorkVerifyStatusBadge = ({ status, ...badgeProps }: WorkVerifyStatusBadgeProps) => {
  const { color, label } = WORK_VERIFY_STATUS_BADGE[status]
  return <Badge color={color} {...badgeProps}>{label}</Badge>
}

export default WorkVerifyStatusBadge
