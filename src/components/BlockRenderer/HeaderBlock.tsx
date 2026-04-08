import React from "react";
import { useNavigate } from "react-router-dom";
import type { Block } from "../../types/block";
import { BlockType } from "../../types/block";
import { renderTokens } from "../../utils/tokens";
import { useRowExpand } from "./RowExpandContext";

interface HeaderBlockProps {
  block: Block;
}

const headerStyles: Record<string, React.CSSProperties> = {
  [BlockType.Header]: {
    fontWeight: 600,
    fontSize: "16pt",
    lineHeight: 1.4,
  },
  [BlockType.SubHeader]: {
    fontWeight: 600,
    fontSize: "12pt",
    lineHeight: 1.4,
  },
  [BlockType.SubSubHeader]: {
    fontWeight: 600,
    fontSize: "12pt",
    lineHeight: 1.4,
  },
};

const HeaderBlock: React.FC<HeaderBlockProps> = ({ block }) => {
  const navigate = useNavigate();
  const onRowExpand = useRowExpand();
  const style = headerStyles[block.type] || headerStyles[BlockType.Header];

  return (
    <div
      style={{
        ...style,
        color: "#1f2329",
        padding: "3px 2px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {renderTokens(block.tokens, navigate, onRowExpand)}
    </div>
  );
};

export default HeaderBlock;
