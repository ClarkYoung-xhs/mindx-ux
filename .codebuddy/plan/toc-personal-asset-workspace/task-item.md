# 实施计划

- [ ] 1. 创建 toC 表格 Mock 数据文件 `src/data/tocSheetMockData.ts`
  - 新建文件，沿用 `sheetMockData.ts` 的数据结构模式（`SheetData`、`SheetColumn`、`SheetRow`、`expandBlocks`）
  - 实现 5 张 Smart Sheet 的完整数据：
    - `assetNavSheet`（id: `toc-sheet-asset-nav`）：全球资产配置总表，包含 Equity/Crypto/Cash/Real Estate/Fund 等至少 5 行，列包含资产类别、持有量、成本均价、实时市价、NAV、权重占比，每行含 `expandBlocks` 展示持仓明细
    - `watchlistSheet`（id: `toc-sheet-watchlist`）：二级市场动态监控池，包含 NVDA/BTC/QQQ/AAPL 等至少 4 行，列包含标的代码、分类、实时市价、建仓目标价、溢价率、关联策略（`relation` 类型列，双链至 Canvas 文档）
    - `defiYieldSheet`（id: `toc-sheet-defi-yield`）：Crypto 链上生息账簿，包含 Lido stETH/Aave USDC/Compound DAI 等至少 3 行，列包含质押协议、投入本金、APY、风险评级（`status` 类型列），每行含 `expandBlocks`
    - `liquiditySheet`（id: `toc-sheet-liquidity`）：家族大额资产规划表，包含教育信托基金/Porsche Cayenne 折旧/旅行基金/应急储备等至少 4 行，列包含资产名称、目标金额、到位状态（`status` 类型列）、触发条件
    - `alphaSubSheet`（id: `toc-sheet-alpha-sub`）：高价值信息订阅账簿，包含 Bloomberg/Messari/The Block/MacroVoices 等至少 4 行，列包含服务商、续费周期、下次扣费日（`date` 类型列）、核心价值标签
  - 导出 `tocAllSheets: Record<string, SheetData>` 查找表，包含以上 5 张表的映射
  - _需求：1.1–1.14_

- [ ] 2. 创建 toC 文档 Mock 数据文件 `src/data/tocCanvasMockData.ts`
  - 新建文件，沿用 `canvasMockData.ts` 的 Block 数据结构模式（`Block[]`，使用 `BlockType` 枚举）
  - 实现 3 篇 Smart Canvas 的完整 Block 数据：
    - `investmentThesisBlocks`（对应 `toc-canvas-investment-thesis`）：投资哲学与退出策略文档，包含投资哲学核心原则、仓位管理纪律、退出策略规则，使用 `ref` 注解双链至 `toc-sheet-asset-nav` 和 `toc-sheet-liquidity` 的具体行，包含 `EmbedSheet` Block 嵌入资产总表视图
    - `aiSectorBlocks`（对应 `toc-canvas-ai-sector`）：AI 赛道观察逻辑文档，包含赛道分析框架、重点标的监控逻辑，使用 `ref` 注解双链至 `toc-sheet-watchlist` 和 `toc-sheet-defi-yield` 的具体行
    - `alphaClipperBlocks`（对应 `toc-canvas-alpha-clipper`）：深度研究剪藏库文档，包含 A16Z 宏观分析、高盛降息路径预测等研报摘要，使用 `ref` 注解双链至 `toc-sheet-asset-nav` 和 `toc-sheet-watchlist`
  - 导出 `tocAllCanvasBlocks: Record<string, Block[]>` 查找表
  - _需求：2.1–2.11_

- [ ] 3. 创建 toC 交叉引用数据文件 `src/data/tocCrossReferences.ts`
  - 新建文件，沿用 `crossReferences.ts` 的 `CrossReference` 类型结构
  - 实现 toC 场景的所有交叉引用记录，覆盖：
    - 投资哲学文档 → 资产总表行、流动性规划表行
    - AI 赛道文档 → 监控池行、DeFi 账簿行
    - 剪藏库文档 → 资产总表行、监控池行
    - 剪藏库文档 → 投资哲学文档（文档间引用）
    - 文档嵌入表格视图的引用记录
    - 所有反向链接（表格/文档 → 文档）
  - 导出 `tocCrossReferences: CrossReference[]`
  - _需求：3.1–3.4_

- [ ] 4. 创建 toC AI Chat 预设指令和活动流数据文件 `src/data/tocAiChatMockData.ts`
  - 新建文件，沿用 `aiChatMockData.ts` 的 `ChatPreset` 和 `ReplySegment` 类型
  - 实现 3 条 toC 预设指令：
    - 场景 1（NVDA 预警）：`chipLabel: "NVDA 击穿目标价预警"`，mockReply 包含结构化推理链路和指向 `toc-canvas-ai-sector` / `toc-sheet-defi-yield` 的链接，无 sideEffect
    - 场景 2（宏观报告入库）：`chipLabel: "高盛降息报告入库分析"`，mockReply 包含资产配置建议和指向 `toc-canvas-alpha-clipper` / `toc-canvas-investment-thesis` 的链接，无 sideEffect
    - 场景 3（调仓指令）：`chipLabel: "Crypto 调仓为 USDC"`，mockReply 包含调仓确认和指向 `toc-sheet-asset-nav` 的链接，sideEffect 为更新资产总表中 Crypto 行数据
  - 导出 `tocChatPresets: ChatPreset[]`、`tocDefaultReply`、`matchTocPreset()` 函数
  - _需求：5.1–5.5_

