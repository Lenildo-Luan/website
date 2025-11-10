export const i18n = {
  defaultLocale: 'pt-br',
  locales: ['pt-br', 'en'],
} as const

export type Locale = (typeof i18n)['locales'][number]

export const localeNames: Record<Locale, string> = {
  'pt-br': 'Português',
  'en': 'English',
}

export const localeLabels: Record<Locale, string> = {
  'pt-br': 'PT',
  'en': 'EN',
}

/**
 * Type guard para validar se uma string é um Locale válido
 * @param locale - String a ser validada
 * @returns true se locale for válido
 */
export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale)
}

/**
 * Mapeamento de códigos de idioma para locales suportados
 * Permite detecção flexível baseada em Accept-Language header
 */
export const languageMap: Record<string, Locale> = {
  pt: 'pt-br',
  'pt-br': 'pt-br',
  'pt-pt': 'pt-br', // Portuguese de Portugal -> usar pt-br por enquanto
  en: 'en',
  'en-us': 'en',
  'en-gb': 'en',
  'en-ca': 'en',
  'en-au': 'en',
}
