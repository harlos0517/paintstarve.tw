import { Outlet } from 'react-router-dom'

import { Sheet } from '@/api/types'
import AppRouter from '@/AppRouter'
import FrontendShell from '@/components/FrontendShell'
import MantineClientProvider from '@/components/MantineClientProvider'
import useData from '@/hooks/useData'

import GlobalContext from '@/components/GlobalContext'
import '@mantine/core/styles.css'
import './styles/main.sass'

export const App = () => {
  const { data: students } = useData(Sheet.STUDENTS)

  return <MantineClientProvider>
    <AppRouter>
      <GlobalContext.Provider value={{ students }}>
        <FrontendShell>
          <Outlet />
        </FrontendShell>
      </GlobalContext.Provider>
    </AppRouter>
  </MantineClientProvider>
}

export default App
