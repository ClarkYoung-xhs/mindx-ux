import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMindXDemo } from "../../data/mindxDemoContext";
import {
  chatPresets,
  defaultReply,
  matchPreset,
  shrekyanRow,
  type ChatPreset,
  type ReplySegment,
} from "../../data/aiChatMockData";
import {
  tocChatPresets,
  tocDefaultReply,
  matchTocPreset,
} from "../../data/tocAiChatMockData";
import { analysisReportBlocks } from "../../data/analysisReportBlocks";
import type { WorkspaceDoc } from "../../data/mindxDemo";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "thinking";
  segments: ReplySegment[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AIChatFloat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const executedEffects = useRef<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addDocument, addSheetRow, currentWorkspaceType, setDocuments } =
    useMindXDemo();

  // Derive workspace-aware presets
  const activePresets =
    currentWorkspaceType === "toC" ? tocChatPresets : chatPresets;
  const activeDefaultReply =
    currentWorkspaceType === "toC" ? tocDefaultReply : defaultReply;
  const activeMatchPreset =
    currentWorkspaceType === "toC" ? matchTocPreset : matchPreset;

  // Auto-clear chat when workspace changes
  const prevWorkspaceRef = useRef(currentWorkspaceType);
  useEffect(() => {
    if (prevWorkspaceRef.current !== currentWorkspaceType) {
      prevWorkspaceRef.current = currentWorkspaceType;
      // Clear all timers
      clearTimeout(thinkingTimer.current);
      clearTimeout(replyTimer.current);
      sendingRef.current = false;
      setSending(false);
      setMessages([]);
      executedEffects.current.clear();
    }
  }, [currentWorkspaceType]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // Execute side effect for a matched preset
  const executeSideEffect = useCallback(
    (preset: ChatPreset) => {
      if (!preset.sideEffect) return;
      if (executedEffects.current.has(preset.sideEffect)) return;
      executedEffects.current.add(preset.sideEffect);

      if (preset.sideEffect === "createAnalysisReport") {
        const reportDoc: WorkspaceDoc = {
          id: "canvas-analysis-report",
          workspaceId: "w1",
          name: "库存与供应链分析报告-20250410",
          type: "Smart Canvas",
          date: "Today",
          lastModified: new Date().toISOString(),
          lastViewed: new Date().toISOString(),
          labels: ["AI Analysis", "Inventory", "Supply Chain"],
          creatorName: "AI Agent",
          creatorType: "agent",
          size: 45056,
          blocks: analysisReportBlocks,
        };
        addDocument(reportDoc);
      } else if (preset.sideEffect === "addCrmRow") {
        addSheetRow("sheet-crm", shrekyanRow);
      } else if (preset.sideEffect === "updateAssetNav") {
        // toC scenario 3: simulate Crypto rebalance to USDC
        setDocuments((prev) =>
          prev.map((doc) => {
            if (doc.id !== "toc-sheet-asset-nav" || !doc.sheetData) return doc;
            return {
              ...doc,
              sheetData: {
                ...doc.sheetData,
                rows: doc.sheetData.rows.map((row) => {
                  if (row.id === "asset-row-crypto") {
                    return {
                      ...row,
                      cells: {
                        ...row.cells,
                        holding: "BTC 2.0, ETH 14, SOL 200",
                        marketPrice: "$198,300",
                        nav: "$198,300",
                        weight: "33.2%",
                      },
                    };
                  }
                  if (row.id === "asset-row-cash") {
                    return {
                      ...row,
                      cells: {
                        ...row.cells,
                        holding: "USD 146,000",
                        marketPrice: "$146,000",
                        nav: "$146,000",
                        weight: "24.4%",
                      },
                    };
                  }
                  return row;
                }),
              },
            };
          }),
        );
      }
    },
    [addDocument, addSheetRow, setDocuments],
  );

  // Timer refs to survive StrictMode double-invoke & re-renders
  const thinkingTimer = useRef<ReturnType<typeof setTimeout>>();
  const replyTimer = useRef<ReturnType<typeof setTimeout>>();
  const sendingRef = useRef(false);

  // Cleanup timers on unmount
  useEffect(() => {
    // On mount (including HMR remount), reset sending state in case
    // a previous timer was lost during hot-reload
    sendingRef.current = false;
    setSending(false);
    return () => {
      clearTimeout(thinkingTimer.current);
      clearTimeout(replyTimer.current);
    };
  }, []);

  // Send a message (from input or chip)
  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || sendingRef.current) return;
      sendingRef.current = true;
      setSending(true);
      setInput("");

      // Pre-compute the matched preset & reply so the timer closure is simple
      const matched = activeMatchPreset(text);
      const replySegments = matched ? matched.mockReply : activeDefaultReply;
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        segments: [{ text }],
      };
      setMessages((prev) => [...prev, userMsg]);

      // Show thinking indicator after 400ms
      clearTimeout(thinkingTimer.current);
      thinkingTimer.current = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "thinking-indicator",
            role: "thinking",
            segments: [{ text: "正在思考..." }],
          },
        ]);
      }, 400);

      // Show reply after 1600ms
      clearTimeout(replyTimer.current);
      replyTimer.current = setTimeout(() => {
        try {
          // Remove ALL thinking messages by role, then append reply
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.role !== "thinking");
            return [
              ...filtered,
              {
                id: `reply-${Date.now()}`,
                role: "assistant",
                segments: replySegments,
              },
            ];
          });

          // Execute side effect AFTER updating messages to avoid render conflicts
          if (matched) {
            // Use queueMicrotask so the message state update commits first
            queueMicrotask(() => executeSideEffect(matched));
          }
        } catch (err) {
          console.error("[AIChatFloat] reply error:", err);
        } finally {
          sendingRef.current = false;
          setSending(false);
        }
      }, 1600);
    },
    [executeSideEffect, activeMatchPreset, activeDefaultReply],
  );

  const handleClear = () => {
    // Clear all timers to prevent stale callbacks
    clearTimeout(thinkingTimer.current);
    clearTimeout(replyTimer.current);
    // Reset sending state
    sendingRef.current = false;
    setSending(false);
    // Clear messages and side-effect tracking
    setMessages([]);
    executedEffects.current.clear();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Render ──

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 900,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1c1c1c 0%, #3a3a3a 100%)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform =
            "scale(1.08)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 6px 24px rgba(0,0,0,0.25)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 4px 16px rgba(0,0,0,0.18)";
        }}
        title="AI Assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            fill="currentColor"
            opacity="0.3"
          />
          <path
            d="M9 8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S11.33 10 10.5 10 9 9.33 9 8.5zm4 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5z"
            fill="currentColor"
          />
          <path
            d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 88,
            right: 24,
            zIndex: 900,
            width: 400,
            height: 540,
            borderRadius: 16,
            background: "#fff",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              height: 52,
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #f0f0f0",
              background: "#fafafa",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1c1c1c",
                }}
              >
                WorkBuddy AI
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#999",
                  background: "#f5f5f5",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                Demo
              </span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={handleClear}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "#999",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "none")
                }
                title="Clear chat"
              >
                清空
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 6,
                  fontSize: 16,
                  color: "#999",
                  lineHeight: 1,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "none")
                }
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 16px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "#bbb",
                  fontSize: 13,
                  marginTop: 60,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
                <div>Hi! 我是你的 AI 助手</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  试试下方的快捷指令，或直接输入问题
                </div>
              </div>
            )}

            {messages.map((msg) => {
              if (msg.role === "thinking") {
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: "flex-start",
                      maxWidth: "80%",
                    }}
                  >
                    <div
                      style={{
                        background: "#f5f5f5",
                        borderRadius: "12px 12px 12px 4px",
                        padding: "10px 14px",
                        fontSize: 13,
                        color: "#999",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          animation: "aichat-pulse 1.2s ease-in-out infinite",
                        }}
                      >
                        ●
                      </span>
                      <span
                        style={{
                          display: "inline-block",
                          animation:
                            "aichat-pulse 1.2s ease-in-out 0.2s infinite",
                        }}
                      >
                        ●
                      </span>
                      <span
                        style={{
                          display: "inline-block",
                          animation:
                            "aichat-pulse 1.2s ease-in-out 0.4s infinite",
                        }}
                      >
                        ●
                      </span>
                      <span style={{ marginLeft: 4 }}>正在思考</span>
                    </div>
                  </div>
                );
              }

              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isUser ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                  }}
                >
                  <div
                    style={{
                      background: isUser ? "#1c1c1c" : "#f5f5f5",
                      color: isUser ? "#fff" : "#1c1c1c",
                      borderRadius: isUser
                        ? "12px 12px 4px 12px"
                        : "12px 12px 12px 4px",
                      padding: "10px 14px",
                      fontSize: 13,
                      lineHeight: 1.6,
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.segments.map((seg, i) =>
                      seg.link ? (
                        <span
                          key={i}
                          onClick={() => {
                            navigate(seg.link!);
                            setOpen(false);
                          }}
                          style={{
                            color: isUser ? "#93c5fd" : "#2563eb",
                            cursor: "pointer",
                            textDecoration: "underline",
                            textUnderlineOffset: 2,
                          }}
                        >
                          {seg.text}
                        </span>
                      ) : (
                        <span key={i}>{seg.text}</span>
                      ),
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preset chips */}
          <div
            style={{
              padding: "8px 16px",
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              borderTop: "1px solid #f0f0f0",
              background: "#fafafa",
              flexShrink: 0,
            }}
          >
            {activePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => sendMessage(preset.fullCommand)}
                disabled={sending}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: 20,
                  padding: "5px 12px",
                  fontSize: 12,
                  color: "#555",
                  cursor: sending ? "not-allowed" : "pointer",
                  transition: "all 0.15s",
                  opacity: sending ? 0.5 : 1,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!sending) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#1c1c1c";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#1c1c1c";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#e5e5e5";
                  (e.currentTarget as HTMLButtonElement).style.color = "#555";
                }}
              >
                ⚡ {preset.chipLabel}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #f0f0f0",
              display: "flex",
              gap: 8,
              flexShrink: 0,
              background: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入指令或问题..."
              disabled={sending}
              style={{
                flex: 1,
                border: "1px solid #e5e5e5",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 13,
                outline: "none",
                transition: "border-color 0.15s",
                background: sending ? "#fafafa" : "#fff",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  "#1c1c1c")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  "#e5e5e5")
              }
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={sending || !input.trim()}
              style={{
                background: sending || !input.trim() ? "#e5e5e5" : "#1c1c1c",
                color: sending || !input.trim() ? "#999" : "#fff",
                border: "none",
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 500,
                cursor: sending || !input.trim() ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                flexShrink: 0,
              }}
            >
              发送
            </button>
          </div>
        </div>
      )}

      {/* Keyframe animation for thinking dots */}
      <style>{`
        @keyframes aichat-pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </>
  );
};

export default AIChatFloat;
