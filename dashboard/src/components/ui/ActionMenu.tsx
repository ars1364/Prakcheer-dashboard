"use client";

import { useState, useRef, useEffect } from "react";

export interface ActionItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface ActionMenuProps {
  items: ActionItem[];
}

export default function ActionMenu({ items }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-32 h-32 rounded-8 flex items-center justify-center text-text-muted hover:bg-bg hover:text-text-main transition-colors text-lg leading-none"
        aria-label="عملیات"
      >
        ⋮
      </button>

      {open && (
        <div
          className="absolute top-full mt-4 start-0 z-50 min-w-[160px] bg-bg-card rounded-12 border border-border py-4"
          style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.12)" }}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); setOpen(false); }}
              className={`w-full text-start px-16 py-9 text-[13px] transition-colors
                ${item.danger
                  ? "text-danger hover:bg-danger-light"
                  : "text-text-main hover:bg-bg"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
