import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';
import { 
  Copy, 
  Check, 
  Wand2, 
  FileText, 
  Settings, 
  LogOut,
  Plus,
  Search,
  MoreVertical,
  Sparkles,
  ChevronDown,
  Bot,
  Users,
  User,
  Table,
  Layout,
  ArrowLeft,
  MessageCircle,
  Clock,
  Activity as ActivityIcon,
  ArrowUpDown,
  X,
  Download,
  Trash2,
  Tag,
  Shield,
  StopCircle
} from 'lucide-react';

const initialWorkspaces = [
  { id: 'w1', name: 'Default' },
  { id: 'w2', name: 'Project Alpha' }
];

const initialAgents = [
  { id: 'a1', name: 'Claude Assistant', token: 'mx_agt_9f8e7d6c5b4a3' },
  { id: 'a2', name: 'Data Analyzer', token: 'mx_agt_1a2b3c4d5e6f7' },
  { id: 'a3', name: 'Research Bot', token: 'mx_agt_8x7y6z5w4v3u2' }
];

const initialUsers = [
  { id: 'u1', name: 'Human', email: 'human@example.com' },
  { id: 'u2', name: 'Alice Chen', email: 'alice@example.com' },
  { id: 'u3', name: 'Bob Smith', email: 'bob@example.com' },
  { id: 'u4', name: 'Eve Davis', email: 'eve@example.com' }
];

const initialPermissions = [
  // Workspace 1 (Default)
  { id: 'p1', workspaceId: 'w1', memberId: 'u1', memberType: 'Human', role: 'Owner' },
  { id: 'p2', workspaceId: 'w1', memberId: 'u2', memberType: 'Human', role: 'Editor' },
  { id: 'p3', workspaceId: 'w1', memberId: 'a1', memberType: 'Agent', role: 'Editor' },
  { id: 'p4', workspaceId: 'w1', memberId: 'a2', memberType: 'Agent', role: 'Viewer' },
  // Workspace 2 (Project Alpha)
  { id: 'p5', workspaceId: 'w2', memberId: 'u1', memberType: 'Human', role: 'Owner' },
  { id: 'p6', workspaceId: 'w2', memberId: 'u4', memberType: 'Human', role: 'Editor' },
  { id: 'p7', workspaceId: 'w2', memberId: 'a3', memberType: 'Agent', role: 'Admin' }
];

interface WorkspaceDoc {
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
}

const initialDocuments: WorkspaceDoc[] = [
  { id: 'd1', workspaceId: 'w1', name: 'Project Alpha Architecture', type: 'Markdown', date: '2 hours ago', lastModified: '2026-03-24T12:00:00Z', lastViewed: '2026-03-24T13:30:00Z', labels: ['Project Alpha', 'PRD'], creatorName: 'Claude Assistant', creatorType: 'agent' },
  { id: 'd2', workspaceId: 'w1', name: 'Q3 Financial Projections', type: 'Table', date: 'Yesterday', lastModified: '2026-03-23T10:00:00Z', lastViewed: '2026-03-24T09:00:00Z', labels: ['Data', 'Finance'], creatorName: 'Data Analyzer', creatorType: 'agent' },
  { id: 'd3', workspaceId: 'w1', name: 'User Flow Diagram', type: 'Whiteboard', date: 'Last week', lastModified: '2026-03-17T15:00:00Z', lastViewed: '2026-03-22T11:00:00Z', labels: ['Design', 'Project Alpha'], creatorName: 'Human', creatorType: 'human' },
  { id: 'd6', workspaceId: 'w1', name: 'Claude & Human: Feature Discussion', type: 'Chat Log', date: '3 hours ago', lastModified: '2026-03-24T11:00:00Z', lastViewed: '2026-03-24T11:30:00Z', labels: ['Meeting Notes'], creatorName: 'Claude Assistant', creatorType: 'agent' },
  { id: 'd4', workspaceId: 'w2', name: 'Competitor Analysis', type: 'Markdown', date: '1 hour ago', lastModified: '2026-03-24T13:00:00Z', lastViewed: '2026-03-24T13:45:00Z', labels: ['Research', 'Data'], creatorName: 'Research Bot', creatorType: 'agent' },
  { id: 'd5', workspaceId: 'w2', name: 'Marketing Strategy', type: 'Markdown', date: '2 days ago', lastModified: '2026-03-22T14:00:00Z', lastViewed: '2026-03-23T16:00:00Z', labels: ['PRD', 'Marketing'], creatorName: 'Human', creatorType: 'human' },
  // Agent scheduled task outputs — Daily Industry Digest
  { id: 'd7', workspaceId: 'w1', name: 'Industry Digest — Mar 24', type: 'Markdown', date: 'Today', lastModified: '2026-03-24T08:00:00Z', lastViewed: '2026-03-24T10:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent' },
  { id: 'd8', workspaceId: 'w1', name: 'Industry Digest — Mar 23', type: 'Markdown', date: 'Yesterday', lastModified: '2026-03-23T08:00:00Z', lastViewed: '2026-03-23T12:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent' },
  { id: 'd9', workspaceId: 'w1', name: 'Industry Digest — Mar 22', type: 'Markdown', date: '2 days ago', lastModified: '2026-03-22T08:00:00Z', lastViewed: '2026-03-22T09:30:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent' },
  { id: 'd10', workspaceId: 'w1', name: 'Industry Digest — Mar 21', type: 'Markdown', date: '3 days ago', lastModified: '2026-03-21T08:00:00Z', lastViewed: '2026-03-21T11:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent' },
  { id: 'd11', workspaceId: 'w2', name: 'Industry Digest — Mar 20', type: 'Markdown', date: '4 days ago', lastModified: '2026-03-20T08:00:00Z', lastViewed: '2026-03-20T14:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent' },
  { id: 'd12', workspaceId: 'w2', name: 'Industry Digest — Mar 19', type: 'Markdown', date: '5 days ago', lastModified: '2026-03-19T08:00:00Z', lastViewed: '2026-03-19T10:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent' },
  // Agent scheduled task outputs — Daily Report
  { id: 'd13', workspaceId: 'w1', name: 'Daily Report — Mar 24', type: 'Markdown', date: 'Today', lastModified: '2026-03-24T18:00:00Z', lastViewed: '2026-03-24T18:30:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent' },
  { id: 'd14', workspaceId: 'w1', name: 'Daily Report — Mar 23', type: 'Markdown', date: 'Yesterday', lastModified: '2026-03-23T18:00:00Z', lastViewed: '2026-03-23T20:00:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent' },
  { id: 'd15', workspaceId: 'w1', name: 'Daily Report — Mar 22', type: 'Markdown', date: '2 days ago', lastModified: '2026-03-22T18:00:00Z', lastViewed: '2026-03-22T19:00:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent' },
  { id: 'd16', workspaceId: 'w1', name: 'Daily Report — Mar 21', type: 'Markdown', date: '3 days ago', lastModified: '2026-03-21T18:00:00Z', lastViewed: '2026-03-21T21:00:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent' },
  { id: 'd17', workspaceId: 'w2', name: 'Daily Report — Mar 20', type: 'Markdown', date: '4 days ago', lastModified: '2026-03-20T18:00:00Z', lastViewed: '2026-03-20T19:30:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent' },
  { id: 'd18', workspaceId: 'w2', name: 'Daily Report — Mar 19', type: 'Markdown', date: '5 days ago', lastModified: '2026-03-19T18:00:00Z', lastViewed: '2026-03-19T20:00:00Z', labels: ['Daily Report', 'Project Alpha'], creatorName: 'Claude Assistant', creatorType: 'agent' }
];

