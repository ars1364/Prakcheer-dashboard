"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type ServiceCategory = "Compute" | "Storage" | "Network" | "Database" | "CDN" | "Kubernetes" | "DNS";
type TimeRange = "7d" | "30d" | "90d" | "12m";

interface CostItem {
  id: string;
  service: string;
  category: ServiceCategory;
  region: string;
  cost_toman: number;
  cost_prev: number;
  usage_unit: string;
  usage_value: number;
}

/* ─── mock data ─── */
const ALL_COSTS: CostItem[] = [
  { id: "c1",  service: "prod-main (16vCPU)",   category: "Compute",    region: "تهران",  cost_toman: 8400000,  cost_prev: 8400000,  usage_unit: "ساعت", usage_value: 720 },
  { id: "c2",  service: "worker-1..4 (8vCPU)",  category: "Compute",    region: "تهران",  cost_toman: 6200000,  cost_prev: 5800000,  usage_unit: "ساعت", usage_value: 2880 },
  { id: "c3",  service: "gpu-1..2 (32vCPU)",    category: "Compute",    region: "مشهد",   cost_toman: 18400000, cost_prev: 15200000, usage_unit: "ساعت", usage_value: 1440 },
  { id: "c4",  service: "ml-datasets (Object)",  category: "Storage",    region: "اصفهان", cost_toman: 3100000,  cost_prev: 2800000,  usage_unit: "GB",   usage_value: 1240 },
  { id: "c5",  service: "backup-daily (Object)", category: "Storage",    region: "اصفهان", cost_toman: 2200000,  cost_prev: 2100000,  usage_unit: "GB",   usage_value: 860 },
  { id: "c6",  service: "logs-archive (Object)", category: "Storage",    region: "مشهد",   cost_toman: 1600000,  cost_prev: 1500000,  usage_unit: "GB",   usage_value: 650 },
  { id: "c7",  service: "Bandwidth Egress",      category: "Network",    region: "تهران",  cost_toman: 4800000,  cost_prev: 4200000,  usage_unit: "GB",   usage_value: 2400 },
  { id: "c8",  service: "Load Balancer ×5",      category: "Network",    region: "تهران",  cost_toman: 1200000,  cost_prev: 1200000,  usage_unit: "ساعت", usage_value: 3600 },
  { id: "c9",  service: "prod-postgres-main",    category: "Database",   region: "تهران",  cost_toman: 5600000,  cost_prev: 5600000,  usage_unit: "ساعت", usage_value: 720 },
  { id: "c10", service: "session-cache (Redis)", category: "Database",   region: "تهران",  cost_toman: 1800000,  cost_prev: 1800000,  usage_unit: "ساعت", usage_value: 720 },
  { id: "c11", service: "analytics-mongo",       category: "Database",   region: "اصفهان", cost_toman: 2400000,  cost_prev: 2200000,  usage_unit: "ساعت", usage_value: 720 },
  { id: "c12", service: "video.prakcheer.ir CDN",category: "CDN",        region: "مشهد",   cost_toman: 7200000,  cost_prev: 5800000,  usage_unit: "GB",   usage_value: 1421 },
  { id: "c13", service: "static.cdn CDN",        category: "CDN",        region: "تهران",  cost_toman: 1400000,  cost_prev: 1300000,  usage_unit: "GB",   usage_value: 148 },
  { id: "c14", service: "prod-main K8s",         category: "Kubernetes", region: "تهران",  cost_toman: 2800000,  cost_prev: 2800000,  usage_unit: "node", usage_value: 6 },
  { id: "c15", service: "DNS Zones",             category: "DNS",        region: "تهران",  cost_toman: 180000,   cost_prev: 180000,   usage_unit: "zone", usage_value: 6 },
];

const MONTHLY_DATA = [
  { month: "آبان",   compute: 28,  storage: 6,  network: 4, db: 7,  cdn: 5,  k8s: 2 },
  { month: "آذر",    compute: 30,  storage: 7,  network: 5, db: 8,  cdn: 5,  k8s: 3 },
  { month: "دی",     compute: 31,  storage: 7,  network: 5, db: 8,  cdn: 6,  k8s: 3 },
  { month: "بهمن",   compute: 29,  storage: 7,  network: 4, db: 8,  cdn: 6,  k8s: 3 },
  { month: "اسفند",  compute: 32,  storage: 8,  network: 5, db: 9,  cdn: 6,  k8s: 3 },
  { month: "فروردین",compute: 33,  storage: 8,  network: 6, db: 9,  cdn: 7,  k8s: 3 },
  { month: "اردیبهشت",compute:34, storage: 8,  network: 6, db: 10, cdn: 8,  k8s: 3 },
  { month: "خرداد",  compute: 33,  storage: 8,  network: 6, db: 10, cdn: 8,  k8s: 3 },
  { month: "تیر",    compute: 35,  storage: 9,  network: 7, db: 10, cdn: 8,  k8s: 3 },
  { month: "مرداد",  compute: 36,  storage: 9,  network: 7, db: 10, cdn: 9,  k8s: 3 },
  { month: "شهریور", compute: 37,  storage: 9,  network: 7, db: 10, cdn: 9,  k8s: 3 },
  { month: "مهر",    compute: 33,  storage: 7,  network: 6, db: 10, cdn: 8,  k8s: 3 },
];

