import type { Block } from "../types/block";
import { BlockType } from "../types/block";
import { analysisReportBlocks } from "./analysisReportBlocks";
import { tocAllCanvasBlocks } from "./tocCanvasMockData";

/**
 * Document 1: Key Client Q1 Visit & Credit Adjustment Notes
 */
export const clientVisitBlocks: Block[] = [
  {
    id: "cv-b1",
    type: BlockType.Header,
    tokens: [["重点客户 Q1 拜访与授信调整纪要"]],
  },
  {
    id: "cv-b1a",
    type: BlockType.Text,
    tokens: [
      ["标签: "],
      ["客情维系", ["c"]],
      [", "],
      ["S级客户", ["c"]],
      [" | 日期: 2026-03-15 | 记录人: 销售经理 李明"],
    ],
  },
  {
    id: "cv-b2",
    type: BlockType.SubHeader,
    tokens: [["拜访概要"]],
  },
  {
    id: "cv-b2a",
    type: BlockType.Text,
    tokens: [
      ["本次拜访对象为 "],
      [
        "@华中区-星巴克加盟商-老王",
        [["ref", "sheet-crm", "sheet", "row-laowang"]],
      ],
      [
        "（S 级客户），地点为武汉光谷旗舰店。拜访目的：Q1 业务回顾、Q2 采购计划沟通、授信额度评审。拜访时长约 ",
      ],
      ["2.5 小时", ["b"]],
      ["。"],
    ],
  },
  {
    id: "cv-b3",
    type: BlockType.SubHeader,
    tokens: [["近期业务异动"]],
  },
  {
    id: "cv-b3a",
    type: BlockType.Text,
    tokens: [
      [
        "@华中区-星巴克加盟商-老王",
        [["ref", "sheet-crm", "sheet", "row-laowang"]],
      ],
      [" 近期在其辖区新增了 3 家门店（武汉 2 家 + 长沙 1 家），预计 Q2 对 "],
      ["@经典款陶瓷马克杯", [["ref", "sheet-inventory", "sheet", "row-mug01"]]],
      [" 的采购量将激增 "],
      ["300%", ["b"]],
      ["。同时老王首次表达了对 "],
      ["@双层隔热玻璃杯", [["ref", "sheet-inventory", "sheet", "row-cup01"]]],
      [" 品类的兴趣，计划在精品咖啡门店试推。"],
    ],
  },
  {
    id: "cv-b3b",
    type: BlockType.SubSubHeader,
    tokens: [["Q1 采购数据回顾"]],
  },
  {
    id: "cv-b3c",
    type: BlockType.BulletedList,
    tokens: [["经典款陶瓷马克杯：Q1 采购 1,200 只，同比增长 15%"]],
  },
  {
    id: "cv-b3d",
    type: BlockType.BulletedList,
    tokens: [["简约白瓷餐盘：Q1 采购 450 只，同比增长 8%"]],
  },
  {
    id: "cv-b3e",
    type: BlockType.BulletedList,
    tokens: [["Q1 总采购额：约 ¥52 万，占华中区渠道总额的 38%"]],
  },
  {
    id: "cv-b4",
    type: BlockType.SubHeader,
    tokens: [["风控与授信研判"]],
  },
  {
    id: "cv-b5",
    type: BlockType.Text,
    tokens: [
      ["鉴于其历史回款极速（平均回款周期 "],
      ["18 天", ["b"]],
      ["，远低于账期 30 天），同意将其专属价格固定为 "],
      ["13.5元/个", ["b"]],
      ['（此数据为 Agent 回答"按上次价格走"的真实数据源）。'],
    ],
  },
  {
    id: "cv-b5a",
    type: BlockType.Text,
    tokens: [
      [
        "当前授信额度 50 万，已用 32 万，剩余 18 万。考虑到 Q2 新增门店带来的采购增量，建议将授信额度提升至 ",
      ],
      ["80 万", ["b"]],
      ["。风控部门已初步同意，待 Q2 首月回款数据确认后正式生效。"],
    ],
  },
  {
    id: "cv-b5b",
    type: BlockType.Callout,
    tokens: [
      [
        "💰 授信调整摘要：50 万 → 80 万（待确认），专属价 13.5 元/个维持不变，账期月结 30 天不变。",
      ],
    ],
    icon: "💰",
    color: "#FFF8E1",
  },
  {
    id: "cv-b5c",
    type: BlockType.SubHeader,
    tokens: [["老王的新需求"]],
  },
  {
    id: "cv-b5d",
    type: BlockType.NumberedList,
    tokens: [
      [
        "定制 LOGO 印刷服务：老王希望为旗下门店定制带有星巴克加盟商标识的马克杯，预计首批 2,000 只",
      ],
    ],
  },
  {
    id: "cv-b5e",
    type: BlockType.NumberedList,
    tokens: [
      ["双层隔热玻璃杯试推：计划在 3 家精品咖啡门店试推，首批 500-800 只"],
    ],
  },
  {
    id: "cv-b5f",
    type: BlockType.NumberedList,
    tokens: [["手冲咖啡壶套装：老王对高端产品线表示兴趣，希望获取样品评估"]],
  },
  {
    id: "cv-b5g",
    type: BlockType.Quote,
    tokens: [
      [
        "\"老王原话：'你们的杯子在我店里是最好卖的，客户复购率很高。如果能做定制款，我愿意一次下 2000 只的单。玻璃杯我也想试试，现在精品咖啡很火。'\"",
      ],
    ],
  },
  {
    id: "cv-b5h",
    type: BlockType.SubHeader,
    tokens: [["关联文档"]],
  },
  {
    id: "cv-b5i",
    type: BlockType.Text,
    tokens: [
      ["⚠️ 注意：采购部已发布 "],
      [
        "@Q2 华东区供应链异常预警报告",
        [["ref", "canvas-supply-alert", "canvas"]],
      ],
      [
        "，景德镇宏图陶瓷交期不稳定，可能影响老王 Q2 的马克杯大单。请在确认订单前核实库存和交期。",
      ],
    ],
  },
  {
    id: "cv-b5j",
    type: BlockType.Text,
    tokens: [
      ["老王的专属服务门户已同步更新最新报价和库存信息，详见 "],
      ["@Hi，老王专属专区", [["ref", "canvas-client-portal", "canvas"]]],
      ["。"],
    ],
  },
  {
    id: "cv-b6",
    type: BlockType.SubHeader,
    tokens: [["Action Item"]],
  },
  {
    id: "cv-b7",
    type: BlockType.ToDo,
    tokens: [["要求销售运营在月底前更新系统报价配置"]],
    checked: false,
  },
  {
    id: "cv-b8",
    type: BlockType.ToDo,
    tokens: [["通知仓储部门预留 Q2 备货空间"]],
    checked: true,
  },
  {
    id: "cv-b9",
    type: BlockType.ToDo,
    tokens: [["联系景德镇宏图陶瓷确认定制 LOGO 印刷的工艺和报价"]],
    checked: false,
  },
  {
    id: "cv-b10",
    type: BlockType.ToDo,
    tokens: [["安排双层隔热玻璃杯和手冲咖啡壶套装样品寄送给老王"]],
    checked: false,
  },
  {
    id: "cv-b11",
    type: BlockType.ToDo,
    tokens: [["Q2 首月结束后提交授信额度正式调整申请"]],
    checked: false,
  },
  {
    id: "cv-b12",
    type: BlockType.Divider,
    tokens: [],
  },
  {
    id: "cv-b13",
    type: BlockType.SubHeader,
    tokens: [["附：关联数据"]],
  },
  {
    id: "cv-b14",
    type: BlockType.EmbedSheet,
    tokens: [["全渠道业务订单流水大表 — 老王相关订单"]],
    sheetId: "sheet-orders",
    viewFilter: { 下单客户: "老王" },
  },
];

