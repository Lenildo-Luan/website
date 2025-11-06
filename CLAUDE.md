# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio/blog website for Lenildo Luan built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and MDX. The site is based on the Tailwind Plus "Spotlight" template and features a blog, portfolio sections, and dark mode support.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm lint
```

## Environment Setup

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_SITE_URL=https://example.com
```

This variable is used for RSS feed generation and canonical URLs.

## Architecture & Key Concepts

### App Router Structure

The project uses Next.js 14 App Router with the following layout hierarchy:

```
src/app/
  layout.tsx          # Root layout with Providers wrapper
  └── [pages]         # Individual route pages (about, articles, projects, etc.)
```

**Root Layout (`src/app/layout.tsx`)**:
- Wraps entire app with `Providers` component
- Sets up dark mode via `next-themes`
- Includes Vercel Analytics
- Contains base metadata configuration

**Providers (`src/app/providers.tsx`)**:
- `ThemeProvider`: Manages dark/light theme switching
- `AppContext`: Tracks previous pathname for navigation transitions
- `ThemeWatcher`: Syncs theme with system preferences

**Layout Component (`src/components/Layout.tsx`)**:
- Simple wrapper that includes Header, Footer, and main content area
- Creates fixed background gradient effect

### MDX Article System

Articles are stored as MDX files in `src/app/articles/[slug]/page.mdx` with frontmatter metadata.

**Article Discovery (`src/lib/articles.ts`)**:
- `getAllArticles()`: Uses `fast-glob` to find all `*/page.mdx` files in `src/app/articles/`
- Dynamically imports each article to extract metadata
- Returns sorted array by date (newest first)

**Article Metadata Structure**:
Each MDX article must export an `article` object:

```typescript
export const article = {
  title: string,
  description: string,
  author: string,
  date: string, // ISO format for sorting
}
```

**Important**: When adding new articles, create a folder with the slug name and a `page.mdx` file inside it:
```
src/app/articles/
  └── my-new-article/
      └── page.mdx
```

### Theme System

The site uses `next-themes` for dark mode:
- Theme is stored in localStorage and syncs with system preferences
- Theme toggle button in Header switches between 'light' and 'dark'
- CSS uses Tailwind's `dark:` variant for styling
- Color scheme: orange-500/orange-400 for accents, zinc for neutrals

### Navigation & Header

The Header component (`src/components/Header.tsx`) has sophisticated scroll behavior:

**Homepage Behavior**:
- Large avatar that shrinks and transforms as you scroll down
- Uses CSS custom properties for smooth animations
- Avatar animates from large (64px) to small (36px)

**Other Pages**:
- Fixed small avatar in top-left
- No scroll-based transformations

**Navigation Structure**:
- Desktop: Pills navigation in center
- Mobile: Hamburger menu (Headless UI Popover)
- Active page highlighted with orange color and bottom border

**Current Navigation Items**:
- "Sobre" (About) - `/about`
- "Articles" - `/articles`
- Projects, Speaking, Uses are commented out but present in code

### Styling Approach

**Tailwind CSS v4**:
- Uses modern CSS-first approach with PostCSS
- Configuration in `@tailwindcss/postcss` package
- Typography plugin for article content formatting
- Custom spacing variables using CSS custom properties

**Color Palette**:
- Primary accent: `orange-500` (light) / `orange-400` (dark)
- Neutrals: `zinc-*` scale
- Background: `zinc-50` (light) / `black` (dark)

**Design Patterns**:
- Glassmorphism: `bg-white/90 backdrop-blur-sm` for navigation elements
- Ring borders: `ring-1 ring-zinc-900/5` for subtle borders
- Shadow layering: `shadow-lg shadow-zinc-800/5`

### Component Architecture

**Container Pattern**:
The site uses a two-tier container system (`src/components/Container.tsx`):
- `ContainerOuter`: Provides horizontal padding and max-width
- `ContainerInner`: Inner wrapper for consistent spacing

**Card Pattern**:
Reusable Card component (`src/components/Card.tsx`) with subcomponents:
- `Card.Link`: Wrapper for linked cards
- `Card.Title`: Heading with optional link
- `Card.Description`: Body text
- `Card.Cta`: Call-to-action link
- `Card.Eyebrow`: Small label/date above title

**Section Pattern**:
Used for consistent section spacing and typography (`src/components/Section.tsx`).

### MDX Configuration

**Next.js Config (`next.config.mjs`)**:
- MDX support via `@next/mdx`
- Remark plugins: `remark-gfm` (GitHub Flavored Markdown)
- Rehype plugins: `@mapbox/rehype-prism` (syntax highlighting)
- File tracing configured for article discovery

