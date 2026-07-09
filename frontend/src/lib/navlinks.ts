
export type Route = {
  key: string
  name: string
  path: string
}

export const navlinks: Route[] = [
  { key: 'students', name: '師生', path: '/students' },
  { key: 'classes', name: '班級', path: '/classes' },
  { key: 'admin', name: '後臺', path: '/admin' },
]
