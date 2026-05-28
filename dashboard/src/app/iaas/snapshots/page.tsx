"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import MetricCard from "@/components/ui/MetricCard";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ActionMenu from "@/components/ui/ActionMenu";

const REGIONS = [
  { id: "all", label: "همه مناطق" },
  { id: "tehran", label: "تهران" },
  { id: "isfahan", label: "اصفهان" },
  { id: "mashhad", label: "مشهد" },
];

type SnapshotStatus = "available" | "creating" | "error" | "deleting";
type SnapshotSource = "server" | "volume";

interface Snapshot {
  id: string;
  name: string;
  source: SnapshotSource;
  sourceId: string;
  size: number;
  status: SnapshotStatus;
  region: string;
  created: string;
  description: string | null;
  autoSnapshot: boolean;
}

const ALL_SNAPSHOTS: Snapshot[] = [
  { id: "snap-001", name: "وب-اصلی-۱۴۰۳۰۳۰۴", source: "server", sourceId: "srv-01", size: 22, status: "available", region: "tehran", created: "۱۴۰۳/۰۳/۰۴ ۰۳:۰۰", description: "اسنپ‌شات خودکار شبانه", autoSnapshot: true },
  { id: "snap-002", name: "دیتابیس-تهران-۱۴۰۳۰۳۰۴", source: "volume", sourceId: "vol-002", size: 108, status: "available", region: "tehran", created: "۱۴۰۳/۰۳/۰۴ ۰۳:۰۵", description: "بکاپ قبل از مهاجرت", autoSnapshot: false },
  { id: "snap-003", name: "وب-اصلی-۱۴۰۳۰۳۰۳", source: "server", sourceId: "srv-01", size: 22, status: "available", region: "tehran", created: "۱۴۰۳/۰۳/۰۳ ۰۳:۰۰", description: null, autoSnapshot: true },
  { id: "snap-004", name: "سرور-جدید-در-حال-ساخت", source: "server", sourceId: "srv-10", size: 0, status: "creating", region: "tehran", created: "۱۴۰۳/۰۳/۰۵ ۱۱:۳۴", description: null, autoSnapshot: false },
  { id: "snap-005", name: "وب-اصفهان-۱۴۰۳۰۳۰۳", source: "server", sourceId: "srv-03", size: 18, status: "available", region: "isfahan", created: "۱۴۰۳/۰۳/۰۳ ۰۳:۰۰", description: null, autoSnapshot: true },
  { id: "snap-006", name: "دیتابیس-اصفهان-بکاپ", source: "volume", sourceId: "vol-006", size: 62, status: "available", region: "isfahan", created: "۱۴۰۳/۰۲/۲۸ ۱۴:۲۲", description: "بکاپ دستی قبل از آپدیت", autoSnapshot: false },
  { id: "snap-007", name: "سرور-خراب-اصفهان", source: "server", sourceId: "srv-04", size: 40, status: "error", region: "isfahan", created: "۱۴۰۳/۰۳/۰۱ ۰۹:۱۵", description: "خطا در ساخت اسنپ‌شات", autoSnapshot: false },
  { id: "snap-008", name: "وب-مشهد-۱۴۰۳۰۳۰۳", source: "server", sourceId: "srv-07", size: 15, status: "available", region: "mashhad", created: "۱۴۰۳/۰۳/۰۳ ۰۳:۰۰", description: null, autoSnapshot: true },
  { id: "snap-009", name: "بکاپ-مشهد-پیش-از-مهاجرت", source: "volume", sourceId: "vol-009", size: 85, status: "available", region: "mashhad", created: "۱۴۰۳/۰۲/۲۵ ۱۶:۴۸", description: "قبل از انتقال داده", autoSnapshot: false },
  { id: "snap-010", name: "در-حال-حذف-قدیمی", source: "server", sourceId: "srv-05", size: 20, status: "deleting", region: "tehran", created: "۱۴۰۳/۰۱/۱۵ ۰۳:۰۰", description: null, autoSnapshot: true },
];

const STATUS_LABEL: Record<SnapshotStatus, string> = {
  available: "موجود",
  creating: "در حال ساخت",
  error: "خطا",
  deleting: "در حال حذف",
};

const STATUS_VARIANT: Record<SnapshotStatus, "success" | "warning" | "danger" | "info"> = {
  available: "success",
  creating: "warning",
  error: "danger",
  deleting: "info",
};

