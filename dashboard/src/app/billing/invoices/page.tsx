"use client";

import { useState } from "react";
import Link from "next/link";

interface Invoice {
  id:      string;
  period:  string;
  amount:  number;
  status:  "paid" | "unpaid" | "overdue" | "draft";
  issued:  string;
  due:     string;
  items:   number;
}

const INVOICES: Invoice[] = [
  { id: "inv-2405-0014", period: "اردیبهشت ۱۴۰۵", amount: 2840000, status: "paid",    issued: "۱۴۰۵/۰۲/۰۱", due: "۱۴۰۵/۰۲/۱۵", items: 12 },
  { id: "inv-2404-0013", period: "فروردین ۱۴۰۵",  amount: 2640000, status: "paid",    issued: "۱۴۰۵/۰۱/۰۱", due: "۱۴۰۵/۰۱/۱۵", items: 11 },
  { id: "inv-2403-0012", period: "اسفند ۱۴۰۴",    amount: 2400000, status: "paid",    issued: "۱۴۰۴/۱۲/۰۱", due: "۱۴۰۴/۱۲/۱۵", items: 10 },
  { id: "inv-2402-0011", period: "بهمن ۱۴۰۴",     amount: 2200000, status: "paid",    issued: "۱۴۰۴/۱۱/۰۱", due: "۱۴۰۴/۱۱/۱۵", items: 9  },
  { id: "inv-2401-0010", period: "دی ۱۴۰۴",       amount: 2100000, status: "paid",    issued: "۱۴۰۴/۱۰/۰۱", due: "۱۴۰۴/۱۰/۱۵", items: 9  },
  { id: "inv-2312-0009", period: "آذر ۱۴۰۴",      amount: 1980000, status: "paid",    issued: "۱۴۰۴/۰۹/۰۱", due: "۱۴۰۴/۰۹/۱۵", items: 8  },
];

const STATUS_STYLE: Record<string, string> = {
  paid:    "bg-green-100 text-green-700",
  unpaid:  "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
  draft:   "bg-slate-100 text-slate-600",
};

const STATUS_LABEL: Record<string, string> = { paid: "پرداخت شده", unpaid: "در انتظار", overdue: "معوقه", draft: "پیش‌نویس" };

export default function InvoicesPage() {
  const [filter, setFilter] = useState("همه");
  const filtered = filter === "همه" ? INVOICES : INVOICES.filter((i) => i.status === filter);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">فاکتورها</h1>
            <p className="text-[12px] text-text-muted mt-2">تاریخچه صورتحساب‌های ماهانه</p>
          </div>
          <Link href="/billing" className="text-[12px] text-text-muted hover:text-brand">← صورتحساب</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل فاکتور",     value: INVOICES.length,                                          color: "#2554d8" },
            { label: "پرداخت شده",    value: INVOICES.filter((i) => i.status === "paid").length,       color: "#16a34a" },
            { label: "در انتظار",     value: INVOICES.filter((i) => i.status === "unpaid").length,     color: "#d97706" },
            { label: "مجموع (ریال)",  value: (INVOICES.reduce((a, i) => a + i.amount, 0) / 1000000).toFixed(1) + "M", color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {["همه", "paid", "unpaid", "overdue"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all ${filter === s ? "bg-brand text-white" : "border border-border text-text-muted"}`}>
            {s === "همه" ? "همه" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">شماره فاکتور</th>
              <th className="text-start py-12 font-medium">دوره</th>
              <th className="text-start py-12 font-medium">مبلغ (تومان)</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">صدور</th>
              <th className="text-start py-12 font-medium">سررسید</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono text-[11px] ltr-text font-semibold text-brand" style={{ direction: "ltr" }}>{inv.id}</td>
                <td className="py-11 text-text-main">{inv.period}</td>
                <td className="py-11 font-bold text-text-main ltr-text">{(inv.amount / 10).toLocaleString()} تومان</td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${STATUS_STYLE[inv.status]}`}>{STATUS_LABEL[inv.status]}</span>
                </td>
                <td className="py-11 text-text-muted">{inv.issued}</td>
                <td className="py-11 text-text-muted">{inv.due}</td>
                <td className="py-11 pe-12 flex gap-6">
                  <button className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">دانلود PDF</button>
                  {inv.status === "unpaid" && <button className="px-8 py-4 rounded-6 bg-brand text-white text-[10px]">پرداخت</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
