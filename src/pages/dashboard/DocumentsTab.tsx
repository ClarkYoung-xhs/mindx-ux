import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ChevronDown,
  ArrowUpDown,
  Check,
  Clock,
  CalendarDays,
  EyeOff,
  Timer,
  Bookmark,
  Brain,
} from "lucide-react";
import { getDocTypeIcon } from "../../components/DocIcons";
import { useLanguage } from "../../i18n/LanguageContext";
import { normalizeDocType } from "./constants";
import type { WorkspaceDoc, AbsenceSummaryData, DemoMode } from "./types";
import DocRow from "./DocRow";
import AbsenceSummaryCard from "./AbsenceSummaryCard";

export interface DocumentsTabProps {
  demoMode: DemoMode;
  absenceSummaryDismissed: boolean;
  setAbsenceSummaryDismissed: (v: boolean) => void;
  dynamicAbsenceSummaryData: AbsenceSummaryData;
  guideDismissed: boolean;
  setGuideDismissed: (v: boolean) => void;
  documents: WorkspaceDoc[];
  setDocuments: React.Dispatch<React.SetStateAction<WorkspaceDoc[]>>;
  docSceneFilter: string;
  setDocSceneFilter: (
    v: "all" | "today" | "unread" | "scheduled" | "webclip" | "memory",
  ) => void;
  isTypeFilterOpen: boolean;
  setIsTypeFilterOpen: (v: boolean) => void;
  isSortMenuOpen: boolean;
  setIsSortMenuOpen: (v: boolean) => void;
  docFilterType: string;
  setDocFilterType: (v: string) => void;
  docFilterOwner: string;
  setDocFilterOwner: (v: string) => void;
  docSortBy: "lastModified" | "lastViewed";
  setDocSortBy: (v: "lastModified" | "lastViewed") => void;
  docTypes: string[];
  filteredAndSortedDocs: WorkspaceDoc[];
  activeFilterCount: number;
  setIsPricingModalOpen: (v: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export default function DocumentsTab({
  demoMode,
  absenceSummaryDismissed,
  setAbsenceSummaryDismissed,
  dynamicAbsenceSummaryData,
  guideDismissed,
  setGuideDismissed,
  documents,
  setDocuments,
  docSceneFilter,
  setDocSceneFilter,
  isTypeFilterOpen,
  setIsTypeFilterOpen,
  isSortMenuOpen,
  setIsSortMenuOpen,
  docFilterType,
  setDocFilterType,
  docFilterOwner,
  setDocFilterOwner,
  docSortBy,
  setDocSortBy,
  docTypes,
  filteredAndSortedDocs,
  activeFilterCount,
  setIsPricingModalOpen,
  setActiveTab,
}: DocumentsTabProps) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Absence Summary Card — only in "existing user" mode */}
      {demoMode === "existing" && !absenceSummaryDismissed && (
        <AbsenceSummaryCard
          data={dynamicAbsenceSummaryData}
          onDocClick={(docId, docType) => {
            navigate(`/document?id=${docId}&type=${normalizeDocType(docType)}`);
          }}
          onDismiss={() => setAbsenceSummaryDismissed(true)}
          onViewAll={() => setActiveTab("activity")}
        />
      )}

