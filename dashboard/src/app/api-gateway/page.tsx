"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type RouteMethod  = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "ANY";
type RouteStatus  = "فعال" | "غیرفعال" | "مستهلک";
type AuthType     = "API Key" | "JWT" | "OAuth2" | "بدون احراز";

interface ApiRoute {
  id: string;
  path: string;
  method: RouteMethod;
  upstream: string;
  status: RouteStatus;
  auth: AuthType;
  rps: number;
  p50_ms: number;
  p99_ms: number;
  error_rate: number;
  rate_limit: number;
  tags: string[];
}

/* ─── mock data ─── */
const ALL_ROUTES: ApiRoute[] = [
  { id: "rt1",  path: "/v2/auth/**",          method: "ANY",    upstream: "auth-service:8080",   status: "فعال",     auth: "بدون احراز",rps: 840,  p50_ms: 12,  p99_ms: 48,  error_rate: 0.2,  rate_limit: 5000,  tags: ["auth"] },
  { id: "rt2",  path: "/v2/users/**",         method: "ANY",    upstream: "user-service:8081",   status: "فعال",     auth: "JWT",        rps: 620,  p50_ms: 18,  p99_ms: 84,  error_rate: 0.4,  rate_limit: 2000,  tags: ["users", "crud"] },
  { id: "rt3",  path: "/v2/products/**",      method: "GET",    upstream: "catalog-service:8082",status: "فعال",     auth: "JWT",        rps: 1840, p50_ms: 8,   p99_ms: 32,  error_rate: 0.1,  rate_limit: 10000, tags: ["catalog", "read"] },
  { id: "rt4",  path: "/v2/orders/**",        method: "ANY",    upstream: "order-service:8083",  status: "فعال",     auth: "JWT",        rps: 280,  p50_ms: 42,  p99_ms: 180, error_rate: 1.2,  rate_limit: 1000,  tags: ["orders"] },
  { id: "rt5",  path: "/v2/payments/**",      method: "POST",   upstream: "payment-svc:8084",    status: "فعال",     auth: "OAuth2",     rps: 120,  p50_ms: 84,  p99_ms: 420, error_rate: 0.8,  rate_limit: 500,   tags: ["payments", "sensitive"] },
  { id: "rt6",  path: "/v2/notifications/**", method: "ANY",    upstream: "notif-svc:8085",      status: "فعال",     auth: "JWT",        rps: 480,  p50_ms: 24,  p99_ms: 96,  error_rate: 0.3,  rate_limit: 3000,  tags: ["notifications"] },
  { id: "rt7",  path: "/v2/search/**",        method: "GET",    upstream: "search-svc:8086",     status: "فعال",     auth: "API Key",    rps: 2840, p50_ms: 28,  p99_ms: 120, error_rate: 0.5,  rate_limit: 20000, tags: ["search", "read"] },
  { id: "rt8",  path: "/v2/media/upload",     method: "POST",   upstream: "media-svc:8087",      status: "فعال",     auth: "JWT",        rps: 42,   p50_ms: 240, p99_ms: 840, error_rate: 2.1,  rate_limit: 200,   tags: ["media", "upload"] },
  { id: "rt9",  path: "/v2/admin/**",         method: "ANY",    upstream: "admin-svc:8088",      status: "فعال",     auth: "OAuth2",     rps: 8,    p50_ms: 62,  p99_ms: 240, error_rate: 0,    rate_limit: 100,   tags: ["admin", "sensitive"] },
  { id: "rt10", path: "/v1/**",               method: "ANY",    upstream: "legacy-api:8080",     status: "مستهلک",  auth: "API Key",    rps: 24,   p50_ms: 120, p99_ms: 480, error_rate: 3.4,  rate_limit: 500,   tags: ["legacy", "deprecated"] },
  { id: "rt11", path: "/v2/analytics/**",     method: "GET",    upstream: "analytics-svc:8089",  status: "فعال",     auth: "API Key",    rps: 180,  p50_ms: 84,  p99_ms: 380, error_rate: 0.6,  rate_limit: 1000,  tags: ["analytics"] },
  { id: "rt12", path: "/internal/**",         method: "ANY",    upstream: "internal-mesh",       status: "غیرفعال", auth: "JWT",        rps: 0,    p50_ms: 0,   p99_ms: 0,   error_rate: 0,    rate_limit: 0,     tags: ["internal"] },
];

const RPS_TIMELINE = [
  { h: "۰۰", rps: 1840, err: 12  }, { h: "۰۲", rps: 1120, err: 8   }, { h: "۰۴", rps: 820,  err: 6   },
  { h: "۰۶", rps: 1480, err: 10  }, { h: "۰۸", rps: 3840, err: 28  }, { h: "۱۰", rps: 6200, err: 48  },
  { h: "۱۲", rps: 7480, err: 64  }, { h: "۱۴", rps: 6840, err: 56  }, { h: "۱۶", rps: 5920, err: 42  },
  { h: "۱۸", rps: 4800, err: 32  }, { h: "۲۰", rps: 3480, err: 22  }, { h: "۲۲", rps: 2640, err: 16  },
];

