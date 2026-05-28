"use client";

import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

/* ─── mock data ─── */
const PLATFORM_STATS = [
  { label: "کل مستاجران",      value: 142,   color: "#2554d8", href: "/admin/tenants"  },
  { label: "کاربران فعال",     value: 1_847, color: "#7c3aed", href: "/admin/users"    },
  { label: "پروژه‌های فعال",   value: 389,   color: "#16a34a", href: "/admin/tenants/projects" },
  { label: "درخواست‌های معلق", value: 7,     color: "#dc2626", href: "/admin/approvals/pending" },
];

const SECTIONS = [
  {
    group: "مستاجران",
    color: "#2554d8",
    items: [
      { label: "لیست مستاجران",    href: "/admin/tenants" },
      { label: "پروژه‌ها",         href: "/admin/tenants/projects" },
      { label: "استحقاقات",        href: "/admin/tenants/entitlements" },
    ],
  },
  {
    group: "کاربران",
    color: "#7c3aed",
    items: [
      { label: "لیست کاربران",     href: "/admin/users" },
      { label: "نقش‌ها",           href: "/admin/users/roles" },
    ],
  },
  {
    group: "کاتالوگ",
    color: "#16a34a",
    items: [
      { label: "آیتم‌های سرویس",   href: "/admin/catalog/items" },
      { label: "پلن‌ها",           href: "/admin/catalog/plans" },
      { label: "دسترسی مستاجران",  href: "/admin/catalog/tenant-access" },
    ],
  },
  {
    group: "تأییدیه‌ها",
    color: "#dc2626",
    items: [
      { label: "درخواست‌های معلق", href: "/admin/approvals/pending" },
      { label: "تاریخچه",          href: "/admin/approvals/history" },
      { label: "سیاست‌ها",         href: "/admin/approvals/policies" },
    ],
  },
  {
    group: "مناطق",
    color: "#0891b2",
    items: [
      { label: "لیست مناطق",       href: "/admin/regions" },
      { label: "سلامت منطقه",      href: "/admin/regions/health" },
      { label: "ظرفیت",            href: "/admin/regions/capacity" },
    ],
  },
  {
    group: "مانیتورینگ",
    color: "#d97706",
    items: [
      { label: "سرویس‌ها",         href: "/admin/monitoring/services" },
      { label: "هایپروایزرها",     href: "/admin/monitoring/hypervisors" },
      { label: "مصرف مستاجران",    href: "/admin/monitoring/tenant-usage" },
      { label: "منابع بی‌مالک",    href: "/admin/monitoring/orphans" },
    ],
  },
  {
    group: "هشدارها",
    color: "#dc2626",
    items: [
      { label: "هشدارهای فعال",    href: "/admin/alerts" },
      { label: "تاریخچه",          href: "/admin/alerts/history" },
      { label: "آستانه‌ها",        href: "/admin/alerts/thresholds" },
    ],
  },
  {
    group: "حسابرسی",
    color: "#64748b",
    items: [
      { label: "لاگ پلتفرم",       href: "/admin/audit/platform" },
      { label: "لاگ مستاجران",     href: "/admin/audit/tenant" },
      { label: "حسابرسی صورتحساب", href: "/admin/audit/billing" },
    ],
  },
  {
    group: "عملیات",
    color: "#9333ea",
    items: [
      { label: "پردازش‌های پس‌زمینه", href: "/admin/operations/background-jobs" },
      { label: "پروویژن ناموفق",    href: "/admin/operations/failed-provisioning" },
      { label: "درخواست‌های گیر",   href: "/admin/operations/stuck-requests" },
      { label: "حالت نگهداری",      href: "/admin/operations/maintenance" },
      { label: "سلامت ماژول‌ها",    href: "/admin/operations/module-health" },
      { label: "وضعیت صف",          href: "/admin/operations/queue-status" },
    ],
  },
  {
    group: "صورتحساب",
    color: "#16a34a",
    items: [
      { label: "نرخ‌ها",           href: "/admin/billing/rates" },
      { label: "گزارش‌ها",         href: "/admin/billing/reports" },
    ],
  },
];

