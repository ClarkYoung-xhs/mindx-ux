import React from 'react';

interface AvatarProps {
  size?: number;
  className?: string;
}

/** Claude — 深色简约标志 */
export function ClaudeAvatar({ size = 24, className }: AvatarProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <circle cx="24" cy="24" r="24" fill="#18181B" />
        {/* Simplified Claude crab/asterisk mark */}
        <g transform="translate(24,24)">
          {/* 6 rounded petals radiating from center */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <rect
              key={angle}
              x="-2.5"
              y="-12"
              width="5"
              height="12"
              rx="2.5"
              fill="white"
              transform={`rotate(${angle})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/** Data Analyzer — 深灰数据图表 */
export function DataAnalyzerAvatar({ size = 24, className }: AvatarProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <circle cx="24" cy="24" r="24" fill="#27272A" />
        {/* Bar chart */}
        <rect x="12" y="26" width="5" height="10" rx="1.5" fill="white" opacity="0.7" />
        <rect x="21.5" y="18" width="5" height="18" rx="1.5" fill="white" opacity="0.85" />
        <rect x="31" y="14" width="5" height="22" rx="1.5" fill="white" />
      </svg>
    </div>
  );
}

/** Research Bot — 深灰搜索/放大镜 */
export function ResearchBotAvatar({ size = 24, className }: AvatarProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <circle cx="24" cy="24" r="24" fill="#3F3F46" />
        {/* Magnifying glass */}
        <circle cx="21" cy="21" r="7" stroke="white" strokeWidth="3" fill="none" />
        <line x1="26" y1="26" x2="34" y2="34" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** 通用 Agent — 深灰机器人 */
export function DefaultAgentAvatar({ size = 24, className }: AvatarProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <circle cx="24" cy="24" r="24" fill="#52525B" />
        {/* Simple bot face */}
        <rect x="15" y="16" width="18" height="16" rx="4" stroke="white" strokeWidth="2.5" fill="none" />
        <circle cx="20" cy="24" r="2" fill="white" />
        <circle cx="28" cy="24" r="2" fill="white" />
        <line x1="24" y1="12" x2="24" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="11" r="2" fill="white" />
      </svg>
    </div>
  );
}

/** 人类用户 — 暖棕色简约头像 */
export function HumanAvatar({ size = 24, className }: AvatarProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <circle cx="24" cy="24" r="24" fill="#78716C" />
        {/* Head */}
        <circle cx="24" cy="18" r="7" fill="white" />
        {/* Body/shoulders */}
        <path d="M12 40C12 33.4 17.4 28 24 28C30.6 28 36 33.4 36 40" fill="white" />
      </svg>
    </div>
  );
}

/** 根据 agent name 返回对应头像组件 */
export function getAgentAvatar(agentName: string, size = 24, className?: string) {
  const name = agentName.toLowerCase();
  if (name.includes('claude')) {
    return <ClaudeAvatar size={size} className={className} />;
  }
  if (name.includes('data') || name.includes('analyzer')) {
    return <DataAnalyzerAvatar size={size} className={className} />;
  }
  if (name.includes('research')) {
    return <ResearchBotAvatar size={size} className={className} />;
  }
  return <DefaultAgentAvatar size={size} className={className} />;
}

/** 人类用户头像 */
export function getUserAvatar(size = 24, className?: string) {
  return <HumanAvatar size={size} className={className} />;
}
