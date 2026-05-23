"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import MetricCard from "@/components/ui/MetricCard";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ResourceBar from "@/components/ui/ResourceBar";
import ActionMenu from "@/components/ui/ActionMenu";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { MetricCardSkeleton, TableSkeleton } from "@/components/ui/LoadingSkeleton";
import StatusStrip from "@/components/dashboard/StatusStrip";
import AlertsCard from "@/components/dashboard/AlertsCard";
import type { Alert } from "@/components/dashboard/AlertsCard";

// ─── Demo data ───────────────────────────────────────────
type ServerStatus = "running" | "stopped" | "building" | "error";

const SERVERS: { id: string; name: string; status: ServerStatus; region: string; ip: string; vcpu: number; ram: number }[] = [
  { id: "srv-01", name: "web-prod-01",    status: "running",  region: "تهران", ip: "185.94.97.211", vcpu: 4,  ram: 8  },
  { id: "srv-02", name: "api-staging",   status: "stopped",  region: "تهران", ip: "185.94.97.212", vcpu: 2,  ram: 4  },
  { id: "srv-03", name: "db-primary",    status: "running",  region: "تهران", ip: "185.94.97.213", vcpu: 8,  ram: 16 },
  { id: "srv-04", name: "monitoring-thl",status: "building", region: "تهران", ip: "185.94.97.214", vcpu: 2,  ram: 4  },
];

const ALERTS: Alert[] = [
  { id: "a1", severity: "warning",  title: "api-staging متوقف شده",              meta: "آخرین بررسی: ۵ دقیقه پیش",          href: "/iaas/servers/srv-02", actionLabel: "مشاهده سرور" },
  { id: "a2", severity: "critical", title: "مصرف دیسک db-primary به ۸۲٪ رسیده", meta: "فضای باقی‌مانده: ۲۱.۶ GB از ۱۲۰ GB", href: "/iaas/servers/srv-03", actionLabel: "مشاهده جزئیات" },
];

const STATUS_MAP: Record<ServerStatus, { variant: "success"|"warning"|"danger"|"info"; label: string }> = {
  running:  { variant: "success", label: "در حال اجرا" },
  stopped:  { variant: "danger",  label: "متوقف" },
  building: { variant: "info",    label: "در حال ساخت" },
  error:    { variant: "danger",  label: "خطا" },
};

type PageState = "loading" | "error" | "empty" | "partial" | "ready";

