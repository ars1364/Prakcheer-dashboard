import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  meta: string;
  href?: string;
  actionLabel?: string;
}

interface AlertsCardProps {
  alerts: Alert[];
}

const SEV_BADGE: Record<Alert["severity"], "danger" | "warning" | "info"> = {
  critical: "danger",
  warning:  "warning",
  info:     "info",
};
const SEV_LABEL: Record<Alert["severity"], string> = {
  critical: "بحرانی",
  warning:  "هشدار",
  info:     "اطلاع",
};

export default function AlertsCard({ alerts }: AlertsCardProps) {
  if (!alerts.length) {
    return (
      <DashboardCard title="هشدارها">
        <div className="flex items-center gap-10 text-[13px] text-success">
          <span className="w-8 h-8 rounded-999 bg-success shrink-0" />
          هیچ هشداری فعال نیست
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="هشدارها"
      action={
        <span className="inline-flex items-center justify-center w-20 h-20 rounded-999 bg-danger text-white text-[11px] font-bold">
          {alerts.length}
        </span>
      }
      padding={false}
    >
      <div className="flex flex-col divide-y divide-border">
        {alerts.map((alert) => (
          <div key={alert.id} className="px-20 py-14 flex items-start gap-12">
            <StatusBadge variant={SEV_BADGE[alert.severity]} dot>
              {SEV_LABEL[alert.severity]}
            </StatusBadge>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-text-main">{alert.title}</p>
              <p className="text-[12px] text-text-muted mt-2">{alert.meta}</p>
            </div>
            {alert.href && (
              <a
                href={alert.href}
                className="shrink-0 text-[12px] font-medium text-brand hover:text-brand-hover whitespace-nowrap"
              >
                {alert.actionLabel ?? "مشاهده"} ←
              </a>
            )}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
