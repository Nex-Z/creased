---
title: "深入理解 CSS Container Queries 的实际应用"
description: "Container Queries 改变了我们思考组件响应式设计的方式，让组件根据容器而不是视口自适应。"
pubDate: 2026-04-20
tags: ["CSS", "前端", "响应式"]
featured: false
draft: false
---

过去我们做响应式布局时，几乎总是从视口出发：屏幕小于多少像素就切换布局。但组件真正关心的往往不是屏幕有多宽，而是自己被放进了多大的容器。

Container Queries 让这种判断变得自然。一个卡片组件放在双栏里可以紧凑，放在详情页里可以展开，而不需要父级告诉它当前处在什么场景。

```css
.post-card {
  container-type: inline-size;
}

@container (max-width: 520px) {
  .post-card {
    grid-template-columns: 1fr;
  }
}
```

这会改变组件设计的边界。我们不再只写「页面级响应式」，而是为组件定义自己的空间语法。
