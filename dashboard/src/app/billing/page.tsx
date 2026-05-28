"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardCard from "@/components/ui/DashboardCard";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ResourceBar from "@/components/ui/ResourceBar";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { MetricCardSkeleton, TableSkeleton } from "@/components/ui/LoadingSkeleton";

// ─── Regions ──────────────────────────────────────────────────────────────────
const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

// ─── Per-region current-month usage ──────────────────────────────────────────
type UsageRow = { label: string; amount: number; pct: number; color?: string };
type RegionBilling = {
  total: string; totalRaw: number;
  rows: UsageRow[];
  computePct: number; bandwidthPct: number; storagePct: number;
};

const REGION_BILLING: Record<string, RegionBilling> = {
  all: {
    total: "۱٬۲۰۰٬۰۰۰", totalRaw: 1200000,
    rows: [
      { label: "سرویس محاسبات ابری", amount: 850000, pct: 71 },
      { label: "پهنای باند",          amount: 220000, pct: 18, color: "#16a34a" },
      { label: "فضای ذخیره‌سازی",    amount: 130000, pct: 11, color: "#d97706" },
    ],
    computePct: 71, bandwidthPct: 18, storagePct: 11,
  },
  tehran: {
    total: "۸۴۰٬۰۰۰", totalRaw: 840000,
    rows: [
      { label: "سرویس محاسبات ابری", amount: 600000, pct: 71 },
      { label: "پهنای باند",          amount: 150000, pct: 18, color: "#16a34a" },
      { label: "فضای ذخیره‌سازی",    amount:  90000, pct: 11, color: "#d97706" },
    ],
    computePct: 71, bandwidthPct: 18, storagePct: 11,
  },
  isfahan: {
    total: "۲۶۰٬۰۰۰", totalRaw: 260000,
    rows: [
      { label: "سرویس محاسبات ابری", amount: 180000, pct: 69 },
      { label: "پهنای باند",          amount:  50000, pct: 19, color: "#16a34a" },
      { label: "فضای ذخیره‌سازی",    amount:  30000, pct: 12, color: "#d97706" },
    ],
    computePct: 69, bandwidthPct: 19, storagePct: 12,
  },
  mashhad: {
    total: "۱۸۰٬۰۰۰", totalRaw: 180000,
    rows: [
      { label: "سرویس محاسبات ابری", amount: 120000, pct: 67 },
      { label: "پهنای باند",          amount:  40000, pct: 22, color: "#16a34a" },
      { label: "فضای ذخیره‌سازی",    amount:  20000, pct: 11, color: "#d97706" },
    ],
    computePct: 67, bandwidthPct: 22, storagePct: 11,
  },
};

// ─── Invoices (account-wide, not region-filtered) ────────────────────────────
type InvoiceStatus = "paid" | "pending" | "overdue";
type Invoice = {
  id: string; number: string; period: string;
  amount: string; status: InvoiceStatus; issuedAt: string; paidAt?: string;
};

const INVOICES: Invoice[] = [
  { id: "inv-006", number: "INV-2026-006", period: "خرداد ۱۴۰۵", amount: "۱٬۲۰۰٬۰۰۰", status: "pending", issuedAt: "۱۴۰۵/۰۳/۰۱" },
  { id: "inv-005", number: "INV-2026-005", period: "اردیبهشت ۱۴۰۵", amount: "۹۸۰٬۰۰۰", status: "paid",    issuedAt: "۱۴۰۵/۰۲/۰۱", paidAt: "۱۴۰۵/۰۲/۰۵" },
  { id: "inv-004", number: "INV-2026-004", period: "فروردین ۱۴۰۵",   amount: "۱٬۱۰۰٬۰۰۰", status: "paid",  issuedAt: "۱۴۰۵/۰۱/۰۱", paidAt: "۱۴۰۵/۰۱/۰۴" },
  { id: "inv-003", number: "INV-2025-003", period: "اسفند ۱۴۰۴",     amount: "۸۵۰٬۰۰۰",  status: "paid",  issuedAt: "۱۴۰۴/۱۲/۰۱", paidAt: "۱۴۰۴/۱۲/۰۳" },
  { id: "inv-002", number: "INV-2025-002", period: "بهمن ۱۴۰۴",      amount: "۷۲۰٬۰۰۰",  status: "paid",  issuedAt: "۱۴۰۴/۱۱/۰۱", paidAt: "۱۴۰۴/۱۱/۰۶" },
  { id: "inv-001", number: "INV-2025-001", period: "دی ۱۴۰۴",        amount: "۶۵۰٬۰۰۰",  status: "paid",  issuedAt: "۱۴۰۴/۱۰/۰۱", paidAt: "۱۴۰۴/۱۰/۰۵" },
];

