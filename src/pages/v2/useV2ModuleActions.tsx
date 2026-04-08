import {
  FileText,
  MessageSquare,
  RefreshCw,
  Upload,
  Waypoints,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getDocTypeIcon } from "../../components/DocIcons";
import {
  currentUser,
  type AgentConnection,
  type AgentWriteback,
  type MemoryAsset,
  type MemoryDataSource,
  type MemoryEvent,
  type MountedMemoryPack,
  type SourceLink,
  type WorkspaceDoc,
} from "../../data/mindxDemo";
import { useMindXDemo } from "../../data/mindxDemoContext";
import { useLanguage } from "../../i18n/LanguageContext";
import type { V2HeaderActionItem } from "./V2ModuleHeader";

const normalizeDocType = (type: string) =>
  type.toLowerCase().replace(/\s+/g, "");

function buildClockLabel(lang: "zh" | "en") {
  return new Date().toLocaleTimeString(lang === "zh" ? "zh-CN" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function useWorkspaceCreateActions(): V2HeaderActionItem[] {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { activeWorkspaceId, setDocuments } = useMindXDemo();

  const createDoc = (type: "Smart Canvas" | "Smart Sheet" | "Page") => {
    const id = `d${Date.now()}`;
    const now = new Date().toISOString();
    const newDoc: WorkspaceDoc = {
      id,
      workspaceId: activeWorkspaceId,
      name: "Untitled",
      type,
      date: lang === "zh" ? "刚刚" : "Just now",
      lastModified: now,
      lastViewed: now,
      labels: [],
      creatorName: currentUser.name,
      creatorType: "human",
      size: 0,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    navigate(
      `/document?id=${id}&type=${normalizeDocType(type)}&from=v2-workspace`,
    );
  };

  return useMemo(
    () => [
      {
        id: "smart-canvas",
        label: lang === "zh" ? "智能文档" : "Smart Canvas",
        icon: getDocTypeIcon("Smart Canvas", 16),
        onSelect: () => createDoc("Smart Canvas"),
      },
      {
        id: "smart-sheet",
        label: lang === "zh" ? "智能表格" : "Smart Sheet",
        icon: getDocTypeIcon("Smart Sheet", 16),
        onSelect: () => createDoc("Smart Sheet"),
      },
      {
        id: "page",
        label: lang === "zh" ? "页面" : "Page",
        icon: getDocTypeIcon("Page", 16),
        onSelect: () => createDoc("Page"),
      },
    ],
    [lang],
  );
}

export function useMemoryCreateActions(): V2HeaderActionItem[] {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const {
    setMemoryAssets,
    setMemoryDataSources,
    setMemorySourceLinks,
    setMemoryTimeline,
  } = useMindXDemo();

  const createMemoryIntake = (kind: "markdown" | "chat" | "sync") => {
    const stamp = Date.now();
    const dataSourceId = `ds-${stamp}`;
    const sourceId = `src${stamp}`;
    const assetId = `mem${stamp}`;
    const eventId = `evt${stamp}`;
    const nowIso = new Date().toISOString();
    const timeLabel = buildClockLabel(lang);

    const localized = {
      markdown: {
        docName:
          lang === "zh" ? "新接入的 Markdown 资料" : "Imported markdown note",
        docType: "Smart Canvas",
        category: "manual-upload" as const,
        sourceKind: "document" as const,
        title:
          lang === "zh"
            ? "从 Markdown 中捕获到新的记忆线索"
            : "Captured a new memory cue from markdown",
        summary:
          lang === "zh"
            ? "刚导入了一份 Markdown 资料，系统已经从中提取出值得继续沉淀的线索。"
            : "A markdown note was imported and the system pulled out a memory cue worth refining.",
        assetTitle:
          lang === "zh"
            ? "从导入文档里提取出的新判断"
            : "New judgment extracted from the imported markdown",
        assetSummary:
          lang === "zh"
            ? "这条线索还在形成中，但已经足够进入 Memory 继续整理。"
            : "This cue is still forming, but it is already strong enough to enter Memory.",
        evidence:
          lang === "zh"
            ? ["Markdown 文档已接入。", "系统已完成第一轮提取。"]
            : [
                "Markdown document imported.",
                "The first extraction pass has completed.",
              ],
        nextStep:
          lang === "zh"
            ? "继续补充上下文，并判断它是否应该升格为稳定资产。"
            : "Add context and decide whether this should graduate into a durable asset.",
        tags: ["markdown", "memory"],
        entities:
          lang === "zh"
            ? ["Markdown 资料", "记忆接入"]
            : ["Markdown note", "memory intake"],
        participants: [currentUser.name],
      },
      chat: {
        docName:
          lang === "zh" ? "新接入的聊天记录" : "Imported chat transcript",
        docType: "Chat Log",
        category: "third-party-sync" as const,
        sourceKind: "chat" as const,
        title:
          lang === "zh"
            ? "从聊天记录中抽出新的记忆候选"
            : "Pulled a new memory candidate out of chat history",
        summary:
          lang === "zh"
            ? "聊天记录已经导入，memo agent 正在从里面抽取偏好、判断和后续动作。"
            : "A chat transcript was imported and memo agent is extracting preferences, judgments, and follow-ups.",
        assetTitle:
          lang === "zh"
            ? "聊天记录里的用户偏好候选"
            : "Preference candidate distilled from chat history",
        assetSummary:
          lang === "zh"
            ? "这条记忆更像偏好线索，适合继续确认并挂到相关 agent 上。"
            : "This memory looks like a preference cue and is a good candidate for mounting into related agents.",
        evidence:
          lang === "zh"
            ? ["聊天记录已接入。", "偏好线索已被标记出来。"]
            : [
                "Chat transcript imported.",
                "A preference signal has been marked.",
              ],
        nextStep:
          lang === "zh"
            ? "检查是否需要补证据，并决定是否挂载给写作类 agent。"
            : "Check whether more evidence is needed and decide whether to mount it into writing agents.",
        tags: ["chat", "preference"],
        entities:
          lang === "zh"
            ? ["聊天记录", "偏好"]
            : ["chat transcript", "preference"],
        participants: [currentUser.name, "Claude Assistant"],
      },
      sync: {
        docName:
          lang === "zh" ? "新建的外部同步源" : "New External Sync Source",
        docType: "Smart Canvas",
        category: "cloud-collaboration" as const,
        sourceKind: "report" as const,
        title:
          lang === "zh"
            ? "从外部同步源接入了新的记忆流"
            : "A new memory stream arrived from an external sync source",
        summary:
          lang === "zh"
            ? "同步源已经建立，后续的事件和结构化记忆会沿着这条链路持续写入。"
            : "A sync source has been established, and future events and structured memory will keep flowing through it.",
        assetTitle:
          lang === "zh"
            ? "外部同步带来的新记忆入口"
            : "A new memory entry point created by external sync",
        assetSummary:
          lang === "zh"
            ? "它还在候选状态，但已经成为 Memory 新的接入入口。"
            : "It is still a candidate, but it has already become a new intake path for Memory.",
        evidence:
          lang === "zh"
            ? ["同步桥接已创建。", "写入链路已连通。"]
            : ["Sync bridge created.", "Writeback path connected."],
        nextStep:
          lang === "zh"
            ? "继续观察同步质量，并确认这条外部链路是否足够稳定。"
            : "Monitor sync quality and confirm whether this external path is stable enough.",
        tags: ["sync", "integration"],
        entities:
          lang === "zh"
            ? ["外部同步", "记忆写入"]
            : ["external sync", "memory writeback"],
        participants: ["Research Bot"],
      },
    }[kind];

    const newDataSource: MemoryDataSource = {
      id: dataSourceId,
      name: localized.docName,
      category: localized.category,
      typeLabel: localized.docType,
      status:
        kind === "sync" ? "syncing" : kind === "chat" ? "reviewing" : "ready",
      summary: localized.summary,
      freshness: lang === "zh" ? "刚刚接入" : "Just imported",
      tags: localized.tags,
      contentPreview: localized.evidence,
    };

    const newSource: SourceLink = {
      id: sourceId,
      docId: dataSourceId,
      docName: localized.docName,
      kind: localized.sourceKind,
      storage: "memory",
      dataSourceId,
      summary: localized.summary,
      quote: localized.evidence[0],
      timestamp: nowIso,
      participants: localized.participants,
    };

    const newAsset: MemoryAsset = {
      id: assetId,
      type:
        kind === "chat"
          ? "preference"
          : kind === "sync"
            ? "constraint"
            : "insight",
      libraryCategory: "pending",
      layer: "L2",
      status: "candidate",
      title: localized.assetTitle,
      summary: localized.assetSummary,
      confidence: "Medium",
      freshness: lang === "zh" ? "刚刚接入" : "Just imported",
      sourceIds: [sourceId],
      relatedAssetIds: [],
      relatedEntities: localized.entities,
      tags: localized.tags,
      docIds: [],
      evidence: localized.evidence,
      nextStep: localized.nextStep,
    };

    const newEvent: MemoryEvent = {
      id: eventId,
      dayLabel: lang === "zh" ? "今天" : "Today",
      timeLabel,
      occurredAt: nowIso,
      stage: "captured",
      lane: "extract",
      title: localized.title,
      summary: localized.summary,
      docId: dataSourceId,
      docName: localized.docName,
      actorName: currentUser.name,
      actorType: "human",
      sourceIds: [sourceId],
      assetIds: [assetId],
      tags: localized.tags,
    };

    setMemoryDataSources((prev) => [newDataSource, ...prev]);
    setMemorySourceLinks((prev) => [newSource, ...prev]);
    setMemoryAssets((prev) => [newAsset, ...prev]);
    setMemoryTimeline((prev) => [newEvent, ...prev]);
    navigate(`/v2/memory/sources?source=${dataSourceId}&from=intake`);
  };

  return useMemo(
    () => [
      {
        id: "import-markdown",
        label: lang === "zh" ? "上传 Markdown" : "Import markdown",
        icon: <Upload className="h-4 w-4" />,
        onSelect: () => createMemoryIntake("markdown"),
      },
      {
        id: "import-chat",
        label: lang === "zh" ? "上传聊天记录" : "Import chat transcript",
        icon: <MessageSquare className="h-4 w-4" />,
        onSelect: () => createMemoryIntake("chat"),
      },
      {
        id: "create-sync",
        label: lang === "zh" ? "创建同步源" : "Create sync source",
        icon: <RefreshCw className="h-4 w-4" />,
        onSelect: () => createMemoryIntake("sync"),
      },
    ],
    [lang],
  );
}

export function useIntegrationCreateActions(): V2HeaderActionItem[] {
  const { lang } = useLanguage();
  const {
    agentConnections,
    memoryAssets,
    setAgentConnections,
    setMountedMemoryPacks,
    setAgentWritebacks,
  } = useMindXDemo();

  const createConnection = () => {
    const stamp = Date.now();
    const nextConnection: AgentConnection = {
      id: `conn-${stamp}`,
      name: lang === "zh" ? "Notion Sync Agent" : "Notion Sync Agent",
      provider: "Notion",
      status: "Connected",
      workspaceRole: "Observer",
      description:
        lang === "zh"
          ? "用于把外部资料同步到 Workspace 和 Memory 的新接入。"
          : "A new integration used to sync external material into Workspace and Memory.",
      mountedAssetCount: 0,
      readScopes: ["Workspace", "Memory"],
      writeScopes: ["Timeline"],
      latestAction: lang === "zh" ? "刚完成接入" : "Just connected",
      latestWorkspaceDocId: "d1",
      latestWorkspaceDocName: "mindX 2.0 Memory 信息架构 PRD",
    };
    setAgentConnections((prev) => [nextConnection, ...prev]);
  };

  const createMountPack = () => {
    const stamp = Date.now();
    const assetIds = memoryAssets.slice(0, 3).map((asset) => asset.id);
    const nextPack: MountedMemoryPack = {
      id: `pack-${stamp}`,
      name: lang === "zh" ? "新建接入包" : "New Mounted Pack",
      description:
        lang === "zh"
          ? "把近期稳定下来的偏好和判断打包，供外部 agent 直接挂载。"
          : "A mounted pack bundling recent stable preferences and judgments for external agents.",
      assetIds,
      mountedByConnectionIds: agentConnections
        .slice(0, 2)
        .map((connection) => connection.id),
    };
    setMountedMemoryPacks((prev) => [nextPack, ...prev]);
  };

  const createWriteback = () => {
    if (memoryAssets.length === 0) return;
    const stamp = Date.now();
    const relatedAsset = memoryAssets[0];
    const nextWriteback: AgentWriteback = {
      id: `writeback-${stamp}`,
      title: lang === "zh" ? "新建回写规则" : "New writeback rule",
      detail:
        lang === "zh"
          ? `当外部 agent 发现和“${relatedAsset.title}”相关的新线索时，自动写回 Timeline。`
          : `When an external agent finds new signals related to "${relatedAsset.title}", write them back into the timeline.`,
      assetId: relatedAsset.id,
      docId: relatedAsset.docIds[0] ?? "d1",
      docName: "mindX 2.0 Memory 信息架构 PRD",
    };
    setAgentWritebacks((prev) => [nextWriteback, ...prev]);
  };

  return useMemo(
    () => [
      {
        id: "connect-agent",
        label: lang === "zh" ? "接入外部 Agent" : "Connect external agent",
        icon: <Waypoints className="h-4 w-4" />,
        onSelect: createConnection,
      },
      {
        id: "mount-pack",
        label: lang === "zh" ? "新建挂载包" : "Create mounted pack",
        icon: <FileText className="h-4 w-4" />,
        onSelect: createMountPack,
      },
      {
        id: "writeback-rule",
        label: lang === "zh" ? "配置回写规则" : "Configure writeback rule",
        icon: <RefreshCw className="h-4 w-4" />,
        onSelect: createWriteback,
      },
    ],
    [agentConnections, lang, memoryAssets],
  );
}
