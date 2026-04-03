export interface DemoWorkspace {
  id: string;
  name: string;
}

export interface DemoAgent {
  id: string;
  name: string;
  token: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
}

export interface DemoPermission {
  id: string;
  workspaceId: string;
  memberId: string;
  memberType: 'Human' | 'Agent';
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
}

export interface WorkspaceDoc {
  id: string;
  workspaceId: string;
  name: string;
  type: string;
  date: string;
  lastModified: string;
  lastViewed: string;
  labels: string[];
  creatorName: string;
  creatorType: 'human' | 'agent';
  size: number;
}

export interface Activity {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  userType: 'human' | 'agent';
  action: string;
  targetName: string;
  targetType: string;
  details?: string;
  timestamp: string;
}

export interface AgentPermission {
  agentId: string;
  agentName: string;
  permission: 'read' | 'edit';
}

export interface SourceLink {
  id: string;
  docId?: string;
  docName: string;
  kind: 'document' | 'comment' | 'chat' | 'report';
  storage?: 'workspace' | 'memory';
  dataSourceId?: string;
  summary: string;
  quote: string;
  timestamp: string;
  participants: string[];
}

export interface MemoryDataSource {
  id: string;
  name: string;
  category: 'manual-upload' | 'cloud-collaboration' | 'search-capture' | 'third-party-sync';
  typeLabel: string;
  status: 'ready' | 'syncing' | 'reviewing';
  summary: string;
  freshness: string;
  tags: string[];
  contentPreview: string[];
}

export interface MemoryEvent {
  id: string;
  dayLabel: string;
  timeLabel: string;
  occurredAt: string;
  stage: 'captured' | 'candidate' | 'durable';
  lane: 'extract' | 'refine' | 'mount';
  title: string;
  summary: string;
  docId: string;
  docName: string;
  actorName: string;
  actorType: 'human' | 'agent';
  sourceIds: string[];
  assetIds: string[];
  tags: string[];
}

export interface MemoryAsset {
  id: string;
  type: 'decision' | 'preference' | 'constraint' | 'insight' | 'follow-up';
  libraryCategory: 'project-judgment' | 'work-preference' | 'long-term-principle' | 'core-anchor' | 'pending';
  layer: 'L2' | 'L3' | 'L4';
  status: 'candidate' | 'review' | 'durable';
  title: string;
  summary: string;
  confidence: 'Low' | 'Medium' | 'High';
  freshness: string;
  sourceIds: string[];
  relatedAssetIds: string[];
  relatedEntities: string[];
  tags: string[];
  docIds: string[];
  evidence: string[];
  nextStep: string;
}

export interface MemoryInsight {
  id: string;
  kind: 'workstream' | 'preference' | 'relationship';
  title: string;
  body: string;
  signal: string;
  assetIds: string[];
}

export interface AgentConnection {
  id: string;
  name: string;
  provider: string;
  status: 'Connected' | 'Mounted' | 'Writing Back';
  workspaceRole: string;
  description: string;
  mountedAssetCount: number;
  readScopes: string[];
  writeScopes: string[];
  latestAction: string;
  latestWorkspaceDocId: string;
  latestWorkspaceDocName: string;
}

export interface DocumentMemoryMeta {
  count: number;
  status: 'forming' | 'stable' | 'active';
  latest: string;
}

export interface MountedMemoryPack {
  id: string;
  name: string;
  description: string;
  assetIds: string[];
  mountedByConnectionIds: string[];
}

export interface AgentWriteback {
  id: string;
  title: string;
  detail: string;
  assetId: string;
  docId: string;
  docName: string;
}

export const initialWorkspaces: DemoWorkspace[] = [
  { id: 'w1', name: 'Main Space' },
];

export const initialAgents: DemoAgent[] = [
  { id: 'a1', name: 'Claude Assistant', token: 'mx_agt_9f8e7d6c5b4a3' },
  { id: 'a2', name: 'Data Analyzer', token: 'mx_agt_1a2b3c4d5e6f7' },
  { id: 'a3', name: 'Research Bot', token: 'mx_agt_8x7y6z5w4v3u2' },
];

export const currentUser: DemoUser = {
  id: 'u1',
  name: 'Me',
  email: 'you@example.com',
};

export const initialPermissions: DemoPermission[] = [
  { id: 'p1', workspaceId: 'w1', memberId: currentUser.id, memberType: 'Human', role: 'Owner' },
  { id: 'p3', workspaceId: 'w1', memberId: 'a1', memberType: 'Agent', role: 'Editor' },
  { id: 'p4', workspaceId: 'w1', memberId: 'a2', memberType: 'Agent', role: 'Viewer' },
  { id: 'p7', workspaceId: 'w1', memberId: 'a3', memberType: 'Agent', role: 'Admin' },
];

