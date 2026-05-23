interface ResourceBarProps {
  label: string;
  used: number | string;
  total: number | string;
  pct: number;
  color?: string;
}

export default function ResourceBar({ label, used, total, pct, color = "#2554d8" }: ResourceBarProps) {
  const safeColor = pct > 85 ? "#dc2626" : pct > 70 ? "#d97706" : color;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-medium text-text-main">{label}</span>
        <span className="text-[12px] text-text-muted ltr-text">{used} / {total}</span>
      </div>
      <div className="h-6 rounded-999 bg-bg-muted overflow-hidden">
        <div className="h-full rounded-999 transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%`, background: safeColor }} />
      </div>
    </div>
  );
}
