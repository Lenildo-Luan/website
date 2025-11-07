import glob from 'fast-glob'
import path from 'path'
import type { Locale } from './i18n/config'

/**
 * Interface base para um artigo
 */
interface Article {
  title: string
  description: string
  author: string
  date: string
}

/**
 * Interface para um artigo com slug
 * Estende Article adicionando a propriedade slug para URLs
 */
export interface ArticleWithSlug extends Article {
  slug: string
}

/**
 * Importa dinamicamente um artigo MDX
 * @param articleFilename - Nome do arquivo do artigo (ex: "my-article/page.mdx")
 * @returns Promise com os dados do artigo incluindo o slug
 * @private
 */
async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  // Usar caminho relativo ao diretório [locale]/articles
  // O Next.js resolverá [locale] como o diretório literal no filesystem
  let { article } = (await import(
    `../app/[locale]/articles/${articleFilename}`
  )) as {
    default: React.ComponentType
    article: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...article,
  }
}

/**
 * Obtém todos os artigos ordenados por data (mais recente primeiro)
 * @param locale - Locale para filtrar artigos (atualmente todos artigos são compartilhados)
 * @returns Promise com array de artigos ordenados por data decrescente
 * @example
 * const articles = await getAllArticles('pt-br')
 * // [{ slug: 'latest-post', title: '...', date: '2025-01-15', ... }, ...]
 *
 * @todo Phase 4 (Content MDX): Implement locale-specific article filtering
 * Currently the locale parameter is accepted but not used to filter articles.
 * All articles are returned regardless of locale. In Phase 4, we will:
 * 1. Implement article file structure: page.pt-br.mdx / page.en.mdx
 * 2. Filter articles based on locale parameter
 * 3. Implement fallback mechanism for untranslated articles
 */
export async function getAllArticles(locale: Locale = 'pt-br') {
  // TODO: Use locale to filter articles once Phase 4 is implemented
  // For now, return all articles regardless of locale

  // Usar o caminho literal do diretório no filesystem
  // [locale] é o nome real da pasta, não uma variável
  const articlesPath = path.join(
    process.cwd(),
    'src',
    'app',
    '[locale]',
    'articles',
  )

  let articleFilenames = await glob('*/page.mdx', {
    cwd: articlesPath,
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
