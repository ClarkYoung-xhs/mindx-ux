import type { SheetData } from "../types/sheet";
import { BlockType } from "../types/block";
import type { Block } from "../types/block";
import { tocAllSheets } from "./tocSheetMockData";

/**
 * Table 1: Inventory_DB — Global SKU & Dynamic Inventory
 */
export const inventorySheet: SheetData = {
  id: "sheet-inventory",
  name: "全局 SKU 与动态库存表",
  keyColumnId: "inv-col-name",
  columns: [
    { id: "inv-col-sku", name: "SKU_ID", type: "text", width: 160 },
    { id: "inv-col-name", name: "品名", type: "text", width: 180 },
    { id: "inv-col-price", name: "基准售价(¥)", type: "number", width: 100 },
    { id: "inv-col-stock", name: "当前可用库存", type: "number", width: 110 },
    { id: "inv-col-safety", name: "安全库存线", type: "number", width: 100 },
    {
      id: "inv-col-supplier",
      name: "默认供应商",
      type: "relation",
      width: 160,
      relationConfig: {
        targetSheetId: "sheet-suppliers",
        targetColumnId: "sup-col-name",
      },
    },
    {
      id: "inv-col-lead",
      name: "生产交付周期(天)",
      type: "number",
      width: 130,
    },
  ],
  rows: [
    {
      id: "row-mug01",
      cells: {
        "inv-col-sku": "SKU-2026-MUG-01",
        "inv-col-name": "经典款陶瓷马克杯",
        "inv-col-price": 15.0,
        "inv-col-stock": 200,
        "inv-col-safety": 500,
        "inv-col-supplier": {
          targetId: "sheet-suppliers",
          targetType: "sheet",
          rowId: "row-jdz",
          displayText: "@景德镇宏图陶瓷",
        },
        "inv-col-lead": 3,
      },
      expandBlocks: [
        {
          id: "exp-mug01-1",
          type: BlockType.Header,
          tokens: [["产品档案：经典款陶瓷马克杯"]],
        },
        {
          id: "exp-mug01-2",
          type: BlockType.Text,
          tokens: [
            ["经典款陶瓷马克杯（SKU-2026-MUG-01）是公司 "],
            ["销量排名第一", ["b"]],
            [" 的核心单品，自 2019 年上线以来累计出货超过 "],
            ["50,000 只", ["b"]],
            [
              "。采用景德镇高温白瓷工艺，釉面光滑，适合日常饮品及咖啡连锁场景。",
            ],
          ],
        },
        {
          id: "exp-mug01-3",
          type: BlockType.SubHeader,
          tokens: [["产品规格"]],
        },
        {
          id: "exp-mug01-4",
          type: BlockType.BulletedList,
          tokens: [["容量：350ml，适配标准咖啡机出杯口"]],
        },
        {
          id: "exp-mug01-5",
          type: BlockType.BulletedList,
          tokens: [["材质：高温白瓷（1280°C 烧制），铅镉溶出量符合 GB 标准"]],
        },
        {
          id: "exp-mug01-6",
          type: BlockType.BulletedList,
          tokens: [["重量：约 320g，手感适中"]],
        },
        {
          id: "exp-mug01-7",
          type: BlockType.BulletedList,
          tokens: [["包装：单只牛皮纸盒 + 珍珠棉内衬，支持定制 LOGO 印刷"]],
        },
        {
          id: "exp-mug01-8",
          type: BlockType.SubHeader,
          tokens: [["库存预警分析"]],
        },
        {
          id: "exp-mug01-9",
          type: BlockType.Callout,
          tokens: [
            [
              "⚠️ 当前库存 200 只，低于安全库存线 500 只。缺口 300 只，建议立即触发补货流程。供应商景德镇宏图陶瓷当前产能「满载，可能延期」，需同步评估备选方案。",
            ],
          ],
          icon: "⚠️",
          color: "#FFF3E0",
        },
        {
          id: "exp-mug01-10",
          type: BlockType.SubHeader,
          tokens: [["销售趋势"]],
        },
        {
          id: "exp-mug01-11",
          type: BlockType.NumberedList,
          tokens: [["2025-Q4：季度出货 3,200 只，同比增长 12%"]],
        },
        {
          id: "exp-mug01-12",
          type: BlockType.NumberedList,
          tokens: [
            ["2026-Q1：季度出货 3,800 只，同比增长 18%（受老王新增门店拉动）"],
          ],
        },
        {
          id: "exp-mug01-13",
          type: BlockType.NumberedList,
          tokens: [["2026-Q2 预测：预计需求 5,000+ 只，需提前备货"]],
        },
        {
          id: "exp-mug01-14",
          type: BlockType.Quote,
          tokens: [
            [
              '"该 SKU 是 B2B 渠道的基石产品，复购率高达 85%。任何断货都会直接影响客户满意度和渠道信任。" —— 销售总监 周磊',
            ],
          ],
        },
      ],
    },
    {
      id: "row-plate01",
      cells: {
        "inv-col-sku": "SKU-2026-PLT-01",
        "inv-col-name": "简约白瓷餐盘",
        "inv-col-price": 22.0,
        "inv-col-stock": 800,
        "inv-col-safety": 300,
        "inv-col-supplier": {
          targetId: "sheet-suppliers",
          targetType: "sheet",
          rowId: "row-jdz",
          displayText: "@景德镇宏图陶瓷",
        },
        "inv-col-lead": 4,
      },
      expandBlocks: [
        {
          id: "exp-plt01-1",
          type: BlockType.Header,
          tokens: [["产品档案：简约白瓷餐盘"]],
        },
        {
          id: "exp-plt01-2",
          type: BlockType.Text,
          tokens: [
            ["简约白瓷餐盘（SKU-2026-PLT-01）于 2024-Q4 上线，定位 "],
            ["中高端商务餐饮", ["b"]],
            [
              " 场景。直径 21cm，边缘微弧设计，适合西式简餐和咖啡甜点摆盘。当前库存 ",
            ],
            ["800 只", ["b"]],
            ["，高于安全线，供应稳定。"],
          ],
        },
        {
          id: "exp-plt01-3",
          type: BlockType.SubHeader,
          tokens: [["产品特点"]],
        },
        {
          id: "exp-plt01-4",
          type: BlockType.BulletedList,
          tokens: [["骨瓷级白度，釉面抗刮耐磨，适合高频次商用洗碗机清洗"]],
        },
        {
          id: "exp-plt01-5",
          type: BlockType.BulletedList,
          tokens: [["可叠放设计，节省门店储物空间"]],
        },
        {
          id: "exp-plt01-6",
          type: BlockType.BulletedList,
          tokens: [["支持丝印 / 烫金定制，最小起订量 200 只"]],
        },
        {
          id: "exp-plt01-7",
          type: BlockType.SubHeader,
          tokens: [["客户反馈摘要"]],
        },
        {
          id: "exp-plt01-8",
          type: BlockType.Quote,
          tokens: [
            [
              '"餐盘质感很好，客户反馈摆盘效果提升明显，复购意愿强。" —— 华东区-瑞幸代理商-老张',
            ],
          ],
        },
        {
          id: "exp-plt01-9",
          type: BlockType.Text,
          tokens: [
            ["目前主要客户为 "],
            [
              "@华东区-瑞幸代理商-老张",
              [["ref", "sheet-crm", "sheet", "row-laozhang"]],
            ],
            ["，月均采购约 200 只。华中区老王也在评估引入该品类。"],
          ],
        },
      ],
    },
    {
      id: "row-cup01",
      cells: {
        "inv-col-sku": "SKU-2026-CUP-01",
        "inv-col-name": "双层隔热玻璃杯",
        "inv-col-price": 28.0,
        "inv-col-stock": 1200,
        "inv-col-safety": 400,
        "inv-col-supplier": {
          targetId: "sheet-suppliers",
          targetType: "sheet",
          rowId: "row-hb",
          displayText: "@河北晶透玻璃",
        },
        "inv-col-lead": 5,
      },
      expandBlocks: [
        {
          id: "exp-cup01-1",
          type: BlockType.Header,
          tokens: [["产品档案：双层隔热玻璃杯"]],
        },
        {
          id: "exp-cup01-2",
          type: BlockType.Text,
          tokens: [
            [
              "双层隔热玻璃杯（SKU-2026-CUP-01）采用高硼硅玻璃双层真空工艺，隔热效果优异，是公司 ",
            ],
            ["毛利率最高", ["b"]],
            [
              " 的单品（毛利率约 42%）。当前库存充足（1,200 只），供应商河北晶透玻璃产能正常。",
            ],
          ],
        },
        {
          id: "exp-cup01-3",
          type: BlockType.SubHeader,
          tokens: [["技术参数"]],
        },
        {
          id: "exp-cup01-4",
          type: BlockType.BulletedList,
          tokens: [["容量：300ml，适合手冲咖啡和精品茶饮"]],
        },
        {
          id: "exp-cup01-5",
          type: BlockType.BulletedList,
          tokens: [["材质：高硼硅玻璃（耐温差 150°C），双层真空隔热"]],
        },
        {
          id: "exp-cup01-6",
          type: BlockType.BulletedList,
          tokens: [["重量：约 180g，轻盈通透"]],
        },
        {
          id: "exp-cup01-7",
          type: BlockType.BulletedList,
          tokens: [["外观：透明双层结构，饮品悬浮视觉效果，适合社交媒体传播"]],
        },
        {
          id: "exp-cup01-8",
          type: BlockType.SubHeader,
          tokens: [["市场机会"]],
        },
        {
          id: "exp-cup01-9",
          type: BlockType.Text,
          tokens: [
            ["老王（"],
            [
              "@华中区-星巴克加盟商-老王",
              [["ref", "sheet-crm", "sheet", "row-laowang"]],
            ],
            [
              "）在 2026-03-15 拜访中明确表示希望 Q2 引入该品类。预计首批采购量 ",
            ],
            ["500-800 只", ["b"]],
            ["，若市场反馈良好，年采购量可达 3,000+ 只。"],
          ],
        },
        {
          id: "exp-cup01-10",
          type: BlockType.Callout,
          tokens: [
            [
              "💡 建议：该 SKU 毛利高、供应稳定，是扩大 B2B 渠道份额的战略品类。建议为老王提供首批试用优惠（基准价 9 折），加速渠道渗透。",
            ],
          ],
          icon: "💡",
          color: "#E3F2FD",
        },
      ],
    },
    {
      id: "row-bowl01",
      cells: {
        "inv-col-sku": "SKU-2026-BWL-01",
        "inv-col-name": "日式陶瓷碗",
        "inv-col-price": 18.0,
        "inv-col-stock": 650,
        "inv-col-safety": 200,
        "inv-col-supplier": {
          targetId: "sheet-suppliers",
          targetType: "sheet",
          rowId: "row-jdz",
          displayText: "@景德镇宏图陶瓷",
        },
        "inv-col-lead": 4,
      },
      expandBlocks: [
        {
          id: "exp-bwl01-1",
          type: BlockType.Header,
          tokens: [["产品档案：日式陶瓷碗"]],
        },
        {
          id: "exp-bwl01-2",
          type: BlockType.Text,
          tokens: [
            ["日式陶瓷碗（SKU-2026-BWL-01）是 2026-Q1 新上线的品类，定位 "],
            ["日式简餐与轻食", ["b"]],
            [
              " 场景。采用手工拉坯工艺，釉色温润，口径 15cm，适合沙拉、甜品和小份主食。",
            ],
          ],
        },
        {
          id: "exp-bwl01-3",
          type: BlockType.SubHeader,
          tokens: [["上线背景"]],
        },
        {
          id: "exp-bwl01-4",
          type: BlockType.Text,
          tokens: [
            ["该品类源于华南区新客户 "],
            [
              "@华南区-喜茶供应商-老李",
              [["ref", "sheet-crm", "sheet", "row-laoli"]],
            ],
            [
              " 的定制需求。喜茶门店推出轻食套餐后，对日式风格餐具需求激增。首批试产 800 只，目前库存 650 只。",
            ],
          ],
        },
        {
          id: "exp-bwl01-5",
          type: BlockType.SubHeader,
          tokens: [["质检记录"]],
        },
        {
          id: "exp-bwl01-6",
          type: BlockType.NumberedList,
          tokens: [["2026-01-15：首批样品通过 SGS 食品接触材料检测"]],
        },
        {
          id: "exp-bwl01-7",
          type: BlockType.NumberedList,
          tokens: [["2026-02-01：量产首批 800 只，良品率 96.5%"]],
        },
        {
          id: "exp-bwl01-8",
          type: BlockType.NumberedList,
          tokens: [["2026-03-10：客户验收通过，反馈釉色一致性良好"]],
        },
      ],
    },
    {
      id: "row-kettle01",
      cells: {
        "inv-col-sku": "SKU-2026-KTL-01",
        "inv-col-name": "手冲咖啡壶套装",
        "inv-col-price": 68.0,
        "inv-col-stock": 150,
        "inv-col-safety": 100,
        "inv-col-supplier": {
          targetId: "sheet-suppliers",
          targetType: "sheet",
          rowId: "row-hb",
          displayText: "@河北晶透玻璃",
        },
        "inv-col-lead": 7,
      },
      expandBlocks: [
        {
          id: "exp-ktl01-1",
          type: BlockType.Header,
          tokens: [["产品档案：手冲咖啡壶套装"]],
        },
        {
          id: "exp-ktl01-2",
          type: BlockType.Text,
          tokens: [
            ["手冲咖啡壶套装（SKU-2026-KTL-01）是公司 "],
            ["高端产品线", ["b"]],
            [
              " 的旗舰单品，包含高硼硅玻璃分享壶（600ml）+ 不锈钢滤网 + 木质底座。定位精品咖啡馆和高端商务场景。",
            ],
          ],
        },
        {
          id: "exp-ktl01-3",
          type: BlockType.SubHeader,
          tokens: [["套装内容"]],
        },
        {
          id: "exp-ktl01-4",
          type: BlockType.BulletedList,
          tokens: [["高硼硅玻璃分享壶 × 1（600ml，带刻度线）"]],
        },
        {
          id: "exp-ktl01-5",
          type: BlockType.BulletedList,
          tokens: [["304 不锈钢双层滤网 × 1（免滤纸设计）"]],
        },
        {
          id: "exp-ktl01-6",
          type: BlockType.BulletedList,
          tokens: [["胡桃木底座 × 1（防滑硅胶垫）"]],
        },
        {
          id: "exp-ktl01-7",
          type: BlockType.BulletedList,
          tokens: [["精装礼盒包装，适合企业礼品采购"]],
        },
        {
          id: "exp-ktl01-8",
          type: BlockType.Callout,
          tokens: [
            [
              "📦 库存提醒：当前库存 150 套，接近安全线 100 套。该产品交付周期较长（7 天），建议保持 2 周滚动备货。",
            ],
          ],
          icon: "📦",
          color: "#FFF8E1",
        },
      ],
    },
  ],
};

