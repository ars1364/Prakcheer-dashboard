"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
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

type ServerStatus = "running" | "stopped" | "building" | "error";
type Server = {
  id: string; name: string; status: ServerStatus;
  region: string; ip: string; vcpu: number; ram: number;
  disk: number; createdAt: string; cpu: number; ramUsed: number; uptime: string;
};

const ALL_SERVERS: Server[] = [
  { id: "srv-01", name: "web-prod-01",    status: "running",  region: "tehran",  ip: "185.94.97.211", vcpu: 4, ram: 8,  disk: 80,   createdAt: "۱۴۰۳/۰۱/۱۵", cpu: 62, ramUsed: 71, uptime: "47 روز" },
  { id: "srv-02", name: "api-staging",    status: "stopped",  region: "tehran",  ip: "185.94.97.212", vcpu: 2, ram: 4,  disk: 40,   createdAt: "۱۴۰۳/۰۱/۲۰", cpu: 0,  ramUsed: 0,  uptime: "—"      },
  { id: "srv-03", name: "db-primary",     status: "running",  region: "tehran",  ip: "185.94.97.213", vcpu: 8, ram: 16, disk: 500,  createdAt: "۱۴۰۲/۱۲/۰۵", cpu: 41, ramUsed: 83, uptime: "112 روز"},
  { id: "srv-04", name: "monitoring-thl", status: "building", region: "tehran",  ip: "185.94.97.214", vcpu: 2, ram: 4,  disk: 40,   createdAt: "۱۴۰۳/۰۳/۰۱", cpu: 5,  ramUsed: 22, uptime: "—"      },
  { id: "srv-05", name: "web-prod-isf",   status: "running",  region: "isfahan", ip: "192.168.10.51", vcpu: 4, ram: 8,  disk: 80,   createdAt: "۱۴۰۳/۰۲/۱۰", cpu: 38, ramUsed: 55, uptime: "22 روز" },
  { id: "srv-06", name: "cache-isf",      status: "running",  region: "isfahan", ip: "192.168.10.52", vcpu: 2, ram: 4,  disk: 40,   createdAt: "۱۴۰۳/۰۲/۱۵", cpu: 18, ramUsed: 44, uptime: "17 روز" },
  { id: "srv-07", name: "worker-isf",     status: "error",    region: "isfahan", ip: "192.168.10.53", vcpu: 2, ram: 4,  disk: 40,   createdAt: "۱۴۰۳/۰۲/۲۰", cpu: 0,  ramUsed: 0,  uptime: "—"      },
  { id: "srv-08", name: "db-replica-msh", status: "running",  region: "mashhad", ip: "10.20.30.101",  vcpu: 4, ram: 8,  disk: 200,  createdAt: "۱۴۰۳/۰۱/۲۵", cpu: 29, ramUsed: 61, uptime: "35 روز" },
  { id: "srv-09", name: "cdn-node-msh",   status: "running",  region: "mashhad", ip: "10.20.30.102",  vcpu: 2, ram: 4,  disk: 40,   createdAt: "۱۴۰۳/۰۲/۰۵", cpu: 14, ramUsed: 38, uptime: "24 روز" },
  { id: "srv-10", name: "lb-primary",     status: "running",  region: "tehran",  ip: "185.94.97.215", vcpu: 2, ram: 4,  disk: 20,   createdAt: "۱۴۰۳/۰۲/۲۸", cpu: 22, ramUsed: 48, uptime: "6 روز"  },
  { id: "srv-11", name: "cache-node",     status: "running",  region: "tehran",  ip: "185.94.97.216", vcpu: 4, ram: 8,  disk: 100,  createdAt: "۱۴۰۳/۰۳/۰۱", cpu: 31, ramUsed: 52, uptime: "4 روز"  },
  { id: "srv-12", name: "backup-store",   status: "stopped",  region: "mashhad", ip: "10.20.30.103",  vcpu: 2, ram: 4,  disk: 1000, createdAt: "۱۴۰۲/۱۱/۱۰", cpu: 0,  ramUsed: 0,  uptime: "—"      },
];

const STATUS_MAP: Record<ServerStatus, { variant: "success" | "warning" | "danger" | "info"; label: string }> = {
  running:  { variant: "success", label: "در حال اجرا" },
  stopped:  { variant: "danger",  label: "متوقف"       },
  building: { variant: "info",    label: "در حال ساخت" },
  error:    { variant: "danger",  label: "خطا"         },
};

