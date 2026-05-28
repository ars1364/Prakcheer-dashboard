"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type CdnStatus = "فعال" | "غیرفعال" | "در انتظار";

interface CdnZone {
  id: string;
  domain: string;
  origin: string;
  status: CdnStatus;
  region: string;
  requests_today: number;
  bw_today_gb: number;
  hit_ratio: number;
  avg_ttfb_ms: number;
  cache_size_gb: number;
  ssl: boolean;
  http2: boolean;
  created: string;
}

/* ─── mock data ─── */
const ALL_ZONES: CdnZone[] = [
  { id: "c1", domain: "static.prakcheer.ir", origin: "185.40.12.8",  status: "فعال", region: "تهران",   requests_today: 482000, bw_today_gb: 148.2, hit_ratio: 94.2, avg_ttfb_ms: 18,  cache_size_gb: 42,  ssl: true,  http2: true,  created: "۱۴۰۲/۰۳/۱۲" },
  { id: "c2", domain: "media.prakcheer.ir",  origin: "185.40.12.20", status: "فعال", region: "اصفهان",  requests_today: 198000, bw_today_gb: 820.4, hit_ratio: 89.1, avg_ttfb_ms: 24,  cache_size_gb: 210, ssl: true,  http2: true,  created: "۱۴۰۲/۰۵/۲۰" },
  { id: "c3", domain: "api-cache.ir",        origin: "10.0.1.1",     status: "فعال", region: "تهران",   requests_today: 94000,  bw_today_gb: 8.6,   hit_ratio: 62.4, avg_ttfb_ms: 12,  cache_size_gb: 4,   ssl: true,  http2: true,  created: "۱۴۰۲/۰۷/۰۸" },
  { id: "c4", domain: "cdn.shop.ir",         origin: "185.40.12.50", status: "فعال", region: "تهران",   requests_today: 142000, bw_today_gb: 62.1,  hit_ratio: 91.8, avg_ttfb_ms: 16,  cache_size_gb: 28,  ssl: true,  http2: false, created: "۱۴۰۲/۰۸/۱۵" },
  { id: "c5", domain: "video.prakcheer.ir",  origin: "185.40.12.80", status: "فعال", region: "مشهد",    requests_today: 28000,  bw_today_gb: 1420.8,hit_ratio: 96.8, avg_ttfb_ms: 28,  cache_size_gb: 840, ssl: true,  http2: true,  created: "۱۴۰۲/۰۹/۰۱" },
  { id: "c6", domain: "assets-old.ir",       origin: "185.40.11.10", status: "غیرفعال", region: "تهران", requests_today: 0,      bw_today_gb: 0,     hit_ratio: 0,    avg_ttfb_ms: 0,   cache_size_gb: 12,  ssl: false, http2: false, created: "۱۴۰۱/۱۱/۰۵" },
  { id: "c7", domain: "beta-cdn.prakcheer.ir",origin:"185.40.12.99", status: "در انتظار", region: "اصفهان", requests_today: 0,  bw_today_gb: 0,     hit_ratio: 0,    avg_ttfb_ms: 0,   cache_size_gb: 0,   ssl: true,  http2: true,  created: "۱۴۰۳/۰۳/۰۸" },
];

const BW_TIMELINE = [
  { h: "۰۰", bw: 42, req: 28000  }, { h: "۰۲", bw: 28, req: 18400  }, { h: "۰۴", bw: 18, req: 11200  },
  { h: "۰۶", bw: 38, req: 24800  }, { h: "۰۸", bw: 82, req: 62000  }, { h: "۱۰", bw: 148,req: 114000 },
  { h: "۱۲", bw: 184,req: 142000 }, { h: "۱۴", bw: 162,req: 124000 }, { h: "۱۶", bw: 138,req: 106000 },
  { h: "۱۸", bw: 112,req: 88000  }, { h: "۲۰", bw: 88, req: 68000  }, { h: "۲۲", bw: 62, req: 48000  },
];

const STATUS_CODE_DATA = [
  { code: "2xx", count: 892000, fill: "#16a34a" },
  { code: "3xx", count: 48000,  fill: "#2554d8" },
  { code: "4xx", count: 14200,  fill: "#d97706" },
  { code: "5xx", count: 1800,   fill: "#ef4444" },
];

const REGION_TRAFFIC = [
  { region: "تهران",  bw: 218.9, req: 718000 },
  { region: "اصفهان", bw: 820.4, req: 198000 },
  { region: "مشهد",   bw: 1420.8,req: 28000  },
];

