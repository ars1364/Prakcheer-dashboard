"use client";

import Link from "next/link";

interface StackEvent {
  id:           string;
  stack:        string;
  resource:     string;
  resourceType: string;
  action:       "CREATE" | "UPDATE" | "DELETE";
  status:       "COMPLETE" | "IN_PROGRESS" | "FAILED";
  ts:           string;
  reason:       string | null;
}

const EVENTS: StackEvent[] = [
  { id: "ev01", stack: "prod-web-app",    resource: "lb-frontend",       resourceType: "OS::Neutron::LoadBalancer",  action: "UPDATE", status: "COMPLETE",    ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۴۵", reason: null },
  { id: "ev02", stack: "ml-gpu-train",    resource: "gpu-node-01",        resourceType: "OS::Nova::Server",           action: "CREATE", status: "IN_PROGRESS", ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۳۲", reason: null },
  { id: "ev03", stack: "ml-gpu-train",    resource: "gpu-volume-01",      resourceType: "OS::Cinder::Volume",         action: "CREATE", status: "COMPLETE",    ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۳۰", reason: null },
  { id: "ev04", stack: "ml-gpu-train",    resource: "gpu-network",        resourceType: "OS::Neutron::Net",           action: "CREATE", status: "COMPLETE",    ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۲۹", reason: null },
  { id: "ev05", stack: "staging-web-app", resource: "web-server-02",     resourceType: "OS::Nova::Server",           action: "UPDATE", status: "COMPLETE",    ts: "۱۴۰۵/۰۲/۰۳ ۱۰:۱۲", reason: null },
  { id: "ev06", stack: "db-ha-prod",      resource: "db-primary",         resourceType: "OS::Nova::Server",           action: "CREATE", status: "FAILED",      ts: "۱۴۰۵/۰۱/۲۸ ۱۶:۴۴", reason: "Quota exceeded: instances" },
  { id: "ev07", stack: "db-ha-prod",      resource: "db-network",         resourceType: "OS::Neutron::Net",           action: "CREATE", status: "COMPLETE",    ts: "۱۴۰۵/۰۱/۲۸ ۱۶:۴۰", reason: null },
  { id: "ev08", stack: "monitoring",      resource: "prometheus-server",  resourceType: "OS::Nova::Server",           action: "UPDATE", status: "COMPLETE",    ts: "۱۴۰۵/۰۲/۰۱ ۰۸:۵۵", reason: null },
  { id: "ev09", stack: "k8s-main-cluster", resource: "master-node-01",   resourceType: "OS::Nova::Server",           action: "CREATE", status: "COMPLETE",    ts: "۱۴۰۴/۰۹/۰۱ ۱۱:۲۰", reason: null },
  { id: "ev10", stack: "base-network-prod", resource: "router-main",     resourceType: "OS::Neutron::Router",        action: "CREATE", status: "COMPLETE",    ts: "۱۴۰۳/۱۱/۰۱ ۰۹:۱۰", reason: null },
];

const ACTION_COLOR: Record<string, string> = { CREATE: "#2554d8", UPDATE: "#d97706", DELETE: "#dc2626" };
const STATUS_STYLE: Record<string, string> = {
  COMPLETE:    "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  FAILED:      "bg-red-100 text-red-700",
};

export default function StackEventsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">رویدادهای Stack</h1>
            <p className="text-[12px] text-text-muted mt-2">لاگ رویدادهای چرخه عمر stack‌ها</p>
          </div>
          <Link href="/automation/stacks" className="text-[12px] text-text-muted hover:text-brand">← stack‌ها</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل رویداد",    value: EVENTS.length,                                            color: "#2554d8" },
            { label: "موفق",         value: EVENTS.filter((e) => e.status === "COMPLETE").length,     color: "#16a34a" },
            { label: "در جریان",     value: EVENTS.filter((e) => e.status === "IN_PROGRESS").length,  color: "#d97706" },
            { label: "خطا",          value: EVENTS.filter((e) => e.status === "FAILED").length,       color: "#dc2626" },
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
              <th className="text-start px-16 py-12 font-medium">زمان</th>
              <th className="text-start py-12 font-medium">Stack</th>
              <th className="text-start py-12 font-medium">منبع</th>
              <th className="text-start py-12 font-medium">نوع</th>
              <th className="text-start py-12 font-medium">عملیات</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">دلیل</th>
            </tr>
          </thead>
          <tbody>
            {EVENTS.map((e) => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-10 text-text-muted text-[11px] ltr-text" style={{ direction: "ltr" }}>{e.ts}</td>
                <td className="py-10 font-mono text-[10px] text-brand">{e.stack}</td>
                <td className="py-10 font-mono text-[11px] text-text-main">{e.resource}</td>
                <td className="py-10 font-mono text-[10px] text-text-muted ltr-text" style={{ direction: "ltr" }}>{e.resourceType.split("::").pop()}</td>
                <td className="py-10">
                  <span className="text-[11px] font-bold" style={{ color: ACTION_COLOR[e.action] }}>{e.action}</span>
                </td>
                <td className="py-10">
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${STATUS_STYLE[e.status]}`}>
                    {e.status === "COMPLETE" ? "موفق" : e.status === "IN_PROGRESS" ? "در جریان" : "خطا"}
                  </span>
                </td>
                <td className="py-10 pe-12 text-text-muted text-[11px]">{e.reason ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
