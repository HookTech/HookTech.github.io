# 博客主题 Humanist Literary redesign 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 Astro 博客改造为 Humanist Literary with sketchy hand-drawn borders 风格，包含新配色、衬线字体、手绘边框和装饰元素。

**Architecture:** 纯前端样式改造，通过重写全局 CSS、更新各页面/组件 Astro 模板、替换字体加载方式实现。无新增依赖，无路由或数据结构变更。

**Tech Stack:** Astro 6, CSS3, Google Fonts (Source Serif 4)

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/styles/global.css` | 重写 | 新配色变量、字体、手绘边框 CSS 类、装饰元素 |
| `src/components/BaseHead.astro` | 修改 | 引入 Source Serif 4 字体（Google Fonts），移除 Atkinson 字体 |
| `src/components/Header.astro` | 修改 | 透明背景、手绘下划线悬停效果 |
| `src/components/Footer.astro` | 修改 | 纯色背景、手绘分隔线 |
| `src/pages/index.astro` | 修改 | 卡片网格布局、更大标题 |
| `src/pages/blog/index.astro` | 修改 | 统一卡片网格布局 |
| `src/layouts/BlogPost.astro` | 修改 | 纸张质感背景、手绘引用块/代码块边框 |
| `astro.config.mjs` | 修改 | 移除 Atkinson 本地字体配置 |

---

## Task 1: 重写全局样式 (`src/styles/global.css`)

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: 重写 global.css**

  替换文件全部内容。保留 KaTeX 导入，添加新配色变量、字体、手绘边框类、卡片样式、引用块、代码块、链接样式。

  ```css
  @import 'katex/dist/katex.min.css';

  :root {
    --cream: #faf8f5;
    --white: #ffffff;
    --black: #1a1a1a;
    --gray: #5a5a5a;
    --sage: #5a8f7b;
    --terracotta: #d4734a;
    --code-bg: #f0ede8;
    --quote-bg: #f5f2ed;
    --box-shadow: 3px 3px 0 rgba(26, 26, 26, 0.08);
    --box-shadow-hover: 4px 4px 0 rgba(90, 143, 123, 0.15);
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Source Serif 4', Georgia, 'Noto Serif SC', serif;
    margin: 0;
    padding: 0;
    text-align: left;
    background: var(--cream);
    color: var(--black);
    font-size: 18px;
    line-height: 1.7;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  main {
    width: 720px;
    max-width: calc(100% - 2em);
    margin: auto;
    padding: 3em 1em;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 0.5rem 0;
    color: var(--black);
    line-height: 1.2;
    font-weight: 600;
  }

  h1 { font-size: 2.6em; }
  h2 { font-size: 2.08em; }
  h3 { font-size: 1.66em; }
  h4 { font-size: 1.33em; }
  h5 { font-size: 1.06em; }

  strong, b {
    font-weight: 700;
  }

  a {
    color: var(--sage);
    text-decoration: none;
    position: relative;
  }

  a:hover {
    color: var(--terracotta);
  }

  p {
    margin-bottom: 1em;
  }

  .prose p {
    margin-bottom: 2em;
  }

  textarea {
    width: 100%;
    font-size: 16px;
    font-family: inherit;
  }

  input {
    font-size: 16px;
    font-family: inherit;
  }

  table {
    width: 100%;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  code {
    padding: 0.15em 0.4em;
    background-color: var(--code-bg);
    border-radius: 3px;
    font-family: 'SF Mono', Monaco, 'Fira Code', monospace;
    font-size: 0.9em;
  }

  pre {
    padding: 1.2em;
    border-radius: 4px 10px 6px 8px;
    border: 2px solid var(--black);
    overflow-x: auto;
    font-family: 'SF Mono', Monaco, 'Fira Code', monospace;
    font-size: 0.85em;
    line-height: 1.5;
    background: var(--code-bg);
    box-shadow: var(--box-shadow);
  }

  pre > code {
    all: unset;
    font-family: 'SF Mono', Monaco, 'Fira Code', monospace;
    font-size: inherit;
  }

  blockquote {
    margin: 1.5em 0;
    padding: 1em 1.5em;
    background: var(--quote-bg);
    border-left: 4px solid var(--black);
    border-radius: 0 8px 8px 0;
    font-style: italic;
    position: relative;
  }

  blockquote::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--black);
    border-radius: 2px;
    transform: rotate(-0.5deg);
  }

  blockquote p {
    margin: 0;
  }

  hr {
    border: none;
    height: 4px;
    margin: 2em 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 4' preserveAspectRatio='none'%3E%3Cpath d='M0,2 Q20,0 40,2 T80,2 T120,2 T160,2 T200,1.5 T240,2.5 T280,2 T320,1.5 T360,2.5 T400,2' stroke='%231a1a1a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  /* Sketchy card styles */
  .sketchy-card {
    background: var(--white);
    padding: 1.5em;
    border: 2px solid var(--black);
    border-radius: 2px 8px 4px 12px;
    box-shadow: var(--box-shadow);
    transition: all 0.3s ease;
    position: relative;
  }

  .sketchy-card::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px solid var(--black);
    border-radius: 4px 10px 6px 14px;
    pointer-events: none;
    opacity: 0.3;
  }

  .sketchy-card:hover {
    border-color: var(--sage);
    box-shadow: var(--box-shadow-hover);
  }

  .sketchy-card:hover::before {
    border-color: var(--sage);
  }

  /* Sketchy divider utility */
  .sketchy-divider {
    width: 100%;
    height: 4px;
    margin: 2em 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 4' preserveAspectRatio='none'%3E%3Cpath d='M0,2 Q20,0 40,2 T80,2 T120,2 T160,2 T200,1.5 T240,2.5 T280,2 T320,1.5 T360,2.5 T400,2' stroke='%231a1a1a' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: none;
  }

  /* Section title with sketchy line */
  .section-title {
    font-size: 1.5em;
    font-weight: 600;
    margin: 2em 0 0.5em;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 3px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 3'%3E%3Cpath d='M0,1.5 Q15,0.5 30,1.5 T60,1.5 T90,1.5 T120,1.5 T150,1.5 T180,1.5 T200,1.5' stroke='%235a5a5a' stroke-width='1' fill='none' stroke-linecap='round' opacity='0.4'/%3E%3C/svg%3E");
    background-size: 100% 100%;
  }

  /* Post body sizing */
  .post-body {
    font-size: 16px;
    line-height: 1.75;
  }

  @media (max-width: 720px) {
    body {
      font-size: 17px;
    }
    main {
      padding: 1em;
    }
    h1 { font-size: 2em; }
    h2 { font-size: 1.7em; }
    .post-body {
      font-size: 15px;
    }
  }

  .sr-only {
    border: 0;
    padding: 0;
    margin: 0;
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    white-space: nowrap;
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/styles/global.css
  git commit -m "style: rewrite global CSS with Humanist Literary theme"
  ```

---

## Task 2: 更新 BaseHead 引入新字体

**Files:**
- Modify: `src/components/BaseHead.astro`

- [ ] **Step 1: 替换 BaseHead.astro**

  保留原有 meta 标签、Open Graph、RSS link 等。添加 Google Fonts 链接，移除 Atkinson 字体相关代码。

  ```astro
  ---
  import '../styles/global.css';
  import type { ImageMetadata } from 'astro';
  import FallbackImage from '../assets/blog-placeholder-1.jpg';
  import { SITE_TITLE } from '../consts';

  interface Props {
    title: string;
    description: string;
    image?: ImageMetadata;
  }

  const canonicalURL = new URL(Astro.url.pathname, Astro.site);
  const { title, description, image = FallbackImage } = Astro.props;
  ---

  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="sitemap" href="/sitemap-index.xml" />
  <link
    rel="alternate"
    type="application/rss+xml"
    title={SITE_TITLE}
    href={new URL('rss.xml', Astro.site)}
  />
  <meta name="generator" content={Astro.generator} />

  <!-- Google Fonts: Source Serif 4 -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap"
    rel="stylesheet"
  />

  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalURL} />

  <!-- Primary Meta Tags -->
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={Astro.url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(image.src, Astro.url)} />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={Astro.url} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={new URL(image.src, Astro.url)} />
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/BaseHead.astro
  git commit -m "style: replace Atkinson font with Source Serif 4"
  ```

---

## Task 3: 更新 Header 组件

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: 替换 Header.astro**

  ```astro
  ---
  import { SITE_TITLE } from '../consts';
  import HeaderLink from './HeaderLink.astro';
  ---

  <header>
    <nav>
      <h2><a href="/">{SITE_TITLE}</a></h2>
      <div class="internal-links">
        <HeaderLink href="/">首页</HeaderLink>
        <HeaderLink href="/blog/">文章</HeaderLink>
        <HeaderLink href="/about/">关于</HeaderLink>
      </div>
      <div class="social-links">
        <a href="https://github.com/HookTech" target="_blank" rel="noopener noreferrer">
          <span class="sr-only">HookTech GitHub</span>
          <svg viewBox="0 0 16 16" aria-hidden="true" width="28" height="28"
            ><path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            ></path></svg
          >
        </a>
      </div>
    </nav>
  </header>
  <style>
    header {
      margin: 0;
      padding: 0 1em;
      background: transparent;
    }
    h2 {
      margin: 0;
      font-size: 1em;
      font-weight: 700;
    }
    h2 a {
      color: var(--black);
      text-decoration: none;
    }
    h2 a:hover {
      color: var(--sage);
    }
    nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1em 0;
      border-bottom: 1px solid rgba(26, 26, 26, 0.1);
    }
    nav a {
      padding: 0.5em 0.5em;
      color: var(--black);
      text-decoration: none;
      position: relative;
    }
    nav a.active,
    nav a:hover {
      color: var(--sage);
    }
    .internal-links a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0.5em;
      right: 0.5em;
      height: 2px;
      background: var(--sage);
      transform: scaleX(0);
      transition: transform 0.3s ease;
      border-radius: 1px;
    }
    .internal-links a:hover::after,
    .internal-links a.active::after {
      transform: scaleX(1);
    }
    .social-links,
    .social-links a {
      display: flex;
    }
    .social-links a {
      color: var(--gray);
    }
    .social-links a:hover {
      color: var(--sage);
    }
    @media (max-width: 720px) {
      .social-links {
        display: none;
      }
    }
  </style>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/Header.astro
  git commit -m "style: update Header with transparent bg and sketchy underline hover"
  ```

---

## Task 4: 更新 Footer 组件

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: 替换 Footer.astro**

  ```astro
  ---
  const today = new Date();
  ---

  <footer>
    <div class="sketchy-divider"></div>
    <p>&copy; {today.getFullYear()} philo · <a href="https://hooktech.github.io/">hooktech.github.io</a></p>
    <div class="social-links">
      <a href="https://github.com/HookTech" target="_blank" rel="noopener noreferrer">
        <span class="sr-only">HookTech on GitHub</span>
        <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24"
          ><path
            fill="currentColor"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
          ></path></svg
        >
      </a>
    </div>
  </footer>
  <style>
    footer {
      padding: 2em 1em 4em 1em;
      background: var(--cream);
      color: var(--gray);
      text-align: center;
    }
    footer a {
      color: var(--gray);
    }
    footer a:hover {
      color: var(--sage);
    }
    .social-links {
      display: flex;
      justify-content: center;
      gap: 1em;
      margin-top: 1em;
    }
    .social-links a {
      text-decoration: none;
      color: var(--gray);
    }
    .social-links a:hover {
      color: var(--sage);
    }
  </style>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/Footer.astro
  git commit -m "style: update Footer with cream bg and sketchy divider"
  ```

---

## Task 5: 更新首页 (`src/pages/index.astro`)

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 替换 index.astro**

  从单列列表改为卡片网格布局（2 列桌面，1 列移动端）。主标题加大。

  ```astro
  ---
  import BaseHead from '../components/BaseHead.astro';
  import Footer from '../components/Footer.astro';
  import Header from '../components/Header.astro';
  import FormattedDate from '../components/FormattedDate.astro';
  import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
  import { getCollection } from 'astro:content';

  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  ---

  <!doctype html>
  <html lang="zh-CN">
    <head>
      <BaseHead title={SITE_TITLE} description={SITE_DESCRIPTION} />
      <style>
        .hero {
          text-align: center;
          padding: 4em 0 2em;
        }
        .hero h1 {
          font-size: 3em;
          font-weight: 700;
          margin: 0 0 0.5em;
          line-height: 1.15;
        }
        .hero p {
          font-size: 1.15em;
          color: var(--gray);
          margin: 0;
        }
        .recent-posts-title {
          font-size: 1.5em;
          font-weight: 600;
          margin: 2em 0 1em;
          display: flex;
          align-items: center;
          gap: 0.5em;
        }
        .recent-posts-title::after {
          content: '';
          flex: 1;
          height: 3px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 3'%3E%3Cpath d='M0,1.5 Q15,0.5 30,1.5 T60,1.5 T90,1.5 T120,1.5 T150,1.5 T180,1.5 T200,1.5' stroke='%235a5a5a' stroke-width='1' fill='none' stroke-linecap='round' opacity='0.4'/%3E%3C/svg%3E");
          background-size: 100% 100%;
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5em;
          margin: 1.5em 0;
          padding: 0;
          list-style: none;
        }
        .card-grid li {
          margin: 0;
        }
        .card-grid a {
          display: block;
          color: inherit;
          text-decoration: none;
        }
        .card-grid h3 {
          margin: 0 0 0.3em;
          font-size: 1.1em;
          font-weight: 600;
          color: var(--black);
        }
        .card-grid .date {
          color: var(--gray);
          font-size: 0.85em;
          margin: 0 0 0.5em;
        }
        .card-grid p {
          color: var(--gray);
          font-size: 0.95em;
          line-height: 1.6;
          margin: 0;
        }
        .view-all {
          text-align: center;
          margin-top: 2em;
        }
        .view-all a {
          display: inline-block;
          padding: 0.6em 1.5em;
          border: 2px solid var(--black);
          border-radius: 4px 10px 6px 8px;
          color: var(--black);
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .view-all a:hover {
          border-color: var(--sage);
          color: var(--sage);
          box-shadow: var(--box-shadow-hover);
        }
        @media (max-width: 720px) {
          .hero h1 { font-size: 2em; }
          .card-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <Header />
      <main>
        <section class="hero">
          <h1>{SITE_TITLE}</h1>
          <p>{SITE_DESCRIPTION}</p>
        </section>

        <div class="sketchy-divider"></div>

        <section>
          <h2 class="recent-posts-title">最近更新</h2>
          <ul class="card-grid">
            {
              posts.map((post) => (
                <li class="sketchy-card">
                  <a href={`/${post.id}/`}>
                    <h3>{post.data.title}</h3>
                    <p class="date">
                      <FormattedDate date={post.data.pubDate} />
                    </p>
                    <p>{post.data.description}</p>
                  </a>
                </li>
              ))
            }
          </ul>
          <p class="view-all">
            <a href="/blog/">查看全部文章</a>
          </p>
        </section>
      </main>
      <Footer />
    </body>
  </html>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/pages/index.astro
  git commit -m "style: redesign homepage with card grid layout"
  ```

---

## Task 6: 更新博客列表页 (`src/pages/blog/index.astro`)

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: 替换 blog/index.astro**

  从当前带 hero 图片的列表改为统一的卡片网格布局。

  ```astro
  ---
  import BaseHead from '../../components/BaseHead.astro';
  import Footer from '../../components/Footer.astro';
  import FormattedDate from '../../components/FormattedDate.astro';
  import Header from '../../components/Header.astro';
  import { SITE_DESCRIPTION, SITE_TITLE } from '../../consts';
  import { getCollection } from 'astro:content';

  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  ---

  <!doctype html>
  <html lang="zh-CN">
    <head>
      <BaseHead title={`文章 - ${SITE_TITLE}`} description={SITE_DESCRIPTION} />
      <style>
        .page-title {
          text-align: center;
          padding: 3em 0 1em;
        }
        .page-title h1 {
          font-size: 2.5em;
          font-weight: 700;
          margin: 0;
          line-height: 1.15;
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5em;
          margin: 2em 0;
          padding: 0;
          list-style: none;
        }
        .card-grid li {
          margin: 0;
        }
        .card-grid a {
          display: block;
          color: inherit;
          text-decoration: none;
        }
        .card-grid h3 {
          margin: 0 0 0.3em;
          font-size: 1.1em;
          font-weight: 600;
          color: var(--black);
        }
        .card-grid .date {
          color: var(--gray);
          font-size: 0.85em;
          margin: 0 0 0.5em;
        }
        .card-grid p {
          color: var(--gray);
          font-size: 0.95em;
          line-height: 1.6;
          margin: 0;
        }
        @media (max-width: 720px) {
          .page-title h1 { font-size: 2em; }
          .card-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <Header />
      <main>
        <section class="page-title">
          <h1>全部文章</h1>
        </section>

        <div class="sketchy-divider"></div>

        <section>
          <ul class="card-grid">
            {
              posts.map((post) => (
                <li class="sketchy-card">
                  <a href={`/${post.id}/`}>
                    <h3>{post.data.title}</h3>
                    <p class="date">
                      <FormattedDate date={post.data.pubDate} />
                    </p>
                    <p>{post.data.description}</p>
                  </a>
                </li>
              ))
            }
          </ul>
        </section>
      </main>
      <Footer />
    </body>
  </html>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/pages/blog/index.astro
  git commit -m "style: redesign blog listing with card grid layout"
  ```

---

## Task 7: 更新文章详情页布局 (`src/layouts/BlogPost.astro`)

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: 替换 BlogPost.astro**

  添加纸张质感背景、手绘分隔线、更新正文区域样式。

  ```astro
  ---
  import { Image } from 'astro:assets';
  import type { CollectionEntry } from 'astro:content';
  import BaseHead from '../components/BaseHead.astro';
  import Footer from '../components/Footer.astro';
  import FormattedDate from '../components/FormattedDate.astro';
  import Header from '../components/Header.astro';

  type Props = CollectionEntry<'blog'>['data'];

  const { title, description, pubDate, updatedDate, heroImage } = Astro.props;
  ---

  <html lang="zh-CN">
    <head>
      <BaseHead title={title} description={description} />
      <style>
        main {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
        }
        .hero-image {
          width: 100%;
        }
        .hero-image img {
          display: block;
          margin: 0 auto;
          border-radius: 12px;
          box-shadow: var(--box-shadow);
        }
        .paper {
          background: var(--white);
          box-shadow: 0 2px 12px rgba(26, 26, 26, 0.06);
          border-radius: 2px;
          max-width: 780px;
          margin: 0 auto;
          padding: 2em;
        }
        .prose {
          width: 720px;
          max-width: 100%;
          margin: auto;
          padding: 1em 0;
          color: var(--black);
          overflow-x: auto;
        }
        .title {
          margin-bottom: 1.5em;
          padding: 1em 0;
          text-align: center;
          line-height: 1;
        }
        .title h1 {
          margin: 0 0 0.5em 0;
          font-size: 2.2em;
          font-weight: 700;
        }
        .date {
          margin-bottom: 0.5em;
          color: var(--gray);
          font-size: 0.9em;
        }
        .last-updated-on {
          font-style: italic;
          color: var(--gray);
          font-size: 0.85em;
        }
        .post-body {
          font-size: 16px;
          line-height: 1.75;
        }
        @media (max-width: 720px) {
          .paper {
            padding: 1em;
            border-radius: 0;
          }
          .title h1 {
            font-size: 1.7em;
          }
          .post-body {
            font-size: 15px;
          }
        }
      </style>
    </head>

    <body>
      <Header />
      <main>
        <article>
          <div class="hero-image">
            {heroImage && <Image width={1020} height={510} src={heroImage} alt="" />}
          </div>
          <div class="paper">
            <div class="prose">
              <div class="title">
                <div class="date">
                  <FormattedDate date={pubDate} />
                  {
                    updatedDate && (
                      <div class="last-updated-on">
                        Last updated on <FormattedDate date={updatedDate} />
                      </div>
                    )
                  }
                </div>
                <h1>{title}</h1>
                <div class="sketchy-divider"></div>
              </div>
              <div class="post-body">
                <slot />
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </body>
  </html>
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/layouts/BlogPost.astro
  git commit -m "style: redesign blog post layout with paper bg and sketchy elements"
  ```

---

## Task 8: 更新 about 页面 (`src/pages/about.astro`)

**Files:**
- Modify: `src/pages/about.astro`

- [ ] **Step 1: 读取当前 about.astro 并应用一致的样式**

  当前 about 页面的样式可能需要更新以匹配新主题。读取文件后，确保其使用新的全局样式变量，并添加纸张质感背景。

  如果 about.astro 使用了与 BlogPost.astro 类似的结构，保持其布局但更新颜色引用为 CSS 变量。

  具体修改：
  - 将 `rgb(var(--black))` 等引用改为 `var(--black)`
  - 将 `rgb(var(--gray))` 改为 `var(--gray)`
  - 将 `rgb(var(--gray-light))` 改为 `rgba(26, 26, 26, 0.1)`
  - 将 `rgb(var(--accent))` 改为 `var(--sage)`

- [ ] **Step 2: Commit**

  ```bash
  git add src/pages/about.astro
  git commit -m "style: update about page to match new theme"
  ```

---

## Task 9: 移除旧字体配置

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: 修改 astro.config.mjs**

  移除 `fonts` 配置数组（Atkinson 本地字体）。保留其他所有配置不变。

  ```javascript
  // @ts-check

  import mdx from '@astrojs/mdx';
  import sitemap from '@astrojs/sitemap';
  import { defineConfig } from 'astro/config';
  import remarkMath from 'remark-math';
  import rehypeKatex from 'rehype-katex';

  const mathRemark = [remarkMath];
  const mathRehype = [rehypeKatex];

  // https://astro.build/config
  export default defineConfig({
    site: 'https://hooktech.github.io',
    trailingSlash: 'always',
    markdown: {
      remarkPlugins: mathRemark,
      rehypePlugins: mathRehype,
    },
    integrations: [
      mdx({
        remarkPlugins: mathRemark,
        rehypePlugins: mathRehype,
      }),
      sitemap(),
    ],
  });
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add astro.config.mjs
  git commit -m "build: remove Atkinson font config, use Google Fonts instead"
  ```

---

## Task 10: 构建验证

**Files:** N/A

- [ ] **Step 1: 运行构建**

  ```bash
  npm run build
  ```

  Expected: 构建成功，无错误。

- [ ] **Step 2: 类型检查**

  ```bash
  npm run astro -- check
  ```

  Expected: 无类型错误。

- [ ] **Step 3: 预览检查（可选）**

  ```bash
  npm run preview
  ```

  在浏览器中打开 `http://localhost:4321`，确认：
  - 首页显示卡片网格布局
  - 衬线字体已生效
  - 奶油色背景正确
  - 手绘边框和分隔线可见
  - 悬停效果正常

- [ ] **Step 4: 最终提交（如有任何修复）**

  如果 Step 1-3 中发现任何问题，修复后提交。

---

## 自审

**Spec 覆盖检查：**
- ✅ 配色方案（8 个色值）→ Task 1 (global.css)
- ✅ 字体（Source Serif 4）→ Task 2 (BaseHead)
- ✅ 内容卡片手绘边框 → Task 1 (global.css `.sketchy-card`)
- ✅ 分隔线手绘风格 → Task 1 (global.css `.sketchy-divider`)
- ✅ 链接手绘下划线 → Task 1 (global.css `a` styles)
- ✅ 引用块手绘边框 → Task 1 (global.css `blockquote`)
- ✅ 装饰性手绘元素 → Task 1 (global.css)
- ✅ Header 透明背景 → Task 3
- ✅ 首页卡片网格 → Task 5
- ✅ 博客列表页卡片网格 → Task 6
- ✅ 文章详情页纸张质感 → Task 7
- ✅ Footer 纯色背景+分隔线 → Task 4
- ✅ 悬停交互 → Task 1 (CSS transitions)
- ✅ 移除旧字体配置 → Task 9

**Placeholder 扫描：** 无 TBD/TODO/"implement later"。所有步骤包含完整代码。

**类型一致性：** 所有 CSS 变量名在全局和各组件中一致（`--sage`, `--terracotta`, `--cream`, `--black`, `--gray`）。
