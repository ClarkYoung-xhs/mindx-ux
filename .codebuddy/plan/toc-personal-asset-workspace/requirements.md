# 需求文档：toC 个人资产管理 Workspace Mock 数据与场景切换

## 引言

当前 mindX Demo 已实现一套面向 toB「进销存」场景的完整 Mock 数据（4 张 Smart Sheet + 3 篇 Smart Canvas + 交叉引用 + AI Chat 预设指令）。为了更全面地展示 mindX 作为「个人数字家族办公室 / Life OS」的应用能力，需要补充一套面向 toC 个人资产管理维度的 Mock 数据，并在应用界面中实现两套数据集的切换功能。

toC 数据集围绕一个高净值个人用户的全球资产配置场景，涵盖：二级市场投资监控、Crypto 链上生息、家族大额资产规划、高价值信息订阅等维度。文档层面则包含投资哲学纪律、AI 赛道观察逻辑、深度研究剪藏库等决策上下文。整套数据呈现底层的「网状数据拓扑」与「API First 执行逻辑」。

本次迭代包含三个核心部分：

1. **toC Mock 数据生成**：5 张 Smart Sheet + 3 篇 Smart Canvas + 交叉引用，沿用现有 `WorkspaceDoc` 类型结构
2. **Workspace 切换功能**：通过 MindX Logo 按钮下拉列表实现 toB / toC 两套数据集的切换
3. **toC AI Chat 预设指令**：为 toC 场景配置专属的 AI Chat 预设指令和 Mock 回复

---

## 需求

### 需求 1：toC 结构化数据 — 智能表格矩阵（5 张 Smart Sheet）

**用户故事：** 作为一名 Demo 演示者，我希望 toC workspace 中包含一套完整的个人资产管理表格数据，以便展示 mindX 在 C 端高端个人场景下的结构化数据管理能力。

#### 验收标准

**表 1：全球资产配置总表 (Global_Asset_NAV)**

1. WHEN toC workspace 加载 THEN 系统 SHALL 显示一张 `sheet-asset-nav` 表格，包含以下列：资产类别 (Equity/Crypto/Cash/Real Estate)、持有量、成本均价、实时市价、当前估值 (NAV)、动态权重占比
2. WHEN 表格渲染 THEN 系统 SHALL 包含至少 5 行数据，覆盖股票、加密货币、现金、不动产、基金等资产类别
3. WHEN 行展开 THEN 每行 SHALL 包含 `expandBlocks`，展示该资产类别的详细持仓明细和配置逻辑说明

**表 2：二级市场动态监控池 (Live_Watchlist_DB)**

4. WHEN toC workspace 加载 THEN 系统 SHALL 显示一张 `sheet-watchlist` 表格，包含以下列：标的代码（如 @NASDAQ:NVDA）、分类、实时市价、建仓目标价、溢价率（公式计算）、关联策略（双链至文档）
5. WHEN 表格渲染 THEN 系统 SHALL 包含至少 4 行数据，覆盖科技股、加密货币、ETF 等标的
6. WHEN 关联策略列渲染 THEN 系统 SHALL 使用 `relation` 类型列，双链至对应的 Smart Canvas 文档

**表 3：Crypto 链上生息与质押账簿 (DeFi_Yield_DB)**

7. WHEN toC workspace 加载 THEN 系统 SHALL 显示一张 `sheet-defi-yield` 表格，包含以下列：质押协议（如 Lido stETH / Aave USDC）、投入本金、实时 APY、合约风险评级
8. WHEN 表格渲染 THEN 系统 SHALL 包含至少 3 行数据，覆盖不同 DeFi 协议
9. WHEN 行展开 THEN 每行 SHALL 包含 `expandBlocks`，展示协议详情、风险评估和历史收益曲线描述

**表 4：家族大额资产与流动性规划表 (Liquidity_DB)**

