/**
 * Block Editor type definitions
 * Inspired by qingzhou's BlockTypes and Token system
 */

// Document type literals
export type DocType = "Smart Canvas" | "Smart Sheet" | "Page";

// Block type enum — covers all supported block types for Smart Canvas
export enum BlockType {
  Text = "text",
  Header = "header",
  SubHeader = "sub_header",
  SubSubHeader = "sub_sub_header",
  BulletedList = "bulleted_list",
  NumberedList = "numbered_list",
  ToDo = "to_do",
  Code = "code",
  Quote = "quote",
  Divider = "divider",
  Callout = "callout",
  Image = "image",
  Toggle = "toggle",
  EmbedSheet = "embed_sheet",
  Mention = "mention",
}

/**
 * Token annotation types:
 * - 'b'                          → bold
 * - 'i'                          → italic
 * - 's'                          → strikethrough
 * - 'c'                          → inline code
 * - ['a', url]                   → hyperlink
 * - ['h', color]                 → highlight
 * - ['ref', targetId, targetType, rowId?] → cross-file reference
 */
export type Annotation =
  | "b"
  | "i"
  | "s"
  | "c"
  | ["a", string]
  | ["h", string]
  | ["ref", string, "canvas" | "sheet", string?];

/**
 * Token: a two-element tuple [value, annotations?]
 * - value: the text content
 * - annotations: optional array of Annotation
 */
export type Token = [string] | [string, Annotation[]];

/**
 * Block: the fundamental unit of a Smart Canvas document.
 */
export interface Block {
  id: string;
  type: BlockType;
  tokens: Token[];
  author?: string;
  authorType?: "human" | "agent";

  // Type-specific properties
  checked?: boolean; // for to_do
  language?: string; // for code
  sheetId?: string; // for embed_sheet — which sheet to embed
  viewFilter?: Record<string, string>; // for embed_sheet — filter conditions
  targetId?: string; // for mention — target file id
  targetType?: "canvas" | "sheet"; // for mention — target file type
  icon?: string; // for callout — emoji icon
  level?: number; // for numbered_list — nesting level
  color?: string; // for callout — background color
}
