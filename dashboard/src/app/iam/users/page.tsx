"use client";

import { useState } from "react";
import Link from "next/link";

interface IAMUser {
  id:       string;
  name:     string;
  email:    string;
  groups:   string[];
  policies: string[];
  mfa:      boolean;
  status:   "active" | "inactive";
  created:  string;
  lastKey:  string | null;
}

const USERS: IAMUser[] = [
  { id: "iu01", name: "احمدرضا سرخایل",  email: "a.sarkhail@nab.ir",     groups: ["admin","developers"],  policies: ["AdministratorAccess"],          mfa: true,  status: "active",   created: "۱۴۰۲/۰۳", lastKey: "۱ ساعت پیش"  },
  { id: "iu02", name: "مریم حسینی",       email: "m.hosseini@aban.ir",    groups: ["developers"],          policies: ["DeveloperAccess"],               mfa: true,  status: "active",   created: "۱۴۰۳/۰۵", lastKey: "دیروز"       },
  { id: "iu03", name: "علی رضایی",        email: "a.rezaei@hosh.ir",      groups: ["developers"],          policies: ["ReadOnlyAccess","K8sAccess"],    mfa: false, status: "active",   created: "۱۴۰۳/۰۱", lastKey: "۳ روز پیش"  },
  { id: "iu04", name: "ci-pipeline",      email: "ci@nab.ir",             groups: [],                      policies: ["DeployAccess"],                  mfa: false, status: "active",   created: "۱۴۰۳/۰۸", lastKey: "۵ دقیقه پیش"},
  { id: "iu05", name: "terraform-bot",    email: "tf@nab.ir",             groups: [],                      policies: ["InfraAccess"],                   mfa: false, status: "active",   created: "۱۴۰۴/۰۱", lastKey: "دیروز"       },
  { id: "iu06", name: "فاطمه احمدی",     email: "f.ahmadi@pajohesh.ir",  groups: ["billing"],             policies: ["BillingAccess"],                 mfa: true,  status: "active",   created: "۱۴۰۴/۰۴", lastKey: "۱ هفته پیش" },
  { id: "iu07", name: "old-backup-bot",   email: "backup@nab.ir",         groups: [],                      policies: ["StorageReadOnly"],               mfa: false, status: "inactive", created: "۱۴۰۳/۰۶", lastKey: "۶ ماه پیش"  },
];

export default function IAMUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = USERS.filter((u) => !search || u.name.includes(search) || u.email.includes(search));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">کاربران IAM</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت دسترسی‌های برنامه‌ای</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ کاربر IAM</button>
            <Link href="/iam" className="text-[12px] text-text-muted hover:text-brand">← IAM</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",         value: USERS.length,                                         color: "#2554d8" },
            { label: "فعال",       value: USERS.filter((u) => u.status === "active").length,    color: "#16a34a" },
            { label: "بدون MFA",   value: USERS.filter((u) => !u.mfa).length,                  color: "#d97706" },
            { label: "service bot",value: USERS.filter((u) => u.groups.length === 0).length,   color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14 flex gap-10">
        <input type="text" placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-12 py-8 rounded-8 border border-border bg-bg text-[12px] outline-none focus:border-brand w-[200px]" />
        <Link href="/iam/groups" className="ms-auto text-[12px] text-brand hover:underline">گروه‌ها →</Link>
        <Link href="/iam/policies" className="text-[12px] text-brand hover:underline">سیاست‌ها →</Link>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">کاربر</th>
              <th className="text-start py-12 font-medium">گروه‌ها</th>
              <th className="text-start py-12 font-medium">سیاست‌ها</th>
              <th className="text-start py-12 font-medium">MFA</th>
              <th className="text-start py-12 font-medium">آخرین کلید</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className={`border-b border-border/50 hover:bg-bg/60 ${u.status === "inactive" ? "opacity-60" : ""}`}>
                <td className="px-16 py-11">
                  <p className="font-semibold text-text-main">{u.name}</p>
                  <p className="text-[10px] text-text-muted ltr-text" style={{ direction: "ltr" }}>{u.email}</p>
                </td>
                <td className="py-11">
                  <div className="flex flex-wrap gap-3">
                    {u.groups.map((g) => <span key={g} className="px-6 py-2 rounded-4 bg-brand/10 text-brand text-[10px] font-mono">{g}</span>)}
                    {u.groups.length === 0 && <span className="text-text-muted text-[10px]">—</span>}
                  </div>
                </td>
                <td className="py-11">
                  <div className="flex flex-wrap gap-3">
                    {u.policies.slice(0, 2).map((p) => <span key={p} className="px-6 py-2 rounded-4 bg-bg text-text-muted text-[10px] border border-border">{p}</span>)}
                    {u.policies.length > 2 && <span className="text-text-muted text-[10px]">+{u.policies.length - 2}</span>}
                  </div>
                </td>
                <td className="py-11">
                  <span className={`text-[11px] font-semibold ${u.mfa ? "text-green-600" : "text-amber-600"}`}>{u.mfa ? "✓ فعال" : "✗ غیرفعال"}</span>
                </td>
                <td className="py-11 text-text-muted">{u.lastKey ?? "—"}</td>
                <td className="py-11">
                  <span className={`px-7 py-2 rounded-5 text-[10px] ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {u.status === "active" ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="py-11 pe-12">
                  <button className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">ویرایش</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
