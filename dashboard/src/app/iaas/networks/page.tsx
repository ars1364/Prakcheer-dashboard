"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ActionMenu from "@/components/ui/ActionMenu";
import EmptyState from "@/components/ui/EmptyState";

const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

type NetStatus = "active" | "inactive" | "building" | "error";
type Network = {
  id: string; name: string; status: NetStatus; region: string;
  cidr: string; subnetCount: number; attachedServers: number;
  floatingIps: number; shared: boolean; createdAt: string;
  bwIn: number; bwOut: number; // Mbps mock
};

const ALL_NETWORKS: Network[] = [
  { id: "net-01", name: "private-net",  status: "active",   region: "tehran",  cidr: "192.168.1.0/24", subnetCount: 2, attachedServers: 5, floatingIps: 3, shared: false, createdAt: "۱۴۰۲/۱۲/۰۱", bwIn: 320, bwOut: 180 },
  { id: "net-02", name: "db-net",       status: "active",   region: "tehran",  cidr: "10.0.0.0/24",    subnetCount: 1, attachedServers: 2, floatingIps: 0, shared: false, createdAt: "۱۴۰۲/۱۲/۰۵", bwIn: 110, bwOut: 85  },
  { id: "net-03", name: "staging-net",  status: "inactive", region: "tehran",  cidr: "172.16.0.0/24",  subnetCount: 1, attachedServers: 1, floatingIps: 1, shared: false, createdAt: "۱۴۰۳/۰۱/۱۰", bwIn: 0,   bwOut: 0   },
  { id: "net-04", name: "isf-private",  status: "active",   region: "isfahan", cidr: "192.168.2.0/24", subnetCount: 1, attachedServers: 3, floatingIps: 2, shared: false, createdAt: "۱۴۰۳/۰۲/۰۵", bwIn: 140, bwOut: 95  },
  { id: "net-05", name: "isf-mgmt",     status: "building", region: "isfahan", cidr: "10.10.0.0/24",   subnetCount: 0, attachedServers: 0, floatingIps: 0, shared: false, createdAt: "۱۴۰۳/۰۳/۰۱", bwIn: 0,   bwOut: 0   },
  { id: "net-06", name: "msh-backbone", status: "active",   region: "mashhad", cidr: "10.1.0.0/24",    subnetCount: 2, attachedServers: 2, floatingIps: 1, shared: false, createdAt: "۱۴۰۳/۰۱/۲۰", bwIn: 88,  bwOut: 72  },
  { id: "net-07", name: "msh-storage",  status: "active",   region: "mashhad", cidr: "10.1.1.0/24",    subnetCount: 1, attachedServers: 1, floatingIps: 0, shared: false, createdAt: "۱۴۰۳/۰۲/۱۵", bwIn: 45,  bwOut: 30  },
];

const NET_STATUS_MAP: Record<NetStatus, { variant: "success" | "warning" | "danger" | "info"; label: string }> = {
  active:   { variant: "success", label: "فعال"        },
  inactive: { variant: "warning", label: "غیرفعال"     },
  building: { variant: "info",    label: "در حال ساخت" },
  error:    { variant: "danger",  label: "خطا"         },
};

const STATUS_COLOR: Record<NetStatus, string> = {
  active: "#16a34a", inactive: "#d97706", building: "#3b82f6", error: "#ef4444",
};

