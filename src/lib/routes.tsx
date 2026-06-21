import Students from "@/pages/Students"

export type Route = {
  key: string
  name: string
  path: string
  component: React.ReactNode
}

export const routes: Route[] = [
  { key: 'home', name: '首頁', path: '/', component: <></> },
  { key: 'intro', name: '簡介', path: '/intro', component: <></> },
  { key: 'teachers', name: '師資', path: '/teachers', component: <></> },
  { key: 'students', name: '學生', path: '/students', component: <Students /> },
  { key: 'clubs', name: '社團', path: '/clubs', component: <></> },
  { key: 'daily', name: '日常', path: '/daily', component: <></> },
  { key: 'anthem', name: '校歌', path: '/anthem', component: <></> },
  { key: 'projects', name: '企劃', path: '/projects', component: <></> },
  { key: 'rules', name: '校規', path: '/rules', component: <></> },
]
