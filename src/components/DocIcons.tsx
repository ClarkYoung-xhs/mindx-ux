import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

/** Smart Canvas — blue, document with blocks symbol */
export function SmartCanvasIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        <rect width="32" height="32" rx="7" fill="#2CA5E0" />
        <path
          d="M10 10.5L7.5 16L10 21.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 10.5L12.5 16L15 21.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 10.5L24.5 16L22 21.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 10.5L19.5 16L17 21.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Smart Sheet — green, grid/table symbol */
export function SmartSheetIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        <rect width="32" height="32" rx="7" fill="#10B981" />
        <path
          d="M11 11L21 21"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M21 11L11 21"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** Page — purple, page layout symbol */
export function PageIcon({ className, size = 20 }: IconProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        <rect width="32" height="32" rx="7" fill="#7C3AED" />
        <rect
          x="9"
          y="8"
          width="14"
          height="16"
          rx="2"
          fill="white"
          fillOpacity="0.95"
        />
        <path
          d="M12 12H20"
          stroke="#7C3AED"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M12 15.5H18"
          stroke="#7C3AED"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M12 19H16"
          stroke="#7C3AED"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** Get icon by document type */
export function getDocTypeIcon(type: string, size = 18) {
  switch (type) {
    case "Smart Canvas":
      return <SmartCanvasIcon size={size} />;
    case "Smart Sheet":
      return <SmartSheetIcon size={size} />;
    case "Page":
      return <PageIcon size={size} />;
    default:
      return <SmartCanvasIcon size={size} />;
  }
}
