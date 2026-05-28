"use client";

import Link from "next/link";

const ORIGINS = [
  { id: "o01", name: "prod-web",    url: "https://origin.myapp.ir",     protocol: "https", port: 443, healthy: true,  zones: ["cdn.myapp.ir","assets.myapp.ir"],  latency: 18  },
  { id: "o02", name: "s3-bucket",   url: "https://s3.myapp.ir",         protocol: "https", port: 443, healthy: true,  zones: ["assets.myapp.ir"],                latency: 5   },
  { id: "o03", name: "api-backend", url: "https://api.myapp.ir",        protocol: "https", port: 443, healthy: true,  zones: ["api.cdn.ir"],                     latency: 22  },
  { id: "o04", name: "static-vm",   url: "http://185.20.14.50",         protocol: "http",  port: 80,  healthy: true,  zones: ["static.partner.ir"],              latency: 12  },
  { id: "o05", name: "media-vm",    url: "http://185.20.14.55",         protocol: "http",  port: 80,  healthy: false, zones: ["media.newapp.ir"],                latency: 0   },
];

export default function CDNOriginsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Origin Server‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">سرورهای اصلی که CDN از آن‌ها cache می‌کند</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ origin جدید</button>
            <Link href="/cdn/zones" className="text-[12px] text-text-muted hover:text-brand">← zone‌ها</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          {[
            { label: "کل origin",  value: ORIGINS.length,                                      color: "#2554d8" },
            { label: "سالم",       value: ORIGINS.filter((o) => o.healthy).length,            color: "#16a34a" },
            { label: "ناسالم",     value: ORIGINS.filter((o) => !o.healthy).length,           color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {ORIGINS.map((o) => (
          <div key={o.id} className={`glass rounded-14 p-16 border ${!o.healthy ? "border-red-200" : "border-border"}`}>
            <div className="flex items-center gap-12">
              <div className={`w-10 h-10 rounded-full shrink-0 ${o.healthy ? "bg-green-500" : "bg-red-500"}`} />
              <div className="flex-1">
                <div className="flex items-center gap-10 mb-4">
                  <p className="text-[13px] font-bold text-text-main">{o.name}</p>
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${o.protocol === "https" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{o.protocol}</span>
                  <span className="text-[11px] text-text-muted">{o.healthy ? `${o.latency}ms` : "—"}</span>
                </div>
                <p className="text-[11px] font-mono text-brand ltr-text mb-4" style={{ direction: "ltr" }}>{o.url}:{o.port}</p>
                <div className="flex flex-wrap gap-4">
                  {o.zones.map((z) => <span key={z} className="px-6 py-2 rounded-4 bg-brand/10 text-brand text-[10px] font-mono ltr-text">{z}</span>)}
                </div>
              </div>
              <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg shrink-0">ویرایش</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