export const initialDocuments: WorkspaceDoc[] = [
  {
    id: 'd1',
    workspaceId: 'w1',
    name: 'mindX 2.0 Memory 信息架构 PRD',
    type: 'Smart Doc',
    date: '2 hours ago',
    lastModified: '2026-03-24T12:00:00Z',
    lastViewed: '2026-03-24T13:30:00Z',
    labels: ['mindX 2.0', 'Memory', 'IA'],
    creatorName: currentUser.name,
    creatorType: 'human',
    size: 62464,
  },
  {
    id: 'd2',
    workspaceId: 'w1',
    name: 'Knowledge 归类与治理工作板',
    type: 'Table',
    date: 'Yesterday',
    lastModified: '2026-03-23T10:00:00Z',
    lastViewed: '2026-03-24T09:00:00Z',
    labels: ['Knowledge', 'IA', 'Open Questions'],
    creatorName: 'Data Analyzer',
    creatorType: 'agent',
    size: 55296,
  },
  {
    id: 'd3',
    workspaceId: 'w1',
    name: 'User Flow Diagram',
    type: 'Whiteboard',
    date: 'Last week',
    lastModified: '2026-03-17T15:00:00Z',
    lastViewed: '2026-03-22T11:00:00Z',
    labels: ['Design', 'Project Alpha'],
    creatorName: currentUser.name,
    creatorType: 'human',
    size: 40960,
  },
  {
    id: 'd6',
    workspaceId: 'w1',
    name: 'mindX 2.0 Memory 产品同步',
    type: 'Smart Doc',
    date: '3 hours ago',
    lastModified: '2026-03-24T11:00:00Z',
    lastViewed: '2026-03-24T11:30:00Z',
    labels: ['Product Sync', 'Memory'],
    creatorName: 'Claude Assistant',
    creatorType: 'agent',
    size: 28672,
  },
  {
    id: 'd4',
    workspaceId: 'w1',
    name: '记忆研究笔记：用户为何信任',
    type: 'Markdown',
    date: '1 hour ago',
    lastModified: '2026-03-24T13:00:00Z',
    lastViewed: '2026-03-24T13:45:00Z',
    labels: ['Research', 'Trust', 'Memory'],
    creatorName: 'Research Bot',
    creatorType: 'agent',
    size: 38912,
  },
  {
    id: 'd5',
    workspaceId: 'w1',
    name: '品牌语气与产品叙事',
    type: 'Smart Doc',
    date: '2 days ago',
    lastModified: '2026-03-22T14:00:00Z',
    lastViewed: '2026-03-23T16:00:00Z',
    labels: ['Brand', 'Voice', 'Narrative'],
    creatorName: currentUser.name,
    creatorType: 'human',
    size: 33792,
  },
  {
    id: 'd7',
    workspaceId: 'w1',
    name: 'Industry Digest — Mar 24',
    type: 'Markdown',
    date: 'Today',
    lastModified: '2026-03-24T08:00:00Z',
    lastViewed: '2026-03-24T10:00:00Z',
    labels: ['Daily Industry Digest'],
    creatorName: 'Research Bot',
    creatorType: 'agent',
    size: 45056,
  },
  {
    id: 'd8',
    workspaceId: 'w1',
    name: 'Industry Digest — Mar 23',
    type: 'Markdown',
    date: 'Yesterday',
    lastModified: '2026-03-23T08:00:00Z',
    lastViewed: '2026-03-23T12:00:00Z',
    labels: ['Daily Industry Digest'],
    creatorName: 'Research Bot',
    creatorType: 'agent',
    size: 43008,
  },
  {
    id: 'd9',
    workspaceId: 'w1',
    name: 'Industry Digest — Mar 22',
    type: 'Markdown',
    date: '2 days ago',
    lastModified: '2026-03-22T08:00:00Z',
    lastViewed: '2026-03-22T09:30:00Z',
    labels: ['Daily Industry Digest'],
    creatorName: 'Research Bot',
    creatorType: 'agent',
    size: 48128,
  },
  {
    id: 'd10',
    workspaceId: 'w1',
    name: 'Industry Digest — Mar 21',
    type: 'Markdown',
    date: '3 days ago',
    lastModified: '2026-03-21T08:00:00Z',
    lastViewed: '2026-03-21T11:00:00Z',
    labels: ['Daily Industry Digest'],
    creatorName: 'Research Bot',
    creatorType: 'agent',
    size: 51200,
  },
  {
    id: 'd11',
    workspaceId: 'w1',
    name: 'Industry Digest — Mar 20',
    type: 'Markdown',
    date: '4 days ago',
    lastModified: '2026-03-20T08:00:00Z',
    lastViewed: '2026-03-20T14:00:00Z',
    labels: ['Daily Industry Digest'],
    creatorName: 'Research Bot',
    creatorType: 'agent',
    size: 46080,
  },
  {
    id: 'd12',
    workspaceId: 'w1',
    name: 'Industry Digest — Mar 19',
    type: 'Markdown',
    date: '5 days ago',
    lastModified: '2026-03-19T08:00:00Z',
    lastViewed: '2026-03-19T10:00:00Z',
    labels: ['Daily Industry Digest'],
    creatorName: 'Research Bot',
    creatorType: 'agent',
    size: 49152,
  },
  {
    id: 'd13',
    workspaceId: 'w1',
    name: 'mindX 2.0 Memory 日报',
    type: 'Markdown',
    date: 'Today',
    lastModified: '2026-03-24T18:00:00Z',
    lastViewed: '2026-03-24T18:30:00Z',
    labels: ['Daily Report', 'Memory'],
    creatorName: 'Claude Assistant',
    creatorType: 'agent',
    size: 73728,
  },
  {
    id: 'd14',
    workspaceId: 'w1',
    name: 'Daily Report — Mar 23',
    type: 'Markdown',
    date: 'Yesterday',
    lastModified: '2026-03-23T18:00:00Z',
    lastViewed: '2026-03-23T20:00:00Z',
    labels: ['Daily Report'],
    creatorName: 'Claude Assistant',
    creatorType: 'agent',
    size: 71680,
  },
  {
    id: 'd15',
    workspaceId: 'w1',
    name: 'Daily Report — Mar 22',
    type: 'Markdown',
    date: '2 days ago',
    lastModified: '2026-03-22T18:00:00Z',
    lastViewed: '2026-03-22T19:00:00Z',
    labels: ['Daily Report'],
    creatorName: 'Claude Assistant',
    creatorType: 'agent',
    size: 69632,
  },
  {
    id: 'd16',
    workspaceId: 'w1',
    name: 'Daily Report — Mar 21',
    type: 'Markdown',
    date: '3 days ago',
    lastModified: '2026-03-21T18:00:00Z',
    lastViewed: '2026-03-21T21:00:00Z',
    labels: ['Daily Report'],
    creatorName: 'Claude Assistant',
    creatorType: 'agent',
    size: 75776,
  },
  {
    id: 'd17',
    workspaceId: 'w1',
    name: 'Daily Report — Mar 20',
    type: 'Markdown',
    date: '4 days ago',
    lastModified: '2026-03-20T18:00:00Z',
    lastViewed: '2026-03-20T19:30:00Z',
    labels: ['Daily Report'],
    creatorName: 'Claude Assistant',
    creatorType: 'agent',
    size: 72704,
  },
  {
    id: 'd18',
    workspaceId: 'w1',
    name: 'Daily Report — Mar 19',
    type: 'Markdown',
    date: '5 days ago',
    lastModified: '2026-03-19T18:00:00Z',
    lastViewed: '2026-03-19T20:00:00Z',
    labels: ['Daily Report', 'Project Alpha'],
    creatorName: 'Claude Assistant',
    creatorType: 'agent',
    size: 77824,
  },
];

