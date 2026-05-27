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

// ─── Servers ──────────────────────────────────────────────────────────────────
type ServerStatus = "running" | "stopped" | "building" | "error";
type Server = {
  id: string; name: string; status: ServerStatus;
  region: string; ip: string; vcpu: number; ram: number;
  disk: number; createdAt: string;
};

const ALL_SERVERS: Server[] = [
  { id: "srv-01", name: "web-prod-01",    status: "running",  region: "tehran",  ip: "185.94.97.211", vcpu: 4, ram: 8,  disk: 80,  createdAt: "۱۴۰۳/۰۱/۱۵" },
  { id: "srv-02", name: "api-staging",    status: "stopped",  region: "tehran",  ip: "185.94.97.212", vcpu: 2, ram: 4,  disk: 40,  createdAt: "۱۴۰۳/۰۱/۲۰" },
  { id: "srv-03", name: "db-primary",     status: "running",  region: "tehran",  ip: "185.94.97.213", vcpu: 8, ram: 16, disk: 500, createdAt: "۱۴۰۲/۱۲/۰۵" },
  { id: "srv-04", name: "monitoring-thl", status: "building", region: "tehran",  ip: "185.94.97.214", vcpu: 2, ram: 4,  disk: 40,  createdAt: "۱۴۰۳/۰۳/۰۱" },
  { id: "srv-05", name: "web-prod-isf",   status: "running",  region: "isfahan", ip: "192.168.10.51", vcpu: 4, ram: 8,  disk: 80,  createdAt: "۱۴۰۳/۰۲/۱۰" },
  { id: "srv-06", name: "cache-isf",      status: "running",  region: "isfahan", ip: "192.168.10.52", vcpu: 2, ram: 4,  disk: 40,  createdAt: "۱۴۰۳/۰۲/۱۵" },
  { id: "srv-07", name: "worker-isf",     status: "error",    region: "isfahan", ip: "192.168.10.53", vcpu: 2, ram: 4,  disk: 40,  createdAt: "۱۴۰۳/۰۲/۲۰" },
  { id: "srv-08", name: "db-replica-msh", status: "running",  region: "mashhad", ip: "10.20.30.101",  vcpu: 4, ram: 8,  disk: 200, createdAt: "۱۴۰۳/۰۱/۲۵" },
  { id: "srv-09", name: "cdn-node-msh",   status: "running",  region: "mashhad", ip: "10.20.30.102",  vcpu: 2, ram: 4,  disk: 40,  createdAt: "۱۴۰۳/۰۲/۰۵" },
  { id: "srv-10", name: "lb-primary",     status: "running",  region: "tehran",  ip: "185.94.97.215", vcpu: 2, ram: 4,  disk: 20,  createdAt: "۱۴۰۳/۰۲/۲۸" },
  { id: "srv-11", name: "cache-node",     status: "running",  region: "tehran",  ip: "185.94.97.216", vcpu: 4, ram: 8,  disk: 100, createdAt: "۱۴۰۳/۰۳/۰۱" },
  { id: "srv-12", name: "backup-store",   status: "stopped",  region: "mashhad", ip: "10.20.30.103",  vcpu: 2, ram: 4,  disk: 1000, createdAt: "۱۴۰۲/۱۱/۱۰" },
];

const STATUS_MAP: Record<ServerStatus, { variant: "success" | "warning" | "danger" | "info"; label: string }> = {
  running:  { variant: "success", label: "در حال اجرا" },
  stopped:  { variant: "danger",  label: "متوقف"       },
  building: { variant: "info",    label: "در حال ساخت" },
  error:    { variant: "danger",  label: "خطا"         },
};

const REGION_LABEL: Record<string, string> = {
  tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد",
};

const STATUS_OPTIONS = [
  { value: "all",      label: "همه وضعیت‌ها" },
  { value: "running",  label: "در حال اجرا"  },
  { value: "stopped",  label: "متوقف"         },
  { value: "building", label: "در حال ساخت"  },
  { value: "error",    label: "خطا"           },
];

