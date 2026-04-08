/**
 * Cross-reference / bidirectional link type definitions
 * Enables graph-like interconnection between Smart Canvas and Smart Sheet files
 */

export interface CrossReference {
  id: string;
  sourceId: string; // originating file id
  sourceType: "canvas" | "sheet"; // originating file type
  targetId: string; // destination file id
  targetType: "canvas" | "sheet"; // destination file type
  targetLabel: string; // display text for the reference
  targetAnchor?: string; // optional anchor within target (e.g. row id, block id)
}

/**
 * Backlink: a reverse view of a CrossReference,
 * showing which files reference the current file.
 */
export interface Backlink {
  referenceId: string; // the CrossReference id
  sourceId: string;
  sourceType: "canvas" | "sheet";
  sourceLabel: string; // display text of the source file
  anchor?: string; // where in the source the reference appears
}
