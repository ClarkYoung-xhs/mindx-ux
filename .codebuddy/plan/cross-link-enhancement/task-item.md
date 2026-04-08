# 实施计划：关联交互增强（Cross-Link Enhancement）

- [ ] 1. 创建共享数据查找工具函数
  - 在 `src/utils/` 下新建 `sheetLookup.ts`，导出 `findSheetRow(sheetId: string, rowId: string): { sheetData: SheetData; row: SheetRow } | null` 函数
  - 该函数从 `allSheets` 中根据 `sheetId` 查找 `SheetData`，再从 `rows` 中根据 `rowId` 查找 `SheetRow`
  - 找不到时返回 `null`，供调用方回退为原有跳转行为
  - _需求：1.5、1.6、2.5、2.6_

- [ ] 2. 改造 `tokens.tsx` 中 `ref` 注解的点击行为
  - 修改 `applyAnnotation` 函数中 `type === "ref"` 分支的 `handleClick` 逻辑
  - 当 `targetType === "sheet"` 且存在 `rowId` 时，调用 `findSheetRow` 查找数据；若找到则不跳转，改为调用一个回调函数（如 `onRowExpand`）打开浮窗
  - 当 `targetType === "canvas"` 或无 `rowId` 或数据查找失败时，保持原有 `navigate` 跳转行为
  - 需要扩展 `renderTokens` 和 `useTokenRenderer` 的参数签名，新增可选的 `onRowExpand?: (sheetData, row) => void` 回调
  - 保持 `@引用` Token 的蓝色链接样式不变
  - _需求：1.1、1.2、1.3、1.6、1.7_

- [ ] 3. 在文档渲染层集成 `@引用` 触发的行展开浮窗
  - 在使用 `renderTokens` / `useTokenRenderer` 的文档渲染组件（如 `BlockList` 或其父组件）中，添加 `RowExpandModal` 的状态管理（`expandedSheetData` + `expandedRow`）
  - 将 `onRowExpand` 回调传入 `renderTokens`，回调中设置浮窗状态
  - 渲染 `RowExpandModal` 组件，关闭时清空状态
  - _需求：1.1、1.4、1.5_

- [ ] 4. 改造 `cellRenderer.tsx` 中关联列的点击行为
  - 修改 `renderCellValue` 函数中 `relation` 列分支的 `handleClick` 逻辑
  - 当 `value.targetType === "sheet"` 且存在 `value.rowId` 时，调用 `findSheetRow` 查找数据；若找到则调用 `onRowExpand` 回调打开浮窗
  - 当 `targetType === "canvas"` 或无 `rowId` 或数据查找失败时，保持原有 `navigate` 跳转行为
  - 扩展 `renderCellValue` 的参数签名，新增可选的 `onRowExpand?: (sheetData, row) => void` 回调
  - _需求：2.1、2.2、2.3、2.6_

- [ ] 5. 在 `SheetView` 和 `RowExpandModal` 中集成关联列触发的行展开浮窗
  - 修改 `SheetView.tsx`，将 `onRowExpand` 回调传入 `renderCellValue` 调用，回调中设置 `expandedRow` 状态
  - 修改 `RowExpandModal.tsx` 的字段区，将 `onRowExpand` 回调传入其内部的 `renderCellValue` 调用，支持从浮窗内的关联列再次打开新的浮窗（覆盖当前浮窗内容）
  - 浮窗嵌套通过替换当前浮窗的 `sheetData` + `row` 实现，最多支持 2 层（可通过 depth 计数或简单替换实现）
  - _需求：2.4、2.5、2.7_

- [ ] 6. 在三个 Smart Canvas 文档中添加双向链接内容
  - 修改 `canvasMockData.ts` 中的 `clientVisitBlocks`：新增引用 `canvas-supply-alert`（供应链预警）和 `canvas-client-portal`（老王专区）的 `ref` 注解 Token
  - 修改 `supplyAlertBlocks`：新增引用 `canvas-client-visit`（拜访纪要）和 `canvas-client-portal`（老王专区）的 `ref` 注解 Token
  - 修改 `clientPortalBlocks`：新增引用 `canvas-client-visit`（拜访纪要）和 `canvas-supply-alert`（供应链预警）的 `ref` 注解 Token
  - 新增内容应自然融入现有文档上下文，体现文档间的业务关联
  - _需求：3.1、3.2、3.3、3.4、3.5、3.6、3.8_

- [ ] 7. 在 `crossReferences.ts` 中补充文档间双向链接记录
  - 新增 6 条 CrossReference 记录，覆盖三个文档两两之间的双向引用：
    - `canvas-client-visit` ↔ `canvas-supply-alert`（2 条）
    - `canvas-client-visit` ↔ `canvas-client-portal`（2 条）
    - `canvas-supply-alert` ↔ `canvas-client-portal`（2 条）
  - 每条记录的 `targetType` 为 `"canvas"`，无 `targetAnchor`
  - _需求：3.7_

- [ ] 8. 验证与编译检查
  - 运行 TypeScript 编译检查，确保所有类型正确、无编译错误
  - 运行 Vite 构建验证，确保打包成功
  - 验证以下场景：文档中 `@引用` 指向表格行时弹出浮窗、指向 canvas 时跳转、表格关联列指向行时弹出浮窗、浮窗内关联列可再次打开浮窗、文档间双向链接正常跳转
  - _需求：1.1-1.7、2.1-2.7、3.1-3.8_
