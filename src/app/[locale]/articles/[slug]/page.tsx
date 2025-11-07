import { notFound } from 'next/navigation'
import { getAllArticles } from '@/lib/articles'
import type { Locale } from '@/lib/i18n/config'

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
 * Article page component
 * Dynamically imports the MDX file based on locale with fallback
 */
export default async function ArticlePage({
  params,
}: {
  params: { locale: Locale; slug: string }
}) {
  const { locale, slug } = params

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

        // TODO: Show fallback badge/notice to user
        return <ArticleComponent.default />
      } catch {
        // Article doesn't exist in any locale
        notFound()
      }
    }

    // Article doesn't exist
    notFound()
  }
}
