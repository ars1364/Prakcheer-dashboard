"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import MetricCard from "@/components/ui/MetricCard";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ResourceBar from "@/components/ui/ResourceBar";
import ActionMenu from "@/components/ui/ActionMenu";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { MetricCardSkeleton, TableSkeleton } from "@/components/ui/LoadingSkeleton";
import StatusStrip from "@/components/dashboard/StatusStrip";
import AlertsCard from "@/components/dashboard/AlertsCard";
import type { Alert } from "@/components/dashboard/AlertsCard";

// ─── Regions ──────────────────────────────────────────────────────────────────
const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

// ─── Servers ──────────────────────────────────────────────────────────────────
type ServerStatus = "running" | "stopped" | "building" | "error";
type Server = { id: string; name: string; status: ServerStatus; region: string; ip: string; vcpu: number; ram: number };

const ALL_SERVERS: Server[] = [
  { id: "srv-01", name: "web-prod-01",    status: "running",  region: "tehran",  ip: "185.94.97.211", vcpu: 4, ram: 8  },
  { id: "srv-02", name: "api-staging",    status: "stopped",  region: "tehran",  ip: "185.94.97.212", vcpu: 2, ram: 4  },
  { id: "srv-03", name: "db-primary",     status: "running",  region: "tehran",  ip: "185.94.97.213", vcpu: 8, ram: 16 },
  { id: "srv-04", name: "monitoring-thl", status: "building", region: "tehran",  ip: "185.94.97.214", vcpu: 2, ram: 4  },
  { id: "srv-05", name: "web-prod-isf",   status: "running",  region: "isfahan", ip: "192.168.10.51", vcpu: 4, ram: 8  },
  { id: "srv-06", name: "cache-isf",      status: "running",  region: "isfahan", ip: "192.168.10.52", vcpu: 2, ram: 4  },
  { id: "srv-07", name: "worker-isf",     status: "error",    region: "isfahan", ip: "192.168.10.53", vcpu: 2, ram: 4  },
  { id: "srv-08", name: "db-replica-msh", status: "running",  region: "mashhad", ip: "10.20.30.101",  vcpu: 4, ram: 8  },
  { id: "srv-09", name: "cdn-node-msh",   status: "running",  region: "mashhad", ip: "10.20.30.102",  vcpu: 2, ram: 4  },
];

// ─── Alerts ───────────────────────────────────────────────────────────────────
const ALL_ALERTS: (Alert & { region: string })[] = [
  { id: "a1", severity: "warning",  title: "api-staging متوقف شده",              region: "tehran",  meta: "آخرین بررسی: ۵ دقیقه پیش",           href: "/iaas/servers/srv-02", actionLabel: "مشاهده سرور"    },
  { id: "a2", severity: "critical", title: "مصرف دیسک db-primary به ۸۲٪ رسیده", region: "tehran",  meta: "فضای باقی‌مانده: ۲۱.۶ GB از ۱۲۰ GB",  href: "/iaas/servers/srv-03", actionLabel: "مشاهده جزئیات"  },
  { id: "a3", severity: "critical", title: "worker-isf در وضعیت خطا",            region: "isfahan", meta: "آخرین خطا: ۱۲ دقیقه پیش",              href: "/iaas/servers/srv-07", actionLabel: "مشاهده سرور"    },
];

// ─── Status map ───────────────────────────────────────────────────────────────
const STATUS_MAP: Record<ServerStatus, { variant: "success" | "warning" | "danger" | "info"; label: string }> = {
  running:  { variant: "success", label: "در حال اجرا" },
  stopped:  { variant: "danger",  label: "متوقف"       },
  building: { variant: "info",    label: "در حال ساخت" },
  error:    { variant: "danger",  label: "خطا"         },
};

// ─── Per-region KPIs ──────────────────────────────────────────────────────────
type Trend = "up" | "down" | "neutral";
type KPI = {
  heroLabel: string;
  activeServers: string; activeServersContext: string;
  cpu: string;          cpuTrend: Trend; cpuContext: string;
  traffic: string;      trafficTrend: Trend;
  billing: string;      billingTrend: Trend;
};

