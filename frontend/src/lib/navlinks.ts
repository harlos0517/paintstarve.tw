
export type Route = {
  key: string
  name: string
  path: string
}

export const navlinks: Route[] = [
  { key: 'characters', name: '師生', path: '/characters' },
  { key: 'classes', name: '班級', path: '/classes' },
  { key: 'dashboard', name: '後臺', path: '/dashboard' },
]
