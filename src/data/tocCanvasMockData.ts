import type { Block } from "../types/block";
import { BlockType } from "../types/block";

/**
 * Document 1: Investment Thesis & Exit Strategy
 */
export const investmentThesisBlocks: Block[] = [
  {
    id: "it-b1",
    type: BlockType.Header,
    tokens: [["投资哲学与退出策略"]],
  },
  {
    id: "it-b1a",
    type: BlockType.Text,
    tokens: [
      ["标签: "],
      ["交易纪律", ["c"]],
      [", "],
      ["风控", ["c"]],
      [", "],
      ["长期主义", ["c"]],
      [" | 最后更新: 2026-04-01 | 作者: 本人"],
    ],
  },
  {
    id: "it-b2",
    type: BlockType.Callout,
    tokens: [
      [
        "📌 核心信条：市场永远比你聪明。纪律是唯一可控的变量。所有决策必须可回溯、可量化、可执行。",
      ],
    ],
    icon: "📌",
    color: "#E3F2FD",
  },
  {
    id: "it-b3",
    type: BlockType.SubHeader,
    tokens: [["一、投资哲学核心原则"]],
  },
  {
    id: "it-b4",
    type: BlockType.NumberedList,
    tokens: [
      ["资产配置优先于择时", ["b"]],
      [
        "：长期收益的 90% 来自资产配置，而非个股选择或市场择时。维持多资产类别分散化配置。",
      ],
    ],
  },
  {
    id: "it-b5",
    type: BlockType.NumberedList,
    tokens: [
      ["风险预算制", ["b"]],
      [
        "：每个资产类别设定最大权重上限。单一标的不超过总仓位的 20%，单一资产类别不超过 40%。",
      ],
    ],
  },
  {
    id: "it-b6",
    type: BlockType.NumberedList,
    tokens: [
      ["流动性优先", ["b"]],
      [
        "：任何时候保持至少 10% 的现金或现金等价物，确保 6 个月家庭支出的流动性安全垫。",
      ],
    ],
  },
  {
    id: "it-b7",
    type: BlockType.NumberedList,
    tokens: [
      ["逆向思维", ["b"]],
      [
        "：市场极度恐慌时是最佳建仓窗口。保持 Aave USDC 仓位作为「流动性弹药库」，随时准备接针。",
      ],
    ],
  },
  {
    id: "it-b8",
    type: BlockType.SubHeader,
    tokens: [["二、仓位管理纪律"]],
  },
  {
    id: "it-b9",
    type: BlockType.Text,
    tokens: [
      ["当前资产配置总览参见 "],
      ["@全球资产配置总表", [["ref", "toc-sheet-asset-nav", "sheet"]]],
      ["，以下为各类别的目标权重和调仓触发条件："],
    ],
  },
  {
    id: "it-b10",
    type: BlockType.BulletedList,
    tokens: [
      ["Equity（权益类）", ["b"]],
      ["：目标 30-35%，当前 33.2%（✅ 合规）。单一个股（如 "],
      ["@NASDAQ:NVDA", [["ref", "toc-sheet-watchlist", "sheet", "row-nvda"]]],
      ["）权重超过权益类的 50% 时触发减仓预警。"],
    ],
  },
  {
    id: "it-b11",
    type: BlockType.BulletedList,
    tokens: [
      ["Crypto（加密货币）", ["b"]],
      [
        "：目标 30-35%，当前 41.5%（⚠️ 超标）。需在下一波动周期减持 5-8% 转入稳健资产。",
      ],
    ],
  },
  {
    id: "it-b12",
    type: BlockType.BulletedList,
    tokens: [
      ["Cash（现金）", ["b"]],
      ["：目标 10-20%，当前 16.1%（✅ 合规）。低于 10% 时强制从收益中补充。"],
    ],
  },
  {
    id: "it-b13",
    type: BlockType.BulletedList,
    tokens: [
      ["Fund（基金）", ["b"]],
      ["：目标 10-15%，当前 9.2%（⚠️ 略低）。降息周期启动后增配至 15%。"],
    ],
  },
  {
    id: "it-b14",
    type: BlockType.SubHeader,
    tokens: [["三、退出策略规则"]],
  },
  {
    id: "it-b15",
    type: BlockType.Callout,
    tokens: [
      [
        "⚠️ 核心退出纪律：当核心资产溢价率超过 30% 时，触发 15% 的流动性锁定，转入 ",
      ],
      [
        "@6 岁阶段教育信托基金预留",
        [["ref", "toc-sheet-liquidity", "sheet", "row-edu-trust"]],
      ],
      ["。这是不可协商的硬性规则。"],
    ],
    icon: "⚠️",
    color: "#FFF3E0",
  },
  {
    id: "it-b16",
    type: BlockType.SubSubHeader,
    tokens: [["止盈规则"]],
  },
  {
    id: "it-b17",
    type: BlockType.NumberedList,
    tokens: [["单一标的浮盈超过 50%：减持 20%，锁定利润"]],
  },
  {
    id: "it-b18",
    type: BlockType.NumberedList,
    tokens: [
      ["单一标的浮盈超过 100%：减持至初始仓位的 50%，剩余为「免费仓位」"],
    ],
  },
  {
    id: "it-b19",
    type: BlockType.NumberedList,
    tokens: [
      [
        "组合整体年化收益超过 25%：触发全面再平衡，将超额收益分配至流动性规划表各项目",
      ],
    ],
  },
  {
    id: "it-b20",
    type: BlockType.SubSubHeader,
    tokens: [["止损规则"]],
  },
  {
    id: "it-b21",
    type: BlockType.NumberedList,
    tokens: [["单一标的浮亏超过 15%：触发审查，评估是否加仓或止损"]],
  },
  {
    id: "it-b22",
    type: BlockType.NumberedList,
    tokens: [["单一标的浮亏超过 25%：强制止损，不允许补仓"]],
  },
  {
    id: "it-b23",
    type: BlockType.NumberedList,
    tokens: [["组合整体回撤超过 15%：暂停所有新建仓，进入防御模式"]],
  },
  {
    id: "it-b24",
    type: BlockType.SubHeader,
    tokens: [["四、流动性锁定与家庭目标"]],
  },
  {
    id: "it-b25",
    type: BlockType.Text,
    tokens: [
      ["投资收益最终服务于家庭生活目标。以下为当前活跃的流动性锁定规则，详见 "],
      [
        "@家族大额资产与流动性规划表",
        [["ref", "toc-sheet-liquidity", "sheet"]],
      ],
      ["："],
    ],
  },
  {
    id: "it-b26",
    type: BlockType.BulletedList,
    tokens: [
      [
        "@教育信托基金",
        [["ref", "toc-sheet-liquidity", "sheet", "row-edu-trust"]],
      ],
      ["：核心资产溢价 > 30% 时自动锁定 15% 流动性转入，当前进度 68%"],
    ],
  },
  {
    id: "it-b27",
    type: BlockType.BulletedList,
    tokens: [
      [
        "@Porsche Cayenne 折旧储备",
        [["ref", "toc-sheet-liquidity", "sheet", "row-porsche"]],
      ],
      ["：每季度从投资收益划拨 ¥30,000，已到位"],
    ],
  },
  {
    id: "it-b28",
    type: BlockType.BulletedList,
    tokens: [
      [
        "@应急储备金",
        [["ref", "toc-sheet-liquidity", "sheet", "row-emergency"]],
      ],
      ["：维持 ¥180,000 水位，余额低于 ¥150,000 时自动补充"],
    ],
  },
  {
    id: "it-b29",
    type: BlockType.Divider,
    tokens: [],
  },
  {
    id: "it-b30",
    type: BlockType.SubHeader,
    tokens: [["附：资产配置总览"]],
  },
  {
    id: "it-b31",
    type: BlockType.EmbedSheet,
    tokens: [["全球资产配置总表"]],
    sheetId: "toc-sheet-asset-nav",
  },
];

