"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ResourceBar from "@/components/ui/ResourceBar";
import ActionMenu from "@/components/ui/ActionMenu";
import EmptyState from "@/components/ui/EmptyState";
import StatusStrip from "@/components/dashboard/StatusStrip";
import AlertsCard from "@/components/dashboard/AlertsCard";
import type { Alert } from "@/components/dashboard/AlertsCard";

const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

type ServerStatus = "running" | "stopped" | "building" | "error";
type Server = { id: string; name: string; status: ServerStatus; region: string; ip: string; vcpu: number; ram: number; cpu: number; ramUsed: number };

const ALL_SERVERS: Server[] = [
  { id: "srv-01", name: "web-prod-01",    status: "running",  region: "tehran",  ip: "185.94.97.211", vcpu: 4, ram: 8,  cpu: 62, ramUsed: 71 },
  { id: "srv-02", name: "api-staging",    status: "stopped",  region: "tehran",  ip: "185.94.97.212", vcpu: 2, ram: 4,  cpu: 0,  ramUsed: 0  },
  { id: "srv-03", name: "db-primary",     status: "running",  region: "tehran",  ip: "185.94.97.213", vcpu: 8, ram: 16, cpu: 41, ramUsed: 83 },
  { id: "srv-04", name: "monitoring-thl", status: "building", region: "tehran",  ip: "185.94.97.214", vcpu: 2, ram: 4,  cpu: 5,  ramUsed: 22 },
  { id: "srv-05", name: "web-prod-isf",   status: "running",  region: "isfahan", ip: "192.168.10.51", vcpu: 4, ram: 8,  cpu: 38, ramUsed: 55 },
  { id: "srv-06", name: "cache-isf",      status: "running",  region: "isfahan", ip: "192.168.10.52", vcpu: 2, ram: 4,  cpu: 18, ramUsed: 44 },
  { id: "srv-07", name: "worker-isf",     status: "error",    region: "isfahan", ip: "192.168.10.53", vcpu: 2, ram: 4,  cpu: 0,  ramUsed: 0  },
  { id: "srv-08", name: "db-replica-msh", status: "running",  region: "mashhad", ip: "10.20.30.101",  vcpu: 4, ram: 8,  cpu: 29, ramUsed: 61 },
  { id: "srv-09", name: "cdn-node-msh",   status: "running",  region: "mashhad", ip: "10.20.30.102",  vcpu: 2, ram: 4,  cpu: 14, ramUsed: 38 },
];

const ALL_ALERTS: (Alert & { region: string })[] = [
  { id: "a1", severity: "warning",  title: "api-staging متوقف شده",              region: "tehran",  meta: "آخرین بررسی: ۵ دقیقه پیش",           href: "/iaas/servers", actionLabel: "مشاهده سرور"   },
  { id: "a2", severity: "critical", title: "مصرف دیسک db-primary به ۸۲٪ رسیده", region: "tehran",  meta: "فضای باقی‌مانده: ۲۱.۶ GB از ۱۲۰ GB",  href: "/iaas/servers", actionLabel: "مشاهده جزئیات" },
  { id: "a3", severity: "critical", title: "worker-isf در وضعیت خطا",            region: "isfahan", meta: "آخرین خطا: ۱۲ دقیقه پیش",              href: "/iaas/servers", actionLabel: "مشاهده سرور"   },
];

const STATUS_MAP: Record<ServerStatus, { variant: "success" | "warning" | "danger" | "info"; label: string }> = {
  running:  { variant: "success", label: "در حال اجرا" },
  stopped:  { variant: "danger",  label: "متوقف"       },
  building: { variant: "info",    label: "در حال ساخت" },
  error:    { variant: "danger",  label: "خطا"         },
};

type Trend = "up" | "down" | "neutral";
type KPI = { heroLabel: string; activeServers: string; activeServersContext: string; cpu: string; cpuTrend: Trend; cpuContext: string; traffic: string; trafficTrend: Trend; billing: string; billingTrend: Trend };

