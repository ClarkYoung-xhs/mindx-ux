import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Shield,
  Download,
  Share2,
  Trash2,
  Globe,
  Check,
  Copy,
  Link as LinkIcon,
  X,
} from "lucide-react";
import { getDocTypeIcon } from "../../components/DocIcons";
import { getAgentAvatar, getUserAvatar } from "../../components/AgentAvatars";
import { useLanguage } from "../../i18n/LanguageContext";
import { normalizeDocType } from "./constants";

export interface DocRowProps {
  key?: string | number;
  docId: string;
  name: string;
  type: string;
  date: string;
  creatorName: string;
  creatorType: "human" | "agent";
  isNew?: boolean;
  onDelete: (id: string) => void;
  onMarkRead?: (id: string) => void;
  onSetAgentPermission?: (id: string) => void;
  onUpgradeRequirement?: () => void;
}

export default function DocRow({
  docId,
  name,
  type,
  date,
  creatorName,
  creatorType,
  isNew,
  onDelete,
  onMarkRead,
  onSetAgentPermission,
  onUpgradeRequirement,
}: DocRowProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPublicLink, setIsPublicLink] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const { t } = useLanguage();

  const getDocIcon = () => getDocTypeIcon(type, 18);

  const formatDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "Last week";
    return dateObj.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    const content = `# ${name}\n\nType: ${type}\nCreated by: ${creatorName}\nDate: ${date}\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-")}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete(docId);
  };

  return (
    <tr
      className={`transition-colors group cursor-pointer ${isNew ? "bg-blue-50/60 hover:bg-blue-50" : "hover:bg-stone-50"}`}
      onClick={() => {
        if (isNew) onMarkRead?.(docId);
        navigate(`/document?id=${docId}&type=${normalizeDocType(type)}`);
      }}
    >
      <td className="px-6 py-3 max-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center justify-center w-2 mr-1 shrink-0">
            {isNew && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            )}
          </span>
          <span className="shrink-0">{getDocIcon()}</span>
          <span className="font-medium text-stone-800 truncate">{name}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-stone-500 min-w-0">
          <span className="shrink-0">
            {creatorType === "agent"
              ? getAgentAvatar(creatorName, 18)
              : getUserAvatar(18)}
          </span>
          <span className="text-sm truncate">{creatorName}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-stone-500 text-sm whitespace-nowrap">
        {formatDate(date)}
      </td>
      <td className="px-3 py-3 text-right">
        <div className="relative inline-block">
          <button
            className="p-1 rounded hover:bg-stone-200 text-stone-400 opacity-0 group-hover:opacity-100 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                }}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onSetAgentPermission?.(docId);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Shield className="w-4 h-4 text-stone-400" />
                  Agent权限设置
                </button>
                <div className="border-t border-stone-100 my-0.5" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    onUpgradeRequirement?.();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-stone-400 group-hover:text-blue-500 transition-colors" />
                    Convert
                  </div>
                  <span className="text-[9px] font-bold bg-stone-900 text-white px-1 py-0.5 rounded leading-none shadow-sm shadow-stone-900/10">
                    PRO
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    setIsShareOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-stone-400" />
                  {t("docs.actions.share")}
                </button>
                <div className="border-t border-stone-100 my-0.5" />
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  {t("docs.actions.delete")}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Share popover */}
        {isShareOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(false);
              }}
            />
            <div
              className="absolute right-0 top-full mt-1 w-72 bg-white border border-stone-200 rounded-xl shadow-2xl z-40 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-stone-100">
                <div className="flex items-center gap-2 mb-1">
                  <Share2 className="w-4 h-4 text-stone-500" />
                  <span className="text-sm font-semibold text-stone-900">
                    {t("share.title")}
                  </span>
                </div>
                <p className="text-xs text-stone-400">{t("share.desc")}</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-stone-400" />
                    <span className="text-sm text-stone-700">
                      {t("share.publicLink")}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPublicLink(!isPublicLink);
                    }}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      isPublicLink ? "bg-stone-900" : "bg-stone-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                        isPublicLink ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
                {isPublicLink && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
                      <LinkIcon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-xs text-stone-500 truncate flex-1">
                        mindx.app/s/{docId.slice(0, 8)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            `https://mindx.app/s/${docId.slice(0, 8)}`,
                          );
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
                    <p className="text-[11px] text-stone-400">
                      {t("share.anyoneWithLink")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}
