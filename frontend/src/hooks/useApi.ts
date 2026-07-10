import { useCallback, useEffect, useState } from 'react'

interface UseQueryResult<T> {
  data: T | undefined
  loading: boolean
  error: unknown
  refetch: () => void
}

// A minimal GET-style data fetching hook (loading/error/refetch)
export function useQuery<T>(fn: () => Promise<T>, deps: unknown[]): UseQueryResult<T> {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>()
  const [reloadToken, setReloadToken] = useState(0)

  const key = JSON.stringify([...deps, reloadToken])
  const [committedKey, setCommittedKey] = useState(key)
  if (key !== committedKey) {
    setCommittedKey(key)
    setLoading(true)
    setError(undefined)
  }

  useEffect(() => {
    let cancelled = false
    fn()
      .then(result => { if (!cancelled) { setData(result); setError(undefined) } })
      .catch(err => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committedKey])

  const refetch = useCallback(() => setReloadToken(t => t + 1), [])

  return { data, loading, error, refetch }
}

interface UseMutationResult<Args extends unknown[], T> {
  mutate: (...args: Args) => Promise<T>
  loading: boolean
  error: unknown
}

// A minimal POST/PATCH-style mutation hook exposing a trigger + loading/error.
export function useMutation<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>,
): UseMutationResult<Args, T> {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>()

  const mutate = useCallback(async(...args: Args) => {
    setLoading(true)
    setError(undefined)
    try {
      return await fn(...args)
    } catch(err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fn])

  return { mutate, loading, error }
}
