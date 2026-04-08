// Dashboard-local constants, mock data, and utility functions
import type {
  WorkspaceDoc,
  AbsenceSummaryData,
  Activity,
  DemoMode,
} from "./types";

export const initialWorkspaces = [{ id: "w1", name: "Main Space" }];

export const initialAgents = [
  {
    id: "a1",
    name: "Claude Assistant",
    token: "mx_agt_9f8e7d6c5b4a3",
    connected: true,
    createdAt: "2026-03-10T10:00:00Z",
    installedSkills: ["MindX Docs", "MindX Memory", "Daily Update"],
  },
  {
    id: "a2",
    name: "Data Analyzer",
    token: "mx_agt_1a2b3c4d5e6f7",
    connected: true,
    createdAt: "2026-03-15T14:30:00Z",
    installedSkills: ["MindX Docs"],
  },
  {
    id: "a3",
    name: "Research Bot",
    token: "mx_agt_8x7y6z5w4v3u2",
    connected: false,
    createdAt: "2026-03-20T09:00:00Z",
    installedSkills: [],
  },
];

export const normalizeDocType = (type: string) =>
  type.toLowerCase().replace(/\s+/g, "");

export const currentUser = {
  id: "u1",
  name: localStorage.getItem("mindx_user_name") || "Me",
  email: localStorage.getItem("mindx_logged_in") || "you@example.com",
};

export const activeWorkspaceIdGlobal =
  localStorage.getItem("mindx_workspace_id") || "w1";

export function isProfilePlaceholder(value: string) {
  const normalized = value.trim();
  return normalized === "加载中..." || normalized === "Loading...";
}

export const initialPermissions = [
  {
    id: "p1",
    workspaceId: "w1",
    memberId: currentUser.id,
    memberType: "Human",
    role: "Owner",
  },
  {
    id: "p3",
    workspaceId: "w1",
    memberId: "a1",
    memberType: "Agent",
    role: "Editor",
  },
  {
    id: "p4",
    workspaceId: "w1",
    memberId: "a2",
    memberType: "Agent",
    role: "Viewer",
  },
  {
    id: "p7",
    workspaceId: "w1",
    memberId: "a3",
    memberType: "Agent",
    role: "Admin",
  },
];

export const initialDocuments: WorkspaceDoc[] = [
  // === Smart Sheet (4 tables) ===
  {
    id: "sheet-inventory",
    workspaceId: "w1",
    name: "全局 SKU 与动态库存表",
    type: "Smart Sheet",
    date: "Today",
    lastModified: "2026-04-08T10:00:00Z",
    lastViewed: "2026-04-08T14:00:00Z",
    labels: ["Inventory", "SKU", "Supply Chain"],
    creatorName: "Data Analyzer",
    creatorType: "agent",
    size: 32768,
    isNew: true,
    isRead: false,
    source: "normal",
  },
  {
    id: "sheet-crm",
    workspaceId: "w1",
    name: "B2B 客户档案与授信表",
    type: "Smart Sheet",
    date: "Yesterday",
    lastModified: "2026-04-07T16:00:00Z",
    lastViewed: "2026-04-08T09:00:00Z",
    labels: ["CRM", "B2B", "Credit"],
    creatorName: currentUser.name,
    creatorType: "human",
    size: 28672,
    isRead: true,
    source: "normal",
  },
  {
    id: "sheet-orders",
    workspaceId: "w1",
    name: "全渠道业务订单流水大表",
    type: "Smart Sheet",
    date: "Today",
    lastModified: "2026-04-08T12:30:00Z",
    lastViewed: "2026-04-08T13:00:00Z",
    labels: ["Orders", "Fulfillment"],
    creatorName: "Claude Assistant",
    creatorType: "agent",
    size: 45056,
    isNew: true,
    isRead: false,
    source: "normal",
  },
  {
    id: "sheet-suppliers",
    workspaceId: "w1",
    name: "供应商与产能评估表",
    type: "Smart Sheet",
    date: "2 days ago",
    lastModified: "2026-04-06T14:00:00Z",
    lastViewed: "2026-04-08T08:00:00Z",
    labels: ["Suppliers", "Capacity"],
    creatorName: "Data Analyzer",
    creatorType: "agent",
    size: 24576,
    isRead: true,
    source: "normal",
  },
  // === Smart Canvas (3 documents) ===
  {
    id: "canvas-client-visit",
    workspaceId: "w1",
    name: "重点客户 Q1 拜访与授信调整纪要",
    type: "Smart Canvas",
    date: "3 weeks ago",
    lastModified: "2026-03-15T18:00:00Z",
    lastViewed: "2026-04-08T10:30:00Z",
    labels: ["客情维系", "S级客户"],
    creatorName: currentUser.name,
    creatorType: "human",
    size: 38912,
    isRead: true,
    source: "normal",
  },
  {
    id: "canvas-supply-alert",
    workspaceId: "w1",
    name: "Q2 华东区供应链异常预警报告",
    type: "Smart Canvas",
    date: "Yesterday",
    lastModified: "2026-04-07T09:00:00Z",
    lastViewed: "2026-04-08T11:00:00Z",
    labels: ["供应链预警", "风险"],
    creatorName: "Claude Assistant",
    creatorType: "agent",
    size: 33792,
    isNew: true,
    isRead: false,
    source: "normal",
  },
  {
    id: "canvas-client-portal",
    workspaceId: "w1",
    name: "客户专属采购工作台（老王专区）",
    type: "Smart Canvas",
    date: "Today",
    lastModified: "2026-04-08T08:00:00Z",
    lastViewed: "2026-04-08T14:30:00Z",
    labels: ["客户门户", "老王"],
    creatorName: "Claude Assistant",
    creatorType: "agent",
    size: 40960,
    isNew: true,
    isRead: false,
    source: "normal",
  },
];

