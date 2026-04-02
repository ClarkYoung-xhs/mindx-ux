import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus, Search, X, Edit3, Eye, Trash2, RotateCcw,
  ArrowUpRight, ChevronRight, AlertCircle, Fingerprint,
  Compass, Target, Heart, Hash, FileText, Bot,
  Clock, Filter, CheckCircle2, XCircle, MoreHorizontal,
  HelpCircle
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
interface LifeLayerCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  confidence: number; // 1-5
  updatedAt: string;
}

interface PatternMemory {
  id: string;
  layer: 'pattern';
  category: string;
  content: string;
  confidence: number;
  source: string;
  updatedAt: string;
  pendingConfirm?: boolean;
}

interface EpisodeMemory {
  id: string;
  layer: 'episode';
  category: string;
  content: string;
  date: string;
  source: string;
  expired: boolean;
  pendingConfirm: boolean;
}

type MemoryEntry = PatternMemory | EpisodeMemory;

interface AgentCallRecord {
  id: string;
  agentName: string;
  time: string;
  status: 'success' | 'info';
}

// ─── Mock Data ───────────────────────────────────────────────
const mockLifeCards: LifeLayerCard[] = [
  {
    id: 'identity',
    title: '身份',
    icon: <Fingerprint className="w-4 h-4 text-violet-500" />,
    content: (
      <p className="text-[13px] text-stone-600 leading-relaxed">
        前沿科技创业者，独立产品经理。专注于 AI-Native 产品设计与用户体验创新，关注 LLM 应用、Agent 架构与人机交互前沿。
      </p>
    ),
    confidence: 5,
    updatedAt: '3天前',
  },
  {
    id: 'values',
    title: '三观',
    icon: <Compass className="w-4 h-4 text-violet-500" />,
    content: (
      <div className="space-y-2">
        <div>
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">世界观</span>
          <p className="text-[13px] text-stone-600 leading-relaxed">技术是推动社会进步的核心力量</p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">人生观</span>
          <p className="text-[13px] text-stone-600 leading-relaxed">追求有意义的创造，拒绝无效内卷</p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">价值观</span>
          <p className="text-[13px] text-stone-600 leading-relaxed">第一性原理思考，极简主义行事</p>
        </div>
      </div>
    ),
    confidence: 4,
    updatedAt: '1周前',
  },
  {
    id: 'goals',
    title: '长期目标',
    icon: <Target className="w-4 h-4 text-violet-500" />,
    content: (
      <p className="text-[13px] text-stone-600 leading-relaxed">
        构建一款真正理解用户的 Agent-Native 产品，让每个人都拥有贴身的 AI 伙伴，在 2 年内达到百万级用户规模。
      </p>
    ),
    confidence: 4,
    updatedAt: '2周前',
  },
  {
    id: 'interests',
    title: '兴趣与专长',
    icon: <Heart className="w-4 h-4 text-violet-500" />,
    content: (
      <div className="flex flex-wrap gap-2">
        {['AI/LLM', '产品设计', '极简主义', '认知科学', '开源社区'].map(tag => (
          <span key={tag} className="px-2.5 py-1 bg-violet-50 text-violet-600 text-xs font-medium rounded-full">
            {tag}
          </span>
        ))}
      </div>
    ),
    confidence: 5,
    updatedAt: '5天前',
  },
];

