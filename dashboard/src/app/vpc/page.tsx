"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type VpcStatus  = "فعال" | "غیرفعال" | "در حال ساخت";
type PeerStatus = "متصل" | "قطع" | "در انتظار";

interface Subnet {
  name: string;
  cidr: string;
  az: string;
  ips_used: number;
  ips_total: number;
  public: boolean;
}

interface VpcPeer {
  id: string;
  peer_name: string;
  peer_cidr: string;
  status: PeerStatus;
  region: string;
}

interface Vpc {
  id: string;
  name: string;
  cidr: string;
  status: VpcStatus;
  region: string;
  subnets: number;
  instances: number;
  internet_gw: boolean;
  nat_gw: number;
  flow_logs: boolean;
  created: string;
  subnetList: Subnet[];
  peers: VpcPeer[];
  ingress_mbps: number;
  egress_mbps: number;
}

/* ─── mock data ─── */
const ALL_VPCS: Vpc[] = [
  {
    id: "v1", name: "prod-vpc", cidr: "10.0.0.0/16", status: "فعال", region: "تهران",
    subnets: 6, instances: 42, internet_gw: true, nat_gw: 2, flow_logs: true,
    ingress_mbps: 2840, egress_mbps: 1620, created: "۱۴۰۲/۰۲/۱۸",
    subnetList: [
      { name: "pub-a",     cidr: "10.0.1.0/24",  az: "AZ-A", ips_used: 18,  ips_total: 254,  public: true  },
      { name: "pub-b",     cidr: "10.0.2.0/24",  az: "AZ-B", ips_used: 12,  ips_total: 254,  public: true  },
      { name: "priv-app-a",cidr: "10.0.10.0/24", az: "AZ-A", ips_used: 84,  ips_total: 254,  public: false },
      { name: "priv-app-b",cidr: "10.0.11.0/24", az: "AZ-B", ips_used: 72,  ips_total: 254,  public: false },
      { name: "priv-db-a", cidr: "10.0.20.0/24", az: "AZ-A", ips_used: 28,  ips_total: 254,  public: false },
      { name: "priv-db-b", cidr: "10.0.21.0/24", az: "AZ-B", ips_used: 24,  ips_total: 254,  public: false },
    ],
    peers: [
      { id: "p1", peer_name: "staging-vpc",    peer_cidr: "10.1.0.0/16",   status: "متصل",   region: "اصفهان" },
      { id: "p2", peer_name: "dr-vpc",         peer_cidr: "10.10.0.0/16",  status: "متصل",   region: "مشهد"   },
      { id: "p3", peer_name: "partner-net",    peer_cidr: "192.168.1.0/24",status: "در انتظار", region: "تهران" },
    ],
  },
  {
    id: "v2", name: "staging-vpc", cidr: "10.1.0.0/16", status: "فعال", region: "اصفهان",
    subnets: 4, instances: 18, internet_gw: true, nat_gw: 1, flow_logs: false,
    ingress_mbps: 480, egress_mbps: 240, created: "۱۴۰۲/۰۵/۱۰",
    subnetList: [
      { name: "pub-a",      cidr: "10.1.1.0/24",  az: "AZ-A", ips_used: 8,  ips_total: 254, public: true  },
      { name: "priv-app-a", cidr: "10.1.10.0/24", az: "AZ-A", ips_used: 32, ips_total: 254, public: false },
      { name: "priv-app-b", cidr: "10.1.11.0/24", az: "AZ-B", ips_used: 28, ips_total: 254, public: false },
      { name: "priv-db",    cidr: "10.1.20.0/24", az: "AZ-A", ips_used: 8,  ips_total: 254, public: false },
    ],
    peers: [
      { id: "p4", peer_name: "prod-vpc", peer_cidr: "10.0.0.0/16", status: "متصل", region: "تهران" },
    ],
  },
  {
    id: "v3", name: "dr-vpc", cidr: "10.10.0.0/16", status: "فعال", region: "مشهد",
    subnets: 3, instances: 8, internet_gw: false, nat_gw: 0, flow_logs: true,
    ingress_mbps: 120, egress_mbps: 80, created: "۱۴۰۲/۰۸/۲۲",
    subnetList: [
      { name: "priv-main",  cidr: "10.10.1.0/24",  az: "AZ-A", ips_used: 12, ips_total: 254, public: false },
      { name: "priv-db",    cidr: "10.10.10.0/24", az: "AZ-A", ips_used: 8,  ips_total: 254, public: false },
      { name: "priv-mgmt",  cidr: "10.10.20.0/24", az: "AZ-A", ips_used: 4,  ips_total: 254, public: false },
    ],
    peers: [
      { id: "p5", peer_name: "prod-vpc", peer_cidr: "10.0.0.0/16", status: "متصل", region: "تهران" },
    ],
  },
  {
    id: "v4", name: "dev-sandbox", cidr: "172.16.0.0/20", status: "در حال ساخت", region: "تهران",
    subnets: 0, instances: 0, internet_gw: false, nat_gw: 0, flow_logs: false,
    ingress_mbps: 0, egress_mbps: 0, created: "۱۴۰۳/۰۳/۰۸",
    subnetList: [], peers: [],
  },
];

