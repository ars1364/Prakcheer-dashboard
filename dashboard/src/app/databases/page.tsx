"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type DbEngine  = "PostgreSQL" | "MySQL" | "Redis" | "MongoDB" | "Elasticsearch";
type DbStatus  = "آنلاین" | "آفلاین" | "بکاپ در حال اجرا" | "بازیابی";
type DbPlan    = "S1" | "S2" | "M1" | "M2" | "L1";

interface Database {
  id: string;
  name: string;
  engine: DbEngine;
  version: string;
  status: DbStatus;
  plan: DbPlan;
  region: string;
  cpu_pct: number;
  ram_pct: number;
  storage_used_gb: number;
  storage_total_gb: number;
  connections: number;
  max_connections: number;
  qps: number;
  replicas: number;
  ha: boolean;
  created: string;
}

/* ─── mock data ─── */
const ALL_DBS: Database[] = [
  { id: "d1", name: "prod-postgres-main",    engine: "PostgreSQL",    version: "16.1", status: "آنلاین", plan: "L1",  region: "تهران",   cpu_pct: 42, ram_pct: 68, storage_used_gb: 180,  storage_total_gb: 500,  connections: 82,  max_connections: 200, qps: 2840, replicas: 2, ha: true,  created: "۱۴۰۲/۰۴/۱۰" },
  { id: "d2", name: "user-service-pg",       engine: "PostgreSQL",    version: "15.4", status: "آنلاین", plan: "M2",  region: "تهران",   cpu_pct: 28, ram_pct: 44, storage_used_gb: 42,   storage_total_gb: 200,  connections: 38,  max_connections: 100, qps: 840,  replicas: 1, ha: true,  created: "۱۴۰۲/۰۶/۰۵" },
  { id: "d3", name: "session-cache",         engine: "Redis",         version: "7.2",  status: "آنلاین", plan: "M1",  region: "تهران",   cpu_pct: 15, ram_pct: 72, storage_used_gb: 18,   storage_total_gb: 50,   connections: 210, max_connections: 500, qps: 42000,replicas: 0, ha: false, created: "۱۴۰۲/۰۲/۱۸" },
  { id: "d4", name: "analytics-mongo",       engine: "MongoDB",       version: "7.0",  status: "آنلاین", plan: "M2",  region: "اصفهان",  cpu_pct: 55, ram_pct: 61, storage_used_gb: 320,  storage_total_gb: 500,  connections: 24,  max_connections: 100, qps: 480,  replicas: 2, ha: true,  created: "۱۴۰۲/۰۵/۲۲" },
  { id: "d5", name: "logs-elasticsearch",    engine: "Elasticsearch", version: "8.11", status: "آنلاین", plan: "L1",  region: "مشهد",    cpu_pct: 71, ram_pct: 83, storage_used_gb: 840,  storage_total_gb: 1000, connections: 12,  max_connections: 50,  qps: 1200, replicas: 2, ha: true,  created: "۱۴۰۲/۰۱/۰۸" },
  { id: "d6", name: "shop-mysql",            engine: "MySQL",         version: "8.0",  status: "آنلاین", plan: "M1",  region: "تهران",   cpu_pct: 34, ram_pct: 52, storage_used_gb: 95,   storage_total_gb: 200,  connections: 45,  max_connections: 150, qps: 1640, replicas: 1, ha: true,  created: "۱۴۰۲/۰۷/۱۱" },
  { id: "d7", name: "staging-postgres",      engine: "PostgreSQL",    version: "16.1", status: "آنلاین", plan: "S2",  region: "اصفهان",  cpu_pct: 12, ram_pct: 28, storage_used_gb: 8,    storage_total_gb: 50,   connections: 6,   max_connections: 50,  qps: 120,  replicas: 0, ha: false, created: "۱۴۰۲/۱۰/۰۳" },
  { id: "d8", name: "backup-restore-test",   engine: "MySQL",         version: "8.0",  status: "بکاپ در حال اجرا", plan: "S1", region: "مشهد", cpu_pct: 8, ram_pct: 22, storage_used_gb: 12, storage_total_gb: 50, connections: 0, max_connections: 50, qps: 0, replicas: 0, ha: false, created: "۱۴۰۳/۰۱/۲۲" },
];

