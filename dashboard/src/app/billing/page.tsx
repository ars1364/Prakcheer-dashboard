"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from "recharts";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardCard from "@/components/ui/DashboardCard";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";

const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

type UsageRow = { label: string; amount: number; pct: number; color: string };
type RegionBilling = { total: string; totalRaw: number; rows: UsageRow[]; computePct: number; bandwidthPct: number; storagePct: number };

const REGION_BILLING: Record<string, RegionBilling> = {
  all: {
    total: "۱٬۲۰۰٬۰۰۰", totalRaw: 1200000,
    rows: [
      { label: "محاسبات ابری", amount: 850000, pct: 71, color: "#1a4d8f" },
      { label: "پهنای باند",    amount: 220000, pct: 18, color: "#16a34a" },
      { label: "ذخیره‌سازی",   amount: 130000, pct: 11, color: "#d97706" },
    ],
    computePct: 71, bandwidthPct: 18, storagePct: 11,
  },
  tehran: {
    total: "۸۴۰٬۰۰۰", totalRaw: 840000,
    rows: [
      { label: "محاسبات ابری", amount: 600000, pct: 71, color: "#1a4d8f" },
      { label: "پهنای باند",    amount: 150000, pct: 18, color: "#16a34a" },
      { label: "ذخیره‌سازی",   amount:  90000, pct: 11, color: "#d97706" },
    ],
    computePct: 71, bandwidthPct: 18, storagePct: 11,
  },
  isfahan: {
    total: "۲۶۰٬۰۰۰", totalRaw: 260000,
    rows: [
      { label: "محاسبات ابری", amount: 180000, pct: 69, color: "#1a4d8f" },
      { label: "پهنای باند",    amount:  50000, pct: 19, color: "#16a34a" },
      { label: "ذخیره‌سازی",   amount:  30000, pct: 12, color: "#d97706" },
    ],
    computePct: 69, bandwidthPct: 19, storagePct: 12,
  },
  mashhad: {
    total: "۱۸۰٬۰۰۰", totalRaw: 180000,
    rows: [
      { label: "محاسبات ابری", amount: 120000, pct: 67, color: "#1a4d8f" },
      { label: "پهنای باند",    amount:  40000, pct: 22, color: "#16a34a" },
      { label: "ذخیره‌سازی",   amount:  20000, pct: 11, color: "#d97706" },
    ],
    computePct: 67, bandwidthPct: 22, storagePct: 11,
  },
};

// 6-month spending trend (account-wide, in thousands of Rials)
const MONTHLY_TREND = [
  { month: "دی",       compute: 680, bandwidth: 160, storage: 95  },
  { month: "بهمن",     compute: 720, bandwidth: 175, storage: 100 },
  { month: "اسفند",    compute: 760, bandwidth: 195, storage: 105 },
  { month: "فروردین",  compute: 620, bandwidth: 140, storage: 88  },
  { month: "اردیبهشت", compute: 810, bandwidth: 215, storage: 120 },
  { month: "خرداد",    compute: 850, bandwidth: 220, storage: 130 },
];

type InvoiceStatus = "paid" | "pending" | "overdue";
type Invoice = { id: string; number: string; period: string; amount: string; status: InvoiceStatus; issuedAt: string; paidAt?: string };

const INVOICES: Invoice[] = [
  { id: "inv-006", number: "INV-2026-006", period: "خرداد ۱۴۰۵",      amount: "۱٬۲۰۰٬۰۰۰", status: "pending", issuedAt: "۱۴۰۵/۰۳/۰۱" },
  { id: "inv-005", number: "INV-2026-005", period: "اردیبهشت ۱۴۰۵",   amount: "۹۸۰٬۰۰۰",   status: "paid",    issuedAt: "۱۴۰۵/۰۲/۰۱", paidAt: "۱۴۰۵/۰۲/۰۵" },
  { id: "inv-004", number: "INV-2026-004", period: "فروردین ۱۴۰۵",     amount: "۱٬۱۰۰٬۰۰۰", status: "paid",    issuedAt: "۱۴۰۵/۰۱/۰۱", paidAt: "۱۴۰۵/۰۱/۰۴" },
  { id: "inv-003", number: "INV-2025-003", period: "اسفند ۱۴۰۴",       amount: "۸۵۰٬۰۰۰",   status: "paid",    issuedAt: "۱۴۰۴/۱۲/۰۱", paidAt: "۱۴۰۴/۱۲/۰۳" },
  { id: "inv-002", number: "INV-2025-002", period: "بهمن ۱۴۰۴",        amount: "۷۲۰٬۰۰۰",   status: "paid",    issuedAt: "۱۴۰۴/۱۱/۰۱", paidAt: "۱۴۰۴/۱۱/۰۶" },
  { id: "inv-001", number: "INV-2025-001", period: "دی ۱۴۰۴",          amount: "۶۵۰٬۰۰۰",   status: "paid",    issuedAt: "۱۴۰۴/۱۰/۰۱", paidAt: "۱۴۰۴/۱۰/۰۵" },
];

const INV_STATUS: Record<InvoiceStatus, { variant: "success" | "warning" | "danger"; label: string }> = {
  paid:    { variant: "success", label: "پرداخت‌شده" },
  pending: { variant: "warning", label: "در انتظار"   },
  overdue: { variant: "danger",  label: "معوق"        },
};

