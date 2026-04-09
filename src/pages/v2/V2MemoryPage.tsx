import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { MemoryAsset, SourceLink } from "../../data/mindxDemo";
import { useMindXDemo } from "../../data/mindxDemoContext";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  V2AvatarStack,
  V2CardDetailModal,
  type V2CardRecord,
  type V2SourceRef,
} from "./v2Primitives";
import V2ModuleHeader from "./V2ModuleHeader";
import V2MemoryIntakeLauncher from "./V2MemoryIntakeLauncher";
import { buildTimelineEntries } from "./timelinePresentation";

function formatPageDate(date: Date, lang: "zh" | "en") {
  return date.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDayName(date: Date, lang: "zh" | "en") {
  return date.toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    weekday: "long",
  });
}

function stageBadgeClasses(stage: "captured" | "candidate" | "durable") {
  if (stage === "durable")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (stage === "candidate") return "border-sky-200 bg-sky-50 text-sky-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function formatAssetTypeLabel(type: MemoryAsset["type"]) {
  return type === "follow-up"
    ? "Follow-Up"
    : `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
}

function isAgent(name: string) {
  const normalized = name.toLowerCase();
  return (
    normalized.includes("assistant") ||
    normalized.includes("bot") ||
    normalized.includes("analyzer")
  );
}

function timelinePeople(sources: SourceLink[]) {
  const seen = new Set<string>();

  return sources.reduce<Array<{ name: string; kind: "human" | "agent" }>>(
    (people, source) => {
      source.participants.forEach((participant) => {
        if (participant === "Me" || seen.has(participant)) return;
        seen.add(participant);
        people.push({
          name: participant,
          kind: isAgent(participant) ? "agent" : "human",
        });
      });

      return people;
    },
    [],
  );
}

function timelineSources(sources: SourceLink[]) {
  return sources.map((source) => ({
    id: source.id,
    label: source.docName,
    kind: source.kind,
    storage: source.storage,
    docId: source.docId,
    dataSourceId: source.dataSourceId,
    quote: source.quote,
  }));
}

export default function V2MemoryPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    documents,
    memoryAssets,
    memoryDataSources,
    memorySourceLinks,
    memoryTimeline,
  } = useMindXDemo();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCard, setSelectedCard] = useState<V2CardRecord | null>(null);
  const focusDocId = searchParams.get("doc");
  const focusEventId = searchParams.get("event");
  const focusAssetId = searchParams.get("asset");
  const focusSourceId = searchParams.get("source");

  const timelineEntries = useMemo(
    () =>
      buildTimelineEntries({
        memoryAssets,
        memorySourceLinks,
        memoryTimeline,
        lang,
      }),
    [lang, memoryAssets, memorySourceLinks, memoryTimeline],
  );

  const sourceMap = useMemo(
    () =>
      memorySourceLinks.reduce<Record<string, SourceLink>>((map, source) => {
        map[source.id] = source;
        return map;
      }, {}),
    [memorySourceLinks],
  );

  const documentMap = useMemo(
    () =>
      documents.reduce<Record<string, (typeof documents)[number]>>(
        (map, doc) => {
          map[doc.id] = doc;
          return map;
        },
        {},
      ),
    [documents],
  );

  const eventCardMap = useMemo(
    () =>
      timelineEntries.reduce<Record<string, V2CardRecord>>((map, entry) => {
        if (entry.card) map[entry.event.id] = entry.card;
        return map;
      }, {}),
    [timelineEntries],
  );

  const assetCardMap = useMemo(
    () =>
      memoryAssets.reduce<Record<string, V2CardRecord>>((map, asset) => {
        const sources = asset.sourceIds
          .map((sourceId) => sourceMap[sourceId])
          .filter((source): source is SourceLink => Boolean(source));

        map[asset.id] = {
          id: asset.id,
          timestamp: asset.freshness,
          typeLabel: formatAssetTypeLabel(asset.type),
          title: asset.title,
          content: asset.summary,
          tags: asset.tags,
          sources: timelineSources(sources),
          people: timelinePeople(sources),
          relatedIds: asset.relatedAssetIds,
          evidence: asset.evidence,
        };

        return map;
      }, {}),
    [memoryAssets, sourceMap],
  );

  const focusedDoc = useMemo(
    () => documents.find((doc) => doc.id === focusDocId) ?? null,
    [documents, focusDocId],
  );

  const focusedSource = useMemo(
    () =>
      memoryDataSources.find((source) => source.id === focusSourceId) ?? null,
    [focusSourceId, memoryDataSources],
  );

  const visibleTimelineEntries = useMemo(() => {
    return timelineEntries.filter((entry) => {
      const matchesDoc =
        !focusDocId ||
        entry.event.docId === focusDocId ||
        entry.event.sourceIds.some(
          (sourceId) => sourceMap[sourceId]?.docId === focusDocId,
        );

      const matchesSource =
        !focusSourceId ||
        entry.event.sourceIds.some(
          (sourceId) => sourceMap[sourceId]?.dataSourceId === focusSourceId,
        );

      return matchesDoc && matchesSource;
    });
  }, [focusDocId, focusSourceId, sourceMap, timelineEntries]);

  const timelineGroups = useMemo(
    () =>
      visibleTimelineEntries.reduce<
        Array<{ label: string; items: typeof visibleTimelineEntries }>
      >((groups, entry) => {
        const currentGroup = groups[groups.length - 1];
        if (!currentGroup || currentGroup.label !== entry.event.dayLabel) {
          groups.push({ label: entry.event.dayLabel, items: [entry] });
          return groups;
        }

        currentGroup.items.push(entry);
        return groups;
      }, []),
    [visibleTimelineEntries],
  );

  const metrics = useMemo(() => {
    const collaborators = new Set(
      visibleTimelineEntries.flatMap((entry) =>
        entry.people.map((person) => person.name),
      ),
    );

    return {
      storyBeats: visibleTimelineEntries.length,
      collaborators: collaborators.size,
      durableMemories: visibleTimelineEntries.filter(
        (entry) => entry.event.stage === "durable",
      ).length,
    };
  }, [visibleTimelineEntries]);

  const focusedSourceAssetIds = useMemo(() => {
    if (!focusSourceId) return [];
    return Array.from(
      new Set(
        memoryAssets
          .filter((asset) =>
            asset.sourceIds.some(
              (sourceId) => sourceMap[sourceId]?.dataSourceId === focusSourceId,
            ),
          )
          .map((asset) => asset.id),
      ),
    );
  }, [focusSourceId, memoryAssets, sourceMap]);

  const reportText = useMemo(() => {
    if (lang === "zh") {
      return "今天你主要围绕 onboarding 在推进三件事：先在 standup 里对齐第一步该给用户什么感受，再根据访谈把判断收紧，最后把 PRD 里真正该写死的约束定下来。";
    }

    return "Today your main thread stayed focused on onboarding: align the first user impression in standup, tighten the judgment with interview evidence, then lock the real constraint into the PRD.";
  }, [lang]);

  const relatedCards = useMemo(() => {
    if (!selectedCard) return [];
    return (selectedCard.relatedIds ?? [])
      .map((relatedId) => assetCardMap[relatedId])
      .filter((card): card is V2CardRecord => Boolean(card));
  }, [assetCardMap, selectedCard]);

  useEffect(() => {
    if (focusEventId && eventCardMap[focusEventId]) {
      setSelectedCard(eventCardMap[focusEventId]);
      return;
    }

    if (focusAssetId && assetCardMap[focusAssetId]) {
      setSelectedCard(assetCardMap[focusAssetId]);
    }
  }, [assetCardMap, eventCardMap, focusAssetId, focusEventId]);

  useEffect(() => {
    if (!focusEventId) return;

    const frame = requestAnimationFrame(() => {
      const node = document.getElementById(`timeline-event-${focusEventId}`);
      node?.scrollIntoView({ block: "center", behavior: "smooth" });
    });

    return () => cancelAnimationFrame(frame);
  }, [focusEventId, visibleTimelineEntries]);

  const changeDate = (days: number) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + days);
    setCurrentDate(nextDate);
  };

  const openSource = (source: V2SourceRef) => {
    if (source.storage === "memory" && source.dataSourceId) {
      navigate(
        `/document?source=data_source&dataSourceId=${source.dataSourceId}&from=memory`,
      );
      return;
    }

    if (!source.docId) return;

    if (source.kind === "chat") {
      navigate(`/document?id=${source.docId}&type=chatlog&from=memory`);
      return;
    }

    const doc = documentMap[source.docId];
    const type = doc?.type.toLowerCase().replace(/\s+/g, "") ?? "text";
    navigate(`/document?id=${source.docId}&type=${type}&from=memory`);
  };

  return (
    <>
      <div className="space-y-8">
        <V2ModuleHeader
          title={lang === "zh" ? "时间轴" : "Timeline"}
          actionSlot={<V2MemoryIntakeLauncher />}
        />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(28,25,23,0.04)]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
                  {formatDayName(currentDate, lang)}
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
                  {formatPageDate(currentDate, lang)}
                </h2>
              </div>

              <div className="flex items-center gap-1 rounded-2xl bg-stone-100 p-1 shadow-sm">
                <button
                  onClick={() => changeDate(-1)}
                  className="rounded-xl p-2 text-stone-500 transition-all hover:bg-white hover:shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-700 transition-all hover:bg-white hover:shadow-sm"
                >
                  {lang === "zh" ? "今天" : "Today"}
                </button>
                <button
                  onClick={() => changeDate(1)}
                  className="rounded-xl p-2 text-stone-500 transition-all hover:bg-white hover:shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <div className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-600">
                {lang === "zh"
                  ? `摘要节点 ${metrics.storyBeats}`
                  : `${metrics.storyBeats} story beats`}
              </div>
              <div className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-600">
                {lang === "zh"
                  ? `协作角色 ${metrics.collaborators}`
                  : `${metrics.collaborators} collaborators`}
              </div>
              <div className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-600">
                {lang === "zh"
                  ? `已沉淀 ${metrics.durableMemories}`
                  : `${metrics.durableMemories} durable`}
              </div>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-stone-200 bg-[#F7F7F5] p-6 shadow-[0_10px_30px_rgba(28,25,23,0.03)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-stone-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
                  {lang === "zh" ? "今日摘要" : "Daily Summary"}
                </div>
                <div className="text-lg font-semibold tracking-tight text-stone-900">
                  {lang === "zh"
                    ? "今天最值得记住的主线"
                    : "The main thread worth keeping today"}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              {reportText}
            </p>
          </aside>
        </section>

        {focusedDoc && (
          <section className="rounded-[1.75rem] border border-stone-200 bg-[#F7F7F5] p-5 shadow-[0_10px_30px_rgba(28,25,23,0.03)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone-400">
                  {lang === "zh"
                    ? "来自 Workspace 的过滤"
                    : "Filtered from Workspace"}
                </div>
                <div className="mt-2 text-lg font-semibold text-stone-900">
                  {focusedDoc.name}
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {lang === "zh"
                    ? "当前只展示和这份文档直接相关的记忆线索。你可以继续看这一组摘要，也可以回到 Workspace 看原始上下文。"
                    : "Only memory signals directly connected to this document are shown here. Stay on this thread or jump back to Workspace for the original context."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    navigate(`/v2/doc/${focusedDoc.id}?from=memory`)
                  }
                  className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                >
                  {lang === "zh" ? "返回 Workspace" : "Back to Workspace"}
                </button>
                <button
                  onClick={() => navigate("/v2/memory/timeline")}
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                >
                  {lang === "zh" ? "查看全部 Timeline" : "View full timeline"}
                </button>
              </div>
            </div>
          </section>
        )}

        {focusedSource && (
          <section className="rounded-[1.75rem] border border-stone-200 bg-[#F7F7F5] p-5 shadow-[0_10px_30px_rgba(28,25,23,0.03)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="text-lg font-semibold text-stone-900">
                  {focusedSource.name}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                    {focusedSource.typeLabel}
                  </span>
                  <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                    {lang === "zh"
                      ? `${visibleTimelineEntries.length} 条 Timeline`
                      : `${visibleTimelineEntries.length} timeline signals`}
                  </span>
                  <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
                    {lang === "zh"
                      ? `${focusedSourceAssetIds.length} 张 Knowledge`
                      : `${focusedSourceAssetIds.length} knowledge assets`}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    navigate(
                      `/document?source=data_source&dataSourceId=${focusedSource.id}&from=memory`,
                    )
                  }
                  className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                >
                  {lang === "zh" ? "打开数据源" : "Open source"}
                </button>
                <button
                  onClick={() =>
                    navigate(`/v2/knowledge?source=${focusedSource.id}`)
                  }
                  className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
                >
                  {lang === "zh" ? "查看知识资产" : "View knowledge"}
                </button>
                <button
                  onClick={() => navigate("/v2/memory/timeline")}
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800"
                >
                  {lang === "zh" ? "查看全部 Timeline" : "View full timeline"}
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-[1.75rem] border border-stone-200 bg-[#F7F7F5] p-6 shadow-[0_10px_30px_rgba(28,25,23,0.03)]">
          <div className="relative space-y-10 pl-6 lg:pl-8">
            <div className="absolute bottom-4 left-[10px] top-4 w-px bg-stone-200 lg:left-[12px]" />

            {visibleTimelineEntries.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-stone-200 bg-white p-8 text-sm leading-7 text-stone-500">
                {lang === "zh"
                  ? "这份文档当前还没有被整理进时间轴。你可以先回到 Workspace 查看上下文，或者切换到 Knowledge 看是否已经沉淀成其它资产。"
                  : "This document does not surface on the timeline yet. Return to Workspace for the source context, or switch to Knowledge to see whether it has already been distilled elsewhere."}
              </div>
            ) : (
              timelineGroups.map((group) => (
                <section key={group.label} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                      {group.label}
                    </div>
                    <div className="h-px flex-1 bg-stone-200" />
                  </div>

                  {group.items.map((entry) => {
                    const isFocused = focusEventId === entry.event.id;

                    return (
                      <article
                        key={entry.event.id}
                        id={`timeline-event-${entry.event.id}`}
                        className="group relative"
                      >
                        <div className="absolute left-[-16px] top-5 z-10 h-3.5 w-3.5 rounded-full border-2 border-stone-300 bg-white shadow-sm lg:left-[-20px]" />

                        <div
                          className={`rounded-[1.5rem] border bg-white p-6 transition-all ${
                            isFocused
                              ? "border-stone-300 shadow-[0_12px_30px_rgba(28,25,23,0.06)]"
                              : "border-stone-200 shadow-[0_10px_24px_rgba(28,25,23,0.04)]"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-600">
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${
                                    entry.signal.stage === "durable"
                                      ? "bg-emerald-500"
                                      : entry.signal.stage === "candidate"
                                        ? "bg-sky-500"
                                        : "bg-amber-500"
                                  }`}
                                />
                                {entry.signal.timeLabel}
                              </span>
                              <span
                                className={`rounded-full border px-3 py-1.5 text-sm font-medium ${stageBadgeClasses(
                                  entry.signal.stage,
                                )}`}
                              >
                                {entry.signal.stageLabel}
                              </span>
                            </div>

                            {entry.people.length > 0 && (
                              <div className="flex items-center gap-2 text-sm text-stone-500">
                                <V2AvatarStack
                                  people={entry.people.slice(0, 3)}
                                  size={28}
                                  overlap={-8}
                                />
                                <span>{entry.people.length}</span>
                              </div>
                            )}
                          </div>

                          <h3 className="mt-5 text-[18px] font-semibold tracking-tight text-stone-900">
                            {entry.signal.title}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-stone-700">
                            {entry.signal.summary}
                          </p>

                          <div className="mt-5 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                openSource({
                                  id:
                                    entry.primarySource?.id ??
                                    entry.signal.eventId,
                                  label: entry.signal.docName,
                                  kind: entry.signal.sourceKind,
                                  docId: entry.signal.docId,
                                })
                              }
                              className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 hover:text-stone-900"
                            >
                              {entry.signal.sourceKind === "chat" ? (
                                <MessageSquare
                                  size={16}
                                  className="text-stone-500"
                                />
                              ) : entry.signal.sourceKind === "comment" ? (
                                <Clock3 size={16} className="text-stone-500" />
                              ) : (
                                <FileText
                                  size={16}
                                  className="text-stone-500"
                                />
                              )}
                              <span>{entry.signal.docName}</span>
                            </button>
                            {entry.primaryAsset && (
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/v2/knowledge?asset=${entry.primaryAsset?.id}`,
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-200 hover:text-stone-900"
                              >
                                <Sparkles
                                  size={16}
                                  className="text-stone-500"
                                />
                                <span>
                                  {lang === "zh"
                                    ? "查看知识资产"
                                    : "Open knowledge"}
                                </span>
                              </button>
                            )}
                          </div>

                          {entry.card && (
                            <button
                              type="button"
                              onClick={() => setSelectedCard(entry.card!)}
                              className="mt-6 block w-full rounded-[1.35rem] border border-stone-200 bg-stone-50/70 p-5 text-left transition-all hover:border-stone-300 hover:bg-stone-50"
                            >
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
                                  {entry.card.typeLabel}
                                </span>
                              </div>

                              <h4 className="mt-4 text-[17px] font-semibold tracking-tight text-stone-900">
                                {entry.card.title}
                              </h4>
                              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                                {entry.card.content}
                              </p>

                              {entry.card.tags.length > 0 && (
                                <div className="mt-5 flex flex-wrap gap-3">
                                  {entry.card.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone-400"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </section>
              ))
            )}
          </div>
        </section>
      </div>

      <V2CardDetailModal
        card={selectedCard}
        relatedCards={relatedCards}
        onClose={() => setSelectedCard(null)}
        onOpenRelated={(cardId) =>
          setSelectedCard(assetCardMap[cardId] ?? null)
        }
        onOpenSource={openSource}
      />
    </>
  );
}
