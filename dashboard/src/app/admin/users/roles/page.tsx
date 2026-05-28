"use client";

import Link from "next/link";

const ROLES = [
  { name: "مدیر سیستم",  key: "sysadmin",  users: 2,  color: "#dc2626", perms: ["*:*"],                                                                          desc: "دسترسی کامل به همه بخش‌های پلتفرم" },
  { name: "ادمین",        key: "admin",     users: 18, color: "#d97706", perms: ["iaas:*","billing:read","iam:*","monitoring:read"],                               desc: "مدیریت منابع مستاجر" },
  { name: "مدیر",         key: "manager",   users: 11, color: "#7c3aed", perms: ["iaas:read","iaas:create","billing:read","iam:read"],                             desc: "مشاهده و ایجاد منابع، بدون حذف" },
  { name: "توسعه‌دهنده",  key: "developer", users: 47, color: "#2554d8", perms: ["iaas:read","iaas:create","k8s:*","registry:*","dns:read"],                       desc: "توسعه و deploy اپلیکیشن" },
  { name: "اپراتور",      key: "operator",  users: 32, color: "#16a34a", perms: ["iaas:read","monitoring:read","alerts:read","activity:read"],                     desc: "نظارت و عملیات روزمره" },
  { name: "بیننده",       key: "viewer",    users: 89, color: "#64748b", perms: ["*:read"],                                                                        desc: "فقط مشاهده — بدون تغییر" },
  { name: "صورتحساب",     key: "billing",   users: 14, color: "#0891b2", perms: ["billing:*","cost-explorer:read","support:read"],                                  desc: "مدیریت هزینه و فاکتورها" },
];

export default function RolesPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">نقش‌های دسترسی</h1>
            <p className="text-[12px] text-text-muted mt-2">تعریف سطوح دسترسی و مجوزها</p>
          </div>
          <Link href="/admin/users" className="text-[12px] text-text-muted hover:text-brand">← کاربران</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل نقش‌ها",  value: ROLES.length,                                  color: "#2554d8" },
            { label: "کل کاربران", value: ROLES.reduce((a,r) => a+r.users, 0),           color: "#64748b" },
            { label: "نقش‌های عمومی", value: ROLES.filter((r) => r.key !== "sysadmin").length, color: "#16a34a" },
            { label: "سوپر ادمین", value: ROLES.find((r) => r.key === "sysadmin")?.users ?? 0, color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {ROLES.map((r) => (
          <div key={r.key} className="glass rounded-16 p-20">
            <div className="flex items-start justify-between gap-12 mb-12">
              <div className="flex items-center gap-12">
                <div className="w-10 h-10 rounded-2" style={{ background: r.color }} />
                <div>
                  <p className="text-[14px] font-bold text-text-main">{r.name}</p>
                  <p className="text-[12px] text-text-muted mt-2">{r.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-10 shrink-0">
                <span className="text-[12px] text-text-muted">{r.users} کاربر</span>
                <button className="px-12 py-6 rounded-8 border border-border text-text-muted text-[12px] hover:bg-bg transition-colors">ویرایش</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              {r.perms.map((p) => (
                <span key={p} className="px-8 py-3 rounded-5 bg-brand/10 text-brand text-[11px] font-mono">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
