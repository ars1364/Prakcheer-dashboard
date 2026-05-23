type ServiceStatus = "stable" | "degraded" | "incident" | "outage";

interface StatusStripProps {
  status: ServiceStatus;
  alertCount?: number;
  lastUpdated?: string;
}

const STATUS_CONFIG: Record<ServiceStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  stable:   { label: "همه سرویس‌ها پایدار",   color: "#14532d", bg: "#dcfce7", border: "#86efac", dot: "#16a34a" },
  degraded: { label: "اختلال جزئی",            color: "#78350f", bg: "#fef3c7", border: "#fcd34d", dot: "#d97706" },
  incident: { label: "نیازمند بررسی",          color: "#7f1d1d", bg: "#fee2e2", border: "#fca5a5", dot: "#dc2626" },
  outage:   { label: "قطعی در یک ناحیه",       color: "#7f1d1d", bg: "#fee2e2", border: "#ef4444", dot: "#dc2626" },
};

export default function StatusStrip({ status, alertCount = 0, lastUpdated = "۲ دقیقه پیش" }: StatusStripProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div
      className="rounded-12 px-16 py-10 flex items-center gap-16 flex-wrap border text-[13px]"
      style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}
    >
      {/* Status indicator */}
      <div className="flex items-center gap-8 font-medium">
        <span className="w-8 h-8 rounded-999 shrink-0 animate-pulse" style={{ background: cfg.dot }} />
        وضعیت سرویس‌ها: <strong>{cfg.label}</strong>
      </div>

      <div className="w-px h-16 bg-current opacity-20 hidden sm:block" />

      <span className="text-current opacity-70">
        آخرین بروزرسانی: {lastUpdated}
      </span>

      {alertCount > 0 && (
        <>
          <div className="w-px h-16 bg-current opacity-20 hidden sm:block" />
          <span className="font-semibold">
            هشدارها: {alertCount} مورد نیازمند بررسی
          </span>
        </>
      )}

      {status === "stable" && alertCount === 0 && (
        <>
          <div className="w-px h-16 bg-current opacity-20 hidden sm:block" />
          <span className="opacity-70">هیچ هشداری فعال نیست</span>
        </>
      )}
    </div>
  );
}
