import 'server-only'
import type { Locale } from './config'
import { i18n } from './config'

const dictionaries = {
  'pt-br': () =>
    import('./dictionaries/pt-br.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
}

/**
 * Carrega o dicionário de traduções para o locale especificado
 * @param locale - Locale a ser carregado (pt-br | en)
 * @returns Promise com o dicionário de traduções
 * @throws Error se o dicionário não puder ser carregado e não houver fallback
 */
export const getDictionary = async (locale: Locale) => {
  try {
    return await dictionaries[locale]()
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error)

    // Fallback para locale padrão se não for já o padrão
    if (locale !== i18n.defaultLocale) {
      console.warn(
        `Falling back to default locale: ${i18n.defaultLocale}`,
      )
      try {
        return await dictionaries[i18n.defaultLocale]()
      } catch (fallbackError) {
        console.error(
          `Failed to load fallback dictionary: ${i18n.defaultLocale}`,
          fallbackError,
        )
        throw new Error(
          `Failed to load dictionaries. Please check i18n configuration.`,
        )
      }
    }

    // Se já era o locale padrão, não há fallback
    throw new Error(
      `Failed to load default dictionary (${locale}). Please check i18n configuration.`,
    )
  }
}
