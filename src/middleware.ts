import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n, isValidLocale, languageMap, type Locale } from '@/lib/i18n/config'

/**
 * Middleware de internacionalização
 * Detecta o locale preferido do usuário e redireciona para a URL apropriada
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Verificar se já tem locale na URL
  const pathnameHasLocale = i18n.locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  // Se já tem locale, continuar sem modificar
  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Detectar locale preferido do usuário
  const locale = getLocale(request) || i18n.defaultLocale

  // Redirecionar para URL com locale
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
}

/**
 * Detecta o locale preferido do usuário
 * @param request - NextRequest object
 * @returns Locale válido ou undefined
 */
function getLocale(request: NextRequest): Locale | undefined {
  // 1. Verificar cookie de preferência
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  if (localeCookie && isValidLocale(localeCookie)) {
    return localeCookie
  }

  // 2. Verificar Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    // Exemplo: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7
    const languages = acceptLanguage
      .split(',')
      .map((lang) => {
        const [locale] = lang.split(';')
        return locale.trim().toLowerCase()
      })

    // Tentar encontrar correspondência no mapa de idiomas
    for (const lang of languages) {
      const mappedLocale = languageMap[lang]
      if (mappedLocale && isValidLocale(mappedLocale)) {
        return mappedLocale
      }
    }
  }

  return undefined
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - _next static files (/_next/static/*)
     * - _next image optimization (/_next/image/*)
     * - _next data (/_next/data/*)
     * - static files (favicon.ico, robots.txt, sitemap.xml)
     * - files with common static extensions
     */
    '/((?!api|_next/static|_next/image|_next/data|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.jpg|.*\\.jpeg|.*\\.png|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.webp|.*\\.avif|.*\\.css|.*\\.js|.*\\.woff|.*\\.woff2|.*\\.ttf|.*\\.eot).*)',
  ],
}
