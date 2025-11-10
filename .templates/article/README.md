# Article Templates

This directory contains templates for creating new articles with multi-language support.

## Quick Start

### 1. Create article directory

```bash
mkdir -p src/app/[locale]/articles/your-article-slug
```

### 2. Copy templates

```bash
# Copy Portuguese template (required)
cp .templates/article/page.pt-br.mdx src/app/[locale]/articles/your-article-slug/

# Copy English template (optional)
cp .templates/article/page.en.mdx src/app/[locale]/articles/your-article-slug/
```

### 3. Edit the templates

Open the files and update:
- `date`: Publication date in YYYY-MM-DD format
- `title`: Article title in the respective language
- `description`: Brief description (1-2 sentences)
- Content: Write your article content

### 4. Test locally

```bash
npm run dev
```

Navigate to:
- Portuguese: `http://localhost:3000/pt-br/articles/your-article-slug`
- English: `http://localhost:3000/en/articles/your-article-slug`

## Files

- `page.pt-br.mdx` - Portuguese article template
- `page.en.mdx` - English article template

## Notes

- Portuguese version is **required** (it's the fallback language)
- English version is **optional**
- Keep the same `date` in both versions
- Use descriptive, URL-friendly slugs (kebab-case)

For more details, see [ARTICLES_STRUCTURE.md](../../ARTICLES_STRUCTURE.md)
