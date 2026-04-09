# 需求文档：知识图谱（Knowledge Graph）

## 引言

本功能为 MindX 文档编辑器新增"知识图谱"能力。当用户打开一篇文档时，可通过右上角"三个点"（`MoreHorizontal`）下拉菜单中的"知识图谱"选项，在页面右侧拉起一个侧边栏面板，以 **3D 球形连接图** 的形式，可视化展示当前文档与其他文档/知识卡片之间的引用和双向链接关系，形成一个直观的知识网络。

**技术背景：**

- 项目技术栈：React 19 + TypeScript + Vite + Tailwind CSS + motion（动画）+ lucide-react（图标）
- 涉及的页面：`V2DocumentDetailPage.tsx`（v2 文档详情页）和 `DocumentEditor.tsx`（v1 文档编辑器）
- 项目已有 `CrossReference` 双向链接数据结构（`src/types/crossRef.ts`）和 mock 数据（`src/data/crossReferences.ts`）
- 当前为 demo 阶段，图谱数据使用独立的假数据，不需要与现有 `CrossReference` 数据真正关联
- 3D 图谱渲染采用成熟且轻量的开源框架（推荐 `react-force-graph`，基于 Three.js 的 3D 力导向图）

---

## 需求

### 需求 1：下拉菜单新增"知识图谱"入口

**用户故事：** 作为一名文档用户，我希望在文档编辑器右上角"三个点"下拉菜单中看到"知识图谱"选项，以便快速访问当前文档的知识关联网络。

#### 验收标准

1. WHEN 用户点击文档编辑器右上角的"三个点"（MoreHorizontal）按钮 THEN 系统 SHALL 在下拉菜单中展示"知识图谱"菜单项，包含一个合适的图标（如 `Network` 或 `GitBranch` 图标）和文字标签
2. IF 当前语言为中文 THEN 系统 SHALL 显示"知识图谱"标签；IF 当前语言为英文 THEN 系统 SHALL 显示"Knowledge Graph"标签
3. WHEN 用户点击"知识图谱"菜单项 THEN 系统 SHALL 关闭下拉菜单并打开右侧知识图谱侧边栏
4. "知识图谱"菜单项 SHALL 位于下拉菜单中"导出"选项之后、分隔线之前的位置（或其他合理位置）
5. 该入口 SHALL 同时在 `V2DocumentDetailPage`（v2）和 `DocumentEditor`（v1）两个页面中实现

---

### 需求 2：右侧知识图谱侧边栏

**用户故事：** 作为一名文档用户，我希望点击"知识图谱"后在页面右侧弹出一个侧边栏面板，以便在不离开当前文档的情况下查看知识关联。

#### 验收标准

1. WHEN 用户触发"知识图谱"操作 THEN 系统 SHALL 从页面右侧滑入一个侧边栏面板，宽度约为 400–480px
2. 侧边栏 SHALL 包含一个顶部标题栏，显示"知识图谱"/"Knowledge Graph"标题和一个关闭按钮（X 图标）
3. WHEN 用户点击关闭按钮 THEN 系统 SHALL 以滑出动画关闭侧边栏
4. 侧边栏的打开和关闭 SHALL 使用平滑的滑入/滑出过渡动画（使用 `motion` 库）
5. 侧边栏 SHALL 覆盖在文档内容之上（overlay 模式），不影响文档内容区域的布局
6. WHEN 侧边栏打开时，用户点击侧边栏外部区域 THEN 系统 SHALL 关闭侧边栏
7. 侧边栏的视觉风格 SHALL 与项目现有的 UI 风格保持一致（白色背景、stone 色系边框和阴影）

---

### 需求 3：3D 球形知识图谱渲染

**用户故事：** 作为一名文档用户，我希望在侧边栏中看到一个 3D 球形连接图，以便直观地理解当前文档与其他文档/知识卡片之间的关联关系。

#### 验收标准

