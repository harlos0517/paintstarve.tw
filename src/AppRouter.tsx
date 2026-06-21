import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'

import { routes } from '@/lib/routes'

const router = (children?: React.ReactNode) => createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={children}>
      {routes.map(route => <Route
        key={route.name}
        path={route.path}
        element={route.component}
      />)}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Route>,
  ),
)

const AppRouter = ({ children }: { children?: React.ReactNode }) =>
  <RouterProvider router={router(children)} />

export default AppRouter