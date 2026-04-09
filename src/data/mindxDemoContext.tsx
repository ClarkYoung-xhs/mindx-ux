import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  agentConnections as initialAgentConnections,
  agentWritebacks as initialAgentWritebacks,
  initialAgents,
  initialPermissions,
  initialWorkspaces,
  memoryDataSources as initialMemoryDataSources,
  memoryAssets as initialMemoryAssets,
  memoryInsights as initialMemoryInsights,
  memorySourceLinks as initialMemorySourceLinks,
  memoryTimeline as initialMemoryTimeline,
  mountedMemoryPacks as initialMountedMemoryPacks,
  type Activity,
  type AgentConnection,
  type AgentWriteback,
  type DemoAgent,
  type DemoPermission,
  type DemoWorkspace,
  type MemoryAsset,
  type MemoryDataSource,
  type MemoryEvent,
  type MemoryInsight,
  type MountedMemoryPack,
  type SourceLink,
  type WorkspaceDoc,
} from "./mindxDemo";
import {
  unifiedDocuments,
  unifiedActivities,
  unifiedCrossReferences,
} from "./unifiedDocTree";
import type { CrossReference } from "../types/crossRef";
import type { SheetRow } from "../types/sheet";

/** @deprecated Workspace concept removed — kept for backward compatibility */
export type WorkspaceType = "toB" | "toC";

interface MindXDemoContextValue {
  workspaces: DemoWorkspace[];
  setWorkspaces: React.Dispatch<React.SetStateAction<DemoWorkspace[]>>;
  activeWorkspaceId: string;
  setActiveWorkspaceId: React.Dispatch<React.SetStateAction<string>>;
  agents: DemoAgent[];
  setAgents: React.Dispatch<React.SetStateAction<DemoAgent[]>>;
  permissions: DemoPermission[];
  setPermissions: React.Dispatch<React.SetStateAction<DemoPermission[]>>;
  documents: WorkspaceDoc[];
  setDocuments: React.Dispatch<React.SetStateAction<WorkspaceDoc[]>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  memoryAssets: MemoryAsset[];
  setMemoryAssets: React.Dispatch<React.SetStateAction<MemoryAsset[]>>;
  memoryDataSources: MemoryDataSource[];
  setMemoryDataSources: React.Dispatch<
    React.SetStateAction<MemoryDataSource[]>
  >;
  memoryTimeline: MemoryEvent[];
  setMemoryTimeline: React.Dispatch<React.SetStateAction<MemoryEvent[]>>;
  memoryInsights: MemoryInsight[];
  setMemoryInsights: React.Dispatch<React.SetStateAction<MemoryInsight[]>>;
  memorySourceLinks: SourceLink[];
  setMemorySourceLinks: React.Dispatch<React.SetStateAction<SourceLink[]>>;
  agentConnections: AgentConnection[];
  setAgentConnections: React.Dispatch<React.SetStateAction<AgentConnection[]>>;
  mountedMemoryPacks: MountedMemoryPack[];
  setMountedMemoryPacks: React.Dispatch<
    React.SetStateAction<MountedMemoryPack[]>
  >;
  agentWritebacks: AgentWriteback[];
  setAgentWritebacks: React.Dispatch<React.SetStateAction<AgentWriteback[]>>;
  addDocument: (doc: WorkspaceDoc) => void;
  addSheetRow: (sheetId: string, row: SheetRow) => void;
  /** @deprecated No-op — workspace concept removed */
  currentWorkspaceType: WorkspaceType;
  /** @deprecated No-op — workspace concept removed */
  switchWorkspace: (type: WorkspaceType) => void;
  currentCrossReferences: CrossReference[];
}

const MindXDemoContext = createContext<MindXDemoContextValue | null>(null);