/**
 * Table 2: CRM_DB — B2B Customer Profiles & Credit
 */
export const crmSheet: SheetData = {
  id: "sheet-crm",
  name: "B2B 客户档案与授信表",
  keyColumnId: "crm-col-name",
  columns: [
    { id: "crm-col-name", name: "客户名称", type: "text", width: 200 },
    {
      id: "crm-col-rating",
      name: "客户评级",
      type: "status",
      width: 100,
      statusOptions: [
        { label: "S 级", color: "#6A1B9A" },
        { label: "A 级", color: "#1565C0" },
        { label: "B 级", color: "#2E7D32" },
      ],
    },
    { id: "crm-col-terms", name: "账期与折扣", type: "text", width: 160 },
    {
      id: "crm-col-complaint",
      name: "历史客诉状态",
      type: "status",
      width: 120,
      statusOptions: [
        { label: "无异常", color: "#2E7D32" },
        { label: "有记录", color: "#E65100" },
      ],
    },
    {
      id: "crm-col-context",
      name: "关联上下文",
      type: "relation",
      width: 220,
      relationConfig: { targetSheetId: "canvas-client-visit" },
    },
  ],
  rows: [
    {
      id: "row-laowang",
      cells: {
        "crm-col-name": "华中区-星巴克加盟商-老王",
        "crm-col-rating": "S 级",
        "crm-col-terms": "月结 30 天，基准价 9 折",
        "crm-col-complaint": "无异常",
        "crm-col-context": {
          targetId: "canvas-client-visit",
          targetType: "canvas",
          displayText: "@重点客户 Q1 拜访纪要",
        },
      },
      expandBlocks: [
        {
          id: "exp-lw-1",
          type: BlockType.Header,
          tokens: [["客户背景"]],
        },
        {
          id: "exp-lw-2",
          type: BlockType.Text,
          tokens: [
            [
              "老王（王建国），湖北武汉人，2019 年起成为星巴克华中区核心加盟商。目前运营 ",
            ],
            ["12 家门店", ["b"]],
            ["，覆盖武汉、长沙两地商圈，年采购额稳定在 "],
            ["200 万+", ["b"]],
            ["。"],
          ],
        },
        {
          id: "exp-lw-3",
          type: BlockType.SubHeader,
          tokens: [["合作历史"]],
        },
        {
          id: "exp-lw-4",
          type: BlockType.BulletedList,
          tokens: [
            ["2019-Q3：首次合作，试采经典款陶瓷马克杯 500 只，反馈良好"],
          ],
        },
        {
          id: "exp-lw-5",
          type: BlockType.BulletedList,
          tokens: [["2020-Q1：签订年度框架协议，授信额度提升至 50 万"]],
        },
        {
          id: "exp-lw-6",
          type: BlockType.BulletedList,
          tokens: [["2024-Q4：新增简约白瓷餐盘品类，门店扩展至长沙"]],
        },
        {
          id: "exp-lw-7",
          type: BlockType.BulletedList,
          tokens: [["2025-Q2：升级为 S 级客户，账期延长至月结 30 天"]],
        },
        {
          id: "exp-lw-8",
          type: BlockType.SubHeader,
          tokens: [["最近拜访记录摘要"]],
        },
        {
          id: "exp-lw-9",
          type: BlockType.Text,
          tokens: [
            ["2026-03-15 ", ["b"]],
            [
              "｜销售经理李明拜访武汉旗舰店。老王反馈 Q1 马克杯销量同比增长 15%，希望 Q2 追加 ",
            ],
            [
              "双层隔热玻璃杯",
              [["ref", "sheet-inventory", "sheet", "row-cup01"]],
            ],
            [" 品类。同时提出希望获得定制 LOGO 印刷服务。"],
          ],
        },
        {
          id: "exp-lw-10",
          type: BlockType.Quote,
          tokens: [
            [
              "\"老王原话：'你们的杯子在我店里是最好卖的，客户复购率很高。如果能做定制款，我愿意一次下 2000 只的单。'\"",
            ],
          ],
        },
        {
          id: "exp-lw-11",
          type: BlockType.Callout,
          tokens: [
            [
              "授信备注：当前授信额度 50 万，已用 32 万，剩余 18 万。建议 Q2 评审时提升至 80 万以匹配业务增长。",
            ],
          ],
          icon: "💰",
          color: "#FFF8E1",
        },
      ],
    },
    {
      id: "row-laozhang",
      cells: {
        "crm-col-name": "华东区-瑞幸代理商-老张",
        "crm-col-rating": "A 级",
        "crm-col-terms": "月结 15 天，基准价 95 折",
        "crm-col-complaint": "无异常",
        "crm-col-context": null,
      },
      expandBlocks: [
        {
          id: "exp-lz-1",
          type: BlockType.Header,
          tokens: [["客户概况"]],
        },
        {
          id: "exp-lz-2",
          type: BlockType.Text,
          tokens: [
            [
              "老张（张伟），上海人，2022 年起代理瑞幸华东区门店餐具采购。目前负责 ",
            ],
            ["6 家门店", ["b"]],
            [
              " 的杯具与餐盘供应，年采购额约 80 万。合作稳定，按时回款，无客诉记录。",
            ],
          ],
        },
        {
          id: "exp-lz-3",
          type: BlockType.SubHeader,
          tokens: [["合作历史"]],
        },
        {
          id: "exp-lz-4",
          type: BlockType.BulletedList,
          tokens: [["2022-Q2：首次合作，采购简约白瓷餐盘 300 只用于新店开业"]],
        },
        {
          id: "exp-lz-5",
          type: BlockType.BulletedList,
          tokens: [["2023-Q1：签订年度框架协议，月均采购量稳定在 200 只"]],
        },
        {
          id: "exp-lz-6",
          type: BlockType.BulletedList,
          tokens: [["2024-Q3：评级提升至 A 级，账期延长至月结 15 天"]],
        },
        {
          id: "exp-lz-7",
          type: BlockType.BulletedList,
          tokens: [["2025-Q4：新增经典款陶瓷马克杯品类，门店扩展至杭州"]],
        },
        {
          id: "exp-lz-8",
          type: BlockType.SubHeader,
          tokens: [["业务分析"]],
        },
        {
          id: "exp-lz-9",
          type: BlockType.Text,
          tokens: [
            ["老张的采购特点是 "],
            ["稳定、规律、低风险", ["b"]],
            [
              "。每月固定下单，从不拖欠货款。虽然单次采购量不如老王，但胜在持续性强，是公司华东区的基石客户。",
            ],
          ],
        },
        {
          id: "exp-lz-10",
          type: BlockType.Callout,
          tokens: [
            [
              "💡 升级建议：老张目前 A 级，若 2026 年采购额突破 100 万，建议评审升级为 S 级并延长账期至月结 30 天，以巩固华东区渠道。",
            ],
          ],
          icon: "💡",
          color: "#E3F2FD",
        },
      ],
    },
    {
      id: "row-laoli",
      cells: {
        "crm-col-name": "华南区-喜茶供应商-老李",
        "crm-col-rating": "B 级",
        "crm-col-terms": "预付款，基准价全价",
        "crm-col-complaint": "无异常",
        "crm-col-context": null,
      },
      expandBlocks: [
        {
          id: "exp-ll-1",
          type: BlockType.Header,
          tokens: [["客户概况"]],
        },
        {
          id: "exp-ll-2",
          type: BlockType.Text,
          tokens: [
            ["老李（李志强），深圳人，2026-Q1 新开发客户。负责喜茶华南区 "],
            ["4 家门店", ["b"]],
            [" 的餐具采购。喜茶近期推出轻食产品线，对日式风格餐具有强烈需求。"],
          ],
        },
        {
          id: "exp-ll-3",
          type: BlockType.SubHeader,
          tokens: [["合作进展"]],
        },
        {
          id: "exp-ll-4",
          type: BlockType.NumberedList,
          tokens: [["2026-01-10：首次接洽，老李提出日式陶瓷碗定制需求"]],
        },
        {
          id: "exp-ll-5",
          type: BlockType.NumberedList,
          tokens: [["2026-02-01：样品确认通过，首批下单 800 只日式陶瓷碗"]],
        },
        {
          id: "exp-ll-6",
          type: BlockType.NumberedList,
          tokens: [["2026-03-10：首批交付完成，客户验收通过"]],
        },
        {
          id: "exp-ll-7",
          type: BlockType.NumberedList,
          tokens: [["2026-04-05：老李反馈门店销售良好，计划 Q2 追加采购"]],
        },
        {
          id: "exp-ll-8",
          type: BlockType.SubHeader,
          tokens: [["风险评估"]],
        },
        {
          id: "exp-ll-9",
          type: BlockType.Text,
          tokens: [
            [
              "作为新客户，老李目前为 B 级评级，采用预付款模式。合作仅一个季度，需持续观察回款表现和采购稳定性。若 Q2 合作顺利，建议 Q3 评审时考虑升级至 A 级并开放账期。",
            ],
          ],
        },
        {
          id: "exp-ll-10",
          type: BlockType.ToDo,
          tokens: [["Q2 结束后评估老李的采购稳定性和回款记录"]],
          checked: false,
        },
        {
          id: "exp-ll-11",
          type: BlockType.ToDo,
          tokens: [["与喜茶总部确认华南区餐具采购的长期规划"]],
          checked: false,
        },
      ],
    },
    {
      id: "row-laosun",
      cells: {
        "crm-col-name": "西南区-Manner代理商-老孙",
        "crm-col-rating": "A 级",
        "crm-col-terms": "月结 15 天，基准价 95 折",
        "crm-col-complaint": "有记录",
        "crm-col-context": null,
      },
      expandBlocks: [
        {
          id: "exp-ls-1",
          type: BlockType.Header,
          tokens: [["客户概况"]],
        },
        {
          id: "exp-ls-2",
          type: BlockType.Text,
          tokens: [
            [
              "老孙（孙明辉），成都人，2021 年起代理 Manner 西南区门店餐具采购。目前负责 ",
            ],
            ["8 家门店", ["b"]],
            [" 的杯具供应，年采购额约 120 万。是公司西南区最大的 B2B 客户。"],
          ],
        },
        {
          id: "exp-ls-3",
          type: BlockType.SubHeader,
          tokens: [["客诉记录"]],
        },
        {
          id: "exp-ls-4",
          type: BlockType.Callout,
          tokens: [
            [
              "⚠️ 2025-Q3 客诉事件：一批经典款陶瓷马克杯（200 只）出现釉面气泡问题，客户要求全额退换。经调查为供应商景德镇宏图陶瓷该批次窑温控制异常所致。已全额退换并补偿 5% 货值折扣。",
            ],
          ],
          icon: "⚠️",
          color: "#FFEBEE",
        },
        {
          id: "exp-ls-5",
          type: BlockType.SubHeader,
          tokens: [["后续跟进"]],
        },
        {
          id: "exp-ls-6",
          type: BlockType.Text,
          tokens: [
            [
              "客诉事件后，老孙对产品质量更加敏感。我们已加强来料质检流程，并为老孙的订单增加了 ",
            ],
            ["双重抽检环节", ["b"]],
            ["。2025-Q4 至今未再出现质量问题，客户关系已恢复正常。"],
          ],
        },
        {
          id: "exp-ls-7",
          type: BlockType.ToDo,
          tokens: [["每批次发货前执行双重抽检并拍照存档"]],
          checked: true,
        },
        {
          id: "exp-ls-8",
          type: BlockType.ToDo,
          tokens: [["Q2 安排销售经理赴成都拜访，巩固客户关系"]],
          checked: false,
        },
      ],
    },
  ],
};

