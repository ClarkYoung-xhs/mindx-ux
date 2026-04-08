import type { CrossReference } from "../types/crossRef";

/**
 * All cross-references between Smart Canvas and Smart Sheet files.
 * These establish the bidirectional link graph.
 */
export const crossReferences: CrossReference[] = [
  // Document 1 (client visit) → CRM_DB (row: laowang)
  {
    id: "xref-1",
    sourceId: "canvas-client-visit",
    sourceType: "canvas",
    targetId: "sheet-crm",
    targetType: "sheet",
    targetLabel: "@华中区-星巴克加盟商-老王",
    targetAnchor: "row-laowang",
  },
  // Document 1 (client visit) → Inventory_DB (row: mug01)
  {
    id: "xref-2",
    sourceId: "canvas-client-visit",
    sourceType: "canvas",
    targetId: "sheet-inventory",
    targetType: "sheet",
    targetLabel: "@经典款陶瓷马克杯",
    targetAnchor: "row-mug01",
  },
  // Document 2 (supply alert) → Supplier_DB (row: jdz)
  {
    id: "xref-3",
    sourceId: "canvas-supply-alert",
    sourceType: "canvas",
    targetId: "sheet-suppliers",
    targetType: "sheet",
    targetLabel: "@景德镇宏图陶瓷",
    targetAnchor: "row-jdz",
  },
  // Document 2 (supply alert) → Inventory_DB (embed view)
  {
    id: "xref-4",
    sourceId: "canvas-supply-alert",
    sourceType: "canvas",
    targetId: "sheet-inventory",
    targetType: "sheet",
    targetLabel: "嵌入视图: 全局 SKU 与动态库存表",
  },
  // Document 3 (client portal) → Inventory_DB (embed view)
  {
    id: "xref-5",
    sourceId: "canvas-client-portal",
    sourceType: "canvas",
    targetId: "sheet-inventory",
    targetType: "sheet",
    targetLabel: "嵌入视图: 老王常采 SKU",
  },
  // Document 3 (client portal) → Order_DB (embed view)
  {
    id: "xref-6",
    sourceId: "canvas-client-portal",
    sourceType: "canvas",
    targetId: "sheet-orders",
    targetType: "sheet",
    targetLabel: "嵌入视图: 老王在途订单",
  },
  // CRM_DB (row: laowang) → Document 1 (client visit)
  {
    id: "xref-7",
    sourceId: "sheet-crm",
    sourceType: "sheet",
    targetId: "canvas-client-visit",
    targetType: "canvas",
    targetLabel: "@重点客户 Q1 拜访纪要",
  },
  // Inventory_DB (row: mug01) → Supplier_DB (row: jdz)
  {
    id: "xref-8",
    sourceId: "sheet-inventory",
    sourceType: "sheet",
    targetId: "sheet-suppliers",
    targetType: "sheet",
    targetLabel: "@景德镇宏图陶瓷",
    targetAnchor: "row-jdz",
  },
  // Order_DB (row: ord001) → CRM_DB (row: laowang)
  {
    id: "xref-9",
    sourceId: "sheet-orders",
    sourceType: "sheet",
    targetId: "sheet-crm",
    targetType: "sheet",
    targetLabel: "@华中区-星巴克加盟商-老王",
    targetAnchor: "row-laowang",
  },
  // Order_DB (row: ord001) → Inventory_DB (row: mug01)
  {
    id: "xref-10",
    sourceId: "sheet-orders",
    sourceType: "sheet",
    targetId: "sheet-inventory",
    targetType: "sheet",
    targetLabel: "@经典款陶瓷马克杯",
    targetAnchor: "row-mug01",
  },
  // === Document ↔ Document bidirectional links ===
  // Document 1 (client visit) → Document 2 (supply alert)
  {
    id: "xref-11",
    sourceId: "canvas-client-visit",
    sourceType: "canvas",
    targetId: "canvas-supply-alert",
    targetType: "canvas",
    targetLabel: "@Q2 华东区供应链异常预警报告",
  },
  // Document 1 (client visit) → Document 3 (client portal)
  {
    id: "xref-12",
    sourceId: "canvas-client-visit",
    sourceType: "canvas",
    targetId: "canvas-client-portal",
    targetType: "canvas",
    targetLabel: "@Hi，老王专属专区",
  },
  // Document 2 (supply alert) → Document 1 (client visit)
  {
    id: "xref-13",
    sourceId: "canvas-supply-alert",
    sourceType: "canvas",
    targetId: "canvas-client-visit",
    targetType: "canvas",
    targetLabel: "@重点客户 Q1 拜访与授信调整纪要",
  },
  // Document 2 (supply alert) → Document 3 (client portal)
  {
    id: "xref-14",
    sourceId: "canvas-supply-alert",
    sourceType: "canvas",
    targetId: "canvas-client-portal",
    targetType: "canvas",
    targetLabel: "@Hi，老王专属专区",
  },
  // Document 3 (client portal) → Document 1 (client visit)
  {
    id: "xref-15",
    sourceId: "canvas-client-portal",
    sourceType: "canvas",
    targetId: "canvas-client-visit",
    targetType: "canvas",
    targetLabel: "@重点客户 Q1 拜访与授信调整纪要",
  },
  // Document 3 (client portal) → Document 2 (supply alert)
  {
    id: "xref-16",
    sourceId: "canvas-client-portal",
    sourceType: "canvas",
    targetId: "canvas-supply-alert",
    targetType: "canvas",
    targetLabel: "@Q2 华东区供应链异常预警报告",
  },

  // === Analysis Report (canvas-analysis-report) cross-references ===
  // Analysis Report → Inventory_DB (multiple SKU rows)
  {
    id: "xref-17",
    sourceId: "canvas-analysis-report",
    sourceType: "canvas",
    targetId: "sheet-inventory",
    targetType: "sheet",
    targetLabel: "@经典款陶瓷马克杯",
    targetAnchor: "row-mug01",
  },
  {
    id: "xref-18",
    sourceId: "canvas-analysis-report",
    sourceType: "canvas",
    targetId: "sheet-inventory",
    targetType: "sheet",
    targetLabel: "@简约白瓷餐盘",
    targetAnchor: "row-plate01",
  },
  {
    id: "xref-19",
    sourceId: "canvas-analysis-report",
    sourceType: "canvas",
    targetId: "sheet-inventory",
    targetType: "sheet",
    targetLabel: "@双层隔热玻璃杯",
    targetAnchor: "row-cup01",
  },
  {
    id: "xref-20",
    sourceId: "canvas-analysis-report",
    sourceType: "canvas",
    targetId: "sheet-inventory",
    targetType: "sheet",
    targetLabel: "@日式陶瓷碗",
    targetAnchor: "row-bowl01",
  },
  {
    id: "xref-21",
    sourceId: "canvas-analysis-report",
    sourceType: "canvas",
    targetId: "sheet-inventory",
    targetType: "sheet",
    targetLabel: "@手冲咖啡壶套装",
    targetAnchor: "row-kettle01",
  },
  // Analysis Report → Supplier_DB (supplier rows)
  {
    id: "xref-22",
    sourceId: "canvas-analysis-report",
    sourceType: "canvas",
    targetId: "sheet-suppliers",
    targetType: "sheet",
    targetLabel: "@景德镇宏图陶瓷",
    targetAnchor: "row-jdz",
  },
  {
    id: "xref-23",
    sourceId: "canvas-analysis-report",
    sourceType: "canvas",
    targetId: "sheet-suppliers",
    targetType: "sheet",
    targetLabel: "@河北晶透玻璃",
    targetAnchor: "row-hb",
  },
  {
    id: "xref-24",
    sourceId: "canvas-analysis-report",
    sourceType: "canvas",
    targetId: "sheet-suppliers",
    targetType: "sheet",
    targetLabel: "@德化白瓷工坊",
    targetAnchor: "row-dehua",
  },
  // Analysis Report → CRM_DB (customer row)
  {
    id: "xref-25",
    sourceId: "canvas-analysis-report",
    sourceType: "canvas",
    targetId: "sheet-crm",
    targetType: "sheet",
    targetLabel: "@华中区-星巴克加盟商-老王",
    targetAnchor: "row-laowang",
  },
  // Analysis Report → Document 2 (supply alert)
  {
    id: "xref-26",
    sourceId: "canvas-analysis-report",
    sourceType: "canvas",
    targetId: "canvas-supply-alert",
    targetType: "canvas",
    targetLabel: "@Q2 华东区供应链异常预警报告",
  },
  // Analysis Report → Document 1 (client visit)
  {
    id: "xref-27",
    sourceId: "canvas-analysis-report",
    sourceType: "canvas",
    targetId: "canvas-client-visit",
    targetType: "canvas",
    targetLabel: "@重点客户 Q1 拜访与授信调整纪要",
  },
  // Reverse links: existing documents → Analysis Report
  // Document 2 (supply alert) → Analysis Report
  {
    id: "xref-28",
    sourceId: "canvas-supply-alert",
    sourceType: "canvas",
    targetId: "canvas-analysis-report",
    targetType: "canvas",
    targetLabel: "@库存与供应链分析报告",
  },
  // Document 1 (client visit) → Analysis Report
  {
    id: "xref-29",
    sourceId: "canvas-client-visit",
    sourceType: "canvas",
    targetId: "canvas-analysis-report",
    targetType: "canvas",
    targetLabel: "@库存与供应链分析报告",
  },
];

/**
 * Get all backlinks for a given file id.
 */
export function getBacklinks(fileId: string) {
  return crossReferences
    .filter((ref) => ref.targetId === fileId)
    .map((ref) => ({
      referenceId: ref.id,
      sourceId: ref.sourceId,
      sourceType: ref.sourceType,
      sourceLabel: ref.targetLabel,
      anchor: ref.targetAnchor,
    }));
}
