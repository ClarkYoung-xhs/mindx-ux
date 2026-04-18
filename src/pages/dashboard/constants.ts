// Dashboard-local constants, mock data, and utility functions
import type {
  WorkspaceDoc,
  AbsenceSummaryData,
  Activity,
  DemoMode,
} from "./types";

export const initialWorkspaces = [{ id: "w1", name: "Main Space" }];

export const initialAgents: any[] = [];

export const normalizeDocType = (type: string) =>
  type.toLowerCase().replace(/\s+/g, "");

export const currentUser = {
  id: "u1",
  name: localStorage.getItem("mindx_user_name") || "Me",
  email: localStorage.getItem("mindx_logged_in") || "you@example.com",
};

export const activeWorkspaceIdGlobal =
  localStorage.getItem("mindx_workspace_id") || "w1";

export function isProfilePlaceholder(value: string) {
  const normalized = value.trim();
  return normalized === "加载中..." || normalized === "Loading...";
}

export const initialPermissions = [
  {
    id: "p1",
    workspaceId: "w1",
    memberId: currentUser.id,
    memberType: "Human",
    role: "Owner",
  }
];

export const initialDocuments: WorkspaceDoc[] = [];

export const initialActivities: Activity[] = [];

export const absenceLastVisitTime = "2026-03-24T08:00:00Z";

export const agentColorMap: Record<string, string> = {
  "Claude Assistant": "#F97316",
  "Research Bot": "#8B5CF6",
  "Data Analyzer": "#06B6D4",
};

// Derive absence summary from initialActivities — single source of truth
export const absenceSummaryData: AbsenceSummaryData = {
  lastVisitTime: absenceLastVisitTime,
  changes: initialActivities
    .filter(
      (a) =>
        a.userType === "agent" &&
        new Date(a.timestamp) > new Date(absenceLastVisitTime),
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .map((a) => {
      let action: "created" | "modified" | "commented" = "modified";
      if (a.action === "created") action = "created";
      else if (a.action === "commented on") action = "commented";
      else action = "modified"; // 'updated', 'modified' etc.
      return {
        id: a.docId || a.id,
        action,
        docTitle: a.targetName,
        docType: a.targetType,
        agentName: a.userName,
        agentColor: agentColorMap[a.userName] || "#94A3B8",
        changeDescription: a.detailsZh,
        timestamp: a.timestamp,
      };
    }),
};

// --- Demo mode: "new" = new user onboarding, "existing" = rich mock data ---
export const DEMO_MODE_KEY = "mindx_demo_mode";

export function getDemoMode(): DemoMode {
  const stored = localStorage.getItem(DEMO_MODE_KEY);
  if (stored === "existing") return "existing";
  if (stored === "new") return "new";
  // If no explicit demo mode set, fall back to isNewUser flag for backward compat
  return localStorage.getItem("mindx_is_new_user") === "true"
    ? "new"
    : "existing";
}
