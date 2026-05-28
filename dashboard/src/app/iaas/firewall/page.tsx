"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardCard from "@/components/ui/DashboardCard";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ActionMenu from "@/components/ui/ActionMenu";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { MetricCardSkeleton, TableSkeleton } from "@/components/ui/LoadingSkeleton";

const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

type Direction = "inbound" | "outbound";
type Protocol  = "TCP" | "UDP" | "ICMP" | "Any";
type RuleAction = "allow" | "deny";
type RuleStatus = "active" | "inactive";

type FirewallRule = {
  id: string; name: string; region: string;
  direction: Direction; protocol: Protocol;
  portRange: string; source: string; destination: string;
  action: RuleAction; status: RuleStatus; priority: number;
  createdAt: string;
};

const ALL_RULES: FirewallRule[] = [
  { id: "fw-01", name: "allow-http",       region: "tehran",  direction: "inbound",  protocol: "TCP",  portRange: "80",       source: "0.0.0.0/0",      destination: "185.94.97.211", action: "allow", status: "active",   priority: 100, createdAt: "۱۴۰۲/۱۲/۰۱" },
  { id: "fw-02", name: "allow-https",      region: "tehran",  direction: "inbound",  protocol: "TCP",  portRange: "443",      source: "0.0.0.0/0",      destination: "185.94.97.211", action: "allow", status: "active",   priority: 110, createdAt: "۱۴۰۲/۱۲/۰۱" },
  { id: "fw-03", name: "allow-ssh-vpn",    region: "tehran",  direction: "inbound",  protocol: "TCP",  portRange: "22",       source: "10.0.0.0/8",     destination: "any",           action: "allow", status: "active",   priority: 120, createdAt: "۱۴۰۲/۱۲/۰۳" },
  { id: "fw-04", name: "allow-db-internal",region: "tehran",  direction: "inbound",  protocol: "TCP",  portRange: "5432",     source: "192.168.1.0/24", destination: "185.94.97.213", action: "allow", status: "active",   priority: 130, createdAt: "۱۴۰۲/۱۲/۰۵" },
  { id: "fw-05", name: "block-telnet",     region: "tehran",  direction: "inbound",  protocol: "TCP",  portRange: "23",       source: "0.0.0.0/0",      destination: "any",           action: "deny",  status: "active",   priority: 200, createdAt: "۱۴۰۲/۱۲/۱۰" },
  { id: "fw-06", name: "allow-outbound",   region: "tehran",  direction: "outbound", protocol: "Any",  portRange: "any",      source: "any",            destination: "0.0.0.0/0",    action: "allow", status: "active",   priority: 900, createdAt: "۱۴۰۲/۱۲/۰۱" },
  { id: "fw-07", name: "allow-icmp",       region: "tehran",  direction: "inbound",  protocol: "ICMP", portRange: "—",        source: "0.0.0.0/0",      destination: "any",           action: "allow", status: "inactive", priority: 150, createdAt: "۱۴۰۳/۰۱/۰۵" },
  { id: "fw-08", name: "allow-http-isf",   region: "isfahan", direction: "inbound",  protocol: "TCP",  portRange: "80,443",   source: "0.0.0.0/0",      destination: "192.168.10.51", action: "allow", status: "active",   priority: 100, createdAt: "۱۴۰۳/۰۲/۰۵" },
  { id: "fw-09", name: "block-rdp-isf",    region: "isfahan", direction: "inbound",  protocol: "TCP",  portRange: "3389",     source: "0.0.0.0/0",      destination: "any",           action: "deny",  status: "active",   priority: 210, createdAt: "۱۴۰۳/۰۲/۱۰" },
  { id: "fw-10", name: "allow-ssh-isf",    region: "isfahan", direction: "inbound",  protocol: "TCP",  portRange: "22",       source: "10.0.0.0/8",     destination: "any",           action: "allow", status: "active",   priority: 120, createdAt: "۱۴۰۳/۰۲/۰۵" },
  { id: "fw-11", name: "allow-http-msh",   region: "mashhad", direction: "inbound",  protocol: "TCP",  portRange: "80,443",   source: "0.0.0.0/0",      destination: "10.20.30.102",  action: "allow", status: "active",   priority: 100, createdAt: "۱۴۰۳/۰۱/۲۰" },
  { id: "fw-12", name: "allow-db-msh",     region: "mashhad", direction: "inbound",  protocol: "TCP",  portRange: "5432",     source: "10.1.0.0/24",    destination: "10.20.30.101",  action: "allow", status: "active",   priority: 130, createdAt: "۱۴۰۳/۰۱/۲۵" },
];

const DIRECTION_OPTIONS = [
  { value: "all",      label: "همه جهت‌ها"  },
  { value: "inbound",  label: "ورودی"        },
  { value: "outbound", label: "خروجی"        },
];

