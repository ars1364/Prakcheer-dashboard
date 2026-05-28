"use client";

import Link from "next/link";

const SUBNETS = [
  { id: "sn01", network: "production-vpc", name: "prod-public-1a",   cidr: "10.0.1.0/24",  type: "public",  zone: "1a", ips: { used: 18, total: 254 }, created: "۱۴۰۲/۰۳" },
  { id: "sn02", network: "production-vpc", name: "prod-private-1a",  cidr: "10.0.2.0/24",  type: "private", zone: "1a", ips: { used: 35, total: 254 }, created: "۱۴۰۲/۰۳" },
  { id: "sn03", network: "production-vpc", name: "prod-db-1a",       cidr: "10.0.3.0/28",  type: "private", zone: "1a", ips: { used: 4,  total: 14  }, created: "۱۴۰۲/۰۳" },
  { id: "sn04", network: "staging-vpc",    name: "staging-public",   cidr: "10.1.1.0/24",  type: "public",  zone: "1a", ips: { used: 5,  total: 254 }, created: "۱۴۰۲/۰۶" },
  { id: "sn05", network: "staging-vpc",    name: "staging-private",  cidr: "10.1.2.0/24",  type: "private", zone: "1a", ips: { used: 6,  total: 254 }, created: "۱۴۰۲/۰۶" },
  { id: "sn06", network: "dev-network",    name: "dev-default",      cidr: "192.168.0.0/24",type: "public",  zone: "1a", ips: { used: 2,  total: 254 }, created: "۱۴۰۳/۰۱" },
];

export default function VPCSubnetsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Subnet‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">زیرشبکه‌های VPC</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ subnet جدید</button>
            <Link href="/vpc/networks" className="text-[12px] text-text-muted hover:text-brand">← شبکه‌ها</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",         value: SUBNETS.length,                                          color: "#2554d8" },
            { label: "عمومی",      value: SUBNETS.filter((s) => s.type === "public").length,       color: "#16a34a" },
            { label: "خصوصی",      value: SUBNETS.filter((s) => s.type === "private").length,      color: "#7c3aed" },
            { label: "IP استفاده", value: SUBNETS.reduce((a, s) => a + s.ips.used, 0),            color: "#d97706" },
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
              <th className="text-start px-16 py-12 font-medium">نام</th>
              <th className="text-start py-12 font-medium">شبکه</th>
              <th className="text-start py-12 font-medium">CIDR</th>
              <th className="text-start py-12 font-medium">نوع</th>
              <th className="text-start py-12 font-medium">IP استفاده‌شده</th>
              <th className="text-start py-12 font-medium">ایجاد</th>
            </tr>
          </thead>
          <tbody>
            {SUBNETS.map((s) => {
              const pct = Math.round((s.ips.used / s.ips.total) * 100);
              return (
                <tr key={s.id} className="border-b border-border/50 hover:bg-bg/60">
                  <td className="px-16 py-11 font-mono text-[11px] font-semibold text-text-main">{s.name}</td>
                  <td className="py-11 font-mono text-[10px] text-brand">{s.network}</td>
                  <td className="py-11 font-mono text-[11px] ltr-text text-text-muted" style={{ direction: "ltr" }}>{s.cidr}</td>
                  <td className="py-11">
                    <span className={`px-7 py-2 rounded-5 text-[10px] ${s.type === "public" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                      {s.type === "public" ? "عمومی" : "خصوصی"}
                    </span>
                  </td>
                  <td className="py-11">
                    <div className="flex items-center gap-8">
                      <div className="w-[80px] h-3 rounded-full bg-bg overflow-hidden">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-text-muted">{s.ips.used}/{s.ips.total}</span>
                    </div>
                  </td>
                  <td className="py-11 pe-12 text-text-muted">{s.created}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
