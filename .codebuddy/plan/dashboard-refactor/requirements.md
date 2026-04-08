# 需求文档：Dashboard.tsx 组件拆分重构

## 引言

当前 `Dashboard.tsx` 文件有 **5614 行、250.6 KB**，包含 **50 个 useState**、**17 个顶层函数/接口定义**、**6 个 Tab 面板的完整渲染逻辑**，以及多个内联子组件。这导致了以下问题：

- **可维护性差**：任何修改都需要在超大文件中定位代码，容易引入回归
- **协作困难**：多人同时修改同一文件极易产生合并冲突
- **性能隐患**：任一 state 变化都会触发整个 Dashboard 的重渲染
- **可读性低**：业务逻辑、UI 渲染、数据定义混杂在一起

本次重构的核心原则是 **"只拆分，不改功能"**——将 Dashboard.tsx 拆分为多个职责单一的子模块，保持所有现有功能和 UI 表现完全不变。

### 当前文件结构分析

| 区域                         | 行范围    | 约行数 | 说明                                            |
| ---------------------------- | --------- | ------ | ----------------------------------------------- |
| 模块级常量/类型/数据         | 1-538     | ~538   | 接口定义、初始 Mock 数据、工具函数              |
| Dashboard 主函数 state/hooks | 539-1400  | ~860   | 50 个 useState + 大量 useEffect/useMemo/handler |
| JSX: 布局框架 + 侧边栏       | 1400-1877 | ~477   | 导航栏、Tab 切换、顶部操作区                    |
| JSX: Documents Tab           | 1877-2203 | ~326   | 文档列表、过滤、排序                            |
| JSX: Activity Tab            | 2203-2252 | ~49    | 活动流过滤 + ActivityFeed 组件调用              |
| JSX: Settings Tab            | 2252-3256 | ~1004  | Agent 配置、集成管理、Profile 编辑、模型配置    |
| JSX: Skills Tab              | 3256-3916 | ~660   | Skills 列表、详情面板                           |
| JSX: Memory Tab              | 3916-4735 | ~819   | 原始数据管理、提取日志、记忆节点                |
| PricingModal 组件            | 4735-4909 | ~174   | 定价弹窗（独立子组件）                          |
| NavItem 组件                 | 4909-4950 | ~41    | 侧边栏导航项（独立子组件）                      |
| DocRow 组件                  | 4950-5212 | ~262   | 文档行渲染（独立子组件）                        |
| ActivityFeed 组件            | 5212-5378 | ~166   | 活动流列表（独立子组件）                        |
| AbsenceSummaryCard 组件      | 5378-5614 | ~236   | 离开期间摘要卡片（独立子组件）                  |

---

## 需求

### 需求 1：提取模块级类型定义与常量数据

**用户故事：** 作为一名开发者，我希望 Dashboard 的类型定义和初始 Mock 数据被提取到独立文件中，以便减少主文件体积并提高数据的可复用性。

#### 验收标准

1. WHEN 重构完成 THEN 系统 SHALL 将以下接口/类型提取到 `src/pages/dashboard/types.ts`：
   - `WorkspaceDoc`、`AgentPermission`、`AbsenceChange`、`AbsenceSummaryData`、`Activity`、`DemoMode`
2. WHEN 重构完成 THEN 系统 SHALL 将以下常量数据提取到 `src/pages/dashboard/constants.ts`：
   - `initialWorkspaces`、`initialAgents`、`currentUser`、`activeWorkspaceIdGlobal`、`initialPermissions`、`initialDocuments`、`initialActivities`、`absenceLastVisitTime`、`agentColorMap`、`absenceSummaryData`、`normalizeDocType`、`isProfilePlaceholder`、`getDemoMode`、`DEMO_MODE_KEY`
3. WHEN Dashboard.tsx 引用这些类型和常量 THEN 系统 SHALL 通过 `import` 语句从新文件导入，功能保持不变
4. IF 其他文件（如 `tocMindxDemo.ts`）也引用了这些类型 THEN 导入路径 SHALL 同步更新

### 需求 2：提取独立子组件到单独文件

**用户故事：** 作为一名开发者，我希望 Dashboard 文件底部的独立子组件被提取到各自的文件中，以便每个组件可以独立维护和测试。

#### 验收标准

1. WHEN 重构完成 THEN 系统 SHALL 将 `PricingModal` 组件提取到 `src/pages/dashboard/PricingModal.tsx`
2. WHEN 重构完成 THEN 系统 SHALL 将 `NavItem` 组件提取到 `src/pages/dashboard/NavItem.tsx`
3. WHEN 重构完成 THEN 系统 SHALL 将 `DocRow` 组件（含 `DocRowProps` 接口）提取到 `src/pages/dashboard/DocRow.tsx`
4. WHEN 重构完成 THEN 系统 SHALL 将 `ActivityFeed` 组件（含 `ActivityFeedProps` 接口）提取到 `src/pages/dashboard/ActivityFeed.tsx`
5. WHEN 重构完成 THEN 系统 SHALL 将 `AbsenceSummaryCard` 组件（含 `AbsenceSummaryCardProps` 接口）提取到 `src/pages/dashboard/AbsenceSummaryCard.tsx`
6. WHEN 各子组件被提取后 THEN Dashboard.tsx SHALL 通过 `import` 引用这些组件，渲染结果与拆分前完全一致

### 需求 3：将各 Tab 面板提取为独立组件

**用户故事：** 作为一名开发者，我希望 Dashboard 的 6 个 Tab 面板各自成为独立组件，以便每个 Tab 的业务逻辑和 UI 可以独立演进，且减少不必要的重渲染。

