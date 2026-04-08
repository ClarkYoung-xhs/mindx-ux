import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  SheetData,
  SheetColumn,
  CellValue,
  SheetRow,
} from "../../types/sheet";
import { isRelationValue, renderCellValue } from "./cellRenderer";
import RowExpandModal from "./RowExpandModal";

interface SheetViewProps {
  sheetData: SheetData;
  viewFilter?: Record<string, string>;
  compact?: boolean; // for embedded views
}

function filterRows(
  rows: SheetRow[],
  columns: SheetColumn[],
  filter?: Record<string, string>,
): SheetRow[] {
  if (!filter) return rows;
  return rows.filter((row) => {
    return Object.entries(filter).every(([colName, expected]) => {
      const col = columns.find((c) => c.name === colName);
      if (!col) return true;
      const cellVal = row.cells[col.id];
      if (isRelationValue(cellVal)) {
        return cellVal.displayText.includes(expected);
      }
      return String(cellVal ?? "").includes(expected);
    });
  });
}

const SheetView: React.FC<SheetViewProps> = ({
  sheetData,
  viewFilter,
  compact,
}) => {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState<SheetRow | null>(null);
  const [expandedSheetData, setExpandedSheetData] = useState<SheetData | null>(
    null,
  );
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // Callback for relation cell clicks: open row-expand modal for the target row
  const handleRelationRowExpand = (
    targetSheet: SheetData,
    targetRow: SheetRow,
  ) => {
    setExpandedSheetData(targetSheet);
    setExpandedRow(targetRow);
  };
  const filteredRows = filterRows(
    sheetData.rows,
    sheetData.columns,
    viewFilter,
  );

  return (
    <div
      style={{
        border: compact ? "none" : "1px solid #e0e0e0",
        borderRadius: compact ? 0 : 4,
        overflow: "auto",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header bar */}
      {!compact && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 46,
            padding: "0 16px 5px",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#1f2329" }}>
            📊 {sheetData.name}
          </span>
          <span style={{ marginLeft: 8, fontSize: "12px", color: "#8b8b8b" }}>
            {filteredRows.length} rows
          </span>
        </div>
      )}

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "13px",
        }}
      >
        <thead>
          <tr style={{ height: 34, background: "#fafafa" }}>
            {/* Expand button column header */}
            <th
              style={{
                width: 36,
                minWidth: 36,
                borderBottom: "1px solid #e0e0e0",
              }}
            />
            {sheetData.columns.map((col) => (
              <th
                key={col.id}
                style={{
                  textAlign: "left",
                  padding: "0 12px",
                  fontWeight: 500,
                  color: "#646a73",
                  fontSize: "12px",
                  borderBottom: "1px solid #e0e0e0",
                  whiteSpace: "nowrap",
                  width: col.width,
                }}
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr
              key={row.id}
              style={{
                height: 40,
                borderBottom: "1px solid #f0f0f0",
                background: hoveredRowId === row.id ? "#f5f7fa" : "transparent",
                transition: "background 0.15s",
              }}
              onMouseEnter={() => setHoveredRowId(row.id)}
              onMouseLeave={() => setHoveredRowId(null)}
            >
              {/* Expand button cell */}
              <td
                style={{
                  width: 36,
                  minWidth: 36,
                  textAlign: "center",
                  padding: 0,
                }}
              >
                {hoveredRowId === row.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedSheetData(null);
                      setExpandedRow(row);
                    }}
                    style={{
                      background: "none",
                      border: "1px solid #d0d5dd",
                      borderRadius: 4,
                      cursor: "pointer",
                      padding: "2px 4px",
                      fontSize: "12px",
                      lineHeight: 1,
                      color: "#646a73",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Expand row"
                  >
                    ↗
                  </button>
                )}
              </td>
              {sheetData.columns.map((col) => (
                <td
                  key={col.id}
                  style={{
                    padding: "0 12px",
                    color: "#1f2329",
                    fontSize: "13px",
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {renderCellValue(
                    col,
                    row.cells[col.id],
                    navigate,
                    handleRelationRowExpand,
                  )}
                </td>
              ))}
            </tr>
          ))}
          {filteredRows.length === 0 && (
            <tr>
              <td
                colSpan={sheetData.columns.length + 1}
                style={{
                  padding: "24px 12px",
                  textAlign: "center",
                  color: "#8b8b8b",
                  fontSize: "13px",
                }}
              >
                No data matching filter criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Row Expand Modal */}
      {expandedRow && (
        <RowExpandModal
          sheetData={expandedSheetData || sheetData}
          row={expandedRow}
          onClose={() => {
            setExpandedRow(null);
            setExpandedSheetData(null);
          }}
        />
      )}
    </div>
  );
};

export default SheetView;