const REGION_KPIS: Record<string, KPI> = {
  all:     { heroLabel: "۱۲ سرور فعال · ۳ شبکه", activeServers: "12", activeServersContext: "از ۲۰ سرور مجاز",  cpu: "38%", cpuTrend: "neutral", cpuContext: "در ۹ سرور",  traffic: "4.2 TB", trafficTrend: "up",      billing: "1.2 M", billingTrend: "down"    },
  tehran:  { heroLabel: "۴ سرور فعال · ۱ شبکه",  activeServers: "4",  activeServersContext: "از ۱۰ سرور مجاز", cpu: "42%", cpuTrend: "up",     cpuContext: "در ۴ سرور",  traffic: "2.1 TB", trafficTrend: "up",      billing: "840 K", billingTrend: "down"    },
  isfahan: { heroLabel: "۳ سرور فعال · ۱ شبکه",  activeServers: "3",  activeServersContext: "از ۶ سرور مجاز",  cpu: "31%", cpuTrend: "neutral", cpuContext: "در ۳ سرور",  traffic: "1.4 TB", trafficTrend: "neutral", billing: "260 K", billingTrend: "neutral" },
  mashhad: { heroLabel: "۲ سرور فعال · ۱ شبکه",  activeServers: "2",  activeServersContext: "از ۴ سرور مجاز",  cpu: "28%", cpuTrend: "down",   cpuContext: "در ۲ سرور",  traffic: "700 GB", trafficTrend: "neutral", billing: "180 K", billingTrend: "neutral" },
};

type ServiceStatus = "stable" | "degraded" | "incident" | "outage";
const REGION_STATUS: Record<string, { status: ServiceStatus; lastUpdated: string }> = {
  all:     { status: "incident", lastUpdated: "۲ دقیقه پیش"  },
  tehran:  { status: "incident", lastUpdated: "۵ دقیقه پیش"  },
  isfahan: { status: "outage",   lastUpdated: "۱۲ دقیقه پیش" },
  mashhad: { status: "stable",   lastUpdated: "۱ دقیقه پیش"  },
};

type BillingRow = { label: string; amount: string };
const REGION_BILLING: Record<string, { rows: BillingRow[]; total: string }> = {
  all:     { rows: [{ label: "محاسبات ابری", amount: "۸۵۰٬۰۰۰" }, { label: "پهنای باند", amount: "۲۲۰٬۰۰۰" }, { label: "ذخیره‌سازی", amount: "۱۳۰٬۰۰۰" }], total: "۱٬۲۰۰٬۰۰۰" },
  tehran:  { rows: [{ label: "محاسبات ابری", amount: "۶۰۰٬۰۰۰" }, { label: "پهنای باند", amount: "۱۵۰٬۰۰۰" }, { label: "ذخیره‌سازی", amount: "۹۰٬۰۰۰"  }], total: "۸۴۰٬۰۰۰"   },
  isfahan: { rows: [{ label: "محاسبات ابری", amount: "۱۸۰٬۰۰۰" }, { label: "پهنای باند", amount: "۵۰٬۰۰۰"  }, { label: "ذخیره‌سازی", amount: "۳۰٬۰۰۰"  }], total: "۲۶۰٬۰۰۰"   },
  mashhad: { rows: [{ label: "محاسبات ابری", amount: "۱۲۰٬۰۰۰" }, { label: "پهنای باند", amount: "۴۰٬۰۰۰"  }, { label: "ذخیره‌سازی", amount: "۲۰٬۰۰۰"  }], total: "۱۸۰٬۰۰۰"   },
};

type Resources = { usedSrv: string; totalSrv: string; srvPct: number; usedIp: string; totalIp: string; ipPct: number; usedDisk: string; totalDisk: string; diskPct: number };
const REGION_RESOURCES: Record<string, Resources> = {
  all:     { usedSrv: "9", totalSrv: "20", srvPct: 45, usedIp: "8",  totalIp: "20", ipPct: 40, usedDisk: "750 GB", totalDisk: "2000 GB", diskPct: 37 },
  tehran:  { usedSrv: "4", totalSrv: "10", srvPct: 40, usedIp: "4",  totalIp: "10", ipPct: 40, usedDisk: "450 GB", totalDisk: "1000 GB", diskPct: 45 },
  isfahan: { usedSrv: "3", totalSrv: "6",  srvPct: 50, usedIp: "3",  totalIp: "6",  ipPct: 50, usedDisk: "200 GB", totalDisk: "600 GB",  diskPct: 33 },
  mashhad: { usedSrv: "2", totalSrv: "4",  srvPct: 50, usedIp: "2",  totalIp: "4",  ipPct: 50, usedDisk: "100 GB", totalDisk: "400 GB",  diskPct: 25 },
};

