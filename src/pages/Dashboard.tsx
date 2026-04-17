import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OnboardingWizard from "../components/OnboardingWizard";
import { getDocTypeIcon } from "../components/DocIcons";
import { useLanguage, LanguageSwitcher } from "../i18n/LanguageContext";
import { useDocuments } from "../hooks/useDocuments";
import { useActivities } from "../hooks/useActivities";
import { useProfile } from "../hooks/useProfile";
import {
  Copy,
  Check,
  FileText,
  Settings,
  LogOut,
  Plus,
  Search,
  MoreVertical,
  Sparkles,
  ChevronDown,
  Bot,
  Target,
  Users,
  User,
  ArrowLeft,
  MessageCircle,
  Clock,
  Activity as ActivityIcon,
  X,
  Download,
  Trash2,
  Shield,
  ExternalLink,
  Brain,
  Database,
  MessageSquareText,
} from "lucide-react";
import WorkspaceSwitcher from "../components/WorkspaceSwitcher";
import { useMindXDemo } from "../data/mindxDemoContext";
import WorkspaceTreeV1 from "../components/WorkspaceTreeV1";
import PricingModal from "./dashboard/PricingModal";
import NavItem from "./dashboard/NavItem";
import DocumentsTab from "./dashboard/DocumentsTab";
import ActivityTab from "./dashboard/ActivityTab";
import SettingsTab from "./dashboard/SettingsTab";
import SkillsTab from "./dashboard/SkillsTab";
import MemoryTab from "./dashboard/MemoryTab";
import MemoAgentTab from "./dashboard/MemoAgentTab";
import {
  tocInitialDocuments,
  tocInitialActivities,
} from "../data/tocMindxDemo";
import type {
  WorkspaceDoc,
  AgentPermission,
  AbsenceChange,
  AbsenceSummaryData,
  Activity,
  DemoMode,
} from "./dashboard/types";
import {
  initialWorkspaces,
  initialAgents,
  normalizeDocType,
  currentUser,
  activeWorkspaceIdGlobal,
  isProfilePlaceholder,
  initialPermissions,
  initialDocuments,
  initialActivities,
  absenceLastVisitTime,
  agentColorMap,
  absenceSummaryData,
  DEMO_MODE_KEY,
  getDemoMode,
} from "./dashboard/constants";

