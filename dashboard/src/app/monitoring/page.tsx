"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";

const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

// 24-hour timeline (every 2 hours)
const TIMELINE = [
  { t: "۰۰:۰۰", cpu: 22, ram: 55, net: 0.38 },
  { t: "۰۲:۰۰", cpu: 18, ram: 52, net: 0.25 },
  { t: "۰۴:۰۰", cpu: 16, ram: 51, net: 0.20 },
  { t: "۰۶:۰۰", cpu: 19, ram: 53, net: 0.30 },
  { t: "۰۸:۰۰", cpu: 35, ram: 60, net: 0.62 },
  { t: "۱۰:۰۰", cpu: 44, ram: 66, net: 0.85 },
  { t: "۱۲:۰۰", cpu: 52, ram: 71, net: 1.10 },
  { t: "۱۴:۰۰", cpu: 48, ram: 69, net: 0.95 },
  { t: "۱۶:۰۰", cpu: 55, ram: 74, net: 1.20 },
  { t: "۱۸:۰۰", cpu: 61, ram: 78, net: 1.35 },
  { t: "۲۰:۰۰", cpu: 49, ram: 72, net: 1.05 },
  { t: "۲۲:۰۰", cpu: 38, ram: 64, net: 0.78 },
];

// Latency timeline (ms)
const LATENCY = [
  { t: "۰۰:۰۰", p50: 18, p95: 42, p99: 88 },
  { t: "۰۲:۰۰", p50: 15, p95: 38, p99: 74 },
  { t: "۰۴:۰۰", p50: 14, p95: 35, p99: 70 },
  { t: "۰۶:۰۰", p50: 16, p95: 40, p99: 80 },
  { t: "۰۸:۰۰", p50: 22, p95: 55, p99: 110 },
  { t: "۱۰:۰۰", p50: 28, p95: 68, p99: 140 },
  { t: "۱۲:۰۰", p50: 35, p95: 88, p99: 185 },
  { t: "۱۴:۰۰", p50: 30, p95: 76, p99: 162 },
  { t: "۱۶:۰۰", p50: 38, p95: 95, p99: 200 },
  { t: "۱۸:۰۰", p50: 42, p95: 105, p99: 218 },
  { t: "۲۰:۰۰", p50: 32, p95: 80, p99: 170 },
  { t: "۲۲:۰۰", p50: 24, p95: 60, p99: 125 },
];

type AlertSeverity = "critical" | "warning" | "info";
interface MonitorAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  server: string;
  metric: string;
  value: string;
  threshold: string;
  since: string;
  region: string;
}

const ALL_ALERTS: MonitorAlert[] = [
  { id: "alt-001", severity: "critical", title: "مصرف RAM بحرانی", server: "db-primary", metric: "RAM", value: "83%", threshold: "80%", since: "۱۴ دقیقه پیش", region: "tehran" },
  { id: "alt-002", severity: "warning",  title: "بار CPU بالا",    server: "web-prod-01", metric: "CPU", value: "62%", threshold: "60%", since: "۳ دقیقه پیش",  region: "tehran" },
  { id: "alt-003", severity: "critical", title: "CPU بحرانی",      server: "lb-primary",  metric: "CPU", value: "78%", threshold: "70%", since: "۲ دقیقه پیش",  region: "tehran" },
  { id: "alt-004", severity: "warning",  title: "تاخیر شبکه بالا", server: "cdn-node-msh", metric: "Latency", value: "218ms", threshold: "200ms", since: "۸ دقیقه پیش", region: "mashhad" },
  { id: "alt-005", severity: "info",     title: "دیسک پر شد ۷۵٪", server: "backup-store", metric: "Disk", value: "75%", threshold: "75%", since: "۲۱ دقیقه پیش", region: "mashhad" },
];

type ServerHealth = {
  id: string; name: string; region: string;
  cpu: number; ram: number; diskIO: number; netMbps: number;
  latency: number; status: "healthy" | "warning" | "critical";
};

