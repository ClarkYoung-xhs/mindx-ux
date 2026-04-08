import type { Block } from "../types/block";

/**
 * Migrate a legacy Paragraph object to a Block.
 * Detects markdown heading prefixes and converts accordingly.
 */
export function migrateParagraphToBlock(paragraph: {
  id: string;
  text: string;
  author: string;
  authorType: "human" | "agent";
}): Block {
  const { id, text, author, authorType } = paragraph;
  const trimmed = text.trim();

  // Detect heading levels
  if (trimmed.startsWith("### ")) {
    return {
      id,
      type: "sub_sub_header",
      tokens: [[trimmed.slice(4)]],
      author,
      authorType,
    };
  }
  if (trimmed.startsWith("## ")) {
    return {
      id,
      type: "sub_header",
      tokens: [[trimmed.slice(3)]],
      author,
      authorType,
    };
  }
  if (trimmed.startsWith("# ")) {
    return {
      id,
      type: "header",
      tokens: [[trimmed.slice(2)]],
      author,
      authorType,
    };
  }

  // Detect list items
  if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
    return {
      id,
      type: "bulleted_list",
      tokens: [[trimmed.slice(2)]],
      author,
      authorType,
    };
  }
  if (/^\d+\.\s/.test(trimmed)) {
    return {
      id,
      type: "numbered_list",
      tokens: [[trimmed.replace(/^\d+\.\s/, "")]],
      author,
      authorType,
    };
  }

  // Detect blockquote
  if (trimmed.startsWith("> ")) {
    return {
      id,
      type: "quote",
      tokens: [[trimmed.slice(2)]],
      author,
      authorType,
    };
  }

  // Detect divider
  if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
    return { id, type: "divider", tokens: [], author, authorType };
  }

  // Detect checkbox / to_do
  if (trimmed.startsWith("[ ] ") || trimmed.startsWith("[x] ")) {
    return {
      id,
      type: "to_do",
      tokens: [[trimmed.slice(4)]],
      author,
      authorType,
      checked: trimmed.startsWith("[x]"),
    };
  }

  // Default: plain text
  return { id, type: "text", tokens: [[text]], author, authorType };
}

/**
 * Map legacy document type strings to the new 3-type system.
 */
export function migrateDocType(
  oldType: string,
): "Smart Canvas" | "Smart Sheet" | "Page" {
  switch (oldType) {
    case "Smart Doc":
    case "Markdown":
      return "Smart Canvas";
    case "Table":
      return "Smart Sheet";
    case "Whiteboard":
    case "Form":
      return "Page";
    default:
      // Already a new type or unknown — default to Smart Canvas
      if (
        oldType === "Smart Canvas" ||
        oldType === "Smart Sheet" ||
        oldType === "Page"
      ) {
        return oldType as "Smart Canvas" | "Smart Sheet" | "Page";
      }
      return "Smart Canvas";
  }
}