const INV_STATUS: Record<InvoiceStatus, { variant: "success" | "warning" | "danger"; label: string }> = {
  paid:    { variant: "success", label: "پرداخت‌شده" },
  pending: { variant: "warning", label: "در انتظار"   },
  overdue: { variant: "danger",  label: "معوق"        },
};

const fmt = (n: number) =>
  n.toLocaleString("fa-IR").replace(/٬/g, "٬");

type PageState = "loading" | "error" | "empty" | "partial" | "ready";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BillingPage() {
  const [pageState, setPageState] = useState<PageState>("ready");
  const [region, setRegion]       = useState("all");

  const billing = REGION_BILLING[region];

  const kpis = useMemo(() => {
    const ytd = INVOICES.filter(i => i.status === "paid").reduce((s) => s + 1, 0);
    return {
      thisMonth:  billing.total,
      ytdCount:   ytd,
      pending:    INVOICES.filter(i => i.status === "pending").length,
      credit:     "۵٬۰۰۰٬۰۰۰",
    };
  }, [billing]);

  return (
    <DashboardShell
      title="صورتحساب"
      breadcrumbs={[{ label: "پراکچیر", href: "/" }, { label: "صورتحساب" }]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={setRegion}
    >
      {/* Dev switcher */}
      <div className="flex items-center gap-8 flex-wrap">
        {(["ready","loading","error","empty","partial"] as PageState[]).map(s => (
          <button key={s} onClick={() => setPageState(s)}
            className={`px-10 py-4 rounded-6 text-[11px] font-mono border transition-colors
              ${pageState === s ? "bg-brand text-white border-brand" : "text-text-muted border-border hover:border-border-strong"}`}>
            {s}
          </button>
        ))}
        <span className="text-[11px] text-text-muted">← حالت نمایش</span>
      </div>

      {pageState === "loading" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
            {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}
          </div>
          <div className="bg-bg-card rounded-20 border border-border overflow-hidden"><TableSkeleton /></div>
        </>
      )}

      {pageState === "error" && (
        <DashboardCard>
          <ErrorState title="دریافت اطلاعات صورتحساب ناموفق بود"
            description="اتصال به سرویس صورتحساب برقرار نشد. لطفاً دوباره تلاش کنید."
            onRetry={() => setPageState("ready")} />
        </DashboardCard>
      )}

      {pageState === "empty" && (
        <DashboardCard>
          <EmptyState icon="◈" title="فاکتوری وجود ندارد"
            description="پس از استفاده از سرویس‌ها، فاکتور ماهانه صادر خواهد شد." />
        </DashboardCard>
      )}

      {pageState === "partial" && (
        <div className="rounded-12 px-16 py-10 border text-[13px]"
          style={{ background: "#fef3c7", borderColor: "#fcd34d", color: "#78350f" }}>
          برخی اطلاعات صورتحساب بروزرسانی نشدند.
        </div>
      )}

      {(pageState === "ready" || pageState === "partial") && (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
            <MetricCard icon="◈" label="هزینه این ماه"    value={billing.total}         trend="down"    trendValue="6%"   context="ریال — نسبت به ماه قبل" />
            <MetricCard icon="✓" label="فاکتورهای پرداخت" value={String(kpis.ytdCount)} trend="neutral" trendValue="کل"  context="در سال جاری"              />
            <MetricCard icon="◷" label="در انتظار پرداخت" value={String(kpis.pending)}  trend={kpis.pending > 0 ? "down" : "neutral"} trendValue={kpis.pending > 0 ? "نیاز به پرداخت" : "تسویه"} context="فاکتور معلق" />
            <MetricCard icon="⊕" label="اعتبار باقی‌مانده" value={kpis.credit}          trend="neutral" trendValue="موجودی" context="ریال"                 />
          </div>

          {/* Usage + breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Current month breakdown */}
            <DashboardCard title={`مصرف ماه جاری — ${region === "all" ? "همه مناطق" : REGIONS.find(r => r.id === region)?.label}`}>
              <div className="flex flex-col gap-16">
                {billing.rows.map(row => (
                  <ResourceBar
                    key={row.label}
                    label={row.label}
                    used={`${fmt(row.amount)} ریال`}
                    total={`${billing.total} ریال`}
                    pct={row.pct}
                    color={row.color}
                  />
                ))}
                <div className="flex items-center justify-between pt-8 border-t border-border">
                  <span className="text-[14px] font-bold text-text-main">جمع کل</span>
                  <span className="text-[20px] font-bold text-brand ltr-text">{billing.total} ریال</span>
                </div>
              </div>
            </DashboardCard>

            {/* Service cost share */}
            <DashboardCard title="سهم هزینه هر سرویس">
              <div className="flex flex-col gap-12">
                {[
                  { label: "محاسبات ابری", pct: billing.computePct,   color: "#1a4d8f" },
                  { label: "پهنای باند",    pct: billing.bandwidthPct, color: "#16a34a" },
                  { label: "ذخیره‌سازی",   pct: billing.storagePct,   color: "#d97706" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-12">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[13px] text-text-muted">{item.label}</span>
                        <span className="text-[13px] font-semibold text-text-main ltr-text">{item.pct}٪</span>
                      </div>
                      <div className="h-8 rounded-full bg-border overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.pct}%`, background: item.color }} />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Credit balance */}
                <div className="mt-8 pt-12 border-t border-border rounded-12 px-16 py-12 flex items-center justify-between"
                  style={{ background: "rgba(26,77,143,0.06)" }}>
                  <div>
                    <p className="text-[12px] text-text-muted">اعتبار کیف پول</p>
                    <p className="text-[18px] font-bold text-brand ltr-text">۵٬۰۰۰٬۰۰۰ ریال</p>
                  </div>
                  <a href="/billing/topup"
                    className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] font-medium hover:bg-brand-hover transition-colors">
                    شارژ حساب
                  </a>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Invoice history */}
          <DashboardCard
            title="تاریخچه فاکتورها"
            action={<span className="text-[12px] text-text-muted">فاکتورها مستقل از منطقه هستند</span>}
            padding={false}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-20 py-10 text-start text-[12px] font-semibold text-text-muted">شماره فاکتور</th>
                    <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted">دوره</th>
                    <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted">وضعیت</th>
                    <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden md:table-cell">تاریخ صدور</th>
                    <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden lg:table-cell">تاریخ پرداخت</th>
                    <th className="px-16 py-10 text-end   text-[12px] font-semibold text-text-muted">مبلغ (ریال)</th>
                  </tr>
                </thead>
                <tbody>
                  {INVOICES.map((inv, i) => (
                    <tr key={inv.id}
                      className={`border-b border-border last:border-0 hover:bg-bg transition-colors ${i % 2 !== 0 ? "bg-bg" : ""}`}>
                      <td className="px-20 py-12">
                        <a href={`/billing/${inv.id}`}
                          className="text-[13px] font-medium text-brand hover:underline ltr-text">
                          {inv.number}
                        </a>
                      </td>
                      <td className="px-16 py-12">
                        <span className="text-[13px] text-text-main">{inv.period}</span>
                      </td>
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
        </>
      )}
    </DashboardShell>
  );
}
