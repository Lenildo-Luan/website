'use client'

import { useEffect } from 'react'
import type { Locale } from '@/lib/i18n/config'

export function LangAttribute({ locale }: { locale: Locale }) {
  // Converter locale para o formato correto do atributo lang
  const htmlLang = locale === 'pt-br' ? 'pt-BR' : locale

  useEffect(() => {
    // Atualizar o atributo lang do HTML
    // O root layout já define pt-BR como padrão, então isso apenas
    // ajusta para o locale correto se for diferente
    if (document.documentElement.lang !== htmlLang) {
      document.documentElement.lang = htmlLang
    }
  }, [htmlLang])

  return null
}
