# 需求文档：文件类型精简、Block Editor 改造与业务 Mock 数据体系

## 引言

当前 mindx-ux 支持 5 种文件类型（`Smart Doc`、`Table`、`Whiteboard`、`Form`、`Markdown`），类型过多且定位模糊。本次改造将文件类型精简为 **3 种**：

| 新类型   | 英文标识       | 渲染方式                                    | 说明                            |
| -------- | -------------- | ------------------------------------------- | ------------------------------- |
| 智能文档 | `Smart Canvas` | Block Editor（参照 qingzhou BlockRenderer） | 富文本文档，支持多种 Block 类型 |
| 智能表格 | `Smart Sheet`  | 现有 Table 渲染                             | 结构化数据表格                  |
| 页面     | `Page`         | 占位（后续迭代）                            | 对外发布的门户页面              |

同时，为了展示 Smart Canvas 与 Smart Sheet 之间的**图谱互联与双向链接**能力，需要构建一套完整的 B2B 供应链业务 Mock 数据。该数据集包含 4 张核心智能表格（结构化数据/状态机）和 3 篇核心工作流文档（非结构化数据/上下文图谱），通过 `@引用` 和 `[[双链]]` 语法建立跨文件关联。

Demo 核心价值：当 Agent 接到"老王要 500 个杯子加急"的指令时，它能顺着图谱穿透——查到表 1 库存不足 → 拿到文档 1 的特殊协议价 13.5 元 → 提取文档 2 的环保停产预警 → 做出类人高级决策。

**重要原则：本项目仅用于 Demo 演示，所有渲染均为轻量级实现，不需要复杂的构造逻辑。样式尽量贴近 `packages/web` 中已精调过的页面样式。**

---

## 需求

### 需求 1：文件类型精简 — 从 5 种收敛为 3 种

**用户故事：** 作为一名产品经理，我希望系统仅保留 Smart Canvas、Smart Sheet 和 Page 三种文件类型，以便产品定位更清晰、用户认知负担更低。

#### 验收标准

1. WHEN 系统定义文件类型 THEN 系统 SHALL 仅支持 `'Smart Canvas'`、`'Smart Sheet'`、`'Page'` 三种类型，移除 `'Smart Doc'`、`'Table'`、`'Whiteboard'`、`'Form'`、`'Markdown'`
2. WHEN 用户在 Dashboard 点击"新建"按钮 THEN 下拉菜单 SHALL 仅展示"智能文档 (Smart Canvas)"、"智能表格 (Smart Sheet)"、"页面 (Page)"三个选项（涉及 `Dashboard.tsx` 的 `handleQuickCreateDoc` 和 `useV2ModuleActions.tsx` 的 `createDoc`）
3. WHEN 系统渲染文件类型图标 THEN `DocIcons.tsx` 中的 `getDocTypeIcon` SHALL 更新映射：`'Smart Canvas'` → 新的智能文档图标（蓝色）、`'Smart Sheet'` → 新的表格图标（绿色）、`'Page'` → 新的页面图标（紫色），移除 `Whiteboard`、`Form`、`Markdown` 的图标
4. WHEN 文件列表按类型筛选 THEN 筛选器 SHALL 仅展示新的三种类型选项
5. WHEN 国际化文案渲染 THEN `LanguageContext.tsx` SHALL 更新：`docs.smartCanvas` = '智能文档' / 'Smart Canvas'、`docs.smartSheet` = '智能表格' / 'Smart Sheet'、`docs.page` = '页面' / 'Page'，移除 `docs.whiteboard`、`docs.form`、`docs.markdown` 等旧 key
6. WHEN 用户打开 `Page` 类型文件 THEN 系统 SHALL 展示一个占位页面（提示"页面功能即将上线"），不进入编辑器

### 需求 2：Smart Canvas 的 Block Editor 渲染引擎

**用户故事：** 作为一名用户，我希望 Smart Canvas 类型的文件使用 Block Editor 渲染，每个段落是一个带类型的 Block，以便支持标题、代码、引用、列表等多种内容格式。

#### 验收标准

