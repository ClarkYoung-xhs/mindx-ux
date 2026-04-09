# 需求文档：MindX 四层产品结构重构

## 引言

本次重构将 MindX 的产品结构从当前的 **Workspace + Memory + Integrations** 三层体系，调整为 **Inbox → Knowledge → Memory → Workspace** 四层信息流水线。

核心理念是建立一条从"原始碎片"到"可消费产物"的完整信息精炼链路：

- **Inbox**（原始数据收件箱）：所有碎片信息的统一收口
- **Knowledge**（知识卡片网络）：从碎片中提炼出的高价值结构化资产
- **Memory**（Agent 长期记忆）：AI 从知识资产中固化的个性化经验
- **Workspace**（人机协作空间）：面向具体任务的动态工作台

同时，侧边栏结构将从"扁平 tab 切换"演进为"左侧常驻目录树 + 右侧视图切换"的 Notion 式布局，Workspace 下的文件支持多层嵌套。

### 关键设计决策：取消 Workspace 概念，统一文档树

**原设计**中，toB（进销存工作台）和 toC（个人资产管理）被视为两个独立的 workspace，通过 WorkspaceSwitcher 下拉切换，各自拥有独立的文档列表和动态流。

**新设计**中，取消 workspace 的概念。toB 和 toC 不再是 workspace，而是**两个普通的 Smart Canvas 文档**，只是位于目录树的顶级节点位置。点击这两个节点时，右侧展示的是 Smart Canvas 文档内容（用图文并茂的内容介绍对应的工作台）。所有文档合并为一棵统一的树，根节点是 MindX 自身，不存在"切换 workspace"的概念。

### 当前结构（Before）

```
侧边栏分组：
├── Workspace
│   ├── 文档（文档列表）
│   └── 动态（Activity Feed）
├── Memory
│   ├── 记忆（基础记忆首页）
│   ├── 知识资产（Knowledge）
│   └── 数据源（Data Sources）
└── Integrations
    └── 集成与挂载
```

- Workspace 下的"文档"和"动态"是两个平级 tab
- 切换 toB/toC workspace 通过顶部 WorkspaceSwitcher 下拉
- 点击文档后跳转到独立的 DocumentEditor 页面（整页跳转）
- toB 和 toC 各自拥有独立的文档列表、动态流和 cross-reference

### 目标结构（After）

```
侧边栏分组：
├── 动态（Activity Feed）              ← 默认主页，展示全部文档动态
├── Workspace
│   ├── 进销存工作台                    ← Smart Canvas 文档（顶级节点）
│   │   ├── 全局 SKU 与动态库存表       ← 子文件节点
│   │   ├── 客户关系管理表
│   │   ├── 重点客户拜访纪要
│   │   │   └── 老王专属专区            ← 嵌套子节点
│   │   └── ...
│   └── 个人资产管理                    ← Smart Canvas 文档（顶级节点）
│       ├── 全球资产导航仪
│       ├── 投资哲学与退出策略
│       └── ...
├── Inbox                               ← 原"数据源"，改名
│   └── （全局唯一 Smart Sheet 视图）
├── Knowledge                           ← 原 Memory 下的知识资产，提升为一级
│   ├── 资产库
│   ├── 标签分类
│   └── AI 察觉
└── Memory                              ← 精简为 Agent 长期记忆
    └── （基础记忆 / 我的目标等）
```

---

## 需求

### 需求 0（前置）：DocumentEditor 巨型文件拆分

**用户故事：** 作为一名开发者，我希望将当前 4012 行、168KB 的 `DocumentEditor.tsx` 巨型文件按品类和职责拆分为多个独立模块，以便后续的四层结构重构能在清晰的代码边界上进行，而不是在一个耦合严重的单体文件中修改。

#### 当前文件结构分析

`src/pages/DocumentEditor.tsx` 包含以下耦合在一起的功能区域：

