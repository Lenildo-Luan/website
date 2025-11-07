import { notFound } from 'next/navigation'
import { type Metadata } from 'next'
import { i18n, isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import {
  getLocalizedUrl,
  getAlternateLanguages,
  getOpenGraphLocale,
  getAlternateOpenGraphLocale,
} from '@/lib/i18n/utils'
import { LangAttribute } from '@/components/LangAttribute'
import { Layout } from '@/components/Layout'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale)

  return {
    title: {
      template: `%s - ${dict.pages.home.name}`,
      default: dict.pages.home.name,
    },
    description: dict.pages.home.intro,
    alternates: {
      canonical: getLocalizedUrl(params.locale),
      languages: getAlternateLanguages(),
      types: {
        'application/rss+xml': `${getLocalizedUrl(params.locale)}/feed.xml`,
      },
    },
    openGraph: {
      locale: getOpenGraphLocale(params.locale),
      alternateLocale: getAlternateOpenGraphLocale(params.locale),
      title: dict.pages.home.name,
      description: dict.pages.home.intro,
      type: 'website',
      url: getLocalizedUrl(params.locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.pages.home.name,
      description: dict.pages.home.intro,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validar locale usando type guard
  if (!isValidLocale(params.locale)) {
    notFound()
  }

  // Agora TypeScript sabe que params.locale é do tipo Locale
  const locale: Locale = params.locale

  // Carregar dicionário para passar navigation labels ao Header
  const dict = await getDictionary(locale)

  return (
    <>
      <LangAttribute locale={locale} />
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative flex w-full flex-col">
        <Layout locale={locale} navigationLabels={dict.navigation}>
          {children}
        </Layout>
      </div>
    </>
  )
}
