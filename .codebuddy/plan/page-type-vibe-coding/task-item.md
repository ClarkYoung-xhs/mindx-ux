# 实施计划：Page 品类 — Vibe Coding 网页生成与 Mock 数据

- [ ] 1. 安装设计系统文件并重命名
  - 在项目根目录执行 `npx getdesign@latest add stripe`，将生成的 `DESIGN.md` 重命名为 `DESIGN-STRIPE.md`
  - 再执行 `npx getdesign@latest add revolut`，将生成的 `DESIGN.md` 重命名为 `DESIGN-REVOLUT.md`
  - 确保两个文件在项目根目录共存，分别用于 ToB 和 ToC 场景的 HTML 编写参考
  - _需求：9.1、9.4_

- [ ] 2. 扩展 WorkspaceDoc 类型定义，支持 Page 的 HTML 内容和绑定数据
  - 在 `src/data/mindxDemo.ts` 的 `WorkspaceDoc` 接口中新增可选字段 `htmlContent?: string` 和 `boundSheets?: string[]`
  - 确保 `DocType` 类型（`src/types/block.ts`）已包含 `"Page"`（当前已存在，无需修改）
  - _需求：3.1、3.2、3.3_

- [ ] 3. 编写 ToB 场景 Page 的 HTML 源代码（参考 DESIGN-STRIPE.md）
  - 创建 `src/data/pageMockData.ts` 文件，编写《华中区-星巴克加盟商订货看板》的完整单文件 HTML 字符串
  - **必须参考 `DESIGN-STRIPE.md` 中的设计规范**：采用 Stripe 风格的排版层级、商务配色方案、精致的间距和圆角
  - HTML 内容包含：品牌标识区域（"MindX × 星巴克华中区"）、动态商品视图表格（SKU/库存/实时指导价，标注绑定 `sheet-inventory` 和 `sheet-crm`）、履约进度视图（订单时间线，标注绑定 `sheet-orders`，至少 2 条在途订单）、"一键补货"CTA 按钮
  - 使用 Stripe 风格的 B2B 门户设计 + "Live" 实时同步指示器 + 响应式设计
  - _需求：4.2、4.3、4.4、4.5、9.2_

- [ ] 4. 编写 ToC 场景 Page 的 HTML 源代码（参考 DESIGN-REVOLUT.md）
  - 在 `src/data/pageMockData.ts` 中新增《财富视图》的完整单文件 HTML 字符串
  - **必须参考 `DESIGN-REVOLUT.md` 中的设计规范**：采用 Revolut 风格的深色主题、金融终端质感、紧凑数据密度、现代化卡片布局
  - HTML 内容包含：用户头像区域和"财富视图"标题、SVG/CSS 实现的资产净值分布饼图（Equity/Crypto/Cash/Real Estate/Fund 各类别 NAV 占比，数据与 `toc-sheet-asset-nav` 一致）、下周续费提醒列表（筛选未来 7 天到期的订阅，数据与 `toc-sheet-alpha-sub` 一致）
  - 使用 Revolut 风格的深色主题 + "CRDT 实时同步"状态指示器 + "Powered by MindX" 水印 + 紧凑移动端适配布局
  - _需求：5.2、5.3、5.4、9.3_

- [ ] 5. 新增 ToB 场景的 AI Chat 预设指令和 sideEffect
  - 在 `src/data/aiChatMockData.ts` 中新增 `clientPortalPagePreset` 预设：chipLabel 为"生成经销商订货看板"，matchKeywords 包含"经销商""订货看板""星巴克""门户"等，mockReply 包含说明文本和指向 Page 文档的可点击链接
  - 扩展 `ChatPreset.sideEffect` 类型联合，新增 `"createToBPage"`
  - 将新预设加入 `chatPresets` 数组
  - _需求：4.1、6.1、6.2_

- [ ] 6. 新增 ToC 场景的 AI Chat 预设指令和 sideEffect
  - 在 `src/data/tocAiChatMockData.ts` 中新增 `wealthDashboardPagePreset` 预设：chipLabel 为"生成财富视图 Dashboard"，matchKeywords 包含"财富视图""Dashboard""控制中心"等，mockReply 包含说明文本和指向 Page 文档的可点击链接
  - sideEffect 设为 `"createToCPage"`
  - 将新预设加入 `tocChatPresets` 数组
  - _需求：5.1、6.1、6.3_

- [ ] 7. 在 AIChatFloat 组件中实现 Page 文档创建的 sideEffect 逻辑
  - 在 `src/components/AIChatFloat/AIChatFloat.tsx` 的 `executeSideEffect` 函数中新增 `"createToBPage"` 分支：构造包含 `htmlContent`、`boundSheets`、`type: "Page"` 的 WorkspaceDoc 对象（《华中区-星巴克加盟商订货看板》），调用 `addDocument()` 添加到文档列表
  - 新增 `"createToCPage"` 分支：构造《财富视图》的 WorkspaceDoc 对象，调用 `addDocument()` 添加
  - 从 `src/data/pageMockData.ts` 导入两个 HTML 字符串
  - _需求：6.2、6.3、6.4_

- [ ] 8. 实现 Page 编辑器的 Preview 模式（iframe 沙箱渲染）
  - 在 `src/pages/DocumentEditor.tsx` 中，将 `isPageDoc` 分支的占位符内容替换为 iframe 渲染：使用 `<iframe sandbox="allow-scripts allow-same-origin" srcdoc={contextDoc?.htmlContent}>` 加载 HTML
  - iframe 占满正文区域宽度，高度自适应或使用 `calc(100vh - offset)` 填满可用空间
  - 当 `htmlContent` 不存在时显示空白占位提示
  - _需求：1.1、1.3、1.5_

- [ ] 9. 实现 Page 编辑器的 Code 模式和 Preview/Code 切换
  - 在 Page 编辑器区域的文档标题下方添加 Switch 组件（"Preview" / "Code" 两个选项），默认选中 "Preview"
  - Code 模式下使用 `<pre><code>` 渲染 HTML 源代码，添加等宽字体和基础语法高亮样式（通过 CSS 类名实现关键字着色，不引入外部库）
  - 切换时平滑过渡，保持编辑器框架不变
  - _需求：1.2、1.3、1.4_

- [ ] 10. 实现 Page 发布功能（模拟）
  - 在 Page 编辑器的右上角工具栏区域添加"发布"按钮（Publish），使用主色调醒目样式
  - 点击后生成模拟 URL `https://mindx.tencent.com/p/{8位随机字母数字}`，弹出发布成功弹窗，显示地址、"已发布到互联网"状态提示和"复制链接"按钮
  - 点击"复制链接"将地址写入剪贴板并显示"已复制"反馈
  - 已发布状态下按钮变为"已发布"，点击显示已有地址（不重新生成）
  - _需求：2.1、2.2、2.3、2.4、2.5_

- [ ] 11. 新增 ToB 和 ToC 活动流记录
  - 在 `src/data/mindxDemo.ts` 的 `initialActivities` 中新增一条活动记录："AI Agent 生成了《华中区-星巴克加盟商订货看板》"，targetType 为 "Page"
  - 在 `src/data/tocMindxDemo.ts` 的 `tocInitialActivities` 中新增一条活动记录："AI Agent 生成了《财富视图》"，targetType 为 "Page"
  - _需求：7.1、7.2、8.1、8.2_
