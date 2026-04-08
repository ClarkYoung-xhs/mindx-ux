import React, { createContext, useContext } from "react";
import type { SheetData, SheetRow } from "../../types/sheet";

/**
 * Callback type for opening a row-expand modal.
 */
export type OnRowExpand = (sheetData: SheetData, row: SheetRow) => void;

/**
 * Context to pass onRowExpand callback down through BlockList → Block renderers.
 * This avoids threading the callback through every component's props.
 */
const RowExpandContext = createContext<OnRowExpand | undefined>(undefined);

export const RowExpandProvider = RowExpandContext.Provider;

/**
 * Hook to consume the onRowExpand callback from context.
 */
export function useRowExpand(): OnRowExpand | undefined {
  return useContext(RowExpandContext);
}
