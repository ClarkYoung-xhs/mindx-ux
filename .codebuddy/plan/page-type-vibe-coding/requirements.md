# 需求文档：Page 品类 — Vibe Coding 网页生成与 Mock 数据

## 引言

Page 是 mindX 的第三种文档品类（与 Smart Canvas、Smart Sheet 并列），本质上是用户通过 AI Agent 的 Vibe Coding 能力生成的网页。在当前演示阶段，需要完成以下工作：

1. **Page 编辑器框架**：将 DocumentEditor 中 Page 类型的占位符替换为真实的网页渲染环境，包含 Preview/Code 模式切换、发布按钮等核心交互
2. **ToB 场景 Page Mock 数据**：在 toB workspace 中新增一个 Page 类型文件《华中区-星巴克加盟商订货看板》，通过 AI Chat 预设指令生成，展示动态 B2B 经销商专属门户
3. **ToC 场景 Page Mock 数据**：在 toC workspace 中新增一个 Page 类型文件《浩哥财富视图》，通过 AI Chat 预设指令生成，展示动态极简控制中心 / Dashboard Widget

Page 品类的两个关键亮点：

- **发布能力**：右上角"发布"按钮，点击后生成公开访问地址（官网域名 + 随机字符串），使网页可在互联网上被访问
- **Smart Sheet 绑定**：网页中嵌入的组件可绑定底层 Smart Sheet 数据库，当数据更新时网页内容同步更新

### 关于沙箱渲染的技术评估

在演示阶段，**建议使用 iframe + srcdoc 方式渲染 HTML**，而非搭建完整的沙箱运行环境。理由如下：

- 演示阶段的 Page 内容为预设的静态 HTML/CSS/JS，不涉及真实的 npm 依赖安装或构建流程
- iframe srcdoc 天然提供安全隔离，足以展示"网页在文档编辑器内运行"的效果
- 避免引入 Sandpack / CodeSandbox SDK 等重量级依赖，保持 Demo 的轻量性
- Code 模式下使用简单的代码高亮展示（`<pre><code>` + 语法高亮）即可满足演示需求

---

## 需求

### 需求 1：Page 编辑器框架 — Preview / Code 模式与沙箱渲染

**用户故事：** 作为一名 Demo 演示者，我希望打开 Page 类型文件时能看到网页渲染效果，并可切换查看源代码，以便展示 Vibe Coding 的完整体验。

#### 验收标准

1. WHEN 用户打开一个 Page 类型文档 THEN 系统 SHALL 在编辑器正文区域渲染一个 iframe 沙箱，通过 `srcdoc` 属性加载该 Page 的 HTML 源代码
2. WHEN Page 编辑器加载 THEN 页面左上角（文档标题下方区域）SHALL 显示一个 Switch 组件，包含 "Preview" 和 "Code" 两个选项，默认选中 "Preview"
3. WHEN 用户切换到 "Preview" 模式 THEN 系统 SHALL 显示 iframe 渲染的网页效果，iframe 占满正文区域宽度
4. WHEN 用户切换到 "Code" 模式 THEN 系统 SHALL 显示该 Page 的完整 HTML 源代码，使用等宽字体和语法高亮渲染（可使用简单的 `<pre><code>` 样式）
5. WHEN Page 编辑器渲染 THEN 整体页面框架（顶部导航栏、侧边栏、评论区等）SHALL 与 Smart Canvas 和 Smart Sheet 保持一致

### 需求 2：Page 发布功能

**用户故事：** 作为一名 Demo 演示者，我希望点击"发布"按钮后能生成一个公开访问链接，以便展示 Page 可以被发布到互联网上的能力。

#### 验收标准

1. WHEN Page 编辑器加载 THEN 右上角工具栏区域 SHALL 显示一个"发布"按钮（Publish），使用醒目的主色调样式
2. WHEN 用户点击"发布"按钮 THEN 系统 SHALL 生成一个模拟的公开访问地址，格式为 `https://mindx.tencent.com/p/{randomId}`，其中 `{randomId}` 为 8 位随机字母数字字符串
3. WHEN 发布地址生成后 THEN 系统 SHALL 弹出一个发布成功弹窗，显示：
   - 3.1 公开访问地址（可点击复制）
   - 3.2 "已发布到互联网" 的状态提示
   - 3.3 一个"复制链接"按钮
4. WHEN 用户点击"复制链接" THEN 系统 SHALL 将地址复制到剪贴板，并显示"已复制"的反馈
5. IF Page 已经发布过 THEN "发布"按钮 SHALL 变为"已发布"状态，点击后显示已有的发布地址（不重新生成）

