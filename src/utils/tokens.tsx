import React from "react";
import { useNavigate } from "react-router-dom";
import type { Token, Annotation } from "../types/block";
import type { SheetData, SheetRow } from "../types/sheet";
import { findSheetRow } from "./sheetLookup";

/**
 * Callback type for opening a row-expand modal from a @ref token or relation cell.
 */
export type OnRowExpand = (sheetData: SheetData, row: SheetRow) => void;

/**
 * Render a single annotation-wrapped text segment.
 */
function applyAnnotation(
  element: React.ReactNode,
  annotation: Annotation,
  key: string,
  navigate: ReturnType<typeof useNavigate>,
  onRowExpand?: OnRowExpand,
): React.ReactNode {
  if (annotation === "b") {
    return React.createElement("strong", { key }, element);
  }
  if (annotation === "i") {
    return React.createElement("em", { key }, element);
  }
  if (annotation === "s") {
    return React.createElement("s", { key }, element);
  }
  if (annotation === "c") {
    return React.createElement(
      "code",
      {
        key,
        style: {
          background: "rgba(135,131,120,0.15)",
          borderRadius: 3,
          padding: "0.2em 0.4em",
          fontSize: "85%",
          fontFamily: '"SFMono-Regular", Menlo, Consolas, monospace',
          color: "#eb5757",
        },
      },
      element,
    );
  }
  if (Array.isArray(annotation)) {
    const [type] = annotation;
    if (type === "a") {
      const url = annotation[1];
      return React.createElement(
        "a",
        {
          key,
          href: url,
          target: "_blank",
          rel: "noopener noreferrer",
          style: { color: "#0062FF", textDecoration: "underline" },
        },
        element,
      );
    }
    if (type === "h") {
      const color = annotation[1];
      return React.createElement(
        "mark",
        {
          key,
          style: {
            background: color || "rgba(255,212,0,0.4)",
            borderRadius: 2,
            padding: "0 2px",
          },
        },
        element,
      );
    }
    if (type === "ref") {
      const [, targetId, targetType, rowId] = annotation;
      const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // When targeting a sheet row and onRowExpand is provided, try to open modal
        if (targetType === "sheet" && rowId && onRowExpand) {
          const result = findSheetRow(targetId, rowId);
          if (result) {
            onRowExpand(result.sheetData, result.row);
            return;
          }
        }

        // Fallback: navigate to the document page
        const docType = targetType === "sheet" ? "Smart Sheet" : "Smart Canvas";
        const url = `/document?id=${targetId}&type=${encodeURIComponent(docType)}${rowId ? `&row=${rowId}` : ""}`;
        navigate(url);
      };
      return React.createElement(
        "a",
        {
          key,
          href: "#",
          onClick: handleClick,
          style: {
            color: "#0062FF",
            textDecoration: "none",
            cursor: "pointer",
            borderBottom: "1px solid rgba(0,98,255,0.3)",
          },
        },
        React.createElement(
          "span",
          { style: { marginRight: 2, fontSize: "0.9em" } },
          targetType === "sheet" ? "📊" : "📄",
        ),
        element,
      );
    }
  }
  return element;
}

/**
 * Render a Token array into React elements.
 * Each token is [value, annotations?].
 * @param onRowExpand  Optional callback; when provided, @ref tokens pointing to
 *                     a sheet row will open a RowExpandModal instead of navigating.
 */
export function renderTokens(
  tokens: Token[],
  navigate: ReturnType<typeof useNavigate>,
  onRowExpand?: OnRowExpand,
): React.ReactNode[] {
  return tokens.map((token, tokenIndex) => {
    const value = token[0];
    const annotations = token.length > 1 ? token[1] : undefined;

    let element: React.ReactNode = value;

    if (annotations && annotations.length > 0) {
      annotations.forEach((annotation, annIndex) => {
        element = applyAnnotation(
          element,
          annotation,
          `token-${tokenIndex}-ann-${annIndex}`,
          navigate,
          onRowExpand,
        );
      });
    }

    return React.createElement("span", { key: `token-${tokenIndex}` }, element);
  });
}

/**
 * Hook wrapper for renderTokens that provides navigate automatically.
 * @param onRowExpand  Optional callback for opening row-expand modals from @ref tokens.
 */
export function useTokenRenderer(onRowExpand?: OnRowExpand) {
  const navigate = useNavigate();
  return (tokens: Token[]) => renderTokens(tokens, navigate, onRowExpand);
}
