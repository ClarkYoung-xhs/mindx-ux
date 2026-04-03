import type { ReactNode } from 'react';
import { Activity, ArrowLeft, Brain, Database, FileText, Package2, PlugZap, Sparkles } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { currentUser } from '../../data/mindxDemo';
import { LanguageSwitcher, useLanguage } from '../../i18n/LanguageContext';

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
          ? 'bg-white text-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-stone-200/50'
          : 'text-stone-600 hover:bg-stone-200/40 hover:text-stone-900 border border-transparent'
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
  const backTarget = location.pathname.startsWith('/v2/memory') ? '/dashboard?tab=memory' : '/dashboard';

  const copy =
    lang === 'zh'
      ? {
          workspace: 'Workspace',
          integrations: 'Integrations',
          memory: 'Memory',
          documents: '文档',
          activity: '动态',
          baseMemory: '记忆',
          dataSources: '数据源',
          knowledge: '知识资产',
          connect: '集成与挂载',
          back: '返回 1.0',
          humanAccount: '人类账号',
        }
      : {
          workspace: 'Workspace',
          integrations: 'Integrations',
          memory: 'Memory',
          documents: 'Documents',
          activity: 'Activity',
          baseMemory: 'Memory',
          dataSources: 'Data Sources',
          knowledge: 'Knowledge',
          connect: 'Connect & Mount',
          back: 'Back to 1.0',
          humanAccount: 'Human Account',
        };

  const groups: Array<{ label: string; items: NavItemConfig[] }> = [
    {
      label: copy.workspace,
      items: [
        {
          label: copy.documents,
          icon: <FileText className="w-4 h-4" />,
          to: '/v2/workspace',
          match: pathname => pathname === '/v2/workspace',
        },
        {
          label: copy.activity,
          icon: <Activity className="w-4 h-4" />,
          to: '/v2/workspace/activity',
          match: pathname => pathname === '/v2/workspace/activity',
        },
      ],
    },
    {
      label: copy.memory,
      items: [
        {
          label: copy.baseMemory,
          icon: <Brain className="w-4 h-4" />,
          to: '/v2/memory',
          match: pathname =>
            pathname.startsWith('/v2/memory') &&
            !pathname.startsWith('/v2/memory/knowledge') &&
            !pathname.startsWith('/v2/memory/sources'),
        },
        {
          label: copy.knowledge,
          icon: <Package2 className="w-4 h-4" />,
          to: '/v2/memory/knowledge',
          match: pathname => pathname.startsWith('/v2/memory/knowledge'),
        },
        {
          label: copy.dataSources,
          icon: <Database className="w-4 h-4" />,
          to: '/v2/memory/sources',
          match: pathname => pathname.startsWith('/v2/memory/sources'),
        },
      ],
    },
    {
      label: copy.integrations,
      items: [
        {
          label: copy.connect,
          icon: <PlugZap className="w-4 h-4" />,
          to: '/v2/connect',
          match: pathname => pathname.startsWith('/v2/connect') || pathname.startsWith('/v2/agent'),
        },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white text-stone-900">
      <aside className="w-64 border-r border-stone-200 bg-[#F7F7F5] flex flex-col">
        <div className="h-14 flex items-center px-4">
          <Link
            to="/"
            className="flex items-center gap-2 hover:bg-stone-200/50 p-1.5 rounded-md transition-colors w-full"
          >
            <div className="w-6 h-6 rounded bg-stone-800 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">MindX</span>
          </Link>
        </div>

        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {groups.map(group => (
            <div key={group.label} className="space-y-1">
              <div className="px-3 mb-2">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                  {group.label}
                </span>
              </div>
              {group.items.map(item => (
                <div key={item.to}>
                  <SidebarItem
                    icon={item.icon}
                    label={item.label}
                    active={item.match(location.pathname)}
                    onClick={() => navigate(item.to)}
                  />
                </div>
              ))}
            </div>
          ))}
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
              <p className="text-xs font-medium truncate">{copy.humanAccount}</p>
              <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
            </div>
            <LanguageSwitcher />
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
