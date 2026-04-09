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
} from "lucide-react";
import { useMindXDemo } from "../../data/mindxDemoContext";
import { allCanvasBlocks } from "../../data/canvasMockData";
import { allSheets } from "../../data/sheetMockData";
import BlockList from "../../components/BlockRenderer/BlockList";
import SheetView from "../../components/SheetRenderer/SheetView";
import type { WorkspaceDoc } from "../../data/mindxDemo";
import { useLanguage } from "../../i18n/LanguageContext";

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
  const { documents } = useMindXDemo();
  const { lang } = useLanguage();
  // Support both /v2/doc/:docId (new) and /v2/workspace/doc?doc=xxx (legacy)
  const docId = params.docId ?? searchParams.get("doc");

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishCopied, setPublishCopied] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

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

  const copy =
    lang === "zh"
      ? {
          share: "分享",
          copyLink: "复制链接",
          linkCopied: "已复制",
          publish: "发布为网页",
          duplicate: "创建副本",
          exportAs: "导出",
          delete: "删除",
          publishTitle: "已发布到互联网",
          publishDesc: "任何拥有链接的人都可以访问此页面",
          publishCopy: "复制链接",
          publishCopied: "已复制",
          publishClose: "关闭",
        }
      : {
          share: "Share",
          copyLink: "Copy link",
          linkCopied: "Copied",
          publish: "Publish as web page",
          duplicate: "Duplicate",
          exportAs: "Export",
          delete: "Delete",
          publishTitle: "Published to the web",
          publishDesc: "Anyone with the link can access this page",
          publishCopy: "Copy link",
          publishCopied: "Copied",
          publishClose: "Close",
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
              {/* Share / Copy link */}
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

              {/* Share */}
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  // TODO: open share dialog
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Share2 className="w-4 h-4 text-stone-400" />
                {copy.share}
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

              {/* Export */}
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  // TODO: export document
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Download className="w-4 h-4 text-stone-400" />
                {copy.exportAs}
              </button>

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
        {isSmartCanvas ? (
          <BlockList blocks={resolvedBlocks!} />
        ) : isSmartSheet ? (
          <div className="w-full overflow-x-auto">
            <SheetView sheetData={resolvedSheetData!} />
          </div>
        ) : isPage ? (
          doc.htmlContent ? (
            <iframe
              sandbox="allow-scripts allow-same-origin"
              srcDoc={doc.htmlContent}
              className="w-full border border-stone-200 rounded-lg"
              style={{
                height: "calc(100vh - 240px)",
                minHeight: "500px",
              }}
              title={doc.name}
            />
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
