import DashboardShell from "@/components/layout/DashboardShell";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";

const SERVERS = [
  { name: "web-prod-01",    status: "running",  region: "تهران",  ip: "185.94.97.211", vcpu: 4,  ram: 8  },
  { name: "api-staging",   status: "stopped",  region: "تهران",  ip: "185.94.97.212", vcpu: 2,  ram: 4  },
  { name: "db-primary",    status: "running",  region: "تهران",  ip: "185.94.97.213", vcpu: 8,  ram: 16 },
  { name: "monitoring-thl",status: "building", region: "تهران",  ip: "185.94.97.214", vcpu: 2,  ram: 4  },
];

const STATUS: Record<string, { variant: "success"|"warning"|"danger"; label: string }> = {
  running:  { variant: "success", label: "در حال اجرا" },
  stopped:  { variant: "danger",  label: "متوقف" },
  building: { variant: "warning", label: "در حال ساخت" },
};

const QUICK_ACTIONS = [
  { icon: "🖥",  label: "سفارش سرور جدید",   sub: "ایجاد ماشین مجازی",       href: "/iaas/servers/new",  primary: true },
  { icon: "🌐",  label: "ایجاد شبکه خصوصی",  sub: "تنظیم VPC جدید",           href: "/iaas/networks/new" },
  { icon: "🛡",  label: "مدیریت فایروال",    sub: "ویرایش قوانین دسترسی",     href: "/iaas/firewall" },
  { icon: "🎫",  label: "ثبت تیکت پشتیبانی", sub: "پاسخگویی در کمتر از ۲ ساعت", href: "/support/new" },
];

