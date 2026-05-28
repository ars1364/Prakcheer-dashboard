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

type IPStatus = "attached" | "unattached" | "reserved";

interface FloatingIP {
  id: string;
  ip: string;
  rdns: string | null;
  status: IPStatus;
  region: string;
  attachedTo: string | null;
  bandwidth: string;
  created: string;
}

const ALL_IPS: FloatingIP[] = [
  { id: "fip-001", ip: "185.47.22.10", rdns: "web1.tehran.prakcheer.io", status: "attached", region: "tehran", attachedTo: "srv-01", bandwidth: "1 Gbps", created: "۱۴۰۳/۰۱/۱۰" },
  { id: "fip-002", ip: "185.47.22.11", rdns: "api.tehran.prakcheer.io", status: "attached", region: "tehran", attachedTo: "srv-02", bandwidth: "1 Gbps", created: "۱۴۰۳/۰۱/۱۲" },
  { id: "fip-003", ip: "185.47.22.15", rdns: null, status: "unattached", region: "tehran", attachedTo: null, bandwidth: "1 Gbps", created: "۱۴۰۳/۰۲/۰۵" },
  { id: "fip-004", ip: "185.47.22.20", rdns: "lb.tehran.prakcheer.io", status: "attached", region: "tehran", attachedTo: "srv-10", bandwidth: "10 Gbps", created: "۱۴۰۳/۰۳/۰۱" },
  { id: "fip-005", ip: "5.22.187.10", rdns: "web1.isfahan.prakcheer.io", status: "attached", region: "isfahan", attachedTo: "srv-03", bandwidth: "1 Gbps", created: "۱۴۰۳/۰۱/۲۰" },
  { id: "fip-006", ip: "5.22.187.11", rdns: null, status: "unattached", region: "isfahan", attachedTo: null, bandwidth: "1 Gbps", created: "۱۴۰۳/۰۲/۱۵" },
  { id: "fip-007", ip: "5.22.187.50", rdns: "reserved.isfahan.node", status: "reserved", region: "isfahan", attachedTo: null, bandwidth: "1 Gbps", created: "۱۴۰۳/۰۳/۰۳" },
  { id: "fip-008", ip: "91.98.44.10", rdns: "web1.mashhad.prakcheer.io", status: "attached", region: "mashhad", attachedTo: "srv-07", bandwidth: "1 Gbps", created: "۱۴۰۳/۰۲/۰۱" },
  { id: "fip-009", ip: "91.98.44.11", rdns: null, status: "unattached", region: "mashhad", attachedTo: null, bandwidth: "1 Gbps", created: "۱۴۰۳/۰۲/۱۸" },
  { id: "fip-010", ip: "185.47.22.99", rdns: "monitor.tehran.prakcheer.io", status: "attached", region: "tehran", attachedTo: "srv-05", bandwidth: "1 Gbps", created: "۱۴۰۳/۰۳/۰۴" },
];

const STATUS_LABEL: Record<IPStatus, string> = {
  attached: "متصل",
  unattached: "آزاد",
  reserved: "رزرو",
};

const STATUS_VARIANT: Record<IPStatus, "success" | "info" | "warning"> = {
  attached: "success",
  unattached: "info",
  reserved: "warning",
};

