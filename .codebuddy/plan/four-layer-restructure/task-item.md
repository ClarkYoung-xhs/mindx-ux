# 实施计划：MindX 四层产品结构重构

---

- [ ] 1. DocumentEditor 巨型文件拆分 — 类型、工具函数与 Hooks 提取
  - 创建 `src/pages/DocumentEditor/` 目录结构
  - 将 `DocumentEditor.tsx` 中 L50-113 的接口与类型定义（Paragraph, ChatMessage, VersionHistory, AgentPermission, Collaborator, CommentThread 等）提取到 `DocumentEditor/types.ts`
  - 将 L114-297 的工具函数（paragraphSnapshot, normalizeTagList, buildAgentReply, buildDefaultProjectComments, buildDefaultProjectVersionHistory 等）提取到 `DocumentEditor/utils.ts`
  - 将 L299-1796 中的状态管理逻辑按职责拆分为 5 个 custom hooks：
    - `hooks/useDocumentState.ts` — 文档解析、段落状态、Memory 回写
    - `hooks/useComments.ts` — 评论系统状态与逻辑
    - `hooks/useVersionHistory.ts` — 版本历史状态与逻辑
    - `hooks/useCollaborators.ts` — 协作者状态与逻辑
    - `hooks/useShareSettings.ts` — 分享设置状态与逻辑
  - _需求：0.1, 0.2, 0.3_

- [ ] 2. DocumentEditor 巨型文件拆分 — UI 组件提取
  - 将 L1797-1935 的 Header 区域 JSX 提取为 `components/EditorHeader.tsx`
  - 将 L1935-2690 的 Share Popover JSX（约 750 行）提取为 `components/SharePopover.tsx`
  - 将 L2691-2863 的 Toolbar 区域 JSX 提取为 `components/EditorToolbar.tsx`
  - 将 L2864-2906 的 Floating Selection Menu JSX 提取为 `components/SelectionMenu.tsx`
  - 将 L3182-3489 的 Comments Sidebar JSX 提取为 `components/CommentsSidebar.tsx`
  - 将 L3490-3602 的 Version History Sidebar JSX 提取为 `components/VersionHistorySidebar.tsx`
  - 将 L3603-3694 的 Collaborators Sidebar JSX 提取为 `components/CollaboratorsSidebar.tsx`
  - 将 L3695-4012 的 Modals JSX 拆分为 `components/DuplicateModal.tsx`、`components/LabelModal.tsx`、`components/AgentPermissionModal.tsx`、`components/PublishModal.tsx`
  - _需求：0.4_

- [ ] 3. DocumentEditor 巨型文件拆分 — 品类编辑器提取与主入口组装
  - 将 L2907-3181 的 Main Editor 区域按文档类型拆分为 5 个独立编辑器组件：
    - `components/editors/CanvasEditor.tsx` — Smart Canvas（BlockList 包装）
    - `components/editors/SheetEditor.tsx` — Smart Sheet（SheetView 包装）
    - `components/editors/PageEditor.tsx` — Page（iframe 预览 + 代码模式）
    - `components/editors/ChatLogView.tsx` — 聊天记录视图
    - `components/editors/ParagraphEditor.tsx` — 段落编辑器（Memory 文档等）
  - 创建 `DocumentEditor/index.tsx` 主入口文件（≤200 行），组装所有子组件，保持默认导出签名不变
  - 更新 `src/App.tsx` 中的导入路径（目录 index.tsx 自动解析，无需修改路径字符串）
  - 验证所有路由配置和外部引用正常工作
  - _需求：0.5, 0.6, 0.7, 0.8_

- [ ] 4. 数据模型重构 — 废弃 Workspace 概念，扩展 WorkspaceDoc 支持嵌套
  - 在 `src/data/mindxDemo.ts` 的 `WorkspaceDoc` 接口中确认 `children?: WorkspaceDoc[]` 和 `parentId?: string` 字段存在
  - 将 `workspaceId` 字段标记为可选（`workspaceId?: string`），因为不再区分 workspace
  - 废弃 `DemoWorkspace` 接口和 `initialWorkspaces` 数组的导出（标记 deprecated 或移除）
  - 在 `src/data/mindxDemoContext.tsx` 中：
    - 废弃 `WorkspaceType` 类型导出和 `currentWorkspaceType` 状态
    - 废弃 `switchWorkspace` 方法
    - 将 `documents` 初始化改为统一的文档树（合并 toB + toC）
    - 将 `activities` 初始化改为合并后的统一 Activity 数组
    - 将 `currentCrossReferences` 改为合并后的统一 cross-reference 数组（不再根据 workspace 类型切换）
  - 同步更新 `src/pages/dashboard/types.ts` 中的 `WorkspaceDoc` 接口
  - _需求：2.8, 2.9, 3.1, 3.2, 3.4, 3.5, 3.6_

