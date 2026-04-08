import React from "react";
import { motion } from "motion/react";
import {
  FileText,
  Database,
  CalendarDays,
  ChevronDown,
  Check,
  Copy,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { activeWorkspaceIdGlobal } from "./constants";

interface Agent {
  id: string;
  name: string;
  token: string;
  connected: boolean;
  createdAt: string;
  installedSkills?: string[];
}

export interface SkillsTabProps {
  selectedSkillId: string | null;
  setSelectedSkillId: (v: string | null) => void;
  copiedStates: Record<string, boolean>;
  setCopiedStates: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
}

export default function SkillsTab({
  selectedSkillId,
  setSelectedSkillId,
  copiedStates,
  setCopiedStates,
  agents,
  setAgents,
}: SkillsTabProps) {
  const { t, lang } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Skill List */}
      <div className="border border-stone-200/80 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden divide-y divide-stone-200/50">
        {[
          {
            id: "mindx-docs",
            name: "MindX Docs",
            tag: "Core",
            icon: <FileText className="w-4 h-4" />,
            provider: "MindX",
            desc: lang === "zh" ? "文档读写 Skill" : "Document read/write",
          },
          {
            id: "memory-io",
            name: "MindX Memory",
            tag: "Core",
            icon: <Database className="w-4 h-4" />,
            provider: "MindX",
            desc:
              lang === "zh" ? "读写记忆的 Skill" : "Read/write memory engine",
          },
          {
            id: "daily-log",
            name: "Daily Update",
            tag: "Pro",
            icon: <CalendarDays className="w-4 h-4" />,
            provider: "MindX",
            desc:
              lang === "zh" ? "上传今天做了啥的 Skill" : "Daily upload skill",
          },
        ].map((skill, i, arr) => (
          <div key={skill.id}>
            <div
              onClick={() =>
                setSelectedSkillId(
                  selectedSkillId === skill.id ? null : skill.id,
                )
              }
              className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all ${
                selectedSkillId === skill.id
                  ? "bg-stone-50"
                  : "hover:bg-stone-50/50"
              } `}
            >
              <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white shrink-0">
                {skill.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-stone-900">
                    {skill.name}
                  </span>
                  <span className="text-[9px] font-bold text-stone-400 uppercase bg-stone-100 px-1.5 py-0.5 rounded">
                    {skill.tag}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">{skill.desc}</p>
              </div>
              <span className="text-[11px] text-stone-400 shrink-0">
                {lang === "zh" ? "提供方" : "by"} {skill.provider}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${selectedSkillId === skill.id ? "rotate-180" : ""}`}
              />
            </div>
            {/* Inline detail for MindX Docs */}
            {selectedSkillId === skill.id && skill.id === "mindx-docs" && (
              <div
                className="border-t border-stone-100 bg-white"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 pb-5">
                  <p className="text-sm text-stone-500 leading-relaxed mb-4">
                    {lang === "zh"
                      ? "让你的 AI Agent 拥有文档读写能力。Agent 可以通过 API 在 MindX 文档列表中创建、查询、更新和删除文档。"
                      : "Give your AI Agent document read/write capabilities. Create, query, update and delete documents in MindX via API."}
                  </p>
                  <div className="grid md:grid-cols-2 gap-1.5">
                    {(lang === "zh"
                      ? [
                          "创建 Markdown 文档到文档列表",
                          "查询所有文档及内容",
                          "更新已有文档内容",
                          "删除不需要的文档",
                        ]
                      : [
                          "Create Markdown docs to document list",
                          "Query all documents & content",
                          "Update existing document content",
                          "Delete unwanted documents",
                        ]
                    ).map((cap, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 text-sm text-stone-600"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {cap}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-stone-100 p-6 space-y-6">
                  {/* Step 1 */}
                  <div className="relative pl-10">
                    <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0">
                      <div className="flex-1 border-l border-dashed border-stone-300" />
                      <svg
                        className="w-2.5 h-2.5 text-stone-300 shrink-0"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M1 3L5 7L9 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">
                      1
                    </div>
                    <h4 className="text-sm font-bold text-stone-800 mb-2">
                      {lang === "zh" ? "安装命令" : "Install Command"}
                    </h4>
                    <p className="text-xs text-stone-500 mb-3">
                      💡{" "}
                      {lang === "zh"
                        ? "复制粘贴到 Agent 对话中即可自动安装。"
                        : "Copy and paste into your Agent chat to auto-install."}
                    </p>
                    <div className="relative">
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 pr-24 text-sm font-mono text-stone-700 leading-relaxed overflow-x-auto whitespace-pre-wrap">{`Install the MindX Docs skill. API endpoints:\n- GET https://mindx-ux.vercel.app/api/documents?workspace_id=${activeWorkspaceIdGlobal} (list all documents)\n- POST https://mindx-ux.vercel.app/api/documents (create document, body: {workspace_id: "${activeWorkspaceIdGlobal}", name, type, content, creator_name, creator_type})\n- PUT https://mindx-ux.vercel.app/api/documents (update document, body: {id, name?, content?})\n- DELETE https://mindx-ux.vercel.app/api/documents?id=uuid (delete document)`}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            `Install the MindX Docs skill. API endpoints:\n- GET https://mindx-ux.vercel.app/api/documents?workspace_id=${activeWorkspaceIdGlobal} (list all documents)\n- POST https://mindx-ux.vercel.app/api/documents (create document, body: {workspace_id: "${activeWorkspaceIdGlobal}", name, type, content, creator_name, creator_type})\n- PUT https://mindx-ux.vercel.app/api/documents (update document, body: {id, name?, content?})\n- DELETE https://mindx-ux.vercel.app/api/documents?id=uuid (delete document)`,
                          );
                          setCopiedStates((prev) => ({
                            ...prev,
                            skillInstall: true,
                          }));
                          setTimeout(
                            () =>
                              setCopiedStates((prev) => ({
                                ...prev,
                                skillInstall: false,
                              })),
                            2000,
                          );
                        }}
                        className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm"
                      >
                        {copiedStates["skillInstall"] ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            {lang === "zh" ? "已复制" : "Copied"}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            {lang === "zh" ? "复制" : "Copy"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="relative pl-10">
                    <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0">
                      <div className="flex-1 border-l border-dashed border-stone-300" />
                      <svg
                        className="w-2.5 h-2.5 text-stone-300 shrink-0"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M1 3L5 7L9 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">
                      2
                    </div>
                    <h4 className="text-sm font-bold text-stone-800 mb-2">
                      {lang === "zh"
                        ? "Agent 完成安装"
                        : "Agent Completes Installation"}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {lang === "zh"
                        ? "💡 Agent 会自动创建 Skill 配置并记住 API 端点。之后在任何对话中都可以读写你的 MindX 文档。"
                        : "💡 Agent will auto-configure the Skill and remember API endpoints. Then read/write your MindX documents from any conversation."}
                    </p>
                  </div>
                  {/* Step 3 */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">
                      3
                    </div>
                    <h4 className="text-sm font-bold text-stone-800 mb-2">
                      {lang === "zh" ? "使用 Skill" : "Use Skill"}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed mb-3">
                      💡{" "}
                      {lang === "zh"
                        ? "安装成功后，你可以让 Agent 创建文档、查询文档列表、更新内容。"
                        : "After installation, ask your Agent to create docs, query list, or update content."}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                        <span className="text-xs font-bold text-stone-800 shrink-0">
                          {lang === "zh" ? "创建文档" : "Create"}
                        </span>
                        <span className="text-xs text-stone-500">—</span>
                        <span className="text-xs text-stone-600">
                          {lang === "zh"
                            ? '"帮我写一份竞品分析报告，保存到 MindX"'
                            : '"Write a competitor analysis and save to MindX"'}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                        <span className="text-xs font-bold text-stone-800 shrink-0">
                          {lang === "zh" ? "查询文档" : "Query"}
                        </span>
                        <span className="text-xs text-stone-500">—</span>
                        <span className="text-xs text-stone-600">
                          {lang === "zh"
                            ? '"列出我 MindX 里的所有文档"'
                            : '"List all my MindX documents"'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Inline detail for Daily Update */}
            {selectedSkillId === skill.id && skill.id === "daily-log" && (
              <div
                className="border-t border-stone-100 bg-white"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 pb-5">
                  <p className="text-sm text-stone-500 leading-relaxed mb-4">
                    {lang === "zh"
                      ? "让你的 AI Agent 在每天工作结束后，自动将当日完成的任务和重要事项上传到 MindX Memory，作为原始数据素材供后续提炼。"
                      : "Let your AI Agent automatically upload daily work summaries to MindX Memory as raw data for future insight extraction."}
                  </p>
                  <div className="grid md:grid-cols-2 gap-1.5">
                    {(lang === "zh"
                      ? [
                          "自动汇总当天完成的工作",
                          "生成结构化日报文档",
                          "上传至 MindX Memory 原始数据",
                          "记录活动日志供追溯",
                        ]
                      : [
                          "Auto-summarize daily work",
                          "Generate structured daily reports",
                          "Upload to MindX Memory raw data",
                          "Activity log for audit trail",
                        ]
                    ).map((cap, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 text-sm text-stone-600"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {cap}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-stone-100 p-6 space-y-6">
                  {/* Step 1 */}
                  <div className="relative pl-10">
                    <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0">
                      <div className="flex-1 border-l border-dashed border-stone-300" />
                      <svg
                        className="w-2.5 h-2.5 text-stone-300 shrink-0"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M1 3L5 7L9 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">
                      1
                    </div>
                    <h4 className="text-sm font-bold text-stone-800 mb-2">
                      {lang === "zh" ? "安装命令" : "Install Command"}
                    </h4>
                    <p className="text-xs text-stone-500 mb-3">
                      💡{" "}
                      {lang === "zh"
                        ? "复制以下命令粘贴到 Agent 对话中，Agent 会自动安装此 Skill。"
                        : "Copy the command below and paste it into your Agent chat."}
                    </p>
                    <div className="relative">
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 pr-24 text-sm font-mono text-stone-700 leading-relaxed overflow-x-auto whitespace-pre-wrap">{`Install the MindX Daily Update skill from https://mindx-ux.vercel.app/skills/daily-activity. API endpoint: https://mindx-ux.vercel.app/api/documents (POST to upload daily reports) and https://mindx-ux.vercel.app/api/activities (POST to log activities). Workspace ID: w1.`}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            `Install the MindX Daily Update skill from https://mindx-ux.vercel.app/skills/daily-activity. API endpoint: https://mindx-ux.vercel.app/api/documents (POST to upload daily reports) and https://mindx-ux.vercel.app/api/activities (POST to log activities). Workspace ID: w1.`,
                          );
                          setCopiedStates((prev) => ({
                            ...prev,
                            dailyInstall: true,
                          }));
                          setTimeout(
                            () =>
                              setCopiedStates((prev) => ({
                                ...prev,
                                dailyInstall: false,
                              })),
                            2000,
                          );
                        }}
                        className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm"
                      >
                        {copiedStates["dailyInstall"] ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            {lang === "zh" ? "已复制" : "Copied"}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            {lang === "zh" ? "复制" : "Copy"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="relative pl-10">
                    <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0">
                      <div className="flex-1 border-l border-dashed border-stone-300" />
                      <svg
                        className="w-2.5 h-2.5 text-stone-300 shrink-0"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M1 3L5 7L9 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">
                      2
                    </div>
                    <h4 className="text-sm font-bold text-stone-800 mb-2">
                      {lang === "zh"
                        ? "Agent 完成安装"
                        : "Agent Completes Installation"}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {lang === "zh"
                        ? "💡 Agent 收到指令后，会自动创建对应的 Skill 配置文件并记住 API 端点地址。"
                        : "💡 Agent will auto-create the Skill config and remember the API endpoints."}
                    </p>
                  </div>
                  {/* Step 3 */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">
                      3
                    </div>
                    <h4 className="text-sm font-bold text-stone-800 mb-2">
                      {lang === "zh" ? "使用 Skill" : "Use Skill"}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed mb-3">
                      💡{" "}
                      {lang === "zh"
                        ? '每天工作结束时，对 Agent 说"上传今天的工作"即可自动生成日报并上传。'
                        : 'Say "upload today\'s work" at end of day to auto-generate and upload daily report.'}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                        <span className="text-xs font-bold text-stone-800 shrink-0">
                          {lang === "zh" ? "触发词" : "Triggers"}
                        </span>
                        <span className="text-xs text-stone-500">—</span>
                        <span className="text-xs text-stone-600">
                          {lang === "zh"
                            ? '"上传今天的工作"、"记录今天做的事"、"提交 daily activity"'
                            : '"upload today\'s work", "log daily activity", "submit daily report"'}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                        <span className="text-xs font-bold text-stone-800 shrink-0">
                          {lang === "zh" ? "日报格式" : "Format"}
                        </span>
                        <span className="text-xs text-stone-500">—</span>
                        <span className="text-xs text-stone-600">
                          {lang === "zh"
                            ? "核心成果 → 详细工作 → 修复优化 → 待跟进"
                            : "Key Results → Details → Fixes → Follow-ups"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Inline detail for MindX Memory */}
            {selectedSkillId === skill.id && skill.id === "memory-io" && (
              <div
                className="border-t border-stone-100 bg-white"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 pb-5">
                  <p className="text-sm text-stone-500 leading-relaxed mb-4">
                    {lang === "zh"
                      ? "让你的 AI Agent 拥有持久记忆能力。读写用户画像（Who am I）、当前目标（Goal）、知识库原始数据和已提炼洞察。"
                      : "Give your AI Agent persistent memory. Read/write user profile (Who am I), goals, knowledge base raw data, and extracted insights."}
                  </p>
                  <div className="grid md:grid-cols-2 gap-1.5">
                    {(lang === "zh"
                      ? [
                          "读写用户身份画像 (Who am I)",
                          "读写当前目标 (Goal)",
                          "读写知识库原始数据",
                          "读写已提炼洞察 (Key Points)",
                        ]
                      : [
                          "Read/write user profile (Who am I)",
                          "Read/write current goals",
                          "Read/write knowledge base raw data",
                          "Read/write extracted insights",
                        ]
                    ).map((cap, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 text-sm text-stone-600"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {cap}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-stone-100 p-6 space-y-6">
                  {/* Step 1 */}
                  <div className="relative pl-10">
                    <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0">
                      <div className="flex-1 border-l border-dashed border-stone-300" />
                      <svg
                        className="w-2.5 h-2.5 text-stone-300 shrink-0"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M1 3L5 7L9 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">
                      1
                    </div>
                    <h4 className="text-sm font-bold text-stone-800 mb-2">
                      {lang === "zh" ? "安装命令" : "Install Command"}
                    </h4>
                    <p className="text-xs text-stone-500 mb-3">
                      💡{" "}
                      {lang === "zh"
                        ? "复制粘贴到 Agent 对话中即可自动安装。"
                        : "Copy and paste into your Agent chat to auto-install."}
                    </p>
                    <div className="relative">
                      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 pr-24 text-sm font-mono text-stone-700 leading-relaxed overflow-x-auto whitespace-pre-wrap">{`Install the MindX Memory skill. API endpoints:\n- GET/PUT https://mindx-ux.vercel.app/api/profile?workspace_id=${activeWorkspaceIdGlobal} (user profile: whoami, goal)\n- GET/POST/PUT/DELETE https://mindx-ux.vercel.app/api/rawdata?workspace_id=${activeWorkspaceIdGlobal} (knowledge base raw data)\n- GET/POST/DELETE https://mindx-ux.vercel.app/api/keypoints?workspace_id=${activeWorkspaceIdGlobal} (extracted insights)\n- GET/POST https://mindx-ux.vercel.app/api/activities?workspace_id=${activeWorkspaceIdGlobal} (activity logs)`}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            `Install the MindX Memory skill. API endpoints:\n- GET/PUT https://mindx-ux.vercel.app/api/profile?workspace_id=${activeWorkspaceIdGlobal} (user profile: whoami, goal)\n- GET/POST/PUT/DELETE https://mindx-ux.vercel.app/api/rawdata?workspace_id=${activeWorkspaceIdGlobal} (knowledge base raw data)\n- GET/POST/DELETE https://mindx-ux.vercel.app/api/keypoints?workspace_id=${activeWorkspaceIdGlobal} (extracted insights)\n- GET/POST https://mindx-ux.vercel.app/api/activities?workspace_id=${activeWorkspaceIdGlobal} (activity logs)`,
                          );
                          setCopiedStates((prev) => ({
                            ...prev,
                            memoryInstall: true,
                          }));
                          setTimeout(
                            () =>
                              setCopiedStates((prev) => ({
                                ...prev,
                                memoryInstall: false,
                              })),
                            2000,
                          );
                        }}
                        className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm"
                      >
                        {copiedStates["memoryInstall"] ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            {lang === "zh" ? "已复制" : "Copied"}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            {lang === "zh" ? "复制" : "Copy"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="relative pl-10">
                    <div className="absolute left-[11px] top-8 -bottom-6 flex flex-col items-center w-0">
                      <div className="flex-1 border-l border-dashed border-stone-300" />
                      <svg
                        className="w-2.5 h-2.5 text-stone-300 shrink-0"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M1 3L5 7L9 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">
                      2
                    </div>
                    <h4 className="text-sm font-bold text-stone-800 mb-2">
                      {lang === "zh"
                        ? "Agent 完成安装"
                        : "Agent Completes Installation"}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {lang === "zh"
                        ? "💡 Agent 会自动创建 Skill 配置并记住 API 端点。之后在任何对话中都可以读写你的 MindX 记忆。"
                        : "💡 Agent auto-creates config and remembers endpoints. Can read/write MindX memory in any conversation."}
                    </p>
                  </div>
                  {/* Step 3 */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-md border border-stone-300 bg-stone-50 flex items-center justify-center text-stone-700 text-[10px] font-bold">
                      3
                    </div>
                    <h4 className="text-sm font-bold text-stone-800 mb-2">
                      {lang === "zh" ? "使用 Skill" : "Use Skill"}
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed mb-3">
                      💡{" "}
                      {lang === "zh"
                        ? "Agent 会在需要时自动调用 MindX 记忆接口，也可以主动触发。"
                        : "Agent auto-calls MindX memory API when needed, or trigger manually."}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                        <span className="text-xs font-bold text-stone-800 shrink-0">
                          {lang === "zh" ? "读记忆" : "Read"}
                        </span>
                        <span className="text-xs text-stone-500">—</span>
                        <span className="text-xs text-stone-600">
                          {lang === "zh"
                            ? '"读一下我的记忆"、"我的目标是什么"、"查看我的画像"'
                            : '"read my memory", "what are my goals", "show my profile"'}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/60">
                        <span className="text-xs font-bold text-stone-800 shrink-0">
                          {lang === "zh" ? "写记忆" : "Write"}
                        </span>
                        <span className="text-xs text-stone-500">—</span>
                        <span className="text-xs text-stone-600">
                          {lang === "zh"
                            ? '"更新我的目标为 XXX"、"记住我是 XXX"'
                            : '"update my goal to XXX", "remember I am XXX"'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Inline Coming Soon for other skills */}
            {selectedSkillId === skill.id &&
              !["mindx-docs", "daily-log", "memory-io"].includes(skill.id) && (
                <div className="bg-stone-50/50 p-8 text-center">
                  <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <h3 className="text-sm font-semibold text-stone-900 mb-1">
                    {lang === "zh" ? "即将上线" : "Coming Soon"}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {lang === "zh"
                      ? "该 Skill 正在开发中，敬请期待。"
                      : "This Skill is under development. Stay tuned."}
                  </p>
                </div>
              )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
