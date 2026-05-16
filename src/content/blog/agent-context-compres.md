---
title: "Agent 上下文压缩技术"
description: "为什么openclaw、heness的上下文做的这么好？"
pubDate: 2026-05-16
tags: ["技术", "AI", "Agent", "openclaw","heness","学习"]
cover: ""
coverAlt: ""
featured: false
draft: false
---

常用的手段一般是这样的：

保留System Message、最近N轮会话，摘要压缩中间部分的对话，对于工具调用相关的直接切割或用占位符替换。



还可以考虑在做压缩的同时，将会话记录外置，需要时以RAG的形式检索回来。

