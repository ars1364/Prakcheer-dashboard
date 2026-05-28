"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ActionMenu from "@/components/ui/ActionMenu";

const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

type LBStatus   = "active" | "inactive" | "error";
type LBAlgo     = "round_robin" | "least_conn" | "ip_hash";
type BackendStatus = "healthy" | "unhealthy" | "draining";

interface Backend {
  id: string;
  address: string;
  port: number;
  weight: number;
  status: BackendStatus;
  activeConns: number;
  rps: number;
}

interface LoadBalancer {
  id: string;
  name: string;
  status: LBStatus;
  region: string;
  ip: string;
  port: number;
  protocol: "HTTP" | "HTTPS" | "TCP";
  algorithm: LBAlgo;
  backends: Backend[];
  rps: number;
  p95ms: number;
  errorRate: number;
  createdAt: string;
}

const ALL_LBS: LoadBalancer[] = [
  {
    id: "lb-001", name: "lb-web-tehran", status: "active", region: "tehran",
    ip: "185.47.10.50", port: 443, protocol: "HTTPS", algorithm: "round_robin",
    rps: 1240, p95ms: 68, errorRate: 0.4, createdAt: "۱۴۰۳/۰۱/۱۵",
    backends: [
      { id: "bk-01", address: "185.94.97.211", port: 8080, weight: 1, status: "healthy",   activeConns: 82,  rps: 520 },
      { id: "bk-02", address: "185.94.97.213", port: 8080, weight: 2, status: "healthy",   activeConns: 148, rps: 720 },
      { id: "bk-03", address: "185.94.97.216", port: 8080, weight: 1, status: "draining",  activeConns: 12,  rps: 0   },
    ],
  },
  {
    id: "lb-002", name: "lb-api-tehran", status: "active", region: "tehran",
    ip: "185.47.10.51", port: 443, protocol: "HTTPS", algorithm: "least_conn",
    rps: 580, p95ms: 42, errorRate: 0.1, createdAt: "۱۴۰۳/۰۱/۲۰",
    backends: [
      { id: "bk-04", address: "185.94.97.212", port: 3000, weight: 1, status: "healthy",   activeConns: 34, rps: 280 },
      { id: "bk-05", address: "185.94.97.214", port: 3000, weight: 1, status: "healthy",   activeConns: 28, rps: 300 },
    ],
  },
  {
    id: "lb-003", name: "lb-db-tehran", status: "active", region: "tehran",
    ip: "185.47.10.52", port: 5432, protocol: "TCP", algorithm: "ip_hash",
    rps: 340, p95ms: 12, errorRate: 0.0, createdAt: "۱۴۰۳/۰۲/۰۵",
    backends: [
      { id: "bk-06", address: "185.94.97.213", port: 5432, weight: 1, status: "healthy",   activeConns: 55, rps: 340 },
    ],
  },
  {
    id: "lb-004", name: "lb-web-isfahan", status: "active", region: "isfahan",
    ip: "5.22.188.10", port: 443, protocol: "HTTPS", algorithm: "round_robin",
    rps: 420, p95ms: 55, errorRate: 0.6, createdAt: "۱۴۰۳/۰۲/۱۰",
    backends: [
      { id: "bk-07", address: "192.168.10.51", port: 8080, weight: 1, status: "healthy",   activeConns: 44, rps: 220 },
      { id: "bk-08", address: "192.168.10.52", port: 8080, weight: 1, status: "unhealthy", activeConns: 0,  rps: 0   },
    ],
  },
  {
    id: "lb-005", name: "lb-cdn-mashhad", status: "error", region: "mashhad",
    ip: "91.99.10.20", port: 80, protocol: "HTTP", algorithm: "round_robin",
    rps: 0, p95ms: 0, errorRate: 100, createdAt: "۱۴۰۳/۰۲/۲۸",
    backends: [
      { id: "bk-09", address: "10.20.30.102", port: 8080, weight: 1, status: "unhealthy", activeConns: 0, rps: 0 },
    ],
  },
];

// 24-hour RPS trend (account-wide)
const RPS_TREND = [
  { t: "۰۰:۰۰", rps: 820  },
  { t: "۰۴:۰۰", rps: 540  },
  { t: "۰۸:۰۰", rps: 1100 },
  { t: "۱۰:۰۰", rps: 1580 },
  { t: "۱۲:۰۰", rps: 2100 },
  { t: "۱۴:۰۰", rps: 1920 },
  { t: "۱۶:۰۰", rps: 2340 },
  { t: "۱۸:۰۰", rps: 2580 },
  { t: "۲۰:۰۰", rps: 1850 },
  { t: "۲۲:۰۰", rps: 1240 },
];

const LB_STATUS_MAP: Record<LBStatus, { variant: "success" | "danger" | "warning"; label: string }> = {
  active:   { variant: "success", label: "فعال"   },
  inactive: { variant: "warning", label: "غیرفعال"},
  error:    { variant: "danger",  label: "خطا"    },
};

