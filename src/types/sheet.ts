/**
 * Smart Sheet type definitions
 * Defines the data model for structured table rendering
 */

import type { Block } from "./block";

// Column type literals
export type SheetColumnType =
  | "text"
  | "number"
  | "status"
  | "relation"
  | "date";

// Status option with color
export interface StatusOption {
  label: string;
  color: string; // CSS color value
}

// Relation target info
export interface RelationConfig {
  targetSheetId: string;
  targetColumnId?: string; // which column to display as label
}

// Column definition
export interface SheetColumn {
  id: string;
  name: string;
  type: SheetColumnType;
  width?: number;
  statusOptions?: StatusOption[]; // for status columns
  relationConfig?: RelationConfig; // for relation columns
}

// Cell value — can be plain text, number, status label, or a relation reference
export interface RelationCellValue {
  targetId: string; // target file id
  targetType: "canvas" | "sheet";
  rowId?: string; // optional row id within target sheet
  displayText: string; // text to render (e.g. "@老王")
}

export type CellValue = string | number | RelationCellValue | null;

// Row data
export interface SheetRow {
  id: string;
  cells: Record<string, CellValue>; // keyed by column id
  expandBlocks?: Block[]; // optional rich-text blocks for row-expand view
}

// Complete sheet data
export interface SheetData {
  id: string;
  name: string;
  columns: SheetColumn[];
  rows: SheetRow[];
  keyColumnId?: string; // which column is the "primary" / display column
}
