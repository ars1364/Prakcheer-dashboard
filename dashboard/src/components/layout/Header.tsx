"use client";

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function Header({ title, breadcrumbs }: HeaderProps) {
  return (
    <header
      style={{
        height: "var(--header-height)",
        paddingInlineStart: "var(--sidebar-width)",
      }}
      className="fixed top-0 inset-x-0 z-10 flex items-center bg-bg-card border-b border-border px-24 gap-16"
    >
      {/* Breadcrumb + title */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        {breadcrumbs?.map((crumb, i) => (
          <span key={i} className="flex items-center gap-6 shrink-0">
            <span className="text-[13px] text-text-muted">{crumb.label}</span>
            <span className="text-text-placeholder text-xs">/</span>
          </span>
        ))}
        <h1 className="text-[15px] font-semibold text-text-main truncate">{title}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-8 shrink-0">
        <button className="relative w-34 h-34 rounded-8 hover:bg-bg transition-colors flex items-center justify-center text-text-muted text-base">
          🔔
          <span className="absolute top-6 end-6 w-7 h-7 rounded-999 bg-brand border-[1.5px] border-white" />
        </button>
        <div className="w-px h-20 bg-border mx-4" />
        <button className="flex items-center gap-6 px-14 py-7 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors">
          <span className="text-base leading-none">+</span>
          سرور جدید
        </button>
      </div>
    </header>
  );
}