/**
 * Table 3: Order_DB — Omni-channel Order Ledger
 */
export const ordersSheet: SheetData = {
  id: "sheet-orders",
  name: "全渠道业务订单流水大表",
  keyColumnId: "ord-col-id",
  columns: [
    { id: "ord-col-id", name: "订单编号", type: "text", width: 180 },
    {
      id: "ord-col-customer",
      name: "下单客户",
      type: "relation",
      width: 200,
      relationConfig: {
        targetSheetId: "sheet-crm",
        targetColumnId: "crm-col-name",
      },
    },
    {
      id: "ord-col-sku",
      name: "关联 SKU",
      type: "relation",
      width: 180,
      relationConfig: {
        targetSheetId: "sheet-inventory",
        targetColumnId: "inv-col-name",
      },
    },
    { id: "ord-col-qty", name: "需求数量", type: "number", width: 100 },
    {
      id: "ord-col-status",
      name: "履约状态",
      type: "status",
      width: 120,
      statusOptions: [
        { label: "待审核", color: "#E65100" },
        { label: "库存锁定", color: "#1565C0" },
        { label: "采购中", color: "#283593" },
        { label: "已发货", color: "#2E7D32" },
        { label: "已签收", color: "#33691E" },
      ],
    },
    { id: "ord-col-deadline", name: "交付截止日", type: "date", width: 120 },
  ],
  rows: [
    {
      id: "row-ord001",
      cells: {
        "ord-col-id": "ORD-20260408-001",
        "ord-col-customer": {
          targetId: "sheet-crm",
          targetType: "sheet",
          rowId: "row-laowang",
          displayText: "@华中区-星巴克加盟商-老王",
        },
        "ord-col-sku": {
          targetId: "sheet-inventory",
          targetType: "sheet",
          rowId: "row-mug01",
          displayText: "@经典款陶瓷马克杯",
        },
        "ord-col-qty": 500,
        "ord-col-status": "待审核",
        "ord-col-deadline": "2026-04-10",
      },
      expandBlocks: [
        {
          id: "exp-ord1-1",
          type: BlockType.Header,
          tokens: [["订单审批备注"]],
        },
        {
          id: "exp-ord1-2",
          type: BlockType.Text,
          tokens: [
            [
              "本订单为老王 Q2 首批采购，需求 500 只经典款陶瓷马克杯。当前库存仅 ",
            ],
            ["200 只", ["b"]],
            ["，缺口 300 只需触发供应商补货流程。"],
          ],
        },
        {
          id: "exp-ord1-3",
          type: BlockType.SubHeader,
          tokens: [["履约风险评估"]],
        },
        {
          id: "exp-ord1-4",
          type: BlockType.BulletedList,
          tokens: [["库存缺口：300 只，需向景德镇宏图陶瓷下达补货订单"]],
        },
        {
          id: "exp-ord1-5",
          type: BlockType.BulletedList,
          tokens: [
            [
              "供应商产能：当前「满载，可能延期」，标准交期 3 天可能延至 5-7 天",
            ],
          ],
        },
        {
          id: "exp-ord1-6",
          type: BlockType.BulletedList,
          tokens: [["交付截止日：2026-04-10，时间紧迫"]],
        },
        {
          id: "exp-ord1-7",
          type: BlockType.Callout,
          tokens: [
            [
              "⚠️ 供应商景德镇宏图陶瓷当前产能状态为「满载，可能延期」，建议提前 2 周下达采购计划，并同步联系备选供应商河北晶透玻璃评估替代方案。",
            ],
          ],
          icon: "⚠️",
          color: "#FFF3E0",
        },
        {
          id: "exp-ord1-8",
          type: BlockType.SubHeader,
          tokens: [["建议处理方案"]],
        },
        {
          id: "exp-ord1-9",
          type: BlockType.NumberedList,
          tokens: [["先锁定现有库存 200 只，状态变更为「库存锁定」"]],
        },
        {
          id: "exp-ord1-10",
          type: BlockType.NumberedList,
          tokens: [["同步向景德镇宏图陶瓷下达 300 只紧急补货订单"]],
        },
        {
          id: "exp-ord1-11",
          type: BlockType.NumberedList,
          tokens: [
            ["与老王沟通分批交付方案：首批 200 只 4/10 发出，余量 4/15 前补齐"],
          ],
        },
      ],
    },
    {
      id: "row-ord002",
      cells: {
        "ord-col-id": "ORD-20260405-003",
        "ord-col-customer": {
          targetId: "sheet-crm",
          targetType: "sheet",
          rowId: "row-laozhang",
          displayText: "@华东区-瑞幸代理商-老张",
        },
        "ord-col-sku": {
          targetId: "sheet-inventory",
          targetType: "sheet",
          rowId: "row-plate01",
          displayText: "@简约白瓷餐盘",
        },
        "ord-col-qty": 200,
        "ord-col-status": "已发货",
        "ord-col-deadline": "2026-04-08",
      },
      expandBlocks: [
        {
          id: "exp-ord2-1",
          type: BlockType.Header,
          tokens: [["订单履约记录"]],
        },
        {
          id: "exp-ord2-2",
          type: BlockType.Text,
          tokens: [
            [
              "本订单为老张 4 月常规采购，200 只简约白瓷餐盘。库存充足（800 只），已于 ",
            ],
            ["2026-04-06", ["b"]],
            [" 完成发货，预计 4/8 送达上海仓库。"],
          ],
        },
        {
          id: "exp-ord2-3",
          type: BlockType.SubHeader,
          tokens: [["物流信息"]],
        },
        {
          id: "exp-ord2-4",
          type: BlockType.BulletedList,
          tokens: [["承运商：顺丰速运"]],
        },
        {
          id: "exp-ord2-5",
          type: BlockType.BulletedList,
          tokens: [["运单号：SF1234567890"]],
        },
        {
          id: "exp-ord2-6",
          type: BlockType.BulletedList,
          tokens: [["发货时间：2026-04-06 14:30"]],
        },
        {
          id: "exp-ord2-7",
          type: BlockType.BulletedList,
          tokens: [["预计到达：2026-04-08 10:00"]],
        },
        {
          id: "exp-ord2-8",
          type: BlockType.Callout,
          tokens: [
            [
              "✅ 本订单履约顺利，库存充足，无风险。老张的月度采购节奏稳定，建议维持当前备货策略。",
            ],
          ],
          icon: "✅",
          color: "#E8F5E9",
        },
      ],
    },
    {
      id: "row-ord003",
      cells: {
        "ord-col-id": "ORD-20260407-005",
        "ord-col-customer": {
          targetId: "sheet-crm",
          targetType: "sheet",
          rowId: "row-laoli",
          displayText: "@华南区-喜茶供应商-老李",
        },
        "ord-col-sku": {
          targetId: "sheet-inventory",
          targetType: "sheet",
          rowId: "row-bowl01",
          displayText: "@日式陶瓷碗",
        },
        "ord-col-qty": 300,
        "ord-col-status": "库存锁定",
        "ord-col-deadline": "2026-04-12",
      },
      expandBlocks: [
        {
          id: "exp-ord3-1",
          type: BlockType.Header,
          tokens: [["订单处理备注"]],
        },
        {
          id: "exp-ord3-2",
          type: BlockType.Text,
          tokens: [
            [
              "老李 Q2 首批追加订单，300 只日式陶瓷碗。当前库存 650 只，已锁定 300 只，剩余可用库存 350 只。",
            ],
          ],
        },
        {
          id: "exp-ord3-3",
          type: BlockType.SubHeader,
          tokens: [["客户备注"]],
        },
        {
          id: "exp-ord3-4",
          type: BlockType.Quote,
          tokens: [
            [
              '"老李要求本批次碗的釉色与首批保持一致（色号 #F5F0E8），并在碗底加印喜茶 LOGO。" —— 销售代表 陈晓',
            ],
          ],
        },
        {
          id: "exp-ord3-5",
          type: BlockType.ToDo,
          tokens: [["确认景德镇宏图陶瓷可按指定色号生产"]],
          checked: true,
        },
        {
          id: "exp-ord3-6",
          type: BlockType.ToDo,
          tokens: [["LOGO 印刷文件已发送至供应商确认"]],
          checked: true,
        },
        {
          id: "exp-ord3-7",
          type: BlockType.ToDo,
          tokens: [["安排 4/10 发货，4/12 前送达深圳仓"]],
          checked: false,
        },
      ],
    },
    {
      id: "row-ord004",
      cells: {
        "ord-col-id": "ORD-20260408-007",
        "ord-col-customer": {
          targetId: "sheet-crm",
          targetType: "sheet",
          rowId: "row-laosun",
          displayText: "@西南区-Manner代理商-老孙",
        },
        "ord-col-sku": {
          targetId: "sheet-inventory",
          targetType: "sheet",
          rowId: "row-cup01",
          displayText: "@双层隔热玻璃杯",
        },
        "ord-col-qty": 400,
        "ord-col-status": "采购中",
        "ord-col-deadline": "2026-04-15",
      },
      expandBlocks: [
        {
          id: "exp-ord4-1",
          type: BlockType.Header,
          tokens: [["订单采购跟踪"]],
        },
        {
          id: "exp-ord4-2",
          type: BlockType.Text,
          tokens: [
            [
              "老孙本次采购 400 只双层隔热玻璃杯，用于 Manner 成都新开的 2 家门店。当前库存 1,200 只，可直接满足。但老孙要求 ",
            ],
            ["定制磨砂 LOGO", ["b"]],
            ["，需供应商河北晶透玻璃额外加工，预计增加 2 天工期。"],
          ],
        },
        {
          id: "exp-ord4-3",
          type: BlockType.SubHeader,
          tokens: [["定制加工进度"]],
        },
        {
          id: "exp-ord4-4",
          type: BlockType.NumberedList,
          tokens: [["4/8：LOGO 文件确认，供应商开始备料"]],
        },
        {
          id: "exp-ord4-5",
          type: BlockType.NumberedList,
          tokens: [["4/10（预计）：磨砂印刷完成，进入质检"]],
        },
        {
          id: "exp-ord4-6",
          type: BlockType.NumberedList,
          tokens: [["4/12（预计）：发货，4/15 前送达成都仓"]],
        },
        {
          id: "exp-ord4-7",
          type: BlockType.Callout,
          tokens: [
            [
              "📋 注意：老孙此前有过质量客诉记录，本批次需执行双重抽检流程。质检通过后方可发货。",
            ],
          ],
          icon: "📋",
          color: "#FFF8E1",
        },
      ],
    },
    {
      id: "row-ord005",
      cells: {
        "ord-col-id": "ORD-20260403-002",
        "ord-col-customer": {
          targetId: "sheet-crm",
          targetType: "sheet",
          rowId: "row-laowang",
          displayText: "@华中区-星巴克加盟商-老王",
        },
        "ord-col-sku": {
          targetId: "sheet-inventory",
          targetType: "sheet",
          rowId: "row-plate01",
          displayText: "@简约白瓷餐盘",
        },
        "ord-col-qty": 150,
        "ord-col-status": "已签收",
        "ord-col-deadline": "2026-04-06",
      },
      expandBlocks: [
        {
          id: "exp-ord5-1",
          type: BlockType.Header,
          tokens: [["订单完结记录"]],
        },
        {
          id: "exp-ord5-2",
          type: BlockType.Text,
          tokens: [
            ["老王 3 月底追加的 150 只简约白瓷餐盘已于 "],
            ["2026-04-05", ["b"]],
            [" 签收完毕。本批次为老王长沙新店开业备货，质量验收通过，无异常。"],
          ],
        },
        {
          id: "exp-ord5-3",
          type: BlockType.SubHeader,
          tokens: [["签收确认"]],
        },
        {
          id: "exp-ord5-4",
          type: BlockType.BulletedList,
          tokens: [["签收人：老王（王建国）"]],
        },
        {
          id: "exp-ord5-5",
          type: BlockType.BulletedList,
          tokens: [["签收时间：2026-04-05 16:20"]],
        },
        {
          id: "exp-ord5-6",
          type: BlockType.BulletedList,
          tokens: [["验收结果：全部合格，无破损"]],
        },
        {
          id: "exp-ord5-7",
          type: BlockType.Quote,
          tokens: [
            [
              "\"老王反馈：'餐盘质量不错，长沙店开业当天就用上了，客户评价很好。'\"",
            ],
          ],
        },
      ],
    },
  ],
};