export default function DashboardPage() {
  return (
    <DashboardShell title="داشبورد" breadcrumbs={[{ label: "پراکچیر" }]}>

      {/* Row 1 — Welcome / account hero */}
      <div
        className="rounded-20 px-24 py-20 flex items-center justify-between gap-16 border border-border"
        style={{ background: "linear-gradient(135deg, #eaf2ff 0%, #f7faff 100%)", boxShadow: "0 8px 24px rgba(15,23,42,0.04)" }}
      >
        <div className="flex flex-col gap-6">
          <p className="text-[13px] text-text-muted">خوش آمدید</p>
          <h2 className="text-[22px] font-bold text-text-main">احمدرضا عزیز</h2>
          <p className="text-[13px] text-text-muted">
            ۱۲ سرور فعال · ۳ شبکه · موجودی حساب:{" "}
            <span className="font-semibold text-text-main">۵٬۰۰۰٬۰۰۰ ریال</span>
          </p>
        </div>
        <div className="w-56 h-56 rounded-20 bg-brand-light flex items-center justify-center text-[28px] shrink-0 select-none">☁</div>
      </div>

      {/* Row 2 — KPI metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
        <StatCard
          icon="🖥"
          label="سرورهای فعال"
          value="۱۲"
          trend="up"
          trendValue="۲ این ماه"
          context="از ۲۰ سرور مجاز"
        />
        <StatCard
          icon="⚡"
          label="مصرف CPU"
          value="۳۸٪"
          trend="neutral"
          trendValue="میانگین"
          context="در ۱۲ سرور"
        />
        <StatCard
          icon="⇅"
          label="ترافیک شبکه"
          value="۴.۲ TB"
          trend="up"
          trendValue="۱۴٪"
          context="این ماه"
        />
        <StatCard
          icon="💳"
          label="هزینه این ماه"
          value="۱٫۲ M"
          trend="down"
          trendValue="۶٪"
          context="ریال — نسبت به ماه قبل"
        />
      </div>

      {/* Row 3 — Quick actions + server table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* Quick actions */}
        <div className="bg-bg-card rounded-20 border border-border p-20 flex flex-col gap-12"
             style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.04)" }}>
          <h3 className="text-[14px] font-bold text-text-main">دسترسی سریع</h3>
          <div className="flex flex-col gap-8">
            {QUICK_ACTIONS.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className={`flex items-center gap-12 px-14 py-10 rounded-12 border transition-all group
                  ${a.primary
                    ? "bg-brand border-brand text-white hover:bg-brand-hover"
                    : "border-border hover:bg-bg hover:border-border-strong"}`}
              >
                <span className="text-lg shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium truncate ${a.primary ? "text-white" : "text-text-main"}`}>{a.label}</p>
                  <p className={`text-[11px] truncate ${a.primary ? "text-white/70" : "text-text-muted"}`}>{a.sub}</p>
                </div>
                <span className={`text-sm shrink-0 ${a.primary ? "text-white/70" : "text-text-muted"}`}>←</span>
              </a>
            ))}
          </div>
        </div>

        {/* Latest servers */}
        <div className="lg:col-span-2 bg-bg-card rounded-20 border border-border overflow-hidden"
             style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.04)" }}>
          <div className="flex items-center justify-between px-20 py-14 border-b border-border">
            <h3 className="text-[14px] font-bold text-text-main">آخرین سرورها</h3>
            <a href="/iaas/servers" className="text-[12px] text-brand hover:text-brand-hover font-medium">مشاهده همه ←</a>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-20 py-10 text-start text-[12px] font-semibold text-text-muted">نام</th>
                <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted">وضعیت</th>
                <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden sm:table-cell">آدرس IP</th>
                <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden md:table-cell">منابع</th>
              </tr>
            </thead>
            <tbody>
              {SERVERS.map((s, i) => (
                <tr
                  key={s.name}
                  className={`border-b border-border last:border-0 hover:bg-bg transition-colors cursor-pointer ${i % 2 !== 0 ? "bg-bg" : ""}`}
                >
                  <td className="px-20 py-12 text-[14px] font-medium text-text-main">{s.name}</td>
                  <td className="px-16 py-12"><Badge variant={STATUS[s.status].variant}>{STATUS[s.status].label}</Badge></td>
                  {/* IP stays LTR inside RTL layout */}
                  <td className="px-16 py-12 hidden sm:table-cell">
                    <span className="ltr-text text-[13px] text-text-muted font-mono">{s.ip}</span>
                  </td>
                  {/* Resource string: assembled LTR to avoid digit reversal */}
                  <td className="px-16 py-12 hidden md:table-cell">
                    <span className="ltr-text text-[13px] text-text-muted">{s.vcpu} vCPU / {s.ram}GB RAM</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4 — Usage + billing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Resource usage */}
        <div className="bg-bg-card rounded-20 border border-border p-20"
             style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.04)" }}>
          <h3 className="text-[14px] font-bold text-text-main mb-16">مصرف منابع</h3>
          {[
            { label: "سرورها",   used: 12, total: 20, pct: 60, color: "#2554d8" },
            { label: "IP عمومی", used: 8,  total: 20, pct: 40, color: "#16a34a" },
            { label: "حجم دیسک", used: 750, total: 2000, pct: 37, unit: "GB", color: "#d97706" },
          ].map((r) => (
            <div key={r.label} className="mb-14 last:mb-0">
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-[13px] font-medium text-text-main">{r.label}</span>
                <span className="text-[12px] text-text-muted ltr-text">{r.used}{r.unit || ""} / {r.total}{r.unit || ""}</span>
              </div>
              <div className="h-6 rounded-999 bg-bg-muted overflow-hidden">
                <div className="h-full rounded-999 transition-all" style={{ width: `${r.pct}%`, background: r.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Billing summary */}
        <div className="bg-bg-card rounded-20 border border-border p-20"
             style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.04)" }}>
          <div className="flex items-center justify-between mb-16">
            <h3 className="text-[14px] font-bold text-text-main">صورتحساب ماه جاری</h3>
            <a href="/billing" className="text-[12px] text-brand font-medium">جزئیات ←</a>
          </div>
          {[
            { label: "سرویس محاسبات ابری", amount: "۸۵۰٬۰۰۰" },
            { label: "پهنای باند",          amount: "۲۲۰٬۰۰۰" },
            { label: "فضای ذخیره‌سازی",    amount: "۱۳۰٬۰۰۰" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-10 border-b border-border last:border-0">
              <span className="text-[13px] text-text-muted">{row.label}</span>
              <span className="text-[13px] font-semibold text-text-main ltr-text">{row.amount} ریال</span>
            </div>
          ))}
          <div className="flex items-center justify-between mt-12 pt-12 border-t-2 border-border">
            <span className="text-[14px] font-bold text-text-main">جمع کل</span>
            <span className="text-[18px] font-bold text-brand ltr-text">۱٬۲۰۰٬۰۰۰ ریال</span>
          </div>
        </div>
      </div>

    </DashboardShell>
  );
}
