import type { SheetData, SheetRow } from "../types/sheet";
import { allSheets } from "../data/sheetMockData";

/**
 * Look up a SheetData and SheetRow by sheetId and rowId.
 * Returns the matching pair, or null if either is not found.
 * Used by @ref token click handlers and relation cell click handlers
 * to resolve data for the RowExpandModal.
 */
export function findSheetRow(
  sheetId: string,
  rowId: string,
): { sheetData: SheetData; row: SheetRow } | null {
  const sheetData = allSheets[sheetId];
  if (!sheetData) return null;

  const row = sheetData.rows.find((r) => r.id === rowId);
  if (!row) return null;

  return { sheetData, row };
}