const REGION_KPIS: Record<string, KPI> = {
  all:     { heroLabel: "۱۲ سرور فعال · ۳ شبکه", activeServers: "12", activeServersContext: "از ۲۰ سرور مجاز",  cpu: "38%", cpuTrend: "neutral", cpuContext: "در ۹ سرور",  traffic: "4.2 TB", trafficTrend: "up",      billing: "1.2 M", billingTrend: "down"    },
  tehran:  { heroLabel: "۴ سرور فعال · ۱ شبکه",  activeServers: "4",  activeServersContext: "از ۱۰ سرور مجاز", cpu: "42%", cpuTrend: "up",     cpuContext: "در ۴ سرور",  traffic: "2.1 TB", trafficTrend: "up",      billing: "840 K", billingTrend: "down"    },
  isfahan: { heroLabel: "۳ سرور فعال · ۱ شبکه",  activeServers: "3",  activeServersContext: "از ۶ سرور مجاز",  cpu: "31%", cpuTrend: "neutral", cpuContext: "در ۳ سرور",  traffic: "1.4 TB", trafficTrend: "neutral", billing: "260 K", billingTrend: "neutral" },
  mashhad: { heroLabel: "۲ سرور فعال · ۱ شبکه",  activeServers: "2",  activeServersContext: "از ۴ سرور مجاز",  cpu: "28%", cpuTrend: "down",   cpuContext: "در ۲ سرور",  traffic: "700 GB", trafficTrend: "neutral", billing: "180 K", billingTrend: "neutral" },
};

// ─── Per-region service status ────────────────────────────────────────────────
type ServiceStatus = "stable" | "degraded" | "incident" | "outage";
const REGION_STATUS: Record<string, { status: ServiceStatus; lastUpdated: string }> = {
  all:     { status: "incident", lastUpdated: "۲ دقیقه پیش"  },
  tehran:  { status: "incident", lastUpdated: "۵ دقیقه پیش"  },
  isfahan: { status: "outage",   lastUpdated: "۱۲ دقیقه پیش" },
  mashhad: { status: "stable",   lastUpdated: "۱ دقیقه پیش"  },
};

// ─── Per-region billing ───────────────────────────────────────────────────────
type BillingRow = { label: string; amount: string };
const REGION_BILLING: Record<string, { rows: BillingRow[]; total: string }> = {
  all:     { rows: [{ label: "سرویس محاسبات ابری", amount: "۸۵۰٬۰۰۰" }, { label: "پهنای باند", amount: "۲۲۰٬۰۰۰" }, { label: "فضای ذخیره‌سازی", amount: "۱۳۰٬۰۰۰" }], total: "۱٬۲۰۰٬۰۰۰" },
  tehran:  { rows: [{ label: "سرویس محاسبات ابری", amount: "۶۰۰٬۰۰۰" }, { label: "پهنای باند", amount: "۱۵۰٬۰۰۰" }, { label: "فضای ذخیره‌سازی", amount: "۹۰٬۰۰۰"  }], total: "۸۴۰٬۰۰۰"   },
  isfahan: { rows: [{ label: "سرویس محاسبات ابری", amount: "۱۸۰٬۰۰۰" }, { label: "پهنای باند", amount: "۵۰٬۰۰۰"  }, { label: "فضای ذخیره‌سازی", amount: "۳۰٬۰۰۰"  }], total: "۲۶۰٬۰۰۰"   },
  mashhad: { rows: [{ label: "سرویس محاسبات ابری", amount: "۱۲۰٬۰۰۰" }, { label: "پهنای باند", amount: "۴۰٬۰۰۰"  }, { label: "فضای ذخیره‌سازی", amount: "۲۰٬۰۰۰"  }], total: "۱۸۰٬۰۰۰"   },
};

