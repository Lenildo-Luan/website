# Plano de Internacionalização - Portfolio Lenildo Luan

## 1. Análise do Estado Atual

### Conteúdo Misto Identificado

**Português (PT-BR):**
- Labels de navegação: "Sobre", "Menu"
- Seção de carreira: "Carreira", "Atualmente", "Baixar CV"
- Homepage: Introdução pessoal completa em português
- Página About: Todo conteúdo em português
- Metadata About: Descrição em inglês (inconsistência)

**Inglês (EN):**
- Labels: "Articles", "Read article", "Stay up to date", "Join"
- Newsletter: Todos os textos em inglês
- Card CTA: "Read article"

### Arquitetura Atual
- Next.js 14 com App Router
- MDX para artigos (`src/app/articles/[slug]/page.mdx`)
- Componentes TypeScript + React
- Sem solução de i18n implementada

## 2. Objetivos

### Idiomas Alvo
1. **Português Brasileiro (PT-BR)** - Idioma primário
2. **Inglês (EN)** - Idioma secundário

### Metas
- Experiência consistente em ambos os idiomas
- SEO otimizado para cada idioma
- Transição suave entre idiomas
- Manutenção simplificada do conteúdo
- Performance não comprometida

## 3. Estratégia Técnica

### Abordagem Recomendada: Internacionalização Nativa do Next.js 14

**Por que essa abordagem?**
- Suporte nativo no Next.js 14 App Router
- SEO otimizado com URLs dedicadas (`/pt-br/`, `/en/`)
- Static Site Generation (SSG) mantido
- Middleware para detecção de idioma
- Sem dependências extras necessárias

### Alternativas Consideradas

1. **next-intl** (❌ Descartada)
   - Adiciona dependência extra
   - Complexidade desnecessária para 2 idiomas
   - Overhead de runtime

2. **react-i18next** (❌ Descartada)
   - Focada em client-side
   - Não aproveita SSG do Next.js
   - Mais adequada para SPAs

## 4. Estrutura de Implementação

### 4.1. Estrutura de Diretórios

```
src/
├── app/
│   ├── [locale]/                    # Novo: rota dinâmica para idiomas
│   │   ├── layout.tsx               # Layout com locale context
│   │   ├── page.tsx                 # Homepage localizada
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── articles/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.mdx
│   │   ├── projects/
│   │   ├── speaking/
│   │   └── uses/
│   ├── layout.tsx                   # Root layout (metadata global)
│   └── middleware.ts                # Novo: detecção e redirecionamento
├── lib/
│   ├── i18n/
│   │   ├── config.ts                # Configuração de idiomas
│   │   ├── dictionaries/            # Arquivos de tradução
│   │   │   ├── pt-br.json
│   │   │   └── en.json
│   │   ├── get-dictionary.ts        # Função para carregar traduções
│   │   └── types.ts                 # Types para traduções
│   └── articles.ts                  # Atualizar para suportar locale
└── components/
    ├── Header.tsx                   # Adicionar LanguageSwitcher
    ├── LanguageSwitcher.tsx         # Novo componente
    └── ...
```

### 4.2. Configuração de Idiomas

**`src/lib/i18n/config.ts`:**
```typescript
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
```

### 4.3. Middleware para Detecção de Idioma

**`src/middleware.ts`:**
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from '@/lib/i18n/config'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Verificar se já tem locale na URL
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Detectar locale preferido do usuário
  const locale = getLocale(request) || i18n.defaultLocale

  // Redirecionar para URL com locale
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  )
}

function getLocale(request: NextRequest): string | undefined {
  // 1. Verificar cookie de preferência
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  if (localeCookie && i18n.locales.includes(localeCookie as any)) {
    return localeCookie
  }

  // 2. Verificar Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    // pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7
    const languages = acceptLanguage.split(',').map(lang => {
      const [locale] = lang.split(';')
      return locale.trim().toLowerCase()
    })

    for (const lang of languages) {
      if (lang.startsWith('pt')) return 'pt-br'
      if (lang.startsWith('en')) return 'en'
    }
  }

  return undefined
}