const ALGO_LABEL: Record<LBAlgo, string> = {
  round_robin: "Round Robin",
  least_conn:  "Least Conn",
  ip_hash:     "IP Hash",
};

const BACKEND_COLOR: Record<BackendStatus, string> = {
  healthy:   "#22c55e",
  unhealthy: "#ef4444",
  draining:  "#f59e0b",
};
const BACKEND_LABEL: Record<BackendStatus, string> = {
  healthy: "سالم", unhealthy: "خراب", draining: "خروج",
};

function WeightBar({ backends }: { backends: Backend[] }) {
  const total = backends.reduce((s, b) => s + (b.status !== "unhealthy" ? b.rps || 1 : 0), 0) || 1;
  return (
    <div className="flex h-6 rounded-full overflow-hidden gap-[1px]">
      {backends.map(b => {
        const share = b.status !== "unhealthy" ? ((b.rps || 1) / total) * 100 : 0;
        return share > 0 ? (
          <div key={b.id} style={{ width: `${share}%`, background: BACKEND_COLOR[b.status] }}
               title={`${b.address}: ${b.rps} rps`} />
        ) : null;
      })}
    </div>
  );
}

const fontStyle = { fontFamily: "var(--font-vazirmatn)", fontSize: 11, fill: "#3d5957" };

