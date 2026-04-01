import { ChevronDown, Plus } from 'lucide-react';
import { useState, type ReactNode } from 'react';

export interface V2HeaderActionItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
}

interface V2ModuleHeaderProps {
  title: string;
  actionLabel?: string;
  actionItems?: V2HeaderActionItem[];
  actionSlot?: ReactNode;
}

export default function V2ModuleHeader({
  title,
  actionLabel,
  actionItems = [],
  actionSlot,
}: V2ModuleHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasActions = Boolean(actionLabel && actionItems.length > 0);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{title}</h1>

      {actionSlot ? (
        actionSlot
      ) : hasActions ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(open => !open)}
            className="inline-flex items-center gap-1.5 rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            {actionLabel}
            <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-stone-200 bg-white py-1 shadow-xl">
                {actionItems.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      item.onSelect();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-stone-700 transition-colors hover:bg-stone-50"
                  >
                    <span className="flex h-4 w-4 items-center justify-center text-stone-500">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