const FLOW_TIMELINE = [
  { h: "۰۰", ing: 820,  eg: 480  }, { h: "۰۲", ing: 540,  eg: 320  }, { h: "۰۴", ing: 380,  eg: 220  },
  { h: "۰۶", ing: 680,  eg: 400  }, { h: "۰۸", ing: 1640, eg: 920  }, { h: "۱۰", ing: 2840, eg: 1620 },
  { h: "۱۲", ing: 3200, eg: 1840 }, { h: "۱۴", ing: 2960, eg: 1680 }, { h: "۱۶", ing: 2480, eg: 1400 },
  { h: "۱۸", ing: 2040, eg: 1160 }, { h: "۲۰", ing: 1560, eg: 880  }, { h: "۲۲", ing: 1120, eg: 640  },
];

const VPC_BW_DATA = ALL_VPCS.filter(v => v.ingress_mbps > 0).map(v => ({
  name: v.name, ingress: v.ingress_mbps, egress: v.egress_mbps,
}));

/* ─── colors ─── */
const STATUS_COLOR: Record<VpcStatus, string> = {
  "فعال":           "#16a34a",
  "غیرفعال":       "#ef4444",
  "در حال ساخت":   "#d97706",
};

const PEER_STATUS_COLOR: Record<PeerStatus, string> = {
  "متصل":      "#16a34a",
  "قطع":       "#ef4444",
  "در انتظار": "#d97706",
};

const REGION_COLOR: Record<string, string> = {
  "تهران":  "#2554d8",
  "اصفهان": "#8b5cf6",
  "مشهد":   "#16a34a",
};

/* ─── tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] shadow-lg" style={{ direction: "rtl" }}>
      <p className="font-semibold mb-4">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()} Mbps</p>
      ))}
    </div>
  );
};

/* ─── inline IpBar ─── */
function IpBar({ used, total }: { used: number; total: number }) {
  const pct = (used / total) * 100;
  const color = pct > 80 ? "#ef4444" : pct > 60 ? "#d97706" : "#2554d8";
  return (
    <div className="flex items-center gap-6">
      <div className="w-full h-6 rounded-999 bg-[#e2e8f0] overflow-hidden">
        <div style={{ width: `${pct}%`, background: color }} className="h-full rounded-999" />
      </div>
      <span className="ltr-text text-[10px] text-text-muted whitespace-nowrap">{used}/{total}</span>
    </div>
  );
}

