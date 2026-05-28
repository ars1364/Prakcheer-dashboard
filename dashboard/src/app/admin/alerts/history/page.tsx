"use client";

import Link from "next/link";

const HISTORY = [
  { id: "ah01", ts: "۱۴۰۵/۰۳/۰۶ ۰۲:۱۵", severity: "critical", source: "Ceph",    region: "اصفهان-۱", msg: "OSD osd.11 offline — rebalancing completed", duration: "۴۵ دقیقه", resolved: true },
  { id: "ah02", ts: "۱۴۰۵/۰۳/۰۵ ۱۸:۳۰", severity: "high",     source: "Nova",    region: "تهران-۱",  msg: "Compute node CPU 94% for 5min",               duration: "۱۲ دقیقه", resolved: true },
  { id: "ah03", ts: "۱۴۰۵/۰۳/۰۵ ۱۱:۰۰", severity: "medium",   source: "Neutron", region: "مشهد-۱",   msg: "Network MTU mismatch on br-ex",               duration: "۲ ساعت",   resolved: true },
  { id: "ah04", ts: "۱۴۰۵/۰۳/۰۴ ۲۲:۴۵", severity: "critical", source: "Keystone",region: "تهران-۱",  msg: "Auth service latency > 2s for 3min",          duration: "۸ دقیقه",  resolved: true },
  { id: "ah05", ts: "۱۴۰۵/۰۳/۰۳ ۱۵:۲۰", severity: "low",      source: "Billing", region: "—",        msg: "Invoice batch job delayed 2h",                 duration: "۲ ساعت",   resolved: true },
];

const SEV_BG: Record<string, string> = { critical: "bg-red-100 text-red-700", high: "bg-orange-100 text-orange-700", medium: "bg-amber-100 text-amber-700", low: "bg-blue-50 text-brand" };
const SEV_LABEL: Record<string, string> = { critical: "بحرانی", high: "بالا", medium: "متوسط", low: "پایین" };

export default function AlertsHistoryPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[18px] font-bold text-text-main">تاریخچه هشدارها</h1>
          <div className="flex gap-8">
            <Link href="/admin/alerts"            className="text-[12px] text-brand hover:underline">← هشدارهای فعال</Link>
            <Link href="/admin/alerts/thresholds" className="text-[12px] text-brand hover:underline">آستانه‌ها →</Link>
          </div>
        </div>
      </div>
      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">زمان</th>
              <th className="text-start py-12 font-medium">شدت</th>
              <th className="text-start py-12 font-medium">منبع</th>
              <th className="text-start py-12 font-medium">منطقه</th>
              <th className="text-start py-12 font-medium">پیام</th>
              <th className="text-start py-12 font-medium">مدت</th>
              <th className="text-start py-12 font-medium">حل‌شده</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((h) => (
              <tr key={h.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-10 text-text-muted ltr-text text-[11px]" style={{ direction: "ltr" }}>{h.ts}</td>
                <td className="py-10"><span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${SEV_BG[h.severity]}`}>{SEV_LABEL[h.severity]}</span></td>
                <td className="py-10 text-text-muted">{h.source}</td>
                <td className="py-10 text-text-muted">{h.region}</td>
                <td className="py-10 text-text-main max-w-[280px] truncate ltr-text text-[11px]" style={{ direction: "ltr" }}>{h.msg}</td>
                <td className="py-10 text-text-muted">{h.duration}</td>
                <td className="py-10"><span className="px-7 py-2 rounded-5 text-[11px] bg-green-100 text-green-700">✓ حل‌شده</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
