"use client";

import { useState } from "react";
import Link from "next/link";

interface AccessKey {
  id:         string;
  accessKey:  string;
  secret:     string;
  label:      string;
  created:    string;
  lastUsed:   string | null;
  status:     "active" | "inactive";
  buckets:    string[] | "all";
}

const KEYS: AccessKey[] = [
  { id: "k01", accessKey: "PKR8A2XQ7MNLWTV3",  secret: "••••••••••••••••••••••••••••••••", label: "prod-app-key",     created: "۱۴۰۴/۱۱/۱۰", lastUsed: "دیروز",        status: "active",   buckets: "all"                       },
  { id: "k02", accessKey: "PKR2F9YLKZP4QRTB",  secret: "••••••••••••••••••••••••••••••••", label: "backup-agent",     created: "۱۴۰۵/۰۱/۰۵", lastUsed: "۲ ساعت پیش",  status: "active",   buckets: ["prod-backups"]            },
  { id: "k03", accessKey: "PKRDG5HXWN83JSMV",  secret: "••••••••••••••••••••••••••••••••", label: "ci-pipeline",      created: "۱۴۰۵/۰۲/۰۱", lastUsed: "۱ ساعت پیش",  status: "active",   buckets: ["prod-assets","ml-datasets"]},
  { id: "k04", accessKey: "PKRVT1E6CRYZ0AHQ",  secret: "••••••••••••••••••••••••••••••••", label: "old-integration",  created: "۱۴۰۳/۰۸/۱۵", lastUsed: "۶ ماه پیش",   status: "inactive", buckets: "all"                       },
];

export default function AccessKeysPage() {
  const [keys, setKeys] = useState(KEYS);
  const [showNew, setShowNew] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [revoked, setRevoked] = useState<string | null>(null);

  const toggleStatus = (id: string) =>
    setKeys((k) => k.map((x) => x.id === id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x));

  const revokeKey = (id: string) => {
    setKeys((k) => k.filter((x) => x.id !== id));
    setRevoked(id);
  };

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">کلیدهای دسترسی S3</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت Access Key و Secret Key</p>
          </div>
          <div className="flex gap-8">
            <button onClick={() => setShowNew(true)} className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ کلید جدید</button>
            <Link href="/object-storage" className="text-[12px] text-text-muted hover:text-brand">← Object Storage</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",      value: KEYS.length,                                           color: "#2554d8" },
            { label: "فعال",    value: KEYS.filter((k) => k.status === "active").length,     color: "#16a34a" },
            { label: "غیرفعال", value: KEYS.filter((k) => k.status === "inactive").length,  color: "#64748b" },
            { label: "همه bucket", value: KEYS.filter((k) => k.buckets === "all").length,   color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {showNew && (
        <div className="glass rounded-14 p-20 border border-brand/30">
          <h2 className="text-[14px] font-bold text-text-main mb-14">کلید دسترسی جدید</h2>
          <div className="flex gap-12 items-end flex-wrap">
            <div className="flex flex-col gap-6 flex-1 min-w-[200px]">
              <label className="text-[12px] text-text-muted">برچسب</label>
              <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
                className="px-12 py-8 rounded-8 border border-border bg-bg text-[13px] text-text-main focus:outline-none focus:border-brand"
                placeholder="مثال: my-app-key" />
            </div>
            <div className="flex gap-8">
              <button onClick={() => { setShowNew(false); setNewLabel(""); }}
                className="px-14 py-8 rounded-8 border border-border text-text-muted text-[12px]">انصراف</button>
              <button className="px-14 py-8 rounded-8 bg-brand text-white text-[12px]">ایجاد</button>
            </div>
          </div>
        </div>
      )}

      {revoked && (
        <div className="glass rounded-10 p-12 border border-red-200 bg-red-50/20 text-red-700 text-[12px]">
          کلید با موفقیت لغو شد. این عمل قابل بازگشت نیست.
        </div>
      )}

      <div className="flex flex-col gap-10">
        {keys.map((k) => (
          <div key={k.id} className={`glass rounded-14 p-18 border transition-colors ${k.status === "inactive" ? "opacity-60 border-transparent" : "border-border"}`}>
            <div className="flex items-start gap-14 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-10 mb-8 flex-wrap">
                  <p className="text-[13px] font-semibold text-text-main">{k.label}</p>
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${k.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {k.status === "active" ? "فعال" : "غیرفعال"}
                  </span>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-8 ltr-text" style={{ direction: "ltr" }}>
                    <span className="text-[11px] text-text-muted w-[90px] text-end" style={{ direction: "rtl" }}>Access Key:</span>
                    <span className="font-mono text-[12px] text-brand">{k.accessKey}</span>
                    <button className="text-[10px] text-text-muted hover:text-brand px-6 py-2 rounded-4 border border-border">کپی</button>
                  </div>
                  <div className="flex items-center gap-8 ltr-text" style={{ direction: "ltr" }}>
                    <span className="text-[11px] text-text-muted w-[90px] text-end" style={{ direction: "rtl" }}>Secret Key:</span>
                    <span className="font-mono text-[12px] text-text-muted">{k.secret}</span>
                    <button className="text-[10px] text-text-muted hover:text-brand px-6 py-2 rounded-4 border border-border">نمایش</button>
                  </div>
                </div>
                <div className="flex gap-14 mt-8 text-[11px] text-text-muted flex-wrap">
                  <span>ایجاد: {k.created}</span>
                  {k.lastUsed ? <span>آخرین استفاده: {k.lastUsed}</span> : <span className="text-amber-600">هرگز استفاده نشده</span>}
                  <span>
                    دسترسی به:{" "}
                    {k.buckets === "all"
                      ? <span className="text-brand">همه bucket‌ها</span>
                      : (k.buckets as string[]).map((b) => <span key={b} className="text-brand me-4">{b}</span>)}
                  </span>
                </div>
              </div>
              <div className="flex gap-8 items-center shrink-0">
                <button onClick={() => toggleStatus(k.id)}
                  className={`w-[40px] h-[22px] rounded-full relative transition-colors ${k.status === "active" ? "bg-brand" : "bg-border"}`}>
                  <span className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${k.status === "active" ? "right-[2px]" : "left-[2px]"}`} />
                </button>
                <button onClick={() => revokeKey(k.id)}
                  className="px-8 py-4 rounded-6 border border-red-200 text-red-600 text-[10px] hover:bg-red-50">لغو</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
