import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Analytics } from "@vercel/analytics/next"

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Lenildo Luan',
    default: 'Lenildo Luan',
  },
  description:
    'Desenvolvedor de software multidisciplinar residente em João Pessoa, Paraíba.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            {children}
          </div>
        </Providers>

        <Analytics />
      </body>
    </html>
  )
}