export const initialActivities: Activity[] = [
  // === Today (Apr 8) ===
  {
    id: "act1",
    workspaceId: "w1",
    userId: "a2",
    userName: "Data Analyzer",
    userType: "agent",
    action: "updated",
    actionZh: "更新了",
    targetName: "全局 SKU 与动态库存表",
    targetType: "Smart Sheet",
    docId: "sheet-inventory",
    details:
      "Updated real-time inventory: 经典款陶瓷马克杯 stock reduced to 200 units",
    detailsZh: "更新了实时库存：经典款陶瓷马克杯库存降至 200 件",
    timestamp: "2026-04-08T10:00:00Z",
  },
  {
    id: "act2",
    workspaceId: "w1",
    userId: "a1",
    userName: "Claude Assistant",
    userType: "agent",
    action: "created",
    actionZh: "创建了",
    targetName: "全渠道业务订单流水大表",
    targetType: "Smart Sheet",
    docId: "sheet-orders",
    details:
      "New order ORD-20260408-001: 老王 requests 500 经典款陶瓷马克杯, deadline Apr 10",
    detailsZh:
      "新订单 ORD-20260408-001：老王订购 500 个经典款陶瓷马克杯，截止日期 4 月 10 日",
    timestamp: "2026-04-08T12:30:00Z",
  },
  {
    id: "act3",
    workspaceId: "w1",
    userId: "a1",
    userName: "Claude Assistant",
    userType: "agent",
    action: "updated",
    actionZh: "更新了",
    targetName: "客户专属采购工作台（老王专区）",
    targetType: "Smart Canvas",
    docId: "canvas-client-portal",
    details:
      "Refreshed embedded views: updated pricing and order tracking for 老王",
    detailsZh: "刷新了嵌入视图：更新了老王的报价和订单追踪",
    timestamp: "2026-04-08T08:00:00Z",
  },
  {
    id: "act4",
    workspaceId: "w1",
    userId: "u1",
    userName: currentUser.name,
    userType: "human",
    action: "commented on",
    actionZh: "评论了",
    targetName: "全渠道业务订单流水大表",
    targetType: "Smart Sheet",
    docId: "sheet-orders",
    details:
      "Flagged ORD-20260408-001: inventory insufficient, need procurement decision",
    detailsZh: "标记 ORD-20260408-001：库存不足，需要采购决策",
    timestamp: "2026-04-08T13:00:00Z",
  },
  {
    id: "act5",
    workspaceId: "w1",
    userId: "a3",
    userName: "Research Bot",
    userType: "agent",
    action: "commented on",
    actionZh: "评论了",
    targetName: "Q2 华东区供应链异常预警报告",
    targetType: "Smart Canvas",
    docId: "canvas-supply-alert",
    details:
      "Added analysis: environmental policy may extend to Q3, recommend diversifying suppliers",
    detailsZh: "补充分析：环保政策可能延续至 Q3，建议多元化供应商",
    timestamp: "2026-04-08T11:00:00Z",
  },
  // === Yesterday (Apr 7) ===
  {
    id: "act6",
    workspaceId: "w1",
    userId: "a1",
    userName: "Claude Assistant",
    userType: "agent",
    action: "created",
    actionZh: "创建了",
    targetName: "Q2 华东区供应链异常预警报告",
    targetType: "Smart Canvas",
    docId: "canvas-supply-alert",
    details:
      "Generated supply chain alert: environmental policy tightening affects East China kilns",
    detailsZh: "生成供应链预警：环保政策收紧影响华东窑炉",
    timestamp: "2026-04-07T09:00:00Z",
  },
  {
    id: "act7",
    workspaceId: "w1",
    userId: "a2",
    userName: "Data Analyzer",
    userType: "agent",
    action: "updated",
    actionZh: "更新了",
    targetName: "供应商与产能评估表",
    targetType: "Smart Sheet",
    docId: "sheet-suppliers",
    details:
      'Updated 景德镇宏图陶瓷 capacity status to "满载，可能延期" based on supply alert',
    detailsZh: '根据供应链预警更新景德镇宏图陶瓷产能状态为"满载，可能延期"',
    timestamp: "2026-04-07T10:00:00Z",
  },
  {
    id: "act8",
    workspaceId: "w1",
    userId: "u1",
    userName: currentUser.name,
    userType: "human",
    action: "modified",
    actionZh: "修改了",
    targetName: "B2B 客户档案与授信表",
    targetType: "Smart Sheet",
    docId: "sheet-crm",
    details:
      "Updated 老王 credit terms: confirmed S-tier rating and 10% discount",
    detailsZh: "更新老王授信条款：确认 S 级评级和 9 折优惠",
    timestamp: "2026-04-07T16:00:00Z",
  },
  // === Earlier ===
  {
    id: "act9",
    workspaceId: "w1",
    userId: "a2",
    userName: "Data Analyzer",
    userType: "agent",
    action: "created",
    actionZh: "创建了",
    targetName: "全局 SKU 与动态库存表",
    targetType: "Smart Sheet",
    docId: "sheet-inventory",
    details:
      "Initialized inventory database with 3 SKUs and real-time stock tracking",
    detailsZh: "初始化库存数据库，包含 3 个 SKU 和实时库存追踪",
    timestamp: "2026-04-05T10:00:00Z",
  },
  {
    id: "act10",
    workspaceId: "w1",
    userId: "u1",
    userName: currentUser.name,
    userType: "human",
    action: "created",
    actionZh: "创建了",
    targetName: "重点客户 Q1 拜访与授信调整纪要",
    targetType: "Smart Canvas",
    docId: "canvas-client-visit",
    details:
      "Documented Q1 client visit: 老王 expanding 3 new stores, agreed on ¥13.5/unit pricing",
    detailsZh: "记录 Q1 客户拜访：老王新增 3 家门店，协议价 13.5 元/个",
    timestamp: "2026-03-15T18:00:00Z",
  },
];

