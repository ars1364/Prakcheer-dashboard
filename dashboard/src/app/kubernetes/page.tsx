"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type ClusterStatus = "سالم" | "هشدار" | "خطا" | "در حال راه‌اندازی";
type NodeStatus    = "Ready" | "NotReady" | "SchedulingDisabled";

interface KubeNode {
  name: string;
  role: "master" | "worker";
  status: NodeStatus;
  cpu_cores: number;
  cpu_used: number;
  ram_gb: number;
  ram_used: number;
  pods: number;
  region: string;
}

interface Namespace {
  name: string;
  pods: number;
  running: number;
  cpu_m: number;
  ram_mb: number;
}

interface Cluster {
  id: string;
  name: string;
  status: ClusterStatus;
  version: string;
  region: string;
  nodes: number;
  pods_running: number;
  pods_total: number;
  cpu_pct: number;
  ram_pct: number;
  created: string;
  nodeList: KubeNode[];
  namespaces: Namespace[];
}

/* ─── mock data ─── */
const ALL_CLUSTERS: Cluster[] = [
  {
    id: "k1", name: "prod-main", status: "سالم", version: "1.29.2", region: "تهران",
    nodes: 6, pods_running: 142, pods_total: 148, cpu_pct: 64, ram_pct: 71, created: "۱۴۰۲/۰۳/۱۲",
    nodeList: [
      { name: "master-1", role: "master", status: "Ready", cpu_cores: 8,  cpu_used: 3.2, ram_gb: 32, ram_used: 18.4, pods: 12, region: "تهران" },
      { name: "master-2", role: "master", status: "Ready", cpu_cores: 8,  cpu_used: 2.8, ram_gb: 32, ram_used: 16.2, pods: 10, region: "تهران" },
      { name: "worker-1", role: "worker", status: "Ready", cpu_cores: 16, cpu_used: 10.8,ram_gb: 64, ram_used: 46.2, pods: 28, region: "تهران" },
      { name: "worker-2", role: "worker", status: "Ready", cpu_cores: 16, cpu_used: 11.2,ram_gb: 64, ram_used: 49.1, pods: 30, region: "تهران" },
      { name: "worker-3", role: "worker", status: "Ready", cpu_cores: 16, cpu_used: 9.6, ram_gb: 64, ram_used: 42.8, pods: 26, region: "تهران" },
      { name: "worker-4", role: "worker", status: "Ready", cpu_cores: 16, cpu_used: 8.4, ram_gb: 64, ram_used: 38.6, pods: 24, region: "تهران" },
    ],
    namespaces: [
      { name: "default",        pods: 8,  running: 8,  cpu_m: 840,  ram_mb: 2048 },
      { name: "production",     pods: 62, running: 60, cpu_m: 5200, ram_mb: 18400 },
      { name: "monitoring",     pods: 18, running: 18, cpu_m: 1800, ram_mb: 6200  },
      { name: "ingress-nginx",  pods: 4,  running: 4,  cpu_m: 320,  ram_mb: 820   },
      { name: "cert-manager",   pods: 3,  running: 3,  cpu_m: 120,  ram_mb: 360   },
      { name: "kube-system",    pods: 12, running: 12, cpu_m: 480,  ram_mb: 1600  },
    ],
  },
  {
    id: "k2", name: "staging", status: "سالم", version: "1.29.2", region: "اصفهان",
    nodes: 3, pods_running: 48, pods_total: 50, cpu_pct: 38, ram_pct: 45, created: "۱۴۰۲/۰۷/۲۰",
    nodeList: [
      { name: "master-1", role: "master", status: "Ready", cpu_cores: 4, cpu_used: 1.2, ram_gb: 16, ram_used: 7.2, pods: 18, region: "اصفهان" },
      { name: "worker-1", role: "worker", status: "Ready", cpu_cores: 8, cpu_used: 3.1, ram_gb: 32, ram_used: 14.4, pods: 16, region: "اصفهان" },
      { name: "worker-2", role: "worker", status: "Ready", cpu_cores: 8, cpu_used: 2.8, ram_gb: 32, ram_used: 13.1, pods: 14, region: "اصفهان" },
    ],
    namespaces: [
      { name: "default",    pods: 4,  running: 4,  cpu_m: 200,  ram_mb: 512  },
      { name: "staging",    pods: 32, running: 32, cpu_m: 2400, ram_mb: 8200 },
      { name: "kube-system",pods: 8,  running: 8,  cpu_m: 320,  ram_mb: 980  },
    ],
  },
  {
    id: "k3", name: "ml-training", status: "هشدار", version: "1.28.5", region: "مشهد",
    nodes: 4, pods_running: 31, pods_total: 40, cpu_pct: 88, ram_pct: 92, created: "۱۴۰۲/۰۹/۰۵",
    nodeList: [
      { name: "master-1", role: "master", status: "Ready",            cpu_cores: 8,  cpu_used: 5.2, ram_gb: 32,  ram_used: 28.4, pods: 10, region: "مشهد" },
      { name: "gpu-1",    role: "worker", status: "Ready",            cpu_cores: 32, cpu_used: 28.8,ram_gb: 128, ram_used: 118.2,pods: 12, region: "مشهد" },
      { name: "gpu-2",    role: "worker", status: "Ready",            cpu_cores: 32, cpu_used: 30.4,ram_gb: 128, ram_used: 121.6,pods: 12, region: "مشهد" },
      { name: "worker-1", role: "worker", status: "NotReady",         cpu_cores: 16, cpu_used: 0,   ram_gb: 64,  ram_used: 0,    pods: 0,  region: "مشهد" },
    ],
    namespaces: [
      { name: "ml-jobs",    pods: 18, running: 12, cpu_m: 28000, ram_mb: 98000 },
      { name: "monitoring", pods: 6,  running: 6,  cpu_m: 480,   ram_mb: 1600  },
      { name: "kube-system",pods: 8,  running: 8,  cpu_m: 640,   ram_mb: 2400  },
    ],
  },
  {
    id: "k4", name: "dev-cluster", status: "در حال راه‌اندازی", version: "1.30.0", region: "تهران",
    nodes: 2, pods_running: 0, pods_total: 0, cpu_pct: 0, ram_pct: 0, created: "۱۴۰۳/۰۳/۰۸",
    nodeList: [],
    namespaces: [],
  },
];

