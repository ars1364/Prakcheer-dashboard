"use client";

import { useState } from "react";
import Link from "next/link";

const RATES = [
  { id: "r01", name: "nano CPU", category: "Compute", metric: "vcpu/hr",     price: 850,    currency: "IRR", lastUpdated: "۱۴۰۵/۰۳/۰۵" },
  { id: "r02", name: "nano RAM", category: "Compute", metric: "gb-ram/hr",   price: 320,    currency: "IRR", lastUpdated: "۱۴۰۵/۰۳/۰۵" },
  { id: "r03", name: "HDD Volume",category: "Storage",metric: "gb/month",    price: 120,    currency: "IRR", lastUpdated: "۱۴۰۵/۰۱/۱۰" },
  { id: "r04", name: "SSD Volume",category: "Storage",metric: "gb/month",    price: 280,    currency: "IRR", lastUpdated: "۱۴۰۵/۰۱/۱۰" },
  { id: "r05", name: "Object Storage",category:"Storage",metric: "gb/month", price: 80,     currency: "IRR", lastUpdated: "۱۴۰۵/۰۱/۱۰" },
  { id: "r06", name: "Floating IP",category: "Network",metric: "ip/month",   price: 45_000, currency: "IRR", lastUpdated: "۱۴۰۴/۱۰/۰۱" },
  { id: "r07", name: "Bandwidth",  category: "Network",metric: "gb-out",     price: 150,    currency: "IRR", lastUpdated: "۱۴۰۴/۱۰/۰۱" },
  { id: "r08", name: "K8s Worker", category: "K8s",   metric: "node/hr",     price: 2_500,  currency: "IRR", lastUpdated: "۱۴۰۵/۰۲/۱۵" },
];

export default function BillingRatesPage() {
  const [editing, setEditing] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">نرخ‌نامه صورتحساب</h1>
            <p className="text-[12px] text-text-muted mt-2">قیمت‌گذاری منابع پلتفرم (تومان)</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ نرخ جدید</button>
            <Link href="/admin/billing/reports" className="text-[12px] text-brand hover:underline">گزارش‌ها →</Link>
            <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← ادمین</Link>
          </div>
        </div>
      </div>
      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">نام</th>
              <th className="text-start py-12 font-medium">دسته</th>
              <th className="text-start py-12 font-medium">واحد</th>
              <th className="text-start py-12 font-medium">قیمت</th>
              <th className="text-start py-12 font-medium">آخرین بروزرسانی</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {RATES.map((r) => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-semibold text-text-main">{r.name}</td>
                <td className="py-11 text-text-muted">{r.category}</td>
                <td className="py-11 font-mono text-[11px] text-text-muted ltr-text" style={{ direction: "ltr" }}>{r.metric}</td>
                <td className="py-11">
                  {editing === r.id ? (
                    <input defaultValue={r.price} className="w-[80px] px-8 py-4 rounded-6 border border-brand bg-bg text-[12px] outline-none" />
                  ) : (
                    <span className="font-semibold text-text-main ltr-text" style={{ direction: "ltr" }}>{r.price.toLocaleString()}</span>
                  )}
                </td>
                <td className="py-11 text-text-muted">{r.lastUpdated}</td>
                <td className="py-11 pe-12">
                  {editing === r.id ? (
                    <div className="flex gap-4">
                      <button onClick={() => setEditing(null)} className="px-8 py-4 rounded-6 bg-brand text-white text-[11px]">ذخیره</button>
                      <button onClick={() => setEditing(null)} className="px-8 py-4 rounded-6 border border-border text-text-muted text-[11px]">لغو</button>
                    </div>
                  ) : (
                    <button onClick={() => setEditing(r.id)} className="px-10 py-4 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">ویرایش</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