/* ─── colors ─── */
const STATUS_COLOR: Record<CdnStatus, string> = {
  "فعال":       "#16a34a",
  "غیرفعال":   "#ef4444",
  "در انتظار": "#d97706",
};

const REGION_COLOR: Record<string, string> = {
  "تهران":  "#2554d8",
  "اصفهان": "#8b5cf6",
  "مشهد":   "#ef4444",
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

/* ─── inline HitBar ─── */
function HitBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? "#16a34a" : pct >= 70 ? "#d97706" : "#ef4444";
  return (
    <div className="flex items-center gap-6">
      <div className="w-full h-6 rounded-999 bg-[#e2e8f0] overflow-hidden">
        <div style={{ width: `${pct}%`, background: color }} className="h-full rounded-999" />
      </div>
      <span className="text-[11px] font-medium ltr-text whitespace-nowrap" style={{ color }}>{pct}٪</span>
    </div>
  );
}

/* ─── page ─── */
export default function CdnPage() {
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (regionFilter === "all") return ALL_ZONES;
    return ALL_ZONES.filter(z => z.region === regionFilter);
  }, [regionFilter]);

  const activeZones    = ALL_ZONES.filter(z => z.status === "فعال").length;
  const totalBW        = ALL_ZONES.reduce((s, z) => s + z.bw_today_gb, 0);
  const totalReqs      = ALL_ZONES.reduce((s, z) => s + z.requests_today, 0);
  const avgHitRatio    = ALL_ZONES.filter(z => z.hit_ratio > 0).reduce((s, z, _, a) => s + z.hit_ratio / a.length, 0);

  /* BW share bars for header */
  const maxBW = Math.max(...ALL_ZONES.map(z => z.bw_today_gb));

  /* hit ratio segmented bar (zones sorted by hit ratio) */
  const activeZonesSorted = ALL_ZONES.filter(z => z.status === "فعال").sort((a, b) => b.hit_ratio - a.hit_ratio);

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-[14px] font-bold text-text-main">شبکه توزیع محتوا (CDN)</h2>
          <div className="flex items-center gap-10">
            <span className="text-[12px] font-bold text-green-600 ltr-text">{avgHitRatio.toFixed(1)}٪ avg hit ratio</span>
          </div>
        </div>

        {/* bandwidth distribution by zone */}
        <div className="flex flex-col gap-6 mb-16">
          <p className="text-[11px] text-text-muted mb-2">پهنای باند امروز به تفکیک دامنه</p>
          {ALL_ZONES.filter(z => z.bw_today_gb > 0).map(z => (
            <div key={z.id} className="flex items-center gap-10">
              <span className="text-[11px] text-text-muted ltr-text w-[180px] truncate shrink-0">{z.domain}</span>
              <div className="flex-1 h-8 rounded-999 bg-[#e2e8f0] overflow-hidden">
                <div style={{ width: `${(z.bw_today_gb / maxBW) * 100}%`, background: REGION_COLOR[z.region] || "#2554d8" }}
                  className="h-full rounded-999" />
              </div>
              <span className="text-[11px] text-text-muted ltr-text w-[60px] text-end shrink-0">{z.bw_today_gb >= 100 ? `${(z.bw_today_gb/1024*100/100).toFixed(2)} TB` : `${z.bw_today_gb.toFixed(1)} GB`}</span>
            </div>
          ))}
        </div>

        {/* 4 stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "دامنه‌های فعال",   value: `${activeZones} / ${ALL_ZONES.length}`,  color: "#16a34a" },
            { label: "BW امروز",         value: `${(totalBW/1024).toFixed(2)} TB`,        color: "#2554d8" },
            { label: "درخواست‌ها/روز",   value: `${(totalReqs/1000).toFixed(0)}K`,        color: "#8b5cf6" },
            { label: "Cache Hit Rate",   value: `${avgHitRatio.toFixed(1)}٪`,             color: "#d97706" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[22px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── charts row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* bandwidth + requests timeline */}
        <div className="glass rounded-16 p-16 lg:col-span-2">
          <p className="text-[13px] font-semibold text-text-main mb-12">ترافیک CDN — امروز</p>
          <div className="ltr-text h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={BW_TIMELINE} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="bwGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2554d8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2554d8" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="h" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis yAxisId="bw" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} unit=" GB" />
                <YAxis yAxisId="req" orientation="right" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
                <Area yAxisId="bw"  type="monotone" dataKey="bw"  name="BW (GB)"    stroke="#2554d8" fill="url(#bwGrad)"  strokeWidth={2} dot={false} />
                <Area yAxisId="req" type="monotone" dataKey="req" name="درخواست"   stroke="#16a34a" fill="url(#reqGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* status code pie */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">کدهای پاسخ HTTP</p>
          <div className="ltr-text h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={STATUS_CODE_DATA} cx="50%" cy="50%" outerRadius={65} innerRadius={28}
                  dataKey="count" nameKey="code"
                  label={({ code, percent }) => `${code} ${(percent*100).toFixed(0)}٪`}
                  labelLine={false}
                  style={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }}>
                  {STATUS_CODE_DATA.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─── region traffic chart ─── */}
      <div className="glass rounded-16 p-16">
        <p className="text-[13px] font-semibold text-text-main mb-12">ترافیک به تفکیک منطقه (امروز)</p>
        <div className="ltr-text h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REGION_TRAFFIC} margin={{ top: 4, right: 16, left: -10, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="region" tick={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
              <YAxis yAxisId="bw"  tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} unit=" GB" />
              <YAxis yAxisId="req" orientation="right" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
              <Bar yAxisId="bw"  dataKey="bw"  name="BW (GB)" fill="#2554d8" radius={[4,4,0,0]}>
                {REGION_TRAFFIC.map((r, i) => <Cell key={i} fill={REGION_COLOR[r.region] || "#2554d8"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── CDN zones table ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex flex-wrap items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">دامنه‌های CDN</h3>
          {(["all", "تهران", "اصفهان", "مشهد"] as const).map(r => (
            <button key={r} onClick={() => setRegionFilter(r)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ${regionFilter === r ? "bg-brand text-white" : "bg-bg text-text-muted hover:text-text-main border border-border"}`}>
              {r === "all" ? "همه" : r}
            </button>
          ))}
          <button className="flex items-center gap-6 px-12 py-6 rounded-8 text-[12px] font-medium bg-brand text-white hover:bg-brand/90 transition-colors">
            + دامنه جدید
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-start pb-8 font-medium">دامنه</th>
                <th className="text-start pb-8 font-medium">Origin</th>
                <th className="text-start pb-8 font-medium">وضعیت</th>
                <th className="text-start pb-8 font-medium">منطقه</th>
                <th className="text-start pb-8 font-medium">BW امروز</th>
                <th className="text-start pb-8 font-medium">درخواست‌ها</th>
                <th className="text-start pb-8 font-medium">Hit Rate</th>
                <th className="text-start pb-8 font-medium">TTFB</th>
                <th className="text-start pb-8 font-medium">SSL</th>
                <th className="pb-8 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((z, i) => (
                <tr key={z.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-bg/20"}`}>
                  <td className="py-10 ltr-text font-semibold text-text-main">{z.domain}</td>
                  <td className="py-10 ltr-text font-mono text-[11px] text-text-muted">{z.origin}</td>
                  <td className="py-10">
                    <span className="px-8 py-3 rounded-4 text-[10px] font-medium" style={{ background: `${STATUS_COLOR[z.status]}18`, color: STATUS_COLOR[z.status] }}>
                      {z.status}
                    </span>
                  </td>
                  <td className="py-10">
                    <span className="px-8 py-3 rounded-4 text-[10px] font-medium" style={{ background: `${REGION_COLOR[z.region] || "#94a3b8"}18`, color: REGION_COLOR[z.region] || "#94a3b8" }}>
                      {z.region}
                    </span>
                  </td>
                  <td className="py-10 ltr-text text-text-muted">{z.bw_today_gb > 0 ? `${z.bw_today_gb >= 100 ? (z.bw_today_gb/1024).toFixed(2) + " TB" : z.bw_today_gb.toFixed(1) + " GB"}` : "—"}</td>
                  <td className="py-10 ltr-text text-text-muted">{z.requests_today > 0 ? z.requests_today.toLocaleString() : "—"}</td>
                  <td className="py-10 w-[130px]">
                    {z.hit_ratio > 0 ? <HitBar pct={z.hit_ratio} /> : <span className="text-text-muted">—</span>}
                  </td>
                  <td className="py-10 ltr-text text-text-muted">{z.avg_ttfb_ms > 0 ? `${z.avg_ttfb_ms}ms` : "—"}</td>
                  <td className="py-10 text-center">
                    <span className={`text-[12px] ${z.ssl ? "text-green-600" : "text-text-muted"}`}>{z.ssl ? "✓" : "—"}</span>
                  </td>
                  <td className="py-10 text-end">
                    <button className="px-10 py-4 rounded-6 text-[11px] border border-border text-text-muted hover:text-text-main hover:bg-bg transition-colors">تنظیمات</button>
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
