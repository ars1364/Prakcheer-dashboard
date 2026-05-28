"use client";

import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const REGION_CHECKS = [
  { region: "تهران-۱",  service: "Nova API",     status: "pass", latency: 12 },
  { region: "تهران-۱",  service: "Neutron API",  status: "pass", latency: 18 },
  { region: "تهران-۱",  service: "Cinder API",   status: "pass", latency: 22 },
  { region: "تهران-۱",  service: "Keystone",     status: "pass", latency: 8  },
  { region: "تهران-۱",  service: "Glance",       status: "pass", latency: 25 },
  { region: "اصفهان-۱", service: "Nova API",     status: "pass", latency: 31 },
  { region: "اصفهان-۱", service: "Neutron API",  status: "warn", latency: 145 },
  { region: "اصفهان-۱", service: "Cinder API",   status: "fail", latency: 0  },
  { region: "اصفهان-۱", service: "Keystone",     status: "pass", latency: 28 },
  { region: "مشهد-۱",   service: "Nova API",     status: "pass", latency: 22 },
  { region: "مشهد-۱",   service: "Neutron API",  status: "pass", latency: 30 },
  { region: "مشهد-۱",   service: "Cinder API",   status: "pass", latency: 35 },
  { region: "مشهد-۱",   service: "Keystone",     status: "pass", latency: 18 },
];

const UPTIME_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  "تهران-۱":  99.9 + Math.random() * 0.1,
  "اصفهان-۱": 99.5 + Math.random() * 0.4,
  "مشهد-۱":   99.7 + Math.random() * 0.3,
}));

function ChartTooltip({ active, payload, label }: {active?:boolean;payload?:{name:string;value:number;color:string}[];label?:string}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] border border-border">
      <p className="text-text-muted mb-4">روز {label}</p>
      {payload.map((p) => <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value.toFixed(2)}%</b></p>)}
    </div>
  );
}

export default function RegionHealthPage() {
  const regions = ["تهران-۱", "اصفهان-۱", "مشهد-۱"];
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[18px] font-bold text-text-main">سلامت مناطق</h1>
          <div className="flex gap-8">
            <Link href="/admin/regions"          className="text-[12px] text-text-muted hover:text-brand">← مناطق</Link>
            <Link href="/admin/regions/capacity" className="text-[12px] text-brand hover:underline">ظرفیت →</Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-12">
          {regions.map((r) => {
            const checks  = REGION_CHECKS.filter((c) => c.region === r);
            const passing = checks.filter((c) => c.status === "pass").length;
            return (
              <div key={r} className="glass rounded-12 p-14">
                <p className="text-[12px] font-bold text-text-main mb-4">{r}</p>
                <p className="text-[20px] font-bold" style={{ color: passing === checks.length ? "#16a34a" : "#d97706" }}>
                  {passing}/{checks.length}
                </p>
                <p className="text-[10px] text-text-muted mt-2">بررسی موفق</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-16 p-20">
        <h2 className="text-[14px] font-semibold text-text-main mb-16">آپتایم ۳۰ روزه</h2>
        <div className="ltr-text" style={{ direction: "ltr" }}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={UPTIME_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={4} />
              <YAxis domain={[99, 100]} tick={{ fontSize: 9 }} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="تهران-۱"  stroke="#2554d8" fill="none" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="اصفهان-۱" stroke="#d97706" fill="none" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="مشهد-۱"   stroke="#16a34a" fill="none" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">منطقه</th>
              <th className="text-start py-12 font-medium">سرویس</th>
              <th className="text-start py-12 font-medium">نتیجه</th>
              <th className="text-start py-12 font-medium">تأخیر</th>
            </tr>
          </thead>
          <tbody>
            {REGION_CHECKS.map((c, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-10 text-text-muted">{c.region}</td>
                <td className="py-10 text-text-main">{c.service}</td>
                <td className="py-10">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${c.status === "pass" ? "bg-green-100 text-green-700" : c.status === "warn" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                    {c.status === "pass" ? "موفق" : c.status === "warn" ? "هشدار" : "ناموفق"}
                  </span>
                </td>
                <td className={`py-10 ltr-text font-mono text-[11px] ${c.latency === 0 ? "text-red-600" : c.latency > 100 ? "text-amber-600" : "text-text-muted"}`} style={{ direction: "ltr" }}>
                  {c.latency === 0 ? "timeout" : `${c.latency}ms`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