- [ ] 5. Mockdata 合并 — 统一文档树与 Activity 数据
  - 在 `src/data/mindxDemo.ts`（或新建 `src/data/unifiedDocTree.ts`）中创建两个顶级 Smart Canvas 文档节点：
    - "进销存工作台"节点：`id: "ws-tob-root"`，`type: "Smart Canvas"`，`blocks` 包含图文并茂的工作台介绍内容（概述、核心能力、团队成员等），`children` 包含原 `initialDocuments` 的所有文档
    - "个人资产管理"节点：`id: "ws-toc-root"`，`type: "Smart Canvas"`，`blocks` 包含图文并茂的资产管理介绍内容（资产概览、投资策略、工具集等），`children` 包含原 `tocInitialDocuments` 的所有文档
  - 导出合并后的 `unifiedDocuments: WorkspaceDoc[]` 数组（包含上述两个顶级节点）
  - 合并 `initialActivities`（toB）和 `tocInitialActivities`（toC）为统一的 `unifiedActivities` 数组
  - 合并 `crossReferences`（toB）和 `tocCrossReferences`（toC）为统一的 `unifiedCrossReferences` 数组
  - 保留原有嵌套关系（如"重点客户拜访纪要"下嵌套"老王专属专区"），确保 toB 和 toC 各自子文档结构不变
  - 创建 Inbox 全局唯一 Smart Sheet 的 mockdata（字段覆盖：来源类型、标题、日期、标签、状态等）
  - _需求：4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

- [ ] 6. 侧边栏导航结构重构 — 新增"动态"Tab + 四层分组
  - 修改 `src/pages/v2/V2Layout.tsx`：
    - 在 Workspace 分组**上方**新增"动态"NavItem（图标用 `Activity`，路由 `/v2/activity`），作为主页入口
    - 将 Memory 分组下的 Inbox、Knowledge、Memory 三个子项拆分为三个独立的一级分组
    - 侧边栏分组顺序调整为：动态 → Workspace（目录树）→ Inbox → Knowledge → Memory
    - 移除 Integrations 分组（`integrationItems` 数组和对应 JSX）
  - 更新 `copy` 对象，新增 `activity: "动态"` / `"Activity"` 字段
  - 确保"动态"Tab 有明确的视觉区分（图标 + 高亮状态）
  - _需求：1.1, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

- [ ] 7. WorkspaceTree 重构 — 取消 Workspace 容器，改为统一文档树
  - 重写 `src/pages/v2/WorkspaceTree.tsx`：
    - 移除 `WorkspaceNode` 组件（不再有 workspace 容器节点）
    - 移除对 `WorkspaceType`、`currentWorkspaceType`、`switchWorkspace` 的依赖
    - 从 `useMindXDemo()` 获取统一的 `documents` 数组（即合并后的文档树）
    - 直接渲染顶级文档节点（"进销存工作台"和"个人资产管理"），它们本身就是 Smart Canvas 文档，点击后导航到 `/v2/doc/:docId`
    - 保留 `TreeNode` 递归渲染逻辑，根据 `doc.children` 展开子节点
    - 保留文档类型图标（Smart Canvas / Smart Sheet / Page）、展开/折叠动画、最多 4 层嵌套限制
  - 更新 URL 模式：文档路由从 `/v2/workspace/doc?doc=xxx` 改为 `/v2/doc/:docId`
  - 实现从 URL 中的 `docId` 自动展开祖先节点并高亮选中
  - 废弃 `src/components/WorkspaceSwitcher.tsx`（可删除或标记 deprecated）
  - _需求：2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.8, 2.9_

- [ ] 8. 路由体系重构 — 统一文档路由 + 默认"动态"主页
  - 修改 `src/App.tsx` 中 V2 路由配置：
    - 将 `<Route index>` 从 `Navigate to="/v2/workspace"` 改为 `Navigate to="/v2/activity"`（默认进入动态页）
    - 新增 `<Route path="activity" element={<V2ActivityPage />} />`
    - 新增 `<Route path="doc/:docId" element={<V2DocumentDetailPage />} />`（统一文档路由，不再区分 workspace）
    - 保留 `/v2/inbox`、`/v2/knowledge`、`/v2/memory` 路由
    - 为旧路由添加重定向：`/v2/workspace/activity` → `/v2/activity`，`/v2/workspace/doc` → `/v2/doc/:docId`，`/v2/workspace` → `/v2/activity`
  - 修改 `V2DocumentDetailPage.tsx`：从 `useSearchParams` 获取 `doc` 参数改为从 `useParams` 获取 `docId` 路径参数
  - 确保浏览器前进/后退导航正常工作
  - _需求：1.2, 5.1, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 9. "动态"主页改造 — 展示统一 Activity Feed
  - 修改 `src/pages/v2/V2ActivityPage.tsx`：
    - 从 `useMindXDemo()` 获取合并后的统一 `activities` 数组（包含原 toB + toC 全部动态）
    - 按时间倒序排列，展示全量动态记录
    - 在动态条目中点击文档名称时，导航到 `/v2/doc/:docId`（而非 `/v2/workspace/doc?doc=xxx`）
    - 保留按操作者（人类/Agent）筛选动态的能力
  - 确保"动态"页面作为默认主页正常渲染
  - _需求：5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 9.3_

- [ ] 10. Memory 首页精简 + 左右分栏布局验证
  - 修改 `src/pages/v2/V2MemoryHomePage.tsx`：
    - 移除 `memoryCards` 中的 "Knowledge" 卡片入口（因 Knowledge 已提升为一级 tab）
    - 保留"基础记忆"和"我的目标"卡片
    - 更新所有指向 `/v2/memory/knowledge` 的链接为 `/v2/knowledge`
  - 验证左右分栏布局：
    - 点击侧边栏文件节点 → 右侧渲染文档详情，侧边栏保持不变
    - 点击"进销存工作台"/"个人资产管理"顶级节点 → 右侧展示 Smart Canvas 工作台介绍
    - 点击"动态"Tab → 右侧展示统一 Activity Feed
    - 点击 Inbox / Knowledge / Memory → 右侧展示对应模块内容
    - 侧边栏选中状态与右侧内容保持同步
  - _需求：8.1, 8.2, 8.3, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
