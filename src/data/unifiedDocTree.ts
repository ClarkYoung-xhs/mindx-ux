/**
 * Unified document tree, activities, and cross-references.
 * Merges the former toB (initialDocuments) and toC (tocInitialDocuments)
 * into a single tree with two top-level Smart Canvas root nodes.
 */
import type { WorkspaceDoc, Activity } from "./mindxDemo";
import { initialDocuments, initialActivities, currentUser } from "./mindxDemo";
import { tocInitialDocuments, tocInitialActivities } from "./tocMindxDemo";
import { crossReferences } from "./crossReferences";
import { tocCrossReferences } from "./tocCrossReferences";
import type { CrossReference } from "../types/crossRef";
import {
  tobWorkspaceRootBlocks,
  tocWorkspaceRootBlocks,
} from "./workspaceRootBlocks";

// Re-export for convenience
export { tobWorkspaceRootBlocks, tocWorkspaceRootBlocks };

// ---------------------------------------------------------------------------
// Unified document tree
// ---------------------------------------------------------------------------

export const unifiedDocuments: WorkspaceDoc[] = [
  {
    id: "ws-tob-root",
    name: "进销存工作台",
    type: "Smart Canvas",
    date: "Today",
    lastModified: "2026-04-09T12:00:00Z",
    lastViewed: "2026-04-09T14:00:00Z",
    labels: ["Workspace", "B2B", "Supply Chain"],
    creatorName: currentUser.name,
    creatorType: "human",
    size: 8192,
    blocks: tobWorkspaceRootBlocks,
    children: initialDocuments,
  },
  {
    id: "ws-toc-root",
    name: "个人资产管理",
    type: "Smart Canvas",
    date: "Today",
    lastModified: "2026-04-09T10:00:00Z",
    lastViewed: "2026-04-09T12:00:00Z",
    labels: ["Workspace", "Personal Finance", "Investment"],
    creatorName: currentUser.name,
    creatorType: "human",
    size: 8192,
    blocks: tocWorkspaceRootBlocks,
    children: tocInitialDocuments,
  },
];

// ---------------------------------------------------------------------------
// Unified activities (merged toB + toC, sorted by timestamp descending)
// ---------------------------------------------------------------------------

export const unifiedActivities: Activity[] = [
  ...initialActivities,
  ...tocInitialActivities,
].sort(
  (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
);

// ---------------------------------------------------------------------------
// Unified cross-references (merged toB + toC)
// ---------------------------------------------------------------------------

export const unifiedCrossReferences: CrossReference[] = [
  ...crossReferences,
  ...tocCrossReferences,
];