const LATENCY_DIST = [
  { bucket: "<10ms",  count: 28400 }, { bucket: "10-50ms", count: 48200 },
  { bucket: "50-100ms",count: 18400 },{ bucket: "100-500ms",count: 4800 },
  { bucket: ">500ms", count: 420 },
];

const METHOD_DATA = [
  { name: "GET",    value: ALL_ROUTES.filter(r => r.method === "GET").length + ALL_ROUTES.filter(r => r.method === "ANY").length, fill: "#16a34a" },
  { name: "POST",   value: ALL_ROUTES.filter(r => r.method === "POST").length, fill: "#2554d8" },
  { name: "ANY",    value: 0, fill: "#8b5cf6" },
  { name: "PUT",    value: 1, fill: "#d97706" },
  { name: "DELETE", value: 0, fill: "#ef4444" },
].filter(d => d.value > 0);

/* ─── colors ─── */
const METHOD_COLOR: Record<RouteMethod, string> = {
  GET:    "#16a34a", POST:  "#2554d8", PUT:    "#d97706",
  DELETE: "#ef4444", PATCH: "#8b5cf6", ANY:    "#06b6d4",
};

const ROUTE_STATUS_COLOR: Record<RouteStatus, string> = {
  "فعال":    "#16a34a",
  "غیرفعال":"#94a3b8",
  "مستهلک": "#ef4444",
};

const AUTH_COLOR: Record<AuthType, string> = {
  "API Key":     "#2554d8",
  "JWT":         "#8b5cf6",
  "OAuth2":      "#d97706",
  "بدون احراز": "#94a3b8",
};

/* ─── tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] shadow-lg" style={{ direction: "rtl" }}>
      <p className="font-semibold mb-4">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

/* ─── error rate badge ─── */
function ErrBadge({ rate }: { rate: number }) {
  const color = rate === 0 ? "#16a34a" : rate < 1 ? "#d97706" : "#ef4444";
  return <span className="ltr-text font-mono text-[11px]" style={{ color }}>{rate.toFixed(1)}٪</span>;
}

