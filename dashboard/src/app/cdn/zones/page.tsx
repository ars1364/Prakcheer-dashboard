"use client";

import Link from "next/link";

interface CDNZone {
  id:        string;
  domain:    string;
  origin:    string;
  status:    "active" | "pending" | "paused";
  requests:  string;
  bandwidth: string;
  cacheHit:  number;
  created:   string;
}

const ZONES: CDNZone[] = [
  { id: "cz01", domain: "cdn.myapp.ir",       origin: "origin.myapp.ir",    status: "active",  requests: "۴.۲M",  bandwidth: "۲۸۰ GB", cacheHit: 92, created: "۱۴۰۳/۰۸" },
  { id: "cz02", domain: "assets.myapp.ir",    origin: "s3.myapp.ir",        status: "active",  requests: "۱۲.۸M", bandwidth: "۹۵۰ GB", cacheHit: 97, created: "۱۴۰۳/۰۶" },
  { id: "cz03", domain: "static.partner.ir",  origin: "185.20.14.50",       status: "active",  requests: "۸۷۰K",  bandwidth: "۵۵ GB",  cacheHit: 88, created: "۱۴۰۴/۰۱" },
  { id: "cz04", domain: "api.cdn.ir",         origin: "api.myapp.ir",       status: "paused",  requests: "—",      bandwidth: "—",      cacheHit: 0,  created: "۱۴۰۴/۰۵" },
  { id: "cz05", domain: "media.newapp.ir",    origin: "185.20.14.55",       status: "pending", requests: "—",      bandwidth: "—",      cacheHit: 0,  created: "۱۴۰۵/۰۲" },
];

const STATUS_STYLE: Record<string, string> = {
  active:  "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  paused:  "bg-slate-100 text-slate-600",
};

export default function CDNZonesPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">CDN Zone‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت شبکه توزیع محتوا</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ zone جدید</button>
            <Link href="/cdn" className="text-[12px] text-text-muted hover:text-brand">← CDN</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل zone",   value: ZONES.length,                                       color: "#2554d8" },
            { label: "فعال",      value: ZONES.filter((z) => z.status === "active").length,  color: "#16a34a" },
            { label: "کل درخواست",value: "۱۸M",                                              color: "#7c3aed" },
            { label: "میانگین cache",value: Math.round(ZONES.filter((z)=>z.cacheHit>0).reduce((a,z)=>a+z.cacheHit,0)/ZONES.filter((z)=>z.cacheHit>0).length)+"٪", color: "#16a34a" },
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
          <div key={z.id} className="glass rounded-14 p-16 border border-border">
            <div className="flex items-start justify-between gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-10 mb-6 flex-wrap">
                  <p className="text-[13px] font-bold font-mono text-brand ltr-text" style={{ direction: "ltr" }}>{z.domain}</p>
                  <span className={`px-7 py-2 rounded-5 text-[11px] font-medium ${STATUS_STYLE[z.status]}`}>
                    {z.status === "active" ? "فعال" : z.status === "pending" ? "در انتظار" : "متوقف"}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted mb-6 ltr-text" style={{ direction: "ltr" }}>origin: {z.origin}</p>
                {z.status === "active" && (
                  <div className="flex gap-12 text-[11px] text-text-muted flex-wrap">
                    <span>درخواست: {z.requests}</span>
                    <span>پهنای‌باند: {z.bandwidth}</span>
                    <span className="text-green-600">cache hit: {z.cacheHit}٪</span>
                    <span>ایجاد: {z.created}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-6 shrink-0">
                <Link href="/cdn/origins" className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">origin</Link>
                <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">تنظیمات</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