// ── 我的模式（Pattern Memories）──
const patternMemories: PatternMemory[] = [
  {
    id: 'p-001', layer: 'pattern', category: '工作风格',
    content: '面对模糊需求时倾向于先自己设定约束边界再开始工作，而不是等待需求被完全澄清',
    confidence: 5, source: '多次行为归纳', updatedAt: '3 天前',
  },
  {
    id: 'p-002', layer: 'pattern', category: '工作风格',
    content: '写文档时习惯先搭框架再填内容，不喜欢在结构未定时就开始写正文',
    confidence: 5, source: '多次行为归纳', updatedAt: '1 周前',
  },
  {
    id: 'p-003', layer: 'pattern', category: '工作风格',
    content: '在做 PRD 时偏好用对话记录和会议纪要作为输入，再由 AI 辅助提炼，而不是从零开始写',
    confidence: 4, source: '会议纪要 · 03-28', updatedAt: '5 天前',
  },
  {
    id: 'p-004', layer: 'pattern', category: '决策风格',
    content: '做优先级判断时依赖数据支撑，但定方向时更相信直觉和用户访谈的定性反馈',
    confidence: 4, source: '多次对话归纳', updatedAt: '5 天前',
  },
  {
    id: 'p-005', layer: 'pattern', category: '决策风格',
    content: '倾向于在信息不完整时也推进决策，而不是等待更多数据——认为快速试错比慢速论证更有效',
    confidence: 3, source: '对话记录 · 03-30', updatedAt: '3 天前', pendingConfirm: true,
  },
  {
    id: 'p-006', layer: 'pattern', category: '偏好',
    content: '偏好结构简洁、层级不超过两级的文档，不喜欢过度嵌套的目录结构',
    confidence: 5, source: '多次行为归纳', updatedAt: '2 周前',
  },
  {
    id: 'p-007', layer: 'pattern', category: '偏好',
    content: '对 AI 输出的内容倾向于先审阅再使用，很少直接接受未经修改的生成结果',
    confidence: 4, source: '多次行为归纳', updatedAt: '1 周前',
  },
  {
    id: 'p-008', layer: 'pattern', category: '偏好',
    content: '在讨论产品方案时偏好先对齐问题定义，而不是直接进入解决方案讨论',
    confidence: 4, source: '会议纪要 · 04-01', updatedAt: '2 天前',
  },
  {
    id: 'p-009', layer: 'pattern', category: '习惯',
    content: '复杂的思考倾向于通过和 AI 对话来梳理，而不是独自写思维导图或笔记',
    confidence: 5, source: '多次行为归纳', updatedAt: '4 天前',
  },
  {
    id: 'p-010', layer: 'pattern', category: '习惯',
    content: '在开始一个新任务前，习惯先搜索有没有可以复用的历史结论或框架',
    confidence: 4, source: '多次行为归纳', updatedAt: '1 周前',
  },
  {
    id: 'p-011', layer: 'pattern', category: '相处方式',
    content: '和 Clark 协作时倾向于给对方更多空间先提框架，而不是过早把自己的方案摆出来',
    confidence: 3, source: '会议纪要 · 04-01', updatedAt: '2 天前', pendingConfirm: true,
  },
  {
    id: 'p-012', layer: 'pattern', category: '相处方式',
    content: '在向上汇报时偏好先给结论再给过程，不习惯铺垫过长再说重点',
    confidence: 4, source: '多次行为归纳', updatedAt: '2 周前',
  },
  {
    id: 'p-013', layer: 'pattern', category: '观点',
    content: '认为现阶段知识库产品的核心问题不是功能不够，而是缺乏让内容持续更新的激励机制',
    confidence: 4, source: '会议纪要 · 04-01', updatedAt: '2 天前',
  },
  {
    id: 'p-014', layer: 'pattern', category: '观点',
    content: '认为 Agent 的记忆系统应该以"被调用次数"而非"用户打开频次"来衡量价值',
    confidence: 4, source: '对话记录 · 04-02', updatedAt: '今天',
  },
];

