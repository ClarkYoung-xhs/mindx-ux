import React from "react";
import { useNavigate } from "react-router-dom";
import type { Block } from "../../types/block";
import { BlockType } from "../../types/block";
import { renderTokens } from "../../utils/tokens";
import { useRowExpand } from "./RowExpandContext";

interface ListBlockProps {
  block: Block;
}

const ListBlock: React.FC<ListBlockProps> = ({ block }) => {
  const navigate = useNavigate();
  const onRowExpand = useRowExpand();

  if (block.type === BlockType.ToDo) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          padding: "3px 0",
          fontSize: "10.5pt",
          lineHeight: 1.6,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <input
          type="checkbox"
          checked={block.checked || false}
          readOnly
          style={{
            marginRight: 8,
            marginTop: 4,
            width: 16,
            height: 16,
            flexShrink: 0,
            accentColor: "#0062FF",
          }}
        />
        <span
          style={{
            flex: 1,
            color: block.checked ? "#8b8b8b" : "#1f2329",
            textDecoration: block.checked ? "line-through" : "none",
          }}
        >
          {renderTokens(block.tokens, navigate, onRowExpand)}
        </span>
      </div>
    );
  }

  if (block.type === BlockType.NumberedList) {
    const num = block.level ?? 1;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          padding: "3px 0",
          fontSize: "10.5pt",
          lineHeight: 1.6,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <span
          style={{
            minWidth: 24,
            color: "#1f2329",
            flexShrink: 0,
          }}
        >
          {num}.
        </span>
        <span style={{ flex: 1, color: "#1f2329" }}>
          {renderTokens(block.tokens, navigate, onRowExpand)}
        </span>
      </div>
    );
  }

  // Default: bulleted_list
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        padding: "3px 0",
        fontSize: "10.5pt",
        lineHeight: 1.6,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <span
        style={{
          minWidth: 24,
          color: "#1f2329",
          flexShrink: 0,
        }}
      >
        •
      </span>
      <span style={{ flex: 1, color: "#1f2329" }}>
        {renderTokens(block.tokens, navigate, onRowExpand)}
      </span>
    </div>
  );
};

export default ListBlock;
