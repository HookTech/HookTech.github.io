# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and Open Graph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 博客：新建 → 编辑 → 预览 → 发布

本仓库文章用 [Content Collections](https://docs.astro.build/en/guides/content-collections/)，正文在 `src/content/blog/`，线上地址为 **`https://hooktech.github.io/<年>/<月>/<日>/<slug>/`**（`trailingSlash: 'always'`）。发布靠 **GitHub Actions** 推送到 **GitHub Pages**（详见仓库内 `.github/workflows/deploy.yml`）。

### 1. 新建一篇文章

1. 在 `src/content/blog/` 下按发布日期建好目录：**`YYYY/MM/DD/`**（与希望出现在 URL 里的日期一致）。
2. 在该目录新建 **`文章名.md`**（或 `.mdx`）。**文件名（不含扩展名）会参与生成 URL 中的 `<slug>`**，构建时一般会规范为**小写**，因此正文里引用图片等资源时路径也建议用小写，避免在 Linux 环境下 404。
3. 文件顶部写 **YAML front matter**，须满足 `src/content.config.ts` 里的 schema（当前至少包含）：

```yaml
---
title: 文章标题
description: 一句话摘要（用于 SEO、列表、RSS）
pubDate: 2025-05-13T12:00:00
# 可选
tags: [标签一, 标签二]
categories: [分类]
updatedDate: 2025-05-14T10:00:00
---
```

4. **图片等静态资源**：放在 **`public/`** 下，与线上 URL 对应。例如文章 URL 为 `/2025/05/13/my-note/`，图片可放在 `public/2025/05/13/my-note/cover.png`，正文中写 `![说明](/2025/05/13/my-note/cover.png)`。

### 2. 编辑正文

- 使用任意编辑器（VS Code、Cursor、Obsidian 等）直接改上述 `.md` / `.mdx`。
- **数学公式**：行内用 `$...$`，独立一行用 `$$...$$`；不要再用反引号把公式包起来，否则不会走 KaTeX。
- 改完 front matter 或集合 schema 后，可运行 `npm run astro -- check` 做类型与内容检查（见下文 CLI 备忘）。

### 3. 本地预览

| 目的 | 命令 | 说明 |
| :--- | :--- | :--- |
| 开发态热更新 | `npm run dev` | 默认 `http://localhost:4321/`，改 MD 后刷新即可看效果 |
| 接近线上构建结果 | `npm run build` 然后 `npm run preview` | 先产出 `dist/`，再本地起静态预览 |
| 同网段手机访问（可选） | `npm run astro -- dev --host` | 按终端提示用局域网 IP 访问 |

单篇地址示例：`http://localhost:4321/2025/05/13/my-note/`（注意末尾斜杠与线上习惯一致）。

### 4. 发布到 GitHub Pages

1. 确认仓库 **Settings → Pages → Build and deployment** 的 **Source** 为 **GitHub Actions**（首次部署时配置一次即可）。
2. 在仓库根目录提交并推送到会触发工作流的分支（本仓库为 **`main` 或 `master`**）：

```sh
git add -A
git status   # 确认只包含预期文件
git commit -m "post: 简短说明"
git push origin main
```

3. 在 GitHub **Actions** 里查看 **Deploy to GitHub Pages** 是否成功；完成后访问 **https://hooktech.github.io/** 做最终核对（含公式、图片、RSS `/rss.xml` 等）。

---

若你调整了 `astro.config.mjs` 里的 `site` / 路由约定，URL 规则以当前配置为准；front matter 字段以 `src/content.config.ts` 为准。

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Astro CLI quick reference（备忘）

本仓库里已通过 `npm` 封装，统一写成 `npm run astro -- <args>`（`--` 后面才是传给 Astro CLI 的参数）。

### 帮助与子命令帮助

```sh
npm run astro -- --help
npm run astro -- add --help
npm run astro -- check --help
```

### `astro check`：类型 / 内容与配置检查（改完组件或 schema 跑一次很省事）

```sh
npm run astro -- check
npm run astro -- check --watch
```

### `astro add`：按需加集成（官方交互向导，等价于装好包并改配置）

例如想加 Tailwind、React、sitemap（本仓库已有部分集成，重复执行时注意冲突）：

```sh
npm run astro -- add tailwind
npm run astro -- add react
```

### `astro telemetry`：关闭匿名使用统计（可选）

```sh
npm run astro -- telemetry disable
npm run astro -- telemetry status
```

### `astro build` / `dev` / `preview`（与 npm scripts 对应）

下面这些与 `npm run build`、`npm run dev`、`npm run preview` 基本一致，任选一种习惯即可：

```sh
npm run astro -- dev
npm run astro -- dev --host
npm run astro -- build
npm run astro -- preview
```

### `astro info`：排查环境问题时贴给别人的诊断摘要

```sh
npm run astro -- info
```

更多子命令见官方 [CLI 文档](https://docs.astro.build/reference/cli-reference/).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
