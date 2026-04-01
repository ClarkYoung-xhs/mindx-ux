# MindX 2.0 上午改动摘要

关联：[[MindX]] [[MindX 2.0]] [[Memory]]

## 这轮真正收敛了什么

### 1. 2.0 不再像另一款产品

- 2.0 的壳层和导航语法继续向 [[MindX 1.0]] 靠拢
- 默认入口固定为 `Workspace`
- 顶层分组固定为：
  - `Workspace`
  - `Memory`
  - `Integrations`

### 2. Memory 的内部结构被重新收紧

- `Timeline` 不再作为左侧单独模块出现
- `Timeline` 改为 `Memory` 内部明细页
- `Knowledge` 保留既定大结构，不再继续改大分区
- `Memory` 首页固定为：
  - 顶部三张核心卡
  - `memo agent`
  - `正在生成`

### 3. `数据源` 被补成独立模块

这是这轮最重要的新边界。

- 从 `Memory` 接入的内容不再混到 `Workspace` 文档里
- 所有原始资料统一先落在 `Memory / 数据源`
- `数据源` 负责原始来源
- `Knowledge` 负责沉淀结果

### 4. 知识资产与文档的关系被补齐

- `Knowledge` 卡片只是预览
- 背后仍然对应一篇文档
- 用户现在可以：
  - 在卡片预览里继续和 `memo agent` 交流
  - 点 `编辑文档` 进入文档视图
  - 在文档视图里继续使用 1.0 的划词评论能力

### 5. 三个模块的顶部动作统一

- `Workspace`：`新建文档`
- `Memory`：`接入记忆`
- `Integrations`：`新建集成`

## 当前已经确认的产品边界

### Workspace

- 是人和 agent 的协作空间
- 不存放 Memory 原始接入资料

### Memory

- 是沉淀层
- 当前内部包含：
  - `基础记忆`
  - `Timeline`
  - `Knowledge`
  - `数据源`

### Integrations

- 是接入 / 挂载 / 回写层
- 不再沿用旧 `Skills` 语义

## 当前需要继续保持的约束

- 不要再把 2.0 做成另一套产品视觉
- 不要再往页面里塞解释型文案
- `Knowledge` 页的大结构不要再动
- `Timeline` 不要重新挂回左侧一级导航
- `数据源` 必须继续留在 `Knowledge` 下面
