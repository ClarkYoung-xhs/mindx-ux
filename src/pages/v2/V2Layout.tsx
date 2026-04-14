import type { ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  Brain,
  Cable,
  Inbox,
  Package2,
  Settings,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { currentUser } from "../../data/mindxDemo";
import { LanguageSwitcher, useLanguage } from "../../i18n/LanguageContext";
import WorkspaceTree from "./WorkspaceTree";

interface NavItemConfig {
  label: string;
  icon: ReactNode;
  to: string;
  match: (pathname: string) => boolean;
}

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-white text-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-stone-200/50"
          : "text-stone-600 hover:bg-stone-200/40 hover:text-stone-900 border border-transparent"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default function V2Layout() {
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const backTarget = location.pathname.startsWith("/v2/memory")
    ? "/dashboard?tab=profile"
    : "/dashboard";

  const copy =
    lang === "zh"
      ? {
          activity: "动态",
          workspace: "Workspace",
          inbox: "Inbox",
          knowledge: "知识资产",
          memory: "记忆",
          memoryGroup: "Memory",
          integrations: "Integrations",
          connect: "连接器",
          back: "返回 1.0",
          humanAccount: "人类账号",
        }
      : {
          activity: "Activity",
          workspace: "Workspace",
          inbox: "Inbox",
          knowledge: "Knowledge",
          memory: "Memory",
          memoryGroup: "Memory",
          integrations: "Integrations",
          connect: "Connect",
          back: "Back to 1.0",
          humanAccount: "Human Account",
        };

  /** Activity tab — homepage entry */
  const activityItem: NavItemConfig = {
    label: copy.activity,
    icon: <Activity className="w-4 h-4" />,
    to: "/v2/activity",
    match: (pathname) => pathname === "/v2/activity" || pathname === "/v2",
  };

  /** Inbox */
  const inboxItem: NavItemConfig = {
    label: copy.inbox,
    icon: <Inbox className="w-4 h-4" />,
    to: "/v2/inbox",
    match: (pathname) => pathname.startsWith("/v2/inbox"),
  };

  /** Knowledge */
  const knowledgeItem: NavItemConfig = {
    label: copy.knowledge,
    icon: <Package2 className="w-4 h-4" />,
    to: "/v2/knowledge",
    match: (pathname) => pathname.startsWith("/v2/knowledge"),
  };

  /** Memory */
  const memoryItem: NavItemConfig = {
    label: copy.memory,
    icon: <Brain className="w-4 h-4" />,
    to: "/v2/memory",
    match: (pathname) => pathname.startsWith("/v2/memory"),
  };

  /** Connect (Integrations) */
  const connectItem: NavItemConfig = {
    label: copy.connect,
    icon: <Cable className="w-4 h-4" />,
    to: "/v2/connect",
    match: (pathname) => pathname.startsWith("/v2/connect"),
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white text-stone-900">
      <aside className="w-64 border-r border-stone-200 bg-[#F7F7F5] flex flex-col">
        <div className="h-14 flex items-center px-4">
          <span className="text-sm font-semibold text-stone-800 tracking-tight">
            MindX
          </span>
        </div>

        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* 1. Activity — homepage entry */}
          <div className="space-y-1">
            <SidebarItem
              icon={activityItem.icon}
              label={activityItem.label}
              active={activityItem.match(location.pathname)}
              onClick={() => navigate(activityItem.to)}
            />
          </div>

          {/* 2. Workspace directory tree */}
          <div className="space-y-1">
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                {copy.workspace}
              </span>
            </div>
            <WorkspaceTree />
          </div>

          {/* 3. Memory group — Inbox / Knowledge / Memory */}
          <div className="space-y-1">
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                {copy.memoryGroup}
              </span>
            </div>
            <SidebarItem
              icon={inboxItem.icon}
              label={inboxItem.label}
              active={inboxItem.match(location.pathname)}
              onClick={() => navigate(inboxItem.to)}
            />
            <SidebarItem
              icon={knowledgeItem.icon}
              label={knowledgeItem.label}
              active={knowledgeItem.match(location.pathname)}
              onClick={() => navigate(knowledgeItem.to)}
            />
            <SidebarItem
              icon={memoryItem.icon}
              label={memoryItem.label}
              active={memoryItem.match(location.pathname)}
              onClick={() => navigate(memoryItem.to)}
            />
          </div>

          {/* 4. Integrations group — Connect */}
          <div className="space-y-1">
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                {copy.integrations}
              </span>
            </div>
            <SidebarItem
              icon={connectItem.icon}
              label={connectItem.label}
              active={connectItem.match(location.pathname)}
              onClick={() => navigate(connectItem.to)}
            />
          </div>
        </div>

        <div className="shrink-0 border-t border-stone-200 px-3 py-2 bg-[#F7F7F5] space-y-1">
          <button
            onClick={() => navigate(backTarget)}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {copy.back}
          </button>
          <div className="flex items-center gap-2 px-2 py-1.5 pt-2 border-t border-stone-200/50">
            <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 text-xs font-semibold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium truncate">
                {copy.humanAccount}
              </p>
              <p className="text-[11px] text-stone-500 truncate">
                {currentUser.email}
              </p>
            </div>
            <LanguageSwitcher />
            <button
              onClick={() => navigate('/dashboard?tab=settings')}
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 transition-colors"
              title={lang === 'zh' ? '设置' : 'Settings'}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
