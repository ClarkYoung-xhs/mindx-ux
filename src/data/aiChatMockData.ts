import type { SheetRow } from "../types/sheet";
import { BlockType } from "../types/block";

/**
 * Reply segment — either plain text or a clickable link.
 */
export interface ReplySegment {
  text: string;
  link?: string; // route path for navigation
}

/**
 * Chat preset definition — one per demo scenario.
 */
export interface ChatPreset {
  id: string;
  chipLabel: string; // short label shown on quick-action chip
  fullCommand: string; // full command text sent as user message
  matchKeywords: string[]; // if user input contains any keyword → match
  mockReply: ReplySegment[]; // segments composing the AI reply
  sideEffect?:
    | "createAnalysisReport"
    | "addCrmRow"
    | "updateAssetNav"
    | "createToBPage"
    | "createToCPage";
}

/**
 * Preset 1: Generate analysis report
 */
const analysisPreset: ChatPreset = {
  id: "preset-analysis",
  chipLabel: "分析库存与供应链风险",
  fullCommand: "分析当前库存状况和供应链风险",
  matchKeywords: ["分析库存", "库存", "供应链", "风险"],
  mockReply: [
    { text: "已为您生成库存与供应链分析报告，点击查看详细分析 → " },
    {
      text: "📊 库存与供应链分析报告-20250410",
      link: "/v2/doc/canvas-analysis-report",
    },
  ],
  sideEffect: "createAnalysisReport",
};

/**
 * Preset 2: Add new CRM customer
 */
const addCustomerPreset: ChatPreset = {
  id: "preset-add-customer",
  chipLabel: "新增客户：腾讯集团 shrekyan",
  fullCommand:
    "新增客户：腾讯集团 shrekyan，深圳南山区腾讯总部，主营企业定制礼品采购，年采购预算 500 万，对接人 Shrek Yan，联系方式 shrekyan@tencent.com",
  matchKeywords: ["新增客户", "腾讯", "shrekyan"],
  mockReply: [
    { text: "已将新客户「腾讯集团-shrekyan」添加到 B2B 客户档案与授信表 → " },
    {
      text: "📋 B2B 客户档案与授信表",
      link: "/v2/doc/sheet-crm",
    },
  ],
  sideEffect: "addCrmRow",
};

/**
 * Preset 3: Generate client portal Page
 */
const clientPortalPagePreset: ChatPreset = {
  id: "preset-client-portal-page",
  chipLabel: "生成经销商订货看板",
  fullCommand: "为华中区星巴克加盟商生成专属订货看板",
  matchKeywords: ["经销商", "订货看板", "星巴克", "门户", "看板"],
  mockReply: [
    {
      text: "已为您生成《华中区-星巴克加盟商订货看板》。该页面包含两个核心模块：\n\n",
    },
    {
      text: "**动态商品视图**（绑定全局库存表，已预设 SKU 过滤器和专属折扣 9 折）\n",
    },
    {
      text: "**履约进度视图**（绑定订单流水表，展示在途订单）\n\n",
    },
    {
      text: "点击查看 → ",
    },
    {
      text: "🌐 华中区-星巴克加盟商订货看板",
      link: "/v2/doc/page-tob-client-portal",
    },
    {
      text: "\n\n该页面可通过右上角「发布」按钮生成对外链接，嵌入企业微信的外部联系人画册或作为独立服务号菜单使用。经销商手机端打开后，库存和价格数据会基于 CRDT 协议实时同步。",
    },
  ],
  sideEffect: "createToBPage",
};

/**
 * All presets — order determines chip display order.
 */
export const chatPresets: ChatPreset[] = [
  analysisPreset,
  addCustomerPreset,
  clientPortalPagePreset,
];

/**
 * Default reply when no preset matches.
 */
export const defaultReply: ReplySegment[] = [
  { text: "这个功能正在开发中，敬请期待 🚀" },
];

/**
 * Match user input against presets.
 * Returns the first matching preset, or undefined.
 */
export function matchPreset(input: string): ChatPreset | undefined {
  const normalized = input.toLowerCase();
  return chatPresets.find((preset) =>
    preset.matchKeywords.some((kw) => normalized.includes(kw.toLowerCase())),
  );
}

