---
title: "重新看 LangGraph 文档，有什么变化？"
description: "隔一段时间，再回来看LangGraph，对我来说，有哪些不一样？"
pubDate: 2026-05-16
tags: ["技术", "AI", "Agent", "LangGraph","学习"]
cover: "https://github.com/langchain-ai/langgraph/raw/main/.github/images/logo-light.svg"
coverAlt: "langgraph"
featured: true
draft: false
---



建议学 LangGraph 之前 先对 LangChain 有一定了解，看一遍文档，过一遍即可



## 疑惑

### 1、为什么要单独做工具节点？

就比如下面的代码 为啥要单独做一个工具节点，感觉没必要

```python
from langchain.messages import ToolMessage


def tool_node(state: dict):
    """Performs the tool call"""

    result = []
    for tool_call in state["messages"][-1].tool_calls:
        tool = tools_by_name[tool_call["name"]]
        observation = tool.invoke(tool_call["args"])
        result.append(ToolMessage(content=observation, tool_call_id=tool_call["id"]))
    return {"messages": result}
```

其实这里只是为了 让 agent loop 各个环节细化出来，让整体的变得更可控、更具可观测性，无它。



### 2、每个节点的state能干嘛 是设计来干嘛的？

最简单的结构，每个节点往里 append，所有节点共享同一份对话历史。

```python
class MessagesState(TypedDict):
    messages: list
```

你可以自定义加任何字段

```python
class MyState(TypedDict):
    messages: list
    current_step: int
    retry_count: int
    user_id: str
    task_result: dict
```

设计目的就是**避免节点之间用全局变量或者函数参数传数据**，所有中间状态都在一个地方。

checkpoint 也只需要序列化这一个对象，恢复的时候直接还原 state 就能从断点继续跑。

实际上就是拿来传递参数的 实现全局共享，存储，中断恢复用的，仅此而已。



## 最简单的文件结构

```
my-app/
├── my_agent # all project code lies within here
│   ├── utils # utilities for your graph
│   │   ├── __init__.py
│   │   ├── tools.py # tools for your graph
│   │   ├── nodes.py # node functions for your graph
│   │   └── state.py # state definition of your graph
│   ├── __init__.py
│   └── agent.py # code for constructing your graph
├── .env # environment variables
├── requirements.txt # package dependencies
└── langgraph.json # configuration file for LangGraph
```



## 总结

LangGraph 实际上核心就是将Agent Loop封了一层，让Agent的可控性、可观测性变得不再黑盒。

大家目前基本上都会是 Agent Loop在做东西，虽然说大家目前都不喜欢LangChain那样抽象、复杂的框架了，但也不可能每个人真的手搓一套Agent Loop，那样对于真正的生产环境并不友好。

LangGraph 卡的位置刚好是"不想手搓、但又不想完全黑盒"的中间地带。对个人开发者或者 solo 项目来说可能偏重，但对需要多人协作、要求可审计、要求稳定性的中小团队来说，这个封装是值得的。