# 实施计划

- [ ] 1. 创建 AI Chat Mock 数据配置文件 `src/data/aiChatMockData.ts`
  - 定义 `ChatPreset` 接口：包含 `id`、`chipLabel`（快捷按钮文本）、`fullCommand`（完整指令文本）、`matchKeywords`（匹配关键词数组）、`mockReply`（Mock 回复，支持纯文本和带链接的富文本片段）、`sideEffect`（可选的副作用动作类型标识，如 `"createAnalysisReport"` / `"addCrmRow"`）
  - 预设两条指令：
    - 指令 1：`chipLabel: "分析库存与供应链风险"`，`fullCommand: "分析当前库存状况和供应链风险"`，`mockReply` 包含报告链接（路由到 `/document?id=canvas-analysis-report&type=smartcanvas&from=v2-workspace`），`sideEffect: "createAnalysisReport"`
    - 指令 2：`chipLabel: "新增客户：腾讯集团 shrekyan"`，`fullCommand` 为完整的新增客户指令文本（含深圳南山区腾讯总部、企业定制礼品采购、年采购预算 500 万、Shrek Yan、shrekyan@tencent.com），`mockReply` 包含 CRM 表格链接（路由到 `/document?id=sheet-crm&type=smartsheet&from=v2-workspace`），`sideEffect: "addCrmRow"`
  - 定义 `defaultReply` 兜底回复文本："这个功能正在开发中，敬请期待 🚀"
  - _需求：4.1、4.2_

- [ ] 2. 创建分析报告文档 Mock 数据 `src/data/analysisReportBlocks.ts`
  - 新建文件，导出 `analysisReportBlocks: Block[]`，文档标题为"库存与供应链分析报告-20250410"
  - 报告内容包含 5 个章节：报告概要、库存状况分析、供应链风险评估、客户需求影响分析、业务建议与行动项
  - 库存分析章节引用 `sheet-inventory` 中的 SKU 行记录（`@经典款陶瓷马克杯` → `row-mug01`、`@简约白瓷餐盘` → `row-plate01`、`@双层隔热玻璃杯` → `row-cup01` 等），使用 `[["ref", "sheet-inventory", "sheet", "row-xxx"]]` 格式
  - 供应链风险章节引用 `sheet-suppliers` 中的供应商行记录（`@景德镇宏图陶瓷` → `row-jdz`、`@河北晶透玻璃` → `row-hb`）
  - 客户需求章节引用 `sheet-crm` 中的客户行记录（`@华中区-星巴克加盟商-老王` → `row-laowang`）
  - 引用已有 Canvas 文档（`@Q2 华东区供应链异常预警报告` → `canvas-supply-alert`、`@重点客户 Q1 拜访与授信调整纪要` → `canvas-client-visit`）
  - 在 `canvasMockData.ts` 的 `allCanvasBlocks` 中注册 `"canvas-analysis-report": analysisReportBlocks`
  - _需求：2.4、2.5、2.7、2.8_

- [ ] 3. 创建新增客户行 Mock 数据（腾讯集团-shrekyan）
  - 在 `src/data/aiChatMockData.ts` 中（或单独文件）导出 `shrekyanRow` 对象，类型为 `SheetRow`，`id: "row-shrekyan"`
  - 行数据字段：`crm-col-name: "腾讯集团-shrekyan"`、`crm-col-rating: "A 级"`、`crm-col-terms: "月结 45 天，基准价 95 折"`、`crm-col-complaint: "无异常"`、`crm-col-context` 关联到分析报告文档（`targetId: "canvas-analysis-report"`, `targetType: "canvas"`, `displayText: "@库存与供应链分析报告"`）
  - 行展开内容 `expandBlocks` 包含：客户背景介绍（腾讯集团企业采购部门，Shrek Yan 为采购负责人，深圳南山区腾讯总部）、采购需求描述（企业定制礼品、员工福利、客户赠品，年预算 500 万）、初始合作计划（试采阶段 SKU 推荐、报价方案）
  - _需求：3.2、3.3_

- [ ] 4. 在 `crossReferences.ts` 中补充分析报告文档的双向链接记录
  - 新增分析报告 → 各表格行记录的 CrossReference（`canvas-analysis-report` → `sheet-inventory`/`sheet-suppliers`/`sheet-crm`/`sheet-orders`）
  - 新增分析报告 → 已有 Canvas 文档的 CrossReference（`canvas-analysis-report` → `canvas-supply-alert`、`canvas-analysis-report` → `canvas-client-visit`）
  - 新增已有 Canvas 文档 → 分析报告的反向 CrossReference
  - _需求：2.6_

