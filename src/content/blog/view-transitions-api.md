---
title: "View Transitions API：让页面切换如丝般顺滑"
description: "原生浏览器动画 API 让 SPA 式的页面过渡不再需要复杂框架。"
pubDate: 2026-04-05
tags: ["Web API", "CSS", "前端"]
featured: false
draft: false
---

页面切换一直是静态站点容易显得生硬的地方。点击链接后，旧页面消失，新页面出现，中间没有任何连续性。

View Transitions API 提供了一种浏览器原生的过渡机制。它允许我们在 DOM 更新前后捕捉视图快照，再用 CSS 定义过渡效果。

```js
if (document.startViewTransition) {
  document.startViewTransition(() => navigateTo(nextUrl));
}
```

对博客而言，这类动效应该克制。它不该抢走文字的注意力，只需要在页面之间提供一点连续的手感，让阅读路径更柔和。
