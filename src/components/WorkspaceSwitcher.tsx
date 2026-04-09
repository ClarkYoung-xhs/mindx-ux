import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMindXDemo } from "../data/mindxDemoContext";
import type { WorkspaceType } from "../data/mindxDemoContext";

const workspaceOptions: Array<{
  type: WorkspaceType;
  label: string;
  description: string;
}> = [
  {
    type: "toB",
    label: "进销存工作台",
    description: "B2B 陶瓷器具进销存管理",
  },
  {
    type: "toC",
    label: "个人资产管理",
    description: "高净值个人全球资产配置",
  },
];

export default function WorkspaceSwitcher() {
  const { currentWorkspaceType, switchWorkspace } = useMindXDemo();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px",
          borderRadius: "6px",
          width: "100%",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(120,113,108,0.08)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            localStorage.removeItem('mindx_logged_in');
            localStorage.removeItem('mindx_workspace_id');
            localStorage.removeItem('mindx_user_name');
            navigate('/');
          }}
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "4px",
            background: "#292524",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          title="Back to Home"
        >
          <Sparkles style={{ width: "14px", height: "14px", color: "#fff" }} />
        </div>
        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "#1c1917",
            flex: 1,
            textAlign: "left",
          }}
        >
          MindX
        </span>
        <ChevronDown
          style={{
            width: "14px",
            height: "14px",
            color: "#a8a29e",
            transition: "transform 0.15s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: "0",
            right: "0",
            background: "#fff",
            border: "1px solid #e7e5e4",
            borderRadius: "8px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "6px 10px",
              borderBottom: "1px solid #f5f5f4",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#a8a29e",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Workspace
            </span>
          </div>
          {workspaceOptions.map((opt) => {
            const isActive = currentWorkspaceType === opt.type;
            return (
              <button
                key={opt.type}
                onClick={() => {
                  switchWorkspace(opt.type);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "8px 10px",
                  border: "none",
                  background: isActive ? "#f5f5f4" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#fafaf9";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#1c1917",
                    }}
                  >
                    {opt.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#a8a29e",
                      marginTop: "1px",
                    }}
                  >
                    {opt.description}
                  </div>
                </div>
                {isActive && (
                  <Check
                    style={{
                      width: "14px",
                      height: "14px",
                      color: "#292524",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