/* ─── page ─── */
export default function ApiGatewayPage() {
  const [statusFilter, setStatusFilter] = useState<RouteStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let routes = ALL_ROUTES;
    if (statusFilter !== "all") routes = routes.filter(r => r.status === statusFilter);
    if (search) routes = routes.filter(r => r.path.includes(search) || r.upstream.includes(search));
    return routes;
  }, [statusFilter, search]);

  const totalRps     = ALL_ROUTES.filter(r => r.status === "فعال").reduce((s, r) => s + r.rps, 0);
  const activeRoutes = ALL_ROUTES.filter(r => r.status === "فعال").length;
  const avgP99       = Math.round(ALL_ROUTES.filter(r => r.p99_ms > 0).reduce((s, r, _, a) => s + r.p99_ms / a.length, 0));
  const highErrRoutes= ALL_ROUTES.filter(r => r.error_rate >= 1 && r.status === "فعال").length;

  /* RPS segmented bar — top 5 routes */
  const topRps = [...ALL_ROUTES].sort((a, b) => b.rps - a.rps).slice(0, 5);
  const maxRps = topRps[0]?.rps || 1;

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[14px] font-bold text-text-main">API Gateway</h2>
          <div className="flex items-center gap-8">
            {highErrRoutes > 0 && (
              <div className="flex items-center gap-6 px-10 py-5 rounded-8 text-[11px] font-bold"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
                ⚠ {highErrRoutes} مسیر با خطای بالا
              </div>
            )}
            <span className="text-[12px] font-bold text-brand ltr-text">{totalRps.toLocaleString()} RPS</span>
          </div>
        </div>

        {/* top routes RPS bars */}
        <div className="flex flex-col gap-5 mb-14">
          <p className="text-[11px] text-text-muted mb-4">پرترافیک‌ترین مسیرها (RPS)</p>
          {topRps.map(r => (
            <div key={r.id} className="flex items-center gap-10">
              <span className="text-[10px] text-text-muted ltr-text w-[180px] truncate shrink-0">{r.path}</span>
              <div className="flex-1 h-8 rounded-999 bg-[#e2e8f0] overflow-hidden">
                <div style={{ width: `${(r.rps / maxRps) * 100}%`, background: METHOD_COLOR[r.method] }}
                  className="h-full rounded-999" />
              </div>
              <span className="ltr-text text-[11px] text-text-muted w-[48px] text-end shrink-0">{r.rps.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "مسیرهای فعال",    value: `${activeRoutes} / ${ALL_ROUTES.length}`, color: "#16a34a" },
            { label: "RPS کل",          value: totalRps.toLocaleString(),                color: "#2554d8" },
            { label: "P99 میانگین",     value: `${avgP99}ms`,                           color: "#8b5cf6" },
            { label: "مسیر خطای بالا",  value: highErrRoutes,                           color: highErrRoutes > 0 ? "#ef4444" : "#16a34a" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[22px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* RPS + error timeline */}
        <div className="glass rounded-16 p-16 lg:col-span-2">
          <p className="text-[13px] font-semibold text-text-main mb-12">RPS و خطا — ۲۴ ساعت</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RPS_TIMELINE} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="rpsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2554d8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2554d8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="h" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis yAxisId="rps" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis yAxisId="err" orientation="right" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
                <Area yAxisId="rps" type="monotone" dataKey="rps" name="RPS"   stroke="#2554d8" fill="url(#rpsGrad)" strokeWidth={2} dot={false} />
                <Area yAxisId="err" type="monotone" dataKey="err" name="خطا"  stroke="#ef4444" fill="none" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* latency distribution */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">توزیع Latency</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LATENCY_DIST} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bucket" tick={{ fontSize: 9, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="درخواست" fill="#2554d8" radius={[4,4,0,0]}>
                  {LATENCY_DIST.map((d, i) => <Cell key={i} fill={i < 2 ? "#16a34a" : i < 3 ? "#d97706" : "#ef4444"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─── routes table ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex flex-wrap items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">مسیرهای API</h3>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="جستجو path..."
            className="border border-border rounded-8 px-10 py-6 text-[12px] bg-bg text-text-main w-[160px] outline-none"
          />
          {(["all", "فعال", "غیرفعال", "مستهلک"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ${statusFilter === s ? "bg-brand text-white" : "bg-bg text-text-muted hover:text-text-main border border-border"}`}>
              {s === "all" ? "همه" : s}
            </button>
          ))}
          <button className="flex items-center gap-6 px-12 py-6 rounded-8 text-[12px] font-medium bg-brand text-white hover:bg-brand/90 transition-colors">
            + مسیر جدید
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-start pb-8 font-medium">Method</th>
                <th className="text-start pb-8 font-medium">Path</th>
                <th className="text-start pb-8 font-medium">Upstream</th>
                <th className="text-start pb-8 font-medium">احراز هویت</th>
                <th className="text-start pb-8 font-medium">وضعیت</th>
                <th className="text-start pb-8 font-medium">RPS</th>
                <th className="text-start pb-8 font-medium">P50</th>
                <th className="text-start pb-8 font-medium">P99</th>
                <th className="text-start pb-8 font-medium">خطا</th>
                <th className="text-start pb-8 font-medium">Rate Limit</th>
                <th className="pb-8 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-bg/20"} ${r.status !== "فعال" ? "opacity-60" : ""}`}>
                  <td className="py-9">
                    <span className="px-7 py-2 rounded-4 text-[10px] font-bold ltr-text"
                      style={{ background: `${METHOD_COLOR[r.method]}15`, color: METHOD_COLOR[r.method] }}>
                      {r.method}
                    </span>
                  </td>
                  <td className="py-9 ltr-text font-mono font-semibold text-text-main">{r.path}</td>
                  <td className="py-9 ltr-text font-mono text-[10px] text-text-muted">{r.upstream}</td>
                  <td className="py-9">
                    <span className="px-7 py-2 rounded-4 text-[10px] font-medium ltr-text"
                      style={{ background: `${AUTH_COLOR[r.auth]}15`, color: AUTH_COLOR[r.auth] }}>
                      {r.auth}
                    </span>
                  </td>
                  <td className="py-9">
                    <span className="px-7 py-2 rounded-4 text-[10px] font-medium"
                      style={{ background: `${ROUTE_STATUS_COLOR[r.status]}15`, color: ROUTE_STATUS_COLOR[r.status] }}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-9 ltr-text font-mono text-text-muted">{r.rps > 0 ? r.rps.toLocaleString() : "—"}</td>
                  <td className="py-9 ltr-text font-mono text-text-muted">{r.p50_ms > 0 ? `${r.p50_ms}ms` : "—"}</td>
                  <td className="py-9 ltr-text font-mono" style={{ color: r.p99_ms > 200 ? "#ef4444" : "inherit" }}>{r.p99_ms > 0 ? `${r.p99_ms}ms` : "—"}</td>
                  <td className="py-9"><ErrBadge rate={r.error_rate} /></td>
                  <td className="py-9 ltr-text font-mono text-text-muted">{r.rate_limit > 0 ? `${r.rate_limit}/m` : "—"}</td>
                  <td className="py-9 text-end">
                    <button className="px-8 py-4 rounded-6 text-[10px] border border-border text-text-muted hover:text-text-main hover:bg-bg transition-colors">ویرایش</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