| 行号范围   | 功能区域                        | 说明                                                                                                                    |
| ---------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| L1-49      | 导入声明                        | 大量 import，混合了所有品类的依赖                                                                                       |
| L50-113    | 接口与类型定义                  | Paragraph, ChatMessage, VersionHistory, AgentPermission, Collaborator, CommentThread 等                                 |
| L114-297   | 工具函数                        | paragraphSnapshot, normalizeTagList, buildAgentReply, buildDefaultProjectComments, buildDefaultProjectVersionHistory 等 |
| L299-1796  | DocumentEditor 主组件状态与逻辑 | 所有 useState/useMemo/useEffect/handler 函数，包括评论系统、版本历史、协作者、分享、Memory 回写等                       |
| L1797-1935 | Header 区域 JSX                 | 顶部导航栏、返回按钮、文档标题、Memory 同步按钮                                                                         |
| L1935-2690 | Share Popover JSX               | 分享弹窗、成员管理、权限设置（约 750 行）                                                                               |
| L2691-2863 | Toolbar 区域 JSX                | 评论按钮、更多菜单、导出、撤销/重做、查找替换                                                                           |
| L2864-2906 | Floating Selection Menu JSX     | 文本选中后的浮动操作菜单                                                                                                |
| L2907-3181 | Main Editor 区域 JSX            | 根据文档类型分支渲染：BlockList（Smart Canvas）/ SheetView（Smart Sheet）/ iframe（Page）/ ChatLog / Paragraph 编辑器   |
| L3182-3489 | Comments Sidebar JSX            | 评论侧边栏（约 300 行）                                                                                                 |
| L3490-3602 | Version History Sidebar JSX     | 版本历史侧边栏                                                                                                          |
| L3603-3694 | Collaborators Sidebar JSX       | 协作者侧边栏                                                                                                            |
| L3695-4012 | Modals JSX                      | 复制弹窗、标签弹窗、Agent 权限弹窗、发布弹窗                                                                            |

#### 目标拆分方案

拆分后的目录结构：

```
src/pages/DocumentEditor/
├── index.tsx                      # 主入口，组装各子组件（精简为路由分发 + 布局骨架）
├── types.ts                       # 接口与类型定义（Paragraph, ChatMessage, VersionHistory 等）
├── utils.ts                       # 工具函数（paragraphSnapshot, buildAgentReply 等）
├── hooks/
│   ├── useDocumentState.ts        # 文档状态管理（文档解析、段落状态、Memory 回写等）
│   ├── useComments.ts             # 评论系统状态与逻辑
│   ├── useVersionHistory.ts       # 版本历史状态与逻辑
│   ├── useCollaborators.ts        # 协作者状态与逻辑
│   └── useShareSettings.ts        # 分享设置状态与逻辑
├── components/
│   ├── EditorHeader.tsx           # 顶部导航栏（返回、标题、同步按钮、协作者头像等）
│   ├── EditorToolbar.tsx          # 工具栏（评论、更多菜单、导出、撤销/重做等）
│   ├── SelectionMenu.tsx          # 文本选中浮动菜单
│   ├── SharePopover.tsx           # 分享弹窗（成员管理、权限设置）
│   ├── CommentsSidebar.tsx        # 评论侧边栏
│   ├── VersionHistorySidebar.tsx  # 版本历史侧边栏
│   ├── CollaboratorsSidebar.tsx   # 协作者侧边栏
│   ├── DuplicateModal.tsx         # 复制弹窗
│   ├── LabelModal.tsx             # 标签弹窗
│   ├── AgentPermissionModal.tsx   # Agent 权限弹窗
│   ├── PublishModal.tsx           # 发布弹窗
│   └── editors/
│       ├── CanvasEditor.tsx       # Smart Canvas 编辑器视图（BlockList 包装）
│       ├── SheetEditor.tsx        # Smart Sheet 编辑器视图（SheetView 包装）
│       ├── PageEditor.tsx         # Page 编辑器视图（iframe 预览 + 代码模式）
│       ├── ChatLogView.tsx        # 聊天记录视图
│       └── ParagraphEditor.tsx    # 段落编辑器视图（Memory 文档等）
```

#### 验收标准

