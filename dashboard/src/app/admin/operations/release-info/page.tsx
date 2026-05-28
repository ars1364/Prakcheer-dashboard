"use client";

import Link from "next/link";

const CURRENT = { version: "3.2.1", released: "۱۴۰۵/۰۳/۰۶", commit: "a4f91bc", env: "production" };

const CHANGELOG = [
  {
    version: "3.2.1", date: "۱۴۰۵/۰۳/۰۶", type: "patch",
    changes: [
      { type: "fix",     text: "رفع باگ نمایش نادرست هزینه در صورتحساب Farsi locale" },
      { type: "fix",     text: "Neutron: رفع race condition در تخصیص Floating IP" },
      { type: "fix",     text: "Magnum: timeout را در health check به ۶۰ ثانیه افزایش داد" },
      { type: "security",text: "CVE-2024-44012: رفع SSRF در API Gateway route validation" },
    ],
  },
  {
    version: "3.2.0", date: "۱۴۰۵/۰۲/۱۵", type: "minor",
    changes: [
      { type: "feature", text: "VPC Peering: امکان peering بین VPCهای مختلف اضافه شد" },
      { type: "feature", text: "API Gateway: پشتیبانی از rate limiting per-route" },
      { type: "feature", text: "Kubernetes: بروزرسانی به نسخه ۱.۲۹" },
      { type: "improvement", text: "بهبود عملکرد Ceph CRUSH map" },
      { type: "fix",     text: "رفع ۱۴ باگ متفرقه" },
    ],
  },
  {
    version: "3.1.0", date: "۱۴۰۵/۰۱/۱۰", type: "minor",
    changes: [
      { type: "feature", text: "Container Registry با پشتیبانی از Helm charts" },
      { type: "feature", text: "Backup service: پشتیبانی از cross-region backup" },
      { type: "improvement", text: "داشبورد: بهینه‌سازی زمان بارگذاری ۴۰٪" },
    ],
  },
];

const TYPE_STYLE: Record<string, string> = {
  fix:         "bg-red-50 text-red-700",
  feature:     "bg-green-50 text-green-700",
  improvement: "bg-blue-50 text-brand",
  security:    "bg-purple-50 text-purple-700",
};
const TYPE_LABEL: Record<string, string> = { fix: "Fix", feature: "Feature", improvement: "بهبود", security: "Security" };

const BADGE_STYLE: Record<string, string> = { patch: "bg-slate-100 text-slate-600", minor: "bg-blue-100 text-brand", major: "bg-amber-100 text-amber-700" };

export default function ReleaseInfoPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">اطلاعات نسخه</h1>
            <p className="text-[12px] text-text-muted mt-2">وضعیت نسخه پلتفرم و تاریخچه تغییرات</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "نسخه جاری",  value: `v${CURRENT.version}`, color: "#2554d8" },
            { label: "محیط",        value: CURRENT.env,            color: "#16a34a" },
            { label: "تاریخ انتشار", value: CURRENT.released,      color: "#64748b" },
            { label: "Commit",      value: CURRENT.commit,         color: "#64748b" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[18px] font-bold font-mono ltr-text" style={{ color: s.color, direction: "ltr" }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-16">
        {CHANGELOG.map((rel) => (
          <div key={rel.version} className="glass rounded-16 p-20">
            <div className="flex items-center gap-10 mb-14">
              <span className="text-[16px] font-bold text-text-main font-mono ltr-text" style={{ direction: "ltr" }}>v{rel.version}</span>
              <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${BADGE_STYLE[rel.type]}`}>{rel.type}</span>
              <span className="text-[12px] text-text-muted">{rel.date}</span>
            </div>
            <div className="flex flex-col gap-6">
              {rel.changes.map((c, i) => (
                <div key={i} className="flex items-start gap-10">
                  <span className={`shrink-0 px-7 py-2 rounded-4 text-[10px] font-semibold ${TYPE_STYLE[c.type]}`}>{TYPE_LABEL[c.type]}</span>
                  <p className="text-[12px] text-text-main leading-[1.6]">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