const REGION_LABEL: Record<string, string> = { tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد" };

// Bandwidth bar component
function BwBar({ bwIn, bwOut }: { bwIn: number; bwOut: number }) {
  const max = 400;
  if (bwIn === 0 && bwOut === 0) return <span className="text-[12px] text-text-placeholder">—</span>;
  return (
    <div className="flex flex-col gap-3 min-w-[80px]">
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-text-muted w-[14px]">↓</span>
        <div className="flex-1 h-[4px] rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full bg-brand" style={{ width: `${(bwIn / max) * 100}%` }} />
        </div>
        <span className="ltr-text text-[10px] text-text-muted w-[32px] text-end">{bwIn}M</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-text-muted w-[14px]">↑</span>
        <div className="flex-1 h-[4px] rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${(bwOut / max) * 100}%`, background: "#16a34a" }} />
        </div>
        <span className="ltr-text text-[10px] text-text-muted w-[32px] text-end">{bwOut}M</span>
      </div>
    </div>
  );
}

export default function NetworksPage() {
  const [region, setRegion] = useState("all");
  const [search, setSearch] = useState("");

  const byRegion = useMemo(
    () => region === "all" ? ALL_NETWORKS : ALL_NETWORKS.filter(n => n.region === region),
    [region]
  );

  const networks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return !q ? byRegion : byRegion.filter(n => n.name.includes(q) || n.cidr.includes(q));
  }, [byRegion, search]);

  const kpis = useMemo(() => ({
    total:      byRegion.length,
    active:     byRegion.filter(n => n.status === "active").length,
    subnets:    byRegion.reduce((s, n) => s + n.subnetCount, 0),
    floatingIps:byRegion.reduce((s, n) => s + n.floatingIps, 0),
  }), [byRegion]);

  const statusPieData = useMemo(() => {
    const counts: Record<NetStatus, number> = { active: 0, inactive: 0, building: 0, error: 0 };
    byRegion.forEach(n => counts[n.status]++);
    return Object.entries(counts).filter(([, v]) => v > 0).map(([k, v]) => ({
      name: NET_STATUS_MAP[k as NetStatus].label, value: v, color: STATUS_COLOR[k as NetStatus]
    }));
  }, [byRegion]);

  // Network topology cards (visual)
  const topologyNets = byRegion.filter(n => n.status === "active").slice(0, 4);

  return (
    <DashboardShell
      title="شبکه‌ها"
      breadcrumbs={[
        { label: "پراکچیر", href: "/" },
        { label: "زیرساخت ابری", href: "/iaas" },
        { label: "شبکه‌ها" },
      ]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={(r) => { setRegion(r); setSearch(""); }}
    >
      {/* Network bandwidth header */}
      <div className="glass rounded-16 px-20 py-16 mb-4">
        <div className="flex flex-wrap gap-20 items-center">
          <div className="flex-1 min-w-[200px]">
            <p className="text-[12px] text-text-muted mb-10">پهنای باند ترکیبی شبکه‌های فعال</p>
            {[
              { label: "↓ دریافت", value: byRegion.filter(n => n.status === "active").reduce((s, n) => s + n.bwIn, 0), color: "#1a4d8f", max: 800 },
              { label: "↑ ارسال",  value: byRegion.filter(n => n.status === "active").reduce((s, n) => s + n.bwOut, 0), color: "#16a34a", max: 800 },
            ].map(bw => (
              <div key={bw.label} className="flex items-center gap-10 mb-8">
                <span className="text-[12px] text-text-muted w-[56px] shrink-0 ltr-text">{bw.label}</span>
                <div className="flex-1 h-[10px] rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((bw.value / bw.max) * 100, 100)}%`, background: bw.color }} />
                </div>
                <span className="ltr-text text-[12px] font-medium text-text-main w-[60px] text-end">{bw.value} Mbps</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {[
              { label: "کل شبکه‌ها",  count: kpis.total,       color: "#1a4d8f", bg: "rgba(26,77,143,0.08)"   },
              { label: "فعال",         count: kpis.active,      color: "#22c55e", bg: "rgba(34,197,94,0.08)"   },
              { label: "زیرشبکه‌ها",  count: kpis.subnets,     color: "#8b5cf6", bg: "rgba(139,92,246,0.08)"  },
              { label: "IP شناور",     count: kpis.floatingIps, color: "#f59e0b", bg: "rgba(245,158,11,0.08)"  },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center py-10 px-14 rounded-12" style={{ background: item.bg }}>
                <span className="text-[22px] font-bold ltr-text" style={{ color: item.color }}>{item.count}</span>
                <span className="text-[11px] text-text-muted text-center mt-2">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topology cards + Status donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <DashboardCard title="توپولوژی شبکه‌های فعال">
            {topologyNets.length === 0 ? (
              <EmptyState icon="◉" title="شبکه فعالی در این منطقه وجود ندارد" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                {topologyNets.map(net => (
                  <div key={net.id} className="rounded-12 border border-border p-16 bg-bg-muted/50 relative overflow-hidden">
                    {/* CIDR badge top-left */}
                    <div className="absolute top-0 start-0 px-10 py-4 rounded-br-8 text-[11px] font-mono ltr-text text-white"
                         style={{ background: "#1a4d8f" }}>
                      {net.cidr}
                    </div>
                    <div className="mt-16 mb-10">
                      <p className="text-[14px] font-semibold text-text-main ltr-text">{net.name}</p>
                      <p className="text-[11px] text-text-muted">{REGION_LABEL[net.region]}</p>
                    </div>
                    <div className="flex items-center gap-16">
                      <div className="text-center">
                        <p className="text-[18px] font-bold text-brand">{net.attachedServers}</p>
                        <p className="text-[10px] text-text-muted">سرور</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[18px] font-bold text-text-main">{net.subnetCount}</p>
                        <p className="text-[10px] text-text-muted">سابنت</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[18px] font-bold text-text-main">{net.floatingIps}</p>
                        <p className="text-[10px] text-text-muted">IP شناور</p>
                      </div>
                    </div>
                    {/* bandwidth mini */}
                    <div className="mt-12 pt-10 border-t border-border">
                      <BwBar bwIn={net.bwIn} bwOut={net.bwOut} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </div>

        <div className="lg:col-span-1">
          <DashboardCard title="توزیع وضعیت شبکه‌ها">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="value">
                  {statusPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(94,168,161,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "var(--font-vazirmatn)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-8">
              {statusPieData.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <span className="w-10 h-10 rounded-2 shrink-0" style={{ background: d.color }} />
                    <span className="text-[12px] text-text-muted">{d.name}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-text-main">{d.value}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Networks table */}
      <DashboardCard
        title="لیست شبکه‌ها"
        action={
          <button className="h-34 px-16 rounded-8 bg-brand text-white text-[12px] font-medium hover:bg-brand-hover transition-colors">
            ایجاد شبکه جدید
          </button>
        }
        padding={false}
      >
        <div className="flex items-center gap-10 px-16 py-12 border-b border-border">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="جستجو بر اساس نام یا CIDR..."
            className="flex-1 min-w-[200px] h-34 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main placeholder:text-text-placeholder outline-none focus:border-border-strong ltr-text"
            dir="ltr" />
        </div>

        {byRegion.length === 0 ? (
          <EmptyState icon="◉" title="در این منطقه شبکه‌ای وجود ندارد" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">نام شبکه</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">CIDR</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">وضعیت</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted hidden md:table-cell">منطقه</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted hidden lg:table-cell">سرور / سابنت / IP</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted hidden xl:table-cell">ترافیک (Mbps)</th>
                  <th className="px-16 py-10 text-[12px] font-medium text-text-muted w-10"></th>
                </tr>
              </thead>
              <tbody>
                {networks.map((n, i) => (
                  <tr key={n.id} className={`border-b border-border last:border-0 hover:bg-brand-light/30 transition-colors ${i % 2 !== 0 ? "bg-white/20" : ""}`}>
                    <td className="px-16 py-12">
                      <p className="text-[13px] font-medium text-brand ltr-text">{n.name}</p>
                      <p className="text-[11px] text-text-placeholder ltr-text">{n.id}</p>
                    </td>
                    <td className="px-16 py-12">
                      <span className="ltr-text font-mono text-[12px] px-8 py-3 rounded-6 bg-brand-subtle text-brand border border-border">{n.cidr}</span>
                    </td>
                    <td className="px-16 py-12">
                      <StatusBadge variant={NET_STATUS_MAP[n.status].variant} dot>{NET_STATUS_MAP[n.status].label}</StatusBadge>
                    </td>
                    <td className="px-16 py-12 hidden md:table-cell text-text-muted text-[13px]">{REGION_LABEL[n.region]}</td>
                    <td className="px-16 py-12 hidden lg:table-cell">
                      <span className="ltr-text text-[12px] text-text-muted">{n.attachedServers} سرور · {n.subnetCount} سابنت · {n.floatingIps} IP</span>
                    </td>
                    <td className="px-16 py-12 hidden xl:table-cell"><BwBar bwIn={n.bwIn} bwOut={n.bwOut} /></td>
                    <td className="px-16 py-12">
                      <ActionMenu items={[
                        { label: "مدیریت سابنت‌ها",   onClick: () => {} },
                        { label: "اتصال سرور",          onClick: () => {} },
                        { label: "تنظیمات شبکه",        onClick: () => {} },
                        { label: "حذف شبکه",            onClick: () => {}, danger: true },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    </DashboardShell>
  );
}
