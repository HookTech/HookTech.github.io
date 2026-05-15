# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Astro v6 static blog (migrated from Hexo) deployed to GitHub Pages at `https://hooktech.github.io`. Chinese-language personal tech blog with math formula support.

## Development Commands

| Command | Action |
|--------|--------|
| `npm install` | Install dependencies (requires Node >= 22.12.0) |
| `npm run dev` | Dev server at `http://localhost:4321` |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro -- check` | Type-check components and content collections |
| `npm run astro -- check --watch` | Watch mode for type checking |

There are no test or lint scripts in this project.

## Architecture

### Content Collections & Routing

Blog posts live in `src/content/blog/YYYY/MM/DD/slug.md` and are served at `/:year/:month/:day/:slug/` (note trailing slash — `trailingSlash: 'always'`).

The `[year]/[month]/[day]/[title].astro` dynamic route uses `getStaticPaths()` to map each blog post's `post.id` (which is its relative path within `src/content/blog/`) to URL parameters. The `post.id` is split on `/` to extract year, month, day, and the remaining segments form the title slug.

Frontmatter schema is defined in `src/content.config.ts` using Zod. Required fields: `title`, `description`, `pubDate`. Optional: `updatedDate`, `heroImage`, `tags`, `categories`.

### Math Rendering Pipeline

Math formulas use `$...$` (inline) and `$$...$$` (block). The build pipeline is `remark-math` → `rehype-katex`. KaTeX CSS is imported in `src/styles/global.css`. Do not wrap formulas in backticks.

### Static Assets

Images and other static files referenced from Markdown should be placed in `public/` (not `src/assets/`). The path in `public/` should mirror the lowercase URL path to avoid case-sensitivity issues on Linux (GitHub Pages host). Example: a post at `/2025/05/13/my-note/` references images via `/2025/05/13/my-note/image.png`.

### Fonts

Atkinson Hyperlegible is loaded as a local font via `astro:assets` Font API, defined in `astro.config.mjs`. It is referenced via CSS variable `--font-atkinson` and preloaded in `BaseHead.astro`.

### Layout Hierarchy

- `BaseHead.astro` — shared `<head>` content, loads global CSS, Open Graph tags, RSS link, sitemap link, font preload
- `BlogPost.astro` — article layout wrapper with hero image, title, date, and `.prose`/`.post-body` styling
- Pages (`index.astro`, `blog/index.astro`, `[...title].astro`) each define their own full HTML structure, importing `BaseHead`, `Header`, `Footer`

### Deployment

GitHub Actions workflow at `.github/workflows/deploy.yml` uses `withastro/action` to build and `actions/deploy-pages` to deploy. Triggered on push to `main` or `master`. Repository Settings → Pages → Source must be set to "GitHub Actions".

## File Conventions

- YAML, Markdown, and JS config files use **2-space** indentation
- Static asset paths should be **lowercase** to match generated URLs
- Commit messages: use prefix style like `post:`, `build:`
- `rag-system/` and `_legacy_hexo/` are excluded from version control (see `.gitignore`)

## Existing Documentation

See `AGENTS.md` for full repository guidelines (in Chinese), including detailed workflow for creating, editing, and publishing blog posts.
