import { UseMutationResult, UseQueryResult } from '@/hooks/useApi'

// Shared by every me/admin dual-mode editor (CharacterEditor.tsx,
// WorkEditor.tsx): both a "me" and an "admin" fetch hook exist for the same
// resource, and only one of them is actually used depending on `mode` - this
// picks the right one and skips the unused query entirely (passing it
// `undefined` instead of `id`), rather than firing both every time.
export const useDualModeQuery = <T>(
  mode: 'me' | 'admin',
  id: string | undefined,
  useMeQuery: (id: string | undefined) => UseQueryResult<T>,
  useAdminQuery: (id: string | undefined) => UseQueryResult<T>,
): UseQueryResult<T> => {
  const meResult = useMeQuery(mode === 'me' ? id : undefined)
  const adminResult = useAdminQuery(mode === 'admin' ? id : undefined)
  return mode === 'admin' ? adminResult : meResult
}

// Same idea for the matching update mutation. Only safe to use where the
// "me" and "admin" mutations take the exact same Args - if an admin-only
// update takes genuinely different/extra required fields, keep that one
// picked with a plain `isAdmin ? ... : ...` instead, since forcing it
// through this generic would need to declare one Args type both hooks
// happen to accept, not literally be the same input type.
export const useDualModeMutation = <Args extends unknown[], T>(
  mode: 'me' | 'admin',
  useMeMutation: () => UseMutationResult<Args, T>,
  useAdminMutation: () => UseMutationResult<Args, T>,
): UseMutationResult<Args, T> => {
  const meResult = useMeMutation()
  const adminResult = useAdminMutation()
  return mode === 'admin' ? adminResult : meResult
}