### 需求 3：WorkspaceDoc 类型扩展 — 支持 Page 的 HTML 内容

**用户故事：** 作为一名开发者，我希望 WorkspaceDoc 类型能承载 Page 的 HTML 源代码，以便 Page 编辑器能正确读取和渲染内容。

#### 验收标准

1. WHEN WorkspaceDoc 的 type 为 "Page" THEN 该文档 SHALL 包含一个可选的 `htmlContent` 字段（`string` 类型），存储完整的 HTML 源代码
2. WHEN Page 编辑器加载 THEN 系统 SHALL 优先从 `contextDoc.htmlContent` 读取 HTML 内容，若不存在则显示空白占位
3. WHEN WorkspaceDoc 的 type 为 "Page" THEN 该文档 SHALL 可选包含一个 `boundSheets` 字段（`string[]` 类型），记录该 Page 绑定的 Smart Sheet ID 列表，用于展示数据绑定关系

### 需求 4：ToB 场景 Page — 华中区-星巴克加盟商订货看板

**用户故事：** 作为一名 Demo 演示者，我希望在 toB workspace 中通过 AI Chat 生成一个经销商专属门户网页，以便展示 Page 品类在 B2B 场景下的应用能力。

#### 验收标准

**4.1 AI Chat 预设指令**

1. WHEN toB workspace 激活且用户在 AI Chat 中发送预设指令"为华中区星巴克加盟商生成专属订货看板" THEN 系统 SHALL 显示结构化 Mock 回复：
   - 1.1 回复内容包含："已为您生成《华中区-星巴克加盟商订货看板》。该页面包含两个核心模块：动态商品视图（绑定全局库存表，已预设 SKU 过滤器和专属折扣）和履约进度视图（绑定订单流水表，展示在途订单）。"
   - 1.2 回复中包含指向新生成的 Page 文档的可点击链接
   - 1.3 回复中说明该页面可通过"发布"按钮生成对外链接，嵌入企业微信或作为独立服务号菜单使用
2. WHEN 该指令执行 THEN 系统 SHALL 产生 sideEffect：在文档列表中新增一个 Page 类型文档

**4.2 Page 文档内容 — 动态商品视图（Live Catalog）**

3. WHEN 用户打开《华中区-星巴克加盟商订货看板》THEN 页面 SHALL 包含一个"动态商品视图"区域，以表格/卡片形式展示以下信息：
   - 3.1 商品名称、SKU 编号、规格
   - 3.2 当前可用库存（绑定 `sheet-inventory` 全局库存表）
   - 3.3 实时指导价（基准价 × 该客户专属折扣率 9 折，数据来源标注为 `sheet-crm`）
   - 3.4 仅展示对该经销商开放的 SKU（预设过滤器）
4. WHEN 底层 `sheet-inventory` 的库存数据更新 THEN 页面中对应商品的"当前可用库存"SHALL 标注"实时同步"标识（演示阶段为静态标注，展示概念）

**4.3 Page 文档内容 — 履约进度视图（Order Tracking）**

5. WHEN 用户打开《华中区-星巴克加盟商订货看板》THEN 页面 SHALL 包含一个"履约进度视图"区域，以时间线/表格形式展示以下信息：
   - 5.1 订单编号、下单日期、商品明细
   - 5.2 当前状态（待确认 / 生产中 / 已发货 / 已签收）
   - 5.3 预计到货日期
   - 5.4 数据绑定标注为 `sheet-orders`（订单流水表）
6. WHEN 页面渲染 THEN 履约进度视图 SHALL 包含至少 2 条在途订单记录

**4.4 Page 文档内容 — Action Block（一键补货）**

7. WHEN 用户打开《华中区-星巴克加盟商订货看板》THEN 页面 SHALL 包含一个"一键补货"按钮区域
8. WHEN 页面渲染 THEN "一键补货"按钮 SHALL 显示为可交互的 CTA 样式，点击后显示"补货请求已提交，订单将在 Order_DB 中生成待审核记录"的 Toast 提示（演示阶段为模拟交互）

**4.5 HTML 内容要求**

9. WHEN Page 的 HTML 源代码渲染 THEN 页面 SHALL 呈现现代化的 B2B 门户风格：
   - 9.1 顶部包含品牌标识区域（"MindX × 星巴克华中区"）和经销商信息
   - 9.2 使用卡片式布局，商品视图和订单追踪分区清晰
   - 9.3 配色方案使用专业的商务风格（深色导航 + 白色内容区）
   - 9.4 包含"数据实时同步"的状态指示器（绿色圆点 + "Live" 标签）
   - 9.5 响应式设计，适配桌面和移动端预览
