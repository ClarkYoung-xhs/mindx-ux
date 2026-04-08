import React from "react";
import type { Block } from "../../types/block";
import { BlockType } from "../../types/block";
import { getBlockRenderer } from "./index";
import { RowExpandProvider, type OnRowExpand } from "./RowExpandContext";

interface BlockListProps {
  blocks: Block[];
  onRowExpand?: OnRowExpand;
}

/**
 * Default margin-top for each block type, following qingzhou's BlockContent margin system.
 */
const marginTopMap: Record<string, number> = {
  [BlockType.Header]: 40,
  [BlockType.SubHeader]: 30,
  [BlockType.SubSubHeader]: 20,
  [BlockType.Quote]: 10,
  [BlockType.BulletedList]: 5,
  [BlockType.NumberedList]: 5,
  [BlockType.ToDo]: 5,
  [BlockType.Toggle]: 5,
  [BlockType.Divider]: 0,
};

const defaultMargin = 4;

const BlockList: React.FC<BlockListProps> = ({ blocks, onRowExpand }) => {
  const content = (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px" }}>
      {blocks.map((block, index) => {
        const Renderer = getBlockRenderer(block.type);
        const marginTop =
          index === 0 ? 0 : (marginTopMap[block.type] ?? defaultMargin);

        return (
          <div
            key={block.id}
            style={{
              marginTop,
              marginBottom:
                block.type === BlockType.Divider ? 0 : defaultMargin,
            }}
          >
            <Renderer block={block} />
          </div>
        );
      })}
    </div>
  );

  // Wrap with RowExpandProvider only when callback is provided
  if (onRowExpand) {
    return <RowExpandProvider value={onRowExpand}>{content}</RowExpandProvider>;
  }

  return content;
};

export default BlockList;
