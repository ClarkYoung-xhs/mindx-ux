import React from "react";
import type { Block } from "../../types/block";

interface CodeBlockProps {
  block: Block;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ block }) => {
  const text = block.tokens.map((t) => t[0]).join("");

  return (
    <div
      style={{
        borderRadius: 2,
        background: "#f7f6f3",
        padding: "16px 16px",
        fontFamily:
          '"SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace',
        fontSize: "85%",
        lineHeight: 1.6,
        color: "#1f2329",
        overflowX: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
      }}
    >
      {block.language && (
        <div
          style={{
            fontSize: "11px",
            color: "#8b8b8b",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {block.language}
        </div>
      )}
      <code>{text}</code>
    </div>
  );
};

export default CodeBlock;