const QPS_TIMELINE = [
  { h: "۰۰", pg: 820,  redis: 18200, mysql: 420,  mongo: 140 },
  { h: "۰۲", pg: 480,  redis: 12400, mysql: 280,  mongo: 80  },
  { h: "۰۴", pg: 360,  redis: 9800,  mysql: 180,  mongo: 60  },
  { h: "۰۶", pg: 640,  redis: 14200, mysql: 340,  mongo: 120 },
  { h: "۰۸", pg: 1840, redis: 28400, mysql: 920,  mongo: 280 },
  { h: "۱۰", pg: 2840, redis: 42000, mysql: 1640, mongo: 480 },
  { h: "۱۲", pg: 3200, redis: 48200, mysql: 1820, mongo: 520 },
  { h: "۱۴", pg: 2960, redis: 44800, mysql: 1680, mongo: 480 },
  { h: "۱۶", pg: 2400, redis: 38400, mysql: 1320, mongo: 360 },
  { h: "۱۸", pg: 1920, redis: 32000, mysql: 1080, mongo: 280 },
  { h: "۲۰", pg: 1480, redis: 24800, mysql: 840,  mongo: 200 },
  { h: "۲۲", pg: 1040, redis: 19200, mysql: 580,  mongo: 140 },
];

const STORAGE_USAGE = ALL_DBS.map(d => ({
  name: d.name.length > 20 ? d.name.slice(0, 18) + "…" : d.name,
  used: d.storage_used_gb,
  free: d.storage_total_gb - d.storage_used_gb,
})).sort((a, b) => b.used - a.used);

/* ─── colors ─── */
const ENGINE_COLOR: Record<DbEngine, string> = {
  PostgreSQL:    "#2554d8",
  MySQL:         "#d97706",
  Redis:         "#ef4444",
  MongoDB:       "#16a34a",
  Elasticsearch: "#8b5cf6",
};

const STATUS_COLOR: Record<DbStatus, string> = {
  "آنلاین":              "#16a34a",
  "آفلاین":              "#ef4444",
  "بکاپ در حال اجرا":   "#d97706",
  "بازیابی":             "#8b5cf6",
};

const REGION_COLOR: Record<string, string> = {
  "تهران":  "#2554d8",
  "اصفهان": "#8b5cf6",
  "مشهد":   "#16a34a",
};

/* ─── inline components ─── */
function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-6 rounded-999 bg-[#e2e8f0] overflow-hidden">
      <div style={{ width: `${Math.min(pct, 100)}%`, background: color }} className="h-full rounded-999" />
    </div>
  );
}

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

