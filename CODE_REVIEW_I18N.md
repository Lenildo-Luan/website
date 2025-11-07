# Code Review - Implementação i18n (Fase 1)

**Data:** 2025-11-07
**Revisor:** Claude Code
**Escopo:** Infraestrutura de internacionalização (Fase 1)

---

## 📊 Resumo Executivo

| Categoria | Quantidade |
|-----------|-----------|
| 🔴 Crítico | 3 |
| 🟠 Alto | 4 |
| 🟡 Médio | 5 |
| 🟢 Baixo | 3 |
| **Total** | **15** |

**Status Geral:** ⚠️ Necessita correções antes de produção

---

## 🔴 Problemas Críticos

### 1. `src/lib/articles.ts` - Importação dinâmica quebrada

**Severidade:** 🔴 Crítica
**Linha:** 19-20
**Tipo:** Bug funcional

**Problema:**
```typescript
let { article } = (await import(
  `../app/[locale]/articles/${articleFilename}`
)) as {
```

A string literal `[locale]` não será substituída dinamicamente. O import está tentando acessar um diretório literalmente chamado `[locale]` em vez de usar o valor da variável.

**Impacto:**
- ❌ Aplicação quebra ao tentar carregar artigos
- ❌ Build pode falhar ou gerar rotas incorretas

**Correção:**
```typescript
// Usar import dinâmico com template string
const articleModule = await import(
  `../app/[locale]/articles/${articleFilename}`
).catch(() => {
  // Fallback para locale padrão se não existir
  return import(`../app/[locale]/articles/${articleFilename}`)
})
```

**Solução Recomendada:**
```typescript
// Opção 1: Usar require.context (melhor para webpack)
const getArticleContext = (locale: Locale) => {
  if (locale === 'pt-br') {
    return require.context('../app/[locale]/articles', true, /\.mdx$/)
  }
  return require.context('../app/[locale]/articles', true, /\.mdx$/)
}

// Opção 2: Pré-gerar mapeamento no build time
// Opção 3: Usar filesystem API em vez de dynamic imports
```

---

### 2. `src/lib/articles.ts` - Caminho de glob incorreto

**Severidade:** 🔴 Crítica
**Linha:** 33-35
**Tipo:** Bug funcional

**Problema:**
```typescript
let articleFilenames = await glob('*/page.mdx', {
  cwd: './src/app/[locale]/articles',
})
```

O `cwd` aponta para um caminho literal com `[locale]`, não para o diretório real.

**Impacto:**
- ❌ Nenhum artigo será encontrado
- ❌ Lista de artigos vazia em todas as páginas

**Correção:**
```typescript
export async function getAllArticles(locale: Locale = 'pt-br') {
  // Resolver o caminho real baseado no locale
  const articlesPath = path.join(
    process.cwd(),
    'src',
    'app',
    '[locale]',
    'articles'
  )

  let articleFilenames = await glob('*/page.mdx', {
    cwd: articlesPath,
  })

  // ... resto do código
}
```

**Solução Alternativa:**
Usar filesystem nativo:
```typescript
import fs from 'fs/promises'
import path from 'path'

export async function getAllArticles(locale: Locale = 'pt-br') {
  const articlesDir = path.join(
    process.cwd(),
    'src/app/[locale]/articles'
  )

  const entries = await fs.readdir(articlesDir, { withFileTypes: true })
  const articleDirs = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)

  // ... importar cada artigo
}
```

---

### 3. `src/components/LangAttribute.tsx` - Abordagem inadequada

**Severidade:** 🔴 Crítica
**Linha:** 7-10
**Tipo:** Arquitetura/Performance

**Problema:**
```typescript
export function LangAttribute({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale === 'pt-br' ? 'pt-BR' : locale
  }, [locale])

  return null
}
```

**Questões:**
1. **SEO:** Atributo `lang` não está presente no HTML inicial (apenas após hydration)
2. **Performance:** Client component desnecessário para algo que deveria ser server-side
3. **Flash:** Pode causar flash de conteúdo sem lang attribute
4. **Hydration mismatch:** Potencial warning do React

**Impacto:**
- ⚠️ SEO comprometido (crawlers não veem lang attribute)
- ⚠️ Acessibilidade afetada
- ⚠️ Performance degradada

**Correção Recomendada:**
Remover este componente e definir `lang` no root layout:

