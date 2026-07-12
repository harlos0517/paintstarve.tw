import { useState } from 'react'

// Shared by every paginated list page: owns the current page (and, where a
// page lets the user change page size, the page size too), plus the
// total-pages calculation every one of them repeats as
// `data ? Math.ceil(data.total / per) : 0`.
export const usePagination = (initialPer: number) => {
  const [page, setPage] = useState(1)
  const [per, setPer] = useState(initialPer)

  const resetPage = () => setPage(1)
  const totalPages = (total: number | undefined) => (total ? Math.ceil(total / per) : 0)

  return { page, setPage, per, setPer, resetPage, totalPages }
}
