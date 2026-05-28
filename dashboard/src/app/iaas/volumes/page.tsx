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

type VolumeStatus = "attached" | "available" | "creating" | "error";
type VolumeType = "SSD" | "HDD" | "NVMe";

interface Volume {
  id: string;
  name: string;
  size: number;
  type: VolumeType;
  status: VolumeStatus;
  region: string;
  attachedTo: string | null;
  created: string;
  iops: number;
}

const ALL_VOLUMES: Volume[] = [
  { id: "vol-001", name: "دیسک-وب-اصلی", size: 100, type: "SSD", status: "attached", region: "tehran", attachedTo: "srv-01", created: "۱۴۰۳/۰۱/۱۰", iops: 3000 },
  { id: "vol-002", name: "دیسک-دیتابیس-تهران", size: 500, type: "NVMe", status: "attached", region: "tehran", attachedTo: "srv-02", created: "۱۴۰۳/۰۱/۱۲", iops: 16000 },
  { id: "vol-003", name: "دیسک-بکاپ-۱", size: 200, type: "HDD", status: "available", region: "tehran", attachedTo: null, created: "۱۴۰۳/۰۲/۰۵", iops: 500 },
  { id: "vol-004", name: "دیسک-لود-بالانسر", size: 50, type: "SSD", status: "attached", region: "tehran", attachedTo: "srv-10", created: "۱۴۰۳/۰۳/۰۱", iops: 3000 },
  { id: "vol-005", name: "دیسک-وب-اصفهان", size: 80, type: "SSD", status: "attached", region: "isfahan", attachedTo: "srv-03", created: "۱۴۰۳/۰۱/۲۰", iops: 3000 },
  { id: "vol-006", name: "دیسک-دیتابیس-اصفهان", size: 250, type: "NVMe", status: "attached", region: "isfahan", attachedTo: "srv-04", created: "۱۴۰۳/۰۱/۲۲", iops: 16000 },
  { id: "vol-007", name: "دیسک-آزاد-اصفهان", size: 100, type: "SSD", status: "available", region: "isfahan", attachedTo: null, created: "۱۴۰۳/۰۲/۱۵", iops: 3000 },
  { id: "vol-008", name: "دیسک-وب-مشهد", size: 60, type: "SSD", status: "attached", region: "mashhad", attachedTo: "srv-07", created: "۱۴۰۳/۰۲/۰۱", iops: 3000 },
  { id: "vol-009", name: "دیسک-بکاپ-مشهد", size: 400, type: "HDD", status: "available", region: "mashhad", attachedTo: null, created: "۱۴۰۳/۰۲/۱۰", iops: 500 },
  { id: "vol-010", name: "دیسک-در-حال-ساخت", size: 150, type: "SSD", status: "creating", region: "tehran", attachedTo: null, created: "۱۴۰۳/۰۳/۰۵", iops: 3000 },
  { id: "vol-011", name: "دیسک-خراب", size: 200, type: "SSD", status: "error", region: "mashhad", attachedTo: null, created: "۱۴۰۳/۰۲/۲۵", iops: 3000 },
  { id: "vol-012", name: "دیسک-کش-تهران", size: 50, type: "NVMe", status: "attached", region: "tehran", attachedTo: "srv-11", created: "۱۴۰۳/۰۳/۰۲", iops: 16000 },
];

const STATUS_LABEL: Record<VolumeStatus, string> = {
  attached: "متصل",
  available: "آزاد",
  creating: "در حال ساخت",
  error: "خطا",
};

const STATUS_VARIANT: Record<VolumeStatus, "success" | "info" | "warning" | "danger"> = {
  attached: "success",
  available: "info",
  creating: "warning",
  error: "danger",
};

const TYPE_COLOR: Record<VolumeType, string> = {
  NVMe: "text-brand",
  SSD: "text-success",
  HDD: "text-text-muted",
};

