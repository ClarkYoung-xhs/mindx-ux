import type { SheetData } from "../types/sheet";
import { BlockType } from "../types/block";
import type { Block } from "../types/block";

/**
 * Table 1: Global_Asset_NAV — Global Asset Allocation Overview
 */
export const assetNavSheet: SheetData = {
  id: "toc-sheet-asset-nav",
  name: "全球资产配置总表",
  keyColumnId: "nav-col-category",
  columns: [
    { id: "nav-col-category", name: "资产类别", type: "text", width: 160 },
    { id: "nav-col-holding", name: "持有量/规模", type: "text", width: 140 },
    { id: "nav-col-cost", name: "成本均价", type: "text", width: 120 },
    { id: "nav-col-price", name: "实时市价", type: "text", width: 120 },
    { id: "nav-col-nav", name: "当前估值 (NAV)", type: "text", width: 140 },
    { id: "nav-col-weight", name: "动态权重占比", type: "text", width: 120 },
  ],
  rows: [
    {
      id: "row-equity",
      cells: {
        "nav-col-category": "Equity（权益类）",
        "nav-col-holding": "NVDA 200股 / AAPL 150股 / QQQ 300份",
        "nav-col-cost": "综合 $142,500",
        "nav-col-price": "综合 $198,700",
        "nav-col-nav": "$198,700",
        "nav-col-weight": "33.2%",
      },
      expandBlocks: [
        {
          id: "exp-equity-1",
          type: BlockType.Header,
          tokens: [["权益类资产持仓明细"]],
        },
        {
          id: "exp-equity-2",
          type: BlockType.Text,
          tokens: [
            ["权益类资产是组合的 "],
            ["核心增长引擎", ["b"]],
            ["，当前配置集中于美股科技板块和宽基 ETF。整体持仓浮盈 "],
            ["+39.4%", ["b"]],
            ["，表现优于同期标普 500 指数。"],
          ],
        },
        {
          id: "exp-equity-3",
          type: BlockType.SubHeader,
          tokens: [["持仓明细"]],
        },
        {
          id: "exp-equity-4",
          type: BlockType.BulletedList,
          tokens: [
            [
              "NVDA（英伟达）：200 股 × $890 = $178,000，成本 $620，浮盈 +43.5%",
            ],
          ],
        },
        {
          id: "exp-equity-5",
          type: BlockType.BulletedList,
          tokens: [
            ["AAPL（苹果）：150 股 × $195 = $29,250，成本 $165，浮盈 +18.2%"],
          ],
        },
        {
          id: "exp-equity-6",
          type: BlockType.BulletedList,
          tokens: [
            [
              "QQQ（纳指 ETF）：300 份 × $485 = $145,500，成本 $420，浮盈 +15.5%",
            ],
          ],
        },
        {
          id: "exp-equity-7",
          type: BlockType.Callout,
          tokens: [
            [
              "📊 策略备注：NVDA 仓位占权益类的 50%+，集中度偏高。依据【投资哲学】，当单一标的权重超过 40% 时应考虑减仓再平衡。",
            ],
          ],
          icon: "📊",
          color: "#E3F2FD",
        },
      ],
    },
    {
      id: "row-crypto",
      cells: {
        "nav-col-category": "Crypto（加密货币）",
        "nav-col-holding": "BTC 2.5枚 / ETH 30枚 / USDC 50,000",
        "nav-col-cost": "综合 $185,000",
        "nav-col-price": "综合 $248,500",
        "nav-col-nav": "$248,500",
        "nav-col-weight": "41.5%",
      },
      expandBlocks: [
        {
          id: "exp-crypto-1",
          type: BlockType.Header,
          tokens: [["加密货币持仓明细"]],
        },
        {
          id: "exp-crypto-2",
          type: BlockType.Text,
          tokens: [
            ["加密货币是组合中 "],
            ["权重最大的资产类别", ["b"]],
            [
              "，采用「核心 + 卫星」策略：BTC/ETH 为核心持仓，USDC 为流动性缓冲。部分 ETH 通过 ",
            ],
            [
              "@Lido stETH",
              [["ref", "toc-sheet-defi-yield", "sheet", "row-lido"]],
            ],
            [" 进行链上质押生息。"],
          ],
        },
        {
          id: "exp-crypto-3",
          type: BlockType.SubHeader,
          tokens: [["持仓明细"]],
        },
        {
          id: "exp-crypto-4",
          type: BlockType.BulletedList,
          tokens: [
            ["BTC：2.5 枚 × $67,000 = $167,500，成本 $42,000，浮盈 +59.5%"],
          ],
        },
        {
          id: "exp-crypto-5",
          type: BlockType.BulletedList,
          tokens: [
            [
              "ETH：30 枚 × $3,500 = $105,000（其中 20 枚质押于 Lido），成本 $2,800",
            ],
          ],
        },
        {
          id: "exp-crypto-6",
          type: BlockType.BulletedList,
          tokens: [["USDC：50,000 枚（稳定币，存于 Aave 生息，APY 4.2%）"]],
        },
        {
          id: "exp-crypto-7",
          type: BlockType.Callout,
          tokens: [
            [
              "⚠️ 风险提示：Crypto 仓位占比 41.5%，超过投资纪律设定的 35% 上限。建议在下一波动周期中减持 5-8% 转入稳健资产。",
            ],
          ],
          icon: "⚠️",
          color: "#FFF3E0",
        },
      ],
    },
    {
      id: "row-cash",
      cells: {
        "nav-col-category": "Cash（现金及等价物）",
        "nav-col-holding": "活期 ¥280,000 / 货基 ¥420,000",
        "nav-col-cost": "—",
        "nav-col-price": "—",
        "nav-col-nav": "$96,500",
        "nav-col-weight": "16.1%",
      },
      expandBlocks: [
        {
          id: "exp-cash-1",
          type: BlockType.Header,
          tokens: [["现金及等价物明细"]],
        },
        {
          id: "exp-cash-2",
          type: BlockType.Text,
          tokens: [
            ["现金类资产作为组合的 "],
            ["流动性安全垫", ["b"]],
            [
              "，覆盖 6 个月家庭支出和紧急备用金。当前现金比例 16.1%，处于合理区间（目标 10-20%）。",
            ],
          ],
        },
        {
          id: "exp-cash-3",
          type: BlockType.SubHeader,
          tokens: [["资金分布"]],
        },
        {
          id: "exp-cash-4",
          type: BlockType.BulletedList,
          tokens: [["招商银行活期：¥280,000（日常支出账户）"]],
        },
        {
          id: "exp-cash-5",
          type: BlockType.BulletedList,
          tokens: [["天弘余额宝：¥420,000（7 日年化 1.8%）"]],
        },
        {
          id: "exp-cash-6",
          type: BlockType.Text,
          tokens: [
            ["按当前汇率 ¥7.25/$ 折算，现金类资产合计约 "],
            ["$96,500", ["b"]],
            ["。"],
          ],
        },
      ],
    },
    {
      id: "row-realestate",
      cells: {
        "nav-col-category": "Real Estate（不动产）",
        "nav-col-holding": "深圳南山区 89㎡ 住宅 × 1",
        "nav-col-cost": "¥5,200,000",
        "nav-col-price": "评估价 ¥6,800,000",
        "nav-col-nav": "$937,900",
        "nav-col-weight": "—（未计入流动资产）",
      },
      expandBlocks: [
        {
          id: "exp-re-1",
          type: BlockType.Header,
          tokens: [["不动产资产明细"]],
        },
        {
          id: "exp-re-2",
          type: BlockType.Text,
          tokens: [
            ["自住房产位于深圳南山区科技园片区，2021 年购入，当前市场评估价 "],
            ["¥6,800,000", ["b"]],
            [
              "。作为非流动资产，不计入投资组合的动态权重计算，但纳入家庭净资产总览。",
            ],
          ],
        },
        {
          id: "exp-re-3",
          type: BlockType.SubHeader,
          tokens: [["房产信息"]],
        },
        {
          id: "exp-re-4",
          type: BlockType.BulletedList,
          tokens: [["面积：89㎡（建筑面积），3 室 2 厅"]],
        },
        {
          id: "exp-re-5",
          type: BlockType.BulletedList,
          tokens: [["购入价：¥5,200,000（2021-06）"]],
        },
        {
          id: "exp-re-6",
          type: BlockType.BulletedList,
          tokens: [["剩余房贷：¥3,100,000（月供 ¥18,500，详见流动性规划表）"]],
        },
        {
          id: "exp-re-7",
          type: BlockType.BulletedList,
          tokens: [["净值：¥3,700,000（评估价 - 剩余贷款）"]],
        },
      ],
    },
    {
      id: "row-fund",
      cells: {
        "nav-col-category": "Fund（基金）",
        "nav-col-holding": "先锋全球债券 / 桥水全天候",
        "nav-col-cost": "综合 $48,000",
        "nav-col-price": "综合 $55,300",
        "nav-col-nav": "$55,300",
        "nav-col-weight": "9.2%",
      },
      expandBlocks: [
        {
          id: "exp-fund-1",
          type: BlockType.Header,
          tokens: [["基金持仓明细"]],
        },
        {
          id: "exp-fund-2",
          type: BlockType.Text,
          tokens: [
            ["基金配置以 "],
            ["全球分散化", ["b"]],
            [
              " 为原则，选择低费率的被动型基金和经典对冲基金策略，作为组合的稳定器。",
            ],
          ],
        },
        {
          id: "exp-fund-3",
          type: BlockType.SubHeader,
          tokens: [["持仓明细"]],
        },
        {
          id: "exp-fund-4",
          type: BlockType.BulletedList,
          tokens: [
            ["Vanguard Total Bond Market ETF (BND)：$30,000，年化收益 4.1%"],
          ],
        },
        {
          id: "exp-fund-5",
          type: BlockType.BulletedList,
          tokens: [
            ["Bridgewater All Weather Strategy：$25,300，年化收益 6.8%"],
          ],
        },
        {
          id: "exp-fund-6",
          type: BlockType.Callout,
          tokens: [
            [
              "💡 配置建议：基金占比 9.2%，略低于目标 12%。若宏观环境转向降息周期，可增配债券类基金至 15%，对冲权益类波动。",
            ],
          ],
          icon: "💡",
          color: "#E3F2FD",
        },
      ],
    },
  ],
};

