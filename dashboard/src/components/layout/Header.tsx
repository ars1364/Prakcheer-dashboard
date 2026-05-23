"use client";

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function Header({ title, breadcrumbs }: HeaderProps) {
  return (
    <header
      style={{ height: "var(--header-height)", paddingInlineEnd: "var(--sidebar-width)" }}
      className="fixed top-0 start-0 end-0 z-10 flex items-center bg-bg-card border-b border-border shadow-card px-24 gap-16"
    >
      {/* Breadcrumb + title */}
      <div className="flex items-center gap-8 flex-1 min-w-0">
        {breadcrumbs?.map((crumb, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-sm text-text-muted">{crumb.label}</span>
            <span className="text-text-placeholder text-xs">/</span>
          </span>
        ))}
        <h1 className="text-[15px] font-semibold text-text-main truncate">{title}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-12 shrink-0">
        <button className="relative w-36 h-36 rounded-8 bg-bg-subtle hover:bg-surface transition-colors flex items-center justify-center text-text-muted text-lg">
          🔔
          <span className="absolute top-6 end-6 w-8 h-8 rounded-999 bg-primary border-2 border-white" />
        </button>
        <button className="px-16 py-8 rounded-8 bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors">
          + جدید
        </button>
      </div>
    </header>
  );
}