1. WHEN 系统初始化 THEN 系统 SHALL 提供 `BlockType` 枚举，至少包含：`text`、`header`、`sub_header`、`sub_sub_header`、`bulleted_list`、`numbered_list`、`to_do`、`code`、`quote`、`divider`、`callout`、`image`、`toggle`、`embed_sheet`（嵌入智能表格视图）、`mention`（@引用）
2. WHEN 定义 Block 数据模型 THEN 系统 SHALL 将 `Paragraph` 接口替换为 `Block` 接口，包含：`id`、`type: BlockType`、`tokens: Token[]`、`author`、`authorType`，以及类型特有属性（`checked` 用于 to_do、`language` 用于 code、`sheetId` + `viewFilter` 用于 embed_sheet、`targetId` + `targetType` 用于 mention 等）
3. WHEN 系统定义 Token 数据结构 THEN Token SHALL 采用 `[value, annotations?]` 二元组格式，支持 annotation：`'b'`（粗体）、`'i'`（斜体）、`'s'`（删除线）、`'c'`（行内代码）、`['a', url]`（链接）、`['h', color]`（高亮）、`['ref', targetId, targetType, rowId?]`（跨文件引用，rowId 可选，指向表格中具体某行）
4. WHEN 渲染 Block 列表 THEN 系统 SHALL 提供 `getBlockRenderer(type: BlockType)` 映射函数，根据类型分发到对应渲染组件（参照 qingzhou 的 `getBlockRenderer.ts`）
5. WHEN Block 类型为 `embed_sheet` THEN 渲染器 SHALL 渲染为嵌入的智能表格视图卡片，展示 `sheetId` 对应表格的过滤数据
6. WHEN Block 中的 Token 包含 `['ref', targetId, targetType, rowId?]` annotation THEN 渲染器 SHALL 将其渲染为可点击的 `@引用` 链接样式（蓝色文字 + 下划线），点击后跳转到目标文件
7. IF Block 类型未被识别 THEN 系统 SHALL 回退到 `text` 类型的默认渲染
8. WHEN 用户在空 Block 中输入 markdown 快捷语法（`## `、`- `、`1. `、`> `、`---`、`[] `） THEN 系统 SHALL 自动将当前 Block 转换为对应类型

### 需求 3：Smart Sheet 的表格渲染

**用户故事：** 作为一名用户，我希望 Smart Sheet 类型的文件使用表格渲染，以便管理结构化数据（如库存、订单、客户档案等）。

#### 验收标准

1. WHEN 用户打开 `Smart Sheet` 类型文件 THEN 系统 SHALL 使用现有的 Table 渲染组件展示表格数据
2. WHEN Smart Sheet 数据模型定义 THEN 系统 SHALL 提供 `SheetData` 接口，包含：`columns: SheetColumn[]`（列定义，含 `id`、`name`、`type`、`options` 等）和 `rows: SheetRow[]`（行数据）
3. WHEN 列类型为 `'relation'`（关联列） THEN 单元格 SHALL 渲染为可点击的 `@引用` 链接，指向关联的 Smart Canvas 或另一张 Smart Sheet 中的记录
4. WHEN 列类型为 `'status'`（状态列） THEN 单元格 SHALL 渲染为带颜色标签的状态徽章（如"待审核"黄色、"已发货"绿色、"采购中"蓝色）
5. WHEN Smart Canvas 中嵌入 Smart Sheet 视图（`embed_sheet` Block） THEN 嵌入视图 SHALL 支持 `viewFilter` 过滤条件，仅展示符合条件的行

### 需求 4：双向链接与图谱互联系统

**用户故事：** 作为一名用户，我希望 Smart Canvas 和 Smart Sheet 之间能通过 `@引用` 建立双向链接，以便在文档中引用表格数据（精确到行级别的关键列）、在表格中关联文档上下文，形成知识图谱。

#### 验收标准

