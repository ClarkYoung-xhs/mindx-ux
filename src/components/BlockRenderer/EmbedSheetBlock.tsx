import React from "react";
import { useNavigate } from "react-router-dom";
import type { Block } from "../../types/block";
import { allSheets } from "../../data/sheetMockData";
import { useMindXDemo } from "../../data/mindxDemoContext";
import SheetView from "../SheetRenderer/SheetView";

interface EmbedSheetBlockProps {
  block: Block;
}

/**
 * Embedded sheet view block.
 * Resolves sheet data from context documents (reactive) first, then falls back to static allSheets.
 */
const EmbedSheetBlock: React.FC<EmbedSheetBlockProps> = ({ block }) => {
  const navigate = useNavigate();
  const { documents } = useMindXDemo();
  const sheetId = block.sheetId;
  const filter = block.viewFilter as Record<string, string> | undefined;
  // Prefer reactive sheetData from context over static allSheets
  const contextSheet = sheetId
    ? documents.find((d) => d.id === sheetId)?.sheetData
    : undefined;
  const sheetData = contextSheet ?? (sheetId ? allSheets[sheetId] : undefined);

  const handleClick = () => {
    if (sheetId) {
      navigate(
        `/document?id=${sheetId}&type=${encodeURIComponent("Smart Sheet")}`,
      );
    }
  };

  // Build filter description
  const filterDesc = filter
    ? Object.entries(filter)
        .map(([k, v]) => `${k} = ${v}`)
        .join(", ")
    : "";

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 4,
        overflow: "hidden",
        margin: "8px 0",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 40,
          padding: "0 12px",
          background: "#fafafa",
          borderBottom: "1px solid #e0e0e0",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <span style={{ marginRight: 6, fontSize: "14px" }}>📊</span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#0062FF",
            flex: 1,
          }}
        >
          {block.tokens.map((t) => t[0]).join("") || "Embedded Sheet View"}
        </span>
        {filterDesc && (
          <span
            style={{
              fontSize: "11px",
              color: "#8b8b8b",
              marginLeft: 8,
            }}
          >
            Filter: {filterDesc}
          </span>
        )}
        <span style={{ fontSize: "11px", color: "#8b8b8b", marginLeft: 8 }}>
          ↗
        </span>
      </div>

      {/* Sheet table body */}
      <div id={`embed-sheet-${sheetId}`}>
        {sheetData ? (
          <SheetView sheetData={sheetData} viewFilter={filter} compact />
        ) : (
          <div
            style={{
              padding: "12px",
              minHeight: 60,
              fontSize: "12px",
              color: "#8b8b8b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span>Sheet not found: {sheetId}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbedSheetBlock;
