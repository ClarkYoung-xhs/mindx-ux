# 实施计划：知识图谱（Knowledge Graph）

- [ ] 1. 安装 `react-force-graph` 依赖并定义知识图谱数据类型
  - 运行 `npm install react-force-graph-3d` 安装 3D 力导向图渲染库（基于 Three.js）
  - 在 `src/types/` 下创建 `knowledgeGraph.ts`，定义图谱数据的 TypeScript 类型接口：
    - `KnowledgeGraphNode`：包含 `id`、`name`、`type`（`'canvas' | 'sheet' | 'card'`）、`group` 等字段
    - `KnowledgeGraphLink`：包含 `source`、`target` 字段
    - `KnowledgeGraphData`：包含 `nodes: KnowledgeGraphNode[]` 和 `links: KnowledgeGraphLink[]`
  - _需求：3.1、4.2_

- [ ] 2. 创建知识图谱 Mock 数据文件
  - 在 `src/data/` 下创建 `knowledgeGraphMockData.ts`
  - 构造一组通用的假数据，包含 8–12 个节点（混合 canvas、sheet、card 三种类型）和 10–15 条连接关系
  - 导出 `getKnowledgeGraphData(docId: string): KnowledgeGraphData` 函数，根据文档 ID 返回对应图谱数据
  - 当传入的 `docId` 无匹配数据时，返回一个默认的通用图谱数据集
  - 确保当前文档节点在返回数据中被标记（如 `isCurrent: true`），以便渲染时高亮
  - _需求：4.1、4.2、4.3、4.4、4.5、4.6_

- [ ] 3. 实现 `KnowledgeGraphPanel` 侧边栏组件
  - 在 `src/components/` 下创建 `KnowledgeGraph/KnowledgeGraphPanel.tsx`
  - 组件接收 `isOpen: boolean`、`onClose: () => void`、`docId: string` 等 props
  - 使用 `motion` 库实现从右侧滑入/滑出的动画效果（`AnimatePresence` + `motion.div`）
  - 侧边栏宽度约 440px，overlay 模式覆盖在文档内容之上，带半透明背景遮罩
  - 顶部标题栏显示"知识图谱"/"Knowledge Graph"（根据 `useLanguage()` 的 `lang` 判断），右侧放置关闭按钮（`X` 图标）
  - 点击遮罩层（侧边栏外部区域）触发 `onClose`
  - 视觉风格与项目一致：白色背景、`stone` 色系边框和阴影（`border-stone-200`、`shadow-xl`）
  - _需求：2.1、2.2、2.3、2.4、2.5、2.6、2.7_

- [ ] 4. 实现 `KnowledgeGraph3D` 3D 图谱渲染组件
  - 在 `src/components/KnowledgeGraph/KnowledgeGraph3D.tsx` 中创建图谱渲染组件
  - 使用 `React.lazy` + `Suspense` 懒加载 `react-force-graph-3d`，避免影响主页面加载性能
  - 组件接收 `data: KnowledgeGraphData` 和 `currentDocId: string` 作为 props
  - 调用 `getKnowledgeGraphData(docId)` 获取图谱数据并传入 `ForceGraph3D` 组件
  - 配置节点渲染：
    - 当前文档节点使用更大尺寸（如 `val: 3`）和高亮色（橙色 `#f97316`）
    - canvas 类型节点使用蓝色（`#3b82f6`）
    - sheet 类型节点使用绿色（`#22c55e`）
    - card 类型节点使用紫色（`#a855f7`）
  - 配置连接线为半透明样式（`linkOpacity: 0.3`）
  - 配置 hover 时显示节点名称标签（`nodeLabel` 属性）
  - 配置点击非当前文档节点时，使用 `useNavigate` 导航到对应文档详情页
  - 图谱自适应侧边栏容器尺寸（监听容器宽高变化）
  - 加载中显示 loading spinner，数据为空时显示空状态提示
  - _需求：3.1、3.2、3.3、3.4、3.5、3.6、3.7、3.8、3.9、3.10、5.1、5.2_

- [ ] 5. 在国际化配置中添加知识图谱相关翻译
  - 在 `src/i18n/LanguageContext.tsx` 的 `translations` 对象中，为 `en` 和 `zh` 分别添加：
    - `"knowledgeGraph.title"`: `"Knowledge Graph"` / `"知识图谱"`
    - `"knowledgeGraph.empty"`: `"No linked documents"` / `"暂无关联文档"`
    - `"knowledgeGraph.loading"`: `"Loading graph..."` / `"加载图谱中..."`
  - _需求：1.2、2.2、5.2_

- [ ] 6. 在 `V2DocumentDetailPage` 的下拉菜单中集成"知识图谱"入口
  - 在 `src/pages/v2/V2DocumentDetailPage.tsx` 中：
    - 新增 `showKnowledgeGraph` 状态（`useState<boolean>(false)`）
    - 在 `showMoreMenu` 下拉菜单中，"导出为"按钮之后、分隔线之前，添加"知识图谱"菜单项
    - 菜单项使用 `Network` 图标（从 `lucide-react` 导入），文字根据 `lang` 显示中/英文
    - 点击后设置 `showKnowledgeGraph(true)` 并关闭下拉菜单
    - 在页面 JSX 末尾渲染 `<KnowledgeGraphPanel>` 组件，传入 `isOpen`、`onClose`、`docId` props
  - _需求：1.1、1.2、1.3、1.4、1.5_

- [ ] 7. 在 `DocumentEditor`（v1）的下拉菜单中集成"知识图谱"入口
  - 在 `src/pages/DocumentEditor.tsx` 中：
    - 新增 `showKnowledgeGraph` 状态
    - 在 `showMoreMenu` 下拉菜单中，"导出为"子菜单区域之后、分隔线之前，添加"知识图谱"菜单项
    - 菜单项使用 `Network` 图标，文字显示"知识图谱"（v1 页面目前硬编码中文）
    - 点击后设置 `showKnowledgeGraph(true)` 并关闭下拉菜单和导出子菜单
    - 在页面 JSX 末尾渲染 `<KnowledgeGraphPanel>` 组件
  - _需求：1.1、1.3、1.4、1.5_

- [ ] 8. 组件卸载时销毁 3D 图谱实例以释放资源
  - 在 `KnowledgeGraph3D.tsx` 中，使用 `useEffect` 的 cleanup 函数，在组件卸载时调用 ForceGraph3D 的 ref 方法（如 `graphRef.current?.pauseAnimation()`）停止渲染循环
  - 在 `KnowledgeGraphPanel.tsx` 中，确保 `isOpen` 为 `false` 时通过 `AnimatePresence` 的 `onExitComplete` 彻底卸载 3D 组件（而非仅隐藏），从而释放 GPU/内存资源
  - 节点标签文字超过 15 个字符时截断并显示省略号
  - _需求：5.4、5.5、5.6_

- [ ] 9. 创建 `KnowledgeGraph/index.ts` 导出文件并整理模块
  - 在 `src/components/KnowledgeGraph/index.ts` 中统一导出 `KnowledgeGraphPanel` 组件
  - 确保所有新文件的 import 路径正确，TypeScript 类型无报错
  - 验证 `npm run build` 能正常通过编译
  - _需求：全部_