// ─── Per-region resource bars ─────────────────────────────────────────────────
type Resources = { usedSrv: string; totalSrv: string; srvPct: number; usedIp: string; totalIp: string; ipPct: number; usedDisk: string; totalDisk: string; diskPct: number };
const REGION_RESOURCES: Record<string, Resources> = {
  all:     { usedSrv: "9",      totalSrv: "20",      srvPct: 45, usedIp: "8",  totalIp: "20", ipPct: 40, usedDisk: "750 GB", totalDisk: "2000 GB", diskPct: 37 },
  tehran:  { usedSrv: "4",      totalSrv: "10",      srvPct: 40, usedIp: "4",  totalIp: "10", ipPct: 40, usedDisk: "450 GB", totalDisk: "1000 GB", diskPct: 45 },
  isfahan: { usedSrv: "3",      totalSrv: "6",       srvPct: 50, usedIp: "3",  totalIp: "6",  ipPct: 50, usedDisk: "200 GB", totalDisk: "600 GB",  diskPct: 33 },
  mashhad: { usedSrv: "2",      totalSrv: "4",       srvPct: 50, usedIp: "2",  totalIp: "4",  ipPct: 50, usedDisk: "100 GB", totalDisk: "400 GB",  diskPct: 25 },
};

type PageState = "loading" | "error" | "empty" | "partial" | "ready";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [pageState, setPageState] = useState<PageState>("ready");
  const [region, setRegion]       = useState("all");

  const servers   = region === "all" ? ALL_SERVERS : ALL_SERVERS.filter(s => s.region === region);
  const alerts    = region === "all" ? ALL_ALERTS  : ALL_ALERTS.filter(a => a.region === region);
  const kpis      = REGION_KPIS[region];
  const svcStatus = REGION_STATUS[region];
  const billing   = REGION_BILLING[region];
  const resources = REGION_RESOURCES[region];

  return (
    <DashboardShell
      title="داشبورد"
      breadcrumbs={[{ label: "پراکچیر" }]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={setRegion}
    >

      {/* Dev state switcher — remove in production */}
      <div className="flex items-center gap-8 flex-wrap">
        {(["ready", "loading", "error", "empty", "partial"] as PageState[]).map(s => (
          <button
            key={s}
            onClick={() => setPageState(s)}
            className={`px-10 py-4 rounded-6 text-[11px] font-mono border transition-colors
              ${pageState === s ? "bg-brand text-white border-brand" : "text-text-muted border-border hover:border-border-strong"}`}
          >
            {s}
          </button>
        ))}
        <span className="text-[11px] text-text-muted">← حالت نمایش (توسعه)</span>
      </div>

      {/* ── Loading ── */}
      {pageState === "loading" && (
        <>
          <MetricCardSkeleton />
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
            title="دریافت اطلاعات داشبورد ناموفق بود"
            description="برخی سرویس‌ها در دسترس نیستند. لطفاً دوباره تلاش کنید."
            onRetry={() => setPageState("ready")}
          />
        </DashboardCard>
      )}

      {/* ── Empty ── */}
      {pageState === "empty" && (
        <DashboardCard>
          <EmptyState
            icon="☁"
            title="هنوز سروری ایجاد نکرده‌اید"
            description="اولین سرور ابری خود را ایجاد کنید و مدیریت زیرساخت را شروع کنید."
            action={
              <a href="/iaas/servers/new" className="px-20 py-9 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors">
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

      {/* ── Ready / Partial full content ── */}
      {(pageState === "ready" || pageState === "partial") && (
        <>
          {/* Row 1 — Welcome hero */}
          <div
            className="glass rounded-20 px-24 py-18 flex items-center justify-between gap-16 border"
            style={{ boxShadow: "0 8px 32px rgba(15,50,47,0.10)" }}
          >
            <div className="flex flex-col gap-4">
              <p className="text-[12px] text-text-muted">خوش آمدید</p>
              <h2 className="text-[20px] font-bold text-text-main">احمدرضا عزیز</h2>
              <p className="text-[13px] text-text-muted">
                {kpis.heroLabel} · موجودی:{" "}
                <span className="font-semibold text-text-main ltr-text">۵٬۰۰۰٬۰۰۰ ریال</span>
              </p>
            </div>
            <div className="hidden sm:flex w-48 h-48 rounded-16 bg-brand-light items-center justify-center text-[24px] shrink-0 select-none">
              ☁
            </div>
          </div>

          {/* Row 1b — Service status strip */}
          <StatusStrip status={svcStatus.status} alertCount={alerts.length} lastUpdated={svcStatus.lastUpdated} />

          {/* Row 2 — KPI metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
            <MetricCard icon="▣" label="سرورهای فعال"  value={kpis.activeServers} trend="up"               trendValue="2 این ماه" context={kpis.activeServersContext} />
            <MetricCard icon="⚡" label="مصرف CPU"      value={kpis.cpu}           trend={kpis.cpuTrend}     trendValue="میانگین"   context={kpis.cpuContext}          />
            <MetricCard icon="⇅" label="ترافیک شبکه"  value={kpis.traffic}       trend={kpis.trafficTrend} trendValue="14%"       context="این ماه"                  />
            <MetricCard icon="◈" label="هزینه این ماه" value={kpis.billing}       trend={kpis.billingTrend} trendValue="6%"        context="ریال — نسبت به ماه قبل"  />
          </div>

          {/* Row 3 — Alerts + server table */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
            <div className="xl:col-span-1">
              <AlertsCard alerts={alerts} />
            </div>

            <div className="xl:col-span-2">
              <DashboardCard
                title="آخرین سرورها"
                action={<a href="/iaas/servers" className="text-[12px] text-brand hover:text-brand-hover font-medium">مشاهده همه ←</a>}
                padding={false}
              >
                {servers.length === 0 ? (
                  <EmptyState icon="▣" title="در این منطقه سروری وجود ندارد" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px]">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-20 py-10 text-start text-[12px] font-semibold text-text-muted">نام</th>
                          <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted">وضعیت</th>
                          <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden sm:table-cell">آدرس IP</th>
                          <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden md:table-cell">منابع</th>
                          <th className="px-16 py-10 text-end text-[12px] font-semibold text-text-muted">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {servers.map((s, i) => (
                          <tr key={s.id} className={`border-b border-border last:border-0 hover:bg-bg transition-colors ${i % 2 !== 0 ? "bg-bg" : ""}`}>
                            <td className="px-20 py-12">
                              <a href={`/iaas/servers/${s.id}`} className="text-[14px] font-medium text-brand hover:text-brand-hover hover:underline">
                                {s.name}
                              </a>
                            </td>
                            <td className="px-16 py-12">
                              <StatusBadge variant={STATUS_MAP[s.status].variant} dot>
                                {STATUS_MAP[s.status].label}
                              </StatusBadge>
                            </td>
                            <td className="px-16 py-12 hidden sm:table-cell">
                              <span className="ltr-text text-[13px] text-text-muted font-mono">{s.ip}</span>
                            </td>
                            <td className="px-16 py-12 hidden md:table-cell">
                              <span className="ltr-text text-[13px] text-text-muted">{s.vcpu} vCPU / {s.ram}GB RAM</span>
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
            </div>
          </div>

          {/* Row 4 — Usage + billing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <DashboardCard title="مصرف منابع">
              <div className="flex flex-col gap-16">
                <ResourceBar label="سرورها"   used={resources.usedSrv}  total={resources.totalSrv}  pct={resources.srvPct}  />
                <ResourceBar label="IP عمومی" used={resources.usedIp}   total={resources.totalIp}   pct={resources.ipPct}   color="#16a34a" />
                <ResourceBar label="حجم دیسک" used={resources.usedDisk} total={resources.totalDisk} pct={resources.diskPct} color="#d97706" />
              </div>
            </DashboardCard>

            <DashboardCard
              title="صورتحساب ماه جاری"
              action={<a href="/billing" className="text-[12px] text-brand font-medium">جزئیات ←</a>}
            >
              <div className="flex flex-col divide-y divide-border -mx-20 -mb-20">
                {billing.rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-20 py-10">
                    <span className="text-[13px] text-text-muted">{row.label}</span>
                    <span className="text-[13px] font-semibold text-text-main ltr-text">{row.amount} ریال</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-20 py-12 bg-bg rounded-b-20">
                  <span className="text-[14px] font-bold text-text-main">جمع کل</span>
                  <span className="text-[18px] font-bold text-brand ltr-text">{billing.total} ریال</span>
                </div>
              </div>
            </DashboardCard>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
