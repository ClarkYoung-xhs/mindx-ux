import React from "react";
import { motion } from "motion/react";
import MemoryTabView from "../../components/memory-v1/MemoryTabView";

interface MemoryNode {
  id: string;
  content: string;
  source: string;
  timestamp: string;
  tags?: string[];
}

interface RawDataItem {
  id: string;
  title: string;
  content: string;
  type: string;
  addedAt: string;
  size: number;
}

interface ExtractedKeyPoint {
  id: string;
  content: string;
  source: string;
  confidence: number;
  timestamp: string;
}

export interface MemoryTabProps {
  activeMemoryView: "profile" | "rawdata";
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  whoAmIDocContent: string;
  goalDocContent: string;
  handleOpenProfileEditor: () => void;
  memoryNodes: MemoryNode[];
  memoryNodeInput: string;
  isMemoryNodesExpanded: boolean;
  setMemoryNodeInput: (v: string) => void;
  handleOpenMemoryNodeComposer: () => void;
  handleCancelMemoryNodeComposer: () => void;
  handleCreateMemoryNode: () => void;
  handleOpenMemoryNodeEditor: (node: MemoryNode) => void;
  extractedKeyPoints: ExtractedKeyPoint[];
  handleOpenKeyPointsDocument: () => void;
  rawDataItems: RawDataItem[];
  rawDataLoading: boolean;
  extractionRunning: boolean;
  extractionLogs: string[];
  setIsPasteModalOpen: (v: boolean) => void;
  setIsRawDataModalOpen: (v: boolean) => void;
  openRawDataInEditor: (item: RawDataItem) => void;
  deleteRawDataItem: (id: string) => void;
  renameRawDataItem: (id: string, newName: string) => void;
  setIsPricingModalOpen: (v: boolean) => void;
  setIsModelConfigOpen: (v: boolean) => void;
  handleOpenExtractionPicker: () => void;
}

export default function MemoryTab({
  activeMemoryView,
  fileInputRef,
  whoAmIDocContent,
  goalDocContent,
  handleOpenProfileEditor,
  memoryNodes,
  memoryNodeInput,
  isMemoryNodesExpanded,
  setMemoryNodeInput,
  handleOpenMemoryNodeComposer,
  handleCancelMemoryNodeComposer,
  handleCreateMemoryNode,
  handleOpenMemoryNodeEditor,
  extractedKeyPoints,
  handleOpenKeyPointsDocument,
  rawDataItems,
  rawDataLoading,
  extractionRunning,
  extractionLogs,
  setIsPasteModalOpen,
  setIsRawDataModalOpen,
  openRawDataInEditor,
  deleteRawDataItem,
  renameRawDataItem,
  setIsPricingModalOpen,
  setIsModelConfigOpen,
  handleOpenExtractionPicker,
}: MemoryTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl"
    >
      <MemoryTabView
        activeMemoryView={activeMemoryView}
        fileInputRef={fileInputRef}
        whoAmIDocContent={whoAmIDocContent}
        goalDocContent={goalDocContent}
        onEditProfile={handleOpenProfileEditor}
        memoryNodes={memoryNodes}
        memoryNodeInput={memoryNodeInput}
        isMemoryNodesExpanded={isMemoryNodesExpanded}
        onMemoryNodeInputChange={setMemoryNodeInput}
        onOpenMemoryNodeComposer={handleOpenMemoryNodeComposer}
        onCancelMemoryNodeComposer={handleCancelMemoryNodeComposer}
        onCreateMemoryNode={handleCreateMemoryNode}
        onEditNode={handleOpenMemoryNodeEditor}
        extractedKeyPoints={extractedKeyPoints}
        onOpenKeyPointsDocument={handleOpenKeyPointsDocument}
        rawDataItems={rawDataItems}
        rawDataLoading={rawDataLoading}
        extractionRunning={extractionRunning}
        extractionLogs={extractionLogs}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        onOpenRawDataModal={() => setIsRawDataModalOpen(true)}
        onOpenRawData={openRawDataInEditor}
        onDeleteRawData={deleteRawDataItem}
        onRenameRawData={renameRawDataItem}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenModelConfig={() => setIsModelConfigOpen(true)}
        onOpenExtractionPicker={handleOpenExtractionPicker}
      />
    </motion.div>
  );
}
