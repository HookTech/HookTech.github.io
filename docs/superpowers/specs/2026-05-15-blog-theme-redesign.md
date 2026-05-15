# 博客主题 redesign - Humanist Literary 风格

## 背景与目标

将现有 Astro 博客从当前简约风格改造为 Anthropic 官网式的 **Humanist Literary with sketchy hand-drawn borders** 风格，核心特征：
- 温暖奶油色背景 + 鼠尾草绿/陶土色强调
- 衬线字体营造文学感
- SVG 手绘边框和装饰性手绘元素
- 有机、人文、不完美的手绘美学

## 配色方案

| 用途 | 色值 | 说明 |
|------|------|------|
| 页面背景 | `#faf8f5` | 温暖奶油色 |
| 卡片/内容区背景 | `#ffffff` | 纯白 |
| 主文字 | `#1a1a1a` | 深黑 |
| 次要文字/日期 | `#5a5a5a` | 暖灰 |
| 强调色/链接 | `#5a8f7b` | 鼠尾草绿 |
| 悬停/交互 | `#d4734a` | 陶土色 |
| 边框/手绘线 | `#1a1a1a` | 黑色 |
| 代码块背景 | `#f0ede8` | 浅奶油灰 |
| 引用块背景 | `#f5f2ed` | 略深奶油色 |

## 字体方案

- **标题与正文统一**：`'Source Serif 4', Georgia, serif`
- **加载方式**：Google Fonts CDN，在 `BaseHead.astro` 中引入
- **字重**：标题 600-700，正文 400
- **基础字号**：正文 18px（桌面），17px（移动端）
- **行高**：1.7（比当前 1.65 略宽松，衬线体需要更多呼吸空间）

## 手绘边框实现

### 1. 内容卡片手绘边框（SVG border-image）

每张博客卡片外围使用 SVG 路径绘制不规则边框。实现方式：

```css
.sketchy-border {
  border-image: url("data:image/svg+xml,...") 20 20 20 20 stretch;
  border-width: 2px;
}
```

SVG 路径是一个有轻微随机抖动的矩形轮廓，模拟手绘笔触。

### 2. 手绘分隔线

标题下方、区块之间的分隔线用 SVG 路径绘制轻微波浪线：

```css
.sketchy-divider {
  background-image: url("data:image/svg+xml,...");
  height: 3px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
```

### 3. 链接手绘下划线

链接悬停时下划线用手绘风格（轻微抖动线），通过 `text-decoration-style: wavy` 或 SVG 背景实现。

### 4. 引用块手绘边框

`blockquote` 左侧边框改为粗手绘线（4px，带轻微不规则感）。

## 装饰性手绘元素

- 页面角落散落小型 SVG 手绘装饰（小圆点、短线条）
- 首页 hero 区域用 CSS `feTurbulence` 滤镜模拟轻微纸张质感
- 代码块边框改为手绘风格（轻微圆角 + 不规则感）

## 布局与组件调整

### Header
- 去掉白色背景和 `box-shadow`
- 背景改为透明（继承页面 `#faf8f5`）
- 导航链接去掉底部 4px 边框指示器
- 悬停时显示手绘风格下划线

### 首页（index.astro）
- 标题区域加大留白（padding-top 增加到 4em）
- 主标题字号放大到 3em（衬线体大标题更有冲击力）
- 文章列表从单列改为**卡片网格布局**（2 列桌面，1 列移动端）
- 每张卡片有手绘边框 + 内边距 + 轻微阴影
- "最近更新"标题下方加手绘分隔线

### 文章列表页（blog/index.astro）
- 统一为与首页一致的卡片网格布局
- 去掉 hero 图片（当前第一个卡片占全宽的布局）
- 卡片包含：标题、日期、描述

### 文章详情页（BlogPost.astro）
- 标题区域居中，加大留白
- `.prose` 区域加轻微纸张质感背景（`#ffffff` 带阴影）
- 正文区域与页面背景形成层次
- `blockquote` 左侧用手绘粗线
- 代码块边框手绘风格
- 日期区域样式优化

### Footer
- 去掉 `linear-gradient` 背景
- 改为纯色 `#faf8f5`
- 上方加手绘分隔线
- 文字颜色改为 `#5a5a5a`

## 交互效果

- 卡片悬停：边框颜色从 `#1a1a1a` 变为 `#5a8f7b`（鼠尾草绿），过渡 0.3s
- 链接悬停：显示手绘下划线 + 颜色变为 `#d4734a`
- 按钮/标签悬停：颜色变为 `#d4734a`

## 文件变更清单

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `src/styles/global.css` | 重写 | 新配色、字体、手绘边框 CSS、装饰元素 |
| `src/components/BaseHead.astro` | 修改 | 引入 Source Serif 4 字体，去掉 Atkinson 字体 |
| `src/components/Header.astro` | 修改 | 去掉背景/阴影，新悬停样式 |
| `src/components/Footer.astro` | 修改 | 新背景、手绘分隔线 |
| `src/pages/index.astro` | 修改 | 卡片网格布局、更大标题、手绘分隔线 |
| `src/pages/blog/index.astro` | 修改 | 统一卡片网格布局 |
| `src/layouts/BlogPost.astro` | 修改 | 纸张质感、手绘引用块边框、代码块边框 |
| `astro.config.mjs` | 修改 | 移除 Atkinson 本地字体配置 |

## 不改动项

- 路由结构不变（`[year]/[month]/[day]/[title].astro`）
- Content Collections 和 frontmatter schema 不变
- 数学公式渲染配置不变
- RSS 和 sitemap 配置不变
- 部署流程不变
