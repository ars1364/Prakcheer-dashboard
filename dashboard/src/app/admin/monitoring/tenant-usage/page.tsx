"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const TENANT_USAGE = [
  { tenant: "سازمان پژوهش ملی",    cpu: 91, ram: 88, storage: 94, network: 78, spend: 8_500, vms: 87  },
  { tenant: "شرکت لجستیک رهبان",   cpu: 68, ram: 72, storage: 63, network: 55, spend: 5_700, vms: 34  },
  { tenant: "شرکت نوآوری ابری",    cpu: 82, ram: 74, storage: 58, network: 44, spend: 4_200, vms: 42  },
  { tenant: "پلتفرم پرداخت سپهر",  cpu: 74, ram: 69, storage: 47, network: 61, spend: 3_900, vms: 29  },
  { tenant: "استارتاپ هوش‌مند",    cpu: 61, ram: 55, storage: 42, network: 38, spend: 1_800, vms: 18  },
  { tenant: "آژانس دیجیتال آبان",  cpu: 45, ram: 38, storage: 71, network: 22, spend: 2_100, vms: 25  },
  { tenant: "فروشگاه آنلاین بام",   cpu: 35, ram: 41, storage: 55, network: 29, spend: 1_200, vms: 11  },
  { tenant: "کلینیک دیجیتال مهر",  cpu: 22, ram: 28, storage: 31, network: 14, spend: 480,  vms: 9   },
  { tenant: "تیم توسعه سما",       cpu: 28, ram: 33, storage: 24, network: 18, spend: 320,  vms: 7   },
  { tenant: "موسسه آموزشی نور",    cpu: 0,  ram: 0,  storage: 18, network: 0,  spend: 150,  vms: 0   },
];

function UsageBar({ pct }: { pct: number }) {
  const color = pct > 85 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#2554d8";
  return (
    <div className="flex items-center gap-6">
      <div className="flex-1 h-5 rounded-999 bg-border overflow-hidden">
        <div className="h-full rounded-999" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] w-[28px] shrink-0 font-mono" style={{ color }}>{pct}%</span>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: {active?:boolean;payload?:{name:string;value:number;color:string}[];label?:string}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] shadow-lg border border-border">
      <p className="text-text-muted mb-4">{label}</p>
      {payload.map((p) => <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value}%</b></p>)}
    </div>
  );
}

export default function TenantUsagePage() {
  const [sort, setSort] = useState<"cpu" | "ram" | "storage" | "spend">("cpu");

  const sorted = [...TENANT_USAGE].sort((a, b) => b[sort] - a[sort]);
  const chartData = sorted.slice(0, 6).map((t) => ({
    name: t.tenant.slice(0, 8),
    CPU: t.cpu, RAM: t.ram, Storage: t.storage,
  }));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">مصرف مستاجران</h1>
            <p className="text-[12px] text-text-muted mt-2">نمای مصرف منابع به تفکیک هر مستاجر</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل مستاجران",  value: TENANT_USAGE.length,                              color: "#2554d8" },
            { label: "میانگین CPU",  value: `${Math.round(TENANT_USAGE.reduce((a,t)=>a+t.cpu,0)/TENANT_USAGE.length)}%`, color: "#d97706" },
            { label: "بالای ۸۰% CPU", value: TENANT_USAGE.filter((t) => t.cpu > 80).length,  color: "#dc2626" },
            { label: "هزینه کل (K)", value: TENANT_USAGE.reduce((a,t)=>a+t.spend,0).toLocaleString(), color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-20">
        <h2 className="text-[14px] font-semibold text-text-main mb-16">مقایسه مصرف — ۶ مستاجر برتر</h2>
        <div className="ltr-text" style={{ direction: "ltr" }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: "var(--font-vazirmatn)" }} />
              <YAxis tick={{ fontSize: 9 }} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="CPU"     fill="#2554d8" radius={[2,2,0,0]} maxBarSize={20} />
              <Bar dataKey="RAM"     fill="#7c3aed" radius={[2,2,0,0]} maxBarSize={20} />
              <Bar dataKey="Storage" fill="#16a34a" radius={[2,2,0,0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-16 p-16">
        <div className="flex items-center gap-8 mb-14 flex-wrap">
          <span className="text-[12px] text-text-muted">مرتب‌سازی بر اساس:</span>
          {(["cpu", "ram", "storage", "spend"] as const).map((k) => (
            <button key={k} onClick={() => setSort(k)}
              className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all uppercase ${sort === k ? "bg-brand text-white" : "border border-border text-text-muted hover:text-text-main"}`}
            >{k}</button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-start pb-10 font-medium">مستاجر</th>
                <th className="text-start pb-10 font-medium w-[120px]">CPU</th>
                <th className="text-start pb-10 font-medium w-[120px]">RAM</th>
                <th className="text-start pb-10 font-medium w-[120px]">Storage</th>
                <th className="text-start pb-10 font-medium w-[100px]">Network</th>
                <th className="text-start pb-10 font-medium">VM</th>
                <th className="text-start pb-10 font-medium">هزینه (K تومان)</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t.tenant} className="border-b border-border/50 hover:bg-bg/60">
                  <td className="py-10 font-semibold text-text-main">{t.tenant}</td>
                  <td className="py-10 pe-8"><UsageBar pct={t.cpu} /></td>
                  <td className="py-10 pe-8"><UsageBar pct={t.ram} /></td>
                  <td className="py-10 pe-8"><UsageBar pct={t.storage} /></td>
                  <td className="py-10 pe-8"><UsageBar pct={t.network} /></td>
                  <td className="py-10 text-text-muted">{t.vms}</td>
                  <td className="py-10 font-semibold text-text-main">{t.spend.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
