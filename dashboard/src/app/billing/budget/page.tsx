"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BUDGETS = [
  { name: "کل ماهانه",       limit: 3500000, spent: 2840000, category: "total"   },
  { name: "Compute (VM+K8s)", limit: 2000000, spent: 1720000, category: "compute" },
  { name: "Storage",          limit: 500000,  spent: 380000,  category: "storage" },
  { name: "Network",          limit: 300000,  spent: 210000,  category: "network" },
  { name: "Database",         limit: 400000,  spent: 320000,  category: "database"},
  { name: "پشتیبان‌گیری",    limit: 200000,  spent: 110000,  category: "backup"  },
];

const MONTHLY = [
  { month: "شهریور", spent: 1800000, budget: 3000000 },
  { month: "مهر",    spent: 2100000, budget: 3000000 },
  { month: "آبان",   spent: 2200000, budget: 3200000 },
  { month: "آذر",    spent: 1980000, budget: 3200000 },
  { month: "دی",     spent: 2100000, budget: 3500000 },
  { month: "بهمن",   spent: 2200000, budget: 3500000 },
  { month: "اسفند",  spent: 2400000, budget: 3500000 },
  { month: "فروردین",spent: 2640000, budget: 3500000 },
  { month: "اردیبهشت",spent:2840000,budget: 3500000 },
];

const CAT_COLOR: Record<string, string> = {
  total: "#2554d8", compute: "#7c3aed", storage: "#16a34a",
  network: "#0891b2", database: "#d97706", backup: "#64748b",
};

function BudgetBar({ spent, limit, color }: { spent: number; limit: number; color: string }) {
  const pct   = Math.min(Math.round((spent / limit) * 100), 100);
  const warn  = pct >= 90 ? "#dc2626" : pct >= 75 ? "#d97706" : color;
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-2">
        <span className="text-text-muted">{(spent / 10).toLocaleString()} / {(limit / 10).toLocaleString()} تومان</span>
        <span style={{ color: warn }} className="font-bold">{pct}٪</span>
      </div>
      <div className="h-6 rounded-full bg-bg overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: warn }} />
      </div>
    </div>
  );
}

export default function BudgetPage() {
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">مدیریت بودجه</h1>
            <p className="text-[12px] text-text-muted mt-2">کنترل هزینه و تعیین سقف مصرف</p>
          </div>
          <Link href="/billing" className="text-[12px] text-text-muted hover:text-brand">← صورتحساب</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "مصرف این ماه",  value: "۲,۸۴۰,۰۰۰ ت", color: "#2554d8" },
            { label: "بودجه ماهانه",  value: "۳,۵۰۰,۰۰۰ ت", color: "#64748b" },
            { label: "درصد مصرف",     value: "81٪",          color: "#d97706" },
            { label: "باقی‌مانده",    value: "۶۶۰,۰۰۰ ت",   color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[18px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-20">
        <h2 className="text-[13px] font-bold text-text-main mb-14">مصرف در برابر بودجه (ریال)</h2>
        <div className="ltr-text h-[180px]" style={{ direction: "ltr" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MONTHLY} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="spentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2554d8" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#2554d8" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748b" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#64748b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)", fill: "var(--color-text-muted)" }} />
              <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)", fill: "var(--color-text-muted)" }} tickFormatter={(v) => (v / 1000000).toFixed(1) + "M"} />
              <Tooltip contentStyle={{ background: "var(--color-glass)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => (v / 10).toLocaleString() + " تومان"} />
              <Bar dataKey="budget" name="بودجه" fill="url(#budgetGrad)" radius={[3,3,0,0]} />
              <Bar dataKey="spent"  name="مصرف"  fill="url(#spentGrad)"  radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {BUDGETS.map((b) => (
          <div key={b.name} className="glass rounded-14 p-16 border border-border">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-10">
                <div className="w-8 h-8 rounded-2" style={{ background: CAT_COLOR[b.category] }} />
                <p className="text-[13px] font-semibold text-text-main">{b.name}</p>
              </div>
              <button onClick={() => setEditing(editing === b.name ? null : b.name)}
                className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">
                {editing === b.name ? "ذخیره" : "ویرایش سقف"}
              </button>
            </div>
            {editing === b.name
              ? <input type="number" defaultValue={b.limit / 10} className="w-full px-12 py-8 rounded-8 border border-brand bg-bg text-[12px] outline-none mb-6" />
              : <BudgetBar spent={b.spent} limit={b.limit} color={CAT_COLOR[b.category]} />
            }
          </div>
        ))}
      </div>
    </div>
  );
}
