import type { CrossReference } from "../types/crossRef";

/**
 * All cross-references between toC Smart Canvas and Smart Sheet files.
 * These establish the bidirectional link graph for the personal asset management workspace.
 */
export const tocCrossReferences: CrossReference[] = [
  // === Investment Thesis → Sheets ===
  // Investment Thesis → Asset NAV (general reference)
  {
    id: "toc-xref-1",
    sourceId: "toc-canvas-investment-thesis",
    sourceType: "canvas",
    targetId: "toc-sheet-asset-nav",
    targetType: "sheet",
    targetLabel: "@全球资产配置总表",
  },
  // Investment Thesis → Watchlist (row: NVDA)
  {
    id: "toc-xref-2",
    sourceId: "toc-canvas-investment-thesis",
    sourceType: "canvas",
    targetId: "toc-sheet-watchlist",
    targetType: "sheet",
    targetLabel: "@NASDAQ:NVDA",
    targetAnchor: "row-nvda",
  },
  // Investment Thesis → Liquidity (row: edu-trust)
  {
    id: "toc-xref-3",
    sourceId: "toc-canvas-investment-thesis",
    sourceType: "canvas",
    targetId: "toc-sheet-liquidity",
    targetType: "sheet",
    targetLabel: "@6 岁阶段教育信托基金预留",
    targetAnchor: "row-edu-trust",
  },
  // Investment Thesis → Liquidity (row: porsche)
  {
    id: "toc-xref-4",
    sourceId: "toc-canvas-investment-thesis",
    sourceType: "canvas",
    targetId: "toc-sheet-liquidity",
    targetType: "sheet",
    targetLabel: "@Porsche Cayenne 折旧储备",
    targetAnchor: "row-porsche",
  },
  // Investment Thesis → Liquidity (row: emergency)
  {
    id: "toc-xref-5",
    sourceId: "toc-canvas-investment-thesis",
    sourceType: "canvas",
    targetId: "toc-sheet-liquidity",
    targetType: "sheet",
    targetLabel: "@应急储备金",
    targetAnchor: "row-emergency",
  },
  // Investment Thesis → Liquidity (general reference)
  {
    id: "toc-xref-6",
    sourceId: "toc-canvas-investment-thesis",
    sourceType: "canvas",
    targetId: "toc-sheet-liquidity",
    targetType: "sheet",
    targetLabel: "@家族大额资产与流动性规划表",
  },
  // Investment Thesis → Asset NAV (embed view)
  {
    id: "toc-xref-7",
    sourceId: "toc-canvas-investment-thesis",
    sourceType: "canvas",
    targetId: "toc-sheet-asset-nav",
    targetType: "sheet",
    targetLabel: "嵌入视图: 全球资产配置总表",
  },

  // === AI Sector → Sheets ===
  // AI Sector → Watchlist (row: NVDA)
  {
    id: "toc-xref-8",
    sourceId: "toc-canvas-ai-sector",
    sourceType: "canvas",
    targetId: "toc-sheet-watchlist",
    targetType: "sheet",
    targetLabel: "@NASDAQ:NVDA",
    targetAnchor: "row-nvda",
  },
  // AI Sector → Watchlist (row: BTC)
  {
    id: "toc-xref-9",
    sourceId: "toc-canvas-ai-sector",
    sourceType: "canvas",
    targetId: "toc-sheet-watchlist",
    targetType: "sheet",
    targetLabel: "@BTC/USDT",
    targetAnchor: "row-btc-wl",
  },
  // AI Sector → Watchlist (row: ETH)
  {
    id: "toc-xref-10",
    sourceId: "toc-canvas-ai-sector",
    sourceType: "canvas",
    targetId: "toc-sheet-watchlist",
    targetType: "sheet",
    targetLabel: "@ETH/USDT",
    targetAnchor: "row-eth-wl",
  },
  // AI Sector → Watchlist (row: QQQ)
  {
    id: "toc-xref-11",
    sourceId: "toc-canvas-ai-sector",
    sourceType: "canvas",
    targetId: "toc-sheet-watchlist",
    targetType: "sheet",
    targetLabel: "@NASDAQ:QQQ",
    targetAnchor: "row-qqq-wl",
  },
  // AI Sector → DeFi Yield (row: Lido)
  {
    id: "toc-xref-12",
    sourceId: "toc-canvas-ai-sector",
    sourceType: "canvas",
    targetId: "toc-sheet-defi-yield",
    targetType: "sheet",
    targetLabel: "@Lido stETH",
    targetAnchor: "row-lido",
  },
  // AI Sector → DeFi Yield (row: Aave)
  {
    id: "toc-xref-13",
    sourceId: "toc-canvas-ai-sector",
    sourceType: "canvas",
    targetId: "toc-sheet-defi-yield",
    targetType: "sheet",
    targetLabel: "@Aave USDC",
    targetAnchor: "row-aave",
  },
  // AI Sector → Watchlist (embed view)
  {
    id: "toc-xref-14",
    sourceId: "toc-canvas-ai-sector",
    sourceType: "canvas",
    targetId: "toc-sheet-watchlist",
    targetType: "sheet",
    targetLabel: "嵌入视图: 二级市场动态监控池",
  },

  // === Alpha Clipper → Sheets ===
  // Alpha Clipper → Asset NAV (row: crypto)
  {
    id: "toc-xref-15",
    sourceId: "toc-canvas-alpha-clipper",
    sourceType: "canvas",
    targetId: "toc-sheet-asset-nav",
    targetType: "sheet",
    targetLabel: "@Crypto 持仓",
    targetAnchor: "row-crypto",
  },
  // Alpha Clipper → Asset NAV (row: cash)
  {
    id: "toc-xref-16",
    sourceId: "toc-canvas-alpha-clipper",
    sourceType: "canvas",
    targetId: "toc-sheet-asset-nav",
    targetType: "sheet",
    targetLabel: "@Cash 现金持仓",
    targetAnchor: "row-cash",
  },
  // Alpha Clipper → Asset NAV (row: fund)
  {
    id: "toc-xref-17",
    sourceId: "toc-canvas-alpha-clipper",
    sourceType: "canvas",
    targetId: "toc-sheet-asset-nav",
    targetType: "sheet",
    targetLabel: "@Fund 基金持仓",
    targetAnchor: "row-fund",
  },
  // Alpha Clipper → Watchlist (row: NVDA)
  {
    id: "toc-xref-18",
    sourceId: "toc-canvas-alpha-clipper",
    sourceType: "canvas",
    targetId: "toc-sheet-watchlist",
    targetType: "sheet",
    targetLabel: "@NASDAQ:NVDA",
    targetAnchor: "row-nvda",
  },
  // Alpha Clipper → DeFi Yield (row: Lido)
  {
    id: "toc-xref-19",
    sourceId: "toc-canvas-alpha-clipper",
    sourceType: "canvas",
    targetId: "toc-sheet-defi-yield",
    targetType: "sheet",
    targetLabel: "@Lido stETH 质押",
    targetAnchor: "row-lido",
  },
  // Alpha Clipper → DeFi Yield (row: Aave)
  {
    id: "toc-xref-20",
    sourceId: "toc-canvas-alpha-clipper",
    sourceType: "canvas",
    targetId: "toc-sheet-defi-yield",
    targetType: "sheet",
    targetLabel: "@Aave USDC 仓位",
    targetAnchor: "row-aave",
  },
  // Alpha Clipper → DeFi Yield (row: Compound)
  {
    id: "toc-xref-21",
    sourceId: "toc-canvas-alpha-clipper",
    sourceType: "canvas",
    targetId: "toc-sheet-defi-yield",
    targetType: "sheet",
    targetLabel: "@Compound DAI 仓位",
    targetAnchor: "row-compound",
  },

  // === Document ↔ Document bidirectional links ===
  // Alpha Clipper → Investment Thesis
  {
    id: "toc-xref-22",
    sourceId: "toc-canvas-alpha-clipper",
    sourceType: "canvas",
    targetId: "toc-canvas-investment-thesis",
    targetType: "canvas",
    targetLabel: "@投资哲学与退出策略",
  },
  // Investment Thesis → Alpha Clipper (reverse)
  {
    id: "toc-xref-23",
    sourceId: "toc-canvas-investment-thesis",
    sourceType: "canvas",
    targetId: "toc-canvas-alpha-clipper",
    targetType: "canvas",
    targetLabel: "@深度研究剪藏库",
  },
  // AI Sector → Investment Thesis
  {
    id: "toc-xref-24",
    sourceId: "toc-canvas-ai-sector",
    sourceType: "canvas",
    targetId: "toc-canvas-investment-thesis",
    targetType: "canvas",
    targetLabel: "@投资哲学与退出策略",
  },
  // Investment Thesis → AI Sector (reverse)
  {
    id: "toc-xref-25",
    sourceId: "toc-canvas-investment-thesis",
    sourceType: "canvas",
    targetId: "toc-canvas-ai-sector",
    targetType: "canvas",
    targetLabel: "@AI 赛道二级市场观察逻辑",
  },

  // === Reverse links: Sheets → Documents ===
  // Asset NAV → Investment Thesis (backlink)
  {
    id: "toc-xref-26",
    sourceId: "toc-sheet-asset-nav",
    sourceType: "sheet",
    targetId: "toc-canvas-investment-thesis",
    targetType: "canvas",
    targetLabel: "@投资哲学与退出策略",
  },
  // Asset NAV → Alpha Clipper (backlink)
  {
    id: "toc-xref-27",
    sourceId: "toc-sheet-asset-nav",
    sourceType: "sheet",
    targetId: "toc-canvas-alpha-clipper",
    targetType: "canvas",
    targetLabel: "@深度研究剪藏库",
  },
  // Watchlist → AI Sector (backlink)
  {
    id: "toc-xref-28",
    sourceId: "toc-sheet-watchlist",
    sourceType: "sheet",
    targetId: "toc-canvas-ai-sector",
    targetType: "canvas",
    targetLabel: "@AI 赛道二级市场观察逻辑",
  },
  // Watchlist → Alpha Clipper (backlink)
  {
    id: "toc-xref-29",
    sourceId: "toc-sheet-watchlist",
    sourceType: "sheet",
    targetId: "toc-canvas-alpha-clipper",
    targetType: "canvas",
    targetLabel: "@深度研究剪藏库",
  },
  // DeFi Yield → AI Sector (backlink)
  {
    id: "toc-xref-30",
    sourceId: "toc-sheet-defi-yield",
    sourceType: "sheet",
    targetId: "toc-canvas-ai-sector",
    targetType: "canvas",
    targetLabel: "@AI 赛道二级市场观察逻辑",
  },
  // DeFi Yield → Alpha Clipper (backlink)
  {
    id: "toc-xref-31",
    sourceId: "toc-sheet-defi-yield",
    sourceType: "sheet",
    targetId: "toc-canvas-alpha-clipper",
    targetType: "canvas",
    targetLabel: "@深度研究剪藏库",
  },
  // Liquidity → Investment Thesis (backlink)
  {
    id: "toc-xref-32",
    sourceId: "toc-sheet-liquidity",
    sourceType: "sheet",
    targetId: "toc-canvas-investment-thesis",
    targetType: "canvas",
    targetLabel: "@投资哲学与退出策略",
  },
];

/**
 * Get all backlinks for a given toC file id.
 */
export function getTocBacklinks(fileId: string) {
  return tocCrossReferences
    .filter((ref) => ref.targetId === fileId)
    .map((ref) => ({
      referenceId: ref.id,
      sourceId: ref.sourceId,
      sourceType: ref.sourceType,
      sourceLabel: ref.targetLabel,
      anchor: ref.targetAnchor,
    }));
}
