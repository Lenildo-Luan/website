import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Locale } from '@/lib/i18n/config'

export function Layout({
  children,
  locale
}: {
  children: React.ReactNode
  locale: Locale
}) {
  return (
    <>
      <Header locale={locale} />
      <main className="flex-auto">{children}</main>
      <Footer locale={locale} />
    </>
  )
}
