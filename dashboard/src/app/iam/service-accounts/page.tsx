"use client";

import Link from "next/link";

interface ServiceAccount {
  id:       string;
  name:     string;
  purpose:  string;
  keys:     number;
  policies: string[];
  status:   "active" | "inactive";
  lastUsed: string;
  created:  string;
}

const ACCOUNTS: ServiceAccount[] = [
  { id: "sa01", name: "github-ci",         purpose: "GitHub Actions CI pipeline",    keys: 1, policies: ["DeployAccess","RegistryPush"],  status: "active",   lastUsed: "۵ دقیقه پیش",  created: "۱۴۰۳/۰۸" },
  { id: "sa02", name: "terraform-cloud",   purpose: "Terraform Cloud provisioning",  keys: 1, policies: ["InfraAccess"],                   status: "active",   lastUsed: "دیروز",          created: "۱۴۰۴/۰۱" },
  { id: "sa03", name: "monitoring-agent",  purpose: "Prometheus metrics scraping",   keys: 1, policies: ["MetricsRead"],                   status: "active",   lastUsed: "۱ دقیقه پیش",   created: "۱۴۰۴/۰۳" },
  { id: "sa04", name: "backup-service",    purpose: "Automated daily backups",       keys: 2, policies: ["StorageWrite","ComputeRead"],     status: "active",   lastUsed: "۳ ساعت پیش",    created: "۱۴۰۳/۱۲" },
  { id: "sa05", name: "log-shipper",       purpose: "Log forwarding to centralized", keys: 1, policies: ["LogsWrite"],                     status: "active",   lastUsed: "۲ دقیقه پیش",   created: "۱۴۰۴/۰۵" },
  { id: "sa06", name: "old-deploy-bot",    purpose: "Legacy deployment (deprecated)",keys: 0, policies: ["DeployAccess"],                  status: "inactive", lastUsed: "۸ ماه پیش",     created: "۱۴۰۲/۰۷" },
];

export default function ServiceAccountsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Service Account‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">حساب‌های خودکار برای سرویس‌ها</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ service account</button>
            <Link href="/iam/users" className="text-[12px] text-text-muted hover:text-brand">← کاربران</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",          value: ACCOUNTS.length,                                          color: "#2554d8" },
            { label: "فعال",        value: ACCOUNTS.filter((a) => a.status === "active").length,     color: "#16a34a" },
            { label: "کل کلید API", value: ACCOUNTS.reduce((a, s) => a + s.keys, 0),               color: "#7c3aed" },
            { label: "غیرفعال",     value: ACCOUNTS.filter((a) => a.status === "inactive").length,  color: "#64748b" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {ACCOUNTS.map((a) => (
          <div key={a.id} className={`glass rounded-14 p-16 border ${a.status === "inactive" ? "opacity-60 border-transparent" : "border-border"}`}>
            <div className="flex items-start justify-between gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-10 mb-4">
                  <p className="text-[13px] font-bold font-mono text-text-main">{a.name}</p>
                  <span className={`px-7 py-2 rounded-5 text-[10px] ${a.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {a.status === "active" ? "فعال" : "غیرفعال"}
                  </span>
                  <span className="text-[11px] text-text-muted">{a.keys} کلید API</span>
                </div>
                <p className="text-[12px] text-text-muted mb-6">{a.purpose}</p>
                <div className="flex flex-wrap gap-4 mb-6">
                  {a.policies.map((p) => <span key={p} className="px-6 py-2 rounded-4 bg-brand/10 text-brand text-[10px] font-mono">{p}</span>)}
                </div>
                <p className="text-[11px] text-text-muted">آخرین استفاده: {a.lastUsed} · ایجاد: {a.created}</p>
              </div>
              <div className="flex gap-6 shrink-0">
                <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">کلیدها</button>
                <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">ویرایش</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