/**
 * Document 2: AI Sector Secondary Market Observation Logic
 */
export const aiSectorBlocks: Block[] = [
  {
    id: "ai-b1",
    type: BlockType.Header,
    tokens: [["AI 赛道二级市场观察逻辑"]],
  },
  {
    id: "ai-b1a",
    type: BlockType.Text,
    tokens: [
      ["标签: "],
      ["AI 赛道", ["c"]],
      [", "],
      ["二级市场", ["c"]],
      [", "],
      ["交易策略", ["c"]],
      [" | 最后更新: 2026-04-05 | 作者: 本人"],
    ],
  },
  {
    id: "ai-b2",
    type: BlockType.Callout,
    tokens: [
      [
        "🧠 核心判断：大模型底座竞争趋同，Alpha 在于端侧推理和垂直应用。算力基础设施（NVDA）仍是确定性最高的标的，但估值已进入高位区间。",
      ],
    ],
    icon: "🧠",
    color: "#F3E5F5",
  },
  {
    id: "ai-b3",
    type: BlockType.SubHeader,
    tokens: [["一、赛道分析框架"]],
  },
  {
    id: "ai-b4",
    type: BlockType.SubSubHeader,
    tokens: [["1.1 算力层（Infrastructure）"]],
  },
  {
    id: "ai-b5",
    type: BlockType.Text,
    tokens: [
      ["核心标的："],
      ["@NASDAQ:NVDA", [["ref", "toc-sheet-watchlist", "sheet", "row-nvda"]]],
      ["。英伟达在 AI 训练芯片市场占有率超过 "],
      ["80%", ["b"]],
      ["，H100/H200 供不应求。但需警惕："],
    ],
  },
  {
    id: "ai-b6",
    type: BlockType.BulletedList,
    tokens: [["AMD MI300X 正在蚕食推理市场份额"]],
  },
  {
    id: "ai-b7",
    type: BlockType.BulletedList,
    tokens: [["Google TPU v5 和 AWS Trainium 的自研芯片威胁"]],
  },
  {
    id: "ai-b8",
    type: BlockType.BulletedList,
    tokens: [["中国市场出口管制导致的收入不确定性"]],
  },
  {
    id: "ai-b9",
    type: BlockType.SubSubHeader,
    tokens: [["1.2 模型层（Foundation Models）"]],
  },
  {
    id: "ai-b10",
    type: BlockType.Text,
    tokens: [
      ["OpenAI / Anthropic / Google 三强格局已定，模型能力趋同。"],
      ["不建议在模型层做重仓押注", ["b"]],
      ["，因为：竞争激烈导致定价权弱，烧钱速度快，盈利模式未验证。"],
    ],
  },
  {
    id: "ai-b11",
    type: BlockType.SubSubHeader,
    tokens: [["1.3 应用层（Vertical Applications）"]],
  },
  {
    id: "ai-b12",
    type: BlockType.Text,
    tokens: [
      [
        "真正的 Alpha 在应用层。关注方向：AI 编程助手（Cursor/GitHub Copilot）、AI 搜索（Perplexity）、AI 企业服务（Glean）。但多数为一级市场标的，二级市场可通过 ",
      ],
      ["@NASDAQ:QQQ", [["ref", "toc-sheet-watchlist", "sheet", "row-qqq-wl"]]],
      [" 间接配置。"],
    ],
  },
  {
    id: "ai-b13",
    type: BlockType.SubHeader,
    tokens: [["二、重点标的监控逻辑"]],
  },
  {
    id: "ai-b14",
    type: BlockType.Callout,
    tokens: [
      [
        "🎯 关键纪律：严密监控 @NASDAQ:NVDA，当其 API 传回的现价击穿目标价 $850 时，停止向 ",
      ],
      ["@Lido stETH", [["ref", "toc-sheet-defi-yield", "sheet", "row-lido"]]],
      [" 增加质押，抽出 20% 流动性准备接针。"],
    ],
    icon: "🎯",
    color: "#FFF3E0",
  },
  {
    id: "ai-b15",
    type: BlockType.SubSubHeader,
    tokens: [["NVDA 操作剧本"]],
  },
  {
    id: "ai-b16",
    type: BlockType.NumberedList,
    tokens: [
      ["现价 > $950（溢价 > 11.8%）", ["b"]],
      ["：维持现有仓位，不追高。考虑卖出 covered call 增强收益。"],
    ],
  },
  {
    id: "ai-b17",
    type: BlockType.NumberedList,
    tokens: [
      ["现价 $850-$950（目标价附近）", ["b"]],
      ["：密切关注，准备流动性。从 "],
      ["@Aave USDC", [["ref", "toc-sheet-defi-yield", "sheet", "row-aave"]]],
      [" 预提 $50,000 待命。"],
    ],
  },
  {
    id: "ai-b18",
    type: BlockType.NumberedList,
    tokens: [
      ["现价 < $850（击穿目标价）", ["b"]],
      ["：触发接针协议。分 3 批建仓：$850 / $800 / $750，每批 $20,000。"],
    ],
  },
  {
    id: "ai-b19",
    type: BlockType.NumberedList,
    tokens: [
      ["现价 < $700（极端恐慌）", ["b"]],
      ["：启动「全仓接针」模式，从 Crypto 仓位额外调拨 10% 流动性。"],
    ],
  },
  {
    id: "ai-b20",
    type: BlockType.SubSubHeader,
    tokens: [["BTC/ETH 联动逻辑"]],
  },
  {
    id: "ai-b21",
    type: BlockType.Text,
    tokens: [
      [
        "Crypto 市场与美股科技板块的相关性持续增强（90 日相关系数 0.72）。当 NVDA 大跌时，",
      ],
      ["@BTC/USDT", [["ref", "toc-sheet-watchlist", "sheet", "row-btc-wl"]]],
      [" 和 "],
      ["@ETH/USDT", [["ref", "toc-sheet-watchlist", "sheet", "row-eth-wl"]]],
      [" 大概率同步回调。此时应："],
    ],
  },
  {
    id: "ai-b22",
    type: BlockType.BulletedList,
    tokens: [["暂停所有 DeFi 新增质押"]],
  },
  {
    id: "ai-b23",
    type: BlockType.BulletedList,
    tokens: [["评估 stETH/ETH 锚定偏差，偏差 > 1% 时考虑退出 Lido 仓位"]],
  },
  {
    id: "ai-b24",
    type: BlockType.BulletedList,
    tokens: [["将 USDC 从 Aave 提取至冷钱包，等待抄底机会"]],
  },
  {
    id: "ai-b25",
    type: BlockType.Divider,
    tokens: [],
  },
  {
    id: "ai-b26",
    type: BlockType.SubHeader,
    tokens: [["三、关联数据"]],
  },
  {
    id: "ai-b27",
    type: BlockType.EmbedSheet,
    tokens: [["二级市场动态监控池"]],
    sheetId: "toc-sheet-watchlist",
  },
];

