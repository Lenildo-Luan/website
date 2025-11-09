'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { i18n, localeLabels, type Locale } from '@/lib/i18n/config'
import clsx from 'clsx'

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()

  // Remove o locale atual do pathname para gerar o path base
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'

  return (
    <div className="flex gap-1 rounded-full bg-white/90 px-3 py-2 text-sm font-medium ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10">
      {i18n.locales.map((locale, index) => {
        const isActive = locale === currentLocale
        const href = `/${locale}${pathWithoutLocale}`

        return (
          <div key={locale} className="flex items-center">
            {index > 0 && (
              <span className="mx-1 text-zinc-400 dark:text-zinc-600">|</span>
            )}
            <Link
              href={href}
              className={clsx(
                'px-2 py-1 rounded transition',
                isActive
                  ? 'text-orange-500 dark:text-orange-400'
                  : 'text-zinc-600 hover:text-orange-500 dark:text-zinc-400 dark:hover:text-orange-400'
              )}
              aria-label={`Switch to ${locale}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {localeLabels[locale]}
            </Link>
          </div>
        )
      })}
    </div>
  )
}