10. WHEN toC workspace 加载 THEN 系统 SHALL 显示一张 `sheet-liquidity` 表格，包含以下列：资产名称（如「6 岁阶段教育信托基金预留」/「Porsche Cayenne 折旧预估」）、目标金额、资金到位状态、触发条件
11. WHEN 表格渲染 THEN 系统 SHALL 包含至少 4 行数据，覆盖教育基金、车辆折旧、旅行基金、应急储备等场景
12. WHEN 资金到位状态列渲染 THEN 系统 SHALL 使用 `status` 类型列，包含"已到位"、"进行中"、"待启动"等状态选项

**表 5：高价值信息订阅账簿 (Alpha_Subscription)**

13. WHEN toC workspace 加载 THEN 系统 SHALL 显示一张 `sheet-alpha-sub` 表格，包含以下列：服务商（如 Bloomberg / Messari）、续费周期、下次扣费日、核心价值标签
14. WHEN 表格渲染 THEN 系统 SHALL 包含至少 4 行数据，覆盖金融终端、Crypto 研究、宏观分析等信息源

---

### 需求 2：toC 非结构化决策上下文 — 智能文档矩阵（3 篇 Smart Canvas）

**用户故事：** 作为一名 Demo 演示者，我希望 toC workspace 中包含多篇决策上下文文档，以便展示 mindX 在个人投资决策场景下的知识管理和交叉引用能力。

#### 验收标准

**文档 1：投资哲学与退出策略 (Investment_Thesis)**

1. WHEN toC workspace 加载 THEN 系统 SHALL 包含一篇 `canvas-investment-thesis` 文档，记录底层交易纪律
2. WHEN 文档渲染 THEN 文档内容 SHALL 包含：投资哲学核心原则、仓位管理纪律、退出策略规则（如"当核心资产溢价率超过 30% 时，触发 15% 的流动性锁定，转入教育信托基金"）
3. WHEN 文档中引用表格数据 THEN 系统 SHALL 使用 `ref` 注解双链至 `sheet-asset-nav`、`sheet-liquidity` 等表格的具体行记录
4. WHEN 文档中嵌入表格视图 THEN 系统 SHALL 使用 `EmbedSheet` Block 嵌入相关表格的筛选视图

**文档 2：AI 赛道二级市场观察逻辑 (AI_Sector_Observation)**

5. WHEN toC workspace 加载 THEN 系统 SHALL 包含一篇 `canvas-ai-sector` 文档，记录 AI 赛道的投资观察逻辑
6. WHEN 文档渲染 THEN 文档内容 SHALL 包含：赛道分析框架、重点标的监控逻辑（如"严密监控 @NASDAQ:NVDA，当现价击穿目标价时，停止向 @Lido stETH 增加质押，抽出 20% 流动性准备接针"）
7. WHEN 文档中引用监控池标的 THEN 系统 SHALL 使用 `ref` 注解双链至 `sheet-watchlist` 表格的具体行记录
8. WHEN 文档中引用 DeFi 协议 THEN 系统 SHALL 使用 `ref` 注解双链至 `sheet-defi-yield` 表格的具体行记录

**文档 3：深度研究剪藏库 (Alpha_Clipper_Vault)**

9. WHEN toC workspace 加载 THEN 系统 SHALL 包含一篇 `canvas-alpha-clipper` 文档，模拟通过网页剪藏摄入的研报内容
10. WHEN 文档渲染 THEN 文档内容 SHALL 包含：剪藏的研报摘要（如 A16Z 宏观分析、高盛降息路径预测）、AI 自动提取的关键实体标注
11. WHEN 文档中引用资产数据 THEN 系统 SHALL 使用 `ref` 注解双链至 `sheet-asset-nav`、`sheet-watchlist` 等表格，体现"剪藏入库时自动建立底层双向链接"的能力

---

### 需求 3：toC 交叉引用网络

**用户故事：** 作为一名 Demo 演示者，我希望 toC workspace 中的文档和表格之间建立丰富的交叉引用关系，以便展示 mindX 的网状数据拓扑能力。