/**
 * Document 3: Alpha Clipper Vault — Deep Research Clippings
 */
export const alphaClipperBlocks: Block[] = [
  {
    id: "ac-b1",
    type: BlockType.Header,
    tokens: [["深度研究剪藏库"]],
  },
  {
    id: "ac-b1a",
    type: BlockType.Text,
    tokens: [
      ["标签: "],
      ["研报剪藏", ["c"]],
      [", "],
      ["宏观分析", ["c"]],
      [", "],
      ["Alpha 信号", ["c"]],
      [" | 自动更新 | AI 实体提取已启用"],
    ],
  },
  {
    id: "ac-b2",
    type: BlockType.Callout,
    tokens: [
      [
        "🤖 本文档由 WorkBuddy Agent 自动维护。每当通过浏览器剪藏插件摄入新研报时，Agent 会自动提取关键实体并建立与资产数据的双向链接。",
      ],
    ],
    icon: "🤖",
    color: "#E8F5E9",
  },
  {
    id: "ac-b3",
    type: BlockType.SubHeader,
    tokens: [["📄 A16Z: State of Crypto 2026 — 宏观分析摘要"]],
  },
  {
    id: "ac-b4",
    type: BlockType.Text,
    tokens: [
      ["来源: a16zcrypto.com | 剪藏时间: 2026-03-28 | 原文约 12,000 字"],
    ],
  },
  {
    id: "ac-b5",
    type: BlockType.SubSubHeader,
    tokens: [["AI 提取的关键论点"]],
  },
  {
    id: "ac-b6",
    type: BlockType.NumberedList,
    tokens: [
      ["DeFi TVL 在 2026-Q1 突破 $200B，创历史新高。"],
      ["流动性质押（Liquid Staking）", ["b"]],
      [" 成为最大的 DeFi 子赛道，Lido 市占率 32%。"],
    ],
  },
  {
    id: "ac-b7",
    type: BlockType.NumberedList,
    tokens: [
      ["稳定币总市值突破 $180B，USDC 和 USDT 双寡头格局稳固。"],
      ["去中心化稳定币（DAI/FRAX）", ["b"]],
      [" 市占率持续下降。"],
    ],
  },
  {
    id: "ac-b8",
    type: BlockType.NumberedList,
    tokens: [
      [
        "AI × Crypto 交叉赛道爆发：去中心化算力市场（Render/Akash）、AI Agent 经济（Autonolas）成为新叙事。",
      ],
    ],
  },
  {
    id: "ac-b9",
    type: BlockType.Text,
    tokens: [
      ["🔗 关联资产：本报告的 DeFi 分析直接关联 "],
      ["@Crypto 持仓", [["ref", "toc-sheet-asset-nav", "sheet", "row-crypto"]]],
      [" 和 "],
      [
        "@Lido stETH 质押",
        [["ref", "toc-sheet-defi-yield", "sheet", "row-lido"]],
      ],
      ["。A16Z 对 Lido 的正面评价强化了当前质押策略的信心。"],
    ],
  },
  {
    id: "ac-b10",
    type: BlockType.Divider,
    tokens: [],
  },
  {
    id: "ac-b11",
    type: BlockType.SubHeader,
    tokens: [["📄 高盛: 美联储降息路径预测 — 2026 H2 展望"]],
  },
  {
    id: "ac-b12",
    type: BlockType.Text,
    tokens: [
      ["来源: Goldman Sachs Research | 剪藏时间: 2026-04-02 | 原文约 8,500 字"],
    ],
  },
  {
    id: "ac-b13",
    type: BlockType.SubSubHeader,
    tokens: [["AI 提取的关键论点"]],
  },
  {
    id: "ac-b14",
    type: BlockType.NumberedList,
    tokens: [
      ["高盛预测美联储将在 2026-H2 启动降息周期，预计全年降息 "],
      ["75-100bp", ["b"]],
      ["（3-4 次，每次 25bp）。"],
    ],
  },
  {
    id: "ac-b15",
    type: BlockType.NumberedList,
    tokens: [
      ["降息将释放大量流动性，利好风险资产（股票、Crypto）和债券。"],
      ["现金资产的机会成本将上升", ["b"]],
      ["，建议降低现金配比。"],
    ],
  },
  {
    id: "ac-b16",
    type: BlockType.NumberedList,
    tokens: [
      ["美元走弱预期下，非美资产和大宗商品可能受益。黄金目标价上调至 $2,800。"],
    ],
  },
  {
    id: "ac-b17",
    type: BlockType.Callout,
    tokens: [
      [
        "💡 Agent 分析：结合您的【投资哲学】风险偏好，当前现金资产比例 16.1% 在降息周期中偏高。建议将 5-8% 的现金转入权益类或债券基金。参见 ",
      ],
      [
        "@投资哲学与退出策略",
        [["ref", "toc-canvas-investment-thesis", "canvas"]],
      ],
      [" 中的仓位管理纪律。"],
    ],
    icon: "💡",
    color: "#E3F2FD",
  },
  {
    id: "ac-b18",
    type: BlockType.Text,
    tokens: [
      ["🔗 关联资产：降息预期直接影响 "],
      ["@Cash 现金持仓", [["ref", "toc-sheet-asset-nav", "sheet", "row-cash"]]],
      [" 和 "],
      ["@Fund 基金持仓", [["ref", "toc-sheet-asset-nav", "sheet", "row-fund"]]],
      [" 的配置策略。同时关注 "],
      ["@NASDAQ:NVDA", [["ref", "toc-sheet-watchlist", "sheet", "row-nvda"]]],
      [" 在降息预期下的估值扩张空间。"],
    ],
  },
  {
    id: "ac-b19",
    type: BlockType.Divider,
    tokens: [],
  },
  {
    id: "ac-b20",
    type: BlockType.SubHeader,
    tokens: [["📄 Messari: DeFi Yield Landscape Q1 2026"]],
  },
  {
    id: "ac-b21",
    type: BlockType.Text,
    tokens: [["来源: Messari Pro | 剪藏时间: 2026-03-20 | 原文约 6,000 字"]],
  },
  {
    id: "ac-b22",
    type: BlockType.SubSubHeader,
    tokens: [["AI 提取的关键论点"]],
  },
  {
    id: "ac-b23",
    type: BlockType.NumberedList,
    tokens: [
      [
        "DeFi 借贷协议平均 APY 从 2025-Q4 的 5.2% 下降至 2026-Q1 的 3.8%，收益率压缩趋势明显。",
      ],
    ],
  },
  {
    id: "ac-b24",
    type: BlockType.NumberedList,
    tokens: [
      ["Lido stETH APY 稳定在 3.5-4.0% 区间，受益于以太坊网络活跃度提升。"],
    ],
  },
  {
    id: "ac-b25",
    type: BlockType.NumberedList,
    tokens: [
      [
        "Compound V3 出现治理攻击风险，建议降低 Compound 仓位至总 DeFi 配置的 15% 以下。",
      ],
    ],
  },
  {
    id: "ac-b26",
    type: BlockType.Text,
    tokens: [
      ["🔗 关联资产：直接影响 "],
      [
        "@Aave USDC 仓位",
        [["ref", "toc-sheet-defi-yield", "sheet", "row-aave"]],
      ],
      [" 和 "],
      [
        "@Compound DAI 仓位",
        [["ref", "toc-sheet-defi-yield", "sheet", "row-compound"]],
      ],
      ["。建议关注 Compound 治理风险，必要时迁移至 Aave。"],
    ],
  },
  {
    id: "ac-b27",
    type: BlockType.Divider,
    tokens: [],
  },
  {
    id: "ac-b28",
    type: BlockType.SubHeader,
    tokens: [["Action Items"]],
  },
  {
    id: "ac-b29",
    type: BlockType.ToDo,
    tokens: [["评估将 5% 现金转入 BND 债券基金的收益模拟"]],
    checked: false,
  },
  {
    id: "ac-b30",
    type: BlockType.ToDo,
    tokens: [["监控 Compound V3 治理提案，评估是否迁移 DAI 至 Aave"]],
    checked: false,
  },
  {
    id: "ac-b31",
    type: BlockType.ToDo,
    tokens: [["更新投资哲学文档中的降息周期应对策略"]],
    checked: false,
  },
  {
    id: "ac-b32",
    type: BlockType.ToDo,
    tokens: [["关注 A16Z 下一期 State of Crypto 报告（预计 2026-Q3）"]],
    checked: true,
  },
];

/**
 * Lookup map: canvasId → Block[] (toC workspace)
 */
export const tocAllCanvasBlocks: Record<string, Block[]> = {
  "toc-canvas-investment-thesis": investmentThesisBlocks,
  "toc-canvas-ai-sector": aiSectorBlocks,
  "toc-canvas-alpha-clipper": alphaClipperBlocks,
};
