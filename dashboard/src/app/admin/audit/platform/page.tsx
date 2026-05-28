"use client";

import { useState } from "react";
import Link from "next/link";

const LOG = [
  { id: "l01", ts: "۱۴۰۵/۰۳/۰۷ ۱۳:۴۵", actor: "a.sarkhail",  tenant: "—",         action: "admin.user.create",      resource: "user: m.hosseini",        result: "success", ip: "185.94.97.211" },
  { id: "l02", ts: "۱۴۰۵/۰۳/۰۷ ۱۳:۲۲", actor: "system",      tenant: "—",         action: "admin.quota.approve",    resource: "tenant: استارتاپ هوش‌مند",result: "success", ip: "127.0.0.1"     },
  { id: "l03", ts: "۱۴۰۵/۰۳/۰۷ ۱۲:۵۵", actor: "a.sarkhail",  tenant: "—",         action: "admin.maintenance.set",  resource: "compute-04.teh1",          result: "success", ip: "185.94.97.211" },
  { id: "l04", ts: "۱۴۰۵/۰۳/۰۷ ۱۲:۱۰", actor: "h.najafi",    tenant: "رهبان",     action: "iaas.vm.delete",         resource: "srv-staging-02",           result: "success", ip: "5.63.14.88"    },
  { id: "l05", ts: "۱۴۰۵/۰۳/۰۷ ۱۱:۳۰", actor: "unknown",     tenant: "—",         action: "auth.login.failed",      resource: "user: admin",              result: "failed",  ip: "91.211.44.12"  },
  { id: "l06", ts: "۱۴۰۵/۰۳/۰۷ ۱۰:۵۵", actor: "a.sarkhail",  tenant: "—",         action: "admin.role.assign",      resource: "user: z.karim → viewer",   result: "success", ip: "185.94.97.211" },
  { id: "l07", ts: "۱۴۰۵/۰۳/۰۷ ۱۰:۲۰", actor: "m.hosseini",  tenant: "آبان",      action: "iaas.network.create",    resource: "net-production-02",        result: "success", ip: "10.20.5.44"    },
  { id: "l08", ts: "۱۴۰۵/۰۳/۰۷ ۰۹:۴۵", actor: "system",      tenant: "—",         action: "billing.invoice.generate","resource": "all tenants / ماه ۱۴۰۵/۰۲", result: "success", ip: "127.0.0.1" },
];

const RESULT_STYLE: Record<string, string> = { success: "bg-green-100 text-green-700", failed: "bg-red-100 text-red-700" };

export default function PlatformAuditPage() {
  const [search, setSearch] = useState("");
  const filtered = LOG.filter((l) => !search || l.action.includes(search) || l.actor.includes(search) || l.resource.includes(search));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">لاگ حسابرسی پلتفرم</h1>
            <p className="text-[12px] text-text-muted mt-2">رویدادهای حساس و تغییرات ادمین‌های پلتفرم</p>
          </div>
          <div className="flex gap-8">
            <Link href="/admin/audit/tenant"  className="text-[12px] text-brand hover:underline">لاگ مستاجران →</Link>
            <Link href="/admin/audit/billing" className="text-[12px] text-brand hover:underline">حسابرسی مالی →</Link>
            <Link href="/admin"               className="text-[12px] text-text-muted hover:text-brand">← ادمین</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل رویداد", value: LOG.length,                                 color: "#2554d8" },
            { label: "ناموفق",    value: LOG.filter((l) => l.result === "failed").length, color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14">
        <input type="text" placeholder="جستجو در رویدادها..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full px-12 py-8 rounded-8 border border-border bg-bg text-[13px] outline-none focus:border-brand" />
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">زمان</th>
              <th className="text-start py-12 font-medium">کاربر</th>
              <th className="text-start py-12 font-medium">عملیات</th>
              <th className="text-start py-12 font-medium">منبع</th>
              <th className="text-start py-12 font-medium">نتیجه</th>
              <th className="text-start py-12 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className={`border-b border-border/50 hover:bg-bg/60 ${l.result === "failed" ? "bg-red-50/30" : ""}`}>
                <td className="px-16 py-10 text-text-muted ltr-text text-[11px]" style={{ direction: "ltr" }}>{l.ts}</td>
                <td className="py-10 font-mono text-[11px] text-text-main ltr-text" style={{ direction: "ltr" }}>{l.actor}</td>
                <td className="py-10 font-mono text-[11px] text-brand ltr-text" style={{ direction: "ltr" }}>{l.action}</td>
                <td className="py-10 text-text-muted max-w-[200px] truncate">{l.resource}</td>
                <td className="py-10"><span className={`px-7 py-2 rounded-5 text-[11px] font-medium ${RESULT_STYLE[l.result]}`}>{l.result === "success" ? "موفق" : "ناموفق"}</span></td>
                <td className="py-10 text-text-muted font-mono ltr-text text-[10px]" style={{ direction: "ltr" }}>{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