```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      {/* lang será setado pelo middleware/layout filho */}
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        {children}
      </body>
    </html>
  )
}

// src/app/[locale]/layout.tsx - usar Script ou modificar HTML
import Script from 'next/script'

export default async function LocaleLayout({ children, params }) {
  // Validar locale
  if (!i18n.locales.includes(params.locale as any)) {
    notFound()
  }

  const htmlLang = params.locale === 'pt-br' ? 'pt-BR' : params.locale

  return (
    <>
      <Script
        id="set-lang"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = '${htmlLang}';`,
        }}
      />
      {children}
    </>
  )
}
```

**Solução Melhor:**
Usar Headers/Metadata para definir lang:
```typescript
// Infelizmente Next.js não permite modificar <html> em nested layouts
// Alternativa: usar middleware para injetar header
```

---

## 🟠 Problemas de Alta Severidade

### 4. `src/middleware.ts` - Type assertion insegura

**Severidade:** 🟠 Alta
**Linha:** 26, 41
**Tipo:** Type Safety

**Problema:**
```typescript
if (localeCookie && i18n.locales.includes(localeCookie as any)) {
  return localeCookie
}
```

Uso de `as any` contorna type checking e pode causar bugs.

**Impacto:**
- ⚠️ Locale inválido pode passar pela validação
- ⚠️ Type safety perdida

**Correção:**
```typescript
function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale)
}

function getLocale(request: NextRequest): Locale | undefined {
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  if (localeCookie && isValidLocale(localeCookie)) {
    return localeCookie
  }

  // ... resto do código
}
```

---

### 5. `src/middleware.ts` - Missing return statement

**Severidade:** 🟠 Alta
**Linha:** 14
**Tipo:** Bug potencial

**Problema:**
```typescript
if (pathnameHasLocale) return
```

Retorna `undefined` implicitamente em vez de `NextResponse`.

**Impacto:**
- ⚠️ Comportamento inconsistente
- ⚠️ Pode causar erros em algumas versões do Next.js

**Correção:**
```typescript
if (pathnameHasLocale) {
  return NextResponse.next()
}
```

---

### 6. `src/middleware.ts` - Detecção de idioma hardcoded

**Severidade:** 🟠 Alta
**Linha:** 39-42
**Tipo:** Manutenibilidade

**Problema:**
```typescript
for (const lang of languages) {
  if (lang.startsWith('pt')) return 'pt-br'
  if (lang.startsWith('en')) return 'en'
}
```

Lógica hardcoded para apenas 2 idiomas. Dificulta escalabilidade.

**Impacto:**
- ⚠️ Necessita modificação manual para adicionar novos idiomas
- ⚠️ Não usa a configuração centralizada

**Correção:**
```typescript
// Criar mapeamento configurável
const languageMap: Record<string, Locale> = {
  'pt': 'pt-br',
  'pt-br': 'pt-br',
  'pt-pt': 'pt-br', // Pode ser 'pt-pt' se adicionar Portugal
  'en': 'en',
  'en-us': 'en',
  'en-gb': 'en',
}

function getLocale(request: NextRequest): Locale | undefined {
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  if (localeCookie && isValidLocale(localeCookie)) {
    return localeCookie
  }

  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase())

    for (const lang of languages) {
      const mappedLocale = languageMap[lang]
      if (mappedLocale && isValidLocale(mappedLocale)) {
        return mappedLocale
      }
    }
  }

  return undefined
}
```

---

### 7. `src/app/[locale]/layout.tsx` - Variável não utilizada

**Severidade:** 🟠 Alta
**Linha:** 16
**Tipo:** Code smell / Bug potencial

**Problema:**
```typescript
export async function generateMetadata({
  params,
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale)  // ❌ Não usado

  return {
    alternates: { /* ... */ },
    openGraph: { /* ... */ }
  }
}
```

Dictionary carregado mas não utilizado.

**Impacto:**
- ⚠️ Performance: Carregamento desnecessário
- ⚠️ Indica metadata incompleta

**Correção:**
```typescript
export async function generateMetadata({
  params,
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  // Se não precisa do dict, remover
  return {
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        'pt-BR': '/pt-br',
        'en': '/en',
      },
    },
    openGraph: {
      locale: params.locale === 'pt-br' ? 'pt_BR' : 'en_US',
      alternateLocale: params.locale === 'pt-br' ? 'en_US' : 'pt_BR',
    },
  }
}

