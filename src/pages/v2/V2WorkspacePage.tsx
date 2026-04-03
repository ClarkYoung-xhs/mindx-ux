import { Bookmark, Brain, CalendarDays, EyeOff, FileText, Timer } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import WorkspaceDocumentsView from '../../components/workspace/WorkspaceDocumentsView';
import { buildDocumentMemoryMeta, currentUser, type WorkspaceDoc } from '../../data/mindxDemo';
import { useMindXDemo } from '../../data/mindxDemoContext';
import { useLanguage } from '../../i18n/LanguageContext';
import V2ModuleHeader from './V2ModuleHeader';
import { useWorkspaceCreateActions } from './useV2ModuleActions';

type SceneFilter = 'all' | 'today' | 'unread' | 'scheduled' | 'webclip' | 'memory';

type WorkspaceDocWithScene = WorkspaceDoc & {
  source?: 'scheduled' | 'webclip' | 'memory' | 'normal';
  isNew?: boolean;
};

export default function V2WorkspacePage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { documents, memoryAssets } = useMindXDemo();
  const workspaceCreateActions = useWorkspaceCreateActions();
  const [docSceneFilter, setDocSceneFilter] = useState<SceneFilter>('all');
  const [highlightedDocId, setHighlightedDocId] = useState<string | null>(searchParams.get('doc'));

  useEffect(() => {
    setHighlightedDocId(searchParams.get('doc'));
  }, [searchParams]);

  const documentMemoryMeta = useMemo(() => buildDocumentMemoryMeta(memoryAssets), [memoryAssets]);

  const sceneTabs = useMemo(
    () =>
      [
        { key: 'all' as const, label: lang === 'zh' ? '全部文档' : 'All', icon: <FileText className="w-3.5 h-3.5" /> },
        { key: 'today' as const, label: lang === 'zh' ? '今日更新' : 'Today', icon: <CalendarDays className="w-3.5 h-3.5" /> },
        { key: 'unread' as const, label: lang === 'zh' ? '未读文档' : 'Unread', icon: <EyeOff className="w-3.5 h-3.5" /> },
        { key: 'scheduled' as const, label: lang === 'zh' ? '定时任务' : 'Scheduled', icon: <Timer className="w-3.5 h-3.5" /> },
        { key: 'webclip' as const, label: lang === 'zh' ? '网页剪藏' : 'Web Clips', icon: <Bookmark className="w-3.5 h-3.5" /> },
        { key: 'memory' as const, label: lang === 'zh' ? '我的记忆' : 'Memories', icon: <Brain className="w-3.5 h-3.5" /> },
      ],
    [lang]
  );

  const filteredDocuments = useMemo(() => {
    const docs = [...documents] as WorkspaceDocWithScene[];

    if (docSceneFilter === 'today') {
      const today = new Date().toISOString().slice(0, 10);
      return docs.filter(doc => doc.lastModified.slice(0, 10) === today);
    }

    if (docSceneFilter === 'unread') {
      return docs.filter(doc => doc.isNew === true);
    }

    if (docSceneFilter === 'scheduled') {
      return docs.filter(doc => doc.source === 'scheduled');
    }

    if (docSceneFilter === 'webclip') {
      return docs.filter(doc => doc.source === 'webclip');
    }

    if (docSceneFilter === 'memory') {
      return docs.filter(doc => doc.source === 'memory');
    }

    return docs;
  }, [docSceneFilter, documents]);

  return (
    <div>
      <V2ModuleHeader
        title={lang === 'zh' ? '文档' : 'Documents'}
        actionLabel={lang === 'zh' ? '新建文档' : 'New document'}
        actionItems={workspaceCreateActions}
      />

      <div className="flex items-center gap-1 mt-[26px] mb-4 flex-wrap">
        {sceneTabs.map(tab => (
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

      <WorkspaceDocumentsView
        documents={filteredDocuments}
        currentUserName={currentUser.name}
        highlightedDocId={highlightedDocId}
        autoScrollHighlightedRow={Boolean(highlightedDocId)}
        memoryMetaByDocId={documentMemoryMeta}
        showOwnerFilterRow={false}
        showLabelFilterRow={false}
        showLabelsColumn={false}
        onOpenDocument={doc => {
          navigate(`/document?id=${doc.id}&type=${doc.type.toLowerCase().replace(/\s+/g, '')}&from=v2-workspace`);
        }}
        onOpenMemory={doc => navigate(`/v2/memory/timeline?doc=${doc.id}&from=workspace`)}
      />
    </div>
  );
}
