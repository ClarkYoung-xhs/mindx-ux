import { BlockType } from "../../types/block";
import type { ComponentType } from "react";

// Lazy imports — components will be created in the next step
import TextBlock from "./TextBlock";
import HeaderBlock from "./HeaderBlock";
import QuoteBlock from "./QuoteBlock";
import CodeBlock from "./CodeBlock";
import CalloutBlock from "./CalloutBlock";
import ListBlock from "./ListBlock";
import DividerBlock from "./DividerBlock";
import EmbedSheetBlock from "./EmbedSheetBlock";

export interface BlockComponentProps {
  block: import("../../types/block").Block;
}

const rendererMap: Record<string, ComponentType<BlockComponentProps>> = {
  [BlockType.Text]: TextBlock,
  [BlockType.Header]: HeaderBlock,
  [BlockType.SubHeader]: HeaderBlock,
  [BlockType.SubSubHeader]: HeaderBlock,
  [BlockType.Quote]: QuoteBlock,
  [BlockType.Code]: CodeBlock,
  [BlockType.Callout]: CalloutBlock,
  [BlockType.BulletedList]: ListBlock,
  [BlockType.NumberedList]: ListBlock,
  [BlockType.ToDo]: ListBlock,
  [BlockType.Divider]: DividerBlock,
  [BlockType.EmbedSheet]: EmbedSheetBlock,
  [BlockType.Image]: TextBlock, // fallback to text for demo
  [BlockType.Toggle]: TextBlock, // fallback to text for demo
  [BlockType.Mention]: TextBlock, // fallback to text for demo
};

/**
 * Get the renderer component for a given block type.
 * Falls back to TextBlock for unrecognized types.
 */
export function getBlockRenderer(
  type: BlockType | string,
): ComponentType<BlockComponentProps> {
  return rendererMap[type] || TextBlock;
}

export { default as BlockList } from "./BlockList";
