import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ArrowUpRight,
  Brain,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  Globe,
  Link as LinkIcon,
  MoreVertical,
  Share2,
  Shield,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { getAgentAvatar, getUserAvatar } from '../AgentAvatars';
import { getDocTypeIcon } from '../DocIcons';
import { useLanguage } from '../../i18n/LanguageContext';
import type { DocumentMemoryMeta, WorkspaceDoc } from '../../data/mindxDemo';

interface WorkspaceDocumentsViewProps {
  documents: WorkspaceDoc[];
  currentUserName: string;
  onOpenDocument: (doc: WorkspaceDoc) => void;
  onDeleteDocument?: (id: string) => void;
  onSetLabel?: (id: string) => void;
  onSetAgentPermission?: (id: string) => void;
  onOpenMemory?: (doc: WorkspaceDoc) => void;
  memoryMetaByDocId?: Record<string, DocumentMemoryMeta>;
  highlightedDocId?: string | null;
  emptyMessage?: string;
  autoScrollHighlightedRow?: boolean;
  showOwnerFilterRow?: boolean;
  showLabelFilterRow?: boolean;
  showLabelsColumn?: boolean;
}

export default function WorkspaceDocumentsView({
  documents,
  currentUserName,
  onOpenDocument,
  onDeleteDocument,
  onSetLabel,
  onSetAgentPermission,
  onOpenMemory,
  memoryMetaByDocId,
  highlightedDocId,
  emptyMessage,
  autoScrollHighlightedRow = true,
  showOwnerFilterRow = true,
  showLabelFilterRow = true,
  showLabelsColumn = true,
}: WorkspaceDocumentsViewProps) {
  const { lang, t } = useLanguage();
  const [docSortBy, setDocSortBy] = useState<'lastModified' | 'lastViewed'>('lastModified');
  const [docFilterType, setDocFilterType] = useState<string>('all');
  const [docFilterOwner, setDocFilterOwner] = useState<string>('all');
  const [docFilterLabel, setDocFilterLabel] = useState<string>('all');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isLabelFilterOpen, setIsLabelFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);

  const copy = lang === 'zh'
    ? {
        clearFilters: '清除筛选',
        noDocuments: '还没有文档',
        noMatch: '当前筛选条件下没有文档',
        memory: '记忆',
        memoryStatus: {
          forming: '形成中',
          stable: '已沉淀',
          active: '活跃中',
        },
        openMemory: '查看相关记忆',
        noMemory: '尚无记忆',
        shareDesc: '通过公开链接分享这个文档',
        publicLink: '公开链接',
        anyoneWithLink: '任何拥有链接的人都可以查看这个文档。',
        setLabels: '设置标签',
        setAgentPermission: 'Agent 权限设置',
      }
    : {
        clearFilters: 'Clear filters',
        noDocuments: 'No documents yet',
        noMatch: 'No documents match the current filters',
        memory: 'Memory',
        memoryStatus: {
          forming: 'Forming',
          stable: 'Stable',
          active: 'Active',
        },
        openMemory: 'Open related memory',
        noMemory: 'No linked memory yet',
        shareDesc: 'Share this document via a public link',
        publicLink: 'Public Link',
        anyoneWithLink: 'Anyone with this link can view this document.',
        setLabels: 'Set labels',
        setAgentPermission: 'Agent permission',
      };

  const docTypes = useMemo(() => Array.from(new Set(documents.map(doc => doc.type))), [documents]);

  const docOwners = useMemo(() => {
    const owners = Array.from(new Set(documents.map(doc => doc.creatorName)));
    return owners.sort((a, b) => {
      if (a === currentUserName) return -1;
      if (b === currentUserName) return 1;
      return a.localeCompare(b);
    });
  }, [currentUserName, documents]);

  const docLabels = useMemo(
    () => Array.from(new Set(documents.flatMap(doc => doc.labels))).sort(),
    [documents]
  );

  const filteredAndSortedDocs = useMemo(() => {
    let nextDocs = [...documents];

    if (docFilterType !== 'all') {
      nextDocs = nextDocs.filter(doc => doc.type === docFilterType);
    }

    if (docFilterOwner !== 'all') {
      nextDocs = nextDocs.filter(doc => doc.creatorName === docFilterOwner);
    }

    if (docFilterLabel !== 'all') {
      nextDocs = nextDocs.filter(doc => doc.labels.includes(docFilterLabel));
    }

    nextDocs.sort((a, b) => {
      const dateA = new Date(a[docSortBy]).getTime();
      const dateB = new Date(b[docSortBy]).getTime();
      return dateB - dateA;
    });

    return nextDocs;
  }, [documents, docFilterLabel, docFilterOwner, docFilterType, docSortBy]);

  const activeFilterCount =
    (docFilterType !== 'all' ? 1 : 0) +
    (docFilterOwner !== 'all' ? 1 : 0) +
    (docFilterLabel !== 'all' ? 1 : 0);

  const showMemoryColumn = Boolean(memoryMetaByDocId);

  useEffect(() => {
    if (!autoScrollHighlightedRow) return;
    if (!highlightedDocId) return;
    const target = document.querySelector<HTMLElement>(`[data-doc-row="${highlightedDocId}"]`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [autoScrollHighlightedRow, highlightedDocId]);

  return (
    <>
      {showOwnerFilterRow && (
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
          const ownerDoc = documents.find(doc => doc.creatorName === owner);
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
              {ownerDoc?.creatorType === 'agent' ? getAgentAvatar(owner, 14) : getUserAvatar(14)}
              {owner}
            </button>
          );
        })}

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
      )}

      {showLabelFilterRow && (
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        <Tag className="w-3.5 h-3.5 text-stone-300 shrink-0" />
        {docLabels.map(label => {
          const count = documents.filter(doc => doc.labels.includes(label)).length;
          return (
            <button
              key={label}
              onClick={() => setDocFilterLabel(docFilterLabel === label ? 'all' : label)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                docFilterLabel === label
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
              }`}
            >
              {label}
              <span
                className={`text-[10px] ${
                  docFilterLabel === label ? 'text-stone-300' : 'text-stone-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      )}

      <div className="border border-stone-200/80 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-visible">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50/50 text-stone-500 border-b border-stone-200/80 rounded-t-xl [&>tr>th:first-child]:rounded-tl-xl [&>tr>th:last-child]:rounded-tr-xl">
            <tr>
              <th className="px-6 py-3 font-medium bg-stone-50/50">
                <div className="relative inline-flex items-center">
                  <button
                    onClick={() => {
                      setIsTypeFilterOpen(!isTypeFilterOpen);
                      setIsSortMenuOpen(false);
                      setIsLabelFilterOpen(false);
                    }}
                    className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${
                      docFilterType !== 'all' ? 'text-stone-900' : ''
                    }`}
                  >
                    {t('docs.name')}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isTypeFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isTypeFilterOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsTypeFilterOpen(false)} />
                      <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          {t('docs.filterByType')}
                        </div>
                        <button
                          onClick={() => {
                            setDocFilterType('all');
                            setIsTypeFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${
                            docFilterType === 'all'
                              ? 'bg-stone-50 text-stone-900 font-medium'
                              : 'text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {t('docs.allTypes')}
                        </button>
                        {docTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              setDocFilterType(type);
                              setIsTypeFilterOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${
                              docFilterType === type
                                ? 'bg-stone-50 text-stone-900 font-medium'
                                : 'text-stone-600 hover:bg-stone-50'
                            }`}
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

              <th className="px-6 py-3 font-medium">{t('docs.owner')}</th>

              {showLabelsColumn && (
              <th className="px-6 py-3 font-medium">
                <div className="relative inline-flex items-center">
                  <button
                    onClick={() => {
                      setIsLabelFilterOpen(!isLabelFilterOpen);
                      setIsTypeFilterOpen(false);
                      setIsSortMenuOpen(false);
                    }}
                    className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${
                      docFilterLabel !== 'all' ? 'text-stone-900' : ''
                    }`}
                  >
                    {t('docs.labels')}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isLabelFilterOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isLabelFilterOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsLabelFilterOpen(false)} />
                      <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1 max-h-64 overflow-y-auto">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          {t('docs.filterByLabel')}
                        </div>
                        <button
                          onClick={() => {
                            setDocFilterLabel('all');
                            setIsLabelFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${
                            docFilterLabel === 'all'
                              ? 'bg-stone-50 text-stone-900 font-medium'
                              : 'text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {t('docs.allLabels')}
                        </button>
                        {docLabels.map(label => (
                          <button
                            key={label}
                            onClick={() => {
                              setDocFilterLabel(label);
                              setIsLabelFilterOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${
                              docFilterLabel === label
                                ? 'bg-stone-50 text-stone-900 font-medium'
                                : 'text-stone-600 hover:bg-stone-50'
                            }`}
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
              )}

              {showMemoryColumn && <th className="px-6 py-3 font-medium">{copy.memory}</th>}

              <th className="px-6 py-3 font-medium whitespace-nowrap">
                <div className="relative inline-flex items-center">
                  <button
                    onClick={() => {
                      setIsSortMenuOpen(!isSortMenuOpen);
                      setIsTypeFilterOpen(false);
                      setIsLabelFilterOpen(false);
                    }}
                    className="flex items-center gap-1.5 hover:text-stone-800 transition-colors whitespace-nowrap"
                  >
                    {docSortBy === 'lastModified' ? t('docs.lastModified') : t('docs.lastViewed')}
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                  {isSortMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsSortMenuOpen(false)} />
                      <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          {t('docs.sortBy')}
                        </div>
                        <button
                          onClick={() => {
                            setDocSortBy('lastModified');
                            setIsSortMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${
                            docSortBy === 'lastModified'
                              ? 'bg-stone-50 text-stone-900 font-medium'
                              : 'text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {t('docs.lastModified')}
                          {docSortBy === 'lastModified' && (
                            <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setDocSortBy('lastViewed');
                            setIsSortMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${
                            docSortBy === 'lastViewed'
                              ? 'bg-stone-50 text-stone-900 font-medium'
                              : 'text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {t('docs.lastViewed')}
                          {docSortBy === 'lastViewed' && (
                            <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </th>

              {(onDeleteDocument || onSetLabel || onSetAgentPermission) && (
                <th className="px-6 py-3 font-medium text-right" />
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredAndSortedDocs.length === 0 ? (
              <tr>
                <td
                  colSpan={4 + (showLabelsColumn ? 1 : 0) + (showMemoryColumn ? 1 : 0)}
                  className="px-6 py-12 text-center text-stone-500"
                >
                  {activeFilterCount > 0 ? (
                    <div>
                      <p>{copy.noMatch}</p>
                      <button
                        onClick={() => {
                          setDocFilterType('all');
                          setDocFilterOwner('all');
                          setDocFilterLabel('all');
                        }}
                        className="mt-2 text-sm text-stone-600 underline hover:text-stone-900 transition-colors"
                      >
                        {copy.clearFilters}
                      </button>
                    </div>
                  ) : (
                    <p>{emptyMessage ?? copy.noDocuments}</p>
                  )}
                </td>
              </tr>
            ) : (
              filteredAndSortedDocs.map(doc => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  date={docSortBy === 'lastModified' ? doc.lastModified : doc.lastViewed}
                  highlight={doc.id === highlightedDocId}
                  showLabelsColumn={showLabelsColumn}
                  showMemoryColumn={showMemoryColumn}
                  memoryMeta={memoryMetaByDocId?.[doc.id]}
                  copy={copy}
                  onDeleteDocument={onDeleteDocument}
                  onOpenDocument={onOpenDocument}
                  onOpenMemory={onOpenMemory}
                  onSetAgentPermission={onSetAgentPermission}
                  onSetLabel={onSetLabel}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

interface DocumentRowProps {
  key?: React.Key;
  doc: WorkspaceDoc;
  date: string;
  highlight?: boolean;
  showLabelsColumn: boolean;
  showMemoryColumn: boolean;
  memoryMeta?: DocumentMemoryMeta;
  copy: {
    clearFilters: string;
    noDocuments: string;
    noMatch: string;
    memory: string;
    memoryStatus: Record<'forming' | 'stable' | 'active', string>;
    openMemory: string;
    noMemory: string;
    shareDesc: string;
    publicLink: string;
    anyoneWithLink: string;
    setLabels: string;
    setAgentPermission: string;
  };
  onOpenDocument: (doc: WorkspaceDoc) => void;
  onDeleteDocument?: (id: string) => void;
  onSetLabel?: (id: string) => void;
  onSetAgentPermission?: (id: string) => void;
  onOpenMemory?: (doc: WorkspaceDoc) => void;
}

function DocumentRow({
  doc,
  date,
  highlight,
  showLabelsColumn,
  showMemoryColumn,
  memoryMeta,
  copy,
  onOpenDocument,
  onDeleteDocument,
  onSetLabel,
  onSetAgentPermission,
  onOpenMemory,
}: DocumentRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPublicLink, setIsPublicLink] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const { t } = useLanguage();

  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    if (Number.isNaN(dateObj.getTime())) return dateStr;

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

  const memoryTone = memoryMeta
    ? {
        forming: 'bg-[#F9F9F8] border-zinc-200 text-zinc-700',
        stable: 'bg-white border-zinc-200 text-zinc-700',
        active: 'bg-indigo-50 border-indigo-100 text-indigo-700',
      }[memoryMeta.status]
    : '';

  const handleDownload = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuOpen(false);
    const content = `# ${doc.name}\n\nType: ${doc.type}\nCreated by: ${doc.creatorName}\nDate: ${doc.date}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.name.replace(/[^a-zA-Z0-9\\s-]/g, '').replace(/\s+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <tr
      data-doc-row={doc.id}
      className={`group cursor-pointer transition-colors ${
        highlight ? 'bg-indigo-50/40' : 'hover:bg-stone-50'
      }`}
      onClick={() => onOpenDocument(doc)}
    >
      <td className="px-6 py-3">
        <div className="flex items-center gap-3">
          {getDocTypeIcon(doc.type, 18)}
          <div className="min-w-0">
            <span className="font-medium text-stone-800 block truncate">{doc.name}</span>
            <span className="text-xs text-stone-400">{doc.type}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-3">
        <div className="flex items-center gap-2 text-stone-500">
          {doc.creatorType === 'agent' ? getAgentAvatar(doc.creatorName, 18) : getUserAvatar(18)}
          <span className="text-sm">{doc.creatorName}</span>
        </div>
      </td>
      {showLabelsColumn && (
      <td className="px-6 py-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {doc.labels.map(label => (
            <span
              key={label}
              className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-xs font-medium px-2 py-0.5 rounded-full"
            >
              <Tag className="w-3 h-3 text-stone-400 shrink-0" />
              {label}
            </span>
          ))}
          {doc.labels.length === 0 && <span className="text-stone-300 text-xs">—</span>}
        </div>
      </td>
      )}
      {showMemoryColumn && (
        <td className="px-6 py-3">
          {memoryMeta ? (
            <button
              onClick={event => {
                event.stopPropagation();
                onOpenMemory?.(doc);
              }}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all hover:shadow-sm ${memoryTone}`}
            >
              <Brain className="w-4 h-4 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
                  <span>{copy.memoryStatus[memoryMeta.status]}</span>
                  <span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] tracking-normal">
                    {memoryMeta.count}
                  </span>
                </div>
                <p className="text-xs mt-1 text-stone-600 truncate">{memoryMeta.latest}</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-stone-500" />
            </button>
          ) : (
            <span className="text-xs text-stone-400">{copy.noMemory}</span>
          )}
        </td>
      )}
      <td className="px-6 py-3 text-stone-500 text-sm whitespace-nowrap">{formatDate(date)}</td>
      {(onDeleteDocument || onSetLabel || onSetAgentPermission) && (
        <td className="px-6 py-3 text-right">
          <div className="relative inline-block">
            <button
              className="p-1 rounded hover:bg-stone-200 text-stone-400 opacity-0 group-hover:opacity-100 transition-all"
              onClick={event => {
                event.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                  {onSetLabel && (
                    <button
                      onClick={event => {
                        event.stopPropagation();
                        setIsMenuOpen(false);
                        onSetLabel(doc.id);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <Tag className="w-4 h-4 text-stone-400" />
                      {copy.setLabels}
                    </button>
                  )}
                  {onSetAgentPermission && (
                    <button
                      onClick={event => {
                        event.stopPropagation();
                        setIsMenuOpen(false);
                        onSetAgentPermission(doc.id);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-stone-400" />
                      {copy.setAgentPermission}
                    </button>
                  )}
                  {(onSetLabel || onSetAgentPermission) && <div className="border-t border-stone-100 my-0.5" />}
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Download className="w-4 h-4 text-stone-400" />
                    {t('docs.actions.download')}
                  </button>
                  <button
                    onClick={event => {
                      event.stopPropagation();
                      setIsMenuOpen(false);
                      setIsShareOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-stone-400" />
                    {t('docs.actions.share')}
                  </button>
                  {onDeleteDocument && (
                    <>
                      <div className="border-t border-stone-100 my-0.5" />
                      <button
                        onClick={event => {
                          event.stopPropagation();
                          setIsMenuOpen(false);
                          onDeleteDocument(doc.id);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                        {t('docs.actions.delete')}
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {isShareOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsShareOpen(false)} />
              <div
                className="absolute right-0 top-full mt-1 w-72 bg-white border border-stone-200 rounded-xl shadow-2xl z-40 overflow-hidden"
                onClick={event => event.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-stone-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Share2 className="w-4 h-4 text-stone-500" />
                    <span className="text-sm font-semibold text-stone-900">{t('share.title')}</span>
                  </div>
                  <p className="text-xs text-stone-400">{copy.shareDesc}</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-stone-400" />
                      <span className="text-sm text-stone-700">{copy.publicLink}</span>
                    </div>
                    <button
                      onClick={event => {
                        event.stopPropagation();
                        setIsPublicLink(!isPublicLink);
                      }}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        isPublicLink ? 'bg-stone-900' : 'bg-stone-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                          isPublicLink ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  {isPublicLink && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                        <LinkIcon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="text-xs text-stone-500 truncate flex-1">
                          mindx.app/s/{doc.id.slice(0, 8)}
                        </span>
                        <button
                          onClick={event => {
                            event.stopPropagation();
                            navigator.clipboard.writeText(`https://mindx.app/s/${doc.id.slice(0, 8)}`);
                            setShareCopied(true);
                            setTimeout(() => setShareCopied(false), 2000);
                          }}
                          className="shrink-0 p-1 rounded hover:bg-stone-200 transition-colors"
                        >
                          {shareCopied ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-stone-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-400">{copy.anyoneWithLink}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </td>
      )}
    </tr>
  );
}
