/**
 * Inbox Smart Sheet mock data
 * A global unique Smart Sheet that renders all raw/unprocessed data items
 */
import type { SheetData } from "../types/sheet";

export const inboxSheet: SheetData = {
  id: "inbox-sheet",
  name: "Inbox",
  columns: [
    { id: "col-title", name: "标题", type: "text" },
    { id: "col-source", name: "来源", type: "text" },
    { id: "col-type", name: "类型", type: "text" },
    {
      id: "col-status",
      name: "状态",
      type: "status",
      statusOptions: [
        { label: "待处理", color: "#f59e0b" },
        { label: "处理中", color: "#3b82f6" },
        { label: "已提炼", color: "#10b981" },
        { label: "已归档", color: "#9ca3af" },
      ],
    },
    { id: "col-date", name: "日期", type: "date" },
    { id: "col-tags", name: "标签", type: "text" },
    { id: "col-summary", name: "摘要", type: "text" },
  ],
  rows: [
    {
      id: "inbox-1",
      cells: {
        "col-title": "用户信任研究原始访谈摘录",
        "col-source": "手动录入",
        "col-type": "Markdown",
        "col-status": "已提炼",
        "col-date": "2026-04-09",
        "col-tags": "trust, research, memory",
        "col-summary": "手动上传的访谈摘要，作为 Memory 信任判断的原始证据。",
      },
    },
    {
      id: "inbox-2",
      cells: {
        "col-title": "飞书妙记：03/24 产品同步",
        "col-source": "第三方插件",
        "col-type": "Meeting Transcript",
        "col-status": "处理中",
        "col-date": "2026-04-09",
        "col-tags": "meeting, product, sync",
        "col-summary":
          "从会议转写同步进来的聊天记录，用于提炼产品判断与开放问题。",
      },
    },
    {
      id: "inbox-3",
      cells: {
        "col-title": "网页剪存：Memory 产品案例",
        "col-source": "网页剪藏",
        "col-type": "Web Clip",
        "col-status": "已提炼",
        "col-date": "2026-04-08",
        "col-tags": "web-clip, case-study",
        "col-summary":
          "从外部网页保存下来的案例资料，作为设计 Memory 结构的参考素材。",
      },
    },
    {
      id: "inbox-4",
      cells: {
        "col-title": "腾讯文档同步：产品周报",
        "col-source": "云端同步",
        "col-type": "Tencent Docs",
        "col-status": "处理中",
        "col-date": "2026-04-09",
        "col-tags": "weekly-report, cloud-sync",
        "col-summary":
          "从云端协作文档接入的周报数据，作为最近工作线索与候选记忆来源。",
      },
    },
    {
      id: "inbox-5",
      cells: {
        "col-title": "Goldman Sachs 降息预测报告",
        "col-source": "网页剪藏",
        "col-type": "PDF",
        "col-status": "待处理",
        "col-date": "2026-04-08",
        "col-tags": "macro, rate-cut, research",
        "col-summary":
          "高盛降息预测报告，AI 提取关键实体：降息 75-100bp，现金配置调整。",
      },
    },
    {
      id: "inbox-6",
      cells: {
        "col-title": "A16Z State of Crypto 2026",
        "col-source": "网页剪藏",
        "col-type": "Web Clip",
        "col-status": "待处理",
        "col-date": "2026-03-28",
        "col-tags": "crypto, defi, research",
        "col-summary":
          "A16Z 加密行业年度报告，DeFi TVL $200B，Lido 32% 市场份额。",
      },
    },
    {
      id: "inbox-7",
      cells: {
        "col-title": "与 Claude 的产品讨论记录",
        "col-source": "聊天记录",
        "col-type": "Chat Log",
        "col-status": "已归档",
        "col-date": "2026-04-07",
        "col-tags": "product, discussion, memory",
        "col-summary": "关于 Memory 模块边界和 Knowledge 归属的讨论记录。",
      },
    },
    {
      id: "inbox-8",
      cells: {
        "col-title": "供应链风险评估原始数据",
        "col-source": "手动录入",
        "col-type": "Markdown",
        "col-status": "待处理",
        "col-date": "2026-04-06",
        "col-tags": "supply-chain, risk, raw-data",
        "col-summary": "华东区环保政策收紧对陶瓷窑炉产能的影响评估原始数据。",
      },
    },
  ],
};
