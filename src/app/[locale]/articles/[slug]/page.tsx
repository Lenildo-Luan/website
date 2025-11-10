import { notFound } from 'next/navigation'
import { type Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import type { Locale } from '@/lib/i18n/config'
import { FallbackNotice } from '@/components/FallbackNotice'
import {
  getLocalizedUrl,
  getAlternateLanguages,
  getOpenGraphLocale,
  getAlternateOpenGraphLocale,
} from '@/lib/i18n/utils'
import { getDictionary } from '@/lib/i18n/get-dictionary'

/**
 * Generate static params for all articles in all locales
 */
export async function generateStaticParams() {
  const locales: Locale[] = ['pt-br', 'en']
  const params: Array<{ locale: string; slug: string }> = []

  for (const locale of locales) {
    const articles = await getAllArticles(locale)
    for (const article of articles) {
      params.push({
        locale,
        slug: article.slug,
      })
    }
  }

  return params
}

/**
 * Load article metadata
 */
async function loadArticleMetadata(slug: string, locale: Locale) {
  try {
    const article = await import(
      `@/app/[locale]/articles/${slug}/page.${locale}.mdx`
    )
    return { article: article.article, locale }
  } catch {
    if (locale !== 'pt-br') {
      try {
        const article = await import(
          `@/app/[locale]/articles/${slug}/page.pt-br.mdx`
        )
        return { article: article.article, locale: 'pt-br' as Locale }
      } catch {
        return null
      }
    }
    return null
  }
}

/**
 * Generate metadata for article page
 */
export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string }
}): Promise<Metadata> {
  const { locale, slug } = params
  const dict = await getDictionary(locale)
  const articleData = await loadArticleMetadata(slug, locale)

  if (!articleData) {
    return {
      title: 'Article Not Found',
    }
  }

  const { article } = articleData
  const path = `/articles/${slug}`

  return {
    title: article.title,
    description: article.description,
    authors: [{ name: article.author }],
    alternates: {
      canonical: getLocalizedUrl(locale, path),
      languages: getAlternateLanguages(path),
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: getLocalizedUrl(locale, path),
      siteName: dict.pages.home.name,
      locale: getOpenGraphLocale(locale),
      alternateLocale: getAlternateOpenGraphLocale(locale),
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}

/**
 * Article page component
 * Dynamically imports the MDX file based on locale with fallback
 */
export default async function ArticlePage({
  params,
}: {
  params: { locale: Locale; slug: string }
}) {
  const { locale, slug } = params
  let isFallback = false

  try {
    // Try to load article in requested locale
    const ArticleComponent = await import(
      `@/app/[locale]/articles/${slug}/page.${locale}.mdx`
    )
    return <ArticleComponent.default />
  } catch (error) {
    // Fallback to Portuguese if article doesn't exist in requested locale
    if (locale !== 'pt-br') {
      try {
        const ArticleComponent = await import(
          `@/app/[locale]/articles/${slug}/page.pt-br.mdx`
        )

        isFallback = true

        // Show fallback notice and article
        return (
          <>
            <FallbackNotice requestedLocale={locale} fallbackLocale="pt-br" />
            <ArticleComponent.default />
          </>
        )
      } catch {
        // Article doesn't exist in any locale
        notFound()
      }
    }

    // Article doesn't exist
    notFound()
  }
}