export default function VolumesPage() {
  const [region, setRegion] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const byRegion = useMemo(
    () => region === "all" ? ALL_VOLUMES : ALL_VOLUMES.filter(v => v.region === region),
    [region]
  );

  const filtered = useMemo(() => {
    return byRegion.filter(v => {
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (typeFilter !== "all" && v.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!v.id.toLowerCase().includes(q) && !v.name.includes(search) && !(v.attachedTo && v.attachedTo.includes(q))) return false;
      }
      return true;
    });
  }, [byRegion, statusFilter, typeFilter, search]);

  const kpis = useMemo(() => ({
    total: byRegion.length,
    totalGB: byRegion.reduce((s, v) => s + v.size, 0),
    attached: byRegion.filter(v => v.status === "attached").length,
    available: byRegion.filter(v => v.status === "available").length,
  }), [byRegion]);

  const regionLabel = (r: string) => ({ tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد" }[r] ?? r);

  return (
    <DashboardShell
      title="دیسک‌ها"
      breadcrumbs={[
        { label: "پراکچیر", href: "/" },
        { label: "زیرساخت ابری", href: "/iaas" },
        { label: "دیسک‌ها" },
      ]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={setRegion}
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <MetricCard icon="💾" label="کل دیسک‌ها" value={String(kpis.total)} />
        <MetricCard icon="📦" label="فضای کل (GB)" value={kpis.totalGB.toLocaleString("fa-IR")} />
        <MetricCard icon="🔗" label="متصل" value={String(kpis.attached)} />
        <MetricCard icon="◎" label="آزاد" value={String(kpis.available)} />
      </div>

      {/* Filter bar */}
      <div className="glass rounded-12 px-16 py-12 mb-20 flex flex-wrap gap-12 items-center">
        <input
          type="text"
          placeholder="جستجو در دیسک‌ها..."
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
          <option value="attached">متصل</option>
          <option value="available">آزاد</option>
          <option value="creating">در حال ساخت</option>
          <option value="error">خطا</option>
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none focus:border-border-strong cursor-pointer"
          dir="rtl"
        >
          <option value="all">همه انواع</option>
          <option value="NVMe">NVMe</option>
          <option value="SSD">SSD</option>
          <option value="HDD">HDD</option>
        </select>
        {(search || statusFilter !== "all" || typeFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}
            className="h-34 px-14 rounded-8 text-[13px] text-brand border border-border hover:border-border-strong transition-colors bg-white/40"
          >
            پاک کردن فیلترها
          </button>
        )}
        <button className="h-34 px-16 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors ms-auto">
          ساخت دیسک جدید
        </button>
      </div>

      {/* Volumes table */}
      <DashboardCard padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">نام دیسک</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">نوع</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">حجم (GB)</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">IOPS</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">وضعیت</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">متصل به</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">منطقه</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">تاریخ ساخت</th>
                <th className="px-16 py-12 text-[12px] font-medium text-text-muted w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-40 text-text-muted text-[13px]">
                    دیسکی یافت نشد
                  </td>
                </tr>
              ) : (
                filtered.map((vol, i) => (
                  <tr
                    key={vol.id}
                    className={`border-b border-border last:border-0 hover:bg-brand-light/40 transition-colors ${i % 2 === 0 ? "" : "bg-white/20"}`}
                  >
                    <td className="px-16 py-12">
                      <div>
                        <p className="text-text-main font-medium">{vol.name}</p>
                        <p className="text-[11px] text-text-muted ltr-text">{vol.id}</p>
                      </div>
                    </td>
                    <td className="px-16 py-12">
                      <span className={`font-semibold text-[12px] ltr-text ${TYPE_COLOR[vol.type]}`}>{vol.type}</span>
                    </td>
                    <td className="px-16 py-12 ltr-text font-medium text-text-main">{vol.size}</td>
                    <td className="px-16 py-12 ltr-text text-text-muted">{vol.iops.toLocaleString()}</td>
                    <td className="px-16 py-12">
                      <StatusBadge variant={STATUS_VARIANT[vol.status]}>
                        {STATUS_LABEL[vol.status]}
                      </StatusBadge>
                    </td>
                    <td className="px-16 py-12">
                      {vol.attachedTo
                        ? <span className="ltr-text text-brand font-mono text-[12px]">{vol.attachedTo}</span>
                        : <span className="text-text-placeholder">—</span>}
                    </td>
                    <td className="px-16 py-12 text-text-muted">{regionLabel(vol.region)}</td>
                    <td className="px-16 py-12 ltr-text text-text-muted">{vol.created}</td>
                    <td className="px-16 py-12">
                      <ActionMenu items={[
                        { label: "اتصال به سرور", onClick: () => {} },
                        { label: "تغییر اندازه", onClick: () => {} },
                        { label: "ساخت اسنپ‌شات", onClick: () => {} },
                        { label: "حذف دیسک", onClick: () => {}, danger: true },
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
