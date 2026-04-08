# 实施计划：Dashboard.tsx 组件拆分重构

> 核心原则：纯重构，零功能变更。每个步骤完成后必须通过 `npx tsc --noEmit` 编译验证。

---

- [ ] 1. 创建 `src/pages/dashboard/` 目录并提取类型定义
  - 创建 `src/pages/dashboard/types.ts`，将 Dashboard.tsx 中的接口/类型定义移入：`WorkspaceDoc`、`AgentPermission`、`AbsenceChange`、`AbsenceSummaryData`、`Activity`、`DemoMode` 及其他相关类型
  - 在 Dashboard.tsx 中删除已移出的类型定义，改为从 `./dashboard/types` 导入
  - 检查并更新其他引用了这些类型的文件（如 `tocMindxDemo.ts`）的导入路径
  - 编译验证通过
  - _需求：1.1, 1.3, 1.4, 5.1_

- [ ] 2. 提取常量数据与工具函数
  - 创建 `src/pages/dashboard/constants.ts`，将模块级常量和工具函数移入：`initialWorkspaces`、`initialAgents`、`currentUser`、`activeWorkspaceIdGlobal`、`initialPermissions`、`initialDocuments`、`initialActivities`、`absenceLastVisitTime`、`agentColorMap`、`absenceSummaryData`、`normalizeDocType`、`isProfilePlaceholder`、`getDemoMode`、`DEMO_MODE_KEY` 等
  - 在 Dashboard.tsx 中删除已移出的常量，改为从 `./dashboard/constants` 导入
  - 确保 constants.ts 正确导入 types.ts 中的类型
  - 编译验证通过
  - _需求：1.2, 1.3, 5.1_

- [ ] 3. 提取独立子组件：PricingModal 和 NavItem
  - 创建 `src/pages/dashboard/PricingModal.tsx`，将 PricingModal 组件及其 Props 接口移入，补充必要的 import 语句
  - 创建 `src/pages/dashboard/NavItem.tsx`，将 NavItem 组件及其 Props 接口移入，补充必要的 import 语句
  - 在 Dashboard.tsx 中删除已移出的组件代码，改为从新文件导入
  - 编译验证通过
  - _需求：2.1, 2.2, 2.6_

- [ ] 4. 提取独立子组件：DocRow、ActivityFeed、AbsenceSummaryCard
  - 创建 `src/pages/dashboard/DocRow.tsx`，将 DocRow 组件及 `DocRowProps` 接口移入
  - 创建 `src/pages/dashboard/ActivityFeed.tsx`，将 ActivityFeed 组件及 `ActivityFeedProps` 接口移入
  - 创建 `src/pages/dashboard/AbsenceSummaryCard.tsx`，将 AbsenceSummaryCard 组件及 `AbsenceSummaryCardProps` 接口移入
  - 在 Dashboard.tsx 中删除已移出的组件代码，改为从新文件导入
  - 编译验证通过
  - _需求：2.3, 2.4, 2.5, 2.6_

- [ ] 5. 提取 Documents Tab 面板组件
  - 创建 `src/pages/dashboard/DocumentsTab.tsx`，将 `activeTab === "documents"` 分支的完整 JSX 及相关过滤/排序逻辑移入
  - 定义 `DocumentsTabProps` 接口，声明该 Tab 所需的所有 state 和 handler props
  - 在 Dashboard.tsx 中将 Documents Tab 的 JSX 替换为 `<DocumentsTab {...props} />`
  - 编译验证通过
  - _需求：3.1, 3.6, 3.7_

- [ ] 6. 提取 Activity Tab 面板组件
  - 创建 `src/pages/dashboard/ActivityTab.tsx`，将 `activeTab === "activity"` 分支的 JSX 移入
  - 定义 `ActivityTabProps` 接口
  - 在 Dashboard.tsx 中将 Activity Tab 的 JSX 替换为 `<ActivityTab {...props} />`
  - 编译验证通过
  - _需求：3.2, 3.6, 3.7_

- [ ] 7. 提取 Settings Tab 面板组件（含 Agents 逻辑）
  - 创建 `src/pages/dashboard/SettingsTab.tsx`，将 `activeTab === "settings"` 和 `activeTab === "agents"` 分支的完整 JSX 及相关逻辑移入（因 Agents 与 Settings 存在重叠）
  - 定义 `SettingsTabProps` 接口，包含 Agent 配置、集成管理、Profile 编辑、模型配置、Demo 模式切换等所需的全部 props
  - 在 Dashboard.tsx 中将 Settings/Agents Tab 的 JSX 替换为 `<SettingsTab {...props} />`
  - 编译验证通过
  - _需求：3.3, 3.6, 3.7_

- [ ] 8. 提取 Skills Tab 面板组件
  - 创建 `src/pages/dashboard/SkillsTab.tsx`，将 `activeTab === "skills"` 分支的完整 JSX 及 Skills 列表/详情面板逻辑移入
  - 定义 `SkillsTabProps` 接口
  - 在 Dashboard.tsx 中将 Skills Tab 的 JSX 替换为 `<SkillsTab {...props} />`
  - 编译验证通过
  - _需求：3.4, 3.6, 3.7_

- [ ] 9. 提取 Memory Tab 面板组件
  - 创建 `src/pages/dashboard/MemoryTab.tsx`，将 `activeTab === "memory"` 分支的完整 JSX 及原始数据管理、粘贴弹窗、提取日志、记忆节点等逻辑移入
  - 定义 `MemoryTabProps` 接口
  - 在 Dashboard.tsx 中将 Memory Tab 的 JSX 替换为 `<MemoryTab {...props} />`
  - 编译验证通过
  - _需求：3.5, 3.6, 3.7_

- [ ] 10. 最终集成验证与清理
  - 执行完整的 TypeScript 编译验证（`npx tsc --noEmit`），确保零错误
  - 确认 Dashboard.tsx 行数已降至 ~1500 行以内，各 Tab 组件文件不超过 ~1200 行
  - 验证所有功能正常：Workspace 切换（toB ↔ toC）、Demo 模式切换、路由导航、AI Chat 浮窗交互
  - 清理 Dashboard.tsx 中可能残留的未使用 import 语句
  - _需求：4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.2, 5.3, 5.4_