      {/* Quick Start Guide — shown for new users */}
      {!guideDismissed && documents.length <= 1 && (
        <div className="mt-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-stone-900">
              🚀 {lang === "zh" ? "快速上手" : "Quick Start"}
            </h3>
            <button
              onClick={() => setGuideDismissed(true)}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              {lang === "zh" ? "关闭" : "Dismiss"}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setActiveTab("agents")}
              className="group p-5 rounded-xl cursor-pointer border border-stone-200/80 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md hover:border-blue-200 transition-all text-left"
            >
              <div className="text-3xl mb-3">🤖</div>
              <div className="text-sm font-semibold text-stone-900 mb-1">
                {lang === "zh" ? "连接 Agent" : "Connect Agent"}
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {lang === "zh"
                  ? "复制提示词，让 AI Agent 接入你的空间"
                  : "Copy prompt to connect your AI Agent"}
              </p>
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className="group p-5 rounded-xl cursor-pointer border border-stone-200/80 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-md hover:border-amber-200 transition-all text-left"
            >
              <div className="text-3xl mb-3">⚡</div>
              <div className="text-sm font-semibold text-stone-900 mb-1">
                {lang === "zh" ? "安装 Skill" : "Install Skills"}
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {lang === "zh"
                  ? "为你的 Agent 扩展文档创作等强大能力"
                  : "Extend your Agent with powerful capabilities"}
              </p>
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className="group p-5 rounded-xl cursor-pointer border border-stone-200/80 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-md hover:border-emerald-200 transition-all text-left"
            >
              <div className="text-3xl mb-3">📂</div>
              <div className="text-sm font-semibold text-stone-900 mb-1">
                {lang === "zh" ? "管理资产" : "Manage Assets"}
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {lang === "zh"
                  ? "查看和管理你的文档、表格、白板等"
                  : "View and manage your docs, tables & more"}
              </p>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1 mt-[26px] mb-4">
        {(
          [
            {
              key: "all",
              label: lang === "zh" ? "全部文档" : "All",
              icon: <FileText className="w-3.5 h-3.5" />,
            },
            {
              key: "today",
              label: lang === "zh" ? "今日更新" : "Today",
              icon: <CalendarDays className="w-3.5 h-3.5" />,
            },
            {
              key: "unread",
              label: lang === "zh" ? "未读文档" : "Unread",
              icon: <EyeOff className="w-3.5 h-3.5" />,
            },
            {
              key: "scheduled",
              label: lang === "zh" ? "定时任务" : "Scheduled",
              icon: <Timer className="w-3.5 h-3.5" />,
            },
            {
              key: "webclip",
              label: lang === "zh" ? "网页剪藏" : "Web Clips",
              icon: <Bookmark className="w-3.5 h-3.5" />,
            },
            {
              key: "memory",
              label: lang === "zh" ? "我的记忆" : "Memories",
              icon: <Brain className="w-3.5 h-3.5" />,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setDocSceneFilter(tab.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              docSceneFilter === tab.key
                ? "bg-stone-800 text-white"
                : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Document table */}
      <div>
        <div
          className="border border-stone-200/80 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
          style={{ overflow: "visible" }}
        >
          <table className="w-full text-left text-sm table-fixed">
            <thead className="bg-stone-50/50 text-stone-500 border-b border-stone-200/80 rounded-t-xl [&>tr>th:first-child]:rounded-tl-xl [&>tr>th:last-child]:rounded-tr-xl">
              <tr>
                {/* Name column with Type filter */}
                <th className="px-6 py-3 font-medium bg-stone-50/50 w-[45%]">
                  <div className="relative inline-flex items-center">
                    <button
                      onClick={() => {
                        setIsTypeFilterOpen(!isTypeFilterOpen);
                        setIsSortMenuOpen(false);
                      }}
                      className={`flex items-center gap-1.5 hover:text-stone-800 transition-colors ${docFilterType !== "all" ? "text-stone-900" : ""}`}
                    >
                      {t("docs.name")}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${isTypeFilterOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isTypeFilterOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsTypeFilterOpen(false)}
                        />
                        <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                          <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                            {t("docs.filterByType")}
                          </div>
                          <button
                            onClick={() => {
                              setDocFilterType("all");
                              setIsTypeFilterOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docFilterType === "all" ? "bg-stone-50 text-stone-900 font-medium" : "text-stone-600 hover:bg-stone-50"}`}
                          >
                            {t("docs.allTypes")}
                          </button>
                          {docTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => {
                                setDocFilterType(type);
                                setIsTypeFilterOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docFilterType === type ? "bg-stone-50 text-stone-900 font-medium" : "text-stone-600 hover:bg-stone-50"}`}
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
                <th className="px-4 py-3 font-medium w-[180px]">
                  {t("docs.owner")}
                </th>

                {/* Date column with Sort toggle */}
                <th className="px-4 py-3 font-medium whitespace-nowrap w-[160px]">
                  <div className="relative inline-flex items-center">
                    <button
                      onClick={() => {
                        setIsSortMenuOpen(!isSortMenuOpen);
                        setIsTypeFilterOpen(false);
                      }}
                      className="flex items-center gap-1.5 hover:text-stone-800 transition-colors whitespace-nowrap"
                    >
                      {docSortBy === "lastModified"
                        ? t("docs.lastModified")
                        : t("docs.lastViewed")}
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                    {isSortMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsSortMenuOpen(false)}
                        />
                        <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                          <div className="px-3 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                            {t("docs.sortBy")}
                          </div>
                          <button
                            onClick={() => {
                              setDocSortBy("lastModified");
                              setIsSortMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docSortBy === "lastModified" ? "bg-stone-50 text-stone-900 font-medium" : "text-stone-600 hover:bg-stone-50"}`}
                          >
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            {t("docs.lastModified")}
                            {docSortBy === "lastModified" && (
                              <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setDocSortBy("lastViewed");
                              setIsSortMenuOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${docSortBy === "lastViewed" ? "bg-stone-50 text-stone-900 font-medium" : "text-stone-600 hover:bg-stone-50"}`}
                          >
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            {t("docs.lastViewed")}
                            {docSortBy === "lastViewed" && (
                              <Check className="w-3.5 h-3.5 text-stone-900 ml-auto" />
                            )}
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
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-stone-500"
                  >
                    <FileText className="w-8 h-8 mx-auto mb-3 text-stone-300" />
                    {activeFilterCount > 0 ? (
                      <div>
                        <p>No documents match the current filters</p>
                        <button
                          onClick={() => {
                            setDocFilterType("all");
                            setDocFilterOwner("all");
                          }}
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
                filteredAndSortedDocs.map((doc) => (
                  <DocRow
                    key={doc.id}
                    docId={doc.id}
                    name={doc.name}
                    type={doc.type}
                    date={
                      docSortBy === "lastModified"
                        ? doc.lastModified
                        : doc.lastViewed
                    }
                    creatorName={doc.creatorName}
                    creatorType={doc.creatorType}
                    isNew={doc.isNew}
                    onDelete={(id) =>
                      setDocuments((prev) => prev.filter((d) => d.id !== id))
                    }
                    onMarkRead={(id) =>
                      setDocuments((prev) =>
                        prev.map((d) =>
                          d.id === id
                            ? { ...d, isNew: false, isRead: true }
                            : d,
                        ),
                      )
                    }
                    onUpgradeRequirement={() => setIsPricingModalOpen(true)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
