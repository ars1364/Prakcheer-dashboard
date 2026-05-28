"use client";

import Link from "next/link";

const REGIONS = [
  { id: "teh1", name: "تهران-۱",   country: "ایران", city: "تهران",   azs: 2, status: "operational", hypervisors: 4, vms: 94,  networks: 18, storage: 14200, uptime: 99.97 },
  { id: "isf1", name: "اصفهان-۱",  country: "ایران", city: "اصفهان",  azs: 1, status: "degraded",    hypervisors: 2, vms: 40,  networks: 8,  storage: 5800,  uptime: 99.71 },
  { id: "msh1", name: "مشهد-۱",    country: "ایران", city: "مشهد",    azs: 1, status: "operational", hypervisors: 2, vms: 9,   networks: 4,  storage: 2100,  uptime: 99.88 },
];

const STATUS_STYLE: Record<string, string> = { operational: "bg-green-100 text-green-700", degraded: "bg-amber-100 text-amber-700", down: "bg-red-100 text-red-700" };

export default function AdminRegionsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">مناطق جغرافیایی</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت Regions و Availability Zones</p>
          </div>
          <div className="flex gap-8">
            <Link href="/admin/regions/health"   className="text-[12px] text-brand hover:underline">سلامت →</Link>
            <Link href="/admin/regions/capacity" className="text-[12px] text-brand hover:underline">ظرفیت →</Link>
            <Link href="/admin"                  className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل مناطق",  value: REGIONS.length,                                          color: "#2554d8" },
            { label: "Operational", value: REGIONS.filter((r) => r.status === "operational").length, color: "#16a34a" },
            { label: "کل VM",     value: REGIONS.reduce((a, r) => a + r.vms, 0),                  color: "#7c3aed" },
            { label: "کل Storage (GB)", value: REGIONS.reduce((a, r) => a + r.storage, 0).toLocaleString(), color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
        {REGIONS.map((r) => (
          <div key={r.id} className="glass rounded-16 p-20">
            <div className="flex items-center justify-between mb-14">
              <div>
                <p className="text-[15px] font-bold text-text-main">{r.name}</p>
                <p className="text-[11px] text-text-muted mt-2">{r.city}، {r.country}</p>
              </div>
              <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${STATUS_STYLE[r.status]}`}>
                {r.status === "operational" ? "عملیاتی" : "تنزل"}
              </span>
            </div>
            <div className="flex flex-col gap-8 text-[12px]">
              {[
                { label: "AZ",           value: r.azs },
                { label: "Hypervisors",  value: r.hypervisors },
                { label: "VM",           value: r.vms },
                { label: "Network",      value: r.networks },
                { label: "Storage (GB)", value: r.storage.toLocaleString() },
                { label: "Uptime",       value: `${r.uptime}%` },
              ].map((s) => (
                <div key={s.label} className="flex justify-between">
                  <span className="text-text-muted">{s.label}</span>
                  <span className="font-semibold text-text-main">{s.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-14 flex gap-8">
              <Link href={`/admin/regions/health`}   className="flex-1 text-center py-7 rounded-8 border border-border text-text-muted text-[11px] hover:bg-bg transition-colors">سلامت</Link>
              <Link href={`/admin/regions/capacity`} className="flex-1 text-center py-7 rounded-8 border border-border text-text-muted text-[11px] hover:bg-bg transition-colors">ظرفیت</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
