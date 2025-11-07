import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/types'

export function Layout({
  children,
  locale,
  navigationLabels,
}: {
  children: React.ReactNode
  locale: Locale
  navigationLabels: Dictionary['navigation']
}) {
  return (
    <>
      <Header locale={locale} navigationLabels={navigationLabels} />
      <main className="flex-auto">{children}</main>
      <Footer />
    </>
  )
}
