import { Outlet } from 'react-router-dom'

import AppRouter from '@/AppRouter'
import FrontendShell from '@/components/FrontendShell'
import MantineClientProvider from '@/components/MantineClientProvider'

import '@mantine/core/styles.css'
import './styles/main.sass'

const Stub = () => <></>

export const App = () =>
  <MantineClientProvider>
    <AppRouter>
      <FrontendShell>
        <Outlet />
      </FrontendShell>
    </AppRouter>
  </MantineClientProvider>

export default App
