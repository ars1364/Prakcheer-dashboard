type Trend = "up" | "down" | "neutral";

interface StatCardProps {
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
const TREND_ICON: Record<Trend, string> = {
  up: "↑", down: "↓", neutral: "→",
};

export default function StatCard({ label, value, context, trend, trendValue, icon }: StatCardProps) {
  return (
    <div className="bg-bg-card rounded-20 border border-border p-20 flex flex-col gap-12"
         style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.04)", minHeight: 140 }}>
      {/* Top row: icon pill + trend */}
      <div className="flex items-center justify-between">
        <div className="w-44 h-44 rounded-12 bg-brand-light flex items-center justify-center text-lg shrink-0">
          {icon}
        </div>
        {trend && trendValue && (
          <span className={`text-[12px] font-medium ${TREND_COLOR[trend]}`}>
            {TREND_ICON[trend]} {trendValue}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-[13px] font-medium text-text-muted leading-none">{label}</p>

      {/* Main value */}
      <p className="text-[30px] font-bold text-text-main leading-none tabular-nums">{value}</p>

      {/* Context */}
      {context && <p className="text-[12px] text-text-muted">{context}</p>}
    </div>
  );
}
