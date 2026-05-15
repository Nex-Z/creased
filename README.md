# 折页 Creased

一个面向中文阅读体验的 Astro 静态博客。内容使用本地 Markdown 管理，搜索使用 Pagefind 在构建后生成静态索引，适合部署到 Cloudflare Pages，也方便整体迁移和长期归档。

## 技术栈

- Astro 6
- 本地 Markdown 内容集合
- Pagefind 静态站内搜索
- 纯 CSS 设计系统
- Cloudflare Pages 静态部署

## 本地开发

```sh
pnpm install
pnpm dev
```

生产构建：

```sh
pnpm build
pnpm preview
```

`pnpm build` 会先运行 `astro build`，再运行 `pagefind --site dist --glob "blog/**/*.html"` 生成搜索索引。

## 写文章

文章放在 `src/content/blog/`，每篇文章是一个 Markdown 文件：

```md
---
title: "文章标题"
description: "文章摘要"
pubDate: 2026-05-10
tags: ["Astro", "前端"]
cover: "/images/featured-post.png"
coverAlt: "封面描述"
featured: false
draft: false
---

正文内容。
```

字段说明：

- `title`：文章标题
- `description`：摘要，用于列表、SEO 和 RSS
- `pubDate`：发布日期
- `tags`：标签数组
- `cover` / `coverAlt`：可选封面图和替代文本
- `featured`：是否进入首页置顶推荐
- `draft`：设为 `true` 时不会进入首页、归档、标签页、RSS 或搜索

图片建议放在 `public/images/`，文章中使用 `/images/xxx.png` 引用。

## 页面

- `/`：首页
- `/archive/`：文章归档
- `/tags/`：标签总览
- `/tags/[tag]/`：标签文章页
- `/blog/[slug]/`：文章详情
- `/about/`：关于
- `/rss.xml`：RSS
- `/404`：未找到页面

## Cloudflare Pages

推荐配置：

- Production branch：`master`
- Build command：`pnpm build`
- Build output directory：`dist`
- Node.js：`>=22.12.0`

项目保持静态输出，不需要 Cloudflare adapter、数据库、Pages Functions 或付费服务。

## 迁移与归档

站点核心数据都在仓库内：

- 文章：`src/content/blog/*.md`
- 图片：`public/images/*`
- 设计系统：`src/styles/global.css`
- 页面与组件：`src/pages`、`src/components`、`src/layouts`

迁移到其他静态平台时，只需要安装依赖并运行 `pnpm build`，把 `dist` 作为静态产物发布即可。