#### 验收标准

1. WHEN toC workspace 加载 THEN 系统 SHALL 在 `crossReferences` 数据中包含 toC 场景的所有交叉引用记录
2. WHEN 交叉引用建立 THEN 引用关系 SHALL 覆盖以下维度：
   - 2.1 文档 → 表格行：投资哲学文档引用资产总表中的具体资产行
   - 2.2 文档 → 表格行：AI 赛道文档引用监控池中的具体标的行
   - 2.3 文档 → 表格行：AI 赛道文档引用 DeFi 账簿中的具体协议行
   - 2.4 文档 → 文档：剪藏库文档引用投资哲学文档
   - 2.5 文档 → 表格嵌入：文档中嵌入表格的筛选视图
3. WHEN 用户在文档中点击 `@引用` THEN 系统 SHALL 复用已有的行展开浮窗（RowExpandModal）或文档跳转交互
4. WHEN toB workspace 激活 THEN 系统 SHALL 仅加载 toB 的交叉引用数据；WHEN toC workspace 激活 THEN 系统 SHALL 仅加载 toC 的交叉引用数据

---

### 需求 4：Workspace 切换功能

**用户故事：** 作为一名 Demo 演示者，我希望通过 MindX Logo 按钮的下拉菜单在 toB 和 toC 两套数据集之间切换，以便在同一个演示中展示不同场景的应用能力。

#### 验收标准

1. WHEN 用户点击 Dashboard 侧边栏顶部的 MindX Logo 按钮 THEN 系统 SHALL 弹出一个下拉菜单，显示两个 workspace 选项：
   - 1.1 「进销存工作台」（toB，默认选中）
   - 1.2 「个人资产管理」（toC）
2. WHEN 用户选择不同的 workspace THEN 系统 SHALL 完整切换当前加载的数据集，包括：
   - 2.1 文档列表（`documents` state）切换为对应 workspace 的 `WorkspaceDoc[]`
   - 2.2 活动流（`activities` state）切换为对应 workspace 的 `Activity[]`
   - 2.3 交叉引用数据切换为对应 workspace 的 `CrossReference[]`
   - 2.4 AI Chat 预设指令切换为对应 workspace 的 `ChatPreset[]`
3. WHEN workspace 切换完成 THEN 系统 SHALL 重置当前页面状态（如关闭已打开的文档编辑器、清空 AI Chat 对话历史）
4. WHEN 当前选中的 workspace 在下拉菜单中显示 THEN 系统 SHALL 以视觉高亮（如勾选标记或背景色）标识当前激活的 workspace
5. WHEN 下拉菜单弹出 THEN 系统 SHALL 在菜单外部点击时自动关闭下拉菜单
6. IF 用户刷新页面 THEN 系统 SHALL 恢复到默认的 toB workspace（不做持久化）

---

### 需求 5：toC AI Chat 预设指令

**用户故事：** 作为一名 Demo 演示者，我希望在 toC workspace 下 AI Chat 浮窗显示专属的预设指令，以便展示 Agent 在个人资产管理场景下的智能交互能力。

#### 验收标准

**场景 1：API 驱动的自动化推演 — NVDA 击穿目标价预警**

1. WHEN toC workspace 激活且用户在 AI Chat 中发送预设指令"NVDA 盘前大跌，触发目标价预警" THEN 系统 SHALL 显示结构化 Mock 回复：
   - 1.1 回复内容包含："预警触发：NVDA 现价击穿 $850。依据【AI 赛道观察逻辑】，已为您测算：可从 Aave 解除 50,000 USDC 质押。是否立即生成草稿调仓单？"
   - 1.2 回复中包含指向 `canvas-ai-sector` 文档和 `sheet-defi-yield` 表格的可点击链接
2. WHEN 该指令执行 THEN 系统 SHALL 不产生数据变更副作用（仅展示 Agent 的推理链路）

**场景 2：剪藏信号驱动的智能决策 — 宏观报告入库**

