"use client";

import Link from "next/link";

const BUCKETS = [
  { name: "prod-assets",        region: "تهران-۱", objects: 48240, size: "124 GB", access: "public",  versioning: true,  created: "۱۴۰۳/۰۶" },
  { name: "prod-backups",       region: "تهران-۱", objects: 12800, size: "890 GB", access: "private", versioning: true,  created: "۱۴۰۳/۰۸" },
  { name: "prod-logs",          region: "تهران-۱", objects: 89000, size: "45 GB",  access: "private", versioning: false, created: "۱۴۰۳/۰۹" },
  { name: "ml-datasets",        region: "تهران-۱", objects: 2450,  size: "4.2 TB", access: "private", versioning: false, created: "۱۴۰۴/۰۶" },
  { name: "staging-assets",     region: "تهران-۱", objects: 3200,  size: "18 GB",  access: "public",  versioning: false, created: "۱۴۰۴/۰۱" },
  { name: "terraform-state",    region: "تهران-۱", objects: 45,    size: "12 MB",  access: "private", versioning: true,  created: "۱۴۰۳/۰۷" },
];

const totalSize = "5.3 TB";

export default function BucketsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Bucket‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت Object Storage</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ bucket جدید</button>
            <Link href="/object-storage" className="text-[12px] text-text-muted hover:text-brand">← Object Storage</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "bucket",     value: BUCKETS.length,                                              color: "#2554d8" },
            { label: "حجم کل",    value: totalSize,                                                   color: "#7c3aed" },
            { label: "عمومی",      value: BUCKETS.filter((b) => b.access === "public").length,        color: "#d97706" },
            { label: "versioning", value: BUCKETS.filter((b) => b.versioning).length,                 color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[18px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">نام bucket</th>
              <th className="text-start py-12 font-medium">منطقه</th>
              <th className="text-start py-12 font-medium">دسترسی</th>
              <th className="text-start py-12 font-medium">اشیاء</th>
              <th className="text-start py-12 font-medium">حجم</th>
              <th className="text-start py-12 font-medium">versioning</th>
              <th className="text-start py-12 font-medium">ایجاد</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {BUCKETS.map((b) => (
              <tr key={b.name} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono text-[11px] font-semibold text-brand ltr-text" style={{ direction: "ltr" }}>{b.name}</td>
                <td className="py-11 text-text-muted">{b.region}</td>
                <td className="py-11">
                  <span className={`px-7 py-2 rounded-5 text-[10px] ${b.access === "public" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                    {b.access === "public" ? "عمومی" : "خصوصی"}
                  </span>
                </td>
                <td className="py-11 font-semibold text-text-main">{b.objects.toLocaleString()}</td>
                <td className="py-11 ltr-text text-text-muted">{b.size}</td>
                <td className="py-11">
                  <span className={`text-[11px] font-semibold ${b.versioning ? "text-green-600" : "text-text-muted"}`}>{b.versioning ? "✓" : "—"}</span>
                </td>
                <td className="py-11 text-text-muted">{b.created}</td>
                <td className="py-11 pe-12">
                  <button className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">مرور</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