/* ─── page ─── */
export default function DatabasesPage() {
  const [engineFilter, setEngineFilter] = useState<DbEngine | "all">("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    let dbs = ALL_DBS;
    if (engineFilter !== "all") dbs = dbs.filter(d => d.engine === engineFilter);
    if (regionFilter !== "all") dbs = dbs.filter(d => d.region === regionFilter);
    return dbs;
  }, [engineFilter, regionFilter]);

  const totalStorage     = ALL_DBS.reduce((s, d) => s + d.storage_used_gb, 0);
  const totalConnections = ALL_DBS.reduce((s, d) => s + d.connections, 0);
  const totalQps         = ALL_DBS.reduce((s, d) => s + d.qps, 0);
  const onlineCount      = ALL_DBS.filter(d => d.status === "آنلاین").length;

  /* engine counts for header segmented bar */
  const engineGroups = useMemo(() => {
    const g: Partial<Record<DbEngine, number>> = {};
    ALL_DBS.forEach(d => { g[d.engine] = (g[d.engine] || 0) + 1; });
    return Object.entries(g) as [DbEngine, number][];
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[14px] font-bold text-text-main">پایگاه‌های داده مدیریت‌شده</h2>
          <span className="text-[12px] text-text-muted">{onlineCount}/{ALL_DBS.length} آنلاین</span>
        </div>

        {/* engine segmented bar */}
        <div className="flex h-12 rounded-999 overflow-hidden gap-1 mb-8">
          {engineGroups.map(([eng, count]) => (
            <div key={eng} title={`${eng}: ${count}`}
              style={{ flex: count, background: ENGINE_COLOR[eng] }}
              className="rounded-999 cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => setEngineFilter(engineFilter === eng ? "all" : eng)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-12 mb-14">
          {engineGroups.map(([eng, count]) => (
            <div key={eng} className="flex items-center gap-6 text-[11px] text-text-muted cursor-pointer" onClick={() => setEngineFilter(engineFilter === eng ? "all" : eng)}>
              <span className="w-8 h-8 rounded-999 shrink-0" style={{ background: ENGINE_COLOR[eng] }} />
              <span className={engineFilter === eng ? "font-semibold text-text-main" : ""}>{eng} ({count})</span>
            </div>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "سرویس‌های فعال",   value: `${onlineCount} / ${ALL_DBS.length}`, color: "#16a34a" },
            { label: "فضای مصرفی",       value: `${(totalStorage/1024).toFixed(1)} TB`,color: "#2554d8" },
            { label: "اتصال‌های فعال",    value: totalConnections,                     color: "#8b5cf6" },
            { label: "کل QPS",           value: `${(totalQps/1000).toFixed(0)}K`,     color: "#d97706" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[22px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* QPS timeline */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">QPS به تفکیک موتور — ۲۴ ساعت</p>
          <div className="ltr-text h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={QPS_TIMELINE} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  {(["pg","redis","mysql","mongo"] as const).map((k, i) => (
                    <linearGradient key={k} id={`dbGrad${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={[ENGINE_COLOR.PostgreSQL, ENGINE_COLOR.Redis, ENGINE_COLOR.MySQL, ENGINE_COLOR.MongoDB][i]} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={[ENGINE_COLOR.PostgreSQL, ENGINE_COLOR.Redis, ENGINE_COLOR.MySQL, ENGINE_COLOR.MongoDB][i]} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="h" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <Area type="monotone" dataKey="redis" name="Redis" stroke={ENGINE_COLOR.Redis}         fill={`url(#dbGradreddis)`} strokeWidth={1.5} dot={false} />
                <Area type="monotone" dataKey="pg"    name="PostgreSQL" stroke={ENGINE_COLOR.PostgreSQL} fill={`url(#dbGradpg)`}    strokeWidth={1.5} dot={false} />
                <Area type="monotone" dataKey="mysql" name="MySQL" stroke={ENGINE_COLOR.MySQL}         fill={`url(#dbGradmysql)`} strokeWidth={1.5} dot={false} />
                <Area type="monotone" dataKey="mongo" name="MongoDB" stroke={ENGINE_COLOR.MongoDB}     fill={`url(#dbGradmongo)`} strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* storage usage bar */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">مصرف فضا به تفکیک سرویس (GB)</p>
          <div className="ltr-text h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STORAGE_USAGE} layout="vertical" margin={{ top: 0, right: 16, left: 130, bottom: 0 }} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontFamily: "var(--font-vazirmatn)" }} width={130} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="used" name="مصرفی" stackId="s" fill="#2554d8" />
                <Bar dataKey="free" name="آزاد"  stackId="s" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─── database table ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex flex-wrap items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">سرویس‌های پایگاه داده</h3>
          {(["all", "PostgreSQL", "MySQL", "Redis", "MongoDB", "Elasticsearch"] as const).map(e => (
            <button key={e} onClick={() => setEngineFilter(e)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ${engineFilter === e ? "bg-brand text-white" : "bg-bg text-text-muted hover:text-text-main border border-border"}`}>
              {e === "all" ? "همه" : e}
            </button>
          ))}
          {(["all", "تهران", "اصفهان", "مشهد"] as const).map(r => (
            <button key={r} onClick={() => setRegionFilter(r)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ${regionFilter === r ? "bg-brand text-white" : "bg-bg text-text-muted hover:text-text-main border border-border"}`}>
              {r === "all" ? "همه مناطق" : r}
            </button>
          ))}
          <button className="flex items-center gap-6 px-12 py-6 rounded-8 text-[12px] font-medium bg-brand text-white hover:bg-brand/90 transition-colors">
            + سرویس جدید
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-start pb-8 font-medium">نام</th>
                <th className="text-start pb-8 font-medium">موتور</th>
                <th className="text-start pb-8 font-medium">وضعیت</th>
                <th className="text-start pb-8 font-medium">منطقه</th>
                <th className="text-start pb-8 font-medium">CPU</th>
                <th className="text-start pb-8 font-medium">RAM</th>
                <th className="text-start pb-8 font-medium">فضا</th>
                <th className="text-start pb-8 font-medium">اتصال‌ها</th>
                <th className="text-start pb-8 font-medium">QPS</th>
                <th className="text-start pb-8 font-medium">HA</th>
                <th className="pb-8 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((db, i) => {
                const storagePct = (db.storage_used_gb / db.storage_total_gb) * 100;
                const connPct    = (db.connections / db.max_connections) * 100;
                return (
                  <tr key={db.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-bg/20"}`}>
                    <td className="py-10">
                      <p className="ltr-text font-mono text-[11px] text-text-main font-semibold">{db.name}</p>
                      <p className="ltr-text text-[10px] text-text-muted">{db.plan} · v{db.version}</p>
                    </td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-semibold ltr-text"
                        style={{ background: `${ENGINE_COLOR[db.engine]}18`, color: ENGINE_COLOR[db.engine] }}>
                        {db.engine}
                      </span>
                    </td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-medium"
                        style={{ background: `${STATUS_COLOR[db.status]}18`, color: STATUS_COLOR[db.status] }}>
                        {db.status}
                      </span>
                    </td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-medium"
                        style={{ background: `${REGION_COLOR[db.region]}18`, color: REGION_COLOR[db.region] }}>
                        {db.region}
                      </span>
                    </td>
                    <td className="py-10 w-[100px]">
                      <div className="flex items-center gap-6">
                        <MiniBar pct={db.cpu_pct} color={db.cpu_pct > 80 ? "#ef4444" : "#2554d8"} />
                        <span className="text-text-muted ltr-text">{db.cpu_pct}٪</span>
                      </div>
                    </td>
                    <td className="py-10 w-[100px]">
                      <div className="flex items-center gap-6">
                        <MiniBar pct={db.ram_pct} color={db.ram_pct > 85 ? "#ef4444" : "#8b5cf6"} />
                        <span className="text-text-muted ltr-text">{db.ram_pct}٪</span>
                      </div>
                    </td>
                    <td className="py-10 w-[110px]">
                      <div className="flex items-center gap-6">
                        <MiniBar pct={storagePct} color={storagePct > 80 ? "#ef4444" : "#16a34a"} />
                        <span className="text-text-muted ltr-text whitespace-nowrap">{db.storage_used_gb}G</span>
                      </div>
                    </td>
                    <td className="py-10 w-[120px]">
                      <div className="flex items-center gap-6">
                        <MiniBar pct={connPct} color={connPct > 80 ? "#ef4444" : "#d97706"} />
                        <span className="text-text-muted ltr-text whitespace-nowrap">{db.connections}/{db.max_connections}</span>
                      </div>
                    </td>
                    <td className="py-10 ltr-text text-text-muted font-mono">{db.qps.toLocaleString()}</td>
                    <td className="py-10 text-center">
                      <span className={`text-[12px] ${db.ha ? "text-green-600" : "text-text-muted"}`}>{db.ha ? "✓" : "—"}</span>
                    </td>
                    <td className="py-10 text-end">
                      <button className="px-10 py-4 rounded-6 text-[11px] border border-border text-text-muted hover:text-text-main hover:bg-bg transition-colors">مدیریت</button>
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