export const initialActivities: Activity[] = [
  {
    id: 'act1',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'modified',
    targetName: 'Project Alpha Architecture',
    targetType: 'Markdown',
    details: 'Added "Database Schema" section with ER diagram and index strategy',
    timestamp: '2026-03-19T08:30:00Z',
  },
  {
    id: 'act2',
    workspaceId: 'w1',
    userId: 'u1',
    userName: currentUser.name,
    userType: 'human',
    action: 'created',
    targetName: 'User Flow Diagram',
    targetType: 'Whiteboard',
    details: 'Initial onboarding and checkout flow wireframes',
    timestamp: '2026-03-18T14:20:00Z',
  },
  {
    id: 'act3',
    workspaceId: 'w1',
    userId: 'a2',
    userName: 'Data Analyzer',
    userType: 'agent',
    action: 'updated',
    targetName: 'Q3 Financial Projections',
    targetType: 'Table',
    details: 'Revised August revenue forecast (+8.3%) based on new pipeline data',
    timestamp: '2026-03-17T10:15:00Z',
  },
  {
    id: 'act4',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'commented on',
    targetName: 'Project Alpha Architecture',
    targetType: 'Markdown',
    details: 'Suggested Redis caching layer for session management',
    timestamp: '2026-03-12T16:45:00Z',
  },
  {
    id: 'act5',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    targetName: 'Competitor Analysis',
    targetType: 'Markdown',
    details: 'Initial draft covering 5 competitors with feature matrix',
    timestamp: '2026-03-19T07:00:00Z',
  },
  {
    id: 'act6',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'created',
    targetName: 'API Integration Guide',
    targetType: 'Markdown',
    details: 'Documented 14 REST endpoints with auth flow examples',
    timestamp: '2026-03-20T10:00:00Z',
  },
  {
    id: 'act7',
    workspaceId: 'w1',
    userId: 'a2',
    userName: 'Data Analyzer',
    userType: 'agent',
    action: 'created',
    targetName: 'Revenue Dashboard',
    targetType: 'Table',
    details: 'Built automated monthly revenue tracker with YoY comparison',
    timestamp: '2026-03-20T14:30:00Z',
  },
  {
    id: 'act8',
    workspaceId: 'w1',
    userId: 'a2',
    userName: 'Data Analyzer',
    userType: 'agent',
    action: 'commented on',
    targetName: 'Q3 Financial Projections',
    targetType: 'Table',
    details: 'Flagged $42k discrepancy in Q2 actuals vs. reported figures',
    timestamp: '2026-03-15T09:20:00Z',
  },
  {
    id: 'act9',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'updated',
    targetName: 'Competitor Analysis',
    targetType: 'Markdown',
    details: 'Added pricing comparison table across all tiers',
    timestamp: '2026-03-21T08:15:00Z',
  },
  {
    id: 'act10',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    targetName: 'Market Trends Report',
    targetType: 'Markdown',
    details: 'Q1 2026 analysis: AI tooling market grew 34% QoQ',
    timestamp: '2026-03-18T11:00:00Z',
  },
  {
    id: 'act11',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'updated',
    targetName: 'Project Alpha Architecture',
    targetType: 'Markdown',
    details: 'Refactored microservice diagram — split auth into standalone service',
    timestamp: '2026-03-21T16:00:00Z',
  },
  {
    id: 'act12',
    workspaceId: 'w1',
    userId: 'u1',
    userName: currentUser.name,
    userType: 'human',
    action: 'updated',
    targetName: 'Project Alpha Architecture',
    targetType: 'Markdown',
    details: 'Reviewed and approved final version',
    timestamp: '2026-03-22T09:00:00Z',
  },
  {
    id: 'act13',
    workspaceId: 'w1',
    userId: 'u1',
    userName: currentUser.name,
    userType: 'human',
    action: 'commented on',
    targetName: 'Q3 Financial Projections',
    targetType: 'Table',
    details: 'Requested breakdown by region',
    timestamp: '2026-03-20T15:30:00Z',
  },
  {
    id: 'act14',
    workspaceId: 'w1',
    userId: 'u2',
    userName: 'Alice Chen',
    userType: 'human',
    action: 'commented on',
    targetName: 'Project Alpha Architecture',
    targetType: 'Markdown',
    details: 'Shared handoff notes about service boundaries before design review',
    timestamp: '2026-03-19T11:00:00Z',
  },
  {
    id: 'act15',
    workspaceId: 'w1',
    userId: 'u2',
    userName: 'Alice Chen',
    userType: 'human',
    action: 'modified',
    targetName: 'User Flow Diagram',
    targetType: 'Whiteboard',
    details: 'Added stakeholder review and approval path to the onboarding flow',
    timestamp: '2026-03-21T10:20:00Z',
  },
  {
    id: 'act16',
    workspaceId: 'w1',
    userId: 'u3',
    userName: 'Bob Smith',
    userType: 'human',
    action: 'commented on',
    targetName: 'Q3 Financial Projections',
    targetType: 'Table',
    details: 'Asked for monthly burn and runway annotations before the finance review',
    timestamp: '2026-03-17T09:00:00Z',
  },
  {
    id: 'act17',
    workspaceId: 'w1',
    userId: 'u3',
    userName: 'Bob Smith',
    userType: 'human',
    action: 'commented on',
    targetName: 'Project Alpha Architecture',
    targetType: 'Markdown',
    details: 'Added edge case notes for the auth flow handoff',
    timestamp: '2026-03-21T14:45:00Z',
  },
  {
    id: 'act18',
    workspaceId: 'w1',
    userId: 'u4',
    userName: 'Eve Davis',
    userType: 'human',
    action: 'commented on',
    targetName: 'Marketing Strategy',
    targetType: 'Markdown',
    details: 'Requested launch timing to align with the campaign calendar',
    timestamp: '2026-03-16T13:00:00Z',
  },
  {
    id: 'act19',
    workspaceId: 'w1',
    userId: 'u4',
    userName: 'Eve Davis',
    userType: 'human',
    action: 'updated',
    targetName: 'Marketing Strategy',
    targetType: 'Markdown',
    details: 'Suggested channel mix changes in section 4 after review',
    timestamp: '2026-03-20T16:00:00Z',
  },
  {
    id: 'act20',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    targetName: 'Industry Digest — Mar 24',
    targetType: 'Markdown',
    details: 'Scheduled task: compiled 12 industry news items from 8 sources',
    timestamp: '2026-03-24T08:00:00Z',
  },
  {
    id: 'act21',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    targetName: 'Industry Digest — Mar 23',
    targetType: 'Markdown',
    details: 'Scheduled task: compiled 9 industry news items from 7 sources',
    timestamp: '2026-03-23T08:00:00Z',
  },
  {
    id: 'act22',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    targetName: 'Industry Digest — Mar 22',
    targetType: 'Markdown',
    details: 'Scheduled task: compiled 15 industry news items from 10 sources',
    timestamp: '2026-03-22T08:00:00Z',
  },
  {
    id: 'act23',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'created',
    targetName: 'Daily Report — Mar 24',
    targetType: 'Markdown',
    details: 'Scheduled task: summarized 6 document changes, 3 new comments, 2 tasks completed',
    timestamp: '2026-03-24T18:00:00Z',
  },
  {
    id: 'act24',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'created',
    targetName: 'Daily Report — Mar 23',
    targetType: 'Markdown',
    details: 'Scheduled task: summarized 4 document changes, 5 new comments, 1 task completed',
    timestamp: '2026-03-23T18:00:00Z',
  },
  {
    id: 'act25',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'created',
    targetName: 'Daily Report — Mar 22',
    targetType: 'Markdown',
    details: 'Scheduled task: summarized 8 document changes, 2 new comments, 4 tasks completed',
    timestamp: '2026-03-22T18:00:00Z',
  },
];

