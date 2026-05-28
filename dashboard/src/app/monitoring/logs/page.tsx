"use client";

import { useState } from "react";
import Link from "next/link";

interface LogEntry {
  id:        string;
  ts:        string;
  level:     "ERROR" | "WARN" | "INFO" | "DEBUG";
  service:   string;
  message:   string;
  traceId:   string | null;
}

const LOGS: LogEntry[] = [
  { id: "l001", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۳۲:۱۸", level: "ERROR", service: "api-gateway",    message: "upstream timeout after 30s — prod-api-01:8080",                     traceId: "abc123f0" },
  { id: "l002", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۳۲:۱۵", level: "WARN",  service: "prod-api-01",    message: "connection pool exhausted (max=50), queuing requests",               traceId: "abc123f0" },
  { id: "l003", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۳۱:۵۵", level: "INFO",  service: "prod-api-01",    message: "request POST /api/v2/orders completed in 243ms",                     traceId: "def456a1" },
  { id: "l004", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۳۱:۴۰", level: "INFO",  service: "prod-postgres",  message: "checkpoint completed: wrote 1245 buffers (0.8%)",                   traceId: null       },
  { id: "l005", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۳۱:۲۰", level: "ERROR", service: "ml-mongo",       message: "replica set election started — primary stepped down",               traceId: null       },
  { id: "l006", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۳۰:۵۸", level: "WARN",  service: "k8s-controller", message: "pod prod-worker-7d9f5-x2k8p restarted (exit code 137, OOMKilled)", traceId: null       },
  { id: "l007", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۳۰:۳۵", level: "INFO",  service: "backup-agent",   message: "backup job prod-daily completed — 124 GB written in 18m32s",        traceId: null       },
  { id: "l008", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۳۰:۱۰", level: "DEBUG", service: "prod-api-01",    message: "cache miss for key user:session:a9f2b — fetching from DB",          traceId: "ghi789b2" },
  { id: "l009", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۲۹:۵۵", level: "INFO",  service: "cdn-edge",       message: "purged 3840 cached objects for zone prod-wildcard",                 traceId: null       },
  { id: "l010", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۲۹:۳۰", level: "WARN",  service: "prod-api-01",    message: "JWT token expiry within 5 minutes for user_id=8812",               traceId: "def456a1" },
  { id: "l011", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۲۸:۵۰", level: "INFO",  service: "iam-service",    message: "user ars@example.com logged in from IP 78.39.214.5",               traceId: null       },
  { id: "l012", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۲۸:۱۰", level: "ERROR", service: "prod-redis",     message: "OOM command not allowed when used memory > maxmemory policy=noeviction", traceId: null },
];

const LEVEL_STYLE: Record<string, string> = {
  ERROR: "bg-red-100 text-red-700 font-bold",
  WARN:  "bg-amber-100 text-amber-700",
  INFO:  "bg-blue-50 text-brand",
  DEBUG: "bg-slate-100 text-slate-500",
};

const SERVICES = ["همه", "api-gateway", "prod-api-01", "prod-postgres", "ml-mongo", "k8s-controller", "backup-agent", "cdn-edge", "prod-redis", "iam-service"];
const LEVELS   = ["همه", "ERROR", "WARN", "INFO", "DEBUG"];

export default function MonitoringLogsPage() {
  const [level,   setLevel]   = useState("همه");
  const [service, setService] = useState("همه");
  const [search,  setSearch]  = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = LOGS.filter((l) => {
    if (level   !== "همه" && l.level   !== level)   return false;
    if (service !== "همه" && l.service !== service) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase()) && !l.service.includes(search)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">لاگ‌های سیستم</h1>
            <p className="text-[12px] text-text-muted mt-2">جستجو و بررسی رویدادهای سرویس‌ها</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 border border-border text-text-muted text-[12px] hover:bg-bg">صادرات</button>
            <Link href="/monitoring" className="text-[12px] text-text-muted hover:text-brand">← مانیتورینگ</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",   value: LOGS.length,                                          color: "#2554d8" },
            { label: "خطا",  value: LOGS.filter((l) => l.level === "ERROR").length,      color: "#dc2626" },
            { label: "هشدار",value: LOGS.filter((l) => l.level === "WARN").length,       color: "#d97706" },
            { label: "اطلاع",value: LOGS.filter((l) => l.level === "INFO").length,       color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-10 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در پیام‌ها..."
          className="px-12 py-8 rounded-8 border border-border bg-bg text-[12px] text-text-main focus:outline-none focus:border-brand min-w-[200px] flex-1" />
        <select value={level} onChange={(e) => setLevel(e.target.value)}
          className="px-10 py-8 rounded-8 border border-border bg-bg text-[12px] text-text-main focus:outline-none">
          {LEVELS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select value={service} onChange={(e) => setService(e.target.value)}
          className="px-10 py-8 rounded-8 border border-border bg-bg text-[12px] text-text-main focus:outline-none">
          {SERVICES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="glass rounded-14 overflow-hidden font-mono text-[11px]">
        <div className="border-b border-border px-16 py-8 text-text-muted grid grid-cols-[140px_60px_120px_1fr] gap-12 bg-bg/50">
          <span>زمان</span><span>سطح</span><span>سرویس</span><span>پیام</span>
        </div>
        {filtered.length === 0 && (
          <div className="px-16 py-20 text-center text-text-muted text-[12px]">نتیجه‌ای یافت نشد</div>
        )}
        {filtered.map((l) => (
          <div key={l.id}
            onClick={() => setExpanded(expanded === l.id ? null : l.id)}
            className={`border-b border-border/50 cursor-pointer transition-colors hover:bg-bg/60 ${l.level === "ERROR" ? "bg-red-50/10" : ""}`}>
            <div className="px-16 py-9 grid grid-cols-[140px_60px_120px_1fr] gap-12 items-start ltr-text" style={{ direction: "ltr" }}>
              <span className="text-text-muted whitespace-nowrap">{l.ts}</span>
              <span className={`px-5 py-1 rounded-4 text-[10px] w-fit ${LEVEL_STYLE[l.level]}`}>{l.level}</span>
              <span className="text-brand truncate">{l.service}</span>
              <span className="text-text-main truncate">{l.message}</span>
            </div>
            {expanded === l.id && (
              <div className="px-16 pb-12 ltr-text" style={{ direction: "ltr" }}>
                <div className="bg-bg rounded-8 p-12 border border-border text-[11px] text-text-muted leading-relaxed">
                  <p><span className="text-brand">timestamp:</span> {l.ts}</p>
                  <p><span className="text-brand">level:</span>     {l.level}</p>
                  <p><span className="text-brand">service:</span>   {l.service}</p>
                  <p><span className="text-brand">message:</span>   {l.message}</p>
                  {l.traceId && <p><span className="text-brand">trace_id:</span>  {l.traceId}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
