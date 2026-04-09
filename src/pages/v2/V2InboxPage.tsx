import { useMemo, useState } from "react";
import { Inbox, Filter, Search } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { inboxSheet } from "../../data/inboxSheetMockData";
import SheetView from "../../components/SheetRenderer/SheetView";
import V2MemoryIntakeLauncher from "./V2MemoryIntakeLauncher";

/**
 * V2InboxPage — renders the global Inbox as a Smart Sheet view.
 * This replaces the old "Data Sources" page.
 */
export default function V2InboxPage() {
  const { lang } = useLanguage();
  const [searchText, setSearchText] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);

  const copy = useMemo(
    () =>
      lang === "zh"
        ? {
            title: "Inbox",
            subtitle: "所有原始碎片的统一收口，支持主动录入、剪藏或第三方同步",
            search: "搜索...",
            allSources: "全部来源",
          }
        : {
            title: "Inbox",
            subtitle:
              "Unified inbox for all raw fragments — manual input, web clips, and third-party sync",
            search: "Search...",
            allSources: "All Sources",
          },
    [lang],
  );

  // Build viewFilter for SheetView based on search text and source filter
  const viewFilter = useMemo(() => {
    const filter: Record<string, string> = {};
    if (searchText.trim()) {
      filter["标题"] = searchText.trim();
    }
    if (sourceFilter) {
      filter["来源"] = sourceFilter;
    }
    return Object.keys(filter).length > 0 ? filter : undefined;
  }, [searchText, sourceFilter]);

  // Source options extracted from actual row data
  const sourceOptions = useMemo(() => {
    const values = new Set<string>();
    for (const row of inboxSheet.rows) {
      const v = row.cells["col-source"];
      if (typeof v === "string" && v) values.add(v);
    }
    return Array.from(values);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <Inbox className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-stone-900">{copy.title}</h1>
            <p className="text-sm text-stone-500">{copy.subtitle}</p>
          </div>
          {/* Add memory source button */}
          <V2MemoryIntakeLauncher />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder={copy.search}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-stone-300 transition"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setSourceFilter(null)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition ${
              sourceFilter
                ? "text-stone-900 border-stone-300 bg-stone-50"
                : "text-stone-600 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {sourceFilter ?? copy.allSources}
          </button>
        </div>
        {/* Source filter chips */}
        {sourceOptions.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {sourceOptions.map((src) => (
              <button
                key={src}
                onClick={() =>
                  setSourceFilter((prev) => (prev === src ? null : src))
                }
                className={`px-2.5 py-1 text-xs rounded-full border transition ${
                  sourceFilter === src
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sheet Table — using SheetView for built-in row expand support */}
      <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
        <SheetView sheetData={inboxSheet} viewFilter={viewFilter} compact />
      </div>
    </div>
  );
}
