---
title: "用 Astro 构建内容驱动的静态博客"
description: "Astro 以内容优先架构和零 JS 默认策略，成为中文博客框架的理想选择。"
pubDate: 2026-05-08
tags: ["Astro", "前端", "静态站点", "Markdown"]
featured: true
draft: false
---

一个好的博客系统不应该把写作流程变复杂。对个人站点而言，Markdown、Git 和静态部署已经足够可靠，也足够长久。

Astro 的优势在于它默认把内容和页面放在第一位。你可以用 Markdown 写文章，用 Astro 组件组织页面，再把整个站点构建成普通 HTML 文件部署到 Cloudflare Pages。

## 内容集合

内容集合为文章提供结构化 frontmatter。标题、摘要、发布日期、标签、封面和草稿状态都可以被类型系统约束，这让归档、标签页和 RSS 都能从同一个数据源生成。

```ts
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
  }),
});
```

## 静态但不简陋

静态站点并不意味着功能贫瘠。搜索可以用 Pagefind 在构建后生成索引；RSS 可以在构建时输出 XML；标签和归档也都可以通过静态动态路由完成。

这套方式的好处是迁移很轻：文章就是 Markdown，图片就是文件，部署产物就是 HTML、CSS 和少量必要的 JavaScript。
