interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: string;
  accent?: string;
}

export default function StatCard({ label, value, sub, trend, trendValue, icon, accent = "bg-primary-light" }: StatCardProps) {
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-text-muted";
  const trendIcon  = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <div className="bg-bg-card rounded-16 border border-border shadow-card p-20 flex items-start gap-16">
      {icon && (
        <div className={`w-44 h-44 rounded-12 ${accent} flex items-center justify-center text-xl shrink-0`}>
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-4">{label}</p>
        <p className="text-2xl font-bold text-text-main tabular-nums">{value}</p>
        {(sub || trendValue) && (
          <div className="flex items-center gap-8 mt-6">
            {trendValue && (
              <span className={`text-xs font-medium ${trendColor}`}>{trendIcon} {trendValue}</span>
            )}
            {sub && <span className="text-xs text-text-muted">{sub}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
