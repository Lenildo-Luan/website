import { type Metadata } from 'next'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { type ArticleWithSlug, getAllArticles } from '@/lib/articles'
import { formatDate } from '@/lib/formatDate'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import type { Locale } from '@/lib/i18n/config'
import {
  getLocalizedUrl,
  getAlternateLanguages,
  getOpenGraphLocale,
  getAlternateOpenGraphLocale,
} from '@/lib/i18n/utils'

function Article({ article, locale, readMoreText }: { article: ArticleWithSlug; locale: Locale; readMoreText: string }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/${locale}/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>{readMoreText}</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 max-md:hidden"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
  )
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const dict = await getDictionary(locale)
  const path = '/articles'

  return {
    title: dict.pages.articles.metaTitle,
    description: dict.pages.articles.metaDescription,
    alternates: {
      canonical: getLocalizedUrl(locale, path),
      languages: getAlternateLanguages(path),
    },
    openGraph: {
      title: dict.pages.articles.metaTitle,
      description: dict.pages.articles.metaDescription,
      url: getLocalizedUrl(locale, path),
      siteName: dict.pages.home.name,
      locale: getOpenGraphLocale(locale),
      alternateLocale: getAlternateOpenGraphLocale(locale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.pages.articles.metaTitle,
      description: dict.pages.articles.metaDescription,
    },
  }
}

export default async function ArticlesIndex({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dict = await getDictionary(locale)
  let articles = await getAllArticles(locale)

  return (
    <SimpleLayout
      title={dict.pages.articles.title}
      intro={dict.pages.articles.metaDescription}
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="flex max-w-3xl flex-col space-y-16">
          {articles.map((article) => (
            <Article key={article.slug} article={article} locale={locale} readMoreText={dict.common.readMore} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
