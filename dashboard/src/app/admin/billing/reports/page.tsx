"use client";

import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTHLY = [
  { month: "مهر",   revenue: 18_200, cost: 12_400 },
  { month: "آبان",  revenue: 21_500, cost: 14_100 },
  { month: "آذر",   revenue: 24_800, cost: 15_900 },
  { month: "دی",    revenue: 23_100, cost: 15_200 },
  { month: "بهمن",  revenue: 26_400, cost: 17_000 },
  { month: "اسفند", revenue: 31_200, cost: 19_800 },
  { month: "فروردین",revenue: 28_900, cost: 18_400 },
  { month: "اردیبهشت",revenue: 33_600, cost: 21_200 },
];

const TENANT_REVENUE = [
  { tenant: "سازمان پژوهش",  revenue: 8_500 },
  { tenant: "شرکت لجستیک",  revenue: 5_700 },
  { tenant: "شرکت نوآوری",   revenue: 4_200 },
  { tenant: "پلتفرم سپهر",  revenue: 3_900 },
  { tenant: "آژانس آبان",    revenue: 2_100 },
];

function ChartTooltip({ active, payload, label }: {active?:boolean;payload?:{name:string;value:number;color:string}[];label?:string}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] border border-border">
      <p className="text-text-muted mb-4">{label}</p>
      {payload.map((p) => <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value.toLocaleString()}K</b></p>)}
    </div>
  );
}

export default function BillingReportsPage() {
  const totalRevenue = MONTHLY.reduce((a, m) => a + m.revenue, 0);
  const totalCost    = MONTHLY.reduce((a, m) => a + m.cost, 0);
  const margin       = Math.round(((totalRevenue - totalCost) / totalRevenue) * 100);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">گزارش‌های مالی ادمین</h1>
            <p className="text-[12px] text-text-muted mt-2">درآمد، هزینه و حاشیه سود پلتفرم</p>
          </div>
          <div className="flex gap-8">
            <Link href="/admin/billing/rates" className="text-[12px] text-brand hover:underline">← نرخ‌نامه</Link>
            <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← ادمین</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "درآمد کل (K)",   value: totalRevenue.toLocaleString(),      color: "#16a34a" },
            { label: "هزینه کل (K)",   value: totalCost.toLocaleString(),         color: "#dc2626" },
            { label: "سود خالص (K)",   value: (totalRevenue-totalCost).toLocaleString(), color: "#2554d8" },
            { label: "حاشیه سود",      value: `${margin}%`,                       color: margin > 30 ? "#16a34a" : "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-20">
        <h2 className="text-[14px] font-semibold text-text-main mb-16">درآمد vs هزینه — ۸ ماه</h2>
        <div className="ltr-text" style={{ direction: "ltr" }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.55} />
                </linearGradient>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.55} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="revenue" name="درآمد" fill="url(#barGrad1)" radius={[2,2,0,0]} maxBarSize={28} />
              <Bar dataKey="cost"    name="هزینه" fill="url(#barGrad2)" radius={[2,2,0,0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-16 p-20">
        <h2 className="text-[14px] font-semibold text-text-main mb-14">درآمد به تفکیک مستاجر (K تومان)</h2>
        <div className="flex flex-col gap-8">
          {TENANT_REVENUE.map((t) => {
            const maxRev = TENANT_REVENUE[0].revenue;
            return (
              <div key={t.tenant} className="flex items-center gap-12">
                <p className="text-[12px] text-text-muted w-[120px] shrink-0">{t.tenant}</p>
                <div className="flex-1 h-8 rounded-999 bg-border overflow-hidden">
                  <div className="h-full rounded-999 bg-brand" style={{ width: `${(t.revenue / maxRev) * 100}%` }} />
                </div>
                <span className="text-[12px] font-semibold text-text-main w-[60px] text-end shrink-0">{t.revenue.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