export const memoryDataSources: MemoryDataSource[] = [
  {
    id: 'ds1',
    name: '用户信任研究原始访谈摘录',
    category: 'manual-upload',
    typeLabel: 'Markdown',
    status: 'ready',
    summary: '手动上传的访谈摘要，作为 Memory 信任判断的原始证据。',
    freshness: '今天上传',
    tags: ['trust', 'research', 'memory'],
    contentPreview: [
      '用户不会因为你记得更多就自动信任你。',
      '他们需要看到这条记忆的证据链、来源和当前是否仍然成立。',
    ],
  },
  {
    id: 'ds2',
    name: '飞书妙记：03/24 产品同步',
    category: 'third-party-sync',
    typeLabel: 'Meeting Transcript',
    status: 'syncing',
    summary: '从会议转写同步进来的聊天记录，用于提炼产品判断与开放问题。',
    freshness: '10 分钟前同步',
    tags: ['meeting', 'product', 'sync'],
    contentPreview: [
      'Knowledge 暂不升级为一级导航。',
      'Workspace 继续作为对外的日常协作入口。',
    ],
  },
  {
    id: 'ds3',
    name: '网页剪存：Memory 产品案例',
    category: 'search-capture',
    typeLabel: 'Web Clip',
    status: 'ready',
    summary: '从外部网页保存下来的案例资料，作为设计 Memory 结构的参考素材。',
    freshness: '昨天收藏',
    tags: ['web-clip', 'case-study'],
    contentPreview: [
      '长期记忆的关键不是更大，而是可验证与可纠偏。',
      '资产层要和原始来源链路保持可回看关系。',
    ],
  },
  {
    id: 'ds4',
    name: '腾讯文档同步：产品周报',
    category: 'cloud-collaboration',
    typeLabel: 'Tencent Docs',
    status: 'reviewing',
    summary: '从云端协作文档接入的周报数据，作为最近工作线索与候选记忆来源。',
    freshness: '1 小时前更新',
    tags: ['weekly-report', 'cloud-sync'],
    contentPreview: [
      '本周重点在于明确 MindX 2.0 的边界。',
      'Memory 的新价值不在“记更多”，而在“提炼得更好”。',
    ],
  },
];

