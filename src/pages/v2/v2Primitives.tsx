import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Briefcase,
  Clock,
  FileText,
  Globe,
  Layers,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Terminal,
  User,
  X,
} from 'lucide-react';
import { getAgentAvatar } from '../../components/AgentAvatars';
import { useLanguage } from '../../i18n/LanguageContext';

export type V2CardTone = 'thread' | 'gem' | 'synthesis';

export interface V2SourceRef {
  id: string;
  label: string;
  kind: 'document' | 'comment' | 'chat' | 'report';
  storage?: 'workspace' | 'memory';
  docId?: string;
  dataSourceId?: string;
  quote?: string;
}

export interface V2PersonRef {
  name: string;
  kind: 'human' | 'agent';
}

export interface V2CardRecord {
  id: string;
  timestamp: string;
  typeLabel: string;
  title: string;
  content: string;
  tags: string[];
  sources: V2SourceRef[];
  people: V2PersonRef[];
  relatedIds?: string[];
  evidence?: string[];
  statusLabel?: string;
}

export interface V2TimelineSignalRecord {
  eventId: string;
  assetId?: string;
  timeLabel: string;
  stage: 'captured' | 'candidate' | 'durable';
  stageLabel: string;
  title: string;
  summary: string;
  docName: string;
  docId: string;
  sourceKind: V2SourceRef['kind'];
  people: V2PersonRef[];
}

const HUMAN_AVATAR_URLS: Record<string, string> = {
  '产品经理 A': 'https://picsum.photos/seed/person-pm/100/100',
  Me: 'https://picsum.photos/seed/person-me/100/100',
  'Maya Chen': 'https://picsum.photos/seed/person-maya/100/100',
  'Alice Chen': 'https://picsum.photos/seed/person-alice/100/100',
  'Bob Smith': 'https://picsum.photos/seed/person-bob/100/100',
  'Eve Davis': 'https://picsum.photos/seed/person-eve/100/100',
  '小 A': 'https://picsum.photos/seed/person-a/100/100',
  '小 B': 'https://picsum.photos/seed/person-b/100/100',
  '小 C': 'https://picsum.photos/seed/person-c/100/100',
  '老 D': 'https://picsum.photos/seed/person-d/100/100',
  '小 E': 'https://picsum.photos/seed/person-e/100/100',
  Clack: 'https://picsum.photos/seed/person-clack/100/100',
};

function renderPersonAvatar(person: V2PersonRef, size = 32) {
  if (person.kind === 'agent') {
    return getAgentAvatar(person.name, size, 'rounded-xl');
  }

  const avatarUrl =
    HUMAN_AVATAR_URLS[person.name] ??
    `https://picsum.photos/seed/${encodeURIComponent(person.name.toLowerCase())}/100/100`;

  return (
    <img
      src={avatarUrl}
      alt={person.name}
      className="rounded-xl object-cover"
      style={{ width: size, height: size }}
      referrerPolicy="no-referrer"
    />
  );
}

export function V2AvatarStack({
  people,
  size = 32,
  overlap = -8,
  rounded = 'rounded-xl',
}: {
  people: V2PersonRef[];
  size?: number;
  overlap?: number;
  rounded?: string;
}) {
  return (
    <div className="flex" style={{ gap: overlap < 0 ? 0 : overlap }}>
      {people.map((person, index) => (
        <div
          key={`${person.name}-${index}`}
          className={`${rounded} border-2 border-white shadow-sm overflow-hidden`}
          style={{ marginLeft: index === 0 || overlap >= 0 ? 0 : overlap }}
        >
          {renderPersonAvatar(person, size)}
        </div>
      ))}
    </div>
  );
}

function getSourceIcon(kind: V2SourceRef['kind']) {
  switch (kind) {
    case 'chat':
      return <MessageSquare size={12} />;
    case 'comment':
      return <Clock size={12} />;
    case 'report':
      return <Terminal size={12} />;
    default:
      return <FileText size={12} />;
  }
}

function getCardIcon(typeLabel: string) {
  const normalized = typeLabel.toLowerCase();
  if (normalized.includes('decision') || normalized.includes('project') || normalized.includes('判断')) {
    return <Lightbulb size={14} />;
  }
  if (normalized.includes('preference') || normalized.includes('偏好')) {
    return <Sparkles size={14} />;
  }
  if (normalized.includes('principle') || normalized.includes('原则')) {
    return <Layers size={14} />;
  }
  if (normalized.includes('anchor') || normalized.includes('锚点')) {
    return <Briefcase size={14} />;
  }
  if (normalized.includes('pending') || normalized.includes('follow') || normalized.includes('沉淀')) {
    return <Clock size={14} />;
  }
  if (normalized.includes('constraint')) return <Briefcase size={14} />;
  if (normalized.includes('insight')) return <Layers size={14} />;
  return <User size={14} />;
}

