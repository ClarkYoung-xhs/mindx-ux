import type { ChatPreset, ReplySegment } from "./aiChatMockData";

/**
 * Preset 1: NVDA breaks target price alert
 */
const nvdaAlertPreset: ChatPreset = {
  id: "toc-preset-nvda-alert",
  chipLabel: "NVDA 击穿目标价预警",
  fullCommand: "NVDA 盘前大跌，触发目标价预警",
  matchKeywords: ["NVDA", "目标价", "预警", "盘前", "大跌"],
  mockReply: [
    {
      text: "🚨 **预警触发：NVDA 现价击穿 $850**\n\n我已沿着您的决策图谱完成推演：\n\n",
    },
    {
      text: "**1. 策略溯源**：依据您的 ",
    },
    {
      text: "📄 AI 赛道观察逻辑",
      link: "/document?id=toc-canvas-ai-sector&type=smartcanvas&from=v2-workspace",
    },
    {
      text: " 中的 NVDA 操作剧本，现价 < $850 触发「接针协议」。\n\n",
    },
    {
      text: "**2. 流动性测算**：已检查 ",
    },
    {
      text: "📊 Crypto 链上生息账簿",
      link: "/document?id=toc-sheet-defi-yield&type=smartsheet&from=v2-workspace",
    },
    {
      text: "，Aave USDC 当前存款 50,000 USDC，可即时提取。Lido stETH 20 ETH 退出需 1-3 天。\n\n",
    },
    {
      text: "**3. 安全校验**：教育信托基金底线未受影响（进度 68%，资金独立隔离）。\n\n",
    },
    {
      text: "**建议操作**：从 Aave 解除 50,000 USDC 质押，分 3 批在 $850 / $800 / $750 建仓 NVDA。是否立即生成草稿调仓单？",
    },
  ],
};

/**
 * Preset 2: Goldman Sachs rate cut report analysis
 */
const macroReportPreset: ChatPreset = {
  id: "toc-preset-macro-report",
  chipLabel: "高盛降息报告入库分析",
  fullCommand: "高盛降息路径报告已入库，分析影响",
  matchKeywords: ["高盛", "降息", "报告", "入库", "分析"],
  mockReply: [
    {
      text: "📋 **检测到高价值宏观报告入库**\n\n高盛降息路径预测报告已自动归档至 ",
    },
    {
      text: "📄 深度研究剪藏库",
      link: "/document?id=toc-canvas-alpha-clipper&type=smartcanvas&from=v2-workspace",
    },
    {
      text: "，AI 已提取关键实体并建立资产链接。\n\n",
    },
    {
      text: "**核心发现**：\n",
    },
    {
      text: "• 高盛预测 2026-H2 降息 75-100bp，流动性释放利好风险资产\n",
    },
    {
      text: "• 现金资产机会成本将上升，建议降低现金配比\n\n",
    },
    {
      text: "**结合您的 ",
    },
    {
      text: "📄 投资哲学",
      link: "/document?id=toc-canvas-investment-thesis&type=smartcanvas&from=v2-workspace",
    },
    {
      text: " 风险偏好分析**：\n",
    },
    {
      text: "您当前现金资产比例 **16.1%**，在降息周期中偏高（目标 10-20% 的上沿）。建议将 **5-8%** 的现金转入权益类或债券基金。\n\n",
    },
    {
      text: "是否需要模拟将 10% 现金转入权益类资产的收益变化？",
    },
  ],
};

/**
 * Preset 3: Crypto rebalance to USDC
 */
const cryptoRebalancePreset: ChatPreset = {
  id: "toc-preset-crypto-rebalance",
  chipLabel: "Crypto 调仓为 USDC",
  fullCommand: "将 Crypto 仓位的 20% 调仓为 USDC，更新总表",
  matchKeywords: ["调仓", "USDC", "Crypto", "更新总表"],
  mockReply: [
    {
      text: "✅ **调仓完毕**\n\n已通过 API 直接更新底层数据：\n\n",
    },
    {
      text: "**执行明细**：\n",
    },
    {
      text: "• Crypto 仓位减持 20%：BTC 0.5 枚 + ETH 6 枚 → 兑换为 USDC\n",
    },
    {
      text: "• 新增 USDC：约 $49,700\n",
    },
    {
      text: "• Crypto 权重：41.5% → 33.2%（回归目标区间 ✅）\n",
    },
    {
      text: "• 稳健资产占比已提升\n\n",
    },
    {
      text: "数据已同步更新至 ",
    },
    {
      text: "📊 全球资产配置总表",
      link: "/document?id=toc-sheet-asset-nav&type=smartsheet&from=v2-workspace",
    },
    {
      text: "。\n\n下一波动周期预警已设置，当 BTC 回调至 $58,000 时将自动提醒您评估回补时机。",
    },
  ],
  sideEffect: "updateAssetNav",
};

/**
 * Preset 4: Generate wealth dashboard Page
 */
const wealthDashboardPagePreset: ChatPreset = {
  id: "toc-preset-wealth-dashboard-page",
  chipLabel: "生成财富视图 Dashboard",
  fullCommand: "生成我的财富视图 Dashboard",
  matchKeywords: ["财富视图", "Dashboard", "控制中心", "Widget", "生成"],
  mockReply: [
    {
      text: "已为您生成《财富视图》。该页面嵌入两个核心 Block：\n\n",
    },
    {
      text: "**资产净值分布饼图**（绑定全球资产配置总表，实时展示 Equity / Crypto / Cash / Fund 各类别 NAV 占比）\n",
    },
    {
      text: "**下周续费提醒**（绑定高价值信息订阅账簿，筛选未来 7 天内到期的订阅）\n\n",
    },
    {
      text: "点击查看 → ",
    },
    {
      text: "🌐 财富视图",
      link: "/document?id=toc-page-wealth-dashboard&type=page&from=v2-workspace",
    },
    {
      text: "\n\n支持发布为手机桌面 Widget 或 PWA 轻应用。当持仓价格变动或记录新开销时，Widget 上的数据会基于 CRDT 协议静默刷新，保持毫秒级的全局数据一致性。",
    },
  ],
  sideEffect: "createToCPage",
};

/**
 * All toC presets — order determines chip display order.
 */
export const tocChatPresets: ChatPreset[] = [
  nvdaAlertPreset,
  macroReportPreset,
  cryptoRebalancePreset,
  wealthDashboardPagePreset,
];

/**
 * Default reply when no toC preset matches.
 */
export const tocDefaultReply: ReplySegment[] = [
  {
    text: "我是您的个人资产管理助手 WorkBuddy。您可以让我分析市场动态、管理投资组合或执行调仓指令。请尝试上方的快捷指令，或直接输入您的需求 🚀",
  },
];

/**
 * Match user input against toC presets.
 * Returns the first matching preset, or undefined.
 */
export function matchTocPreset(input: string): ChatPreset | undefined {
  const normalized = input.toLowerCase();
  return tocChatPresets.find((preset) =>
    preset.matchKeywords.some((kw) => normalized.includes(kw.toLowerCase())),
  );
}