export function MindXDemoProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(
    initialWorkspaces[0]?.id ?? "w1",
  );
  const [agents, setAgents] = useState(initialAgents);
  const [permissions, setPermissions] = useState(initialPermissions);
  // Unified document tree (merged toB + toC under two root nodes)
  const [documents, setDocuments] = useState<WorkspaceDoc[]>(unifiedDocuments);
  // Unified activities (merged toB + toC, sorted by timestamp)
  const [activities, setActivities] = useState(unifiedActivities);
  // Unified cross-references (merged toB + toC)
  const [currentCrossReferences] = useState<CrossReference[]>(
    unifiedCrossReferences,
  );
  const [memoryAssets, setMemoryAssets] = useState(initialMemoryAssets);
  const [memoryDataSources, setMemoryDataSources] = useState(
    initialMemoryDataSources,
  );
  const [memoryTimeline, setMemoryTimeline] = useState(initialMemoryTimeline);
  const [memoryInsights, setMemoryInsights] = useState(initialMemoryInsights);
  const [memorySourceLinks, setMemorySourceLinks] = useState(
    initialMemorySourceLinks,
  );
  const [agentConnections, setAgentConnections] = useState(
    initialAgentConnections,
  );
  const [mountedMemoryPacks, setMountedMemoryPacks] = useState(
    initialMountedMemoryPacks,
  );
  const [agentWritebacks, setAgentWritebacks] = useState(
    initialAgentWritebacks,
  );

  const addDocument = useCallback((doc: WorkspaceDoc) => {
    setDocuments((prev) => {
      // Helper: recursively try to add doc under its parent
      const addUnderParent = (nodes: WorkspaceDoc[]): WorkspaceDoc[] =>
        nodes.map((node) => {
          if (node.id === doc.parentId) {
            const existing = node.children ?? [];
            if (existing.some((d) => d.id === doc.id)) return node;
            return { ...node, children: [doc, ...existing] };
          }
          if (node.children) {
            return { ...node, children: addUnderParent(node.children) };
          }
          return node;
        });

      if (doc.parentId) {
        return addUnderParent(prev);
      }
      // Top-level add
      if (prev.some((d) => d.id === doc.id)) return prev;
      return [doc, ...prev];
    });
  }, []);

  const addSheetRow = useCallback((sheetId: string, row: SheetRow) => {
    setDocuments((prev) => {
      const updateRow = (nodes: WorkspaceDoc[]): WorkspaceDoc[] =>
        nodes.map((doc) => {
          if (doc.id === sheetId && doc.sheetData) {
            if (doc.sheetData.rows.some((r) => r.id === row.id)) return doc;
            return {
              ...doc,
              sheetData: {
                ...doc.sheetData,
                rows: [...doc.sheetData.rows, row],
              },
            };
          }
          if (doc.children) {
            return { ...doc, children: updateRow(doc.children) };
          }
          return doc;
        });
      return updateRow(prev);
    });
  }, []);

  /** @deprecated No-op — workspace concept removed */
  const switchWorkspace = useCallback((_type: WorkspaceType) => {
    // No-op: workspace switching is deprecated
  }, []);

  const value = useMemo<MindXDemoContextValue>(
    () => ({
      workspaces,
      setWorkspaces,
      activeWorkspaceId,
      setActiveWorkspaceId,
      agents,
      setAgents,
      permissions,
      setPermissions,
      documents,
      setDocuments,
      activities,
      setActivities,
      memoryAssets,
      setMemoryAssets,
      memoryDataSources,
      setMemoryDataSources,
      memoryTimeline,
      setMemoryTimeline,
      memoryInsights,
      setMemoryInsights,
      memorySourceLinks,
      setMemorySourceLinks,
      agentConnections,
      setAgentConnections,
      mountedMemoryPacks,
      setMountedMemoryPacks,
      agentWritebacks,
      setAgentWritebacks,
      addDocument,
      addSheetRow,
      currentWorkspaceType: "toB" as WorkspaceType,
      switchWorkspace,
      currentCrossReferences,
    }),
    [
      activities,
      activeWorkspaceId,
      addDocument,
      addSheetRow,
      switchWorkspace,
      currentCrossReferences,
      agentConnections,
      agentWritebacks,
      agents,
      documents,
      memoryAssets,
      memoryDataSources,
      memoryInsights,
      memorySourceLinks,
      memoryTimeline,
      mountedMemoryPacks,
      permissions,
      workspaces,
    ],
  );

  return (
    <MindXDemoContext.Provider value={value}>
      {children}
    </MindXDemoContext.Provider>
  );
}

export function useMindXDemo() {
  const context = useContext(MindXDemoContext);
  if (!context) {
    throw new Error("useMindXDemo must be used within MindXDemoProvider");
  }
  return context;
}