/**
 * Document 2: Q2 East China Supply Chain Alert Report
 */
export const supplyAlertBlocks: Block[] = [
  {
    id: "sa-b1",
    type: BlockType.Header,
    tokens: [["Q2 华东区供应链异常预警报告"]],
  },
  {
    id: "sa-b1a",
    type: BlockType.Text,
    tokens: [
      ["标签: "],
      ["供应链预警", ["c"]],
      [", "],
      ["风险", ["c"]],
      [" | 作者: 采购部 | 日期: 2026-04-07"],
    ],
  },
  {
    id: "sa-b2",
    type: BlockType.Callout,
    tokens: [
      ["紧急预警：华东及部分华中地区窑炉面临停产风险，影响陶瓷类 SKU 交付"],
    ],
    icon: "⚠️",
    color: "rgba(255, 226, 221, 0.3)",
  },
  {
    id: "sa-b3",
    type: BlockType.SubHeader,
    tokens: [["宏观预警"]],
  },
  {
    id: "sa-b4",
    type: BlockType.Text,
    tokens: [
      [
        "因近期环保政策收紧（《华东地区工业窑炉排放专项整治方案》2026 年 4 月 1 日起实施），华东及部分华中地区窑炉面临停产或限产。受影响区域包括 ",
      ],
      ["景德镇、德化、潮州", ["b"]],
      [" 三大陶瓷产区。预计影响周期为 "],
      ["2-3 个月", ["b"]],
      ["（至 2026 年 6 月底）。"],
    ],
  },
  {
    id: "sa-b4a",
    type: BlockType.SubSubHeader,
    tokens: [["政策要点"]],
  },
  {
    id: "sa-b4b",
    type: BlockType.BulletedList,
    tokens: [["所有燃煤窑炉必须在 4 月 30 日前完成脱硫脱硝改造"]],
  },
  {
    id: "sa-b4c",
    type: BlockType.BulletedList,
    tokens: [["未达标企业将被强制停产整改"]],
  },
  {
    id: "sa-b4d",
    type: BlockType.BulletedList,
    tokens: [["天然气窑炉暂不受影响，但气价可能上涨 10-15%"]],
  },
  {
    id: "sa-b5",
    type: BlockType.SubHeader,
    tokens: [["波及评估"]],
  },
  {
    id: "sa-b6",
    type: BlockType.Text,
    tokens: [
      ["核心供应商 "],
      ["@景德镇宏图陶瓷", [["ref", "sheet-suppliers", "sheet", "row-jdz"]]],
      [
        " 发来函件，本月所有陶瓷类制品交期极不稳定，原定 3 天的 Lead Time 实际可能拉长至 ",
      ],
      ["5-7 天", ["b"]],
      ["。该供应商使用的是燃煤窑炉，正在紧急推进改造工程。"],
    ],
  },
  {
    id: "sa-b6a",
    type: BlockType.SubSubHeader,
    tokens: [["受影响 SKU 清单"]],
  },
  {
    id: "sa-b6b",
    type: BlockType.BulletedList,
    tokens: [
      ["@经典款陶瓷马克杯", [["ref", "sheet-inventory", "sheet", "row-mug01"]]],
      [" — 当前库存 200 只，安全线 500 只，"],
      ["严重不足", ["b"]],
    ],
  },
  {
    id: "sa-b6c",
    type: BlockType.BulletedList,
    tokens: [
      ["@简约白瓷餐盘", [["ref", "sheet-inventory", "sheet", "row-plate01"]]],
      [" — 当前库存 800 只，安全线 300 只，暂时安全"],
    ],
  },
  {
    id: "sa-b6d",
    type: BlockType.BulletedList,
    tokens: [
      ["@日式陶瓷碗", [["ref", "sheet-inventory", "sheet", "row-bowl01"]]],
      [" — 当前库存 650 只，安全线 200 只，暂时安全"],
    ],
  },
  {
    id: "sa-b6e",
    type: BlockType.Divider,
    tokens: [],
  },
  {
    id: "sa-b7",
    type: BlockType.SubHeader,
    tokens: [["指导意见"]],
  },
  {
    id: "sa-b8",
    type: BlockType.Quote,
    tokens: [
      [
        "涉及该供应商关联的 SKU，销售端在接急单时需人工介入审批或直接拒单。所有新订单必须经过库存可用性校验后方可确认。",
      ],
    ],
  },
  {
    id: "sa-b8a",
    type: BlockType.SubSubHeader,
    tokens: [["应对措施"]],
  },
  {
    id: "sa-b8b",
    type: BlockType.NumberedList,
    tokens: [["立即启动备选供应商德化白瓷工坊的准入流程，预计 2 周内完成"]],
  },
  {
    id: "sa-b8c",
    type: BlockType.NumberedList,
    tokens: [["对经典款陶瓷马克杯实施限量供应，优先保障 S 级客户订单"]],
  },
  {
    id: "sa-b8d",
    type: BlockType.NumberedList,
    tokens: [["与河北晶透玻璃沟通，评估玻璃替代方案的可行性"]],
  },
  {
    id: "sa-b8e",
    type: BlockType.NumberedList,
    tokens: [["通知所有 B2B 客户可能的交期延长，提前管理预期"]],
  },
  {
    id: "sa-b8f",
    type: BlockType.Callout,
    tokens: [
      [
        "📊 Research Bot 分析：根据历史数据，类似环保整治周期通常持续 2-3 个月。建议提前储备 2 个月的安全库存量，总预算约 ¥45 万。",
      ],
    ],
    icon: "📊",
    color: "rgba(221, 235, 255, 0.3)",
  },
  {
    id: "sa-b8g",
    type: BlockType.SubHeader,
    tokens: [["关联文档"]],
  },
  {
    id: "sa-b8h",
    type: BlockType.Text,
    tokens: [
      ["本次预警直接影响 S 级客户老王的 Q2 采购计划，详见 "],
      [
        "@重点客户 Q1 拜访与授信调整纪要",
        [["ref", "canvas-client-visit", "canvas"]],
      ],
      [" 中关于老王 Q2 马克杯采购量激增 300% 的记录。需优先保障其订单交付。"],
    ],
  },
  {
    id: "sa-b8i",
    type: BlockType.Text,
    tokens: [
      ["已在老王的专属服务门户中同步库存预警提示，详见 "],
      ["@Hi，老王专属专区", [["ref", "canvas-client-portal", "canvas"]]],
      ["。建议客户经理主动联系老王说明情况，提前管理预期。"],
    ],
  },
  {
    id: "sa-b9",
    type: BlockType.SubHeader,
    tokens: [["关联数据"]],
  },
  {
    id: "sa-b10",
    type: BlockType.EmbedSheet,
    tokens: [["全局 SKU 与动态库存表 — 景德镇宏图陶瓷关联产品"]],
    sheetId: "sheet-inventory",
    viewFilter: { 默认供应商: "景德镇宏图陶瓷" },
  },
  {
    id: "sa-b11",
    type: BlockType.EmbedSheet,
    tokens: [["供应商与产能评估表"]],
    sheetId: "sheet-suppliers",
  },
];

