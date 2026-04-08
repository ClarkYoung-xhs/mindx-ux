import React from "react";
import { useNavigate } from "react-router-dom";
import type { Block } from "../../types/block";
import { renderTokens } from "../../utils/tokens";
import { useRowExpand } from "./RowExpandContext";

interface CalloutBlockProps {
  block: Block;
}

const CalloutBlock: React.FC<CalloutBlockProps> = ({ block }) => {
  const navigate = useNavigate();
  const onRowExpand = useRowExpand();
  const icon = block.icon || "💡";
  const bgColor = block.color || "rgba(235, 236, 237, 0.3)";

  return (
    <div
      style={{
        display: "flex",
        padding: "16px 16px 16px 12px",
        borderRadius: 3,
        background: bgColor,
        borderLeft: `3px solid rgba(0, 0, 0, 0.15)`,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: 1.5,
        color: "#1f2329",
        margin: "4px 0",
      }}
    >
      <div style={{ marginRight: 8, fontSize: "1.2em", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0, fontSize: "10.5pt" }}>
        {renderTokens(block.tokens, navigate, onRowExpand)}
      </div>
    </div>
  );
};

export default CalloutBlock;
