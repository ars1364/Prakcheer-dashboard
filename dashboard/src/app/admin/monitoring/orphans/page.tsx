"use client";

import { useState } from "react";
import Link from "next/link";

interface Orphan {
  id:       string;
  type:     string;
  name:     string;
  tenant:   string | null;
  region:   string;
  created:  string;
  size?:    string;
  cost:     number;
  reason:   string;
}

const ORPHANS: Orphan[] = [
  { id: "or01", type: "Volume",      name: "data-vol-abandoned-01", tenant: null,               region: "تهران-۱",   created: "۱۴۰۴/۱۱/۱۲", size: "۱۰۰ GB",  cost: 45_000,  reason: "مستاجر حذف‌شده" },
  { id: "or02", type: "Floating IP", name: "185.94.99.100",         tenant: "استارتاپ منحله",  region: "تهران-۱",   created: "۱۴۰۴/۱۰/۲۰", size: undefined,  cost: 12_000,  reason: "سرور حذف‌شده" },
  { id: "or03", type: "Snapshot",    name: "snap-old-project-bak",  tenant: null,               region: "اصفهان-۱",  created: "۱۴۰۴/۰۸/۰۵", size: "۲۲۰ GB",  cost: 88_000,  reason: "مستاجر حذف‌شده" },
  { id: "or04", type: "Volume",      name: "backup-orphan-0032",    tenant: "شرکت منحل A",     region: "تهران-۱",   created: "۱۴۰۴/۰۷/۱۸", size: "۵۰۰ GB",  cost: 225_000, reason: "مستاجر معلق" },
  { id: "or05", type: "Floating IP", name: "5.63.100.22",           tenant: null,               region: "مشهد-۱",    created: "۱۴۰۴/۰۶/۳۰", size: undefined,  cost: 18_000,  reason: "VM حذف‌شده" },
  { id: "or06", type: "Load Balancer",name: "lb-testproject-unused",tenant: "تیم آزمایشی B",  region: "تهران-۱",   created: "۱۴۰۴/۰۵/۱۱", size: undefined,  cost: 60_000,  reason: "پروژه منقضی" },
  { id: "or07", type: "Volume",      name: "vol-migration-temp",    tenant: null,               region: "اصفهان-۱",  created: "۱۴۰۴/۱۲/۰۱", size: "۲۰۰ GB",  cost: 90_000,  reason: "migration ناموفق" },
];

const TYPE_COLOR: Record<string, string> = {
  "Volume":        "#2554d8",
  "Floating IP":   "#0891b2",
  "Snapshot":      "#16a34a",
  "Load Balancer": "#7c3aed",
};

export default function OrphansPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleted,  setDeleted]  = useState<Set<string>>(new Set());

  const toggle = (id: string) => setSelected((s) => {
    const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const deleteSelected = () => { setDeleted((d) => new Set([...d, ...selected])); setSelected(new Set()); };

  const visible = ORPHANS.filter((o) => !deleted.has(o.id));
  const totalCost = visible.reduce((a, o) => a + o.cost, 0);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">منابع بی‌مالک</h1>
            <p className="text-[12px] text-text-muted mt-2">منابعی که به هیچ مستاجر فعالی متصل نیستند و هزینه ایجاد می‌کنند</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>

        {totalCost > 0 && (
          <div className="mb-14 p-12 rounded-10 bg-amber-50 border border-amber-200 text-[12px] text-amber-800">
            ⚠ این منابع ماهانه <strong>{totalCost.toLocaleString()} تومان</strong> هزینه ایجاد می‌کنند بدون استفاده.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "منابع بی‌مالک",  value: visible.length,                color: "#dc2626" },
            { label: "هزینه ماهانه",   value: `${(totalCost/1000).toFixed(0)}K`, color: "#d97706" },
            { label: "حجم کل",         value: "۱,۰۲۰ GB",                   color: "#2554d8" },
            { label: "قدیمی‌ترین",     value: "۱۰ ماه",                     color: "#64748b" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="glass rounded-12 p-14 flex items-center gap-12 border border-red-200">
          <span className="text-[12px] text-text-main">{selected.size} منبع انتخاب‌شده</span>
          <button onClick={deleteSelected} className="ms-auto px-14 py-7 rounded-8 bg-red-600 text-white text-[12px] font-medium hover:bg-red-700 transition-colors">
            حذف منابع انتخابی
          </button>
        </div>
      )}

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="px-16 py-12 w-[40px]">
                <input type="checkbox" onChange={(e) => setSelected(e.target.checked ? new Set(visible.map((o) => o.id)) : new Set())} />
              </th>
              <th className="text-start py-12 font-medium">نوع</th>
              <th className="text-start py-12 font-medium">نام</th>
              <th className="text-start py-12 font-medium">مستاجر اخیر</th>
              <th className="text-start py-12 font-medium">منطقه</th>
              <th className="text-start py-12 font-medium">تاریخ ایجاد</th>
              <th className="text-start py-12 font-medium">حجم</th>
              <th className="text-start py-12 font-medium">هزینه/ماه</th>
              <th className="text-start py-12 font-medium">دلیل</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => (
              <tr key={o.id} className={`border-b border-border/50 hover:bg-bg/60 transition-colors ${selected.has(o.id) ? "bg-red-50/40" : ""}`}>
                <td className="px-16 py-11">
                  <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggle(o.id)} />
                </td>
                <td className="py-11">
                  <span className="px-8 py-3 rounded-5 text-[11px] font-medium bg-bg border border-border" style={{ color: TYPE_COLOR[o.type] ?? "#64748b" }}>
                    {o.type}
                  </span>
                </td>
                <td className="py-11 font-mono text-[11px] text-text-main ltr-text" style={{ direction: "ltr" }}>{o.name}</td>
                <td className="py-11 text-text-muted">{o.tenant ?? <span className="text-red-500">—</span>}</td>
                <td className="py-11 text-text-muted">{o.region}</td>
                <td className="py-11 text-text-muted">{o.created}</td>
                <td className="py-11 text-text-muted">{o.size ?? "—"}</td>
                <td className="py-11 font-semibold text-amber-700">{o.cost.toLocaleString()}</td>
                <td className="py-11 text-text-muted">{o.reason}</td>
                <td className="py-11 pe-12">
                  <button onClick={() => setDeleted((d) => new Set([...d, o.id]))} className="px-10 py-4 rounded-6 border border-red-200 text-red-600 text-[11px] hover:bg-red-50 transition-colors">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