1. WHEN 系统定义引用数据模型 THEN 系统 SHALL 提供 `CrossReference` 接口，包含：`sourceId`（来源文件 ID）、`sourceType`（'canvas' | 'sheet'）、`targetId`（目标文件 ID）、`targetType`（'canvas' | 'sheet'）、`targetLabel`（显示文本）、`targetAnchor`（可选，目标文件内的锚点如行 ID 或 Block ID）
2. WHEN Smart Canvas 中使用 `@` 语法引用 Smart Sheet 的**行级数据** THEN 系统 SHALL 在 Token 的 annotation 中记录 `['ref', targetSheetId, 'sheet', rowId]`（rowId 为可选，指向表格中具体某行），引用文本应展示该行的关键列值（如 `@华中区-星巴克加盟商-老王` 引用 CRM_DB 中该客户行的"客户名称"列，`@经典款陶瓷马克杯` 引用 Inventory_DB 中该 SKU 行的"品名"列），并在目标 Sheet 的反向引用列表中自动注册该引用
3. WHEN Smart Sheet 的关联列引用 Smart Canvas 文档 THEN 系统 SHALL 在目标 Canvas 的反向引用列表中自动注册该引用
4. WHEN 用户查看某个文件的详情 THEN 系统 SHALL 能展示该文件的"被引用列表"（backlinks），显示所有引用了该文件的来源
5. WHEN 渲染 `@引用` 链接 THEN 系统 SHALL 展示为带图标的行内链接：Smart Canvas 引用显示文档图标 + 文档名、Smart Sheet 引用显示表格图标 + 行关键列值（如 "@老王"、"@经典款陶瓷马克杯"）
6. WHEN Smart Sheet 中的关联列引用另一张 Smart Sheet 的行 THEN 系统 SHALL 同样支持行级引用，展示目标行的关键列值

### 需求 5：构建 B2B 供应链业务 Mock 数据

**用户故事：** 作为一名 Demo 演示者，我希望系统预置一套完整的 B2B 供应链业务数据（4 张表格 + 3 篇文档），以便在演示时展示 Agent 的图谱穿透与类人决策能力。

#### 验收标准

##### 5.1 Smart Sheet Mock 数据（4 张核心表格）

1. WHEN 系统加载兜底数据 THEN `initialDocuments` SHALL 包含以下 4 张 Smart Sheet：

   **表 1：全局 SKU 与动态库存表 (Inventory_DB)**
   - 文件 ID: `sheet-inventory`，名称: "全局 SKU 与动态库存表"
   - 列定义: SKU_ID、品名、基准售价(¥)、当前可用库存、安全库存线、默认供应商(relation→表4)、生产交付周期(天)
   - 核心行: SKU-2026-MUG-01 "经典款陶瓷马克杯"，基准售价 ¥15.00，当前库存 200，安全库存线 500，供应商 @景德镇宏图陶瓷，Lead Time 3 天

   **表 2：B2B 客户档案与授信表 (CRM_DB)**
   - 文件 ID: `sheet-crm`，名称: "B2B 客户档案与授信表"
   - 列定义: 客户名称、客户评级(status)、账期与折扣、历史客诉状态、关联上下文(relation→文档1)
   - 核心行: "华中区-星巴克加盟商-老王"，S 级，月结 30 天 / 基准价 9 折，无异常，关联 @重点客户 Q1 拜访纪要

   **表 3：全渠道业务订单流水大表 (Order_DB)**
   - 文件 ID: `sheet-orders`，名称: "全渠道业务订单流水大表"
   - 列定义: 订单编号、下单客户(relation→表2)、关联SKU(relation→表1)、需求数量、履约状态(status: 待审核/库存锁定/采购中/已发货/已签收)、交付截止日
   - 核心行: ORD-20260408-001，@老王，@经典款陶瓷马克杯，500，待审核，2026-04-10

   **表 4：供应商与产能评估表 (Supplier_DB)**
   - 文件 ID: `sheet-suppliers`，名称: "供应商与产能评估表"
   - 列定义: 供应商名称、主供品类、当前产能状态(status: 正常/满载可能延期/停产)、联系方式、备注
   - 核心行: "景德镇宏图陶瓷"，杯具/餐盘，满载可能延期（由文档 2 定期提取更新）

2. WHEN 表格之间存在关联列 THEN 关联单元格 SHALL 渲染为可点击的 `@引用` 链接，点击后跳转到目标表格的对应行

##### 5.2 Smart Canvas Mock 数据（3 篇核心文档）

