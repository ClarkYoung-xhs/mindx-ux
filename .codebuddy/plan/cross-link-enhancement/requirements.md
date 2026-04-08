# 需求文档：关联交互增强（Cross-Link Enhancement）

## 引言

当前 Smart Canvas 与 Smart Sheet 之间已具备基本的数据关联能力：文档中可通过 `@引用`（ref 注解）引用表格行记录，表格中的关联列（relation column）可链接到其他表格/文档。然而，现有的交互方式存在以下不足：

1. **文档中的 `@引用`**：点击后通过路由跳转到目标表格页面，用户需要离开当前文档上下文，体验割裂
2. **表格关联列**：点击后同样跳转到目标页面，无法在当前视图中快速预览关联行的详细信息
3. **文档间双向链接缺失**：现有的三个 Smart Canvas 文档（拜访纪要、供应链预警、老王专区）之间没有互相引用，无法体现文档与文档之间的知识网络关系

本次迭代旨在增强关联交互体验，核心目标是：

- 将 `@引用` 和关联列的点击行为从"页面跳转"升级为"行展开浮窗"，实现原地预览
- 补充文档间的双向链接内容，构建完整的知识关联网络

---

## 需求

### 需求 1：文档中 @引用 Token 点击弹出行展开浮窗

**用户故事：** 作为一名文档用户，我希望在 Smart Canvas 文档中点击 `@某某` 引用时，能够以浮窗形式直接查看该行记录的展开详情，以便我无需离开当前文档即可快速了解被引用对象的信息。

#### 验收标准

1. WHEN 文档中的 `@引用` Token 指向一个表格行记录（即 ref 注解中 `targetType === "sheet"` 且存在 `rowId`） THEN 系统 SHALL 在点击时弹出该行的 RowExpandModal 浮窗，而非跳转到表格页面
2. WHEN `@引用` Token 指向一个 Smart Canvas 文档（即 `targetType === "canvas"`） THEN 系统 SHALL 保持当前的页面跳转行为不变
3. WHEN `@引用` Token 指向一个表格但没有指定 `rowId`（如嵌入视图引用） THEN 系统 SHALL 保持当前的页面跳转行为不变
4. WHEN 行展开浮窗打开 THEN 浮窗 SHALL 复用已有的 RowExpandModal 组件，展示标题区、字段区和正文区
5. WHEN 行展开浮窗打开 THEN 系统 SHALL 根据 ref 注解中的 `targetId`（sheetId）和 `rowId` 从 Mock 数据中查找对应的 SheetData 和 SheetRow
6. IF 根据 `targetId` 和 `rowId` 找不到对应的数据 THEN 系统 SHALL 回退为原有的页面跳转行为
7. WHEN `@引用` Token 渲染 THEN 系统 SHALL 保持现有的蓝色链接样式（带底部边框和图标前缀），视觉上作为一个整体的特殊 Token

---

### 需求 2：表格关联列点击弹出行展开浮窗

**用户故事：** 作为一名文档用户，我希望在 Smart Sheet 表格中点击关联列（relation column）的链接时，能够以浮窗形式直接查看被关联行的展开详情，以便我无需跳转页面即可快速预览关联数据。

#### 验收标准

1. WHEN 表格中关联列的值指向另一个表格的行记录（即 `RelationCellValue` 中 `targetType === "sheet"` 且存在 `rowId`） THEN 系统 SHALL 在点击时弹出该行的 RowExpandModal 浮窗，而非跳转到表格页面
2. WHEN 关联列的值指向一个 Smart Canvas 文档（即 `targetType === "canvas"`） THEN 系统 SHALL 保持当前的页面跳转行为不变
3. WHEN 关联列的值没有指定 `rowId` THEN 系统 SHALL 保持当前的页面跳转行为不变
4. WHEN 行展开浮窗打开 THEN 浮窗 SHALL 复用已有的 RowExpandModal 组件
5. WHEN 行展开浮窗打开 THEN 系统 SHALL 根据 `RelationCellValue` 中的 `targetId`（sheetId）和 `rowId` 从 Mock 数据中查找对应的 SheetData 和 SheetRow
6. IF 根据 `targetId` 和 `rowId` 找不到对应的数据 THEN 系统 SHALL 回退为原有的页面跳转行为
7. WHEN 浮窗从表格关联列触发时 THEN 系统 SHALL 支持浮窗嵌套场景（即在一个行展开浮窗的字段区中点击关联列，可以打开另一个行展开浮窗）

---

### 需求 3：文档间双向链接内容补充

**用户故事：** 作为一名文档用户，我希望在不同的 Smart Canvas 文档之间能看到互相引用的链接，以便我能感知文档之间的知识关联关系，并快速在相关文档间导航。

#### 验收标准

1. WHEN 查看"重点客户 Q1 拜访纪要"文档 THEN 文档内容中 SHALL 包含指向"供应链预警"文档的 `@引用`（ref 注解，`targetType === "canvas"`），体现拜访中提到的供应链问题与预警文档的关联
2. WHEN 查看"重点客户 Q1 拜访纪要"文档 THEN 文档内容中 SHALL 包含指向"老王专属服务门户"文档的 `@引用`，体现客户拜访与客户门户的关联
3. WHEN 查看"供应链预警"文档 THEN 文档内容中 SHALL 包含指向"重点客户 Q1 拜访纪要"文档的 `@引用`，体现预警信息与客户拜访反馈的关联
4. WHEN 查看"供应链预警"文档 THEN 文档内容中 SHALL 包含指向"老王专属服务门户"文档的 `@引用`，体现预警对客户服务的影响
5. WHEN 查看"老王专属服务门户"文档 THEN 文档内容中 SHALL 包含指向"重点客户 Q1 拜访纪要"文档的 `@引用`，体现门户内容与拜访记录的关联
6. WHEN 查看"老王专属服务门户"文档 THEN 文档内容中 SHALL 包含指向"供应链预警"文档的 `@引用`，体现门户中对供应链状况的提示
7. WHEN 新增文档间引用 THEN `crossReferences.ts` 中 SHALL 同步新增对应的 CrossReference 记录，确保双向链接图谱完整
8. WHEN 用户点击文档间的 `@引用` 链接 THEN 系统 SHALL 通过路由跳转到目标文档页面（文档→文档的引用保持跳转行为）

---

## 技术约束与边界

- **渐进式改造**：修改 `@引用` 和关联列的点击行为时，需确保不影响不符合浮窗条件的引用（如指向 canvas 的引用、无 rowId 的引用）的正常跳转
- **数据查找**：浮窗需要根据 `sheetId` 和 `rowId` 查找 SheetData 和 SheetRow，需要从 `allSheets` Mock 数据中获取，可能需要将数据查找逻辑封装为共享工具函数
- **组件复用**：行展开浮窗必须复用已有的 `RowExpandModal` 组件，不新建浮窗组件
- **浮窗嵌套**：支持从浮窗内的关联列再次打开新的浮窗（覆盖当前浮窗或叠加显示），但不需要支持无限层级嵌套，建议最多支持 2 层
- **Token 渲染一致性**：`@引用` Token 的视觉样式保持不变（蓝色链接 + 图标前缀 + 底部边框），仅改变点击行为
- **无外部依赖**：所有改动使用原生 React + inline style，与项目现有风格一致
- **Mock 数据完整性**：新增的文档间引用内容应与现有业务场景自然衔接，不破坏已有内容的逻辑连贯性
