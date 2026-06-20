import FrontendShell from '@/components/FrontendShell'
import MantineClientProvider from '@/components/MantineClientProvider'
import type { Metadata } from 'next'

import '@/styles/main.sass'
import '@mantine/core/styles.css'

export const metadata: Metadata = {
  title: '繪俄史 Paint Starve',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-TW">
    <body>
      <MantineClientProvider>
        <FrontendShell>
          {children}
        </FrontendShell>
      </MantineClientProvider>
    </body>
  </html>
}