1. WHEN 拆分完成 THEN 系统 SHALL 将 `DocumentEditor.tsx` 从单文件重构为 `DocumentEditor/` 目录结构，主入口 `index.tsx` 不超过 200 行
2. WHEN 拆分完成 THEN 系统 SHALL 将所有接口和类型定义提取到 `types.ts`，所有工具函数提取到 `utils.ts`
3. WHEN 拆分完成 THEN 系统 SHALL 将状态管理逻辑按职责拆分为独立的 custom hooks（useDocumentState, useComments, useVersionHistory, useCollaborators, useShareSettings）
4. WHEN 拆分完成 THEN 系统 SHALL 将 JSX 按功能区域拆分为独立组件（EditorHeader, EditorToolbar, SharePopover, CommentsSidebar, VersionHistorySidebar, CollaboratorsSidebar, 各 Modal）
5. WHEN 拆分完成 THEN 系统 SHALL 将编辑器主体按文档品类拆分为独立组件（CanvasEditor, SheetEditor, PageEditor, ChatLogView, ParagraphEditor），放置在 `editors/` 子目录下
6. WHEN 拆分完成 THEN 系统 SHALL 确保所有现有功能（文档编辑、评论、版本历史、协作、分享、Memory 回写等）保持正常工作，无功能回退
7. WHEN 拆分完成 THEN 系统 SHALL 更新所有引用 `DocumentEditor` 的路由配置和导入路径，确保路由正常工作
8. IF 其他文件（如路由配置）引用了 `DocumentEditor` 的默认导出 THEN 系统 SHALL 保持 `index.tsx` 的默认导出签名不变，确保外部引用无需修改

---

### 需求 1：侧边栏导航结构（含"动态"主页 Tab）

**用户故事：** 作为一名 MindX 用户，我希望侧边栏按照 动态 → Workspace → Inbox → Knowledge → Memory 的顺序展示，并且进入 MindX 时默认定位到"动态"Tab，以便我能第一时间看到所有文档的最新变更。

#### 验收标准

1. WHEN 用户进入 V2 页面 THEN 侧边栏 SHALL 在 Workspace 分组**上方**展示一个"动态"Tab（类似主页定位）
2. WHEN 用户首次进入 MindX（V2）THEN 系统 SHALL 默认导航到"动态"Tab 页面
3. WHEN 用户点击"动态"Tab THEN 系统 SHALL 在右侧展示全部工作台文档的动态信息（Activity Feed），不区分 toB / toC
4. WHEN 侧边栏渲染完成 THEN 系统 SHALL 按顺序展示：动态、Workspace（目录树）、Inbox、Knowledge、Memory
5. WHEN 侧边栏渲染完成 THEN 系统 SHALL 移除原有的 Integrations 分组
6. WHEN 用户查看 Memory 分组 THEN 系统 SHALL 仅展示"记忆"入口（即原基础记忆首页），不再包含 Knowledge 和数据源子项
7. IF 当前语言为中文 THEN 系统 SHALL 将"动态"显示为"动态"，Inbox 显示为"Inbox"（保留英文），Knowledge 显示为"知识资产"，Memory 显示为"记忆"
8. WHEN 用户点击 Inbox THEN 系统 SHALL 导航到 Inbox 页面（原数据源页面，路由调整为 `/v2/inbox`）
9. WHEN 用户点击 Knowledge THEN 系统 SHALL 导航到知识资产页面（路由调整为 `/v2/knowledge`）

---

### 需求 2：取消 Workspace 概念，统一文档树

**用户故事：** 作为一名 MindX 用户，我希望 toB（进销存工作台）和 toC（个人资产管理）不再被视为独立的 workspace，而是作为两个普通的 Smart Canvas 文档位于目录树顶级节点，以便我能在一棵统一的文档树中管理所有文件，无需切换 workspace。

#### 验收标准

1. WHEN 侧边栏渲染 Workspace 分组 THEN 系统 SHALL 将"进销存工作台"和"个人资产管理"作为两个普通的 Smart Canvas 文档节点平铺展示在目录树顶层，而非作为 workspace 容器
2. WHEN 用户点击"进销存工作台"或"个人资产管理"顶级节点 THEN 系统 SHALL 在右侧展示对应的 Smart Canvas 文档内容（图文并茂地介绍该工作台），而非展示 Activity Feed
3. WHEN 用户点击文件子节点 THEN 系统 SHALL 在侧边栏右侧的主内容区渲染该文件的详情页（文档编辑器/表格视图/页面视图），而非整页跳转
4. WHEN 文件节点本身包含子节点 THEN 系统 SHALL 在该文件节点旁显示展开箭头，支持继续展开查看子文件
5. IF 某个文件节点没有子节点 THEN 系统 SHALL 不显示展开箭头，仅作为叶子节点
6. WHEN 用户展开多层嵌套的文件树 THEN 系统 SHALL 通过缩进层级清晰表达父子关系，没有文件夹概念，只有文件嵌套文件
7. WHEN 页面整体布局渲染 THEN 系统 SHALL 呈现为"左侧侧边栏常驻 + 右侧切换视图"的结构，侧边栏不因视图切换而消失
8. WHEN 系统初始化 THEN 系统 SHALL 废弃 `WorkspaceSwitcher` 组件和 `switchWorkspace` 逻辑，不再存在"切换 workspace"的概念
9. WHEN 系统初始化 THEN 系统 SHALL 废弃 `WorkspaceType`（"toB" | "toC"）类型和 `currentWorkspaceType` 状态，所有文档统一在一棵树中管理

