"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── mock data ─── */
const RESOURCE_SUMMARY = [
  { label: "سرورها",     href: "/iaas/servers",      icon: "◻", total: 47, active: 43, warn: 2, down: 2,  color: "#2554d8" },
  { label: "شبکه‌ها",   href: "/iaas/networks",     icon: "◱", total: 18, active: 18, warn: 0, down: 0,  color: "#7c3aed" },
  { label: "فایروال",   href: "/iaas/firewall",     icon: "◭", total: 12, active: 11, warn: 1, down: 0,  color: "#dc2626" },
  { label: "دیسک‌ها",   href: "/iaas/volumes",      icon: "◫", total: 94, active: 89, warn: 3, down: 2,  color: "#d97706" },
  { label: "IP شناور",  href: "/iaas/floating-ips", icon: "◎", total: 31, active: 22, warn: 0, down: 9,  color: "#0891b2" },
  { label: "اسنپ‌شات",  href: "/iaas/snapshots",    icon: "◉", total: 203, active: 203, warn: 0, down: 0, color: "#16a34a" },
];

const REGIONS = ["تهران-۱", "اصفهان-۱", "مشهد-۱"];

const SERVERS_BY_REGION = [
  { region: "تهران-۱",   total: 28, cpu: 64, ram: 71 },
  { region: "اصفهان-۱", total: 12, cpu: 48, ram: 55 },
  { region: "مشهد-۱",   total: 7,  cpu: 32, ram: 44 },
];

const FLAVORS = [
  { name: "nano (1vCPU/1GB)",   count: 8,  pct: 17 },
  { name: "small (2vCPU/4GB)",  count: 14, pct: 30 },
  { name: "medium (4vCPU/8GB)", count: 11, pct: 23 },
  { name: "large (8vCPU/16GB)", count: 9,  pct: 19 },
  { name: "xlarge (16vCPU/32GB)", count: 5, pct: 11 },
];

const HOURLY_CPU: { h: string; cpu: number; ram: number }[] = Array.from({ length: 24 }, (_, i) => ({
  h: `${String(i).padStart(2, "0")}:00`,
  cpu: 38 + Math.round(Math.sin(i / 3) * 18 + Math.random() * 12),
  ram: 55 + Math.round(Math.cos(i / 4) * 10 + Math.random() * 8),
}));

const RECENT_EVENTS = [
  { id: "e1", ts: "۱۴۰۵/۰۳/۰۷ ۱۳:۴۱", type: "ایجاد",    severity: "info",    msg: "سرور web-prod-04 راه‌اندازی شد",          region: "تهران-۱"   },
  { id: "e2", ts: "۱۴۰۵/۰۳/۰۷ ۱۳:۲۲", type: "خطا",      severity: "critical", msg: "دیسک data-vol-12 خطای I/O",              region: "اصفهان-۱"  },
  { id: "e3", ts: "۱۴۰۵/۰۳/۰۷ ۱۲:۵۵", type: "تغییر",    severity: "warn",     msg: "قوانین فایروال fw-prod تغییر کرد",        region: "تهران-۱"   },
  { id: "e4", ts: "۱۴۰۵/۰۳/۰۷ ۱۲:۳۰", type: "ایجاد",    severity: "info",    msg: "اسنپ‌شات snap-db-weekly ساخته شد",        region: "مشهد-۱"    },
  { id: "e5", ts: "۱۴۰۵/۰۳/۰۷ ۱۱:۴۸", type: "خاموش",   severity: "warn",     msg: "سرور staging-03 متوقف شد",               region: "تهران-۱"   },
  { id: "e6", ts: "۱۴۰۵/۰۳/۰۷ ۱۱:۱۰", type: "ایجاد",    severity: "info",    msg: "IP شناور 185.23.11.44 اختصاص یافت",       region: "اصفهان-۱"  },
  { id: "e7", ts: "۱۴۰۵/۰۳/۰۷ ۱۰:۳۵", type: "خطا",      severity: "warn",     msg: "سرور ml-worker-02 CPU بالا (92%)",        region: "تهران-۱"   },
];

const VOLUME_USAGE = [
  { region: "تهران-۱",   used: 14.2, total: 20, pct: 71 },
  { region: "اصفهان-۱", used: 5.8,  total: 10, pct: 58 },
  { region: "مشهد-۱",   used: 2.1,  total: 5,  pct: 42 },
];

/* ─── helpers ─── */
function ChartTooltip({ active, payload, label }: {active?:boolean; payload?:{name:string;value:number;color:string}[]; label?:string}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] shadow-lg border border-border min-w-[110px]">
      <p className="text-text-muted mb-4 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex justify-between gap-16">
          <span>{p.name}</span><span className="font-semibold">{p.value}%</span>
        </p>
      ))}
    </div>
  );
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex-1 h-6 rounded-999 bg-border overflow-hidden">
      <div className="h-full rounded-999 transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

