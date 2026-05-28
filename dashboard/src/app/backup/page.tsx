"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type BackupStatus   = "موفق" | "ناموفق" | "در حال اجرا" | "لغو شده";
type BackupType     = "Full" | "Incremental" | "Snapshot";
type RetentionPolicy = "روزانه-7" | "هفتگی-4" | "ماهانه-12";

interface BackupJob {
  id: string;
  name: string;
  source: string;
  source_type: string;
  type: BackupType;
  status: BackupStatus;
  region: string;
  size_gb: number;
  duration_min: number;
  schedule: string;
  retention: RetentionPolicy;
  last_run: string;
  next_run: string;
  success_rate_7d: number;
}

/* ─── mock data ─── */
const ALL_JOBS: BackupJob[] = [
  { id: "bj1",  name: "prod-db-daily",      source: "prod-postgres-main",   source_type: "Database",  type: "Full",        status: "ناموفق",       region: "تهران",  size_gb: 42,   duration_min: 0,   schedule: "روزانه ۰۲:۰۰", retention: "روزانه-7",  last_run: "۳ ساعت پیش", next_run: "۲۱ ساعت دیگر",  success_rate_7d: 71 },
  { id: "bj2",  name: "media-backup-daily", source: "media-assets-prod",    source_type: "Object",    type: "Incremental", status: "موفق",         region: "تهران",  size_gb: 8.4,  duration_min: 12,  schedule: "روزانه ۰۳:۰۰", retention: "روزانه-7",  last_run: "۲ ساعت پیش", next_run: "۲۲ ساعت دیگر",  success_rate_7d: 100 },
  { id: "bj3",  name: "vm-snapshots",       source: "prod-vpc (تمام VM‌ها)",source_type: "VM",        type: "Snapshot",    status: "موفق",         region: "تهران",  size_gb: 1240, duration_min: 28,  schedule: "روزانه ۰۴:۰۰", retention: "هفتگی-4",   last_run: "۱ ساعت پیش", next_run: "۲۳ ساعت دیگر",  success_rate_7d: 100 },
  { id: "bj4",  name: "mongo-weekly",       source: "analytics-mongo",      source_type: "Database",  type: "Full",        status: "موفق",         region: "اصفهان", size_gb: 320,  duration_min: 84,  schedule: "هفتگی جمعه",   retention: "هفتگی-4",   last_run: "۴ روز پیش",  next_run: "۳ روز دیگر",    success_rate_7d: 100 },
  { id: "bj5",  name: "k8s-etcd-hourly",    source: "prod-main K8s",        source_type: "K8s",       type: "Incremental", status: "در حال اجرا",  region: "تهران",  size_gb: 0.4,  duration_min: 0,   schedule: "هر ساعت",       retention: "روزانه-7",  last_run: "هم‌اکنون",   next_run: "۱ ساعت دیگر",   success_rate_7d: 98 },
  { id: "bj6",  name: "redis-snapshot",     source: "session-cache",        source_type: "Database",  type: "Snapshot",    status: "موفق",         region: "تهران",  size_gb: 18,   duration_min: 3,   schedule: "هر ۶ ساعت",    retention: "روزانه-7",  last_run: "۲ ساعت پیش", next_run: "۴ ساعت دیگر",   success_rate_7d: 100 },
  { id: "bj7",  name: "logs-archive",       source: "logs-elasticsearch",   source_type: "Database",  type: "Full",        status: "موفق",         region: "مشهد",   size_gb: 840,  duration_min: 210, schedule: "هفتگی یکشنبه",  retention: "ماهانه-12", last_run: "۶ روز پیش",  next_run: "۱ روز دیگر",    success_rate_7d: 86 },
  { id: "bj8",  name: "staging-full",       source: "staging-postgres",     source_type: "Database",  type: "Full",        status: "لغو شده",      region: "اصفهان", size_gb: 0,    duration_min: 0,   schedule: "هفتگی پنجشنبه",retention: "هفتگی-4",   last_run: "۲ روز پیش",  next_run: "۵ روز دیگر",    success_rate_7d: 50 },
];

const DAILY_STATS = [
  { d: "شنبه",   success: 8, failed: 0, size_gb: 420 },
  { d: "یکشنبه", success: 8, failed: 0, size_gb: 430 },
  { d: "دوشنبه", success: 8, failed: 0, size_gb: 425 },
  { d: "سه‌شنبه",success: 8, failed: 0, size_gb: 432 },
  { d: "چهارشنبه",success:8, failed: 0, size_gb: 428 },
  { d: "پنجشنبه",success: 7, failed: 1, size_gb: 280 },
  { d: "جمعه",   success: 6, failed: 2, size_gb: 310 },
];

