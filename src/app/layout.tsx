import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { Analytics } from "@vercel/analytics/next"

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Lenildo Luan',
    default: 'Lenildo Luan',
  },
  description:
    'Desenvolvedor de software multidisciplinar residente em João Pessoa, Paraíba.',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>

        <Analytics />
      </body>
    </html>
  )
}
