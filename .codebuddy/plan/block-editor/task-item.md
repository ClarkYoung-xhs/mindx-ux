# 实施计划

- [ ] 1. 定义核心类型系统与数据模型
  - 创建 `src/types/block.ts`：定义 `BlockType` 枚举、`Token` 类型（`[value, annotations?]` 二元组）、`Block` 接口（含 `id`、`type`、`tokens`、`author`、`authorType` 及类型特有属性 `checked`、`language`、`sheetId`、`viewFilter`、`targetId` 等）
  - 创建 `src/types/sheet.ts`：定义 `SheetColumn` 接口（含 `id`、`name`、`type: 'text' | 'number' | 'status' | 'relation' | 'date'`、`options`）、`SheetRow` 接口、`SheetData` 接口
  - 创建 `src/types/crossRef.ts`：定义 `CrossReference` 接口（含 `sourceId`、`sourceType`、`targetId`、`targetType`、`targetLabel`、`targetAnchor`）
  - 修改 `src/data/mindxDemo.ts` 中的 `WorkspaceDoc` 接口：`type` 字段收敛为 `'Smart Canvas' | 'Smart Sheet' | 'Page'`，新增可选字段 `blocks?: Block[]`、`sheetData?: SheetData`
  - _需求：1.1、2.1、2.2、2.3、3.2、4.1_

- [ ] 2. 创建 Token 渲染工具与 `getBlockRenderer` 映射
  - 创建 `src/utils/tokens.ts`：实现 `renderTokens(tokens: Token[])` 函数，遍历 Token 数组，根据 annotation 类型（`'b'`/`'i'`/`'s'`/`'c'`/`['a', url]`/`['h', color]`/`['ref', targetId, targetType, rowId?]`）渲染为对应的 React 内联元素；`@引用` annotation 渲染为蓝色可点击链接（使用 `useNavigate` 跳转）
  - 创建 `src/components/BlockRenderer/index.ts`：实现 `getBlockRenderer(type: BlockType)` 映射函数，未识别类型回退到 `TextBlock`
  - _需求：2.3、2.4、2.6、2.7、4.5、9.6_

- [ ] 3. 实现各类型 Block 渲染组件
  - 创建 `src/components/BlockRenderer/TextBlock.tsx`：参照 `packages/web` 的 `TextBlock.tsx` 样式
  - 创建 `src/components/BlockRenderer/HeaderBlock.tsx`：支持 `header`/`sub_header`/`sub_sub_header` 三级标题，样式参照 `packages/web`（header: `fontWeight: 600, fontSize: 16pt, lineHeight: 1.4`；sub_header/sub_sub_header: `fontSize: 12pt`）
  - 创建 `src/components/BlockRenderer/QuoteBlock.tsx`：`borderLeft: 2px solid #0062FF`、`paddingLeft: 12px`、`fontSize: 11pt`、`color: #646a73`
  - 创建 `src/components/BlockRenderer/CodeBlock.tsx`：`borderRadius: 2`、代码块背景色
  - 创建 `src/components/BlockRenderer/CalloutBlock.tsx`：`borderLeftWidth: 5`、`borderRadius: 2`、带图标 + 背景色
  - 创建 `src/components/BlockRenderer/ListBlock.tsx`：支持 `bulleted_list`、`numbered_list`、`to_do`（含 checkbox）
  - 创建 `src/components/BlockRenderer/DividerBlock.tsx`：水平分割线
  - 创建 `src/components/BlockRenderer/EmbedSheetBlock.tsx`：轻量卡片形式渲染嵌入表格视图（带边框 + 圆角 + 标题栏），内部使用简化版表格，支持 `viewFilter` 过滤
  - 创建 `src/components/BlockRenderer/BlockList.tsx`：遍历 `Block[]` 数组，使用 `getBlockRenderer` 分发渲染，应用 `defaultMarginTop` 间距体系（header: 40px、sub_header: 30px、sub_sub_header: 20px、quote: 10px、list: 5px、其他: 4px）
  - _需求：2.4、2.5、7.1、7.2、7.3、7.4、9.1、9.2、9.3、9.5_

- [ ] 4. 实现 Smart Sheet 表格渲染组件
  - 创建 `src/components/SheetRenderer/SheetView.tsx`：根据 `SheetData` 渲染完整表格视图，样式参照 `packages/web` 的 `CollectionViewBlock`（表头行高 34px、`regularDividerColor` 边框、整体布局 `display: flex, alignItems: center, height: 46px`）
  - 在 `SheetView.tsx` 中实现列类型渲染：`'status'` 列渲染为带颜色标签的徽章、`'relation'` 列渲染为蓝色可点击 `@引用` 链接（点击跳转到目标文件/行）、`'text'`/`'number'`/`'date'` 列为普通文本
  - _需求：3.1、3.2、3.3、3.4、9.4_

- [ ] 5. 构建 B2B 供应链 Mock 数据
  - 创建 `src/data/sheetMockData.ts`：定义 4 张 Smart Sheet 的 `SheetData`（Inventory_DB、CRM_DB、Order_DB、Supplier_DB），包含完整的列定义和行数据，关联列使用 `relation` 类型并记录 `targetId` + `rowId`
  - 创建 `src/data/canvasMockData.ts`：定义 3 篇 Smart Canvas 的 `Block[]` 数组（客户拜访纪要、供应链预警报告、客户工作台），Block 中的 `@引用` Token 使用 `['ref', targetSheetId, 'sheet', rowId]` annotation 指向表格行级数据的关键列
  - 创建 `src/data/crossReferences.ts`：定义所有跨文件引用的 `CrossReference[]` 数组，建立双向链接关系（文档→表格行、表格→文档、表格→表格）
  - _需求：4.1、4.2、4.3、5.1、5.2_

