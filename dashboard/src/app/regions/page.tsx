"use client";

import { useState } from "react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type RegionStatus = "عملیاتی" | "کاهش یافته" | "قطعی";

interface AZ {
  name: string;
  status: RegionStatus;
  servers: number;
  cpu_pct: number;
  ram_pct: number;
}

interface Region {
  id: string;
  name: string;
  code: string;
  status: RegionStatus;
  lat: number;
  lon: number;
  servers: number;
  vcpus: number;
  ram_tb: number;
  storage_pb: number;
  vpcs: number;
  pods: number;
  cpu_pct: number;
  ram_pct: number;
  network_gbps: number;
  uptime_30d: number;
  zones: AZ[];
}

/* ─── mock data ─── */
const ALL_REGIONS: Region[] = [
  {
    id: "r1", name: "تهران", code: "IRN-TH", status: "عملیاتی",
    lat: 35.7, lon: 51.4,
    servers: 42, vcpus: 420, ram_tb: 1.68, storage_pb: 0.12,
    vpcs: 4, pods: 142, cpu_pct: 64, ram_pct: 71, network_gbps: 28.4,
    uptime_30d: 99.98,
    zones: [
      { name: "AZ-A", status: "عملیاتی",    servers: 22, cpu_pct: 68, ram_pct: 74 },
      { name: "AZ-B", status: "عملیاتی",    servers: 20, cpu_pct: 60, ram_pct: 68 },
    ],
  },
  {
    id: "r2", name: "اصفهان", code: "IRN-IS", status: "عملیاتی",
    lat: 32.7, lon: 51.7,
    servers: 18, vcpus: 144, ram_tb: 0.58, storage_pb: 0.08,
    vpcs: 2, pods: 48, cpu_pct: 38, ram_pct: 45, network_gbps: 8.2,
    uptime_30d: 99.95,
    zones: [
      { name: "AZ-A", status: "عملیاتی",    servers: 10, cpu_pct: 40, ram_pct: 46 },
      { name: "AZ-B", status: "عملیاتی",    servers: 8,  cpu_pct: 36, ram_pct: 44 },
    ],
  },
  {
    id: "r3", name: "مشهد", code: "IRN-MH", status: "کاهش یافته",
    lat: 36.3, lon: 59.6,
    servers: 12, vcpus: 128, ram_tb: 0.64, storage_pb: 0.04,
    vpcs: 1, pods: 31, cpu_pct: 88, ram_pct: 92, network_gbps: 4.1,
    uptime_30d: 99.72,
    zones: [
      { name: "AZ-A", status: "کاهش یافته", servers: 8,  cpu_pct: 90, ram_pct: 94 },
      { name: "AZ-B", status: "عملیاتی",    servers: 4,  cpu_pct: 84, ram_pct: 88 },
    ],
  },
];

const REGION_COMPARE = [
  { metric: "CPU ٪",    "تهران": 64, "اصفهان": 38, "مشهد": 88 },
  { metric: "RAM ٪",    "تهران": 71, "اصفهان": 45, "مشهد": 92 },
  { metric: "Network",  "تهران": 29, "اصفهان": 8,  "مشهد": 4  },
];

const UPTIME_TREND = [
  { d: "۱",  th: 100,  is: 100,  mh: 99.8 },
  { d: "۵",  th: 100,  is: 100,  mh: 99.9 },
  { d: "۱۰", th: 100,  is: 99.9, mh: 99.4 },
  { d: "۱۵", th: 99.9, is: 100,  mh: 99.6 },
  { d: "۲۰", th: 100,  is: 100,  mh: 99.8 },
  { d: "۲۵", th: 100,  is: 99.9, mh: 99.7 },
  { d: "۳۰", th: 99.98,is: 99.95,mh: 99.72 },
];

/* ─── colors ─── */
const STATUS_COLOR: Record<RegionStatus, string> = {
  "عملیاتی":      "#16a34a",
  "کاهش یافته":   "#d97706",
  "قطعی":         "#ef4444",
};

const REGION_PALETTE = { "تهران": "#2554d8", "اصفهان": "#8b5cf6", "مشهد": "#ef4444" };

