import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/env'

/**
 * Gera o arquivo robots.txt para controle de crawlers
 * Permite acesso a todas as páginas e indica a localização do sitemap
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/thank-you'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
