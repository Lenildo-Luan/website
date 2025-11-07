# Article Structure for Multi-language Support

## Overview

Articles in this project support multiple languages using locale-specific MDX files. This document explains how to create and organize articles.

## Directory Structure

Each article lives in its own directory with locale-specific MDX files:

```
src/app/[locale]/articles/
├── article-slug/
│   ├── page.pt-br.mdx    # Portuguese version
│   ├── page.en.mdx       # English version (optional)
│   └── images/           # Shared images (optional)
│       └── cover.jpg
└── another-article/
    ├── page.pt-br.mdx
    └── page.en.mdx
```

## File Naming Convention

- **Primary locale (required):** `page.pt-br.mdx`
- **Secondary locale (optional):** `page.en.mdx`
- Locale suffix must match one of the locales defined in `src/lib/i18n/config.ts`

## Article File Format

Each MDX file must export an `article` object with metadata:

```mdx
import { ArticleLayout } from '@/components/ArticleLayout'

export const article = {
  author: 'Lenildo Luan',
  date: '2025-01-15',
  title: 'Your Article Title',
  description: 'Brief description of the article',
}

export const metadata = {
  title: article.title,
  description: article.description,
}

export default (props) => <ArticleLayout article={article} {...props} />

Your article content in Markdown/MDX format...
```

## Fallback Behavior

When a user requests an article in a language that doesn't exist:

1. **Primary:** Try to load article in requested locale
2. **Fallback:** If not found, load Portuguese version (`page.pt-br.mdx`)
3. **Badge:** Display "Translation available in Portuguese" badge

## Creating a New Article

### 1. Create article directory

```bash
mkdir -p src/app/[locale]/articles/my-new-article
```

### 2. Create Portuguese version (required)

Create `src/app/[locale]/articles/my-new-article/page.pt-br.mdx`:

```mdx
import { ArticleLayout } from '@/components/ArticleLayout'

export const article = {
  author: 'Lenildo Luan',
  date: '2025-01-15',
  title: 'Meu Novo Artigo',
  description: 'Descrição do artigo em português',
}

export const metadata = {
  title: article.title,
  description: article.description,
}

export default (props) => <ArticleLayout article={article} {...props} />

## Introdução

Conteúdo do artigo em português...
```

### 3. Create English version (optional)

Create `src/app/[locale]/articles/my-new-article/page.en.mdx`:

```mdx
import { ArticleLayout } from '@/components/ArticleLayout'

export const article = {
  author: 'Lenildo Luan',
  date: '2025-01-15',
  title: 'My New Article',
  description: 'Article description in English',
}

export const metadata = {
  title: article.title,
  description: article.description,
}

export default (props) => <ArticleLayout article={article} {...props} />

## Introduction

Article content in English...
```

## Template Files

Template files are available in `.templates/article/`:

- `.templates/article/page.pt-br.mdx` - Portuguese template
- `.templates/article/page.en.mdx` - English template

## Best Practices

### Translation

1. **Always create Portuguese version first** - It's the primary language
2. **Keep same date** - Use the same publication date across translations
3. **Keep same slug** - Directory name should be language-neutral (use English)
4. **Translate all metadata** - Title, description, and content

### Content

1. **Use descriptive slugs** - `my-article` not `article-1`
2. **Follow kebab-case** - `multi-word-article` not `MultiWordArticle`
3. **Include images** - Place in `images/` subdirectory if needed
4. **Code blocks** - Use proper syntax highlighting

### Metadata

1. **Date format:** `YYYY-MM-DD` (ISO 8601)
2. **Author:** Full name
3. **Title:** Clear and descriptive
4. **Description:** 1-2 sentences, under 160 characters for SEO

## Technical Details

### How Articles Are Loaded

The `getAllArticles(locale)` function in `src/lib/articles.ts`:

1. Scans for `*/page.${locale}.mdx` files
2. Dynamically imports matching files
3. Extracts metadata and slug
4. Returns sorted by date (newest first)

### How Fallback Works

The article page route handler:

1. Tries to load `page.${locale}.mdx`
2. If not found, catches error and tries `page.pt-br.mdx`
3. Sets `isFallback: true` flag
4. Displays fallback notice to user

## Examples

### Bilingual Article

```
articles/
└── understanding-utf16/
    ├── page.pt-br.mdx  ✅ Portuguese version
    └── page.en.mdx     ✅ English version
```

Both languages available, no fallback needed.

### Portuguese-Only Article

```
articles/
└── carreira-dev-brasil/
    └── page.pt-br.mdx  ✅ Portuguese version only
```

English users see Portuguese version with fallback notice.

## Migration Guide

### Migrating Existing Articles

If you have old `page.mdx` files:

```bash
# Rename to Portuguese version
mv src/app/[locale]/articles/my-article/page.mdx \
   src/app/[locale]/articles/my-article/page.pt-br.mdx

# Create English translation
cp src/app/[locale]/articles/my-article/page.pt-br.mdx \
   src/app/[locale]/articles/my-article/page.en.mdx

# Edit page.en.mdx to translate content
```

## FAQ

**Q: Do I need to create both language versions?**
A: No, Portuguese (`page.pt-br.mdx`) is required, English is optional.

**Q: Can I add more languages?**
A: Yes, update `src/lib/i18n/config.ts` and create `page.${locale}.mdx` files.

**Q: What happens if I don't translate an article?**
A: Users will see the Portuguese version with a notice about the fallback.

**Q: Should images be duplicated per language?**
A: No, images can be shared. Place them in an `images/` subdirectory.

**Q: How do I test my article?**
A: Run `npm run dev` and navigate to:
- Portuguese: `http://localhost:3000/pt-br/articles/your-slug`
- English: `http://localhost:3000/en/articles/your-slug`
