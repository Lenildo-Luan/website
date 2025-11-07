import { localeNames, type Locale } from '@/lib/i18n/config'

export function FallbackNotice({
  requestedLocale,
  fallbackLocale,
}: {
  requestedLocale: Locale
  fallbackLocale: Locale
}) {
  const requestedLanguage = localeNames[requestedLocale]
  const fallbackLanguage = localeNames[fallbackLocale]

  return (
    <div className="not-prose mb-8 rounded-2xl border border-orange-100 bg-orange-50 p-6 dark:border-orange-900/50 dark:bg-orange-900/10">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-orange-500 dark:text-orange-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">
            {requestedLocale === 'en'
              ? 'Translation not available'
              : 'Tradução não disponível'}
          </h3>
          <div className="mt-2 text-sm text-orange-700 dark:text-orange-400">
            <p>
              {requestedLocale === 'en'
                ? `This article is not yet available in ${requestedLanguage}. You're viewing the ${fallbackLanguage} version.`
                : `Este artigo ainda não está disponível em ${requestedLanguage}. Você está vendo a versão em ${fallbackLanguage}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
