import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Globe,
  Monitor,
  Moon,
  Sun,
  User as UserIcon,
  Bell,
  Lock,
  LogOut,
  BrainCircuit,
  MessageSquare,
  Bot,
  Plug,
  Terminal,
  Activity as ActivityIcon,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  MoreVertical,
  Key,
  Shield,
  PlayCircle,
  StopCircle,
  Wand2,
  ArrowLeft,
  Check,
  Clock,
  Sparkles,
  FileText,
  Database,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import { getAgentAvatar } from "../../components/AgentAvatars";
import { useLanguage } from "../../i18n/LanguageContext";
import type { Activity, DemoMode, WorkspaceDoc } from "./types";
import { activeWorkspaceIdGlobal } from "./constants";

interface Agent {
  id: string;
  name: string;
  token: string;
  connected: boolean;
  createdAt: string;
  installedSkills?: string[];
}

export interface SettingsTabProps {
  isCreatingAgent: boolean;
  setIsCreatingAgent: (v: boolean) => void;
  newAgentName: string;
  setNewAgentName: (v: string) => void;
  handleCreateAgent: (e: React.FormEvent) => void;
  selectedAgentId: string | null;
  setSelectedAgentId: (v: string | null) => void;
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  activities: Activity[];
  copiedStates: Record<string, boolean>;
  copyToClipboard: (text: string, key: string) => void;
  agentListMenuOpen: string | null;
  setAgentListMenuOpen: (v: string | null) => void;
  documents: WorkspaceDoc[];
  demoMode: DemoMode;
  setDemoMode: (mode: DemoMode) => void;
  extractionModel: string;
  setExtractionModel: (v: string) => void;
  extractionApiKey: string;
  setExtractionApiKey: (v: string) => void;
  extractionBaseUrl: string;
  setExtractionBaseUrl: (v: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function SettingsTab(props: SettingsTabProps) {
  const {
    isCreatingAgent,
    setIsCreatingAgent,
    newAgentName,
    setNewAgentName,
    handleCreateAgent,
    selectedAgentId,
    setSelectedAgentId,
    agents,
    setAgents,
    activities,
    copiedStates,
    copyToClipboard,
    agentListMenuOpen,
    setAgentListMenuOpen,
    documents,
    demoMode,
    setDemoMode,
    extractionModel,
    setExtractionModel,
    extractionApiKey,
    setExtractionApiKey,
    extractionBaseUrl,
    setExtractionBaseUrl,
    setActiveTab,
  } = props;
  const { t, lang } = useLanguage();
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full"
    >
      {/* Embedded Agents Settings */}
      <div className="mb-12 pb-8 border-b border-stone-200/80">
        <h3 className="text-xl font-bold text-stone-900 mb-6">
          Agent Configuration
        </h3>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {isCreatingAgent ? (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setIsCreatingAgent(false)}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-6 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> {t("agent.backToAgents")}
            </button>
            <div className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-8">
              <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200/60 flex items-center justify-center text-stone-700 shadow-sm mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2 tracking-tight">
                {t("agent.createTitle")}
              </h2>
              <p className="text-sm text-stone-500 mb-8">
                Generate a new agent token to integrate your AI assistant with
                the system.
              </p>
              <form onSubmit={handleCreateAgent} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200/80 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
                    placeholder="e.g. Data Analyzer Bot"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsCreatingAgent(false)}
                    className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={!newAgentName.trim()}
                    className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {t("common.create")} Agent
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : selectedAgentId ? (
          (() => {
            const agent = agents.find((a) => a.id === selectedAgentId);
            if (!agent) return null;
            const agentActivities = activities
              .filter((a) => a.userId === selectedAgentId)
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime(),
              );
            return (
              <div>
                <button
                  onClick={() => setSelectedAgentId(null)}
                  className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-6 transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" /> {t("agent.backToAgents")}
                </button>

                {/* Agent Detail Card */}
                <div className="p-6 rounded-xl border border-stone-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {getAgentAvatar(agent.name, 32)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-stone-900 tracking-tight">
                            {agent.name}
                          </h2>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${agent.connected ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400"}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${agent.connected ? "bg-emerald-500" : "bg-stone-300"}`}
                            />
                            {agent.connected
                              ? lang === "zh"
                                ? "已连接"
                                : "Connected"
                              : lang === "zh"
                                ? "未连接"
                                : "Disconnected"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-stone-500 font-medium">
                            {t("agent.globalAccount")}
                          </p>
                          <span className="text-xs text-stone-300">·</span>
                          <p className="text-xs text-stone-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(agent.createdAt).toLocaleDateString(
                              lang === "zh" ? "zh-CN" : "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
                        className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {isAgentMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsAgentMenuOpen(false)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                            <button
                              onClick={() => setIsAgentMenuOpen(false)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                            >
                              <Shield className="w-4 h-4 text-stone-400" />
                              Manage Permissions
                            </button>
                            <button
                              onClick={() => setIsAgentMenuOpen(false)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                            >
                              <StopCircle className="w-4 h-4 text-stone-400" />
                              Stop Sync
                            </button>
                            <div className="border-t border-stone-100 my-0.5" />
                            <button
                              onClick={() => {
                                setIsAgentMenuOpen(false);
                                setAgents((prev) =>
                                  prev.filter((a) => a.id !== selectedAgentId),
                                );
                                fetch(`/api/agents?id=${selectedAgentId}`, { method: "DELETE" }).catch(() => {});
                                setSelectedAgentId(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                        {t("agent.token")}
                      </h3>
                      <div className="relative">
                        <div className="bg-stone-50/80 border border-stone-200/60 rounded-lg p-3.5 text-sm font-medium text-stone-700 break-all pr-16 tracking-wide">
                          {agent.token}
                        </div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <div className="relative group/copy">
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  agent.token,
                                  `token-${agent.id}`,
                                )
                              }
                              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-stone-500 transition-all"
                            >
                              {copiedStates[`token-${agent.id}`] ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md bg-stone-900 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover/copy:opacity-100 transition-opacity pointer-events-none">
                              {copiedStates[`token-${agent.id}`]
                                ? lang === "zh"
                                  ? "已复制"
                                  : "Copied"
                                : lang === "zh"
                                  ? "复制 Token"
                                  : "Copy Token"}
                            </span>
                          </div>
                          <div className="relative group/reset">
                            <button
                              onClick={() => {
                                const newToken = `mx_agt_${Math.random().toString(36).substr(2, 12)}`;
                                setAgents((prev) =>
                                  prev.map((a) =>
                                    a.id === agent.id
                                      ? { ...a, token: newToken }
                                      : a,
                                  ),
                                );
                                fetch("/api/agents", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    workspace_id: activeWorkspaceIdGlobal,
                                    id: agent.id,
                                    name: agent.name,
                                    token: newToken,
                                    installed_skills: agent.installedSkills,
                                    connected: agent.connected,
                                  }),
                                }).catch(() => {});
                              }}
                              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-stone-500 transition-all"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md bg-stone-900 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover/reset:opacity-100 transition-opacity pointer-events-none">
                              {lang === "zh" ? "重置 Token" : "Reset Token"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Installed Skills */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-stone-500" />
                      {lang === "zh" ? "已安装 Skills" : "Installed Skills"}
                    </h3>
                    <button
                      onClick={() => {
                        setActiveTab("skills");
                        setSelectedAgentId(null);
                      }}
                      className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {(agent.installedSkills || []).length > 0 ? (
                    <div className="border border-stone-200/80 rounded-xl bg-white overflow-hidden">
                      {[
                        {
                          name: "MindX Docs",
                          tag: "Core",
                          icon: <FileText className="w-4 h-4" />,
                          provider: "MindX",
                        },
                        {
                          name: "MindX Memory",
                          tag: "Core",
                          icon: <Database className="w-4 h-4" />,
                          provider: "MindX",
                        },
                        {
                          name: "Daily Update",
                          tag: "Pro",
                          icon: <CalendarDays className="w-4 h-4" />,
                          provider: "MindX",
                        },
                      ]
                        .filter((s) =>
                          (agent.installedSkills || []).includes(s.name),
                        )
                        .map((skill, i, arr) => (
                          <div
                            key={i}
                            className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-stone-100" : ""}`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white shrink-0">
                              {skill.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold text-stone-900">
                                  {skill.name}
                                </span>
                                <span className="text-[9px] font-bold text-stone-400 uppercase bg-stone-100 px-1.5 py-0.5 rounded">
                                  {skill.tag}
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] text-stone-400">
                              {lang === "zh" ? "提供方" : "by"} {skill.provider}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center border border-stone-200/60 border-dashed rounded-xl">
                      <Sparkles className="w-6 h-6 text-stone-200 mx-auto mb-2" />
                      <p className="text-stone-400 text-xs mb-2">
                        {lang === "zh"
                          ? "暂未安装任何 Skill"
                          : "No Skills installed yet"}
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab("skills");
                          setSelectedAgentId(null);
                        }}
                        className="text-xs font-medium text-stone-500 hover:text-stone-700 underline transition-colors"
                      >
                        {lang === "zh" ? "去安装" : "Install now"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        ) : (
          <div className="max-w-5xl w-full flex items-start flex-col md:flex-row md:gap-8">
            {/* Left Navigation Menu */}
            <div className="w-full md:w-40 lg:w-44 shrink-0 -order-1 md:order-none mb-6 md:mb-0 self-start md:sticky md:top-0">
              <div className="space-y-1.5 p-1 bg-white md:bg-transparent rounded-xl shadow-sm border border-stone-100 md:shadow-none md:border-none md:rounded-none">
                {[
                  {
                    id: "section-agent-config",
                    label: lang === "zh" ? "Agent 代理配置" : "Agent Config",
                  },
                  {
                    id: "section-storage",
                    label: lang === "zh" ? "账号容量" : "Storage Capacity",
                  },
                  {
                    id: "section-demo",
                    label: lang === "zh" ? "演示模式" : "Demo Mode",
                  },
                  {
                    id: "section-share",
                    label: lang === "zh" ? "分享文档预览" : "Share Preview",
                  },
                  {
                    id: "section-extraction",
                    label:
                      lang === "zh"
                        ? "萃取引擎配置"
                        : "Extraction Engine Config",
                  },
                ].map((nav) => (
                  <button
                    key={nav.id}
                    onClick={() => {
                      const el = document.getElementById(nav.id);
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-stone-500 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
                  >
                    {nav.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 w-full max-w-3xl space-y-6">
              {/* Agent Config Box */}
              <div
                id="section-agent-config"
                className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold tracking-tight text-stone-900 mb-0">
                    Agent Configuration
                  </h2>
                </div>
                {(() => {
                  const agentList = agents;
                  return agents.length > 0 ? (
                    agents.map((agent) => {
                      const agentActivityCount = activities.filter(
                        (a) => a.userId === agent.id,
                      ).length;
                      return (
                        <div
                          key={agent.id}
                          onClick={() => setSelectedAgentId(agent.id)}
                          className="rounded-xl bg-white border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer group mb-4"
                        >
                          <div className="px-5 py-3.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {getAgentAvatar(agent.name, 24)}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-semibold text-stone-900 tracking-tight group-hover:text-stone-700 transition-colors">
                                      {agent.name}
                                    </h2>
                                    <span
                                      className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${agent.connected ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400"}`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${agent.connected ? "bg-emerald-500" : "bg-stone-300"}`}
                                      />
                                      {agent.connected
                                        ? lang === "zh"
                                          ? "已连接"
                                          : "Connected"
                                        : lang === "zh"
                                          ? "未连接"
                                          : "Disconnected"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <p className="text-[11px] text-stone-400">
                                      {t("agent.globalAccount")}
                                    </p>
                                    <span className="text-[11px] text-stone-300">
                                      ·
                                    </span>
                                    <p className="text-[11px] text-stone-400 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {new Date(
                                        agent.createdAt,
                                      ).toLocaleDateString(
                                        lang === "zh" ? "zh-CN" : "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        },
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                                  <ActivityIcon className="w-3 h-3" />
                                  {agentActivityCount} {t("agent.activities")}
                                </span>
                                <div className="relative">
                                  <button
                                    className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 transition-colors opacity-0 group-hover:opacity-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAgentListMenuOpen(
                                        agentListMenuOpen === agent.id
                                          ? null
                                          : agent.id,
                                      );
                                    }}
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                  {agentListMenuOpen === agent.id && (
                                    <>
                                      <div
                                        className="fixed inset-0 z-10"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setAgentListMenuOpen(null);
                                        }}
                                      />
                                      <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setAgentListMenuOpen(null);
                                          }}
                                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                        >
                                          <Shield className="w-4 h-4 text-stone-400" />
                                          Manage Permissions
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setAgentListMenuOpen(null);
                                          }}
                                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                                        >
                                          <StopCircle className="w-4 h-4 text-stone-400" />
                                          Stop Sync
                                        </button>
                                        <div className="border-t border-stone-100 my-0.5" />
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setAgentListMenuOpen(null);
                                            setAgents((prev) =>
                                              prev.filter(
                                                (a) => a.id !== agent.id,
                                              ),
                                            );
                                            fetch(`/api/agents?id=${agent.id}`, { method: "DELETE" }).catch(() => {});
                                          }}
                                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4 text-red-400" />
                                          Delete
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 border border-stone-200 border-dashed rounded-lg">
                      <p className="text-sm font-medium text-stone-900 mb-1">
                        {lang === "zh"
                          ? "暂无可配置的 Agent"
                          : "No Agents Available"}
                      </p>
                      <p className="text-xs text-stone-500">
                        {lang === "zh"
                          ? "您可以随时创建一个新的私人助理"
                          : "Create a new personal assistant anytime"}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Storage Capacity Bar */}
              <div
                id="section-storage"
                className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 mb-6"
              >
                {(() => {
                  const totalCapacityBytes = 2 * 1024 * 1024 * 1024; // 2GB in bytes
                  const usedBytes = documents.reduce(
                    (sum, doc) => sum + doc.size,
                    0,
                  );
                  const usedPercentage = (usedBytes / totalCapacityBytes) * 100;

                  const formatSize = (bytes: number) => {
                    if (bytes >= 1024 * 1024 * 1024) {
                      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
                    } else if (bytes >= 1024 * 1024) {
                      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
                    } else if (bytes >= 1024) {
                      return `${(bytes / 1024).toFixed(2)} KB`;
                    }
                    return `${bytes} B`;
                  };

                  return (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-stone-900">
                          账号容量
                        </h3>
                        <span className="text-sm text-stone-600">
                          {formatSize(usedBytes)} /{" "}
                          {formatSize(totalCapacityBytes)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          initial={{ width: 0 }}
                          animate={{ width: `${usedPercentage}%` }}
                          transition={{
                            duration: 0.6,
                            ease: "easeOut",
                          }}
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        />
                      </div>

                      <p className="text-xs text-stone-500 mt-2">
                        已使用 {usedPercentage.toFixed(1)}%，共{" "}
                        {documents.length} 个文档
                      </p>
                    </>
                  );
                })()}
              </div>

              {/* Demo Mode Switcher */}
              <div
                id="section-demo"
                className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 mb-6"
              >
                <h3 className="text-sm font-semibold text-stone-900 mb-1">
                  {lang === "zh" ? "演示模式" : "Demo Mode"}
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  {lang === "zh"
                    ? "切换新用户（空数据 + 引导流程）或老用户（丰富数据 + 产品功能）模式。切换后页面将刷新。"
                    : "Switch between new user (empty data + onboarding guide) or existing user (rich data + full features). Page will refresh."}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {/* New User Card */}
                  <button
                    onClick={() => {
                      if (demoMode !== "new") setDemoMode("new");
                    }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      demoMode === "new"
                        ? "border-stone-900 bg-stone-50 shadow-sm"
                        : "border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
                    }`}
                  >
                    {demoMode === "new" && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-sm font-semibold text-stone-900 mb-1">
                      {lang === "zh" ? "🆕 新用户" : "🆕 New User"}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      {lang === "zh"
                        ? "空白状态 + Quick Start 引导 + Onboarding 向导，展示新用户首次使用体验"
                        : "Clean slate + Quick Start guide + Onboarding wizard for first-use experience"}
                    </p>
                  </button>
                  {/* Existing User Card */}
                  <button
                    onClick={() => {
                      if (demoMode !== "existing") setDemoMode("existing");
                    }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      demoMode === "existing"
                        ? "border-stone-900 bg-stone-50 shadow-sm"
                        : "border-stone-200 hover:border-stone-300 hover:bg-stone-50/50"
                    }`}
                  >
                    {demoMode === "existing" && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                      <FileText className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-sm font-semibold text-stone-900 mb-1">
                      {lang === "zh" ? "👤 老用户" : "👤 Existing User"}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      {lang === "zh"
                        ? "丰富数据，包含 25 个文档、30+ 动态、3 个 Agent，展示完整产品功能"
                        : "Rich data — 25 docs, 30+ activities, 3 agents to showcase full product"}
                    </p>
                  </button>
                </div>
              </div>

              {/* Shared Document Preview Entry */}
              <div
                id="section-share"
                className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 mb-6"
              >
                <h3 className="text-sm font-semibold text-stone-900 mb-1">
                  {lang === "zh" ? "分享预览" : "Share Preview"}
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  {lang === "zh"
                    ? "预览被分享人打开文档链接时看到的只读页面。包含 MindX 品牌推广和用户引导。"
                    : "Preview the read-only page a shared link recipient sees. Includes MindX branding & CTA."}
                </p>
                <button
                  onClick={() => window.open("/shared", "_blank")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-stone-800 to-stone-900 text-white rounded-xl text-sm font-medium hover:from-stone-700 hover:to-stone-800 transition-all shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  {lang === "zh"
                    ? "打开分享文档预览"
                    : "Open Shared Document Preview"}
                </button>
              </div>

              {/* Extraction Agent Model Config */}
              <div
                id="section-extraction"
                className="bg-white border border-stone-200/80 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 mb-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-sm shadow-violet-500/20">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                      {lang === "zh"
                        ? "萃取 Agent 模型配置"
                        : "Extraction Agent Config"}
                      <span
                        className={`inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full ${extractionApiKey ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${extractionApiKey ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                        {extractionApiKey
                          ? lang === "zh"
                            ? "已配置"
                            : "Ready"
                          : lang === "zh"
                            ? "待配置"
                            : "Not set"}
                      </span>
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {lang === "zh"
                        ? "配置用于萃取原始文档信息的大模型"
                        : "Configure the LLM used for raw data extraction"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Model */}
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1.5 block">
                      {lang === "zh" ? "模型" : "Model"}
                    </label>
                    <select
                      value={extractionModel}
                      onChange={(e) => setExtractionModel(e.target.value)}
                      className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors bg-white cursor-pointer"
                    >
                      <optgroup label="OpenAI">
                        <option value="gpt-5.4">GPT-5.4</option>
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                        <option value="o3-mini">o3-mini</option>
                      </optgroup>
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
                          : "Enter API key for selected model..."
                      }
                      className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">
                      {lang === "zh"
                        ? "API Key 仅存储在浏览器本地，不会上传到服务器"
                        : "Stored locally in your browser only, never sent to our servers"}
                    </p>
                  </div>

                  {/* Base URL */}
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
                          : "Custom endpoint, leave empty for official default"
                      }
                      className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-colors"
                    />
                  </div>


                  {/* Save */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="bg-violet-50/60 rounded-lg px-3 py-2 border border-violet-100 flex-1 mr-4">
                      <p className="text-[10px] text-violet-600">
                        {lang === "zh"
                          ? "💡 萃取 Agent 会从原始文档中提取关键事实、识别洞察模式、生成结构化知识条目并更新记忆库。"
                          : "💡 Extracts key facts, identifies patterns, generates knowledge entries & updates memory."}
                      </p>
                    </div>
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
                      }}
                      className="px-5 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors shrink-0"
                    >
                      {lang === "zh" ? "保存" : "Save"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={() => {
                  localStorage.removeItem("mindx_logged_in");
                  window.location.href = "/";
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {lang === "zh" ? "退出登录" : "Sign Out"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