export const config = {
  matcher: [
    // Ignorar arquivos estáticos e API routes
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
}
```

### 4.4. Dicionários de Tradução

**Estrutura JSON Recomendada:**

**`src/lib/i18n/dictionaries/pt-br.json`:**
```json
{
  "common": {
    "menu": "Menu",
    "readMore": "Ler artigo",
    "downloadCV": "Baixar CV",
    "currently": "Atualmente"
  },
  "nav": {
    "about": "Sobre",
    "articles": "Artigos",
    "projects": "Projetos",
    "speaking": "Palestras",
    "uses": "Ferramentas"
  },
  "home": {
    "greeting": "Prazer,",
    "name": "Lenildo Luan",
    "intro": "Desenvolvedor de software multidisciplinar residente em João Pessoa, Paraíba, onde crio soluções através de código e capacito profissionais para fazer o mesmo enquanto busco me tornar um ser humano melhor, 1% a cada dia.",
    "careerTitle": "Carreira"
  },
  "newsletter": {
    "title": "Mantenha-se atualizado",
    "description": "Receba notificações quando eu publicar algo novo, cancele a qualquer momento.",
    "emailPlaceholder": "Endereço de e-mail",
    "joinButton": "Inscrever"
  },
  "about": {
    "title": "Um pouco mais sobre mim",
    "metaDescription": "Sou Lenildo Luan. Moro em João Pessoa, onde transformo ideias em realidade através da tecnologia."
  },
  "articles": {
    "title": "Escrevendo sobre tecnologia, design e mais.",
    "metaDescription": "Todos os meus pensamentos sobre programação, liderança e mais, em ordem cronológica."
  },
  "roles": {
    "seniorSoftwareEngineer": "Eng de Software Sênior",
    "middleFrontendDeveloper": "Dev Front-End Pleno",
    "juniorFrontendDeveloper": "Dev Front-End Júnior",
    "intern": "Estagiário"
  },
  "social": {
    "instagram": "Instagram",
    "github": "GitHub",
    "linkedin": "LinkedIn",
    "email": "lenildoluan@gmail.com"
  }
}
```

**`src/lib/i18n/dictionaries/en.json`:**
```json
{
  "common": {
    "menu": "Menu",
    "readMore": "Read article",
    "downloadCV": "Download CV",
    "currently": "Present"
  },
  "nav": {
    "about": "About",
    "articles": "Articles",
    "projects": "Projects",
    "speaking": "Speaking",
    "uses": "Uses"
  },
  "home": {
    "greeting": "Nice to meet you,",
    "name": "I'm Lenildo Luan",
    "intro": "Multidisciplinary software developer based in João Pessoa, Brazil, where I build solutions through code and empower professionals to do the same while striving to become a better human being, 1% at a time.",
    "careerTitle": "Career"
  },
  "newsletter": {
    "title": "Stay up to date",
    "description": "Get notified when I publish something new, and unsubscribe at any time.",
    "emailPlaceholder": "Email address",
    "joinButton": "Join"
  },
  "about": {
    "title": "A little more about me",
    "metaDescription": "I'm Lenildo Luan. I live in João Pessoa, where I turn ideas into reality through technology."
  },
  "articles": {
    "title": "Writing about tech, design, and more.",
    "metaDescription": "All of my thoughts on programming, leadership, and more, in chronological order."
  },
  "roles": {
    "seniorSoftwareEngineer": "Senior Software Engineer",
    "middleFrontendDeveloper": "Mid-Level Frontend Developer",
    "juniorFrontendDeveloper": "Junior Frontend Developer",
    "intern": "Intern"
  },
  "social": {
    "instagram": "Instagram",
    "github": "GitHub",
    "linkedin": "LinkedIn",
    "email": "lenildoluan@gmail.com"
  }
}
```

### 4.5. Função para Carregar Dicionários

**`src/lib/i18n/get-dictionary.ts`:**
```typescript
import 'server-only'
import type { Locale } from './config'

const dictionaries = {
  'pt-br': () => import('./dictionaries/pt-br.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]()
}
```

### 4.6. Types para TypeScript

**`src/lib/i18n/types.ts`:**
```typescript
import type ptBR from './dictionaries/pt-br.json'

export type Dictionary = typeof ptBR
```

## 5. Atualização de Componentes

### 5.1. Root Layout

**`src/app/layout.tsx`:**
- Manter estrutura básica
- Metadata global
- Não precisa mudanças significativas

### 5.2. Layout Localizado

**`src/app/[locale]/layout.tsx`:**
```typescript
import { notFound } from 'next/navigation'
import { i18n } from '@/lib/i18n/config'
import { Providers } from '../providers'
import { Layout } from '@/components/Layout'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validar locale
  if (!i18n.locales.includes(locale as any)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers>
          <div className="fixed inset-0 flex justify-center sm:px-8">
            <div className="flex w-full max-w-7xl lg:px-8">
              <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
            </div>
          </div>
          <div className="relative flex w-full flex-col">
            <Layout locale={locale}>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
```

### 5.3. Header com Seletor de Idioma

**Atualizar `src/components/Header.tsx`:**
- Adicionar componente `LanguageSwitcher` após o `ThemeToggle`
- Receber `locale` como prop e passar para o switcher

### 5.4. Componente Language Switcher

**`src/components/LanguageSwitcher.tsx`:**
```typescript
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { i18n, localeLabels, type Locale } from '@/lib/i18n/config'

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const switchLocale = (newLocale: Locale) => {
    if (!pathname) return

    // Remover locale atual da URL
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    // Salvar preferência em cookie
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`

    // Navegar para nova URL
    router.push(newPath)
  }

  if (!mounted) {
    return (
      <div className="flex rounded-full bg-white/90 px-3 py-2 ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10">
        <span className="text-sm font-medium">{localeLabels[locale]}</span>
      </div>
    )
  }

  return (
    <div className="flex gap-2 rounded-full bg-white/90 p-1 ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm dark:bg-zinc-800/90 dark:ring-white/10">
      {i18n.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={clsx(
            'rounded-full px-3 py-1 text-sm font-medium transition',
            loc === locale
              ? 'bg-orange-500 text-white dark:bg-orange-400'
              : 'text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100'
          )}
          aria-label={`Switch to ${localeLabels[loc]}`}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  )
}
```

### 5.5. Atualizar Páginas

**Padrão para todas as páginas:**

```typescript
import { getDictionary } from '@/lib/i18n/get-dictionary'
import type { Locale } from '@/lib/i18n/config'

export default async function Page({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const dict = await getDictionary(locale)

  return (
    <div>
      <h1>{dict.home.greeting}</h1>
      {/* Usar dict em vez de strings hardcoded */}
    </div>
  )
}
```

## 6. Gestão de Conteúdo MDX

### 6.1. Artigos em Múltiplos Idiomas

**Opção 1: Arquivos Separados (Recomendada)**

```
src/app/[locale]/articles/
├── utf-16-introduction/
│   ├── page.pt-br.mdx
│   └── page.en.mdx
└── outro-artigo/
    ├── page.pt-br.mdx
    └── page.en.mdx
```

**Opção 2: Diretórios por Locale**

```
src/content/articles/
├── pt-br/
│   └── utf-16-introduction/
│       └── page.mdx
└── en/
    └── utf-16-introduction/
        └── page.mdx
```

### 6.2. Atualizar `lib/articles.ts`

```typescript
import { type Locale } from '@/lib/i18n/config'

export async function getAllArticles(locale: Locale) {
  // Buscar apenas artigos do locale especificado
  let articleGlobs = import.meta.glob(`../app/[locale]/articles/*/page.${locale}.mdx`)

  // ... resto da lógica
}
```

### 6.3. Fallback para Artigos Não Traduzidos

```typescript
export async function getArticle(slug: string, locale: Locale) {
  try {
    // Tentar carregar no idioma solicitado
    const article = await import(`../app/[locale]/articles/${slug}/page.${locale}.mdx`)
    return article
  } catch {
    // Fallback para idioma padrão
    const article = await import(`../app/[locale]/articles/${slug}/page.pt-br.mdx`)
    return { ...article, isFallback: true }
  }
}
```

## 7. SEO e Metadata

### 7.1. Metadata Localizada

```typescript
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import type { Locale } from '@/lib/i18n/config'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const dict = await getDictionary(locale)

  return {
    title: dict.about.title,
    description: dict.about.metaDescription,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        'pt-BR': '/pt-br/about',
        'en': '/en/about',
      },
    },
    openGraph: {
      locale: locale === 'pt-br' ? 'pt_BR' : 'en_US',
      alternateLocale: locale === 'pt-br' ? 'en_US' : 'pt_BR',
    },
  }
}
```

### 7.2. Sitemap Multi-idioma

**`src/app/sitemap.ts`:**
```typescript
import { MetadataRoute } from 'next'
import { i18n } from '@/lib/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  const routes = ['', '/about', '/articles', '/projects']

  const sitemap: MetadataRoute.Sitemap = []

  routes.forEach((route) => {
    i18n.locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            i18n.locales.map((loc) => [
              loc === 'pt-br' ? 'pt-BR' : loc,
              `${baseUrl}/${loc}${route}`,
            ])
          ),
        },
      })
    })
  })

  return sitemap
}
```

### 7.3. Robots.txt

**`src/app/robots.ts`:**
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

## 8. RSS Feed Multi-idioma

**Atualizar para gerar feeds separados:**
- `/pt-br/feed.xml`
- `/en/feed.xml`

```typescript
// src/app/[locale]/feed.xml/route.ts
import { Feed } from 'feed'
import { getAllArticles } from '@/lib/articles'
import type { Locale } from '@/lib/i18n/config'

export async function GET(
  request: Request,
  { params }: { params: { locale: Locale } }
) {
  const articles = await getAllArticles(params.locale)

  // ... configurar Feed com base no locale
}
```

## 9. Experiência do Usuário

### 9.1. Persistência de Preferência
- Cookie `NEXT_LOCALE` com duração de 1 ano
- Detecção automática na primeira visita via `Accept-Language`
- Respeitar preferência do usuário em visitas subsequentes

### 9.2. Transição Suave
- Manter posição na página ao trocar idioma
- Preservar parâmetros de URL
- Feedback visual durante troca

### 9.3. Indicadores Visuais
- Badge "Tradução automática" para artigos não traduzidos
- Seletor de idioma sempre visível no header
- Estado ativo claro no language switcher

## 10. Timeline de Implementação

### Fase 1: Infraestrutura (Semana 1-2)
- [ ] Configurar estrutura de diretórios `[locale]`
- [ ] Implementar middleware de detecção
- [ ] Criar dicionários base (pt-br e en)
- [ ] Implementar `getDictionary` e types
- [ ] Configurar `generateStaticParams`

### Fase 2: Componentes (Semana 2-3)
- [ ] Atualizar Layout com locale
- [ ] Criar LanguageSwitcher
- [ ] Atualizar Header
- [ ] Atualizar Footer
- [ ] Atualizar componentes Card, Button, etc.

### Fase 3: Páginas (Semana 3-4)
- [ ] Migrar Homepage
- [ ] Migrar About
- [ ] Migrar Articles listing
- [ ] Migrar outras páginas (Projects, Speaking, Uses)

### Fase 4: Conteúdo MDX (Semana 4-5)
- [ ] Definir estrutura para artigos multi-idioma
- [ ] Atualizar `lib/articles.ts`
- [ ] Migrar artigos existentes
- [ ] Implementar fallback para artigos não traduzidos
- [ ] Criar templates para novos artigos

### Fase 5: SEO e Metadata (Semana 5)
- [ ] Implementar metadata localizada
- [ ] Configurar sitemap multi-idioma
- [ ] Configurar robots.txt
- [ ] Atualizar RSS feeds
- [ ] Adicionar hreflang tags

### Fase 6: Testes e Refinamentos (Semana 6)
- [ ] Testar troca de idiomas
- [ ] Validar SEO (Google Search Console)
- [ ] Testar detecção automática
- [ ] Verificar performance (Lighthouse)
- [ ] Testes de acessibilidade
- [ ] Ajustes finais de UX

### Fase 7: Deploy e Monitoramento (Semana 7)
- [ ] Deploy em staging
- [ ] Testes de aceitação
- [ ] Deploy em produção
- [ ] Monitorar analytics
- [ ] Coletar feedback

## 11. Checklist de Testes

### Funcionalidade
- [ ] Detecção automática de idioma funciona corretamente
- [ ] Troca manual de idioma funciona em todas as páginas
- [ ] Preferência é persistida entre sessões
- [ ] Fallback para artigos não traduzidos funciona
- [ ] Links internos mantêm o locale correto

### SEO
- [ ] Todas as páginas têm hreflang tags corretas
- [ ] Metadata está localizada
- [ ] Sitemap inclui todas as variações de idioma
- [ ] URLs canônicas estão corretas
- [ ] Open Graph tags incluem locale

### Performance
- [ ] Lighthouse score mantido (>90)
- [ ] Bundle size não aumentou significativamente
- [ ] Static generation funciona para todos os locales
- [ ] Tempo de carregamento aceitável

### Acessibilidade
- [ ] ARIA labels localizados
- [ ] Lang attribute correto em cada página
- [ ] Navegação por teclado funcional
- [ ] Screen readers detectam mudanças de idioma

### UX
- [ ] Seletor de idioma é intuitivo
- [ ] Estado ativo é claro
- [ ] Não há conteúdo misto em uma mesma página
- [ ] Formatação de datas respeita locale
- [ ] Mensagens de erro localizadas

## 12. Manutenção Contínua

### Adicionando Novas Traduções
1. Atualizar `dictionaries/pt-br.json` e `dictionaries/en.json`
2. Verificar types no TypeScript
3. Testar em ambos os idiomas

### Adicionando Novo Artigo
1. Criar diretório em `articles/[slug]/`
2. Criar `page.pt-br.mdx` (obrigatório)
3. Criar `page.en.mdx` (opcional, usar fallback se não disponível)
4. Adicionar metadata em ambos os arquivos

### Monitoramento
- Analytics separados por idioma
- Identificar artigos que precisam tradução
- Monitorar bounce rate por idioma
- Acompanhar origem geográfica dos visitantes

## 13. Recursos e Referências

### Documentação
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [MDN: HTTP Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language)
- [Google Search Central: Multi-regional sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)

### Ferramentas
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) - VS Code extension
- [Google Translate API](https://cloud.google.com/translate) - Para traduções auxiliares
- [DeepL](https://www.deepl.com/translator) - Tradução de qualidade

### Validação
- [hreflang Testing Tool](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-testing-tool/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/) - Auditoria de SEO

## 14. Considerações Finais

### Vantagens da Abordagem
- ✅ SEO nativo com URLs dedicadas
- ✅ Performance mantida (SSG)
- ✅ Sem dependências extras
- ✅ Type-safe com TypeScript
- ✅ Escalável para mais idiomas
- ✅ Manutenção simplificada

### Desafios Potenciais
- ⚠️ Duplicação de rotas (aumenta build time)
- ⚠️ Necessidade de traduzir todo conteúdo
- ⚠️ Sincronização entre versões de artigos
- ⚠️ Testes mais complexos

### Próximos Passos
1. Revisar e aprovar plano
2. Criar branch `feat/i18n`
3. Começar Fase 1 (Infraestrutura)
4. Iterar com feedback
5. Deploy gradual (feature flag se necessário)

---

**Última atualização:** 2025-01-15
**Versão:** 1.0
**Status:** Planejamento
