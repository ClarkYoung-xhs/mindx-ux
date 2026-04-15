import { useMemo, useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Table2,
  Globe,
  MoreHorizontal,
  Share2,
  FilePlus2,
  Download,
  Copy,
  Trash2,
  Check,
  Link2,
  Database,
  Clock,
  ChevronRight,
  FileImage,
  ChevronDown,
  Lock,
  Bot,
  Code,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useMindXDemo } from "../../data/mindxDemoContext";
import { allCanvasBlocks } from "../../data/canvasMockData";
import { allSheets } from "../../data/sheetMockData";
import { allPages } from "../../data/pageMockData";
import BlockList from "../../components/BlockRenderer/BlockList";
import SheetView from "../../components/SheetRenderer/SheetView";
import type { WorkspaceDoc } from "../../data/mindxDemo";
import { useLanguage } from "../../i18n/LanguageContext";
import VersionHistory from "../../components/VersionHistory";

/** Recursively find a document by id in a nested tree */
function findDocById(docs: WorkspaceDoc[], id: string): WorkspaceDoc | null {
  for (const doc of docs) {
    if (doc.id === id) return doc;
    if (doc.children) {
      const found = findDocById(doc.children, id);
      if (found) return found;
    }
  }
  return null;
}

function DocTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "Smart Canvas":
      return <FileText className="w-5 h-5 text-stone-500" />;
    case "Smart Sheet":
      return <Table2 className="w-5 h-5 text-stone-500" />;
    case "Page":
      return <Globe className="w-5 h-5 text-stone-500" />;
    default:
      return <FileText className="w-5 h-5 text-stone-500" />;
  }
}

/**
 * V2DocumentDetailPage — renders a document's content inline within the V2Layout.
 * Supports Smart Canvas (BlockList), Smart Sheet (SheetView), and Page (iframe).
 */
