"use client";

import Link from "next/link";

const ROUTES = [
  { network: "production-vpc", destination: "0.0.0.0/0",      nexthop: "185.20.14.1",  type: "internet-gateway", desc: "مسیر پیش‌فرض اینترنت" },
  { network: "production-vpc", destination: "10.0.0.0/16",    nexthop: "local",         type: "local",            desc: "مسیر محلی VPC"         },
  { network: "production-vpc", destination: "10.2.0.0/24",    nexthop: "10.0.0.1",     type: "peering",          desc: "peering به ml-private"  },
  { network: "production-vpc", destination: "192.168.1.0/24", nexthop: "vpn-gateway",  type: "vpn",              desc: "مسیر VPN به دفتر"      },
  { network: "staging-vpc",    destination: "0.0.0.0/0",      nexthop: "185.20.14.2",  type: "internet-gateway", desc: "مسیر پیش‌فرض staging"  },
  { network: "staging-vpc",    destination: "10.1.0.0/16",    nexthop: "local",         type: "local",            desc: "مسیر محلی staging VPC" },
  { network: "dev-network",    destination: "0.0.0.0/0",      nexthop: "185.20.14.3",  type: "internet-gateway", desc: "مسیر پیش‌فرض dev"      },
];

const TYPE_COLOR: Record<string, string> = {
  "internet-gateway": "#16a34a", local: "#2554d8", peering: "#7c3aed", vpn: "#d97706", nat: "#0891b2",
};

export default function VPCRoutingPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">جدول مسیریابی</h1>
            <p className="text-[12px] text-text-muted mt-2">Route table‌های VPC</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ مسیر جدید</button>
            <Link href="/vpc/networks" className="text-[12px] text-text-muted hover:text-brand">← شبکه‌ها</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل مسیر",   value: ROUTES.length,                                                            color: "#2554d8" },
            { label: "internet",  value: ROUTES.filter((r) => r.type === "internet-gateway").length,              color: "#16a34a" },
            { label: "peering",   value: ROUTES.filter((r) => r.type === "peering").length,                       color: "#7c3aed" },
            { label: "VPN",       value: ROUTES.filter((r) => r.type === "vpn").length,                           color: "#d97706" },
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
              <th className="text-start px-16 py-12 font-medium">شبکه</th>
              <th className="text-start py-12 font-medium">مقصد</th>
              <th className="text-start py-12 font-medium">next hop</th>
              <th className="text-start py-12 font-medium">نوع</th>
              <th className="text-start py-12 font-medium">توضیح</th>
            </tr>
          </thead>
          <tbody>
            {ROUTES.map((r, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-10 font-mono text-[10px] text-brand">{r.network}</td>
                <td className="py-10 font-mono text-[11px] ltr-text font-semibold text-text-main" style={{ direction: "ltr" }}>{r.destination}</td>
                <td className="py-10 font-mono text-[11px] ltr-text text-text-muted" style={{ direction: "ltr" }}>{r.nexthop}</td>
                <td className="py-10">
                  <span className="px-7 py-2 rounded-4 text-[10px]" style={{ background: `${TYPE_COLOR[r.type]}15`, color: TYPE_COLOR[r.type] }}>{r.type}</span>
                </td>
                <td className="py-10 pe-12 text-text-muted">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
