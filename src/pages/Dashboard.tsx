import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';
import { getDocTypeIcon } from '../components/DocIcons';
import { getAgentAvatar, getUserAvatar } from '../components/AgentAvatars';
import { useLanguage, LanguageSwitcher } from '../i18n/LanguageContext';
import { useDocuments } from '../hooks/useDocuments';
import { useActivities } from '../hooks/useActivities';
import { useProfile } from '../hooks/useProfile';
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
  Target,
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
  Zap,
  CalendarDays,
  EyeOff,
  Timer,
  Bookmark,
  Brain,
  Database,
  Cloud,
  ChevronRight,
  Mail,
  AppWindow,
  Loader2,
  Network,
  Maximize2,
  Video,
  Mic,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

const initialWorkspaces = [
  { id: 'w1', name: 'Main Space' }
];

const initialAgents = [
  { id: 'a1', name: 'Claude Assistant', token: 'mx_agt_9f8e7d6c5b4a3', connected: true, createdAt: '2026-03-10T10:00:00Z', installedSkills: ['MindX Docs', 'MindX Memory', 'Daily Update'] },
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
  isNew?: boolean; // Whether this doc was created while the user was away
  isRead?: boolean; // Whether the user has read this doc
  source?: 'normal' | 'scheduled' | 'webclip' | 'memory'; // Document source
}

interface AgentPermission {
  agentId: string;
  agentName: string;
  permission: 'read' | 'edit';
}

// --- Absence Summary types & data ---
interface AbsenceChange {
  id: string;
  action: 'created' | 'modified' | 'commented';
  docTitle: string;
  docType: string;
  agentName: string;
  agentColor: string;
  changeDescription?: string;
  timestamp: string;
}

interface AbsenceSummaryData {
  lastVisitTime: string;
  changes: AbsenceChange[];
}