export default function BillingPage() {
  const [region, setRegion] = useState("all");
  const billing = REGION_BILLING[region];

  const kpis = useMemo(() => ({
    thisMonth: billing.total,
    ytdCount:  INVOICES.filter(i => i.status === "paid").length,
    pending:   INVOICES.filter(i => i.status === "pending").length,
    credit:    "۵٬۰۰۰٬۰۰۰",
  }), [billing]);

  const pieData = billing.rows.map(r => ({ name: r.label, value: r.pct, color: r.color }));

  return (
    <DashboardShell
      title="صورتحساب"
      breadcrumbs={[{ label: "پراکچیر", href: "/" }, { label: "صورتحساب" }]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={setRegion}
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
        <MetricCard icon="◈" label="هزینه این ماه"    value={billing.total}         trend="down"    trendValue="6%"   context="ریال — نسبت به ماه قبل" />
        <MetricCard icon="✓" label="فاکتورهای پرداخت" value={String(kpis.ytdCount)} trend="neutral" trendValue="کل"  context="در سال جاری"              />
        <MetricCard icon="◷" label="در انتظار پرداخت" value={String(kpis.pending)}  trend="down"    trendValue="نیاز به پرداخت" context="فاکتور معلق"  />
        <MetricCard icon="⊕" label="اعتبار باقی‌مانده" value={kpis.credit}          trend="neutral" trendValue="موجودی" context="ریال"                 />
      </div>

      {/* Spending trend chart + Donut breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <DashboardCard title="روند هزینه — ۶ ماه گذشته (هزار ریال)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_TREND} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,168,161,0.15)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#3d5957", fontFamily: "var(--font-vazirmatn)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#3d5957" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(94,168,161,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "var(--font-vazirmatn)" }}
                  formatter={(val: number, name: string) => {
                    const labels: Record<string, string> = { compute: "محاسبات", bandwidth: "پهنای باند", storage: "ذخیره‌سازی" };
                    return [`${val}K ریال`, labels[name] ?? name];
                  }}
                />
                <Bar dataKey="compute"  stackId="a" fill="#1a4d8f" name="compute"   />
                <Bar dataKey="bandwidth" stackId="a" fill="#16a34a" name="bandwidth" />
                <Bar dataKey="storage"  stackId="a" fill="#d97706" name="storage"   radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-16 mt-4 justify-end">
              {[{ color: "#1a4d8f", label: "محاسبات" }, { color: "#16a34a", label: "پهنای باند" }, { color: "#d97706", label: "ذخیره‌سازی" }].map(l => (
                <div key={l.label} className="flex items-center gap-6">
                  <span className="w-10 h-10 rounded-2 inline-block shrink-0" style={{ background: l.color }} />
                  <span className="text-[11px] text-text-muted">{l.label}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="lg:col-span-1">
          <DashboardCard title="توزیع هزینه ماه جاری">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(94,168,161,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "var(--font-vazirmatn)" }}
                  formatter={(val: number, name: string) => [`${val}٪`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-8 mt-4">
              {billing.rows.map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <span className="w-10 h-10 rounded-2 shrink-0" style={{ background: row.color }} />
                    <span className="text-[12px] text-text-muted">{row.label}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-text-main">{row.pct}٪</span>
                </div>
              ))}
            </div>
            {/* Wallet credit */}
            <div className="mt-14 pt-12 border-t border-border flex items-center justify-between rounded-12 px-12 py-10"
                 style={{ background: "rgba(26,77,143,0.06)" }}>
              <div>
                <p className="text-[11px] text-text-muted">اعتبار کیف پول</p>
                <p className="text-[16px] font-bold text-brand ltr-text">۵٬۰۰۰٬۰۰۰ ریال</p>
              </div>
              <button className="px-12 py-6 rounded-8 bg-brand text-white text-[12px] font-medium hover:bg-brand-hover transition-colors">
                شارژ
              </button>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Invoice history */}
      <DashboardCard
        title="تاریخچه فاکتورها"
        action={<span className="text-[12px] text-text-muted">فاکتورها مستقل از منطقه هستند</span>}
        padding={false}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-20 py-10 text-start text-[12px] font-medium text-text-muted">شماره فاکتور</th>
                <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted">دوره</th>
                <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted">وضعیت</th>
                <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted hidden md:table-cell">تاریخ صدور</th>
                <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted hidden lg:table-cell">تاریخ پرداخت</th>
                <th className="px-16 py-10 text-end   text-[12px] font-medium text-text-muted">مبلغ (ریال)</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr key={inv.id} className={`border-b border-border last:border-0 hover:bg-brand-light/30 transition-colors ${i % 2 !== 0 ? "bg-white/20" : ""}`}>
                  <td className="px-20 py-12">
                    <span className="text-[13px] font-medium text-brand ltr-text">{inv.number}</span>
                  </td>
                  <td className="px-16 py-12 text-text-main">{inv.period}</td>
                  <td className="px-16 py-12">
                    <StatusBadge variant={INV_STATUS[inv.status].variant} dot>
                      {INV_STATUS[inv.status].label}
                    </StatusBadge>
                  </td>
                  <td className="px-16 py-12 hidden md:table-cell">
                    <span className="text-[12px] text-text-muted ltr-text">{inv.issuedAt}</span>
                  </td>
                  <td className="px-16 py-12 hidden lg:table-cell">
                    <span className="text-[12px] text-text-muted ltr-text">{inv.paidAt ?? "—"}</span>
                  </td>
                  <td className="px-16 py-12 text-end">
                    <span className="text-[14px] font-semibold text-text-main ltr-text">{inv.amount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