const TIMELINE = [
  { h: "۰۰", cpu: 52, ram: 60 }, { h: "۰۲", cpu: 48, ram: 58 }, { h: "۰۴", cpu: 44, ram: 56 },
  { h: "۰۶", cpu: 55, ram: 62 }, { h: "۰۸", cpu: 68, ram: 70 }, { h: "۱۰", cpu: 74, ram: 75 },
  { h: "۱۲", cpu: 80, ram: 78 }, { h: "۱۴", cpu: 76, ram: 76 }, { h: "۱۶", cpu: 72, ram: 74 },
  { h: "۱۸", cpu: 65, ram: 71 }, { h: "۲۰", cpu: 60, ram: 68 }, { h: "۲۲", cpu: 56, ram: 65 },
];

/* ─── colors ─── */
const STATUS_COLOR: Record<ClusterStatus, string> = {
  "سالم":              "#16a34a",
  "هشدار":             "#d97706",
  "خطا":               "#ef4444",
  "در حال راه‌اندازی": "#8b5cf6",
};

const NODE_STATUS_COLOR: Record<NodeStatus, string> = {
  "Ready":              "#16a34a",
  "NotReady":           "#ef4444",
  "SchedulingDisabled": "#d97706",
};

const REGION_COLOR: Record<string, string> = {
  "تهران":  "#2554d8",
  "اصفهان": "#8b5cf6",
  "مشهد":   "#16a34a",
};

/* ─── gauge arc ─── */
function Gauge({ pct, color, label }: { pct: number; color: string; label: string }) {
  const r = 42; const arcLen = Math.PI * r; const dash = (pct / 100) * arcLen;
  const track = "#e2e8f0";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="104" height="62" viewBox="0 0 104 62">
        <path d={`M 10 54 A ${r} ${r} 0 0 1 94 54`} fill="none" stroke={track} strokeWidth="9" strokeLinecap="round" />
        <path d={`M 10 54 A ${r} ${r} 0 0 1 94 54`} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={`${dash} ${arcLen}`} />
        <text x="52" y="50" textAnchor="middle" fill={color} fontSize="15" fontWeight="bold" fontFamily="var(--font-vazirmatn)">{pct}٪</text>
      </svg>
      <span className="text-[11px] text-text-muted">{label}</span>
    </div>
  );
}

/* ─── tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] shadow-lg" style={{ direction: "rtl" }}>
      <p className="font-semibold mb-4">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}٪</p>
      ))}
    </div>
  );
};

/* ─── MiniBar ─── */
function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-6 rounded-999 bg-[#e2e8f0] overflow-hidden">
      <div style={{ width: `${Math.min(pct, 100)}%`, background: color }} className="h-full rounded-999" />
    </div>
  );
}