---

### 需求 3：数据模型调整 — 取消 Workspace，统一文档树

**用户故事：** 作为一名开发者，我希望数据模型能够反映"取消 workspace、统一文档树"的设计，以便代码层面不再有 workspace 切换的概念，所有文档在同一棵树中管理。

#### 验收标准

1. WHEN 定义 WorkspaceDoc 接口 THEN 系统 SHALL 保留 `children?: WorkspaceDoc[]` 和 `parentId?: string` 字段，用于表达文件嵌套关系
2. WHEN 定义 WorkspaceDoc 接口 THEN 系统 SHALL 将 `workspaceId` 字段标记为可选或统一为同一个值（因为不再区分 workspace）
3. WHEN Block 接口中需要表达子文件 THEN 系统 SHALL 在 `Block.children` 中添加类型为 `smart_canvas` / `smart_sheet` / `page` 的 block
4. WHEN 数据模型更新 THEN 系统 SHALL 废弃 `DemoWorkspace` 接口和 `initialWorkspaces` 数组（不再需要 workspace 实体）
5. WHEN 数据模型更新 THEN 系统 SHALL 废弃 `MindXDemoContext` 中的 `currentWorkspaceType`、`switchWorkspace` 等 workspace 切换相关状态和方法
6. WHEN 数据模型更新 THEN 系统 SHALL 将 `documents` 状态改为统一的文档树（包含原 toB 和 toC 的所有文档），不再根据 workspace 类型切换

---

### 需求 4：Mockdata 合并与重构

**用户故事：** 作为一名开发者，我希望将 toB 和 toC 的 mockdata 合并为一棵统一的文档树，并为两个顶级节点补充 Smart Canvas 介绍内容，以便目录树能够正确展示统一的文件层级。

#### 验收标准

1. WHEN 构建统一文档树 THEN 系统 SHALL 将 `mindxDemo.ts` 和 `tocMindxDemo.ts` 中的文档数据合并为一个 `initialDocuments` 数组，包含两个顶级 Smart Canvas 文档节点
2. WHEN 构建"进销存工作台"顶级节点 THEN 系统 SHALL 创建一个 Smart Canvas 类型的 `WorkspaceDoc`，其 `blocks` 包含图文并茂的内容介绍该工作台（如工作台概述、核心能力、团队成员等），其 `children` 包含原 toB 的所有文档
3. WHEN 构建"个人资产管理"顶级节点 THEN 系统 SHALL 创建一个 Smart Canvas 类型的 `WorkspaceDoc`，其 `blocks` 包含图文并茂的内容介绍该工作台（如资产概览、投资策略、工具集等），其 `children` 包含原 toC 的所有文档
4. WHEN 文档合并后 THEN 系统 SHALL 确保所有现有的 cross-reference（`crossReferences.ts` 和 `tocCrossReferences.ts`）和 embed_sheet 引用关系仍然正常工作
5. WHEN 文档合并后 THEN 系统 SHALL 确保 Page 类型文档也能作为子节点被正确嵌套
6. WHEN 文档合并后 THEN 系统 SHALL 合并 toB 和 toC 的 Activity 数据为一个统一的 `initialActivities` 数组
7. WHEN 文档合并后 THEN 系统 SHALL 合并 toB 和 toC 的 cross-reference 数据为一个统一的 `crossReferences` 数组
8. WHEN 构建统一文档树 THEN 系统 SHALL 保留原有的嵌套关系（如"重点客户拜访纪要"下嵌套"老王专属专区"），并确保 toB 和 toC 各自的子文档嵌套结构不变
9. WHEN Inbox mockdata 创建 THEN 系统 SHALL 创建全局唯一 Smart Sheet 的 mockdata（字段覆盖：来源类型、标题、日期、标签、状态等）

---

### 需求 5："动态"主页