// ── 最近的我（Episode Memories）──
const episodeMemories: EpisodeMemory[] = [
  {
    id: 'e-001', layer: 'episode', category: '任务',
    content: '正在为记忆模块设计三层架构的产品页面，核心问题是如何把学术概念转化为普通用户能理解的界面语言',
    date: '今天', source: '对话记录', expired: false, pendingConfirm: false,
  },
  {
    id: 'e-002', layer: 'episode', category: '想法',
    content: '想到生命时期层的四格卡片可能不适合所有用户，考虑是否要支持自定义维度而非固定模板',
    date: '今天', source: '对话记录', expired: false, pendingConfirm: false,
  },
  {
    id: 'e-003', layer: 'episode', category: '想法',
    content: '考虑把三个层级的名字改成"我是谁""我的模式""最近的我"，比学术名称更容易被普通用户理解',
    date: '今天', source: '对话记录', expired: false, pendingConfirm: true,
  },
  {
    id: 'e-004', layer: 'episode', category: '结论',
    content: '04-01 会议确认：记忆萃取必须以用户当前目标作为过滤条件，没有目标上下文的提取等于随机采样',
    date: '4月1日', source: '会议纪要 · 04-01', expired: false, pendingConfirm: false,
  },
  {
    id: 'e-005', layer: 'episode', category: '结论',
    content: '04-01 会议确认：产品定位优先 for agent，舍弃纯人类使用场景，不做 Notion 的复刻',
    date: '4月1日', source: '会议纪要 · 04-01', expired: false, pendingConfirm: false,
  },
  {
    id: 'e-006', layer: 'episode', category: '任务',
    content: '本周重点：完成记忆页面的 MVP 设计并交给 AI coding 工具跑出第一版 demo',
    date: '本周', source: '手动添加', expired: false, pendingConfirm: false,
  },
  {
    id: 'e-007', layer: 'episode', category: '动态',
    content: '研究了 Second Me 的 HMM 三层架构和 Mem0 的记忆提取机制，发现两者都缺乏目标导向的萃取逻辑',
    date: '3月31日', source: '对话记录', expired: false, pendingConfirm: false,
  },
  {
    id: 'e-008', layer: 'episode', category: '想法',
    content: 'Conway 的 SMS 模型（自我记忆系统）比 Tulving 的情节/语义分类更适合作为产品记忆设计的理论基础，因为它强调目标导向',
    date: '3月31日', source: '对话记录', expired: false, pendingConfirm: false,
  },
  {
    id: 'e-009', layer: 'episode', category: '结论',
    content: 'MVP 文档检索方案确认：条件过滤 + 轻量关键词匹配，向量检索延后',
    date: '3月中旬', source: '会议纪要 · 03-18', expired: false, pendingConfirm: false,
  },
  {
    id: 'e-011', layer: 'episode', category: '动态',
    content: '完成了文档列表页 UI 的第一版设计方案，包含活动摘要卡片和 Agent 创建者标识',
    date: '3月中旬', source: '对话记录', expired: true, pendingConfirm: false,
  },
  {
    id: 'e-012', layer: 'episode', category: '任务',
    content: 'Q1 知识库模块复盘文档需要在本月内完成',
    date: '3月上旬', source: '手动添加', expired: true, pendingConfirm: false,
  },
];

const mockAgentCalls: AgentCallRecord[] = [
  { id: 'a1', agentName: '写作助手', time: '14:32', status: 'success' },
  { id: 'a2', agentName: '日程规划', time: '10:20', status: 'success' },
  { id: 'a3', agentName: '文档分析', time: '09:15', status: 'info' },
  { id: 'a4', agentName: '产品顾问', time: '昨天', status: 'success' },
];

const sourceDistribution = [
  { name: '对话', count: 14, total: 30 },
  { name: '会议', count: 8, total: 30 },
  { name: '文档', count: 4, total: 30 },
  { name: '手动', count: 3, total: 30 },
  { name: '日历', count: 1, total: 30 },
];

// ─── Helpers ─────────────────────────────────────────────────

/** Classify episode date string into time groups */
function getEpisodeGroup(date: string): 'today' | 'week' | 'earlier' {
  if (date === '今天') return 'today';
  if (['4月1日', '本周', '3月31日'].includes(date)) return 'week';
  return 'earlier';
}

// ─── Sub-components ──────────────────────────────────────────

function ConfidenceDots({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            i < level ? 'bg-violet-400' : 'bg-stone-200'
          }`}
        />
      ))}
    </div>
  );
}

function LayerBadge({ layer, pendingConfirm }: { layer: 'pattern' | 'episode'; pendingConfirm?: boolean }) {
  if (pendingConfirm) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-500 border border-red-200">
        待确认
      </span>
    );
  }
  const config = {
    pattern: { label: '我的模式', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    episode: { label: '最近的我', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  };
  const c = config[layer];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${c.bg} ${c.text} border ${c.border}`}>
      {c.label}
    </span>
  );
}

function CategoryTag({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-stone-100 text-[10px] font-medium text-stone-500">
      {category}
    </span>
  );
}

// ─── Memory Row Component ────────────────────────────────────

interface MemoryRowProps {
  key?: React.Key;
  entry: MemoryEntry;
  hoveredMemory: string | null;
  setHoveredMemory: (id: string | null) => void;
}