export const memorySourceLinks: SourceLink[] = [
  {
    id: 'src1',
    docId: 'd6',
    docName: 'mindX 2.0 Memory 产品同步',
    kind: 'chat',
    storage: 'workspace',
    summary: '产品同步会上明确收敛：Knowledge 暂不升级为一级模块，继续作为 Memory 内部的结构化资产层。',
    quote: '如果现在把 Knowledge 拉成一级导航，用户会把它理解成第二套产品，而不是 Memory 的升级。',
    timestamp: '2026-03-24T10:10:00Z',
    participants: ['Me', 'Claude Assistant', 'Maya Chen'],
  },
  {
    id: 'src2',
    docId: 'd4',
    docName: '记忆研究笔记：用户为何信任',
    kind: 'document',
    storage: 'workspace',
    summary: '研究笔记反复验证同一个结论：用户相信的不是“更大记忆”，而是可追溯、可复核的来源链路。',
    quote: '用户不是因为你记得多就信你，而是因为他能看见这张卡从哪里来、为什么还成立。',
    timestamp: '2026-03-24T11:05:00Z',
    participants: ['Me', 'Research Bot', 'Iris Liu'],
  },
  {
    id: 'src3',
    docId: 'd1',
    docName: 'mindX 2.0 Memory 信息架构 PRD',
    kind: 'comment',
    storage: 'workspace',
    summary: 'IA PRD 已把 Memory 固定为 Base Memory、Timeline、Knowledge 三段结构，并明确 Knowledge 是 Memory 内部的资产层。',
    quote: 'Knowledge 不是平行模块，它是把 Memory 里的反复判断沉淀成可复用资产的地方。',
    timestamp: '2026-03-24T13:36:00Z',
    participants: ['Me', 'Claude Assistant', 'Alice Chen'],
  },
  {
    id: 'src4',
    docId: 'd5',
    docName: '品牌语气与产品叙事',
    kind: 'document',
    storage: 'workspace',
    summary: '叙事评审里已经收敛：产品表达先给判断，再补机制说明，避免堆 AI 功能词。',
    quote: '先把判断说出来，再解释为什么。产品口吻要像一个会做取舍的 PM，不像在念宣传册。',
    timestamp: '2026-03-23T17:42:00Z',
    participants: ['Me', 'Eve Davis'],
  },
  {
    id: 'src5',
    docId: 'd2',
    docName: 'Knowledge 归类与治理工作板',
    kind: 'comment',
    storage: 'workspace',
    summary: '工作板上主要沉淀的是两类未决问题：L2/L3/L4 的晋升规则，以及待跟进事项到底该留在哪一层。',
    quote: '如果开放问题到处都能放，这套系统看起来会很聪明，但无法治理。',
    timestamp: '2026-03-23T15:05:00Z',
    participants: ['Data Analyzer', 'Me', 'Leo Wang'],
  },
  {
    id: 'src6',
    docId: 'd13',
    docName: 'mindX 2.0 Memory 日报',
    kind: 'report',
    storage: 'workspace',
    summary: '日报把今天的工作主线收束成一件事：不是继续加卡片，而是先把层级、归属和治理规则讲清楚。',
    quote: '今天的重点不是“多记一点”，而是决定什么东西值得进入长期资产层。',
    timestamp: '2026-03-24T20:10:00Z',
    participants: ['Me', 'Claude Assistant'],
  },
];

