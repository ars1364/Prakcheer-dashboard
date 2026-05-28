"use client";

import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SECTIONS = [
  { label: "قالب‌های Heat",  href: "/automation/heat-templates", icon: "☰", desc: "قالب‌های IaC برای OpenStack Heat",      count: 12, color: "#d97706" },
  { label: "Stack‌ها",       href: "/automation/stacks",          icon: "⬡", desc: "استک‌های اجرا شده از قالب‌ها",           count: 8,  color: "#2554d8" },
  { label: "رویدادهای Stack", href: "/automation/stack-events",   icon: "◉", desc: "لاگ رویدادهای چرخه عمر stack",           count: 47, color: "#16a34a" },
  { label: "خروجی‌های Stack", href: "/automation/stack-outputs",  icon: "◈", desc: "مقادیر output استک‌های فعال",            count: 23, color: "#7c3aed" },
  { label: "Workflow‌ها",    href: "/automation/workflows",       icon: "◫", desc: "جریان‌های کاری زمان‌بندی‌شده",           count: 6,  color: "#0891b2" },
  { label: "تاریخچه job",    href: "/automation/job-history",     icon: "◷", desc: "نتایج اجرای گذشته",                     count: 134,color: "#64748b" },
];

const RUN_HISTORY = [
  { day: "شن", ok: 12, fail: 1 },
  { day: "ی",  ok: 8,  fail: 0 },
  { day: "د",  ok: 15, fail: 2 },
  { day: "س",  ok: 11, fail: 0 },
  { day: "چ",  ok: 9,  fail: 1 },
  { day: "پ",  ok: 14, fail: 0 },
  { day: "ج",  ok: 7,  fail: 0 },
];

export default function AutomationPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">اتوماسیون</h1>
            <p className="text-[12px] text-text-muted mt-2">زیرساخت به‌عنوان کد، stack‌ها و workflow‌ها</p>
          </div>
          <Link href="/automation/heat-templates" className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ قالب جدید</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "stack فعال",     value: 8,   color: "#2554d8" },
            { label: "اجرا این هفته",  value: 76,  color: "#16a34a" },
            { label: "موفق (۷ روز)",   value: "94٪", color: "#16a34a" },
            { label: "خطا (۷ روز)",    value: 4,   color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-20">
        <h2 className="text-[13px] font-bold text-text-main mb-14">اجرای stack در ۷ روز</h2>
        <div className="ltr-text h-[160px]" style={{ direction: "ltr" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={RUN_HISTORY} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.55} />
                </linearGradient>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.55} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)", fill: "var(--color-text-muted)" }} />
              <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)", fill: "var(--color-text-muted)" }} />
              <Tooltip contentStyle={{ background: "var(--color-glass)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="ok"   name="موفق"   fill="url(#barGrad1)" radius={[3,3,0,0]} />
              <Bar dataKey="fail" name="خطا"    fill="url(#barGrad2)" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="glass rounded-16 p-20 hover:border-brand border border-border transition-colors group">
            <div className="flex items-center gap-12 mb-10">
              <div className="w-36 h-36 rounded-10 flex items-center justify-center text-[18px]"
                style={{ background: `${s.color}20`, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p className="text-[13px] font-bold text-text-main group-hover:text-brand transition-colors">{s.label}</p>
                <p className="text-[11px] text-text-muted">{s.count} آیتم</p>
              </div>
            </div>
            <p className="text-[12px] text-text-muted leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
