import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  agentConnections as initialAgentConnections,
  agentWritebacks as initialAgentWritebacks,
  initialActivities,
  initialAgents,
  initialDocuments,
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
} from './mindxDemo';

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
  setMemoryDataSources: React.Dispatch<React.SetStateAction<MemoryDataSource[]>>;
  memoryTimeline: MemoryEvent[];
  setMemoryTimeline: React.Dispatch<React.SetStateAction<MemoryEvent[]>>;
  memoryInsights: MemoryInsight[];
  setMemoryInsights: React.Dispatch<React.SetStateAction<MemoryInsight[]>>;
  memorySourceLinks: SourceLink[];
  setMemorySourceLinks: React.Dispatch<React.SetStateAction<SourceLink[]>>;
  agentConnections: AgentConnection[];
  setAgentConnections: React.Dispatch<React.SetStateAction<AgentConnection[]>>;
  mountedMemoryPacks: MountedMemoryPack[];
  setMountedMemoryPacks: React.Dispatch<React.SetStateAction<MountedMemoryPack[]>>;
  agentWritebacks: AgentWriteback[];
  setAgentWritebacks: React.Dispatch<React.SetStateAction<AgentWriteback[]>>;
}

const MindXDemoContext = createContext<MindXDemoContextValue | null>(null);

export function MindXDemoProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(initialWorkspaces[0]?.id ?? 'w1');
  const [agents, setAgents] = useState(initialAgents);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [documents, setDocuments] = useState(initialDocuments);
  const [activities, setActivities] = useState(initialActivities);
  const [memoryAssets, setMemoryAssets] = useState(initialMemoryAssets);
  const [memoryDataSources, setMemoryDataSources] = useState(initialMemoryDataSources);
  const [memoryTimeline, setMemoryTimeline] = useState(initialMemoryTimeline);
  const [memoryInsights, setMemoryInsights] = useState(initialMemoryInsights);
  const [memorySourceLinks, setMemorySourceLinks] = useState(initialMemorySourceLinks);
  const [agentConnections, setAgentConnections] = useState(initialAgentConnections);
  const [mountedMemoryPacks, setMountedMemoryPacks] = useState(initialMountedMemoryPacks);
  const [agentWritebacks, setAgentWritebacks] = useState(initialAgentWritebacks);

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
    }),
    [
      activities,
      activeWorkspaceId,
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
    ]
  );

  return <MindXDemoContext.Provider value={value}>{children}</MindXDemoContext.Provider>;
}

export function useMindXDemo() {
  const context = useContext(MindXDemoContext);
  if (!context) {
    throw new Error('useMindXDemo must be used within MindXDemoProvider');
  }
  return context;
}
