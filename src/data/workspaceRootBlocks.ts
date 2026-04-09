/**
 * Workspace root blocks for the two top-level Smart Canvas documents.
 * Isolated in its own file to avoid circular dependencies between
 * canvasMockData ↔ unifiedDocTree ↔ mindxDemo.
 */
import type { Block } from "../types/block";
import { BlockType } from "../types/block";

export const tobWorkspaceRootBlocks: Block[] = [
  {
    id: "ws-tob-b1",
    type: BlockType.Header,
    tokens: [["进销存工作台"]],
  },
  {
    id: "ws-tob-b2",
    type: BlockType.Text,
    tokens: [
      [
        "这是一个面向 B2B 陶瓷器具行业的智能进销存管理工作台。所有文档、数据表和看板都围绕供应链、客户关系和订单履约展开。",
      ],
    ],
  },
  {
    id: "ws-tob-b3",
    type: BlockType.Callout,
    tokens: [
      [
        "🏭 核心能力：SKU 库存实时追踪 · B2B 客户授信管理 · 全渠道订单流水 · 供应链预警 · AI Agent 自动化协作",
      ],
    ],
    icon: "🏭",
    color: "rgba(221, 235, 255, 0.3)",
  },
  {
    id: "ws-tob-b4",
    type: BlockType.SubHeader,
    tokens: [["工作台概览"]],
  },
  {
    id: "ws-tob-b5",
    type: BlockType.Text,
    tokens: [
      ["当前工作台包含 "],
      ["5 份核心文档", ["b"]],
      ["，覆盖从库存管理到客户服务的完整业务链路："],
    ],
  },
  {
    id: "ws-tob-b6",
    type: BlockType.NumberedList,
    tokens: [
      ["全局 SKU 与动态库存表", ["b"]],
      [" — 实时追踪所有 SKU 的库存水位、安全线和供应商关联"],
    ],
  },
  {
    id: "ws-tob-b7",
    type: BlockType.NumberedList,
    tokens: [
      ["B2B 客户档案与授信表", ["b"]],
      [" — 管理客户等级、授信额度、专属价格和回款周期"],
    ],
  },
  {
    id: "ws-tob-b8",
    type: BlockType.NumberedList,
    tokens: [
      ["全渠道业务订单流水大表", ["b"]],
      [" — 记录所有渠道的订单状态、履约进度和异常标记"],
    ],
  },
  {
    id: "ws-tob-b9",
    type: BlockType.NumberedList,
    tokens: [
      ["重点客户 Q1 拜访与授信调整纪要", ["b"]],
      [" — 记录客户拜访、需求变化和授信调整决策"],
    ],
  },
  {
    id: "ws-tob-b10",
    type: BlockType.NumberedList,
    tokens: [
      ["Q2 华东区供应链异常预警报告", ["b"]],
      [" — AI Agent 自动生成的供应链风险预警和应对建议"],
    ],
  },
  {
    id: "ws-tob-b11",
    type: BlockType.SubHeader,
    tokens: [["团队与 Agent"]],
  },
  {
    id: "ws-tob-b12",
    type: BlockType.BulletedList,
    tokens: [
      ["Claude Assistant", ["b"]],
      [" — 负责文档起草、订单创建和客户门户维护"],
    ],
  },
  {
    id: "ws-tob-b13",
    type: BlockType.BulletedList,
    tokens: [
      ["Data Analyzer", ["b"]],
      [" — 负责库存监控、供应商评估和数据分析"],
    ],
  },
  {
    id: "ws-tob-b14",
    type: BlockType.BulletedList,
    tokens: [
      ["Research Bot", ["b"]],
      [" — 负责供应链研究、行业分析和风险评估"],
    ],
  },
];

export const tocWorkspaceRootBlocks: Block[] = [
  {
    id: "ws-toc-b1",
    type: BlockType.Header,
    tokens: [["个人资产管理"]],
  },
  {
    id: "ws-toc-b2",
    type: BlockType.Text,
    tokens: [
      [
        "这是一个面向高净值个人的全球资产配置管理工作台。涵盖股票、加密货币、DeFi 生息、家族资产规划和深度研究剪藏。",
      ],
    ],
  },
  {
    id: "ws-toc-b3",
    type: BlockType.Callout,
    tokens: [
      [
        "💰 核心能力：全球资产 NAV 追踪 · 二级市场动态监控 · 链上生息管理 · 流动性规划 · AI 研报剪藏与分析",
      ],
    ],
    icon: "💰",
    color: "rgba(255, 243, 224, 0.5)",
  },
  {
    id: "ws-toc-b4",
    type: BlockType.SubHeader,
    tokens: [["资产概览"]],
  },
  {
    id: "ws-toc-b5",
    type: BlockType.Text,
    tokens: [
      ["当前管理 "],
      ["$598,500 总资产", ["b"]],
      ["，分布在以下资产类别："],
    ],
  },
  {
    id: "ws-toc-b6",
    type: BlockType.BulletedList,
    tokens: [["美股持仓", ["b"]], [" — NVDA、QQQ 等科技股，占比约 25%"]],
  },
  {
    id: "ws-toc-b7",
    type: BlockType.BulletedList,
    tokens: [
      ["Crypto 持仓", ["b"]],
      [" — BTC、ETH、SOL，占比约 41%（超配预警）"],
    ],
  },
  {
    id: "ws-toc-b8",
    type: BlockType.BulletedList,
    tokens: [["DeFi 生息", ["b"]], [" — Lido stETH、Aave USDC、Compound DAI"]],
  },
  {
    id: "ws-toc-b9",
    type: BlockType.BulletedList,
    tokens: [["基金与现金", ["b"]], [" — 指数基金 + 应急储备金"]],
  },
  {
    id: "ws-toc-b10",
    type: BlockType.SubHeader,
    tokens: [["投资纪律"]],
  },
  {
    id: "ws-toc-b11",
    type: BlockType.Quote,
    tokens: [
      [
        '"单一资产类别不超过 35%，Crypto 超配时自动触发再平衡建议。教育信托基金 30% 溢价触发锁定。"',
      ],
    ],
  },
  {
    id: "ws-toc-b12",
    type: BlockType.SubHeader,
    tokens: [["工具集"]],
  },
  {
    id: "ws-toc-b13",
    type: BlockType.NumberedList,
    tokens: [["全球资产配置总表", ["b"]], [" — 实时 NAV、权重和再平衡建议"]],
  },
  {
    id: "ws-toc-b14",
    type: BlockType.NumberedList,
    tokens: [
      ["二级市场动态监控池", ["b"]],
      [" — 股票和 Crypto 的实时行情与技术指标"],
    ],
  },
  {
    id: "ws-toc-b15",
    type: BlockType.NumberedList,
    tokens: [
      ["深度研究剪藏库", ["b"]],
      [" — AI 自动提取研报关键实体和投资信号"],
    ],
  },
  {
    id: "ws-toc-b16",
    type: BlockType.NumberedList,
    tokens: [["财富视图", ["b"]], [" — 可发布为 PWA Widget 的个人财富看板"]],
  },
];
