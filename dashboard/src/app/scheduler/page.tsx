"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type JobStatus   = "موفق" | "ناموفق" | "در حال اجرا" | "صبر" | "غیرفعال";
type JobCategory = "پشتیبان‌گیری" | "گزارش" | "پاکسازی" | "هماهنگی" | "اطلاع‌رسانی" | "ML";

interface CronRun {
  ts: string;
  status: "موفق" | "ناموفق";
  duration_s: number;
}

interface CronJob {
  id: string;
  name: string;
  description: string;
  schedule: string;
  cron_expr: string;
  status: JobStatus;
  category: JobCategory;
  command: string;
  region: string;
  last_run: string;
  next_run: string;
  last_duration_s: number;
  success_rate_30d: number;
  runs_30d: number;
  recentRuns: CronRun[];
}

/* ─── mock data ─── */
const ALL_JOBS: CronJob[] = [
  {
    id: "j1",  name: "db-backup-nightly",   description: "بکاپ کامل پایگاه داده",                 schedule: "هر شب ۰۲:۰۰",     cron_expr: "0 2 * * *",    status: "موفق",         category: "پشتیبان‌گیری", command: "backup.sh --full prod-postgres",    region: "تهران",  last_run: "۳ ساعت پیش",   next_run: "۲۱ ساعت دیگر",  last_duration_s: 284, success_rate_30d: 97,  runs_30d: 30,
    recentRuns: [
      { ts: "دیروز ۰۲:۰۰",   status: "موفق",   duration_s: 280 },
      { ts: "پریروز ۰۲:۰۰",  status: "موفق",   duration_s: 276 },
      { ts: "۳ روز پیش",     status: "ناموفق", duration_s: 0   },
      { ts: "۴ روز پیش",     status: "موفق",   duration_s: 291 },
    ],
  },
  {
    id: "j2",  name: "daily-report",         description: "تولید گزارش روزانه برای مدیریت",        schedule: "هر روز ۰۸:۰۰",     cron_expr: "0 8 * * *",    status: "موفق",         category: "گزارش",       command: "report-gen.py --daily --send-email",region: "تهران",  last_run: "۵ ساعت پیش",   next_run: "۱۹ ساعت دیگر",  last_duration_s: 48,  success_rate_30d: 100, runs_30d: 30,
    recentRuns: [
      { ts: "دیروز",   status: "موفق", duration_s: 45 },
      { ts: "پریروز",  status: "موفق", duration_s: 52 },
    ],
  },
  {
    id: "j3",  name: "log-cleanup",          description: "پاکسازی لاگ‌های قدیمی‌تر از ۹۰ روز",   schedule: "هر هفته یکشنبه",   cron_expr: "0 3 * * 0",    status: "موفق",         category: "پاکسازی",     command: "logclean --older-than 90d",          region: "مشهد",   last_run: "۳ روز پیش",    next_run: "۴ روز دیگر",    last_duration_s: 720, success_rate_30d: 100, runs_30d: 4,
    recentRuns: [
      { ts: "۳ روز پیش",  status: "موفق", duration_s: 720 },
      { ts: "۱۰ روز پیش", status: "موفق", duration_s: 688 },
    ],
  },
  {
    id: "j4",  name: "k8s-sync",             description: "همگام‌سازی ConfigMap با Git",           schedule: "هر ۱۵ دقیقه",     cron_expr: "*/15 * * * *", status: "موفق",         category: "هماهنگی",    command: "gitops-sync --namespace production",region: "تهران",  last_run: "۱۲ دقیقه پیش", next_run: "۳ دقیقه دیگر",  last_duration_s: 4,   success_rate_30d: 99,  runs_30d: 2880,
    recentRuns: [
      { ts: "۱۲ دقیقه پیش", status: "موفق", duration_s: 4 },
      { ts: "۲۷ دقیقه پیش", status: "موفق", duration_s: 3 },
    ],
  },
  {
    id: "j5",  name: "weekly-invoice",       description: "تولید و ارسال فاکتور هفتگی",            schedule: "هر شنبه ۱۰:۰۰",   cron_expr: "0 10 * * 6",   status: "موفق",         category: "اطلاع‌رسانی",command: "invoice.py --period weekly --send",  region: "تهران",  last_run: "۲ روز پیش",    next_run: "۵ روز دیگر",    last_duration_s: 92,  success_rate_30d: 100, runs_30d: 4,
    recentRuns: [
      { ts: "۲ روز پیش",  status: "موفق", duration_s: 92 },
      { ts: "۹ روز پیش",  status: "موفق", duration_s: 88 },
    ],
  },
  {
    id: "j6",  name: "ml-retrain",           description: "بازآموزی مدل توصیه‌گر محصولات",         schedule: "هر یکشنبه",        cron_expr: "0 4 * * 0",    status: "در حال اجرا",  category: "ML",          command: "train.py --model recommender --data prod", region: "مشهد", last_run: "هم‌اکنون", next_run: "۷ روز دیگر",   last_duration_s: 0,   success_rate_30d: 75,  runs_30d: 4,
    recentRuns: [
      { ts: "هم‌اکنون",   status: "موفق", duration_s: 0    },
      { ts: "۷ روز پیش",  status: "ناموفق",duration_s: 0   },
      { ts: "۱۴ روز پیش", status: "موفق", duration_s: 14400},
    ],
  },
  {
    id: "j7",  name: "ssl-renew-check",      description: "بررسی تاریخ انقضا SSL و تمدید",         schedule: "روزانه ۰۶:۰۰",    cron_expr: "0 6 * * *",    status: "موفق",         category: "هماهنگی",    command: "certbot renew --dry-run",            region: "تهران",  last_run: "۷ ساعت پیش",   next_run: "۱۷ ساعت دیگر",  last_duration_s: 12,  success_rate_30d: 100, runs_30d: 30,
    recentRuns: [
      { ts: "دیروز",   status: "موفق", duration_s: 11 },
      { ts: "پریروز",  status: "موفق", duration_s: 12 },
    ],
  },
  {
    id: "j8",  name: "cache-warm",           description: "پیش‌گرم‌سازی کش Redis",                  schedule: "هر ۶ ساعت",       cron_expr: "0 */6 * * *",  status: "ناموفق",       category: "هماهنگی",    command: "cache-warmer.sh --keys catalog",     region: "تهران",  last_run: "۱ ساعت پیش",   next_run: "۵ ساعت دیگر",   last_duration_s: 0,   success_rate_30d: 83,  runs_30d: 120,
    recentRuns: [
      { ts: "۱ ساعت پیش",  status: "ناموفق", duration_s: 0  },
      { ts: "۷ ساعت پیش",  status: "موفق",   duration_s: 38 },
      { ts: "۱۳ ساعت پیش", status: "موفق",   duration_s: 41 },
    ],
  },
];