- [ ] 5. 创建 toC 初始文档和活动流数据，整合到 `src/data/tocMindxDemo.ts`
  - 新建文件，导入 toC 的 sheet/canvas/chat 数据
  - 导出 `tocInitialDocuments: WorkspaceDoc[]`，包含 5 张 Smart Sheet + 3 篇 Smart Canvas 的文档元信息（id、name、type、labels、sheetData/blocks 等），所有 workspaceId 设为 `"w-toc"`
  - 导出 `tocInitialActivities: Activity[]`，包含至少 8 条活动记录，覆盖需求 6 中定义的所有活动类型（Agent 更新市价、生成文档、剪藏研报、APY 变化、流动性预警、用户更新文档、自动续费、月度报告）
  - _需求：1.1–1.14、2.1–2.11、6.1–6.2_

- [ ] 6. 将 toC 静态数据注册到全局查找表
  - 在 `src/data/sheetMockData.ts` 的 `allSheets` 中合并 `tocAllSheets` 的所有条目（或改为在 DocumentEditor 中动态合并）
  - 在 `src/data/canvasMockData.ts` 的 `allCanvasBlocks` 中合并 `tocAllCanvasBlocks` 的所有条目
  - 确保 `DocumentEditor` 和 `EmbedSheetBlock` 组件能通过 `allSheets[toc-sheet-xxx]` 和 `allCanvasBlocks[toc-canvas-xxx]` 正确解析 toC 数据
  - _需求：1.1–1.14、2.1–2.11（技术约束：静态数据映射）_

- [ ] 7. 扩展 `MindXDemoContext` 支持 workspace 切换
  - 在 `mindxDemoContext.tsx` 的 `MindXDemoContextValue` 接口中新增：`currentWorkspaceType: "toB" | "toC"` 和 `switchWorkspace: (type: "toB" | "toC") => void`
  - 实现 `switchWorkspace` 方法：根据传入的 type 批量更新 `documents`（切换为 `initialDocuments` 或 `tocInitialDocuments`）、`activities`（切换为 `initialActivities` 或 `tocInitialActivities`）
  - 默认 `currentWorkspaceType` 为 `"toB"`
  - 切换时重置页面状态（关闭文档编辑器、清空 AI Chat 对话）
  - _需求：4.2、4.3、4.6_

- [ ] 8. 实现 MindX Logo 下拉菜单的 Workspace 切换 UI
  - 在 Dashboard 侧边栏的 MindX Logo 按钮区域（`<Link to="/">` 处），改造为可点击弹出下拉菜单的交互
  - 下拉菜单包含两个选项：「进销存工作台」（toB）和「个人资产管理」（toC），当前激活项显示勾选标记
  - 点击选项调用 `switchWorkspace(type)` 切换数据集
  - 菜单外部点击自动关闭
  - 同步修改 V2Layout 中的 MindX Logo 按钮，保持一致的切换交互
  - 使用项目现有的 inline style 风格，与侧边栏视觉风格一致
  - _需求：4.1、4.4、4.5_

- [ ] 9. 改造 AIChatFloat 组件支持 workspace 感知
  - 从 `useMindXDemo()` 获取 `currentWorkspaceType`
  - 根据 `currentWorkspaceType` 动态切换使用的 `chatPresets`（toB 用 `chatPresets`，toC 用 `tocChatPresets`）和 `matchPreset` / `matchTocPreset` 函数
  - 根据 `currentWorkspaceType` 动态切换 `defaultReply`（toB 用 `defaultReply`，toC 用 `tocDefaultReply`）
  - 实现 toC 场景 3 的 sideEffect：更新 `toc-sheet-asset-nav` 表格中 Crypto 行的持有量和估值数据
  - 当 `currentWorkspaceType` 变化时，自动清空对话历史和已执行副作用记录
  - _需求：5.1–5.5、4.3_

- [ ] 10. 编译验证与集成测试
  - 运行 `npx tsc --noEmit` 确保无 TypeScript 类型错误
  - 验证 toB workspace 下所有现有功能不受影响（文档列表、表格渲染、AI Chat 预设指令、交叉引用）
  - 验证 toC workspace 下：5 张表格正确渲染、3 篇文档正确渲染、交叉引用 @引用可点击、AI Chat 3 条预设指令正常工作
  - 验证 workspace 切换：Logo 下拉菜单正常弹出/关闭、切换后数据完整替换、刷新页面恢复默认 toB
  - _需求：1.1–6.2（全量验收）_