const RETENTION_USAGE = [
  { policy: "روزانه-7",  stored_gb: 1480, max_gb: 3000 },
  { policy: "هفتگی-4",   stored_gb: 6240, max_gb: 8000 },
  { policy: "ماهانه-12", stored_gb: 10080,max_gb: 12000 },
];

/* ─── colors ─── */
const STATUS_COLOR: Record<BackupStatus, string> = {
  "موفق":         "#16a34a",
  "ناموفق":       "#ef4444",
  "در حال اجرا": "#2554d8",
  "لغو شده":     "#94a3b8",
};

const TYPE_COLOR: Record<BackupType, string> = {
  Full:        "#2554d8",
  Incremental: "#8b5cf6",
  Snapshot:    "#d97706",
};

const SOURCE_COLOR: Record<string, string> = {
  Database: "#2554d8",
  Object:   "#8b5cf6",
  VM:       "#d97706",
  K8s:      "#16a34a",
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

/* ─── inline success rate bar ─── */
function RateBar({ pct }: { pct: number }) {
  const color = pct >= 95 ? "#16a34a" : pct >= 75 ? "#d97706" : "#ef4444";
  return (
    <div className="flex items-center gap-6">
      <div className="w-full h-6 rounded-999 bg-[#e2e8f0] overflow-hidden">
        <div style={{ width: `${pct}%`, background: color }} className="h-full rounded-999" />
      </div>
      <span className="ltr-text text-[10px] whitespace-nowrap" style={{ color }}>{pct}٪</span>
    </div>
  );
}

/* ─── page ─── */
export default function BackupPage() {
  const [statusFilter, setStatusFilter] = useState<BackupStatus | "all">("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return ALL_JOBS;
    return ALL_JOBS.filter(j => j.status === statusFilter);
  }, [statusFilter]);

  const successCount = ALL_JOBS.filter(j => j.status === "موفق").length;
  const failedCount  = ALL_JOBS.filter(j => j.status === "ناموفق").length;
  const runningCount = ALL_JOBS.filter(j => j.status === "در حال اجرا").length;
  const totalSize    = ALL_JOBS.reduce((s, j) => s + j.size_gb, 0);

  /* type segmented bar */
  const typeGroups = useMemo(() => {
    const g: Partial<Record<BackupType, number>> = {};
    ALL_JOBS.forEach(j => { g[j.type] = (g[j.type] || 0) + 1; });
    return Object.entries(g) as [BackupType, number][];
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[14px] font-bold text-text-main">پشتیبان‌گیری</h2>
          <div className="flex items-center gap-8">
            {failedCount > 0 && (
              <div className="flex items-center gap-6 px-10 py-5 rounded-8 text-[11px] font-bold"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
                ✗ {failedCount} پشتیبان‌گیری ناموفق
              </div>
            )}
            {runningCount > 0 && (
              <div className="flex items-center gap-6 px-10 py-5 rounded-8 text-[11px] font-medium"
                style={{ background: "rgba(37,84,216,0.1)", border: "1px solid rgba(37,84,216,0.2)", color: "#2554d8" }}>
                ● {runningCount} در حال اجرا
              </div>
            )}
          </div>
        </div>

        {/* type segmented bar */}
        <div className="flex h-12 rounded-999 overflow-hidden gap-1 mb-8">
          {typeGroups.map(([type, count]) => (
            <div key={type} title={`${type}: ${count}`}
              style={{ flex: count, background: TYPE_COLOR[type] }}
              className="rounded-999" />
          ))}
        </div>
        <div className="flex gap-14 mb-14">
          {typeGroups.map(([type, count]) => (
            <div key={type} className="flex items-center gap-6 text-[11px] text-text-muted">
              <span className="w-8 h-8 rounded-999 shrink-0" style={{ background: TYPE_COLOR[type] }} />
              <span className="ltr-text">{type}</span> ({count})
            </div>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "موفق امروز",      value: `${successCount} / ${ALL_JOBS.length}`, color: "#16a34a" },
            { label: "در حال اجرا",     value: runningCount,                            color: "#2554d8" },
            { label: "ناموفق",          value: failedCount,                             color: "#ef4444" },
            { label: "حجم کل ذخیره",    value: `${(totalSize/1024).toFixed(1)} TB`,    color: "#8b5cf6" },
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

        {/* daily success/fail */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">نتایج هفتگی</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_STATS} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="d" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
                <Bar dataKey="success" name="موفق"  stackId="a" fill="#16a34a" />
                <Bar dataKey="failed"  name="ناموفق" stackId="a" fill="#ef4444" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* retention storage usage */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">مصرف فضا — سیاست نگهداری (GB)</p>
          <div className="flex flex-col gap-12 mt-6">
            {RETENTION_USAGE.map(r => {
              const pct = (r.stored_gb / r.max_gb) * 100;
              const color = pct > 85 ? "#ef4444" : pct > 65 ? "#d97706" : "#16a34a";
              return (
                <div key={r.policy}>
                  <div className="flex items-center justify-between mb-4 text-[11px]">
                    <span className="font-medium text-text-main">{r.policy}</span>
                    <span className="ltr-text text-text-muted">{r.stored_gb.toLocaleString()} / {r.max_gb.toLocaleString()} GB</span>
                  </div>
                  <div className="h-12 rounded-999 bg-[#e2e8f0] overflow-hidden">
                    <div style={{ width: `${pct}%`, background: color }} className="h-full rounded-999 flex items-center justify-end px-8">
                      <span className="text-white text-[9px] font-bold">{pct.toFixed(0)}٪</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ─── jobs table ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex flex-wrap items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">وظایف پشتیبان‌گیری</h3>
          {(["all", "موفق", "ناموفق", "در حال اجرا", "لغو شده"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ${statusFilter === s ? "bg-brand text-white" : "bg-bg text-text-muted hover:text-text-main border border-border"}`}>
              {s === "all" ? "همه" : s}
            </button>
          ))}
          <button className="flex items-center gap-6 px-12 py-6 rounded-8 text-[12px] font-medium bg-brand text-white hover:bg-brand/90 transition-colors">
            + وظیفه جدید
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-start pb-8 font-medium">نام</th>
                <th className="text-start pb-8 font-medium">منبع</th>
                <th className="text-start pb-8 font-medium">نوع</th>
                <th className="text-start pb-8 font-medium">وضعیت</th>
                <th className="text-start pb-8 font-medium">حجم</th>
                <th className="text-start pb-8 font-medium">مدت</th>
                <th className="text-start pb-8 font-medium">نرخ موفقیت ۷روز</th>
                <th className="text-start pb-8 font-medium">آخرین اجرا</th>
                <th className="text-start pb-8 font-medium">اجرای بعدی</th>
                <th className="pb-8 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((j, i) => (
                <tr key={j.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-bg/20"}`}>
                  <td className="py-10 ltr-text font-mono text-[11px] font-semibold text-text-main">{j.name}</td>
                  <td className="py-10">
                    <div>
                      <p className="ltr-text text-[11px] text-text-main">{j.source}</p>
                      <span className="px-6 py-2 rounded-4 text-[9px] font-medium mt-1 inline-block"
                        style={{ background: `${SOURCE_COLOR[j.source_type] || "#94a3b8"}18`, color: SOURCE_COLOR[j.source_type] || "#94a3b8" }}>
                        {j.source_type}
                      </span>
                    </div>
                  </td>
                  <td className="py-10">
                    <span className="px-8 py-3 rounded-4 text-[10px] font-medium ltr-text"
                      style={{ background: `${TYPE_COLOR[j.type]}18`, color: TYPE_COLOR[j.type] }}>
                      {j.type}
                    </span>
                  </td>
                  <td className="py-10">
                    <span className="px-8 py-3 rounded-4 text-[10px] font-medium"
                      style={{ background: `${STATUS_COLOR[j.status]}15`, color: STATUS_COLOR[j.status] }}>
                      {j.status}
                    </span>
                  </td>
                  <td className="py-10 ltr-text text-text-muted">{j.size_gb >= 1 ? `${j.size_gb.toFixed(0)} GB` : `${(j.size_gb*1024).toFixed(0)} MB`}</td>
                  <td className="py-10 ltr-text text-text-muted">{j.duration_min > 0 ? `${j.duration_min}m` : "—"}</td>
                  <td className="py-10 w-[120px]">
                    <RateBar pct={j.success_rate_7d} />
                  </td>
                  <td className="py-10 text-text-muted whitespace-nowrap">{j.last_run}</td>
                  <td className="py-10 text-text-muted whitespace-nowrap">{j.next_run}</td>
                  <td className="py-10 text-end">
                    <button className="px-10 py-4 rounded-6 text-[11px] border border-border text-text-muted hover:text-text-main hover:bg-bg transition-colors">
                      {j.status === "در حال اجرا" ? "لغو" : "اجرا"}
                    </button>
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
