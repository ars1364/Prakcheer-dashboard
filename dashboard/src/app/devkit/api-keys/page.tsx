"use client";

import { useState } from "react";
import Link from "next/link";

interface ApiKey {
  id:      string;
  name:    string;
  prefix:  string;
  scopes:  string[];
  created: string;
  lastUsed:string;
  expires: string | null;
  status:  "active" | "expired" | "revoked";
}

const KEYS: ApiKey[] = [
  { id: "k1", name: "CI/CD Pipeline",      prefix: "pk_live_4f2a", scopes: ["compute:*","storage:read"],  created: "۱۴۰۴/۱۲/۰۱", lastUsed: "۱ ساعت پیش",  expires: null,           status: "active"  },
  { id: "k2", name: "Monitoring Agent",    prefix: "pk_live_8c91", scopes: ["metrics:read","alerts:read"],created: "۱۴۰۴/۱۰/۱۵", lastUsed: "۵ دقیقه پیش", expires: null,           status: "active"  },
  { id: "k3", name: "Terraform Provider",  prefix: "pk_live_2d77", scopes: ["*"],                         created: "۱۴۰۴/۰۸/۲۰", lastUsed: "دیروز",        expires: "۱۴۰۵/۰۸/۲۰", status: "active"  },
  { id: "k4", name: "Local Dev",           prefix: "pk_test_aa33", scopes: ["compute:read"],               created: "۱۴۰۴/۰۱/۰۱", lastUsed: "۴ ماه پیش",   expires: "۱۴۰۴/۰۷/۰۱", status: "expired" },
  { id: "k5", name: "Old Deployment Bot",  prefix: "pk_live_cc55", scopes: ["compute:*"],                 created: "۱۴۰۳/۰۶/۰۱", lastUsed: "۶ ماه پیش",   expires: null,           status: "revoked" },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(KEYS);
  const [revoking, setRevoking] = useState<string | null>(null);
  const revoke = (id: string) => { setRevoking(null); setKeys((k) => k.map((x) => x.id === id ? { ...x, status: "revoked" as const } : x)); };

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">کلیدهای API</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت توکن‌های دسترسی API</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ کلید جدید</button>
            <Link href="/devkit/api-docs" className="text-[12px] text-brand hover:underline">مستندات API →</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "فعال",   value: keys.filter((k) => k.status === "active").length,  color: "#16a34a" },
            { label: "منقضی",  value: keys.filter((k) => k.status === "expired").length, color: "#d97706" },
            { label: "باطل",   value: keys.filter((k) => k.status === "revoked").length, color: "#dc2626" },
            { label: "با * scope", value: keys.filter((k) => k.scopes.includes("*")).length, color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {keys.map((k) => {
          const faded = k.status !== "active";
          return (
            <div key={k.id} className={`glass rounded-16 border p-16 ${faded ? "opacity-60 border-transparent" : "border-border"}`}>
              <div className="flex items-start justify-between gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-10 flex-wrap mb-4">
                    <p className="text-[13px] font-semibold text-text-main">{k.name}</p>
                    <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${k.status === "active" ? "bg-green-100 text-green-700" : k.status === "expired" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                      {k.status === "active" ? "فعال" : k.status === "expired" ? "منقضی" : "باطل"}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-text-muted ltr-text mb-6" style={{ direction: "ltr" }}>
                    {k.prefix}••••••••••••••••
                  </p>
                  <div className="flex flex-wrap gap-4 mb-6">
                    {k.scopes.map((s) => <span key={s} className="px-7 py-2 rounded-4 bg-brand/10 text-brand text-[10px] font-mono">{s}</span>)}
                  </div>
                  <div className="flex flex-wrap gap-x-12 text-[11px] text-text-muted">
                    <span>ایجاد: {k.created}</span>
                    <span>استفاده: {k.lastUsed}</span>
                    {k.expires && <span>انقضا: {k.expires}</span>}
                  </div>
                </div>
                {k.status === "active" && (
                  revoking === k.id ? (
                    <div className="flex gap-6 shrink-0">
                      <button onClick={() => revoke(k.id)} className="px-10 py-5 rounded-6 bg-red-600 text-white text-[11px]">تأیید ابطال</button>
                      <button onClick={() => setRevoking(null)} className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px]">لغو</button>
                    </div>
                  ) : (
                    <button onClick={() => setRevoking(k.id)} className="shrink-0 px-10 py-6 rounded-8 border border-red-200 text-red-600 text-[12px] hover:bg-red-50 transition-colors">ابطال</button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
