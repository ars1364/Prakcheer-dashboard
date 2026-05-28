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

// ─── Regions ──────────────────────────────────────────────────────────────────
const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

// ─── Networks ─────────────────────────────────────────────────────────────────
type NetStatus = "active" | "inactive" | "building" | "error";

type Network = {
  id: string; name: string; status: NetStatus; region: string;
  cidr: string; subnetCount: number; attachedServers: number;
  floatingIps: number; shared: boolean; createdAt: string;
};

const ALL_NETWORKS: Network[] = [
  { id: "net-01", name: "private-net",   status: "active",   region: "tehran",  cidr: "192.168.1.0/24", subnetCount: 2, attachedServers: 5, floatingIps: 3, shared: false, createdAt: "۱۴۰۲/۱۲/۰۱" },
  { id: "net-02", name: "db-net",        status: "active",   region: "tehran",  cidr: "10.0.0.0/24",    subnetCount: 1, attachedServers: 2, floatingIps: 0, shared: false, createdAt: "۱۴۰۲/۱۲/۰۵" },
  { id: "net-03", name: "staging-net",   status: "inactive", region: "tehran",  cidr: "172.16.0.0/24",  subnetCount: 1, attachedServers: 1, floatingIps: 1, shared: false, createdAt: "۱۴۰۳/۰۱/۱۰" },
  { id: "net-04", name: "isf-private",   status: "active",   region: "isfahan", cidr: "192.168.2.0/24", subnetCount: 1, attachedServers: 3, floatingIps: 2, shared: false, createdAt: "۱۴۰۳/۰۲/۰۵" },
  { id: "net-05", name: "isf-mgmt",      status: "building", region: "isfahan", cidr: "10.10.0.0/24",   subnetCount: 0, attachedServers: 0, floatingIps: 0, shared: false, createdAt: "۱۴۰۳/۰۳/۰۱" },
  { id: "net-06", name: "msh-backbone",  status: "active",   region: "mashhad", cidr: "10.1.0.0/24",    subnetCount: 2, attachedServers: 2, floatingIps: 1, shared: false, createdAt: "۱۴۰۳/۰۱/۲۰" },
  { id: "net-07", name: "msh-storage",   status: "active",   region: "mashhad", cidr: "10.1.1.0/24",    subnetCount: 1, attachedServers: 1, floatingIps: 0, shared: false, createdAt: "۱۴۰۳/۰۲/۱۵" },
];

const NET_STATUS_MAP: Record<NetStatus, { variant: "success" | "warning" | "danger" | "info"; label: string }> = {
  active:   { variant: "success", label: "فعال"          },
  inactive: { variant: "warning", label: "غیرفعال"       },
  building: { variant: "info",    label: "در حال ساخت"   },
  error:    { variant: "danger",  label: "خطا"           },
};

const REGION_LABEL: Record<string, string> = {
  tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد",
};

