import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/** 智能文档 — 蓝色，双方括号符号 */
export function SmartDocIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="32" height="32" rx="7" fill="#2CA5E0" />
        <path d="M10 10.5L7.5 16L10 21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 10.5L12.5 16L15 21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 10.5L24.5 16L22 21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 10.5L19.5 16L17 21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** 智能白板 — 粉色，便签贴纸符号 */
export function SmartWhiteboardIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="32" height="32" rx="7" fill="#F43F7A" />
        <rect x="9" y="8" width="14" height="14" rx="2" fill="white" fillOpacity="0.95" />
        <path d="M15 22L23 22L23 18C23 17.4 22.6 17 22 17L16 17C15.4 17 15 17.4 15 18L15 22Z" fill="#F43F7A" fillOpacity="0.35" />
      </svg>
    </div>
  );
}

/** 表格 — 绿色，X 交叉符号 */
export function TableIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="32" height="32" rx="7" fill="#10B981" />
        <path d="M11 11L21 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M21 11L11 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** 收集表 — 黄色，勾选符号 */
export function FormIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="32" height="32" rx="7" fill="#F59E0B" />
        <path d="M10.5 16.5L14 20L21.5 12.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Markdown — 深紫色，MI 文字符号 */
export function MarkdownIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        <rect width="32" height="32" rx="7" fill="#3730A3" />
        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">MI</text>
      </svg>
    </div>
  );
}

/** 根据 type 返回对应 icon */
export function getDocTypeIcon(type: string, size = 18) {
  switch (type) {
    case 'Smart Doc':
      return <SmartDocIcon size={size} />;
    case 'Whiteboard':
      return <SmartWhiteboardIcon size={size} />;
    case 'Table':
      return <TableIcon size={size} />;
    case 'Form':
      return <FormIcon size={size} />;
    case 'Markdown':
      return <MarkdownIcon size={size} />;
    default:
      return <SmartDocIcon size={size} />;
  }
}
