import React from "react";
import { useNavigate } from "react-router-dom";
import type { Block } from "../../types/block";
import { renderTokens } from "../../utils/tokens";
import { useRowExpand } from "./RowExpandContext";

interface TextBlockProps {
  block: Block;
}

const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
  const navigate = useNavigate();
  const onRowExpand = useRowExpand();

  return (
    <div
      style={{
        fontSize: "10.5pt",
        lineHeight: 1.6,
        color: "#1f2329",
        padding: "3px 2px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {block.tokens.length > 0 ? (
        renderTokens(block.tokens, navigate, onRowExpand)
      ) : (
        <span style={{ color: "#bfbfbf" }}>Type something...</span>
      )}
    </div>
  );
};

export default TextBlock;
