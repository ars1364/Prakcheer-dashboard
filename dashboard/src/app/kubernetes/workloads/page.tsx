"use client";

import { useState } from "react";
import Link from "next/link";

interface Workload {
  namespace: string;
  name:      string;
  kind:      "Deployment" | "StatefulSet" | "DaemonSet" | "Job" | "CronJob";
  cluster:   string;
  replicas:  string;
  image:     string;
  age:       string;
  status:    "running" | "pending" | "failed" | "completed";
}

const WORKLOADS: Workload[] = [
  { namespace: "default",    name: "api-server",      kind: "Deployment",  cluster: "prod-main",   replicas: "3/3",  image: "registry.ir/api:v2.4.1",   age: "۱۴ روز",  status: "running"   },
  { namespace: "default",    name: "worker",          kind: "Deployment",  cluster: "prod-main",   replicas: "5/5",  image: "registry.ir/worker:v2.4.1", age: "۱۴ روز",  status: "running"   },
  { namespace: "default",    name: "postgres",        kind: "StatefulSet", cluster: "prod-main",   replicas: "2/2",  image: "postgres:15",               age: "۴۵ روز",  status: "running"   },
  { namespace: "default",    name: "redis",           kind: "StatefulSet", cluster: "prod-main",   replicas: "1/1",  image: "redis:7-alpine",            age: "۴۵ روز",  status: "running"   },
  { namespace: "monitoring", name: "prometheus",      kind: "Deployment",  cluster: "prod-main",   replicas: "1/1",  image: "prom/prometheus:v2.50",     age: "۳۰ روز",  status: "running"   },
  { namespace: "monitoring", name: "grafana",         kind: "Deployment",  cluster: "prod-main",   replicas: "1/1",  image: "grafana/grafana:10.3",      age: "۳۰ روز",  status: "running"   },
  { namespace: "kube-system",name: "coredns",         kind: "Deployment",  cluster: "prod-main",   replicas: "2/2",  image: "registry.k8s.io/coredns",   age: "۱۲۰ روز", status: "running"   },
  { namespace: "default",    name: "ml-trainer",      kind: "Job",         cluster: "ml-train",    replicas: "1/1",  image: "registry.ir/ml:v1.2",       age: "۱ ساعت",  status: "running"   },
  { namespace: "default",    name: "nightly-backup",  kind: "CronJob",     cluster: "staging",     replicas: "0/0",  image: "registry.ir/backup:v1",     age: "۷ روز",   status: "completed" },
  { namespace: "default",    name: "staging-api",     kind: "Deployment",  cluster: "staging",     replicas: "1/2",  image: "registry.ir/api:v2.5-beta", age: "۲ روز",   status: "pending"   },
];

const KIND_COLOR: Record<string, string> = {
  Deployment: "#2554d8", StatefulSet: "#7c3aed", DaemonSet: "#16a34a", Job: "#d97706", CronJob: "#0891b2",
};

const STATUS_STYLE: Record<string, string> = {
  running:   "bg-green-100 text-green-700",
  pending:   "bg-amber-100 text-amber-700",
  failed:    "bg-red-100 text-red-700",
  completed: "bg-slate-100 text-slate-600",
};

export default function WorkloadsPage() {
  const [cluster, setCluster] = useState("همه");
  const [ns, setNs]           = useState("همه");

  const clusters   = ["همه", ...Array.from(new Set(WORKLOADS.map((w) => w.cluster)))];
  const namespaces = ["همه", ...Array.from(new Set(WORKLOADS.map((w) => w.namespace)))];

  const filtered = WORKLOADS.filter((w) =>
    (cluster === "همه" || w.cluster === cluster) &&
    (ns === "همه" || w.namespace === ns)
  );

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Workload‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">Deployment، StatefulSet، Job و CronJob</p>
          </div>
          <Link href="/kubernetes/clusters" className="text-[12px] text-text-muted hover:text-brand">← کلاسترها</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",     value: WORKLOADS.length,                                             color: "#2554d8" },
            { label: "سالم",   value: WORKLOADS.filter((w) => w.status === "running").length,       color: "#16a34a" },
            { label: "pending",value: WORKLOADS.filter((w) => w.status === "pending").length,       color: "#d97706" },
            { label: "خطا",    value: WORKLOADS.filter((w) => w.status === "failed").length,        color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14 flex flex-wrap gap-10">
        <select value={cluster} onChange={(e) => setCluster(e.target.value)}
          className="px-12 py-8 rounded-8 border border-border bg-bg text-[12px] outline-none focus:border-brand">
          {clusters.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={ns} onChange={(e) => setNs(e.target.value)}
          className="px-12 py-8 rounded-8 border border-border bg-bg text-[12px] outline-none focus:border-brand" dir="ltr">
          {namespaces.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">نام</th>
              <th className="text-start py-12 font-medium">نوع</th>
              <th className="text-start py-12 font-medium">namespace</th>
              <th className="text-start py-12 font-medium">کلاستر</th>
              <th className="text-start py-12 font-medium">replicas</th>
              <th className="text-start py-12 font-medium">image</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">عمر</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w.cluster + w.namespace + w.name} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-10 font-mono text-[11px] font-semibold text-text-main">{w.name}</td>
                <td className="py-10">
                  <span className="px-7 py-2 rounded-4 text-[10px] font-medium" style={{ background: `${KIND_COLOR[w.kind]}15`, color: KIND_COLOR[w.kind] }}>{w.kind}</span>
                </td>
                <td className="py-10 font-mono text-[11px] text-text-muted">{w.namespace}</td>
                <td className="py-10 font-mono text-[10px] text-brand">{w.cluster}</td>
                <td className="py-10 font-mono text-[11px] text-text-main ltr-text">{w.replicas}</td>
                <td className="py-10 font-mono text-[10px] text-text-muted ltr-text max-w-[160px] truncate" style={{ direction: "ltr" }} title={w.image}>{w.image}</td>
                <td className="py-10">
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${STATUS_STYLE[w.status]}`}>
                    {w.status === "running" ? "سالم" : w.status === "pending" ? "در انتظار" : w.status === "failed" ? "خطا" : "تمام"}
                  </span>
                </td>
                <td className="py-10 pe-12 text-text-muted">{w.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