export default function FloatingIPsPage() {
  const [region, setRegion] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const byRegion = useMemo(
    () => region === "all" ? ALL_IPS : ALL_IPS.filter(ip => ip.region === region),
    [region]
  );

  const filtered = useMemo(() => {
    return byRegion.filter(ip => {
      if (statusFilter !== "all" && ip.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!ip.ip.includes(q) && !(ip.rdns && ip.rdns.includes(q)) && !(ip.attachedTo && ip.attachedTo.includes(q))) return false;
      }
      return true;
    });
  }, [byRegion, statusFilter, search]);

  const kpis = useMemo(() => ({
    total: byRegion.length,
    attached: byRegion.filter(ip => ip.status === "attached").length,
    free: byRegion.filter(ip => ip.status === "unattached").length,
    reserved: byRegion.filter(ip => ip.status === "reserved").length,
  }), [byRegion]);

  const regionLabel = (r: string) => ({ tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد" }[r] ?? r);

  return (
    <DashboardShell
      title="IP شناور"
      breadcrumbs={[
        { label: "پراکچیر", href: "/" },
        { label: "زیرساخت ابری", href: "/iaas" },
        { label: "IP شناور" },
      ]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={setRegion}
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <MetricCard icon="🌐" label="کل IP شناور" value={String(kpis.total)} />
        <MetricCard icon="🔗" label="متصل" value={String(kpis.attached)} />
        <MetricCard icon="◎" label="آزاد" value={String(kpis.free)} />
        <MetricCard icon="📌" label="رزرو شده" value={String(kpis.reserved)} />
      </div>

      {/* Filter bar */}
      <div className="glass rounded-12 px-16 py-12 mb-20 flex flex-wrap gap-12 items-center">
        <input
          type="text"
          placeholder="جستجو بر اساس IP، rDNS یا سرور..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] h-34 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main placeholder:text-text-placeholder outline-none focus:border-border-strong ltr-text"
          dir="ltr"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none focus:border-border-strong cursor-pointer"
          dir="rtl"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="attached">متصل</option>
          <option value="unattached">آزاد</option>
          <option value="reserved">رزرو</option>
        </select>
        {(search || statusFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); }}
            className="h-34 px-14 rounded-8 text-[13px] text-brand border border-border hover:border-border-strong transition-colors bg-white/40"
          >
            پاک کردن فیلترها
          </button>
        )}
        <button className="h-34 px-16 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors ms-auto">
          درخواست IP جدید
        </button>
      </div>

      {/* IPs table */}
      <DashboardCard padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">آدرس IP</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">rDNS</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">وضعیت</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">متصل به</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">پهنای باند</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">منطقه</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">تاریخ ساخت</th>
                <th className="px-16 py-12 text-[12px] font-medium text-text-muted w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-40 text-text-muted text-[13px]">
                    IP شناوری یافت نشد
                  </td>
                </tr>
              ) : (
                filtered.map((fip, i) => (
                  <tr
                    key={fip.id}
                    className={`border-b border-border last:border-0 hover:bg-brand-light/40 transition-colors ${i % 2 === 0 ? "" : "bg-white/20"}`}
                  >
                    <td className="px-16 py-12">
                      <div>
                        <span className="ltr-text font-mono font-semibold text-text-main">{fip.ip}</span>
                        <p className="text-[11px] text-text-muted ltr-text">{fip.id}</p>
                      </div>
                    </td>
                    <td className="px-16 py-12">
                      {fip.rdns
                        ? <span className="ltr-text text-[12px] text-text-muted font-mono">{fip.rdns}</span>
                        : <span className="text-text-placeholder">—</span>}
                    </td>
                    <td className="px-16 py-12">
                      <StatusBadge variant={STATUS_VARIANT[fip.status]}>
                        {STATUS_LABEL[fip.status]}
                      </StatusBadge>
                    </td>
                    <td className="px-16 py-12">
                      {fip.attachedTo
                        ? <span className="ltr-text text-brand font-mono text-[12px]">{fip.attachedTo}</span>
                        : <span className="text-text-placeholder">—</span>}
                    </td>
                    <td className="px-16 py-12 ltr-text text-text-muted">{fip.bandwidth}</td>
                    <td className="px-16 py-12 text-text-muted">{regionLabel(fip.region)}</td>
                    <td className="px-16 py-12 ltr-text text-text-muted">{fip.created}</td>
                    <td className="px-16 py-12">
                      <ActionMenu items={[
                        { label: "اتصال به سرور", onClick: () => {} },
                        { label: "ویرایش rDNS", onClick: () => {} },
                        { label: "جدا کردن", onClick: () => {}, danger: false },
                        { label: "آزادسازی IP", onClick: () => {}, danger: true },
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