/**
 * Table 2: Live_Watchlist_DB — Secondary Market Watchlist
 */
export const watchlistSheet: SheetData = {
  id: "toc-sheet-watchlist",
  name: "二级市场动态监控池",
  keyColumnId: "wl-col-ticker",
  columns: [
    { id: "wl-col-ticker", name: "标的代码", type: "text", width: 180 },
    { id: "wl-col-class", name: "分类", type: "text", width: 120 },
    { id: "wl-col-price", name: "实时市价", type: "text", width: 120 },
    { id: "wl-col-target", name: "建仓目标价", type: "text", width: 120 },
    { id: "wl-col-premium", name: "溢价率", type: "text", width: 100 },
    {
      id: "wl-col-strategy",
      name: "关联策略",
      type: "relation",
      width: 220,
      relationConfig: { targetSheetId: "toc-canvas-ai-sector" },
    },
  ],
  rows: [
    {
      id: "row-nvda",
      cells: {
        "wl-col-ticker": "@NASDAQ:NVDA",
        "wl-col-class": "AI 芯片 / 科技股",
        "wl-col-price": "$890.00",
        "wl-col-target": "$850.00",
        "wl-col-premium": "+4.7%",
        "wl-col-strategy": {
          targetId: "toc-canvas-ai-sector",
          targetType: "canvas",
          displayText: "@AI 赛道观察逻辑",
        },
      },
    },
    {
      id: "row-btc-wl",
      cells: {
        "wl-col-ticker": "BTC/USDT",
        "wl-col-class": "加密货币",
        "wl-col-price": "$67,000",
        "wl-col-target": "$58,000",
        "wl-col-premium": "+15.5%",
        "wl-col-strategy": {
          targetId: "toc-canvas-ai-sector",
          targetType: "canvas",
          displayText: "@AI 赛道观察逻辑",
        },
      },
    },
    {
      id: "row-qqq-wl",
      cells: {
        "wl-col-ticker": "@NASDAQ:QQQ",
        "wl-col-class": "宽基 ETF",
        "wl-col-price": "$485.00",
        "wl-col-target": "$440.00",
        "wl-col-premium": "+10.2%",
        "wl-col-strategy": null,
      },
    },
    {
      id: "row-aapl-wl",
      cells: {
        "wl-col-ticker": "@NASDAQ:AAPL",
        "wl-col-class": "消费科技",
        "wl-col-price": "$195.00",
        "wl-col-target": "$175.00",
        "wl-col-premium": "+11.4%",
        "wl-col-strategy": null,
      },
    },
    {
      id: "row-eth-wl",
      cells: {
        "wl-col-ticker": "ETH/USDT",
        "wl-col-class": "加密货币 / DeFi 基础层",
        "wl-col-price": "$3,500",
        "wl-col-target": "$2,800",
        "wl-col-premium": "+25.0%",
        "wl-col-strategy": {
          targetId: "toc-canvas-ai-sector",
          targetType: "canvas",
          displayText: "@AI 赛道观察逻辑",
        },
      },
    },
  ],
};

