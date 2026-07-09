import { MantineProvider } from '@mantine/core'

export default function MantineClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark">
      {children}
    </MantineProvider>
  )
}
