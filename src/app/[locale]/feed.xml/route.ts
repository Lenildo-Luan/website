import { Feed } from 'feed'
import { getAllArticles } from '@/lib/articles'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { siteConfig } from '@/lib/env'
import type { Locale } from '@/lib/i18n/config'

/**
 * Gera RSS feed localizado para cada idioma
 * GET /pt-br/feed.xml -> Feed em português
 * GET /en/feed.xml -> Feed em inglês
 */
export async function GET(
  request: Request,
  { params }: { params: { locale: Locale } }
) {
  const { locale } = params
  const baseUrl = siteConfig.url
  const dict = await getDictionary(locale)

  const author = {
    name: dict.pages.home.name,
    email: dict.social.email,
  }

  const feed = new Feed({
    title: `${dict.pages.home.name} - ${dict.pages.articles.metaTitle}`,
    description: dict.pages.articles.metaDescription,
    id: `${baseUrl}/${locale}`,
    link: `${baseUrl}/${locale}`,
    language: locale === 'pt-br' ? 'pt-BR' : 'en',
    image: `${baseUrl}/favicon.ico`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `${dict.footer.allRightsReserved} ${new Date().getFullYear()} ${dict.pages.home.name}`,
    author,
    feedLinks: {
      rss2: `${baseUrl}/${locale}/feed.xml`,
      atom: `${baseUrl}/${locale}/feed.xml`,
    },
  })

  // Obter todos os artigos do locale especificado
  const articles = await getAllArticles(locale)

  for (const article of articles) {
    const publicUrl = `${baseUrl}/${locale}/articles/${article.slug}`

    feed.addItem({
      title: article.title,
      id: publicUrl,
      link: publicUrl,
      description: article.description,
      author: [author],
      contributor: [author],
      date: new Date(article.date),
      published: new Date(article.date),
    })
  }

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 's-maxage=31556952',
    },
  })
}
