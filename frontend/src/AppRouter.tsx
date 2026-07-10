import {
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom'

import AdminLayout from '@/components/admin/AdminLayout'
import Layout from '@/components/Layout'
import AdminCharacterEdit from '@/pages/admin/CharacterEdit'
import AdminCharacters from '@/pages/admin/Characters'
import AdminCharactersImportExport from '@/pages/admin/CharactersImportExport'
import AdminMe from '@/pages/admin/Me'
import AdminMeCharacterEdit from '@/pages/admin/MeCharacterEdit'
import AdminMeCharacters from '@/pages/admin/MeCharacters'
import AdminUsers from '@/pages/admin/Users'
import Classes from '@/pages/Classes'
import Clazz from '@/pages/Clazz'
import Students from '@/pages/Students'

const router = () => createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Navigate to="/students" replace />} />
        <Route path="/students" element={<Students />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/class/:clazz" element={<Clazz />} />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route path="" element={<Navigate to="/admin/me" replace />} />
        <Route path="me" element={<AdminMe />} />
        <Route path="me/characters" element={<AdminMeCharacters />} />
        <Route path="me/characters/:characterId" element={<AdminMeCharacterEdit />} />
        <Route path="characters" element={<AdminCharacters />} />
        <Route path="characters/import-export" element={<AdminCharactersImportExport />} />
        <Route path="characters/:characterId" element={<AdminCharacterEdit />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </>,
  ),
)

const AppRouter = () =>
  <RouterProvider router={router()} />

export default AppRouter
