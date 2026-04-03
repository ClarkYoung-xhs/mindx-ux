import { useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface V2MemoryTabsProps {
  activeView: 'memory' | 'timeline' | 'knowledge';
  onChange: (view: 'memory' | 'timeline' | 'knowledge') => void;
}

export default function V2MemoryTabs({ activeView, onChange }: V2MemoryTabsProps) {
  const { lang } = useLanguage();

  const tabs = useMemo(
    () => [
      {
        key: 'memory' as const,
        zh: '基础记忆',
        en: 'Memory',
      },
      {
        key: 'timeline' as const,
        zh: '记忆时间轴',
        en: 'Timeline',
      },
      {
        key: 'knowledge' as const,
        zh: '知识资产',
        en: 'Knowledge',
      },
    ],
    []
  );

  return (
    <div className="inline-flex items-center gap-1 rounded-2xl bg-[#F3F3F1] p-1.5 shadow-sm">
      {tabs.map(tab => {
        const active = tab.key === activeView;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`rounded-[1rem] px-4 py-2 text-xs font-bold transition-all ${
              active
                ? 'bg-white text-zinc-900 shadow-[0_6px_18px_rgba(24,24,27,0.08)]'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            {lang === 'zh' ? tab.zh : tab.en}
          </button>
        );
      })}
    </div>
  );
}
