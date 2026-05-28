"use client";

import Link from "next/link";

const PEERINGS = [
  { id: "peer01", name: "prod-to-ml",        localNet: "production-vpc", remoteNet: "ml-private",   status: "active",  created: "۱۴۰۴/۰۶" },
  { id: "peer02", name: "prod-to-staging",   localNet: "production-vpc", remoteNet: "staging-vpc",  status: "active",  created: "۱۴۰۳/۰۱" },
  { id: "peer03", name: "staging-to-dev",    localNet: "staging-vpc",    remoteNet: "dev-network",  status: "pending", created: "۱۴۰۵/۰۲" },
];

export default function VPCPeeringPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">VPC Peering</h1>
            <p className="text-[12px] text-text-muted mt-2">اتصال مستقیم بین شبکه‌های VPC</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ peering جدید</button>
            <Link href="/vpc/networks" className="text-[12px] text-text-muted hover:text-brand">← شبکه‌ها</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          {[
            { label: "کل peering",    value: PEERINGS.length,                                           color: "#2554d8" },
            { label: "فعال",          value: PEERINGS.filter((p) => p.status === "active").length,      color: "#16a34a" },
            { label: "در انتظار",     value: PEERINGS.filter((p) => p.status === "pending").length,     color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {PEERINGS.map((p) => (
          <div key={p.id} className="glass rounded-14 p-18 border border-border">
            <div className="flex items-center gap-12">
              <div className="flex-1">
                <p className="text-[13px] font-bold font-mono text-text-main mb-8">{p.name}</p>
                <div className="flex items-center gap-12 text-[12px]">
                  <div className="glass rounded-8 px-12 py-6 font-mono text-brand">{p.localNet}</div>
                  <span className="text-text-muted">⟷</span>
                  <div className="glass rounded-8 px-12 py-6 font-mono text-brand">{p.remoteNet}</div>
                </div>
                <p className="text-[11px] text-text-muted mt-8">ایجاد: {p.created}</p>
              </div>
              <div className="flex items-center gap-8 shrink-0">
                <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {p.status === "active" ? "فعال" : "در انتظار"}
                </span>
                <button className="px-10 py-5 rounded-6 border border-red-200 text-red-500 text-[11px] hover:bg-red-50">حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
