"use client";

import { useState } from "react";
import Link from "next/link";

const LOG = [
  { id: "t01", ts: "۱۴۰۵/۰۳/۰۷ ۱۳:۴۱", tenant: "شرکت نوآوری",   actor: "a.sarkhail",  action: "iaas.vm.create",        resource: "web-prod-04",        result: "success" },
  { id: "t02", ts: "۱۴۰۵/۰۳/۰۷ ۱۳:۲۲", tenant: "سازمان پژوهش",  actor: "f.ahmadi",    action: "iaas.volume.attach",    resource: "data-vol-12",        result: "success" },
  { id: "t03", ts: "۱۴۰۵/۰۳/۰۷ ۱۲:۵۵", tenant: "آژانس آبان",     actor: "m.hosseini",  action: "iam.policy.update",     resource: "fw-prod",            result: "success" },
  { id: "t04", ts: "۱۴۰۵/۰۳/۰۷ ۱۲:۳۰", tenant: "پلتفرم سپهر",   actor: "m.karimi",    action: "k8s.cluster.upgrade",   resource: "prod-main → 1.29",   result: "success" },
  { id: "t05", ts: "۱۴۰۵/۰۳/۰۷ ۱۱:۴۸", tenant: "استارتاپ سما",   actor: "r.mohammadi", action: "iaas.vm.stop",          resource: "staging-03",         result: "success" },
  { id: "t06", ts: "۱۴۰۵/۰۳/۰۷ ۱۱:۱۰", tenant: "شرکت لجستیک",   actor: "h.najafi",    action: "dns.record.create",     resource: "api.rahban.ir A",    result: "success" },
  { id: "t07", ts: "۱۴۰۵/۰۳/۰۷ ۱۰:۳۵", tenant: "فروشگاه بام",    actor: "s.miri",      action: "iaas.snapshot.delete",  resource: "snap-old-0012",      result: "success" },
  { id: "t08", ts: "۱۴۰۵/۰۳/۰۷ ۱۰:۰۰", tenant: "هوش‌مند",        actor: "a.rezaei",    action: "k8s.node.add",          resource: "ml-cluster / node-4","result": "failed" },
];

export default function TenantAuditPage() {
  const [tenantFilter, setTenant] = useState("همه");
  const tenants = ["همه", ...Array.from(new Set(LOG.map((l) => l.tenant)))];
  const filtered = tenantFilter === "همه" ? LOG : LOG.filter((l) => l.tenant === tenantFilter);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">لاگ حسابرسی مستاجران</h1>
            <p className="text-[12px] text-text-muted mt-2">رویدادهای عملیاتی به تفکیک مستاجر</p>
          </div>
          <div className="flex gap-8">
            <Link href="/admin/audit/platform" className="text-[12px] text-brand hover:underline">← لاگ پلتفرم</Link>
            <Link href="/admin/audit/billing"  className="text-[12px] text-brand hover:underline">حسابرسی مالی →</Link>
          </div>
        </div>
      </div>

      <div className="glass rounded-16 p-14 flex flex-wrap gap-8">
        {tenants.map((t) => (
          <button key={t} onClick={() => setTenant(t)}
            className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all ${tenantFilter === t ? "bg-brand text-white" : "border border-border text-text-muted hover:text-text-main"}`}
          >{t}</button>
        ))}
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">زمان</th>
              <th className="text-start py-12 font-medium">مستاجر</th>
              <th className="text-start py-12 font-medium">کاربر</th>
              <th className="text-start py-12 font-medium">عملیات</th>
              <th className="text-start py-12 font-medium">منبع</th>
              <th className="text-start py-12 font-medium">نتیجه</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className={`border-b border-border/50 hover:bg-bg/60 ${l.result === "failed" ? "bg-red-50/30" : ""}`}>
                <td className="px-16 py-10 text-text-muted ltr-text text-[11px]" style={{ direction: "ltr" }}>{l.ts}</td>
                <td className="py-10 text-text-main font-medium">{l.tenant}</td>
                <td className="py-10 font-mono text-[11px] text-text-muted ltr-text" style={{ direction: "ltr" }}>{l.actor}</td>
                <td className="py-10 font-mono text-[11px] text-brand ltr-text" style={{ direction: "ltr" }}>{l.action}</td>
                <td className="py-10 text-text-muted">{l.resource}</td>
                <td className="py-10"><span className={`px-7 py-2 rounded-5 text-[11px] font-medium ${l.result === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{l.result === "success" ? "موفق" : "ناموفق"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