// 7-day resource trend (CPU%, RAM%, Bandwidth TB)
const TREND_DATA_ALL = [
  { day: "شنبه",    cpu: 32, ram: 61, bw: 0.52 },
  { day: "یکشنبه",  cpu: 35, ram: 63, bw: 0.58 },
  { day: "دوشنبه",  cpu: 29, ram: 60, bw: 0.48 },
  { day: "سه‌شنبه", cpu: 41, ram: 67, bw: 0.63 },
  { day: "چهارشنبه",cpu: 44, ram: 70, bw: 0.71 },
  { day: "پنجشنبه", cpu: 38, ram: 65, bw: 0.60 },
  { day: "جمعه",    cpu: 36, ram: 64, bw: 0.57 },
];

// Monthly cost breakdown for bar chart (last 6 months)
const MONTHLY_COST_ALL = [
  { month: "دی",     cost: 980 },
  { month: "بهمن",   cost: 1050 },
  { month: "اسفند",  cost: 1100 },
  { month: "فروردین",cost: 890  },
  { month: "اردیبهشت",cost: 1150 },
  { month: "خرداد",  cost: 1200 },
];

// Service health tiles
const SERVICES = [
  { name: "IaaS محاسبات", status: "stable"   as ServiceStatus },
  { name: "شبکه",         status: "stable"   as ServiceStatus },
  { name: "ذخیره‌سازی",  status: "incident" as ServiceStatus },
  { name: "DNS",           status: "stable"   as ServiceStatus },
  { name: "لود بالانسر",  status: "degraded" as ServiceStatus },
  { name: "پشتیبان‌گیری", status: "stable"   as ServiceStatus },
];

const SERVICE_COLORS: Record<ServiceStatus, { dot: string; label: string }> = {
  stable:   { dot: "bg-success",  label: "عملیاتی"  },
  degraded: { dot: "bg-warning",  label: "افت سرعت" },
  incident: { dot: "bg-danger",   label: "حادثه"    },
  outage:   { dot: "bg-danger",   label: "قطعی"     },
};

function MiniUsageBar({ pct, color = "#1a4d8f" }: { pct: number; color?: string }) {
  const clr = pct > 80 ? "#ef4444" : pct > 60 ? "#f59e0b" : color;
  return (
    <div className="flex items-center gap-6">
      <div className="w-[60px] h-[6px] rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: clr }} />
      </div>
      <span className="ltr-text text-[11px] text-text-muted">{pct}%</span>
    </div>
  );
}

