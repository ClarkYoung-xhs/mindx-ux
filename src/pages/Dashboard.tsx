import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';
import { getDocTypeIcon } from '../components/DocIcons';
import { getAgentAvatar, getUserAvatar } from '../components/AgentAvatars';
import { useLanguage, LanguageSwitcher } from '../i18n/LanguageContext';
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
  StopCircle,
  Share2,
  Link as LinkIcon,
  Globe,
  ExternalLink,
  Package,
  Terminal,
  Zap
} from 'lucide-react';

const initialWorkspaces = [
  { id: 'w1', name: 'Main Space' }
];

const initialAgents = [
  { id: 'a1', name: 'Claude Assistant', token: 'mx_agt_9f8e7d6c5b4a3', connected: true, createdAt: '2026-03-10T10:00:00Z', installedSkills: ['MindX Docs', 'Data Analysis', 'Search Engine'] },
  { id: 'a2', name: 'Data Analyzer', token: 'mx_agt_1a2b3c4d5e6f7', connected: true, createdAt: '2026-03-15T14:30:00Z', installedSkills: ['MindX Docs'] },
  { id: 'a3', name: 'Research Bot', token: 'mx_agt_8x7y6z5w4v3u2', connected: false, createdAt: '2026-03-20T09:00:00Z', installedSkills: [] }
];

const currentUser = {
  id: 'u1',
  name: 'Me',
  email: 'you@example.com',
};

const initialPermissions = [
  { id: 'p1', workspaceId: 'w1', memberId: currentUser.id, memberType: 'Human', role: 'Owner' },
  { id: 'p3', workspaceId: 'w1', memberId: 'a1', memberType: 'Agent', role: 'Editor' },
  { id: 'p4', workspaceId: 'w1', memberId: 'a2', memberType: 'Agent', role: 'Viewer' },
  { id: 'p7', workspaceId: 'w1', memberId: 'a3', memberType: 'Agent', role: 'Admin' }
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
  size: number; // Size in bytes
}

interface AgentPermission {
  agentId: string;
  agentName: string;
  permission: 'read' | 'edit';
}