3. WHEN toC workspace 激活且用户在 AI Chat 中发送预设指令"高盛降息路径报告已入库，分析影响" THEN 系统 SHALL 显示结构化 Mock 回复：
   - 3.1 回复内容包含："检测到高价值宏观报告入库。结合您的【投资哲学】风险偏好，您当前现金资产比例偏高（25%）。是否需要模拟将 10% 现金转入权益类资产的收益变化？"
   - 3.2 回复中包含指向 `canvas-alpha-clipper` 文档和 `canvas-investment-thesis` 文档的可点击链接

**场景 3：CLI 级别的极简资产操控 — 调仓指令**

4. WHEN toC workspace 激活且用户在 AI Chat 中发送预设指令"将 Crypto 仓位的 20% 调仓为 USDC，更新总表" THEN 系统 SHALL 显示 Mock 回复：
   - 4.1 回复内容包含："调仓完毕。稳健资产占比已提升，下一波动周期预警已设置。"
   - 4.2 回复中包含指向 `sheet-asset-nav` 表格的可点击链接
5. WHEN 该指令执行 THEN 系统 SHALL 产生副作用：更新 `sheet-asset-nav` 表格中 Crypto 行的持有量和估值数据（模拟调仓效果）

---

### 需求 6：toC 活动流数据

**用户故事：** 作为一名 Demo 演示者，我希望 toC workspace 包含对应的活动流数据，以便在 Dashboard 的 Activity Feed 中展示 Agent 在个人资产管理场景下的操作记录。

#### 验收标准

1. WHEN toC workspace 激活 THEN 系统 SHALL 在 Activity Feed 中显示 toC 场景的活动记录
2. WHEN 活动流渲染 THEN 活动记录 SHALL 包含至少 8 条记录，覆盖以下类型：
   - 2.1 Agent 自动更新资产总表的市价数据
   - 2.2 Agent 生成 AI 赛道观察文档
   - 2.3 用户剪藏研报到剪藏库
   - 2.4 Agent 检测到 DeFi 协议 APY 变化并更新账簿
   - 2.5 Agent 根据投资纪律触发流动性预警
   - 2.6 用户更新投资哲学文档
   - 2.7 Agent 自动续费信息订阅并记录到账簿
   - 2.8 Agent 生成月度资产配置报告

---

## 技术约束与边界

- **数据结构一致性**：toC 所有 Mock 数据必须严格沿用现有的 `WorkspaceDoc`、`SheetData`、`SheetColumn`、`SheetRow`、`Block`、`CrossReference` 等类型定义，确保现有组件（BlockList、SheetView、RowExpandModal、EmbedSheetBlock 等）能无缝渲染
- **数据隔离**：toB 和 toC 的数据集完全独立，切换时整体替换，不存在跨 workspace 的数据引用
- **无持久化**：workspace 切换状态不做持久化，刷新页面后恢复到默认的 toB workspace
- **Context 管理**：workspace 切换通过 `MindXDemoContext` 的 state 管理实现，切换时批量更新 `documents`、`activities` 等 state
- **AI Chat 联动**：workspace 切换时 AI Chat 的预设指令（`chatPresets`）需同步切换，已有对话历史需清空
- **静态数据映射**：`allSheets` 和 `allCanvasBlocks` 等静态查找表需同步包含 toC 的数据映射，确保 `DocumentEditor` 和 `EmbedSheetBlock` 能正确解析 toC 的文档和表格
- **样式一致性**：workspace 切换下拉菜单使用项目现有的 inline style 风格，与 Dashboard 侧边栏视觉风格保持一致
- **ID 命名规范**：toC 的所有 ID 使用 `toc-` 前缀（如 `toc-sheet-asset-nav`、`toc-canvas-investment-thesis`），避免与 toB 数据 ID 冲突
- **toB 数据不变**：本次迭代不修改任何现有的 toB Mock 数据，仅新增 toC 数据和切换逻辑