const HOURLY_REQS: { h: string; reqs: number; errors: number }[] = Array.from({ length: 24 }, (_, i) => ({
  h: `${String(i).padStart(2, "0")}:00`,
  reqs:   800 + Math.round(Math.sin(i / 3) * 300 + Math.random() * 150),
  errors: Math.round(4 + Math.random() * 12),
}));

const TENANT_USAGE = [
  { tenant: "شرکت A", cpu: 82, ram: 74, storage: 58 },
  { tenant: "شرکت B", cpu: 61, ram: 55, storage: 42 },
  { tenant: "استارتاپ X", cpu: 45, ram: 38, storage: 71 },
  { tenant: "آژانس Y", cpu: 28, ram: 33, storage: 24 },
  { tenant: "سازمان Z", cpu: 15, ram: 19, storage: 31 },
];

const PENDING_APPROVALS = [
  { id: "a1", tenant: "استارتاپ X",  type: "افزایش سهمیه",   resource: "۲۰ vCPU, ۶۴ GB RAM", ts: "۲ ساعت پیش", severity: "medium" },
  { id: "a2", tenant: "شرکت B",      type: "ایجاد پروژه",    resource: "محیط Production",     ts: "۳ ساعت پیش", severity: "low"    },
  { id: "a3", tenant: "آژانس Y",     type: "دسترسی سرویس",  resource: "Kubernetes Enterprise",ts: "۵ ساعت پیش", severity: "high"   },
  { id: "a4", tenant: "سازمان Z",    type: "افزایش سهمیه",   resource: "۵۰۰ GB Object Storage",ts: "دیروز",       severity: "low"    },
];

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] shadow-lg border border-border">
      <p className="text-text-muted mb-4">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>
      ))}
    </div>
  );
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex-1 h-5 rounded-999 bg-border overflow-hidden">
      <div className="h-full rounded-999" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

