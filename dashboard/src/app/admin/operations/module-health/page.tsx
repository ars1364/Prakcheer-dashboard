"use client";

import Link from "next/link";

const MODULES = [
  { name: "nova-api",           category: "Compute",     status: "healthy",  version: "27.1.0", replicas: "3/3", cpu: 12, mem: 18, restarts: 0  },
  { name: "nova-conductor",     category: "Compute",     status: "healthy",  version: "27.1.0", replicas: "2/2", cpu: 8,  mem: 14, restarts: 0  },
  { name: "nova-scheduler",     category: "Compute",     status: "healthy",  version: "27.1.0", replicas: "2/2", cpu: 5,  mem: 10, restarts: 0  },
  { name: "neutron-server",     category: "Network",     status: "healthy",  version: "22.0.0", replicas: "2/2", cpu: 15, mem: 22, restarts: 0  },
  { name: "neutron-l3-agent",   category: "Network",     status: "degraded", version: "22.0.0", replicas: "1/2", cpu: 24, mem: 31, restarts: 3  },
  { name: "cinder-api",         category: "Storage",     status: "healthy",  version: "21.1.0", replicas: "2/2", cpu: 9,  mem: 16, restarts: 0  },
  { name: "cinder-scheduler",   category: "Storage",     status: "healthy",  version: "21.1.0", replicas: "1/1", cpu: 4,  mem: 8,  restarts: 0  },
  { name: "keystone",           category: "Identity",    status: "healthy",  version: "23.0.0", replicas: "3/3", cpu: 22, mem: 28, restarts: 0  },
  { name: "glance-api",         category: "Image",       status: "healthy",  version: "26.0.0", replicas: "2/2", cpu: 7,  mem: 12, restarts: 0  },
  { name: "octavia-api",        category: "LB",          status: "healthy",  version: "12.0.0", replicas: "2/2", cpu: 6,  mem: 14, restarts: 0  },
  { name: "heat-api",           category: "Orchestration",status: "down",    version: "21.0.0", replicas: "0/2", cpu: 0,  mem: 0,  restarts: 12 },
  { name: "magnum-api",         category: "Container",   status: "healthy",  version: "15.0.0", replicas: "2/2", cpu: 11, mem: 20, restarts: 1  },
  { name: "designate-api",      category: "DNS",         status: "healthy",  version: "17.0.0", replicas: "2/2", cpu: 4,  mem: 9,  restarts: 0  },
  { name: "barbican-api",       category: "Security",    status: "healthy",  version: "14.0.0", replicas: "2/2", cpu: 3,  mem: 7,  restarts: 0  },
];

const STATUS_DOT: Record<string, string> = { healthy: "#16a34a", degraded: "#d97706", down: "#dc2626" };
const STATUS_BG: Record<string, string>  = { healthy: "bg-green-100 text-green-700", degraded: "bg-amber-100 text-amber-700", down: "bg-red-100 text-red-700" };
const STATUS_LABEL: Record<string, string> = { healthy: "سالم", degraded: "تنزل", down: "خاموش" };

function MiniUsage({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-32 h-4 rounded-999 bg-border overflow-hidden">
        <div className="h-full rounded-999" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] text-text-muted">{pct}%</span>
    </div>
  );
}

export default function ModuleHealthPage() {
  const healthy  = MODULES.filter((m) => m.status === "healthy").length;
  const degraded = MODULES.filter((m) => m.status === "degraded").length;
  const down     = MODULES.filter((m) => m.status === "down").length;

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">سلامت ماژول‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">وضعیت پروسه‌ها و Replica های هر سرویس پلتفرم</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        <div className="flex h-10 rounded-999 overflow-hidden gap-1 mb-10">
          <div style={{ width: `${(healthy / MODULES.length) * 100}%`, background: "#16a34a" }} className="h-full" />
          <div style={{ width: `${(degraded / MODULES.length) * 100}%`, background: "#d97706" }} className="h-full" />
          <div style={{ width: `${(down / MODULES.length) * 100}%`, background: "#dc2626" }} className="h-full" />
        </div>
        <div className="grid grid-cols-3 gap-12 mt-12">
          {[{ label: "سالم", value: healthy, color: "#16a34a" }, { label: "تنزل", value: degraded, color: "#d97706" }, { label: "خاموش", value: down, color: "#dc2626" }].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">ماژول</th>
              <th className="text-start py-12 font-medium">دسته</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">Replicas</th>
              <th className="text-start py-12 font-medium">CPU</th>
              <th className="text-start py-12 font-medium">Memory</th>
              <th className="text-start py-12 font-medium">Restarts</th>
              <th className="text-start py-12 font-medium">نسخه</th>
            </tr>
          </thead>
          <tbody>
            {MODULES.map((m) => (
              <tr key={m.name} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11">
                  <div className="flex items-center gap-7">
                    <div className="w-6 h-6 rounded-999 shrink-0" style={{ background: STATUS_DOT[m.status] }} />
                    <span className="font-mono text-[11px] text-text-main">{m.name}</span>
                  </div>
                </td>
                <td className="py-11 text-text-muted">{m.category}</td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${STATUS_BG[m.status]}`}>{STATUS_LABEL[m.status]}</span>
                </td>
                <td className={`py-11 font-mono text-[11px] ltr-text font-semibold ${m.replicas.startsWith("0") ? "text-red-600" : !m.replicas.split("/").every((v,i,a)=>i===0||v===a[0]) ? "text-amber-600" : "text-green-700"}`} style={{ direction: "ltr" }}>{m.replicas}</td>
                <td className="py-11"><MiniUsage pct={m.cpu} color="#2554d8" /></td>
                <td className="py-11"><MiniUsage pct={m.mem} color="#7c3aed" /></td>
                <td className={`py-11 font-semibold ${m.restarts > 5 ? "text-red-600" : m.restarts > 0 ? "text-amber-600" : "text-text-muted"}`}>{m.restarts}</td>
                <td className="py-11 text-text-muted font-mono ltr-text text-[10px]" style={{ direction: "ltr" }}>{m.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
