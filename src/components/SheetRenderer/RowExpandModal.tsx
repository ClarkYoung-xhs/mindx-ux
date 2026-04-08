import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type {
  SheetData,
  SheetRow,
  CellValue,
  RelationCellValue,
} from "../../types/sheet";
import { renderCellValue, isRelationValue } from "./cellRenderer";
import BlockList from "../BlockRenderer/BlockList";

interface RowExpandModalProps {
  sheetData: SheetData;
  row: SheetRow;
  onClose: () => void;
}

/**
 * Extract display text from a CellValue for use as a title string.
 */
function cellValueToString(value: CellValue): string {
  if (value === null || value === undefined) return "—";
  if (isRelationValue(value)) return value.displayText;
  return String(value);
}

/**
 * Maximum nesting depth for row-expand modals opened from relation cells.
 */
const MAX_DEPTH = 2;

const RowExpandModal: React.FC<RowExpandModalProps> = ({
  sheetData: initialSheetData,
  row: initialRow,
  onClose,
}) => {
  const navigate = useNavigate();

  // Navigation stack for nested row-expand (supports up to MAX_DEPTH levels)
  const [navStack, setNavStack] = useState<
    Array<{ sheetData: SheetData; row: SheetRow }>
  >([{ sheetData: initialSheetData, row: initialRow }]);

  // Reset stack when props change (e.g. opened from a different trigger)
  useEffect(() => {
    setNavStack([{ sheetData: initialSheetData, row: initialRow }]);
  }, [initialSheetData, initialRow]);

  const current = navStack[navStack.length - 1];
  const { sheetData, row } = current;
  const canGoBack = navStack.length > 1;

  // Handle relation cell click: push new entry onto nav stack (up to MAX_DEPTH)
  const handleRelationRowExpand = useCallback(
    (targetSheet: SheetData, targetRow: SheetRow) => {
      setNavStack((prev) => {
        if (prev.length >= MAX_DEPTH) {
          // Replace the top entry instead of pushing
          return [
            ...prev.slice(0, -1),
            { sheetData: targetSheet, row: targetRow },
          ];
        }
        return [...prev, { sheetData: targetSheet, row: targetRow }];
      });
    },
    [],
  );

  const handleBack = () => {
    setNavStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (canGoBack) {
          handleBack();
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, canGoBack]);

  // Determine title from keyColumnId or first column
  const keyColId = sheetData.keyColumnId || sheetData.columns[0]?.id;
  const titleValue = keyColId ? row.cells[keyColId] : null;
  const title = cellValueToString(titleValue);

  const hasBlocks = row.expandBlocks && row.expandBlocks.length > 0;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.4)",
      }}
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        style={{
          width: 720,
          maxHeight: "85vh",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== Title Area ===== */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f0f0f0",
            flexShrink: 0,
          }}
        >
          {canGoBack && (
            <button
              onClick={handleBack}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                color: "#646a73",
                padding: "4px 8px 4px 0",
                lineHeight: 1,
              }}
              title="Back"
            >
              ←
            </button>
          )}
          <span style={{ fontSize: "20px", marginRight: 10 }}>📋</span>
          <h2
            style={{
              flex: 1,
              margin: 0,
              fontSize: "18px",
              fontWeight: 600,
              color: "#1f2329",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "#8b8b8b",
              padding: "4px 8px",
              borderRadius: 4,
              lineHeight: 1,
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 24px 24px",
          }}
        >
          {/* ===== Fields Area ===== */}
          <div style={{ padding: "16px 0" }}>
            {sheetData.columns.map((col) => (
              <div
                key={col.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "8px 0",
                  borderBottom: "1px solid #f7f7f7",
                }}
              >
                {/* Field label */}
                <div
                  style={{
                    width: 140,
                    minWidth: 140,
                    fontSize: "13px",
                    color: "#8b8b8b",
                    fontWeight: 500,
                    paddingTop: 1,
                  }}
                >
                  {col.name}
                </div>
                {/* Field value */}
                <div
                  style={{
                    flex: 1,
                    fontSize: "13px",
                    color: "#1f2329",
                    lineHeight: 1.6,
                  }}
                >
                  {renderCellValue(
                    col,
                    row.cells[col.id],
                    navigate,
                    handleRelationRowExpand,
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Divider between fields and content */}
          <div
            style={{
              borderBottom: "1px solid #e0e0e0",
              margin: "4px 0 16px",
            }}
          />

          {/* ===== Content Area (BlockList) ===== */}
          {hasBlocks ? (
            <BlockList
              blocks={row.expandBlocks!}
              onRowExpand={handleRelationRowExpand}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 0",
                color: "#bfbfbf",
              }}
            >
              <span style={{ fontSize: "32px", marginBottom: 8 }}>📝</span>
              <span style={{ fontSize: "14px" }}>暂无正文内容</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RowExpandModal;
