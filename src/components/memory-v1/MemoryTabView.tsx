import {
  Brain,
  Database,
  FileText,
  MessageSquareText,
  Plus,
  Search,
  Sparkles,
  Target,
  Upload,
  User,
  Wand2,
} from 'lucide-react';
import { useMemo, useState, type ReactNode, type RefObject } from 'react';
import { useMindXDemo } from '../../data/mindxDemoContext';
import {
  V2KnowledgeCard,
  type V2CardRecord,
  type V2PersonRef,
  type V2SourceRef,
} from '../../pages/v2/v2Primitives';

type MemoryNode = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type ExtractedKeyPoint = {
  id: string;
  title: string;
  type: string;
  text: string;
  source: string;
  createdAt: string;
};

type RawDataItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  source: 'file' | 'paste';
};

type ExtractionLog = {
  id: string;
  text: string;
  time: string;
  status: 'done' | 'running' | 'pending';
};

type DataSourceRowRecord = {
  id: string;
  name: string;
  typeLabel: string;
  summaryMeta: string;
  uploadedAtLabel: string;
  badgeLabel: string;
  badgeClassName: string;
  sample: boolean;
  onClick?: () => void;
};

type MemoryTabViewProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  whoAmIDocContent: string;
  goalDocContent: string;
  onEditProfile: (key: 'whoami' | 'goal') => void;
  memoryNodes: MemoryNode[];
  memoryNodeInput: string;
  isMemoryNodesExpanded: boolean;
  onMemoryNodeInputChange: (value: string) => void;
  onOpenMemoryNodeComposer: () => void;
  onCancelMemoryNodeComposer: () => void;
  onCreateMemoryNode: () => void | Promise<void>;
  onEditNode: (node: MemoryNode) => void;
  extractedKeyPoints: ExtractedKeyPoint[];
  onOpenKeyPointsDocument: () => void;
  rawDataItems: RawDataItem[];
  extractionRunning: boolean;
  extractionLogs: ExtractionLog[];
  onOpenPasteModal: () => void;
  onOpenRawDataModal: () => void;
  onOpenRawData: (item: RawDataItem) => void;
  onOpenPricing: () => void;
  onOpenModelConfig: () => void;
  onOpenExtractionPicker: () => void;
};

function compactPreview(content: string, fallback: string) {
  const cleaned = content
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(' ');

  return cleaned || fallback;
}

function listPreview(content: string, fallback: string) {
  const lines = content
    .split('\n')
    .map(line => line.trim().replace(/^\d+\.\s*/, ''))
    .filter(Boolean)
    .slice(0, 3);

  return lines.length > 0 ? lines : [fallback];
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function normalize(text: string) {
  return text.trim().toLowerCase();
}

function SearchChip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-200 hover:text-stone-900"
    >
      {label}
    </button>
  );
}

type BaseMemoryPreviewItem = {
  label?: string;
  title: string;
  body?: string;
  meta?: string;
  badge?: string;
};