**Supported Features**:
- GitHub Flavored Markdown (tables, task lists, strikethrough)
- Syntax highlighting for code blocks
- React components can be imported and used in MDX

### Page Structure

Most pages follow this pattern:

**Simple Content Pages** (`about`, `uses`, etc.):
- Use `SimpleLayout` component
- Export metadata via `generateMetadata`
- Contain static content

**List Pages** (`articles`, `projects`):
- Fetch data via async Server Components
- Map over items with Card components
- Use grid layouts for responsive design

**Homepage** (`src/app/page.tsx`):
- Custom layout (not SimpleLayout)
- Combines multiple sections:
  - Hero with personal introduction
  - Photo gallery with rotation effect
  - Recent articles (first 4)
  - Resume/career timeline
  - Social links (Instagram, GitHub, LinkedIn)

### Current Content State

**Language**: Site is currently in Portuguese (Brazil)
- Navigation labels are in Portuguese ("Sobre", "Carreira")
- Some labels are mixed (e.g., "Articles" remains in English)
- There is a detailed internationalization plan in `PLANO_INTERNACIONALIZACAO.md`

**Social Links**:
- Instagram: https://www.instagram.com/lenildoluan/
- GitHub: https://github.com/Lenildo-Luan
- LinkedIn: https://www.linkedin.com/in/lenildoluan/

**CV Download**:
Hosted on ImageKit at: https://ik.imagekit.io/zjvju1m8yb/cv_wh59OG3ZJK.pdf

**Avatar Image**:
Hosted on ImageKit at: https://ik.imagekit.io/zjvju1m8yb/wq7p2jz3je1att0szbyu_WBU-pRjUpb.avif

### RSS Feed

The site includes RSS feed generation (referenced in metadata alternates). Implementation details are likely in API routes or build-time generation using the `feed` package.

## Common Development Patterns

### Adding a New Page

1. Create `src/app/[route]/page.tsx`
2. Export metadata via `generateMetadata` or `export const metadata`
3. Use `SimpleLayout` for consistent styling or create custom layout
4. Add navigation item to Header if needed (both Desktop and Mobile navigation)

### Adding a New Article

1. Create `src/app/articles/[slug]/page.mdx`
2. Add frontmatter with article metadata:
   ```typescript
   export const article = {
     title: 'Your Title',
     description: 'Brief description',
     author: 'Lenildo Luan',
     date: '2025-01-15',
   }
   ```
3. Write content using MDX (Markdown + JSX)
4. Article will automatically appear in article list (sorted by date)

### Modifying Theme Colors

The primary accent color is orange. To change:
1. Update all instances of `orange-500` and `orange-400` throughout components
2. Consider updating hover states and focus rings
3. Test in both light and dark modes

### Working with Headless UI

The project uses Headless UI v2 for interactive components:
- `Popover` for mobile navigation
- Component names have changed in v2 (e.g., `PopoverButton` instead of `Popover.Button`)
- All components are unstyled and use Tailwind for styling

## File Organization

```
src/
  app/              # Next.js App Router pages
    articles/       # MDX blog articles (nested folders)
    about/          # Static pages
    layout.tsx      # Root layout
    page.tsx        # Homepage
    providers.tsx   # Context providers
  components/       # Reusable React components
    Layout.tsx      # Main layout wrapper
    Header.tsx      # Navigation header
    Footer.tsx      # Site footer
    Card.tsx        # Card pattern components
    Container.tsx   # Layout containers
    Button.tsx      # Button component
    SimpleLayout.tsx # Simple page layout
  lib/              # Utility functions
    articles.ts     # Article loading/parsing
    formatDate.ts   # Date formatting
  images/           # Static image assets
  styles/           # Global styles
    tailwind.css    # Tailwind imports
```

## Important Notes

### TypeScript

The project is fully typed with TypeScript. Key type definitions:
- Article metadata types in `src/lib/articles.ts`
- React component prop types using `React.ComponentPropsWithoutRef<T>`
- Next.js types from `next` package

### Image Optimization

- Next.js Image component used where possible
- Some images use plain `<img>` tags (e.g., avatar) for specific transform needs
- Images are hosted on ImageKit CDN
- AVIF format used for optimal compression

### Analytics

Vercel Analytics is integrated via `@vercel/analytics/next` package, added at root layout level.

### Performance Considerations

- Server Components by default (App Router)
- Client Components only when needed ('use client' directive)
- MDX content is statically generated at build time
- Fast-glob used for efficient file discovery

### Browser Support

`browserslist` config: `"defaults, not ie <= 11"` - modern browsers only, no IE11 support.

## Deployment

The site is designed for Vercel deployment (based on Vercel Analytics integration and Next.js optimizations). Standard Vercel deployment process applies - connect repository and deploy.
