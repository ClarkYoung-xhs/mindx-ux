import {
  Brain,
  Database,
  FileText,
  MessageSquareText,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
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
  context?: string;
  original_quote?: string;
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
  activeMemoryView: 'profile' | 'rawdata';
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
  rawDataLoading?: boolean;
  extractionRunning: boolean;
  extractionLogs: ExtractionLog[];
  onOpenPasteModal: () => void;
  onOpenRawDataModal: () => void;
  onOpenRawData: (item: RawDataItem) => void;
  onDeleteRawData?: (id: string) => void;
  onRenameRawData?: (id: string, newName: string) => void;
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
  activeMemoryView,
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
  rawDataLoading,
  extractionRunning,
  extractionLogs,
  onOpenPasteModal,
  onOpenRawDataModal,
  onOpenRawData,
  onDeleteRawData,
  onRenameRawData,
  onOpenPricing,
  onOpenModelConfig,
  onOpenExtractionPicker,
}: MemoryTabViewProps) {
  const { memoryAssets, memoryDataSources, memorySourceLinks } = useMindXDemo();
  const [isAllInsightsViewOpen, setIsAllInsightsViewOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const recentLogs = extractionLogs.slice(0, 3);
  const showSampleBaseMemory = !whoAmIDocContent.trim() && !goalDocContent.trim();


  const baseWhoAmI = whoAmIDocContent.trim()
    ? compactPreview(whoAmIDocContent, '')
    : '暂未设定核心身份画像';
  const baseGoals = goalDocContent.trim()
    ? listPreview(goalDocContent, '')
    : [
        '当前还未明确长期目标',
      ];

  const sampleKnowledgeSummary = useMemo(() => {
    return memoryAssets.slice(0, 2).map(asset => asset.title);
  }, [memoryAssets]);

  const knowledgeSummary = useMemo(() => {
    if (extractedKeyPoints.length === 0) {
      if (rawDataItems.length > 0) {
        return ['当前已经接入数据源', '完成第一轮提炼后，洞察卡片会出现在这里'];
      }

      return ['还没有沉淀出的记忆卡片', '先从数据源里提炼第一批洞察'];
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

    return [];
  }, [extractedKeyPoints, memorySourceLinks]);

  const insightPreviewCards = useMemo(
    () => allInsightKnowledgeCards.slice(0, 6),
    [allInsightKnowledgeCards]
  );


  const dataSourceRows = useMemo<DataSourceRowRecord[]>(() => {
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
  }, [extractedKeyPoints, extractionRunning, onOpenRawData, rawDataItems]);


  return (
    <div className="space-y-8 pb-12">

      {/* ═══════════════════ PROFILE — 萃取给 Agent 读的数据 ═══════════════════ */}
      {activeMemoryView === 'profile' && (
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Profile</div>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">萃取数据</h3>
            <p className="mt-1 text-xs text-stone-400">从原始数据中蒸馏出的结构化信息，供 Agent 随时读取</p>
          </div>
        </div>

        {/* Base Memory Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <BaseMemoryCard
            icon={<User className="h-5 w-5" />}
            eyebrow="Identity"
            title="关于我"
            meta="Who am I"
            previewType="memory"
            previewItems={[{ title: '画像摘要', body: baseWhoAmI }]}
            onClick={() => onEditProfile('whoami')}
          />
          <BaseMemoryCard
            icon={<Target className="h-5 w-5" />}
            eyebrow="Goals"
            title="我的目标"
            meta="Goal"
            previewType="goals"
            previewItems={baseGoals.map((goal, index) => ({ label: String(index + 1), title: goal }))}
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
            previewItems={knowledgeSummary.map(item => ({ title: item }))}
            onClick={onOpenKeyPointsDocument}
          />
        </div>

        {/* Profile 4-Dimension Signal Cards */}
        {extractedKeyPoints.length > 0 && (
          <div className="space-y-8 mt-8">
            {[
              { type: 'preference', label: '偏好', desc: '对某类问题的倾向，未触发的决策', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              { type: 'judgment', label: '判断', desc: '对特定问题的理解与结论', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { type: 'choice', label: '选择', desc: '在具体情境下做了什么或放弃了什么', color: 'bg-amber-50 text-amber-700 border-amber-200' },
              { type: 'decision', label: '决策', desc: '承诺了什么，基于什么约束', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            ].map((pt) => {
              const pointsForType = extractedKeyPoints.filter(p => p.type?.toLowerCase() === pt.type || p.type === pt.label);
              if (pointsForType.length === 0) return null;
              
              return (
                <div key={pt.type} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${pt.color}`}>
                      {pt.label}
                    </span>
                    <span className="text-sm text-stone-500">{pt.desc}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pointsForType.map(point => (
                      <div key={point.id} className="relative flex flex-col justify-between overflow-hidden rounded-[1.25rem] border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer" onClick={() => onOpenKeyPointsDocument()}>
                        <div className="space-y-3">
                          <h4 className="text-[15px] font-semibold leading-snug text-stone-900 border-l-[3px] pl-3 border-stone-800">
                            {point.text || point.title}
                          </h4>
                          {point.context && (
                            <div className="rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-600 border border-stone-100">
                              <span className="font-semibold text-stone-700">场景设定：</span>
                              {point.context}
                            </div>
                          )}
                          {point.original_quote && (
                            <div className="text-[13px] italic text-stone-400">
                              "{point.original_quote}"
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-stone-400">
                          <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> {point.source || "Unknown"}</span>
                          <span>{point.createdAt ? new Date(point.createdAt).toLocaleDateString() : '刚刚'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      )}

      {/* ═══════════════════ RAW DATA — 导入的原始数据 ═══════════════════ */}
      {activeMemoryView === 'rawdata' && (
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Raw Data</div>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">原始数据</h3>
            <p className="mt-1 text-xs text-stone-400">导入的文档、笔记等原始素材，等待蒸馏为 Profile</p>
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

        {/* Data Sources Table */}
        <div className="overflow-hidden rounded-[1.35rem] border border-stone-200 bg-white shadow-[0_10px_24px_rgba(28,25,23,0.04)]">
          <div className="grid grid-cols-[minmax(0,1.8fr)_110px_140px_120px_40px] border-b border-stone-200 bg-stone-50/80 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
            <div>名称</div>
            <div>类型</div>
            <div>处理进度</div>
            <div>更新时间</div>
          </div>

          {rawDataLoading ? (
            <div className="divide-y divide-stone-100">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="grid grid-cols-[minmax(0,1.8fr)_110px_140px_120px] items-center gap-4 px-5 py-4"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-stone-100 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 rounded-full bg-stone-100 animate-pulse" style={{ width: `${70 - i * 12}%`, animationDelay: `${i * 120}ms` }} />
                      <div className="h-2.5 rounded-full bg-stone-50 animate-pulse" style={{ width: `${45 - i * 8}%`, animationDelay: `${i * 120 + 60}ms` }} />
                    </div>
                  </div>
                  <div className="h-3 w-16 rounded-full bg-stone-100 animate-pulse" style={{ animationDelay: `${i * 120 + 40}ms` }} />
                  <div className="h-5 w-14 rounded-full bg-stone-50 animate-pulse" style={{ animationDelay: `${i * 120 + 80}ms` }} />
                  <div className="h-3 w-16 rounded-full bg-stone-100 animate-pulse" style={{ animationDelay: `${i * 120 + 100}ms` }} />
                </div>
              ))}
            </div>
          ) : dataSourceRows.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Database className="mx-auto h-8 w-8 text-stone-300" />
              <div className="mt-3 text-sm font-medium text-stone-500">还没有数据源</div>
              <div className="mt-1 text-xs text-stone-400">先上传一份文档，或者直接粘贴一段内容。</div>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {dataSourceRows.map(row => (
                <div
                  key={row.id}
                  className={`group/row grid grid-cols-[minmax(0,1.8fr)_110px_140px_120px_40px] items-center gap-4 px-5 py-4 text-left transition-colors ${
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
                          {editingRowId === row.id ? (
                            <input
                              autoFocus
                              className="text-sm font-semibold text-stone-900 bg-white border border-stone-300 rounded-md px-2 py-0.5 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-300 w-full"
                              defaultValue={row.name}
                              onBlur={(e) => {
                                const v = e.target.value.trim();
                                if (v && v !== row.name && onRenameRawData) onRenameRawData(row.id, v);
                                setEditingRowId(null);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); }
                                if (e.key === 'Escape') { setEditingRowId(null); }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <>
                              <div className="truncate text-sm font-semibold text-stone-900">{row.name}</div>
                              {onRenameRawData && !row.sample && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingRowId(row.id); }}
                                  className="opacity-0 group-hover/row:opacity-100 p-0.5 rounded text-stone-400 hover:text-stone-600 transition-all shrink-0"
                                  title="重命名"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                              )}
                            </>
                          )}
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
                  <div className="flex justify-end">
                    {onDeleteRawData && !row.sample && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteRawData(row.id); }}
                        className="opacity-0 group-hover/row:opacity-100 p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="删除"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pipeline Logs */}
        {(recentLogs.length > 0 || extractionRunning) && (
          <div className="rounded-[1.25rem] border border-stone-200 bg-stone-50/80 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">Pipeline</div>
            <div className="mt-3 space-y-2">
              {recentLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3 text-sm text-stone-600">
                  <span
                    className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                      log.status === 'running' ? 'bg-amber-500' : log.status === 'pending' ? 'bg-stone-300' : 'bg-emerald-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <div>{log.text}</div>
                    <div className="mt-1 text-xs text-stone-400">{log.time}</div>
                  </div>
                </div>
              ))}
              {extractionRunning ? <div className="text-sm font-medium text-stone-700">蒸馏正在进行中…</div> : null}
            </div>
          </div>
        )}

        {/* Action Buttons */}
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
      )}

      <section
        className="rounded-[1.5rem] border border-stone-200 bg-stone-50/80 p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">大模型提炼 Pro</h3>
              <p className="text-xs text-stone-500">
                更完整的提炼能力，调整模型配置
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenModelConfig}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-50"
            >
              模型配置
            </button>
            <button
              type="button"
              onClick={onOpenPricing}
              className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
            >
              查看权益
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
