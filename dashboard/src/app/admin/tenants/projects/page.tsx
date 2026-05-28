"use client";

import Link from "next/link";

const PROJECTS = [
  { id: "pr01", name: "production",       tenant: "شرکت نوآوری",   region: "تهران-۱",   vms: 12, status: "active",   created: "۱۴۰۲/۰۳" },
  { id: "pr02", name: "staging",          tenant: "شرکت نوآوری",   region: "تهران-۱",   vms: 4,  status: "active",   created: "۱۴۰۲/۰۳" },
  { id: "pr03", name: "ml-training",      tenant: "استارتاپ هوش‌مند",region: "تهران-۱", vms: 6,  status: "active",   created: "۱۴۰۳/۰۶" },
  { id: "pr04", name: "research-main",    tenant: "سازمان پژوهش",   region: "تهران-۱",   vms: 28, status: "active",   created: "۱۴۰۱/۱۱" },
  { id: "pr05", name: "data-archive",     tenant: "سازمان پژوهش",   region: "مشهد-۱",    vms: 3,  status: "active",   created: "۱۴۰۳/۰۲" },
  { id: "pr06", name: "ecommerce-prod",   tenant: "فروشگاه بام",    region: "اصفهان-۱",  vms: 5,  status: "active",   created: "۱۴۰۳/۰۸" },
  { id: "pr07", name: "temp-migration",   tenant: "شرکت لجستیک",   region: "تهران-۱",   vms: 0,  status: "inactive", created: "۱۴۰۴/۱۲" },
];

export default function TenantProjectsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[18px] font-bold text-text-main">پروژه‌های مستاجران</h1>
          <Link href="/admin/tenants" className="text-[12px] text-text-muted hover:text-brand">← مستاجران</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          {[
            { label: "کل پروژه‌ها",  value: PROJECTS.length,                                         color: "#2554d8" },
            { label: "فعال",          value: PROJECTS.filter((p) => p.status === "active").length,    color: "#16a34a" },
            { label: "کل VM",         value: PROJECTS.reduce((a, p) => a + p.vms, 0),                color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">پروژه</th>
              <th className="text-start py-12 font-medium">مستاجر</th>
              <th className="text-start py-12 font-medium">منطقه</th>
              <th className="text-start py-12 font-medium">VM</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">ایجاد</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono text-[11px] font-semibold text-text-main">{p.name}</td>
                <td className="py-11 text-text-muted">{p.tenant}</td>
                <td className="py-11 text-text-muted">{p.region}</td>
                <td className="py-11 font-semibold text-text-main">{p.vms}</td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {p.status === "active" ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="py-11 text-text-muted">{p.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