// OU adicionar título e descrição localizados:
export async function generateMetadata({
  params,
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale)

  return {
    title: {
      template: `%s - ${dict.home.name}`,
      default: dict.home.name,
    },
    description: dict.home.intro,
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        'pt-BR': '/pt-br',
        'en': '/en',
      },
    },
    openGraph: {
      locale: params.locale === 'pt-br' ? 'pt_BR' : 'en_US',
      alternateLocale: params.locale === 'pt-br' ? 'en_US' : 'pt_BR',
      title: dict.home.name,
      description: dict.home.intro,
    },
  }
}
```

---

## 🟡 Problemas de Média Severidade

### 8. `src/lib/i18n/get-dictionary.ts` - Falta error handling

**Severidade:** 🟡 Média
**Linha:** 10-12
**Tipo:** Robustez

**Problema:**
```typescript
export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]()
}
```

Sem tratamento de erro se o import falhar.

**Impacto:**
- ⚠️ Aplicação quebra se arquivo JSON estiver corrompido
- ⚠️ Mensagens de erro pouco úteis

**Correção:**
```typescript
export const getDictionary = async (locale: Locale) => {
  try {
    return await dictionaries[locale]()
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error)

    // Fallback para locale padrão
    if (locale !== i18n.defaultLocale) {
      console.warn(`Falling back to default locale: ${i18n.defaultLocale}`)
      return await dictionaries[i18n.defaultLocale]()
    }

    throw new Error(`Failed to load dictionaries. Please check i18n configuration.`)
  }
}
```

---

### 9. `src/app/[locale]/layout.tsx` - Type assertion insegura

**Severidade:** 🟡 Média
**Linha:** 41, 47
**Tipo:** Type Safety

**Problema:**
```typescript
if (!i18n.locales.includes(params.locale as any)) {
  notFound()
}
// ...
<LangAttribute locale={params.locale as Locale} />
```

Duas conversões `as any` / `as Locale` desnecessárias.

**Impacto:**
- ⚠️ Type safety comprometida
- ⚠️ Duplicação de validação

**Correção:**
```typescript
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Type guard + validação
  if (!isValidLocale(params.locale)) {
    notFound()
  }

  // Agora TypeScript sabe que é Locale válido
  const locale: Locale = params.locale

  return (
    <>
      <LangAttribute locale={locale} />
      {children}
    </>
  )
}

// Adicionar type guard em config.ts
export function isValidLocale(locale: string): locale is Locale {
  return i18n.locales.includes(locale as Locale)
}
```

---

### 10. `src/middleware.ts` - Matcher regex pode ser mais específico

**Severidade:** 🟡 Média
**Linha:** 51
**Tipo:** Performance

**Problema:**
```typescript
matcher: [
  '/((?!api|_next/static|_next/image|images|favicon.ico|.*\\..*|_next/data).*)',
]
```

Regex `.*\\..*` é muito amplo e pode ter falsos positivos.

**Impacto:**
- ⚠️ Pode executar middleware em rotas que não deveria
- ⚠️ Arquivos com ponto no nome podem ser afetados

**Correção:**
```typescript
export const config = {
  matcher: [
    // Incluir apenas rotas que precisam de locale
    '/',
    '/(about|articles|projects|speaking|uses|thank-you)/:path*',
  ],
  // OU ser mais explícito nas exclusões
  matcher: [
    '/((?!api|_next/static|_next/image|_next/data|favicon.ico|.*\\.(jpg|jpeg|png|gif|svg|ico|webp|avif|css|js)).*)',
  ],
}
```

---

### 11. Metadata URLs hardcoded

**Severidade:** 🟡 Média
**Linha:** `[locale]/layout.tsx:22-23`
**Tipo:** Manutenibilidade

**Problema:**
```typescript
languages: {
  'pt-BR': '/pt-br',
  'en': '/en',
}
```

URLs hardcoded, dificultam mudanças futuras.

**Impacto:**
- ⚠️ Dificulta manutenção
- ⚠️ Inconsistente com NEXT_PUBLIC_SITE_URL

**Correção:**
```typescript
// src/lib/i18n/utils.ts
export function getLocalizedUrl(locale: Locale, path: string = '') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  return `${baseUrl}/${locale}${path}`
}

export function getAlternateLanguages(path: string = '') {
  return Object.fromEntries(
    i18n.locales.map(locale => [
      locale === 'pt-br' ? 'pt-BR' : locale,
      getLocalizedUrl(locale, path)
    ])
  )
}