type PageState = "loading" | "error" | "empty" | "partial" | "ready";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServersPage() {
  const [pageState, setPageState] = useState<PageState>("ready");
  const [region, setRegion]       = useState("all");
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("all");

  const byRegion = useMemo(
    () => region === "all" ? ALL_SERVERS : ALL_SERVERS.filter(s => s.region === region),
    [region]
  );

  const servers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return byRegion.filter(s => {
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.ip.includes(q);
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [byRegion, search, statusFilter]);

  const kpis = useMemo(() => ({
    total:    byRegion.length,
    running:  byRegion.filter(s => s.status === "running").length,
    problems: byRegion.filter(s => s.status === "stopped" || s.status === "error").length,
    building: byRegion.filter(s => s.status === "building").length,
  }), [byRegion]);

  const noResults = byRegion.length > 0 && servers.length === 0;

  return (
    <DashboardShell
      title="سرورها"
      breadcrumbs={[
        { label: "پراکچیر", href: "/" },
        { label: "زیرساخت ابری", href: "/iaas" },
        { label: "سرورها" },
      ]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={(r) => { setRegion(r); setSearch(""); setStatus("all"); }}
    >

      {/* Dev state switcher — remove in production */}
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
            title="دریافت لیست سرورها ناموفق بود"
            description="اتصال به سرویس زیرساخت برقرار نشد. لطفاً دوباره تلاش کنید."
            onRetry={() => setPageState("ready")}
          />
        </DashboardCard>
      )}

      {/* ── Empty (no servers in account) ── */}
      {pageState === "empty" && (
        <DashboardCard>
          <EmptyState
            icon="▣"
            title="هنوز سروری ایجاد نکرده‌اید"
            description="اولین سرور ابری خود را سفارش دهید و مدیریت زیرساخت را شروع کنید."
            action={
              <a href="/iaas/servers/new"
                className="px-20 py-9 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors">
                + سفارش اولین سرور
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
            <MetricCard icon="▣" label="جمع سرورها"   value={String(kpis.total)}    trend="neutral" trendValue="کل"       context="در این منطقه"         />
            <MetricCard icon="⬤" label="در حال اجرا"  value={String(kpis.running)}  trend="up"      trendValue="فعال"     context="آماده سرویس‌دهی"       />
            <MetricCard icon="⚠" label="متوقف / خطا"  value={String(kpis.problems)} trend={kpis.problems > 0 ? "down" : "neutral"} trendValue={kpis.problems > 0 ? "نیاز به بررسی" : "سالم"} context="توجه لازم است" />
            <MetricCard icon="↺" label="در حال ساخت"  value={String(kpis.building)} trend="neutral" trendValue="صف"       context="در انتظار آماده‌سازی"  />
          </div>

          {/* Server table */}
          <DashboardCard
            title="لیست سرورها"
            action={
              <a href="/iaas/servers/new"
                className="flex items-center gap-6 px-14 py-7 rounded-8 bg-brand text-white text-[12px] font-medium hover:bg-brand-hover transition-colors">
                + سفارش سرور جدید
              </a>
            }
            padding={false}
          >
            {/* Filter bar */}
            <div className="flex items-center gap-10 px-20 py-12 border-b border-border flex-wrap">
              {/* Search */}
              <div className="flex items-center gap-8 flex-1 min-w-[160px] border border-border rounded-8 px-12 h-34 bg-white/40 hover:border-border-strong transition-colors">
                <span className="text-[13px] text-text-muted shrink-0">⊕</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="جستجو بر اساس نام یا IP..."
                  className="flex-1 text-[13px] bg-transparent border-0 outline-none text-text-main placeholder:text-text-placeholder"
                  style={{ direction: "rtl" }}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-text-muted hover:text-text-main text-[12px]">✕</button>
                )}
              </div>
              {/* Status filter */}
              <div className="flex items-center gap-6 border border-border rounded-8 px-10 h-34 bg-white/40 hover:border-border-strong transition-colors">
                <select
                  value={statusFilter}
                  onChange={e => setStatus(e.target.value)}
                  className="text-[13px] font-medium text-text-main bg-transparent border-0 outline-none cursor-pointer"
                  style={{ direction: "rtl" }}
                >
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              {/* Result count */}
              <span className="text-[12px] text-text-muted shrink-0 ltr-text">
                {servers.length} / {byRegion.length}
              </span>
            </div>

            {/* Table or empty states */}
            {byRegion.length === 0 ? (
              <EmptyState icon="▣" title="در این منطقه سروری وجود ندارد" />
            ) : noResults ? (
              <EmptyState
                icon="⊕"
                title="نتیجه‌ای برای جستجوی شما یافت نشد"
                description={`برای "${search}" یا وضعیت انتخابی سروری پیدا نشد.`}
                action={
                  <button
                    onClick={() => { setSearch(""); setStatus("all"); }}
                    className="px-16 py-7 rounded-8 border border-border text-[13px] text-text-muted hover:border-border-strong transition-colors"
                  >
                    پاک کردن فیلترها
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
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden md:table-cell">آدرس IP</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden lg:table-cell">منابع</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden xl:table-cell">دیسک</th>
                      <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden xl:table-cell">ایجاد</th>
                      <th className="px-16 py-10 text-end   text-[12px] font-semibold text-text-muted">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servers.map((s, i) => (
                      <tr
                        key={s.id}
                        className={`border-b border-border last:border-0 hover:bg-bg transition-colors ${i % 2 !== 0 ? "bg-bg" : ""}`}
                      >
                        <td className="px-20 py-12">
                          <a href={`/iaas/servers/${s.id}`}
                            className="text-[14px] font-medium text-brand hover:text-brand-hover hover:underline">
                            {s.name}
                          </a>
                        </td>
                        <td className="px-16 py-12">
                          <StatusBadge variant={STATUS_MAP[s.status].variant} dot>
                            {STATUS_MAP[s.status].label}
                          </StatusBadge>
                        </td>
                        <td className="px-16 py-12 hidden sm:table-cell">
                          <span className="text-[13px] text-text-muted">{REGION_LABEL[s.region] ?? s.region}</span>
                        </td>
                        <td className="px-16 py-12 hidden md:table-cell">
                          <span className="ltr-text text-[13px] text-text-muted font-mono">{s.ip}</span>
                        </td>
                        <td className="px-16 py-12 hidden lg:table-cell">
                          <span className="ltr-text text-[13px] text-text-muted">{s.vcpu} vCPU / {s.ram} GB</span>
                        </td>
                        <td className="px-16 py-12 hidden xl:table-cell">
                          <span className="ltr-text text-[13px] text-text-muted">{s.disk} GB</span>
                        </td>
                        <td className="px-16 py-12 hidden xl:table-cell">
                          <span className="text-[12px] text-text-muted ltr-text">{s.createdAt}</span>
                        </td>
                        <td className="px-16 py-12 text-end">
                          <ActionMenu
                            items={[
                              { label: "مشاهده سرور",    onClick: () => {} },
                              { label: "کنسول",           onClick: () => {} },
                              { label: "راه‌اندازی مجدد", onClick: () => {} },
                              { label: "خاموش کردن",     onClick: () => {}, danger: true },
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
