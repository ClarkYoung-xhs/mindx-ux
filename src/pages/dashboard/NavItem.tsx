import React from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-white text-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-stone-200/50"
          : "text-stone-600 hover:bg-stone-200/40 hover:text-stone-900 border border-transparent"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
