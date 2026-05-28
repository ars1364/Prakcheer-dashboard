"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface User {
  id:      string;
  name:    string;
  email:   string;
  tenant:  string;
  role:    string;
  status:  "active" | "suspended" | "invited";
  mfa:     boolean;
  lastLogin:string;
  joined:  string;
}

const USERS: User[] = [
  { id: "u01", name: "احمدرضا سرخایل",  email: "a.sarkhail@nab.ir",     tenant: "شرکت نوآوری ابری",    role: "مدیر سیستم",  status: "active",    mfa: true,  lastLogin: "همین الان",     joined: "۱۴۰۲/۰۳" },
  { id: "u02", name: "مریم حسینی",       email: "m.hosseini@aban.ir",    tenant: "آژانس دیجیتال آبان",  role: "ادمین",       status: "active",    mfa: true,  lastLogin: "۱ ساعت پیش",   joined: "۱۴۰۳/۰۵" },
  { id: "u03", name: "علی رضایی",        email: "a.rezaei@hosh.ir",     tenant: "استارتاپ هوش‌مند",    role: "توسعه‌دهنده", status: "active",    mfa: false, lastLogin: "دیروز",         joined: "۱۴۰۳/۰۱" },
  { id: "u04", name: "فاطمه احمدی",     email: "f.ahmadi@pajohesh.ir",  tenant: "سازمان پژوهش ملی",    role: "مدیر",        status: "active",    mfa: true,  lastLogin: "۳ ساعت پیش",   joined: "۱۴۰۱/۱۱" },
  { id: "u05", name: "محمد کریمی",      email: "m.karimi@sepehr.ir",    tenant: "پلتفرم پرداخت سپهر",  role: "ادمین",       status: "active",    mfa: true,  lastLogin: "۲ روز پیش",    joined: "۱۴۰۲/۱۰" },
  { id: "u06", name: "رضا محمدی",       email: "r.mohammadi@sama.ir",   tenant: "تیم توسعه سما",       role: "توسعه‌دهنده", status: "invited",   mfa: false, lastLogin: "—",             joined: "۱۴۰۵/۰۲" },
  { id: "u07", name: "سارا میری",        email: "s.miri@bam.ir",         tenant: "فروشگاه آنلاین بام",   role: "اپراتور",    status: "active",    mfa: false, lastLogin: "۵ ساعت پیش",   joined: "۱۴۰۳/۰۸" },
  { id: "u08", name: "حسین نجفی",       email: "h.najafi@rahban.ir",    tenant: "شرکت لجستیک رهبان",   role: "ادمین",       status: "active",    mfa: true,  lastLogin: "۱ روز پیش",    joined: "۱۴۰۲/۰۷" },
  { id: "u09", name: "زهرا کریم‌پور",   email: "z.karim@noor.ir",       tenant: "موسسه آموزشی نور",    role: "بیننده",      status: "suspended", mfa: false, lastLogin: "۲ هفته پیش",   joined: "۱۴۰۴/۰۴" },
  { id: "u10", name: "امیر تهرانی",     email: "a.tehrani@mehr.ir",     tenant: "کلینیک دیجیتال مهر",  role: "اپراتور",    status: "active",    mfa: false, lastLogin: "۴ ساعت پیش",   joined: "۱۴۰۴/۰۲" },
];

const ROLE_STYLE: Record<string, string> = {
  "مدیر سیستم": "bg-red-100 text-red-700",
  "ادمین":       "bg-amber-100 text-amber-700",
  "مدیر":        "bg-purple-100 text-purple-700",
  "توسعه‌دهنده": "bg-blue-100 text-brand",
  "اپراتور":     "bg-green-100 text-green-700",
  "بیننده":      "bg-slate-100 text-slate-600",
};

export default function AdminUsersPage() {
  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState("همه");

  const filtered = useMemo(() => USERS.filter((u) => {
    if (search && !u.name.includes(search) && !u.email.includes(search)) return false;
    if (status !== "همه" && u.status !== status) return false;
    return true;
  }), [search, status]);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">کاربران پلتفرم</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت همه کاربران در همه مستاجران</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل کاربران",  value: USERS.length,                                  color: "#2554d8" },
            { label: "فعال",         value: USERS.filter((u) => u.status === "active").length, color: "#16a34a" },
            { label: "بدون MFA",     value: USERS.filter((u) => !u.mfa).length,            color: "#d97706" },
            { label: "معلق / دعوت", value: USERS.filter((u) => u.status !== "active").length, color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14 flex flex-wrap gap-10 items-center">
        <input type="text" placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-12 py-8 rounded-8 border border-border bg-bg text-[13px] outline-none focus:border-brand w-[200px]" />
        {["همه", "active", "suspended", "invited"].map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-10 py-6 rounded-6 text-[12px] font-medium transition-all ${status === s ? "bg-brand text-white" : "border border-border text-text-muted hover:text-text-main"}`}
          >{s === "همه" ? "همه" : s === "active" ? "فعال" : s === "suspended" ? "معلق" : "دعوت‌شده"}</button>
        ))}
        <Link href="/admin/users/roles" className="ms-auto text-[12px] text-brand hover:underline">مدیریت نقش‌ها →</Link>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">کاربر</th>
              <th className="text-start py-12 font-medium">مستاجر</th>
              <th className="text-start py-12 font-medium">نقش</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">MFA</th>
              <th className="text-start py-12 font-medium">آخرین ورود</th>
              <th className="text-start py-12 font-medium">عضویت</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11">
                  <p className="font-semibold text-text-main">{u.name}</p>
                  <p className="text-[10px] text-text-muted ltr-text" style={{ direction: "ltr" }}>{u.email}</p>
                </td>
                <td className="py-11 text-text-muted">{u.tenant}</td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${ROLE_STYLE[u.role] ?? "bg-slate-100 text-slate-600"}`}>{u.role}</span>
                </td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${u.status === "active" ? "bg-green-100 text-green-700" : u.status === "suspended" ? "bg-red-100 text-red-700" : "bg-blue-50 text-brand"}`}>
                    {u.status === "active" ? "فعال" : u.status === "suspended" ? "معلق" : "دعوت‌شده"}
                  </span>
                </td>
                <td className="py-11">
                  <span className={`text-[11px] font-semibold ${u.mfa ? "text-green-600" : "text-red-500"}`}>{u.mfa ? "✓ فعال" : "✗ غیرفعال"}</span>
                </td>
                <td className="py-11 text-text-muted">{u.lastLogin}</td>
                <td className="py-11 text-text-muted">{u.joined}</td>
                <td className="py-11 pe-12">
                  <button className="px-10 py-4 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg transition-colors">مشاهده</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
