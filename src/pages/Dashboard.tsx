import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';
import { getDocTypeIcon } from '../components/DocIcons';
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
  Folder,
  FolderOpen,
  ChevronRight,
  FilePlus2
} from 'lucide-react';

const initialWorkspaces = [
  { id: 'w1', name: 'Main Space' }
];

const initialAgents = [
  { id: 'a1', name: 'Claude Assistant', token: 'mx_agt_9f8e7d6c5b4a3' },
  { id: 'a2', name: 'Data Analyzer', token: 'mx_agt_1a2b3c4d5e6f7' },
  { id: 'a3', name: 'Research Bot', token: 'mx_agt_8x7y6z5w4v3u2' }
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
  { id: 'd1', workspaceId: 'w1', name: 'Project Alpha Architecture', type: 'Smart Doc', date: '2 hours ago', lastModified: '2026-03-24T12:00:00Z', lastViewed: '2026-03-24T13:30:00Z', labels: ['Project Alpha', 'PRD'], creatorName: 'Claude Assistant', creatorType: 'agent' },
  { id: 'd2', workspaceId: 'w1', name: 'Q3 Financial Projections', type: 'Table', date: 'Yesterday', lastModified: '2026-03-23T10:00:00Z', lastViewed: '2026-03-24T09:00:00Z', labels: ['Data', 'Finance'], creatorName: 'Data Analyzer', creatorType: 'agent' },
  { id: 'd3', workspaceId: 'w1', name: 'User Flow Diagram', type: 'Whiteboard', date: 'Last week', lastModified: '2026-03-17T15:00:00Z', lastViewed: '2026-03-22T11:00:00Z', labels: ['Design', 'Project Alpha'], creatorName: currentUser.name, creatorType: 'human' },
  { id: 'd6', workspaceId: 'w1', name: 'Claude & Maya: Feature Discussion', type: 'Smart Doc', date: '3 hours ago', lastModified: '2026-03-24T11:00:00Z', lastViewed: '2026-03-24T11:30:00Z', labels: ['Meeting Notes'], creatorName: 'Claude Assistant', creatorType: 'agent' },
  { id: 'd4', workspaceId: 'w1', name: 'Competitor Analysis', type: 'Markdown', date: '1 hour ago', lastModified: '2026-03-24T13:00:00Z', lastViewed: '2026-03-24T13:45:00Z', labels: ['Research', 'Data'], creatorName: 'Research Bot', creatorType: 'agent' },
  { id: 'd5', workspaceId: 'w1', name: 'Marketing Strategy', type: 'Smart Doc', date: '2 days ago', lastModified: '2026-03-22T14:00:00Z', lastViewed: '2026-03-23T16:00:00Z', labels: ['PRD', 'Marketing'], creatorName: currentUser.name, creatorType: 'human' },
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
  const [activeTab, setActiveTabState] = useState<'documents' | 'activity' | 'agents' | 'members' | 'settings' | 'labels'>(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['documents', 'activity', 'agents', 'members', 'settings', 'labels'].includes(tab)) {
      return tab as 'documents' | 'activity' | 'agents' | 'members' | 'settings' | 'labels';
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
  const [selectedGlobalLabel, setSelectedGlobalLabel] = useState<string | null>(null);
  const [labelFilterOwner, setLabelFilterOwner] = useState<string>('all');
  const [labelFilterType, setLabelFilterType] = useState<string>('all');
  const [labelSortBy, setLabelSortBy] = useState<'lastModified' | 'lastViewed'>('lastModified');
  const [isLabelTypFilterOpen, setIsLabelTypFilterOpen] = useState(false);
  const [isLabelSortMenuOpen, setIsLabelSortMenuOpen] = useState(false);
  const [isLabelOwnerFilterOpen, setIsLabelOwnerFilterOpen] = useState(false);
  
  // Document actions
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [agentPermissionModalOpen, setAgentPermissionModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [usedTags, setUsedTags] = useState<string[]>(['PRD', 'Data', 'Design', 'Research', 'Marketing', 'Meeting Notes', 'Finance']);
  const [agentPermissions, setAgentPermissions] = useState<AgentPermission[]>([]);
  
  const { t } = useLanguage();

  const location = useLocation();
  const navigate = useNavigate();

  const setActiveTab = (tab: 'documents' | 'activity' | 'agents' | 'members' | 'settings' | 'labels') => {
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
    setSelectedGlobalLabel(null);
    setLabelFilterOwner('all');
    setLabelFilterType('all');
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
      token: newToken
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
      creatorType: 'human'
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
    <div className="min-h-screen bg-white text-stone-800 flex font-sans selection:bg-stone-200">
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
          <div className="mb-4">
            <p className="px-3 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              {t('sidebar.core')}
            </p>
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
              icon={<Settings className="w-4 h-4" />} 
              label={t('sidebar.settings')} 
              active={activeTab === 'settings'}
              onClick={() => { setActiveTab('settings'); setIsCreatingAgent(false); }}
            />
          </div>

          <div>
            <div className="px-3 py-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t('sidebar.global')}</div>
            <NavItem 
              icon={<Bot className="w-4 h-4" />} 
              label={t('sidebar.agentAccounts')} 
              active={activeTab === 'agents'} 
              onClick={() => { setActiveTab('agents'); setIsCreatingAgent(false); setSelectedAgentId(null); }}
            />
            <NavItem 
              icon={<Tag className="w-4 h-4" />} 
              label={t('sidebar.labels')} 
              active={activeTab === 'labels'} 
              onClick={() => { setActiveTab('labels'); setIsCreatingAgent(false); }}
            />
            <Link to="/skills" className="block">
              <NavItem 
                icon={<Sparkles className="w-4 h-4" />} 
                label="Skills" 
                active={false} 
                onClick={() => {}}
              />
            </Link>
          </div>
        </div>

        <div className="shrink-0 border-t border-stone-200 p-3 bg-[#F7F7F5] space-y-1">
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-stone-200/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 text-xs font-semibold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{t('sidebar.humanAccount')}</p>
              <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
            </div>
            <LogOut className="w-4 h-4 text-stone-400" />
          </button>
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
            {activeTab === 'labels' && t('sidebar.labels')}
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
                    {t('docs.all')}
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
                          {getDocTypeIcon(docFilterType, 14)}
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
                            onLabelClick={(label) => { setSelectedGlobalLabel(label); setActiveTab('labels'); }}
                            onSetLabel={(id) => {
                              setSelectedDocId(id);
                              setLabelModalOpen(true);
                            }}
                            onSetAgentPermission={(id) => {
                              setSelectedDocId(id);
                              const doc = documents.find(d => d.id === id);
                              setAgentPermissions(agents.map(agent => ({
                                agentId: agent.id,
                                agentName: agent.name,
                                permission: 'read'
                              })));
                              setAgentPermissionModalOpen(true);
                            }}
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
                            <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-700 shadow-sm">
                              <Bot className="w-6 h-6" />
                            </div>
                            <div>
                              <h2 className="text-lg font-semibold text-stone-900 tracking-tight">{agent.name}</h2>
                              <p className="text-xs text-stone-500 font-medium">{t('agent.globalAccount')}</p>
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
                            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">{t('agent.token')}</h3>
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
                              <Wand2 className="w-3.5 h-3.5" /> {t('agent.integrationPrompt')}
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
                          {t('agent.recentActivity')}
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
                            <p className="text-stone-400 text-sm">{t('agent.noActivity')}</p>
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
                            <div>
                              <h2 className="text-base font-semibold text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">{agent.name}</h2>
                              <p className="text-xs text-stone-500 font-medium">{t('agent.globalAccount')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                              <ActivityIcon className="w-3.5 h-3.5" />
                              {agentActivityCount} {t('agent.activities')}
                            </span>
                            <button 
                              className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
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

                <div className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-8 space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-stone-900 mb-2 tracking-tight">{t('settings.title')}</h2>
                    <p className="text-sm text-stone-500">Manage your space defaults and internal prototype settings.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-stone-700">{t('settings.workspaceName')}</label>
                    <input 
                      type="text" 
                      value={activeWorkspace?.name ?? ''}
                      onChange={(e) => renameActiveWorkspace(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200/80 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
                    />
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
                  const allLabels = Array.from(new Set(workspaceDocs.flatMap(d => d.labels))).sort();
                  const activeLabel = selectedGlobalLabel || (allLabels.length > 0 ? allLabels[0] : null);
                  const labelDocs = activeLabel 
                    ? workspaceDocs.filter(d => d.labels.includes(activeLabel))
                    : [];

                  return allLabels.length === 0 ? (
                    <div className="py-20 text-center">
                      <Tag className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                      <h3 className="text-sm font-medium text-stone-900 mb-1">{t('docs.noLabels')}</h3>
                      <p className="text-stone-400 text-sm">{t('docs.noLabelsDesc')}</p>
                    </div>
                  ) : (
                    <div className="flex gap-8">
                      {/* Label list sidebar */}
                      <div className="w-52 shrink-0 space-y-1">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 mb-3">{t('docs.allLabels')}</p>
                        {allLabels.map(label => {
                          const count = workspaceDocs.filter(d => d.labels.includes(label)).length;
                          return (
                            <button
                              key={label}
                              onClick={() => { setSelectedGlobalLabel(label); setLabelFilterOwner('all'); setLabelFilterType('all'); }}
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
                              const labelOwners = Array.from(new Set(labelDocs.map(d => d.creatorName)));
                              const labelTypes: string[] = Array.from(new Set(labelDocs.map(d => d.type)));
                              let filteredLabelDocs = [...labelDocs];
                              if (labelFilterOwner !== 'all') {
                                filteredLabelDocs = filteredLabelDocs.filter(d => d.creatorName === labelFilterOwner);
                              }
                              if (labelFilterType !== 'all') {
                                filteredLabelDocs = filteredLabelDocs.filter(d => d.type === labelFilterType);
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
                                    <span className="text-xs text-stone-400 font-medium">{labelDocs.length} document{labelDocs.length !== 1 ? 's' : ''}</span>
                                  </div>

                                  {/* Active filter chips */}
                                  {(labelFilterType !== 'all' || labelFilterOwner !== 'all') && (
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
                                                onClick={() => { setIsLabelTypFilterOpen(!isLabelTypFilterOpen); setIsLabelSortMenuOpen(false); setIsLabelOwnerFilterOpen(false); }}
                                                className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${labelFilterType !== 'all' ? 'text-stone-900' : ''}`}
                                              >
                                                {t('docs.name')}
                                                <ChevronDown className={`w-3 h-3 transition-transform ${isLabelTypFilterOpen ? 'rotate-180' : ''}`} />
                                              </button>
                                              {isLabelTypFilterOpen && (
                                                <>
                                                  <div className="fixed inset-0 z-10" onClick={() => setIsLabelTypFilterOpen(false)} />
                                                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                                    <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t('docs.filterByType')}</div>
                                                    <button
                                                      onClick={() => { setLabelFilterType('all'); setIsLabelTypFilterOpen(false); }}
                                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelFilterType === 'all' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                    >
                                                      {t('docs.allTypes')}
                                                    </button>
                                                    {labelTypes.map(type => (
                                                      <button
                                                        key={type}
                                                        onClick={() => { setLabelFilterType(type); setIsLabelTypFilterOpen(false); }}
                                                        className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelFilterType === type ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
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
                                          {/* Owner column with filter */}
                                          <th className="px-6 py-3 font-medium whitespace-nowrap">
                                            <div className="relative inline-flex items-center">
                                              <button
                                                onClick={() => { setIsLabelOwnerFilterOpen(!isLabelOwnerFilterOpen); setIsLabelTypFilterOpen(false); setIsLabelSortMenuOpen(false); }}
                                                className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${labelFilterOwner !== 'all' ? 'text-stone-900' : ''}`}
                                              >
                                                {t('docs.owner')}
                                                <ChevronDown className={`w-3 h-3 transition-transform ${isLabelOwnerFilterOpen ? 'rotate-180' : ''}`} />
                                              </button>
                                              {isLabelOwnerFilterOpen && (
                                                <>
                                                  <div className="fixed inset-0 z-10" onClick={() => setIsLabelOwnerFilterOpen(false)} />
                                                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                                    <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t('docs.filterByOwner')}</div>
                                                    <button
                                                      onClick={() => { setLabelFilterOwner('all'); setIsLabelOwnerFilterOpen(false); }}
                                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelFilterOwner === 'all' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                    >
                                                      {t('docs.allOwners')}
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
                                          <th className="px-6 py-3 font-medium whitespace-nowrap">{t('docs.labels')}</th>
                                          {/* Date column with Sort toggle */}
                                          <th className="px-6 py-3 font-medium whitespace-nowrap">
                                            <div className="relative inline-flex items-center">
                                              <button
                                                onClick={() => { setIsLabelSortMenuOpen(!isLabelSortMenuOpen); setIsLabelTypFilterOpen(false); setIsLabelOwnerFilterOpen(false); }}
                                                className="flex items-center gap-1.5 hover:text-stone-800 transition-colors whitespace-nowrap"
                                              >
                                                {labelSortBy === 'lastModified' ? t('docs.lastModified') : t('docs.lastViewed')}
                                                <ArrowUpDown className="w-3 h-3" />
                                              </button>
                                              {isLabelSortMenuOpen && (
                                                <>
                                                  <div className="fixed inset-0 z-10" onClick={() => setIsLabelSortMenuOpen(false)} />
                                                  <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                                    <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t('docs.sortBy')}</div>
                                                    <button
                                                      onClick={() => { setLabelSortBy('lastModified'); setIsLabelSortMenuOpen(false); }}
                                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelSortBy === 'lastModified' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                    >
                                                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                                                      {t('docs.lastModified')}
                                                      {labelSortBy === 'lastModified' && <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />}
                                                    </button>
                                                    <button
                                                      onClick={() => { setLabelSortBy('lastViewed'); setIsLabelSortMenuOpen(false); }}
                                                      className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${labelSortBy === 'lastViewed' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                                    >
                                                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                                                      {t('docs.lastViewed')}
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
                                            <td colSpan={4} className="px-6 py-12 text-center text-stone-500">
                                              <FileText className="w-8 h-8 mx-auto mb-3 text-stone-300" />
                                              <p>No documents match the current filters</p>
                                              <button
                                                onClick={() => { setLabelFilterOwner('all'); setLabelFilterType('all'); }}
                                                className="mt-2 text-sm text-stone-900 font-medium hover:underline"
                                              >
                                                Clear all filters
                                              </button>
                                            </td>
                                          </tr>
                                        ) : (
                                          filteredLabelDocs.map(doc => {
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
            <div className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-stone-500 shrink-0" title="Agent">
              <Bot className="w-3 h-3" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-stone-500 shrink-0" title={creatorName}>
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
          <p className="text-stone-400 text-sm">No recent activity yet</p>
        </div>
      )}
    </div>
  );
}