export default function DashboardPage() {
  const [region, setRegion] = useState("all");

  const servers   = region === "all" ? ALL_SERVERS : ALL_SERVERS.filter(s => s.region === region);
  const alerts    = region === "all" ? ALL_ALERTS  : ALL_ALERTS.filter(a => a.region === region);
  const kpis      = REGION_KPIS[region];
  const svcStatus = REGION_STATUS[region];
  const billing   = REGION_BILLING[region];
  const resources = REGION_RESOURCES[region];

  return (
    <div style={{ maxWidth: "var(--content-max)" }} className="mx-auto p-16 sm:p-24 flex flex-col gap-16 sm:gap-20">
      {/* Welcome hero */}
      <div className="glass rounded-20 px-24 py-18 flex items-center justify-between gap-16 border"
           style={{ boxShadow: "0 8px 32px rgba(15,50,47,0.10)" }}>
        <div className="flex flex-col gap-4">
          <p className="text-[12px] text-text-muted">خوش آمدید</p>
          <h2 className="text-[20px] font-bold text-text-main">احمدرضا عزیز</h2>
          <p className="text-[13px] text-text-muted">
            {kpis.heroLabel} · موجودی:{" "}
            <span className="font-semibold text-text-main ltr-text">۵٬۰۰۰٬۰۰۰ ریال</span>
          </p>
        </div>
        <div className="hidden sm:flex w-48 h-48 rounded-16 bg-brand-light items-center justify-center text-[24px] shrink-0 select-none">☁</div>
      </div>

      {/* Status strip */}
      <StatusStrip status={svcStatus.status} alertCount={alerts.length} lastUpdated={svcStatus.lastUpdated} />

      {/* Resource quota panel */}
      <div className="glass rounded-16 px-20 py-16">
        <p className="text-[12px] text-text-muted mb-12">استفاده از منابع</p>
        <div className="flex flex-col gap-10 mb-14">
          {[
            { label: "سرورها",       used: resources.usedSrv,  total: resources.totalSrv,  pct: resources.srvPct,  color: "#1a4d8f" },
            { label: "IP شناور",    used: resources.usedIp,   total: resources.totalIp,   pct: resources.ipPct,   color: "#8b5cf6" },
            { label: "ذخیره‌سازی", used: resources.usedDisk, total: resources.totalDisk, pct: resources.diskPct, color: "#16a34a" },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-10">
              <span className="text-[12px] text-text-muted w-[80px] shrink-0">{r.label}</span>
              <div className="flex-1 h-[10px] rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full transition-all"
                     style={{ width: `${r.pct}%`, background: r.pct > 75 ? "#ef4444" : r.pct > 50 ? "#f59e0b" : r.color }} />
              </div>
              <span className="ltr-text text-[12px] text-text-muted w-[90px] text-end">{r.used} / {r.total}</span>
              <span className="ltr-text text-[12px] font-semibold text-text-main w-[34px] text-end">{r.pct}٪</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
          {[
            { label: "سرورهای فعال", value: kpis.activeServers, sub: kpis.activeServersContext, color: "#1a4d8f", bg: "rgba(26,77,143,0.08)"  },
            { label: "میانگین CPU",  value: kpis.cpu,            sub: kpis.cpuContext,           color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
            { label: "ترافیک",       value: kpis.traffic,        sub: "این ماه",                 color: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
            { label: "هزینه ماه",    value: kpis.billing,        sub: "هزار ریال",               color: "#d97706", bg: "rgba(217,119,6,0.08)"  },
          ].map(item => (
            <div key={item.label} className="rounded-12 px-14 py-10 flex flex-col gap-4" style={{ background: item.bg }}>
              <span className="text-[18px] font-bold ltr-text" style={{ color: item.color }}>{item.value}</span>
              <span className="text-[11px] font-medium text-text-main">{item.label}</span>
              <span className="text-[10px] text-text-muted">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resource trend chart + Service health */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        <div className="xl:col-span-2">
          <DashboardCard title="روند مصرف منابع — ۷ روز گذشته">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={TREND_DATA_ALL} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1a4d8f" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1a4d8f" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.20} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,168,161,0.15)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#3d5957", fontFamily: "var(--font-vazirmatn)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#3d5957" }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(94,168,161,0.3)", borderRadius: 8, fontSize: 12 }}
                  formatter={(val: number, name: string) => [`${val}%`, name === "cpu" ? "CPU" : "RAM"]}
                />
                <Area type="monotone" dataKey="cpu" stroke="#1a4d8f" strokeWidth={2} fill="url(#cpuGrad)" name="cpu" dot={false} />
                <Area type="monotone" dataKey="ram" stroke="#16a34a" strokeWidth={2} fill="url(#ramGrad)" name="ram" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-16 mt-8 justify-end">
              <div className="flex items-center gap-6"><span className="w-12 h-3 rounded-full inline-block" style={{ background: "#1a4d8f" }} /><span className="text-[11px] text-text-muted">CPU</span></div>
              <div className="flex items-center gap-6"><span className="w-12 h-3 rounded-full inline-block" style={{ background: "#16a34a" }} /><span className="text-[11px] text-text-muted">RAM</span></div>
            </div>
          </DashboardCard>
        </div>

        <div className="xl:col-span-1">
          <DashboardCard title="وضعیت سرویس‌ها">
            <div className="grid grid-cols-2 gap-10">
              {SERVICES.map(svc => (
                <div key={svc.name} className="flex items-center gap-8 p-10 rounded-8 bg-bg-muted/60 border border-border">
                  <span className={`w-7 h-7 rounded-full shrink-0 ${SERVICE_COLORS[svc.status].dot}`} />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-text-main truncate">{svc.name}</p>
                    <p className="text-[11px] text-text-muted">{SERVICE_COLORS[svc.status].label}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Alerts + Server table with usage bars */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
        <div className="xl:col-span-1">
          <AlertsCard alerts={alerts} />
        </div>
        <div className="xl:col-span-2">
          <DashboardCard
            title="سرورها — وضعیت منابع"
            action={<a href="/iaas/servers" className="text-[12px] text-brand hover:text-brand-hover font-medium">مشاهده همه ←</a>}
            padding={false}
          >
            {servers.length === 0 ? (
              <EmptyState icon="▣" title="در این منطقه سروری وجود ندارد" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted">نام</th>
                      <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted">وضعیت</th>
                      <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted">CPU</th>
                      <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted">RAM</th>
                      <th className="px-16 py-10 text-end text-[12px] font-medium text-text-muted">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servers.map((s, i) => (
                      <tr key={s.id} className={`border-b border-border last:border-0 hover:bg-brand-light/30 transition-colors ${i % 2 !== 0 ? "bg-white/20" : ""}`}>
                        <td className="px-16 py-10">
                          <div>
                            <p className="text-[13px] font-medium text-brand ltr-text">{s.name}</p>
                            <p className="text-[11px] text-text-muted ltr-text">{s.ip}</p>
                          </div>
                        </td>
                        <td className="px-16 py-10">
                          <StatusBadge variant={STATUS_MAP[s.status].variant} dot>
                            {STATUS_MAP[s.status].label}
                          </StatusBadge>
                        </td>
                        <td className="px-16 py-10"><MiniUsageBar pct={s.cpu} /></td>
                        <td className="px-16 py-10"><MiniUsageBar pct={s.ramUsed} color="#16a34a" /></td>
                        <td className="px-16 py-10 text-end">
                          <ActionMenu items={[
                            { label: "مشاهده سرور",    onClick: () => {} },
                            { label: "کنسول",           onClick: () => {} },
                            { label: "راه‌اندازی مجدد", onClick: () => {} },
                            { label: "خاموش کردن",     onClick: () => {}, danger: true },
                          ]} />
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

      {/* Monthly cost trend + Resource bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <DashboardCard title="روند هزینه — ۶ ماه گذشته (هزار ریال)"
          action={<a href="/billing" className="text-[12px] text-brand font-medium">جزئیات ←</a>}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MONTHLY_COST_ALL} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,168,161,0.15)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#3d5957", fontFamily: "var(--font-vazirmatn)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#3d5957" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(94,168,161,0.3)", borderRadius: 8, fontSize: 12 }}
                formatter={(val: number) => [`${val}K ریال`, "هزینه"]}
              />
              <Bar dataKey="cost" fill="#1a4d8f" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard title="مصرف منابع">
          <div className="flex flex-col gap-16">
            <ResourceBar label="سرورها"   used={resources.usedSrv}  total={resources.totalSrv}  pct={resources.srvPct}  />
            <ResourceBar label="IP عمومی" used={resources.usedIp}   total={resources.totalIp}   pct={resources.ipPct}   color="#16a34a" />
            <ResourceBar label="حجم دیسک" used={resources.usedDisk} total={resources.totalDisk} pct={resources.diskPct} color="#d97706" />
          </div>
          <div className="mt-20 pt-16 border-t border-border">
            <p className="text-[12px] text-text-muted mb-10">هزینه ماه جاری</p>
            <div className="flex flex-col gap-6">
              {billing.rows.map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-[12px] text-text-muted">{row.label}</span>
                  <span className="text-[12px] font-medium text-text-main ltr-text">{row.amount} ریال</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-8 border-t border-border mt-4">
                <span className="text-[13px] font-bold text-text-main">جمع کل</span>
                <span className="text-[15px] font-bold text-brand ltr-text">{billing.total} ریال</span>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
