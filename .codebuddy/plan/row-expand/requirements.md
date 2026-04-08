# 需求文档：Smart Sheet 行展开（Row Expand）

## 引言

Smart Sheet 行展开功能旨在体现 Smart Canvas 与 Smart Sheet 之间数据贯通的能力。用户可以在 Smart Sheet 中点击任意一行，将其展开为一个浮窗形式的 Smart Canvas 编辑器页面。

浮窗页面包含三个部分：

1. **标题区**：显示该行主键列（`keyColumnId`）对应的值作为页面标题
2. **字段区**：以"左列名、右列值"垂直排列的方式，展示该行所有列的名称和值
3. **正文区**：一个完整的 BlockList 编辑器区域，用于补充该行的详细信息

典型应用场景：在"B2B 客户档案与授信表"中，每一行代表一个客户。点击展开后，用户可以在行展开页面中查看客户的结构化字段信息，并通过正文区补充更多非结构化的客户详情（如拜访记录、合作备忘等）。

---

## 需求

### 需求 1：行展开入口

**用户故事：** 作为一名文档用户，我希望在 Smart Sheet 的每一行上有一个明确的展开入口，以便我能快速打开该行的详情浮窗。

#### 验收标准

1. WHEN 用户将鼠标悬停在 SheetView 的某一行上 THEN 系统 SHALL 在该行最左侧显示一个展开图标按钮（如 ↗ 或展开箭头）
2. WHEN 用户点击行展开图标按钮 THEN 系统 SHALL 打开该行对应的行展开浮窗
3. IF SheetView 处于 compact 模式（嵌入在 Canvas 中） THEN 系统 SHALL 同样支持行展开入口，交互方式保持一致

---

### 需求 2：行展开浮窗容器

**用户故事：** 作为一名文档用户，我希望行展开页面以浮窗（Modal / Overlay）形式展示，以便我无需离开当前 Sheet 页面即可查看和编辑行详情。

#### 验收标准

1. WHEN 行展开浮窗打开 THEN 系统 SHALL 在页面中央显示一个模态浮窗，背景显示半透明遮罩
2. WHEN 行展开浮窗打开 THEN 浮窗 SHALL 具有合理的宽度（建议 680px–780px）和最大高度（不超过视口 85%），内容超出时可滚动
3. WHEN 用户点击浮窗外部遮罩区域 THEN 系统 SHALL 关闭浮窗
4. WHEN 用户点击浮窗右上角的关闭按钮 THEN 系统 SHALL 关闭浮窗
5. WHEN 用户按下 Escape 键 THEN 系统 SHALL 关闭浮窗

---

### 需求 3：浮窗标题区

**用户故事：** 作为一名文档用户，我希望行展开浮窗的标题能清晰标识当前展开的是哪一行数据，以便我快速确认上下文。

#### 验收标准

1. WHEN 行展开浮窗打开 THEN 系统 SHALL 在浮窗顶部显示该行主键列（`keyColumnId` 对应列）的值作为标题
2. IF 该 Sheet 未定义 `keyColumnId` THEN 系统 SHALL 使用第一列的值作为标题
3. WHEN 标题显示 THEN 系统 SHALL 在标题左侧显示一个表格行图标（如 📋），以区分普通文档标题

---

### 需求 4：字段区（结构化数据展示）

**用户故事：** 作为一名文档用户，我希望在行展开页面中以清晰的键值对形式查看该行的所有列数据，以便我快速了解该行的结构化信息。

#### 验收标准

1. WHEN 行展开浮窗打开 THEN 系统 SHALL 在标题区下方、正文区上方，以垂直排列的键值对形式展示该行所有列的数据
2. WHEN 展示字段区 THEN 每一个字段 SHALL 以"左侧列名（label）+ 右侧列值（value）"的水平布局呈现，列名与列值之间有明确的视觉分隔
3. WHEN 列值为 `status` 类型 THEN 系统 SHALL 使用与 SheetView 一致的彩色标签样式渲染
4. WHEN 列值为 `relation` 类型 THEN 系统 SHALL 渲染为可点击的蓝色链接，点击后导航到关联目标
5. WHEN 列值为 `null` 或 `undefined` THEN 系统 SHALL 显示占位符"—"
6. WHEN 字段区展示完毕 THEN 系统 SHALL 在字段区与正文区之间显示一条分隔线

---

### 需求 5：正文区（BlockList 富文本内容）

**用户故事：** 作为一名文档用户，我希望在行展开页面中查看和浏览该行关联的富文本正文内容，以便我获取该行的补充详细信息。

#### 验收标准

1. WHEN 行展开浮窗打开 THEN 系统 SHALL 在字段区下方渲染该行关联的 BlockList 正文内容
2. IF 该行存在关联的 blocks 数据 THEN 系统 SHALL 使用 BlockList 组件渲染这些 blocks
3. IF 该行没有关联的 blocks 数据 THEN 系统 SHALL 显示一个空状态提示（如"暂无正文内容"），引导用户理解此处可以补充内容
4. WHEN 正文区渲染 THEN 系统 SHALL 支持所有现有的 Block 类型（Text、Header、List、Code、Quote、EmbedSheet 等）

---

### 需求 6：行展开 Mock 数据

**用户故事：** 作为一名开发者，我希望为行展开功能提供合理的 Mock 数据，以便在 Demo 中展示 Smart Sheet 与 Smart Canvas 数据贯通的能力。

#### 验收标准

1. WHEN 系统加载行展开数据 THEN 系统 SHALL 支持通过 `rowId` 查找该行对应的 blocks 正文数据
2. WHEN 为 CRM 表（`sheet-crm`）的"华中区-星巴克加盟商-老王"行提供 Mock 数据 THEN 系统 SHALL 包含有意义的正文内容（如客户背景介绍、合作历史、拜访记录摘要等），体现数据贯通能力
3. WHEN 为其他表的行提供 Mock 数据 THEN 系统 SHALL 至少为 1-2 个典型行提供正文 blocks，其余行可显示空状态

---

### 需求 7：数据类型扩展

**用户故事：** 作为一名开发者，我希望 SheetRow 的类型定义能支持行展开所需的正文数据字段，以便类型系统完整覆盖新功能。

#### 验收标准

1. WHEN 扩展 SheetRow 类型 THEN 系统 SHALL 在 `SheetRow` 接口中新增一个可选字段 `expandBlocks?: Block[]`，用于存储该行的正文 blocks
2. WHEN 类型扩展完成 THEN 系统 SHALL 确保现有代码不受影响（`expandBlocks` 为可选字段）

---

## 技术约束与边界

- **只读模式**：当前阶段行展开页面为只读展示，不需要支持编辑功能
- **组件复用**：字段区的单元格渲染应复用 SheetView 中已有的 `renderCell` 逻辑，确保 status、relation 等类型的渲染一致性
- **浮窗层级**：浮窗应使用较高的 z-index，确保覆盖在 Sheet 和其他内容之上
- **无外部依赖**：浮窗组件使用原生 React + inline style 实现，与项目现有风格保持一致，不引入额外 UI 库
- **性能**：BlockList 渲染应按需加载，仅在浮窗打开时渲染正文内容
