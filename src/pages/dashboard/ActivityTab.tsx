import { useMemo } from "react";
import { motion } from "motion/react";
import { Activity, Brain, Clock3, Bot, User } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { useMindXDemo } from "../../data/mindxDemoContext";
import type { Activity as ActivityType } from "./types";

function formatTimestamp(timestamp: string, lang: "zh" | "en") {
  const date = new Date(timestamp);
  return date.toLocaleString(lang === "zh" ? "zh-CN" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export interface ActivityTabProps {
  activityFilterOwner: string;
  setActivityFilterOwner: (v: string) => void;
  activityOwners: string[];
  workspaceActivities: ActivityType[];
  filteredActivities: ActivityType[];
}

export default function ActivityTab({
  activityFilterOwner,
  setActivityFilterOwner,
  activityOwners,
  workspaceActivities,
  filteredActivities,
}: ActivityTabProps) {
  const { t, lang } = useLanguage();
  const { memoryTimeline } = useMindXDemo();

  const sortedActivities = useMemo(
    () =>
      [...filteredActivities]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, 15),
    [filteredActivities],
  );

  const formingSignals = useMemo(
    () =>
      memoryTimeline.filter((event) => event.stage !== "durable").slice(0, 4),
    [memoryTimeline],
  );

  const copy =
    lang === "zh"
      ? {
          activityTitle: "最近动态",
          signalTitle: "记忆线索",
          empty: "暂无动态",
        }
      : {
          activityTitle: "Recent Activity",
          signalTitle: "Memory Signals",
          empty: "No recent activity",
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl"
    >
      {/* Owner filter row */}
      <div className="flex items-center gap-1.5 mb-6 flex-wrap">
        <button
          onClick={() => setActivityFilterOwner("all")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activityFilterOwner === "all"
              ? "bg-stone-800 text-white"
              : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
          }`}
        >
          {t("docs.all")}
        </button>
        {activityOwners.map((owner) => {
          const ownerActivity = workspaceActivities.find(
            (a) => a.userName === owner,
          );
          return (
            <button
              key={owner}
              onClick={() =>
                setActivityFilterOwner(
                  activityFilterOwner === owner ? "all" : owner,
                )
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activityFilterOwner === owner
                  ? "bg-stone-800 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700"
              }`}
            >
              {ownerActivity?.userType === "agent" ? (
                <Bot className="w-3.5 h-3.5" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
              {owner}
            </button>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
        {/* Activity List */}
        <section className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(28,25,23,0.04)]">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-stone-500" />
            <h2 className="text-lg font-semibold tracking-tight text-stone-900">
              {copy.activityTitle}
            </h2>
          </div>
          <div className="mt-5 space-y-3">
            {sortedActivities.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
                {copy.empty}
              </div>
            ) : (
              sortedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-[1.35rem] border border-stone-200 bg-stone-50/60 px-4 py-4 transition-all hover:border-stone-300 hover:bg-stone-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-stone-900">
                        {activity.userName} {activity.action}{" "}
                        <span className="text-stone-700 underline underline-offset-2 decoration-stone-300">
                          {activity.targetName}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        {activity.details}
                      </p>
                    </div>
                    <div className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                      {formatTimestamp(activity.timestamp, lang)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Memory Signals Sidebar */}
        <section className="rounded-[1.75rem] border border-stone-200 bg-[#F7F7F5] p-6 shadow-[0_10px_30px_rgba(28,25,23,0.03)]">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-stone-500" />
            <h2 className="text-lg font-semibold tracking-tight text-stone-900">
              {copy.signalTitle}
            </h2>
          </div>
          <div className="mt-5 space-y-3">
            {formingSignals.map((signal) => (
              <div
                key={signal.id}
                className="rounded-[1.35rem] border border-stone-200 bg-white px-4 py-4 text-left transition-all hover:border-stone-300 hover:bg-stone-50"
              >
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  <Clock3 className="h-3.5 w-3.5" />
                  {signal.timeLabel}
                </div>
                <div className="mt-2 text-sm font-semibold text-stone-900">
                  {signal.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {signal.summary}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