3. WHEN 系统加载兜底数据 THEN `initialDocuments` SHALL 包含以下 3 篇 Smart Canvas：

   **文档 1：重点客户 Q1 拜访与授信调整纪要**
   - 文件 ID: `canvas-client-visit`，名称: "重点客户 Q1 拜访与授信调整纪要"
   - 标签: 客情维系, S级客户 | 日期: 2026-03-15
   - Block 内容结构（使用 Block Editor 格式）：
     - `header`: "重点客户 Q1 拜访与授信调整纪要"
     - `sub_header`: "近期业务异动"
     - `text`: "@华中区-星巴克加盟商-老王 近期在其辖区新增了 3 家门店，预计 Q2 对 @经典款陶瓷马克杯 的采购量将激增 300%。"（含 `['ref', 'sheet-crm', 'sheet', 'row-laowang']` 和 `['ref', 'sheet-inventory', 'sheet', 'row-mug01']` annotation，分别引用 CRM_DB 中老王行的"客户名称"列和 Inventory_DB 中马克杯行的"品名"列）
     - `sub_header`: "风控与授信研判"
     - `text`: "鉴于其历史回款极速，同意将其专属价格固定为 **13.5元/个**（此数据为 Agent 回答"按上次价格走"的真实数据源）。"（含 `['b']` annotation）
     - `sub_header`: "Action Item"
     - `to_do`: "要求销售运营在月底前更新系统报价配置"（checked: false）

   **文档 2：Q2 华东区供应链异常预警报告**
   - 文件 ID: `canvas-supply-alert`，名称: "Q2 华东区供应链异常预警报告"
   - 标签: 供应链预警, 风险 | 作者: 采购部
   - Block 内容结构：
     - `header`: "Q2 华东区供应链异常预警报告"
     - `callout`: "⚠️ 紧急预警：华东及部分华中地区窑炉面临停产风险"
     - `sub_header`: "宏观预警"
     - `text`: "因近期环保政策收紧，华东及部分华中地区窑炉面临停产。"
     - `sub_header`: "波及评估"
     - `text`: "核心供应商 @景德镇宏图陶瓷 发来函件，本月所有陶瓷类制品交期极不稳定，原定 3 天的 Lead Time 实际可能拉长至 5-7 天。"（含 `['ref', 'sheet-suppliers', 'sheet', 'row-jdz']` annotation，引用供应商表中景德镇宏图陶瓷行的"供应商名称"列）
     - `sub_header`: "指导意见"
     - `quote`: "涉及该供应商关联的 SKU，销售端在接急单时需人工介入审批或直接拒单。"
     - `embed_sheet`: 嵌入 Inventory_DB 的过滤视图（过滤条件：供应商 = 景德镇宏图陶瓷）

   **文档 3：客户专属采购工作台**
   - 文件 ID: `canvas-client-portal`，名称: "客户专属采购工作台（老王专区）"
   - 设计逻辑: 对外发布的"只读/受限交互"文档
   - Block 内容结构：
     - `header`: "Hi，老王专属专区"
     - `text`: "欢迎查看您的实时业务看板。"
     - `sub_header`: "我的专属报价单"
     - `embed_sheet`: 嵌入 Inventory_DB 的过滤视图（仅展示老王常采 SKU，价格列通过 CRM_DB 的 9 折逻辑动态渲染）
     - `sub_header`: "在途订单追踪"
     - `embed_sheet`: 嵌入 Order_DB 的过滤视图（过滤条件：客户 = @老王 AND 状态 ≠ 已签收）
     - `sub_header`: "一键补货指令区"
     - `callout`: "💡 填入数量并提交，系统将自动创建采购订单"

##### 5.3 文件列表、活动流与链接一致性

4. WHEN `initialDocuments` 加载 THEN 文件列表 SHALL 包含上述 4 张 Smart Sheet + 3 篇 Smart Canvas（共 7 个文件），每个文件的 `type` 字段使用新的类型标识
5. WHEN `initialActivities` 加载 THEN 活动流 SHALL 包含与上述 Mock 数据对应的活动记录（如"Agent 更新了库存表"、"采购部创建了供应链预警报告"等），每条活动的 `docId`、`targetName`、`targetType` 必须与 `initialDocuments` 中的文件 ID、名称、类型严格一致
6. IF 系统中存在旧的 `initialDocuments` 数据（Dashboard.tsx 和 mindxDemo.ts 中的） THEN 系统 SHALL 将其全部替换为新的 Mock 数据
7. WHEN 用户在文档列表中点击某个文件行 THEN `navigate()` 调用的 URL 参数（`id`、`type`）SHALL 与该文件的 `id` 和 `type` 字段精确匹配，确保能正确跳转到对应的编辑器页面
8. WHEN 用户在活动流中点击某条活动的文档标题链接 THEN `navigate()` 调用的 URL 参数 SHALL 使用该活动的 `docId` 和 `targetType`，确保能正确跳转到对应文件（当前 `ActivityFeed` 组件中 `navigate` 仅使用 `targetType` 而未传 `docId`，需修复为同时传递 `id` 参数）
9. WHEN Dashboard 中存在其他引用文档名称/链接的场景（如"离开摘要"卡片、快捷入口等） THEN 所有引用 SHALL 与 Mock 数据保持一致