export const memoryAssets: MemoryAsset[] = [
  {
    id: 'mem1',
    type: 'decision',
    libraryCategory: 'project-judgment',
    layer: 'L2',
    status: 'durable',
    title: 'Knowledge 暂不升级为一级导航，继续归属 Memory',
    summary: 'mindX 2.0 当前版本的信息架构已经收敛：Knowledge 作为 Memory 内部的结构化资产层存在，不单独承担一级入口。',
    confidence: 'High',
    freshness: '42 分钟前定稿',
    sourceIds: ['src1', 'src3', 'src6'],
    relatedAssetIds: ['mem2', 'mem6', 'mem7', 'mem8'],
    relatedEntities: ['Knowledge', 'Memory IA', 'Navigation'],
    tags: ['memory', 'knowledge', 'ia'],
    docIds: ['d6', 'd1', 'd13'],
    evidence: [
      '产品同步会上已经明确否掉“Knowledge 一级化”的方案。',
      'IA PRD 把 Knowledge 定义成 Memory 内部的结构化资产层。',
      '日报里把“先讲清层级归属”定义成今天的核心产品动作。',
    ],
    nextStep: '后续所有 IA、导航和产品叙事方案，都默认继承这个约束再展开。',
  },
  {
    id: 'mem2',
    type: 'decision',
    libraryCategory: 'project-judgment',
    layer: 'L2',
    status: 'review',
    title: '对外入口先落在 Workspace，Memory 负责解释“这个用户是谁”',
    summary: '当前版本的产品入口策略是：Workspace 继续承接日常工作流，Memory 在内部逐步显性化用户理解与长期资产，避免用户误解为第二套系统。',
    confidence: 'Medium',
    freshness: '1 小时前复核',
    sourceIds: ['src1', 'src6'],
    relatedAssetIds: ['mem1', 'mem3', 'mem7'],
    relatedEntities: ['Workspace', 'Memory', '入口策略'],
    tags: ['workspace', 'memory', 'entry'],
    docIds: ['d6', 'd13'],
    evidence: [
      '产品同步会上将 Workspace 定义为当前阶段的外层工作台。',
      '日报里把“入口是否外放 Memory”标记为待确认事项，而不是顶层原则。',
    ],
    nextStep: '需要结合 v2 首页和首屏路径再做一轮验证，然后决定是否正式锁定。',
  },
  {
    id: 'mem3',
    type: 'preference',
    libraryCategory: 'work-preference',
    layer: 'L3',
    status: 'durable',
    title: '产品文案先下判断，再补机制说明',
    summary: '当前稳定的表达习惯是先把结论和取舍讲清楚，再解释页面机制、实现方式或系统细节，不用功能清单当开头。',
    confidence: 'High',
    freshness: '1 小时前整理',
    sourceIds: ['src4', 'src6'],
    relatedAssetIds: ['mem4', 'mem5'],
    relatedEntities: ['Product copy', 'Narrative', 'Judgment-first'],
    tags: ['copy', 'narrative', 'preference'],
    docIds: ['d5', 'd13'],
    evidence: [
      '叙事评审多次删掉“功能罗列式”表达，保留结论先行的版本。',
      '日报里把“先判断后解释”总结成今天最稳定的文案模式。',
    ],
    nextStep: '所有写产品文案、PRD、版本说明的 agent，都应该先挂这条偏好。',
  },
  {
    id: 'mem4',
    type: 'preference',
    libraryCategory: 'work-preference',
    layer: 'L3',
    status: 'durable',
    title: '整体语气保持直接、克制、非 corporate',
    summary: '品牌和产品表达都应避免空泛的大词、AI 套话和汇报腔，保持像资深产品经理在做判断时的直接表达。',
    confidence: 'High',
    freshness: '昨天补充',
    sourceIds: ['src4'],
    relatedAssetIds: ['mem3', 'mem5'],
    relatedEntities: ['Product voice', 'Brand tone', 'Narrative discipline'],
    tags: ['voice', 'brand', 'preference'],
    docIds: ['d5'],
    evidence: [
      '品牌语气评审里已经明确否掉了“宏大叙事”和“仪表盘口吻”的写法。',
    ],
    nextStep: '这条偏好适合挂到 UI 文案、营销文案和 Founder narrative 的所有写作 agent 上。',
  },
  {
    id: 'mem5',
    type: 'insight',
    libraryCategory: 'long-term-principle',
    layer: 'L3',
    status: 'durable',
    title: '用户信任来自来源链路，不来自“更强记忆”口号',
    summary: '长期记忆要成立，核心不是把卡片做得更多，而是让用户看见来源、审核过程和当前为什么仍然有效。',
    confidence: 'High',
    freshness: '55 分钟前稳定',
    sourceIds: ['src2', 'src6'],
    relatedAssetIds: ['mem3', 'mem6', 'mem8', 'mem9'],
    relatedEntities: ['Provenance', 'User trust', 'Memory cards'],
    tags: ['trust', 'provenance', 'memory'],
    docIds: ['d4', 'd13'],
    evidence: [
      '研究笔记把“可追溯来源”列为用户建立信任的第一信号。',
      '日报里没有继续讨论卡片数量，而是反复回到证据和耐久度。',
    ],
    nextStep: '后续所有卡片设计、来源展示和 review 机制，都应围绕这条原则展开。',
  },
  {
    id: 'mem6',
    type: 'constraint',
    libraryCategory: 'long-term-principle',
    layer: 'L3',
    status: 'durable',
    title: '记忆必须长在工作流里，不能漂在 Workspace 外面',
    summary: '这套系统只有从真实文档、协作过程和决策流里长出来，才会被持续使用；如果变成独立档案库，复用价值会快速下降。',
    confidence: 'High',
    freshness: '48 分钟前锁定',
    sourceIds: ['src1', 'src2', 'src3'],
    relatedAssetIds: ['mem1', 'mem5', 'mem8', 'mem10'],
    relatedEntities: ['Workflow', 'Workspace', 'Memory architecture'],
    tags: ['workflow', 'architecture', 'memory'],
    docIds: ['d6', 'd4', 'd1'],
    evidence: [
      '产品同步把 Memory 的价值定义成服务工作流，而不是脱离工作流独立存在。',
      '研究笔记指出，只有挂在真实资产上的记忆才会持续积累信任。',
      'IA PRD 已经把 Knowledge 收在 Memory 内，而不是另起一套档案空间。',
    ],
    nextStep: '后面遇到任何“单独拉一层记忆空间”的方案，都用这条原则先做筛选。',
  },
  {
    id: 'mem7',
    type: 'constraint',
    libraryCategory: 'core-anchor',
    layer: 'L4',
    status: 'durable',
    title: 'mindX 2.0 是 1.0 的升级，不是新产品',
    summary: '当前所有产品表达都要建立在“连续升级”而不是“重新发明”上，避免用户把 2.0 理解成割裂的新系统。',
    confidence: 'High',
    freshness: '今天锁定',
    sourceIds: ['src1', 'src6'],
    relatedAssetIds: ['mem1', 'mem2', 'mem8'],
    relatedEntities: ['mindX 2.0', 'Product positioning', 'Continuity'],
    tags: ['positioning', 'mindx-2.0', 'anchor'],
    docIds: ['d6', 'd13'],
    evidence: [
      '产品同步里已经把“连续升级”定为 2.0 的统一叙事。',
      '日报把这条定义成所有 IA 和对外表达都必须遵守的前提。',
    ],
    nextStep: '发布叙事、价格解释、路线图表述都应直接继承这条锚点。',
  },
  {
    id: 'mem8',
    type: 'constraint',
    libraryCategory: 'core-anchor',
    layer: 'L4',
    status: 'durable',
    title: 'Memory 的结构先固定为 Base Memory / Timeline / Knowledge',
    summary: '这三段结构已经足够承接 mindX 2.0 当前阶段的记忆能力，后续功能应该优先往里塞，而不是继续扩一级信息架构。',
    confidence: 'High',
    freshness: '36 分钟前写入宪法层',
    sourceIds: ['src3', 'src6'],
    relatedAssetIds: ['mem1', 'mem5', 'mem6', 'mem7'],
    relatedEntities: ['Base Memory', 'Timeline', 'Knowledge'],
    tags: ['ia', 'constitution', 'memory'],
    docIds: ['d1', 'd13'],
    evidence: [
      'IA PRD 明确把三段结构写成当前阶段的标准框架。',
      '日报把这次分类调整定义成结构问题，而不是文案问题。',
    ],
    nextStep: '后面如果再有人提第四个一级区块，先拿这条锚点做否决判断。',
  },
  {
    id: 'mem9',
    type: 'follow-up',
    libraryCategory: 'pending',
    layer: 'L2',
    status: 'review',
    title: 'L2 / L3 / L4 的晋升规则还没有定稿',
    summary: '现在已经把层级名字讲清楚了，但“什么条件下从项目判断升到长期原则、再升到核心锚点”还缺一套明确规则。',
    confidence: 'Medium',
    freshness: '24 分钟前进入复核',
    sourceIds: ['src2', 'src5', 'src6'],
    relatedAssetIds: ['mem5', 'mem8', 'mem10'],
    relatedEntities: ['L2', 'L3', 'L4'],
    tags: ['governance', 'layers', 'review'],
    docIds: ['d4', 'd2', 'd13'],
    evidence: [
      '研究已经给出“可信”的判断标准，但还没落成可执行的晋升门槛。',
      '治理工作板把“晋升逻辑”列为当前最大的未决项。',
      '日报把“什么值得沉淀”定义成今天剩下的核心问题。',
    ],
    nextStep: '下一步需要把来源、重复出现、作用范围、可逆性这四个判断条件写成 checklist。',
  },
  {
    id: 'mem10',
    type: 'follow-up',
    libraryCategory: 'pending',
    layer: 'L2',
    status: 'candidate',
    title: '待跟进事项到底放 Knowledge 还是 Timeline，还没有收敛',
    summary: '现在的 follow-up 看起来像资产，实际又更像流程中的开放问题。这个边界如果不收敛，Knowledge 页会继续变脏。',
    confidence: 'Medium',
    freshness: '今天捕获',
    sourceIds: ['src5', 'src6'],
    relatedAssetIds: ['mem6', 'mem9'],
    relatedEntities: ['Follow-up', 'Knowledge', 'Timeline'],
    tags: ['follow-up', 'timeline', 'ia'],
    docIds: ['d2', 'd13'],
    evidence: [
      '治理工作板已经明确提出“未收敛问题不一定适合放 Knowledge”。',
      '日报把这件事定义成产品债，而不是命名问题。',
    ],
    nextStep: '建议先试一版：Timeline 承接开放问题，Knowledge 只保留候选资产和已沉淀资产。',
  },
];