const initialDocuments: WorkspaceDoc[] = [
  { id: 'd1', workspaceId: 'w1', name: 'Project Alpha Architecture', type: 'Smart Doc', date: '2 hours ago', lastModified: '2026-03-24T12:00:00Z', lastViewed: '2026-03-24T13:30:00Z', labels: ['Project Alpha', 'PRD'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 32768 },
  { id: 'd2', workspaceId: 'w1', name: 'Q3 Financial Projections', type: 'Table', date: 'Yesterday', lastModified: '2026-03-23T10:00:00Z', lastViewed: '2026-03-24T09:00:00Z', labels: ['Data', 'Finance'], creatorName: 'Data Analyzer', creatorType: 'agent', size: 65536 },
  { id: 'd3', workspaceId: 'w1', name: 'User Flow Diagram', type: 'Whiteboard', date: 'Last week', lastModified: '2026-03-17T15:00:00Z', lastViewed: '2026-03-22T11:00:00Z', labels: ['Design', 'Project Alpha'], creatorName: currentUser.name, creatorType: 'human', size: 128000 },
  { id: 'd6', workspaceId: 'w1', name: 'Claude & Maya: Feature Discussion', type: 'Smart Doc', date: '3 hours ago', lastModified: '2026-03-24T11:00:00Z', lastViewed: '2026-03-24T11:30:00Z', labels: ['Meeting Notes'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 24576 },
  { id: 'd4', workspaceId: 'w1', name: 'Competitor Analysis', type: 'Markdown', date: '1 hour ago', lastModified: '2026-03-24T13:00:00Z', lastViewed: '2026-03-24T13:45:00Z', labels: ['Research', 'Data'], creatorName: 'Research Bot', creatorType: 'agent', size: 40960 },
  { id: 'd5', workspaceId: 'w1', name: 'Marketing Strategy', type: 'Smart Doc', date: '2 days ago', lastModified: '2026-03-22T14:00:00Z', lastViewed: '2026-03-23T16:00:00Z', labels: ['PRD', 'Marketing'], creatorName: currentUser.name, creatorType: 'human', size: 53248 },
  // Agent scheduled task outputs — Daily Industry Digest
  { id: 'd7', workspaceId: 'w1', name: 'Industry Digest — Mar 24', type: 'Markdown', date: 'Today', lastModified: '2026-03-24T08:00:00Z', lastViewed: '2026-03-24T10:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 45056 },
  { id: 'd8', workspaceId: 'w1', name: 'Industry Digest — Mar 23', type: 'Markdown', date: 'Yesterday', lastModified: '2026-03-23T08:00:00Z', lastViewed: '2026-03-23T12:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 43008 },
  { id: 'd9', workspaceId: 'w1', name: 'Industry Digest — Mar 22', type: 'Markdown', date: '2 days ago', lastModified: '2026-03-22T08:00:00Z', lastViewed: '2026-03-22T09:30:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 48128 },
  { id: 'd10', workspaceId: 'w1', name: 'Industry Digest — Mar 21', type: 'Markdown', date: '3 days ago', lastModified: '2026-03-21T08:00:00Z', lastViewed: '2026-03-21T11:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 51200 },
  { id: 'd11', workspaceId: 'w1', name: 'Industry Digest — Mar 20', type: 'Markdown', date: '4 days ago', lastModified: '2026-03-20T08:00:00Z', lastViewed: '2026-03-20T14:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 46080 },
  { id: 'd12', workspaceId: 'w1', name: 'Industry Digest — Mar 19', type: 'Markdown', date: '5 days ago', lastModified: '2026-03-19T08:00:00Z', lastViewed: '2026-03-19T10:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 49152 },
  // Agent scheduled task outputs — Daily Report
  { id: 'd13', workspaceId: 'w1', name: 'Daily Report — Mar 24', type: 'Markdown', date: 'Today', lastModified: '2026-03-24T18:00:00Z', lastViewed: '2026-03-24T18:30:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 73728 },
  { id: 'd14', workspaceId: 'w1', name: 'Daily Report — Mar 23', type: 'Markdown', date: 'Yesterday', lastModified: '2026-03-23T18:00:00Z', lastViewed: '2026-03-23T20:00:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 71680 },
  { id: 'd15', workspaceId: 'w1', name: 'Daily Report — Mar 22', type: 'Markdown', date: '2 days ago', lastModified: '2026-03-22T18:00:00Z', lastViewed: '2026-03-22T19:00:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 69632 },
  { id: 'd16', workspaceId: 'w1', name: 'Daily Report — Mar 21', type: 'Markdown', date: '3 days ago', lastModified: '2026-03-21T18:00:00Z', lastViewed: '2026-03-21T21:00:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 75776 },
  { id: 'd17', workspaceId: 'w1', name: 'Daily Report — Mar 20', type: 'Markdown', date: '4 days ago', lastModified: '2026-03-20T18:00:00Z', lastViewed: '2026-03-20T19:30:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 72704 },
  { id: 'd18', workspaceId: 'w1', name: 'Daily Report — Mar 19', type: 'Markdown', date: '5 days ago', lastModified: '2026-03-19T18:00:00Z', lastViewed: '2026-03-19T20:00:00Z', labels: ['Daily Report', 'Project Alpha'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 77824 }
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
    userName: currentUser.name,
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
    workspaceId: 'w1',
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
    workspaceId: 'w1',
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
    workspaceId: 'w1',
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
    userName: currentUser.name,
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
    userName: currentUser.name,
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
    action: 'commented on',
    targetName: 'Project Alpha Architecture',
    targetType: 'Markdown',
    details: 'Shared handoff notes about service boundaries before design review',
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
    details: 'Added stakeholder review and approval path to the onboarding flow',
    timestamp: '2026-03-21T10:20:00Z'
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
    timestamp: '2026-03-17T09:00:00Z'
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
    timestamp: '2026-03-21T14:45:00Z'
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
    timestamp: '2026-03-16T13:00:00Z'
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
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(initialWorkspaces[0]?.id ?? 'w1');
  const [agents, setAgents] = useState(initialAgents);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [documents, setDocuments] = useState(initialDocuments);
  const [activities, setActivities] = useState(initialActivities);
  const [activeTab, setActiveTabState] = useState<'documents' | 'activity' | 'agents' | 'members' | 'settings' | 'labels' | 'skills'>(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['documents', 'activity', 'agents', 'members', 'settings', 'labels', 'skills'].includes(tab)) {
      return tab as 'documents' | 'activity' | 'agents' | 'members' | 'settings' | 'labels' | 'skills';
    }
    return 'documents';
  });
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [isNewDocMenuOpen, setIsNewDocMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [docSortBy, setDocSortBy] = useState<'lastModified' | 'lastViewed'>('lastModified');
  const [docFilterType, setDocFilterType] = useState<string>('all');
  const [docFilterOwner, setDocFilterOwner] = useState<string>('all');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [docFilterLabel, setDocFilterLabel] = useState<string>('all');
  const [isLabelFilterOpen, setIsLabelFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [agentListMenuOpen, setAgentListMenuOpen] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [activityFilterOwner, setActivityFilterOwner] = useState<string>('all');

  // Document actions
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [agentPermissionModalOpen, setAgentPermissionModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [usedTags, setUsedTags] = useState<string[]>(['PRD', 'Data', 'Design', 'Research', 'Marketing', 'Meeting Notes', 'Finance']);
  const [agentPermissions, setAgentPermissions] = useState<AgentPermission[]>([]);

  const { t, lang } = useLanguage();

  const location = useLocation();
  const navigate = useNavigate();

  const setActiveTab = (tab: 'documents' | 'activity' | 'agents' | 'members' | 'settings' | 'labels' | 'skills') => {
    setActiveTabState(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    navigate(`/dashboard?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    // Show onboarding if coming from landing page with "onboarding" flag or if it's first time
    const params = new URLSearchParams(location.search);
    if (params.get('onboarding') === 'true') {
      setShowOnboarding(true);
      // Clear the onboarding parameter from URL
      params.delete('onboarding');
      navigate(`/dashboard?${params.toString()}`, { replace: true });
    } else if (agents.length === 0) {
      setShowOnboarding(true);
    }
  }, []);

  // Keep multi-space support in the prototype internals without exposing it in the main UI yet.
  const switchWorkspace = (workspaceId: string) => {
    if (!workspaces.some(workspace => workspace.id === workspaceId)) return;

    setActiveWorkspaceId(workspaceId);
    setDocFilterType('all');
    setDocFilterOwner('all');
    setDocFilterLabel('all');
    setActivityFilterOwner('all');


  };

  const createWorkspace = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return null;

    const newWorkspace = {
      id: `w${Date.now()}`,
      name: trimmedName,
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    setActiveWorkspaceId(newWorkspace.id);
    return newWorkspace.id;
  };

  const renameActiveWorkspace = (name: string) => {
    setWorkspaces(prev =>
      prev.map(workspace =>
        workspace.id === activeWorkspaceId ? { ...workspace, name } : workspace
      )
    );
  };

  const handleOnboardingComplete = (agentName: string) => {
    const newToken = `mx_agt_${Math.random().toString(36).substr(2, 12)}`;
    const newAgent = {
      id: `a${Date.now()}`,
      name: agentName,
      token: newToken,
      connected: false,
      createdAt: new Date().toISOString(),
      installedSkills: [] as string[]
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

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) ?? workspaces[0];
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
    const owners = Array.from(new Set(workspaceDocs.map(d => d.creatorName)));
    return owners.sort((a, b) => a === currentUser.name ? -1 : b === currentUser.name ? 1 : 0);
  }, [workspaceDocs]);

  const docLabels = React.useMemo(() => {
    return Array.from(new Set(workspaceDocs.flatMap(d => d.labels))).sort();
  }, [workspaceDocs]);

  const activeFilterCount = (docFilterType !== 'all' ? 1 : 0) + (docFilterOwner !== 'all' ? 1 : 0) + (docFilterLabel !== 'all' ? 1 : 0);
  const workspaceActivities = activities.filter(a => a.workspaceId === activeWorkspaceId);
  const activityOwners = React.useMemo(() => {
    return Array.from(new Set(workspaceActivities.map(a => a.userName)));
  }, [workspaceActivities]);
  const filteredActivities = React.useMemo(() => {
    if (activityFilterOwner === 'all') return workspaceActivities;
    return workspaceActivities.filter(a => a.userName === activityFilterOwner);
  }, [workspaceActivities, activityFilterOwner]);

  const availableAgents = agents.filter(agent => !permissions.some(permission => permission.workspaceId === activeWorkspaceId && permission.memberId === agent.id));
  
  const workspacePermissions = permissions.filter(p => p.workspaceId === activeWorkspaceId).map(p => {
    const member = p.memberType === 'Human'
      ? (p.memberId === currentUser.id ? currentUser : undefined)
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
      token: newToken,
      connected: false,
      createdAt: new Date().toISOString(),
      installedSkills: [] as string[]
    };
    
    setAgents([newAgent, ...agents]);
    
    // Automatically add to the current space as Editor
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
    setSelectedAgentId(newAgent.id);
  };

  const handleQuickCreateDoc = (type: 'Smart Doc' | 'Markdown' | 'Table' | 'Whiteboard' | 'Form') => {
    const newDoc: WorkspaceDoc = {
      id: `d${Date.now()}`,
      workspaceId: activeWorkspaceId,
      name: 'Untitled',
      type: type,
      date: 'Just now',
      lastModified: new Date().toISOString(),
      lastViewed: new Date().toISOString(),
      labels: [],
      creatorName: currentUser.name,
      creatorType: 'human',
      size: 0
    };

    setDocuments([newDoc, ...documents]);
    setIsNewDocMenuOpen(false);
    navigate(`/document?type=${type.toLowerCase().replace(' ', '')}`);
  };

  const generatePrompt = (token: string) => `1. Copy the installation command to Lobster
Command: Download the zip package from https://cdn.mindx.com/static/mindx-docs.zip and unzip it, help me install this skill, and then set the environment variable MINDX_TOKEN="${token}".

2. Install Tencent Docs Skill
Command: Download the zip package from https://cdn.addon.tencentsuite.com/static/tencent-docs.zip and unzip it, help me install this skill, and then set the environment variable TENCENT_DOCS_TOKEN="8678a272066b4156ae2ad95c2709cc2b".`;

  return (
    <div className="h-screen bg-white text-stone-800 flex font-sans selection:bg-stone-200 overflow-hidden">
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onClose={() => setShowOnboarding(false)} 
        />
      )}

      {/* Label Modal */}
      {labelModalOpen && selectedDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setLabelModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">设置标签</h2>
            
            {/* Existing labels */}
            <div className="mb-4">
              <p className="text-xs font-medium text-stone-600 mb-2">已有标签</p>
              <div className="flex flex-wrap gap-2">
                {documents.find(d => d.id === selectedDocId)?.labels.map(label => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-700 text-sm rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {label}
                    <button
                      onClick={() => {
                        setDocuments(prev => prev.map(d => 
                          d.id === selectedDocId 
                            ? { ...d, labels: d.labels.filter(l => l !== label) }
                            : d
                        ));
                      }}
                      className="p-0.5 rounded-full hover:bg-stone-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add new label */}
            <div className="mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    const newLabel = tagInput.trim();
                    setDocuments(prev => prev.map(d => 
                      d.id === selectedDocId && !d.labels.includes(newLabel)
                        ? { ...d, labels: [...d.labels, newLabel] }
                        : d
                    ));
                    if (!usedTags.includes(newLabel)) {
                      setUsedTags(prev => [...prev, newLabel]);
                    }
                    setTagInput('');
                  }
                }}
                placeholder="输入标签后按回车添加"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 text-sm"
              />
            </div>

            {/* Historical labels */}
            <div>
              <p className="text-xs font-medium text-stone-600 mb-2">历史标签</p>
              <div className="flex flex-wrap gap-2">
                {usedTags
                  .filter(tag => !documents.find(d => d.id === selectedDocId)?.labels.includes(tag))
                  .map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setDocuments(prev => prev.map(d => 
                          d.id === selectedDocId
                            ? { ...d, labels: [...d.labels, tag] }
                            : d
                        ));
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-50 text-stone-600 text-xs rounded-full hover:bg-stone-100 transition-colors"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setLabelModalOpen(false);
                  setSelectedDocId(null);
                  setTagInput('');
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                完成
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Agent Permission Modal */}
      {agentPermissionModalOpen && selectedDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAgentPermissionModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold mb-4">Agent权限设置</h2>
            
            <div className="space-y-3 mb-6">
              {agentPermissions.map(agentPerm => (
                <div key={agentPerm.agentId} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-stone-600" />
                    </div>
                    <span className="text-sm font-medium text-stone-900">{agentPerm.agentName}</span>
                  </div>
                  <select
                    value={agentPerm.permission}
                    onChange={(e) => {
                      setAgentPermissions(prev => prev.map(ap =>
                        ap.agentId === agentPerm.agentId
                          ? { ...ap, permission: e.target.value as 'read' | 'edit' }
                          : ap
                      ));
                    }}
                    className="px-3 py-1.5 border border-stone-200 rounded-md text-sm focus:outline-none focus:border-stone-400"
                  >
                    <option value="read">仅读取</option>
                    <option value="edit">可编辑</option>
                  </select>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                // Add a new agent (simplified for demo)
                const availableAgents = agents.filter(a => 
                  !agentPermissions.some(ap => ap.agentId === a.id)
                );
                if (availableAgents.length > 0) {
                  setAgentPermissions(prev => [...prev, {
                    agentId: availableAgents[0].id,
                    agentName: availableAgents[0].name,
                    permission: 'read'
                  }]);
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors mb-4"
            >
              <Plus className="w-4 h-4" />
              添加 Agent
            </button>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setAgentPermissionModalOpen(false);
                  setSelectedDocId(null);
                  setAgentPermissions([]);
                }}
                className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // Save permissions (in real app, this would save to backend)
                  setAgentPermissionModalOpen(false);
                  setSelectedDocId(null);
                  setAgentPermissions([]);
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                保存
              </button>
            </div>
          </motion.div>
        </div>
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
          <div className="space-y-0.5">
            <NavItem 
              icon={<FileText className="w-4 h-4" />} 
              label={t('sidebar.documents')} 
              active={activeTab === 'documents'} 
              onClick={() => { setActiveTab('documents'); setIsCreatingAgent(false); }}
            />
            <NavItem 
              icon={<ActivityIcon className="w-4 h-4" />} 
              label={t('sidebar.activityFeed')} 
              active={activeTab === 'activity'} 
              onClick={() => { setActiveTab('activity'); setIsCreatingAgent(false); }}
            />

            <NavItem 
              icon={<Bot className="w-4 h-4" />} 
              label={t('sidebar.agentAccounts')} 
              active={activeTab === 'agents'} 
              onClick={() => { setActiveTab('agents'); setIsCreatingAgent(false); setSelectedAgentId(null); }}
            />
            <NavItem 
              icon={<Sparkles className="w-4 h-4" />} 
              label="Skills" 
              active={activeTab === 'skills'} 
              onClick={() => { setActiveTab('skills'); setIsCreatingAgent(false); setSelectedAgentId(null); }}
            />
          </div>
        </div>

        <div className="shrink-0 border-t border-stone-200 px-3 py-2 bg-[#F7F7F5]">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 text-xs font-semibold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium truncate">{t('sidebar.humanAccount')}</p>
              <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
            </div>
            <LanguageSwitcher />
            <button
              onClick={() => { setActiveTab('settings'); setIsCreatingAgent(false); }}
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 transition-colors"
              title={t('sidebar.settings')}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-8 border-b border-stone-200">
          <h1 className="text-lg font-medium">
            {activeTab === 'documents' && t('docs.title')}
            {activeTab === 'activity' && t('activity.title')}
            {activeTab === 'agents' && t('agent.title')}

            {activeTab === 'settings' && t('settings.title')}
            {activeTab === 'skills' && 'Skills'}

          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                placeholder={t('common.search')} 
                className="pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-sm focus:outline-none focus:border-stone-300 focus:bg-white transition-colors w-64"
              />
            </div>
            {(['documents', 'agents'].includes(activeTab)) && (
            <div className="relative">
              <button 
                onClick={() => {
                  if (activeTab === 'agents') setIsCreatingAgent(true);
                  if (activeTab === 'documents') setIsNewDocMenuOpen(!isNewDocMenuOpen);

                }}
                className="flex items-center gap-1.5 bg-stone-900 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> 
                {activeTab === 'documents' && t('docs.newDoc')}
                {activeTab === 'agents' && t('agent.newAgent')}

              </button>

              {activeTab === 'documents' && isNewDocMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNewDocMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                    <button 
                      onClick={() => handleQuickCreateDoc('Smart Doc')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      {getDocTypeIcon('Smart Doc', 16)}
                      <span>{t('docs.smartDoc')}</span>
                    </button>
                    <button 
                      onClick={() => handleQuickCreateDoc('Table')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      {getDocTypeIcon('Table', 16)}
                      <span>{t('docs.table')}</span>
                    </button>
                    <button 
                      onClick={() => handleQuickCreateDoc('Whiteboard')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      {getDocTypeIcon('Whiteboard', 16)}
                      <span>{t('docs.whiteboard')}</span>
                    </button>
                    <button 
                      onClick={() => handleQuickCreateDoc('Form')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      {getDocTypeIcon('Form', 16)}
                      <span>{t('docs.form')}</span>
                    </button>
                    <button 
                      onClick={() => handleQuickCreateDoc('Markdown')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      {getDocTypeIcon('Markdown', 16)}
                      <span>Markdown</span>
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
          <div className="mx-auto space-y-8 max-w-5xl">
            
            {activeTab === 'documents' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Owner filter row */}
                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                  <button
                    onClick={() => setDocFilterOwner('all')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      docFilterOwner === 'all' 
                        ? 'bg-stone-800 text-white' 
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    {t('docs.all')}
                  </button>
                  {docOwners.map(owner => {
                    const ownerDoc = workspaceDocs.find(d => d.creatorName === owner);
                    return (
                      <button
                        key={owner}
                        onClick={() => setDocFilterOwner(docFilterOwner === owner ? 'all' : owner)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          docFilterOwner === owner 
                            ? 'bg-stone-800 text-white' 
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                        }`}
                      >
                        {ownerDoc?.creatorType === 'agent' 
                          ? getAgentAvatar(owner, 14)
                          : getUserAvatar(14)}
                        {owner}
                      </button>
                    );
                  })}
                </div>

                {/* Labels filter row */}
                <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                  <button
                    onClick={() => setDocFilterLabel('all')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      docFilterLabel === 'all' 
                        ? 'bg-stone-800 text-white' 
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    {t('docs.all')}
                  </button>
                  {docLabels.map(label => (
                    <button
                      key={label}
                      onClick={() => setDocFilterLabel(docFilterLabel === label ? 'all' : label)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        docFilterLabel === label 
                          ? 'bg-stone-800 text-white' 
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Document table */}
                <div>
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
                              {t('docs.name')}
                              <ChevronDown className={`w-3 h-3 transition-transform ${isTypeFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isTypeFilterOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsTypeFilterOpen(false)} />
                                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                  <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t('docs.filterByType')}</div>
                                  <button
                                    onClick={() => { setDocFilterType('all'); setIsTypeFilterOpen(false); }}
                                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docFilterType === 'all' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                  >
                                    {t('docs.allTypes')}
                                  </button>
                                  {docTypes.map(type => (
                                    <button
                                      key={type}
                                      onClick={() => { setDocFilterType(type); setIsTypeFilterOpen(false); }}
                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docFilterType === type ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                    >
                                      {getDocTypeIcon(type, 14)}
                                      {type}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </th>

                        {/* Owner column (plain label) */}
                        <th className="px-6 py-3 font-medium">{t('docs.owner')}</th>

                        {/* Labels column with Label filter */}
                        <th className="px-6 py-3 font-medium">
                          <div className="relative inline-flex items-center">
                            <button
                              onClick={() => { setIsLabelFilterOpen(!isLabelFilterOpen); setIsTypeFilterOpen(false); setIsSortMenuOpen(false); }}
                              className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${docFilterLabel !== 'all' ? 'text-stone-900' : ''}`}
                            >
                              {t('docs.labels')}
                              <ChevronDown className={`w-3 h-3 transition-transform ${isLabelFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isLabelFilterOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsLabelFilterOpen(false)} />
                                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1 max-h-64 overflow-y-auto">
                                  <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t('docs.filterByLabel')}</div>
                                  <button
                                    onClick={() => { setDocFilterLabel('all'); setIsLabelFilterOpen(false); }}
                                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docFilterLabel === 'all' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                  >
                                    {t('docs.allLabels')}
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
                              {docSortBy === 'lastModified' ? t('docs.lastModified') : t('docs.lastViewed')}
                              <ArrowUpDown className="w-3 h-3" />
                            </button>
                            {isSortMenuOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsSortMenuOpen(false)} />
                                <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                  <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t('docs.sortBy')}</div>
                                  <button
                                    onClick={() => { setDocSortBy('lastModified'); setIsSortMenuOpen(false); }}
                                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docSortBy === 'lastModified' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                  >
                                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                                    {t('docs.lastModified')}
                                    {docSortBy === 'lastModified' && <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />}
                                  </button>
                                  <button
                                    onClick={() => { setDocSortBy('lastViewed'); setIsSortMenuOpen(false); }}
                                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docSortBy === 'lastViewed' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                  >
                                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                                    {t('docs.lastViewed')}
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
                              <p>No documents yet</p>
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
                            onLabelClick={(label) => { setDocFilterLabel(label); }}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                    </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'activity' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Owner filter row */}
                <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                  <button
                    onClick={() => setActivityFilterOwner('all')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activityFilterOwner === 'all' 
                        ? 'bg-stone-800 text-white' 
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                    }`}
                  >
                    {t('docs.all')}
                  </button>
                  {activityOwners.map(owner => {
                    const ownerActivity = workspaceActivities.find(a => a.userName === owner);
                    return (
                      <button
                        key={owner}
                        onClick={() => setActivityFilterOwner(activityFilterOwner === owner ? 'all' : owner)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          activityFilterOwner === owner 
                            ? 'bg-stone-800 text-white' 
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                        }`}
                      >
                        {ownerActivity?.userType === 'agent' 
                          ? <Bot className="w-3.5 h-3.5" /> 
                          : <User className="w-3.5 h-3.5" />}
                        {owner}
                      </button>
                    );
                  })}
                </div>
                <ActivityFeed activities={filteredActivities} />
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
                      <ArrowLeft className="w-4 h-4" /> {t('agent.backToAgents')}
                    </button>
                    <div className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-8">
                      <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-700 shadow-sm mb-6">
                        <Bot className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-semibold text-stone-900 mb-2 tracking-tight">{t('agent.createTitle')}</h2>
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
                            {t('common.cancel')}
                          </button>
                          <button 
                            type="submit" 
                            disabled={!newAgentName.trim()} 
                            className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                          >
                            {t('common.create')} Agent
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
                        <ArrowLeft className="w-4 h-4" /> {t('agent.backToAgents')}
                      </button>

                      {/* Agent Detail Card */}
                      <div className="p-6 rounded-xl border border-stone-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            {getAgentAvatar(agent.name, 32)}
                            <div>
                              <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-stone-900 tracking-tight">{agent.name}</h2>
                                <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${agent.connected ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${agent.connected ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                                  {agent.connected ? (lang === 'zh' ? '已连接' : 'Connected') : (lang === 'zh' ? '未连接' : 'Disconnected')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-xs text-stone-500 font-medium">{t('agent.globalAccount')}</p>
                                <span className="text-xs text-stone-300">·</span>
                                <p className="text-xs text-stone-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(agent.createdAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
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
                        
                        <div className="space-y-6">
                          {/* Integration Prompt */}
                          <div>
                            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Wand2 className="w-3.5 h-3.5" /> {t('agent.integrationPrompt')}
                            </h3>
                            <p className="text-xs text-stone-500 mb-2">
                              💡 {lang === 'zh' ? '点击复制按钮，粘贴到你的 Agent 中回车即可。' : 'Click copy, paste into your Agent and hit Enter.'}
                            </p>
                            <div className="relative">
                              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 pr-24 text-sm font-mono text-stone-700 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                                {generatePrompt(agent.token)}
                              </div>
                              <button 
                                onClick={() => copyToClipboard(generatePrompt(agent.token), `prompt-${agent.id}`)}
                                className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm"
                              >
                                {copiedStates[`prompt-${agent.id}`] ? <><Check className="w-3.5 h-3.5" />{lang === 'zh' ? '已复制' : 'Copied'}</> : <><Copy className="w-3.5 h-3.5" />{lang === 'zh' ? '复制' : 'Copy'}</>}
                              </button>
                            </div>
                          </div>

                          {/* Agent Token */}
                          <div>
                            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t('agent.token')}</h3>
                            <div className="relative">
                              <div className="bg-stone-50/80 border border-stone-200/60 rounded-lg p-3.5 text-sm font-medium text-stone-700 break-all pr-16 tracking-wide">
                                {agent.token}
                              </div>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <div className="relative group/copy">
                                  <button 
                                    onClick={() => copyToClipboard(agent.token, `token-${agent.id}`)}
                                    className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-stone-500 transition-all"
                                  >
                                    {copiedStates[`token-${agent.id}`] ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md bg-stone-900 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover/copy:opacity-100 transition-opacity pointer-events-none">
                                    {copiedStates[`token-${agent.id}`] ? (lang === 'zh' ? '已复制' : 'Copied') : (lang === 'zh' ? '复制 Token' : 'Copy Token')}
                                  </span>
                                </div>
                                <div className="relative group/reset">
                                  <button 
                                    onClick={() => {
                                      const newToken = `mx_agt_${Math.random().toString(36).substr(2, 12)}`;
                                      setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, token: newToken } : a));
                                    }}
                                    className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-stone-500 transition-all"
                                  >
                                    <Shield className="w-4 h-4" />
                                  </button>
                                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md bg-stone-900 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover/reset:opacity-100 transition-opacity pointer-events-none">
                                    {lang === 'zh' ? '重置 Token' : 'Reset Token'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Installed Skills */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-stone-500" />
                            {lang === 'zh' ? '已安装 Skills' : 'Installed Skills'}
                          </h3>
                          <button
                            onClick={() => { setActiveTab('skills'); setSelectedAgentId(null); }}
                            className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {(agent.installedSkills || []).length > 0 ? (
                        <div className="border border-stone-200/80 rounded-xl bg-white overflow-hidden">
                          {[
                            { name: 'MindX Docs', tag: 'Core', icon: <FileText className="w-4 h-4" />, provider: 'MindX' },
                            { name: 'Data Analysis', tag: 'Pro', icon: <Table className="w-4 h-4" />, provider: 'MindX' },
                            { name: 'Search Engine', tag: 'New', icon: <Search className="w-4 h-4" />, provider: 'MindX' },
                          ].filter(s => (agent.installedSkills || []).includes(s.name)).map((skill, i, arr) => (
                            <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-stone-100' : ''}`}>
                              <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white shrink-0">
                                {skill.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-semibold text-stone-900">{skill.name}</span>
                                  <span className="text-[9px] font-bold text-stone-400 uppercase bg-stone-100 px-1.5 py-0.5 rounded">{skill.tag}</span>
                                </div>
                              </div>
                              <span className="text-[11px] text-stone-400">{lang === 'zh' ? '提供方' : 'by'} {skill.provider}</span>
                            </div>
                          ))}
                        </div>
                        ) : (
                        <div className="py-8 text-center border border-stone-200/60 border-dashed rounded-xl">
                          <Sparkles className="w-6 h-6 text-stone-200 mx-auto mb-2" />
                          <p className="text-stone-400 text-xs mb-2">{lang === 'zh' ? '暂未安装任何 Skill' : 'No Skills installed yet'}</p>
                          <button
                            onClick={() => { setActiveTab('skills'); setSelectedAgentId(null); }}
                            className="text-xs font-medium text-stone-500 hover:text-stone-700 underline transition-colors"
                          >
                            {lang === 'zh' ? '去安装' : 'Install now'}
                          </button>
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
                        <div className="px-5 py-3.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getAgentAvatar(agent.name, 24)}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h2 className="text-sm font-semibold text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">{agent.name}</h2>
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${agent.connected ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${agent.connected ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                                    {agent.connected ? (lang === 'zh' ? '已连接' : 'Connected') : (lang === 'zh' ? '未连接' : 'Disconnected')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p className="text-[11px] text-stone-400">{t('agent.globalAccount')}</p>
                                  <span className="text-[11px] text-stone-300">·</span>
                                  <p className="text-[11px] text-stone-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(agent.createdAt).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                                <ActivityIcon className="w-3 h-3" />
                                {agentActivityCount} {t('agent.activities')}
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
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}


            {activeTab === 'settings' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                {/* Storage Capacity Bar */}
                <div className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 mb-6">
                  {(() => {
                    const totalCapacityBytes = 2 * 1024 * 1024 * 1024; // 2GB in bytes
                    const usedBytes = documents.reduce((sum, doc) => sum + doc.size, 0);
                    const usedPercentage = (usedBytes / totalCapacityBytes) * 100;
                    
                    const formatSize = (bytes: number) => {
                      if (bytes >= 1024 * 1024 * 1024) {
                        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
                      } else if (bytes >= 1024 * 1024) {
                        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
                      } else if (bytes >= 1024) {
                        return `${(bytes / 1024).toFixed(2)} KB`;
                      }
                      return `${bytes} B`;
                    };
                    
                    return (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-stone-900">账号容量</h3>
                          <span className="text-sm text-stone-600">
                            {formatSize(usedBytes)} / {formatSize(totalCapacityBytes)}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${usedPercentage}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          />
                        </div>
                        
                        <p className="text-xs text-stone-500 mt-2">
                          已使用 {usedPercentage.toFixed(1)}%，共 {documents.length} 个文档
                        </p>
                      </>
                    );
                  })()}
                </div>

                {/* Logout */}
                <button
                  onClick={() => {
                    localStorage.removeItem('mindx_logged_in');
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {lang === 'zh' ? '退出登录' : 'Sign Out'}
                </button>

              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Skill List */}
                <div className="border border-stone-200/80 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-stone-200/50">
                  {[
                    { id: 'mindx-docs', name: 'MindX Docs', tag: 'Core', icon: <FileText className="w-4 h-4" />, provider: 'MindX', desc: lang === 'zh' ? '文档创作能力' : 'Document creation' },
                    { id: 'data-analysis', name: 'Data Analysis', tag: 'Pro', icon: <Table className="w-4 h-4" />, provider: 'MindX', desc: lang === 'zh' ? '数据分析能力' : 'Data analysis' },
                    { id: 'search-engine', name: 'Search Engine', tag: 'New', icon: <Search className="w-4 h-4" />, provider: 'MindX', desc: lang === 'zh' ? '搜索引擎能力' : 'Search engine' },
                  ].map((skill, i, arr) => (
                    <div key={skill.id}>
                      <div
                        onClick={() => setSelectedSkillId(selectedSkillId === skill.id ? null : skill.id)}
                        className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all ${
                          selectedSkillId === skill.id ? 'bg-stone-50' : 'hover:bg-stone-50/50'
                        } `}
                      >
                        <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white shrink-0">
                          {skill.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-stone-900">{skill.name}</span>
                            <span className="text-[9px] font-bold text-stone-400 uppercase bg-stone-100 px-1.5 py-0.5 rounded">{skill.tag}</span>
                          </div>
                          <p className="text-[11px] text-stone-400">{skill.desc}</p>
                        </div>
                        <span className="text-[11px] text-stone-400 shrink-0">{lang === 'zh' ? '提供方' : 'by'} {skill.provider}</span>
                        <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${selectedSkillId === skill.id ? 'rotate-180' : ''}`} />
                      </div>
                      {/* Inline detail for MindX Docs */}
                      {selectedSkillId === skill.id && skill.id === 'mindx-docs' && (
                        <div className="border-t border-stone-100 bg-white" onClick={(e) => e.stopPropagation()}>
                          <div className="p-6 pb-5">
                            <p className="text-sm text-stone-500 leading-relaxed mb-4">
                              {lang === 'zh' ? '让你的 AI Agent 拥有完整的文档创作能力。支持 Markdown/Word/Excel/PPT 的创建、阅读、编辑。' : 'Give your AI agents full document creation capabilities. Create, read and edit Markdown, Word, Excel and PPT files.'}
                            </p>
                            <div className="grid md:grid-cols-2 gap-1.5">
                              {(lang === 'zh' ? ['基于对话意图创建 Markdown/Word/Excel/PPT 文档', '编辑 Markdown/Word/Excel/PPT 文档', '读取和解析 Office 文档', 'AI Agent 内容保存至 MindX'] : ['Create Markdown/Word/Excel/PPT based on intent', 'Edit Markdown/Word/Excel/PPT documents', 'Read & parse Office documents', 'Save AI Agent content to MindX']).map((cap, j) => (
                                <div key={j} className="flex items-center gap-2 text-sm text-stone-600"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{cap}</div>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-stone-100 p-6 space-y-6">
                            {/* Step 1 */}
                            <div className="relative pl-10">
                              <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0"><div className="flex-1 border-l border-dashed border-stone-300" /><svg className="w-2.5 h-2.5 text-stone-300 shrink-0" viewBox="0 0 10 10" fill="none"><path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                              <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">1</div>
                              <h4 className="text-sm font-bold text-stone-800 mb-2">{lang === 'zh' ? '安装命令' : 'Install Command'}</h4>
                              <p className="text-xs text-stone-500 mb-3">💡 {lang === 'zh' ? '点击复制按钮，粘贴到你的 Agent 中回车即可。剩下的全部交给 MindX！' : 'Click copy, paste into your Agent and hit Enter. MindX handles the rest!'}</p>
                              <div className="relative">
                                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 pr-24 text-sm font-mono text-stone-700 leading-relaxed overflow-x-auto whitespace-pre-wrap">{`Download the zip package from https://cdn.addon.tencentsuite.com/static/tencent-docs.zip and unzip it, help me install this skill, and then set the environment variable Mindx.space_token="xxxxxxxxx".`}</div>
                                <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`Download the zip package from https://cdn.addon.tencentsuite.com/static/tencent-docs.zip and unzip it, help me install this skill, and then set the environment variable Mindx.space_token="xxxxxxxxx".`); setCopiedStates(prev => ({ ...prev, skillInstall: true })); setTimeout(() => setCopiedStates(prev => ({ ...prev, skillInstall: false })), 2000); }} className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm">{copiedStates['skillInstall'] ? <><Check className="w-3.5 h-3.5" />{lang === 'zh' ? '已复制' : 'Copied'}</> : <><Copy className="w-3.5 h-3.5" />{lang === 'zh' ? '复制' : 'Copy'}</>}</button>
                              </div>
                            </div>
                            {/* Step 2 */}
                            <div className="relative pl-10">
                              <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0"><div className="flex-1 border-l border-dashed border-stone-300" /><svg className="w-2.5 h-2.5 text-stone-300 shrink-0" viewBox="0 0 10 10" fill="none"><path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                              <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">2</div>
                              <h4 className="text-sm font-bold text-stone-800 mb-2">{lang === 'zh' ? 'Agent 自动完成安装' : 'Agent Auto-completes Installation'}</h4>
                              <p className="text-xs text-stone-500 leading-relaxed">{lang === 'zh' ? '💡 Agent 接到指令后，将自动完成：下载 Skill 压缩包 → 解压到本地 → 注册安装 → 配置 Token。' : '💡 Agent will automatically: download → extract → install → configure Token.'}</p>
                            </div>
                            {/* Step 3 */}
                            <div className="relative pl-10">
                              <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">3</div>
                              <h4 className="text-sm font-bold text-stone-800 mb-2">{lang === 'zh' ? '使用 Skill' : 'Use Skill'}</h4>
                              <p className="text-xs text-stone-500 leading-relaxed mb-3">💡 {lang === 'zh' ? '安装成功，你可以开始使用 MindX 强大的 Skill 了。' : 'Installation complete. Start using MindX powerful Skills now.'}</p>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60"><span className="text-xs font-bold text-stone-800 shrink-0">{lang === 'zh' ? '斜杠命令' : 'Slash'}</span><span className="text-xs text-stone-500">—</span><span className="text-xs text-stone-600">{lang === 'zh' ? '在聊天中输入 /技能名（如 /mindx doc）直接触发' : 'Type /skill-name in chat to trigger'}</span></div>
                                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60"><span className="text-xs font-bold text-stone-800 shrink-0">{lang === 'zh' ? '自动调用' : 'Auto'}</span><span className="text-xs text-stone-500">—</span><span className="text-xs text-stone-600">{lang === 'zh' ? 'Agent 根据对话上下文自动判断该用哪个 Skill' : 'Agent auto-determines which Skill to use'}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Inline Coming Soon for other skills */}
                      {selectedSkillId === skill.id && skill.id !== 'mindx-docs' && (
                        <div className="bg-stone-50/50 p-8 text-center">
                          <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                          <h3 className="text-sm font-semibold text-stone-900 mb-1">{lang === 'zh' ? '即将上线' : 'Coming Soon'}</h3>
                          <p className="text-xs text-stone-500">{lang === 'zh' ? '该 Skill 正在开发中，敬请期待。' : 'This Skill is under development. Stay tuned.'}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
  onSetLabel?: (id: string) => void;
  onSetAgentPermission?: (id: string) => void;
}

function DocRow({ docId, name, type, date, labels, creatorName, creatorType, onDelete, onLabelClick, onSetLabel, onSetAgentPermission }: DocRowProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPublicLink, setIsPublicLink] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const { t } = useLanguage();

  const getDocIcon = () => getDocTypeIcon(type, 18);

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
            getAgentAvatar(creatorName, 18)
          ) : (
            getUserAvatar(18)
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
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setIsMenuOpen(false); 
                    onSetLabel?.(docId); 
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Tag className="w-4 h-4 text-stone-400" />
                  设置标签
                </button>
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setIsMenuOpen(false); 
                    onSetAgentPermission?.(docId); 
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Shield className="w-4 h-4 text-stone-400" />
                  Agent权限设置
                </button>
                <div className="border-t border-stone-100 my-0.5" />
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-stone-400" />
                  {t('docs.actions.download')}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); setIsShareOpen(true); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-stone-400" />
                  {t('docs.actions.share')}
                </button>
                <div className="border-t border-stone-100 my-0.5" />
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  {t('docs.actions.delete')}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Share popover */}
        {isShareOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={(e) => { e.stopPropagation(); setIsShareOpen(false); }} />
            <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-stone-200 rounded-xl shadow-2xl z-40 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="px-4 py-3 border-b border-stone-100">
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="w-4 h-4 text-stone-500" />
                  <span className="text-sm font-semibold text-stone-900">{t('share.title')}</span>
                </div>
                <p className="text-xs text-stone-400">{t('share.desc')}</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-stone-400" />
                    <span className="text-sm text-stone-700">{t('share.publicLink')}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsPublicLink(!isPublicLink); }}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      isPublicLink ? 'bg-stone-900' : 'bg-stone-200'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                      isPublicLink ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                {isPublicLink && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                      <LinkIcon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-xs text-stone-500 truncate flex-1">mindx.app/s/{docId.slice(0, 8)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(`https://mindx.app/s/${docId.slice(0, 8)}`);
                          setShareCopied(true);
                          setTimeout(() => setShareCopied(false), 2000);
                        }}
                        className="shrink-0 p-1 rounded hover:bg-stone-200 transition-colors"
                      >
                        {shareCopied 
                          ? <Check className="w-3.5 h-3.5 text-green-600" />
                          : <Copy className="w-3.5 h-3.5 text-stone-400" />
                        }
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-400">{t('share.anyoneWithLink')}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
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
                    getAgentAvatar(activity.userName, 28)
                  ) : (
                    getUserAvatar(28)
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
          <p className="text-stone-400 text-sm">No recent activity yet</p>
        </div>
      )}
    </div>
  );
}
