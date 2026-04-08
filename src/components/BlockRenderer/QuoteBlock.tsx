import React from "react";
import { useNavigate } from "react-router-dom";
import type { Block } from "../../types/block";
import { renderTokens } from "../../utils/tokens";
import { useRowExpand } from "./RowExpandContext";

interface QuoteBlockProps {
  block: Block;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ block }) => {
  const navigate = useNavigate();
  const onRowExpand = useRowExpand();

  return (
    <div
      style={{
        borderLeft: "2px solid #0062FF",
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: "11pt",
        color: "#646a73",
        display: "flex",
        lineHeight: 1.5,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {renderTokens(block.tokens, navigate, onRowExpand)}
      </div>
    </div>
  );
};

export default QuoteBlock;