#### 验收标准

1. WHEN 重构完成 THEN 系统 SHALL 将 Documents Tab 的渲染逻辑提取到 `src/pages/dashboard/DocumentsTab.tsx`，包含文档过滤、排序、场景筛选、AbsenceSummaryCard 调用、DocRow 列表渲染等
2. WHEN 重构完成 THEN 系统 SHALL 将 Activity Tab 的渲染逻辑提取到 `src/pages/dashboard/ActivityTab.tsx`，包含活动过滤和 ActivityFeed 调用
3. WHEN 重构完成 THEN 系统 SHALL 将 Settings Tab 的渲染逻辑提取到 `src/pages/dashboard/SettingsTab.tsx`，包含 Agent 配置、集成管理、Profile 编辑、模型配置、Demo 模式切换等
4. WHEN 重构完成 THEN 系统 SHALL 将 Skills Tab 的渲染逻辑提取到 `src/pages/dashboard/SkillsTab.tsx`，包含 Skills 列表和详情面板
5. WHEN 重构完成 THEN 系统 SHALL 将 Memory Tab 的渲染逻辑提取到 `src/pages/dashboard/MemoryTab.tsx`，包含原始数据管理、粘贴弹窗、提取日志、记忆节点等
6. WHEN 各 Tab 组件被提取后 THEN 每个 Tab 组件 SHALL 通过 props 接收所需的 state 和 handler，不直接访问 Dashboard 的内部状态
7. WHEN 各 Tab 组件被提取后 THEN Dashboard.tsx 的主函数 SHALL 仅负责：state 声明、Tab 切换逻辑、布局框架渲染、以及将 props 传递给各 Tab 组件

### 需求 4：保持功能完整性与 UI 一致性

**用户故事：** 作为一名用户，我希望重构后的 Dashboard 在功能和视觉上与重构前完全一致，以便我的使用体验不受任何影响。

#### 验收标准

1. WHEN 重构完成 THEN 所有 6 个 Tab（Documents / Activity / Agents / Settings / Skills / Memory）的渲染结果 SHALL 与重构前像素级一致
2. WHEN 重构完成 THEN Workspace 切换功能（toB ↔ toC）SHALL 正常工作，文档列表、活动流、摘要卡片均正确更新
3. WHEN 重构完成 THEN AI Chat 浮窗的所有交互（预设指令、副作用执行）SHALL 不受影响
4. WHEN 重构完成 THEN Demo 模式切换（New User / Existing User）SHALL 正常工作
5. WHEN 重构完成 THEN 路由导航（Dashboard ↔ DocumentEditor）SHALL 正常工作
6. WHEN 重构完成 THEN TypeScript 编译 SHALL 零错误通过

### 需求 5：文件组织结构

**用户故事：** 作为一名开发者，我希望拆分后的文件有清晰的目录结构，以便快速定位代码。

#### 验收标准

1. WHEN 重构完成 THEN 新文件 SHALL 组织在 `src/pages/dashboard/` 目录下，结构如下：
   ```
   src/pages/dashboard/
   ├── types.ts              # 类型定义
   ├── constants.ts          # 常量数据与工具函数
   ├── DocumentsTab.tsx      # 文档 Tab
   ├── ActivityTab.tsx        # 活动 Tab
   ├── SettingsTab.tsx        # 设置 Tab
   ├── SkillsTab.tsx          # Skills Tab
   ├── MemoryTab.tsx          # 记忆 Tab
   ├── PricingModal.tsx       # 定价弹窗
   ├── NavItem.tsx            # 导航项
   ├── DocRow.tsx             # 文档行
   ├── ActivityFeed.tsx       # 活动流
   └── AbsenceSummaryCard.tsx # 离开摘要卡片
   ```
2. WHEN 重构完成 THEN `src/pages/Dashboard.tsx` SHALL 保留为主入口文件，负责状态管理、布局框架和 Tab 组件编排
3. WHEN 重构完成 THEN Dashboard.tsx 的行数 SHALL 从 ~5600 行降低到 ~1500 行以内（主要包含 state 声明、hooks、布局框架和 props 传递）
4. WHEN 重构完成 THEN 每个提取出的 Tab 组件文件 SHALL 不超过 ~1200 行

---

## 技术约束与边界

- **纯重构，零功能变更**：本次重构不引入任何新功能、不修改任何业务逻辑、不改变任何 UI 样式。唯一的变化是文件结构
- **Props 传递策略**：Tab 组件通过 props 接收所需的 state 和 handler。暂不引入新的 Context 或状态管理库（如 Zustand），以保持最小变更原则
- **渐进式拆分**：先提取独立子组件（风险最低），再提取类型/常量，最后提取 Tab 面板（风险最高）。每一步都应确保编译通过
- **导入路径更新**：如果其他文件引用了 Dashboard.tsx 中导出的类型或组件，需同步更新导入路径
- **不拆分 state**：Dashboard 主函数中的 50 个 useState 暂时保留在主文件中，通过 props 向下传递。后续可考虑引入 useReducer 或 Context 进一步优化，但不在本次范围内
- **Agents Tab 特殊处理**：Agents Tab 的渲染逻辑与 Settings Tab 中的 Agent Configuration 部分有重叠（当前 `activeTab === "agents"` 实际上是 Settings Tab 的一部分），拆分时需注意保持一致性。如果 Agents 没有独立的 Tab 面板，则不需要单独提取
- **编译验证**：每个拆分步骤完成后都必须通过 `npx tsc --noEmit` 验证
