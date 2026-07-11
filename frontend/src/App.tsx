import AppRouter from '@/AppRouter'
import MantineClientProvider from '@/components/MantineClientProvider'

import '@mantine/core/styles.css'

import '@mantine/carousel/styles.css'

import './styles/main.sass'

export const App = () => <MantineClientProvider>
  <AppRouter />
</MantineClientProvider>

export default App