export default function V2DocumentDetailPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const { documents, setDocuments } = useMindXDemo();
  const { lang } = useLanguage();
  // Support both /v2/doc/:docId (new) and /v2/workspace/doc?doc=xxx (legacy)
  const docId = params.docId ?? searchParams.get("doc");

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishCopied, setPublishCopied] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showExportSubmenu, setShowExportSubmenu] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [isPublicLink, setIsPublicLink] = useState(false);
  const [pageViewMode, setPageViewMode] = useState<"preview" | "code">("preview"); // Page view mode toggle
  const [codeCopied, setCodeCopied] = useState(false); // Code copied state
  const [sharePanelTab, setSharePanelTab] = useState<"share" | "publish">("share"); // Share panel tab state
  
  // Publish settings
  const [publishEnabled, setPublishEnabled] = useState(false);
  const [customSlug, setCustomSlug] = useState(""); // Custom URL slug after page-
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(true); // Auto update toggle
  const [shareCopied, setShareCopied] = useState(false);
  const [expandedCollaborators, setExpandedCollaborators] = useState<Set<string>>(new Set(['me']));
  const [showAccessSettings, setShowAccessSettings] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const sharePanelRef = useRef<HTMLDivElement>(null);

  // Reset share panel tab when opening
  useEffect(() => {
    if (showSharePanel) {
      setSharePanelTab("share");
    }
  }, [showSharePanel]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showMoreMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(e.target as Node)
      ) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMoreMenu]);

  // Close share panel when clicking outside
  useEffect(() => {
    if (!showSharePanel) return;
    const handleClick = (e: MouseEvent) => {
      if (
        sharePanelRef.current &&
        !sharePanelRef.current.contains(e.target as Node)
      ) {
        setShowSharePanel(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSharePanel]);

  const doc = useMemo(() => {
    if (!docId) return null;
    return findDocById(documents, docId);
  }, [docId, documents]);

  // Resolve blocks for Smart Canvas
  const resolvedBlocks = useMemo(() => {
    if (!doc) return null;
    return doc.blocks ?? allCanvasBlocks[doc.id] ?? null;
  }, [doc]);

  // Resolve sheet data for Smart Sheet
  const resolvedSheetData = useMemo(() => {
    if (!doc) return null;
    return doc.sheetData ?? allSheets[doc.id] ?? null;
  }, [doc]);

  // Resolve HTML content for Page
  const resolvedHtmlContent = useMemo(() => {
    if (!doc) return null;
    return doc.htmlContent ?? allPages[doc.id] ?? null;
  }, [doc]);

  if (!docId || !doc) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-stone-400">
        <FileText className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">No document selected</p>
        <p className="text-sm mt-1">
          Select a document from the sidebar to view it here.
        </p>
      </div>
    );
  }

  const isSmartCanvas = doc.type === "Smart Canvas" && !!resolvedBlocks;
  const isSmartSheet = doc.type === "Smart Sheet" && !!resolvedSheetData;
  const isPage = doc.type === "Page";
  const isEmptyCanvas = doc.type === "Smart Canvas" && (!resolvedBlocks || resolvedBlocks.length === 0);

  // Convert document to Smart Sheet
  const convertToSheet = () => {
    setDocuments((prev) => {
      const updateDoc = (nodes: WorkspaceDoc[]): WorkspaceDoc[] =>
        nodes.map((node) => {
          if (node.id === doc.id) {
            return {
              ...node,
              type: "Smart Sheet",
              blocks: undefined,
              sheetData: {
                columns: [
                  { id: "col1", name: "名称", type: "text" },
                  { id: "col2", name: "状态", type: "select" },
                  { id: "col3", name: "日期", type: "date" },
                ],
                rows: [],
              },
            };
          }
          if (node.children) {
            return { ...node, children: updateDoc(node.children) };
          }
          return node;
        });
      return updateDoc(prev);
    });
  };

  const copy =
    lang === "zh"
      ? {
          share: "分享",
          copyLink: "复制链接",
          linkCopied: "已复制",
          publish: "发布为网页",
          duplicate: "创建副本",
          exportAs: "导出为",
          versionHistory: "版本历史",
          delete: "删除",
          publishTitle: "已发布到互联网",
          publishDesc: "任何拥有链接的人都可以访问此页面",
          publishCopy: "复制链接",
          publishCopied: "已复制",
          publishClose: "关闭",
          exportHTML: "HTML",
          exportMarkdown: "Markdown",
          exportPDF: "PDF",
          exportImage: "图片",
          exportCSV: "CSV",
        }
      : {
          share: "Share",
          copyLink: "Copy link",
          linkCopied: "Copied",
          publish: "Publish as web page",
          duplicate: "Duplicate",
          exportAs: "Export as",
          versionHistory: "Version History",
          delete: "Delete",
          publishTitle: "Published to the web",
          publishDesc: "Anyone with the link can access this page",
          publishCopy: "Copy link",
          publishCopied: "Copied",
          publishClose: "Close",
          exportHTML: "HTML",
          exportMarkdown: "Markdown",
          exportPDF: "PDF",
          exportImage: "Image",
          exportCSV: "CSV",
        };

  // Get export options based on document type
  const getExportOptions = () => {
    if (isSmartSheet) {
      return [
        { label: copy.exportCSV, icon: FileText, action: "csv" },
        { label: copy.exportPDF, icon: FileText, action: "pdf" },
        { label: copy.exportImage, icon: FileImage, action: "image" },
      ];
    }
    if (isPage) {
      // Page type: HTML, PDF, Image
      return [
        { label: copy.exportHTML, icon: Code, action: "html" },
        { label: copy.exportPDF, icon: FileText, action: "pdf" },
        { label: copy.exportImage, icon: FileImage, action: "image" },
      ];
    }
    // For Smart Canvas: Markdown, PDF, Image
    return [
      { label: copy.exportMarkdown, icon: FileText, action: "markdown" },
      { label: copy.exportPDF, icon: FileText, action: "pdf" },
      { label: copy.exportImage, icon: FileImage, action: "image" },
    ];
  };

  const handleExport = (format: string) => {
    setShowMoreMenu(false);
    setShowExportSubmenu(false);
    // TODO: Implement actual export logic
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="h-full">
      {/* Document header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-200">
        <button
          onClick={() => navigate("/v2/activity")}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <DocTypeIcon type={doc.type} />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-stone-900 truncate">
            {doc.name}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
            <span>{doc.type}</span>
            <span>·</span>
            <span>{doc.creatorName}</span>
            <span>·</span>
            <span>{doc.date}</span>
            {doc.labels.length > 0 && (
              <>
                <span>·</span>
                <div className="flex gap-1">
                  {doc.labels.slice(0, 3).map((label) => (
                    <span
                      key={label}
                      className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 text-[11px]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Preview/Code toggle for Page type */}
        {isPage && (
          <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1 shrink-0">
            <button
              onClick={() => setPageViewMode("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                pageViewMode === "preview"
                  ? "bg-white text-stone-700 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
              title={lang === "zh" ? "预览" : "Preview"}
            >
              <Eye className="w-3.5 h-3.5" />
              {lang === "zh" ? "预览" : "Preview"}
            </button>
            <button
              onClick={() => setPageViewMode("code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                pageViewMode === "code"
                  ? "bg-white text-stone-700 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
              title={lang === "zh" ? "代码" : "Code"}
            >
              <Code className="w-3.5 h-3.5" />
              {lang === "zh" ? "代码" : "Code"}
            </button>
          </div>
        )}

        {/* Share button */}
        <div className="relative shrink-0" ref={sharePanelRef}>
          <button
            onClick={() => setShowSharePanel((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition-colors text-sm font-medium"
            title={lang === "zh" ? (isPage ? "分享/发布" : "分享") : (isPage ? "Share/Publish" : "Share")}
          >
            <Share2 className="w-4 h-4" />
            {lang === "zh" 
              ? (isPage ? "分享/发布" : "分享") 
              : (isPage ? "Share/Publish" : "Share")}
          </button>

                    {showSharePanel && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowSharePanel(false)} />
              <div
                className="absolute right-0 top-full mt-1 w-[640px] bg-white border border-stone-200 rounded-xl shadow-2xl z-40 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Tab 切换区域 - 仅 Page 类型显示 */}
                {isPage && (
                  <div className="flex items-center border-b border-stone-200 bg-stone-50/50">
                    <button
                      onClick={() => setSharePanelTab("share")}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium transition-all relative ${
                        sharePanelTab === "share"
                          ? "text-stone-900"
                          : "text-stone-500 hover:text-stone-700"
                      }`}
                    >
                      <Share2 className="w-4 h-4" />
                      {lang === "zh" ? "分享" : "Share"}
                      {sharePanelTab === "share" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
                      )}
                    </button>
                    <button
                      onClick={() => setSharePanelTab("publish")}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium transition-all relative ${
                        sharePanelTab === "publish"
                          ? "text-stone-900"
                          : "text-stone-500 hover:text-stone-700"
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      {lang === "zh" ? "发布" : "Publish"}
                      {sharePanelTab === "publish" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
                      )}
                    </button>
                  </div>
                )}

                {/* 分享 Tab 内容 */}
                {sharePanelTab === "share" && (
                  <>
                {/* 协作成员区域 */}
                <div className="p-6 space-y-4">
                  <h3 className="text-sm font-medium text-stone-600">
                    {lang === "zh" ? "协作成员" : "Collaborators"}
                  </h3>

                  {/* 主成员 - 我 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center text-white text-sm font-medium shrink-0">
                        我
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-900">我</div>
                        <div className="text-xs text-stone-500">you@example.com</div>
                      </div>
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedCollaborators);
                          if (newExpanded.has('me')) {
                            newExpanded.delete('me');
                          } else {
                            newExpanded.add('me');
                          }
                          setExpandedCollaborators(newExpanded);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-500 hover:bg-stone-50 rounded transition-colors"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>3</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedCollaborators.has('me') ? 'rotate-180' : ''}`} />
                      </button>
                      <div className="px-2.5 py-1 text-xs text-stone-500 bg-stone-50 rounded">
                        {lang === "zh" ? "创建者" : "Creator"}
                      </div>
                    </div>

                    {/* Agent 列表 */}
                    {expandedCollaborators.has('me') && (
                      <div className="ml-12 space-y-2 pt-1">
                        {/* Claude Assistant */}
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-stone-700">Claude Assistant</div>
                          </div>
                          <select className="px-3 py-1.5 text-xs text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors">
                            <option>{lang === "zh" ? "可编辑" : "Can edit"}</option>
                            <option>{lang === "zh" ? "可查看" : "Can view"}</option>
                          </select>
                        </div>

                        {/* Data Analyzer */}
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-stone-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-stone-700">Data Analyzer</div>
                          </div>
                          <select className="px-3 py-1.5 text-xs text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors">
                            <option>{lang === "zh" ? "可编辑" : "Can edit"}</option>
                            <option>{lang === "zh" ? "可查看" : "Can view"}</option>
                          </select>
                        </div>

                        {/* Research Bot */}
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-stone-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-stone-700">Research Bot</div>
                          </div>
                          <select className="px-3 py-1.5 text-xs text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors">
                            <option>{lang === "zh" ? "可查看" : "Can view"}</option>
                            <option>{lang === "zh" ? "可编辑" : "Can edit"}</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Clark */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium shrink-0">
                        C
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-900">Clark</div>
                        <div className="text-xs text-stone-500">clark@example.com</div>
                      </div>
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedCollaborators);
                          if (newExpanded.has('clark')) {
                            newExpanded.delete('clark');
                          } else {
                            newExpanded.add('clark');
                          }
                          setExpandedCollaborators(newExpanded);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-500 hover:bg-stone-50 rounded transition-colors"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>2</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedCollaborators.has('clark') ? 'rotate-90' : ''}`} />
                      </button>
                      <select className="px-3 py-1.5 text-xs text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors">
                        <option>{lang === "zh" ? "可编辑" : "Can edit"}</option>
                        <option>{lang === "zh" ? "可查看" : "Can view"}</option>
                      </select>
                    </div>

                    {expandedCollaborators.has('clark') && (
                      <div className="ml-12 space-y-2 pt-1">
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-stone-700">Code Assistant</div>
                          </div>
                          <select className="px-3 py-1.5 text-xs text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors">
                            <option>{lang === "zh" ? "可编辑" : "Can edit"}</option>
                            <option>{lang === "zh" ? "可查看" : "Can view"}</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-stone-700">Test Bot</div>
                          </div>
                          <select className="px-3 py-1.5 text-xs text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors">
                            <option>{lang === "zh" ? "可查看" : "Can view"}</option>
                            <option>{lang === "zh" ? "可编辑" : "Can edit"}</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Maya Chen */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium shrink-0">
                        M
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-900">Maya Chen</div>
                        <div className="text-xs text-stone-500">maya@example.com</div>
                      </div>
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedCollaborators);
                          if (newExpanded.has('maya')) {
                            newExpanded.delete('maya');
                          } else {
                            newExpanded.add('maya');
                          }
                          setExpandedCollaborators(newExpanded);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-500 hover:bg-stone-50 rounded transition-colors"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>1</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedCollaborators.has('maya') ? 'rotate-90' : ''}`} />
                      </button>
                      <select className="px-3 py-1.5 text-xs text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors">
                        <option>{lang === "zh" ? "可编辑" : "Can edit"}</option>
                        <option>{lang === "zh" ? "可查看" : "Can view"}</option>
                      </select>
                    </div>

                    {expandedCollaborators.has('maya') && (
                      <div className="ml-12 space-y-2 pt-1">
                        <div className="flex items-center gap-3 py-2">
                          <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-stone-700">Design Bot</div>
                          </div>
                          <select className="px-3 py-1.5 text-xs text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors">
                            <option>{lang === "zh" ? "可查看" : "Can view"}</option>
                            <option>{lang === "zh" ? "可编辑" : "Can edit"}</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 访问控制区域 */}
                <div className="border-t border-stone-200">
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <button
                      onClick={() => setShowAccessSettings(!showAccessSettings)}
                      className="flex items-center gap-2.5 hover:bg-stone-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Lock className="w-4 h-4 text-stone-500" />
                      <span className="text-sm text-stone-700">
                        {lang === "zh" ? "仅限协作成员访问" : "Only collaborators can access"}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${showAccessSettings ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/v2/doc/${doc.id}`;
                        navigator.clipboard.writeText(url);
                        setShareCopied(true);
                        setTimeout(() => setShareCopied(false), 2000);
                      }}
                      className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      {shareCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          {lang === "zh" ? "已复制" : "Copied"}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {lang === "zh" ? "复制链接" : "Copy link"}
                        </>
                      )}
                    </button>
                  </div>

                  {showAccessSettings && (
                    <div className="px-6 pb-4 space-y-3 border-t border-stone-100">
                      <div className="flex items-center gap-3 py-2 mt-3">
                        <input
                          type="radio"
                          name="access"
                          id="access-collaborators"
                          defaultChecked
                          className="w-4 h-4 text-stone-900 focus:ring-2 focus:ring-stone-300"
                        />
                        <label htmlFor="access-collaborators" className="flex-1 cursor-pointer">
                          <div className="text-sm text-stone-700">{lang === "zh" ? "仅限协作成员" : "Collaborators only"}</div>
                          <div className="text-xs text-stone-500">{lang === "zh" ? "只有被邀请的成员可以访问" : "Only invited members can access"}</div>
                        </label>
                      </div>
                      <div className="flex items-center gap-3 py-2">
                        <input
                          type="radio"
                          name="access"
                          id="access-public"
                          className="w-4 h-4 text-stone-900 focus:ring-2 focus:ring-stone-300"
                        />
                        <label htmlFor="access-public" className="flex-1 cursor-pointer">
                          <div className="text-sm text-stone-700">{lang === "zh" ? "所有人可见" : "Public access"}</div>
                          <div className="text-xs text-stone-500">{lang === "zh" ? "任何人都可以查看此文档" : "Anyone can view this document"}</div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                  </>
                )}

                {/* 发布 Tab 内容 - 仅 Page 类型 */}
                {sharePanelTab === "publish" && isPage && (
                  <div className="p-6 space-y-6">
                    {/* 发布开关 */}
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-stone-900 mb-1">
                          {lang === "zh" ? "发布到互联网" : "Publish to web"}
                        </h3>
                        <p className="text-xs text-stone-500">
                          {lang === "zh" 
                            ? "将此页面发布为公开网站，任何人都可以通过链接访问" 
                            : "Publish this page as a public website accessible to anyone via link"}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={publishEnabled}
                          onChange={(e) => setPublishEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stone-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
                      </label>
                    </div>

                    {publishEnabled && (
                      <>
                        <div className="border-t border-stone-200 pt-6 space-y-5">
                          {/* 发布链接和自定义 Slug 同一行 */}
                          <div>
                            <label className="block text-xs font-medium text-stone-700 mb-2">
                              {lang === "zh" ? "发布链接" : "Published URL"}
                            </label>
                            <div className="flex gap-2">
                              {/* 固定前缀 */}
                              <div className="flex items-center flex-1 border border-stone-200 rounded-lg overflow-hidden">
                                <span className="px-3 py-2 bg-stone-50 text-sm text-stone-600 border-r border-stone-200 whitespace-nowrap">
                                  https://mindx.pub/page-
                                </span>
                                <input
                                  type="text"
                                  value={customSlug || doc.id}
                                  onChange={(e) => setCustomSlug(e.target.value)}
                                  placeholder={doc.id}
                                  className="flex-1 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                                />
                              </div>
                              {/* 复制按钮 */}
                              <button
                                onClick={() => {
                                  const fullUrl = `https://mindx.pub/page-${customSlug || doc.id}`;
                                  navigator.clipboard.writeText(fullUrl);
                                  setPublishCopied(true);
                                  setTimeout(() => setPublishCopied(false), 2000);
                                }}
                                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                              >
                                {publishCopied ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    {lang === "zh" ? "已复制" : "Copied"}
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    {lang === "zh" ? "复制" : "Copy"}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* 自动更新切换 */}
                          <div className="flex items-start gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-stone-900">
                                  {lang === "zh" ? "自动更新" : "Auto Update"}
                                </h4>
                                {autoUpdate && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                    {lang === "zh" ? "已启用" : "Enabled"}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-600 leading-relaxed">
                                {autoUpdate ? (
                                  lang === "zh" 
                                    ? "网页中的修改将实时同步到发布的页面中，无需手动更新" 
                                    : "Changes will be synced to the published page in real-time, no manual update needed"
                                ) : (
                                  lang === "zh"
                                    ? "需要点击下方的\"立即更新\"按钮才能将修改同步到发布页面"
                                    : "Click the \"Update Now\" button below to sync changes to the published page"
                                )}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={autoUpdate}
                                onChange={(e) => setAutoUpdate(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          {/* SEO 设置 */}
                          <div className="space-y-4 pt-2">
                            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                              {lang === "zh" ? "SEO 优化" : "SEO Settings"}
                            </h4>
                            
                            <div>
                              <label className="block text-xs font-medium text-stone-700 mb-2">
                                {lang === "zh" ? "页面标题" : "Page Title"}
                              </label>
                              <input
                                type="text"
                                value={seoTitle}
                                onChange={(e) => setSeoTitle(e.target.value)}
                                placeholder={doc.name}
                                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-stone-700 mb-2">
                                {lang === "zh" ? "页面描述" : "Page Description"}
                              </label>
                              <textarea
                                value={seoDescription}
                                onChange={(e) => setSeoDescription(e.target.value)}
                                placeholder={lang === "zh" ? "简要描述此页面的内容，有助于搜索引擎优化" : "Brief description for search engines"}
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
                              />
                            </div>
                          </div>

                          {/* 操作按钮 */}
                          <div className="flex items-center gap-3 pt-4">
                            {!autoUpdate && (
                              <button
                                className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                              >
                                <RefreshCw className="w-4 h-4" />
                                {lang === "zh" ? "立即更新" : "Update Now"}
                              </button>
                            )}
                            <button
                              className={`${!autoUpdate ? '' : 'flex-1'} px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-lg transition-colors`}
                            >
                              {lang === "zh" ? "保存设置" : "Save Settings"}
                            </button>
                            <button
                              onClick={() => setPublishEnabled(false)}
                              className="px-6 py-2.5 bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium rounded-lg border border-stone-200 transition-colors"
                            >
                              {lang === "zh" ? "取消发布" : "Unpublish"}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* More actions dropdown */}
        <div className="relative shrink-0" ref={moreMenuRef}>
          <button
            onClick={() => setShowMoreMenu((v) => !v)}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title={lang === "zh" ? "更多操作" : "More actions"}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMoreMenu && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-stone-200 rounded-xl shadow-xl z-30 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
              {/* Copy link */}
              <button
                onClick={() => {
                  const url = `${window.location.origin}/v2/doc/${doc.id}`;
                  navigator.clipboard.writeText(url);
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                {linkCopied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Link2 className="w-4 h-4 text-stone-400" />
                )}
                {linkCopied ? copy.linkCopied : copy.copyLink}
              </button>

              {/* Publish (Page type only) */}
              {isPage && (
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    if (!publishedUrl) {
                      const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
                      let randomId = "";
                      for (let i = 0; i < 8; i++)
                        randomId +=
                          chars[Math.floor(Math.random() * chars.length)];
                      setPublishedUrl(
                        `https://mindx.tencent.com/p/${randomId}`,
                      );
                    }
                    setShowPublishModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Globe className="w-4 h-4 text-stone-400" />
                  {copy.publish}
                </button>
              )}

              <div className="h-px bg-stone-100 my-1" />

              {/* Version History */}
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  setShowVersionHistory(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Clock className="w-4 h-4 text-stone-400" />
                {copy.versionHistory}
              </button>

              {/* Duplicate */}
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  // TODO: duplicate document
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Copy className="w-4 h-4 text-stone-400" />
                {copy.duplicate}
              </button>

              {/* Export with submenu */}
              <div className="relative">
                <button
                  ref={exportButtonRef}
                  onMouseEnter={() => setShowExportSubmenu(true)}
                  onMouseLeave={() => setShowExportSubmenu(false)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-stone-400" />
                    {copy.exportAs}
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                {/* Export submenu */}
                {showExportSubmenu && (
                  <div
                    onMouseEnter={() => setShowExportSubmenu(true)}
                    onMouseLeave={() => setShowExportSubmenu(false)}
                    className="absolute left-full top-0 ml-1 w-44 bg-white border border-stone-200 rounded-xl shadow-xl z-40 py-1 animate-in fade-in slide-in-from-left-1 duration-150"
                  >
                    {getExportOptions().map((option) => (
                      <button
                        key={option.action}
                        onClick={() => handleExport(option.action)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <option.icon className="w-4 h-4 text-stone-400" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-stone-100 my-1" />

              {/* Delete */}
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  // TODO: delete document
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                {copy.delete}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Version History Sidebar */}
      <VersionHistory
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        documentName={doc.name}
      />

      {/* Publish Modal */}
      {showPublishModal && publishedUrl && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => {
              setShowPublishModal(false);
              setPublishCopied(false);
            }}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl border border-stone-200 p-6 w-[420px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-stone-900">
                  {copy.publishTitle}
                </h3>
                <p className="text-xs text-stone-500">{copy.publishDesc}</p>
              </div>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-stone-700 font-mono break-all">
                {publishedUrl}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(publishedUrl);
                  setPublishCopied(true);
                  setTimeout(() => setPublishCopied(false), 2000);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                {publishCopied ? (
                  <>
                    <Check className="w-4 h-4" /> {copy.publishCopied}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> {copy.publishCopy}
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowPublishModal(false);
                  setPublishCopied(false);
                }}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors"
              >
                {copy.publishClose}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Document content */}
      <div className="pb-8">
        {isEmptyCanvas ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-2">
                {lang === "zh" ? "从空白开始" : "Start from blank"}
              </h2>
              <p className="text-stone-500">
                {lang === "zh" ? "开始输入或选择一个模板" : "Start typing or choose a template"}
              </p>
            </div>
            
            {/* Database shortcut */}
            <button
              onClick={convertToSheet}
              className="group flex items-center gap-3 px-6 py-4 bg-white border-2 border-stone-200 rounded-xl hover:border-stone-900 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-lg bg-stone-100 group-hover:bg-stone-900 flex items-center justify-center transition-colors">
                <Database className="w-6 h-6 text-stone-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <div className="text-base font-semibold text-stone-900 mb-0.5">
                  {lang === "zh" ? "数据库" : "Database"}
                </div>
                <div className="text-sm text-stone-500">
                  {lang === "zh" ? "转换为数据表格" : "Convert to a database table"}
                </div>
              </div>
            </button>
          </div>
        ) : isSmartCanvas ? (
          <BlockList blocks={resolvedBlocks!} />
        ) : isSmartSheet ? (
          <div className="w-full overflow-x-auto">
            <SheetView sheetData={resolvedSheetData!} />
          </div>
        ) : isPage ? (
          resolvedHtmlContent ? (
            pageViewMode === "preview" ? (
              <iframe
                sandbox="allow-scripts allow-same-origin"
                srcDoc={resolvedHtmlContent}
                className="w-full border border-stone-200 rounded-lg"
                style={{
                  height: "calc(100vh - 240px)",
                  minHeight: "500px",
                }}
                title={doc.name}
              />
            ) : (
              <div className="w-full border border-stone-200 rounded-lg bg-white overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 bg-stone-50 border-b border-stone-200">
                  <span className="text-xs font-medium text-stone-600 font-mono">
                    {lang === "zh" ? "HTML 源代码" : "HTML Source Code"}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(resolvedHtmlContent);
                      setCodeCopied(true);
                      setTimeout(() => setCodeCopied(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                  >
                    {codeCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">{lang === "zh" ? "已复制" : "Copied"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        {lang === "zh" ? "复制代码" : "Copy Code"}
                      </>
                    )}
                  </button>
                </div>
                <pre
                  className="p-6 text-xs leading-relaxed font-mono text-stone-700 overflow-auto bg-stone-50/50"
                  style={{
                    height: "calc(100vh - 300px)",
                    minHeight: "400px",
                  }}
                >
                  <code className="language-html">{resolvedHtmlContent}</code>
                </pre>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-stone-400">
              <Globe className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">No page content</p>
              <p className="text-sm mt-1">This page has no HTML content yet.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-stone-400">
            <FileText className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">Unsupported document type</p>
          </div>
        )}
      </div>
    </div>
  );
}
