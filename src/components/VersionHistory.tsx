import { useState } from "react";
import { X, Clock, User, ChevronDown } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

interface VersionRecord {
  id: string;
  timestamp: string;
  userName: string;
  userAvatar?: string;
  action: string;
  changes: string[];
}

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
}

// Mock version history data
const mockVersionHistory: VersionRecord[] = [
  {
    id: "v-001",
    timestamp: "2026-04-14 14:30",
    userName: "张三",
    action: "编辑内容",
    changes: ["修改了第 3 段落", "添加了 2 张图片"],
  },
  {
    id: "v-002",
    timestamp: "2026-04-14 10:15",
    userName: "李四",
    action: "添加评论",
    changes: ["在第 5 段添加了评论"],
  },
  {
    id: "v-003",
    timestamp: "2026-04-13 16:45",
    userName: "王五",
    action: "编辑标题",
    changes: ["更新了文档标题"],
  },
  {
    id: "v-004",
    timestamp: "2026-04-13 09:20",
    userName: "张三",
    action: "创建文档",
    changes: ["创建了空白文档"],
  },
];

export default function VersionHistory({
  isOpen,
  onClose,
  documentName,
}: VersionHistoryProps) {
  const { lang } = useLanguage();
  const [timeFilter, setTimeFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const copy =
    lang === "zh"
      ? {
          title: "版本历史",
          action: "操作",
          changes: "变更",
          restoreVersion: "恢复此版本",
          filterByTime: "时间",
          filterByUser: "编辑人",
          allTime: "全部时间",
          today: "今天",
          yesterday: "昨天",
          lastWeek: "最近 7 天",
          allUsers: "全部成员",
        }
      : {
          title: "Version History",
          action: "Action",
          changes: "Changes",
          restoreVersion: "Restore this version",
          filterByTime: "Time",
          filterByUser: "Editor",
          allTime: "All time",
          today: "Today",
          yesterday: "Yesterday",
          lastWeek: "Last 7 days",
          allUsers: "All members",
        };

  // Get unique users
  const uniqueUsers = Array.from(new Set(mockVersionHistory.map(v => v.userName)));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-stone-500" />
            <h2 className="text-lg font-semibold text-stone-900">
              {copy.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-stone-200 flex items-center gap-3">
          {/* Time filter */}
          <div className="relative flex-1">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">{copy.allTime}</option>
              <option value="today">{copy.today}</option>
              <option value="yesterday">{copy.yesterday}</option>
              <option value="lastWeek">{copy.lastWeek}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>

          {/* User filter */}
          <div className="relative flex-1">
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">{copy.allUsers}</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Version list */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-1.5">
            {mockVersionHistory.map((version) => (
              <div
                key={version.id}
                className="group bg-white border border-stone-200 rounded-lg p-2.5 hover:border-stone-300 hover:shadow-sm transition-all duration-200"
              >
                {/* Version info */}
                <div className="flex gap-2.5 items-start">
                  <div className="shrink-0">
                    <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                      <User className="w-3 h-3 text-stone-600" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-stone-900">
                        {version.userName}
                      </span>
                      <span className="text-xs text-stone-400">
                        {version.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mb-1">
                      {version.action}
                    </p>

                    {/* Changes list */}
                    {version.changes.length > 0 && (
                      <div className="space-y-0.5">
                        {version.changes.map((change, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-stone-500"
                          >
                            · {change}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Restore button on right side */}
                  <div className="shrink-0 self-center">
                    <button className="text-xs font-medium text-stone-600 hover:text-stone-900 py-1.5 px-2.5 bg-stone-50 hover:bg-stone-100 rounded border border-stone-200 transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {copy.restoreVersion}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
