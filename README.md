# MindX

MindX 是一个 **AI-native 协作与记忆原型**。

当前仓库同时承载两套并行视图：

- `1.0`：现有文档协作工作台
- `2.0`：在 1.0 基础上增强出来的 `Memory` 版本原型

这不是生产系统，而是一个持续迭代的可演示产品原型。

## 当前原型结构

### MindX 1.0

1.0 仍然是当前主工作台，侧边栏分组为：

- `Workspace`
- `Skills`
- `Memory`

其中：

- `Workspace` 负责人和 agent 的文档协作
- `Memory` 只承接基础长期记忆，如 `关于我 / 写作原则 / 当前目标`

### MindX 2.0

2.0 通过 1.0 侧边栏的 `切换到 2.0` 进入。

2.0 顶层结构固定为：

- `Workspace`
- `Memory`
- `Integrations`

其中：

- `Workspace` 继续轻复用 1.0 的文档主视图
- `Memory` 是本轮主角
- `Integrations` 负责接入、挂载、回写

## Memory 2.0 当前内容

### Memory 首页

Memory 首页当前固定为：

1. 顶部三张核心卡
   - `基础记忆`
   - `我的目标`
   - `Knowledge`
2. `memo agent`
   - 可直接提问、检索、洞察、溯源
3. `正在生成`
   - 展示近期正在形成的记忆线索
   - 可进入 `Timeline`

### Timeline

- 是 `Memory` 的内部明细页
- 不在左侧导航单独暴露
- 主要表达记忆如何从工作流中形成

### Knowledge

- 是 `Memory` 的结构化资产层
- 当前保留三块内部视图：
  - `资产库`
  - `标签分类`
  - `AI 察觉`
- 卡片预览背后仍然对应文档，可继续和 `memo agent` 互动，也可直接 `编辑文档`

### 数据源

这是当前 2.0 新补齐的模块。

它承接：

- 手动上传的资料
- 聊天记录
- 网页剪存
- 云端同步内容
- 第三方插件同步内容

重要边界：

- `数据源` 属于 `Memory`
- 这些资料 **不会进入 Workspace 文档列表**
- `Workspace` 仍只放协作文档

## 统一动作

当前三个模块的顶部动作已对齐：

- `Workspace`：`新建文档`
- `Memory`：`接入记忆`
- `Integrations`：`新建集成`

## 主要路由

### 1.0

- `/`
- `/dashboard`
- `/document`
- `/shared`

### 2.0

- `/v2/workspace`
- `/v2/workspace/activity`
- `/v2/memory`
- `/v2/memory/timeline`
- `/v2/memory/knowledge`
- `/v2/memory/sources`
- `/v2/connect`

## 开发

```bash
npm install
npm run dev
```

本地启动后，按终端输出地址访问即可。常见入口：

- `http://localhost:3001/dashboard`
- `http://localhost:3001/v2/workspace`
- `http://localhost:3001/v2/memory`

## 校验

```bash
npm run lint
npm run build
```

## 相关文档

- [MindX 2.0 Memory 模块 PRD](./docs/PRD-mindx-v2-memory-module.md)

## License

MIT