/* ─── colors ─── */
const CAT_COLOR: Record<ServiceCategory, string> = {
  Compute:    "#2554d8",
  Storage:    "#8b5cf6",
  Network:    "#d97706",
  Database:   "#16a34a",
  CDN:        "#ef4444",
  Kubernetes: "#06b6d4",
  DNS:        "#94a3b8",
};

/* ─── tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] shadow-lg" style={{ direction: "rtl" }}>
      <p className="font-semibold mb-4">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}M ت</p>
      ))}
    </div>
  );
};

/* ─── inline change badge ─── */
function ChangeBadge({ current, prev }: { current: number; prev: number }) {
  const diff = current - prev;
  const pct  = prev > 0 ? ((diff / prev) * 100).toFixed(0) : "0";
  if (diff === 0) return <span className="text-text-muted text-[11px]">—</span>;
  const up = diff > 0;
  return (
    <span className="text-[11px] font-medium" style={{ color: up ? "#ef4444" : "#16a34a" }}>
      {up ? "▲" : "▼"} {Math.abs(+pct)}٪
    </span>
  );
}

/* ─── page ─── */
export default function CostExplorerPage() {
  const [range, setRange] = useState<TimeRange>("30d");
  const [catFilter, setCatFilter] = useState<ServiceCategory | "all">("all");

  const filtered = useMemo(() => {
    if (catFilter === "all") return ALL_COSTS;
    return ALL_COSTS.filter(c => c.category === catFilter);
  }, [catFilter]);

  const totalCost  = ALL_COSTS.reduce((s, c) => s + c.cost_toman, 0);
  const totalPrev  = ALL_COSTS.reduce((s, c) => s + c.cost_prev, 0);
  const diffPct    = ((totalCost - totalPrev) / totalPrev * 100).toFixed(1);

  /* category breakdown for pie + segmented bar */
  const catGroups = useMemo(() => {
    const g: Partial<Record<ServiceCategory, number>> = {};
    ALL_COSTS.forEach(c => { g[c.category] = (g[c.category] || 0) + c.cost_toman; });
    return Object.entries(g).map(([cat, cost]) => ({ cat: cat as ServiceCategory, cost: cost as number }))
      .sort((a, b) => b.cost - a.cost);
  }, []);

  const pieData = catGroups.map(g => ({ name: g.cat, value: g.cost }));

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-[14px] font-bold text-text-main">کاوشگر هزینه</h2>
          <div className="flex gap-6">
            {(["7d", "30d", "90d", "12m"] as TimeRange[]).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ltr-text ${range === r ? "bg-brand text-white" : "bg-bg border border-border text-text-muted hover:text-text-main"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* cost segmented bar by category */}
        <div className="flex h-14 rounded-999 overflow-hidden gap-1 mb-8">
          {catGroups.map(g => (
            <div key={g.cat} title={`${g.cat}: ${(g.cost/1000000).toFixed(1)}M`}
              style={{ flex: g.cost, background: CAT_COLOR[g.cat] }}
              className="rounded-999 cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => setCatFilter(catFilter === g.cat ? "all" : g.cat)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-12 mb-14">
          {catGroups.map(g => (
            <div key={g.cat} className="flex items-center gap-6 text-[11px] text-text-muted cursor-pointer" onClick={() => setCatFilter(catFilter === g.cat ? "all" : g.cat)}>
              <span className="w-8 h-8 rounded-999 shrink-0" style={{ background: CAT_COLOR[g.cat] }} />
              <span className={catFilter === g.cat ? "font-semibold text-text-main" : ""}>{g.cat}</span>
              <span className="ltr-text">({((g.cost/totalCost)*100).toFixed(0)}٪)</span>
            </div>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "هزینه ماه جاری",     value: `${(totalCost/1000000).toFixed(0)}M ت`,  color: "#2554d8" },
            { label: "تغییر نسبت به قبل",   value: `${+diffPct > 0 ? "+" : ""}${diffPct}٪`, color: +diffPct > 0 ? "#ef4444" : "#16a34a" },
            { label: "بیشترین سرویس",       value: catGroups[0]?.cat || "—",               color: catGroups[0] ? CAT_COLOR[catGroups[0].cat] : "#94a3b8" },
            { label: "تعداد سرویس‌ها",      value: ALL_COSTS.length,                        color: "#8b5cf6" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[20px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* monthly stacked bars */}
        <div className="glass rounded-16 p-16 lg:col-span-2">
          <p className="text-[13px] font-semibold text-text-main mb-12">هزینه ماهانه به تفکیک سرویس (میلیون تومان)</p>
          <div className="ltr-text h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_DATA} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={20}>
                <defs>
                  <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2554d8" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#2554d8" stopOpacity={0.55} />
                  </linearGradient>
                  <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.55} />
                  </linearGradient>
                  <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d97706" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.55} />
                  </linearGradient>
                  <linearGradient id="barGrad4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.55} />
                  </linearGradient>
                  <linearGradient id="barGrad5" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.55} />
                  </linearGradient>
                  <linearGradient id="barGrad6" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <Bar dataKey="compute"    name="Compute"    stackId="s" fill="url(#barGrad1)" />
                <Bar dataKey="storage"    name="Storage"    stackId="s" fill="url(#barGrad2)" />
                <Bar dataKey="network"    name="Network"    stackId="s" fill="url(#barGrad3)" />
                <Bar dataKey="db"         name="Database"   stackId="s" fill="url(#barGrad4)" />
                <Bar dataKey="cdn"        name="CDN"        stackId="s" fill="url(#barGrad5)" />
                <Bar dataKey="k8s"        name="Kubernetes" stackId="s" fill="url(#barGrad6)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* pie */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">سهم هر دسته</p>
          <div className="ltr-text h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} innerRadius={30}
                  dataKey="value" nameKey="name"
                  label={({ name, percent }) => `${(percent*100).toFixed(0)}٪`}
                  labelLine={false}
                  style={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }}>
                  {pieData.map((d, i) => <Cell key={i} fill={CAT_COLOR[d.name as ServiceCategory]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${(v/1000000).toFixed(1)}M ت`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─── cost detail table ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex flex-wrap items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">ریز هزینه‌ها</h3>
          {(["all", "Compute", "Storage", "Network", "Database", "CDN", "Kubernetes", "DNS"] as const).map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ${catFilter === c ? "bg-brand text-white" : "bg-bg text-text-muted hover:text-text-main border border-border"}`}
              style={catFilter === c && c !== "all" ? { background: CAT_COLOR[c as ServiceCategory], color: "white" } : {}}>
              {c === "all" ? "همه" : c}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-start pb-8 font-medium">سرویس</th>
                <th className="text-start pb-8 font-medium">دسته</th>
                <th className="text-start pb-8 font-medium">منطقه</th>
                <th className="text-start pb-8 font-medium">هزینه ماه</th>
                <th className="text-start pb-8 font-medium">تغییر</th>
                <th className="text-start pb-8 font-medium">مصرف</th>
                <th className="text-start pb-8 font-medium">سهم از کل</th>
              </tr>
            </thead>
            <tbody>
              {filtered.sort((a, b) => b.cost_toman - a.cost_toman).map((c, i) => {
                const sharePct = (c.cost_toman / totalCost) * 100;
                return (
                  <tr key={c.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-bg/20"}`}>
                    <td className="py-10 ltr-text text-[11px] font-semibold text-text-main">{c.service}</td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-semibold ltr-text"
                        style={{ background: `${CAT_COLOR[c.category]}18`, color: CAT_COLOR[c.category] }}>
                        {c.category}
                      </span>
                    </td>
                    <td className="py-10 text-text-muted">{c.region}</td>
                    <td className="py-10 ltr-text font-bold text-text-main">{(c.cost_toman/1000000).toFixed(1)}M</td>
                    <td className="py-10"><ChangeBadge current={c.cost_toman} prev={c.cost_prev} /></td>
                    <td className="py-10 ltr-text text-text-muted">{c.usage_value.toLocaleString()} {c.usage_unit}</td>
                    <td className="py-10 w-[130px]">
                      <div className="flex items-center gap-8">
                        <div className="flex-1 h-6 rounded-999 bg-[#e2e8f0] overflow-hidden">
                          <div style={{ width: `${sharePct}%`, background: CAT_COLOR[c.category] }} className="h-full rounded-999" />
                        </div>
                        <span className="ltr-text text-[10px] text-text-muted whitespace-nowrap">{sharePct.toFixed(0)}٪</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