/* ─── page ─── */
export default function KubernetesPage() {
  const [expanded, setExpanded] = useState<string | null>("k1");
  const [tab, setTab] = useState<"nodes" | "namespaces">("nodes");

  const totalNodes       = ALL_CLUSTERS.reduce((s, c) => s + c.nodes, 0);
  const totalPodsRunning = ALL_CLUSTERS.reduce((s, c) => s + c.pods_running, 0);
  const totalPodsTotal   = ALL_CLUSTERS.reduce((s, c) => s + c.pods_total, 0);
  const healthyClusters  = ALL_CLUSTERS.filter(c => c.status === "سالم").length;

  /* aggregated node status counts across all clusters */
  const nodeStatuses = useMemo(() => {
    let ready = 0, notReady = 0, disabled = 0;
    ALL_CLUSTERS.forEach(c => c.nodeList.forEach(n => {
      if (n.status === "Ready") ready++;
      else if (n.status === "NotReady") notReady++;
      else disabled++;
    }));
    return { ready, notReady, disabled };
  }, []);

  /* selected cluster for detail panel */
  const selected = ALL_CLUSTERS.find(c => c.id === expanded);

  /* namespace bar data for selected cluster */
  const nsBarData = useMemo(() => {
    if (!selected) return [];
    return selected.namespaces.map(ns => ({ name: ns.name, pods: ns.pods, cpu: ns.cpu_m, ram: Math.round(ns.ram_mb / 1024 * 10) / 10 }));
  }, [selected]);

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-[14px] font-bold text-text-main">مدیریت کلاسترهای کوبرنتیس</h2>
          <div className="flex items-center gap-6 text-[11px] text-text-muted">
            <span className="w-8 h-8 rounded-999 bg-green-500 inline-block" /> {nodeStatuses.ready} Ready
            <span className="w-8 h-8 rounded-999 bg-red-500 inline-block ms-6" /> {nodeStatuses.notReady} NotReady
          </div>
        </div>

        {/* node status segmented bar */}
        <div className="flex h-12 rounded-999 overflow-hidden gap-1 mb-10">
          {[
            { count: nodeStatuses.ready,    color: "#16a34a" },
            { count: nodeStatuses.notReady, color: "#ef4444" },
            { count: nodeStatuses.disabled, color: "#d97706" },
          ].filter(s => s.count > 0).map((s, i) => (
            <div key={i} style={{ flex: s.count, background: s.color }} className="rounded-999" />
          ))}
        </div>

        {/* gauges + tiles */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-20 mt-14">
          {/* aggregate gauges for prod cluster */}
          <div className="flex gap-20 shrink-0">
            <Gauge pct={64} color="#2554d8" label="CPU کلاستر prod" />
            <Gauge pct={71} color="#8b5cf6" label="RAM کلاستر prod" />
          </div>

          {/* stat tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 flex-1 w-full">
            {[
              { label: "کلاسترهای سالم",  value: `${healthyClusters} / ${ALL_CLUSTERS.length}`, color: "#16a34a" },
              { label: "نودها",            value: totalNodes,                                     color: "#2554d8" },
              { label: "Pods در حال اجرا", value: `${totalPodsRunning} / ${totalPodsTotal}`,      color: "#8b5cf6" },
              { label: "نودهای ناسالم",    value: nodeStatuses.notReady,                          color: "#ef4444" },
            ].map(s => (
              <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
                <p className="text-[22px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── resource timeline ─── */}
      <div className="glass rounded-16 p-16">
        <p className="text-[13px] font-semibold text-text-main mb-12">مصرف منابع کل — ۲۴ ساعت اخیر</p>
        <div className="ltr-text h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TIMELINE} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="k8sCpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2554d8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2554d8" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="k8sRamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="h" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
              <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} unit="٪" domain={[0, 100]} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
              <Area type="monotone" dataKey="cpu" name="CPU" stroke="#2554d8" fill="url(#k8sCpuGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="ram" name="RAM" stroke="#8b5cf6" fill="url(#k8sRamGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── clusters list ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">کلاسترها</h3>
          <button className="flex items-center gap-6 px-12 py-6 rounded-8 text-[12px] font-medium bg-brand text-white hover:bg-brand/90 transition-colors">
            + کلاستر جدید
          </button>
        </div>

        <div className="flex flex-col gap-8">
          {ALL_CLUSTERS.map(cluster => (
            <div key={cluster.id} className="border border-border rounded-12 overflow-hidden">
              {/* cluster row */}
              <div
                className="flex items-center gap-14 px-16 py-12 cursor-pointer hover:bg-bg/40 transition-colors"
                onClick={() => setExpanded(expanded === cluster.id ? null : cluster.id)}
              >
                <span className="text-text-muted text-[10px]">{expanded === cluster.id ? "▲" : "▶"}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-10 mb-4">
                    <span className="text-[13px] font-semibold text-text-main ltr-text">{cluster.name}</span>
                    <span className="px-6 py-2 rounded-4 text-[10px] font-medium ltr-text bg-[#e2e8f0] text-text-muted">v{cluster.version}</span>
                    <span className="px-8 py-2 rounded-4 text-[10px] font-medium" style={{ background: `${STATUS_COLOR[cluster.status]}18`, color: STATUS_COLOR[cluster.status] }}>
                      {cluster.status}
                    </span>
                    <span className="px-8 py-2 rounded-4 text-[10px] font-medium" style={{ background: `${REGION_COLOR[cluster.region] || "#94a3b8"}18`, color: REGION_COLOR[cluster.region] || "#94a3b8" }}>
                      {cluster.region}
                    </span>
                  </div>
                  <div className="flex items-center gap-16 text-[11px] text-text-muted">
                    <span>{cluster.nodes} نود</span>
                    <span>{cluster.pods_running}/{cluster.pods_total} Pod</span>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-16">
                  <div className="w-[100px]">
                    <div className="flex justify-between text-[10px] text-text-muted mb-2"><span>CPU</span><span>{cluster.cpu_pct}٪</span></div>
                    <MiniBar pct={cluster.cpu_pct} color={cluster.cpu_pct > 80 ? "#ef4444" : "#2554d8"} />
                  </div>
                  <div className="w-[100px]">
                    <div className="flex justify-between text-[10px] text-text-muted mb-2"><span>RAM</span><span>{cluster.ram_pct}٪</span></div>
                    <MiniBar pct={cluster.ram_pct} color={cluster.ram_pct > 85 ? "#ef4444" : "#8b5cf6"} />
                  </div>
                </div>
              </div>

              {/* expanded detail */}
              {expanded === cluster.id && (
                <div className="border-t border-border bg-bg/30 p-16">
                  {/* tab switcher */}
                  <div className="flex gap-8 mb-14">
                    {(["nodes", "namespaces"] as const).map(t => (
                      <button key={t} onClick={() => setTab(t)}
                        className={`px-12 py-5 rounded-6 text-[11px] font-medium transition-colors ${tab === t ? "bg-brand text-white" : "bg-bg border border-border text-text-muted hover:text-text-main"}`}>
                        {t === "nodes" ? "نودها" : "Namespace ها"}
                      </button>
                    ))}
                  </div>

                  {tab === "nodes" && cluster.nodeList.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="text-text-muted border-b border-border">
                            <th className="text-start pb-6 font-medium">نام</th>
                            <th className="text-start pb-6 font-medium">نقش</th>
                            <th className="text-start pb-6 font-medium">وضعیت</th>
                            <th className="text-start pb-6 font-medium">CPU</th>
                            <th className="text-start pb-6 font-medium">RAM</th>
                            <th className="text-start pb-6 font-medium">Pods</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cluster.nodeList.map(n => (
                            <tr key={n.name} className="border-b border-border/30 last:border-0">
                              <td className="py-8 ltr-text font-mono text-text-main">{n.name}</td>
                              <td className="py-8">
                                <span className={`px-6 py-2 rounded-4 text-[10px] font-medium ${n.role === "master" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
                                  {n.role}
                                </span>
                              </td>
                              <td className="py-8">
                                <span className="px-6 py-2 rounded-4 text-[10px] font-semibold ltr-text" style={{ background: `${NODE_STATUS_COLOR[n.status]}18`, color: NODE_STATUS_COLOR[n.status] }}>
                                  {n.status}
                                </span>
                              </td>
                              <td className="py-8 w-[140px]">
                                <div className="flex items-center gap-6">
                                  <MiniBar pct={(n.cpu_used / n.cpu_cores) * 100} color="#2554d8" />
                                  <span className="ltr-text text-text-muted whitespace-nowrap">{n.cpu_used}/{n.cpu_cores}c</span>
                                </div>
                              </td>
                              <td className="py-8 w-[140px]">
                                <div className="flex items-center gap-6">
                                  <MiniBar pct={(n.ram_used / n.ram_gb) * 100} color="#8b5cf6" />
                                  <span className="ltr-text text-text-muted whitespace-nowrap">{n.ram_used.toFixed(0)}/{n.ram_gb}G</span>
                                </div>
                              </td>
                              <td className="py-8 ltr-text text-text-muted">{n.pods}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {tab === "namespaces" && cluster.namespaces.length > 0 && (
                    <div className="ltr-text h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={nsBarData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={14}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: "var(--font-vazirmatn)" }} />
                          <YAxis tick={{ fontSize: 9, fontFamily: "var(--font-vazirmatn)" }} />
                          <Tooltip content={<ChartTooltip />} />
                          <Legend wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                          <Bar dataKey="pods" name="Pods" fill="#2554d8" radius={[3,3,0,0]} />
                          <Bar dataKey="cpu" name="CPU (m)" fill="#8b5cf6" radius={[3,3,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {cluster.nodeList.length === 0 && (
                    <p className="text-[12px] text-text-muted text-center py-20">در حال راه‌اندازی — نودها هنوز متصل نشده‌اند</p>
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