// All constants, mock data, and utility functions imported from ./dashboard/constants

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentWorkspaceType } = useMindXDemo();
  const [demoMode, setDemoModeState] = useState<DemoMode>(getDemoMode);

  const setDemoMode = (mode: DemoMode) => {
    localStorage.setItem(DEMO_MODE_KEY, mode);
    if (mode === "new") {
      // Activate new-user flags so the onboarding / guide logic works
      localStorage.setItem("mindx_is_new_user", "true");
      localStorage.removeItem("mindx_absence_dismissed");
      localStorage.removeItem("mindx_guide_dismissed");
    } else {
      // Clear new-user flags for existing-user mode
      localStorage.removeItem("mindx_is_new_user");
      localStorage.setItem("mindx_absence_dismissed", "false");
      localStorage.removeItem("mindx_guide_dismissed");
    }
    setDemoModeState(mode);
    // Reload to reinitialize all states with correct data
    window.location.href = "/dashboard?tab=settings";
  };

  const isNewUser = demoMode === "new";
  const initLang = localStorage.getItem("mindx_lang") || "en";
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(
    initialWorkspaces[0]?.id ?? "w1",
  );
  const [agents, setAgents] = useState(() => {
    try {
      const saved = localStorage.getItem("mindx_agents");
      if (saved) return JSON.parse(saved);
    } catch {}
    return isNewUser ? [] : initialAgents;
  });
  useEffect(() => {
    localStorage.setItem("mindx_agents", JSON.stringify(agents));
  }, [agents]);
  const [permissions, setPermissions] = useState(() => {
    if (isNewUser) {
      return [
        {
          id: "p1",
          workspaceId: "w1",
          memberId: currentUser.id,
          memberType: "Human" as const,
          role: "Owner",
        },
      ];
    }
    return initialPermissions;
  });
  // Supabase-backed documents & activities (fallback to mock data when not configured)
  const fallbackDocs = isNewUser
    ? [
        {
          id: "welcome",
          workspaceId: "w1",
          name: initLang === "zh" ? "欢迎使用 MindX" : "Welcome to MindX",
          type: "Smart Canvas",
          date: initLang === "zh" ? "刚刚" : "Just now",
          lastModified: new Date().toISOString(),
          lastViewed: new Date().toISOString(),
          labels: ["Getting Started"],
          creatorName: "Agent",
          creatorType: "agent" as const,
          size: 8192,
          isNew: true,
          isRead: false,
          source: "normal" as const,
        },
      ]
    : initialDocuments;
  const {
    documents,
    setDocuments,
    loading: docsLoading,
    createDoc,
    updateDoc,
    deleteDoc,
  } = useDocuments(activeWorkspaceIdGlobal, fallbackDocs);
  const {
    activities,
    setActivities,
    loading: activitiesLoading,
    createActivity,
  } = useActivities(
    activeWorkspaceIdGlobal,
    isNewUser ? [] : initialActivities,
  );

  // Sync local documents, activities & activeWorkspaceId when workspace type switches
  useEffect(() => {
    console.log(
      "[Dashboard] workspace switch effect fired:",
      currentWorkspaceType,
    );
    if (currentWorkspaceType === "toC") {
      console.log(
        "[Dashboard] setting toC data, docs:",
        tocInitialDocuments.length,
        "activities:",
        tocInitialActivities.length,
      );
      setDocuments(tocInitialDocuments as any);
      setActivities(tocInitialActivities as any);
      setActiveWorkspaceId("w-toc");
      setWorkspaces([{ id: "w-toc", name: "Personal Asset Office" }]);
    } else {
      setDocuments(fallbackDocs);
      setActivities(isNewUser ? [] : initialActivities);
      setActiveWorkspaceId(initialWorkspaces[0]?.id ?? "w1");
      setWorkspaces(initialWorkspaces);
    }
    // Reset absence summary card visibility on workspace switch
    setAbsenceSummaryDismissed(false);
    localStorage.setItem("mindx_absence_dismissed", "false");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspaceType]);

  const [activeTab, setActiveTabState] = useState<
    | "documents"
    | "activity"
    | "agents"
    | "members"
    | "settings"
    | "labels"
    | "skills"
    | "profile"
    | "rawdata"
    | "memoagent"
  >(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (
      tab &&
      [
        "documents",
        "activity",
        "agents",
        "members",
        "settings",
        "labels",
        "skills",
        "profile",
        "rawdata",
        "memoagent",
      ].includes(tab)
    ) {
      return tab as
        | "documents"
        | "activity"
        | "agents"
        | "members"
        | "settings"
        | "labels"
        | "skills"
        | "profile"
        | "rawdata"
        | "memoagent";
    }
    if (tab === "memory") return "profile";
    return "documents";
  });
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [isNewDocMenuOpen, setIsNewDocMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [docSortBy, setDocSortBy] = useState<"lastModified" | "lastViewed">(
    "lastModified",
  );
  const [docFilterType, setDocFilterType] = useState<string>("all");
  const [docFilterOwner, setDocFilterOwner] = useState<string>("all");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [, setIsIntegrationMenuOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [agentListMenuOpen, setAgentListMenuOpen] = useState<string | null>(
    null,
  );
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [profileEditKey, setProfileEditKey] = useState<
    "whoami" | "goal" | null
  >(null);
  const [profileEditDraft, setProfileEditDraft] = useState("");
  const [nodeEditId, setNodeEditId] = useState<string | null>(null);
  const [nodeEditTitle, setNodeEditTitle] = useState("");
  const [nodeEditDraft, setNodeEditDraft] = useState("");
  const [showExtractionFilePicker, setShowExtractionFilePicker] =
    useState(false);
  const [selectedExtractionFileIds, setSelectedExtractionFileIds] = useState<
    Set<string>
  >(new Set());
  const [selectedExtractionSkill, setSelectedExtractionSkill] = useState<string>("profile");
  const [docSceneFilter, setDocSceneFilter] = useState<
    "all" | "today" | "unread" | "scheduled" | "webclip" | "memory"
  >("all");
  const [absenceSummaryDismissed, setAbsenceSummaryDismissed] = useState(
    () => localStorage.getItem("mindx_absence_dismissed") === "true",
  );

  // Dynamically compute absence summary from current activities (workspace-aware)
  const dynamicAbsenceSummaryData = React.useMemo<AbsenceSummaryData>(() => {
    return {
      lastVisitTime: absenceLastVisitTime,
      changes: activities
        .filter(
          (a: any) =>
            a.userType === "agent" &&
            new Date(a.timestamp) > new Date(absenceLastVisitTime),
        )
        .sort(
          (a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .map((a: any) => {
          let action: "created" | "modified" | "commented" = "modified";
          if (a.action === "created") action = "created";
          else if (a.action === "commented on") action = "commented";
          else action = "modified";
          return {
            id: a.docId || a.id,
            action,
            docTitle: a.targetName,
            docType: a.targetType,
            agentName: a.userName,
            agentColor: agentColorMap[a.userName] || "#94A3B8",
            changeDescription: a.detailsZh || a.details,
            timestamp: a.timestamp,
          };
        }),
    };
  }, [activities]);

  const [guideDismissed, setGuideDismissedState] = useState(
    () => localStorage.getItem("mindx_guide_dismissed") === "true",
  );
  const setGuideDismissed = (v: boolean) => {
    setGuideDismissedState(v);
    if (v) localStorage.setItem("mindx_guide_dismissed", "true");
  };
  const [activityFilterOwner, setActivityFilterOwner] = useState<string>("all");

  // Extraction Agent states
  const [isModelConfigOpen, setIsModelConfigOpen] = useState(false);
  const [extractionModel, setExtractionModel] = useState(
    () => localStorage.getItem("mindx_extraction_model") || "gpt-5.4",
  );
  const [extractionApiKey, setExtractionApiKey] = useState(
    () => localStorage.getItem("mindx_extraction_apikey") || "",
  );
  const [extractionBaseUrl, setExtractionBaseUrl] = useState(
    () =>
      localStorage.getItem("mindx_extraction_baseurl") ||
      "https://right.codes/codex",
  );
  const [extractionRunning, setExtractionRunning] = useState(false);
  const [extractionLogs, setExtractionLogs] = useState<
    {
      id: string;
      text: string;
      time: string;
      status: "done" | "running" | "pending";
    }[]
  >([]);

  // Extracted key points (output of extraction agent)
  const [extractedKeyPoints, setExtractedKeyPoints] = useState<
    {
      id: string;
      title: string;
      type: string;
      text: string;
      source: string;
      createdAt: string;
    }[]
  >(() => {
    try {
      const saved = localStorage.getItem("mindx_extracted_keypoints");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(
      "mindx_extracted_keypoints",
      JSON.stringify(extractedKeyPoints),
    );
  }, [extractedKeyPoints]);

  // Fetch key points from DB on mount; migrate localStorage → DB if DB is empty
  useEffect(() => {
    fetch(`/api/keypoints?workspace_id=${activeWorkspaceIdGlobal}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows: any[]) => {
        if (rows.length > 0) {
          setExtractedKeyPoints(
            rows.map((r) => ({
              id: r.id,
              title: r.title,
              type: r.type,
              text: r.text,
              source: r.source,
              createdAt: r.created_at,
            })),
          );
        } else {
          // DB empty — migrate localStorage keypoints to DB
          try {
            const saved = localStorage.getItem("mindx_extracted_keypoints");
            const localKPs = saved ? JSON.parse(saved) : [];
            for (const kp of localKPs) {
              fetch("/api/keypoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  workspace_id: activeWorkspaceIdGlobal,
                  id: kp.id,
                  title: kp.title,
                  type: kp.type,
                  text: kp.text,
                  source: kp.source,
                }),
              }).catch(() => {});
            }
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const handleStartExtraction = async () => {
    if (!extractionApiKey.trim()) {
      setIsModelConfigOpen(true);
      return;
    }
    const itemsToExtract = rawDataItems.filter((i) =>
      selectedExtractionFileIds.has(i.id),
    );
    if (itemsToExtract.length === 0) return;
    setShowExtractionFilePicker(false);
    setExtractionRunning(true);

    const newLog = {
      id: `log-${Date.now()}`,
      text:
        lang === "zh"
          ? `正在使用 ${extractionModel} 提炼 ${itemsToExtract.length} 个文件...`
          : `Extracting ${itemsToExtract.length} documents with ${extractionModel}...`,
      time: "now",
      status: "running" as const,
    };
    setExtractionLogs((prev) => [newLog, ...prev]);

    try {
      const allKPs: any[] = [];

      for (const item of itemsToExtract) {
        // Find content either from item properties, or read from localStorage if it's been edited
        const whoAmI = localStorage.getItem("mindx_raw_whoami_doc") || "";
        const goal = localStorage.getItem("mindx_raw_goal_doc") || "";

        const prompt =
          extractionSkillPrompt
            .replace("{{LOCALE}}", lang === "zh" ? "Chinese" : "English")
            .replace("{{WHO_AM_I}}", whoAmI)
            .replace("{{MY_GOALS}}", goal) + `\n\nText:\n${item.content}`;
        let baseUrl = extractionBaseUrl.endsWith("/")
          ? extractionBaseUrl.slice(0, -1)
          : extractionBaseUrl;
        const apiUrl =
          baseUrl.includes("/v1") || baseUrl.includes("/chat")
            ? baseUrl
            : `${baseUrl}/v1/chat/completions`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${extractionApiKey}`,
          },
          body: JSON.stringify({
            model: extractionModel,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            response_format: { type: "json_object" },
          }),
        });

        if (!response.ok)
          throw new Error(`API returned status: ${response.status}`);
        const data = await response.json();
        let answer = data.choices[0]?.message?.content || '{"insights":[]}';

        try {
          if (answer.includes("```json")) {
            answer = answer.split("```json")[1].split("```")[0].trim();
          }
          const parsed = JSON.parse(answer);
          const insightsArray =
            parsed.insights || (Array.isArray(parsed) ? parsed : []);

          if (Array.isArray(insightsArray)) {
            insightsArray.forEach((insight: any, index: number) => {
              allKPs.push({
                id: `kp-${Date.now()}-${item.id}-${index}`,
                title: item.name,
                type: insight.type || (lang === "zh" ? "洞察" : "Insight"),
                text: insight.text || "Unknown insight",
                source: item.name,
                createdAt: new Date().toISOString(),
              });
            });
          }
        } catch (e) {
          console.error("Failed to parse model output for", item.id, e, answer);
        }
      }

      setExtractionRunning(false);
      setExtractionLogs((prev) =>
        prev.map((l) =>
          l.id === newLog.id
            ? {
                ...l,
                text:
                  lang === "zh"
                    ? `已完成 ${itemsToExtract.length} 个文档的提炼，共发现 ${allKPs.length} 条有效洞察并入库`
                    : `Completed extraction of ${itemsToExtract.length} docs, found ${allKPs.length} insights`,
                status: "done" as const,
                time: "just now",
              }
            : l,
        ),
      );

      if (allKPs.length > 0) {
        setExtractedKeyPoints((prev) => [...allKPs, ...prev]);
        // Persist each KP to DB
        for (const kp of allKPs) {
          fetch("/api/keypoints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              workspace_id: activeWorkspaceIdGlobal,
              id: kp.id,
              title: kp.title,
              type: kp.type,
              text: kp.text,
              source: kp.source,
            }),
          }).catch(() => {});
        }
      }
    } catch (err: any) {
      setExtractionRunning(false);
      setExtractionLogs((prev) =>
        prev.map((l) =>
          l.id === newLog.id
            ? {
                ...l,
                text:
                  lang === "zh"
                    ? `资料引擎提炼中断抛错: ${err.message}`
                    : `Extraction failed: ${err.message}`,
                status: "done" as const,
                time: "just now",
              }
            : l,
        ),
      );
    }
  };

  // Memory upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawDataItems, setRawDataItems] = useState<
    {
      id: string;
      name: string;
      type: string;
      size: number;
      uploadedAt: string;
      source: "file" | "paste";
      content?: string;
    }[]
  >([]);
  const [rawDataLoading, setRawDataLoading] = useState(true);

  // Fetch raw data from DB on mount; migrate localStorage → DB if DB is empty
  useEffect(() => {
    const fetchRawData = () => {
      setRawDataLoading(true);
      fetch(`/api/rawdata?workspace_id=${activeWorkspaceIdGlobal}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((rows: any[]) => {
          if (rows.length > 0) {
            setRawDataItems(
              rows.map((r) => ({
                id: r.id,
                name: r.name,
                type: r.type,
                size: r.size,
                uploadedAt: r.created_at,
                source: r.source as "file" | "paste",
                content: r.content,
              })),
            );
          } else {
            // DB empty — migrate localStorage items to DB
            try {
              const saved = localStorage.getItem("mindx_raw_data_items");
              const localItems = saved ? JSON.parse(saved) : [];
              if (localItems.length > 0) {
                setRawDataItems(localItems);
                for (const item of localItems) {
                  const content =
                    localStorage.getItem(`mindx_raw_${item.id}`) ||
                    item.content ||
                    "";
                  fetch("/api/rawdata", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      workspace_id: activeWorkspaceIdGlobal,
                      id: item.id,
                      name: item.name,
                      type: item.type,
                      size: item.size,
                      source: item.source,
                      content,
                    }),
                  }).catch(() => {});
                }
              }
            } catch {}
          }
        })
        .catch(() => {})
        .finally(() => setRawDataLoading(false));
    };
    fetchRawData();
    // Poll every 30s + visibility change for external updates
    const interval = setInterval(fetchRawData, 30_000);
    const onVis = () => {
      if (document.visibilityState === "visible") fetchRawData();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Persist rawDataItems to localStorage as cache
  useEffect(() => {
    localStorage.setItem(
      "mindx_raw_data_items",
      JSON.stringify(rawDataItems.map(({ content, ...rest }) => rest)),
    );
  }, [rawDataItems]);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isRawDataModalOpen, setIsRawDataModalOpen] = useState(false);

  // Custom memory nodes
  const [isMemoryNodesExpanded, setIsMemoryNodesExpanded] = useState(false);
  const [memoryNodeInput, setMemoryNodeInput] = useState("");
  const [memoryNodes, setMemoryNodes] = useState<
    {
      id: string;
      title: string;
      content: string;
      createdAt: string;
      updatedAt: string;
    }[]
  >(() => {
    try {
      const saved = localStorage.getItem("mindx_memory_nodes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Database-backed profile (Who am I + Goal)
  const { profile, updateProfile } = useProfile(activeWorkspaceIdGlobal);
  const whoAmIRaw =
    profile.whoami || localStorage.getItem("mindx_raw_whoami_doc") || "";
  const goalRaw =
    profile.goal || localStorage.getItem("mindx_raw_goal_doc") || "";
  const whoAmIDocContent = isProfilePlaceholder(whoAmIRaw) ? "" : whoAmIRaw;
  const goalDocContent = isProfilePlaceholder(goalRaw) ? "" : goalRaw;

  // Extraction Prompt
  const [extractionSkillPrompt, setExtractionSkillPrompt] = useState(
    () =>
      localStorage.getItem("mindx_extraction_prompt") ||
      `You are an expert analyst. Extract key viewpoints, decision points, directions, or principles from the provided text that align with the user's goals. Return ONLY a valid JSON object with a single property "insights" containing an array of objects, each with "title" and "text" (in {{LOCALE}}).
IMPORTANT CONTEXT:
Who am I:
{{WHO_AM_I}}
My Goals:
{{MY_GOALS}}
Analyze the following text strictly from the perspective of "Who am I" and to serve "My Goals".`,
  );
  useEffect(() => {
    localStorage.setItem("mindx_extraction_prompt", extractionSkillPrompt);
  }, [extractionSkillPrompt]);

  useEffect(() => {
    localStorage.setItem("mindx_memory_nodes", JSON.stringify(memoryNodes));
  }, [memoryNodes]);
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteContent, setPasteContent] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const newItems = fileArray.map((file: File, i: number) => ({
      id: `raw-${Date.now()}-${i}`,
      name: file.name,
      type: file.name.split(".").pop()?.toUpperCase() || "FILE",
      size: file.size,
      uploadedAt: new Date().toISOString(),
      source: "file" as const,
      content: "",
    }));
    // Read each file's text content
    fileArray.forEach((file: File, i: number) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = (ev.target?.result as string) || "";
        localStorage.setItem(`mindx_raw_${newItems[i].id}`, text);
        setRawDataItems((prev) =>
          prev.map((item) =>
            item.id === newItems[i].id ? { ...item, content: text } : item,
          ),
        );
        // Sync to DB
        fetch("/api/rawdata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspace_id: activeWorkspaceIdGlobal,
            id: newItems[i].id,
            name: newItems[i].name,
            type: newItems[i].type,
            size: newItems[i].size,
            source: "file",
            content: text,
          }),
        }).catch(() => {});
      };
      reader.readAsText(file);
    });
    setRawDataItems((prev) => [...newItems, ...prev]);
    setIsIntegrationMenuOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePasteSubmit = () => {
    if (!pasteContent.trim()) return;
    const title =
      pasteTitle.trim() ||
      (lang === "zh" ? "粘贴的文本" : "Pasted Text") +
        ` — ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    const itemId = `raw-${Date.now()}`;
    localStorage.setItem(`mindx_raw_${itemId}`, pasteContent);
    const newItem = {
      id: itemId,
      name: title,
      type: "TXT",
      size: new Blob([pasteContent]).size,
      uploadedAt: new Date().toISOString(),
      source: "paste" as const,
      content: pasteContent,
    };
    setRawDataItems((prev) => [newItem, ...prev]);
    // Sync to DB
    fetch("/api/rawdata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: activeWorkspaceIdGlobal,
        id: itemId,
        name: title,
        type: "TXT",
        size: newItem.size,
        source: "paste",
        content: pasteContent,
      }),
    }).catch(() => {});
    setPasteTitle("");
    setPasteContent("");
    setIsPasteModalOpen(false);
    setIsIntegrationMenuOpen(false);
  };

  const openRawDataInEditor = (item: (typeof rawDataItems)[0]) => {
    if (item.content) {
      localStorage.setItem(`mindx_raw_${item.id}`, item.content);
    }
    navigate(
      `/document?type=text&backTab=rawdata&source=rawdata&rawId=${item.id}&title=${encodeURIComponent(item.name)}`,
    );
  };

  const handleOpenProfileEditor = (key: "whoami" | "goal") => {
    setProfileEditKey(key);
    setProfileEditDraft(
      key === "whoami" ? profile.whoami || "" : profile.goal || "",
    );
  };

  const handleOpenMemoryNodeComposer = () => {
    setIsMemoryNodesExpanded(true);
  };

  const handleCancelMemoryNodeComposer = () => {
    setMemoryNodeInput("");
    setIsMemoryNodesExpanded(false);
  };

  const handleCreateMemoryNode = () => {
    const title = memoryNodeInput.trim();
    if (!title) return;

    const newNode = {
      id: `mnode-${Date.now()}`,
      title,
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMemoryNodes((prev) => [...prev, newNode]);
    localStorage.setItem(`mindx_raw_${newNode.id}`, "");
    setMemoryNodeInput("");
    setIsMemoryNodesExpanded(false);
  };

  const handleOpenMemoryNodeEditor = (node: (typeof memoryNodes)[number]) => {
    setNodeEditId(node.id);
    setNodeEditTitle(node.title);
    setNodeEditDraft(
      node.content || localStorage.getItem(`mindx_raw_${node.id}`) || "",
    );
  };

  const handleOpenKeyPointsDocument = () => {
    navigate("/document?type=text&backTab=profile&source=keypoints_doc");
  };

  const handleOpenExtractionPicker = () => {
    setSelectedExtractionFileIds(new Set(rawDataItems.map((item) => item.id)));
    setShowExtractionFilePicker(true);
  };

  // Document actions
  const [agentPermissionModalOpen, setAgentPermissionModalOpen] =
    useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [agentPermissions, setAgentPermissions] = useState<AgentPermission[]>(
    [],
  );

  const setActiveTab = (
    tab:
      | "documents"
      | "activity"
      | "agents"
      | "members"
      | "settings"
      | "labels"
      | "skills"
      | "profile"
      | "rawdata"
      | "memoagent",
  ) => {
    setActiveTabState(tab);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    navigate(`/dashboard?${params.toString()}`, { replace: true });
  };

  useEffect(() => {
    // Show onboarding if coming from landing page with "onboarding" flag or if it's first time
    const params = new URLSearchParams(location.search);
    if (params.get("onboarding") === "true") {
      setShowOnboarding(true);
      // Clear the onboarding parameter from URL
      params.delete("onboarding");
      navigate(`/dashboard?${params.toString()}`, { replace: true });
    } else if (agents.length === 0) {
      setShowOnboarding(true);
    }
  }, []);

  // Keep multi-space support in the prototype internals without exposing it in the main UI yet.
  const switchWorkspace = (workspaceId: string) => {
    if (!workspaces.some((workspace) => workspace.id === workspaceId)) return;

    setActiveWorkspaceId(workspaceId);
    setDocFilterType("all");
    setDocFilterOwner("all");
    setActivityFilterOwner("all");
  };

  const createWorkspace = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return null;

    const newWorkspace = {
      id: `w${Date.now()}`,
      name: trimmedName,
    };

    setWorkspaces((prev) => [...prev, newWorkspace]);
    setActiveWorkspaceId(newWorkspace.id);
    return newWorkspace.id;
  };

  const renameActiveWorkspace = (name: string) => {
    setWorkspaces((prev) =>
      prev.map((workspace) =>
        workspace.id === activeWorkspaceId ? { ...workspace, name } : workspace,
      ),
    );
  };

  const handleOnboardingComplete = (agentName: string) => {
    const newToken = `mx_agt_${Math.random().toString(36).substr(2, 12)}`;
    const newAgent = {
      id: `a${Date.now()}`,
      name: agentName,
      token: newToken,
      connected: false,
      createdAt: new Date().toISOString(),
      installedSkills: [] as string[],
    };

    setAgents([newAgent, ...agents]);

    const newPermission = {
      id: `p${Date.now()}`,
      workspaceId: activeWorkspaceId,
      memberId: newAgent.id,
      memberType: "Agent" as const,
      role: "Editor",
    };
    setPermissions([...permissions, newPermission]);

    // Auto-create a welcome document, clear initial demo data for new user
    const welcomeDoc: WorkspaceDoc = {
      id: `d${Date.now()}`,
      workspaceId: activeWorkspaceId,
      name: lang === "zh" ? "欢迎使用 MindX" : "Welcome to MindX",
      type: "Smart Doc",
      date: lang === "zh" ? "刚刚" : "Just now",
      lastModified: new Date().toISOString(),
      lastViewed: new Date().toISOString(),
      labels: ["Getting Started"],
      creatorName: agentName,
      creatorType: "agent",
      size: 8192,
      isNew: true,
      isRead: false,
      source: "normal",
    };
    setDocuments([welcomeDoc]);
    setActivities([]);
    setAbsenceSummaryDismissed(true);
    localStorage.setItem("mindx_absence_dismissed", "true");
    localStorage.setItem("mindx_is_new_user", "true");

    setShowOnboarding(false);
    setActiveTab("documents");
  };

  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0];
  const workspaceDocs = documents.filter(
    (d) => d.workspaceId === activeWorkspaceId,
  );
  console.log(
    "[Dashboard] render: activeWorkspaceId=",
    activeWorkspaceId,
    "documents.length=",
    documents.length,
    "workspaceDocs.length=",
    workspaceDocs.length,
    "activities.length=",
    activities.length,
    "sample doc wsId=",
    documents[0]?.workspaceId,
  );

  // 排序 + 筛选逻辑
  const filteredAndSortedDocs = React.useMemo(() => {
    let docs = [...workspaceDocs];

    // 按类型筛选
    if (docFilterType !== "all") {
      docs = docs.filter((d) => d.type === docFilterType);
    }

    // 按 owner 筛选
    if (docFilterOwner !== "all") {
      docs = docs.filter((d) => d.creatorName === docFilterOwner);
    }

    // 按场景筛选
    if (docSceneFilter === "today") {
      const todayStr = new Date().toISOString().slice(0, 10);
      docs = docs.filter((d) => d.lastModified.slice(0, 10) === todayStr);
    } else if (docSceneFilter === "unread") {
      docs = docs.filter((d) => d.isNew === true);
    } else if (docSceneFilter === "scheduled") {
      docs = docs.filter((d) => d.source === "scheduled");
    } else if (docSceneFilter === "webclip") {
      docs = docs.filter((d) => d.source === "webclip");
    } else if (docSceneFilter === "memory") {
      docs = docs.filter((d) => d.source === "memory");
    }

    // 排序
    docs.sort((a, b) => {
      const dateA = new Date(a[docSortBy]).getTime();
      const dateB = new Date(b[docSortBy]).getTime();
      return dateB - dateA; // 降序（最新在前）
    });

    return docs;
  }, [workspaceDocs, docSortBy, docFilterType, docFilterOwner, docSceneFilter]);

  // 获取当前 workspace 的文档类型列表和 owner 列表（用于筛选选项）
  const docTypes = React.useMemo(() => {
    return Array.from(new Set(workspaceDocs.map((d) => d.type)));
  }, [workspaceDocs]);

  const docOwners = React.useMemo(() => {
    const owners = Array.from(new Set(workspaceDocs.map((d) => d.creatorName)));
    return owners.sort((a, b) =>
      a === currentUser.name ? -1 : b === currentUser.name ? 1 : 0,
    );
  }, [workspaceDocs]);

  const activeFilterCount =
    (docFilterType !== "all" ? 1 : 0) +
    (docFilterOwner !== "all" ? 1 : 0) +
    (docSceneFilter !== "all" ? 1 : 0);
  const workspaceActivities = activities.filter(
    (a) => a.workspaceId === activeWorkspaceId,
  );
  console.log(
    "[Dashboard] workspaceActivities.length=",
    workspaceActivities.length,
    "activeWorkspaceId=",
    activeWorkspaceId,
    "sample activity wsId=",
    activities[0]?.workspaceId,
  );
  const activityOwners = React.useMemo(() => {
    return Array.from(new Set(workspaceActivities.map((a) => a.userName)));
  }, [workspaceActivities]);
  const filteredActivities = React.useMemo(() => {
    if (activityFilterOwner === "all") return workspaceActivities;
    return workspaceActivities.filter(
      (a) => a.userName === activityFilterOwner,
    );
  }, [workspaceActivities, activityFilterOwner]);

  const availableAgents = agents.filter(
    (agent) =>
      !permissions.some(
        (permission) =>
          permission.workspaceId === activeWorkspaceId &&
          permission.memberId === agent.id,
      ),
  );

  const workspacePermissions = permissions
    .filter((p) => p.workspaceId === activeWorkspaceId)
    .map((p) => {
      const member =
        p.memberType === "Human"
          ? p.memberId === currentUser.id
            ? currentUser
            : undefined
          : agents.find((a) => a.id === p.memberId);
      return { ...p, member };
    });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const newToken = `mx_agt_${Math.random().toString(36).substr(2, 12)}`;
    const newAgent = {
      id: `a${Date.now()}`,
      name: newAgentName.trim(),
      token: newToken,
      connected: false,
      createdAt: new Date().toISOString(),
      installedSkills: [] as string[],
    };

    setAgents([newAgent, ...agents]);

    // Automatically add to the current space as Editor
    const newPermission = {
      id: `p${Date.now()}`,
      workspaceId: activeWorkspaceId,
      memberId: newAgent.id,
      memberType: "Agent" as const,
      role: "Editor",
    };
    setPermissions([...permissions, newPermission]);
    setNewAgentName("");
    setIsCreatingAgent(false);
    setSelectedAgentId(newAgent.id);
  };

  const handleQuickCreateDoc = (
    type: "Smart Canvas" | "Smart Sheet" | "Page",
  ) => {
    const newDoc: WorkspaceDoc = {
      id: `d${Date.now()}`,
      workspaceId: activeWorkspaceId,
      name: "Untitled",
      type: type,
      date: "Just now",
      lastModified: new Date().toISOString(),
      lastViewed: new Date().toISOString(),
      labels: [],
      creatorName: currentUser.name,
      creatorType: "human",
      size: 0,
    };

    setDocuments([newDoc, ...documents]);
    setIsNewDocMenuOpen(false);
    navigate(`/document?id=${newDoc.id}&type=${normalizeDocType(type)}`);
  };

  const generatePrompt = (
    token: string,
  ) => `1. Copy the installation command to Lobster
Command: Download the zip package from https://cdn.mindx.com/static/mindx-docs.zip and unzip it, help me install this skill, and then set the environment variable MINDX_TOKEN="${token}".

2. Install Tencent Docs Skill
Command: Download the zip package from https://cdn.addon.tencentsuite.com/static/tencent-docs.zip and unzip it, help me install this skill, and then set the environment variable TENCENT_DOCS_TOKEN="8678a272066b4156ae2ad95c2709cc2b".`;

  return (
    <div className="h-screen bg-white text-stone-800 flex font-sans selection:bg-stone-200 overflow-hidden">
      {showOnboarding && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {/* Agent Permission Modal */}
      {agentPermissionModalOpen && selectedDocId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setAgentPermissionModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold mb-4">Agent权限设置</h2>

            <div className="space-y-3 mb-6">
              {agentPermissions.map((agentPerm) => (
                <div
                  key={agentPerm.agentId}
                  className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-stone-600" />
                    </div>
                    <span className="text-sm font-medium text-stone-900">
                      {agentPerm.agentName}
                    </span>
                  </div>
                  <select
                    value={agentPerm.permission}
                    onChange={(e) => {
                      setAgentPermissions((prev) =>
                        prev.map((ap) =>
                          ap.agentId === agentPerm.agentId
                            ? {
                                ...ap,
                                permission: e.target.value as "read" | "edit",
                              }
                            : ap,
                        ),
                      );
                    }}
                    className="px-3 py-1.5 border border-stone-200 rounded-md text-sm focus:outline-none focus:border-stone-400"
                  >
                    <option value="read">仅读取</option>
                    <option value="edit">可编辑</option>
                  </select>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                // Add a new agent (simplified for demo)
                const availableAgents = agents.filter(
                  (a) => !agentPermissions.some((ap) => ap.agentId === a.id),
                );
                if (availableAgents.length > 0) {
                  setAgentPermissions((prev) => [
                    ...prev,
                    {
                      agentId: availableAgents[0].id,
                      agentName: availableAgents[0].name,
                      permission: "read",
                    },
                  ]);
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors mb-4"
            >
              <Plus className="w-4 h-4" />
              添加 Agent
            </button>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setAgentPermissionModalOpen(false);
                  setSelectedDocId(null);
                  setAgentPermissions([]);
                }}
                className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // Save permissions (in real app, this would save to backend)
                  setAgentPermissionModalOpen(false);
                  setSelectedDocId(null);
                  setAgentPermissions([]);
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                保存
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 border-r border-stone-200 bg-[#F7F7F5] flex flex-col">
        <div className="h-14 flex items-center px-4">
          <WorkspaceSwitcher />
        </div>
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Workspace Group */}
          <div className="space-y-1">
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                Workspace
              </span>
            </div>
            <WorkspaceTreeV1 />
            <NavItem
              icon={<ActivityIcon className="w-4 h-4" />}
              label={t("sidebar.activityFeed")}
              active={activeTab === "activity"}
              onClick={() => {
                setActiveTab("activity");
                setIsCreatingAgent(false);
              }}
            />
          </div>

          {/* Memory Group */}
          <div className="space-y-1">
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                Memory
              </span>
            </div>
            <NavItem
              icon={<Sparkles className="w-4 h-4" />}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => {
                setActiveTab("profile");
                setIsCreatingAgent(false);
              }}
            />
            <NavItem
              icon={<Database className="w-4 h-4" />}
              label="Raw Data"
              active={activeTab === "rawdata"}
              onClick={() => {
                setActiveTab("rawdata");
                setIsCreatingAgent(false);
              }}
            />
            <NavItem
              icon={<MessageSquareText className="w-4 h-4" />}
              label="Memo Agent"
              active={activeTab === "memoagent"}
              onClick={() => {
                setActiveTab("memoagent");
                setIsCreatingAgent(false);
              }}
            />
          </div>

          {/* Skills Group */}
          <div className="space-y-1">
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                Skills
              </span>
            </div>
            <NavItem
              icon={<Sparkles className="w-4 h-4" />}
              label="Skills"
              active={activeTab === "skills"}
              onClick={() => {
                setActiveTab("skills");
                setIsCreatingAgent(false);
                setSelectedAgentId(null);
              }}
            />
          </div>
        </div>

        <div className="shrink-0 border-t border-stone-200 px-3 py-2 bg-[#F7F7F5] space-y-1">
          <div className="flex items-center gap-2 px-2 py-1.5 pt-2 border-t border-stone-200/50">
            <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 text-xs font-semibold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium truncate">
                {t("sidebar.humanAccount")}
              </p>
              <p className="text-[11px] text-stone-500 truncate">
                {currentUser.email}
              </p>
            </div>
            <LanguageSwitcher />
            <button
              onClick={() => {
                setActiveTab("settings");
                setIsCreatingAgent(false);
              }}
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 transition-colors"
              title={t("sidebar.settings")}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-8 border-b border-stone-200">
          <h1 className="text-lg font-medium">
            {activeTab === "documents" && t("docs.title")}
            {activeTab === "activity" && t("activity.title")}
            {activeTab === "agents" && t("agent.title")}
            {activeTab === "profile" && "Profile"}
            {activeTab === "rawdata" &&
              (lang === "zh" ? "原始数据 (Raw Data)" : "Raw Data")}
            {activeTab === "memoagent" && "Memo Agent"}
            {activeTab === "settings" && t("settings.title")}
            {activeTab === "skills" && "Skills"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder={t("common.search")}
                className="pl-9 pr-4 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-sm focus:outline-none focus:border-stone-300 focus:bg-white transition-colors w-64"
              />
            </div>
            {["documents", "agents"].includes(activeTab) && (
              <div className="relative">
                <button
                  onClick={() => {
                    if (activeTab === "agents") setIsCreatingAgent(true);
                    if (activeTab === "documents")
                      setIsNewDocMenuOpen(!isNewDocMenuOpen);
                  }}
                  className="flex items-center gap-1.5 bg-stone-900 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {activeTab === "documents" && t("docs.newDoc")}
                  {activeTab === "agents" && t("agent.newAgent")}
                </button>

                {activeTab === "documents" && isNewDocMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsNewDocMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                      <button
                        onClick={() => handleQuickCreateDoc("Smart Canvas")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        {getDocTypeIcon("Smart Canvas", 16)}
                        <span>{t("docs.smartCanvas")}</span>
                      </button>
                      <button
                        onClick={() => handleQuickCreateDoc("Smart Sheet")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        {getDocTypeIcon("Smart Sheet", 16)}
                        <span>{t("docs.smartSheet")}</span>
                      </button>
                      <button
                        onClick={() => handleQuickCreateDoc("Page")}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        {getDocTypeIcon("Page", 16)}
                        <span>{t("docs.page")}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8 max-w-6xl">
            {activeTab === "documents" && (
              <DocumentsTab
                demoMode={demoMode}
                absenceSummaryDismissed={absenceSummaryDismissed}
                setAbsenceSummaryDismissed={setAbsenceSummaryDismissed}
                dynamicAbsenceSummaryData={dynamicAbsenceSummaryData}
                guideDismissed={guideDismissed}
                setGuideDismissed={setGuideDismissed}
                documents={documents}
                setDocuments={setDocuments}
                docSceneFilter={docSceneFilter}
                setDocSceneFilter={setDocSceneFilter}
                isTypeFilterOpen={isTypeFilterOpen}
                setIsTypeFilterOpen={setIsTypeFilterOpen}
                isSortMenuOpen={isSortMenuOpen}
                setIsSortMenuOpen={setIsSortMenuOpen}
                docFilterType={docFilterType}
                setDocFilterType={setDocFilterType}
                docFilterOwner={docFilterOwner}
                setDocFilterOwner={setDocFilterOwner}
                docSortBy={docSortBy}
                setDocSortBy={setDocSortBy}
                docTypes={docTypes}
                filteredAndSortedDocs={filteredAndSortedDocs}
                activeFilterCount={activeFilterCount}
                setIsPricingModalOpen={setIsPricingModalOpen}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "activity" && (
              <ActivityTab
                activityFilterOwner={activityFilterOwner}
                setActivityFilterOwner={setActivityFilterOwner}
                activityOwners={activityOwners}
                workspaceActivities={workspaceActivities}
                filteredActivities={filteredActivities}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                isCreatingAgent={isCreatingAgent}
                setIsCreatingAgent={setIsCreatingAgent}
                newAgentName={newAgentName}
                setNewAgentName={setNewAgentName}
                handleCreateAgent={handleCreateAgent}
                selectedAgentId={selectedAgentId}
                setSelectedAgentId={setSelectedAgentId}
                agents={agents}
                setAgents={setAgents}
                activities={activities}
                copiedStates={copiedStates}
                copyToClipboard={copyToClipboard}
                agentListMenuOpen={agentListMenuOpen}
                setAgentListMenuOpen={setAgentListMenuOpen}
                documents={documents}
                demoMode={demoMode}
                setDemoMode={setDemoMode}
                extractionModel={extractionModel}
                setExtractionModel={setExtractionModel}
                extractionApiKey={extractionApiKey}
                setExtractionApiKey={setExtractionApiKey}
                extractionBaseUrl={extractionBaseUrl}
                setExtractionBaseUrl={setExtractionBaseUrl}
                extractionSkillPrompt={extractionSkillPrompt}
                setExtractionSkillPrompt={setExtractionSkillPrompt}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "skills" && (
              <SkillsTab
                selectedSkillId={selectedSkillId}
                setSelectedSkillId={setSelectedSkillId}
                copiedStates={copiedStates}
                setCopiedStates={setCopiedStates}
                agents={agents}
                setAgents={setAgents}
              />
            )}

            {(activeTab === "profile" || activeTab === "rawdata") && (
              <MemoryTab
                activeMemoryView={activeTab === "profile" ? "profile" : "rawdata"}
                fileInputRef={fileInputRef}
                whoAmIDocContent={whoAmIDocContent}
                goalDocContent={goalDocContent}
                handleOpenProfileEditor={handleOpenProfileEditor}
                memoryNodes={memoryNodes}
                memoryNodeInput={memoryNodeInput}
                isMemoryNodesExpanded={isMemoryNodesExpanded}
                setMemoryNodeInput={setMemoryNodeInput}
                handleOpenMemoryNodeComposer={handleOpenMemoryNodeComposer}
                handleCancelMemoryNodeComposer={handleCancelMemoryNodeComposer}
                handleCreateMemoryNode={handleCreateMemoryNode}
                handleOpenMemoryNodeEditor={handleOpenMemoryNodeEditor}
                extractedKeyPoints={extractedKeyPoints}
                handleOpenKeyPointsDocument={handleOpenKeyPointsDocument}
                rawDataItems={rawDataItems}
                rawDataLoading={rawDataLoading}
                extractionRunning={extractionRunning}
                extractionLogs={extractionLogs}
                setIsPasteModalOpen={setIsPasteModalOpen}
                setIsRawDataModalOpen={setIsRawDataModalOpen}
                openRawDataInEditor={openRawDataInEditor}
                setIsPricingModalOpen={setIsPricingModalOpen}
                setIsModelConfigOpen={setIsModelConfigOpen}
                handleOpenExtractionPicker={handleOpenExtractionPicker}
              />
            )}

            {activeTab === "memoagent" && <MemoAgentTab />}
          </div>
        </div>
      </main>

      {/* Hidden file input for Memory upload */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.xls,.csv,.pptx,.ppt,.json"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Paste Text Modal */}
      {isPasteModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setIsPasteModalOpen(false)}
          />
          <div
            className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            <div className="px-6 py-4 flex items-center justify-between border-b border-stone-100">
              <h2 className="text-base font-bold text-stone-900">
                {lang === "zh" ? "粘贴文本内容" : "Paste Text Content"}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
                  Markdown
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[9px] font-bold">
                  ✓
                </span>
                <button
                  onClick={() => setIsPasteModalOpen(false)}
                  className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-900 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">
                  {lang === "zh" ? "标题（可选）" : "Title (Optional)"}
                </label>
                <input
                  type="text"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  placeholder={
                    lang === "zh" ? "为这份资料命名..." : "Name this content..."
                  }
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-colors"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-stone-600">
                    {lang === "zh" ? "内容" : "Content"}
                  </label>
                  <span className="text-[10px] text-stone-400">
                    {lang === "zh"
                      ? "支持 Markdown 语法：# 标题、**粗体**、- 列表、> 引用、```代码块"
                      : "Supports Markdown: # headings, **bold**, - lists, > quotes, ```code"}
                  </span>
                </div>
                <textarea
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder={
                    lang === "zh"
                      ? "在此粘贴你的 Markdown 或纯文本内容...\n\n例如：\n# 我的笔记\n\n这是一段 **重要** 的内容。\n\n- 要点一\n- 要点二"
                      : "Paste your Markdown or plain text here...\n\ne.g.:\n# My Notes\n\nThis is **important** content.\n\n- Point one\n- Point two"
                  }
                  rows={10}
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg text-sm font-mono leading-relaxed focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200 transition-colors resize-none bg-stone-50/50"
                  autoFocus
                />
              </div>
              {/* Live Markdown Preview */}
              {pasteContent.trim() && (
                <div>
                  <label className="text-xs font-semibold text-stone-400 mb-1.5 block uppercase tracking-wider">
                    {lang === "zh" ? "预览" : "Preview"}
                  </label>
                  <div className="border border-stone-200 rounded-lg p-4 bg-white max-h-48 overflow-y-auto prose-sm">
                    {pasteContent.split("\n").map((line, i) => {
                      const trimmed = line.trim();
                      if (!trimmed) return <div key={i} className="h-2" />;
                      if (trimmed.startsWith("### "))
                        return (
                          <h4
                            key={i}
                            className="text-sm font-bold text-stone-800 mt-2 mb-1"
                          >
                            {trimmed.slice(4)}
                          </h4>
                        );
                      if (trimmed.startsWith("## "))
                        return (
                          <h3
                            key={i}
                            className="text-base font-bold text-stone-900 mt-3 mb-1"
                          >
                            {trimmed.slice(3)}
                          </h3>
                        );
                      if (trimmed.startsWith("# "))
                        return (
                          <h2
                            key={i}
                            className="text-lg font-bold text-stone-900 mt-3 mb-1"
                          >
                            {trimmed.slice(2)}
                          </h2>
                        );
                      if (trimmed.startsWith("> "))
                        return (
                          <blockquote
                            key={i}
                            className="border-l-2 border-stone-300 pl-3 text-stone-600 text-sm italic my-1"
                          >
                            {trimmed.slice(2)}
                          </blockquote>
                        );
                      if (trimmed.startsWith("- ") || trimmed.startsWith("* "))
                        return (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-stone-700 my-0.5"
                          >
                            <span className="text-stone-400 mt-0.5">•</span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: trimmed
                                  .slice(2)
                                  .replace(
                                    /\*\*(.+?)\*\*/g,
                                    "<strong>$1</strong>",
                                  )
                                  .replace(
                                    /`(.+?)`/g,
                                    '<code class="bg-stone-100 px-1 rounded text-xs font-mono">$1</code>',
                                  ),
                              }}
                            />
                          </div>
                        );
                      if (/^\d+\.\s/.test(trimmed))
                        return (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-sm text-stone-700 my-0.5"
                          >
                            <span className="text-stone-500 font-medium">
                              {trimmed.match(/^(\d+)\./)?.[1]}.
                            </span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: trimmed
                                  .replace(/^\d+\.\s*/, "")
                                  .replace(
                                    /\*\*(.+?)\*\*/g,
                                    "<strong>$1</strong>",
                                  )
                                  .replace(
                                    /`(.+?)`/g,
                                    '<code class="bg-stone-100 px-1 rounded text-xs font-mono">$1</code>',
                                  ),
                              }}
                            />
                          </div>
                        );
                      if (trimmed.startsWith("```"))
                        return (
                          <div
                            key={i}
                            className="bg-stone-100 rounded px-2 py-0.5 text-[10px] font-mono text-stone-500"
                          >
                            {trimmed.slice(3) || "code"}
                          </div>
                        );
                      return (
                        <p
                          key={i}
                          className="text-sm text-stone-700 my-0.5"
                          dangerouslySetInnerHTML={{
                            __html: trimmed
                              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                              .replace(
                                /`(.+?)`/g,
                                '<code class="bg-stone-100 px-1 rounded text-xs font-mono">$1</code>',
                              ),
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                {pasteContent.trim()
                  ? `${pasteContent.split("\n").filter((l) => l.trim()).length} ${lang === "zh" ? "行" : "lines"}`
                  : ""}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPasteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  {lang === "zh" ? "取消" : "Cancel"}
                </button>
                <button
                  onClick={handlePasteSubmit}
                  disabled={!pasteContent.trim()}
                  className="px-5 py-2 text-sm font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {lang === "zh" ? "添加到原始资料" : "Add to Raw Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raw Data List Modal */}
      {isRawDataModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setIsRawDataModalOpen(false)}
          />
          <div
            className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            <div className="px-6 py-4 flex items-center justify-between border-b border-stone-100 shrink-0">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-stone-500" />
                {lang === "zh" ? "已上传的原始资料" : "Uploaded Raw Data"}
                <span className="text-sm font-normal text-stone-400">
                  ({rawDataItems.length})
                </span>
              </h2>
              <button
                onClick={() => setIsRawDataModalOpen(false)}
                className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-stone-50/30 flex-1">
              {rawDataItems.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-sm text-stone-500 font-medium">
                    {lang === "zh" ? "暂无上传的文件" : "No files uploaded yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rawDataItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setIsRawDataModalOpen(false);
                        openRawDataInEditor(item);
                      }}
                      className="flex items-center justify-between p-4 rounded-xl border border-stone-200/60 bg-white hover:bg-stone-50 hover:border-stone-300 transition-all shadow-sm group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.source === "paste" ? "bg-amber-50" : "bg-blue-50"}`}
                        >
                          <FileText
                            className={`w-5 h-5 ${item.source === "paste" ? "text-amber-600" : "text-blue-600"}`}
                          />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-semibold text-stone-800 truncate max-w-[400px]">
                            {item.name}
                          </h4>
                          <p className="text-xs text-stone-400 flex items-center gap-2 mt-1">
                            <span className="font-medium text-stone-500">
                              {item.type}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                            <span>{(item.size / 1024).toFixed(1)} KB</span>
                            <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                            <span>
                              {new Date(item.uploadedAt).toLocaleString(
                                lang === "zh" ? "zh-CN" : "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsRawDataModalOpen(false);
                            handleStartExtraction();
                          }}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors shadow-sm cursor-pointer"
                        >
                          {lang === "zh" ? "开始提炼" : "Extract"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fetch(`/api/rawdata?id=${item.id}`, {
                              method: "DELETE",
                            }).catch(() => {});
                            setRawDataItems((prev) =>
                              prev.filter((i) => i.id !== item.id),
                            );
                            localStorage.removeItem(`mindx_raw_${item.id}`);
                          }}
                          className="p-1.5 rounded-md text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        lang={lang}
      />

      {/* Model Configuration Modal */}
      {isModelConfigOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ animation: "fadeIn 0.2s ease-out" }}
        >
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setIsModelConfigOpen(false)}
          />
          <div
            className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            <div className="px-6 py-4 flex items-center justify-between border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-base font-bold text-stone-900">
                  {lang === "zh"
                    ? "萃取 Agent 模型配置"
                    : "Extraction Agent Config"}
                </h2>
              </div>
              <button
                onClick={() => setIsModelConfigOpen(false)}
                className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Model Selection */}
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">
                  {lang === "zh" ? "模型" : "Model"}
                </label>
                <select
                  value={extractionModel}
                  onChange={(e) => setExtractionModel(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors bg-white appearance-none cursor-pointer"
                >
                  <optgroup label="Anthropic">
                    <option value="claude-sonnet-4-20250514">
                      Claude Sonnet 4
                    </option>
                    <option value="claude-3-5-sonnet-20241022">
                      Claude 3.5 Sonnet
                    </option>
                    <option value="claude-3-5-haiku-20241022">
                      Claude 3.5 Haiku
                    </option>
                  </optgroup>
                  <optgroup label="OpenAI">
                    <option value="gpt-5.4">GPT-5.4</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="o3-mini">o3-mini</option>
                  </optgroup>
                  <optgroup label="DeepSeek">
                    <option value="deepseek-chat">DeepSeek V3</option>
                    <option value="deepseek-reasoner">DeepSeek R1</option>
                  </optgroup>
                  <optgroup
                    label={lang === "zh" ? "国产模型" : "Chinese Models"}
                  >
                    <option value="qwen-max">Qwen Max</option>
                    <option value="glm-4-plus">GLM-4 Plus</option>
                    <option value="moonshot-v1-128k">Moonshot 128K</option>
                  </optgroup>
                </select>
              </div>

              {/* API Key */}
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">
                  API Key
                </label>
                <input
                  type="password"
                  value={extractionApiKey}
                  onChange={(e) => setExtractionApiKey(e.target.value)}
                  placeholder={
                    lang === "zh"
                      ? "输入模型对应的 API Key..."
                      : "Enter API key for the selected model..."
                  }
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors"
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  {lang === "zh"
                    ? "API Key 仅存储在浏览器本地，不会上传到服务器"
                    : "API Key is stored locally in your browser only"}
                </p>
              </div>

              {/* Base URL (optional) */}
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">
                  Base URL{" "}
                  <span className="text-stone-400 font-normal">
                    ({lang === "zh" ? "可选" : "Optional"})
                  </span>
                </label>
                <input
                  type="text"
                  value={extractionBaseUrl}
                  onChange={(e) => setExtractionBaseUrl(e.target.value)}
                  placeholder={
                    lang === "zh"
                      ? "自定义 API 端点，留空则使用官方默认"
                      : "Custom API endpoint, leave empty for official default"
                  }
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors"
                />
              </div>

              {/* Quick Tips */}
              <div className="bg-violet-50/60 rounded-lg p-3 border border-violet-100">
                <p className="text-[11px] text-violet-700 font-medium mb-1">
                  {lang === "zh"
                    ? "💡 萃取 Agent 会执行以下任务："
                    : "💡 The Extraction Agent will:"}
                </p>
                <ul className="text-[11px] text-violet-600 space-y-0.5 list-disc pl-4">
                  <li>
                    {lang === "zh"
                      ? "从原始文档中提取关键事实和实体"
                      : "Extract key facts and entities from raw docs"}
                  </li>
                  <li>
                    {lang === "zh"
                      ? "识别可操作的洞察和模式"
                      : "Identify actionable insights and patterns"}
                  </li>
                  <li>
                    {lang === "zh"
                      ? "生成结构化的知识图谱条目"
                      : "Generate structured knowledge graph entries"}
                  </li>
                  <li>
                    {lang === "zh"
                      ? "更新你的 Agent 记忆库"
                      : "Update your Agent's memory store"}
                  </li>
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModelConfigOpen(false)}
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
              >
                {lang === "zh" ? "取消" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  localStorage.setItem(
                    "mindx_extraction_model",
                    extractionModel,
                  );
                  localStorage.setItem(
                    "mindx_extraction_apikey",
                    extractionApiKey,
                  );
                  localStorage.setItem(
                    "mindx_extraction_baseurl",
                    extractionBaseUrl,
                  );
                  setIsModelConfigOpen(false);
                }}
                className="px-5 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
              >
                {lang === "zh" ? "保存配置" : "Save Config"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Markdown Editor Modal */}
      {profileEditKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setProfileEditKey(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                {profileEditKey === "whoami" ? (
                  <>
                    <User className="w-4 h-4 text-indigo-500" />
                    {lang === "zh" ? "编辑画像" : "Edit Profile"}
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-orange-500" />
                    {lang === "zh" ? "编辑目标" : "Edit Goal"}
                  </>
                )}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProfileEditKey(null)}
                  className="text-xs text-stone-400 hover:text-stone-700 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  {lang === "zh" ? "取消" : "Cancel"}
                </button>
                <button
                  onClick={() => {
                    updateProfile(profileEditKey, profileEditDraft);
                    setProfileEditKey(null);
                  }}
                  className="text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 px-4 py-1.5 rounded-lg transition-colors"
                >
                  {lang === "zh" ? "保存" : "Save"}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <textarea
                autoFocus
                value={profileEditDraft}
                onChange={(e) => setProfileEditDraft(e.target.value)}
                placeholder={
                  profileEditKey === "whoami"
                    ? lang === "zh"
                      ? "描述你的身份、角色、交互偏好...\n\n支持 Markdown 格式"
                      : "Describe your identity, role, preferences...\n\nSupports Markdown"
                    : lang === "zh"
                      ? "描述你当前的核心目标...\n\n支持 Markdown 格式"
                      : "Describe your current goals...\n\nSupports Markdown"
                }
                className="w-full h-full min-h-[40vh] bg-transparent border-none focus:outline-none text-sm text-stone-800 leading-relaxed font-mono resize-none placeholder:text-stone-300"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Custom Node Markdown Editor Modal */}
      {nodeEditId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setNodeEditId(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-500" />
                {nodeEditTitle}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMemoryNodes((prev) =>
                      prev.filter((n) => n.id !== nodeEditId),
                    );
                    localStorage.removeItem(`mindx_raw_${nodeEditId}`);
                    setNodeEditId(null);
                  }}
                  className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  {lang === "zh" ? "删除" : "Delete"}
                </button>
                <button
                  onClick={() => setNodeEditId(null)}
                  className="text-xs text-stone-400 hover:text-stone-700 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  {lang === "zh" ? "取消" : "Cancel"}
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem(
                      `mindx_raw_${nodeEditId}`,
                      nodeEditDraft,
                    );
                    setMemoryNodes((prev) =>
                      prev.map((n) =>
                        n.id === nodeEditId
                          ? {
                              ...n,
                              content: nodeEditDraft,
                              updatedAt: new Date().toISOString(),
                            }
                          : n,
                      ),
                    );
                    setNodeEditId(null);
                  }}
                  className="text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 px-4 py-1.5 rounded-lg transition-colors"
                >
                  {lang === "zh" ? "保存" : "Save"}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <textarea
                autoFocus
                value={nodeEditDraft}
                onChange={(e) => setNodeEditDraft(e.target.value)}
                placeholder={
                  lang === "zh"
                    ? "输入记忆内容...\n\n支持 Markdown 格式"
                    : "Enter memory content...\n\nSupports Markdown"
                }
                className="w-full h-full min-h-[40vh] bg-transparent border-none focus:outline-none text-sm text-stone-800 leading-relaxed font-mono resize-none placeholder:text-stone-300"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Extraction File Picker Modal */}
      {showExtractionFilePicker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowExtractionFilePicker(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                {lang === "zh" ? "蒸馏配置" : "Distillation Config"}
              </h2>
              <button
                onClick={() => setShowExtractionFilePicker(false)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto px-6 py-3 space-y-5">
              {/* Skill Selection */}
              <div>
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2.5">
                  {lang === "zh" ? "选择蒸馏 Skill" : "Select Distillation Skill"}
                </div>
                <div className="space-y-1.5">
                  {[
                    {
                      id: "profile",
                      name: "Profile",
                      desc: lang === "zh" ? "提炼用户画像、偏好与行为模式" : "Extract user profile, preferences & patterns",
                      repo: "https://github.com/ClarkYoung-xhs/profile-distill-skill",
                    },
                    {
                      id: "knowledge-graph",
                      name: "Knowledge Graph",
                      desc: lang === "zh" ? "构建实体关系图谱与知识网络" : "Build entity-relationship graph & knowledge network",
                      repo: null as string | null,
                    },
                    {
                      id: "action-items",
                      name: "Action Items",
                      desc: lang === "zh" ? "提取待办事项与行动计划" : "Extract action items & plans",
                      repo: null as string | null,
                    },
                  ].map((skill) => (
                    <label
                      key={skill.id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                        selectedExtractionSkill === skill.id
                          ? "border-blue-200 bg-blue-50/50"
                          : "border-stone-100 hover:border-stone-200 hover:bg-stone-50/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="extraction-skill"
                        value={skill.id}
                        checked={selectedExtractionSkill === skill.id}
                        onChange={() => setSelectedExtractionSkill(skill.id)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-stone-800">{skill.name}</div>
                        <div className="text-[10px] text-stone-400">{skill.desc}</div>
                        {skill.repo && (
                          <a
                            href={skill.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 mt-1 text-[10px] text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            ↗ GitHub
                          </a>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Selection */}
              <div>
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2.5">
                  {lang === "zh" ? "选择数据源" : "Select Data Sources"}
                </div>
                <label className="flex items-center gap-3 py-2 border-b border-stone-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedExtractionFileIds.size === rawDataItems.length
                    }
                    onChange={(e) =>
                      setSelectedExtractionFileIds(
                        e.target.checked
                          ? new Set(rawDataItems.map((i) => i.id))
                          : new Set(),
                      )
                    }
                    className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-stone-700">
                    {lang === "zh" ? "全选" : "Select All"}
                  </span>
                  <span className="text-[10px] text-stone-400 ml-auto">
                    {selectedExtractionFileIds.size}/{rawDataItems.length}
                  </span>
                </label>
                {rawDataItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 py-2.5 border-b border-stone-50 cursor-pointer hover:bg-stone-50/50 rounded-lg px-1 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtractionFileIds.has(item.id)}
                      onChange={(e) => {
                        const next = new Set(selectedExtractionFileIds);
                        e.target.checked
                          ? next.add(item.id)
                          : next.delete(item.id);
                        setSelectedExtractionFileIds(next);
                      }}
                      className="w-4 h-4 rounded border-stone-300 text-blue-600 focus:ring-blue-500 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-stone-700 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {item.type}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-stone-100">
              <button
                onClick={() => handleStartExtraction()}
                disabled={selectedExtractionFileIds.size === 0}
                className={`w-full flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-xl transition-all ${
                  selectedExtractionFileIds.size === 0
                    ? "bg-stone-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {lang === "zh"
                  ? `开始提取 (${selectedExtractionFileIds.size} 个文件)`
                  : `Start Extraction (${selectedExtractionFileIds.size} files)`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