const DAILY_RUNS = [
  { d: "شنبه",   success: 310, failed: 8  },
  { d: "یکشنبه", success: 298, failed: 12 },
  { d: "دوشنبه", success: 315, failed: 5  },
  { d: "سه‌شنبه",success: 304, failed: 7  },
  { d: "چهارشنبه",success:311, failed: 4  },
  { d: "پنجشنبه",success: 308, failed: 9  },
  { d: "جمعه",   success: 142, failed: 18 },
];

/* ─── colors ─── */
const STATUS_COLOR: Record<JobStatus, string> = {
  "موفق":         "#16a34a",
  "ناموفق":       "#ef4444",
  "در حال اجرا": "#2554d8",
  "صبر":         "#d97706",
  "غیرفعال":     "#94a3b8",
};

const CAT_COLOR: Record<JobCategory, string> = {
  "پشتیبان‌گیری": "#2554d8",
  "گزارش":       "#8b5cf6",
  "پاکسازی":     "#16a34a",
  "هماهنگی":     "#06b6d4",
  "اطلاع‌رسانی": "#d97706",
  "ML":          "#ef4444",
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

/* ─── run dots ─── */
function RunDots({ runs }: { runs: CronRun[] }) {
  return (
    <div className="flex gap-3">
      {runs.map((r, i) => (
        <div key={i} className="w-8 h-8 rounded-999 shrink-0"
          title={`${r.ts} — ${r.status}`}
          style={{ background: r.status === "موفق" ? "#16a34a" : "#ef4444" }} />
      ))}
    </div>
  );
}

/* ─── page ─── */
export default function SchedulerPage() {
  const [catFilter, setCatFilter] = useState<JobCategory | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");

  const filtered = useMemo(() => {
    let jobs = ALL_JOBS;
    if (catFilter !== "all") jobs = jobs.filter(j => j.category === catFilter);
    if (statusFilter !== "all") jobs = jobs.filter(j => j.status === statusFilter);
    return jobs;
  }, [catFilter, statusFilter]);

  const runningCount = ALL_JOBS.filter(j => j.status === "در حال اجرا").length;
  const failedCount  = ALL_JOBS.filter(j => j.status === "ناموفق").length;
  const activeCount  = ALL_JOBS.filter(j => j.status !== "غیرفعال").length;
  const totalRuns30d = ALL_JOBS.reduce((s, j) => s + j.runs_30d, 0);

  /* category dot strip for header */
  const catCounts = useMemo(() => {
    const g: Partial<Record<JobCategory, number>> = {};
    ALL_JOBS.forEach(j => { g[j.category] = (g[j.category] || 0) + 1; });
    return Object.entries(g) as [JobCategory, number][];
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[14px] font-bold text-text-main">زمان‌بندی وظایف</h2>
          <div className="flex items-center gap-8">
            {failedCount > 0 && (
              <div className="flex items-center gap-6 px-10 py-5 rounded-8 text-[11px] font-bold"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
                ✗ {failedCount} وظیفه ناموفق
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

        {/* category segmented bar */}
        <div className="flex h-12 rounded-999 overflow-hidden gap-1 mb-8">
          {catCounts.map(([cat, count]) => (
            <div key={cat} title={`${cat}: ${count}`}
              style={{ flex: count, background: CAT_COLOR[cat] }}
              className="rounded-999 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setCatFilter(catFilter === cat ? "all" : cat)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-10 mb-14">
          {catCounts.map(([cat, count]) => (
            <button key={cat} onClick={() => setCatFilter(catFilter === cat ? "all" : cat)}
              className={`flex items-center gap-5 text-[11px] transition-colors ${catFilter === cat ? "font-semibold text-text-main" : "text-text-muted"}`}>
              <span className="w-7 h-7 rounded-999 shrink-0" style={{ background: CAT_COLOR[cat] }} />
              {cat} ({count})
            </button>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "وظایف فعال",       value: `${activeCount} / ${ALL_JOBS.length}`, color: "#16a34a" },
            { label: "در حال اجرا",      value: runningCount,                           color: "#2554d8" },
            { label: "ناموفق",           value: failedCount,                            color: "#ef4444" },
            { label: "اجرا در ۳۰ روز",  value: totalRuns30d.toLocaleString(),          color: "#8b5cf6" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[22px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── daily runs chart ─── */}
      <div className="glass rounded-16 p-16">
        <p className="text-[13px] font-semibold text-text-main mb-12">اجراها — ۷ روز اخیر</p>
        <div className="ltr-text h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DAILY_RUNS} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="d" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
              <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
              <Bar dataKey="success" name="موفق"  stackId="a" fill="#16a34a" />
              <Bar dataKey="failed"  name="ناموفق" stackId="a" fill="#ef4444" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── jobs list ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex flex-wrap items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">وظایف زمان‌بندی شده</h3>
          {(["all", "موفق", "ناموفق", "در حال اجرا"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ${statusFilter === s ? "bg-brand text-white" : "bg-bg text-text-muted hover:text-text-main border border-border"}`}>
              {s === "all" ? "همه" : s}
            </button>
          ))}
          <button className="flex items-center gap-6 px-12 py-6 rounded-8 text-[12px] font-medium bg-brand text-white hover:bg-brand/90 transition-colors">
            + وظیفه جدید
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {filtered.map(job => (
            <div key={job.id} className="border border-border rounded-12 overflow-hidden">
              {/* job row */}
              <div className="flex items-center gap-14 px-16 py-12 cursor-pointer hover:bg-bg/30 transition-colors"
                onClick={() => setExpanded(expanded === job.id ? null : job.id)}>
                <span className="text-text-muted text-[10px]">{expanded === job.id ? "▲" : "▶"}</span>

                {/* status dot */}
                <div className="w-10 h-10 rounded-999 shrink-0 flex-none"
                  style={{ background: STATUS_COLOR[job.status], boxShadow: job.status === "در حال اجرا" ? `0 0 6px ${STATUS_COLOR[job.status]}` : "none" }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-10 mb-3">
                    <span className="text-[12px] font-bold text-text-main ltr-text">{job.name}</span>
                    <span className="px-7 py-2 rounded-4 text-[10px] font-medium"
                      style={{ background: `${CAT_COLOR[job.category]}15`, color: CAT_COLOR[job.category] }}>
                      {job.category}
                    </span>
                    <span className="px-7 py-2 rounded-4 text-[10px] font-medium"
                      style={{ background: `${STATUS_COLOR[job.status]}15`, color: STATUS_COLOR[job.status] }}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted">{job.description}</p>
                </div>

                <div className="hidden lg:flex items-center gap-20 text-[11px] text-text-muted shrink-0">
                  <div>
                    <p className="text-text-main font-mono ltr-text">{job.cron_expr}</p>
                    <p>{job.schedule}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold" style={{ color: job.success_rate_30d >= 95 ? "#16a34a" : "#d97706" }}>{job.success_rate_30d}٪</p>
                    <p>موفقیت ۳۰روز</p>
                  </div>
                  <RunDots runs={job.recentRuns.slice(0, 4)} />
                  <div className="text-center">
                    <p className="text-text-main">{job.next_run}</p>
                    <p>اجرای بعدی</p>
                  </div>
                </div>
              </div>

              {/* expanded detail */}
              {expanded === job.id && (
                <div className="border-t border-border bg-bg/30 px-20 py-14">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
                    {[
                      { label: "دستور اجرا",     value: job.command,                                          mono: true  },
                      { label: "آخرین اجرا",     value: job.last_run,                                         mono: false },
                      { label: "مدت آخرین اجرا", value: job.last_duration_s > 0 ? `${job.last_duration_s}s` : "—", mono: true },
                      { label: "تعداد اجرا ۳۰روز", value: job.runs_30d.toLocaleString(),                       mono: true  },
                    ].map(s => (
                      <div key={s.label} className="rounded-10 px-12 py-10 bg-bg/60 border border-border/40">
                        <p className="text-[10px] text-text-muted mb-2">{s.label}</p>
                        <p className={`text-[11px] font-semibold text-text-main truncate ${s.mono ? "ltr-text font-mono" : ""}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* recent runs */}
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-8">اجراهای اخیر</p>
                  <div className="flex flex-col gap-4">
                    {job.recentRuns.map((r, ri) => (
                      <div key={ri} className="flex items-center gap-10 text-[11px]">
                        <div className="w-8 h-8 rounded-999 shrink-0" style={{ background: r.status === "موفق" ? "#16a34a" : "#ef4444" }} />
                        <span className="text-text-muted">{r.ts}</span>
                        <span style={{ color: r.status === "موفق" ? "#16a34a" : "#ef4444" }}>{r.status}</span>
                        {r.duration_s > 0 && <span className="ltr-text font-mono text-text-muted ms-auto">{r.duration_s}s</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
