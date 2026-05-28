"use client";

import Link from "next/link";

const GROUPS = [
  { name: "admin",      users: 3,  policies: ["AdministratorAccess"],                    desc: "دسترسی کامل"             },
  { name: "developers", users: 12, policies: ["DeveloperAccess","K8sAccess","RegistryPush"], desc: "توسعه و استقرار"         },
  { name: "billing",    users: 4,  policies: ["BillingAccess"],                           desc: "مدیریت هزینه"            },
  { name: "read-only",  users: 8,  policies: ["ReadOnlyAccess"],                          desc: "فقط مشاهده"              },
  { name: "ci-cd",      users: 2,  policies: ["DeployAccess","RegistryPull","K8sDeploy"], desc: "Pipeline های CI/CD"      },
  { name: "monitoring", users: 3,  policies: ["MetricsRead","AlertsRead"],                desc: "تیم ops و مانیتورینگ"    },
];

export default function IAMGroupsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">گروه‌های IAM</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت گروه‌بندی دسترسی‌ها</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ گروه جدید</button>
            <Link href="/iam/users" className="text-[12px] text-text-muted hover:text-brand">← کاربران</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          {[
            { label: "کل گروه", value: GROUPS.length,                                   color: "#2554d8" },
            { label: "کل عضو",  value: GROUPS.reduce((a, g) => a + g.users, 0),        color: "#16a34a" },
            { label: "سیاست",   value: new Set(GROUPS.flatMap((g) => g.policies)).size, color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {GROUPS.map((g) => (
          <div key={g.name} className="glass rounded-14 p-16 border border-border">
            <div className="flex items-start justify-between gap-12 mb-10">
              <div>
                <p className="text-[13px] font-bold font-mono text-text-main mb-3">{g.name}</p>
                <p className="text-[12px] text-text-muted">{g.desc} · <span className="text-brand">{g.users} کاربر</span></p>
              </div>
              <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg shrink-0">ویرایش</button>
            </div>
            <div className="flex flex-wrap gap-5">
              {g.policies.map((p) => <span key={p} className="px-8 py-3 rounded-5 bg-brand/10 text-brand text-[10px] font-mono">{p}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