export function V2SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
        active
          ? 'bg-white text-zinc-900 shadow-sm shadow-zinc-100'
          : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/30'
      }`}
    >
      <Icon size={20} className={active ? 'text-indigo-600' : ''} />
      {label}
    </button>
  );
}

export function V2TimelineSignalCard({
  signal,
  active,
  onClick,
}: {
  signal: V2TimelineSignalRecord;
  active?: boolean;
  onClick?: () => void;
}) {
  const stageClasses =
    signal.stage === 'durable'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : signal.stage === 'candidate'
        ? 'border-sky-200 bg-sky-50 text-sky-700'
        : 'border-amber-200 bg-amber-50 text-amber-700';

  const wrapperClass = `w-full rounded-[1.35rem] border p-4 text-left transition-all ${
    active
      ? 'border-stone-300 bg-white shadow-[0_10px_28px_rgba(28,25,23,0.08)] ring-1 ring-stone-200'
      : 'border-stone-200 bg-white shadow-[0_10px_24px_rgba(28,25,23,0.04)] hover:border-stone-300 hover:bg-stone-50/60'
  }`;

  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
          <span
            className={`h-2 w-2 rounded-full ${
              signal.stage === 'durable'
                ? 'bg-emerald-500'
                : signal.stage === 'candidate'
                  ? 'bg-sky-500'
                  : 'bg-amber-500'
            }`}
          />
          {signal.timeLabel}
        </span>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${stageClasses}`}>
          {signal.stageLabel}
        </span>
      </div>

      <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-stone-900">{signal.title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{signal.summary}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-medium text-stone-500">
          {getSourceIcon(signal.sourceKind)}
          <span>{signal.docName}</span>
        </div>

        {signal.people.length > 0 && (
          <div className="flex items-center gap-2">
            <V2AvatarStack people={signal.people.slice(0, 3)} size={26} overlap={-8} />
            <span className="text-[11px] font-medium text-stone-400">
              {signal.people.length}
            </span>
          </div>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={wrapperClass}>
        {content}
      </button>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}

export function V2KnowledgeCard({
  card,
  onCardClick,
  onSourceClick,
  onTagClick,
}: {
  card: V2CardRecord;
  onCardClick?: (id: string) => void;
  onSourceClick?: (source: V2SourceRef) => void;
  onTagClick?: (tag: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer rounded-[1.2rem] border border-stone-200 bg-white p-5 shadow-[0_4px_14px_rgba(28,25,23,0.04)] transition-all hover:border-stone-300 hover:bg-stone-50/60 hover:shadow-[0_8px_20px_rgba(28,25,23,0.06)]"
      onClick={() => onCardClick?.(card.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl bg-stone-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
            {getCardIcon(card.typeLabel)}
            {card.typeLabel}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            {card.timestamp}
          </span>
        </div>
        <ArrowUpRight className="w-4 h-4 text-stone-300 transition-colors group-hover:text-stone-500" />
      </div>

      <h3 className="mb-2 text-[17px] font-semibold leading-tight tracking-tight text-stone-900">
        {card.title}
      </h3>
      <p className="mb-6 line-clamp-2 text-sm font-normal leading-relaxed text-stone-600">
        {card.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {card.people.slice(0, 3).map(person => (
              <div
                key={person.name}
                className="rounded-xl border-2 border-white shadow-sm overflow-hidden"
              >
                {renderPersonAvatar(person, 28)}
              </div>
            ))}
          </div>
          {card.statusLabel && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              {card.statusLabel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {card.sources.slice(0, 1).map(source => (
            <div
              key={source.id}
              onClick={event => {
                event.stopPropagation();
                onSourceClick?.(source);
              }}
              className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-700"
            >
              {getSourceIcon(source.kind)}
              <span>{source.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          {card.tags.map(tag => (
            <button
              key={tag}
              onClick={event => {
                event.stopPropagation();
                onTagClick?.(tag);
              }}
              className="text-[10px] font-medium uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-700"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function V2InsightCard({
  title,
  content,
  date,
  onClick,
  featured,
}: {
  title: string;
  content: string;
  date: string;
  onClick?: () => void;
  featured?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-[2rem] border p-8 transition-all ${
        featured
          ? 'border-stone-200 bg-white text-stone-900 shadow-[0_16px_34px_rgba(28,25,23,0.08)]'
          : 'border-stone-200 bg-stone-50 text-stone-900 shadow-sm'
      }`}
    >
      <div className="absolute right-0 top-0 p-8 opacity-0 transition-opacity group-hover:opacity-100">
        <ArrowUpRight size={20} className="text-stone-400" />
      </div>
      <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
        <Lightbulb size={16} />
        深度洞察
      </div>
      <h4 className={`${featured ? 'text-3xl lg:text-[2rem]' : 'text-xl lg:text-2xl'} mb-4 font-bold leading-tight tracking-tight text-stone-900`}>
        {title}
      </h4>
      <p className="mb-8 line-clamp-3 text-base leading-relaxed text-stone-600">
        {content}
      </p>
      <div className="flex items-center justify-between pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-100 text-[10px] font-bold text-stone-500">
            AI
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Generated Insight
          </span>
        </div>
        <span className="text-[10px] font-bold text-stone-400">{date}</span>
      </div>
    </motion.div>
  );
}

export function V2ResonanceCard({
  card,
  tone,
  lang = 'zh',
  featured,
  compact,
  onClick,
}: {
  card: V2CardRecord;
  tone: V2CardTone;
  lang?: 'zh' | 'en';
  featured?: boolean;
  compact?: boolean;
  onClick?: () => void;
}) {
  const toneClasses = {
    thread: 'border border-stone-200 bg-white shadow-[0_12px_28px_rgba(28,25,23,0.06)]',
    gem: 'border border-stone-200 bg-white shadow-[0_8px_20px_rgba(28,25,23,0.04)]',
    synthesis: 'border border-stone-200 bg-stone-50 shadow-[0_8px_20px_rgba(28,25,23,0.04)]',
  } as const;

  const toneText =
    lang === 'zh'
      ? {
          thread: '最近关注',
          gem: '你已洞察',
          synthesis: 'AI 推荐',
        }
      : {
          thread: 'Recently Watching',
          gem: 'Already Noticed',
          synthesis: 'AI Suggested',
        };

  const toneLabelClasses = {
    thread: 'bg-stone-100 text-stone-500',
    gem: 'bg-stone-100 text-stone-500',
    synthesis: 'bg-stone-200 text-stone-500',
  } as const;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`flex h-full cursor-pointer flex-col rounded-[2rem] p-8 transition-all ${toneClasses[tone]} ${
        featured ? 'ring-4 ring-stone-100' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {card.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              #{tag}
            </span>
          ))}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${toneLabelClasses[tone]}`}>
          <span className="text-[10px] font-bold uppercase tracking-widest">{toneText[tone]}</span>
          {tone === 'thread' && <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse" />}
        </div>
      </div>

      <h4 className={`${featured ? 'text-3xl lg:text-[2rem]' : 'text-xl lg:text-2xl'} mb-4 font-bold leading-tight tracking-tight text-stone-900`}>
        {card.title}
      </h4>

      {!compact && (
        <p className={`mb-8 flex-1 text-base leading-relaxed text-stone-600 ${featured ? 'line-clamp-4' : 'line-clamp-2'}`}>
          {card.content}
        </p>
      )}

      <div className="flex items-center justify-between pt-8 mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {card.people.slice(0, 3).map(person => (
              <div
                key={person.name}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden"
              >
                {renderPersonAvatar(person, 32)}
              </div>
            ))}
          </div>
          {card.statusLabel ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {card.statusLabel}
            </span>
          ) : (
            featured && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                {lang === 'zh' ? `${card.people.length} 位参与者` : `${card.people.length} Collaborators`}
              </span>
            )
          )}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
          {card.timestamp}
        </span>
      </div>
    </motion.div>
  );
}

export function V2CardDetailModal({
  card,
  relatedCards,
  onClose,
  onOpenRelated,
  onOpenSource,
  onEditDocument,
  editDocumentHref,
  onRunMemoAction,
  onAskMemoAgent,
  showInsightActions,
  onResolveInsight,
}: {
  card: V2CardRecord | null;
  relatedCards: V2CardRecord[];
  onClose: () => void;
  onOpenRelated: (cardId: string) => void;
  onOpenSource?: (source: V2SourceRef) => void;
  onEditDocument?: (cardId: string) => void;
  editDocumentHref?: string;
  onRunMemoAction?: (cardId: string, action: 'refine' | 'tags' | 'related') => string;
  onAskMemoAgent?: (cardId: string, question: string) => string;
  showInsightActions?: boolean;
  onResolveInsight?: (cardId: string, action: 'accept' | 'ignore') => void;
}) {
  const { lang } = useLanguage();
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; role: 'assistant' | 'user'; text: string }>>([]);

  const copy =
    lang === 'zh'
      ? {
          intro:
            '我是 memo agent。围绕这张记忆，我可以继续帮你溯源证据、优化说明、补标签，或者直接把它送进文档里改。',
          fallback:
            '我已经记下这个问题了。接下来我可以继续帮你沿着证据、标签或者关联链路往下看。',
          editDocument: '编辑文档',
          evidence: 'Evidence',
          tags: '关联标签',
          sources: '信息溯源',
          relatedCards: '关联卡片',
          insightTitle: 'AI 察觉',
          insightDescription: '这条察觉可以直接被采纳进记忆流转，或者先从当前队列里忽略。',
          accept: '采纳',
          ignore: '忽略',
          agentTitle: 'memo agent',
          agentSubtitle: '基于这张记忆继续提炼、检索、改写',
          engine: 'Memo Engine',
          refine: '优化说明',
          addTags: '补充标签',
          findRelated: '寻找关联',
          placeholder: '继续问这张记忆，或让 memo agent 帮你改。',
          manualEdit: '进入文档手动编辑',
          send: '发送',
        }
      : {
          intro:
            'I am memo agent. Around this memory, I can trace evidence, tighten the wording, add tags, or send it straight into a document for editing.',
          fallback:
            'I captured that. Next I can keep working through the evidence, tags, or related-memory trail.',
          editDocument: 'Edit document',
          evidence: 'Evidence',
          tags: 'Tags',
          sources: 'Sources',
          relatedCards: 'Related cards',
          insightTitle: 'AI Noticing',
          insightDescription: 'This noticing can be accepted into the memory flow now, or ignored from the current queue.',
          accept: 'Accept',
          ignore: 'Ignore',
          agentTitle: 'memo agent',
          agentSubtitle: 'Refine, retrieve, and rewrite from this memory',
          engine: 'Memo Engine',
          refine: 'Refine copy',
          addTags: 'Add tags',
          findRelated: 'Find related',
          placeholder: 'Ask about this memory, or ask memo agent to improve it.',
          manualEdit: 'Edit in document',
          send: 'Send',
        };

  useEffect(() => {
    if (!card) return;
    setDraft('');
    setMessages([
      {
        id: `${card.id}-intro`,
        role: 'assistant',
        text: copy.intro,
      },
    ]);
  }, [card, copy.intro]);

  const appendAssistantMessage = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: `assistant-${Date.now()}-${prev.length}`,
        role: 'assistant',
        text,
      },
    ]);
  };

  const handleMemoAction = (action: 'refine' | 'tags' | 'related') => {
    if (!card) return;
    const response = onRunMemoAction?.(card.id, action);
    if (response) appendAssistantMessage(response);
  };

  const submitQuestion = () => {
    if (!card) return;
    const question = draft.trim();
    if (!question) return;

    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}-${prev.length}`,
        role: 'user',
        text: question,
      },
    ]);
    setDraft('');

    const answer =
      onAskMemoAgent?.(card.id, question) ??
      copy.fallback;
    appendAssistantMessage(answer);
  };

  const editDocumentClassName =
    'inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50';

  return (
    <AnimatePresence>
      {card && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/35 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-stone-200 bg-white shadow-[0_24px_64px_rgba(28,25,23,0.14)]"
          >
            <div className="p-6 lg:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-stone-500">
                    {card.typeLabel}
                  </div>
                  <span className="text-xs font-medium text-stone-400">{card.timestamp}</span>
                </div>
                <div className="flex items-center gap-2">
                  {editDocumentHref ? (
                    <Link to={editDocumentHref} className={editDocumentClassName}>
                      <FileText size={14} />
                      {copy.editDocument}
                    </Link>
                  ) : (
                    <button
                      onClick={() => onEditDocument?.(card.id)}
                      className={editDocumentClassName}
                    >
                      <FileText size={14} />
                      {copy.editDocument}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-4 text-[2rem] font-bold leading-tight tracking-tight text-stone-900">{card.title}</h2>
                    <p className="text-base leading-relaxed text-stone-600">{card.content}</p>
                  </div>

                  {card.evidence && card.evidence.length > 0 && (
                    <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                      <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        {copy.evidence}
                      </div>
                      <div className="space-y-3">
                        {card.evidence.map(line => (
                          <p key={line} className="text-sm leading-relaxed text-stone-600">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-6 border-t border-stone-100 pt-6 lg:grid-cols-2">
                    <div>
                      <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        {copy.tags}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {card.tags.map(tag => (
                          <span
                            key={tag}
                            className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-500"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        {copy.sources}
                      </h4>
                      <div className="space-y-2">
                        {card.sources.map(source => (
                          <button
                            key={source.id}
                            onClick={() => onOpenSource?.(source)}
                            className="flex w-full items-center gap-2 rounded-xl border border-transparent px-2 py-2 text-left text-xs text-stone-500 transition-colors hover:border-stone-200 hover:bg-stone-50 hover:text-stone-700"
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
                              {source.kind === 'chat' ? (
                                <MessageSquare size={12} />
                              ) : source.kind === 'report' ? (
                                <Terminal size={12} />
                              ) : source.kind === 'comment' ? (
                                <Clock size={12} />
                              ) : (
                                <Globe size={12} />
                              )}
                            </div>
                            <span>{source.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {relatedCards.length > 0 && (
                    <div className="border-t border-stone-100 pt-6">
                      <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        {copy.relatedCards}
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {relatedCards.map(related => (
                          <button
                            key={related.id}
                            onClick={() => onOpenRelated(related.id)}
                            className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-left transition-colors hover:bg-white hover:border-stone-300"
                          >
                            <div className="mb-1 text-xs font-semibold text-stone-900">{related.title}</div>
                            <div className="line-clamp-2 text-[11px] leading-relaxed text-stone-500">
                              {related.content}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-[1.35rem] border border-stone-200 bg-[#FAFAF9] p-5">
                  {showInsightActions && (
                    <div className="mb-5 rounded-[1.35rem] border border-stone-200 bg-white p-4">
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                        {copy.insightTitle}
                      </div>
                      <p className="text-xs leading-relaxed text-stone-500">
                        {copy.insightDescription}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          onClick={() => onResolveInsight?.(card.id, 'accept')}
                          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                        >
                          {copy.accept}
                        </button>
                        <button
                          onClick={() => onResolveInsight?.(card.id, 'ignore')}
                          className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
                        >
                          {copy.ignore}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-white">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-stone-900">{copy.agentTitle}</div>
                      <div className="text-xs text-stone-400">{copy.agentSubtitle}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                      {copy.engine}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'refine' as const, label: copy.refine },
                        { key: 'tags' as const, label: copy.addTags },
                        { key: 'related' as const, label: copy.findRelated },
                      ].map(action => (
                        <button
                          key={action.key}
                          onClick={() => handleMemoAction(action.key)}
                          className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="max-h-[260px] space-y-3 overflow-y-auto pr-1">
                      {messages.map(message => (
                        <div
                          key={message.id}
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            message.role === 'assistant'
                              ? 'border border-stone-200 bg-white text-stone-700'
                              : 'bg-stone-900 text-white'
                          }`}
                        >
                          {message.text}
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-3">
                      <textarea
                        value={draft}
                        onChange={event => setDraft(event.target.value)}
                        placeholder={copy.placeholder}
                        className="min-h-[96px] w-full resize-none border-none bg-transparent text-sm leading-relaxed text-stone-700 outline-none placeholder:text-stone-400"
                      />
                      <div className="mt-3 flex items-center justify-between">
                        {editDocumentHref ? (
                          <Link
                            to={editDocumentHref}
                            className="text-xs font-medium text-stone-500 transition-colors hover:text-stone-900"
                          >
                            {copy.manualEdit}
                          </Link>
                        ) : (
                          <button
                            onClick={() => onEditDocument?.(card.id)}
                            className="text-xs font-medium text-stone-500 transition-colors hover:text-stone-900"
                          >
                            {copy.manualEdit}
                          </button>
                        )}
                        <button
                          onClick={submitQuestion}
                          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                        >
                          <ArrowUpRight size={14} />
                          {copy.send}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