**用户故事：** 作为一名 MindX 用户，我希望有一个"动态"主页作为进入 MindX 的默认页面，展示全部工作台文档的动态信息，以便我能一目了然地了解所有文档的最新变更，不需要区分 toB 和 toC。

#### 验收标准

1. WHEN 用户进入 MindX（V2）THEN 系统 SHALL 默认导航到"动态"页面（路由为 `/v2/activity` 或 `/v2`）
2. WHEN "动态"页面渲染 THEN 系统 SHALL 展示统一的 Activity Feed，包含原 toB 和 toC 的所有动态记录，按时间倒序排列
3. WHEN "动态"页面渲染 THEN 系统 SHALL 支持按操作者（人类/Agent）筛选动态
4. WHEN "动态"页面渲染 THEN 系统 SHALL 在动态条目中显示文档名称、操作类型、操作者、时间等信息
5. WHEN 用户点击动态条目中的文档名称 THEN 系统 SHALL 导航到对应的文档详情页，并在侧边栏目录树中高亮对应节点
6. IF 原有的 V2ActivityPage 已存在 THEN 系统 SHALL 复用并改造该页面，使其展示合并后的全量动态数据

---

### 需求 6：Inbox 页面（原数据源改名）

**用户故事：** 作为一名 MindX 用户，我希望原来的"数据源"tab 改名为"Inbox"，并且打开后展示一个全局唯一的 Smart Sheet 视图来管理所有原始碎片数据，以便我能用结构化表格灵活管理未经加工的初始信息。

#### 验收标准

1. WHEN 用户点击侧边栏的 Inbox THEN 系统 SHALL 展示一个全局唯一的 Smart Sheet 数据视图，而非原来的文档列表
2. WHEN Inbox Smart Sheet 渲染 THEN 系统 SHALL 支持自定义字段（如来源、类型、日期、标签等），用于灵活管理原始信息
3. WHEN 用户在 Inbox 中查看数据 THEN 系统 SHALL 兼容展示主动录入、剪藏和第三方同步的各类数据格式
4. IF 原数据源页面的筛选逻辑仍然适用 THEN 系统 SHALL 保留来源分类筛选能力，但以 Smart Sheet 的列筛选形式呈现
5. WHEN 路由配置更新 THEN 系统 SHALL 将原 `/v2/memory/sources` 路由重定向或替换为 `/v2/inbox`

---

### 需求 7：Knowledge 提升为一级 Tab

**用户故事：** 作为一名 MindX 用户，我希望知识资产（Knowledge）从 Memory 的子模块提升为侧边栏的一级 tab，以便我能更直接地访问和管理我的结构化知识资产。

#### 验收标准

1. WHEN 侧边栏渲染 THEN 系统 SHALL 将 Knowledge 作为独立的一级分组展示，位于 Inbox 和 Memory 之间
2. WHEN 用户点击 Knowledge THEN 系统 SHALL 展示知识资产页面，内部结构（资产库、标签分类、AI 察觉）保持不变
3. WHEN 路由配置更新 THEN 系统 SHALL 将原 `/v2/memory/knowledge` 路由调整为 `/v2/knowledge`
4. IF 原有从 Memory 首页跳转到 Knowledge 的链接存在 THEN 系统 SHALL 更新这些链接指向新路由

---

### 需求 8：Memory 精简为 Agent 长期记忆

**用户故事：** 作为一名 MindX 用户，我希望 Memory tab 精简为仅展示 Agent 长期记忆内容，以便我能专注于管理 AI 的个性化经验和背景上下文。

#### 验收标准

1. WHEN 用户点击 Memory THEN 系统 SHALL 仅展示基础记忆内容（关于我、写作原则、我的目标等），不再包含 Knowledge 和数据源入口
2. WHEN Memory 页面渲染 THEN 系统 SHALL 保持原有基础记忆的展示结构不变
3. WHEN Memory 首页的三张核心卡片渲染 THEN 系统 SHALL 移除"Knowledge"卡片入口（因为 Knowledge 已提升为一级 tab），保留"基础记忆"和"我的目标"
4. IF memo agent 功能仍在 Memory 首页 THEN 系统 SHALL 保留该功能不变

---

### 需求 9：左右分栏布局（侧边栏常驻 + 右侧视图切换）

**用户故事：** 作为一名 MindX 用户，我希望页面整体呈现为左侧侧边栏常驻、右侧切换视图的结构，以便我在浏览文件树的同时能快速预览和编辑文档内容。