const REGION_LABEL: Record<string, string> = { tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد" };
const STATUS_OPTIONS = [
  { value: "all",      label: "همه وضعیت‌ها" },
  { value: "running",  label: "در حال اجرا"  },
  { value: "stopped",  label: "متوقف"         },
  { value: "building", label: "در حال ساخت"  },
  { value: "error",    label: "خطا"           },
];

function UsageBar({ pct, color = "#1a4d8f" }: { pct: number; color?: string }) {
  const c = pct > 85 ? "#ef4444" : pct > 65 ? "#f59e0b" : color;
  return (
    <div className="flex items-center gap-6 min-w-[80px]">
      <div className="flex-1 h-[5px] rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c }} />
      </div>
      <span className="ltr-text text-[11px] text-text-muted w-[28px] text-end">{pct}%</span>
    </div>
  );
}

export default function ServersPage() {
  const [region, setRegion]       = useState("all");
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("all");

  const byRegion = useMemo(
    () => region === "all" ? ALL_SERVERS : ALL_SERVERS.filter(s => s.region === region),
    [region]
  );

  const servers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return byRegion.filter(s => {
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.ip.includes(q);
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [byRegion, search, statusFilter]);

  const kpis = useMemo(() => ({
    total:    byRegion.length,
    running:  byRegion.filter(s => s.status === "running").length,
    problems: byRegion.filter(s => s.status === "stopped" || s.status === "error").length,
    building: byRegion.filter(s => s.status === "building").length,
  }), [byRegion]);

  // CPU usage chart data for running servers
  const cpuChartData = useMemo(() =>
    byRegion
      .filter(s => s.status === "running")
      .map(s => ({ name: s.name.replace(/-/g, "-"), cpu: s.cpu, ram: s.ramUsed }))
      .sort((a, b) => b.cpu - a.cpu),
    [byRegion]
  );

  const noResults = byRegion.length > 0 && servers.length === 0;

  return (
    <DashboardShell
      title="سرورها"
      breadcrumbs={[
        { label: "پراکچیر", href: "/" },
        { label: "زیرساخت ابری", href: "/iaas" },
        { label: "سرورها" },
      ]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={(r) => { setRegion(r); setSearch(""); setStatus("all"); }}
    >
      {/* Fleet status bar */}
      <div className="glass rounded-16 px-20 py-16 mb-4">
        <div className="flex items-center justify-between mb-10">
          <span className="text-[13px] font-medium text-text-muted">وضعیت ناوگان سرورها</span>
          <span className="ltr-text text-[13px] font-semibold text-text-main">{kpis.total} سرور</span>
        </div>
        <div className="flex h-10 rounded-full overflow-hidden gap-[2px] mb-16">
          {byRegion.map(s => (
            <div key={s.id} className="flex-1" title={s.name}
              style={{ background: s.status === "running" ? "#22c55e" : s.status === "building" ? "#3b82f6" : s.status === "error" ? "#ef4444" : "#94a3b8" }} />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-10">
          {[
            { label: "در حال اجرا", count: kpis.running, color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
            { label: "متوقف", count: byRegion.filter(s => s.status === "stopped").length, color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
            { label: "خطا", count: byRegion.filter(s => s.status === "error").length, color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
            { label: "در حال ساخت", count: kpis.building, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center py-10 px-6 rounded-12" style={{ background: item.bg }}>
              <span className="text-[24px] font-bold ltr-text" style={{ color: item.color }}>{item.count}</span>
              <span className="text-[11px] text-text-muted text-center mt-2">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CPU/RAM usage chart */}
      {cpuChartData.length > 0 && (
        <DashboardCard title="مصرف CPU و RAM سرورهای فعال">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={cpuChartData} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a4d8f" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1a4d8f" stopOpacity={0.55} />
                </linearGradient>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.55} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,168,161,0.15)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#3d5957" }} axisLine={false} tickLine={false} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#3d5957", fontFamily: "var(--font-vazirmatn)" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(94,168,161,0.3)", borderRadius: 8, fontSize: 12 }}
                formatter={(val: number, name: string) => [`${val}%`, name === "cpu" ? "CPU" : "RAM"]}
              />
              <Bar dataKey="cpu" fill="url(#barGrad1)" radius={[0, 4, 4, 0]} maxBarSize={12} name="cpu" />
              <Bar dataKey="ram" fill="url(#barGrad2)" radius={[0, 4, 4, 0]} maxBarSize={12} name="ram" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-16 mt-4 justify-end">
            <div className="flex items-center gap-6"><span className="w-10 h-3 rounded-full inline-block bg-brand" /><span className="text-[11px] text-text-muted">CPU</span></div>
            <div className="flex items-center gap-6"><span className="w-10 h-3 rounded-full inline-block" style={{ background: "#16a34a" }} /><span className="text-[11px] text-text-muted">RAM</span></div>
          </div>
        </DashboardCard>
      )}

      {/* Server table */}
      <DashboardCard
        title="لیست سرورها"
        action={
          <button className="flex items-center gap-6 px-14 py-7 rounded-8 bg-brand text-white text-[12px] font-medium hover:bg-brand-hover transition-colors">
            سفارش سرور جدید
          </button>
        }
        padding={false}
      >
        {/* Filter bar */}
        <div className="flex items-center gap-10 px-16 py-12 border-b border-border flex-wrap">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجو بر اساس نام یا IP..."
            className="flex-1 min-w-[160px] h-34 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main placeholder:text-text-placeholder outline-none focus:border-border-strong"
            dir="rtl"
          />
          <select
            value={statusFilter}
            onChange={e => setStatus(e.target.value)}
            className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none focus:border-border-strong cursor-pointer"
            dir="rtl"
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <span className="text-[12px] text-text-muted ltr-text">{servers.length} / {byRegion.length}</span>
        </div>

        {byRegion.length === 0 ? (
          <EmptyState icon="▣" title="در این منطقه سروری وجود ندارد" />
        ) : noResults ? (
          <EmptyState icon="⊕" title="نتیجه‌ای یافت نشد"
            action={
              <button onClick={() => { setSearch(""); setStatus("all"); }}
                className="px-16 py-7 rounded-8 border border-border text-[13px] text-text-muted hover:border-border-strong transition-colors">
                پاک کردن فیلترها
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted">نام</th>
                  <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted">وضعیت</th>
                  <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted hidden sm:table-cell">منطقه</th>
                  <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted hidden md:table-cell">IP</th>
                  <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted">CPU</th>
                  <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted">RAM</th>
                  <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted hidden lg:table-cell">منابع</th>
                  <th className="px-16 py-10 text-start text-[12px] font-medium text-text-muted hidden xl:table-cell">آپتایم</th>
                  <th className="px-16 py-10 text-end   text-[12px] font-medium text-text-muted">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {servers.map((s, i) => (
                  <tr key={s.id} className={`border-b border-border last:border-0 hover:bg-brand-light/30 transition-colors ${i % 2 !== 0 ? "bg-white/20" : ""}`}>
                    <td className="px-16 py-10">
                      <p className="text-[13px] font-medium text-brand ltr-text">{s.name}</p>
                      <p className="text-[11px] text-text-placeholder ltr-text">{s.id}</p>
                    </td>
                    <td className="px-16 py-10">
                      <StatusBadge variant={STATUS_MAP[s.status].variant} dot>
                        {STATUS_MAP[s.status].label}
                      </StatusBadge>
                    </td>
                    <td className="px-16 py-10 hidden sm:table-cell">
                      <span className="text-[13px] text-text-muted">{REGION_LABEL[s.region] ?? s.region}</span>
                    </td>
                    <td className="px-16 py-10 hidden md:table-cell">
                      <span className="ltr-text text-[12px] text-text-muted font-mono">{s.ip}</span>
                    </td>
                    <td className="px-16 py-10"><UsageBar pct={s.cpu} /></td>
                    <td className="px-16 py-10"><UsageBar pct={s.ramUsed} color="#16a34a" /></td>
                    <td className="px-16 py-10 hidden lg:table-cell">
                      <span className="ltr-text text-[12px] text-text-muted">{s.vcpu}vCPU / {s.ram}GB / {s.disk}GB</span>
                    </td>
                    <td className="px-16 py-10 hidden xl:table-cell">
                      <span className="text-[12px] text-text-muted">{s.uptime}</span>
                    </td>
                    <td className="px-16 py-10 text-end">
                      <ActionMenu items={[
                        { label: "مشاهده سرور",    onClick: () => {} },
                        { label: "کنسول",           onClick: () => {} },
                        { label: "راه‌اندازی مجدد", onClick: () => {} },
                        { label: "خاموش کردن",     onClick: () => {}, danger: true },
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