function BaseMemoryCard({
  icon,
  eyebrow,
  title,
  meta,
  previewType,
  previewItems,
  onClick,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  meta: string;
  previewType: 'memory' | 'goals' | 'knowledge';
  previewItems: BaseMemoryPreviewItem[];
  onClick?: () => void;
}) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`h-full rounded-[1.35rem] border border-stone-200 bg-white p-4 text-left shadow-sm transition-all ${
        onClick ? 'hover:border-stone-300' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-stone-700 shadow-sm">
            {icon}
          </div>
          <div>
            <div className="text-sm font-semibold text-stone-900">{title}</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
              {eyebrow}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-500">
            {meta}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {previewType === 'memory' &&
          previewItems.map(item => (
            <div key={item.title} className="rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
                {item.title}
              </div>
              <p className="mt-1.5 text-xs leading-6 text-stone-700">{item.body}</p>
            </div>
          ))}

        {previewType === 'goals' &&
          previewItems.map(item => (
            <div
              key={`${item.label ?? item.title}-${item.title}`}
              className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-[11px] font-bold text-stone-700">
                {item.label}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-stone-800">{item.title}</div>
                {item.meta ? <div className="mt-1 text-[11px] text-stone-500">{item.meta}</div> : null}
              </div>
            </div>
          ))}

        {previewType === 'knowledge' &&
          previewItems.map(item => (
            <div
              key={item.title}
              className="flex items-start justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3"
            >
              <div className="min-w-0 text-[13px] font-medium leading-6 text-stone-800">{item.title}</div>
              {item.badge ? (
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-stone-500">
                  {item.badge}
                </span>
              ) : null}
            </div>
          ))}
      </div>
    </Wrapper>
  );
}

export default function MemoryTabView({
  fileInputRef,
  whoAmIDocContent,
  goalDocContent,
  onEditProfile,
  memoryNodes,
  memoryNodeInput,
  isMemoryNodesExpanded,
  onMemoryNodeInputChange,
  onOpenMemoryNodeComposer,
  onCancelMemoryNodeComposer,
  onCreateMemoryNode,
  onEditNode,
  extractedKeyPoints,
  onOpenKeyPointsDocument,
  rawDataItems,
  extractionRunning,
  extractionLogs,
  onOpenPasteModal,
  onOpenRawDataModal,
  onOpenRawData,
  onOpenPricing,
  onOpenModelConfig,
  onOpenExtractionPicker,
}: MemoryTabViewProps) {
  const { memoryAssets, memoryDataSources, memorySourceLinks } = useMindXDemo();
  const [memoDraft, setMemoDraft] = useState('');
  const [isAllInsightsViewOpen, setIsAllInsightsViewOpen] = useState(false);

  const recentLogs = extractionLogs.slice(0, 3);
  const showSampleBaseMemory = !whoAmIDocContent.trim() && !goalDocContent.trim();
  const showSampleSources = rawDataItems.length === 0;

  const baseWhoAmI = whoAmIDocContent.trim()
    ? compactPreview(whoAmIDocContent, '')
    : '前沿科技创业者，独立产品经理。偏好极致体验和极简设计，推崇 Agent-Native 理念。';
  const baseGoals = goalDocContent.trim()
    ? listPreview(goalDocContent, '')
    : [
        '构建 Agent-Native 记忆中枢',
        '完善全平台交互与多端适配体验',
      ];

  const sampleKnowledgeSummary = useMemo(() => {
    return memoryAssets.slice(0, 2).map(asset => asset.title);
  }, [memoryAssets]);

  const knowledgeSummary = useMemo(() => {
    if (extractedKeyPoints.length === 0) {
      if (rawDataItems.length > 0) {
        return ['当前已经接入数据源', '完成第一轮提炼后，洞察卡片会出现在这里'];
      }

      return sampleKnowledgeSummary.length > 0
        ? sampleKnowledgeSummary
        : ['还没有沉淀出的记忆卡片', '先从数据源里提炼第一批洞察'];
    }

    return extractedKeyPoints.slice(0, 2).map(point => point.title || point.text);
  }, [extractedKeyPoints, rawDataItems.length, sampleKnowledgeSummary]);

  const formatAssetTypeLabel = (category: (typeof memoryAssets)[number]['libraryCategory']) => {
    if (category === 'project-judgment') return '项目判断';
    if (category === 'work-preference') return '工作偏好';
    if (category === 'long-term-principle') return '长期原则';
    if (category === 'core-anchor') return '核心锚点';
    return '待沉淀';
  };

  const formatAssetStatusLabel = (status: (typeof memoryAssets)[number]['status']) => {
    if (status === 'durable') return '已沉淀';
    if (status === 'review') return '审核中';
    return '候选';
  };

  const allInsightKnowledgeCards = useMemo<V2CardRecord[]>(() => {
    const toPeople = (participants: string[], fallback?: V2PersonRef) => {
      if (participants.length > 0) {
        return participants.slice(0, 3).map(participant => ({
          name: participant,
          kind:
            participant.toLowerCase().includes('assistant') ||
            participant.toLowerCase().includes('bot') ||
            participant.toLowerCase().includes('agent')
              ? ('agent' as const)
              : ('human' as const),
        }));
      }

      return fallback ? [fallback] : [];
    };

    if (extractedKeyPoints.length > 0) {
      return extractedKeyPoints.map(point => {
        const linkedSource = memorySourceLinks.find(source => source.docName === point.source);
        const relatedAsset = memoryAssets.find(asset => asset.title === point.title || asset.title === point.text);

        const sourceRef: V2SourceRef = linkedSource
          ? {
              id: linkedSource.id,
              label: linkedSource.docName,
              kind: linkedSource.kind,
              storage: linkedSource.storage,
              docId: linkedSource.docId,
              dataSourceId: linkedSource.dataSourceId,
              quote: linkedSource.quote,
            }
          : {
              id: `source-${point.id}`,
              label: point.source,
              kind: 'document',
            };

        return {
          id: point.id,
          timestamp: formatDateLabel(point.createdAt),
          typeLabel: point.type?.trim() || '洞察',
          title: point.title || point.text,
          content: point.text,
          tags: relatedAsset?.tags?.slice(0, 3) ?? [],
          sources: [sourceRef],
          people: toPeople(linkedSource?.participants ?? []),
          relatedIds: relatedAsset?.relatedAssetIds,
          evidence: relatedAsset?.evidence,
          statusLabel: relatedAsset ? `${relatedAsset.layer} · 已提炼` : '已提炼',
        };
      });
    }

    return memoryAssets.map(asset => {
      const linkedSources = asset.sourceIds
        .map(sourceId => memorySourceLinks.find(source => source.id === sourceId))
        .filter((source): source is NonNullable<typeof source> => Boolean(source));
      const primarySource = linkedSources[0];

      return {
        id: asset.id,
        timestamp: asset.freshness,
        typeLabel: formatAssetTypeLabel(asset.libraryCategory),
        title: asset.title,
        content: asset.summary,
        tags: asset.tags.slice(0, 3),
        sources: primarySource
          ? [
              {
                id: primarySource.id,
                label: primarySource.docName,
                kind: primarySource.kind,
                storage: primarySource.storage,
                docId: primarySource.docId,
                dataSourceId: primarySource.dataSourceId,
                quote: primarySource.quote,
              },
            ]
          : [],
        people: toPeople(
          linkedSources.flatMap(source => source.participants),
          { name: 'Me', kind: 'human' }
        ),
        relatedIds: asset.relatedAssetIds,
        evidence: asset.evidence,
        statusLabel: `${asset.layer} · ${formatAssetStatusLabel(asset.status)}`,
      };
    });
  }, [extractedKeyPoints, memoryAssets, memorySourceLinks]);

  const insightPreviewCards = useMemo(
    () => allInsightKnowledgeCards.slice(0, 6),
    [allInsightKnowledgeCards]
  );

  const buildMemoReply = (query: string) => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) {
      if (extractedKeyPoints.length === 0 && showSampleSources) {
        return '这页已经先把可能形成的记忆线索、知识摘要和数据源处理链路铺出来了，你可以先按完整叙事去判断 1.0 和 2.0 是否对齐。';
      }

      if (extractedKeyPoints.length > 0) {
        return `我可以帮你从 ${extractedKeyPoints.length} 条洞察、${rawDataItems.length} 份数据源和 ${memoryNodes.length} 个自定义节点里快速定位记忆。`;
      }

      return '我可以帮你快速查看基础记忆、正在形成的洞察卡片，以及当前接入的数据源。';
    }

    if (/偏好|who|about|identity/.test(normalizedQuery)) {
      return `你当前的长期偏好会落在“关于我”里：${compactPreview(
        whoAmIDocContent,
        baseWhoAmI
      )}`;
    }

    if (/最近|今天|推进|progress|recent/.test(normalizedQuery)) {
      return allInsightKnowledgeCards.length > 0
        ? `最近最清晰的一条资产是「${allInsightKnowledgeCards[0].title}」。当前它还挂在「${allInsightKnowledgeCards[0].sources[0]?.label ?? 'Memory'}」这条来源上。`
        : `最近的推进主线还是围绕目标在走：${baseGoals.join('；')}。`;
    }

    if (/目标|goal|focus/.test(normalizedQuery)) {
      return `你当前的目标摘要是：${listPreview(
        goalDocContent,
        baseGoals[0]
      ).join('；')}`;
    }

    if (/资料|source|数据源|提炼/.test(normalizedQuery)) {
      return rawDataItems.length > 0
        ? `当前共有 ${rawDataItems.length} 份数据源，最近一份是「${rawDataItems[0].name}」。如果要继续形成记忆，可以直接从下面的数据源列表开始。`
        : `当前还没有真实接入的数据源，不过这页已经先把完整处理链路铺出来了，像「${dataSourceRows[0]?.name ?? '飞书妙记：03/24 产品同步'}」这种就是现在更接近的展示方式。`;
    }

    if (/挂载|agent|mount/.test(normalizedQuery)) {
      return `当前最适合挂载给 agent 的，还是已经比较稳定的基础判断：${knowledgeSummary.slice(0, 2).join('；')}。`;
    }

    if (/洞察|timeline|形成|signal|knowledge/.test(normalizedQuery)) {
      return extractedKeyPoints.length > 0
        ? `现在已经有 ${extractedKeyPoints.length} 张洞察卡片，最近一张是「${extractedKeyPoints[0].title || extractedKeyPoints[0].text}」。`
        : `当前还没有真实提炼出的洞察卡片，但这页已经先把资产卡的展示方式铺出来了，像「${allInsightKnowledgeCards[0]?.title ?? 'Knowledge 暂不升级为一级导航，继续归属 Memory'}」这种，就是当前更接近的呈现方式。`;
    }

    return `我先按 “${query}” 理解你的问题。你可以继续往下看基础记忆、洞察卡片和数据源列表，它们已经按 2.0 的展示方式排好了。`;
  };

  const dataSourceRows = useMemo<DataSourceRowRecord[]>(() => {
    if (!showSampleSources) {
      return rawDataItems.map(item => {
        const linkedInsights = extractedKeyPoints.filter(point =>
          normalize(point.source).includes(normalize(item.name))
        );
        const badge =
          extractionRunning
            ? {
                badgeLabel: '提炼中',
                badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
              }
            : linkedInsights.length > 0
              ? {
                  badgeLabel: '已沉淀',
                  badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
                }
              : {
                  badgeLabel: '待处理',
                  badgeClassName: 'border-stone-200 bg-stone-100 text-stone-600',
                };

        return {
          id: item.id,
          name: item.name,
          typeLabel: item.type,
          summaryMeta: `${formatBytes(item.size)} · ${item.source === 'file' ? '文件' : '粘贴'}${linkedInsights.length > 0 ? ` · ${linkedInsights.length} 条洞察` : ''}`,
          uploadedAtLabel: formatDateLabel(item.uploadedAt),
          badgeLabel: badge.badgeLabel,
          badgeClassName: badge.badgeClassName,
          sample: false,
          onClick: () => onOpenRawData(item),
        };
      });
    }

    return memoryDataSources.slice(0, 4).map(source => {
      const badge =
        source.status === 'syncing'
          ? {
              badgeLabel: '提炼中',
              badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
            }
          : source.status === 'reviewing'
            ? {
                badgeLabel: '待复核',
                badgeClassName: 'border-sky-200 bg-sky-50 text-sky-700',
              }
            : {
                badgeLabel: '已沉淀',
                badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
              };

      return {
        id: source.id,
        name: source.name,
        typeLabel: source.typeLabel,
        summaryMeta: source.summary,
        uploadedAtLabel: source.freshness,
        badgeLabel: badge.badgeLabel,
        badgeClassName: badge.badgeClassName,
        sample: true,
      };
    });
  }, [extractedKeyPoints, extractionRunning, memoryDataSources, onOpenRawData, rawDataItems, showSampleSources]);

  const memoIntro = '我是专属于你的记忆专家。我可以帮你从记忆中溯源证据、检索关联、洞察灵感。你只要随时问我就好了。';
  const [memoMessages, setMemoMessages] = useState<Array<{ id: string; role: 'assistant' | 'user'; text: string }>>([]);

  const submitMemoQuery = (query: string) => {
    const question = query.trim();
    if (!question) return;

    setMemoMessages(prev => [
      ...prev,
      {
        id: `memo-user-${Date.now()}-${prev.length}`,
        role: 'user',
        text: question,
      },
      {
        id: `memo-assistant-${Date.now()}-${prev.length + 1}`,
        role: 'assistant',
        text: buildMemoReply(question),
      },
    ]);
    setMemoDraft('');
  };

  return (
    <div className="space-y-8 pb-12">
      <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(28,25,23,0.04)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-stone-900">memo agent</h2>
            <div className="max-w-3xl text-sm leading-6 text-stone-500">{memoIntro}</div>
          </div>
        </div>

        {memoMessages.length > 0 && (
          <div className="mt-5 space-y-3">
            {memoMessages.map(message => (
              <div
                key={message.id}
                className={`rounded-[1.35rem] border px-4 py-3 ${
                  message.role === 'assistant'
                    ? 'border-stone-200 bg-stone-50/80'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  {message.role === 'assistant' ? 'memo agent' : '你'}
                </div>
                <p className="text-sm leading-6 text-stone-700">{message.text}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 rounded-[1.35rem] border border-stone-200 bg-stone-50/70 p-3">
          <div className="flex items-start gap-3">
            <div className="mt-2 text-stone-400">
              <Search className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <textarea
                value={memoDraft}
                onChange={event => setMemoDraft(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    submitMemoQuery(memoDraft);
                  }
                }}
                placeholder="问我任何和记忆有关的问题，比如“我最近在推进什么？”"
                rows={3}
                className="w-full resize-none bg-transparent text-sm leading-6 text-stone-800 placeholder:text-stone-400 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => submitMemoQuery(memoDraft)}
              className="shrink-0 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
            >
              发送
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <SearchChip label="我最近在推进什么？" onClick={() => submitMemoQuery('我最近在推进什么？')} />
          <SearchChip label="哪些记忆适合挂载给 agent？" onClick={() => submitMemoQuery('哪些记忆适合挂载给 agent？')} />
          <SearchChip label="现在有哪些记忆还在形成？" onClick={() => submitMemoQuery('现在有哪些记忆还在形成？')} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Base Memory</div>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">基础记忆</h3>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <BaseMemoryCard
            icon={<User className="h-5 w-5" />}
            eyebrow="Identity"
            title="关于我"
            meta="Who am I"
            previewType="memory"
            previewItems={[
              {
                title: '画像摘要',
                body: baseWhoAmI,
              },
            ]}
            onClick={() => onEditProfile('whoami')}
          />
          <BaseMemoryCard
            icon={<Target className="h-5 w-5" />}
            eyebrow="Goals"
            title="我的目标"
            meta="Goal"
            previewType="goals"
            previewItems={baseGoals.map((goal, index) => ({
              label: String(index + 1),
              title: goal,
            }))}
            onClick={() => onEditProfile('goal')}
          />
          <BaseMemoryCard
            icon={<Sparkles className="h-5 w-5" />}
            eyebrow="Knowledge"
            title="知识摘要"
            meta={
              extractedKeyPoints.length > 0
                ? `${extractedKeyPoints.length} 张卡片`
                : allInsightKnowledgeCards.length > 0
                ? `${Math.min(allInsightKnowledgeCards.length, 6)} 张卡片`
                : '等待首批卡片'
            }
            previewType="knowledge"
            previewItems={knowledgeSummary.map(item => ({
              title: item,
            }))}
            onClick={onOpenKeyPointsDocument}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Custom Nodes</div>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">自定义记忆节点</h3>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {memoryNodes.map(node => (
            <button
              key={node.id}
              type="button"
              onClick={() => onEditNode(node)}
              className="rounded-[1.3rem] border border-stone-200 bg-white p-5 text-left shadow-[0_10px_24px_rgba(28,25,23,0.04)] transition-all hover:border-stone-300 hover:bg-stone-50/60"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-stone-900">{node.title}</div>
                    <div className="text-[11px] text-stone-400">{formatDateLabel(node.updatedAt)}</div>
                  </div>
                </div>
              </div>
              <p className="mt-4 line-clamp-4 text-sm leading-6 text-stone-600">
                {node.content || '点击编辑这条长期记忆。'}
              </p>
            </button>
          ))}

          <div className="rounded-[1.3rem] border border-dashed border-stone-300 bg-stone-50/70 p-5">
            {isMemoryNodesExpanded ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                  <Brain className="h-4 w-4 text-violet-600" />
                  添加自定义节点
                </div>
                <input
                  value={memoryNodeInput}
                  onChange={event => onMemoryNodeInputChange(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' && memoryNodeInput.trim()) {
                      void onCreateMemoryNode();
                    }
                    if (event.key === 'Escape') {
                      onCancelMemoryNodeComposer();
                    }
                  }}
                  type="text"
                  placeholder="输入节点名称后回车..."
                  className="w-full rounded-2xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none transition-colors focus:border-stone-300"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void onCreateMemoryNode();
                    }}
                    className="flex-1 rounded-full bg-stone-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={onCancelMemoryNodeComposer}
                    className="flex-1 rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenMemoryNodeComposer}
                className="flex h-full min-h-[210px] w-full flex-col items-center justify-center gap-3 rounded-[1rem] text-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-500 shadow-sm">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-700">新建记忆节点</div>
                  <div className="mt-1 text-xs text-stone-400">保持 1.0 的自定义记忆方式不变</div>
                </div>
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Profile</div>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">Profile</h3>
          </div>
        </div>

        {(isAllInsightsViewOpen ? allInsightKnowledgeCards : insightPreviewCards).length === 0 ? null : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {(isAllInsightsViewOpen ? allInsightKnowledgeCards : insightPreviewCards).map(card => (
                <div key={card.id}>
                  <V2KnowledgeCard
                    card={card}
                    onCardClick={() => onOpenKeyPointsDocument()}
                  />
                </div>
              ))}
            </div>

            {allInsightKnowledgeCards.length > 6 && !isAllInsightsViewOpen ? (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsAllInsightsViewOpen(true)}
                  className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-800"
                >
                  查看全部
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Data Sources</div>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">知识库</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenPasteModal}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
            >
              粘贴文本
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
            >
              <Upload className="h-4 w-4" />
              上传文件
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.35rem] border border-stone-200 bg-white shadow-[0_10px_24px_rgba(28,25,23,0.04)]">
          <div className="grid grid-cols-[minmax(0,1.8fr)_110px_140px_120px] border-b border-stone-200 bg-stone-50/80 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
            <div>名称</div>
            <div>类型</div>
            <div>处理进度</div>
            <div>更新时间</div>
          </div>

          {dataSourceRows.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Database className="mx-auto h-8 w-8 text-stone-300" />
              <div className="mt-3 text-sm font-medium text-stone-500">还没有数据源</div>
              <div className="mt-1 text-xs text-stone-400">先上传一份文档，或者直接粘贴一段内容。</div>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {dataSourceRows.map(row => {
                return (
                  <div
                    key={row.id}
                    className={`grid grid-cols-[minmax(0,1.8fr)_110px_140px_120px] items-center gap-4 px-5 py-4 text-left transition-colors ${
                      row.sample ? 'bg-stone-50/30' : 'hover:bg-stone-50/70'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className={`flex items-start gap-3 ${row.onClick ? 'cursor-pointer' : ''}`}
                        onClick={row.onClick}
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="truncate text-sm font-semibold text-stone-900">{row.name}</div>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                            <span>{row.summaryMeta}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-stone-600">{row.typeLabel}</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${row.badgeClassName}`}>
                        {row.badgeLabel}
                      </span>
                    </div>
                    <div className="text-sm text-stone-500">{row.uploadedAtLabel}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {(recentLogs.length > 0 || extractionRunning) && (
          <div className="rounded-[1.25rem] border border-stone-200 bg-stone-50/80 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Pipeline</div>
            <div className="mt-3 space-y-2">
              {recentLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3 text-sm text-stone-600">
                  <span
                    className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                      log.status === 'running'
                        ? 'bg-amber-500'
                        : log.status === 'pending'
                          ? 'bg-stone-300'
                          : 'bg-emerald-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <div>{log.text}</div>
                    <div className="mt-1 text-xs text-stone-400">{log.time}</div>
                  </div>
                </div>
              ))}
              {extractionRunning ? (
                <div className="text-sm font-medium text-stone-700">记忆提炼正在进行中…</div>
              ) : null}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenRawDataModal}
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
          >
            查看全部资料
          </button>
          <button
            type="button"
            onClick={onOpenExtractionPicker}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
          >
            <Wand2 className="h-4 w-4" />
            开始蒸馏
          </button>
        </div>
      </section>

      <section
        className="rounded-[1.5rem] border border-stone-200 bg-gradient-to-r from-stone-900 to-stone-800 p-6 text-white shadow-[0_16px_40px_rgba(28,25,23,0.18)]"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-100">
              <Sparkles className="h-3.5 w-3.5" />
              Pro
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight">大模型提炼 Pro</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">
              保留 1.0 底部独立入口。需要更完整的提炼能力时，从这里进入付费弹窗或调整模型配置。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenModelConfig}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              模型配置
            </button>
            <button
              type="button"
              onClick={onOpenPricing}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-100"
            >
              查看权益
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