export default function LoadBalancersPage() {
  const [region, setRegion] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const byRegion = useMemo(
    () => region === "all" ? ALL_LBS : ALL_LBS.filter(lb => lb.region === region),
    [region]
  );

  const kpis = useMemo(() => ({
    total:    byRegion.length,
    active:   byRegion.filter(lb => lb.status === "active").length,
    totalRps: byRegion.reduce((s, lb) => s + lb.rps, 0),
    totalBackends: byRegion.reduce((s, lb) => s + lb.backends.length, 0),
    unhealthy: byRegion.reduce((s, lb) => s + lb.backends.filter(b => b.status === "unhealthy").length, 0),
    errors: byRegion.filter(lb => lb.status === "error").length,
  }), [byRegion]);

  const regionLabel = (r: string) => ({ tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد" }[r] ?? r);

  return (
    <div style={{ maxWidth: "var(--content-max)" }} className="mx-auto p-16 sm:p-24 flex flex-col gap-16 sm:gap-20">
      {/* Traffic throughput header */}
      <div className="glass rounded-16 px-20 py-16 mb-20">
        <div className="flex flex-wrap gap-20 items-center">
          <div>
            <p className="text-[12px] text-text-muted mb-4">درخواست در ثانیه (کل)</p>
            <p className="text-[40px] font-bold text-text-main ltr-text leading-none">{kpis.totalRps.toLocaleString()}</p>
            <p className="text-[12px] text-text-muted mt-4">req/s</p>
          </div>
          <div className="flex-1 min-w-[260px] h-[80px] ltr-text">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RPS_TREND} margin={{ top: 2, right: 4, left: -30, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a4d8f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1a4d8f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ ...fontStyle, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "var(--font-vazirmatn)", fontSize: 11 }}
                  formatter={(v) => [`${v} req/s`, "RPS"]} />
                <Area type="monotone" dataKey="rps" stroke="#1a4d8f" fill="url(#gRps)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-10">
            {[
              { label: "لود بالانسر", count: kpis.active, total: kpis.total, color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
              { label: "بکند سالم",   count: kpis.totalBackends - kpis.unhealthy, total: kpis.totalBackends, color: "#1a4d8f", bg: "rgba(26,77,143,0.08)" },
              { label: "خطا / خراب",  count: kpis.errors + kpis.unhealthy, total: null, color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center py-10 px-12 rounded-12" style={{ background: item.bg }}>
                <span className="text-[22px] font-bold ltr-text" style={{ color: item.color }}>
                  {item.count}{item.total !== null ? `/${item.total}` : ""}
                </span>
                <span className="text-[11px] text-text-muted text-center mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
        <DashboardCard title="ترافیک ۲۴ ساعته (req/s)">
          <div className="h-[180px] ltr-text">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RPS_TREND} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRps2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a4d8f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1a4d8f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="t" tick={fontStyle} axisLine={false} tickLine={false} />
                <YAxis tick={fontStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "var(--font-vazirmatn)", fontSize: 12 }}
                  formatter={(v) => [`${v} req/s`, "RPS"]} />
                <Area type="monotone" dataKey="rps" stroke="#1a4d8f" fill="url(#gRps2)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="توزیع RPS بین لود بالانسرها">
          <div className="h-[180px] ltr-text">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byRegion.filter(lb => lb.rps > 0).map(lb => ({ name: lb.name.replace("lb-", ""), rps: lb.rps, p95: lb.p95ms }))}
                layout="vertical"
                margin={{ top: 4, right: 40, left: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barGradRps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a4d8f" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#1a4d8f" stopOpacity={0.55} />
                  </linearGradient>
                  <linearGradient id="barGradP95" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={fontStyle} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ ...fontStyle, fontFamily: "var(--font-vazirmatn)" }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "var(--font-vazirmatn)", fontSize: 12 }}
                  formatter={(v, n) => [n === "rps" ? `${v} req/s` : `${v}ms`, n === "rps" ? "RPS" : "P95"]} />
                <Bar dataKey="rps" fill="url(#barGradRps)" radius={[0, 4, 4, 0]} maxBarSize={14} name="rps" />
                <Bar dataKey="p95" fill="url(#barGradP95)" radius={[0, 4, 4, 0]} maxBarSize={14} name="p95" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* LB list with expandable backends */}
      <DashboardCard title="لیست لود بالانسرها" padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted w-10"></th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">نام</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">وضعیت</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">آدرس</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">الگوریتم</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">توزیع بار</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">RPS</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">P95</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">خطا</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">منطقه</th>
                <th className="px-16 py-10 text-[12px] font-medium text-text-muted w-10"></th>
              </tr>
            </thead>
            <tbody>
              {byRegion.map((lb, i) => (
                <>
                  <tr
                    key={lb.id}
                    className={`border-b border-border hover:bg-brand-light/30 transition-colors cursor-pointer ${i % 2 !== 0 ? "bg-white/20" : ""} ${expanded === lb.id ? "border-b-0" : ""}`}
                    onClick={() => setExpanded(expanded === lb.id ? null : lb.id)}
                  >
                    <td className="px-16 py-10 text-text-muted text-[11px]">{expanded === lb.id ? "▲" : "▼"}</td>
                    <td className="px-16 py-10">
                      <p className="ltr-text font-mono font-semibold text-brand text-[12px]">{lb.name}</p>
                      <p className="ltr-text text-[10px] text-text-placeholder">{lb.id} · {lb.protocol}</p>
                    </td>
                    <td className="px-16 py-10">
                      <StatusBadge variant={LB_STATUS_MAP[lb.status].variant} dot>{LB_STATUS_MAP[lb.status].label}</StatusBadge>
                    </td>
                    <td className="px-16 py-10">
                      <span className="ltr-text font-mono text-[12px] text-text-muted">{lb.ip}:{lb.port}</span>
                    </td>
                    <td className="px-16 py-10 ltr-text text-[11px] text-text-muted">{ALGO_LABEL[lb.algorithm]}</td>
                    <td className="px-16 py-10 min-w-[100px]"><WeightBar backends={lb.backends} /></td>
                    <td className="px-16 py-10 ltr-text font-medium text-text-main">{lb.rps > 0 ? lb.rps : "—"}</td>
                    <td className="px-16 py-10 ltr-text text-text-muted">{lb.p95ms > 0 ? `${lb.p95ms}ms` : "—"}</td>
                    <td className="px-16 py-10">
                      <span className={`ltr-text text-[12px] font-medium ${lb.errorRate > 1 ? "text-danger" : lb.errorRate > 0 ? "text-warning" : "text-success"}`}>
                        {lb.errorRate}%
                      </span>
                    </td>
                    <td className="px-16 py-10 text-text-muted">{regionLabel(lb.region)}</td>
                    <td className="px-16 py-10">
                      <ActionMenu items={[
                        { label: "ویرایش",          onClick: () => {} },
                        { label: "افزودن بکند",     onClick: () => {} },
                        { label: "مشاهده لاگ‌ها",  onClick: () => {} },
                        { label: "حذف",             onClick: () => {}, danger: true },
                      ]} />
                    </td>
                  </tr>
                  {expanded === lb.id && (
                    <tr key={`${lb.id}-backends`} className="border-b border-border bg-bg-muted/30">
                      <td colSpan={11} className="px-24 py-12">
                        <p className="text-[11px] text-text-muted mb-8">بکندها</p>
                        <div className="flex flex-col gap-6">
                          {lb.backends.map(b => (
                            <div key={b.id} className="flex items-center gap-16 rounded-8 px-12 py-8 border border-border bg-white/40">
                              <div className="w-8 h-8 rounded-full shrink-0" style={{ background: BACKEND_COLOR[b.status] }} />
                              <span className="ltr-text font-mono text-[12px] text-text-main w-[140px]">{b.address}:{b.port}</span>
                              <span className="text-[11px] text-text-muted" style={{ color: BACKEND_COLOR[b.status] }}>{BACKEND_LABEL[b.status]}</span>
                              <span className="ltr-text text-[11px] text-text-muted">وزن: {b.weight}</span>
                              <span className="ltr-text text-[11px] text-text-muted">اتصال فعال: {b.activeConns}</span>
                              <span className="ltr-text text-[11px] text-text-muted">{b.rps} req/s</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