const SEV_STYLE: Record<string, string> = {
  high: "bg-red-100 text-red-700", medium: "bg-amber-100 text-amber-700", low: "bg-blue-100 text-brand",
};

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">

      {/* ── header ── */}
      <div className="glass rounded-16 p-20">
        <div className="flex items-center gap-14 mb-16">
          <div className="w-40 h-40 rounded-10 bg-slate-800 flex items-center justify-center text-white text-[18px]">◨</div>
          <div>
            <h1 className="text-[18px] font-bold text-text-main">پنل مدیریت پلتفرم</h1>
            <p className="text-[12px] text-text-muted mt-2">نمای کلی پلتفرم — فقط برای سوپر ادمین</p>
          </div>
          <span className="ms-auto px-10 py-4 rounded-6 bg-slate-800 text-white text-[11px] font-semibold">ADMIN</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {PLATFORM_STATS.map((s) => (
            <Link key={s.label} href={s.href} className="glass rounded-12 p-14 hover:shadow-md transition-all group">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[24px] font-bold group-hover:scale-105 transition-transform" style={{ color: s.color }}>
                {s.value.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="glass rounded-16 p-20">
          <h2 className="text-[14px] font-semibold text-text-main mb-16">درخواست‌های API پلتفرم — ۲۴ ساعت</h2>
          <div className="ltr-text" style={{ direction: "ltr" }}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={HOURLY_REQS} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2554d8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2554d8" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="h"    tick={{ fontSize: 9, fontFamily: "var(--font-vazirmatn)" }} interval={5} />
                <YAxis tick={{ fontSize: 9, fontFamily: "var(--font-vazirmatn)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="reqs"   name="درخواست"  stroke="#2554d8" strokeWidth={2} fill="url(#gReq)" dot={false} />
                <Area type="monotone" dataKey="errors" name="خطا"      stroke="#dc2626" strokeWidth={2} fill="none"        dot={false} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-16 p-20">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-[14px] font-semibold text-text-main">مصرف top مستاجران</h2>
            <Link href="/admin/monitoring/tenant-usage" className="text-[12px] text-brand hover:underline">مشاهده همه →</Link>
          </div>
          <div className="flex flex-col gap-10">
            {TENANT_USAGE.map((t) => (
              <div key={t.tenant} className="flex items-center gap-10">
                <p className="text-[11px] text-text-muted w-[80px] shrink-0 truncate">{t.tenant}</p>
                <MiniBar pct={t.cpu}     color="#2554d8" />
                <MiniBar pct={t.ram}     color="#7c3aed" />
                <MiniBar pct={t.storage} color="#16a34a" />
                <span className="text-[10px] text-text-muted w-[24px] shrink-0">{t.cpu}%</span>
              </div>
            ))}
            <div className="flex gap-10 mt-4 text-[10px] text-text-muted">
              <span className="flex items-center gap-4"><span className="w-6 h-6 rounded-2 bg-[#2554d8]" />CPU</span>
              <span className="flex items-center gap-4"><span className="w-6 h-6 rounded-2 bg-[#7c3aed]" />RAM</span>
              <span className="flex items-center gap-4"><span className="w-6 h-6 rounded-2 bg-[#16a34a]" />Storage</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── pending approvals ── */}
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-[14px] font-semibold text-text-main">
            درخواست‌های منتظر تأیید
            {PENDING_APPROVALS.length > 0 && (
              <span className="ms-8 px-8 py-3 rounded-999 bg-red-100 text-red-700 text-[11px] font-bold">{PENDING_APPROVALS.length}</span>
            )}
          </h2>
          <Link href="/admin/approvals/pending" className="text-[12px] text-brand hover:underline">مشاهده همه →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-start pb-10 font-medium">مستاجر</th>
                <th className="text-start pb-10 font-medium">نوع</th>
                <th className="text-start pb-10 font-medium">منبع</th>
                <th className="text-start pb-10 font-medium">زمان</th>
                <th className="text-start pb-10 font-medium">اولویت</th>
                <th className="text-end pb-10 font-medium">اقدام</th>
              </tr>
            </thead>
            <tbody>
              {PENDING_APPROVALS.map((a) => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-bg/60">
                  <td className="py-10 font-medium text-text-main">{a.tenant}</td>
                  <td className="py-10 text-text-muted">{a.type}</td>
                  <td className="py-10 text-text-muted">{a.resource}</td>
                  <td className="py-10 text-text-muted">{a.ts}</td>
                  <td className="py-10">
                    <span className={`px-7 py-2 rounded-5 text-[11px] font-medium ${SEV_STYLE[a.severity]}`}>
                      {a.severity === "high" ? "بالا" : a.severity === "medium" ? "متوسط" : "پایین"}
                    </span>
                  </td>
                  <td className="py-10 text-end">
                    <div className="flex gap-6 justify-end">
                      <button className="px-10 py-4 rounded-6 bg-green-600 text-white text-[11px] hover:bg-green-700 transition-colors">تأیید</button>
                      <button className="px-10 py-4 rounded-6 border border-red-200 text-red-600 text-[11px] hover:bg-red-50 transition-colors">رد</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── nav grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-16">
        {SECTIONS.map((sec) => (
          <div key={sec.group} className="glass rounded-16 p-16">
            <div className="flex items-center gap-8 mb-12">
              <div className="w-6 h-6 rounded-2" style={{ background: sec.color }} />
              <p className="text-[12px] font-bold text-text-main">{sec.group}</p>
            </div>
            <div className="flex flex-col gap-4">
              {sec.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-8 py-6 rounded-6 text-[12px] text-text-muted hover:text-brand hover:bg-brand/5 transition-colors group"
                >
                  <span>{item.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">→</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
