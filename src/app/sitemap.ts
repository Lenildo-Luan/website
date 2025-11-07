import { MetadataRoute } from 'next'
import { i18n } from '@/lib/i18n/config'
import { siteConfig } from '@/lib/env'
import { getAllArticles } from '@/lib/articles'

/**
 * Gera um sitemap multi-idioma para o site
 * Inclui todas as páginas estáticas e artigos em todos os locales suportados
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  // Páginas estáticas que existem em todos os locales
  const staticRoutes = [
    '',
    '/about',
    '/articles',
    '/projects',
    '/speaking',
    '/uses',
  ]

  const sitemap: MetadataRoute.Sitemap = []

  // Adicionar páginas estáticas para cada locale
  for (const route of staticRoutes) {
    for (const locale of i18n.locales) {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/articles' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((loc) => [
              loc === 'pt-br' ? 'pt-BR' : loc,
              `${baseUrl}/${loc}${route}`,
            ])
          ),
        },
      })
    }
  }

  // Adicionar artigos para cada locale
  for (const locale of i18n.locales) {
    const articles = await getAllArticles(locale)

    for (const article of articles) {
      sitemap.push({
        url: `${baseUrl}/${locale}/articles/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((loc) => [
              loc === 'pt-br' ? 'pt-BR' : loc,
              `${baseUrl}/${loc}/articles/${article.slug}`,
            ])
          ),
        },
      })
    }
  }

  return sitemap
}
