"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

const METRICS = [
  { name: "cpu_usage",         label: "CPU Usage",        unit: "%",    category: "compute", value: 68, trend: "up"   },
  { name: "memory_usage",      label: "Memory Usage",     unit: "%",    category: "compute", value: 54, trend: "stable"},
  { name: "disk_io_read",      label: "Disk I/O Read",    unit: "MB/s", category: "storage", value: 142,trend: "up"   },
  { name: "disk_io_write",     label: "Disk I/O Write",   unit: "MB/s", category: "storage", value: 89, trend: "down" },
  { name: "network_in",        label: "Network In",       unit: "Gbps", category: "network", value: 2.4,trend: "up"   },
  { name: "network_out",       label: "Network Out",      unit: "Gbps", category: "network", value: 1.8,trend: "stable"},
  { name: "k8s_pod_count",     label: "K8s Pod Count",    unit: "",     category: "k8s",     value: 127,trend: "stable"},
  { name: "k8s_node_cpu",      label: "K8s Node CPU",     unit: "%",    category: "k8s",     value: 71, trend: "up"   },
  { name: "requests_per_sec",  label: "Requests/sec",     unit: "rps",  category: "api",     value: 840,trend: "up"   },
  { name: "error_rate",        label: "Error Rate",       unit: "%",    category: "api",     value: 0.3,trend: "down" },
  { name: "db_connections",    label: "DB Connections",   unit: "",     category: "db",      value: 48, trend: "stable"},
  { name: "db_query_latency",  label: "DB Query Latency", unit: "ms",   category: "db",      value: 12, trend: "stable"},
];

const TREND_DATA = Array.from({ length: 24 }, (_, i) => ({
  t: `${String(i).padStart(2, "0")}:00`,
  v: 40 + Math.random() * 40,
}));

const CAT_COLOR: Record<string, string> = {
  compute: "#2554d8", storage: "#7c3aed", network: "#16a34a",
  k8s: "#0891b2", api: "#d97706", db: "#dc2626",
};

const TREND_ICON: Record<string, string> = { up: "↑", down: "↓", stable: "→" };
const TREND_COLOR: Record<string, string> = { up: "#dc2626", down: "#16a34a", stable: "#64748b" };

export default function MetricsPage() {
  const [cat, setCat]       = useState("همه");
  const [selected, setSelected] = useState(METRICS[0].name);

  const categories = ["همه", "compute", "storage", "network", "k8s", "api", "db"];
  const filtered   = cat === "همه" ? METRICS : METRICS.filter((m) => m.category === cat);
  const sel        = METRICS.find((m) => m.name === selected) ?? METRICS[0];

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[18px] font-bold text-text-main">متریک‌ها</h1>
          <Link href="/monitoring/dashboards" className="text-[12px] text-brand hover:underline">داشبوردها →</Link>
        </div>
        <p className="text-[12px] text-text-muted">متریک‌های زیرساخت در لحظه</p>
      </div>

      <div className="flex flex-wrap gap-6">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-all ${cat === c ? "text-white" : "border border-border text-text-muted"}`}
            style={cat === c ? { background: CAT_COLOR[c] ?? "#2554d8" } : {}}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1 grid grid-cols-2 gap-8 content-start">
          {filtered.map((m) => (
            <button key={m.name} onClick={() => setSelected(m.name)}
              className={`glass rounded-12 p-12 text-start border transition-all ${selected === m.name ? "border-brand bg-brand/5" : "border-border hover:border-brand/40"}`}>
              <p className="text-[11px] text-text-muted mb-4 truncate">{m.label}</p>
              <div className="flex items-end gap-6">
                <p className="text-[18px] font-bold text-text-main">{m.value}</p>
                <span className="text-[11px] mb-1" style={{ color: TREND_COLOR[m.trend] }}>{TREND_ICON[m.trend]}</span>
                <span className="text-[10px] text-text-muted mb-1">{m.unit}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 glass rounded-16 p-20">
          <p className="text-[13px] font-bold text-text-main mb-2">{sel.label}</p>
          <p className="text-[11px] text-text-muted mb-14">آخر ۲۴ ساعت — به‌روزرسانی هر ۳۰ ثانیه</p>
          <div className="ltr-text h-[200px]" style={{ direction: "ltr" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CAT_COLOR[sel.category]} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={CAT_COLOR[sel.category]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="t" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)", fill: "var(--color-text-muted)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)", fill: "var(--color-text-muted)" }} />
                <Tooltip contentStyle={{ background: "var(--color-glass)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="v" stroke={CAT_COLOR[sel.category]} fill="url(#metricGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