### 需求 6：改造 DocumentEditor 主组件

**用户故事：** 作为一名用户，我希望打开 Smart Canvas 文件时进入 Block Editor，打开 Smart Sheet 文件时进入表格视图，以便不同类型的文件有各自最佳的编辑体验。

#### 验收标准

1. WHEN 用户从文件列表点击 Smart Canvas 文件 THEN 系统 SHALL 导航到 DocumentEditor，使用 Block Editor 渲染该文件的 Block 数组
2. WHEN 用户从文件列表点击 Smart Sheet 文件 THEN 系统 SHALL 导航到 DocumentEditor（或独立的 SheetEditor），使用 Table 渲染该文件的 SheetData
3. WHEN DocumentEditor 初始化 THEN 系统 SHALL 将 `useState<Paragraph[]>` 替换为 `useState<Block[]>`，使用 Block 模型
4. WHEN 渲染 Block 列表 THEN 系统 SHALL 使用 `getBlockRenderer` 分发渲染，替代当前直接输出 `{p.text}` 的方式
5. WHEN 用户编辑 Block 内容 THEN 系统 SHALL 保持现有的 `contentEditable` 编辑机制，但数据从 `text` 字符串变为 `tokens` 数组
6. WHEN 协作者光标、评论系统、版本历史等功能 THEN 系统 SHALL 保持与当前一致的行为，适配新的 Block 数据模型
7. WHEN 版本历史记录 THEN `VersionHistory.paragraphs` SHALL 更新为 `VersionHistory.blocks: Block[]`

### 需求 7：Block 间距与布局系统

**用户故事：** 作为一名用户，我希望不同类型的 Block 之间有合理的间距和布局，以便文档视觉效果美观、层次分明。

#### 验收标准

1. WHEN 渲染 Block 列表 THEN 系统 SHALL 为每种 Block 类型定义默认的上下间距（参照 qingzhou 的 `BlockContent` margin 体系）
2. WHEN 标题类 Block 出现 THEN 系统 SHALL 在其上方增加额外间距（header: 40px, sub_header: 30px, sub_sub_header: 20px）
3. WHEN 连续的列表类 Block 相邻 THEN 系统 SHALL 使用紧凑间距，使列表项视觉上连贯
4. WHEN `embed_sheet` Block 出现 THEN 系统 SHALL 使用卡片式布局，带边框和适当的内外间距

### 需求 8：数据迁移与兼容

**用户故事：** 作为一名开发者，我希望改造后的系统能平滑迁移现有数据，不丢失任何已有内容。

#### 验收标准

1. IF 存在旧的 `Paragraph` 格式数据（兜底数据、localStorage 缓存等） THEN 系统 SHALL 提供 `migrateParagraphToBlock` 转换函数，将纯文本 Paragraph 自动转换为对应类型的 Block
2. IF 存在旧的文件类型标识（如 `'Smart Doc'`、`'Table'`、`'Markdown'`） THEN 系统 SHALL 提供类型映射：`'Smart Doc'` → `'Smart Canvas'`、`'Markdown'` → `'Smart Canvas'`、`'Table'` → `'Smart Sheet'`、`'Whiteboard'` → `'Page'`、`'Form'` → `'Page'`
3. WHEN 从 localStorage 加载缓存数据 THEN 系统 SHALL 检测数据格式，自动迁移旧格式为新格式
4. IF 迁移过程中遇到无法识别的格式 THEN 系统 SHALL 将其作为 `text` 类型的 Block 保留原始内容

### 需求 9：轻量渲染原则与样式参照规范

**用户故事：** 作为一名 Demo 演示者，我希望渲染层面保持轻量简洁（本项目仅用于演示），样式尽量贴近 `packages/web` 中已精调过的页面样式，以便 Demo 效果专业且一致。

#### 验收标准

