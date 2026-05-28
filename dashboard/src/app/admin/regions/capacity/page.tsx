"use client";

import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CAPACITY = [
  { region: "تهران-۱",   cpuTotal: 320, cpuUsed: 196, ramTotal: 1280, ramUsed: 779, storageTotal: 20000, storageUsed: 14200, ipsTotal: 256, ipsUsed: 182 },
  { region: "اصفهان-۱",  cpuTotal: 128, cpuUsed: 99,  ramTotal: 512,  ramUsed: 352, storageTotal: 10000, storageUsed: 5800,  ipsTotal: 128, ipsUsed: 84  },
  { region: "مشهد-۱",    cpuTotal: 64,  cpuUsed: 18,  ramTotal: 256,  ramUsed: 72,  storageTotal: 5000,  storageUsed: 2100,  ipsTotal: 64,  ipsUsed: 22  },
];

const CHART_DATA = CAPACITY.map((r) => ({
  name: r.region,
  CPU:  Math.round((r.cpuUsed / r.cpuTotal) * 100),
  RAM:  Math.round((r.ramUsed / r.ramTotal) * 100),
  Storage: Math.round((r.storageUsed / r.storageTotal) * 100),
}));

function Gauge({ pct, label }: { pct: number; label: string }) {
  const color = pct > 80 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#2554d8";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between text-[11px]">
        <span className="text-text-muted">{label}</span>
        <span className="font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-8 rounded-999 bg-border overflow-hidden">
        <div className="h-full rounded-999 transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: {active?:boolean;payload?:{name:string;value:number;color:string}[];label?:string}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] border border-border">
      <p className="text-text-muted mb-4">{label}</p>
      {payload.map((p) => <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value}%</b></p>)}
    </div>
  );
}

export default function RegionCapacityPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[18px] font-bold text-text-main">ظرفیت مناطق</h1>
          <Link href="/admin/regions" className="text-[12px] text-text-muted hover:text-brand">← مناطق</Link>
        </div>
        <div className="glass rounded-16 p-20 mb-16">
          <h2 className="text-[13px] font-semibold text-text-main mb-12">مقایسه مصرف</h2>
          <div className="ltr-text" style={{ direction: "ltr" }}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={CHART_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 9 }} unit="%" />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="CPU"     fill="#2554d8" radius={[2,2,0,0]} maxBarSize={22} />
                <Bar dataKey="RAM"     fill="#7c3aed" radius={[2,2,0,0]} maxBarSize={22} />
                <Bar dataKey="Storage" fill="#16a34a" radius={[2,2,0,0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
        {CAPACITY.map((r) => (
          <div key={r.region} className="glass rounded-16 p-20">
            <p className="text-[14px] font-bold text-text-main mb-14">{r.region}</p>
            <div className="flex flex-col gap-10">
              <Gauge pct={Math.round((r.cpuUsed / r.cpuTotal) * 100)}     label={`CPU: ${r.cpuUsed}/${r.cpuTotal} cores`} />
              <Gauge pct={Math.round((r.ramUsed / r.ramTotal) * 100)}     label={`RAM: ${r.ramUsed}/${r.ramTotal} GB`} />
              <Gauge pct={Math.round((r.storageUsed / r.storageTotal) * 100)} label={`Storage: ${(r.storageUsed/1000).toFixed(1)}/${r.storageTotal/1000} TB`} />
              <Gauge pct={Math.round((r.ipsUsed / r.ipsTotal) * 100)}     label={`Floating IPs: ${r.ipsUsed}/${r.ipsTotal}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