10. WHEN Code 模式查看 THEN HTML 源代码 SHALL 为完整的单文件 HTML（包含内联 CSS 和 JS），结构清晰、注释完善

### 需求 5：ToC 场景 Page — 浩哥财富视图

**用户故事：** 作为一名 Demo 演示者，我希望在 toC workspace 中通过 AI Chat 生成一个个人财富控制中心网页，以便展示 Page 品类在 C 端个人场景下的应用能力。

#### 验收标准

**5.1 AI Chat 预设指令**

1. WHEN toC workspace 激活且用户在 AI Chat 中发送预设指令"生成我的财富视图 Dashboard" THEN 系统 SHALL 显示结构化 Mock 回复：
   - 1.1 回复内容包含："已为您生成《浩哥财富视图》。该页面嵌入两个核心 Block：资产净值分布饼图（绑定全球资产配置总表）和下周续费提醒（绑定高价值信息订阅账簿）。支持发布为手机桌面 Widget 或 PWA 轻应用。"
   - 1.2 回复中包含指向新生成的 Page 文档的可点击链接
   - 1.3 回复中说明当持仓价格变动或记录新开销时，Widget 上的数据会基于 CRDT 协议静默刷新
2. WHEN 该指令执行 THEN 系统 SHALL 产生 sideEffect：在文档列表中新增一个 Page 类型文档

**5.2 Page 文档内容 — 动态 NAV 饼图 Block**

3. WHEN 用户打开《浩哥财富视图》THEN 页面 SHALL 包含一个"资产净值分布"区域，以饼图/环形图形式展示以下信息：
   - 3.1 各资产类别（Equity / Crypto / Cash / Real Estate / Fund）的 NAV 占比
   - 3.2 总资产净值数字（醒目展示）
   - 3.3 数据绑定标注为 `toc-sheet-asset-nav`（全球资产配置总表）
   - 3.4 每个扇区可显示具体金额和百分比
4. WHEN 页面渲染 THEN 饼图数据 SHALL 与 `toc-sheet-asset-nav` 表格中的资产类别和 NAV 数据保持一致

**5.3 Page 文档内容 — 下周续费提醒 Block**

5. WHEN 用户打开《浩哥财富视图》THEN 页面 SHALL 包含一个"下周续费提醒"区域，以列表/卡片形式展示以下信息：
   - 5.1 即将到期的订阅服务名称
   - 5.2 续费金额和到期日期
   - 5.3 核心价值标签
   - 5.4 数据绑定标注为 `toc-sheet-alpha-sub`（高价值信息订阅账簿）
6. WHEN 页面渲染 THEN 续费提醒 SHALL 筛选出下次扣费日在未来 7 天内的订阅记录

**5.4 HTML 内容要求**

7. WHEN Page 的 HTML 源代码渲染 THEN 页面 SHALL 呈现极简的个人 Dashboard 风格：
   - 7.1 顶部包含用户头像区域和"浩哥的财富视图"标题
   - 7.2 使用深色主题（暗色背景 + 亮色数据），营造金融终端质感
   - 7.3 饼图使用 CSS/SVG 实现（无需引入 Chart.js 等外部库），颜色区分各资产类别
   - 7.4 包含"CRDT 实时同步"的状态指示器和最后更新时间
   - 7.5 底部包含"Powered by MindX · 数据来源：Smart Sheet"的水印
   - 7.6 适配移动端 Widget 尺寸（紧凑布局）
8. WHEN Code 模式查看 THEN HTML 源代码 SHALL 为完整的单文件 HTML，包含 SVG 饼图实现和响应式样式

### 需求 6：AI Chat sideEffect 扩展 — 支持 Page 文档创建

**用户故事：** 作为一名开发者，我希望 AI Chat 的 sideEffect 机制能支持创建 Page 类型文档，以便通过预设指令触发 Page 文件的生成。

#### 验收标准

1. WHEN ChatPreset 的 sideEffect 类型定义 THEN 系统 SHALL 新增 `"createToBPage"` 和 `"createToCPage"` 两个 sideEffect 类型
2. WHEN `"createToBPage"` sideEffect 执行 THEN 系统 SHALL 调用 `addDocument()` 在文档列表中新增《华中区-星巴克加盟商订货看板》Page 文档，包含完整的 `htmlContent` 和 `boundSheets` 数据
3. WHEN `"createToCPage"` sideEffect 执行 THEN 系统 SHALL 调用 `addDocument()` 在文档列表中新增《浩哥财富视图》Page 文档，包含完整的 `htmlContent` 和 `boundSheets` 数据
4. WHEN Page 文档创建成功 THEN 文档列表中该文档 SHALL 显示 Page 类型图标，且标记为 `isNew: true`（如适用）