export const memoryInsights: MemoryInsight[] = [
  {
    id: 'ins1',
    kind: 'workstream',
    title: '今天的核心工作，不是继续加卡片，而是先把层级和归属讲清楚',
    body: '产品同步、IA PRD 和日报都在收敛同一个问题：不是“什么都记下来”，而是哪些内容属于项目判断，哪些值得升级成长期原则或核心锚点。',
    signal: '8 linked signals',
    assetIds: ['mem1', 'mem8', 'mem9'],
  },
  {
    id: 'ins2',
    kind: 'preference',
    title: '你的表达习惯在持续把产品拉回“先判断、后解释”',
    body: '无论是品牌语气还是产品文案，你都在主动压缩功能描述和空话，把表达拉回更像高级产品经理的判断式写法。',
    signal: '4 supporting sources',
    assetIds: ['mem3', 'mem4'],
  },
  {
    id: 'ins3',
    kind: 'relationship',
    title: 'Research Bot 在补证据，Claude 在做归类和收束',
    body: 'Research Bot 负责把来源链路和用户证据补齐，Claude 再把这些线索收敛成可治理的结构、规则和资产描述。',
    signal: '2 active agents',
    assetIds: ['mem5', 'mem9'],
  },
];

export const memoryTimeline: MemoryEvent[] = [
  {
    id: 'evt3',
    dayLabel: 'Today',
    timeLabel: '13:42',
    occurredAt: '2026-03-24T13:42:00Z',
    stage: 'durable',
    lane: 'mount',
    title: 'Onboarding rule locked into the PRD',
    summary: 'The next-action-first rule is now written as a reusable product constraint.',
    docId: 'd1',
    docName: 'New User Onboarding PRD',
    actorName: 'Me',
    actorType: 'human',
    sourceIds: ['src3'],
    assetIds: ['mem3'],
    tags: ['prd', 'constraint'],
  },
  {
    id: 'evt2',
    dayLabel: 'Today',
    timeLabel: '11:08',
    occurredAt: '2026-03-24T11:08:00Z',
    stage: 'candidate',
    lane: 'refine',
    title: 'Interview evidence sharpened the trust story',
    summary: 'User quotes and the daily report were merged into a candidate insight about visible progress.',
    docId: 'd4',
    docName: 'User Interview Debrief',
    actorName: 'Research Bot',
    actorType: 'agent',
    sourceIds: ['src2', 'src6'],
    assetIds: ['mem2'],
    tags: ['trust', 'users'],
  },
  {
    id: 'evt1',
    dayLabel: 'Today',
    timeLabel: '09:12',
    occurredAt: '2026-03-24T09:12:00Z',
    stage: 'captured',
    lane: 'extract',
    title: 'Morning standup surfaced the first-win clue',
    summary: 'The team aligned that onboarding should lead with a visible first win instead of a feature tour.',
    docId: 'd6',
    docName: 'Morning Standup — Activation Push',
    actorName: 'Me',
    actorType: 'human',
    sourceIds: ['src1'],
    assetIds: ['mem1'],
    tags: ['standup', 'activation'],
  },
  {
    id: 'evt6',
    dayLabel: 'Yesterday',
    timeLabel: '20:10',
    occurredAt: '2026-03-23T20:10:00Z',
    stage: 'captured',
    lane: 'refine',
    title: 'Daily report stitched the PM day into one storyline',
    summary: 'The memory layer closed the loop from morning standup to launch prep so the day can be reused later.',
    docId: 'd13',
    docName: 'Daily Report — Mar 24',
    actorName: 'Claude Assistant',
    actorType: 'agent',
    sourceIds: ['src6'],
    assetIds: ['mem1', 'mem2'],
    tags: ['synthesis', 'daily'],
  },
  {
    id: 'evt4',
    dayLabel: 'Yesterday',
    timeLabel: '17:42',
    occurredAt: '2026-03-23T17:42:00Z',
    stage: 'durable',
    lane: 'mount',
    title: 'Copy tone settled during feed review',
    summary: 'A stable voice preference was mounted so future writing feels like a teammate, not a dashboard.',
    docId: 'd5',
    docName: 'Home Feed Copy Review',
    actorName: 'Me',
    actorType: 'human',
    sourceIds: ['src4'],
    assetIds: ['mem4'],
    tags: ['copy', 'preference'],
  },
  {
    id: 'evt5',
    dayLabel: 'Yesterday',
    timeLabel: '15:18',
    occurredAt: '2026-03-23T15:18:00Z',
    stage: 'candidate',
    lane: 'extract',
    title: 'Launch metrics gap captured for follow-up',
    summary: 'The dashboard review exposed that activation without support load is an incomplete success metric.',
    docId: 'd2',
    docName: 'Launch Readiness Dashboard',
    actorName: 'Data Analyzer',
    actorType: 'agent',
    sourceIds: ['src5'],
    assetIds: ['mem5'],
    tags: ['launch', 'metrics'],
  },
];

