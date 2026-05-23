"use client";

interface HeaderProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  onMenuToggle: () => void;
}

export default function Header({ title, breadcrumbs, onMenuToggle }: HeaderProps) {
  return (
    <header
      style={{ height: "var(--header-height)", paddingInlineStart: "var(--sidebar-width)" }}
      className="glass-shell fixed top-0 inset-x-0 z-10 flex items-center border-b px-24 gap-16"
    >
      {/* Mobile hamburger — only visible below lg */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-36 h-36 flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg rounded-8 transition-colors text-[18px] shrink-0"
        aria-label="منو"
      >
        ☰
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-6 flex-1 min-w-0 overflow-hidden">
        {breadcrumbs?.map((crumb, i) => (
          <span key={i} className="flex items-center gap-6 shrink-0">
            <span className="text-[13px] text-text-muted hidden sm:inline">{crumb.label}</span>
            <span className="text-text-placeholder text-[11px] hidden sm:inline">/</span>
          </span>
        ))}
        <h1 className="text-[15px] font-semibold text-text-main truncate">{title}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-8 shrink-0">
        <button className="relative w-34 h-34 rounded-8 hover:bg-bg transition-colors flex items-center justify-center text-text-muted text-[16px]">
          ◫
          <span className="absolute top-6 end-6 w-7 h-7 rounded-999 bg-danger border-[1.5px] border-white" />
        </button>
        <div className="w-px h-20 bg-border" />
        <a
          href="/iaas/servers/new"
          className="hidden sm:flex items-center gap-6 px-14 py-7 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors"
        >
          + سرور جدید
        </a>
      </div>
    </header>
  );
}