interface Activity {
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

const initialActivities: Activity[] = [
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
    timestamp: '2026-03-19T08:30:00Z'
  },
  {
    id: 'act2',
    workspaceId: 'w1',
    userId: 'u1',
    userName: 'Human',
    userType: 'human',
    action: 'created',
    targetName: 'User Flow Diagram',
    targetType: 'Whiteboard',
    details: 'Initial onboarding and checkout flow wireframes',
    timestamp: '2026-03-18T14:20:00Z'
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
    timestamp: '2026-03-17T10:15:00Z'
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
    timestamp: '2026-03-12T16:45:00Z'
  },
  {
    id: 'act5',
    workspaceId: 'w2',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    targetName: 'Competitor Analysis',
    targetType: 'Markdown',
    details: 'Initial draft covering 5 competitors with feature matrix',
    timestamp: '2026-03-19T07:00:00Z'
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
    timestamp: '2026-03-20T10:00:00Z'
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
    timestamp: '2026-03-20T14:30:00Z'
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
    timestamp: '2026-03-15T09:20:00Z'
  },
  {
    id: 'act9',
    workspaceId: 'w2',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'updated',
    targetName: 'Competitor Analysis',
    targetType: 'Markdown',
    details: 'Added pricing comparison table across all tiers',
    timestamp: '2026-03-21T08:15:00Z'
  },
  {
    id: 'act10',
    workspaceId: 'w2',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    targetName: 'Market Trends Report',
    targetType: 'Markdown',
    details: 'Q1 2026 analysis: AI tooling market grew 34% QoQ',
    timestamp: '2026-03-18T11:00:00Z'
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
    timestamp: '2026-03-21T16:00:00Z'
  },
  {
    id: 'act12',
    workspaceId: 'w1',
    userId: 'u1',
    userName: 'Human',
    userType: 'human',
    action: 'updated',
    targetName: 'Project Alpha Architecture',
    targetType: 'Markdown',
    details: 'Reviewed and approved final version',
    timestamp: '2026-03-22T09:00:00Z'
  },
  {
    id: 'act13',
    workspaceId: 'w1',
    userId: 'u1',
    userName: 'Human',
    userType: 'human',
    action: 'commented on',
    targetName: 'Q3 Financial Projections',
    targetType: 'Table',
    details: 'Requested breakdown by region',
    timestamp: '2026-03-20T15:30:00Z'
  },
  {
    id: 'act14',
    workspaceId: 'w1',
    userId: 'u2',
    userName: 'Alice Chen',
    userType: 'human',
    action: 'created',
    targetName: 'Design System Guidelines',
    targetType: 'Markdown',
    details: 'Initial brand guidelines document',
    timestamp: '2026-03-19T11:00:00Z'
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
    details: 'Added onboarding flow',
    timestamp: '2026-03-21T10:20:00Z'
  },
  {
    id: 'act16',
    workspaceId: 'w1',
    userId: 'u3',
    userName: 'Bob Smith',
    userType: 'human',
    action: 'created',
    targetName: 'Sprint Planning Notes',
    targetType: 'Markdown',
    details: 'Sprint 12 kickoff notes',
    timestamp: '2026-03-17T09:00:00Z'
  },
  {
    id: 'act17',
    workspaceId: 'w1',
    userId: 'u3',
    userName: 'Bob Smith',
    userType: 'human',
    action: 'commented on',
    targetName: 'API Integration Guide',
    targetType: 'Markdown',
    details: 'Added edge case notes for auth flow',
    timestamp: '2026-03-21T14:45:00Z'
  },
  {
    id: 'act18',
    workspaceId: 'w2',
    userId: 'u4',
    userName: 'Eve Davis',
    userType: 'human',
    action: 'created',
    targetName: 'Marketing Strategy',
    targetType: 'Markdown',
    details: 'Q2 marketing plan draft',
    timestamp: '2026-03-16T13:00:00Z'
  },
  {
    id: 'act19',
    workspaceId: 'w2',
    userId: 'u4',
    userName: 'Eve Davis',
    userType: 'human',
    action: 'updated',
    targetName: 'Marketing Strategy',
    targetType: 'Markdown',
    details: 'Finalized budget allocations',
    timestamp: '2026-03-20T16:00:00Z'
  },
  // Agent scheduled task — Daily Industry Digest
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
    timestamp: '2026-03-24T08:00:00Z'
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
    timestamp: '2026-03-23T08:00:00Z'
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
    timestamp: '2026-03-22T08:00:00Z'
  },
  // Agent scheduled task — Daily Report
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
    timestamp: '2026-03-24T18:00:00Z'
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
    timestamp: '2026-03-23T18:00:00Z'
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
    timestamp: '2026-03-22T18:00:00Z'
  }
];

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('w1');
  const [agents, setAgents] = useState(initialAgents);
  const [users, setUsers] = useState(initialUsers);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [documents, setDocuments] = useState(initialDocuments);
  const [activities, setActivities] = useState(initialActivities);
  const [activeTab, setActiveTabState] = useState<'documents' | 'activity' | 'agents' | 'users' | 'members' | 'settings' | 'labels'>(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['documents', 'activity', 'agents', 'users', 'members', 'settings', 'labels'].includes(tab)) {
      return tab as 'documents' | 'activity' | 'agents' | 'users' | 'members' | 'settings' | 'labels';
    }
    return 'documents';
  });
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [isNewDocMenuOpen, setIsNewDocMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [docSortBy, setDocSortBy] = useState<'lastModified' | 'lastViewed'>('lastModified');
  const [docFilterType, setDocFilterType] = useState<string>('all');
  const [docFilterOwner, setDocFilterOwner] = useState<string>('all');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [docFilterLabel, setDocFilterLabel] = useState<string>('all');
  const [isLabelFilterOpen, setIsLabelFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [agentListMenuOpen, setAgentListMenuOpen] = useState<string | null>(null);
  const [selectedGlobalLabel, setSelectedGlobalLabel] = useState<string | null>(null);
  const [labelFilterOwner, setLabelFilterOwner] = useState<string>('all');
  const [labelFilterType, setLabelFilterType] = useState<string>('all');
  const [labelSortBy, setLabelSortBy] = useState<'lastModified' | 'lastViewed'>('lastModified');
  const [isLabelTypFilterOpen, setIsLabelTypFilterOpen] = useState(false);
  const [isLabelSortMenuOpen, setIsLabelSortMenuOpen] = useState(false);
  const [isLabelOwnerFilterOpen, setIsLabelOwnerFilterOpen] = useState(false);
  const [labelFilterWorkspace, setLabelFilterWorkspace] = useState<string>('all');
  const [isLabelWorkspaceFilterOpen, setIsLabelWorkspaceFilterOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const setActiveTab = (tab: 'documents' | 'activity' | 'agents' | 'users' | 'members' | 'settings' | 'labels') => {
    setActiveTabState(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    navigate(`/dashboard?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    // Show onboarding if coming from landing page with "onboarding" flag or if it's first time
    const params = new URLSearchParams(location.search);
    if (params.get('onboarding') === 'true' || agents.length === 0) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = (agentName: string) => {
    const newToken = `mx_agt_${Math.random().toString(36).substr(2, 12)}`;
    const newAgent = {
      id: `a${Date.now()}`,
      name: agentName,
      token: newToken
    };
    
    setAgents([newAgent, ...agents]);
    
    const newPermission = {
      id: `p${Date.now()}`,
      workspaceId: activeWorkspaceId,
      memberId: newAgent.id,
      memberType: 'Agent' as const,
      role: 'Editor'
    };
    setPermissions([...permissions, newPermission]);
    setShowOnboarding(false);
    setActiveTab('agents');
  };

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const workspaceDocs = documents.filter(d => d.workspaceId === activeWorkspaceId);
  
  // 排序 + 筛选逻辑
  const filteredAndSortedDocs = React.useMemo(() => {
    let docs = [...workspaceDocs];
    
    // 按类型筛选
    if (docFilterType !== 'all') {
      docs = docs.filter(d => d.type === docFilterType);
    }
    
    // 按 owner 筛选
    if (docFilterOwner !== 'all') {
      docs = docs.filter(d => d.creatorName === docFilterOwner);
    }

    // 按 label 筛选
    if (docFilterLabel !== 'all') {
      docs = docs.filter(d => d.labels.includes(docFilterLabel));
    }
    
    // 排序
    docs.sort((a, b) => {
      const dateA = new Date(a[docSortBy]).getTime();
      const dateB = new Date(b[docSortBy]).getTime();
      return dateB - dateA; // 降序（最新在前）
    });
    
    return docs;
  }, [workspaceDocs, docSortBy, docFilterType, docFilterOwner, docFilterLabel]);

  // 获取当前 workspace 的文档类型列表和 owner 列表（用于筛选选项）
  const docTypes = React.useMemo(() => {
    return Array.from(new Set(workspaceDocs.map(d => d.type)));
  }, [workspaceDocs]);
  
  const docOwners = React.useMemo(() => {
    return Array.from(new Set(workspaceDocs.map(d => d.creatorName)));
  }, [workspaceDocs]);

  const docLabels = React.useMemo(() => {
    return Array.from(new Set(workspaceDocs.flatMap(d => d.labels))).sort();
  }, [workspaceDocs]);

  const activeFilterCount = (docFilterType !== 'all' ? 1 : 0) + (docFilterOwner !== 'all' ? 1 : 0) + (docFilterLabel !== 'all' ? 1 : 0);
  const workspaceActivities = activities.filter(a => a.workspaceId === activeWorkspaceId);
  
  const workspacePermissions = permissions.filter(p => p.workspaceId === activeWorkspaceId).map(p => {
    const member = p.memberType === 'Human' 
      ? users.find(u => u.id === p.memberId) 
      : agents.find(a => a.id === p.memberId);
    return { ...p, member };
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;
    
    const newToken = `mx_agt_${Math.random().toString(36).substr(2, 12)}`;
    const newAgent = {
      id: `a${Date.now()}`,
      name: newAgentName.trim(),
      token: newToken
    };
    
    setAgents([newAgent, ...agents]);
    
    // Automatically add to current workspace as Editor
    const newPermission = {
      id: `p${Date.now()}`,
      workspaceId: activeWorkspaceId,
      memberId: newAgent.id,
      memberType: 'Agent' as const,
      role: 'Editor'
    };
    setPermissions([...permissions, newPermission]);
    setNewAgentName('');
    setIsCreatingAgent(false);
  };

  const handleQuickCreateDoc = (type: 'Markdown' | 'Table' | 'Whiteboard' | 'Chat Log') => {
    const newDoc: WorkspaceDoc = {
      id: `d${Date.now()}`,
      workspaceId: activeWorkspaceId,
      name: type === 'Chat Log' ? 'New Chat Log' : 'Untitled',
      type: type,
      date: 'Just now',
      lastModified: new Date().toISOString(),
      lastViewed: new Date().toISOString(),
      labels: [],
      creatorName: 'Human',
      creatorType: 'human'
    };

    setDocuments([newDoc, ...documents]);
    setIsNewDocMenuOpen(false);
    navigate(`/document?type=${type.toLowerCase().replace(' ', '')}`);
  };

  const generatePrompt = (token: string) => `1. Copy the installation command to Lobster
Command: Download the zip package from https://cdn.mindx.com/static/mindx-docs.zip and unzip it, help me install this skill, and then set the environment variable MINDX_TOKEN="${token}".`;

  return (
    <div className="min-h-screen bg-white text-stone-800 flex font-sans selection:bg-stone-200">
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onClose={() => setShowOnboarding(false)} 
        />
      )}
      {/* Sidebar */}
      <aside className="w-64 border-r border-stone-200 bg-[#F7F7F5] flex flex-col">
        <div className="h-14 flex items-center px-4">
          <Link to="/" className="flex items-center gap-2 hover:bg-stone-200/50 p-1.5 rounded-md transition-colors w-full">
            <div className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">MindX</span>
          </Link>
        </div>
        
        <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <div className="mb-4">
            <div className="px-3 py-2 flex items-center justify-between group relative">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Workspace</span>
              <button 
                onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                className="flex items-center gap-1 hover:bg-stone-200/50 px-1.5 py-0.5 rounded transition-colors"
              >
                <span className="text-xs font-medium text-stone-600 truncate max-w-[100px]">{activeWorkspace?.name}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isWorkspaceOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-md shadow-lg overflow-hidden z-50 py-1">
                  {workspaces.map(w => (
                    <button
                      key={w.id}
                      onClick={() => {
                        setActiveWorkspaceId(w.id);
                        setIsWorkspaceOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${
                        w.id === activeWorkspaceId ? 'bg-stone-100 text-stone-900' : 'hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <div className="w-4 h-4 rounded bg-stone-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-medium text-stone-50 text-stone-500">{w.name.charAt(0)}</span>
                      </div>
                      {w.name}
                    </button>
                  ))}
                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> New Workspace
                    </button>
                  </div>
                </div>
              )}
            </div>
            <NavItem 
              icon={<FileText className="w-4 h-4" />} 
              label="Documents" 
              active={activeTab === 'documents'} 
              onClick={() => { setActiveTab('documents'); setIsCreatingAgent(false); }}
            />
            <NavItem 
              icon={<ActivityIcon className="w-4 h-4" />} 
              label="Activity Feed" 
              active={activeTab === 'activity'} 
              onClick={() => { setActiveTab('activity'); setIsCreatingAgent(false); }}
            />
            <NavItem 
              icon={<Users className="w-4 h-4" />} 
              label="Access Control" 
              active={activeTab === 'members'} 
              onClick={() => { setActiveTab('members'); setIsCreatingAgent(false); }}
            />
            <NavItem 
              icon={<Settings className="w-4 h-4" />} 
              label="Settings" 
              active={activeTab === 'settings'}
              onClick={() => { setActiveTab('settings'); setIsCreatingAgent(false); }}
            />
          </div>

          <div>
            <div className="px-3 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Global</div>
            <NavItem 
              icon={<Bot className="w-4 h-4" />} 
              label="Agent Accounts" 
              active={activeTab === 'agents'} 
              onClick={() => { setActiveTab('agents'); setIsCreatingAgent(false); setSelectedAgentId(null); }}
            />
            <NavItem 
              icon={<User className="w-4 h-4" />} 
              label="Human Accounts" 
              active={activeTab === 'users'} 
              onClick={() => { setActiveTab('users'); setIsCreatingAgent(false); setSelectedUserId(null); }}
            />
            <NavItem 
              icon={<Tag className="w-4 h-4" />} 
              label="Labels" 
              active={activeTab === 'labels'} 
              onClick={() => { setActiveTab('labels'); setIsCreatingAgent(false); }}
            />
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-stone-200/50 cursor-pointer transition-colors">
            <div className="w-6 h-6 rounded bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-medium">
              H
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Human Account</p>
            </div>
            <LogOut className="w-4 h-4 text-stone-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-8 border-b border-stone-200">
          <h1 className="text-lg font-medium">
            {activeTab === 'documents' && 'Documents'}
            {activeTab === 'activity' && 'Activity Feed'}
            {activeTab === 'agents' && 'Agent Accounts'}
            {activeTab === 'users' && 'Human Accounts'}
            {activeTab === 'members' && 'Access Control'}
            {activeTab === 'settings' && 'Settings'}
            {activeTab === 'labels' && 'Labels'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-sm focus:outline-none focus:border-stone-300 focus:bg-white transition-colors w-64"
              />
            </div>
            {['documents', 'agents', 'members', 'users'].includes(activeTab) && (
            <div className="relative">
              <button 
                onClick={() => {
                  if (activeTab === 'agents') setIsCreatingAgent(true);
                  if (activeTab === 'documents') setIsNewDocMenuOpen(!isNewDocMenuOpen);
                  if (activeTab === 'members') {
                    // Logic to add a member from global list
                    const availableUser = users.find(u => !permissions.some(p => p.workspaceId === activeWorkspaceId && p.memberId === u.id));
                    if (availableUser) {
                      setPermissions([...permissions, {
                        id: `p${Date.now()}`,
                        workspaceId: activeWorkspaceId,
                        memberId: availableUser.id,
                        memberType: 'Human',
                        role: 'Viewer'
                      }]);
                    }
                  }
                  if (activeTab === 'users') {
                    const newId = `u${Date.now()}`;
                    setUsers([...users, { id: newId, name: 'New Human', email: 'new@example.com' }]);
                  }
                }}
                className="flex items-center gap-1.5 bg-stone-900 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> 
                {activeTab === 'documents' && 'New'}
                {activeTab === 'agents' && 'New Agent'}
                {activeTab === 'members' && 'Add Member'}
                {activeTab === 'users' && 'New Human'}
              </button>

              {activeTab === 'documents' && isNewDocMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNewDocMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                    <button 
                      onClick={() => handleQuickCreateDoc('Markdown')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-stone-400" />
                      <span>Document</span>
                    </button>
                    <button 
                      onClick={() => handleQuickCreateDoc('Table')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <Table className="w-4 h-4 text-stone-400" />
                      <span>Table</span>
                    </button>
                    <button 
                      onClick={() => handleQuickCreateDoc('Whiteboard')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <Layout className="w-4 h-4 text-stone-400" />
                      <span>Whiteboard</span>
                    </button>
                    <button 
                      onClick={() => handleQuickCreateDoc('Chat Log')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-stone-400" />
                      <span>Chat Log</span>
                    </button>
                  </div>
                </>
              )}
            </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className={`mx-auto space-y-8 ${activeTab === 'labels' ? 'max-w-7xl' : 'max-w-5xl'}`}>
            
            {activeTab === 'documents' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Owner filter tabs + active filter chips */}
                <div className="flex items-center gap-1 mb-4 flex-wrap">
                  <button
                    onClick={() => setDocFilterOwner('all')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      docFilterOwner === 'all' 
                        ? 'bg-stone-200 text-stone-700' 
                        : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
                    }`}
                  >
                    All
                  </button>
                  {docOwners.map(owner => {
                    const ownerDoc = workspaceDocs.find(d => d.creatorName === owner);
                    return (
                      <button
                        key={owner}
                        onClick={() => setDocFilterOwner(docFilterOwner === owner ? 'all' : owner)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          docFilterOwner === owner 
                            ? 'bg-stone-200 text-stone-700' 
                            : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
                        }`}
                      >
                        {ownerDoc?.creatorType === 'agent' 
                          ? <Bot className="w-3.5 h-3.5" /> 
                          : <User className="w-3.5 h-3.5" />}
                        {owner}
                      </button>
                    );
                  })}

                  {/* Active type/label filter chips */}
                  {(docFilterType !== 'all' || docFilterLabel !== 'all') && (
                    <>
                      <div className="w-px h-5 bg-stone-200 mx-1.5" />
                      {docFilterType !== 'all' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium bg-stone-100 text-stone-700">
                          {docFilterType === 'Markdown' && <FileText className="w-3.5 h-3.5 text-stone-400" />}
                          {docFilterType === 'Table' && <Table className="w-3.5 h-3.5 text-stone-400" />}
                          {docFilterType === 'Whiteboard' && <Layout className="w-3.5 h-3.5 text-stone-400" />}
                          {docFilterType === 'Chat Log' && <MessageCircle className="w-3.5 h-3.5 text-stone-400" />}
                          {docFilterType}
                          <button
                            onClick={() => setDocFilterType('all')}
                            className="ml-0.5 p-0.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {docFilterLabel !== 'all' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium bg-stone-100 text-stone-700">
                          <Tag className="w-3.5 h-3.5 text-stone-400" />
                          {docFilterLabel}
                          <button
                            onClick={() => setDocFilterLabel('all')}
                            className="ml-0.5 p-0.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="border border-stone-200/80 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]" style={{ overflow: 'visible' }}>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50/50 text-stone-500 border-b border-stone-200/80 rounded-t-xl [&>tr>th:first-child]:rounded-tl-xl [&>tr>th:last-child]:rounded-tr-xl">
                      <tr>
                        {/* Name column with Type filter */}
                        <th className="px-6 py-3 font-medium bg-stone-50/50">
                          <div className="relative inline-flex items-center">
                            <button
                              onClick={() => { setIsTypeFilterOpen(!isTypeFilterOpen); setIsSortMenuOpen(false); setIsLabelFilterOpen(false); }}
                              className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${docFilterType !== 'all' ? 'text-stone-900' : ''}`}
                            >
                              Name
                              <ChevronDown className={`w-3 h-3 transition-transform ${isTypeFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isTypeFilterOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsTypeFilterOpen(false)} />
                                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                  <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Filter by type</div>
                                  <button
                                    onClick={() => { setDocFilterType('all'); setIsTypeFilterOpen(false); }}
                                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docFilterType === 'all' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                  >
                                    All Types
                                  </button>
                                  {docTypes.map(type => (
                                    <button
                                      key={type}
                                      onClick={() => { setDocFilterType(type); setIsTypeFilterOpen(false); }}
                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docFilterType === type ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                    >
                                      {type === 'Markdown' && <FileText className="w-3.5 h-3.5 text-stone-400" />}
                                      {type === 'Table' && <Table className="w-3.5 h-3.5 text-stone-400" />}
                                      {type === 'Whiteboard' && <Layout className="w-3.5 h-3.5 text-stone-400" />}
                                      {type === 'Chat Log' && <MessageCircle className="w-3.5 h-3.5 text-stone-400" />}
                                      {type}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </th>

                        {/* Owner column (plain label) */}
                        <th className="px-6 py-3 font-medium">Owner</th>

                        {/* Labels column with Label filter */}
                        <th className="px-6 py-3 font-medium">
                          <div className="relative inline-flex items-center">
                            <button
                              onClick={() => { setIsLabelFilterOpen(!isLabelFilterOpen); setIsTypeFilterOpen(false); setIsSortMenuOpen(false); }}
                              className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${docFilterLabel !== 'all' ? 'text-stone-900' : ''}`}
                            >
                              Labels
                              <ChevronDown className={`w-3 h-3 transition-transform ${isLabelFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isLabelFilterOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsLabelFilterOpen(false)} />
                                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1 max-h-64 overflow-y-auto">
                                  <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Filter by label</div>
                                  <button
                                    onClick={() => { setDocFilterLabel('all'); setIsLabelFilterOpen(false); }}
                                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docFilterLabel === 'all' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                  >
                                    All Labels
                                  </button>
                                  {docLabels.map(label => (
                                    <button
                                      key={label}
                                      onClick={() => { setDocFilterLabel(label); setIsLabelFilterOpen(false); }}
                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docFilterLabel === label ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                    >
                                      <Tag className="w-3.5 h-3.5 text-stone-400" />
                                      {label}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </th>

                        {/* Date column with Sort toggle */}
                        <th className="px-6 py-3 font-medium whitespace-nowrap">
                          <div className="relative inline-flex items-center">
                            <button
                              onClick={() => { setIsSortMenuOpen(!isSortMenuOpen); setIsTypeFilterOpen(false); setIsLabelFilterOpen(false); }}
                              className="flex items-center gap-1.5 hover:text-stone-800 transition-colors whitespace-nowrap"
                            >
                              {docSortBy === 'lastModified' ? 'Last Modified' : 'Last Viewed'}
                              <ArrowUpDown className="w-3 h-3" />
                            </button>
                            {isSortMenuOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsSortMenuOpen(false)} />
                                <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                  <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Sort by</div>
                                  <button
                                    onClick={() => { setDocSortBy('lastModified'); setIsSortMenuOpen(false); }}
                                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docSortBy === 'lastModified' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                  >
                                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                                    Last Modified
                                    {docSortBy === 'lastModified' && <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />}
                                  </button>
                                  <button
                                    onClick={() => { setDocSortBy('lastViewed'); setIsSortMenuOpen(false); }}
                                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docSortBy === 'lastViewed' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                  >
                                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                                    Last Viewed
                                    {docSortBy === 'lastViewed' && <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </th>

                        <th className="px-6 py-3 font-medium text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredAndSortedDocs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                            <FileText className="w-8 h-8 mx-auto mb-3 text-stone-300" />
                            {activeFilterCount > 0 ? (
                              <div>
                                <p>No documents match the current filters</p>
                                <button
                                  onClick={() => { setDocFilterType('all'); setDocFilterOwner('all'); setDocFilterLabel('all'); }}
                                  className="mt-2 text-sm text-stone-600 underline hover:text-stone-900 transition-colors"
                                >
                                  Clear filters
                                </button>
                              </div>
                            ) : (
                              <p>No documents in this workspace</p>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredAndSortedDocs.map(doc => (
                          <DocRow 
                            key={doc.id}
                            docId={doc.id}
                            name={doc.name} 
                            type={doc.type} 
                            date={docSortBy === 'lastModified' ? doc.lastModified : doc.lastViewed}
                            labels={doc.labels}
                            creatorName={doc.creatorName}
                            creatorType={doc.creatorType}
                            onDelete={(id) => setDocuments(prev => prev.filter(d => d.id !== id))}
                            onLabelClick={(label) => { setSelectedGlobalLabel(label); setActiveTab('labels'); }}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ActivityFeed activities={workspaceActivities} />
              </motion.div>
            )}

            {activeTab === 'agents' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {isCreatingAgent ? (
                  <div className="max-w-2xl mx-auto">
                    <button 
                      onClick={() => setIsCreatingAgent(false)} 
                      className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-6 transition-colors text-sm font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Agents
                    </button>
                    <div className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-8">
                      <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-700 shadow-sm mb-6">
                        <Bot className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-semibold text-stone-900 mb-2 tracking-tight">Create New Agent</h2>
                      <p className="text-sm text-stone-500 mb-8">Generate a new agent token to integrate your AI assistant with the system.</p>
                      <form onSubmit={handleCreateAgent} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-2">Agent Name</label>
                          <input 
                            type="text" 
                            value={newAgentName} 
                            onChange={e => setNewAgentName(e.target.value)} 
                            className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200/80 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all" 
                            placeholder="e.g. Data Analyzer Bot" 
                            autoFocus 
                          />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                          <button 
                            type="button" 
                            onClick={() => setIsCreatingAgent(false)} 
                            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={!newAgentName.trim()} 
                            className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                          >
                            Create Agent
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : selectedAgentId ? (() => {
                  const agent = agents.find(a => a.id === selectedAgentId);
                  if (!agent) return null;
                  const agentActivities = activities
                    .filter(a => a.userId === selectedAgentId)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                  return (
                    <div>
                      <button 
                        onClick={() => setSelectedAgentId(null)} 
                        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-6 transition-colors text-sm font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to Agents
                      </button>

                      {/* Agent Detail Card */}
                      <div className="p-6 rounded-xl border border-stone-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-700 shadow-sm">
                              <Bot className="w-6 h-6" />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-stone-900 tracking-tight">{agent.name}</h2>
                              <p className="text-xs text-stone-500 font-medium">Global Agent Account</p>
                            </div>
                          </div>
                          <div className="relative">
                            <button 
                              onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
                              className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {isAgentMenuOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsAgentMenuOpen(false)} />
                                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                  <button
                                    onClick={() => setIsAgentMenuOpen(false)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                  >
                                    <Shield className="w-4 h-4 text-stone-400" />
                                    Manage Permissions
                                  </button>
                                  <button
                                    onClick={() => setIsAgentMenuOpen(false)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                  >
                                    <StopCircle className="w-4 h-4 text-stone-400" />
                                    Stop Sync
                                  </button>
                                  <div className="border-t border-stone-100 my-0.5" />
                                  <button
                                    onClick={() => {
                                      setIsAgentMenuOpen(false);
                                      setAgents(prev => prev.filter(a => a.id !== selectedAgentId));
                                      setSelectedAgentId(null);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Agent Token</h3>
                            <div className="relative">
                              <div className="bg-stone-50/80 border border-stone-200/60 rounded-lg p-3.5 text-sm font-medium text-stone-700 break-all pr-12 tracking-wide">
                                {agent.token}
                              </div>
                              <button 
                                onClick={() => copyToClipboard(agent.token, `token-${agent.id}`)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-white hover:shadow-sm text-stone-500 transition-all"
                              >
                                {copiedStates[`token-${agent.id}`] ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Wand2 className="w-3.5 h-3.5" /> Integration Prompt
                            </h3>
                            <div className="relative group">
                              <div className="bg-stone-50/80 border border-stone-200/60 rounded-lg p-3.5 text-sm text-stone-600 whitespace-pre-wrap h-28 overflow-y-auto leading-relaxed">
                                {generatePrompt(agent.token)}
                              </div>
                              <button 
                                onClick={() => copyToClipboard(generatePrompt(agent.token), `prompt-${agent.id}`)}
                                className="absolute right-2 top-2 p-1.5 rounded-md bg-white border border-stone-200/60 hover:bg-stone-50 text-stone-500 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                              >
                                {copiedStates[`prompt-${agent.id}`] ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Agent Activity Feed */}
                      <div>
                        <h3 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
                          <ActivityIcon className="w-4 h-4 text-stone-500" />
                          Recent Activity
                        </h3>
                        {agentActivities.length > 0 ? (
                          <div className="space-y-1">
                            {agentActivities.map(activity => (
                              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-all group border border-transparent hover:border-stone-200/60 hover:shadow-sm">
                                <div className="mt-0.5">
                                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 shadow-sm">
                                    <Bot className="w-4 h-4" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-stone-600 leading-relaxed">
                                    <span className="font-bold text-stone-900">{activity.userName}</span>
                                    {' '}{activity.action}{' '}
                                    <button
                                      onClick={(e) => { e.stopPropagation(); navigate(`/document?type=${activity.targetType.toLowerCase().replace(' ', '')}`); }}
                                      className="font-medium text-stone-900 hover:underline"
                                    >
                                      {activity.targetName}
                                    </button>
                                    {activity.details && (
                                      <span className="text-stone-400 italic"> — {activity.details}</span>
                                    )}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <p className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                                      <Clock className="w-3 h-3" />
                                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <span className="text-[10px] text-stone-300">•</span>
                                    <p className="text-[10px] text-stone-400 font-medium">
                                      {new Date(activity.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-12 text-center border border-stone-200/60 border-dashed rounded-xl">
                            <ActivityIcon className="w-8 h-8 text-stone-200 mx-auto mb-3" />
                            <p className="text-stone-400 text-sm">No activity recorded for this agent</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })() : agents.length === 0 ? (
                  <div className="text-center py-12 border border-stone-200 border-dashed rounded-lg">
                    <Bot className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium mb-1">No Agents Found</h3>
                    <p className="text-stone-500 text-sm mb-4">Create an agent account to generate a token and start collaborating.</p>
                    <button 
                      onClick={() => setIsCreatingAgent(true)}
                      className="bg-stone-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
                    >
                      Create Agent
                    </button>
                  </div>
                ) : (
                  agents.map(agent => {
                    const agentActivityCount = activities.filter(a => a.userId === agent.id).length;
                    const recentActivities = activities
                      .filter(a => a.userId === agent.id)
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .slice(0, 3);

                    return (
                      <div 
                        key={agent.id} 
                        onClick={() => setSelectedAgentId(agent.id)}
                        className="rounded-xl bg-white border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer group"
                      >
                        {/* Header */}
                        <div className="p-5 pb-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-700 shadow-sm">
                                <Bot className="w-5 h-5" />
                              </div>
                              <div>
                                <h2 className="text-base font-semibold text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">{agent.name}</h2>
                                <p className="text-xs text-stone-400 font-medium mt-0.5">Global Agent Account</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                                <ActivityIcon className="w-3.5 h-3.5" />
                                {agentActivityCount} activities
                              </span>
                              <div className="relative">
                              <button 
                                className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors opacity-0 group-hover:opacity-100"
                                onClick={(e) => { e.stopPropagation(); setAgentListMenuOpen(agentListMenuOpen === agent.id ? null : agent.id); }}
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {agentListMenuOpen === agent.id && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setAgentListMenuOpen(null); }} />
                                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setAgentListMenuOpen(null); }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                    >
                                      <Shield className="w-4 h-4 text-stone-400" />
                                      Manage Permissions
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setAgentListMenuOpen(null); }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                    >
                                      <StopCircle className="w-4 h-4 text-stone-400" />
                                      Stop Sync
                                    </button>
                                    <div className="border-t border-stone-100 my-0.5" />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setAgentListMenuOpen(null);
                                        setAgents(prev => prev.filter(a => a.id !== agent.id));
                                      }}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-400" />
                                      Delete
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                            </div>
                          </div>
                        </div>

                        {/* Recent 3 activities */}
                        {recentActivities.length > 0 && (
                          <div className="mt-3.5 mx-5 mb-5 pt-3.5 border-t border-stone-100 space-y-1.5">
                            {recentActivities.map(activity => (
                              <div key={activity.id} className="flex items-start gap-2 text-xs leading-relaxed">
                                <span className="text-stone-300 shrink-0 w-12 text-right font-medium pt-px">
                                  {(() => {
                                    const date = new Date(activity.timestamp);
                                    const now = new Date();
                                    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                                    if (diffDays === 0) return 'Today';
                                    if (diffDays === 1) return '1d ago';
                                    if (diffDays < 7) return `${diffDays}d ago`;
                                    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                  })()}
                                </span>
                                <span className="text-stone-500 min-w-0">
                                  <span className="text-stone-400">{activity.action} </span>
                                  <span className="font-semibold text-stone-800">{activity.targetName}</span>
                                  {activity.details && (
                                    <span className="text-stone-400"> — {activity.details}</span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {recentActivities.length === 0 && (
                          <div className="mt-3.5 mx-5 mb-5 pt-3.5 border-t border-stone-100">
                            <p className="text-xs text-stone-300 italic">No recent activity</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {selectedUserId ? (() => {
                  const user = users.find(u => u.id === selectedUserId);
                  if (!user) return null;
                  const userActivities = activities
                    .filter(a => a.userId === selectedUserId)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                  return (
                    <div>
                      <button 
                        onClick={() => setSelectedUserId(null)} 
                        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-6 transition-colors text-sm font-medium"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to Humans
                      </button>

                      {/* User Detail Card */}
                      <div className="p-6 rounded-xl border border-stone-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-8">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 font-semibold text-lg shadow-sm">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-stone-900 tracking-tight">{user.name}</h2>
                              <p className="text-xs text-stone-500 font-medium">{user.email}</p>
                            </div>
                          </div>
                          <button className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* User Activity Feed */}
                      <div>
                        <h3 className="text-sm font-semibold text-stone-900 mb-4 flex items-center gap-2">
                          <ActivityIcon className="w-4 h-4 text-stone-500" />
                          Recent Activity
                        </h3>
                        {userActivities.length > 0 ? (
                          <div className="space-y-1">
                            {userActivities.map(activity => (
                              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-all group border border-transparent hover:border-stone-200/60 hover:shadow-sm">
                                <div className="mt-0.5">
                                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 shadow-sm">
                                    <User className="w-4 h-4" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-stone-600 leading-relaxed">
                                    <span className="font-bold text-stone-900">{activity.userName}</span>
                                    {' '}{activity.action}{' '}
                                    <button
                                      onClick={(e) => { e.stopPropagation(); navigate(`/document?type=${activity.targetType.toLowerCase().replace(' ', '')}`); }}
                                      className="font-medium text-stone-900 hover:underline"
                                    >
                                      {activity.targetName}
                                    </button>
                                    {activity.details && (
                                      <span className="text-stone-400 italic"> — {activity.details}</span>
                                    )}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <p className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                                      <Clock className="w-3 h-3" />
                                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <span className="text-[10px] text-stone-300">•</span>
                                    <p className="text-[10px] text-stone-400 font-medium">
                                      {new Date(activity.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-12 text-center border border-stone-200/60 border-dashed rounded-xl">
                            <ActivityIcon className="w-8 h-8 text-stone-200 mx-auto mb-3" />
                            <p className="text-stone-400 text-sm">No activity recorded for this user</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })() : (
                  users.map(user => {
                    const userActivityCount = activities.filter(a => a.userId === user.id).length;
                    return (
                      <div 
                        key={user.id} 
                        onClick={() => setSelectedUserId(user.id)}
                        className="p-5 rounded-xl border border-stone-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-medium text-sm shadow-sm">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <h2 className="text-base font-semibold text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">{user.name}</h2>
                              <p className="text-xs text-stone-500 font-medium">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                              <ActivityIcon className="w-3.5 h-3.5" />
                              {userActivityCount} activities
                            </span>
                            <button 
                              className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeTab === 'members' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="border border-stone-200/80 rounded-xl overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50/50 text-stone-500 border-b border-stone-200/80">
                      <tr>
                        <th className="px-6 py-3 font-medium">Member</th>
                        <th className="px-6 py-3 font-medium">Type</th>
                        <th className="px-6 py-3 font-medium">Role</th>
                        <th className="px-6 py-3 font-medium text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {workspacePermissions.map(perm => (
                        <tr key={perm.id} className="hover:bg-stone-50 transition-colors group">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-stone-600 font-medium text-xs ${perm.memberType === 'Agent' ? 'bg-stone-100 border border-stone-200/60' : 'bg-stone-100'}`}>
                                {perm.memberType === 'Agent' ? <Bot className="w-4 h-4" /> : perm.member?.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-medium text-stone-800 block">{perm.member?.name}</span>
                                <span className="text-xs text-stone-400">{perm.memberType === 'Agent' ? 'Agent Account' : (perm.member as any)?.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${perm.memberType === 'Agent' ? 'bg-stone-50 text-stone-500 border border-stone-200/50' : 'text-stone-400'}`}>
                              {perm.memberType}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <select 
                              value={perm.role}
                              onChange={(e) => {
                                const newRole = e.target.value;
                                setPermissions(prev => prev.map(p => p.id === perm.id ? { ...p, role: newRole } : p));
                              }}
                              className="bg-transparent border-none text-xs font-medium focus:ring-0 cursor-pointer hover:text-stone-900 transition-colors"
                            >
                              <option value="Viewer">Viewer</option>
                              <option value="Editor">Editor</option>
                              <option value="Admin">Admin</option>
                              <option value="Owner" disabled>Owner</option>
                            </select>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <button className="p-1 rounded hover:bg-stone-200 text-stone-400 opacity-0 group-hover:opacity-100 transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                <div className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-8 space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-stone-900 mb-2 tracking-tight">Workspace Settings</h2>
                    <p className="text-sm text-stone-500">Manage your workspace configuration and preferences.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-stone-700">Workspace Name</label>
                    <input 
                      type="text" 
                      defaultValue={activeWorkspace?.name}
                      className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200/80 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
                    />
                  </div>

                  <div className="pt-6 border-t border-stone-100">
                    <h3 className="text-sm font-semibold text-stone-900 mb-4">Danger Zone</h3>
                    <button className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                      Delete Workspace
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'labels' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {(() => {
                  // 收集所有文档的全局 labels（跨 workspace）
                  const allLabels = Array.from(new Set(documents.flatMap(d => d.labels))).sort();
                  const activeLabel = selectedGlobalLabel || (allLabels.length > 0 ? allLabels[0] : null);
                  const labelDocs = activeLabel 
                    ? documents.filter(d => d.labels.includes(activeLabel))
                    : [];

                  return allLabels.length === 0 ? (
                    <div className="py-20 text-center">
                      <Tag className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                      <h3 className="text-sm font-medium text-stone-900 mb-1">No Labels Yet</h3>
                      <p className="text-stone-400 text-sm">Labels will appear here once documents are tagged.</p>
                    </div>
                  ) : (
                    <div className="flex gap-8">
                      {/* Label list sidebar */}
                      <div className="w-52 shrink-0 space-y-1">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 mb-3">All Labels</p>
                        {allLabels.map(label => {
                          const count = documents.filter(d => d.labels.includes(label)).length;
                          return (
                            <button
                              key={label}
                              onClick={() => { setSelectedGlobalLabel(label); setLabelFilterOwner('all'); setLabelFilterType('all'); setLabelFilterWorkspace('all'); }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                activeLabel === label 
                                  ? 'bg-white text-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-stone-200/50' 
                                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-transparent'
                              }`}
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <Tag className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                <span className="truncate">{label}</span>
                              </span>
                              <span className={`text-xs tabular-nums ml-2 shrink-0 ${
                                activeLabel === label ? 'text-stone-500' : 'text-stone-400'
                              }`}>{count}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Documents for selected label */}
                      <div className="flex-1 min-w-0">
                        {activeLabel && (
                          <>
                            {(() => {
                              // 筛选 + 排序逻辑
                              const labelOwners = Array.from(new Set(labelDocs.map(d => d.creatorName)));
                              const labelTypes = Array.from(new Set(labelDocs.map(d => d.type)));
                              const labelWorkspaces = Array.from(new Set(labelDocs.map(d => d.workspaceId))).map(wsId => {
                                const ws = workspaces.find(w => w.id === wsId);
                                return { id: wsId, name: ws?.name || 'Unknown' };
                              });
                              let filteredLabelDocs = [...labelDocs];
                              if (labelFilterOwner !== 'all') {
                                filteredLabelDocs = filteredLabelDocs.filter(d => d.creatorName === labelFilterOwner);
                              }
                              if (labelFilterType !== 'all') {
                                filteredLabelDocs = filteredLabelDocs.filter(d => d.type === labelFilterType);
                              }
                              if (labelFilterWorkspace !== 'all') {
                                filteredLabelDocs = filteredLabelDocs.filter(d => d.workspaceId === labelFilterWorkspace);
                              }
                              filteredLabelDocs.sort((a, b) => {
                                const dateA = new Date(a[labelSortBy]).getTime();
                                const dateB = new Date(b[labelSortBy]).getTime();
                                return dateB - dateA;
                              });

                              const formatDate = (dateStr: string) => {
                                const dateObj = new Date(dateStr);
                                if (isNaN(dateObj.getTime())) return dateStr;
                                const now = new Date();
                                const diffMs = now.getTime() - dateObj.getTime();
                                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                                if (diffHours < 1) return 'Just now';
                                if (diffHours < 24) return `${diffHours}h ago`;
                                if (diffDays === 1) return 'Yesterday';
                                if (diffDays < 7) return `${diffDays}d ago`;
                                return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
                              };

                              return (
                                <>
                                  {/* Header: label badge + doc count */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-lg">
                                      <Tag className="w-4 h-4 text-stone-500" />
                                      <span className="text-sm font-semibold text-stone-900">{activeLabel}</span>
                                    </div>
                                    <span className="text-xs text-stone-400 font-medium">{labelDocs.length} document{labelDocs.length !== 1 ? 's' : ''} across workspaces</span>
                                  </div>

                                  {/* Active filter chips */}
                                  {(labelFilterType !== 'all' || labelFilterOwner !== 'all' || labelFilterWorkspace !== 'all') && (
                                    <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                                      {labelFilterType !== 'all' && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium bg-stone-100 text-stone-700">
                                          {labelFilterType === 'Markdown' && <FileText className="w-3.5 h-3.5 text-stone-400" />}
                                          {labelFilterType === 'Table' && <Table className="w-3.5 h-3.5 text-stone-400" />}
                                          {labelFilterType === 'Whiteboard' && <Layout className="w-3.5 h-3.5 text-stone-400" />}
                                          {labelFilterType === 'Chat Log' && <MessageCircle className="w-3.5 h-3.5 text-stone-400" />}
                                          {labelFilterType}
                                          <button
                                            onClick={() => setLabelFilterType('all')}
                                            className="ml-0.5 p-0.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </span>
                                      )}
                                      {labelFilterOwner !== 'all' && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium bg-stone-100 text-stone-700">
                                          {labelDocs.find(d => d.creatorName === labelFilterOwner)?.creatorType === 'agent'
                                            ? <Bot className="w-3.5 h-3.5 text-stone-400" />
                                            : <User className="w-3.5 h-3.5 text-stone-400" />}
                                          {labelFilterOwner}
                                          <button
                                            onClick={() => setLabelFilterOwner('all')}
                                            className="ml-0.5 p-0.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </span>
                                      )}
                                      {labelFilterWorkspace !== 'all' && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium bg-stone-100 text-stone-700">
                                          {labelWorkspaces.find(ws => ws.id === labelFilterWorkspace)?.name || 'Unknown'}
                                          <button
                                            onClick={() => setLabelFilterWorkspace('all')}
                                            className="ml-0.5 p-0.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Table */}
                                  <div className="border border-stone-200/80 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden" style={{ overflow: 'visible' }}>
                                    <table className="w-full text-left text-sm">
                                      <thead className="bg-stone-50/50 text-stone-500 border-b border-stone-200/80 [&>tr>th:first-child]:rounded-tl-xl [&>tr>th:last-child]:rounded-tr-xl">
                                        <tr>
                                          {/* Name column with Type filter */}
                                          <th className="px-6 py-3 font-medium whitespace-nowrap bg-stone-50/50">
                                            <div className="relative inline-flex items-center">
                                              <button
                                                onClick={() => { setIsLabelTypFilterOpen(!isLabelTypFilterOpen); setIsLabelSortMenuOpen(false); setIsLabelOwnerFilterOpen(false); setIsLabelWorkspaceFilterOpen(false); }}
                                                className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${labelFilterType !== 'all' ? 'text-stone-900' : ''}`}
                                              >
                                                Name
                                                <ChevronDown className={`w-3 h-3 transition-transform ${isLabelTypFilterOpen ? 'rotate-180' : ''}`} />
                                              </button>
                                              {isLabelTypFilterOpen && (
                                                <>
                                                  <div className="fixed inset-0 z-10" onClick={() => setIsLabelTypFilterOpen(false)} />
                                                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                                    <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Filter by type</div>
                                                    <button
                                                      onClick={() => { setLabelFilterType('all'); setIsLabelTypFilterOpen(false); }}
                                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelFilterType === 'all' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                    >
                                                      All Types
                                                    </button>
                                                    {labelTypes.map(type => (
                                                      <button
                                                        key={type}
                                                        onClick={() => { setLabelFilterType(type); setIsLabelTypFilterOpen(false); }}
                                                        className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelFilterType === type ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                      >
                                                        {type === 'Markdown' && <FileText className="w-3.5 h-3.5 text-stone-400" />}
                                                        {type === 'Table' && <Table className="w-3.5 h-3.5 text-stone-400" />}
                                                        {type === 'Whiteboard' && <Layout className="w-3.5 h-3.5 text-stone-400" />}
                                                        {type === 'Chat Log' && <MessageCircle className="w-3.5 h-3.5 text-stone-400" />}
                                                        {type}
                                                      </button>
                                                    ))}
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </th>
                                          {/* Workspace column with filter */}
                                          <th className="px-6 py-3 font-medium whitespace-nowrap">
                                            <div className="relative inline-flex items-center">
                                              <button
                                                onClick={() => { setIsLabelWorkspaceFilterOpen(!isLabelWorkspaceFilterOpen); setIsLabelTypFilterOpen(false); setIsLabelSortMenuOpen(false); setIsLabelOwnerFilterOpen(false); }}
                                                className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${labelFilterWorkspace !== 'all' ? 'text-stone-900' : ''}`}
                                              >
                                                Workspace
                                                <ChevronDown className={`w-3 h-3 transition-transform ${isLabelWorkspaceFilterOpen ? 'rotate-180' : ''}`} />
                                              </button>
                                              {isLabelWorkspaceFilterOpen && (
                                                <>
                                                  <div className="fixed inset-0 z-10" onClick={() => setIsLabelWorkspaceFilterOpen(false)} />
                                                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                                    <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Filter by workspace</div>
                                                    <button
                                                      onClick={() => { setLabelFilterWorkspace('all'); setIsLabelWorkspaceFilterOpen(false); }}
                                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelFilterWorkspace === 'all' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                    >
                                                      All Workspaces
                                                    </button>
                                                    {labelWorkspaces.map(ws => (
                                                      <button
                                                        key={ws.id}
                                                        onClick={() => { setLabelFilterWorkspace(ws.id); setIsLabelWorkspaceFilterOpen(false); }}
                                                        className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelFilterWorkspace === ws.id ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                      >
                                                        {ws.name}
                                                        {labelFilterWorkspace === ws.id && <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />}
                                                      </button>
                                                    ))}
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </th>
                                          {/* Owner column with filter */}
                                          <th className="px-6 py-3 font-medium whitespace-nowrap">
                                            <div className="relative inline-flex items-center">
                                              <button
                                                onClick={() => { setIsLabelOwnerFilterOpen(!isLabelOwnerFilterOpen); setIsLabelTypFilterOpen(false); setIsLabelSortMenuOpen(false); setIsLabelWorkspaceFilterOpen(false); }}
                                                className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${labelFilterOwner !== 'all' ? 'text-stone-900' : ''}`}
                                              >
                                                Owner
                                                <ChevronDown className={`w-3 h-3 transition-transform ${isLabelOwnerFilterOpen ? 'rotate-180' : ''}`} />
                                              </button>
                                              {isLabelOwnerFilterOpen && (
                                                <>
                                                  <div className="fixed inset-0 z-10" onClick={() => setIsLabelOwnerFilterOpen(false)} />
                                                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                                    <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Filter by owner</div>
                                                    <button
                                                      onClick={() => { setLabelFilterOwner('all'); setIsLabelOwnerFilterOpen(false); }}
                                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelFilterOwner === 'all' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                    >
                                                      All Owners
                                                    </button>
                                                    {labelOwners.map(owner => {
                                                      const ownerDoc = labelDocs.find(d => d.creatorName === owner);
                                                      return (
                                                        <button
                                                          key={owner}
                                                          onClick={() => { setLabelFilterOwner(owner); setIsLabelOwnerFilterOpen(false); }}
                                                          className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelFilterOwner === owner ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                        >
                                                          {ownerDoc?.creatorType === 'agent'
                                                            ? <Bot className="w-3.5 h-3.5 text-stone-400" />
                                                            : <User className="w-3.5 h-3.5 text-stone-400" />}
                                                          {owner}
                                                          {labelFilterOwner === owner && <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />}
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </th>
                                          <th className="px-6 py-3 font-medium whitespace-nowrap">Labels</th>
                                          {/* Date column with Sort toggle */}
                                          <th className="px-6 py-3 font-medium whitespace-nowrap">
                                            <div className="relative inline-flex items-center">
                                              <button
                                                onClick={() => { setIsLabelSortMenuOpen(!isLabelSortMenuOpen); setIsLabelTypFilterOpen(false); setIsLabelOwnerFilterOpen(false); setIsLabelWorkspaceFilterOpen(false); }}
                                                className="flex items-center gap-1.5 hover:text-stone-800 transition-colors whitespace-nowrap"
                                              >
                                                {labelSortBy === 'lastModified' ? 'Last Modified' : 'Last Viewed'}
                                                <ArrowUpDown className="w-3 h-3" />
                                              </button>
                                              {isLabelSortMenuOpen && (
                                                <>
                                                  <div className="fixed inset-0 z-10" onClick={() => setIsLabelSortMenuOpen(false)} />
                                                  <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                                    <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Sort by</div>
                                                    <button
                                                      onClick={() => { setLabelSortBy('lastModified'); setIsLabelSortMenuOpen(false); }}
                                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelSortBy === 'lastModified' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                    >
                                                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                                                      Last Modified
                                                      {labelSortBy === 'lastModified' && <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />}
                                                    </button>
                                                    <button
                                                      onClick={() => { setLabelSortBy('lastViewed'); setIsLabelSortMenuOpen(false); }}
                                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelSortBy === 'lastViewed' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                    >
                                                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                                                      Last Viewed
                                                      {labelSortBy === 'lastViewed' && <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />}
                                                    </button>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-stone-100">
                                        {filteredLabelDocs.length === 0 ? (
                                          <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-stone-500">
                                              <FileText className="w-8 h-8 mx-auto mb-3 text-stone-300" />
                                              <p>No documents match the current filters</p>
                                              <button
                                                onClick={() => { setLabelFilterOwner('all'); setLabelFilterType('all'); setLabelFilterWorkspace('all'); }}
                                                className="mt-2 text-sm text-stone-900 font-medium hover:underline"
                                              >
                                                Clear all filters
                                              </button>
                                            </td>
                                          </tr>
                                        ) : (
                                          filteredLabelDocs.map(doc => {
                                            const ws = workspaces.find(w => w.id === doc.workspaceId);
                                            return (
                                              <tr 
                                                key={doc.id} 
                                                className="hover:bg-stone-50 transition-colors cursor-pointer group"
                                                onClick={() => navigate(`/document?type=${doc.type.toLowerCase().replace(' ', '')}`)}
                                              >
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                  <div className="flex items-center gap-3">
                                                    {doc.type === 'Table' && <Table className="w-4 h-4 text-stone-400 shrink-0" />}
                                                    {doc.type === 'Whiteboard' && <Layout className="w-4 h-4 text-stone-400 shrink-0" />}
                                                    {doc.type === 'Chat Log' && <MessageCircle className="w-4 h-4 text-stone-400 shrink-0" />}
                                                    {(doc.type === 'Markdown' || !['Table', 'Whiteboard', 'Chat Log'].includes(doc.type)) && <FileText className="w-4 h-4 text-stone-400 shrink-0" />}
                                                    <span className="font-medium text-stone-800">{doc.name}</span>
                                                  </div>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200/50">
                                                    {ws?.name || 'Unknown'}
                                                  </span>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                  <div className="flex items-center gap-2 text-stone-500">
                                                    {doc.creatorType === 'agent' ? (
                                                      <div className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-stone-500 shrink-0">
                                                        <Bot className="w-3 h-3" />
                                                      </div>
                                                    ) : (
                                                      <div className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-stone-500 shrink-0">
                                                        <User className="w-3 h-3" />
                                                      </div>
                                                    )}
                                                    <span className="text-sm">{doc.creatorName}</span>
                                                  </div>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                  <div className="flex items-center gap-1.5">
                                                    {doc.labels.map(l => (
                                                      <span
                                                        key={l}
                                                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                                                          l === activeLabel
                                                            ? 'bg-stone-200 text-stone-700'
                                                            : 'bg-stone-100 text-stone-600'
                                                        }`}
                                                      >
                                                        {l}
                                                      </span>
                                                    ))}
                                                  </div>
                                                </td>
                                                <td className="px-6 py-3 text-stone-500 text-sm whitespace-nowrap">{formatDate(labelSortBy === 'lastModified' ? doc.lastModified : doc.lastViewed)}</td>
                                              </tr>
                                            );
                                          })
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-white text-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-stone-200/50' 
          : 'text-stone-600 hover:bg-stone-200/40 hover:text-stone-900 border border-transparent'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

interface DocRowProps {
  key?: string | number;
  docId: string;
  name: string;
  type: string;
  date: string;
  labels: string[];
  creatorName: string;
  creatorType: 'human' | 'agent';
  onDelete: (id: string) => void;
  onLabelClick?: (label: string) => void;
}

function DocRow({ docId, name, type, date, labels, creatorName, creatorType, onDelete, onLabelClick }: DocRowProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getDocIcon = () => {
    switch (type.toLowerCase()) {
      case 'table':
        return <Table className="w-4 h-4 text-stone-400 shrink-0" />;
      case 'whiteboard':
        return <Layout className="w-4 h-4 text-stone-400 shrink-0" />;
      case 'chat log':
        return <MessageCircle className="w-4 h-4 text-stone-400 shrink-0" />;
      case 'markdown':
      default:
        return <FileText className="w-4 h-4 text-stone-400 shrink-0" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return 'Last week';
    return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    // 模拟下载：生成一个文本文件并触发下载
    const content = `# ${name}\n\nType: ${type}\nCreated by: ${creatorName}\nDate: ${date}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete(docId);
  };

  return (
    <tr className="hover:bg-stone-50 transition-colors group cursor-pointer" onClick={() => navigate(`/document?type=${type.toLowerCase().replace(' ', '')}`)}>
      <td className="px-6 py-3">
        <div className="flex items-center gap-3">
          {getDocIcon()}
          <span className="font-medium text-stone-800">{name}</span>
        </div>
      </td>
      <td className="px-6 py-3">
        <div className="flex items-center gap-2 text-stone-500">
          {creatorType === 'agent' ? (
            <div className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-stone-500 shrink-0" title="Agent">
              <Bot className="w-3 h-3" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-stone-500 shrink-0" title="Human">
              <User className="w-3 h-3" />
            </div>
          )}
          <span className="text-sm">{creatorName}</span>
        </div>
      </td>
      <td className="px-6 py-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {labels.map(label => (
            <button
              key={label}
              onClick={(e) => { e.stopPropagation(); onLabelClick?.(label); }}
              className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-xs font-medium px-2 py-0.5 rounded-full hover:bg-stone-200 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <Tag className="w-3 h-3 text-stone-400 shrink-0" />
              {label}
            </button>
          ))}
          {labels.length === 0 && (
            <span className="text-stone-300 text-xs">—</span>
          )}
        </div>
      </td>
      <td className="px-6 py-3 text-stone-500 text-sm whitespace-nowrap">{formatDate(date)}</td>
      <td className="px-6 py-3 text-right">
        <div className="relative inline-block">
          <button 
            className="p-1 rounded hover:bg-stone-200 text-stone-400 opacity-0 group-hover:opacity-100 transition-all" 
            onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} />
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-stone-400" />
                  Download
                </button>
                <div className="border-t border-stone-100 my-0.5" />
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

interface ActivityFeedProps {
  activities: Activity[];
}

function ActivityFeed({ activities }: ActivityFeedProps) {
  const navigate = useNavigate();
  const groupActivitiesByWeek = (activities: Activity[]) => {
    const groups: Record<string, Activity[]> = {};
    const sorted = [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    sorted.forEach(activity => {
      const date = new Date(activity.timestamp);
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      let key = '';
      if (diffInDays < 7) {
        key = 'This Week';
      } else if (diffInDays < 14) {
        key = 'Last Week';
      } else {
        const month = date.toLocaleString('default', { month: 'long' });
        key = `${month} ${date.getFullYear()}`;
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(activity);
    });
    return groups;
  };

  const grouped = groupActivitiesByWeek(activities);

  return (
    <div className="space-y-8 pb-12">
      {Object.entries(grouped).map(([week, weekActivities]) => (
        <div key={week} className="space-y-4">
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2">{week}</h3>
          <div className="space-y-1">
            {weekActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-all group border border-transparent hover:border-stone-200/60 hover:shadow-sm">
                <div className="mt-0.5">
                  {activity.userType === 'agent' ? (
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200 shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-600 leading-relaxed">
                    <span className="font-bold text-stone-900">{activity.userName}</span>
                    {' '}{activity.action}{' '}
                    <button
                      onClick={() => navigate(`/document?type=${activity.targetType.toLowerCase().replace(' ', '')}`)}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {activity.targetName}
                    </button>
                    {activity.details && (
                      <span className="text-stone-400 italic"> — {activity.details}</span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className="text-[10px] text-stone-300">•</span>
                    <p className="text-[10px] text-stone-400 font-medium">
                      {new Date(activity.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {activities.length === 0 && (
        <div className="py-20 text-center">
          <ActivityIcon className="w-12 h-12 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-400 text-sm">No recent activity in this workspace</p>
        </div>
      )}
    </div>
  );
}
