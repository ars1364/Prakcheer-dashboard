"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type AccessLevel = "عمومی" | "خصوصی" | "محدود";
type BucketRegion = "تهران" | "اصفهان" | "مشهد";

interface Bucket {
  id: string;
  name: string;
  region: BucketRegion;
  size_gb: number;
  objects: number;
  access: AccessLevel;
  versioning: boolean;
  requests_today: number;
  bw_today_gb: number;
  created: string;
}

/* ─── mock data ─── */
const ALL_BUCKETS: Bucket[] = [
  { id: "b1", name: "media-assets-prod",   region: "تهران",    size_gb: 420,  objects: 58200, access: "خصوصی",  versioning: true,  requests_today: 12400, bw_today_gb: 18.4, created: "۱۴۰۲/۰۸/۱۲" },
  { id: "b2", name: "user-uploads",        region: "تهران",    size_gb: 210,  objects: 31500, access: "خصوصی",  versioning: false, requests_today: 8900,  bw_today_gb: 6.2,  created: "۱۴۰۲/۰۶/۰۳" },
  { id: "b3", name: "backup-daily",        region: "اصفهان",   size_gb: 860,  objects: 4200,  access: "خصوصی",  versioning: true,  requests_today: 340,   bw_today_gb: 0.8,  created: "۱۴۰۱/۱۲/۲۰" },
  { id: "b4", name: "static-cdn",          region: "تهران",    size_gb: 95,   objects: 22100, access: "عمومی",  versioning: false, requests_today: 45200, bw_today_gb: 32.1, created: "۱۴۰۲/۰۳/۱۸" },
  { id: "b5", name: "logs-archive",        region: "مشهد",     size_gb: 650,  objects: 189000,access: "خصوصی",  versioning: false, requests_today: 1200,  bw_today_gb: 2.4,  created: "۱۴۰۲/۰۱/۰۵" },
  { id: "b6", name: "ml-datasets",         region: "اصفهان",   size_gb: 1240, objects: 8700,  access: "محدود",  versioning: true,  requests_today: 580,   bw_today_gb: 12.6, created: "۱۴۰۲/۰۵/۲۲" },
  { id: "b7", name: "app-configs",         region: "تهران",    size_gb: 0.4,  objects: 215,   access: "محدود",  versioning: true,  requests_today: 4400,  bw_today_gb: 0.1,  created: "۱۴۰۳/۰۱/۰۱" },
  { id: "b8", name: "thumbnails-cache",    region: "مشهد",     size_gb: 78,   objects: 94000, access: "عمومی",  versioning: false, requests_today: 28100, bw_today_gb: 9.8,  created: "۱۴۰۲/۰۹/۱۴" },
];

const GROWTH_DATA = [
  { day: "۱",  tb: 2.1 }, { day: "۵",  tb: 2.3 }, { day: "۱۰", tb: 2.5 },
  { day: "۱۵", tb: 2.8 }, { day: "۲۰", tb: 3.1 }, { day: "۲۵", tb: 3.3 },
  { day: "۳۰", tb: 3.55 },
];

const REQUEST_DATA = [
  { hour: "۰۰", get: 4200, put: 310, del: 80  },
  { hour: "۰۲", get: 2100, put: 120, del: 40  },
  { hour: "۰۴", get: 1400, put: 90,  del: 20  },
  { hour: "۰۶", get: 3100, put: 280, del: 65  },
  { hour: "۰۸", get: 8400, put: 920, del: 210 },
  { hour: "۱۰", get: 12800,put: 1400,del: 380 },
  { hour: "۱۲", get: 14200,put: 1620,del: 420 },
  { hour: "۱۴", get: 13100,put: 1280,del: 340 },
  { hour: "۱۶", get: 11400,put: 1050,del: 290 },
  { hour: "۱۸", get: 9800, put: 840, del: 220 },
  { hour: "۲۰", get: 7200, put: 580, del: 140 },
  { hour: "۲۲", get: 5100, put: 390, del: 95  },
];