export default function SnapshotsPage() {
  const [region, setRegion] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const byRegion = useMemo(
    () => region === "all" ? ALL_SNAPSHOTS : ALL_SNAPSHOTS.filter(s => s.region === region),
    [region]
  );

  const filtered = useMemo(() => {
    return byRegion.filter(s => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (sourceFilter !== "all" && s.source !== sourceFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!s.id.toLowerCase().includes(q) && !s.name.includes(search) && !s.sourceId.includes(q)) return false;
      }
      return true;
    });
  }, [byRegion, statusFilter, sourceFilter, search]);

  const kpis = useMemo(() => ({
    total: byRegion.length,
    totalGB: byRegion.reduce((s, snap) => s + snap.size, 0),
    auto: byRegion.filter(s => s.autoSnapshot).length,
    error: byRegion.filter(s => s.status === "error").length,
  }), [byRegion]);

  const regionLabel = (r: string) => ({ tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد" }[r] ?? r);

  return (
    <DashboardShell
      title="اسنپ‌شات‌ها"
      breadcrumbs={[
        { label: "پراکچیر", href: "/" },
        { label: "زیرساخت ابری", href: "/iaas" },
        { label: "اسنپ‌شات‌ها" },
      ]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={setRegion}
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <MetricCard icon="📸" label="کل اسنپ‌شات‌ها" value={String(kpis.total)} />
        <MetricCard icon="📦" label="فضای مصرفی (GB)" value={kpis.totalGB.toLocaleString("fa-IR")} />
        <MetricCard icon="🔄" label="خودکار" value={String(kpis.auto)} />
        <MetricCard icon="⚠️" label="خطا" value={String(kpis.error)} />
      </div>

      {/* Filter bar */}
      <div className="glass rounded-12 px-16 py-12 mb-20 flex flex-wrap gap-12 items-center">
        <input
          type="text"
          placeholder="جستجو در اسنپ‌شات‌ها..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] h-34 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main placeholder:text-text-placeholder outline-none focus:border-border-strong"
          dir="rtl"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none focus:border-border-strong cursor-pointer"
          dir="rtl"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="available">موجود</option>
          <option value="creating">در حال ساخت</option>
          <option value="error">خطا</option>
          <option value="deleting">در حال حذف</option>
        </select>
        <select
          value={sourceFilter}
          onChange={e => setSourceFilter(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none focus:border-border-strong cursor-pointer"
          dir="rtl"
        >
          <option value="all">همه منابع</option>
          <option value="server">سرور</option>
          <option value="volume">دیسک</option>
        </select>
        {(search || statusFilter !== "all" || sourceFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); setSourceFilter("all"); }}
            className="h-34 px-14 rounded-8 text-[13px] text-brand border border-border hover:border-border-strong transition-colors bg-white/40"
          >
            پاک کردن فیلترها
          </button>
        )}
        <button className="h-34 px-16 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors ms-auto">
          ساخت اسنپ‌شات
        </button>
      </div>

      {/* Snapshots table */}
      <DashboardCard padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">نام اسنپ‌شات</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">منبع</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">شناسه منبع</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">حجم (GB)</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">وضعیت</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">نوع</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">منطقه</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">تاریخ ساخت</th>
                <th className="px-16 py-12 text-[12px] font-medium text-text-muted w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-40 text-text-muted text-[13px]">
                    اسنپ‌شاتی یافت نشد
                  </td>
                </tr>
              ) : (
                filtered.map((snap, i) => (
                  <tr
                    key={snap.id}
                    className={`border-b border-border last:border-0 hover:bg-brand-light/40 transition-colors ${i % 2 === 0 ? "" : "bg-white/20"}`}
                  >
                    <td className="px-16 py-12">
                      <div>
                        <p className="text-text-main font-medium">{snap.name}</p>
                        {snap.description && (
                          <p className="text-[11px] text-text-muted mt-2">{snap.description}</p>
                        )}
                        <p className="text-[11px] text-text-placeholder ltr-text">{snap.id}</p>
                      </div>
                    </td>
                    <td className="px-16 py-12">
                      <span className={`text-[12px] px-8 py-3 rounded-6 border border-border ${snap.source === "server" ? "bg-brand-subtle text-brand" : "bg-bg-muted text-text-muted"}`}>
                        {snap.source === "server" ? "سرور" : "دیسک"}
                      </span>
                    </td>
                    <td className="px-16 py-12 ltr-text text-brand font-mono text-[12px]">{snap.sourceId}</td>
                    <td className="px-16 py-12 ltr-text font-medium text-text-main">
                      {snap.size > 0 ? snap.size : <span className="text-text-placeholder">—</span>}
                    </td>
                    <td className="px-16 py-12">
                      <StatusBadge variant={STATUS_VARIANT[snap.status]}>
                        {STATUS_LABEL[snap.status]}
                      </StatusBadge>
                    </td>
                    <td className="px-16 py-12">
                      {snap.autoSnapshot ? (
                        <span className="text-[11px] text-success">خودکار</span>
                      ) : (
                        <span className="text-[11px] text-text-muted">دستی</span>
                      )}
                    </td>
                    <td className="px-16 py-12 text-text-muted">{regionLabel(snap.region)}</td>
                    <td className="px-16 py-12 ltr-text text-text-muted text-[12px]">{snap.created}</td>
                    <td className="px-16 py-12">
                      <ActionMenu items={[
                        { label: "بازیابی سرور", onClick: () => {} },
                        { label: "ساخت سرور جدید", onClick: () => {} },
                        { label: "تغییر نام", onClick: () => {} },
                        { label: "حذف اسنپ‌شات", onClick: () => {}, danger: true },
                      ]} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