const initialDocuments: WorkspaceDoc[] = [
  { id: 'd1', workspaceId: 'w1', name: 'Project Alpha Architecture', type: 'Smart Doc', date: '2 hours ago', lastModified: '2026-03-27T12:00:00Z', lastViewed: '2026-03-27T13:30:00Z', labels: ['Project Alpha', 'PRD'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 32768, isNew: true, isRead: false, source: 'normal' },
  { id: 'd2', workspaceId: 'w1', name: 'Q3 Financial Projections', type: 'Table', date: 'Yesterday', lastModified: '2026-03-23T10:00:00Z', lastViewed: '2026-03-24T09:00:00Z', labels: ['Data', 'Finance'], creatorName: 'Data Analyzer', creatorType: 'agent', size: 65536, isRead: true, source: 'normal' },
  { id: 'd3', workspaceId: 'w1', name: 'User Flow Diagram', type: 'Whiteboard', date: 'Last week', lastModified: '2026-03-17T15:00:00Z', lastViewed: '2026-03-22T11:00:00Z', labels: ['Design', 'Project Alpha'], creatorName: currentUser.name, creatorType: 'human', size: 128000, isRead: true, source: 'normal' },
  { id: 'd6', workspaceId: 'w1', name: 'Claude & Maya: Feature Discussion', type: 'Smart Doc', date: '3 hours ago', lastModified: '2026-03-27T11:00:00Z', lastViewed: '2026-03-27T11:30:00Z', labels: ['Meeting Notes'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 24576, isNew: true, isRead: false, source: 'normal' },
  { id: 'd4', workspaceId: 'w1', name: 'Competitor Analysis', type: 'Markdown', date: '1 hour ago', lastModified: '2026-03-27T13:00:00Z', lastViewed: '2026-03-27T13:45:00Z', labels: ['Research', 'Data'], creatorName: 'Research Bot', creatorType: 'agent', size: 40960, isNew: true, isRead: false, source: 'normal' },
  { id: 'd5', workspaceId: 'w1', name: 'Marketing Strategy', type: 'Smart Doc', date: '2 days ago', lastModified: '2026-03-22T14:00:00Z', lastViewed: '2026-03-23T16:00:00Z', labels: ['PRD', 'Marketing'], creatorName: currentUser.name, creatorType: 'human', size: 53248, isRead: true, source: 'normal' },
  // Agent scheduled task outputs — Daily Industry Digest
  { id: 'd7', workspaceId: 'w1', name: 'Industry Digest — Mar 27', type: 'Markdown', date: 'Today', lastModified: '2026-03-27T08:00:00Z', lastViewed: '2026-03-27T10:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 45056, isNew: true, isRead: false, source: 'scheduled' },
  { id: 'd8', workspaceId: 'w1', name: 'Industry Digest — Mar 23', type: 'Markdown', date: 'Yesterday', lastModified: '2026-03-23T08:00:00Z', lastViewed: '2026-03-23T12:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 43008, isRead: true, source: 'scheduled' },
  { id: 'd9', workspaceId: 'w1', name: 'Industry Digest — Mar 22', type: 'Markdown', date: '2 days ago', lastModified: '2026-03-22T08:00:00Z', lastViewed: '2026-03-22T09:30:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 48128, isRead: true, source: 'scheduled' },
  { id: 'd10', workspaceId: 'w1', name: 'Industry Digest — Mar 21', type: 'Markdown', date: '3 days ago', lastModified: '2026-03-21T08:00:00Z', lastViewed: '2026-03-21T11:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 51200, isRead: true, source: 'scheduled' },
  { id: 'd11', workspaceId: 'w1', name: 'Industry Digest — Mar 20', type: 'Markdown', date: '4 days ago', lastModified: '2026-03-20T08:00:00Z', lastViewed: '2026-03-20T14:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 46080, isRead: true, source: 'scheduled' },
  { id: 'd12', workspaceId: 'w1', name: 'Industry Digest — Mar 19', type: 'Markdown', date: '5 days ago', lastModified: '2026-03-19T08:00:00Z', lastViewed: '2026-03-19T10:00:00Z', labels: ['Daily Industry Digest'], creatorName: 'Research Bot', creatorType: 'agent', size: 49152, isRead: true, source: 'scheduled' },
  // Agent scheduled task outputs — Daily Report
  { id: 'd13', workspaceId: 'w1', name: 'Daily Report — Mar 27', type: 'Markdown', date: 'Today', lastModified: '2026-03-27T17:00:00Z', lastViewed: '2026-03-27T17:30:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 73728, isNew: true, isRead: false, source: 'scheduled' },
  { id: 'd14', workspaceId: 'w1', name: 'Daily Report — Mar 23', type: 'Markdown', date: 'Yesterday', lastModified: '2026-03-23T18:00:00Z', lastViewed: '2026-03-23T20:00:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 71680, isRead: true, source: 'scheduled' },
  { id: 'd15', workspaceId: 'w1', name: 'Daily Report — Mar 22', type: 'Markdown', date: '2 days ago', lastModified: '2026-03-22T18:00:00Z', lastViewed: '2026-03-22T19:00:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 69632, isRead: true, source: 'scheduled' },
  { id: 'd16', workspaceId: 'w1', name: 'Daily Report — Mar 21', type: 'Markdown', date: '3 days ago', lastModified: '2026-03-21T18:00:00Z', lastViewed: '2026-03-21T21:00:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 75776, isRead: true, source: 'scheduled' },
  { id: 'd17', workspaceId: 'w1', name: 'Daily Report — Mar 20', type: 'Markdown', date: '4 days ago', lastModified: '2026-03-20T18:00:00Z', lastViewed: '2026-03-20T19:30:00Z', labels: ['Daily Report'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 72704, isRead: true, source: 'scheduled' },
  { id: 'd18', workspaceId: 'w1', name: 'Daily Report — Mar 19', type: 'Markdown', date: '5 days ago', lastModified: '2026-03-19T18:00:00Z', lastViewed: '2026-03-19T20:00:00Z', labels: ['Daily Report', 'Project Alpha'], creatorName: 'Claude Assistant', creatorType: 'agent', size: 77824, isRead: true, source: 'scheduled' },
  // Web clippings
  { id: 'd19', workspaceId: 'w1', name: 'OpenAI GPT-5 发布全解析', type: 'Markdown', date: 'Today', lastModified: '2026-03-27T14:00:00Z', lastViewed: '2026-03-27T14:30:00Z', labels: [], creatorName: currentUser.name, creatorType: 'human', size: 28672, isRead: false, source: 'webclip' },
  { id: 'd20', workspaceId: 'w1', name: 'The Future of AI Agents — TechCrunch', type: 'Markdown', date: 'Yesterday', lastModified: '2026-03-23T16:00:00Z', lastViewed: '2026-03-23T17:00:00Z', labels: [], creatorName: currentUser.name, creatorType: 'human', size: 35840, isRead: true, source: 'webclip' },
  { id: 'd21', workspaceId: 'w1', name: '产品经理如何拥抱 AI 时代 — 少数派', type: 'Markdown', date: '2 days ago', lastModified: '2026-03-22T10:00:00Z', lastViewed: '2026-03-22T12:00:00Z', labels: [], creatorName: currentUser.name, creatorType: 'human', size: 22528, isRead: true, source: 'webclip' },
  // Agent memories
  { id: 'd22', workspaceId: 'w1', name: '用户偏好：Maya 喜欢简洁的报告风格', type: 'Smart Doc', date: 'Today', lastModified: '2026-03-27T09:30:00Z', lastViewed: '2026-03-27T10:00:00Z', labels: [], creatorName: 'Claude Assistant', creatorType: 'agent', size: 8192, isNew: true, isRead: false, source: 'memory' },
  { id: 'd23', workspaceId: 'w1', name: 'Project Alpha 关键决策记录', type: 'Smart Doc', date: '2 days ago', lastModified: '2026-03-25T14:00:00Z', lastViewed: '2026-03-25T15:00:00Z', labels: [], creatorName: 'Claude Assistant', creatorType: 'agent', size: 12288, isRead: true, source: 'memory' },
  { id: 'd24', workspaceId: 'w1', name: '团队会议要点与行动项汇总', type: 'Smart Doc', date: '3 days ago', lastModified: '2026-03-24T16:00:00Z', lastViewed: '2026-03-24T17:00:00Z', labels: [], creatorName: 'Research Bot', creatorType: 'agent', size: 15360, isRead: true, source: 'memory' },
  { id: 'd25', workspaceId: 'w1', name: '竞品分析洞察备忘', type: 'Markdown', date: '4 days ago', lastModified: '2026-03-23T11:00:00Z', lastViewed: '2026-03-23T12:00:00Z', labels: [], creatorName: 'Research Bot', creatorType: 'agent', size: 10240, isRead: true, source: 'memory' },
];

interface Activity {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  userType: 'human' | 'agent';
  action: string;
  actionZh: string;
  targetName: string;
  targetType: string;
  docId?: string; // Reference to WorkspaceDoc.id
  details?: string;
  detailsZh?: string;
  timestamp: string;
}

const initialActivities: Activity[] = [
  // === Today (Mar 27) — corresponds to documents with today's lastModified ===
  {
    id: 'act26',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'updated',
    actionZh: '更新了',
    targetName: 'Project Alpha Architecture',
    targetType: 'Smart Doc',
    docId: 'd1',
    details: 'Revised system architecture to support multi-tenant deployment',
    detailsZh: '修订了系统架构以支持多租户部署',
    timestamp: '2026-03-27T12:00:00Z'
  },
  {
    id: 'act27',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'updated',
    actionZh: '更新了',
    targetName: 'Competitor Analysis',
    targetType: 'Markdown',
    docId: 'd4',
    details: 'Added Q1 market share data and refreshed pricing comparison',
    detailsZh: '新增了 Q1 市场份额数据并刷新了定价对比',
    timestamp: '2026-03-27T13:00:00Z'
  },
  {
    id: 'act28',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'updated',
    actionZh: '更新了',
    targetName: 'Claude & Maya: Feature Discussion',
    targetType: 'Smart Doc',
    docId: 'd6',
    details: 'Appended action items from today\'s sync meeting',
    detailsZh: '追加了今天同步会议的待办事项',
    timestamp: '2026-03-27T11:00:00Z'
  },
  {
    id: 'act29',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Industry Digest — Mar 27',
    targetType: 'Markdown',
    docId: 'd7',
    details: 'Scheduled task: compiled 14 industry news items from 9 sources',
    detailsZh: '定时任务：从 9 个来源汇编了 14 条行业资讯',
    timestamp: '2026-03-27T08:00:00Z'
  },
  {
    id: 'act30',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Daily Report — Mar 27',
    targetType: 'Markdown',
    docId: 'd13',
    details: 'Scheduled task: summarized 9 document changes, 4 new comments, 3 tasks completed',
    detailsZh: '定时任务：汇总了 9 项文档变更、4 条新评论、3 项任务完成',
    timestamp: '2026-03-27T17:00:00Z'
  },
  {
    id: 'act31',
    workspaceId: 'w1',
    userId: 'u1',
    userName: currentUser.name,
    userType: 'human',
    action: 'clipped',
    actionZh: '剪藏了',
    targetName: 'OpenAI GPT-5 发布全解析',
    targetType: 'Markdown',
    docId: 'd19',
    details: 'Web clipping saved from browser',
    detailsZh: '从浏览器保存的网页剪藏',
    timestamp: '2026-03-27T14:00:00Z'
  },
  {
    id: 'act32',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: '用户偏好：Maya 喜欢简洁的报告风格',
    targetType: 'Smart Doc',
    docId: 'd22',
    details: 'Memory note: captured user preference for concise report style',
    detailsZh: '记忆笔记：记录了用户偏好简洁报告风格',
    timestamp: '2026-03-27T09:30:00Z'
  },
  // === Yesterday (Mar 26) ===
  {
    id: 'act33',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'commented on',
    actionZh: '评论了',
    targetName: 'Project Alpha Architecture',
    targetType: 'Smart Doc',
    docId: 'd1',
    details: 'Raised concern about rate-limiting strategy for public APIs',
    detailsZh: '对公共 API 的限流策略提出了关注',
    timestamp: '2026-03-26T15:30:00Z'
  },
  {
    id: 'act34',
    workspaceId: 'w1',
    userId: 'u1',
    userName: currentUser.name,
    userType: 'human',
    action: 'updated',
    actionZh: '更新了',
    targetName: 'Marketing Strategy',
    targetType: 'Smart Doc',
    docId: 'd5',
    details: 'Finalized Q2 campaign budget allocation',
    detailsZh: '确定了 Q2 推广预算分配方案',
    timestamp: '2026-03-26T10:00:00Z'
  },
  // === Earlier this week (Mar 25, Tuesday) ===
  {
    id: 'act35',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Project Alpha 关键决策记录',
    targetType: 'Smart Doc',
    docId: 'd23',
    details: 'Memory note: archived 5 key decisions from project discussions',
    detailsZh: '记忆笔记：归档了项目讨论中的 5 项关键决策',
    timestamp: '2026-03-25T14:00:00Z'
  },
  {
    id: 'act36',
    workspaceId: 'w1',
    userId: 'a2',
    userName: 'Data Analyzer',
    userType: 'agent',
    action: 'commented on',
    actionZh: '评论了',
    targetName: 'Q3 Financial Projections',
    targetType: 'Table',
    docId: 'd2',
    details: 'Detected anomaly in March expense data — flagged for review',
    detailsZh: '检测到 3 月费用数据异常 — 已标记待审',
    timestamp: '2026-03-25T11:20:00Z'
  },
  // === Mar 24 (Monday — still this week) ===
  {
    id: 'act37',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: '团队会议要点与行动项汇总',
    targetType: 'Smart Doc',
    docId: 'd24',
    details: 'Memory note: summarized meeting outcomes and 8 action items',
    detailsZh: '记忆笔记：汇总了会议成果和 8 项待办事项',
    timestamp: '2026-03-24T16:00:00Z'
  },
  {
    id: 'act20',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Industry Digest — Mar 24',
    targetType: 'Markdown',
    details: 'Scheduled task: compiled 12 industry news items from 8 sources',
    detailsZh: '定时任务：从 8 个来源汇编了 12 条行业资讯',
    timestamp: '2026-03-24T08:00:00Z'
  },
  {
    id: 'act23',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Daily Report — Mar 24',
    targetType: 'Markdown',
    details: 'Scheduled task: summarized 6 document changes, 3 new comments, 2 tasks completed',
    detailsZh: '定时任务：汇总了 6 项文档变更、3 条新评论、2 项任务完成',
    timestamp: '2026-03-24T18:00:00Z'
  },
  // === Mar 23 (Sunday — still this week) ===
  {
    id: 'act38',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: '竞品分析洞察备忘',
    targetType: 'Markdown',
    docId: 'd25',
    details: 'Memory note: distilled key insights from latest competitor analysis',
    detailsZh: '记忆笔记：提炼了最新竞品分析的关键洞察',
    timestamp: '2026-03-23T11:00:00Z'
  },
  {
    id: 'act21',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Industry Digest — Mar 23',
    targetType: 'Markdown',
    docId: 'd8',
    details: 'Scheduled task: compiled 9 industry news items from 7 sources',
    detailsZh: '定时任务：从 7 个来源汇编了 9 条行业资讯',
    timestamp: '2026-03-23T08:00:00Z'
  },
  {
    id: 'act24',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Daily Report — Mar 23',
    targetType: 'Markdown',
    docId: 'd14',
    details: 'Scheduled task: summarized 4 document changes, 5 new comments, 1 task completed',
    detailsZh: '定时任务：汇总了 4 项文档变更、5 条新评论、1 项任务完成',
    timestamp: '2026-03-23T18:00:00Z'
  },
  // === Mar 22 (Saturday — still this week; week starts Sunday Mar 22 if today is Fri Mar 27) ===
  {
    id: 'act22',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Industry Digest — Mar 22',
    targetType: 'Markdown',
    docId: 'd9',
    details: 'Scheduled task: compiled 15 industry news items from 10 sources',
    detailsZh: '定时任务：从 10 个来源汇编了 15 条行业资讯',
    timestamp: '2026-03-22T08:00:00Z'
  },
  {
    id: 'act25',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Daily Report — Mar 22',
    targetType: 'Markdown',
    docId: 'd15',
    details: 'Scheduled task: summarized 8 document changes, 2 new comments, 4 tasks completed',
    detailsZh: '定时任务：汇总了 8 项文档变更、2 条新评论、4 项任务完成',
    timestamp: '2026-03-22T18:00:00Z'
  },
  {
    id: 'act12',
    workspaceId: 'w1',
    userId: 'u1',
    userName: currentUser.name,
    userType: 'human',
    action: 'updated',
    actionZh: '更新了',
    targetName: 'Project Alpha Architecture',
    targetType: 'Smart Doc',
    docId: 'd1',
    details: 'Reviewed and approved final version',
    detailsZh: '审阅并批准了最终版本',
    timestamp: '2026-03-22T09:00:00Z'
  },
  // === Last week (Mar 15–21) ===
  {
    id: 'act9',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'updated',
    actionZh: '更新了',
    targetName: 'Competitor Analysis',
    targetType: 'Markdown',
    docId: 'd4',
    details: 'Added pricing comparison table across all tiers',
    detailsZh: '新增了各档位定价对比表',
    timestamp: '2026-03-21T08:15:00Z'
  },
  {
    id: 'act11',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'updated',
    actionZh: '更新了',
    targetName: 'Project Alpha Architecture',
    targetType: 'Smart Doc',
    docId: 'd1',
    details: 'Refactored microservice diagram — split auth into standalone service',
    detailsZh: '重构了微服务架构图 — 将认证拆分为独立服务',
    timestamp: '2026-03-21T16:00:00Z'
  },
  {
    id: 'act15',
    workspaceId: 'w1',
    userId: 'u2',
    userName: 'Alice Chen',
    userType: 'human',
    action: 'modified',
    actionZh: '修改了',
    targetName: 'User Flow Diagram',
    targetType: 'Whiteboard',
    docId: 'd3',
    details: 'Added stakeholder review and approval path to the onboarding flow',
    detailsZh: '在注册引导流程中增加了利益相关方审核与审批路径',
    timestamp: '2026-03-21T10:20:00Z'
  },
  {
    id: 'act17',
    workspaceId: 'w1',
    userId: 'u3',
    userName: 'Bob Smith',
    userType: 'human',
    action: 'commented on',
    actionZh: '评论了',
    targetName: 'Project Alpha Architecture',
    targetType: 'Smart Doc',
    docId: 'd1',
    details: 'Added edge case notes for the auth flow handoff',
    detailsZh: '补充了认证流程交接的边缘场景说明',
    timestamp: '2026-03-21T14:45:00Z'
  },
  {
    id: 'act6',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'API Integration Guide',
    targetType: 'Markdown',
    details: 'Documented 14 REST endpoints with auth flow examples',
    detailsZh: '记录了 14 个 REST 端点及认证流程示例',
    timestamp: '2026-03-20T10:00:00Z'
  },
  {
    id: 'act7',
    workspaceId: 'w1',
    userId: 'a2',
    userName: 'Data Analyzer',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Revenue Dashboard',
    targetType: 'Table',
    details: 'Built automated monthly revenue tracker with YoY comparison',
    detailsZh: '搭建了按月自动追踪营收的看板，含同比对比',
    timestamp: '2026-03-20T14:30:00Z'
  },
  {
    id: 'act13',
    workspaceId: 'w1',
    userId: 'u1',
    userName: currentUser.name,
    userType: 'human',
    action: 'commented on',
    actionZh: '评论了',
    targetName: 'Q3 Financial Projections',
    targetType: 'Table',
    docId: 'd2',
    details: 'Requested breakdown by region',
    detailsZh: '要求按区域拆分数据',
    timestamp: '2026-03-20T15:30:00Z'
  },
  {
    id: 'act19',
    workspaceId: 'w1',
    userId: 'u4',
    userName: 'Eve Davis',
    userType: 'human',
    action: 'updated',
    actionZh: '更新了',
    targetName: 'Marketing Strategy',
    targetType: 'Smart Doc',
    docId: 'd5',
    details: 'Suggested channel mix changes in section 4 after review',
    detailsZh: '评审后建议调整第 4 节的渠道组合方案',
    timestamp: '2026-03-20T16:00:00Z'
  },
  {
    id: 'act1',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'modified',
    actionZh: '修改了',
    targetName: 'Project Alpha Architecture',
    targetType: 'Smart Doc',
    docId: 'd1',
    details: 'Added "Database Schema" section with ER diagram and index strategy',
    detailsZh: '新增了「数据库架构」章节，包含 ER 图与索引策略',
    timestamp: '2026-03-19T08:30:00Z'
  },
  {
    id: 'act5',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Competitor Analysis',
    targetType: 'Markdown',
    docId: 'd4',
    details: 'Initial draft covering 5 competitors with feature matrix',
    detailsZh: '初稿覆盖了 5 家竞品的功能对比矩阵',
    timestamp: '2026-03-19T07:00:00Z'
  },
  {
    id: 'act14',
    workspaceId: 'w1',
    userId: 'u2',
    userName: 'Alice Chen',
    userType: 'human',
    action: 'commented on',
    actionZh: '评论了',
    targetName: 'Project Alpha Architecture',
    targetType: 'Smart Doc',
    docId: 'd1',
    details: 'Shared handoff notes about service boundaries before design review',
    detailsZh: '在设计评审前分享了关于服务边界的交接说明',
    timestamp: '2026-03-19T11:00:00Z'
  },
  {
    id: 'act2',
    workspaceId: 'w1',
    userId: 'u1',
    userName: currentUser.name,
    userType: 'human',
    action: 'created',
    actionZh: '创建了',
    targetName: 'User Flow Diagram',
    targetType: 'Whiteboard',
    docId: 'd3',
    details: 'Initial onboarding and checkout flow wireframes',
    detailsZh: '绘制了初始的注册引导与结账流程线框图',
    timestamp: '2026-03-18T14:20:00Z'
  },
  {
    id: 'act10',
    workspaceId: 'w1',
    userId: 'a3',
    userName: 'Research Bot',
    userType: 'agent',
    action: 'created',
    actionZh: '创建了',
    targetName: 'Market Trends Report',
    targetType: 'Markdown',
    details: 'Q1 2026 analysis: AI tooling market grew 34% QoQ',
    detailsZh: '2026 Q1 分析：AI 工具市场环比增长 34%',
    timestamp: '2026-03-18T11:00:00Z'
  },
  {
    id: 'act3',
    workspaceId: 'w1',
    userId: 'a2',
    userName: 'Data Analyzer',
    userType: 'agent',
    action: 'updated',
    actionZh: '更新了',
    targetName: 'Q3 Financial Projections',
    targetType: 'Table',
    docId: 'd2',
    details: 'Revised August revenue forecast (+8.3%) based on new pipeline data',
    detailsZh: '根据最新渠道数据修订了 8 月营收预测（+8.3%）',
    timestamp: '2026-03-17T10:15:00Z'
  },
  {
    id: 'act16',
    workspaceId: 'w1',
    userId: 'u3',
    userName: 'Bob Smith',
    userType: 'human',
    action: 'commented on',
    actionZh: '评论了',
    targetName: 'Q3 Financial Projections',
    targetType: 'Table',
    docId: 'd2',
    details: 'Asked for monthly burn and runway annotations before the finance review',
    detailsZh: '要求在财务评审前补充月度消耗和资金跑道标注',
    timestamp: '2026-03-17T09:00:00Z'
  },
  {
    id: 'act18',
    workspaceId: 'w1',
    userId: 'u4',
    userName: 'Eve Davis',
    userType: 'human',
    action: 'commented on',
    actionZh: '评论了',
    targetName: 'Marketing Strategy',
    targetType: 'Smart Doc',
    docId: 'd5',
    details: 'Requested launch timing to align with the campaign calendar',
    detailsZh: '要求上线时间与营销日历对齐',
    timestamp: '2026-03-16T13:00:00Z'
  },
  {
    id: 'act8',
    workspaceId: 'w1',
    userId: 'a2',
    userName: 'Data Analyzer',
    userType: 'agent',
    action: 'commented on',
    actionZh: '评论了',
    targetName: 'Q3 Financial Projections',
    targetType: 'Table',
    docId: 'd2',
    details: 'Flagged $42k discrepancy in Q2 actuals vs. reported figures',
    detailsZh: '标记了 Q2 实际数据与报告数字之间 $42k 的差异',
    timestamp: '2026-03-15T09:20:00Z'
  },
  // === Older ===
  {
    id: 'act4',
    workspaceId: 'w1',
    userId: 'a1',
    userName: 'Claude Assistant',
    userType: 'agent',
    action: 'commented on',
    actionZh: '评论了',
    targetName: 'Project Alpha Architecture',
    targetType: 'Smart Doc',
    docId: 'd1',
    details: 'Suggested Redis caching layer for session management',
    detailsZh: '建议为会话管理增加 Redis 缓存层',
    timestamp: '2026-03-12T16:45:00Z'
  }
];

const absenceLastVisitTime = '2026-03-24T08:00:00Z';

const agentColorMap: Record<string, string> = {
  'Claude Assistant': '#F97316',
  'Research Bot': '#8B5CF6',
  'Data Analyzer': '#06B6D4',
};

// Derive absence summary from initialActivities — single source of truth
const absenceSummaryData: AbsenceSummaryData = {
  lastVisitTime: absenceLastVisitTime,
  changes: initialActivities
    .filter(a => a.userType === 'agent' && new Date(a.timestamp) > new Date(absenceLastVisitTime))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .map(a => {
      let action: 'created' | 'modified' | 'commented' = 'modified';
      if (a.action === 'created') action = 'created';
      else if (a.action === 'commented on') action = 'commented';
      else action = 'modified'; // 'updated', 'modified' etc.
      return {
        id: a.docId || a.id,
        action,
        docTitle: a.targetName,
        docType: a.targetType,
        agentName: a.userName,
        agentColor: agentColorMap[a.userName] || '#94A3B8',
        changeDescription: a.detailsZh,
        timestamp: a.timestamp,
      };
    }),
};

// --- Demo mode: "new" = new user onboarding, "existing" = rich mock data ---
type DemoMode = 'new' | 'existing';
const DEMO_MODE_KEY = 'mindx_demo_mode';

function getDemoMode(): DemoMode {
  const stored = localStorage.getItem(DEMO_MODE_KEY);
  if (stored === 'existing') return 'existing';
  if (stored === 'new') return 'new';
  // If no explicit demo mode set, fall back to isNewUser flag for backward compat
  return localStorage.getItem('mindx_is_new_user') === 'true' ? 'new' : 'existing';
}

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [demoMode, setDemoModeState] = useState<DemoMode>(getDemoMode);

  const setDemoMode = (mode: DemoMode) => {
    localStorage.setItem(DEMO_MODE_KEY, mode);
    if (mode === 'new') {
      // Activate new-user flags so the onboarding / guide logic works
      localStorage.setItem('mindx_is_new_user', 'true');
      localStorage.removeItem('mindx_absence_dismissed');
      localStorage.removeItem('mindx_guide_dismissed');
    } else {
      // Clear new-user flags for existing-user mode
      localStorage.removeItem('mindx_is_new_user');
      localStorage.setItem('mindx_absence_dismissed', 'false');
      localStorage.removeItem('mindx_guide_dismissed');
    }
    setDemoModeState(mode);
    // Reload to reinitialize all states with correct data
    window.location.href = '/dashboard?tab=settings';
  };

  const isNewUser = demoMode === 'new';
  const initLang = localStorage.getItem('mindx_lang') || 'en';
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(initialWorkspaces[0]?.id ?? 'w1');
  const [agents, setAgents] = useState(() => {
    try { const saved = localStorage.getItem('mindx_agents'); if (saved) return JSON.parse(saved); } catch {}
    return isNewUser ? [] : initialAgents;
  });
  useEffect(() => { localStorage.setItem('mindx_agents', JSON.stringify(agents)); }, [agents]);
  const [permissions, setPermissions] = useState(() => {
    if (isNewUser) {
      return [{ id: 'p1', workspaceId: 'w1', memberId: currentUser.id, memberType: 'Human' as const, role: 'Owner' }];
    }
    return initialPermissions;
  });
  // Supabase-backed documents & activities (fallback to mock data when not configured)
  const fallbackDocs = isNewUser
    ? [{ id: 'welcome', workspaceId: 'w1', name: initLang === 'zh' ? '欢迎使用 MindX' : 'Welcome to MindX', type: 'Smart Doc', date: initLang === 'zh' ? '刚刚' : 'Just now', lastModified: new Date().toISOString(), lastViewed: new Date().toISOString(), labels: ['Getting Started'], creatorName: 'Agent', creatorType: 'agent' as const, size: 8192, isNew: true, isRead: false, source: 'normal' as const }]
    : initialDocuments;
  const { documents, setDocuments, loading: docsLoading, createDoc, updateDoc, deleteDoc } = useDocuments('w1', fallbackDocs);
  const { activities, setActivities, loading: activitiesLoading, createActivity } = useActivities('w1', isNewUser ? [] : initialActivities);
  const [activeTab, setActiveTabState] = useState<'documents' | 'activity' | 'agents' | 'members' | 'settings' | 'labels' | 'skills' | 'memory'>(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['documents', 'activity', 'agents', 'members', 'settings', 'labels', 'skills', 'memory'].includes(tab)) {
      return tab as 'documents' | 'activity' | 'agents' | 'members' | 'settings' | 'labels' | 'skills' | 'memory';
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
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [isIntegrationMenuOpen, setIsIntegrationMenuOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [agentListMenuOpen, setAgentListMenuOpen] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [profileEditKey, setProfileEditKey] = useState<'whoami' | 'goal' | null>(null);
  const [profileEditDraft, setProfileEditDraft] = useState('');
  const [nodeEditId, setNodeEditId] = useState<string | null>(null);
  const [nodeEditTitle, setNodeEditTitle] = useState('');
  const [nodeEditDraft, setNodeEditDraft] = useState('');
  const [showExtractionFilePicker, setShowExtractionFilePicker] = useState(false);
  const [selectedExtractionFileIds, setSelectedExtractionFileIds] = useState<Set<string>>(new Set());
  const [docSceneFilter, setDocSceneFilter] = useState<'all' | 'today' | 'unread' | 'scheduled' | 'webclip' | 'memory'>('all');
  const [absenceSummaryDismissed, setAbsenceSummaryDismissed] = useState(() => localStorage.getItem('mindx_absence_dismissed') === 'true');
  const [guideDismissed, setGuideDismissedState] = useState(() => localStorage.getItem('mindx_guide_dismissed') === 'true');
  const setGuideDismissed = (v: boolean) => { setGuideDismissedState(v); if (v) localStorage.setItem('mindx_guide_dismissed', 'true'); };
  const [activityFilterOwner, setActivityFilterOwner] = useState<string>('all');

  // Extraction Agent states
  const [isModelConfigOpen, setIsModelConfigOpen] = useState(false);
  const [extractionModel, setExtractionModel] = useState(() => localStorage.getItem('mindx_extraction_model') || 'gpt-5.4');
  const [extractionApiKey, setExtractionApiKey] = useState(() => localStorage.getItem('mindx_extraction_apikey') || '');
  const [extractionBaseUrl, setExtractionBaseUrl] = useState(() => localStorage.getItem('mindx_extraction_baseurl') || 'https://right.codes/codex');
  const [extractionRunning, setExtractionRunning] = useState(false);
  const [extractionLogs, setExtractionLogs] = useState<{id: string; text: string; time: string; status: 'done' | 'running' | 'pending'}[]>([]);

  // Extracted key points (output of extraction agent)
  const [extractedKeyPoints, setExtractedKeyPoints] = useState<{id: string; title: string; type: string; text: string; source: string; createdAt: string}[]>(() => {
    try { const saved = localStorage.getItem('mindx_extracted_keypoints'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem('mindx_extracted_keypoints', JSON.stringify(extractedKeyPoints));
  }, [extractedKeyPoints]);

  // Fetch key points from DB on mount; migrate localStorage → DB if DB is empty
  useEffect(() => {
    fetch('/api/keypoints?workspace_id=w1')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((rows: any[]) => {
        if (rows.length > 0) {
          setExtractedKeyPoints(rows.map(r => ({
            id: r.id, title: r.title, type: r.type, text: r.text, source: r.source, createdAt: r.created_at
          })));
        } else {
          // DB empty — migrate localStorage keypoints to DB
          try {
            const saved = localStorage.getItem('mindx_extracted_keypoints');
            const localKPs = saved ? JSON.parse(saved) : [];
            for (const kp of localKPs) {
              fetch('/api/keypoints', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspace_id: 'w1', id: kp.id, title: kp.title, type: kp.type, text: kp.text, source: kp.source })
              }).catch(() => {});
            }
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const handleStartExtraction = async () => {
    if (!extractionApiKey.trim()) { setIsModelConfigOpen(true); return; }
    const itemsToExtract = rawDataItems.filter(i => selectedExtractionFileIds.has(i.id));
    if (itemsToExtract.length === 0) return;
    setShowExtractionFilePicker(false);
    setExtractionRunning(true);

    const newLog = {
      id: `log-${Date.now()}`,
      text: lang === 'zh' ? `正在使用 ${extractionModel} 提炼 ${itemsToExtract.length} 个文件...` : `Extracting ${itemsToExtract.length} documents with ${extractionModel}...`,
      time: 'now',
      status: 'running' as const,
    };
    setExtractionLogs(prev => [newLog, ...prev]);

    try {
      const allKPs: any[] = [];
      
      for (const item of itemsToExtract) {
        // Find content either from item properties, or read from localStorage if it's been edited
        const whoAmI = localStorage.getItem('mindx_raw_whoami_doc') || '';
        const goal = localStorage.getItem('mindx_raw_goal_doc') || '';

        const prompt = extractionSkillPrompt
          .replace('{{LOCALE}}', lang === 'zh' ? 'Chinese' : 'English')
          .replace('{{WHO_AM_I}}', whoAmI)
          .replace('{{MY_GOALS}}', goal)
          + `\n\nText:\n${item.content}`;
        let baseUrl = extractionBaseUrl.endsWith('/') ? extractionBaseUrl.slice(0, -1) : extractionBaseUrl;
        const apiUrl = baseUrl.includes('/v1') || baseUrl.includes('/chat') ? baseUrl : `${baseUrl}/v1/chat/completions`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${extractionApiKey}`
          },
          body: JSON.stringify({
            model: extractionModel,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1,
            response_format: { type: "json_object" }
          })
        });

        if (!response.ok) throw new Error(`API returned status: ${response.status}`);
        const data = await response.json();
        let answer = data.choices[0]?.message?.content || '{"insights":[]}';
        
        try {
          if(answer.includes('```json')) {
             answer = answer.split('```json')[1].split('```')[0].trim();
          }
          const parsed = JSON.parse(answer);
          const insightsArray = parsed.insights || (Array.isArray(parsed) ? parsed : []);
          
          if (Array.isArray(insightsArray)) {
            insightsArray.forEach((insight: any, index: number) => {
              allKPs.push({
                id: `kp-${Date.now()}-${item.id}-${index}`,
                title: item.name,
                type: insight.type || (lang === 'zh' ? '洞察' : 'Insight'),
                text: insight.text || 'Unknown insight',
                source: item.name,
                createdAt: new Date().toISOString()
              });
            });
          }
        } catch (e) {
          console.error('Failed to parse model output for', item.id, e, answer);
        }
      }

      setExtractionRunning(false);
      setExtractionLogs(prev => prev.map(l => l.id === newLog.id ? { ...l, text: lang === 'zh' ? `已完成 ${itemsToExtract.length} 个文档的提炼，共发现 ${allKPs.length} 条有效洞察并入库` : `Completed extraction of ${itemsToExtract.length} docs, found ${allKPs.length} insights`, status: 'done' as const, time: 'just now' } : l));
      
      if (allKPs.length > 0) {
        setExtractedKeyPoints(prev => [...allKPs, ...prev]);
        // Persist each KP to DB
        for (const kp of allKPs) {
          fetch('/api/keypoints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ workspace_id: 'w1', id: kp.id, title: kp.title, type: kp.type, text: kp.text, source: kp.source })
          }).catch(() => {});
        }
      }
    } catch (err: any) {
      setExtractionRunning(false);
      setExtractionLogs(prev => prev.map(l => l.id === newLog.id ? { ...l, text: lang === 'zh' ? `资料引擎提炼中断抛错: ${err.message}` : `Extraction failed: ${err.message}`, status: 'done' as const, time: 'just now' } : l));
    }
  };

  // Memory upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawDataItems, setRawDataItems] = useState<{id: string; name: string; type: string; size: number; uploadedAt: string; source: 'file' | 'paste'; content?: string}[]>(() => {
    try { const saved = localStorage.getItem('mindx_raw_data_items'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  // Fetch raw data from DB on mount; migrate localStorage → DB if DB is empty
  useEffect(() => {
    fetch('/api/rawdata?workspace_id=w1')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((rows: any[]) => {
        if (rows.length > 0) {
          setRawDataItems(rows.map(r => ({
            id: r.id, name: r.name, type: r.type, size: r.size,
            uploadedAt: r.created_at, source: r.source as 'file' | 'paste', content: r.content
          })));
        } else {
          // DB empty — migrate localStorage items to DB
          try {
            const saved = localStorage.getItem('mindx_raw_data_items');
            const localItems = saved ? JSON.parse(saved) : [];
            for (const item of localItems) {
              const content = localStorage.getItem(`mindx_raw_${item.id}`) || item.content || '';
              fetch('/api/rawdata', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ workspace_id: 'w1', id: item.id, name: item.name, type: item.type, size: item.size, source: item.source, content })
              }).catch(() => {});
            }
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  // Persist rawDataItems to localStorage on change
  useEffect(() => {
    localStorage.setItem('mindx_raw_data_items', JSON.stringify(rawDataItems.map(({ content, ...rest }) => rest)));
  }, [rawDataItems]);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isRawDataModalOpen, setIsRawDataModalOpen] = useState(false);

  // Custom memory nodes
  const [isMemoryNodesExpanded, setIsMemoryNodesExpanded] = useState(false);
  const [memoryNodeInput, setMemoryNodeInput] = useState('');
  const [memoryNodes, setMemoryNodes] = useState<{id: string; title: string; content: string; createdAt: string; updatedAt: string}[]>(() => {
    try { const saved = localStorage.getItem('mindx_memory_nodes'); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  // Database-backed profile (Who am I + Goal)
  const { profile, updateProfile } = useProfile('w1');
  const whoAmIDocContent = profile.whoami || localStorage.getItem('mindx_raw_whoami_doc') || '';
  const setWhoAmIDocContent = (v: string) => updateProfile('whoami', v);
  const goalDocContent = profile.goal || localStorage.getItem('mindx_raw_goal_doc') || '';
  const setGoalDocContent = (v: string) => updateProfile('goal', v);

  // Extraction Prompt
  const [extractionSkillPrompt, setExtractionSkillPrompt] = useState(() => localStorage.getItem('mindx_extraction_prompt') || `You are an expert analyst. Extract key viewpoints, decision points, directions, or principles from the provided text that align with the user's goals. Return ONLY a valid JSON object with a single property "insights" containing an array of objects, each with "title" and "text" (in {{LOCALE}}).
IMPORTANT CONTEXT:
Who am I:
{{WHO_AM_I}}
My Goals:
{{MY_GOALS}}
Analyze the following text strictly from the perspective of "Who am I" and to serve "My Goals".`);
  useEffect(() => { localStorage.setItem('mindx_extraction_prompt', extractionSkillPrompt); }, [extractionSkillPrompt]);

  const parsedGoals = goalDocContent.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    .map(l => ({ title: l.replace(/^[-*0-9.)\]]+\s*/, ''), default: false })); // strip bullets like 1. - * 

  const displayGoals = parsedGoals.length > 0 ? parsedGoals : [
    { title: '构建 Agent-Native 记忆中枢', deadline: 'Q2', priority: 'High', color: 'orange' },
    { title: '完善全平台交互与多端适配体验', deadline: 'May', priority: 'Medium', color: 'stone' }
  ];

  const parsedWhoAmI = whoAmIDocContent.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    .map(l => l.replace(/^[-*0-9.)\]]+\s*/, ''));

  useEffect(() => {
    localStorage.setItem('mindx_memory_nodes', JSON.stringify(memoryNodes));
  }, [memoryNodes]);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const newItems = fileArray.map((file: File, i: number) => ({
      id: `raw-${Date.now()}-${i}`,
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      source: 'file' as const,
      content: '',
    }));
    // Read each file's text content
    fileArray.forEach((file: File, i: number) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string || '';
        localStorage.setItem(`mindx_raw_${newItems[i].id}`, text);
        setRawDataItems(prev => prev.map(item => item.id === newItems[i].id ? { ...item, content: text } : item));
        // Sync to DB
        fetch('/api/rawdata', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workspace_id: 'w1', id: newItems[i].id, name: newItems[i].name, type: newItems[i].type, size: newItems[i].size, source: 'file', content: text })
        }).catch(() => {});
      };
      reader.readAsText(file);
    });
    setRawDataItems(prev => [...newItems, ...prev]);
    setIsIntegrationMenuOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePasteSubmit = () => {
    if (!pasteContent.trim()) return;
    const title = pasteTitle.trim() || (lang === 'zh' ? '粘贴的文本' : 'Pasted Text') + ` — ${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
    const itemId = `raw-${Date.now()}`;
    localStorage.setItem(`mindx_raw_${itemId}`, pasteContent);
    const newItem = {
      id: itemId, name: title, type: 'TXT',
      size: new Blob([pasteContent]).size,
      uploadedAt: new Date().toISOString(),
      source: 'paste' as const, content: pasteContent,
    };
    setRawDataItems(prev => [newItem, ...prev]);
    // Sync to DB
    fetch('/api/rawdata', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspace_id: 'w1', id: itemId, name: title, type: 'TXT', size: newItem.size, source: 'paste', content: pasteContent })
    }).catch(() => {});
    setPasteTitle('');
    setPasteContent('');
    setIsPasteModalOpen(false);
    setIsIntegrationMenuOpen(false);
  };

  const openRawDataInEditor = (item: typeof rawDataItems[0]) => {
    if (item.content) {
      localStorage.setItem(`mindx_raw_${item.id}`, item.content);
    }
    navigate(`/document?type=text&backTab=memory&source=rawdata&rawId=${item.id}&title=${encodeURIComponent(item.name)}`);
  };

  // Document actions
  const [agentPermissionModalOpen, setAgentPermissionModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [agentPermissions, setAgentPermissions] = useState<AgentPermission[]>([]);

  const setActiveTab = (tab: 'documents' | 'activity' | 'agents' | 'members' | 'settings' | 'labels' | 'skills' | 'memory') => {
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
    
    // Auto-create a welcome document, clear initial demo data for new user
    const welcomeDoc: WorkspaceDoc = {
      id: `d${Date.now()}`,
      workspaceId: activeWorkspaceId,
      name: lang === 'zh' ? '欢迎使用 MindX' : 'Welcome to MindX',
      type: 'Smart Doc',
      date: lang === 'zh' ? '刚刚' : 'Just now',
      lastModified: new Date().toISOString(),
      lastViewed: new Date().toISOString(),
      labels: ['Getting Started'],
      creatorName: agentName,
      creatorType: 'agent',
      size: 8192,
      isNew: true,
      isRead: false,
      source: 'normal'
    };
    setDocuments([welcomeDoc]);
    setActivities([]);
    setAbsenceSummaryDismissed(true);
    localStorage.setItem('mindx_absence_dismissed', 'true');
    localStorage.setItem('mindx_is_new_user', 'true');
    
    setShowOnboarding(false);
    setActiveTab('documents');
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

    // 按场景筛选
    if (docSceneFilter === 'today') {
      const todayStr = new Date().toISOString().slice(0, 10);
      docs = docs.filter(d => d.lastModified.slice(0, 10) === todayStr);
    } else if (docSceneFilter === 'unread') {
      docs = docs.filter(d => d.isNew === true);
    } else if (docSceneFilter === 'scheduled') {
      docs = docs.filter(d => d.source === 'scheduled');
    } else if (docSceneFilter === 'webclip') {
      docs = docs.filter(d => d.source === 'webclip');
    } else if (docSceneFilter === 'memory') {
      docs = docs.filter(d => d.source === 'memory');
    }
    
    // 排序
    docs.sort((a, b) => {
      const dateA = new Date(a[docSortBy]).getTime();
      const dateB = new Date(b[docSortBy]).getTime();
      return dateB - dateA; // 降序（最新在前）
    });
    
    return docs;
  }, [workspaceDocs, docSortBy, docFilterType, docFilterOwner, docSceneFilter]);

  // 获取当前 workspace 的文档类型列表和 owner 列表（用于筛选选项）
  const docTypes = React.useMemo(() => {
    return Array.from(new Set(workspaceDocs.map(d => d.type)));
  }, [workspaceDocs]);
  
  const docOwners = React.useMemo(() => {
    const owners = Array.from(new Set(workspaceDocs.map(d => d.creatorName)));
    return owners.sort((a, b) => a === currentUser.name ? -1 : b === currentUser.name ? 1 : 0);
  }, [workspaceDocs]);

  const activeFilterCount = (docFilterType !== 'all' ? 1 : 0) + (docFilterOwner !== 'all' ? 1 : 0) + (docSceneFilter !== 'all' ? 1 : 0);
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
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Workspace Group */}
          <div className="space-y-1">
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Workspace</span>
            </div>
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
          </div>

          {/* Skills Group */}
          <div className="space-y-1">
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Skills</span>
            </div>
            <NavItem 
              icon={<Sparkles className="w-4 h-4" />} 
              label="Skills" 
              active={activeTab === 'skills'} 
              onClick={() => { setActiveTab('skills'); setIsCreatingAgent(false); setSelectedAgentId(null); }}
            />
          </div>

          {/* Memory Group */}
          <div className="space-y-1">
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Memory</span>
            </div>
            <NavItem 
              icon={<Brain className="w-4 h-4" />} 
              label={lang === 'zh' ? '记忆 (Memory)' : 'Memory'} 
              active={activeTab === 'memory'} 
              onClick={() => { setActiveTab('memory'); setIsCreatingAgent(false); }}
            />
          </div>

          <div className="pt-4 mt-2">
            <button
              onClick={() => navigate('/v2/workspace')}
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left shadow-sm shadow-stone-100 transition-all hover:bg-stone-50"
            >
              <div className="flex items-center gap-2 text-stone-900">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold">
                  {lang === 'zh' ? '切换到 2.0' : 'Switch to 2.0'}
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="shrink-0 border-t border-stone-200 px-3 py-2 bg-[#F7F7F5] space-y-1">
          <div className="flex items-center gap-2 px-2 py-1.5 pt-2 border-t border-stone-200/50">
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
          <div className="space-y-8 max-w-6xl">
            
            {activeTab === 'documents' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Absence Summary Card — only in "existing user" mode */}
                {demoMode === 'existing' && !absenceSummaryDismissed && (
                  <AbsenceSummaryCard
                    data={absenceSummaryData}
                    onDocClick={(docId, docType) => {
                      navigate(`/document?type=${docType.toLowerCase().replace(' ', '')}`);
                    }}
                    onDismiss={() => setAbsenceSummaryDismissed(true)}
                    onViewAll={() => setActiveTab('activity')}
                  />
                )}

                {/* Scene filter tabs */}
                {/* Quick Start Guide — shown for new users */}
                {!guideDismissed && documents.length <= 1 && (
                  <div className="mt-4 mb-2">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-stone-900">🚀 {lang === 'zh' ? '快速上手' : 'Quick Start'}</h3>
                      <button onClick={() => setGuideDismissed(true)} className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                        {lang === 'zh' ? '关闭' : 'Dismiss'}
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setActiveTab('agents')}
                        className="group p-5 rounded-xl cursor-pointer border border-stone-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md hover:border-blue-200 transition-all text-left"
                      >
                        <div className="text-3xl mb-3">🤖</div>
                        <div className="text-sm font-semibold text-stone-900 mb-1">{lang === 'zh' ? '连接 Agent' : 'Connect Agent'}</div>
                        <p className="text-[11px] text-stone-500 leading-relaxed">{lang === 'zh' ? '复制提示词，让 AI Agent 接入你的空间' : 'Copy prompt to connect your AI Agent'}</p>
                      </button>
                      <button
                        onClick={() => setActiveTab('skills')}
                        className="group p-5 rounded-xl cursor-pointer border border-stone-200/80 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-md hover:border-amber-200 transition-all text-left"
                      >
                        <div className="text-3xl mb-3">⚡</div>
                        <div className="text-sm font-semibold text-stone-900 mb-1">{lang === 'zh' ? '安装 Skill' : 'Install Skills'}</div>
                        <p className="text-[11px] text-stone-500 leading-relaxed">{lang === 'zh' ? '为你的 Agent 扩展文档创作等强大能力' : 'Extend your Agent with powerful capabilities'}</p>
                      </button>
                      <button
                        onClick={() => setActiveTab('documents')}
                        className="group p-5 rounded-xl cursor-pointer border border-stone-200/80 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-md hover:border-emerald-200 transition-all text-left"
                      >
                        <div className="text-3xl mb-3">📂</div>
                        <div className="text-sm font-semibold text-stone-900 mb-1">{lang === 'zh' ? '管理资产' : 'Manage Assets'}</div>
                        <p className="text-[11px] text-stone-500 leading-relaxed">{lang === 'zh' ? '查看和管理你的文档、表格、白板等' : 'View and manage your docs, tables & more'}</p>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1 mt-[26px] mb-4">
                  {([
                    { key: 'all', label: lang === 'zh' ? '全部文档' : 'All', icon: <FileText className="w-3.5 h-3.5" /> },
                    { key: 'today', label: lang === 'zh' ? '今日更新' : 'Today', icon: <CalendarDays className="w-3.5 h-3.5" /> },
                    { key: 'unread', label: lang === 'zh' ? '未读文档' : 'Unread', icon: <EyeOff className="w-3.5 h-3.5" /> },
                    { key: 'scheduled', label: lang === 'zh' ? '定时任务' : 'Scheduled', icon: <Timer className="w-3.5 h-3.5" /> },
                    { key: 'webclip', label: lang === 'zh' ? '网页剪藏' : 'Web Clips', icon: <Bookmark className="w-3.5 h-3.5" /> },
                    { key: 'memory', label: lang === 'zh' ? '我的记忆' : 'Memories', icon: <Brain className="w-3.5 h-3.5" /> },
                  ] as const).map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setDocSceneFilter(tab.key)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        docSceneFilter === tab.key
                          ? 'bg-stone-800 text-white'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Document table */}
                <div>
                    <div className="border border-stone-200/80 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]" style={{ overflow: 'visible' }}>
                  <table className="w-full text-left text-sm table-fixed">
                    <thead className="bg-stone-50/50 text-stone-500 border-b border-stone-200/80 rounded-t-xl [&>tr>th:first-child]:rounded-tl-xl [&>tr>th:last-child]:rounded-tr-xl">
                      <tr>
                        {/* Name column with Type filter */}
                        <th className="px-6 py-3 font-medium bg-stone-50/50 w-[45%]">
                          <div className="relative inline-flex items-center">
                            <button
                              onClick={() => { setIsTypeFilterOpen(!isTypeFilterOpen); setIsSortMenuOpen(false); }}
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
                        <th className="px-4 py-3 font-medium w-[180px]">{t('docs.owner')}</th>

                        {/* Date column with Sort toggle */}
                        <th className="px-4 py-3 font-medium whitespace-nowrap w-[160px]">
                          <div className="relative inline-flex items-center">
                            <button
                              onClick={() => { setIsSortMenuOpen(!isSortMenuOpen); setIsTypeFilterOpen(false); }}
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

                        <th className="px-3 py-3 font-medium text-right w-[48px]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredAndSortedDocs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-stone-500">
                            <FileText className="w-8 h-8 mx-auto mb-3 text-stone-300" />
                            {activeFilterCount > 0 ? (
                              <div>
                                <p>No documents match the current filters</p>
                                <button
                                  onClick={() => { setDocFilterType('all'); setDocFilterOwner('all'); }}
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
                            creatorName={doc.creatorName}
                            creatorType={doc.creatorType}
                            isNew={doc.isNew}
                            onDelete={(id) => setDocuments(prev => prev.filter(d => d.id !== id))}
                            onMarkRead={(id) => setDocuments(prev => prev.map(d => d.id === id ? { ...d, isNew: false, isRead: true } : d))}
                            onUpgradeRequirement={() => setIsPricingModalOpen(true)}
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

            {activeTab === 'settings' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full"
              >
                {/* Embedded Agents Settings */}
                <div className="mb-12 pb-8 border-b border-stone-200/80">
                  <h3 className="text-xl font-bold text-stone-900 mb-6">Agent Configuration</h3>
                </div>
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
                            { name: 'MindX Memory', tag: 'Core', icon: <Database className="w-4 h-4" />, provider: 'MindX' },
                            { name: 'Daily Update', tag: 'Pro', icon: <CalendarDays className="w-4 h-4" />, provider: 'MindX' },
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
                })() : (
                  <div 
                    className="max-w-5xl w-full flex items-start flex-col md:flex-row md:gap-8"
                  >
                    {/* Left Navigation Menu */}
                    <div className="w-full md:w-40 lg:w-44 shrink-0 -order-1 md:order-none mb-6 md:mb-0 self-start md:sticky md:top-0">
                      <div className="space-y-1.5 p-1 bg-white md:bg-transparent rounded-xl shadow-sm border border-stone-100 md:shadow-none md:border-none md:rounded-none">
                        {[
                          { id: 'section-agent-config', label: lang === 'zh' ? 'Agent 代理配置' : 'Agent Config' },
                          { id: 'section-storage', label: lang === 'zh' ? '账号容量' : 'Storage Capacity' },
                          { id: 'section-demo', label: lang === 'zh' ? '演示模式' : 'Demo Mode' },
                          { id: 'section-share', label: lang === 'zh' ? '分享文档预览' : 'Share Preview' },
                          { id: 'section-extraction', label: lang === 'zh' ? '萃取引擎配置' : 'Extraction Engine Config' },
                        ].map(nav => (
                          <button
                            key={nav.id}
                            onClick={() => {
                              const el = document.getElementById(nav.id);
                              if(el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-stone-500 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
                          >
                            {nav.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 w-full max-w-3xl space-y-6">
                      {/* Agent Config Box */}
                      <div id="section-agent-config" className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-xl font-bold tracking-tight text-stone-900 mb-0">Agent Configuration</h2>
                        </div>
                        {(() => {
                          const agentList = agents;
                          return agents.length > 0 ? (
                            agents.map(agent => {
                              const agentActivityCount = activities.filter(a => a.userId === agent.id).length;
                              return (
                                <div 
                                  key={agent.id} 
                                  onClick={() => setSelectedAgentId(agent.id)}
                                  className="rounded-xl bg-white border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer group mb-4"
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
                ) : (
                  <div className="text-center py-12 border border-stone-200 border-dashed rounded-lg">
                    <p className="text-sm font-medium text-stone-900 mb-1">{lang === 'zh' ? '暂无可配置的 Agent' : 'No Agents Available'}</p>
                    <p className="text-xs text-stone-500">{lang === 'zh' ? '您可以随时创建一个新的私人助理' : 'Create a new personal assistant anytime'}</p>
                  </div>
                );
              })()}
              </div>

              {/* Storage Capacity Bar */}
              <div id="section-storage" className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 mb-6">
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
                          <div
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

                {/* Demo Mode Switcher */}
                <div id="section-demo" className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 mb-6">
                  <h3 className="text-sm font-semibold text-stone-900 mb-1">
                    {lang === 'zh' ? '演示模式' : 'Demo Mode'}
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    {lang === 'zh' 
                      ? '切换新用户（空数据 + 引导流程）或老用户（丰富数据 + 产品功能）模式。切换后页面将刷新。' 
                      : 'Switch between new user (empty data + onboarding guide) or existing user (rich data + full features). Page will refresh.'}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* New User Card */}
                    <button
                      onClick={() => { if (demoMode !== 'new') setDemoMode('new'); }}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        demoMode === 'new' 
                          ? 'border-stone-900 bg-stone-50 shadow-sm' 
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      {demoMode === 'new' && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-semibold text-stone-900 mb-1">
                        {lang === 'zh' ? '🆕 新用户' : '🆕 New User'}
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        {lang === 'zh' 
                          ? '空白状态 + Quick Start 引导 + Onboarding 向导，展示新用户首次使用体验' 
                          : 'Clean slate + Quick Start guide + Onboarding wizard for first-use experience'}
                      </p>
                    </button>
                    {/* Existing User Card */}
                    <button
                      onClick={() => { if (demoMode !== 'existing') setDemoMode('existing'); }}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        demoMode === 'existing' 
                          ? 'border-stone-900 bg-stone-50 shadow-sm' 
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      {demoMode === 'existing' && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                        <FileText className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-sm font-semibold text-stone-900 mb-1">
                        {lang === 'zh' ? '👤 老用户' : '👤 Existing User'}
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        {lang === 'zh' 
                          ? '丰富数据，包含 25 个文档、30+ 动态、3 个 Agent，展示完整产品功能' 
                          : 'Rich data — 25 docs, 30+ activities, 3 agents to showcase full product'}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Shared Document Preview Entry */}
                <div id="section-share" className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 mb-6">
                  <h3 className="text-sm font-semibold text-stone-900 mb-1">
                    {lang === 'zh' ? '分享预览' : 'Share Preview'}
                  </h3>
                  <p className="text-xs text-stone-500 mb-4">
                    {lang === 'zh' 
                      ? '预览被分享人打开文档链接时看到的只读页面。包含 MindX 品牌推广和用户引导。' 
                      : 'Preview the read-only page a shared link recipient sees. Includes MindX branding & CTA.'}
                  </p>
                  <button
                    onClick={() => window.open('/shared', '_blank')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-xl text-sm font-medium hover:from-stone-700 hover:to-stone-800 transition-all shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {lang === 'zh' ? '打开分享文档预览' : 'Open Shared Document Preview'}
                  </button>
                </div>

                {/* Extraction Agent Model Config */}
                <div id="section-extraction" className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-sm shadow-violet-500/20">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                        {lang === 'zh' ? '萃取 Agent 模型配置' : 'Extraction Agent Config'}
                        <span className={`inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full ${extractionApiKey ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${extractionApiKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {extractionApiKey ? (lang === 'zh' ? '已配置' : 'Ready') : (lang === 'zh' ? '待配置' : 'Not set')}
                        </span>
                      </h3>
                      <p className="text-[11px] text-stone-500">{lang === 'zh' ? '配置用于萃取原始文档信息的大模型' : 'Configure the LLM used for raw data extraction'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Model */}
                    <div>
                      <label className="text-xs font-semibold text-stone-600 mb-1.5 block">{lang === 'zh' ? '模型' : 'Model'}</label>
                      <select
                        value={extractionModel}
                        onChange={e => setExtractionModel(e.target.value)}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors bg-white cursor-pointer"
                      >
                        <optgroup label="OpenAI">
                          <option value="gpt-5.4">GPT-5.4</option>
                          <option value="gpt-4o">GPT-4o</option>
                          <option value="gpt-4o-mini">GPT-4o Mini</option>
                          <option value="o3-mini">o3-mini</option>
                        </optgroup>
                        <optgroup label="Anthropic">
                          <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
                          <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                          <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
                        </optgroup>
                        <optgroup label="DeepSeek">
                          <option value="deepseek-chat">DeepSeek V3</option>
                          <option value="deepseek-reasoner">DeepSeek R1</option>
                        </optgroup>
                        <optgroup label={lang === 'zh' ? '国产模型' : 'Chinese Models'}>
                          <option value="qwen-max">Qwen Max</option>
                          <option value="glm-4-plus">GLM-4 Plus</option>
                          <option value="moonshot-v1-128k">Moonshot 128K</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* API Key */}
                    <div>
                      <label className="text-xs font-semibold text-stone-600 mb-1.5 block">API Key</label>
                      <input
                        type="password"
                        value={extractionApiKey}
                        onChange={e => setExtractionApiKey(e.target.value)}
                        placeholder={lang === 'zh' ? '输入模型对应的 API Key...' : 'Enter API key for selected model...'}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors"
                      />
                      <p className="text-[10px] text-stone-400 mt-1">{lang === 'zh' ? 'API Key 仅存储在浏览器本地，不会上传到服务器' : 'Stored locally in your browser only, never sent to our servers'}</p>
                    </div>

                    {/* Base URL */}
                    <div>
                      <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Base URL <span className="text-stone-400 font-normal">({lang === 'zh' ? '可选' : 'Optional'})</span></label>
                      <input
                        type="text"
                        value={extractionBaseUrl}
                        onChange={e => setExtractionBaseUrl(e.target.value)}
                        placeholder={lang === 'zh' ? '自定义 API 端点，留空则使用官方默认' : 'Custom endpoint, leave empty for official default'}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors"
                      />
                    </div>

                    {/* Extraction Prompt Template */}
                    <div className="pt-1">
                      <label className="text-xs font-semibold text-stone-600 mb-1.5 flex items-center justify-between">
                        <span>{lang === 'zh' ? '系统提示词 (Prompt Template)' : 'System Prompt Template'}</span>
                      </label>
                      <textarea
                        value={extractionSkillPrompt}
                        onChange={e => setExtractionSkillPrompt(e.target.value)}
                        placeholder="You are an expert analyst..."
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-[13px] leading-relaxed font-mono focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors h-48 resize-y"
                      />
                      <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                        {lang === 'zh' 
                          ? '支持的变量：{{LOCALE}} (当前语言), {{WHO_AM_I}} (我的身份信息), {{MY_GOALS}} (我的长期目标)' 
                          : 'Supported variables: {{LOCALE}}, {{WHO_AM_I}}, {{MY_GOALS}}'}
                      </p>
                    </div>

                    {/* Save */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="bg-violet-50/60 rounded-lg px-3 py-2 border border-violet-100 flex-1 mr-4">
                        <p className="text-[10px] text-violet-600">{lang === 'zh' ? '💡 萃取 Agent 会从原始文档中提取关键事实、识别洞察模式、生成结构化知识条目并更新记忆库。' : '💡 Extracts key facts, identifies patterns, generates knowledge entries & updates memory.'}</p>
                      </div>
                      <button
                        onClick={() => {
                          localStorage.setItem('mindx_extraction_model', extractionModel);
                          localStorage.setItem('mindx_extraction_apikey', extractionApiKey);
                          localStorage.setItem('mindx_extraction_baseurl', extractionBaseUrl);
                        }}
                        className="px-5 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors shrink-0"
                      >
                        {lang === 'zh' ? '保存' : 'Save'}
                      </button>
                    </div>
                  </div>
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

                </div>
              </div>
            )}
            </motion.div>
          </motion.div>
        )}

        {/* --- Next blocks --- */}
        {activeTab === 'skills' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Skill List */}
                <div className="border border-stone-200/80 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-stone-200/50">
                  {[
                    { id: 'mindx-docs', name: 'MindX Docs', tag: 'Core', icon: <FileText className="w-4 h-4" />, provider: 'MindX', desc: lang === 'zh' ? '文档读写 Skill' : 'Document read/write' },
                    { id: 'memory-io', name: 'MindX Memory', tag: 'Core', icon: <Database className="w-4 h-4" />, provider: 'MindX', desc: lang === 'zh' ? '读写记忆的 Skill' : 'Read/write memory engine' },
                    { id: 'daily-log', name: 'Daily Update', tag: 'Pro', icon: <CalendarDays className="w-4 h-4" />, provider: 'MindX', desc: lang === 'zh' ? '上传今天做了啥的 Skill' : 'Daily upload skill' },
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
                              {lang === 'zh' ? '让你的 AI Agent 拥有文档读写能力。Agent 可以通过 API 在 MindX 文档列表中创建、查询、更新和删除文档。' : 'Give your AI Agent document read/write capabilities. Create, query, update and delete documents in MindX via API.'}
                            </p>
                            <div className="grid md:grid-cols-2 gap-1.5">
                              {(lang === 'zh' ? ['创建 Markdown 文档到文档列表', '查询所有文档及内容', '更新已有文档内容', '删除不需要的文档'] : ['Create Markdown docs to document list', 'Query all documents & content', 'Update existing document content', 'Delete unwanted documents']).map((cap, j) => (
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
                              <p className="text-xs text-stone-500 mb-3">💡 {lang === 'zh' ? '复制粘贴到 Agent 对话中即可自动安装。' : 'Copy and paste into your Agent chat to auto-install.'}</p>
                              <div className="relative">
                                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 pr-24 text-sm font-mono text-stone-700 leading-relaxed overflow-x-auto whitespace-pre-wrap">{`Install the MindX Docs skill. API endpoints:\n- GET https://mindx-ux.vercel.app/api/documents?workspace_id=w1 (list all documents)\n- POST https://mindx-ux.vercel.app/api/documents (create document, body: {workspace_id, name, type, content, creator_name, creator_type})\n- PUT https://mindx-ux.vercel.app/api/documents (update document, body: {id, name?, content?})\n- DELETE https://mindx-ux.vercel.app/api/documents?id=uuid (delete document)`}</div>
                                <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`Install the MindX Docs skill. API endpoints:\n- GET https://mindx-ux.vercel.app/api/documents?workspace_id=w1 (list all documents)\n- POST https://mindx-ux.vercel.app/api/documents (create document, body: {workspace_id, name, type, content, creator_name, creator_type})\n- PUT https://mindx-ux.vercel.app/api/documents (update document, body: {id, name?, content?})\n- DELETE https://mindx-ux.vercel.app/api/documents?id=uuid (delete document)`); setCopiedStates(prev => ({ ...prev, skillInstall: true })); setTimeout(() => setCopiedStates(prev => ({ ...prev, skillInstall: false })), 2000); }} className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm">{copiedStates['skillInstall'] ? <><Check className="w-3.5 h-3.5" />{lang === 'zh' ? '已复制' : 'Copied'}</> : <><Copy className="w-3.5 h-3.5" />{lang === 'zh' ? '复制' : 'Copy'}</>}</button>
                              </div>
                            </div>
                            {/* Step 2 */}
                            <div className="relative pl-10">
                              <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0"><div className="flex-1 border-l border-dashed border-stone-300" /><svg className="w-2.5 h-2.5 text-stone-300 shrink-0" viewBox="0 0 10 10" fill="none"><path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                              <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">2</div>
                              <h4 className="text-sm font-bold text-stone-800 mb-2">{lang === 'zh' ? 'Agent 完成安装' : 'Agent Completes Installation'}</h4>
                              <p className="text-xs text-stone-500 leading-relaxed">{lang === 'zh' ? '💡 Agent 会自动创建 Skill 配置并记住 API 端点。之后在任何对话中都可以读写你的 MindX 文档。' : '💡 Agent will auto-configure the Skill and remember API endpoints. Then read/write your MindX documents from any conversation.'}</p>
                            </div>
                            {/* Step 3 */}
                            <div className="relative pl-10">
                              <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">3</div>
                              <h4 className="text-sm font-bold text-stone-800 mb-2">{lang === 'zh' ? '使用 Skill' : 'Use Skill'}</h4>
                              <p className="text-xs text-stone-500 leading-relaxed mb-3">💡 {lang === 'zh' ? '安装成功后，你可以让 Agent 创建文档、查询文档列表、更新内容。' : 'After installation, ask your Agent to create docs, query list, or update content.'}</p>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60"><span className="text-xs font-bold text-stone-800 shrink-0">{lang === 'zh' ? '创建文档' : 'Create'}</span><span className="text-xs text-stone-500">—</span><span className="text-xs text-stone-600">{lang === 'zh' ? '"帮我写一份竞品分析报告，保存到 MindX"' : '"Write a competitor analysis and save to MindX"'}</span></div>
                                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60"><span className="text-xs font-bold text-stone-800 shrink-0">{lang === 'zh' ? '查询文档' : 'Query'}</span><span className="text-xs text-stone-500">—</span><span className="text-xs text-stone-600">{lang === 'zh' ? '"列出我 MindX 里的所有文档"' : '"List all my MindX documents"'}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Inline detail for Daily Update */}
                      {selectedSkillId === skill.id && skill.id === 'daily-log' && (
                        <div className="border-t border-stone-100 bg-white" onClick={(e) => e.stopPropagation()}>
                          <div className="p-6 pb-5">
                            <p className="text-sm text-stone-500 leading-relaxed mb-4">
                              {lang === 'zh' ? '让你的 AI Agent 在每天工作结束后，自动将当日完成的任务和重要事项上传到 MindX Memory，作为原始数据素材供后续提炼。' : 'Let your AI Agent automatically upload daily work summaries to MindX Memory as raw data for future insight extraction.'}
                            </p>
                            <div className="grid md:grid-cols-2 gap-1.5">
                              {(lang === 'zh' ? ['自动汇总当天完成的工作', '生成结构化日报文档', '上传至 MindX Memory 原始数据', '记录活动日志供追溯'] : ['Auto-summarize daily work', 'Generate structured daily reports', 'Upload to MindX Memory raw data', 'Activity log for audit trail']).map((cap, j) => (
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
                              <p className="text-xs text-stone-500 mb-3">💡 {lang === 'zh' ? '复制以下命令粘贴到 Agent 对话中，Agent 会自动安装此 Skill。' : 'Copy the command below and paste it into your Agent chat.'}</p>
                              <div className="relative">
                                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 pr-24 text-sm font-mono text-stone-700 leading-relaxed overflow-x-auto whitespace-pre-wrap">{`Install the MindX Daily Update skill from https://mindx-ux.vercel.app/skills/daily-activity. API endpoint: https://mindx-ux.vercel.app/api/documents (POST to upload daily reports) and https://mindx-ux.vercel.app/api/activities (POST to log activities). Workspace ID: w1.`}</div>
                                <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`Install the MindX Daily Update skill from https://mindx-ux.vercel.app/skills/daily-activity. API endpoint: https://mindx-ux.vercel.app/api/documents (POST to upload daily reports) and https://mindx-ux.vercel.app/api/activities (POST to log activities). Workspace ID: w1.`); setCopiedStates(prev => ({ ...prev, dailyInstall: true })); setTimeout(() => setCopiedStates(prev => ({ ...prev, dailyInstall: false })), 2000); }} className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm">{copiedStates['dailyInstall'] ? <><Check className="w-3.5 h-3.5" />{lang === 'zh' ? '已复制' : 'Copied'}</> : <><Copy className="w-3.5 h-3.5" />{lang === 'zh' ? '复制' : 'Copy'}</>}</button>
                              </div>
                            </div>
                            {/* Step 2 */}
                            <div className="relative pl-10">
                              <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0"><div className="flex-1 border-l border-dashed border-stone-300" /><svg className="w-2.5 h-2.5 text-stone-300 shrink-0" viewBox="0 0 10 10" fill="none"><path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                              <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">2</div>
                              <h4 className="text-sm font-bold text-stone-800 mb-2">{lang === 'zh' ? 'Agent 完成安装' : 'Agent Completes Installation'}</h4>
                              <p className="text-xs text-stone-500 leading-relaxed">{lang === 'zh' ? '💡 Agent 收到指令后，会自动创建对应的 Skill 配置文件并记住 API 端点地址。' : '💡 Agent will auto-create the Skill config and remember the API endpoints.'}</p>
                            </div>
                            {/* Step 3 */}
                            <div className="relative pl-10">
                              <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">3</div>
                              <h4 className="text-sm font-bold text-stone-800 mb-2">{lang === 'zh' ? '使用 Skill' : 'Use Skill'}</h4>
                              <p className="text-xs text-stone-500 leading-relaxed mb-3">💡 {lang === 'zh' ? '每天工作结束时，对 Agent 说"上传今天的工作"即可自动生成日报并上传。' : 'Say "upload today\'s work" at end of day to auto-generate and upload daily report.'}</p>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60"><span className="text-xs font-bold text-stone-800 shrink-0">{lang === 'zh' ? '触发词' : 'Triggers'}</span><span className="text-xs text-stone-500">—</span><span className="text-xs text-stone-600">{lang === 'zh' ? '"上传今天的工作"、"记录今天做的事"、"提交 daily activity"' : '"upload today\'s work", "log daily activity", "submit daily report"'}</span></div>
                                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60"><span className="text-xs font-bold text-stone-800 shrink-0">{lang === 'zh' ? '日报格式' : 'Format'}</span><span className="text-xs text-stone-500">—</span><span className="text-xs text-stone-600">{lang === 'zh' ? '核心成果 → 详细工作 → 修复优化 → 待跟进' : 'Key Results → Details → Fixes → Follow-ups'}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Inline detail for MindX Memory */}
                      {selectedSkillId === skill.id && skill.id === 'memory-io' && (
                        <div className="border-t border-stone-100 bg-white" onClick={(e) => e.stopPropagation()}>
                          <div className="p-6 pb-5">
                            <p className="text-sm text-stone-500 leading-relaxed mb-4">
                              {lang === 'zh' ? '让你的 AI Agent 拥有持久记忆能力。读写用户画像（Who am I）、当前目标（Goal）、知识库原始数据和已提炼洞察。' : 'Give your AI Agent persistent memory. Read/write user profile (Who am I), goals, knowledge base raw data, and extracted insights.'}
                            </p>
                            <div className="grid md:grid-cols-2 gap-1.5">
                              {(lang === 'zh' ? ['读写用户身份画像 (Who am I)', '读写当前目标 (Goal)', '读写知识库原始数据', '读写已提炼洞察 (Key Points)'] : ['Read/write user profile (Who am I)', 'Read/write current goals', 'Read/write knowledge base raw data', 'Read/write extracted insights']).map((cap, j) => (
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
                              <p className="text-xs text-stone-500 mb-3">💡 {lang === 'zh' ? '复制粘贴到 Agent 对话中即可自动安装。' : 'Copy and paste into your Agent chat to auto-install.'}</p>
                              <div className="relative">
                                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 pr-24 text-sm font-mono text-stone-700 leading-relaxed overflow-x-auto whitespace-pre-wrap">{`Install the MindX Memory skill. API endpoints:\n- GET/PUT https://mindx-ux.vercel.app/api/profile?workspace_id=w1 (user profile: whoami, goal)\n- GET/POST/PUT/DELETE https://mindx-ux.vercel.app/api/rawdata?workspace_id=w1 (knowledge base raw data)\n- GET/POST/DELETE https://mindx-ux.vercel.app/api/keypoints?workspace_id=w1 (extracted insights)\n- GET/POST https://mindx-ux.vercel.app/api/activities?workspace_id=w1 (activity logs)`}</div>
                                <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`Install the MindX Memory skill. API endpoints:\n- GET/PUT https://mindx-ux.vercel.app/api/profile?workspace_id=w1 (user profile: whoami, goal)\n- GET/POST/PUT/DELETE https://mindx-ux.vercel.app/api/rawdata?workspace_id=w1 (knowledge base raw data)\n- GET/POST/DELETE https://mindx-ux.vercel.app/api/keypoints?workspace_id=w1 (extracted insights)\n- GET/POST https://mindx-ux.vercel.app/api/activities?workspace_id=w1 (activity logs)`); setCopiedStates(prev => ({ ...prev, memoryInstall: true })); setTimeout(() => setCopiedStates(prev => ({ ...prev, memoryInstall: false })), 2000); }} className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm">{copiedStates['memoryInstall'] ? <><Check className="w-3.5 h-3.5" />{lang === 'zh' ? '已复制' : 'Copied'}</> : <><Copy className="w-3.5 h-3.5" />{lang === 'zh' ? '复制' : 'Copy'}</>}</button>
                              </div>
                            </div>
                            {/* Step 2 */}
                            <div className="relative pl-10">
                              <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0"><div className="flex-1 border-l border-dashed border-stone-300" /><svg className="w-2.5 h-2.5 text-stone-300 shrink-0" viewBox="0 0 10 10" fill="none"><path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                              <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">2</div>
                              <h4 className="text-sm font-bold text-stone-800 mb-2">{lang === 'zh' ? 'Agent 完成安装' : 'Agent Completes Installation'}</h4>
                              <p className="text-xs text-stone-500 leading-relaxed">{lang === 'zh' ? '💡 Agent 会自动创建 Skill 配置并记住 API 端点。之后在任何对话中都可以读写你的 MindX 记忆。' : '💡 Agent auto-creates config and remembers endpoints. Can read/write MindX memory in any conversation.'}</p>
                            </div>
                            {/* Step 3 */}
                            <div className="relative pl-10">
                              <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">3</div>
                              <h4 className="text-sm font-bold text-stone-800 mb-2">{lang === 'zh' ? '使用 Skill' : 'Use Skill'}</h4>
                              <p className="text-xs text-stone-500 leading-relaxed mb-3">💡 {lang === 'zh' ? 'Agent 会在需要时自动调用 MindX 记忆接口，也可以主动触发。' : 'Agent auto-calls MindX memory API when needed, or trigger manually.'}</p>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60"><span className="text-xs font-bold text-stone-800 shrink-0">{lang === 'zh' ? '读记忆' : 'Read'}</span><span className="text-xs text-stone-500">—</span><span className="text-xs text-stone-600">{lang === 'zh' ? '"读一下我的记忆"、"我的目标是什么"、"查看我的画像"' : '"read my memory", "what are my goals", "show my profile"'}</span></div>
                                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60"><span className="text-xs font-bold text-stone-800 shrink-0">{lang === 'zh' ? '写记忆' : 'Write'}</span><span className="text-xs text-stone-500">—</span><span className="text-xs text-stone-600">{lang === 'zh' ? '"更新我的目标为 XXX"、"记住我是 XXX"' : '"update my goal to XXX", "remember I am XXX"'}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Inline Coming Soon for other skills */}
                      {selectedSkillId === skill.id && !['mindx-docs', 'daily-log', 'memory-io'].includes(skill.id) && (
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

            {activeTab === 'memory' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pb-12 w-full max-w-6xl relative"
              >
                {/* Ambient Background Glows */}
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-300/10 rounded-full blur-[120px] pointer-events-none -z-10" />
                <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-300/10 rounded-full blur-[140px] pointer-events-none -z-10" />
                {/* Global Memory Search */}
                <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex items-center focus-within:ring-2 focus-within:ring-stone-200/50 focus-within:border-stone-400 transition-all">
                  <div className="pl-5 pr-3 py-4 text-stone-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder={lang === 'zh' ? '搜索空间记忆（支持原始文档、节点、决策提炼内容）...' : 'Search memories (docs, nodes, insights, decisions)...'}
                    className="flex-1 bg-transparent text-sm text-stone-800 placeholder-stone-400 focus:outline-none py-4"
                  />
                  <div className="px-5 text-xs font-medium text-stone-400 flex items-center gap-1 border-l border-stone-100 py-4 h-full bg-stone-50/50">
                    <span className="bg-white rounded px-1.5 py-0.5 border border-stone-200 shadow-sm font-sans">⌘</span>
                    <span className="bg-white rounded px-1.5 py-0.5 border border-stone-200 shadow-sm font-sans">K</span>
                  </div>
                </div>

                <div className="space-y-12">
                  {/* Top: Mind Config Nodes */}
                  <div className="grid md:grid-cols-2 gap-6 items-stretch mb-10">
                    {/* Who am I (Core User Profile) */}
                    <section className="h-full flex flex-col bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                      <div className="flex items-center justify-between mb-5 relative z-10">
                        <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <User className="w-4 h-4 text-indigo-500" />
                          {lang === 'zh' ? '关于我 (Who am I)' : 'Who am I'}
                        </h2>
                        <button onClick={() => { setProfileEditKey('whoami'); setProfileEditDraft(profile.whoami || ''); }} className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-1 rounded hover:bg-stone-200 transition-colors">
                            {lang === 'zh' ? '编辑' : 'Edit'}
                          </button>
                      </div>
                      <div className="relative z-10 text-xs text-stone-700 leading-relaxed font-medium whitespace-pre-line cursor-pointer hover:text-stone-900 transition-colors" onClick={() => { setProfileEditKey('whoami'); setProfileEditDraft(profile.whoami || ''); }}>
                        {whoAmIDocContent || (lang === 'zh' ? '点击编辑，描述你的身份与交互偏好...' : 'Click to edit your identity and preferences...')}
                      </div>
                    </section>

                    {/* Goal (Current Objectives) */}
                    <section className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          <Target className="w-4 h-4 text-orange-500" />
                          {lang === 'zh' ? '当前目标 (Goal)' : 'Current Goal'}
                        </h2>
                        <button onClick={() => { setProfileEditKey('goal'); setProfileEditDraft(profile.goal || ''); }} className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-1 rounded hover:bg-stone-200 transition-colors">
                            {lang === 'zh' ? '编辑' : 'Edit'}
                          </button>
                      </div>
                      <div className="relative z-10 text-xs text-stone-700 leading-relaxed font-medium whitespace-pre-line cursor-pointer hover:text-stone-900 transition-colors" onClick={() => { setProfileEditKey('goal'); setProfileEditDraft(profile.goal || ''); }}>
                        {goalDocContent || (lang === 'zh' ? '点击编辑，描述你当前的核心目标...' : 'Click to edit your current goals...')}
                      </div>
                    </section>
                  </div>

                  {/* Custom Memory Nodes Block */}
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-stone-900 text-[13px] flex items-center gap-2">
                      <Brain className="w-4 h-4 text-violet-500" />
                      {lang === 'zh' ? '自定义记忆节点 (Custom Nodes)' : 'Custom Memory Nodes'}
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                    {/* Custom Memory Nodes mapped as cards */}
                    {memoryNodes.map(node => (
                      <section key={node.id} className="h-full flex flex-col bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                        <div className="flex items-center justify-between mb-5 relative z-10">
                          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 truncate pr-2">
                            <Brain className="w-4 h-4 text-violet-500 shrink-0" />
                            <span className="truncate">{node.title}</span>
                          </h2>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => { setNodeEditId(node.id); setNodeEditTitle(node.title); setNodeEditDraft(node.content || localStorage.getItem(`mindx_raw_${node.id}`) || ''); }} className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-1 rounded hover:bg-stone-200 transition-colors">
                              {lang === 'zh' ? '编辑' : 'Edit'}
                            </button>
                          </div>
                        </div>
                        <div className="relative z-10 text-xs text-stone-700 leading-relaxed font-medium whitespace-pre-line cursor-pointer hover:text-stone-900 transition-colors mt-auto" onClick={() => { setNodeEditId(node.id); setNodeEditTitle(node.title); setNodeEditDraft(node.content || localStorage.getItem(`mindx_raw_${node.id}`) || ''); }}>
                          {(node.content || localStorage.getItem(`mindx_raw_${node.id}`)) || (lang === 'zh' ? '点击编辑...' : 'Click to edit...')}
                        </div>
                      </section>
                    ))}

                    {/* Add New Custom Node Card */}
                    <section className="h-full flex flex-col justify-center bg-stone-50/40 backdrop-blur-sm border-[1.5px] border-dashed border-stone-300 rounded-2xl p-6 transition-all duration-300 hover:bg-stone-100/50 hover:border-stone-400 group relative min-h-[200px]">
                      {isMemoryNodesExpanded ? (
                        <div className="w-full flex justify-center">
                          <div className="w-full space-y-3">
                            <div className="flex items-center gap-2">
                              <Brain className="w-4 h-4 text-violet-500" />
                              <span className="text-xs font-semibold text-stone-700">{lang === 'zh' ? '添加自定义节点' : 'Add Custom Node'}</span>
                            </div>
                            <input
                              type="text"
                              value={memoryNodeInput}
                              onChange={e => setMemoryNodeInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && memoryNodeInput.trim()) {
                                  const newNode = { id: `mnode-${Date.now()}`, title: memoryNodeInput.trim(), content: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
                                  setMemoryNodes(prev => [...prev, newNode]); // append
                                  localStorage.setItem(`mindx_raw_${newNode.id}`, '');
                                  setMemoryNodeInput('');
                                  setIsMemoryNodesExpanded(false);
                                } else if (e.key === 'Escape') {
                                  setIsMemoryNodesExpanded(false);
                                }
                              }}
                              placeholder={lang === 'zh' ? '输入名称后回车...' : 'Type name and hit Enter...'}
                              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 bg-white shadow-sm"
                              autoFocus
                            />
                            <div className="flex items-center gap-2 shrink-0">
                               <button 
                                 onClick={() => {
                                  if (!memoryNodeInput.trim()) return;
                                  const newNode = { id: `mnode-${Date.now()}`, title: memoryNodeInput.trim(), content: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
                                  setMemoryNodes(prev => [...prev, newNode]);
                                  localStorage.setItem(`mindx_raw_${newNode.id}`, '');
                                  setMemoryNodeInput('');
                                  setIsMemoryNodesExpanded(false);
                                 }}
                                 className="flex-1 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
                               >
                                 {lang === 'zh' ? '确认' : 'Confirm'}
                               </button>
                               <button
                                 onClick={() => setIsMemoryNodesExpanded(false)}
                                 className="flex-1 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-lg text-xs font-medium hover:bg-stone-50 transition-colors"
                               >
                                 {lang === 'zh' ? '取消' : 'Cancel'}
                               </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setIsMemoryNodesExpanded(true)}
                          className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer outline-none"
                        >
                          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-stone-200">
                            <Plus className="w-5 h-5 text-stone-500" />
                          </div>
                          <span className="text-sm font-semibold text-stone-500 group-hover:text-stone-700">{lang === 'zh' ? '新建记忆节点' : 'New Memory Node'}</span>
                        </button>
                      )}
                    </section>
                  </div>

                  {/* Extracted Key Points Library */}
                  <div className="grid lg:grid-cols-1 gap-8 items-start">
                    {/* Key Points */}
                    <section className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">{lang === 'zh' ? '已提炼洞察列表 (Key Points)' : 'Extracted Key Points'}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-stone-400">{extractedKeyPoints.length} {lang === 'zh' ? '条' : 'items'}</span>
                          <button onClick={() => navigate('/document?type=text&backTab=memory&source=keypoints_doc')} className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors" title={lang === 'zh' ? '作为独立文档打开' : 'Open as Document'}>
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {extractedKeyPoints.length === 0 ? (
                        <div className="text-center py-8">
                          <Sparkles className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                          <p className="text-sm text-stone-400 font-medium">{lang === 'zh' ? '暂无洞察' : 'No insights yet'}</p>
                          <p className="text-[11px] text-stone-400 mt-1">{lang === 'zh' ? '上传原始资料后点击「开始萃取」，洞察会出现在这里' : 'Upload raw data and run extraction to see insights here'}</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {extractedKeyPoints.map(kp => {
                            return (
                              <div key={kp.id} className="flex items-center justify-between p-4 rounded-xl border border-stone-200/60 bg-white hover:bg-stone-50 hover:border-stone-200 transition-all group cursor-pointer shadow-sm">
                                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-[13px] font-semibold text-stone-800 truncate">{kp.text}</h4>
                                    <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                                      <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                                      {lang === 'zh' ? '源自：' : 'From: '}
                                      <span className="hover:text-stone-700 hover:underline truncate">{kp.source}</span>
                                    </p>
                                  </div>
                                </div>
                                <button onClick={e => { e.stopPropagation(); fetch(`/api/keypoints?id=${kp.id}`, { method: 'DELETE' }).catch(() => {}); setExtractedKeyPoints(prev => prev.filter(p => p.id !== kp.id)); }} className="p-1 rounded-md text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  </div>



                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-stone-200"></div>
                    <span className="shrink-0 mx-4 text-[10px] font-bold text-stone-400/80 uppercase tracking-[0.2em]">
                      {lang === 'zh' ? '底层素材流转引擎 (Data Flow & Insight Engine)' : 'Data Flow & Insight Engine'}
                    </span>
                    <div className="flex-grow border-t border-stone-200"></div>
                  </div>


                  {/* BOTTOM PIPELINE */}
                  <div className="space-y-8">
                    <div className="w-full">
                  {/* Raw Data */}
                  <section>
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h2 className="text-sm font-bold text-stone-900 mb-2">{lang === 'zh' ? '知识库 (Knowledge Base)' : 'Knowledge Base'}</h2>
                        <p className="text-xs text-stone-500">{lang === 'zh' ? '等待 Agent 提取、理解并蒸馏为结构化知识的原始数据。' : 'Raw materials waiting for Agent extraction and distillation into structured knowledge.'}</p>
                      </div>
                      <div className="relative z-50">
                        <button 
                          onClick={() => setIsIntegrationMenuOpen(!isIntegrationMenuOpen)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          {lang === 'zh' ? '新建接入' : 'New Source'}
                        </button>
                        
                        {/* Mega Menu Dropdown MOVED HERE */}
                        {isIntegrationMenuOpen && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setIsIntegrationMenuOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-[760px] bg-white border border-stone-200 rounded-xl shadow-2xl z-40 overflow-hidden" onClick={e => e.stopPropagation()}>
<div className="p-5">
                                  <h3 className="text-sm font-bold text-stone-900 mb-4">{lang === 'zh' ? '选择你想接入的数据源' : 'Choose Data Source'}</h3>
                                  <div className="grid grid-cols-3 gap-x-8 gap-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {/* Column 1 */}
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">{lang === 'zh' ? '通用文档' : 'Documents'}</h4>
                                        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 transition-colors group">
                                          <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="text-sm font-medium text-stone-800">{lang === 'zh' ? '本地文件上传' : 'Local File Upload'}</div>
                                            <div className="text-[10px] text-stone-400 group-hover:text-stone-500 transition-colors">PDF, Word, TXT, Excel</div>
                                          </div>
                                        </button>
                                        <button onClick={() => { setIsPasteModalOpen(true); setIsIntegrationMenuOpen(false); }} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 transition-colors group">
                                          <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4 text-stone-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="text-sm font-medium text-stone-800">{lang === 'zh' ? '粘贴文本' : 'Paste Text'}</div>
                                            <div className="text-[10px] text-stone-400 group-hover:text-stone-500 transition-colors">{lang === 'zh' ? '直接粘贴文本内容' : 'Paste text directly'}</div>
                                          </div>
                                        </button>
                                      </div>
                                      <div>
                                        <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">{lang === 'zh' ? '搜索与收藏' : 'Search & Save'}</h4>
                                        <button disabled className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors opacity-40 cursor-not-allowed">
                                          <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                                            <Globe className="w-4 h-4 text-emerald-600" />
                                          </div>
                                          <div className="text-left flex-1">
                                            <div className="flex items-center gap-1.5"><span className="text-sm font-medium text-stone-800">{lang === 'zh' ? '网页剪存' : 'Web Clipper'}</span><span className="text-[8px] font-bold bg-stone-200 text-stone-500 px-1 py-0.5 rounded leading-none">{lang === 'zh' ? '即将上线' : 'Soon'}</span></div>
                                            <div className="text-[10px] text-stone-400">{lang === 'zh' ? '保存并在MindX阅读网页' : 'Save and read pages in MindX'}</div>
                                          </div>
                                        </button>
                                        <button disabled className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors opacity-40 cursor-not-allowed">
                                          <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4 text-green-600" />
                                          </div>
                                          <div className="text-left">
                                            <div className="flex items-center gap-1.5"><div className="text-sm font-medium text-stone-800">flomo</div><span className="text-[8px] font-bold bg-stone-200 text-stone-500 px-1 py-0.5 rounded leading-none">{lang === 'zh' ? '即将上线' : 'Soon'}</span></div>
                                            <div className="text-[10px] text-stone-400">{lang === 'zh' ? '浮墨笔记同步' : 'Sync from flomo'}</div>
                                          </div>
                                        </button>
                                      </div>
                                    </div>
                                    {/* Column 2 */}
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">{lang === 'zh' ? '云端协作' : 'Cloud Apps'}</h4>
                                        {[
                                          { icon: <Cloud className="w-4 h-4 text-blue-700" />, bg: 'bg-blue-100', name: lang === 'zh' ? '腾讯文档' : 'Tencent Docs', desc: lang === 'zh' ? '自动同步更新的在线文档' : 'Auto sync online docs' },
                                          { icon: <Cloud className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50', name: lang === 'zh' ? '微云' : 'Weiyun', desc: lang === 'zh' ? '导入微云文件' : 'Import Weiyun files' },
                                          { icon: <MessageCircle className="w-4 h-4 text-green-600" />, bg: 'bg-green-50', name: lang === 'zh' ? '微信' : 'WeChat', desc: lang === 'zh' ? '同步微信文件通过小助手' : 'Sync via WeChat helper' },
                                          { icon: <Mail className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-50', name: lang === 'zh' ? 'QQ邮箱' : 'QQ Mail', desc: lang === 'zh' ? '解析邮件及其附件' : 'Parse emails and attachments' },
                                        ].map((item, idx) => (
                                          <button key={idx} disabled className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors opacity-40 cursor-not-allowed">
                                            <div className={`w-8 h-8 rounded-md ${item.bg} flex items-center justify-center shrink-0`}>{item.icon}</div>
                                            <div className="text-left">
                                              <div className="flex items-center gap-1.5"><span className="text-sm font-medium text-stone-800">{item.name}</span><span className="text-[8px] font-bold bg-stone-200 text-stone-500 px-1 py-0.5 rounded leading-none">{lang === 'zh' ? '即将上线' : 'Soon'}</span></div>
                                              <div className="text-[10px] text-stone-400">{item.desc}</div>
                                            </div>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    {/* Column 3: 第三方插件同步 */}
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">{lang === 'zh' ? '第三方插件同步' : 'Third-Party Sync'}</h4>
                                        <div className="space-y-1">
                                          {[
                                            { name: '腾讯会议', type: 'video' },
                                            { name: '飞书妙记', type: 'video' },
                                            { name: '钉钉闪记', type: 'video' },
                                            { name: 'Plaud', type: 'mic' },
                                            { name: 'Plaudcn', type: 'mic' },
                                            { name: 'Get笔记', type: 'mic' },
                                            { name: '通义听悟', type: 'mic' },
                                            { name: '千问录音', type: 'mic' },
                                            { name: '讯飞听见', type: 'mic' },
                                            { name: 'TicNote', type: 'mic' },
                                          ].map((item, idx) => (
                                            <button key={idx} disabled className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors cursor-not-allowed opacity-40 justify-between">
                                              <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                                                  {item.type === 'video' ? <Video className="w-3.5 h-3.5 text-white" /> : <Mic className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                                <span className="text-[13px] font-medium text-stone-800">{item.name}</span>
                                              </div>
                                              <RefreshCw className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors" />
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>                                  </div>
                                </div>

                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                        {/* 空间内部源 — 展开式文件列表 */}
                        <div className="bg-white/60 border border-stone-100 rounded-xl overflow-hidden">
                          <div 
                            className="flex items-center justify-between px-4 py-2.5 text-xs text-stone-500"
                          >
                            <span>{rawDataItems.length} {lang === 'zh' ? '份资料' : 'files'}</span>
                          </div>
                          {rawDataItems.length > 0 && (
                            <div className="border-t border-stone-100">
                              {rawDataItems.slice(0, 5).map((item, idx) => (
                                <div 
                                  key={item.id} 
                                  className={`flex items-center justify-between px-4 py-2.5 text-xs hover:bg-stone-50/80 transition-colors cursor-pointer ${idx < Math.min(rawDataItems.length, 5) - 1 ? 'border-b border-stone-50' : ''}`}
                                  onClick={() => openRawDataInEditor(item)}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <FileText className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                    <span className="text-stone-700 font-medium truncate">{item.name}</span>
                                  </div>
                                  <span className="text-[10px] text-stone-400 shrink-0 ml-2">{item.type}</span>
                                </div>
                              ))}
                              {rawDataItems.length > 5 && (
                                <div 
                                  className="px-4 py-2 text-center text-xs text-blue-600 font-semibold cursor-pointer hover:bg-blue-50/50 transition-colors border-t border-stone-100"
                                  onClick={() => setIsRawDataModalOpen(true)}
                                >
                                  {lang === 'zh' ? `查看全部 ${rawDataItems.length} 份资料 →` : `View all ${rawDataItems.length} files →`}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 提炼引擎状态条 */}
                        <div 
                          className="flex items-center justify-between p-3 bg-white/40 border border-stone-100 rounded-xl cursor-pointer hover:bg-stone-50/50 transition-colors"
                          onClick={() => setIsPricingModalOpen(true)}
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-stone-400" />
                            <span className="text-xs font-medium text-stone-500">{lang === 'zh' ? '大模型提炼队列' : 'Agent Insight Engine'}</span>
                            <span className="text-[9px] font-bold bg-stone-900 text-white px-1.5 py-0.5 rounded leading-none tracking-wider">PRO</span>
                          </div>
                          <span className="text-xs font-bold text-blue-600 animate-pulse">
                            {rawDataItems.length} {lang === 'zh' ? '待处理' : 'pending'}
                          </span>
                        </div>

                        {/* 操作按钮 */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExtractionFileIds(new Set(rawDataItems.map(i => i.id)));
                            setShowExtractionFilePicker(true);
                          }}
                          disabled={extractionRunning || rawDataItems.length === 0}
                          className={`w-full flex items-center justify-center gap-2 text-white text-sm font-semibold p-3.5 rounded-xl transition-all duration-300 shadow-md ${
                            extractionRunning || rawDataItems.length === 0
                              ? 'bg-stone-300 cursor-not-allowed shadow-none'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]'
                          }`}
                        >
                          {extractionRunning ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {lang === 'zh' ? '正在提取全量资料...' : 'Extracting Insights...'}
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              {lang === 'zh' ? `开始洞察 (${rawDataItems.length} 个未处理)` : `Start Insight (${rawDataItems.length} Pending)`}
                            </>
                          )}
                        </button>
                    </div>
                  </section>




                </div>

                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </main>

      {/* Hidden file input for Memory upload */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.xls,.csv,.pptx,.ppt,.json"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Paste Text Modal */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsPasteModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="px-6 py-4 flex items-center justify-between border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900">{lang === 'zh' ? '粘贴文本内容' : 'Paste Text Content'}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">Markdown</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[9px] font-bold">✓</span>
                <button onClick={() => setIsPasteModalOpen(false)} className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-900 ml-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">{lang === 'zh' ? '标题（可选）' : 'Title (Optional)'}</label>
                <input
                  type="text"
                  value={pasteTitle}
                  onChange={e => setPasteTitle(e.target.value)}
                  placeholder={lang === 'zh' ? '为这份资料命名...' : 'Name this content...'}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-colors"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-stone-600">{lang === 'zh' ? '内容' : 'Content'}</label>
                  <span className="text-[10px] text-stone-400">{lang === 'zh' ? '支持 Markdown 语法：# 标题、**粗体**、- 列表、> 引用、```代码块' : 'Supports Markdown: # headings, **bold**, - lists, > quotes, ```code'}</span>
                </div>
                <textarea
                  value={pasteContent}
                  onChange={e => setPasteContent(e.target.value)}
                  placeholder={lang === 'zh' ? '在此粘贴你的 Markdown 或纯文本内容...\n\n例如：\n# 我的笔记\n\n这是一段 **重要** 的内容。\n\n- 要点一\n- 要点二' : 'Paste your Markdown or plain text here...\n\ne.g.:\n# My Notes\n\nThis is **important** content.\n\n- Point one\n- Point two'}
                  rows={10}
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg text-sm font-mono leading-relaxed focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-colors resize-none bg-stone-50/50"
                  autoFocus
                />
              </div>
              {/* Live Markdown Preview */}
              {pasteContent.trim() && (
                <div>
                  <label className="text-xs font-semibold text-stone-400 mb-1.5 block uppercase tracking-wider">{lang === 'zh' ? '预览' : 'Preview'}</label>
                  <div className="border border-stone-200 rounded-lg p-4 bg-white max-h-48 overflow-y-auto prose-sm">
                    {pasteContent.split('\n').map((line, i) => {
                      const trimmed = line.trim();
                      if (!trimmed) return <div key={i} className="h-2" />;
                      if (trimmed.startsWith('### ')) return <h4 key={i} className="text-sm font-bold text-stone-800 mt-2 mb-1">{trimmed.slice(4)}</h4>;
                      if (trimmed.startsWith('## ')) return <h3 key={i} className="text-base font-bold text-stone-900 mt-3 mb-1">{trimmed.slice(3)}</h3>;
                      if (trimmed.startsWith('# ')) return <h2 key={i} className="text-lg font-bold text-stone-900 mt-3 mb-1">{trimmed.slice(2)}</h2>;
                      if (trimmed.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-stone-300 pl-3 text-stone-600 text-sm italic my-1">{trimmed.slice(2)}</blockquote>;
                      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return <div key={i} className="flex items-start gap-2 text-sm text-stone-700 my-0.5"><span className="text-stone-400 mt-0.5">•</span><span dangerouslySetInnerHTML={{ __html: trimmed.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code class="bg-stone-100 px-1 rounded text-xs font-mono">$1</code>') }} /></div>;
                      if (/^\d+\.\s/.test(trimmed)) return <div key={i} className="flex items-start gap-2 text-sm text-stone-700 my-0.5"><span className="text-stone-500 font-medium">{trimmed.match(/^(\d+)\./)?.[1]}.</span><span dangerouslySetInnerHTML={{ __html: trimmed.replace(/^\d+\.\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code class="bg-stone-100 px-1 rounded text-xs font-mono">$1</code>') }} /></div>;
                      if (trimmed.startsWith('```')) return <div key={i} className="bg-stone-100 rounded px-2 py-0.5 text-[10px] font-mono text-stone-500">{trimmed.slice(3) || 'code'}</div>;
                      return <p key={i} className="text-sm text-stone-700 my-0.5" dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code class="bg-stone-100 px-1 rounded text-xs font-mono">$1</code>') }} />;
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">{pasteContent.trim() ? `${pasteContent.split('\n').filter(l => l.trim()).length} ${lang === 'zh' ? '行' : 'lines'}` : ''}</span>
              <div className="flex items-center gap-3">
              <button onClick={() => setIsPasteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors">
                {lang === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={handlePasteSubmit}
                disabled={!pasteContent.trim()}
                className="px-5 py-2 text-sm font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {lang === 'zh' ? '添加到原始资料' : 'Add to Raw Data'}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raw Data List Modal */}
      {isRawDataModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsRawDataModalOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="px-6 py-4 flex items-center justify-between border-b border-stone-100 shrink-0">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-stone-500" />
                {lang === 'zh' ? '已上传的原始资料' : 'Uploaded Raw Data'}
                <span className="text-sm font-normal text-stone-400">({rawDataItems.length})</span>
              </h2>
              <button onClick={() => setIsRawDataModalOpen(false)} className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-900">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-stone-50/30 flex-1">
              {rawDataItems.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-sm text-stone-500 font-medium">{lang === 'zh' ? '暂无上传的文件' : 'No files uploaded yet'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rawDataItems.map(item => (
                    <div key={item.id} onClick={() => { setIsRawDataModalOpen(false); openRawDataInEditor(item); }} className="flex items-center justify-between p-4 rounded-xl border border-stone-200/60 bg-white hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.source === 'paste' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                          <FileText className={`w-5 h-5 ${item.source === 'paste' ? 'text-amber-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-semibold text-stone-800 truncate max-w-[400px]">{item.name}</h4>
                          <p className="text-xs text-stone-400 flex items-center gap-2 mt-1">
                            <span className="font-medium text-stone-500">{item.type}</span>
                            <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                            <span>{(item.size / 1024).toFixed(1)} KB</span>
                            <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                            <span>{new Date(item.uploadedAt).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setIsRawDataModalOpen(false); 
                            handleStartExtraction();
                          }}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors shadow-sm cursor-pointer"
                        >
                          {lang === 'zh' ? '开始提炼' : 'Extract'}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); fetch(`/api/rawdata?id=${item.id}`, { method: 'DELETE' }).catch(() => {}); setRawDataItems(prev => prev.filter(i => i.id !== item.id)); localStorage.removeItem(`mindx_raw_${item.id}`); }} className="p-1.5 rounded-md text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} lang={lang} />

      {/* Model Configuration Modal */}
      {isModelConfigOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsModelConfigOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" style={{ animation: 'slideUp 0.3s ease-out' }}>
            <div className="px-6 py-4 flex items-center justify-between border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base font-bold text-stone-900">{lang === 'zh' ? '萃取 Agent 模型配置' : 'Extraction Agent Config'}</h2>
              </div>
              <button onClick={() => setIsModelConfigOpen(false)} className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-900">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Model Selection */}
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">{lang === 'zh' ? '模型' : 'Model'}</label>
                <select
                  value={extractionModel}
                  onChange={e => setExtractionModel(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors bg-white appearance-none cursor-pointer"
                >
                  <optgroup label="Anthropic">
                    <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
                    <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                    <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
                  </optgroup>
                  <optgroup label="OpenAI">
                    <option value="gpt-5.4">GPT-5.4</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="o3-mini">o3-mini</option>
                  </optgroup>
                  <optgroup label="DeepSeek">
                    <option value="deepseek-chat">DeepSeek V3</option>
                    <option value="deepseek-reasoner">DeepSeek R1</option>
                  </optgroup>
                  <optgroup label={lang === 'zh' ? '国产模型' : 'Chinese Models'}>
                    <option value="qwen-max">Qwen Max</option>
                    <option value="glm-4-plus">GLM-4 Plus</option>
                    <option value="moonshot-v1-128k">Moonshot 128K</option>
                  </optgroup>
                </select>
              </div>

              {/* API Key */}
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">API Key</label>
                <input
                  type="password"
                  value={extractionApiKey}
                  onChange={e => setExtractionApiKey(e.target.value)}
                  placeholder={lang === 'zh' ? '输入模型对应的 API Key...' : 'Enter API key for the selected model...'}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors"
                />
                <p className="text-[10px] text-stone-400 mt-1">{lang === 'zh' ? 'API Key 仅存储在浏览器本地，不会上传到服务器' : 'API Key is stored locally in your browser only'}</p>
              </div>

              {/* Base URL (optional) */}
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">Base URL <span className="text-stone-400 font-normal">({lang === 'zh' ? '可选' : 'Optional'})</span></label>
                <input
                  type="text"
                  value={extractionBaseUrl}
                  onChange={e => setExtractionBaseUrl(e.target.value)}
                  placeholder={lang === 'zh' ? '自定义 API 端点，留空则使用官方默认' : 'Custom API endpoint, leave empty for official default'}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors"
                />
              </div>

              {/* Quick Tips */}
              <div className="bg-violet-50/60 rounded-lg p-3 border border-violet-100">
                <p className="text-[11px] text-violet-700 font-medium mb-1">{lang === 'zh' ? '💡 萃取 Agent 会执行以下任务：' : '💡 The Extraction Agent will:'}</p>
                <ul className="text-[11px] text-violet-600 space-y-0.5 list-disc pl-4">
                  <li>{lang === 'zh' ? '从原始文档中提取关键事实和实体' : 'Extract key facts and entities from raw docs'}</li>
                  <li>{lang === 'zh' ? '识别可操作的洞察和模式' : 'Identify actionable insights and patterns'}</li>
                  <li>{lang === 'zh' ? '生成结构化的知识图谱条目' : 'Generate structured knowledge graph entries'}</li>
                  <li>{lang === 'zh' ? '更新你的 Agent 记忆库' : 'Update your Agent\'s memory store'}</li>
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <button onClick={() => setIsModelConfigOpen(false)} className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors">
                {lang === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('mindx_extraction_model', extractionModel);
                  localStorage.setItem('mindx_extraction_apikey', extractionApiKey);
                  localStorage.setItem('mindx_extraction_baseurl', extractionBaseUrl);
                  setIsModelConfigOpen(false);
                }}
                className="px-5 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
              >
                {lang === 'zh' ? '保存配置' : 'Save Config'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Markdown Editor Modal */}
      {profileEditKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setProfileEditKey(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                {profileEditKey === 'whoami' ? (
                  <><User className="w-4 h-4 text-indigo-500" />{lang === 'zh' ? '编辑画像' : 'Edit Profile'}</>
                ) : (
                  <><Target className="w-4 h-4 text-orange-500" />{lang === 'zh' ? '编辑目标' : 'Edit Goal'}</>
                )}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProfileEditKey(null)}
                  className="text-xs text-stone-400 hover:text-stone-700 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  {lang === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    updateProfile(profileEditKey, profileEditDraft);
                    setProfileEditKey(null);
                  }}
                  className="text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 px-4 py-1.5 rounded-lg transition-colors"
                >
                  {lang === 'zh' ? '保存' : 'Save'}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <textarea
                autoFocus
                value={profileEditDraft}
                onChange={(e) => setProfileEditDraft(e.target.value)}
                placeholder={profileEditKey === 'whoami'
                  ? (lang === 'zh' ? '描述你的身份、角色、交互偏好...\n\n支持 Markdown 格式' : 'Describe your identity, role, preferences...\n\nSupports Markdown')
                  : (lang === 'zh' ? '描述你当前的核心目标...\n\n支持 Markdown 格式' : 'Describe your current goals...\n\nSupports Markdown')
                }
                className="w-full h-full min-h-[40vh] bg-transparent border-none focus:outline-none text-sm text-stone-800 leading-relaxed font-mono resize-none placeholder:text-stone-300"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Custom Node Markdown Editor Modal */}
      {nodeEditId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setNodeEditId(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-500" />{nodeEditTitle}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMemoryNodes(prev => prev.filter(n => n.id !== nodeEditId));
                    localStorage.removeItem(`mindx_raw_${nodeEditId}`);
                    setNodeEditId(null);
                  }}
                  className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  {lang === 'zh' ? '删除' : 'Delete'}
                </button>
                <button
                  onClick={() => setNodeEditId(null)}
                  className="text-xs text-stone-400 hover:text-stone-700 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  {lang === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem(`mindx_raw_${nodeEditId}`, nodeEditDraft);
                    setMemoryNodes(prev => prev.map(n => n.id === nodeEditId ? { ...n, content: nodeEditDraft, updatedAt: new Date().toISOString() } : n));
                    setNodeEditId(null);
                  }}
                  className="text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 px-4 py-1.5 rounded-lg transition-colors"
                >
                  {lang === 'zh' ? '保存' : 'Save'}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <textarea
                autoFocus
                value={nodeEditDraft}
                onChange={(e) => setNodeEditDraft(e.target.value)}
                placeholder={lang === 'zh' ? '输入记忆内容...\n\n支持 Markdown 格式' : 'Enter memory content...\n\nSupports Markdown'}
                className="w-full h-full min-h-[40vh] bg-transparent border-none focus:outline-none text-sm text-stone-800 leading-relaxed font-mono resize-none placeholder:text-stone-300"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Extraction File Picker Modal */}
      {showExtractionFilePicker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowExtractionFilePicker(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                {lang === 'zh' ? '选择要提取的文件' : 'Select Files to Extract'}
              </h2>
              <button onClick={() => setShowExtractionFilePicker(false)} className="p-1 rounded-md text-stone-400 hover:text-stone-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto px-6 py-3">
              {/* Select all */}
              <label className="flex items-center gap-3 py-2 border-b border-stone-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedExtractionFileIds.size === rawDataItems.length}
                  onChange={(e) => setSelectedExtractionFileIds(e.target.checked ? new Set(rawDataItems.map(i => i.id)) : new Set())}
                  className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-stone-700">{lang === 'zh' ? '全选' : 'Select All'}</span>
                <span className="text-[10px] text-stone-400 ml-auto">{selectedExtractionFileIds.size}/{rawDataItems.length}</span>
              </label>
              {rawDataItems.map(item => (
                <label key={item.id} className="flex items-center gap-3 py-2.5 border-b border-stone-50 cursor-pointer hover:bg-stone-50/50 rounded-lg px-1 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedExtractionFileIds.has(item.id)}
                    onChange={(e) => {
                      const next = new Set(selectedExtractionFileIds);
                      e.target.checked ? next.add(item.id) : next.delete(item.id);
                      setSelectedExtractionFileIds(next);
                    }}
                    className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-stone-700 truncate">{item.name}</div>
                    <div className="text-[10px] text-stone-400">{item.type}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-stone-100">
              <button
                onClick={() => handleStartExtraction()}
                disabled={selectedExtractionFileIds.size === 0}
                className={`w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-xl transition-all ${
                  selectedExtractionFileIds.size === 0
                    ? 'bg-stone-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {lang === 'zh' ? `开始提取 (${selectedExtractionFileIds.size} 个文件)` : `Start Extraction (${selectedExtractionFileIds.size} files)`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function PricingModal({ isOpen, onClose, lang }: { isOpen: boolean, onClose: () => void, lang: string }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden transform transition-all" style={{ animation: 'slideUp 0.3s ease-out' }}>
        <div className="px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between border-b border-stone-100 bg-white relative z-10">
          <h2 className="text-xl font-bold text-stone-900">{lang === 'zh' ? '升级您的工作空间' : 'Upgrade your workspace'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-900"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-6 bg-stone-50/50">
          {/* Free */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-semibold text-stone-800 mb-2">{lang === 'zh' ? '免费版' : 'Free'}</h3>
            <p className="text-sm text-stone-500 mb-6 flex-none">{lang === 'zh' ? '体验下一代 Agent-Native 第二大脑' : 'Experience the next-gen Agent-Native brain'}</p>
            <div className="text-4xl font-bold text-stone-900 mb-8">$0<span className="text-base font-normal text-stone-500 ml-1">/ mo</span></div>
            <button className="w-full py-3 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 mb-8 transition-colors">
              {lang === 'zh' ? '当前计划' : 'Current Plan'}
            </button>
            <ul className="space-y-4 text-sm text-stone-600 flex-1">
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> 基础文档检索与问答</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> 基础通用大模型支持</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> <span className="font-bold text-stone-900">2个自定义 Agent</span></li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-stone-300 shrink-0" /> <span className="text-stone-400 line-through">自动信息提炼与洞察</span></li>
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-white border-2 border-stone-900 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden transform md:scale-105 z-10 flex flex-col ring-4 ring-stone-900/5">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"></div>
            <div className="absolute top-5 right-5 bg-stone-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">{lang === 'zh' ? '爆款' : 'Popular'}</div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-stone-900">{lang === 'zh' ? '专业版' : 'Pro'}</h3>
              <Zap className="w-5 h-5 text-orange-500 fill-current" />
            </div>
            <p className="text-sm text-stone-500 mb-6 flex-none">{lang === 'zh' ? '解锁完整的无缝深度洞察能力' : 'Unlock full deep insight capabilities'}</p>
            <div className="text-4xl font-bold text-stone-900 mb-8">$20<span className="text-base font-normal text-stone-500 ml-1">/ mo</span></div>
            <button className="w-full py-3 rounded-xl border border-transparent text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 mb-8 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group/btn">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
              {lang === 'zh' ? '立即升级 (Subscribe)' : 'Upgrade to Pro'}
            </button>
            <ul className="space-y-4 text-sm text-stone-700 font-medium flex-1">
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-600 shrink-0" /> 无底线使用上下文提炼引擎</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-600 shrink-0" /> 无限制的高级自定义 Agent</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-600 shrink-0" /> 优先解锁第三方应用连接</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-600 shrink-0" /> 允许将 Agent 分享至微信小程序与外部网络群体</li>
            </ul>
          </div>

          {/* Team */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-semibold text-stone-800 mb-2">{lang === 'zh' ? '团队版' : 'Team'}</h3>
            <p className="text-sm text-stone-500 mb-6 flex-none">{lang === 'zh' ? '为企业组织打造的全能知识引擎' : 'The all-in-one engine for orgs'}</p>
            <div className="text-4xl font-bold text-stone-900 mb-8">$30<span className="text-base font-normal text-stone-500 ml-1">/ user</span></div>
            <button className="w-full py-3 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50 mb-8 transition-colors">
              {lang === 'zh' ? '联系销售' : 'Contact Sales'}
            </button>
            <ul className="space-y-4 text-sm text-stone-600 flex-1">
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> Pro 版所包含的一切权限</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> 空间无缝协同共享与严格权限控制</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> 企业级用量池与保障额度</li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0" /> 企业数据隔离与专属化定制 SSO</li>
            </ul>
          </div>
        </div>
        <div className="p-4 bg-stone-100/50 text-center text-[11px] text-stone-400 border-t border-stone-100">
          {lang === 'zh' ? '标价均支持年付 8 折优惠。所有的计划升级支持随时取消。' : 'Prices reflect annual billing. Cancel anytime.'}
        </div>
      </div>
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
  creatorName: string;
  creatorType: 'human' | 'agent';
  isNew?: boolean;
  onDelete: (id: string) => void;
  onMarkRead?: (id: string) => void;
  onSetAgentPermission?: (id: string) => void;
  onUpgradeRequirement?: () => void;
}

function DocRow({ docId, name, type, date, creatorName, creatorType, isNew, onDelete, onMarkRead, onSetAgentPermission, onUpgradeRequirement }: DocRowProps) {
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
    <tr className={`transition-colors group cursor-pointer ${isNew ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-stone-50'}`} onClick={() => { if (isNew) onMarkRead?.(docId); navigate(`/document?type=${type.toLowerCase().replace(' ', '')}`); }}>
      <td className="px-6 py-3 max-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center justify-center w-2 mr-1 shrink-0">
            {isNew && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            )}
          </span>
          <span className="shrink-0">{getDocIcon()}</span>
          <span className="font-medium text-stone-800 truncate">{name}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-stone-500 min-w-0">
          <span className="shrink-0">
            {creatorType === 'agent' ? (
              getAgentAvatar(creatorName, 18)
            ) : (
              getUserAvatar(18)
            )}
          </span>
          <span className="text-sm truncate">{creatorName}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-stone-500 text-sm whitespace-nowrap">{formatDate(date)}</td>
      <td className="px-3 py-3 text-right">
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
                    onSetAgentPermission?.(docId); 
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Shield className="w-4 h-4 text-stone-400" />
                  Agent权限设置
                </button>
                <div className="border-t border-stone-100 my-0.5" />
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setIsMenuOpen(false); 
                    onUpgradeRequirement?.(); 
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-stone-400 group-hover:text-blue-500 transition-colors" />
                    Convert
                  </div>
                  <span className="text-[9px] font-bold bg-stone-900 text-white px-1 py-0.5 rounded leading-none shadow-sm shadow-stone-900/10">PRO</span>
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
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const groupActivitiesByDate = (activities: Activity[]) => {
    const groups: Record<string, Activity[]> = {};
    const orderedKeys: string[] = [];
    const sorted = [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const now = new Date();
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const yesterdayUTC = todayUTC - 86400000;
    
    sorted.forEach(activity => {
      const date = new Date(activity.timestamp);
      const activityDayUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      
      let key = '';
      if (activityDayUTC === todayUTC) {
        key = isZh ? '今天' : 'Today';
      } else if (activityDayUTC === yesterdayUTC) {
        key = isZh ? '昨天' : 'Yesterday';
      } else {
        // 所有更早的日期都按天显示：周几 + 月/日
        const utcDay = date.getUTCDay();
        const utcMonth = date.getUTCMonth();
        const utcDate = date.getUTCDate();
        if (isZh) {
          const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
          key = `${weekdays[utcDay]}  ${utcMonth + 1}/${utcDate}`;
        } else {
          const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          key = `${weekdays[utcDay]}, ${months[utcMonth]} ${utcDate}`;
        }
      }
      
      if (!groups[key]) {
        groups[key] = [];
        orderedKeys.push(key);
      }
      groups[key].push(activity);
    });
    return { groups, orderedKeys };
  };

  const { groups: grouped, orderedKeys } = groupActivitiesByDate(activities);

  return (
    <div className="space-y-8 pb-12">
      {orderedKeys.map(key => (
        <div key={key} className="space-y-4">
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2">{key}</h3>
          <div className="space-y-1">
            {grouped[key].map(activity => (
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
                    {' '}{isZh ? activity.actionZh : activity.action}{' '}
                    <button
                      onClick={() => navigate(`/document?type=${activity.targetType.toLowerCase().replace(' ', '')}`)}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {activity.targetName}
                    </button>
                    {((isZh ? activity.detailsZh : activity.details)) && (
                      <span className="text-stone-400 italic"> — {isZh ? activity.detailsZh : activity.details}</span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.timestamp).toLocaleTimeString(isZh ? 'zh-CN' : [], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                    </p>
                    <span className="text-[10px] text-stone-300">•</span>
                    <p className="text-[10px] text-stone-400 font-medium">
                      {new Date(activity.timestamp).toLocaleDateString(isZh ? 'zh-CN' : [], { month: 'short', day: 'numeric', timeZone: 'UTC' })}
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

interface AbsenceSummaryCardProps {
  data: AbsenceSummaryData;
  onDocClick: (docId: string, docType: string) => void;
  onDismiss: () => void;
  onViewAll: () => void;
}

function AbsenceSummaryCard({ data, onDocClick, onDismiss, onViewAll }: AbsenceSummaryCardProps) {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  if (data.changes.length === 0) return null;

  const now = new Date();

  // --- Aggregate counts by action ---
  const counts: Record<string, number> = {};
  data.changes.forEach(c => { counts[c.action] = (counts[c.action] || 0) + 1; });

  // --- Relative time helper ---
  const relativeTime = (ts: string) => {
    const d = new Date(ts);
    const ms = now.getTime() - d.getTime();
    const mins = Math.floor(ms / (1000 * 60));
    const hrs = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    if (mins < 1) return isZh ? '刚刚' : 'Just now';
    if (mins < 60) return isZh ? `${mins} 分钟前` : `${mins}m ago`;
    if (hrs < 24) return isZh ? `${hrs} 小时前` : `${hrs}h ago`;
    if (days === 1) return isZh ? '昨天' : 'Yesterday';
    return isZh ? `${days} 天前` : `${days}d ago`;
  };

  const actionText = (action: string, title: string) => {
    if (isZh) {
      const verb = action === 'created' ? '新建了' : action === 'modified' ? '修改了' : '评论了';
      return (<>{verb}《<span className="font-medium text-stone-800">{title}</span>》</>);
    }
    const verb = action === 'created' ? 'created' : action === 'modified' ? 'updated' : 'commented on';
    return (<>{verb} <span className="font-medium text-stone-800">{title}</span></>);
  };

  const visibleChanges = data.changes.slice(0, 3);

  return (
    <div className="border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-5 overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Header: numeric summary + view-all + close */}
      <div className="flex items-center px-5 pt-4 pb-3">
        <div className="text-sm ml-[12px]">
          {isZh ? (
            <>
              <span className="text-stone-500">你离开期间，Agents{' '}</span>
              {[
                counts.created ? <span key="c">新建 <span className="font-semibold text-stone-800">{counts.created}</span> 篇</span> : null,
                counts.modified ? <span key="m">更新 <span className="font-semibold text-stone-800">{counts.modified}</span> 篇</span> : null,
                counts.commented ? <span key="cm">评论 <span className="font-semibold text-stone-800">{counts.commented}</span> 篇</span> : null,
              ].filter(Boolean).map((item, i, arr) => (
                <span key={i} className="text-stone-600">
                  {item}{i < arr.length - 1 ? '、' : ''}
                </span>
              ))}
              <span className="text-stone-500">文档</span>
            </>
          ) : (
            <>
              <span className="text-stone-500">While you were away, Agents{' '}</span>
              {[
                counts.created ? <span key="c">created <span className="font-semibold text-stone-800">{counts.created}</span></span> : null,
                counts.modified ? <span key="m">updated <span className="font-semibold text-stone-800">{counts.modified}</span></span> : null,
                counts.commented ? <span key="cm">commented on <span className="font-semibold text-stone-800">{counts.commented}</span></span> : null,
              ].filter(Boolean).map((item, i, arr) => (
                <span key={i} className="text-stone-600">
                  {item}{i < arr.length - 1 ? ', ' : ''}
                </span>
              ))}
              <span className="text-stone-500"> {counts.created || counts.modified || counts.commented ? (((counts.created || 0) + (counts.modified || 0) + (counts.commented || 0)) === 1 ? 'doc' : 'docs') : 'docs'}</span>
            </>
          )}
        </div>

        <div className="flex-1" />

        <button
          onClick={(e) => { e.stopPropagation(); onViewAll(); }}
          className="shrink-0 text-xs text-stone-500 hover:text-stone-700 font-medium mr-2 transition-colors"
        >
          {isZh ? '查看全部' : 'View all'}
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          className="shrink-0 p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 transition-colors"
          title={isZh ? '关闭' : 'Dismiss'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Change list — always show first 3 */}
      <div>
        <ul className="px-5 pb-3 space-y-0.5">
          {visibleChanges.map((change) => (
            <li
              key={change.id}
              onClick={() => onDocClick(change.id, change.docType)}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/70 transition-colors"
            >
              {/* Agent avatar — same as doc list */}
              <div className="shrink-0 mt-0.5">
                {getAgentAvatar(change.agentName, 24)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm text-stone-600 leading-snug">
                    <span className="font-medium text-stone-700">{change.agentName}</span>
                    {' '}{actionText(change.action, change.docTitle)}
                  </p>
                  {/* Time */}
                  <span className="text-xs text-stone-400 shrink-0 whitespace-nowrap">{relativeTime(change.timestamp)}</span>
                </div>
                {change.changeDescription && (
                  <p className="text-xs text-stone-400 mt-1 leading-snug truncate">{change.changeDescription}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
