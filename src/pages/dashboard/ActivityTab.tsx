import React from "react";
import { motion } from "motion/react";
import { Bot, User } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import type { Activity } from "./types";
import ActivityFeed from "./ActivityFeed";

export interface ActivityTabProps {
  activityFilterOwner: string;
  setActivityFilterOwner: (v: string) => void;
  activityOwners: string[];
  workspaceActivities: Activity[];
  filteredActivities: Activity[];
}

export default function ActivityTab({
  activityFilterOwner,
  setActivityFilterOwner,
  activityOwners,
  workspaceActivities,
  filteredActivities,
}: ActivityTabProps) {
  const { t } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Owner filter row */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
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
      <ActivityFeed activities={filteredActivities} />
    </motion.div>
  );
}
