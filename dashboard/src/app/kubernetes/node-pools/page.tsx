"use client";

import Link from "next/link";

interface NodePool {
  id:      string;
  cluster: string;
  name:    string;
  flavor:  string;
  nodes:   number;
  min:     number;
  max:     number;
  autoscale: boolean;
  status:  "ready" | "scaling" | "error";
  labels:  string[];
}

const POOLS: NodePool[] = [
  { id: "np01", cluster: "prod-main",   name: "default",      flavor: "c4.xlarge", nodes: 3, min: 2, max: 10, autoscale: true,  status: "ready",   labels: ["role=worker"] },
  { id: "np02", cluster: "prod-main",   name: "gpu-pool",     flavor: "g2.2xlarge",nodes: 2, min: 1, max: 4,  autoscale: true,  status: "ready",   labels: ["accelerator=gpu","role=gpu-worker"] },
  { id: "np03", cluster: "staging",     name: "default",      flavor: "c2.large",  nodes: 2, min: 1, max: 4,  autoscale: true,  status: "ready",   labels: ["role=worker"] },
  { id: "np04", cluster: "ml-train",    name: "cpu-pool",     flavor: "c4.xlarge", nodes: 1, min: 1, max: 3,  autoscale: false, status: "ready",   labels: ["role=cpu"] },
  { id: "np05", cluster: "ml-train",    name: "gpu-train",    flavor: "g2.8xlarge",nodes: 2, min: 1, max: 4,  autoscale: false, status: "scaling", labels: ["accelerator=gpu","role=train"] },
  { id: "np06", cluster: "dev-cluster", name: "dev-nodes",    flavor: "c2.medium", nodes: 1, min: 1, max: 2,  autoscale: true,  status: "ready",   labels: ["env=dev"] },
];

const STATUS_STYLE: Record<string, string> = {
  ready:   "bg-green-100 text-green-700",
  scaling: "bg-amber-100 text-amber-700",
  error:   "bg-red-100 text-red-700",
};

export default function NodePoolsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Node Pool‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">گروه‌های نود در کلاسترهای Kubernetes</p>
          </div>
          <Link href="/kubernetes/clusters" className="text-[12px] text-text-muted hover:text-brand">← کلاسترها</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل pool",        value: POOLS.length,                                        color: "#2554d8" },
            { label: "کل نود",         value: POOLS.reduce((a, p) => a + p.nodes, 0),             color: "#16a34a" },
            { label: "autoscale فعال", value: POOLS.filter((p) => p.autoscale).length,            color: "#7c3aed" },
            { label: "GPU pool",       value: POOLS.filter((p) => p.flavor.startsWith("g")).length,color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">نام pool</th>
              <th className="text-start py-12 font-medium">کلاستر</th>
              <th className="text-start py-12 font-medium">Flavor</th>
              <th className="text-start py-12 font-medium">نودها</th>
              <th className="text-start py-12 font-medium">min/max</th>
              <th className="text-start py-12 font-medium">autoscale</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {POOLS.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono text-[11px] font-semibold text-text-main">{p.name}</td>
                <td className="py-11 font-mono text-[10px] text-brand">{p.cluster}</td>
                <td className="py-11 font-mono text-[11px] text-text-muted ltr-text" style={{ direction: "ltr" }}>{p.flavor}</td>
                <td className="py-11 font-bold text-text-main">{p.nodes}</td>
                <td className="py-11 text-text-muted">{p.min} / {p.max}</td>
                <td className="py-11">
                  <span className={`px-7 py-2 rounded-5 text-[10px] ${p.autoscale ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {p.autoscale ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[10px] font-medium ${STATUS_STYLE[p.status]}`}>
                    {p.status === "ready" ? "آماده" : p.status === "scaling" ? "در حال scale" : "خطا"}
                    {p.status === "scaling" && <span className="ms-4 animate-pulse">●</span>}
                  </span>
                </td>
                <td className="py-11 pe-12">
                  <button className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">ویرایش</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
