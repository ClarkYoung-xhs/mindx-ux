# 实施计划：Smart Sheet 行展开（Row Expand）

- [ ] 1. 扩展数据类型，为行展开提供类型基础
  - 在 `src/types/sheet.ts` 的 `SheetRow` 接口中新增可选字段 `expandBlocks?: Block[]`，需导入 `Block` 类型
  - 确保新增字段为可选，不影响现有代码的类型检查
  - _需求：7.1、7.2_

- [ ] 2. 编写行展开 Mock 数据
  - 在 `src/data/sheetMockData.ts` 中，为 CRM 表 `row-laowang`（华中区-星巴克加盟商-老王）行添加 `expandBlocks` 字段，内容包含：一个 Header block（客户背景）、若干 Text block（合作历史、拜访记录摘要等）、一个 Callout block（授信备注），体现数据贯通能力
  - 为 CRM 表 `row-laozhang`（华东区-瑞幸代理商-老张）行添加简短的 `expandBlocks`（1-2 个 block），作为对比
  - 为 Orders 表 `row-ord001` 行添加 `expandBlocks`（如订单审批备注），展示不同表的行展开能力
  - 其余行不添加 `expandBlocks`，浮窗中将显示空状态
  - _需求：6.1、6.2、6.3_

- [ ] 3. 实现 RowExpandModal 浮窗容器组件
  - 新建 `src/components/SheetRenderer/RowExpandModal.tsx` 组件
  - Props 接口：`{ sheetData: SheetData; row: SheetRow; onClose: () => void }`
  - 实现模态浮窗 UI：半透明遮罩（`rgba(0,0,0,0.4)`）+ 居中白色面板（宽度 720px，最大高度 85vh，内容可滚动）
  - 实现关闭逻辑：点击遮罩关闭、右上角 ✕ 按钮关闭、Escape 键关闭（`useEffect` 监听 `keydown`）
  - 使用 inline style，与项目现有风格一致，不引入额外 UI 库
  - _需求：2.1、2.2、2.3、2.4、2.5_

- [ ] 4. 实现浮窗标题区
  - 在 `RowExpandModal` 组件顶部渲染标题区
  - 通过 `sheetData.keyColumnId` 找到主键列，取 `row.cells[keyColumnId]` 的值作为标题文本；若 `keyColumnId` 未定义则使用第一列的值
  - 标题左侧显示 📋 图标，右侧显示 ✕ 关闭按钮
  - 处理 `CellValue` 为 `RelationCellValue` 的情况，取 `displayText` 作为标题
  - _需求：3.1、3.2、3.3_

- [ ] 5. 实现浮窗字段区（结构化数据展示）
  - 在 `RowExpandModal` 标题区下方，遍历 `sheetData.columns` 和 `row.cells`，以垂直排列的键值对形式渲染每一列
  - 每个字段行采用左右布局：左侧列名（灰色、固定宽度约 140px）+ 右侧列值
  - 复用 SheetView 中的 `renderCell` 逻辑：将其提取为独立的工具函数 `renderCellValue`（在 `src/components/SheetRenderer/cellRenderer.tsx` 中），供 SheetView 和 RowExpandModal 共同使用
  - status 类型渲染彩色标签、relation 类型渲染蓝色可点击链接、null/undefined 显示"—"
  - 字段区底部渲染一条分隔线（`border-bottom: 1px solid #e0e0e0`），与正文区分隔
  - _需求：4.1、4.2、4.3、4.4、4.5、4.6_

- [ ] 6. 实现浮窗正文区（BlockList 渲染）
  - 在字段区分隔线下方，判断 `row.expandBlocks` 是否存在且非空
  - 若存在：使用 `BlockList` 组件渲染 `row.expandBlocks`
  - 若不存在或为空数组：显示空状态占位（灰色文字"暂无正文内容"+ 📝 图标，居中显示）
  - _需求：5.1、5.2、5.3、5.4_

- [ ] 7. 在 SheetView 中添加行展开入口交互
  - 在 `src/components/SheetRenderer/SheetView.tsx` 中添加组件状态：`expandedRow: SheetRow | null`
  - 为每一行 `<tr>` 添加 hover 状态样式（背景色变化），并在行最左侧（第一个 `<td>` 前）新增一列，hover 时显示展开图标按钮（↗）
  - 点击展开按钮时，设置 `expandedRow` 为当前行
  - 当 `expandedRow` 不为 null 时，渲染 `<RowExpandModal>` 组件，传入 `sheetData`、`row={expandedRow}`、`onClose` 回调
  - compact 模式下同样支持展开入口，交互一致
  - _需求：1.1、1.2、1.3_

- [ ] 8. 提取 renderCell 为共享工具函数并重构 SheetView
  - 新建 `src/components/SheetRenderer/cellRenderer.tsx`，将 SheetView 中的 `renderCell`、`isRelationValue`、`statusColors` 提取到此文件中，导出为公共函数
  - 重构 SheetView 使其从 `cellRenderer.tsx` 导入并使用提取后的函数，确保行为不变
  - RowExpandModal 的字段区同样从 `cellRenderer.tsx` 导入渲染函数
  - _需求：4.3、4.4（技术约束：组件复用）_

- [ ] 9. 编译验证与端到端功能测试
  - 运行 `npx tsc --noEmit` 确保无类型错误
  - 启动 `npm run dev`，访问包含 Smart Sheet 的页面
  - 验证：hover 行时展开按钮出现 → 点击打开浮窗 → 标题正确显示主键值 → 字段区正确渲染所有列（含 status 标签、relation 链接）→ 正文区正确渲染 BlockList 或空状态 → 点击遮罩/✕/Escape 可关闭浮窗
  - 验证 compact 模式（嵌入在 Canvas 中的 Sheet）的行展开同样正常工作
  - _需求：1-7 全部验收标准_
