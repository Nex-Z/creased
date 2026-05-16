# 折页 Creased

一个面向中文阅读体验的 Astro 静态博客。内容使用本地 Markdown 管理，搜索使用 Pagefind 在构建后生成静态索引，当前通过 Cloudflare Workers Static Assets 部署，也方便整体迁移和长期归档。

## 技术栈

- Astro 6
- 本地 Markdown 内容集合
- Pagefind 静态站内搜索
- 纯 CSS 设计系统
- Cloudflare Workers Static Assets 静态部署

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

`pnpm build` 会先运行 `astro build`，再运行 `scripts/build-pagefind.mjs` 生成搜索索引。这个脚本会优先索引 `dist/blog/**/*.html`，如果构建产物位于 `dist/client`，也会自动兼容。

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
coverFit: "cover"
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
- `coverFit`：封面在列表卡片中的显示方式，可选 `cover` 或 `contain`；不填时普通图片默认 `cover`，SVG/logo 默认 `contain`
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

## Cloudflare 部署

当前项目使用 Cloudflare Workers Builds + Workers Static Assets。仓库根目录的 `wrangler.jsonc` 已指定把 `dist` 作为静态资源目录上传：

```json
{
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
}
```

推荐配置：

- Production branch：`master`
- Build command：`pnpm build`
- Deploy command：`npx wrangler deploy`
- Build output directory：`dist`
- Node.js：`>=22.12.0`

不要把 Deploy command 改成 `npx wrangler pages deploy ...`。当前 Cloudflare 环境要求走 Workers Builds，`wrangler pages deploy` 会调用 Pages Direct Upload API，容易遇到项目类型或 API Token 不匹配。

也不要在仓库里添加 `@astrojs/cloudflare` adapter。项目保持 Astro 静态输出，由 `wrangler.jsonc` 负责告诉 Wrangler 上传 `dist` 静态资源；这样不会触发 Wrangler 自动执行 `astro add cloudflare` 或二次构建。

部署前可本地验证：

```sh
pnpm build
npx wrangler deploy --dry-run
```

`--dry-run` 输出里应看到 Wrangler 从 `dist` 读取静态资源。

## 迁移与归档

站点核心数据都在仓库内：

- 文章：`src/content/blog/*.md`
- 图片：`public/images/*`
- 设计系统：`src/styles/global.css`
- 页面与组件：`src/pages`、`src/components`、`src/layouts`

迁移到其他静态平台时，只需要安装依赖并运行 `pnpm build`，把 `dist` 作为静态产物发布即可。