export const agentConnections: AgentConnection[] = [
  {
    id: 'conn1',
    name: 'Claude Assistant',
    provider: 'MindX Native',
    status: 'Mounted',
    workspaceRole: 'Standup notes, PRD polishing, daily synthesis',
    description: 'Operates inside Workspace, closes loops on the PM day, and mounts stable product decisions before new drafting starts.',
    mountedAssetCount: 8,
    readScopes: ['Durable memory assets', 'Today timeline', 'Workspace docs'],
    writeScopes: ['Candidate memories', 'Daily synthesis', 'Applied preferences'],
    latestAction: 'Mounted the onboarding rule into product-writing context 18 minutes ago',
    latestWorkspaceDocId: 'd13',
    latestWorkspaceDocName: 'Daily Report — Mar 24',
  },
  {
    id: 'conn2',
    name: 'Research Bot',
    provider: 'External research agent',
    status: 'Writing Back',
    workspaceRole: 'Interview synthesis, research evidence, user signals',
    description: 'Expands raw interview notes into evidence-backed insight candidates before they harden into memory.',
    mountedAssetCount: 5,
    readScopes: ['Insight assets', 'Open questions', 'Related workspace docs'],
    writeScopes: ['Research candidates', 'Evidence packets'],
    latestAction: 'Wrote back a visible-progress insight candidate from interview notes 46 minutes ago',
    latestWorkspaceDocId: 'd4',
    latestWorkspaceDocName: 'User Interview Debrief',
  },
  {
    id: 'conn3',
    name: 'Data Analyzer',
    provider: 'External analytics agent',
    status: 'Connected',
    workspaceRole: 'Launch metrics, scenario tables, dashboard checks',
    description: 'Reads follow-ups from Memory so launch tables stay attached to actual product questions.',
    mountedAssetCount: 3,
    readScopes: ['Finance follow-ups', 'Constraints', 'Decision assets'],
    writeScopes: ['Scenario notes', 'Cost deltas'],
    latestAction: 'Waiting on a request to pair activation with support load in the launch dashboard',
    latestWorkspaceDocId: 'd2',
    latestWorkspaceDocName: 'Launch Readiness Dashboard',
  },
];

export const mountedMemoryPacks: MountedMemoryPack[] = [
  {
    id: 'pack1',
    name: 'Onboarding Decision Pack',
    description: 'Mounted context bundle built from first-win onboarding, visible progress, and PRD guardrail assets.',
    assetIds: ['mem1', 'mem2', 'mem3'],
    mountedByConnectionIds: ['conn1', 'conn2'],
  },
  {
    id: 'pack2',
    name: 'Product Voice Pack',
    description: 'Turns teammate-like product voice into a default preference for writing agents.',
    assetIds: ['mem4'],
    mountedByConnectionIds: ['conn1'],
  },
  {
    id: 'pack3',
    name: 'Launch Review Pack',
    description: 'Mounts launch metric follow-ups so analysis agents keep activation tied to support load.',
    assetIds: ['mem5'],
    mountedByConnectionIds: ['conn2', 'conn3'],
  },
];

export const agentWritebacks: AgentWriteback[] = [
  {
    id: 'wb1',
    title: 'Research Bot wrote back a visible-progress insight candidate',
    detail: 'Derived from the latest interview debrief and now waiting in the Memory review layer.',
    assetId: 'mem2',
    docId: 'd4',
    docName: 'User Interview Debrief',
  },
  {
    id: 'wb2',
    title: 'Claude Assistant mounted the product voice preference',
    detail: 'Subsequent product-writing work now inherits this tone by default.',
    assetId: 'mem4',
    docId: 'd5',
    docName: 'Home Feed Copy Review',
  },
];

export function buildDocumentMemoryMeta(assets: MemoryAsset[]): Record<string, DocumentMemoryMeta> {
  const byDocId: Record<string, MemoryAsset[]> = {};

  assets.forEach(asset => {
    asset.docIds.forEach(docId => {
      if (!byDocId[docId]) byDocId[docId] = [];
      byDocId[docId].push(asset);
    });
  });

  return Object.entries(byDocId).reduce<Record<string, DocumentMemoryMeta>>((accumulator, [docId, relatedAssets]) => {
    const candidateCount = relatedAssets.filter(asset => asset.status === 'candidate').length;
    const reviewCount = relatedAssets.filter(asset => asset.status === 'review').length;
    const durableCount = relatedAssets.filter(asset => asset.status === 'durable').length;

    let status: DocumentMemoryMeta['status'] = 'stable';
    if (candidateCount > 0) status = 'forming';
    else if (reviewCount > 0 || relatedAssets.length > 1) status = 'active';

    let latest = `${relatedAssets.length} linked assets`;
    if (candidateCount > 0) latest = `${candidateCount} candidate ${candidateCount > 1 ? 'signals' : 'signal'}`;
    else if (reviewCount > 0) latest = `${reviewCount} insight ${reviewCount > 1 ? 'cards in review' : 'card in review'}`;
    else if (durableCount > 0) latest = `${durableCount} durable ${durableCount > 1 ? 'assets' : 'asset'}`;

    accumulator[docId] = {
      count: relatedAssets.length,
      status,
      latest,
    };
    return accumulator;
  }, {});
}
