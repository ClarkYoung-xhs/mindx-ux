import React from "react";
import { X } from "lucide-react";
import { getAgentAvatar } from "../../components/AgentAvatars";
import { useLanguage } from "../../i18n/LanguageContext";
import type { AbsenceSummaryData } from "./types";

export interface AbsenceSummaryCardProps {
  data: AbsenceSummaryData;
  onDocClick: (docId: string, docType: string) => void;
  onDismiss: () => void;
  onViewAll: () => void;
}

export default function AbsenceSummaryCard({
  data,
  onDocClick,
  onDismiss,
  onViewAll,
}: AbsenceSummaryCardProps) {
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  if (data.changes.length === 0) return null;

  const now = new Date();

  // --- Aggregate counts by action ---
  const counts: Record<string, number> = {};
  data.changes.forEach((c) => {
    counts[c.action] = (counts[c.action] || 0) + 1;
  });

  // --- Relative time helper ---
  const relativeTime = (ts: string) => {
    const d = new Date(ts);
    const ms = now.getTime() - d.getTime();
    const mins = Math.floor(ms / (1000 * 60));
    const hrs = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    if (mins < 1) return isZh ? "刚刚" : "Just now";
    if (mins < 60) return isZh ? `${mins} 分钟前` : `${mins}m ago`;
    if (hrs < 24) return isZh ? `${hrs} 小时前` : `${hrs}h ago`;
    if (days === 1) return isZh ? "昨天" : "Yesterday";
    return isZh ? `${days} 天前` : `${days}d ago`;
  };

  const actionText = (action: string, title: string) => {
    if (isZh) {
      const verb =
        action === "created"
          ? "新建了"
          : action === "modified"
            ? "修改了"
            : "评论了";
      return (
        <>
          {verb}《<span className="font-medium text-stone-800">{title}</span>》
        </>
      );
    }
    const verb =
      action === "created"
        ? "created"
        : action === "modified"
          ? "updated"
          : "commented on";
    return (
      <>
        {verb} <span className="font-medium text-stone-800">{title}</span>
      </>
    );
  };

  const visibleChanges = data.changes.slice(0, 3);

  return (
    <div
      className="border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-5 overflow-hidden"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      {/* Header: numeric summary + view-all + close */}
      <div className="flex items-center px-5 pt-4 pb-3">
        <div className="text-sm ml-[12px]">
          {isZh ? (
            <>
              <span className="text-stone-500">你离开期间，Agents </span>
              {[
                counts.created ? (
                  <span key="c">
                    新建{" "}
                    <span className="font-semibold text-stone-800">
                      {counts.created}
                    </span>{" "}
                    篇
                  </span>
                ) : null,
                counts.modified ? (
                  <span key="m">
                    更新{" "}
                    <span className="font-semibold text-stone-800">
                      {counts.modified}
                    </span>{" "}
                    篇
                  </span>
                ) : null,
                counts.commented ? (
                  <span key="cm">
                    评论{" "}
                    <span className="font-semibold text-stone-800">
                      {counts.commented}
                    </span>{" "}
                    篇
                  </span>
                ) : null,
              ]
                .filter(Boolean)
                .map((item, i, arr) => (
                  <span key={i} className="text-stone-600">
                    {item}
                    {i < arr.length - 1 ? "、" : ""}
                  </span>
                ))}
              <span className="text-stone-500">文档</span>
            </>
          ) : (
            <>
              <span className="text-stone-500">
                While you were away, Agents{" "}
              </span>
              {[
                counts.created ? (
                  <span key="c">
                    created{" "}
                    <span className="font-semibold text-stone-800">
                      {counts.created}
                    </span>
                  </span>
                ) : null,
                counts.modified ? (
                  <span key="m">
                    updated{" "}
                    <span className="font-semibold text-stone-800">
                      {counts.modified}
                    </span>
                  </span>
                ) : null,
                counts.commented ? (
                  <span key="cm">
                    commented on{" "}
                    <span className="font-semibold text-stone-800">
                      {counts.commented}
                    </span>
                  </span>
                ) : null,
              ]
                .filter(Boolean)
                .map((item, i, arr) => (
                  <span key={i} className="text-stone-600">
                    {item}
                    {i < arr.length - 1 ? ", " : ""}
                  </span>
                ))}
              <span className="text-stone-500">
                {" "}
                {counts.created || counts.modified || counts.commented
                  ? (counts.created || 0) +
                      (counts.modified || 0) +
                      (counts.commented || 0) ===
                    1
                    ? "doc"
                    : "docs"
                  : "docs"}
              </span>
            </>
          )}
        </div>

        <div className="flex-1" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewAll();
          }}
          className="shrink-0 text-xs text-stone-500 hover:text-stone-700 font-medium mr-2 transition-colors"
        >
          {isZh ? "查看全部" : "View all"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="shrink-0 p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 transition-colors"
          title={isZh ? "关闭" : "Dismiss"}
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
                    <span className="font-medium text-stone-700">
                      {change.agentName}
                    </span>{" "}
                    {actionText(change.action, change.docTitle)}
                  </p>
                  {/* Time */}
                  <span className="text-xs text-stone-400 shrink-0 whitespace-nowrap">
                    {relativeTime(change.timestamp)}
                  </span>
                </div>
                {change.changeDescription && (
                  <p className="text-xs text-stone-400 mt-1 leading-snug truncate">
                    {change.changeDescription}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
