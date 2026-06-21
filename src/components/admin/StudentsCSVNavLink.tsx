'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function StudentsCSVNavLink() {
  const pathname = usePathname()
  const isActive = pathname === '/admin/students-csv'

  return (
    <div className="nav__group">
      <Link
        href="/admin/students-csv"
        className={`nav__link${isActive ? ' active' : ''}`}
        prefetch={false}
      >
        <span className="nav__link-icon" />
        Students CSV
      </Link>
    </div>
  )
}