/**
 * Table 4: Supplier_DB — Supplier & Capacity Assessment
 */
export const suppliersSheet: SheetData = {
  id: "sheet-suppliers",
  name: "供应商与产能评估表",
  keyColumnId: "sup-col-name",
  columns: [
    { id: "sup-col-name", name: "供应商名称", type: "text", width: 180 },
    { id: "sup-col-category", name: "主供品类", type: "text", width: 140 },
    {
      id: "sup-col-capacity",
      name: "当前产能状态",
      type: "status",
      width: 140,
      statusOptions: [
        { label: "正常", color: "#2E7D32" },
        { label: "满载，可能延期", color: "#E65100" },
        { label: "停产", color: "#C62828" },
      ],
    },
    { id: "sup-col-contact", name: "联系方式", type: "text", width: 160 },
    { id: "sup-col-note", name: "备注", type: "text", width: 200 },
  ],
  rows: [
    {
      id: "row-jdz",
      cells: {
        "sup-col-name": "景德镇宏图陶瓷",
        "sup-col-category": "杯具、餐盘、陶瓷碗",
        "sup-col-capacity": "满载，可能延期",
        "sup-col-contact": "张经理 138-xxxx-1234",
        "sup-col-note": "受环保政策影响，交期不稳定（详见供应链预警报告）",
      },
      expandBlocks: [
        {
          id: "exp-jdz-1",
          type: BlockType.Header,
          tokens: [["供应商档案：景德镇宏图陶瓷"]],
        },
        {
          id: "exp-jdz-2",
          type: BlockType.Text,
          tokens: [
            [
              "景德镇宏图陶瓷有限公司，成立于 2005 年，位于江西省景德镇市陶瓷工业园区。是公司 ",
            ],
            ["最核心的陶瓷类供应商", ["b"]],
            [
              "，承担经典款陶瓷马克杯、简约白瓷餐盘、日式陶瓷碗三个 SKU 的生产。年供货额约 ",
            ],
            ["300 万", ["b"]],
            ["。"],
          ],
        },
        {
          id: "exp-jdz-3",
          type: BlockType.SubHeader,
          tokens: [["产能现状"]],
        },
        {
          id: "exp-jdz-4",
          type: BlockType.Callout,
          tokens: [
            [
              "⚠️ 2026-Q2 产能预警：因华东地区环保政策收紧，景德镇多家窑炉面临限产或停产风险。宏图陶瓷目前维持生产，但产能已满载，所有订单交期可能延长 2-4 天。",
            ],
          ],
          icon: "⚠️",
          color: "#FFF3E0",
        },
        {
          id: "exp-jdz-5",
          type: BlockType.SubHeader,
          tokens: [["合作评估"]],
        },
        {
          id: "exp-jdz-6",
          type: BlockType.BulletedList,
          tokens: [["合作年限：8 年（2018 年起）"]],
        },
        {
          id: "exp-jdz-7",
          type: BlockType.BulletedList,
          tokens: [["历史良品率：97.2%（行业平均 95%）"]],
        },
        {
          id: "exp-jdz-8",
          type: BlockType.BulletedList,
          tokens: [["价格竞争力：中等偏上，但工艺质量为行业标杆"]],
        },
        {
          id: "exp-jdz-9",
          type: BlockType.BulletedList,
          tokens: [["风险点：环保政策敏感，产能弹性不足"]],
        },
        {
          id: "exp-jdz-10",
          type: BlockType.SubHeader,
          tokens: [["应急预案"]],
        },
        {
          id: "exp-jdz-11",
          type: BlockType.Text,
          tokens: [["若宏图陶瓷出现停产，陶瓷类 SKU 的备选方案为："]],
        },
        {
          id: "exp-jdz-12",
          type: BlockType.NumberedList,
          tokens: [
            ["德化白瓷工坊（福建）：已通过样品评估，可承接马克杯和餐盘"],
          ],
        },
        {
          id: "exp-jdz-13",
          type: BlockType.NumberedList,
          tokens: [
            ["潮州新艺陶瓷（广东）：价格更低但良品率略低（94%），适合应急"],
          ],
        },
      ],
    },
    {
      id: "row-hb",
      cells: {
        "sup-col-name": "河北晶透玻璃",
        "sup-col-category": "玻璃杯、水壶、咖啡壶",
        "sup-col-capacity": "正常",
        "sup-col-contact": "李经理 139-xxxx-5678",
        "sup-col-note": "产能充足，可承接加急订单",
      },
      expandBlocks: [
        {
          id: "exp-hb-1",
          type: BlockType.Header,
          tokens: [["供应商档案：河北晶透玻璃"]],
        },
        {
          id: "exp-hb-2",
          type: BlockType.Text,
          tokens: [
            [
              "河北晶透玻璃制品有限公司，成立于 2010 年，位于河北省沧州市。专注高硼硅玻璃制品，是公司 ",
            ],
            ["玻璃类产品的独家供应商", ["b"]],
            ["，承担双层隔热玻璃杯和手冲咖啡壶套装的生产。年供货额约 "],
            ["180 万", ["b"]],
            ["。"],
          ],
        },
        {
          id: "exp-hb-3",
          type: BlockType.SubHeader,
          tokens: [["产能优势"]],
        },
        {
          id: "exp-hb-4",
          type: BlockType.BulletedList,
          tokens: [["自有 3 条全自动吹制生产线，日产能 2,000 只"]],
        },
        {
          id: "exp-hb-5",
          type: BlockType.BulletedList,
          tokens: [["支持 48 小时加急生产（加急费 +15%）"]],
        },
        {
          id: "exp-hb-6",
          type: BlockType.BulletedList,
          tokens: [["磨砂 LOGO 印刷能力：可承接定制订单，最小起订量 100 只"]],
        },
        {
          id: "exp-hb-7",
          type: BlockType.SubHeader,
          tokens: [["合作评估"]],
        },
        {
          id: "exp-hb-8",
          type: BlockType.BulletedList,
          tokens: [["合作年限：5 年（2021 年起）"]],
        },
        {
          id: "exp-hb-9",
          type: BlockType.BulletedList,
          tokens: [["历史良品率：98.1%（玻璃制品行业领先）"]],
        },
        {
          id: "exp-hb-10",
          type: BlockType.BulletedList,
          tokens: [["价格竞争力：高，同类产品价格低于市场均价 10%"]],
        },
        {
          id: "exp-hb-11",
          type: BlockType.BulletedList,
          tokens: [["风险点：低，产能充足且不受环保政策影响"]],
        },
        {
          id: "exp-hb-12",
          type: BlockType.Callout,
          tokens: [
            [
              "✅ 河北晶透玻璃是当前最稳定的供应商，建议作为陶瓷类供应商产能不足时的备选加工方（玻璃替代方案）。",
            ],
          ],
          icon: "✅",
          color: "#E8F5E9",
        },
      ],
    },
    {
      id: "row-dehua",
      cells: {
        "sup-col-name": "德化白瓷工坊",
        "sup-col-category": "杯具、餐盘",
        "sup-col-capacity": "正常",
        "sup-col-contact": "王师傅 135-xxxx-9012",
        "sup-col-note": "备选供应商，已通过样品评估，尚未正式合作",
      },
      expandBlocks: [
        {
          id: "exp-dh-1",
          type: BlockType.Header,
          tokens: [["供应商档案：德化白瓷工坊"]],
        },
        {
          id: "exp-dh-2",
          type: BlockType.Text,
          tokens: [
            [
              "德化白瓷工坊位于福建省泉州市德化县，是一家专注白瓷制品的中型工厂。2026-Q1 完成样品评估，作为景德镇宏图陶瓷的 ",
            ],
            ["备选供应商", ["b"]],
            [" 纳入供应链体系。"],
          ],
        },
        {
          id: "exp-dh-3",
          type: BlockType.SubHeader,
          tokens: [["评估结果"]],
        },
        {
          id: "exp-dh-4",
          type: BlockType.BulletedList,
          tokens: [["样品质量：良好，白度和釉面光泽度接近景德镇水平"]],
        },
        {
          id: "exp-dh-5",
          type: BlockType.BulletedList,
          tokens: [["价格：比景德镇低约 8%，具有成本优势"]],
        },
        {
          id: "exp-dh-6",
          type: BlockType.BulletedList,
          tokens: [["交期：标准 5 天，略长于景德镇的 3-4 天"]],
        },
        {
          id: "exp-dh-7",
          type: BlockType.BulletedList,
          tokens: [["产能：月产能约 5,000 只，可满足应急需求"]],
        },
        {
          id: "exp-dh-8",
          type: BlockType.ToDo,
          tokens: [["完成正式供应商准入审核流程"]],
          checked: false,
        },
        {
          id: "exp-dh-9",
          type: BlockType.ToDo,
          tokens: [["签订框架合作协议"]],
          checked: false,
        },
        {
          id: "exp-dh-10",
          type: BlockType.ToDo,
          tokens: [["安排首批试产订单（200 只马克杯）验证量产质量"]],
          checked: false,
        },
      ],
    },
  ],
};

/**
 * Lookup map: sheetId → SheetData
 */
export const allSheets: Record<string, SheetData> = {
  "sheet-inventory": inventorySheet,
  "sheet-crm": crmSheet,
  "sheet-orders": ordersSheet,
  "sheet-suppliers": suppliersSheet,
  ...tocAllSheets,
};
