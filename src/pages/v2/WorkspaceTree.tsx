import { useState, useCallback } from "react";
import { ChevronRight, FileText, Table2, Globe } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import type { WorkspaceDoc } from "../../data/mindxDemo";
import { useMindXDemo } from "../../data/mindxDemoContext";

/** Icon for each document type */
function DocTypeIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  switch (type) {
    case "Smart Canvas":
      return <FileText className={className} />;
    case "Smart Sheet":
      return <Table2 className={className} />;
    case "Page":
      return <Globe className={className} />;
    default:
      return <FileText className={className} />;
  }
}

/** Helper: collect all ancestor doc IDs for a given docId in a nested tree */
function collectAncestorIds(
  docs: WorkspaceDoc[],
  targetId: string,
  path: string[] = [],
): string[] | null {
  for (const doc of docs) {
    if (doc.id === targetId) return path;
    if (doc.children) {
      const result = collectAncestorIds(doc.children, targetId, [
        ...path,
        doc.id,
      ]);
      if (result) return result;
    }
  }
  return null;
}

interface TreeNodeProps {
  doc: WorkspaceDoc;
  depth: number;
  activeDocId: string | null;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (doc: WorkspaceDoc) => void;
}

/** Recursive tree node for a document */
function TreeNode({
  doc,
  depth,
  activeDocId,
  expandedIds,
  onToggle,
  onSelect,
}: TreeNodeProps) {
  const hasChildren = doc.children && doc.children.length > 0;
  const isExpanded = expandedIds.has(doc.id);
  const isActive = activeDocId === doc.id;

  // Max depth = 4
  if (depth > 4) return null;

  return (
    <div>
      <button
        onClick={() => {
          onSelect(doc);
          if (hasChildren) onToggle(doc.id);
        }}
        className={`w-full flex items-center gap-1.5 py-1.5 pr-2 rounded-md text-[13px] transition-all duration-150 group ${
          isActive
            ? "bg-white text-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] font-medium"
            : "text-stone-600 hover:bg-stone-200/40 hover:text-stone-900"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {/* Expand/collapse chevron */}
        <span className="w-4 h-4 flex items-center justify-center shrink-0">
          {hasChildren ? (
            <ChevronRight
              className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          ) : (
            <span className="w-3.5" />
          )}
        </span>
        <DocTypeIcon
          type={doc.type}
          className="w-3.5 h-3.5 shrink-0 text-stone-400"
        />
        <span className="truncate">{doc.name}</span>
      </button>

      {/* Render children with animation */}
      {hasChildren && isExpanded && (
        <div className="animate-in slide-in-from-top-1 duration-200">
          {doc.children!.map((child) => (
            <TreeNode
              key={child.id}
              doc={child}
              depth={depth + 1}
              activeDocId={activeDocId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkspaceTree() {
  const navigate = useNavigate();
  const location = useLocation();
  const { documents } = useMindXDemo();

  // Determine active doc from URL — supports both old and new routes
  const isDocRoute =
    location.pathname.startsWith("/v2/doc/") ||
    location.pathname.startsWith("/v2/workspace/doc");
  let activeDocId: string | null = null;
  if (location.pathname.startsWith("/v2/doc/")) {
    // New route: /v2/doc/:docId
    activeDocId =
      location.pathname.replace("/v2/doc/", "").split("/")[0] || null;
  } else if (location.pathname.startsWith("/v2/workspace/doc")) {
    // Legacy route: /v2/workspace/doc?doc=xxx
    const urlParams = new URLSearchParams(location.search);
    activeDocId = urlParams.get("doc");
  }

  // Track which doc nodes are expanded
  const [expandedDocIds, setExpandedDocIds] = useState<Set<string>>(() => {
    // Only expand ancestors of the active doc (if navigated directly to a doc URL)
    const initial = new Set<string>();
    if (activeDocId) {
      const ancestors = collectAncestorIds(documents, activeDocId);
      if (ancestors) {
        for (const id of ancestors) initial.add(id);
      }
    }
    return initial;
  });

  const toggleDoc = useCallback((id: string) => {
    setExpandedDocIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectDoc = useCallback(
    (doc: WorkspaceDoc) => {
      navigate(`/v2/doc/${doc.id}`);
    },
    [navigate],
  );

  return (
    <div className="space-y-0.5">
      {documents.map((doc) => (
        <TreeNode
          key={doc.id}
          doc={doc}
          depth={0}
          activeDocId={activeDocId}
          expandedIds={expandedDocIds}
          onToggle={toggleDoc}
          onSelect={selectDoc}
        />
      ))}
    </div>
  );
}