function MemoryRow({ entry, hoveredMemory, setHoveredMemory }: MemoryRowProps) {
  const isPending = !!entry.pendingConfirm;
  const isExpired = entry.layer === 'episode' && (entry as EpisodeMemory).expired;

  return (
    <div
      className={`relative flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-150 hover:bg-white/80 group/row ${
        isPending ? 'border-l-2 border-l-red-400' : 'border-l-2 border-l-transparent'
      } ${isExpired ? 'opacity-50' : ''}`}
      onMouseEnter={() => setHoveredMemory(entry.id)}
      onMouseLeave={() => setHoveredMemory(null)}
    >
      {/* Badge */}
      <div className="pt-0.5 shrink-0">
        <LayerBadge layer={entry.layer} pendingConfirm={isPending} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] leading-relaxed ${
          isExpired ? 'text-stone-400 line-through decoration-stone-300' : 'text-stone-600'
        }`}>
          {entry.content}
          {isExpired && (
            <span className="ml-1 text-stone-400 text-xs no-underline">（已过期）</span>
          )}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <CategoryTag category={entry.category} />
          <span className="text-stone-300">·</span>
          <span className="text-[11px] text-stone-400 hover:text-violet-500 cursor-pointer flex items-center gap-0.5">
            <FileText className="w-3 h-3" />
            {entry.source}
          </span>
          <span className="text-stone-300">·</span>
          <span className="text-[11px] text-stone-300 flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            {entry.layer === 'pattern' ? (entry as PatternMemory).updatedAt : (entry as EpisodeMemory).date}
          </span>
          {entry.layer === 'pattern' && (
            <>
              <span className="text-stone-300">·</span>
              <ConfidenceDots level={(entry as PatternMemory).confidence} />
            </>
          )}
        </div>
      </div>

      {/* Actions (hover) */}
      {hoveredMemory === entry.id && (
        <motion.div
          initial={{ opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-0.5 shrink-0 pt-0.5"
        >
          {isExpired ? (
            <>
              <button className="p-1.5 rounded-md text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="恢复">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-md text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="彻底删除">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button className="p-1.5 rounded-md text-stone-400 hover:text-violet-600 hover:bg-violet-50 transition-colors" title="溯源">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors" title="编辑">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              {entry.layer === 'episode' && !isPending && (
                <button className="p-1.5 rounded-md text-stone-400 hover:text-stone-500 hover:bg-stone-100 transition-colors" title="设过期">
                  <Clock className="w-3.5 h-3.5" />
                </button>
              )}
              {isPending && (
                <>
                  <button className="p-1.5 rounded-md text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="确认">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-md text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="忽略">
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

interface MemoryV2Props {
  lang: string;
}

export default function MemoryV2({ lang }: MemoryV2Props) {
  const [filterTab, setFilterTab] = useState<'timeline' | 'category' | 'pending'>('timeline');
  const [showPendingBanner, setShowPendingBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredMemory, setHoveredMemory] = useState<string | null>(null);

  // Merge all memories into a single list
  const allMemories: MemoryEntry[] = [...patternMemories, ...episodeMemories];

  const pendingCount = allMemories.filter(m => m.pendingConfirm).length;
  const patternCount = patternMemories.filter(m => !m.pendingConfirm).length;
  const episodeCount = episodeMemories.filter(m => !m.pendingConfirm && !m.expired).length;

  // Search filter
  const searchFiltered = searchQuery.trim()
    ? allMemories.filter(m =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.source.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allMemories;

  // Tab filter
  const tabFiltered = filterTab === 'pending'
    ? searchFiltered.filter(m => m.pendingConfirm)
    : searchFiltered;

  // Timeline grouped (for episodes)
  const timelineGrouped = {
    today: tabFiltered.filter(m =>
      (m.layer === 'episode' && getEpisodeGroup((m as EpisodeMemory).date) === 'today') ||
      (m.layer === 'pattern' && (m as PatternMemory).updatedAt === '今天')
    ),
    week: tabFiltered.filter(m =>
      (m.layer === 'episode' && getEpisodeGroup((m as EpisodeMemory).date) === 'week') ||
      (m.layer === 'pattern' && ['2 天前', '3 天前', '4 天前', '5 天前'].includes((m as PatternMemory).updatedAt))
    ),
    earlier: tabFiltered.filter(m =>
      (m.layer === 'episode' && getEpisodeGroup((m as EpisodeMemory).date) === 'earlier') ||
      (m.layer === 'pattern' && ['1 周前', '2 周前', '1周前', '2周前'].includes((m as PatternMemory).updatedAt))
    ),
  };

  // Category grouped
  const categoryGrouped = tabFiltered.reduce<Record<string, MemoryEntry[]>>((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {});

  const filterTabs = [
    { key: 'timeline' as const, label: '时序' },
    { key: 'category' as const, label: '按分类' },
    { key: 'pending' as const, label: '待确认' },
  ];

  return (
    <div className="w-full max-w-6xl space-y-5">
      {/* ━━━ Topbar ━━━ */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-900">
          {lang === 'zh' ? '记忆' : 'Memory'}
        </h1>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 text-stone-500 text-sm font-medium rounded-lg hover:bg-stone-100 hover:text-stone-700 transition-colors border border-stone-200" title="了解如何让 Agent 调用你的记忆">
            <HelpCircle className="w-4 h-4" />
            {lang === 'zh' ? 'Agent 如何调用？' : 'How Agents use memory?'}
          </button>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            {lang === 'zh' ? '手动添加' : 'Add Manually'}
          </button>
        </div>
      </div>

      {/* ━━━ About Me (Life Layer) — Card Block ━━━ */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100/60 rounded-2xl border border-stone-200/60 shadow-sm px-6 pt-5 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <h2 className="text-sm font-bold text-stone-800">
              {lang === 'zh' ? '关于我' : 'About Me'}
            </h2>
            <span className="text-xs text-stone-400">
              — {lang === 'zh' ? '关于你是谁的稳定认知，不随任务变化' : 'Stable cognition about who you are'}
            </span>
          </div>
          <button className="text-xs text-stone-500 hover:text-stone-700 font-medium px-3 py-1.5 rounded-md hover:bg-white/80 transition-colors">
            {lang === 'zh' ? '编辑' : 'Edit'}
          </button>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-4 gap-4">
          {mockLifeCards.map(card => (
            <div
              key={card.id}
              className="relative bg-white rounded-xl border border-stone-200/60 p-4 flex flex-col gap-3 transition-all duration-200 hover:shadow-md hover:border-stone-300 hover:-translate-y-0.5 group/card"
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {card.icon}
                  <h3 className="text-sm font-semibold text-stone-800">{card.title}</h3>
                </div>
                {hoveredCard === card.id && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </div>

              {/* Card Content */}
              <div className="flex-1 min-h-[60px]">{card.content}</div>

              {/* Confidence + Updated At */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                    {lang === 'zh' ? '置信度' : 'Confidence'}
                  </span>
                  <ConfidenceDots level={card.confidence} />
                </div>
                <span className="text-[10px] text-stone-300 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {card.updatedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ━━━ Dynamic Memory Zone ━━━ */}
      <div className="flex gap-5 min-h-[500px]">
        {/* Left: Main List — Card Block */}
        <div className="flex-1 bg-white rounded-2xl border border-stone-200/60 shadow-sm p-5">
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-lg">
              {filterTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilterTab(tab.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    filterTab === tab.key
                      ? 'bg-white text-stone-800 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'pending' && pendingCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-500 text-[10px] font-bold rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'zh' ? '搜索记忆...' : 'Search memories...'}
                className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-700 placeholder-stone-400 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 w-48 transition-all"
              />
            </div>
          </div>

          {/* Pending Banner */}
          {showPendingBanner && pendingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between px-4 py-2.5 bg-red-50/80 border border-red-200/60 rounded-xl mb-4"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-600 font-medium">
                  {pendingCount} {lang === 'zh' ? '条新洞察待确认，确认后将被 Agent 调用' : 'new insights pending confirmation'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-100 transition-colors">
                  {lang === 'zh' ? '逐条查看' : 'Review'}
                </button>
                <button
                  onClick={() => setShowPendingBanner(false)}
                  className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1 rounded hover:bg-stone-100 transition-colors"
                >
                  {lang === 'zh' ? '全部忽略' : 'Ignore All'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Memory List */}
          <div className="space-y-5">
            {filterTab === 'category' ? (
              /* ── Category View ── */
              Object.keys(categoryGrouped).length === 0 ? (
                <div className="text-center py-12 text-sm text-stone-400">
                  {lang === 'zh' ? '没有匹配的记忆' : 'No matching memories'}
                </div>
              ) : (
                Object.entries(categoryGrouped).map(([category, items]) => (
                  <div key={category}>
                    {/* Category Label */}
                    <div className="flex items-center gap-3 mb-2 px-1">
                      <span className="text-[11px] font-semibold text-stone-500 tracking-wider whitespace-nowrap flex items-center gap-1.5">
                        <Hash className="w-3 h-3 text-stone-400" />
                        {category}
                      </span>
                      <span className="text-[10px] text-stone-300 bg-stone-100 px-1.5 py-0.5 rounded-full">{items.length}</span>
                    </div>

                    {/* Items */}
                    <div className="space-y-0.5 bg-stone-50/50 rounded-xl p-1">
                      {items.map(item => (
                        <MemoryRow
                          key={item.id}
                          entry={item}
                          hoveredMemory={hoveredMemory}
                          setHoveredMemory={setHoveredMemory}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )
            ) : (
              /* ── Timeline / Pending View ── */
              (() => {
                const hasItems = timelineGrouped.today.length + timelineGrouped.week.length + timelineGrouped.earlier.length > 0;
                if (!hasItems) {
                  return (
                    <div className="text-center py-12 text-sm text-stone-400">
                      {filterTab === 'pending'
                        ? (lang === 'zh' ? '没有待确认的记忆' : 'No pending memories')
                        : (lang === 'zh' ? '没有匹配的记忆' : 'No matching memories')}
                    </div>
                  );
                }
                return (['today', 'week', 'earlier'] as const).map(groupKey => {
                  const items = timelineGrouped[groupKey];
                  if (!items.length) return null;
                  const groupLabels = {
                    today: lang === 'zh' ? '今天' : 'Today',
                    week: lang === 'zh' ? '本周' : 'This Week',
                    earlier: lang === 'zh' ? '更早' : 'Earlier',
                  };
                  return (
                    <div key={groupKey}>
                      {/* Group Label */}
                      <div className="flex items-center gap-3 mb-2 px-1">
                        <span className="text-[11px] font-semibold text-stone-500 tracking-wider whitespace-nowrap">
                          {groupLabels[groupKey]}
                        </span>
                        <span className="text-[10px] text-stone-300 bg-stone-100 px-1.5 py-0.5 rounded-full">{items.length}</span>
                      </div>

                      {/* Items */}
                      <div className="space-y-0.5 bg-stone-50/50 rounded-xl p-1">
                        {items.map(item => (
                          <MemoryRow
                            key={item.id}
                            entry={item}
                            hoveredMemory={hoveredMemory}
                            setHoveredMemory={setHoveredMemory}
                          />
                        ))}
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </div>
        </div>

        {/* Right: Stats Panel — Card Block */}
        <div className="w-64 shrink-0 space-y-4">
          {/* Counts Card */}
          <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-4">
            <h3 className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-3">
              {lang === 'zh' ? '记忆总览' : 'Overview'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-emerald-600">{patternCount}</div>
                <div className="text-[10px] text-stone-500 font-medium mt-0.5">
                  {lang === 'zh' ? '我的模式' : 'Patterns'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/40 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-amber-600">{episodeCount}</div>
                <div className="text-[10px] text-stone-500 font-medium mt-0.5">
                  {lang === 'zh' ? '最近的我' : 'Recent'}
                </div>
              </div>
            </div>
          </div>

          {/* Source Distribution Card */}
          <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-4">
            <h3 className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-3">
              {lang === 'zh' ? '洞察来源分布' : 'Source Distribution'}
            </h3>
            <div className="space-y-2.5">
              {sourceDistribution.map(src => (
                <div key={src.name} className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 w-8 shrink-0">{src.name}</span>
                  <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-300 rounded-full transition-all duration-500"
                      style={{ width: `${(src.count / src.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 w-5 text-right">{src.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Call Records Card */}
          <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-4">
            <h3 className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-3">
              {lang === 'zh' ? 'Agent 调用记录' : 'Agent Calls'}
            </h3>
            <div className="space-y-1">
              {mockAgentCalls.map(call => (
                <div key={call.id} className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-stone-50 transition-colors">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    call.status === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-stone-600 font-medium">{call.agentName}</span>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0">{call.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