/**
 * Table 3: DeFi_Yield_DB — Crypto On-chain Yield & Staking Ledger
 */
export const defiYieldSheet: SheetData = {
  id: "toc-sheet-defi-yield",
  name: "Crypto 链上生息与质押账簿",
  keyColumnId: "defi-col-protocol",
  columns: [
    { id: "defi-col-protocol", name: "质押协议", type: "text", width: 180 },
    { id: "defi-col-principal", name: "投入本金", type: "text", width: 140 },
    { id: "defi-col-apy", name: "实时 APY", type: "text", width: 100 },
    {
      id: "defi-col-risk",
      name: "合约风险评级",
      type: "status",
      width: 130,
      statusOptions: [
        { label: "低风险", color: "#2E7D32" },
        { label: "中风险", color: "#E65100" },
        { label: "高风险", color: "#C62828" },
      ],
    },
  ],
  rows: [
    {
      id: "row-lido",
      cells: {
        "defi-col-protocol": "Lido stETH（ETH 质押）",
        "defi-col-principal": "20 ETH ≈ $70,000",
        "defi-col-apy": "3.8%",
        "defi-col-risk": "低风险",
      },
      expandBlocks: [
        {
          id: "exp-lido-1",
          type: BlockType.Header,
          tokens: [["Lido stETH 质押详情"]],
        },
        {
          id: "exp-lido-2",
          type: BlockType.Text,
          tokens: [
            ["Lido 是以太坊最大的流动性质押协议，TVL 超过 "],
            ["$35B", ["b"]],
            [
              "。通过 Lido 质押 ETH 可获得 stETH 凭证，保持流动性的同时享受 PoS 质押收益。",
            ],
          ],
        },
        {
          id: "exp-lido-3",
          type: BlockType.SubHeader,
          tokens: [["质押参数"]],
        },
        {
          id: "exp-lido-4",
          type: BlockType.BulletedList,
          tokens: [["质押数量：20 ETH"]],
        },
        {
          id: "exp-lido-5",
          type: BlockType.BulletedList,
          tokens: [["当前 APY：3.8%（30 日均值）"]],
        },
        {
          id: "exp-lido-6",
          type: BlockType.BulletedList,
          tokens: [["累计收益：0.38 ETH ≈ $1,330"]],
        },
        {
          id: "exp-lido-7",
          type: BlockType.BulletedList,
          tokens: [["退出周期：1-3 天（通过 stETH/ETH 池即时兑换）"]],
        },
        {
          id: "exp-lido-8",
          type: BlockType.Callout,
          tokens: [
            [
              "✅ Lido 协议经过多轮审计，智能合约风险评级为「低风险」。stETH 与 ETH 的锚定偏差长期维持在 0.1% 以内。",
            ],
          ],
          icon: "✅",
          color: "#E8F5E9",
        },
      ],
    },
    {
      id: "row-aave",
      cells: {
        "defi-col-protocol": "Aave USDC（稳定币借贷）",
        "defi-col-principal": "50,000 USDC",
        "defi-col-apy": "4.2%",
        "defi-col-risk": "低风险",
      },
      expandBlocks: [
        {
          id: "exp-aave-1",
          type: BlockType.Header,
          tokens: [["Aave USDC 存款详情"]],
        },
        {
          id: "exp-aave-2",
          type: BlockType.Text,
          tokens: [
            [
              "Aave V3 是 DeFi 领域最成熟的借贷协议之一。将 USDC 存入 Aave 可获得 ",
            ],
            ["稳定的借贷利息收入", ["b"]],
            ["，同时保持高流动性（随时可提取）。"],
          ],
        },
        {
          id: "exp-aave-3",
          type: BlockType.SubHeader,
          tokens: [["存款参数"]],
        },
        {
          id: "exp-aave-4",
          type: BlockType.BulletedList,
          tokens: [["存入金额：50,000 USDC"]],
        },
        {
          id: "exp-aave-5",
          type: BlockType.BulletedList,
          tokens: [["当前 APY：4.2%（浮动利率，随市场供需变化）"]],
        },
        {
          id: "exp-aave-6",
          type: BlockType.BulletedList,
          tokens: [["累计收益：$875（入金 5 个月）"]],
        },
        {
          id: "exp-aave-7",
          type: BlockType.BulletedList,
          tokens: [["提取时间：即时（无锁定期）"]],
        },
        {
          id: "exp-aave-8",
          type: BlockType.Callout,
          tokens: [
            [
              "💡 策略备注：Aave USDC 仓位是组合的「流动性弹药库」。当市场出现极端回调时，可快速提取用于抄底。参见 @AI 赛道观察逻辑 中的接针策略。",
            ],
          ],
          icon: "💡",
          color: "#E3F2FD",
        },
      ],
    },
    {
      id: "row-compound",
      cells: {
        "defi-col-protocol": "Compound DAI（稳定币借贷）",
        "defi-col-principal": "20,000 DAI",
        "defi-col-apy": "3.5%",
        "defi-col-risk": "中风险",
      },
      expandBlocks: [
        {
          id: "exp-comp-1",
          type: BlockType.Header,
          tokens: [["Compound DAI 存款详情"]],
        },
        {
          id: "exp-comp-2",
          type: BlockType.Text,
          tokens: [
            [
              "Compound V3 是老牌 DeFi 借贷协议。DAI 作为去中心化稳定币，与 USDC 形成 ",
            ],
            ["稳定币多元化配置", ["b"]],
            ["，降低单一稳定币的监管风险。"],
          ],
        },
        {
          id: "exp-comp-3",
          type: BlockType.SubHeader,
          tokens: [["风险评估"]],
        },
        {
          id: "exp-comp-4",
          type: BlockType.BulletedList,
          tokens: [["DAI 依赖 MakerDAO 超额抵押机制，极端行情下存在脱锚风险"]],
        },
        {
          id: "exp-comp-5",
          type: BlockType.BulletedList,
          tokens: [
            [
              "Compound V3 合约经过 OpenZeppelin 审计，但历史上曾出现治理攻击事件",
            ],
          ],
        },
        {
          id: "exp-comp-6",
          type: BlockType.BulletedList,
          tokens: [["综合评级：中风险（建议仓位不超过 DeFi 总仓位的 20%）"]],
        },
      ],
    },
  ],
};

