import {
  Cloud,
  Database,
  FileText,
  Globe,
  RefreshCw,
  Waypoints,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { MemoryDataSource } from "../../data/mindxDemo";
import { useMindXDemo } from "../../data/mindxDemoContext";
import { useLanguage } from "../../i18n/LanguageContext";
import V2MemoryIntakeLauncher from "./V2MemoryIntakeLauncher";
import V2ModuleHeader from "./V2ModuleHeader";

function categoryLabel(
  category: MemoryDataSource["category"],
  lang: "zh" | "en",
) {
  if (lang === "zh") {
    if (category === "manual-upload") return "手动上传";
    if (category === "search-capture") return "搜索与收藏";
    if (category === "cloud-collaboration") return "云端协作";
    return "第三方同步";
  }

  if (category === "manual-upload") return "Manual upload";
  if (category === "search-capture") return "Search & capture";
  if (category === "cloud-collaboration") return "Cloud collaboration";
  return "Third-party sync";
}

function pipelineStatusLabel(
  status: "captured" | "refining" | "distilled" | "syncing",
  lang: "zh" | "en",
) {
  if (lang === "zh") {
    if (status === "distilled") return "已沉淀";
    if (status === "refining") return "提炼中";
    if (status === "syncing") return "同步中";
    return "待提取";
  }

  if (status === "distilled") return "Distilled";
  if (status === "refining") return "Refining";
  if (status === "syncing") return "Syncing";
  return "Captured";
}

function pipelineStatusClasses(
  status: "captured" | "refining" | "distilled" | "syncing",
) {
  if (status === "distilled")
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (status === "refining")
    return "bg-sky-50 text-sky-700 border border-sky-200";
  if (status === "syncing")
    return "bg-stone-900 text-white border border-stone-900";
  return "bg-amber-50 text-amber-700 border border-amber-200";
}

function categoryIcon(category: MemoryDataSource["category"]) {
  if (category === "manual-upload") return <FileText className="h-4 w-4" />;
  if (category === "search-capture") return <Globe className="h-4 w-4" />;
  if (category === "cloud-collaboration") return <Cloud className="h-4 w-4" />;
  return <Waypoints className="h-4 w-4" />;
}

export default function V2DataSourcesPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightedSourceId = searchParams.get("source");
  const { memoryAssets, memoryDataSources, memorySourceLinks, memoryTimeline } =
    useMindXDemo();
  const [categoryFilter, setCategoryFilter] = useState<
    MemoryDataSource["category"] | "all"
  >("all");

  const categoryFilters = useMemo(
    () => [
      {
        id: "all" as const,
        label: lang === "zh" ? "全部" : "All",
        count: memoryDataSources.length,
      },
      ...(
        [
          "manual-upload",
          "search-capture",
          "cloud-collaboration",
          "third-party-sync",
        ] as const
      ).map((category) => ({
        id: category,
        label: categoryLabel(category, lang),
        count: memoryDataSources.filter(
          (source) => source.category === category,
        ).length,
      })),
    ],
    [lang, memoryDataSources],
  );

  const sortedSources = useMemo(
    () =>
      memoryDataSources
        .filter(
          (source) =>
            categoryFilter === "all" || source.category === categoryFilter,
        )
        .sort((left, right) => {
          if (left.id === highlightedSourceId) return -1;
          if (right.id === highlightedSourceId) return 1;
          return right.id.localeCompare(left.id);
        }),
    [categoryFilter, highlightedSourceId, memoryDataSources],
  );

  const sourceFlowById = useMemo(
    () =>
      memoryDataSources.reduce<
        Record<
          string,
          {
            assetCount: number;
            pipelineStatus: "captured" | "refining" | "distilled" | "syncing";
          }
        >
      >((accumulator, source) => {
        const sourceLinkIds = memorySourceLinks
          .filter((link) => link.dataSourceId === source.id)
          .map((link) => link.id);

        const linkedEvents = memoryTimeline.filter((event) =>
          event.sourceIds.some((sourceId) => sourceLinkIds.includes(sourceId)),
        );
        const linkedAssets = memoryAssets.filter((asset) =>
          asset.sourceIds.some((sourceId) => sourceLinkIds.includes(sourceId)),
        );
        const durableCount = linkedAssets.filter(
          (asset) => asset.status === "durable",
        ).length;
        const reviewOrCandidateCount = linkedAssets.filter(
          (asset) => asset.status !== "durable",
        ).length;

        let pipelineStatus: "captured" | "refining" | "distilled" | "syncing" =
          "captured";
        if (source.status === "syncing") pipelineStatus = "syncing";
        else if (durableCount > 0 && reviewOrCandidateCount === 0)
          pipelineStatus = "distilled";
        else if (linkedEvents.length > 0 || linkedAssets.length > 0)
          pipelineStatus = "refining";

        accumulator[source.id] = {
          assetCount: linkedAssets.length,
          pipelineStatus,
        };
        return accumulator;
      }, {}),
    [memoryAssets, memoryDataSources, memorySourceLinks, memoryTimeline],
  );

  useEffect(() => {
    if (!highlightedSourceId) return;
    const target = document.querySelector<HTMLElement>(
      `[data-source-row="${highlightedSourceId}"]`,
    );
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedSourceId]);

  return (
    <div className="space-y-6">
      <V2ModuleHeader
        title={lang === "zh" ? "数据源" : "Data Sources"}
        actionSlot={<V2MemoryIntakeLauncher />}
      />

      <div className="flex items-center gap-1 flex-wrap">
        {categoryFilters
          .filter((item) => item.id === "all" || item.count > 0)
          .map((item) => {
            const active = categoryFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategoryFilter(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-stone-200 text-stone-700"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                }`}
              >
                {item.label}
                <span
                  className={`text-[10px] ${active ? "text-stone-500" : "text-stone-400"}`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200/80 bg-stone-50/50 text-stone-500">
            <tr>
              <th className="px-6 py-3 font-medium">
                {lang === "zh" ? "名称" : "Name"}
              </th>
              <th className="px-6 py-3 font-medium">
                {lang === "zh" ? "类型" : "Type"}
              </th>
              <th className="px-6 py-3 font-medium">
                {lang === "zh" ? "处理进度" : "Pipeline"}
              </th>
              <th className="px-6 py-3 font-medium">
                {lang === "zh" ? "更新时间" : "Updated"}
              </th>
              <th className="px-6 py-3 font-medium">
                {lang === "zh" ? "标签" : "Tags"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {sortedSources.map((source) => {
              const highlighted = source.id === highlightedSourceId;
              const flow = sourceFlowById[source.id] ?? {
                assetCount: 0,
                pipelineStatus:
                  source.status === "syncing"
                    ? "syncing"
                    : ("captured" as const),
              };

              return (
                <tr
                  key={source.id}
                  data-source-row={source.id}
                  onClick={() =>
                    navigate(
                      `/document?source=data_source&dataSourceId=${source.id}&from=data-sources`,
                    )
                  }
                  className={`group cursor-pointer transition-colors ${
                    highlighted ? "bg-stone-50" : "hover:bg-stone-50/70"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                        {categoryIcon(source.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-stone-900 transition-colors group-hover:text-stone-700 group-hover:underline underline-offset-2">
                          {source.name}
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">
                          {source.summary}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">
                    {source.typeLabel}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${pipelineStatusClasses(flow.pipelineStatus)}`}
                    >
                      {flow.pipelineStatus === "syncing" && (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      {pipelineStatusLabel(flow.pipelineStatus, lang)}
                    </span>
                    {flow.pipelineStatus === "distilled" &&
                      flow.assetCount > 0 && (
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(`/v2/knowledge?source=${source.id}`);
                            }}
                            className="text-xs font-medium text-stone-500 transition-colors hover:text-stone-900"
                          >
                            {lang === "zh"
                              ? `产出 ${flow.assetCount} 条 Knowledge`
                              : `${flow.assetCount} Knowledge assets`}
                          </button>
                        </div>
                      )}
                  </td>
                  <td className="px-6 py-4 text-stone-500">
                    {source.freshness}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {source.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-stone-100 px-2 py-1 text-[11px] font-medium text-stone-500"
                        >
                          #{tag}
                        </span>
                      ))}
                      {source.tags.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-stone-100 px-2 py-1 text-[11px] font-medium text-stone-400">
                          +{source.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedSources.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
              <Database className="h-5 w-5" />
            </div>
            <div className="text-sm text-stone-500">
              {lang === "zh"
                ? "还没有数据源，先接入一份记忆。"
                : "No data sources yet. Add a memory source first."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
