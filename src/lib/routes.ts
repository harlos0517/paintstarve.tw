export type Route = {
  key: string
  name: string
  path: string
}

export const routes: Route[] = [
  { key: 'home',     name: '首頁', path: '/' },
  { key: 'intro',    name: '簡介', path: '/intro' },
  { key: 'teachers', name: '師資', path: '/teachers' },
  { key: 'students', name: '學生', path: '/students' },
  { key: 'clubs',    name: '社團', path: '/clubs' },
  { key: 'daily',    name: '日常', path: '/daily' },
  { key: 'anthem',   name: '校歌', path: '/anthem' },
  { key: 'projects', name: '企劃', path: '/projects' },
  { key: 'rules',    name: '校規', path: '/rules' },
]