/**
 * Table 4: Liquidity_DB — Family Major Asset & Liquidity Planning
 */
export const liquiditySheet: SheetData = {
  id: "toc-sheet-liquidity",
  name: "家族大额资产与流动性规划表",
  keyColumnId: "liq-col-name",
  columns: [
    { id: "liq-col-name", name: "资产/目标名称", type: "text", width: 220 },
    { id: "liq-col-target", name: "目标金额", type: "text", width: 140 },
    {
      id: "liq-col-status",
      name: "资金到位状态",
      type: "status",
      width: 120,
      statusOptions: [
        { label: "已到位", color: "#2E7D32" },
        { label: "进行中", color: "#1565C0" },
        { label: "待启动", color: "#757575" },
      ],
    },
    { id: "liq-col-trigger", name: "触发条件", type: "text", width: 260 },
  ],
  rows: [
    {
      id: "row-edu-trust",
      cells: {
        "liq-col-name": "6 岁阶段教育信托基金预留",
        "liq-col-target": "¥500,000（≈ $69,000）",
        "liq-col-status": "进行中",
        "liq-col-trigger": "核心资产溢价率 > 30% 时，自动锁定 15% 流动性转入",
      },
    },
    {
      id: "row-porsche",
      cells: {
        "liq-col-name": "Porsche Cayenne 折旧预估",
        "liq-col-target": "¥350,000（3 年折旧储备）",
        "liq-col-status": "已到位",
        "liq-col-trigger": "每季度从投资收益中划拨 ¥30,000 至专项账户",
      },
    },
    {
      id: "row-travel",
      cells: {
        "liq-col-name": "年度家庭旅行基金",
        "liq-col-target": "¥120,000 / 年",
        "liq-col-status": "进行中",
        "liq-col-trigger": "每月自动定投 ¥10,000，Q4 集中使用",
      },
    },
    {
      id: "row-emergency",
      cells: {
        "liq-col-name": "应急储备金（6 个月支出）",
        "liq-col-target": "¥180,000",
        "liq-col-status": "已到位",
        "liq-col-trigger": "余额低于 ¥150,000 时触发自动补充",
      },
    },
    {
      id: "row-mortgage",
      cells: {
        "liq-col-name": "房贷月供储备",
        "liq-col-target": "¥222,000 / 年（月供 ¥18,500）",
        "liq-col-status": "已到位",
        "liq-col-trigger": "工资到账后自动划扣，剩余房贷 ¥3,100,000",
      },
    },
  ],
};

