import { i18n, type Locale } from './config'
import { siteConfig } from '../env'

/**
 * Obtém a URL base do site a partir da configuração validada
 * @returns URL base do site
 */
export function getSiteUrl(): string {
  return siteConfig.url
}

/**
 * Gera uma URL localizada para um determinado locale e path
 * @param locale - Locale para a URL
 * @param path - Path relativo (com ou sem barra inicial)
 * @returns URL completa localizada
 * @example
 * getLocalizedUrl('pt-br', '/about') // 'https://example.com/pt-br/about'
 * getLocalizedUrl('en', 'articles') // 'https://example.com/en/articles'
 */
export function getLocalizedUrl(locale: Locale, path: string = ''): string {
  const baseUrl = getSiteUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}/${locale}${normalizedPath}`
}

/**
 * Gera objeto com URLs alternativas para todos os locales suportados
 * Usado para hreflang tags e metadata alternates
 * @param path - Path relativo (opcional)
 * @returns Objeto com locale como chave e URL como valor
 * @example
 * getAlternateLanguages('/about')
 * // { 'pt-BR': 'https://example.com/pt-br/about', 'en': 'https://example.com/en/about' }
 */
export function getAlternateLanguages(
  path: string = '',
): Record<string, string> {
  return Object.fromEntries(
    i18n.locales.map((locale) => [
      // Usar formato correto: pt-BR em vez de pt-br para hreflang
      locale === 'pt-br' ? 'pt-BR' : locale,
      getLocalizedUrl(locale, path),
    ]),
  )
}

/**
 * Converte locale do formato interno para o formato do atributo lang HTML
 * @param locale - Locale interno (pt-br, en)
 * @returns Locale no formato HTML (pt-BR, en)
 */
export function getHtmlLang(locale: Locale): string {
  return locale === 'pt-br' ? 'pt-BR' : locale
}

/**
 * Converte locale do formato interno para o formato Open Graph
 * @param locale - Locale interno (pt-br, en)
 * @returns Locale no formato Open Graph (pt_BR, en_US)
 */
export function getOpenGraphLocale(locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    'pt-br': 'pt_BR',
    en: 'en_US',
  }
  return localeMap[locale]
}

/**
 * Obtém o locale alternativo para Open Graph
 * @param locale - Locale atual
 * @returns Locale alternativo no formato Open Graph
 */
export function getAlternateOpenGraphLocale(locale: Locale): string {
  return locale === 'pt-br' ? 'en_US' : 'pt_BR'
}
