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
  Zap,
  CalendarDays,
  EyeOff,
  Timer,
  Bookmark,
  Brain
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
  const [docSceneFilter, setDocSceneFilter] = useState<'all' | 'today' | 'unread' | 'scheduled' | 'webclip' | 'memory'>('all');
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isOwnerFilterOpen, setIsOwnerFilterOpen] = useState(false);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [agentListMenuOpen, setAgentListMenuOpen] = useState<string | null>(null);
  const [activityFilterOwner, setActivityFilterOwner] = useState<string>('all');
  const [absenceSummaryDismissed, setAbsenceSummaryDismissed] = useState(false);

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
    setDocSceneFilter('all');
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
      creatorType: 'human',
      size: 0,
      isRead: true,
      source: 'normal'
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
            {activeTab === 'agents' && (
            <div className="relative">
              <button 
                onClick={() => {
                  setIsCreatingAgent(true);
                }}
                className="flex items-center gap-1.5 bg-stone-900 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> 
                {t('agent.newAgent')}

              </button>
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
                {/* Absence Summary Card */}
                {!absenceSummaryDismissed && (
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
                  <table className="w-full table-fixed text-left text-sm">
                    <thead className="bg-stone-50/50 text-stone-500 border-b border-stone-200/80 rounded-t-xl [&>tr>th:first-child]:rounded-tl-xl [&>tr>th:last-child]:rounded-tr-xl">
                      <tr>
                        {/* Name column with Type filter */}
                        <th className="px-6 py-3 font-medium bg-stone-50/50 w-[50%]">
                          <div className="relative inline-flex items-center ml-5">
                            <button
                              onClick={() => { setIsTypeFilterOpen(!isTypeFilterOpen); setIsSortMenuOpen(false); setIsOwnerFilterOpen(false); }}
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

                        {/* Owner column with Owner filter */}
                        <th className="px-6 py-3 font-medium w-[22%]">
                          <div className="relative inline-flex items-center">
                            <button
                              onClick={() => { setIsOwnerFilterOpen(!isOwnerFilterOpen); setIsTypeFilterOpen(false); setIsSortMenuOpen(false); }}
                              className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${docFilterOwner !== 'all' ? 'text-stone-900' : ''}`}
                            >
                              {t('docs.owner')}
                              <ChevronDown className={`w-3 h-3 transition-transform ${isOwnerFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isOwnerFilterOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsOwnerFilterOpen(false)} />
                                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1 max-h-64 overflow-y-auto">
                                  <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">{lang === 'zh' ? '按创建者筛选' : 'Filter by owner'}</div>
                                  <button
                                    onClick={() => { setDocFilterOwner('all'); setIsOwnerFilterOpen(false); }}
                                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docFilterOwner === 'all' ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                  >
                                    <Users className="w-3.5 h-3.5 text-stone-400" />
                                    {lang === 'zh' ? '全部创建者' : 'All owners'}
                                  </button>
                                  {docOwners.map(owner => {
                                    const ownerDoc = workspaceDocs.find(d => d.creatorName === owner);
                                    return (
                                      <button
                                        key={owner}
                                        onClick={() => { setDocFilterOwner(owner); setIsOwnerFilterOpen(false); }}
                                        className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docFilterOwner === owner ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                                      >
                                        {ownerDoc?.creatorType === 'agent' 
                                          ? getAgentAvatar(owner, 14)
                                          : getUserAvatar(14)}
                                        {owner}
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        </th>


                        {/* Date column with Sort toggle */}
                        <th className="px-6 py-3 font-medium whitespace-nowrap w-[20%]">
                          <div className="relative inline-flex items-center">
                            <button
                              onClick={() => { setIsSortMenuOpen(!isSortMenuOpen); setIsTypeFilterOpen(false); setIsOwnerFilterOpen(false); }}
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

                        <th className="px-6 py-3 font-medium text-right w-[8%]"></th>
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
                                  onClick={() => { setDocFilterType('all'); setDocFilterOwner('all'); setDocSceneFilter('all'); }}
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
                                    {' '}{lang === 'zh' ? activity.actionZh : activity.action}{' '}
                                    <button
                                      onClick={(e) => { e.stopPropagation(); navigate(`/document?type=${activity.targetType.toLowerCase().replace(' ', '')}`); }}
                                      className="font-medium text-stone-900 hover:underline"
                                    >
                                      {activity.targetName}
                                    </button>
                                    {((lang === 'zh' ? activity.detailsZh : activity.details)) && (
                                      <span className="text-stone-400 italic"> — {lang === 'zh' ? activity.detailsZh : activity.details}</span>
                                    )}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <p className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                                      <Clock className="w-3 h-3" />
                                      {new Date(activity.timestamp).toLocaleTimeString(lang === 'zh' ? 'zh-CN' : [], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <span className="text-[10px] text-stone-300">•</span>
                                    <p className="text-[10px] text-stone-400 font-medium">
                                      {new Date(activity.timestamp).toLocaleDateString(lang === 'zh' ? 'zh-CN' : [], { month: 'short', day: 'numeric', year: 'numeric' })}
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
                        <div className="p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getAgentAvatar(agent.name, 28)}
                              <div>
                                <h2 className="text-base font-semibold text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">{agent.name}</h2>
                                <p className="text-xs text-stone-500 font-medium mt-0.5">{t('agent.globalAccount')}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                                <ActivityIcon className="w-3.5 h-3.5" />
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
                className="space-y-8"
              >
                {/* Skill Card */}
                <div className="border border-stone-200/80 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
                  {/* Card Header + Capabilities merged */}
                  <div className="p-6 pb-5">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-sm shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-stone-900 tracking-tight">MindX Docs</h3>
                          <span className="text-[10px] font-bold text-stone-500 uppercase bg-stone-100 px-1.5 py-0.5 rounded">Core</span>
                        </div>
                        <p className="text-xs text-stone-400 font-medium">{lang === 'zh' ? '提供方' : 'by'} MindX</p>
                      </div>
                    </div>
                    <p className="text-sm text-stone-500 leading-relaxed mb-4">
                      {lang === 'zh' 
                        ? '让你的 AI Agent 拥有完整的文档创作能力。支持 Markdown/Word/Excel/PPT 的创建、阅读、编辑。'
                        : 'Give your AI agents full document creation capabilities. Create, read and edit Markdown, Word, Excel and PPT files.'
                      }
                    </p>
                    <div className="grid md:grid-cols-2 gap-1.5">
                      {(lang === 'zh' 
                        ? ['基于对话意图创建 Markdown/Word/Excel/PPT 文档', '编辑 Markdown/Word/Excel/PPT 文档', '读取和解析 Office 文档', 'AI Agent 内容保存至 MindX']
                        : ['Create Markdown/Word/Excel/PPT based on conversation intent', 'Edit Markdown/Word/Excel/PPT documents', 'Read & parse Office documents', 'Save AI Agent content to MindX']
                      ).map((cap, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-stone-600">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {cap}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-stone-100">
                    <div className="p-6 space-y-6">

                      {/* Step 1: Install Command */}
                      <div className="relative pl-10">
                        {/* Timeline line + arrow */}
                        <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0">
                          <div className="flex-1 border-l border-dashed border-stone-300" />
                          <svg className="w-2.5 h-2.5 text-stone-300 shrink-0" viewBox="0 0 10 10" fill="none"><path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-0 w-6 h-6 rounded-md bg-stone-900 flex items-center justify-center text-white text-[10px] font-bold">1</div>
                        <h4 className="text-sm font-bold text-stone-800 mb-2">
                          {lang === 'zh' ? '安装命令' : 'Install Command'}
                        </h4>
                        <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                          💡 {lang === 'zh' 
                            ? '点击复制按钮，粘贴到你的 Agent 中回车即可。剩下的全部交给 MindX！'
                            : 'Click copy, paste into your Agent and hit Enter. MindX handles the rest!'
                          }
                        </p>
                        <div className="relative">
                          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 pr-24 text-sm font-mono text-stone-700 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                            {`Download the zip package from https://cdn.addon.tencentsuite.com/static/tencent-docs.zip and unzip it, help me install this skill, and then set the environment variable Mindx.space_token="xxxxxxxxx".`}
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`Download the zip package from https://cdn.addon.tencentsuite.com/static/tencent-docs.zip and unzip it, help me install this skill, and then set the environment variable Mindx.space_token="xxxxxxxxx".`);
                              setCopiedStates(prev => ({ ...prev, skillInstall: true }));
                              setTimeout(() => setCopiedStates(prev => ({ ...prev, skillInstall: false })), 2000);
                            }}
                            className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm"
                          >
                            {copiedStates['skillInstall'] ? <><Check className="w-3.5 h-3.5" />{lang === 'zh' ? '已复制' : 'Copied'}</> : <><Copy className="w-3.5 h-3.5" />{lang === 'zh' ? '复制' : 'Copy'}</>}
                          </button>
                        </div>
                      </div>

                      {/* Step 2: Agent auto-complete */}
                      <div className="relative pl-10">
                        {/* Timeline line + arrow */}
                        <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0">
                          <div className="flex-1 border-l border-dashed border-stone-300" />
                          <svg className="w-2.5 h-2.5 text-stone-300 -mt-px" viewBox="0 0 10 10" fill="none"><path d="M1 3L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-0 w-6 h-6 rounded-md bg-stone-900 flex items-center justify-center text-white text-[10px] font-bold">2</div>
                        <h4 className="text-sm font-bold text-stone-800 mb-2">
                          {lang === 'zh' ? 'Agent 自动完成安装' : 'Agent Auto-completes Installation'}
                        </h4>
                        <p className="text-xs text-stone-500 leading-relaxed">
                          {lang === 'zh' ? '💡 Agent 接到指令后，将自动完成：下载 Skill 压缩包 → 解压到本地 → 注册安装 → 配置 Token。' : '💡 After receiving the command, Agent will automatically: download Skill package → extract locally → register & install → configure Token.'}
                        </p>
                      </div>

                      {/* Step 3: Use Skill */}
                      <div className="relative pl-10">
                        {/* Timeline dot (no line after) */}
                        <div className="absolute left-0 top-0 w-6 h-6 rounded-md bg-stone-900 flex items-center justify-center text-white text-[10px] font-bold">3</div>
                        <h4 className="text-sm font-bold text-stone-800 mb-2">
                          {lang === 'zh' ? '使用 Skill' : 'Use Skill'}
                        </h4>
                        <p className="text-xs text-stone-500 leading-relaxed mb-3">
                          💡 {lang === 'zh' ? '安装成功，你可以开始使用 MindX 强大的 Skill 了。' : 'Installation complete. You can start using MindX powerful Skills now.'}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                            <span className="text-xs font-bold text-stone-800 shrink-0">{lang === 'zh' ? '斜杠命令' : 'Slash Command'}</span>
                            <span className="text-xs text-stone-500">—</span>
                            <span className="text-xs text-stone-600 leading-relaxed">{lang === 'zh' ? '在聊天中输入 /技能名（如 /mindx doc）直接触发' : 'Type /skill-name (e.g. /mindx doc) in chat to trigger directly'}</span>
                          </div>
                          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                            <span className="text-xs font-bold text-stone-800 shrink-0">{lang === 'zh' ? '自动调用' : 'Auto Invoke'}</span>
                            <span className="text-xs text-stone-500">—</span>
                            <span className="text-xs text-stone-600 leading-relaxed">{lang === 'zh' ? 'Agent 根据对话上下文自动判断该用哪个 Skill，你不需要手动指定' : 'Agent automatically determines which Skill to use based on conversation context'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Optional steps — dimmed, side by side */}
                      <div className="grid md:grid-cols-2 gap-3">
                        {/* Step 4: Version Update */}
                        <div className="bg-stone-50/40 border border-stone-200/40 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-5 h-5 rounded bg-stone-300 flex items-center justify-center text-white shrink-0">
                              <Package className="w-3 h-3" />
                            </div>
                            <p className="text-xs font-semibold text-stone-400">
                              {lang === 'zh' ? 'Skill 版本更新' : 'Skill Version Update'}
                            </p>
                            <span className="text-[9px] font-medium text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">{lang === 'zh' ? '可选' : 'Optional'}</span>
                          </div>
                          <p className="text-xs text-stone-400 leading-relaxed mb-2">
                            {lang === 'zh' 
                              ? '一键复制指令到 Agent，即可升级到最新版本。'
                              : 'Copy command to Agent to upgrade to latest.'
                            }
                          </p>
                          <div className="relative group/upgrade">
                            <div className="bg-stone-100/80 rounded-lg px-3 py-1.5 text-[11px] font-mono text-stone-500 pr-8 truncate">
                              {lang === 'zh' ? '帮我把 MindX 的 Skill 升级到最新版本' : 'Help me upgrade the MindX Skill to the latest version'}
                            </div>
                            <button
                              onClick={() => {
                                const cmd = lang === 'zh' ? '帮我把 MindX 的 Skill 升级到最新版本' : 'Help me upgrade the MindX Skill to the latest version';
                                navigator.clipboard.writeText(cmd);
                                setCopiedStates(prev => ({ ...prev, skillUpgrade: true }));
                                setTimeout(() => setCopiedStates(prev => ({ ...prev, skillUpgrade: false })), 2000);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-all"
                            >
                              {copiedStates['skillUpgrade'] ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Step 5: Token Leak */}
                        <div className="bg-stone-50/40 border border-stone-200/40 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-5 h-5 rounded bg-stone-300 flex items-center justify-center text-white shrink-0">
                              <Shield className="w-3 h-3" />
                            </div>
                            <p className="text-xs font-semibold text-stone-400">
                              {lang === 'zh' ? 'Token 泄露处理' : 'Token Leak Handling'}
                            </p>
                            <span className="text-[9px] font-medium text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">{lang === 'zh' ? '若有' : 'If needed'}</span>
                          </div>
                          <p className="text-xs text-stone-400 leading-relaxed mt-1 mb-2.5">
                            {lang === 'zh' ? '如果你的 Token 需要调整，可以点击下面两个操作。' : 'If your Token needs adjustment, use the actions below.'}
                          </p>
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors">
                              <Copy className="w-3 h-3" />
                              {lang === 'zh' ? '复制 Token' : 'Copy Token'}
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors">
                              <Shield className="w-3 h-3" />
                              {lang === 'zh' ? '重置 Token' : 'Reset Token'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
  onSetLabel?: (id: string) => void;
  onSetAgentPermission?: (id: string) => void;
}

function DocRow({ docId, name, type, date, creatorName, creatorType, isNew, onDelete, onMarkRead, onSetLabel, onSetAgentPermission }: DocRowProps) {
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
    <tr className={`transition-colors group cursor-pointer ${isNew ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-stone-50'}`} onClick={() => navigate(`/document?type=${type.toLowerCase().replace(' ', '')}`)}>
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
      <td className="px-6 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2 text-stone-500">
          {creatorType === 'agent' ? (
            getAgentAvatar(creatorName, 18)
          ) : (
            getUserAvatar(18)
          )}
          <span className="text-sm truncate">{creatorName}</span>
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
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const groupActivitiesByDate = (activities: Activity[]) => {
    const groups: Record<string, Activity[]> = {};
    const orderedKeys: string[] = [];
    const sorted = [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const now = new Date();
    // Use UTC-based date calculations to match the UTC timestamps in the data
    const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const yesterdayUTC = todayUTC - 86400000; // 1 day in ms

    // Calculate start of this week (Monday) in UTC
    const nowDayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon, ...
    const diffToMonday = nowDayOfWeek === 0 ? 6 : nowDayOfWeek - 1;
    const startOfWeekUTC = todayUTC - diffToMonday * 86400000;

    // Start of last week (Monday) in UTC
    const startOfLastWeekUTC = startOfWeekUTC - 7 * 86400000;
    
    sorted.forEach(activity => {
      const date = new Date(activity.timestamp);
      const activityDayUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      
      let key = '';
      if (activityDayUTC === todayUTC) {
        key = isZh ? '今天' : 'Today';
      } else if (activityDayUTC === yesterdayUTC) {
        key = isZh ? '昨天' : 'Yesterday';
      } else if (activityDayUTC >= startOfWeekUTC) {
        // This week but before yesterday — show weekday + date
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
      } else if (activityDayUTC >= startOfLastWeekUTC) {
        key = isZh ? '上周' : 'Last Week';
      } else {
        const utcYear = date.getUTCFullYear();
        const utcMonth = date.getUTCMonth();
        if (isZh) {
          key = `${utcYear} 年 ${utcMonth + 1} 月`;
        } else {
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          key = `${months[utcMonth]} ${utcYear}`;
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
          <p className="text-stone-400 text-sm">{isZh ? '暂无近期动态' : 'No recent activity yet'}</p>
        </div>
      )}
    </div>
  );
}