const REGION_COLORS: Record<BucketRegion, string> = {
  "تهران":  "#2554d8",
  "اصفهان": "#8b5cf6",
  "مشهد":   "#16a34a",
};

const ACCESS_COLOR: Record<AccessLevel, string> = {
  "عمومی":  "#16a34a",
  "خصوصی":  "#2554d8",
  "محدود":  "#d97706",
};

const PIE_COLORS = ["#2554d8", "#8b5cf6", "#16a34a", "#d97706", "#ef4444"];

/* ─── inline SizeBar ─── */
function SizeBar({ value, max, color = "#2554d8" }: { value: number; max: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-6 rounded-999 bg-[#e2e8f0] overflow-hidden">
      <div style={{ width: `${pct}%`, background: color }} className="h-full rounded-999 transition-all" />
    </div>
  );
}

/* ─── custom tooltip ─── */
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

/* ─── page ─── */
export default function ObjectStoragePage() {
  const [region, setRegion] = useState<"all" | BucketRegion>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let b = ALL_BUCKETS;
    if (region !== "all") b = b.filter(x => x.region === region);
    if (search) b = b.filter(x => x.name.includes(search));
    return b;
  }, [region, search]);

  const totalGB   = ALL_BUCKETS.reduce((s, b) => s + b.size_gb, 0);
  const totalObjs = ALL_BUCKETS.reduce((s, b) => s + b.objects, 0);
  const totalBW   = ALL_BUCKETS.reduce((s, b) => s + b.bw_today_gb, 0);
  const totalReqs = ALL_BUCKETS.reduce((s, b) => s + b.requests_today, 0);

  /* segmented bar by region */
  const regionGroups = useMemo(() => {
    const g: Record<string, number> = { "تهران": 0, "اصفهان": 0, "مشهد": 0 };
    ALL_BUCKETS.forEach(b => { g[b.region] += b.size_gb; });
    return Object.entries(g).map(([name, gb]) => ({ name, gb, pct: (gb / totalGB) * 100 }));
  }, [totalGB]);

  /* pie: buckets by region count */
  const regionPie = useMemo(() => {
    const g: Record<string, number> = { "تهران": 0, "اصفهان": 0, "مشهد": 0 };
    ALL_BUCKETS.forEach(b => { g[b.region]++; });
    return Object.entries(g).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[14px] font-bold text-text-main">ذخیره‌سازی ابری</h2>
          <span className="text-[12px] text-text-muted font-mono ltr-text">{(totalGB / 1024).toFixed(2)} TB مصرفی</span>
        </div>

        {/* storage segmented bar */}
        <div className="flex h-14 rounded-999 overflow-hidden gap-1 mb-10">
          {regionGroups.map(r => (
            <div key={r.name} title={`${r.name}: ${r.gb.toFixed(0)} GB`}
              style={{ flex: r.gb, background: REGION_COLORS[r.name as BucketRegion] }}
              className="rounded-999 transition-all" />
          ))}
        </div>
        <div className="flex gap-16 mb-16">
          {regionGroups.map(r => (
            <div key={r.name} className="flex items-center gap-6 text-[11px] text-text-muted">
              <span className="w-8 h-8 rounded-999 shrink-0" style={{ background: REGION_COLORS[r.name as BucketRegion] }} />
              {r.name} — {r.gb.toFixed(0)} GB ({r.pct.toFixed(0)}٪)
            </div>
          ))}
        </div>

        {/* 4 stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "فضای کل",       value: `${(totalGB/1024).toFixed(1)} TB`, color: "#2554d8" },
            { label: "اشیاء",          value: totalObjs.toLocaleString(),         color: "#8b5cf6" },
            { label: "پهنای باند امروز", value: `${totalBW.toFixed(1)} GB`,       color: "#16a34a" },
            { label: "درخواست‌ها/روز",  value: totalReqs.toLocaleString(),         color: "#d97706" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[20px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── charts row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* storage growth */}
        <div className="glass rounded-16 p-16 lg:col-span-2">
          <p className="text-[13px] font-semibold text-text-main mb-12">رشد فضای ذخیره‌سازی — ۳۰ روز اخیر (TB)</p>
          <div className="ltr-text h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="storGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2554d8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2554d8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} domain={[1.5, 4]} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="tb" name="فضا (TB)" stroke="#2554d8" fill="url(#storGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* buckets by region pie */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">توزیع باکت‌ها</p>
          <div className="ltr-text h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={regionPie} cx="50%" cy="50%" outerRadius={60} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}٪`} labelLine={false} style={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }}>
                  {regionPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─── request breakdown chart ─── */}
      <div className="glass rounded-16 p-16">
        <p className="text-[13px] font-semibold text-text-main mb-12">درخواست‌های ساعتی (امروز)</p>
        <div className="ltr-text h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REQUEST_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
              <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
              <Bar dataKey="get" name="GET"    stackId="a" fill="#2554d8" radius={[0,0,0,0]} />
              <Bar dataKey="put" name="PUT"    stackId="a" fill="#8b5cf6" />
              <Bar dataKey="del" name="DELETE" stackId="a" fill="#ef4444" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── bucket table ─── */}
      <div className="glass rounded-16 p-16">
        {/* filters */}
        <div className="flex flex-wrap items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">باکت‌ها</h3>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="جستجو..."
            className="border border-border rounded-8 px-10 py-6 text-[12px] bg-bg text-text-main w-[140px] outline-none"
          />
          {(["all", "تهران", "اصفهان", "مشهد"] as const).map(r => (
            <button key={r} onClick={() => setRegion(r)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ${region === r ? "bg-brand text-white" : "bg-bg text-text-muted hover:text-text-main border border-border"}`}>
              {r === "all" ? "همه" : r}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-start pb-8 font-medium">نام باکت</th>
                <th className="text-start pb-8 font-medium">منطقه</th>
                <th className="text-start pb-8 font-medium">حجم</th>
                <th className="text-start pb-8 font-medium">اشیاء</th>
                <th className="text-start pb-8 font-medium">دسترسی</th>
                <th className="text-start pb-8 font-medium">نسخه‌بندی</th>
                <th className="text-start pb-8 font-medium">درخواست‌ها/روز</th>
                <th className="text-start pb-8 font-medium">BW امروز</th>
                <th className="pb-8 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-transparent" : "bg-bg/30"}`}>
                  <td className="py-10 ltr-text font-mono text-[11px] text-text-main">{b.name}</td>
                  <td className="py-10">
                    <span className="px-8 py-3 rounded-4 text-[10px] font-medium" style={{ background: `${REGION_COLORS[b.region]}18`, color: REGION_COLORS[b.region] }}>{b.region}</span>
                  </td>
                  <td className="py-10">
                    <div className="flex items-center gap-8">
                      <SizeBar value={b.size_gb} max={1300} color={REGION_COLORS[b.region]} />
                      <span className="ltr-text text-text-muted whitespace-nowrap">{b.size_gb >= 1 ? `${b.size_gb.toFixed(0)} GB` : `${(b.size_gb*1024).toFixed(0)} MB`}</span>
                    </div>
                  </td>
                  <td className="py-10 ltr-text text-text-muted">{b.objects.toLocaleString()}</td>
                  <td className="py-10">
                    <span className="px-8 py-3 rounded-4 text-[10px] font-medium" style={{ background: `${ACCESS_COLOR[b.access]}18`, color: ACCESS_COLOR[b.access] }}>{b.access}</span>
                  </td>
                  <td className="py-10 text-center">
                    <span className={`text-[12px] ${b.versioning ? "text-green-600" : "text-text-muted"}`}>{b.versioning ? "✓" : "—"}</span>
                  </td>
                  <td className="py-10 ltr-text text-text-muted">{b.requests_today.toLocaleString()}</td>
                  <td className="py-10 ltr-text text-text-muted">{b.bw_today_gb.toFixed(1)} GB</td>
                  <td className="py-10 text-end">
                    <button className="px-10 py-4 rounded-6 text-[11px] border border-border text-text-muted hover:text-text-main hover:bg-bg transition-colors">مدیریت</button>
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
