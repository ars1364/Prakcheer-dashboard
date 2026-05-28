"use client";

import { useState } from "react";
import Link from "next/link";

const ALERTS = [
  { id: "a01", ts: "۱۳:۴۱", severity: "critical", source: "Nova",     region: "تهران-۱",  msg: "Compute node compute-03.teh1 CPU usage 98% — 5 min sustained", acknowledged: false },
  { id: "a02", ts: "۱۳:۲۲", severity: "critical", source: "Ceph",     region: "اصفهان-۱", msg: "OSD osd.14 I/O errors > 100/min — risk of data loss",           acknowledged: false },
  { id: "a03", ts: "۱۲:۵۵", severity: "high",     source: "Neutron",  region: "اصفهان-۱", msg: "neutron-l3-agent replica 1/2 — failover risk",                   acknowledged: false },
  { id: "a04", ts: "۱۲:۳۰", severity: "high",     source: "Heat",     region: "مشهد-۱",   msg: "heat-api service down in msh1 — stack operations unavailable",    acknowledged: true  },
  { id: "a05", ts: "۱۱:۴۸", severity: "medium",   source: "Billing",  region: "—",        msg: "Tenant سازمان پژوهش approaching 95% budget threshold",            acknowledged: true  },
  { id: "a06", ts: "۱۱:۱۰", severity: "medium",   source: "Security", region: "—",        msg: "12 failed login attempts from IP 91.211.44.12 in 10 min",        acknowledged: true  },
  { id: "a07", ts: "۱۰:۳۵", severity: "low",      source: "CDN",      region: "—",        msg: "CDN zone-eu-central bandwidth at 78% monthly cap",                acknowledged: true  },
];

const SEV: Record<string, {bg:string;label:string;dot:string}> = {
  critical: { bg: "bg-red-100 text-red-700",    label: "بحرانی", dot: "#dc2626" },
  high:     { bg: "bg-orange-100 text-orange-700", label: "بالا",   dot: "#ea580c" },
  medium:   { bg: "bg-amber-100 text-amber-700",  label: "متوسط",  dot: "#d97706" },
  low:      { bg: "bg-blue-50 text-brand",         label: "پایین",  dot: "#2554d8" },
};

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS);
  const ack = (id: string) => setAlerts((a) => a.map((x) => x.id === id ? { ...x, acknowledged: true } : x));

  const unacked = alerts.filter((a) => !a.acknowledged);
  const critical = alerts.filter((a) => a.severity === "critical" && !a.acknowledged);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">هشدارهای فعال</h1>
            <p className="text-[12px] text-text-muted mt-2">هشدارهای سطح پلتفرم</p>
          </div>
          <div className="flex gap-8">
            <Link href="/admin/alerts/history"    className="text-[12px] text-brand hover:underline">تاریخچه →</Link>
            <Link href="/admin/alerts/thresholds" className="text-[12px] text-brand hover:underline">آستانه‌ها →</Link>
            <Link href="/admin"                   className="text-[12px] text-text-muted hover:text-brand">← ادمین</Link>
          </div>
        </div>
        {critical.length > 0 && (
          <div className="mb-14 p-12 rounded-10 bg-red-50 border border-red-200 text-[12px] text-red-700">
            🚨 {critical.length} هشدار بحرانی در انتظار بررسی
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "تأییدنشده",  value: unacked.length,                                      color: "#d97706" },
            { label: "بحرانی",     value: alerts.filter((a) => a.severity === "critical").length, color: "#dc2626" },
            { label: "بالا",       value: alerts.filter((a) => a.severity === "high").length,   color: "#ea580c" },
            { label: "کل فعال",   value: alerts.length,                                         color: "#64748b" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {alerts.map((a) => (
          <div key={a.id} className={`glass rounded-16 border p-16 flex items-start gap-12 ${a.acknowledged ? "opacity-60 border-transparent" : a.severity === "critical" ? "border-red-300" : a.severity === "high" ? "border-orange-200" : "border-transparent"}`}>
            <div className="w-8 h-8 rounded-999 mt-1 shrink-0" style={{ background: SEV[a.severity].dot }} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-8 mb-4">
                <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${SEV[a.severity].bg}`}>{SEV[a.severity].label}</span>
                <span className="text-[11px] text-text-muted">{a.source}</span>
                {a.region !== "—" && <span className="text-[11px] text-text-muted">{a.region}</span>}
                <span className="text-[11px] text-text-muted">{a.ts}</span>
              </div>
              <p className="text-[12px] text-text-main ltr-text" style={{ direction: "ltr" }}>{a.msg}</p>
            </div>
            {!a.acknowledged && (
              <button onClick={() => ack(a.id)} className="shrink-0 px-10 py-5 rounded-6 border border-border text-[11px] text-text-muted hover:bg-bg transition-colors">تأیید</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