#### 验收标准

1. WHEN 用户点击侧边栏中的文件节点 THEN 系统 SHALL 在右侧主内容区渲染对应的文档详情（Smart Canvas 编辑器 / Smart Sheet 表格 / Page HTML 视图），侧边栏保持不变
2. WHEN 用户点击"进销存工作台"或"个人资产管理"顶级节点 THEN 系统 SHALL 在右侧展示该节点的 Smart Canvas 文档内容（工作台介绍），而非 Activity Feed
3. WHEN 用户点击"动态"Tab THEN 系统 SHALL 在右侧展示统一的 Activity Feed
4. WHEN 用户点击 Inbox / Knowledge / Memory THEN 系统 SHALL 在右侧展示对应模块的内容页，侧边栏保持不变
5. WHEN 用户在右侧视图中操作 THEN 系统 SHALL 确保侧边栏的选中状态与右侧内容保持同步
6. IF 用户从文档详情页返回 THEN 系统 SHALL 不发生整页跳转，仅切换右侧视图内容

---

### 需求 10：路由体系重构

**用户故事：** 作为一名开发者，我希望路由体系能够反映新的统一文档树结构和四层导航，以便 URL 能够准确表达当前视图状态。

#### 验收标准

1. WHEN 路由配置更新 THEN 系统 SHALL 支持以下新路由：
   - `/v2` 或 `/v2/activity` — 动态主页（默认页）
   - `/v2/doc/:docId` — 文档详情（统一路由，不再区分 workspace）
   - `/v2/inbox` — Inbox 页面
   - `/v2/knowledge` — Knowledge 页面
   - `/v2/memory` — Memory 页面
2. WHEN 用户访问旧路由 THEN 系统 SHALL 重定向到对应的新路由：
   - `/v2/workspace/activity` → `/v2/activity`
   - `/v2/workspace/doc?doc=xxx` → `/v2/doc/xxx`
   - `/v2/memory/knowledge` → `/v2/knowledge`
   - `/v2/memory/sources` → `/v2/inbox`
3. WHEN 用户在侧边栏点击文件节点 THEN 系统 SHALL 更新 URL 为 `/v2/doc/:docId`，支持浏览器前进/后退导航
4. IF 用户直接通过 URL 访问某个文档 THEN 系统 SHALL 正确展开侧边栏目录树到对应节点并高亮选中
5. WHEN 用户访问 `/v2` 根路径 THEN 系统 SHALL 默认展示"动态"主页

---

## 边界与约束

### 技术约束

1. Block 接口需要新增 `children` 字段以支持嵌套，但不应破坏现有 BlockRenderer 的渲染逻辑
2. 现有的 cross-reference 和 embed_sheet 引用关系在重构后必须继续正常工作
3. `WorkspaceSwitcher` 组件将被废弃，其功能由侧边栏目录树替代
4. `DemoWorkspace` 接口、`initialWorkspaces` 数组、`WorkspaceType` 类型、`currentWorkspaceType` 状态、`switchWorkspace` 方法将被废弃
5. `mindxDemo.ts` 和 `tocMindxDemo.ts` 的文档数据将合并为一个统一的 `initialDocuments` 数组
6. `mindxDemo.ts` 和 `tocMindxDemo.ts` 的 Activity 数据将合并为一个统一的 `initialActivities` 数组
7. 路由中不再包含 `workspaceId` 参数，文档路由统一为 `/v2/doc/:docId`

### UX 约束

1. 侧边栏目录树的展开/折叠应有流畅的动画过渡
2. 文件节点应根据类型（Smart Canvas / Smart Sheet / Page）显示不同的图标
3. 当前选中的文件节点应有明确的高亮状态
4. 目录树的嵌套层级不应超过 4 层，以避免过深的缩进影响可读性
5. "动态"Tab 应有明确的视觉区分（如图标 + 高亮），让用户知道这是主页入口

### 数据约束

1. Inbox 的全局唯一 Smart Sheet 需要新建 mockdata，字段设计应覆盖：来源类型、标题、日期、标签、状态等
2. 两个顶级 Smart Canvas 文档需要新建 blocks mockdata，内容为图文并茂的工作台介绍
3. 合并后的 Activity 数据需要去除 `workspaceId` 的区分逻辑，统一展示
4. 合并后的 cross-reference 数据需要确保 sourceId/targetId 在统一文档树中仍然唯一且正确
