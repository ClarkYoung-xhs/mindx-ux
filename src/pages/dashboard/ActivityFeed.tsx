import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Activity as ActivityIcon } from "lucide-react";
import { getAgentAvatar, getUserAvatar } from "../../components/AgentAvatars";
import { useLanguage } from "../../i18n/LanguageContext";
import { normalizeDocType } from "./constants";
import type { Activity } from "./types";

export interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isZh = lang === "zh";

  const groupActivitiesByDate = (activities: Activity[]) => {
    const groups: Record<string, Activity[]> = {};
    const orderedKeys: string[] = [];
    const sorted = [...activities].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    const now = new Date();
    const todayUTC = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
    const yesterdayUTC = todayUTC - 86400000;

    sorted.forEach((activity) => {
      const date = new Date(activity.timestamp);
      const activityDayUTC = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
      );

      let key = "";
      if (activityDayUTC === todayUTC) {
        key = isZh ? "今天" : "Today";
      } else if (activityDayUTC === yesterdayUTC) {
        key = isZh ? "昨天" : "Yesterday";
      } else {
        const utcDay = date.getUTCDay();
        const utcMonth = date.getUTCMonth();
        const utcDate = date.getUTCDate();
        if (isZh) {
          const weekdays = [
            "周日",
            "周一",
            "周二",
            "周三",
            "周四",
            "周五",
            "周六",
          ];
          key = `${weekdays[utcDay]}  ${utcMonth + 1}/${utcDate}`;
        } else {
          const weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          key = `${weekdays[utcDay]}, ${months[utcMonth]} ${utcDate}`;
        }
      }

      if (!groups[key]) {
        groups[key] = [];
        orderedKeys.push(key);
      }
      groups[key].push(activity);
    });
    return { groups, orderedKeys };
  };

  const { groups: grouped, orderedKeys } = groupActivitiesByDate(activities);

  return (
    <div className="space-y-8 pb-12">
      {orderedKeys.map((key) => (
        <div key={key} className="space-y-4">
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2">
            {key}
          </h3>
          <div className="space-y-1">
            {grouped[key].map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-all group border border-transparent hover:border-stone-200/60 hover:shadow-sm"
              >
                <div className="mt-0.5">
                  {activity.userType === "agent"
                    ? getAgentAvatar(activity.userName, 28)
                    : getUserAvatar(28)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-stone-600 leading-relaxed">
                    <span className="font-bold text-stone-900">
                      {activity.userName}
                    </span>{" "}
                    {isZh ? activity.actionZh : activity.action}{" "}
                    <button
                      onClick={() =>
                        navigate(
                          `/document?id=${activity.docId || ""}&type=${normalizeDocType(activity.targetType)}`,
                        )
                      }
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {activity.targetName}
                    </button>
                    {(isZh ? activity.detailsZh : activity.details) && (
                      <span className="text-stone-400 italic">
                        {" "}
                        — {isZh ? activity.detailsZh : activity.details}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[10px] text-stone-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      {new Date(activity.timestamp).toLocaleTimeString(
                        isZh ? "zh-CN" : [],
                        { hour: "2-digit", minute: "2-digit", timeZone: "UTC" },
                      )}
                    </p>
                    <span className="text-[10px] text-stone-300">•</span>
                    <p className="text-[10px] text-stone-400 font-medium">
                      {new Date(activity.timestamp).toLocaleDateString(
                        isZh ? "zh-CN" : [],
                        { month: "short", day: "numeric", timeZone: "UTC" },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {activities.length === 0 && (
        <div className="py-20 text-center">
          <ActivityIcon className="w-12 h-12 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-400 text-sm">No recent activity yet</p>
        </div>
      )}
    </div>
  );
}