1. WHEN 实现 Block Editor 渲染 THEN 系统 SHALL 采用轻量静态渲染方式，不需要复杂的编辑交互逻辑（如实时协同编辑、拖拽排序、Block 嵌套等），仅需正确展示各类型 Block 的视觉效果
2. WHEN 渲染 Smart Canvas 的各类 Block THEN 样式 SHALL 参照 `packages/web` 中 `PageContent` 和 `BlockRenderer` 的样式规范，具体包括：
   - **text**: 参照 `TextBlock.tsx` — 默认字号、行高、颜色
   - **header**: 参照 `HeaderBlock.tsx` — `fontWeight: semibold`、`fontSize: '16pt'`、`lineHeight: 1.4`
   - **sub_header**: 参照 `SubHeaderBlock.tsx` — `fontWeight: semibold`、`fontSize: '12pt'`、`lineHeight: 1.4`
   - **sub_sub_header**: 参照 `SubSubHeaderBlock.tsx` — `fontWeight: semibold`、`fontSize: '12pt'`、`lineHeight: 1.4`
   - **quote**: 参照 `QuoteBlock.tsx` — `borderLeft: '2px solid #0062FF'`、`paddingLeft: '12px'`、`fontSize: '11pt'`、`color: '#646a73'`
   - **code**: 参照 `CodeBlock.tsx` — `borderRadius: 2`、使用 `codeBlockBackground` 背景色
   - **callout**: 参照 `CalloutBlock.tsx` — `borderLeftWidth: 5`、`borderRadius: 2`、带图标 + 背景色、`paddingLeft: 12`、`paddingTop: 9`、`paddingBottom: 9`
   - **divider**: 简单的水平分割线
   - **bulleted_list / numbered_list / to_do**: 参照对应 Block 组件的缩进和列表样式
3. WHEN 渲染 Block 间距 THEN 系统 SHALL 参照 `BlockContent.tsx` 的 `defaultMarginTop` 体系：`header: 40px`、`sub_header: 30px`、`sub_sub_header: 20px`、`quote: 10px`、`bulleted_list/numbered_list/to_do/toggle: 5px`、`divider: 0`、其他: `marginTop: 4px, marginBottom: 4px`
4. WHEN 渲染 Smart Sheet THEN 样式 SHALL 参照 `packages/web` 中 `CollectionViewBlock` 相关样式，具体包括：
   - 表头行高: `34px`（参照 `TableView.tableHeaderRowHeight`）
   - 单元格最小高度: `Property.cellHeight`
   - 表格边框: 使用 `regularDividerColor` 分割线
   - 状态列: 带颜色标签的徽章样式
   - 关联列: 蓝色可点击链接样式
   - 整体布局: `CollectionViewBlock.collectionHeaderStyle` 的 `display: flex, alignItems: center, height: 46px, paddingBottom: 5px`
5. WHEN 实现 `embed_sheet` Block THEN 嵌入视图 SHALL 以轻量卡片形式渲染（带边框 + 圆角 + 标题栏），内部使用简化版的表格渲染，不需要完整的 CollectionViewBlock 功能（如视图切换、筛选器 UI、拖拽列宽等）
6. WHEN 实现 `@引用` 链接 THEN 系统 SHALL 以静态链接形式渲染（蓝色文字 + 下划线 + 图标），点击跳转即可，不需要实现实时搜索补全、悬浮预览等高级交互

---

## 技术约束

- **本项目仅用于 Demo 演示，所有渲染均为轻量级实现，不需要复杂的构造逻辑**
- 改造应在现有 `DocumentEditor.tsx`、`SharedDocumentView.tsx`、`Dashboard.tsx`、`mindxDemo.ts` 上进行
- Block 类型定义和 Token 工具函数应抽取到独立模块（如 `src/types/block.ts`、`src/utils/tokens.ts`）
- Block 渲染组件应放在 `src/components/BlockRenderer/` 目录下
- Smart Sheet 的 `SheetData` 接口和 Mock 数据应放在 `src/types/sheet.ts` 和 `src/data/` 目录下
- 双向链接的 `CrossReference` 数据应集中管理，可放在 `src/data/crossReferences.ts`
- 保持与现有功能的兼容：协作者光标、评论系统、版本历史、文档列表等
- 初期不需要实现拖拽排序、Block 嵌套、Page 类型的完整功能等高级特性
- Mock 数据中的 `@引用` 在渲染层面先以静态链接形式呈现，不需要实现实时搜索补全
- 样式优先参照 `packages/web` 中已精调过的组件样式，保持视觉一致性