/**
 * Table 5: Alpha_Subscription — High-value Information Subscription Ledger
 */
export const alphaSubSheet: SheetData = {
  id: "toc-sheet-alpha-sub",
  name: "高价值信息订阅账簿",
  keyColumnId: "sub-col-provider",
  columns: [
    { id: "sub-col-provider", name: "服务商", type: "text", width: 180 },
    { id: "sub-col-cycle", name: "续费周期", type: "text", width: 120 },
    { id: "sub-col-next", name: "下次扣费日", type: "date", width: 120 },
    { id: "sub-col-value", name: "核心价值标签", type: "text", width: 240 },
  ],
  rows: [
    {
      id: "row-bloomberg",
      cells: {
        "sub-col-provider": "Bloomberg Terminal",
        "sub-col-cycle": "年付",
        "sub-col-next": "2027-01-15",
        "sub-col-value": "实时行情 / 宏观数据 / 固收分析",
      },
    },
    {
      id: "row-messari",
      cells: {
        "sub-col-provider": "Messari Pro",
        "sub-col-cycle": "年付",
        "sub-col-next": "2026-09-01",
        "sub-col-value": "Crypto 基本面研究 / 链上数据 / 赛道报告",
      },
    },
    {
      id: "row-theblock",
      cells: {
        "sub-col-provider": "The Block Research",
        "sub-col-cycle": "月付",
        "sub-col-next": "2026-05-01",
        "sub-col-value": "DeFi 协议分析 / 融资动态 / 监管追踪",
      },
    },
    {
      id: "row-macrovoices",
      cells: {
        "sub-col-provider": "MacroVoices Premium",
        "sub-col-cycle": "季付",
        "sub-col-next": "2026-07-01",
        "sub-col-value": "全球宏观策略 / 利率周期 / 大宗商品",
      },
    },
  ],
};

/**
 * Lookup map: sheetId → SheetData (toC workspace)
 */
export const tocAllSheets: Record<string, SheetData> = {
  "toc-sheet-asset-nav": assetNavSheet,
  "toc-sheet-watchlist": watchlistSheet,
  "toc-sheet-defi-yield": defiYieldSheet,
  "toc-sheet-liquidity": liquiditySheet,
  "toc-sheet-alpha-sub": alphaSubSheet,
};