/* ─── page ─── */
export default function VpcPage() {
  const [expanded, setExpanded] = useState<string | null>("v1");
  const [tab, setTab] = useState<"subnets" | "peers">("subnets");

  const totalInstances = ALL_VPCS.reduce((s, v) => s + v.instances, 0);
  const totalSubnets   = ALL_VPCS.reduce((s, v) => s + v.subnets, 0);
  const activeVpcs     = ALL_VPCS.filter(v => v.status === "فعال").length;
  const totalIngress   = ALL_VPCS.reduce((s, v) => s + v.ingress_mbps, 0);

  /* aggregate traffic segmented bar */
  const trafficSegments = useMemo(() =>
    ALL_VPCS.filter(v => v.ingress_mbps > 0).map(v => ({
      name: v.name, region: v.region, bw: v.ingress_mbps + v.egress_mbps,
    })),
  []);
  const totalBw = trafficSegments.reduce((s, v) => s + v.bw, 0);

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[14px] font-bold text-text-main">شبکه خصوصی مجازی (VPC)</h2>
          <span className="text-[12px] text-text-muted ltr-text">{(totalIngress / 1000).toFixed(1)} Gbps ingress</span>
        </div>

        {/* traffic segmented bar by VPC */}
        <div className="flex h-12 rounded-999 overflow-hidden gap-1 mb-8">
          {trafficSegments.map((v, i) => (
            <div key={v.name} title={`${v.name}: ${v.bw} Mbps`}
              style={{ flex: v.bw, background: REGION_COLOR[v.region] || "#2554d8" }}
              className="rounded-999" />
          ))}
        </div>
        <div className="flex flex-wrap gap-12 mb-14">
          {trafficSegments.map(v => (
            <div key={v.name} className="flex items-center gap-6 text-[11px] text-text-muted">
              <span className="w-8 h-8 rounded-999 shrink-0" style={{ background: REGION_COLOR[v.region] || "#2554d8" }} />
              {v.name} — {((v.bw / totalBw) * 100).toFixed(0)}٪
            </div>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "VPCهای فعال",      value: `${activeVpcs} / ${ALL_VPCS.length}`, color: "#16a34a" },
            { label: "زیرشبکه‌ها",       value: totalSubnets,                          color: "#2554d8" },
            { label: "سرورهای متصل",     value: totalInstances,                        color: "#8b5cf6" },
            { label: "Ingress",          value: `${(totalIngress/1000).toFixed(1)} G`, color: "#d97706" },
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

        {/* flow timeline */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">جریان ترافیک prod-vpc — ۲۴ ساعت (Mbps)</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FLOW_TIMELINE} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="ingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2554d8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2554d8" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="egGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="h" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
                <Area type="monotone" dataKey="ing" name="Ingress" stroke="#2554d8" fill="url(#ingGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="eg"  name="Egress"  stroke="#16a34a" fill="url(#egGrad)"  strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* VPC bandwidth comparison */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">مقایسه ترافیک VPCها (Mbps)</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VPC_BW_DATA} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
                <Bar dataKey="ingress" name="Ingress" fill="#2554d8" radius={[4,4,0,0]} />
                <Bar dataKey="egress"  name="Egress"  fill="#16a34a" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─── VPC list ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">شبکه‌های VPC</h3>
          <button className="flex items-center gap-6 px-12 py-6 rounded-8 text-[12px] font-medium bg-brand text-white hover:bg-brand/90 transition-colors">
            + VPC جدید
          </button>
        </div>

        <div className="flex flex-col gap-8">
          {ALL_VPCS.map(vpc => (
            <div key={vpc.id} className="border border-border rounded-12 overflow-hidden">
              {/* vpc row */}
              <div
                className="flex items-center gap-14 px-16 py-12 cursor-pointer hover:bg-bg/40 transition-colors"
                onClick={() => setExpanded(expanded === vpc.id ? null : vpc.id)}
              >
                <span className="text-text-muted text-[10px]">{expanded === vpc.id ? "▲" : "▶"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-10 mb-4">
                    <span className="text-[13px] font-semibold text-text-main ltr-text">{vpc.name}</span>
                    <span className="px-6 py-2 rounded-4 text-[10px] font-mono bg-[#e2e8f0] text-text-muted ltr-text">{vpc.cidr}</span>
                    <span className="px-8 py-2 rounded-4 text-[10px] font-medium" style={{ background: `${STATUS_COLOR[vpc.status]}18`, color: STATUS_COLOR[vpc.status] }}>
                      {vpc.status}
                    </span>
                    <span className="px-8 py-2 rounded-4 text-[10px] font-medium" style={{ background: `${REGION_COLOR[vpc.region] || "#94a3b8"}18`, color: REGION_COLOR[vpc.region] || "#94a3b8" }}>
                      {vpc.region}
                    </span>
                  </div>
                  <div className="flex items-center gap-16 text-[11px] text-text-muted">
                    <span>{vpc.subnets} زیرشبکه</span>
                    <span>{vpc.instances} سرور</span>
                    {vpc.internet_gw && <span className="text-green-600">Internet GW ✓</span>}
                    {vpc.nat_gw > 0 && <span className="text-blue-600">NAT GW ×{vpc.nat_gw}</span>}
                    {vpc.flow_logs && <span className="text-purple-600">Flow Logs ✓</span>}
                  </div>
                </div>
                {vpc.ingress_mbps > 0 && (
                  <div className="hidden lg:flex items-center gap-16 text-[11px] text-text-muted shrink-0">
                    <span>↓ <span className="ltr-text font-mono">{vpc.ingress_mbps} Mbps</span></span>
                    <span>↑ <span className="ltr-text font-mono">{vpc.egress_mbps} Mbps</span></span>
                  </div>
                )}
              </div>

              {/* expanded detail */}
              {expanded === vpc.id && (
                <div className="border-t border-border bg-bg/30 p-16">
                  {vpc.subnetList.length > 0 ? (
                    <>
                      <div className="flex gap-8 mb-12">
                        {(["subnets", "peers"] as const).map(t => (
                          <button key={t} onClick={() => setTab(t)}
                            className={`px-12 py-5 rounded-6 text-[11px] font-medium transition-colors ${tab === t ? "bg-brand text-white" : "bg-bg border border-border text-text-muted hover:text-text-main"}`}>
                            {t === "subnets" ? `زیرشبکه‌ها (${vpc.subnetList.length})` : `Peering (${vpc.peers.length})`}
                          </button>
                        ))}
                      </div>

                      {tab === "subnets" && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-[11px]">
                            <thead>
                              <tr className="text-text-muted border-b border-border">
                                <th className="text-start pb-6 font-medium">نام</th>
                                <th className="text-start pb-6 font-medium">CIDR</th>
                                <th className="text-start pb-6 font-medium">AZ</th>
                                <th className="text-start pb-6 font-medium">نوع</th>
                                <th className="text-start pb-6 font-medium w-[160px]">آدرس IP</th>
                              </tr>
                            </thead>
                            <tbody>
                              {vpc.subnetList.map(s => (
                                <tr key={s.cidr} className="border-b border-border/30 last:border-0">
                                  <td className="py-8 ltr-text font-mono text-text-main">{s.name}</td>
                                  <td className="py-8 ltr-text font-mono text-text-muted">{s.cidr}</td>
                                  <td className="py-8 ltr-text text-text-muted">{s.az}</td>
                                  <td className="py-8">
                                    <span className={`px-6 py-2 rounded-4 text-[10px] font-medium ${s.public ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
                                      {s.public ? "عمومی" : "خصوصی"}
                                    </span>
                                  </td>
                                  <td className="py-8 w-[160px]">
                                    <IpBar used={s.ips_used} total={s.ips_total} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {tab === "peers" && (
                        vpc.peers.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-[11px]">
                              <thead>
                                <tr className="text-text-muted border-b border-border">
                                  <th className="text-start pb-6 font-medium">نام</th>
                                  <th className="text-start pb-6 font-medium">CIDR</th>
                                  <th className="text-start pb-6 font-medium">منطقه</th>
                                  <th className="text-start pb-6 font-medium">وضعیت</th>
                                </tr>
                              </thead>
                              <tbody>
                                {vpc.peers.map(p => (
                                  <tr key={p.id} className="border-b border-border/30 last:border-0">
                                    <td className="py-8 ltr-text font-mono text-text-main">{p.peer_name}</td>
                                    <td className="py-8 ltr-text font-mono text-text-muted">{p.peer_cidr}</td>
                                    <td className="py-8">
                                      <span className="px-6 py-2 rounded-4 text-[10px]" style={{ background: `${REGION_COLOR[p.region] || "#94a3b8"}18`, color: REGION_COLOR[p.region] || "#94a3b8" }}>
                                        {p.region}
                                      </span>
                                    </td>
                                    <td className="py-8">
                                      <span className="px-6 py-2 rounded-4 text-[10px] font-medium" style={{ background: `${PEER_STATUS_COLOR[p.status]}18`, color: PEER_STATUS_COLOR[p.status] }}>
                                        {p.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-[12px] text-text-muted text-center py-12">بدون peering</p>
                        )
                      )}
                    </>
                  ) : (
                    <p className="text-[12px] text-text-muted text-center py-20">در حال راه‌اندازی — زیرشبکه‌ها هنوز ایجاد نشده‌اند</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