- [ ] 5. 扩展 `MindXDemoContext` 支持动态添加文档和表格行
  - 在 `mindxDemoContext.tsx` 的 `MindXDemoContextValue` 接口中新增两个便捷方法：`addDocument: (doc: WorkspaceDoc) => void` 和 `addSheetRow: (sheetId: string, row: SheetRow) => void`
  - `addDocument` 实现：调用 `setDocuments(prev => [doc, ...prev])`，将新文档插入列表头部
  - `addSheetRow` 实现：遍历 `documents` 找到对应 `sheetId` 的文档，将新行追加到其 `sheetData.rows` 中，调用 `setDocuments` 更新
  - 这两个方法将被 AI Chat 组件在执行副作用动作时调用
  - _需求：4.3、4.4_

- [ ] 6. 创建 AI Chat 浮窗组件 `src/components/AIChatFloat/AIChatFloat.tsx`
  - 实现右下角悬浮按钮（圆形，带 AI 图标，z-index 设为 900，低于 Modal 的 1000）
  - 点击按钮展开/收起聊天窗口（宽 380px，高 520px，右下角定位，带圆角和阴影）
  - 聊天窗口包含：顶部标题栏（"AI Assistant" + 关闭按钮 + 清空按钮）、消息列表区域（可滚动）、预设指令 chips 区域、底部输入框 + 发送按钮
  - 消息列表支持用户消息（右对齐，蓝色背景）和 AI 回复（左对齐，灰色背景）
  - 预设指令 chips 从 `aiChatMockData.ts` 读取，点击后自动发送对应 `fullCommand`
  - 发送消息后，先显示用户消息，然后延迟 800ms 显示"正在思考..."动画，再延迟 1200ms 显示 Mock 回复
  - 消息匹配逻辑：遍历 `ChatPreset.matchKeywords`，若用户输入包含任一关键词则匹配成功；否则显示 `defaultReply`
  - 使用项目现有的 inline style 风格，不引入外部 UI 库
  - _需求：1.1、1.2、1.3、1.4、1.5、1.7、1.8、1.9_

- [ ] 7. 实现 AI Chat 中的链接渲染和副作用执行
  - Mock 回复中的链接片段渲染为蓝色可点击文本，点击后调用 `navigate()` 跳转到对应路由
  - 副作用执行逻辑：当匹配到的 `ChatPreset` 包含 `sideEffect` 时，在显示回复的同时执行对应操作：
    - `"createAnalysisReport"`：调用 `addDocument()` 将分析报告文档（`id: "canvas-analysis-report"`，`type: "Smart Canvas"`，`blocks: analysisReportBlocks`）添加到文档列表
    - `"addCrmRow"`：调用 `addSheetRow("sheet-crm", shrekyanRow)` 将新客户行添加到 CRM 表格
  - 需要通过 `useMindXDemo()` 获取 context 方法，通过 `useNavigate()` 获取路由跳转能力
  - 副作用应只执行一次（使用标记防止重复执行）
  - _需求：1.6、2.1、2.2、2.3、3.1、3.4、4.3_

- [ ] 8. 将 AI Chat 浮窗组件挂载到全局布局
  - 在 `App.tsx` 的 `<Router>` 内部、`<Routes>` 同级位置添加 `<AIChatFloat />`，确保所有页面都能看到浮窗
  - 由于 `AIChatFloat` 需要 `useNavigate()`，必须放在 `<Router>` 内部
  - 确保浮窗不影响现有页面布局和交互
  - _需求：1.1_

- [ ] 9. 验证与编译检查
  - 运行 `npx tsc --noEmit` 确保无 TypeScript 类型错误
  - 运行 `npx vite build` 确保构建通过
  - 验证场景 1：点击"分析库存与供应链风险"chip → 显示 Mock 回复 → 文档列表出现新报告 → 点击链接跳转到报告页面 → 报告中的 @引用可点击弹出行展开浮窗
  - 验证场景 2：点击"新增客户"chip → 显示 Mock 回复 → CRM 表格出现新行 → 点击链接跳转到 CRM 表格 → 新行可展开查看详细信息
  - _需求：1.1-1.9、2.1-2.8、3.1-3.6_