type PageState = "loading" | "error" | "empty" | "partial" | "ready";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NetworksPage() {
  const [pageState, setPageState] = useState<PageState>("ready");
  const [region, setRegion]       = useState("all");
  const [search, setSearch]       = useState("");

  const byRegion = useMemo(
    () => region === "all" ? ALL_NETWORKS : ALL_NETWORKS.filter(n => n.region === region),
    [region]
  );

  const networks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return !q ? byRegion : byRegion.filter(n =>
      n.name.toLowerCase().includes(q) || n.cidr.includes(q)
    );
  }, [byRegion, search]);

  const kpis = useMemo(() => ({
    total:       byRegion.length,
    active:      byRegion.filter(n => n.status === "active").length,
    subnets:     byRegion.reduce((a, n) => a + n.subnetCount, 0),
    floatingIps: byRegion.reduce((a, n) => a + n.floatingIps, 0),
  }), [byRegion]);

  const noResults = byRegion.length > 0 && networks.length === 0;

  return (
    <DashboardShell
      title="شبکه‌ها"
      breadcrumbs={[
        { label: "پراکچیر", href: "/" },
        { label: "زیرساخت ابری", href: "/iaas" },
        { label: "شبکه‌ها" },
      ]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={(r) => { setRegion(r); setSearch(""); }}
    >

      {/* Dev state switcher */}
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

      {/* ── Loading ── */}
      {pageState === "loading" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
            {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}
          </div>
          <div className="bg-bg-card rounded-20 border border-border overflow-hidden">
            <TableSkeleton />
          </div>
        </>
      )}

      {/* ── Error ── */}
      {pageState === "error" && (
        <DashboardCard>
          <ErrorState
            title="دریافت لیست شبکه‌ها ناموفق بود"
            description="اتصال به سرویس شبکه برقرار نشد. لطفاً دوباره تلاش کنید."
            onRetry={() => setPageState("ready")}
          />
        </DashboardCard>
      )}

      {/* ── Empty ── */}
      {pageState === "empty" && (
        <DashboardCard>
          <EmptyState
            icon="◎"
            title="هنوز شبکه‌ای ایجاد نکرده‌اید"
            description="یک شبکه خصوصی ایجاد کنید و سرورهای خود را به آن متصل کنید."
            action={
              <a href="/iaas/networks/new"
                className="px-20 py-9 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors">
                + ایجاد شبکه جدید
              </a>
            }
          />
        </DashboardCard>
      )}

      {/* ── Partial banner ── */}
      {pageState === "partial" && (
        <div className="rounded-12 px-16 py-10 border text-[13px]"
          style={{ background: "#fef3c7", borderColor: "#fcd34d", color: "#78350f" }}>
          برخی اطلاعات بروزرسانی نشدند — داده‌های نمایش‌داده شده ممکن است قدیمی باشند.
        </div>
      )}

      {/* ── Ready / Partial ── */}
      {(pageState === "ready" || pageState === "partial") && (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
            <MetricCard icon="◎" label="جمع شبکه‌ها"    value={String(kpis.total)}       trend="neutral" trendValue="کل"     context="در این منطقه"      />
            <MetricCard icon="⬤" label="شبکه‌های فعال"  value={String(kpis.active)}      trend="up"      trendValue="فعال"   context="آماده اتصال"       />
            <MetricCard icon="⊞" label="زیرشبکه‌ها"     value={String(kpis.subnets)}     trend="neutral" trendValue="کل"     context="تعریف‌شده"         />
            <MetricCard icon="⊙" label="IP شناور"       value={String(kpis.floatingIps)} trend="neutral" trendValue="تخصیص" context="آدرس عمومی"        />
          </div>

          {/* Networks table */}
          <DashboardCard
            title="لیست شبکه‌ها"
            action={
              <a href="/iaas/networks/new"
                className="flex items-center gap-6 px-14 py-7 rounded-8 bg-brand text-white text-[12px] font-medium hover:bg-brand-hover transition-colors">
                + ایجاد شبکه جدید
              </a>
            }
            padding={false}
          >
            {/* Search bar */}
            <div className="flex items-center gap-10 px-20 py-12 border-b border-border">
              <div className="flex items-center gap-8 flex-1 max-w-[320px] border border-border rounded-8 px-12 h-34 bg-white/40 hover:border-border-strong transition-colors">
                <span className="text-[13px] text-text-muted shrink-0">⊕</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="جستجو بر اساس نام یا CIDR..."
                  className="flex-1 text-[13px] bg-transparent border-0 outline-none text-text-main placeholder:text-text-placeholder"
                  style={{ direction: "rtl" }}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-text-muted hover:text-text-main text-[12px]">✕</button>
                )}
              </div>
              <span className="text-[12px] text-text-muted ltr-text ms-auto">
                {networks.length} / {byRegion.length}
              </span>
            </div>

            {byRegion.length === 0 ? (
              <EmptyState icon="◎" title="در این منطقه شبکه‌ای وجود ندارد" />
            ) : noResults ? (
              <EmptyState
                icon="⊕"
                title="نتیجه‌ای برای جستجوی شما یافت نشد"
                description={`برای "${search}" شبکه‌ای پیدا نشد.`}
                action={
                  <button onClick={() => setSearch("")}
                    className="px-16 py-7 rounded-8 border border-border text-[13px] text-text-muted hover:border-border-strong transition-colors">
                    پاک کردن جستجو
                  </button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-20 py-10 text-start text-[12px] font-semibold text-text-muted">نام</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted">وضعیت</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden sm:table-cell">منطقه</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden md:table-cell">محدوده CIDR</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden lg:table-cell">زیرشبکه</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden lg:table-cell">سرورهای متصل</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden xl:table-cell">IP شناور</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden xl:table-cell">ایجاد</th>
                      <th className="px-16 py-10 text-end   text-[12px] font-semibold text-text-muted">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {networks.map((n, i) => (
                      <tr key={n.id}
                        className={`border-b border-border last:border-0 hover:bg-bg transition-colors ${i % 2 !== 0 ? "bg-bg" : ""}`}>
                        <td className="px-20 py-12">
                          <a href={`/iaas/networks/${n.id}`}
                            className="text-[14px] font-medium text-brand hover:text-brand-hover hover:underline">
                            {n.name}
                          </a>
                        </td>
                        <td className="px-16 py-12">
                          <StatusBadge variant={NET_STATUS_MAP[n.status].variant} dot>
                            {NET_STATUS_MAP[n.status].label}
                          </StatusBadge>
                        </td>
                        <td className="px-16 py-12 hidden sm:table-cell">
                          <span className="text-[13px] text-text-muted">{REGION_LABEL[n.region] ?? n.region}</span>
                        </td>
                        <td className="px-16 py-12 hidden md:table-cell">
                          <span className="ltr-text text-[13px] text-text-muted font-mono">{n.cidr}</span>
                        </td>
                        <td className="px-16 py-12 hidden lg:table-cell">
                          <span className="ltr-text text-[13px] text-text-muted">{n.subnetCount}</span>
                        </td>
                        <td className="px-16 py-12 hidden lg:table-cell">
                          <span className="ltr-text text-[13px] text-text-muted">{n.attachedServers}</span>
                        </td>
                        <td className="px-16 py-12 hidden xl:table-cell">
                          <span className="ltr-text text-[13px] text-text-muted">{n.floatingIps}</span>
                        </td>
                        <td className="px-16 py-12 hidden xl:table-cell">
                          <span className="text-[12px] text-text-muted ltr-text">{n.createdAt}</span>
                        </td>
                        <td className="px-16 py-12 text-end">
                          <ActionMenu
                            items={[
                              { label: "مشاهده شبکه",     onClick: () => {} },
                              { label: "مدیریت زیرشبکه",  onClick: () => {} },
                              { label: "IP شناور",        onClick: () => {} },
                              { label: "حذف شبکه",        onClick: () => {}, danger: true },
                            ]}
                          />
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
