type Trend = "up" | "down" | "neutral";

interface MetricCardProps {
  label: string;
  value: string;
  context?: string;
  trend?: Trend;
  trendValue?: string;
  icon: string;
}

const TREND_COLOR: Record<Trend, string> = {
  up:      "text-success",
  down:    "text-danger",
  neutral: "text-text-muted",
};
const TREND_ICON: Record<Trend, string> = { up: "↑", down: "↓", neutral: "→" };

export default function MetricCard({ label, value, context, trend, trendValue, icon }: MetricCardProps) {
  return (
    <div
      className="bg-bg-card rounded-20 border border-border p-20 flex flex-col gap-12"
      style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.04)", minHeight: 148 }}
    >
      <div className="flex items-start justify-between gap-8">
        <div className="w-44 h-44 rounded-12 bg-brand-light flex items-center justify-center text-[20px] shrink-0 select-none">
          {icon}
        </div>
        {trend && trendValue && (
          <span className={`text-[12px] font-medium shrink-0 ${TREND_COLOR[trend]}`}>
            {TREND_ICON[trend]} {trendValue}
          </span>
        )}
      </div>
      <div>
        <p className="text-[13px] font-medium text-text-muted mb-6">{label}</p>
        {/* Value stays LTR so units don't flip in RTL context */}
        <p className="text-[30px] font-bold text-text-main leading-none tabular-nums ltr-text">{value}</p>
      </div>
      {context && <p className="text-[12px] text-text-muted">{context}</p>}
    </div>
  );
}
