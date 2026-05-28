"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ActionMenu from "@/components/ui/ActionMenu";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

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
  trafficIn: number;
  trafficOut: number;
}

const ALL_IPS: FloatingIP[] = [
  { id: "fip-001", ip: "185.47.22.10", rdns: "web1.tehran.prakcheer.io", status: "attached", region: "tehran", attachedTo: "srv-01", bandwidth: "1 Gbps", created: "۱۴۰۳/۰۱/۱۰", trafficIn: 1240, trafficOut: 890 },
  { id: "fip-002", ip: "185.47.22.11", rdns: "api.tehran.prakcheer.io", status: "attached", region: "tehran", attachedTo: "srv-02", bandwidth: "1 Gbps", created: "۱۴۰۳/۰۱/۱۲", trafficIn: 880, trafficOut: 2100 },
  { id: "fip-003", ip: "185.47.22.15", rdns: null, status: "unattached", region: "tehran", attachedTo: null, bandwidth: "1 Gbps", created: "۱۴۰۳/۰۲/۰۵", trafficIn: 0, trafficOut: 0 },
  { id: "fip-004", ip: "185.47.22.20", rdns: "lb.tehran.prakcheer.io", status: "attached", region: "tehran", attachedTo: "srv-10", bandwidth: "10 Gbps", created: "۱۴۰۳/۰۳/۰۱", trafficIn: 5600, trafficOut: 4200 },
  { id: "fip-005", ip: "5.22.187.10", rdns: "web1.isfahan.prakcheer.io", status: "attached", region: "isfahan", attachedTo: "srv-03", bandwidth: "1 Gbps", created: "۱۴۰۳/۰۱/۲۰", trafficIn: 760, trafficOut: 540 },
  { id: "fip-006", ip: "5.22.187.11", rdns: null, status: "unattached", region: "isfahan", attachedTo: null, bandwidth: "1 Gbps", created: "۱۴۰۳/۰۲/۱۵", trafficIn: 0, trafficOut: 0 },
  { id: "fip-007", ip: "5.22.187.50", rdns: "reserved.isfahan.node", status: "reserved", region: "isfahan", attachedTo: null, bandwidth: "1 Gbps", created: "۱۴۰۳/۰۳/۰۳", trafficIn: 0, trafficOut: 0 },
  { id: "fip-008", ip: "91.98.44.10", rdns: "web1.mashhad.prakcheer.io", status: "attached", region: "mashhad", attachedTo: "srv-07", bandwidth: "1 Gbps", created: "۱۴۰۳/۰۲/۰۱", trafficIn: 480, trafficOut: 320 },
  { id: "fip-009", ip: "91.98.44.11", rdns: null, status: "unattached", region: "mashhad", attachedTo: null, bandwidth: "1 Gbps", created: "۱۴۰۳/۰۲/۱۸", trafficIn: 0, trafficOut: 0 },
  { id: "fip-010", ip: "185.47.22.99", rdns: "monitor.tehran.prakcheer.io", status: "attached", region: "tehran", attachedTo: "srv-05", bandwidth: "1 Gbps", created: "۱۴۰۳/۰۳/۰۴", trafficIn: 210, trafficOut: 180 },
];

