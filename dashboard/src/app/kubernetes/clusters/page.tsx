"use client";

import { useState } from "react";
import Link from "next/link";

interface Cluster {
  id:       string;
  name:     string;
  version:  string;
  region:   string;
  nodes:    number;
  cpu:      { used: number; total: number };
  ram:      { used: number; total: number };
  status:   "running" | "provisioning" | "upgrading" | "error";
  created:  string;
  endpoint: string;
}

const CLUSTERS: Cluster[] = [
  { id: "k01", name: "prod-main",     version: "1.29.4", region: "تهران-۱",  nodes: 5, cpu: { used: 28, total: 40 }, ram: { used: 96,  total: 160 }, status: "running",      created: "۱۴۰۴/۰۹/۰۱", endpoint: "https://185.20.14.50:6443" },
  { id: "k02", name: "staging",       version: "1.29.4", region: "تهران-۱",  nodes: 2, cpu: { used: 6,  total: 16 }, ram: { used: 20,  total: 64  }, status: "running",      created: "۱۴۰۴/۱۰/۱۵", endpoint: "https://185.20.14.51:6443" },
  { id: "k03", name: "ml-train",      version: "1.28.7", region: "تهران-۱",  nodes: 3, cpu: { used: 18, total: 24 }, ram: { used: 72,  total: 96  }, status: "running",      created: "۱۴۰۵/۰۱/۱۵", endpoint: "https://185.20.14.52:6443" },
  { id: "k04", name: "dev-cluster",   version: "1.30.0", region: "تهران-۱",  nodes: 1, cpu: { used: 2,  total: 8  }, ram: { used: 4,   total: 32  }, status: "upgrading",    created: "۱۴۰۵/۰۲/۰۱", endpoint: "https://185.20.14.53:6443" },
  { id: "k05", name: "edge-mashhad",  version: "1.29.4", region: "مشهد-۱",   nodes: 2, cpu: { used: 0,  total: 16 }, ram: { used: 0,   total: 64  }, status: "provisioning", created: "۱۴۰۵/۰۲/۰۷", endpoint: "pending" },
];

const STATUS_STYLE: Record<string, string> = {
  running:      "bg-green-100 text-green-700",
  provisioning: "bg-amber-100 text-amber-700",
  upgrading:    "bg-blue-50 text-brand",
  error:        "bg-red-100 text-red-700",
};

function UsageBar({ used, total, unit }: { used: number; total: number; unit: string }) {
  const pct  = total > 0 ? Math.round((used / total) * 100) : 0;
  const color = pct >= 90 ? "#dc2626" : pct >= 70 ? "#d97706" : "#16a34a";
  return (
    <div>
      <div className="flex justify-between text-[10px] text-text-muted mb-2">
        <span>{used}/{total} {unit}</span><span style={{ color }}>{pct}٪</span>
      </div>
      <div className="h-3 rounded-full bg-bg overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function KubernetesClustersPage() {
  const [filter, setFilter] = useState("همه");

  const statuses = ["همه", "running", "provisioning", "upgrading", "error"];
  const filtered = filter === "همه" ? CLUSTERS : CLUSTERS.filter((c) => c.status === filter);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">کلاسترهای Kubernetes</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت کلاسترهای Kubernetes</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ کلاستر جدید</button>
            <Link href="/kubernetes" className="text-[12px] text-text-muted hover:text-brand">← Kubernetes</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",          value: CLUSTERS.length,                                           color: "#2554d8" },
            { label: "در حال اجرا", value: CLUSTERS.filter((c) => c.status === "running").length,    color: "#16a34a" },
            { label: "کل نود",      value: CLUSTERS.reduce((a, c) => a + c.nodes, 0),               color: "#7c3aed" },
            { label: "در جریان",    value: CLUSTERS.filter((c) => c.status !== "running" && c.status !== "error").length, color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all ${filter === s ? "bg-brand text-white" : "border border-border text-text-muted"}`}>
            {s === "همه" ? "همه" : s === "running" ? "در حال اجرا" : s === "provisioning" ? "در حال ساخت" : s === "upgrading" ? "در حال آپگرید" : "خطا"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-12">
        {filtered.map((c) => (
          <div key={c.id} className="glass rounded-16 p-18 border border-border">
            <div className="flex items-start justify-between gap-12 mb-12">
              <div>
                <div className="flex items-center gap-10 mb-4">
                  <p className="text-[14px] font-bold font-mono text-text-main">{c.name}</p>
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${STATUS_STYLE[c.status]}`}>
                    {c.status === "running" ? "در حال اجرا" : c.status === "provisioning" ? "در حال ساخت" : c.status === "upgrading" ? "آپگرید" : "خطا"}
                    {c.status !== "running" && c.status !== "error" && <span className="ms-4 animate-pulse">●</span>}
                  </span>
                </div>
                <div className="flex gap-12 text-[11px] text-text-muted flex-wrap">
                  <span className="ltr-text">v{c.version}</span>
                  <span>{c.region}</span>
                  <span>{c.nodes} نود</span>
                  <span>ایجاد: {c.created}</span>
                </div>
              </div>
              <div className="flex gap-6 shrink-0">
                <button className="px-10 py-5 rounded-6 bg-brand text-white text-[11px]">kubeconfig</button>
                <Link href="/kubernetes/node-pools" className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">نودها</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <UsageBar used={c.cpu.used} total={c.cpu.total} unit="vCPU" />
              <UsageBar used={c.ram.used} total={c.ram.total} unit="GB RAM" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