// ─── Page ─────────────────────────────────────────────────
export default function DashboardPage() {
  // For demo: toggle states from a selector
  const [pageState, setPageState] = useState<PageState>("ready");

  return (
    <DashboardShell title="داشبورد" breadcrumbs={[{ label: "پراکچیر" }]}>

      {/* Dev state switcher — remove in production */}
      <div className="flex items-center gap-8 flex-wrap">
        {(["ready","loading","error","empty","partial"] as PageState[]).map(s => (
          <button
            key={s}
            onClick={() => setPageState(s)}
            className={`px-10 py-4 rounded-6 text-[11px] font-mono border transition-colors
              ${pageState === s ? "bg-brand text-white border-brand" : "text-text-muted border-border hover:border-border-strong"}`}
          >
            {s}
          </button>
        ))}
        <span className="text-[11px] text-text-muted">← حالت نمایش (توسعه)</span>
      </div>

      {/* ── Loading ── */}
      {pageState === "loading" && (
        <>
          <MetricCardSkeleton />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
            {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}
          </div>
          <div className="bg-bg-card rounded-20 border border-border overflow-hidden">
            <TableSkeleton />
          </div>
        </>
      )}

      {/* ── Error ── */}
      {pageState === "error" && (
        <DashboardCard>
          <ErrorState
            title="دریافت اطلاعات داشبورد ناموفق بود"
            description="برخی سرویس‌ها در دسترس نیستند. لطفاً دوباره تلاش کنید."
            onRetry={() => setPageState("ready")}
          />
        </DashboardCard>
      )}

      {/* ── Empty ── */}
      {pageState === "empty" && (
        <DashboardCard>
          <EmptyState
            icon="☁"
            title="هنوز سروری ایجاد نکرده‌اید"
            description="اولین سرور ابری خود را ایجاد کنید و مدیریت زیرساخت را شروع کنید."
            action={
              <a href="/iaas/servers/new" className="px-20 py-9 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors">
                + سفارش اولین سرور
              </a>
            }
          />
        </DashboardCard>
      )}

      {/* ── Partial ── */}
      {pageState === "partial" && (
        <div className="rounded-12 px-16 py-10 border text-[13px]"
             style={{ background: "#fef3c7", borderColor: "#fcd34d", color: "#78350f" }}>
          برخی اطلاعات بروزرسانی نشدند — داده‌های نمایش‌داده شده ممکن است قدیمی باشند.
        </div>
      )}

      {/* ── Ready / Partial full content ── */}
      {(pageState === "ready" || pageState === "partial") && (
        <>
          {/* Row 1 — Welcome hero */}
          <div
            className="glass rounded-20 px-24 py-18 flex items-center justify-between gap-16 border"
            style={{ boxShadow: "0 8px 32px rgba(15,50,47,0.10)" }}
          >
            <div className="flex flex-col gap-4">
              <p className="text-[12px] text-text-muted">خوش آمدید</p>
              <h2 className="text-[20px] font-bold text-text-main">احمدرضا عزیز</h2>
              <p className="text-[13px] text-text-muted">
                ۱۲ سرور فعال · ۳ شبکه · موجودی:{" "}
                <span className="font-semibold text-text-main ltr-text">۵٬۰۰۰٬۰۰۰ ریال</span>
              </p>
            </div>
            <div className="hidden sm:flex w-48 h-48 rounded-16 bg-brand-light items-center justify-center text-[24px] shrink-0 select-none">
              ☁
            </div>
          </div>

          {/* Row 1b — Service status strip */}
          <StatusStrip status="incident" alertCount={ALERTS.length} lastUpdated="۲ دقیقه پیش" />

          {/* Row 2 — KPI metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
            <MetricCard icon="▣" label="سرورهای فعال"  value="12"     trend="up"      trendValue="2 این ماه" context="از 20 سرور مجاز"        />
            <MetricCard icon="⚡" label="مصرف CPU"      value="38%"    trend="neutral" trendValue="میانگین"   context="در 12 سرور"            />
            <MetricCard icon="⇅" label="ترافیک شبکه"  value="4.2 TB" trend="up"      trendValue="14%"       context="این ماه"               />
            <MetricCard icon="◈" label="هزینه این ماه" value="1.2 M"  trend="down"    trendValue="6%"        context="ریال — نسبت به ماه قبل" />
          </div>

          {/* Row 3 — Alerts + server table */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
            {/* Alerts */}
            <div className="xl:col-span-1">
              <AlertsCard alerts={ALERTS} />
            </div>

            {/* Server table */}
            <div className="xl:col-span-2">
              <DashboardCard
                title="آخرین سرورها"
                action={<a href="/iaas/servers" className="text-[12px] text-brand hover:text-brand-hover font-medium">مشاهده همه ←</a>}
                padding={false}
              >
                {SERVERS.length === 0 ? (
                  <EmptyState icon="▣" title="هنوز سروری ایجاد نشده" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px]">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-20 py-10 text-start text-[12px] font-semibold text-text-muted">نام</th>
                          <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted">وضعیت</th>
                          <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden sm:table-cell">آدرس IP</th>
                          <th className="px-16 py-10 text-start text-[12px] font-semibold text-text-muted hidden md:table-cell">منابع</th>
                          <th className="px-16 py-10 text-end text-[12px] font-semibold text-text-muted">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SERVERS.map((s, i) => (
                          <tr key={s.id} className={`border-b border-border last:border-0 hover:bg-bg transition-colors ${i % 2 !== 0 ? "bg-bg" : ""}`}>
                            {/* Clickable server name */}
                            <td className="px-20 py-12">
                              <a href={`/iaas/servers/${s.id}`} className="text-[14px] font-medium text-brand hover:text-brand-hover hover:underline">
                                {s.name}
                              </a>
                            </td>
                            <td className="px-16 py-12">
                              <StatusBadge variant={STATUS_MAP[s.status].variant} dot>
                                {STATUS_MAP[s.status].label}
                              </StatusBadge>
                            </td>
                            <td className="px-16 py-12 hidden sm:table-cell">
                              <span className="ltr-text text-[13px] text-text-muted font-mono">{s.ip}</span>
                            </td>
                            <td className="px-16 py-12 hidden md:table-cell">
                              <span className="ltr-text text-[13px] text-text-muted">{s.vcpu} vCPU / {s.ram}GB RAM</span>
                            </td>
                            <td className="px-16 py-12 text-end">
                              <ActionMenu
                                items={[
                                  { label: "مشاهده سرور",   onClick: () => {} },
                                  { label: "کنسول",          onClick: () => {} },
                                  { label: "راه‌اندازی مجدد", onClick: () => {} },
                                  { label: "خاموش کردن",    onClick: () => {}, danger: true },
                                ]}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </DashboardCard>
            </div>
          </div>

          {/* Row 4 — Usage + billing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <DashboardCard title="مصرف منابع">
              <div className="flex flex-col gap-16">
                <ResourceBar label="سرورها"   used="12" total="20"    pct={60} />
                <ResourceBar label="IP عمومی" used="8"  total="20"    pct={40} color="#16a34a" />
                <ResourceBar label="حجم دیسک" used="750 GB" total="2000 GB" pct={37} color="#d97706" />
              </div>
            </DashboardCard>

            <DashboardCard
              title="صورتحساب ماه جاری"
              action={<a href="/billing" className="text-[12px] text-brand font-medium">جزئیات ←</a>}
            >
              <div className="flex flex-col divide-y divide-border -mx-20 -mb-20">
                {[
                  { label: "سرویس محاسبات ابری", amount: "۸۵۰٬۰۰۰" },
                  { label: "پهنای باند",          amount: "۲۲۰٬۰۰۰" },
                  { label: "فضای ذخیره‌سازی",    amount: "۱۳۰٬۰۰۰" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-20 py-10">
                    <span className="text-[13px] text-text-muted">{row.label}</span>
                    <span className="text-[13px] font-semibold text-text-main ltr-text">{row.amount} ریال</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-20 py-12 bg-bg rounded-b-20">
                  <span className="text-[14px] font-bold text-text-main">جمع کل</span>
                  <span className="text-[18px] font-bold text-brand ltr-text">۱٬۲۰۰٬۰۰۰ ریال</span>
                </div>
              </div>
            </DashboardCard>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