const ALL_SERVERS: ServerHealth[] = [
  { id: "srv-01", name: "web-prod-01",    region: "tehran",  cpu: 62, ram: 71, diskIO: 45, netMbps: 320, latency: 22, status: "warning"  },
  { id: "srv-02", name: "api-staging",    region: "tehran",  cpu: 0,  ram: 0,  diskIO: 0,  netMbps: 0,   latency: 0,  status: "healthy"  },
  { id: "srv-03", name: "db-primary",     region: "tehran",  cpu: 41, ram: 83, diskIO: 78, netMbps: 110, latency: 35, status: "critical" },
  { id: "srv-05", name: "web-prod-isf",   region: "isfahan", cpu: 38, ram: 55, diskIO: 30, netMbps: 140, latency: 18, status: "healthy"  },
  { id: "srv-06", name: "cache-isf",      region: "isfahan", cpu: 18, ram: 44, diskIO: 12, netMbps: 65,  latency: 14, status: "healthy"  },
  { id: "srv-08", name: "db-replica-msh", region: "mashhad", cpu: 29, ram: 61, diskIO: 55, netMbps: 88,  latency: 28, status: "healthy"  },
  { id: "srv-09", name: "cdn-node-msh",   region: "mashhad", cpu: 14, ram: 38, diskIO: 18, netMbps: 45,  latency: 42, status: "warning"  },
  { id: "srv-10", name: "lb-primary",     region: "tehran",  cpu: 78, ram: 48, diskIO: 22, netMbps: 890, latency: 12, status: "critical" },
  { id: "srv-11", name: "cache-node",     region: "tehran",  cpu: 31, ram: 52, diskIO: 35, netMbps: 210, latency: 20, status: "healthy"  },
];

const ALERT_VARIANT: Record<AlertSeverity, "danger" | "warning" | "info"> = {
  critical: "danger", warning: "warning", info: "info",
};
const ALERT_LABEL: Record<AlertSeverity, string> = {
  critical: "بحرانی", warning: "هشدار", info: "اطلاعات",
};
const STATUS_COLOR = { healthy: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };

// SVG semi-circle gauge
function MetricGauge({ label, value, unit, color, max = 100 }: { label: string; value: number; unit: string; color: string; max?: number }) {
  const r = 52;
  const pct = Math.min(value / max, 1);
  const arcLen = Math.PI * r;
  const dash = pct * arcLen;
  const trackColor = "rgba(94,168,161,0.15)";
  return (
    <div className="flex flex-col items-center">
      <svg width="130" height="78" viewBox="0 0 130 78">
        <path d={`M 13 65 A ${r} ${r} 0 0 1 117 65`} fill="none" stroke={trackColor} strokeWidth="11" strokeLinecap="round" />
        <path d={`M 13 65 A ${r} ${r} 0 0 1 117 65`} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${dash} ${arcLen}`} />
        <text x="65" y="62" textAnchor="middle" fontSize="20" fontWeight="700" fill={color}>{value}</text>
        <text x="65" y="76" textAnchor="middle" fontSize="11" fill="#6b7280">{unit}</text>
      </svg>
      <p className="text-[12px] text-text-muted mt-2 text-center">{label}</p>
    </div>
  );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const c = value > max * 0.85 ? "#ef4444" : value > max * 0.65 ? "#f59e0b" : color;
  return (
    <div className="flex items-center gap-6 min-w-[80px]">
      <div className="flex-1 h-[5px] rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c }} />
      </div>
      <span className="ltr-text text-[11px] text-text-muted w-[32px] text-end">{value}%</span>
    </div>
  );
}

const fontStyle = { fontFamily: "var(--font-vazirmatn)", fontSize: 11, fill: "#3d5957" };

export default function MonitoringPage() {
  const [region, setRegion] = useState("all");

  const byRegion = useMemo(
    () => region === "all" ? ALL_SERVERS : ALL_SERVERS.filter(s => s.region === region),
    [region]
  );
  const alerts = useMemo(
    () => region === "all" ? ALL_ALERTS : ALL_ALERTS.filter(a => a.region === region),
    [region]
  );

  const fleetMetrics = useMemo(() => {
    const active = byRegion.filter(s => s.cpu > 0);
    const n = active.length || 1;
    return {
      avgCpu: Math.round(active.reduce((s, sv) => s + sv.cpu, 0) / n),
      avgRam: Math.round(active.reduce((s, sv) => s + sv.ram, 0) / n),
      avgNet: Math.round(active.reduce((s, sv) => s + sv.netMbps, 0) / n),
      critical: byRegion.filter(s => s.status === "critical").length,
      warning: byRegion.filter(s => s.status === "warning").length,
      healthy: byRegion.filter(s => s.status === "healthy").length,
      total: byRegion.length,
    };
  }, [byRegion]);

  return (
    <DashboardShell
      title="مانیتورینگ"
      breadcrumbs={[{ label: "پراکچیر", href: "/" }, { label: "مانیتورینگ" }]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={setRegion}
    >
      {/* Live metric gauges header */}
      <div className="glass rounded-16 px-20 py-16 mb-20">
        <div className="flex flex-wrap gap-16 items-center justify-between">
          <div className="flex flex-wrap gap-20 items-center">
            <MetricGauge label="میانگین CPU"  value={fleetMetrics.avgCpu} unit="%" color={fleetMetrics.avgCpu > 80 ? "#ef4444" : fleetMetrics.avgCpu > 60 ? "#f59e0b" : "#1a4d8f"} />
            <MetricGauge label="میانگین RAM"  value={fleetMetrics.avgRam} unit="%" color={fleetMetrics.avgRam > 80 ? "#ef4444" : fleetMetrics.avgRam > 60 ? "#f59e0b" : "#16a34a"} />
            <MetricGauge label="شبکه (Mbps)" value={fleetMetrics.avgNet} unit="Mbps" color="#8b5cf6" max={1000} />
          </div>
          <div className="grid grid-cols-3 gap-10">
            {[
              { label: "بحرانی", count: fleetMetrics.critical, color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
              { label: "هشدار",  count: fleetMetrics.warning,  color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
              { label: "سالم",   count: fleetMetrics.healthy,  color: "#22c55e", bg: "rgba(34,197,94,0.08)"  },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center py-10 px-14 rounded-12" style={{ background: item.bg }}>
                <span className="text-[24px] font-bold ltr-text" style={{ color: item.color }}>{item.count}</span>
                <span className="text-[11px] text-text-muted mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
        {/* CPU + RAM trend */}
        <DashboardCard title="روند CPU و RAM — ۲۴ ساعت گذشته">
          <div className="h-[200px] ltr-text">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIMELINE} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a4d8f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1a4d8f" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="t" tick={fontStyle} axisLine={false} tickLine={false} />
                <YAxis tick={fontStyle} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "var(--font-vazirmatn)", fontSize: 12 }}
                  formatter={(v, n) => [`${v}%`, n === "cpu" ? "CPU" : "RAM"]} />
                <Area type="monotone" dataKey="cpu" stroke="#1a4d8f" fill="url(#gCpu)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="ram" stroke="#16a34a" fill="url(#gRam)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-16 mt-4 justify-end">
            <div className="flex items-center gap-6"><span className="w-10 h-3 rounded-full bg-brand inline-block" /><span className="text-[11px] text-text-muted">CPU</span></div>
            <div className="flex items-center gap-6"><span className="w-10 h-3 rounded-full inline-block" style={{ background: "#16a34a" }} /><span className="text-[11px] text-text-muted">RAM</span></div>
          </div>
        </DashboardCard>

        {/* Latency trend */}
        <DashboardCard title="تاخیر پاسخ (ms) — ۲۴ ساعت گذشته">
          <div className="h-[200px] ltr-text">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={LATENCY} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gP99" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gP95" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gP50" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="t" tick={fontStyle} axisLine={false} tickLine={false} />
                <YAxis tick={fontStyle} axisLine={false} tickLine={false} unit="ms" />
                <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "var(--font-vazirmatn)", fontSize: 12 }}
                  formatter={(v) => [`${v}ms`]} />
                <Area type="monotone" dataKey="p99" stroke="#ef4444" fill="url(#gP99)" strokeWidth={1.5} dot={false} name="P99" />
                <Area type="monotone" dataKey="p95" stroke="#f59e0b" fill="url(#gP95)" strokeWidth={1.5} dot={false} name="P95" />
                <Area type="monotone" dataKey="p50" stroke="#22c55e" fill="url(#gP50)" strokeWidth={2}   dot={false} name="P50" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-16 mt-4 justify-end">
            {[{ color: "#22c55e", label: "P50" }, { color: "#f59e0b", label: "P95" }, { color: "#ef4444", label: "P99" }].map(l => (
              <div key={l.label} className="flex items-center gap-6">
                <span className="w-10 h-3 rounded-full inline-block" style={{ background: l.color }} />
                <span className="text-[11px] text-text-muted">{l.label}</span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Network traffic chart */}
      <DashboardCard title="ترافیک شبکه (TB) — ۲۴ ساعت گذشته" className="mb-20">
        <div className="h-[160px] ltr-text">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TIMELINE} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="t" tick={fontStyle} axisLine={false} tickLine={false} />
              <YAxis tick={fontStyle} axisLine={false} tickLine={false} unit=" TB" />
              <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "var(--font-vazirmatn)", fontSize: 12 }}
                formatter={(v) => [`${v} TB`, "ترافیک"]} />
              <Bar dataKey="net" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={28} name="net" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Active alerts */}
        <div className="lg:col-span-1">
          <DashboardCard title={`هشدارها (${alerts.length})`}>
            {alerts.length === 0 ? (
              <div className="text-center py-20 text-text-muted text-[13px]">هیچ هشداری وجود ندارد</div>
            ) : (
              <div className="flex flex-col gap-10">
                {alerts.map(a => (
                  <div key={a.id} className="rounded-10 p-12 border"
                    style={{
                      background: a.severity === "critical" ? "rgba(239,68,68,0.06)" : a.severity === "warning" ? "rgba(245,158,11,0.06)" : "rgba(59,130,246,0.06)",
                      borderColor: a.severity === "critical" ? "rgba(239,68,68,0.2)" : a.severity === "warning" ? "rgba(245,158,11,0.2)" : "rgba(59,130,246,0.2)",
                    }}>
                    <div className="flex items-start justify-between gap-8 mb-6">
                      <p className="text-[12px] font-medium text-text-main">{a.title}</p>
                      <StatusBadge variant={ALERT_VARIANT[a.severity]}>{ALERT_LABEL[a.severity]}</StatusBadge>
                    </div>
                    <p className="ltr-text text-[11px] text-text-muted font-mono">{a.server}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="ltr-text text-[11px] font-semibold" style={{ color: a.severity === "critical" ? "#ef4444" : "#f59e0b" }}>{a.metric}: {a.value}</span>
                      <span className="text-[10px] text-text-placeholder">{a.since}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Per-server health table */}
        <div className="lg:col-span-2">
          <DashboardCard title="سلامت سرورها" padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">سرور</th>
                    <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">CPU</th>
                    <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">RAM</th>
                    <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">Disk IO</th>
                    <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">شبکه</th>
                    <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">تاخیر</th>
                    <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {byRegion.map((s, i) => (
                    <tr key={s.id} className={`border-b border-border last:border-0 hover:bg-brand-light/30 transition-colors ${i % 2 !== 0 ? "bg-white/20" : ""}`}>
                      <td className="px-16 py-10">
                        <p className="ltr-text text-[12px] font-medium text-text-main font-mono">{s.name}</p>
                        <p className="ltr-text text-[10px] text-text-placeholder">{s.id}</p>
                      </td>
                      <td className="px-16 py-10"><MiniBar value={s.cpu} max={100} color="#1a4d8f" /></td>
                      <td className="px-16 py-10"><MiniBar value={s.ram} max={100} color="#16a34a" /></td>
                      <td className="px-16 py-10"><MiniBar value={s.diskIO} max={100} color="#8b5cf6" /></td>
                      <td className="px-16 py-10 ltr-text text-[12px] text-text-muted">{s.netMbps > 0 ? `${s.netMbps}M` : "—"}</td>
                      <td className="px-16 py-10 ltr-text text-[12px] text-text-muted">{s.latency > 0 ? `${s.latency}ms` : "—"}</td>
                      <td className="px-16 py-10">
                        <div className="flex items-center gap-6">
                          <div className="w-8 h-8 rounded-full" style={{ background: STATUS_COLOR[s.status] }} />
                          <span className="text-[11px] text-text-muted">
                            {s.status === "healthy" ? "سالم" : s.status === "warning" ? "هشدار" : "بحرانی"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
      </div>
    </DashboardShell>
  );
}
