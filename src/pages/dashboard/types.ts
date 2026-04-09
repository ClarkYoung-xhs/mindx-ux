// Dashboard-local type definitions
// Note: These types are specific to the Dashboard page and may differ from
// the ones in src/data/mindxDemo.ts (which are used by other components).

export interface WorkspaceDoc {
  id: string;
  /** @deprecated No longer used — workspace concept removed in four-layer restructure */
  workspaceId?: string;
  name: string;
  type: string;
  date: string;
  lastModified: string;
  lastViewed: string;
  labels: string[];
  creatorName: string;
  creatorType: "human" | "agent";
  size: number; // Size in bytes
  isNew?: boolean; // Whether this doc was created while the user was away
  isRead?: boolean; // Whether the user has read this doc
  source?: "normal" | "scheduled" | "webclip" | "memory"; // Document source
  children?: WorkspaceDoc[]; // Nested child documents (file-in-file)
  parentId?: string; // Parent document ID for nesting
}

export interface AgentPermission {
  agentId: string;
  agentName: string;
  permission: "read" | "edit";
}

// --- Absence Summary types ---
export interface AbsenceChange {
  id: string;
  action: "created" | "modified" | "commented";
  docTitle: string;
  docType: string;
  agentName: string;
  agentColor: string;
  changeDescription?: string;
  timestamp: string;
}

export interface AbsenceSummaryData {
  lastVisitTime: string;
  changes: AbsenceChange[];
}

export interface Activity {
  id: string;
  workspaceId: string;
  userId: string;
  userName: string;
  userType: "human" | "agent";
  action: string;
  actionZh: string;
  targetName: string;
  targetType: string;
  docId?: string; // Reference to WorkspaceDoc.id
  details?: string;
  detailsZh?: string;
  timestamp: string;
}

export type DemoMode = "new" | "existing";
