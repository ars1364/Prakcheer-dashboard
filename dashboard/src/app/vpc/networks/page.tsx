"use client";

import Link from "next/link";

const NETWORKS = [
  { id: "n01", name: "production-vpc",  cidr: "10.0.0.0/16",  subnets: 3, instances: 12, status: "active", region: "تهران-۱", created: "۱۴۰۲/۰۳" },
  { id: "n02", name: "staging-vpc",     cidr: "10.1.0.0/16",  subnets: 2, instances: 4,  status: "active", region: "تهران-۱", created: "۱۴۰۲/۰۶" },
  { id: "n03", name: "dev-network",     cidr: "192.168.0.0/24",subnets: 1, instances: 2,  status: "active", region: "تهران-۱", created: "۱۴۰۳/۰۱" },
  { id: "n04", name: "ml-private",      cidr: "10.2.0.0/24",  subnets: 1, instances: 6,  status: "active", region: "تهران-۱", created: "۱۴۰۴/۰۶" },
  { id: "n05", name: "mashhad-vpc",     cidr: "10.3.0.0/16",  subnets: 1, instances: 3,  status: "active", region: "مشهد-۱",  created: "۱۴۰۴/۱۰" },
];

export default function VPCNetworksPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">شبکه‌های VPC</h1>
            <p className="text-[12px] text-text-muted mt-2">شبکه‌های مجازی خصوصی</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ شبکه جدید</button>
            <Link href="/vpc" className="text-[12px] text-text-muted hover:text-brand">← VPC</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "شبکه",     value: NETWORKS.length,                                                  color: "#2554d8" },
            { label: "کل subnet",value: NETWORKS.reduce((a, n) => a + n.subnets, 0),                    color: "#7c3aed" },
            { label: "کل VM",    value: NETWORKS.reduce((a, n) => a + n.instances, 0),                  color: "#16a34a" },
            { label: "منطقه",    value: new Set(NETWORKS.map((n) => n.region)).size,                    color: "#d97706" },
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
              <th className="text-start py-12 font-medium">CIDR</th>
              <th className="text-start py-12 font-medium">منطقه</th>
              <th className="text-start py-12 font-medium">Subnet</th>
              <th className="text-start py-12 font-medium">VM</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">ایجاد</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {NETWORKS.map((n) => (
              <tr key={n.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono text-[11px] font-semibold text-brand">{n.name}</td>
                <td className="py-11 font-mono text-[11px] ltr-text text-text-muted" style={{ direction: "ltr" }}>{n.cidr}</td>
                <td className="py-11 text-text-muted">{n.region}</td>
                <td className="py-11 font-semibold text-text-main">{n.subnets}</td>
                <td className="py-11 font-semibold text-text-main">{n.instances}</td>
                <td className="py-11">
                  <span className="px-7 py-2 rounded-5 bg-green-100 text-green-700 text-[10px]">فعال</span>
                </td>
                <td className="py-11 text-text-muted">{n.created}</td>
                <td className="py-11 pe-12">
                  <Link href="/vpc/subnets" className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">subnet‌ها</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