1. 系统 SHALL 使用 `react-force-graph`（`react-force-graph-3d`）开源库渲染 3D 力导向图
2. 图谱 SHALL 以当前文档为中心节点，周围分布与之有引用或双向链接关系的其他文档节点和知识卡片节点
3. 当前文档的中心节点 SHALL 以高亮样式（更大尺寸、不同颜色如品牌色/蓝色）区分于其他节点
4. 不同类型的节点 SHALL 使用不同的颜色进行区分：
   - Smart Canvas 文档节点：一种颜色（如蓝色）
   - Smart Sheet 文档节点：另一种颜色（如绿色）
   - 知识卡片节点：第三种颜色（如紫色）
   - 当前文档节点：高亮色（如橙色或品牌色）
5. 节点之间的连接线 SHALL 表示引用或双向链接关系，连接线可使用半透明样式
6. WHEN 用户将鼠标悬停在某个节点上 THEN 系统 SHALL 显示该节点的名称标签（tooltip 或直接标签）
7. WHEN 用户点击某个非当前文档的节点 THEN 系统 SHALL 导航到该文档的详情页
8. 图谱 SHALL 支持鼠标拖拽旋转、滚轮缩放等基本 3D 交互操作（`react-force-graph-3d` 内置支持）
9. 图谱 SHALL 在侧边栏容器内自适应尺寸，填满可用空间
10. 图谱初始加载时 SHALL 有一个自然的力导向布局动画，节点从中心散开到稳定位置

---

### 需求 4：知识图谱 Mock 数据

**用户故事：** 作为一名开发者，我希望有一套独立的知识图谱假数据，以便在 demo 阶段展示图谱效果，而不需要与现有的 CrossReference 数据真正关联。

#### 验收标准

1. 系统 SHALL 在 `src/data/` 目录下创建一个独立的知识图谱 mock 数据文件（如 `knowledgeGraphMockData.ts`）
2. Mock 数据 SHALL 包含以下结构：
   - 节点列表（nodes）：每个节点包含 `id`、`name`（显示名称）、`type`（文档类型：canvas / sheet / card）、`group`（分组，用于着色）
   - 连接列表（links）：每个连接包含 `source`（源节点 id）、`target`（目标节点 id）
3. Mock 数据 SHALL 为每个可打开的文档提供一组图谱数据，至少包含 8–12 个关联节点和 10–15 条连接关系
4. Mock 数据中 SHALL 包含不同类型的节点（Smart Canvas、Smart Sheet、知识卡片），以展示多样化的图谱效果
5. Mock 数据 SHALL 提供一个根据当前文档 ID 获取对应图谱数据的函数（如 `getKnowledgeGraphData(docId: string)`）
6. IF 当前文档 ID 没有对应的图谱数据 THEN 系统 SHALL 返回一个默认的通用图谱数据集

---

### 需求 5：边界情况与用户体验

**用户故事：** 作为一名文档用户，我希望知识图谱功能在各种边界情况下都能正常工作，提供良好的用户体验。

#### 验收标准

1. WHEN 图谱数据正在加载时 THEN 系统 SHALL 在侧边栏中显示一个加载状态（如 loading spinner 或骨架屏）
2. IF 当前文档没有任何关联节点 THEN 系统 SHALL 显示一个空状态提示（如"暂无关联文档"/"No linked documents"）
3. 侧边栏 SHALL 在不同屏幕尺寸下正常显示，不会溢出或遮挡关键操作区域
4. 3D 图谱渲染 SHALL 不影响文档编辑器的性能，图谱组件 SHALL 使用懒加载（lazy loading）方式引入
5. WHEN 侧边栏关闭时 THEN 系统 SHALL 销毁 3D 图谱实例以释放 GPU/内存资源
6. 图谱中的节点标签文字 SHALL 清晰可读，避免过长文字溢出（超过一定长度时截断并显示省略号）