/**
 * Document 3: Client Portal — Lao Wang's Workspace
 */
export const clientPortalBlocks: Block[] = [
  {
    id: "cp-b1",
    type: BlockType.Header,
    tokens: [["Hi，老王专属专区"]],
  },
  {
    id: "cp-b2",
    type: BlockType.Text,
    tokens: [
      [
        "欢迎查看您的实时业务看板。以下数据实时同步自公司业务系统，您可以随时查看最新的报价、库存和订单状态。",
      ],
    ],
  },
  {
    id: "cp-b2a",
    type: BlockType.Callout,
    tokens: [
      [
        "👋 老王您好！您的 Q2 专属价格已确认：经典款陶瓷马克杯 ¥13.5/个（基准价 9 折），其他品类维持基准价 9 折。账期：月结 30 天。",
      ],
    ],
    icon: "👋",
    color: "rgba(221, 235, 255, 0.3)",
  },
  {
    id: "cp-b3",
    type: BlockType.SubHeader,
    tokens: [["我的专属报价单"]],
  },
  {
    id: "cp-b3a",
    type: BlockType.Text,
    tokens: [
      ["以下为您的专属 SKU 报价及实时库存。标注 "],
      ["⚠️", ["b"]],
      [" 的品类当前库存紧张，建议提前下单锁定。"],
    ],
  },
  {
    id: "cp-b4",
    type: BlockType.EmbedSheet,
    tokens: [["全局 SKU 与动态库存表 — 老王常采 SKU"]],
    sheetId: "sheet-inventory",
    viewFilter: { 默认供应商: "景德镇宏图陶瓷" },
  },
  {
    id: "cp-b5",
    type: BlockType.SubHeader,
    tokens: [["在途订单追踪"]],
  },
  {
    id: "cp-b5a",
    type: BlockType.Text,
    tokens: [
      ["以下为您当前所有未完结的订单。点击订单编号可查看详细履约进度。"],
    ],
  },
  {
    id: "cp-b6",
    type: BlockType.EmbedSheet,
    tokens: [["全渠道业务订单流水大表 — 老王在途订单"]],
    sheetId: "sheet-orders",
    viewFilter: { 下单客户: "老王" },
  },
  {
    id: "cp-b7",
    type: BlockType.SubHeader,
    tokens: [["一键补货指令区"]],
  },
  {
    id: "cp-b8",
    type: BlockType.Callout,
    tokens: [["填入数量并提交，系统将自动创建采购订单并通知仓储部门备货"]],
    icon: "💡",
    color: "rgba(221, 235, 255, 0.3)",
  },
  {
    id: "cp-b8a",
    type: BlockType.SubSubHeader,
    tokens: [["常用补货模板"]],
  },
  {
    id: "cp-b8b",
    type: BlockType.BulletedList,
    tokens: [["经典款陶瓷马克杯 × 500 只（月度常规补货）"]],
  },
  {
    id: "cp-b8c",
    type: BlockType.BulletedList,
    tokens: [["简约白瓷餐盘 × 200 只（月度常规补货）"]],
  },
  {
    id: "cp-b8d",
    type: BlockType.BulletedList,
    tokens: [["双层隔热玻璃杯 × 300 只（新品试推首批）"]],
  },
  {
    id: "cp-b8e",
    type: BlockType.SubHeader,
    tokens: [["相关动态"]],
  },
  {
    id: "cp-b8f",
    type: BlockType.Text,
    tokens: [
      ["📋 您的客户经理李明近期完成了一次拜访，详细记录见 "],
      [
        "@重点客户 Q1 拜访与授信调整纪要",
        [["ref", "canvas-client-visit", "canvas"]],
      ],
      ["。您提出的定制 LOGO 印刷和玻璃杯试推需求已记录在案，我们正在跟进中。"],
    ],
  },
  {
    id: "cp-b8g",
    type: BlockType.Callout,
    tokens: [
      [
        "⚠️ 供应链提示：受环保政策影响，部分陶瓷类 SKU 交期可能延长。详情请查看 ",
      ],
      [
        "@Q2 华东区供应链异常预警报告",
        [["ref", "canvas-supply-alert", "canvas"]],
      ],
      ["。建议提前下单锁定库存。"],
    ],
    icon: "⚠️",
    color: "rgba(255, 226, 221, 0.3)",
  },
  {
    id: "cp-b9",
    type: BlockType.Divider,
    tokens: [],
  },
  {
    id: "cp-b10",
    type: BlockType.SubHeader,
    tokens: [["联系您的专属客户经理"]],
  },
  {
    id: "cp-b11",
    type: BlockType.Text,
    tokens: [
      ["您的专属客户经理："],
      ["李明", ["b"]],
      [
        "（销售经理）\n电话：136-xxxx-7890 | 邮箱：liming@company.com\n服务时间：工作日 9:00-18:00，紧急事务可随时联系",
      ],
    ],
  },
];

/**
 * Lookup map: canvasId → Block[]
 */
export const allCanvasBlocks: Record<string, Block[]> = {
  "canvas-client-visit": clientVisitBlocks,
  "canvas-supply-alert": supplyAlertBlocks,
  "canvas-client-portal": clientPortalBlocks,
  "canvas-analysis-report": analysisReportBlocks,
  ...tocAllCanvasBlocks,
};