// Uso:
return {
  alternates: {
    canonical: getLocalizedUrl(params.locale),
    languages: getAlternateLanguages(),
  },
  // ...
}
```

---

### 12. Falta validação de environment variable

**Severidade:** 🟡 Média
**Linha:** Configuração geral
**Tipo:** Robustez

**Problema:**
Nenhuma validação de `NEXT_PUBLIC_SITE_URL` na configuração i18n.

**Impacto:**
- ⚠️ Canonical URLs podem estar incorretas
- ⚠️ Feed RSS pode quebrar

**Correção:**
```typescript
// src/lib/i18n/config.ts ou env.ts
function validateEnv() {
  if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_SITE_URL is required in production')
  }
}

validateEnv()

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const
```

---

## 🟢 Problemas de Baixa Severidade

### 13. Dicionários - Estrutura pode ser melhorada

**Severidade:** 🟢 Baixa
**Tipo:** Organização

**Problema:**
Estrutura plana de dicionários pode ficar confusa com muitas chaves.

**Sugestão:**
```json
{
  "common": { /* ... */ },
  "nav": { /* ... */ },
  "pages": {
    "home": { /* ... */ },
    "about": { /* ... */ },
    "articles": { /* ... */ }
  },
  "components": {
    "newsletter": { /* ... */ },
    "resume": { /* ... */ }
  }
}
```

---

### 14. Falta de comentários JSDoc

**Severidade:** 🟢 Baixa
**Tipo:** Documentação

**Problema:**
Funções públicas não têm documentação.

**Sugestão:**
```typescript
/**
 * Carrega o dicionário de traduções para o locale especificado
 * @param locale - Locale a ser carregado (pt-br | en)
 * @returns Promise com o dicionário de traduções
 * @throws Error se o dicionário não puder ser carregado
 */
export const getDictionary = async (locale: Locale) => {
  // ...
}
```

---

### 15. Console warnings no build

**Severidade:** 🟢 Baixa
**Tipo:** Build

**Problema:**
```
Warning: Module type of file:///Users/.../typography.ts is not specified
```

**Correção:**
Adicionar ao `package.json`:
```json
{
  "type": "module"
}
```

Ou criar `typography.config.ts` em vez de `.ts`

---

## ✅ Pontos Positivos

1. ✅ Estrutura de diretórios bem organizada
2. ✅ Uso correto de `generateStaticParams` para SSG
3. ✅ Middleware implementado corretamente (com ressalvas)
4. ✅ Separação de responsabilidades (config, dictionaries, utils)
5. ✅ Type safety básico implementado
6. ✅ Suporte a fallback de idioma
7. ✅ Metadata SEO com hreflang
8. ✅ Build completa com sucesso

---

## 📋 Checklist de Correções Prioritárias

### Antes de Deploy em Produção:

- [ ] 🔴 Corrigir `src/lib/articles.ts` - dynamic imports
- [ ] 🔴 Corrigir `src/lib/articles.ts` - glob path
- [ ] 🔴 Substituir `LangAttribute.tsx` por solução server-side
- [ ] 🟠 Remover `as any` do middleware
- [ ] 🟠 Adicionar `NextResponse.next()` no middleware
- [ ] 🟠 Implementar detecção de idioma configurável
- [ ] 🟠 Completar ou remover dict em `generateMetadata`

### Melhorias Recomendadas:

- [ ] 🟡 Adicionar error handling em `getDictionary`
- [ ] 🟡 Criar type guard `isValidLocale`
- [ ] 🟡 Melhorar matcher do middleware
- [ ] 🟡 Extrair URLs para funções utilitárias
- [ ] 🟡 Validar environment variables
- [ ] 🟢 Adicionar JSDoc
- [ ] 🟢 Reorganizar estrutura de dicionários

---

## 🎯 Próximos Passos Sugeridos

1. **Corrigir bugs críticos** (items 1-3)
2. **Testar em desenvolvimento** com correções
3. **Implementar Fase 2** (componentes + páginas)
4. **Code review da Fase 2**
5. **Testes E2E** de troca de idioma
6. **Deploy em staging**

---

## 📚 Referências e Boas Práticas

### Next.js i18n
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Middleware Best Practices](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### TypeScript
- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

### SEO
- [Google Search Central - Multi-regional](https://developers.google.com/search/docs/specialty/international)
- [hreflang Best Practices](https://support.google.com/webmasters/answer/189077)

---

**Conclusão:** A implementação tem uma boa fundação, mas requer correções críticas antes de produção. Os problemas são bem localizados e podem ser corrigidos rapidamente.
