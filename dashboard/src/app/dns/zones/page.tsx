"use client";

import Link from "next/link";

interface Zone {
  id:      string;
  name:    string;
  type:    "primary" | "secondary";
  records: number;
  ns:      string[];
  status:  "active" | "pending" | "error";
  created: string;
}

const ZONES: Zone[] = [
  { id: "z01", name: "myapp.ir",        type: "primary",   records: 24, ns: ["ns1.prakcheer.ir","ns2.prakcheer.ir"], status: "active",  created: "۱۴۰۳/۰۶" },
  { id: "z02", name: "staging.ir",      type: "primary",   records: 8,  ns: ["ns1.prakcheer.ir","ns2.prakcheer.ir"], status: "active",  created: "۱۴۰۴/۰۱" },
  { id: "z03", name: "api.myapp.ir",    type: "primary",   records: 12, ns: ["ns1.prakcheer.ir","ns2.prakcheer.ir"], status: "active",  created: "۱۴۰۴/۰۳" },
  { id: "z04", name: "internal.nab.ir", type: "primary",   records: 32, ns: ["ns1.prakcheer.ir","ns2.prakcheer.ir"], status: "active",  created: "۱۴۰۳/۰۸" },
  { id: "z05", name: "cdn.myapp.ir",    type: "primary",   records: 5,  ns: ["ns1.prakcheer.ir","ns2.prakcheer.ir"], status: "pending", created: "۱۴۰۵/۰۲" },
];

export default function DNSZonesPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">مناطق DNS</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت zone‌های DNS</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ zone جدید</button>
            <Link href="/dns" className="text-[12px] text-text-muted hover:text-brand">← DNS</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          {[
            { label: "کل zone",   value: ZONES.length,                                       color: "#2554d8" },
            { label: "فعال",      value: ZONES.filter((z) => z.status === "active").length,  color: "#16a34a" },
            { label: "کل رکورد",  value: ZONES.reduce((a, z) => a + z.records, 0),          color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {ZONES.map((z) => (
          <div key={z.id} className="glass rounded-14 p-16 border border-border flex items-center gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-10 mb-4">
                <p className="text-[13px] font-bold font-mono text-brand ltr-text" style={{ direction: "ltr" }}>{z.name}</p>
                <span className={`px-7 py-2 rounded-5 text-[10px] ${z.status === "active" ? "bg-green-100 text-green-700" : z.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                  {z.status === "active" ? "فعال" : z.status === "pending" ? "در انتظار" : "خطا"}
                </span>
              </div>
              <div className="flex gap-12 text-[11px] text-text-muted flex-wrap">
                <span>{z.records} رکورد</span>
                <span>{z.type === "primary" ? "primary" : "secondary"}</span>
                <span>ایجاد: {z.created}</span>
              </div>
            </div>
            <div className="flex gap-6 shrink-0">
              <Link href="/dns/records" className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">رکوردها</Link>
              <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">تنظیمات</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