const SEV_STYLE: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  warn:     "bg-amber-100 text-amber-700",
  info:     "bg-blue-100 text-brand",
};

const TYPE_STYLE: Record<string, string> = {
  "ایجاد":  "bg-green-50 text-green-700",
  "خطا":    "bg-red-50 text-red-700",
  "تغییر":  "bg-amber-50 text-amber-700",
  "خاموش": "bg-slate-100 text-slate-600",
};

/* ─── component ─── */
export default function IaaSPage() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const totalServers  = RESOURCE_SUMMARY[0].total;
  const downCount     = RESOURCE_SUMMARY.reduce((a, r) => a + r.down, 0);
  const warnCount     = RESOURCE_SUMMARY.reduce((a, r) => a + r.warn, 0);
  const totalVolumeTB = VOLUME_USAGE.reduce((a, v) => a + v.used, 0).toFixed(1);

  const avgCpu = Math.round(SERVERS_BY_REGION.reduce((a, r) => a + r.cpu, 0) / SERVERS_BY_REGION.length);
  const avgRam = Math.round(SERVERS_BY_REGION.reduce((a, r) => a + r.ram, 0) / SERVERS_BY_REGION.length);

  /* segmented bar: resource type distribution */
  const totalResources = RESOURCE_SUMMARY.reduce((a, r) => a + r.total, 0);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">

      {/* ── header panel ── */}
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">زیرساخت ابری</h1>
            <p className="text-[12px] text-text-muted mt-2">نمای کلی منابع محاسباتی — {REGIONS.join(" | ")}</p>
          </div>
          <div className="flex gap-8">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(activeRegion === r ? null : r)}
                className={`px-12 py-6 rounded-8 text-[12px] font-medium transition-all border
                  ${activeRegion === r
                    ? "bg-brand text-white border-brand"
                    : "border-border text-text-muted hover:text-text-main hover:border-brand/40"}`}
              >{r}</button>
            ))}
          </div>
        </div>

        {/* resource type segmented bar */}
        <div className="flex h-12 rounded-999 overflow-hidden gap-1 mb-10">
          {RESOURCE_SUMMARY.map((r) => (
            <div
              key={r.label}
              style={{ width: `${(r.total / totalResources) * 100}%`, background: r.color }}
              className="h-full transition-all"
              title={`${r.label}: ${r.total}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-16 gap-y-4 mb-18">
          {RESOURCE_SUMMARY.map((r) => (
            <span key={r.label} className="flex items-center gap-6 text-[11px] text-text-muted">
              <span className="w-8 h-8 rounded-2" style={{ background: r.color }} />
              {r.label} ({r.total})
            </span>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل سرورها",       value: totalServers, sub: "۴۳ فعال",           color: "#2554d8" },
            { label: "میانگین CPU",      value: `${avgCpu}%`,  sub: "در ۳ منطقه",        color: avgCpu > 80 ? "#dc2626" : avgCpu > 60 ? "#d97706" : "#16a34a" },
            { label: "میانگین RAM",      value: `${avgRam}%`,  sub: "در ۳ منطقه",        color: avgRam > 80 ? "#dc2626" : avgRam > 60 ? "#d97706" : "#16a34a" },
            { label: "هشدار / خرابی",   value: `${warnCount}/${downCount}`, sub: "نیاز به توجه", color: downCount > 0 ? "#dc2626" : "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-text-muted mt-2">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── quick-access cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-12">
        {RESOURCE_SUMMARY.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="glass rounded-12 p-16 flex flex-col gap-8 hover:shadow-md transition-all group border border-transparent hover:border-brand/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-[20px]" style={{ color: r.color }}>{r.icon}</span>
              {(r.down > 0 || r.warn > 0) && (
                <span className={`text-[10px] px-6 py-2 rounded-999 font-semibold ${r.down > 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {r.down > 0 ? `${r.down} خرابی` : `${r.warn} هشدار`}
                </span>
              )}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-main group-hover:text-brand transition-colors">{r.label}</p>
              <p className="text-[11px] text-text-muted mt-2">{r.total} منبع</p>
            </div>
            <div className="flex gap-6 items-center">
              <div className="flex-1 h-4 rounded-999 bg-border overflow-hidden">
                <div
                  className="h-full rounded-999"
                  style={{ width: `${(r.active / r.total) * 100}%`, background: r.color }}
                />
              </div>
              <span className="text-[10px] text-text-muted">{r.active}/{r.total}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

        {/* 24h CPU/RAM trend */}
        <div className="glass rounded-16 p-20">
          <h2 className="text-[14px] font-semibold text-text-main mb-16">مصرف CPU و RAM — ۲۴ ساعت</h2>
          <div className="ltr-text" style={{ direction: "ltr" }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={HOURLY_CPU} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2554d8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2554d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="h" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} interval={5} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} domain={[0, 100]} unit="%" />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
                <Area type="monotone" dataKey="cpu" name="CPU" stroke="#2554d8" strokeWidth={2} fill="url(#gCpu)" dot={false} />
                <Area type="monotone" dataKey="ram" name="RAM" stroke="#7c3aed" strokeWidth={2} fill="url(#gRam)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* per-region resource bars */}
        <div className="glass rounded-16 p-20">
          <h2 className="text-[14px] font-semibold text-text-main mb-16">توزیع منابع به تفکیک منطقه</h2>
          <div className="ltr-text" style={{ direction: "ltr" }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={SERVERS_BY_REGION} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="region" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} unit="%" domain={[0, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
                <Bar dataKey="cpu" name="CPU" fill="#2554d8" radius={[3,3,0,0]} maxBarSize={32} />
                <Bar dataKey="ram" name="RAM" fill="#7c3aed" radius={[3,3,0,0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── storage & flavor row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

        {/* volume storage usage */}
        <div className="glass rounded-16 p-20">
          <h2 className="text-[14px] font-semibold text-text-main mb-16">مصرف فضای ذخیره‌سازی</h2>
          <div className="flex flex-col gap-12">
            {VOLUME_USAGE.map((v) => (
              <div key={v.region} className="flex items-center gap-12">
                <p className="text-[12px] text-text-main font-medium w-[80px] shrink-0">{v.region}</p>
                <div className="flex-1 flex items-center gap-8">
                  <div className="flex-1 h-10 rounded-999 bg-border overflow-hidden">
                    <div
                      className="h-full rounded-999 transition-all"
                      style={{
                        width: `${v.pct}%`,
                        background: v.pct > 80 ? "#ef4444" : v.pct > 60 ? "#f59e0b" : "#2554d8",
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-text-muted w-[70px] text-end shrink-0">{v.used} / {v.total} TB</span>
                  <span className={`text-[11px] font-bold w-[32px] shrink-0 ${v.pct > 80 ? "text-red-600" : v.pct > 60 ? "text-amber-600" : "text-brand"}`}>{v.pct}%</span>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-12 border-t border-border flex justify-between text-[12px]">
              <span className="text-text-muted">کل استفاده‌شده</span>
              <span className="font-bold text-text-main">{totalVolumeTB} TB</span>
            </div>
          </div>
        </div>

        {/* server flavors */}
        <div className="glass rounded-16 p-20">
          <h2 className="text-[14px] font-semibold text-text-main mb-16">توزیع سایز سرورها</h2>
          <div className="flex flex-col gap-10">
            {FLAVORS.map((f) => (
              <div key={f.name} className="flex items-center gap-12">
                <p className="text-[11px] text-text-muted w-[140px] shrink-0 truncate" title={f.name}>{f.name}</p>
                <MiniBar pct={f.pct} color="#2554d8" />
                <span className="text-[11px] text-text-muted w-[44px] text-end shrink-0">{f.count} سرور</span>
                <span className="text-[11px] font-semibold text-brand w-[28px] shrink-0">{f.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── recent events ── */}
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-[14px] font-semibold text-text-main">رویدادهای اخیر زیرساخت</h2>
          <Link href="/activity-log" className="text-[12px] text-brand hover:underline">مشاهده همه ←</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-start pb-10 font-medium pr-4">زمان</th>
                <th className="text-start pb-10 font-medium">نوع</th>
                <th className="text-start pb-10 font-medium">رویداد</th>
                <th className="text-start pb-10 font-medium">منطقه</th>
                <th className="text-start pb-10 font-medium">شدت</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_EVENTS.map((ev) => (
                <tr key={ev.id} className="border-b border-border/50 hover:bg-bg/60 transition-colors">
                  <td className="py-10 pr-4 ltr-text text-text-muted" style={{ direction: "ltr" }}>{ev.ts}</td>
                  <td className="py-10">
                    <span className={`px-8 py-3 rounded-6 text-[11px] font-medium ${TYPE_STYLE[ev.type] ?? "bg-slate-50 text-slate-600"}`}>
                      {ev.type}
                    </span>
                  </td>
                  <td className="py-10 text-text-main max-w-[260px] truncate">{ev.msg}</td>
                  <td className="py-10 text-text-muted">{ev.region}</td>
                  <td className="py-10">
                    <span className={`px-8 py-3 rounded-6 text-[11px] font-medium ${SEV_STYLE[ev.severity]}`}>
                      {ev.severity === "critical" ? "بحرانی" : ev.severity === "warn" ? "هشدار" : "اطلاع"}
                    </span>
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
