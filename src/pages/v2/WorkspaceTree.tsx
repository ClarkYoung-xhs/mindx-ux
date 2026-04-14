import { useState, useCallback } from "react";
import { ChevronRight, FileText, Table2, Globe, Plus, MoreHorizontal, Copy, Link2, Trash2 } from "lucide-react";
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

/** Dropdown menu component */
interface DropdownMenuProps {
  onDelete: () => void;
  onDuplicate: () => void;
  onCopyLink: () => void;
  onClose: () => void;
  position: { x: number; y: number };
}

function DropdownMenu({ onDelete, onDuplicate, onCopyLink, onClose, position }: DropdownMenuProps) {
  return (
    <>
      {/* Backdrop to close menu */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      {/* Menu */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-stone-200 py-1 min-w-[160px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <Copy className="w-4 h-4" />
          创建副本
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopyLink();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <Link2 className="w-4 h-4" />
          复制链接
        </button>
        <div className="h-px bg-stone-200 my-1" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          删除
        </button>
      </div>
    </>
  );
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
  onAddChild: (parentDoc: WorkspaceDoc) => void;
  onDelete: (doc: WorkspaceDoc) => void;
  onDuplicate: (doc: WorkspaceDoc) => void;
}

/** Recursive tree node for a document */
function TreeNode({
  doc,
  depth,
  activeDocId,
  expandedIds,
  onToggle,
  onSelect,
  onAddChild,
  onDelete,
  onDuplicate,
}: TreeNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const hasChildren = doc.children && doc.children.length > 0;
  const isExpanded = expandedIds.has(doc.id);
  const isActive = activeDocId === doc.id;
  const isSheet = doc.type === "Smart Sheet";

  // Max depth = 4
  if (depth > 4) return null;

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPosition({
      x: rect.right + 4,
      y: rect.top,
    });
    setShowMenu(true);
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddChild(doc);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/v2/doc/${doc.id}`;
    navigator.clipboard.writeText(link);
    // TODO: Show toast notification
  };

  return (
    <div>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group/item"
      >
        <button
          onClick={() => {
            onSelect(doc);
            if (hasChildren) onToggle(doc.id);
          }}
          className={`w-full flex items-center gap-1.5 py-1.5 pr-2 rounded-md text-[13px] transition-all duration-150 ${
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
          <span 
            className={`truncate flex-1 text-left min-w-0 transition-all duration-150 ${
              isHovered ? 'mr-1' : 'pr-1'
            }`}
          >
            {doc.name}
          </span>
          
          {/* Hover actions - Plus and More buttons with background plate */}
          {isHovered && (
            <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-stone-100/90 shadow-sm backdrop-blur-sm shrink-0">
              {/* Plus button - only show for non-sheet documents */}
              {!isSheet && (
                <button
                  onClick={handleAddChild}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-white text-stone-500 hover:text-stone-700 transition-colors"
                  title="新建子页面"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
              {/* More button */}
              <button
                onClick={handleMoreClick}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-white text-stone-500 hover:text-stone-700 transition-colors"
                title="更多操作"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <DropdownMenu
            onDelete={() => onDelete(doc)}
            onDuplicate={() => onDuplicate(doc)}
            onCopyLink={handleCopyLink}
            onClose={() => setShowMenu(false)}
            position={menuPosition}
          />
        )}
      </div>

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
              onAddChild={onAddChild}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
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
  const { documents, addDocument, setDocuments } = useMindXDemo();

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

  // Add a new child document (empty page initially)
  const handleAddChild = useCallback(
    (parentDoc: WorkspaceDoc) => {
      const newDoc: WorkspaceDoc = {
        id: `doc-${Date.now()}`,
        parentId: parentDoc.id,
        name: "无标题",
        type: "Smart Canvas",
        date: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        lastViewed: new Date().toISOString(),
        labels: [],
        creatorName: "当前用户",
        creatorType: "human",
        size: 0,
        blocks: [],
      };
      
      addDocument(newDoc);
      
      // Auto-expand parent and navigate to new doc
      setExpandedDocIds((prev) => new Set(prev).add(parentDoc.id));
      navigate(`/v2/doc/${newDoc.id}`);
    },
    [addDocument, navigate],
  );

  // Delete a document
  const handleDelete = useCallback(
    (doc: WorkspaceDoc) => {
      if (confirm(`确定要删除「${doc.name}」吗?`)) {
        setDocuments((prev) => {
          const deleteById = (nodes: WorkspaceDoc[]): WorkspaceDoc[] =>
            nodes
              .filter((node) => node.id !== doc.id)
              .map((node) => ({
                ...node,
                children: node.children ? deleteById(node.children) : undefined,
              }));
          return deleteById(prev);
        });
        
        // Navigate away if the deleted doc was active
        if (activeDocId === doc.id) {
          navigate('/v2/workspace');
        }
      }
    },
    [setDocuments, activeDocId, navigate],
  );

  // Duplicate a document
  const handleDuplicate = useCallback(
    (doc: WorkspaceDoc) => {
      const duplicatedDoc: WorkspaceDoc = {
        ...doc,
        id: `doc-${Date.now()}`,
        name: `${doc.name} 副本`,
        date: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        lastViewed: new Date().toISOString(),
        children: undefined, // Don't duplicate children for simplicity
      };
      
      addDocument(duplicatedDoc);
      navigate(`/v2/doc/${duplicatedDoc.id}`);
    },
    [addDocument, navigate],
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
          onAddChild={handleAddChild}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      ))}
    </div>
  );
}