### 需求 7：ToB 活动流更新

**用户故事：** 作为一名 Demo 演示者，我希望 toB workspace 的活动流中包含 Page 相关的操作记录，以便在 Dashboard 中展示 Agent 生成网页的能力。

#### 验收标准

1. WHEN toB workspace 激活且 Page 文档已通过 AI Chat 创建 THEN Activity Feed SHALL 包含一条"AI Agent 生成了《华中区-星巴克加盟商订货看板》"的活动记录
2. WHEN 活动记录渲染 THEN targetType SHALL 为 "Page"，与现有的 "Smart Sheet" / "Smart Canvas" 活动记录格式一致

### 需求 8：ToC 活动流更新

**用户故事：** 作为一名 Demo 演示者，我希望 toC workspace 的活动流中包含 Page 相关的操作记录。

#### 验收标准

1. WHEN toC workspace 激活且 Page 文档已通过 AI Chat 创建 THEN Activity Feed SHALL 包含一条"AI Agent 生成了《浩哥财富视图》"的活动记录
2. WHEN 活动记录渲染 THEN targetType SHALL 为 "Page"

### 需求 9：设计系统引用 — 分别为 ToB / ToC 场景指定 DESIGN.md

**用户故事：** 作为一名开发者，我希望 ToB 和 ToC 两个 Page 场景分别遵循不同的设计系统规范，以便生成的 HTML 页面在视觉风格上更加专业和一致。

#### 验收标准

1. WHEN 项目初始化 THEN 项目根目录 SHALL 包含两个设计系统文件：`DESIGN-STRIPE.md`（通过 `npx getdesign@latest add stripe` 生成后重命名）和 `DESIGN-REVOLUT.md`（通过 `npx getdesign@latest add revolut` 生成后重命名）
2. WHEN 编写 ToB 场景 Page 的 HTML 源代码 THEN 开发者 SHALL 参考 `DESIGN-STRIPE.md` 中的设计规范（Stripe 风格：清晰的排版层级、专业的商务配色、精致的间距和圆角），确保《华中区-星巴克加盟商订货看板》的视觉风格与 Stripe 设计语言一致
3. WHEN 编写 ToC 场景 Page 的 HTML 源代码 THEN 开发者 SHALL 参考 `DESIGN-REVOLUT.md` 中的设计规范（Revolut 风格：深色主题、金融终端质感、紧凑的数据密度、现代化的卡片布局），确保《财富视图》的视觉风格与 Revolut 设计语言一致
4. WHEN 两个 DESIGN.md 文件共存于项目根目录 THEN 文件名 SHALL 分别为 `DESIGN-STRIPE.md` 和 `DESIGN-REVOLUT.md`，避免默认文件名冲突

---

## 技术约束与边界

- **数据结构扩展**：`WorkspaceDoc` 接口需新增可选字段 `htmlContent?: string` 和 `boundSheets?: string[]`，用于 Page 类型文档。现有的 `blocks` 和 `sheetData` 字段对 Page 类型不适用
- **iframe 沙箱安全**：使用 `<iframe sandbox="allow-scripts allow-same-origin" srcdoc={htmlContent}>` 渲染，确保脚本可执行但不影响宿主页面
- **HTML 内容为静态 Mock**：演示阶段的 HTML 内容为预设的完整单文件 HTML，不涉及真实的 API 调用或数据库连接。"实时同步"和"CRDT 协议"为概念展示，通过 UI 标注体现
- **sideEffect 类型扩展**：`ChatPreset.sideEffect` 的类型联合需新增 `"createToBPage"` 和 `"createToCPage"`，并在 `AIChatFloat.executeSideEffect` 中实现对应逻辑
- **ID 命名规范**：toB Page 使用 `page-tob-client-portal` 前缀，toC Page 使用 `toc-page-wealth-dashboard` 前缀
- **现有数据不变**：本次迭代不修改任何现有的 toB / toC Mock 数据（Smart Sheet、Smart Canvas），仅新增 Page 类型文档和对应的 AI Chat 预设指令
- **发布功能为模拟**：发布按钮生成的 URL 为前端模拟，不涉及真实的域名解析或服务器部署。URL 格式固定为 `https://mindx.tencent.com/p/{randomId}`
- **Code 模式语法高亮**：使用简单的 CSS 类名实现基础的 HTML 语法高亮（关键字着色），不引入 Prism.js / highlight.js 等外部库，保持 Demo 轻量
- **boundSheets 为展示性字段**：`boundSheets` 字段用于在 Page 编辑器中展示"已绑定的数据源"信息面板，不涉及真实的数据流订阅
