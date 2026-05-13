# Repository Guidelines

## Project Structure & Module Organization
- `src/content/blog/`：Markdown 正文；文章路径 `年/月/日/文件名.md` 对应站内 URL `:year/:month/:day/:slug/`（slug 会与文件名一起被规范为小写）。
- `public/`：构建时复制的静态文件（验证文件、favicon、`robots.txt`、文章用到的图片路径等）。
- `src/pages/`：路由页面（首页、归档 `/blog/`、日记 Permalink：`[year]/[month]/[day]/[title].astro`）。
- `src/layouts/`、`src/components/`：布局与可复用 UI。
- `_legacy_hexo/`：原 Hexo 站点备份（themes、脚本、旧 `source`）；确认无用后可整目录删除，不影响 Astro 构建。

## 数学公式
- Markdown/MDX 中使用 `$…$`（行内）或 `$$…$$`（块）；构建链路为 `remark-math` + `rehype-katex`，全局样式见 `src/styles/global.css` 中对 KaTeX 的 `@import`。

## Build, Test, and Development Commands
- `npm install` — 安装依赖（Node ≥ 22.12，见 `package.json` engines）。
- `npm run dev` — 本地开发 `http://localhost:4321`。
- `npm run build` — 输出到 `dist/`。
- `npm run preview` — 本地预览生产构建。

## GitHub Pages 部署
- 使用 `.github/workflows/deploy.yml`（`withastro/action` + `deploy-pages`）。仓库 **Settings → Pages → Source 选 GitHub Actions**。
- 生产站点：`https://hooktech.github.io/`（`astro.config.mjs` 中 `site` 已配置）。
- 工作流在 `main`、`master` 分支 push 时会部署。

恢复远端示例：`git remote add origin git@github.com:HookTech/HookTech.github.io.git`

## Coding Style & Naming Conventions
- YAML、Markdown、项目中 JS 配置文件使用 **2 空格** 缩进。
- 新建文章：`src/content/blog/YYYY/MM/DD/slug.md`，front matter 必填 `title`、`description`、`pubDate`；可选用 `tags`、`categories`。
- 文章内静态资源路径与 **小写 slug** 一致（与 Astro 生成的 URL 一致），避免 Linux 托管环境下大小写 404。
- fenced code blocks 注明语言标签。

## Commit & Pull Request Guidelines
- 提交说明：简短、祈使句式，可加前缀（如 `post:`、`build:`）。
- PR 说明用途、要点变更；UI 改动附截图与验证步骤。
- 不要将 `dist/`、`node_modules/`、本地缓存纳入版本控制。
- **`rag-system/`** 与本博客仓库无关：勿提交（已加入 `.gitignore`）。

## Security & Configuration Tips
- 勿提交密钥。部署依赖 GitHub 提供的 OIDC/`GITHUB_TOKEN`，无需在仓库放 deploy key。

## Detail
- 思考过程和最终汇报都用中文。
- 原 Hexo 一键脚本已弃用；线上发布以 **推送触发 Actions** 为准。