const REGION_ALLOC = [
  { name: "تهران", attached: 4, free: 1, reserved: 0 },
  { name: "اصفهان", attached: 1, free: 1, reserved: 1 },
  { name: "مشهد", attached: 1, free: 1, reserved: 0 },
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

const STATUS_COLOR: Record<IPStatus, string> = {
  attached: "#22c55e",
  unattached: "#94a3b8",
  reserved: "#f59e0b",
};

function TrafficBar({ inn, out }: { inn: number; out: number }) {
  const max = Math.max(inn, out, 1);
  return (
    <div className="flex flex-col gap-2 w-[72px]">
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-text-muted w-8">↓</span>
        <div className="flex-1 h-4 rounded-full bg-bg-muted overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${(inn / max) * 100}%`, background: "#3b82f6" }} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-text-muted w-8">↑</span>
        <div className="flex-1 h-4 rounded-full bg-bg-muted overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${(out / max) * 100}%`, background: "#8b5cf6" }} />
        </div>
      </div>
    </div>
  );
}

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

  const pieData = useMemo(() => [
    { name: "متصل", value: kpis.attached, color: "#22c55e" },
    { name: "آزاد", value: kpis.free, color: "#94a3b8" },
    { name: "رزرو", value: kpis.reserved, color: "#f59e0b" },
  ].filter(d => d.value > 0), [kpis]);

  const regionLabel = (r: string) => ({ tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد" }[r] ?? r);

  const fontStyle = { fontFamily: "var(--font-vazirmatn)", fontSize: 11 };

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
      {/* IP allocation header */}
      <div className="glass rounded-16 px-20 py-16 mb-4">
        <div className="flex items-center justify-between mb-10">
          <span className="text-[13px] font-medium text-text-muted">تخصیص IP شناور</span>
          <span className="ltr-text text-[14px] font-bold text-text-main">
            {kpis.attached} <span className="text-text-muted font-normal text-[13px]">از</span> {kpis.total} IP متصل
          </span>
        </div>
        <div className="flex h-12 rounded-full overflow-hidden gap-[2px] mb-14">
          {kpis.attached > 0 && <div style={{ flex: kpis.attached, background: "#22c55e" }} title="متصل" />}
          {kpis.free > 0     && <div style={{ flex: kpis.free,     background: "#94a3b8" }} title="آزاد" />}
          {kpis.reserved > 0 && <div style={{ flex: kpis.reserved, background: "#f59e0b" }} title="رزرو" />}
        </div>
        <div className="flex flex-wrap gap-10">
          {[
            { label: "متصل",   count: kpis.attached, color: "#22c55e", bg: "rgba(34,197,94,0.08)"   },
            { label: "آزاد",   count: kpis.free,     color: "#94a3b8", bg: "rgba(148,163,184,0.1)"  },
            { label: "رزرو",   count: kpis.reserved, color: "#f59e0b", bg: "rgba(245,158,11,0.08)"  },
            { label: "کل",     count: kpis.total,    color: "#1a4d8f", bg: "rgba(26,77,143,0.08)"   },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-10 flex-1 min-w-[100px] rounded-12 px-14 py-10" style={{ background: item.bg }}>
              <span className="text-[26px] font-bold ltr-text" style={{ color: item.color }}>{item.count}</span>
              <span className="text-[12px] text-text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mb-24">

        {/* IP allocation visual grid */}
        <DashboardCard title="نقشه تخصیص IP">
          <div className="mb-10">
            <p className="text-[11px] text-text-muted mb-12">هر مربع یک IP شناور است</p>
            <div className="flex flex-wrap gap-6">
              {byRegion.map(ip => (
                <div
                  key={ip.id}
                  title={`${ip.ip}${ip.attachedTo ? ` → ${ip.attachedTo}` : ""}`}
                  className="w-20 h-20 rounded-4 cursor-default transition-transform hover:scale-125"
                  style={{ background: STATUS_COLOR[ip.status] }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-12 mt-14 flex-wrap">
            {Object.entries(STATUS_COLOR).map(([st, col]) => (
              <div key={st} className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-2" style={{ background: col }} />
                <span className="text-[11px] text-text-muted">{STATUS_LABEL[st as IPStatus]}</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Status distribution donut */}
        <DashboardCard title="توزیع وضعیت">
          <div className="h-[160px] ltr-text">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  dataKey="value"
                  strokeWidth={2}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 8, ...fontStyle }}
                  formatter={(v: number, n: string) => [`${v} IP`, n]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-6 mt-8">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-2" style={{ background: d.color }} />
                  <span className="text-[12px] text-text-muted">{d.name}</span>
                </div>
                <span className="text-[12px] font-semibold text-text-main ltr-text">{d.value}</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Allocation by region stacked bar */}
        <DashboardCard title="تخصیص بر اساس منطقه">
          <div className="h-[200px] ltr-text">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGION_ALLOC} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.55} />
                  </linearGradient>
                  <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.55} />
                  </linearGradient>
                  <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={fontStyle} axisLine={false} tickLine={false} />
                <YAxis tick={fontStyle} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 8, ...fontStyle }}
                />
                <Bar dataKey="attached" name="متصل" stackId="a" fill="url(#barGrad1)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="free" name="آزاد" stackId="a" fill="url(#barGrad2)" />
                <Bar dataKey="reserved" name="رزرو" stackId="a" fill="url(#barGrad3)" radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ ...fontStyle, paddingTop: 8 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
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
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">ترافیک (MB)</th>
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
                      <div className="flex items-center gap-8">
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0"
                          style={{ background: STATUS_COLOR[fip.status] }}
                        />
                        <div>
                          <span className="ltr-text font-mono font-semibold text-text-main">{fip.ip}</span>
                          <p className="text-[11px] text-text-muted ltr-text">{fip.id}</p>
                        </div>
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
                    <td className="px-16 py-12">
                      {fip.trafficIn > 0 || fip.trafficOut > 0
                        ? <TrafficBar inn={fip.trafficIn} out={fip.trafficOut} />
                        : <span className="text-text-placeholder text-[12px]">—</span>}
                    </td>
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