export const absenceLastVisitTime = "2026-03-24T08:00:00Z";

export const agentColorMap: Record<string, string> = {
  "Claude Assistant": "#F97316",
  "Research Bot": "#8B5CF6",
  "Data Analyzer": "#06B6D4",
};

// Derive absence summary from initialActivities — single source of truth
export const absenceSummaryData: AbsenceSummaryData = {
  lastVisitTime: absenceLastVisitTime,
  changes: initialActivities
    .filter(
      (a) =>
        a.userType === "agent" &&
        new Date(a.timestamp) > new Date(absenceLastVisitTime),
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .map((a) => {
      let action: "created" | "modified" | "commented" = "modified";
      if (a.action === "created") action = "created";
      else if (a.action === "commented on") action = "commented";
      else action = "modified"; // 'updated', 'modified' etc.
      return {
        id: a.docId || a.id,
        action,
        docTitle: a.targetName,
        docType: a.targetType,
        agentName: a.userName,
        agentColor: agentColorMap[a.userName] || "#94A3B8",
        changeDescription: a.detailsZh,
        timestamp: a.timestamp,
      };
    }),
};

// --- Demo mode: "new" = new user onboarding, "existing" = rich mock data ---
export const DEMO_MODE_KEY = "mindx_demo_mode";

export function getDemoMode(): DemoMode {
  const stored = localStorage.getItem(DEMO_MODE_KEY);
  if (stored === "existing") return "existing";
  if (stored === "new") return "new";
  // If no explicit demo mode set, fall back to isNewUser flag for backward compat
  return localStorage.getItem("mindx_is_new_user") === "true"
    ? "new"
    : "existing";
}