/* ─── tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] shadow-lg" style={{ direction: "rtl" }}>
      <p className="font-semibold mb-4">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

/* ─── gauge arc ─── */
function SmallGauge({ pct, color }: { pct: number; color: string }) {
  const r = 32; const arcLen = Math.PI * r; const dash = (pct / 100) * arcLen;
  return (
    <svg width="80" height="48" viewBox="0 0 80 48">
      <path d={`M 8 42 A ${r} ${r} 0 0 1 72 42`} fill="none" stroke="#e2e8f0" strokeWidth="7" strokeLinecap="round" />
      <path d={`M 8 42 A ${r} ${r} 0 0 1 72 42`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={`${dash} ${arcLen}`} />
      <text x="40" y="40" textAnchor="middle" fill={color} fontSize="11" fontWeight="bold" fontFamily="var(--font-vazirmatn)">{pct}٪</text>
    </svg>
  );
}

/* ─── MiniBar ─── */
function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-5 rounded-999 bg-[#e2e8f0] overflow-hidden">
      <div style={{ width: `${Math.min(pct,100)}%`, background: color }} className="h-full rounded-999" />
    </div>
  );
}

/* ─── page ─── */
export default function RegionsPage() {
  const [expanded, setExpanded] = useState<string | null>("r1");

  const totalServers  = ALL_REGIONS.reduce((s, r) => s + r.servers, 0);
  const totalVcpus    = ALL_REGIONS.reduce((s, r) => s + r.vcpus, 0);
  const totalPods     = ALL_REGIONS.reduce((s, r) => s + r.pods, 0);
  const degraded      = ALL_REGIONS.filter(r => r.status !== "عملیاتی").length;

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-[14px] font-bold text-text-main">مناطق زیرساخت</h2>
          {degraded > 0 && (
            <div className="flex items-center gap-6 px-10 py-5 rounded-8 text-[11px] font-bold"
              style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.3)", color: "#d97706" }}>
              ⚠ {degraded} منطقه با کاهش عملکرد
            </div>
          )}
        </div>

        {/* region status segmented bar */}
        <div className="flex h-12 rounded-999 overflow-hidden gap-2 mb-8">
          {ALL_REGIONS.map(r => (
            <div key={r.id} style={{ flex: r.servers, background: STATUS_COLOR[r.status] }}
              className="rounded-999" title={`${r.name}: ${r.status}`} />
          ))}
        </div>
        <div className="flex gap-14 mb-14">
          {ALL_REGIONS.map(r => (
            <div key={r.id} className="flex items-center gap-6 text-[11px] text-text-muted">
              <span className="w-8 h-8 rounded-999 shrink-0" style={{ background: STATUS_COLOR[r.status] }} />
              {r.name} — <span style={{ color: STATUS_COLOR[r.status] }}>{r.status}</span>
            </div>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "مناطق عملیاتی",  value: `${ALL_REGIONS.length - degraded} / ${ALL_REGIONS.length}`, color: "#16a34a" },
            { label: "سرورهای فعال",   value: totalServers,                                                color: "#2554d8" },
            { label: "vCPU کل",        value: totalVcpus,                                                  color: "#8b5cf6" },
            { label: "Pods کل",        value: totalPods,                                                   color: "#d97706" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[22px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* region comparison bars */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">مقایسه مناطق</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGION_COMPARE} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="metric" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
                <Bar dataKey="تهران"   fill={REGION_PALETTE["تهران"]}   radius={[3,3,0,0]} />
                <Bar dataKey="اصفهان" fill={REGION_PALETTE["اصفهان"]} radius={[3,3,0,0]} />
                <Bar dataKey="مشهد"   fill={REGION_PALETTE["مشهد"]}   radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* uptime trend */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">Uptime ماه جاری (٪)</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={UPTIME_TREND} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  {Object.entries(REGION_PALETTE).map(([name, color]) => (
                    <linearGradient key={name} id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="d" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} domain={[99, 100]} tickFormatter={v => `${v}٪`} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
                <Area type="monotone" dataKey="th" name="تهران"   stroke={REGION_PALETTE["تهران"]}   fill={`url(#grad-تهران)`}   strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="is" name="اصفهان" stroke={REGION_PALETTE["اصفهان"]} fill={`url(#grad-اصفهان)`} strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="mh" name="مشهد"   stroke={REGION_PALETTE["مشهد"]}   fill={`url(#grad-مشهد)`}   strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─── region detail cards ─── */}
      <div className="flex flex-col gap-12">
        {ALL_REGIONS.map(region => (
          <div key={region.id} className="glass rounded-16 overflow-hidden border border-border">
            {/* region header row */}
            <div className="flex items-center gap-16 px-20 py-14 cursor-pointer hover:bg-bg/30 transition-colors"
              onClick={() => setExpanded(expanded === region.id ? null : region.id)}>
              <span className="text-text-muted text-[10px]">{expanded === region.id ? "▲" : "▶"}</span>

              {/* status dot + name */}
              <div className="flex items-center gap-10 flex-1">
                <div className="w-10 h-10 rounded-999 shrink-0 animate-pulse" style={{ background: STATUS_COLOR[region.status] }} />
                <div>
                  <div className="flex items-center gap-10 mb-2">
                    <span className="text-[14px] font-bold text-text-main">{region.name}</span>
                    <span className="px-6 py-1 rounded-4 text-[10px] font-mono ltr-text bg-[#e2e8f0] text-text-muted">{region.code}</span>
                    <span className="px-8 py-2 rounded-4 text-[10px] font-medium" style={{ background: `${STATUS_COLOR[region.status]}18`, color: STATUS_COLOR[region.status] }}>
                      {region.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-14 text-[11px] text-text-muted">
                    <span>{region.servers} سرور</span>
                    <span>{region.vcpus} vCPU</span>
                    <span>{region.pods} Pod</span>
                    <span className="ltr-text">{region.network_gbps} Gbps</span>
                    <span className="text-green-600">Uptime: {region.uptime_30d}٪</span>
                  </div>
                </div>
              </div>

              {/* mini gauges */}
              <div className="hidden lg:flex items-center gap-4 shrink-0">
                <SmallGauge pct={region.cpu_pct} color={region.cpu_pct > 80 ? "#ef4444" : "#2554d8"} />
                <SmallGauge pct={region.ram_pct} color={region.ram_pct > 85 ? "#ef4444" : "#8b5cf6"} />
              </div>
            </div>

            {/* expanded AZ detail */}
            {expanded === region.id && (
              <div className="border-t border-border bg-bg/30 px-20 py-14">
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-10">Availability Zones</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {region.zones.map(az => (
                    <div key={az.name} className="rounded-12 border border-border/60 px-14 py-12 bg-bg/40">
                      <div className="flex items-center gap-8 mb-10">
                        <div className="w-8 h-8 rounded-999 shrink-0" style={{ background: STATUS_COLOR[az.status] }} />
                        <span className="text-[12px] font-semibold text-text-main ltr-text">{az.name}</span>
                        <span className="px-6 py-2 rounded-4 text-[10px] font-medium" style={{ background: `${STATUS_COLOR[az.status]}15`, color: STATUS_COLOR[az.status] }}>
                          {az.status}
                        </span>
                        <span className="text-[11px] text-text-muted ms-auto">{az.servers} سرور</span>
                      </div>
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-8">
                          <span className="text-[10px] text-text-muted w-[28px]">CPU</span>
                          <MiniBar pct={az.cpu_pct} color={az.cpu_pct > 80 ? "#ef4444" : "#2554d8"} />
                          <span className="ltr-text text-[10px] text-text-muted whitespace-nowrap">{az.cpu_pct}٪</span>
                        </div>
                        <div className="flex items-center gap-8">
                          <span className="text-[10px] text-text-muted w-[28px]">RAM</span>
                          <MiniBar pct={az.ram_pct} color={az.ram_pct > 85 ? "#ef4444" : "#8b5cf6"} />
                          <span className="ltr-text text-[10px] text-text-muted whitespace-nowrap">{az.ram_pct}٪</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* resource summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mt-12">
                  {[
                    { label: "RAM",     value: `${region.ram_tb} TB` },
                    { label: "Storage", value: `${region.storage_pb * 1000} TB` },
                    { label: "VPCs",    value: region.vpcs },
                    { label: "Network", value: `${region.network_gbps} Gbps` },
                  ].map(s => (
                    <div key={s.label} className="rounded-10 px-12 py-8 bg-bg/60 border border-border/40 text-center">
                      <p className="text-[10px] text-text-muted mb-1 ltr-text">{s.label}</p>
                      <p className="text-[14px] font-bold text-text-main ltr-text">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
