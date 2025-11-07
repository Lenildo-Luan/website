import { type Metadata } from 'next'

import { SimpleLayout } from '@/components/SimpleLayout'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import type { Locale } from '@/lib/i18n/config'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const dict = await getDictionary(locale)

  return {
    title: dict.pages.thankYou.title,
    description: dict.pages.thankYou.description,
  }
}

export default async function ThankYou({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dict = await getDictionary(locale)

  return (
    <SimpleLayout
      title={dict.pages.thankYou.title}
      intro={dict.pages.thankYou.description}
    />
  )
}
