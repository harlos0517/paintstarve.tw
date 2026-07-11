import {
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom'

import Layout from '@/components/Layout'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DashboardCharacterClaims from '@/pages/dashboard/CharacterClaims'
import DashboardCharacterEdit from '@/pages/dashboard/CharacterEdit'
import DashboardCharacters from '@/pages/dashboard/Characters'
import DashboardCharactersImportExport from '@/pages/dashboard/CharactersImportExport'
import DashboardMe from '@/pages/dashboard/Me'
import DashboardMeCharacterEdit from '@/pages/dashboard/MeCharacterEdit'
import DashboardMeCharacters from '@/pages/dashboard/MeCharacters'
import DashboardMeImages from '@/pages/dashboard/MeImages'
import DashboardUsers from '@/pages/dashboard/Users'
import Characters from '@/pages/Characters'
import Classes from '@/pages/Classes'
import Clazz from '@/pages/Clazz'

const router = () => createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Navigate to="/characters" replace />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/class/:clazz" element={<Clazz />} />
      </Route>
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route path="" element={<Navigate to="/dashboard/me" replace />} />
        <Route path="me" element={<DashboardMe />} />
        <Route path="me/characters" element={<DashboardMeCharacters />} />
        <Route path="me/characters/:characterId" element={<DashboardMeCharacterEdit />} />
        <Route path="me/images" element={<DashboardMeImages />} />
        <Route path="characters" element={<DashboardCharacters />} />
        <Route path="characters/import-export" element={<DashboardCharactersImportExport />} />
        <Route path="characters/:characterId" element={<DashboardCharacterEdit />} />
        <Route path="users" element={<DashboardUsers />} />
        <Route path="character-claims" element={<DashboardCharacterClaims />} />
      </Route>
    </>,
  ),
)

const AppRouter = () =>
  <RouterProvider router={router()} />

export default AppRouter