const ACTION_OPTIONS = [
  { value: "all",   label: "همه قوانین" },
  { value: "allow", label: "مجاز"       },
  { value: "deny",  label: "مسدود"      },
];

const REGION_LABEL: Record<string, string> = {
  tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد",
};

type PageState = "loading" | "error" | "empty" | "partial" | "ready";

export default function FirewallPage() {
  const [pageState, setPageState]   = useState<PageState>("ready");
  const [region, setRegion]         = useState("all");
  const [dirFilter, setDirFilter]   = useState("all");
  const [actFilter, setActFilter]   = useState("all");
  const [search, setSearch]         = useState("");

  const byRegion = useMemo(
    () => region === "all" ? ALL_RULES : ALL_RULES.filter(r => r.region === region),
    [region]
  );

  const rules = useMemo(() => {
    const q = search.trim().toLowerCase();
    return byRegion.filter(r => {
      const matchDir = dirFilter === "all" || r.direction === dirFilter;
      const matchAct = actFilter === "all" || r.action === actFilter;
      const matchQ   = !q || r.name.toLowerCase().includes(q) || r.portRange.includes(q) || r.source.includes(q);
      return matchDir && matchAct && matchQ;
    });
  }, [byRegion, dirFilter, actFilter, search]);

  const kpis = useMemo(() => ({
    total:    byRegion.length,
    inbound:  byRegion.filter(r => r.direction === "inbound").length,
    outbound: byRegion.filter(r => r.direction === "outbound").length,
    denied:   byRegion.filter(r => r.action === "deny").length,
  }), [byRegion]);

  const noResults = byRegion.length > 0 && rules.length === 0;
  const clearFilters = () => { setSearch(""); setDirFilter("all"); setActFilter("all"); };

  return (
    <DashboardShell
      title="فایروال"
      breadcrumbs={[
        { label: "پراکچیر", href: "/" },
        { label: "زیرساخت ابری", href: "/iaas" },
        { label: "فایروال" },
      ]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={(r) => { setRegion(r); clearFilters(); }}
    >
      {/* Dev switcher */}
      <div className="flex items-center gap-8 flex-wrap">
        {(["ready","loading","error","empty","partial"] as PageState[]).map(s => (
          <button key={s} onClick={() => setPageState(s)}
            className={`px-10 py-4 rounded-6 text-[11px] font-mono border transition-colors
              ${pageState === s ? "bg-brand text-white border-brand" : "text-text-muted border-border hover:border-border-strong"}`}>
            {s}
          </button>
        ))}
        <span className="text-[11px] text-text-muted">← حالت نمایش (توسعه)</span>
      </div>

      {pageState === "loading" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
            {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}
          </div>
          <div className="bg-bg-card rounded-20 border border-border overflow-hidden"><TableSkeleton /></div>
        </>
      )}

      {pageState === "error" && (
        <DashboardCard>
          <ErrorState title="دریافت قوانین فایروال ناموفق بود" description="اتصال به سرویس فایروال برقرار نشد." onRetry={() => setPageState("ready")} />
        </DashboardCard>
      )}

      {pageState === "empty" && (
        <DashboardCard>
          <EmptyState icon="◧" title="هنوز قانونی تعریف نکرده‌اید"
            description="قوانین فایروال ترافیک ورودی و خروجی سرورهای شما را کنترل می‌کنند."
            action={
              <a href="/iaas/firewall/new" className="px-20 py-9 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors">
                + افزودن قانون جدید
              </a>
            }
          />
        </DashboardCard>
      )}

      {pageState === "partial" && (
        <div className="rounded-12 px-16 py-10 border text-[13px]"
          style={{ background: "#fef3c7", borderColor: "#fcd34d", color: "#78350f" }}>
          برخی قوانین بروزرسانی نشدند — داده‌های نمایش‌داده شده ممکن است قدیمی باشند.
        </div>
      )}

      {(pageState === "ready" || pageState === "partial") && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
            <MetricCard icon="◧" label="جمع قوانین"    value={String(kpis.total)}    trend="neutral" trendValue="کل"    context="در این منطقه"    />
            <MetricCard icon="↓" label="قوانین ورودی"  value={String(kpis.inbound)}  trend="neutral" trendValue="ورودی" context="inbound"          />
            <MetricCard icon="↑" label="قوانین خروجی"  value={String(kpis.outbound)} trend="neutral" trendValue="خروجی" context="outbound"         />
            <MetricCard icon="⊘" label="مسدود"         value={String(kpis.denied)}   trend={kpis.denied > 0 ? "down" : "neutral"} trendValue="deny" context="قوانین بلاک" />
          </div>

          {/* Rules table */}
          <DashboardCard
            title="قوانین فایروال"
            action={
              <a href="/iaas/firewall/new"
                className="flex items-center gap-6 px-14 py-7 rounded-8 bg-brand text-white text-[12px] font-medium hover:bg-brand-hover transition-colors">
                + افزودن قانون
              </a>
            }
            padding={false}
          >
            {/* Filters */}
            <div className="flex items-center gap-10 px-20 py-12 border-b border-border flex-wrap">
              <div className="flex items-center gap-8 flex-1 min-w-[160px] border border-border rounded-8 px-12 h-34 bg-white/40 hover:border-border-strong transition-colors">
                <span className="text-[13px] text-text-muted shrink-0">⊕</span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="نام، پورت یا IP مبدأ..."
                  className="flex-1 text-[13px] bg-transparent border-0 outline-none text-text-main placeholder:text-text-placeholder"
                  style={{ direction: "rtl" }} />
                {search && <button onClick={() => setSearch("")} className="text-text-muted hover:text-text-main text-[12px]">✕</button>}
              </div>

              {[
                { value: dirFilter, setter: setDirFilter, options: DIRECTION_OPTIONS },
                { value: actFilter, setter: setActFilter, options: ACTION_OPTIONS    },
              ].map(({ value, setter, options }, idx) => (
                <div key={idx} className="flex items-center gap-6 border border-border rounded-8 px-10 h-34 bg-white/40 hover:border-border-strong transition-colors">
                  <select value={value} onChange={e => setter(e.target.value)}
                    className="text-[13px] font-medium text-text-main bg-transparent border-0 outline-none cursor-pointer"
                    style={{ direction: "rtl" }}>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}

              <span className="text-[12px] text-text-muted ltr-text ms-auto">{rules.length} / {byRegion.length}</span>
            </div>

            {byRegion.length === 0 ? (
              <EmptyState icon="◧" title="در این منطقه قانون فایروالی وجود ندارد" />
            ) : noResults ? (
              <EmptyState icon="⊕" title="قانونی با این فیلترها یافت نشد"
                action={<button onClick={clearFilters} className="px-16 py-7 rounded-8 border border-border text-[13px] text-text-muted hover:border-border-strong transition-colors">پاک کردن فیلترها</button>}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-20 py-10 text-start text-[12px] font-semibold text-text-muted">نام قانون</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted">جهت</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted">عملکرد</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden sm:table-cell">پروتکل</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden md:table-cell">پورت</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden lg:table-cell">مبدأ</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden xl:table-cell">اولویت</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden xl:table-cell">منطقه</th>
                      <th className="px-16 py-10 text-end   text-[12px] font-semibold text-text-muted">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.map((r, i) => (
                      <tr key={r.id}
                        className={`border-b border-border last:border-0 hover:bg-bg transition-colors ${i % 2 !== 0 ? "bg-bg" : ""}`}>
                        <td className="px-20 py-12">
                          <div className="flex items-center gap-8">
                            <span className={`w-7 h-7 rounded-full shrink-0 ${r.status === "active" ? "bg-success" : "bg-border-strong"}`} />
                            <span className="text-[14px] font-medium text-text-main">{r.name}</span>
                          </div>
                        </td>
                        <td className="px-16 py-12">
                          <StatusBadge variant={r.direction === "inbound" ? "info" : "success"}>
                            {r.direction === "inbound" ? "ورودی" : "خروجی"}
                          </StatusBadge>
                        </td>
                        <td className="px-16 py-12">
                          <StatusBadge variant={r.action === "allow" ? "success" : "danger"}>
                            {r.action === "allow" ? "مجاز" : "مسدود"}
                          </StatusBadge>
                        </td>
                        <td className="px-16 py-12 hidden sm:table-cell">
                          <span className="ltr-text text-[13px] text-text-muted font-mono">{r.protocol}</span>
                        </td>
                        <td className="px-16 py-12 hidden md:table-cell">
                          <span className="ltr-text text-[13px] text-text-muted font-mono">{r.portRange}</span>
                        </td>
                        <td className="px-16 py-12 hidden lg:table-cell">
                          <span className="ltr-text text-[13px] text-text-muted font-mono">{r.source}</span>
                        </td>
                        <td className="px-16 py-12 hidden xl:table-cell">
                          <span className="ltr-text text-[13px] text-text-muted">{r.priority}</span>
                        </td>
                        <td className="px-16 py-12 hidden xl:table-cell">
                          <span className="text-[13px] text-text-muted">{REGION_LABEL[r.region] ?? r.region}</span>
                        </td>
                        <td className="px-16 py-12 text-end">
                          <ActionMenu items={[
                            { label: "ویرایش قانون",   onClick: () => {} },
                            { label: r.status === "active" ? "غیرفعال کردن" : "فعال کردن", onClick: () => {} },
                            { label: "حذف قانون",      onClick: () => {}, danger: true },
                          ]} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardCard>
        </>
      )}
    </DashboardShell>
  );
}
