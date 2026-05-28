"use client";

import Link from "next/link";

interface Policy {
  name:        string;
  type:        "managed" | "custom" | "inline";
  desc:        string;
  permissions: string[];
  attachedTo:  number;
  created:     string;
}

const POLICIES: Policy[] = [
  { name: "AdministratorAccess", type: "managed", desc: "دسترسی کامل به همه سرویس‌ها",                  permissions: ["*:*"],                                        attachedTo: 3,  created: "سیستم"    },
  { name: "DeveloperAccess",     type: "managed", desc: "ایجاد و مدیریت منابع compute و k8s",            permissions: ["compute:*","k8s:*","registry:*","dns:read"],   attachedTo: 12, created: "سیستم"    },
  { name: "ReadOnlyAccess",      type: "managed", desc: "مشاهده تمام منابع بدون تغییر",                 permissions: ["*:read"],                                     attachedTo: 8,  created: "سیستم"    },
  { name: "BillingAccess",       type: "managed", desc: "مشاهده و مدیریت فاکتورها و هزینه",             permissions: ["billing:*","cost-explorer:read"],             attachedTo: 4,  created: "سیستم"    },
  { name: "InfraAccess",         type: "custom",  desc: "Terraform و automation infra",                  permissions: ["compute:*","network:*","storage:*","iam:read"],attachedTo: 2,  created: "۱۴۰۴/۰۱" },
  { name: "DeployAccess",        type: "custom",  desc: "استقرار اپلیکیشن‌ها",                          permissions: ["k8s:deploy","registry:pull","compute:read"],  attachedTo: 3,  created: "۱۴۰۳/۰۸" },
  { name: "MetricsRead",         type: "custom",  desc: "خواندن متریک‌ها و هشدارها",                    permissions: ["monitoring:read","alerts:read"],              attachedTo: 4,  created: "۱۴۰۴/۰۳" },
  { name: "StorageWrite",        type: "custom",  desc: "نوشتن در object storage",                      permissions: ["storage:*"],                                  attachedTo: 2,  created: "۱۴۰۳/۱۲" },
];

const TYPE_COLOR: Record<string, string> = { managed: "#2554d8", custom: "#7c3aed", inline: "#64748b" };

export default function PoliciesPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">سیاست‌های IAM</h1>
            <p className="text-[12px] text-text-muted mt-2">تعریف مجوزهای دسترسی</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ سیاست جدید</button>
            <Link href="/iam/users" className="text-[12px] text-text-muted hover:text-brand">← کاربران</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",       value: POLICIES.length,                                           color: "#2554d8" },
            { label: "مدیریتی",  value: POLICIES.filter((p) => p.type === "managed").length,      color: "#2554d8" },
            { label: "سفارشی",   value: POLICIES.filter((p) => p.type === "custom").length,       color: "#7c3aed" },
            { label: "ضمیمه‌ها", value: POLICIES.reduce((a, p) => a + p.attachedTo, 0),          color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {POLICIES.map((p) => (
          <div key={p.name} className="glass rounded-14 p-16 border border-border">
            <div className="flex items-start justify-between gap-12 mb-8">
              <div>
                <div className="flex items-center gap-8 mb-4">
                  <p className="text-[13px] font-bold font-mono text-text-main">{p.name}</p>
                  <span className="px-7 py-2 rounded-4 text-[10px] font-medium" style={{ background: `${TYPE_COLOR[p.type]}15`, color: TYPE_COLOR[p.type] }}>{p.type}</span>
                  <span className="text-[11px] text-text-muted">{p.attachedTo} ضمیمه</span>
                </div>
                <p className="text-[12px] text-text-muted">{p.desc}</p>
              </div>
              {p.type !== "managed" && (
                <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg shrink-0">ویرایش</button>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              {p.permissions.map((perm) => <span key={perm} className="px-7 py-2 rounded-4 bg-brand/10 text-brand text-[10px] font-mono">{perm}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
