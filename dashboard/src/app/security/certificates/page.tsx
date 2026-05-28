"use client";

import Link from "next/link";

const CERTS = [
  { name: "prod-wildcard",     domain: "*.myapp.ir",        issuer: "Let's Encrypt",  type: "DV", expires: "۱۴۰۵/۰۵/۲۰", daysLeft: 84, status: "valid",    autoRenew: true  },
  { name: "staging-cert",      domain: "*.staging.ir",       issuer: "Let's Encrypt",  type: "DV", expires: "۱۴۰۵/۰۴/۱۱", daysLeft: 45, status: "valid",    autoRenew: true  },
  { name: "partner-cert",      domain: "static.partner.ir",  issuer: "ZeroSSL",        type: "DV", expires: "۱۴۰۵/۰۲/۲۵", daysLeft: 18, status: "expiring", autoRenew: false },
  { name: "corporate-ov",      domain: "*.nab.ir",           issuer: "DigiCert",       type: "OV", expires: "۱۴۰۶/۰۱/۰۵", daysLeft: 340,status: "valid",    autoRenew: false },
  { name: "api-cert",          domain: "api.myapp.ir",       issuer: "Let's Encrypt",  type: "DV", expires: "۱۴۰۵/۰۴/۳۰", daysLeft: 64, status: "valid",    autoRenew: true  },
];

const STATUS_STYLE: Record<string, string> = {
  valid:   "bg-green-100 text-green-700",
  expiring:"bg-amber-100 text-amber-700",
  expired: "bg-red-100 text-red-700",
};

export default function SecurityCertificatesPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">گواهی‌های SSL/TLS</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت گواهی‌های امنیتی</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ گواهی جدید</button>
            <Link href="/security" className="text-[12px] text-text-muted hover:text-brand">← امنیت</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",          value: CERTS.length,                                          color: "#2554d8" },
            { label: "معتبر",       value: CERTS.filter((c) => c.status === "valid").length,      color: "#16a34a" },
            { label: "رو به انقضا", value: CERTS.filter((c) => c.status === "expiring").length,   color: "#d97706" },
            { label: "auto-renew",  value: CERTS.filter((c) => c.autoRenew).length,              color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {CERTS.map((c) => (
          <div key={c.name} className={`glass rounded-14 p-16 border ${c.status === "expiring" ? "border-amber-200 bg-amber-50/20" : "border-border"}`}>
            <div className="flex items-center gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-10 mb-6 flex-wrap">
                  <p className="text-[12px] font-bold text-text-main">{c.name}</p>
                  <span className="font-mono text-[11px] text-brand ltr-text" style={{ direction: "ltr" }}>{c.domain}</span>
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${STATUS_STYLE[c.status]}`}>
                    {c.status === "valid" ? "معتبر" : c.status === "expiring" ? "رو به انقضا" : "منقضی"}
                  </span>
                  <span className="px-6 py-2 rounded-4 bg-bg border border-border text-text-muted text-[10px]">{c.type}</span>
                  {c.autoRenew && <span className="px-6 py-2 rounded-4 bg-purple-50 text-purple-700 text-[10px]">auto-renew</span>}
                </div>
                <div className="flex gap-12 text-[11px] text-text-muted">
                  <span>{c.issuer}</span>
                  <span>انقضا: {c.expires}</span>
                  <span className={c.daysLeft <= 30 ? "text-amber-600 font-semibold" : ""}>{c.daysLeft} روز مانده</span>
                </div>
              </div>
              <div className="flex gap-6 shrink-0">
                {c.status === "expiring" && <button className="px-10 py-5 rounded-6 bg-brand text-white text-[11px]">تجدید</button>}
                <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">جزئیات</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