- [ ] 6. 替换 `initialDocuments` 和 `initialActivities` Mock 数据
  - 修改 `src/data/mindxDemo.ts`：将 `initialDocuments` 数组替换为 7 个新文件（4 张 Smart Sheet + 3 篇 Smart Canvas），每个文件的 `id`、`name`、`type` 与 Mock 数据严格对应，新增 `blocks` 或 `sheetData` 字段引用步骤 5 中的数据
  - 修改 `src/data/mindxDemo.ts`：将 `initialActivities` 数组替换为与新 Mock 数据对应的活动记录，确保每条活动的 `docId`、`targetName`、`targetType` 与 `initialDocuments` 中的文件精确匹配
  - 同步修改 `src/pages/Dashboard.tsx` 中的 `initialDocuments` 和 `initialActivities`（如果 Dashboard 中有独立的副本），确保两处数据一致
  - _需求：5.3.4、5.3.5、5.3.6_

- [ ] 7. 更新文件类型系统（图标、国际化、新建菜单、筛选器）
  - 修改 `src/components/DocIcons.tsx`：更新 `getDocTypeIcon` 映射，新增 `'Smart Canvas'`（蓝色）、`'Smart Sheet'`（绿色）、`'Page'`（紫色）图标，移除 `'Whiteboard'`、`'Form'`、`'Markdown'` 的图标
  - 修改 `src/i18n/LanguageContext.tsx`：新增 `docs.smartCanvas`、`docs.smartSheet`、`docs.page` 的中英文翻译，移除 `docs.whiteboard`、`docs.form`、`docs.markdown` 等旧 key
  - 修改 `src/pages/Dashboard.tsx` 中的新建文档菜单（`handleQuickCreateDoc` 区域）：仅展示 Smart Canvas、Smart Sheet、Page 三个选项
  - 修改 `src/pages/v2/useV2ModuleActions.tsx` 中的 `createDoc` 函数和 `useWorkspaceCreateActions` 返回值：类型参数收敛为 `'Smart Canvas' | 'Smart Sheet' | 'Page'`
  - 修改 `src/components/workspace/WorkspaceDocumentsView.tsx` 中的类型筛选器：仅展示新的三种类型
  - _需求：1.1、1.2、1.3、1.4、1.5_

- [ ] 8. 改造 DocumentEditor 主组件，按文件类型分发渲染
  - 修改 `src/pages/DocumentEditor.tsx`：根据 URL 参数 `type` 分发渲染逻辑 — `Smart Canvas` 类型使用 `BlockList` 组件渲染 `Block[]`、`Smart Sheet` 类型使用 `SheetView` 组件渲染 `SheetData`、`Page` 类型展示占位页面
  - 修改 `src/pages/DocumentEditor.tsx`：将 `useState<Paragraph[]>` 替换为 `useState<Block[]>`，根据 `currentDocId` 从 Mock 数据中加载对应的 `blocks` 或 `sheetData`
  - 修改 `src/pages/DocumentEditor.tsx`：更新版本历史数据结构，`VersionHistory.paragraphs` 改为 `VersionHistory.blocks`
  - 保持协作者光标、评论系统等现有功能的兼容性
  - _需求：6.1、6.2、6.3、6.4、6.5、6.6、6.7、1.6_

- [ ] 9. 修复文档列表和活动流的链接跳转
  - 修改 `src/pages/Dashboard.tsx` 中 `DocRow` 组件的 `navigate` 调用：确保 URL 参数 `id` 和 `type` 与文件数据精确匹配
  - 修改 `src/pages/Dashboard.tsx` 中 `ActivityFeed` 组件的 `navigate` 调用：从 `navigate(\`/document?type=${activity.targetType...}\`)` 改为 `navigate(\`/document?id=${activity.docId}&type=${normalizeDocType(activity.targetType)}\`)`，同时传递 `docId`
  - 修改 `src/pages/Dashboard.tsx` 中 `AbsenceSummaryCard` 的 `onDocClick` 回调：确保跳转参数与 Mock 数据一致
  - 修改 `src/components/workspace/WorkspaceDocumentsView.tsx` 中文档行的跳转逻辑：确保使用新的文件类型标识
  - 修改 `src/pages/v2/V2KnowledgePage.tsx` 和 `src/pages/v2/V2MemoryPage.tsx` 中的 `openSource` 函数：适配新的文件类型标识
  - _需求：5.3.7、5.3.8、5.3.9_

- [ ] 10. 数据迁移兼容与收尾
  - 创建 `src/utils/migration.ts`：实现 `migrateParagraphToBlock(paragraph)` 转换函数（将纯文本 Paragraph 转为 `text` 类型 Block）和 `migrateDocType(oldType)` 类型映射函数（`'Smart Doc'`→`'Smart Canvas'`、`'Table'`→`'Smart Sheet'`、`'Whiteboard'`/`'Form'`→`'Page'`、`'Markdown'`→`'Smart Canvas'`）
  - 在 `src/pages/DocumentEditor.tsx` 的数据加载逻辑中集成迁移函数：检测旧格式数据并自动转换
  - 全局搜索并清理所有残留的旧类型字符串引用（`'Smart Doc'`、`'Table'`、`'Whiteboard'`、`'Form'`、`'Markdown'`），确保无遗漏
  - _需求：8.1、8.2、8.3、8.4_
