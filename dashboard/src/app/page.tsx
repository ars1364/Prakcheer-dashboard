import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const RECENT_SERVERS = [
  { name: "web-prod-01",      status: "running", region: "تهران", ip: "185.94.97.211", cpu: 4, ram: 8 },
  { name: "api-staging",      status: "stopped", region: "تهران", ip: "185.94.97.212", cpu: 2, ram: 4 },
  { name: "db-primary",       status: "running", region: "تهران", ip: "185.94.97.213", cpu: 8, ram: 16 },
  { name: "monitoring-thl",   status: "building", region: "تهران", ip: "185.94.97.214", cpu: 2, ram: 4 },
];

const STATUS_BADGE: Record<string, "success" | "danger" | "warning"> = {
  running:  "success",
  stopped:  "danger",
  building: "warning",
};
const STATUS_LABEL: Record<string, string> = {
  running:  "در حال اجرا",
  stopped:  "متوقف",
  building: "در حال ساخت",
};

export default function DashboardPage() {
  return (
    <DashboardShell
      title="داشبورد"
      breadcrumbs={[{ label: "پراکچیر" }]}
    >
      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <StatCard label="سرورهای فعال"    value="12"        icon="☁"  trend="up"      trendValue="2 این ماه" accent="bg-primary-light" />
        <StatCard label="مصرف CPU"         value="38٪"       icon="⚡" trend="neutral" trendValue="میانگین"   accent="bg-surface-muted" />
        <StatCard label="ترافیک شبکه"     value="4.2 TB"    icon="⇅"  trend="up"      trendValue="14٪"       accent="bg-surface-muted" />
        <StatCard label="هزینه این ماه"   value="۱٫۲M ریال" icon="◈"  trend="down"    trendValue="6٪"        accent="bg-primary-light" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Server list */}
        <Card padding={false} className="lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-20 py-16 border-b border-border">
            <h2 className="text-sm font-semibold text-text-main">آخرین سرورها</h2>
            <a href="/iaas/servers" className="text-xs text-primary hover:text-primary-hover font-medium">مشاهده همه ←</a>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th className="px-20 py-10 text-start text-xs font-medium text-text-muted">نام</th>
                <th className="px-16 py-10 text-start text-xs font-medium text-text-muted">وضعیت</th>
                <th className="px-16 py-10 text-start text-xs font-medium text-text-muted hidden sm:table-cell">آدرس IP</th>
                <th className="px-16 py-10 text-start text-xs font-medium text-text-muted hidden md:table-cell">CPU / RAM</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_SERVERS.map((s, i) => (
                <tr key={s.name} className={`border-b border-border last:border-0 hover:bg-bg-subtle transition-colors ${i % 2 === 0 ? "" : "bg-bg"}`}>
                  <td className="px-20 py-12 text-sm font-medium text-text-main">{s.name}</td>
                  <td className="px-16 py-12">
                    <Badge variant={STATUS_BADGE[s.status]}>{STATUS_LABEL[s.status]}</Badge>
                  </td>
                  <td className="px-16 py-12 text-sm text-text-muted font-mono hidden sm:table-cell">{s.ip}</td>
                  <td className="px-16 py-12 text-xs text-text-muted hidden md:table-cell">{s.cpu} vCPU / {s.ram} GB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Quick actions */}
        <Card>
          <h2 className="text-sm font-semibold text-text-main mb-16">دسترسی سریع</h2>
          <div className="flex flex-col gap-8">
            {[
              { label: "سفارش سرور جدید",  icon: "➕", href: "/iaas/servers/new" },
              { label: "مدیریت شبکه‌ها",    icon: "⇌",  href: "/iaas/networks" },
              { label: "تیکت پشتیبانی",    icon: "◎",  href: "/support/new" },
              { label: "مشاهده صورتحساب",  icon: "◈",  href: "/billing" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center gap-12 px-16 py-12 rounded-12 border border-border hover:bg-bg-subtle hover:border-border-strong transition-all group"
              >
                <span className="text-lg">{action.icon}</span>
                <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">{action.label}</span>
                <span className="ms-auto text-text-placeholder text-sm">←</span>
              </a>
            ))}
          </div>

          {/* Usage bar */}
          <div className="mt-20 pt-16 border-t border-border">
            <div className="flex justify-between text-xs text-text-muted mb-8">
              <span>استفاده از منابع</span>
              <span className="font-medium text-text-main">۷۵٪</span>
            </div>
            <div className="h-6 rounded-999 bg-bg-subtle overflow-hidden">
              <div className="h-full rounded-999 bg-primary transition-all" style={{ width: "75%" }} />
            </div>
            <p className="text-xs text-text-muted mt-6">۱۵ سرور از ۲۰ سرور مجاز</p>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
