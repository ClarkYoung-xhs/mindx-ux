import React from "react";
import type {
  SheetColumn,
  CellValue,
  RelationCellValue,
  SheetData,
  SheetRow,
} from "../../types/sheet";
import { findSheetRow } from "../../utils/sheetLookup";

/**
 * Shared cell rendering utilities for SheetView and RowExpandModal.
 */

/**
 * Callback type for opening a row-expand modal from a relation cell.
 */
export type OnRowExpand = (sheetData: SheetData, row: SheetRow) => void;

// Status color mapping
export const statusColors: Record<string, { bg: string; color: string }> = {
  待审核: { bg: "#FFF3E0", color: "#E65100" },
  库存锁定: { bg: "#E3F2FD", color: "#1565C0" },
  采购中: { bg: "#E8EAF6", color: "#283593" },
  已发货: { bg: "#E8F5E9", color: "#2E7D32" },
  已签收: { bg: "#F1F8E9", color: "#33691E" },
  正常: { bg: "#E8F5E9", color: "#2E7D32" },
  "满载，可能延期": { bg: "#FFF3E0", color: "#E65100" },
  停产: { bg: "#FFEBEE", color: "#C62828" },
  "S 级": { bg: "#F3E5F5", color: "#6A1B9A" },
  "A 级": { bg: "#E3F2FD", color: "#1565C0" },
  "B 级": { bg: "#E8F5E9", color: "#2E7D32" },
  无异常: { bg: "#E8F5E9", color: "#2E7D32" },
  有记录: { bg: "#FFF3E0", color: "#E65100" },
};

export function isRelationValue(val: CellValue): val is RelationCellValue {
  return val !== null && typeof val === "object" && "targetId" in val;
}

/**
 * Render a cell value based on column type.
 * @param col          Column definition
 * @param value        Cell value
 * @param navigate     react-router navigate function (for relation links)
 * @param onRowExpand  Optional callback; when provided, relation cells pointing to
 *                     a sheet row will open a RowExpandModal instead of navigating.
 */
export function renderCellValue(
  col: SheetColumn,
  value: CellValue,
  navigate: (path: string) => void,
  onRowExpand?: OnRowExpand,
): React.ReactNode {
  if (value === null || value === undefined) {
    return <span style={{ color: "#bfbfbf" }}>—</span>;
  }

  // Relation column
  if (col.type === "relation" && isRelationValue(value)) {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // When targeting a sheet row and onRowExpand is provided, try to open modal
      if (value.targetType === "sheet" && value.rowId && onRowExpand) {
        const result = findSheetRow(value.targetId, value.rowId);
        if (result) {
          onRowExpand(result.sheetData, result.row);
          return;
        }
      }

      // Fallback: navigate to the document page
      const docType =
        value.targetType === "sheet" ? "Smart Sheet" : "Smart Canvas";
      navigate(
        `/document?id=${value.targetId}&type=${encodeURIComponent(docType)}${value.rowId ? `&row=${value.rowId}` : ""}`,
      );
    };
    return (
      <a
        href="#"
        onClick={handleClick}
        style={{
          color: "#0062FF",
          textDecoration: "none",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        📎 {value.displayText}
      </a>
    );
  }

  // Status column
  if (col.type === "status" && typeof value === "string") {
    const colors = statusColors[value] || { bg: "#F5F5F5", color: "#616161" };
    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: 10,
          fontSize: "11px",
          fontWeight: 500,
          background: colors.bg,
          color: colors.color,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    );
  }

  // Number column
  if (col.type === "number" && typeof value === "number") {
    return <span>{value.toLocaleString()}</span>;
  }

  // Default: text / date
  return <span>{String(value)}</span>;
}