// ---------------------------------------------------------------------------
// Shrekyan row data for CRM table
// ---------------------------------------------------------------------------

export const shrekyanRow: SheetRow = {
  id: "row-shrekyan",
  cells: {
    "crm-col-name": "腾讯集团-shrekyan",
    "crm-col-rating": "A 级",
    "crm-col-terms": "月结 45 天，基准价 95 折",
    "crm-col-complaint": "无异常",
    "crm-col-context": {
      targetId: "canvas-analysis-report",
      targetType: "canvas",
      displayText: "@库存与供应链分析报告",
    },
  },
  expandBlocks: [
    {
      id: "exp-sk-1",
      type: BlockType.Header,
      tokens: [["客户背景"]],
    },
    {
      id: "exp-sk-2",
      type: BlockType.Text,
      tokens: [
        ["腾讯集团企业采购部门，对接人 "],
        ["Shrek Yan", ["b"]],
        ["（采购负责人），办公地点位于 "],
        ["深圳南山区腾讯总部", ["b"]],
        [
          "。腾讯集团作为全球领先的互联网科技公司，每年在企业礼品和员工福利方面有大量采购需求。",
        ],
      ],
    },
    {
      id: "exp-sk-3",
      type: BlockType.Callout,
      tokens: [
        [
          "📧 联系方式：shrekyan@tencent.com | 年采购预算：500 万 | 客户评级：A 级（新客户默认）",
        ],
      ],
      icon: "📧",
      color: "#E3F2FD",
    },
    {
      id: "exp-sk-4",
      type: BlockType.SubHeader,
      tokens: [["采购需求描述"]],
    },
    {
      id: "exp-sk-5",
      type: BlockType.Text,
      tokens: [["主营企业定制礼品采购，覆盖以下场景："]],
    },
    {
      id: "exp-sk-6",
      type: BlockType.BulletedList,
      tokens: [
        ["企业定制礼品", ["b"]],
        ["：用于商务拜访、合作伙伴赠礼，需支持 LOGO 定制印刷"],
      ],
    },
    {
      id: "exp-sk-7",
      type: BlockType.BulletedList,
      tokens: [
        ["员工福利", ["b"]],
        ["：节日礼品、入职礼包、团建纪念品等，年需求量约 5,000-8,000 件"],
      ],
    },
    {
      id: "exp-sk-8",
      type: BlockType.BulletedList,
      tokens: [
        ["客户赠品", ["b"]],
        ["：腾讯云、企业微信等产品线的客户回馈礼品，要求品质高端、包装精美"],
      ],
    },
    {
      id: "exp-sk-9",
      type: BlockType.SubHeader,
      tokens: [["初始合作计划"]],
    },
    {
      id: "exp-sk-10",
      type: BlockType.Text,
      tokens: [
        ["试采阶段计划分 "],
        ["两批次", ["b"]],
        [" 推进，预计总金额约 ¥15 万："],
      ],
    },
    {
      id: "exp-sk-11",
      type: BlockType.NumberedList,
      tokens: [
        ["第一批（试样）："],
        [
          "经典款陶瓷马克杯",
          [["ref", "sheet-inventory", "sheet", "row-mug01"]],
        ],
        [" × 500 只（定制腾讯 LOGO），单价 ¥15/只，小计 ¥7,500"],
      ],
    },
    {
      id: "exp-sk-12",
      type: BlockType.NumberedList,
      tokens: [
        ["第二批（扩量）："],
        ["双层隔热玻璃杯", [["ref", "sheet-inventory", "sheet", "row-cup01"]]],
        [" × 300 只 + "],
        ["简约白瓷餐盘", [["ref", "sheet-inventory", "sheet", "row-plate01"]]],
        [" × 200 只，用于员工福利礼包"],
      ],
    },
    {
      id: "exp-sk-13",
      type: BlockType.Callout,
      tokens: [
        [
          "💡 报价方案：基准价 95 折，账期月结 45 天。首批试采满意后，预计 Q3 签订年度框架协议，年采购额目标 500 万。",
        ],
      ],
      icon: "💡",
      color: "#FFF8E1",
    },
  ],
};
