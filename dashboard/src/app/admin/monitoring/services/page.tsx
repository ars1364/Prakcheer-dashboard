"use client";

import { useState } from "react";
import Link from "next/link";

interface Service {
  id:       string;
  name:     string;
  category: string;
  status:   "healthy" | "degraded" | "down" | "maintenance";
  uptime:   number;
  latency:  number;
  lastCheck:string;
  region:   string;
  version:  string;
}

const SERVICES: Service[] = [
  { id: "svc01", name: "Nova (Compute)",      category: "IaaS",        status: "healthy",     uptime: 99.97, latency: 12,  lastCheck: "۳۰ ثانیه پیش", region: "تهران-۱",   version: "27.1.0"  },
  { id: "svc02", name: "Neutron (Network)",   category: "IaaS",        status: "healthy",     uptime: 99.95, latency: 18,  lastCheck: "۳۰ ثانیه پیش", region: "تهران-۱",   version: "22.0.0"  },
  { id: "svc03", name: "Cinder (Storage)",    category: "IaaS",        status: "degraded",    uptime: 99.71, latency: 84,  lastCheck: "۱ دقیقه پیش",  region: "اصفهان-۱",  version: "21.1.0"  },
  { id: "svc04", name: "Keystone (Auth)",     category: "Identity",    status: "healthy",     uptime: 100,   latency: 8,   lastCheck: "۳۰ ثانیه پیش", region: "تهران-۱",   version: "23.0.0"  },
  { id: "svc05", name: "Glance (Images)",     category: "IaaS",        status: "healthy",     uptime: 99.99, latency: 25,  lastCheck: "۳۰ ثانیه پیش", region: "تهران-۱",   version: "26.0.0"  },
  { id: "svc06", name: "Octavia (LB)",        category: "Network",     status: "healthy",     uptime: 99.88, latency: 31,  lastCheck: "۱ دقیقه پیش",  region: "تهران-۱",   version: "12.0.0"  },
  { id: "svc07", name: "Swift (Object)",      category: "Storage",     status: "maintenance", uptime: 98.2,  latency: 0,   lastCheck: "۵ دقیقه پیش",  region: "مشهد-۱",    version: "2.31.0"  },
  { id: "svc08", name: "Ceph",               category: "Storage",     status: "degraded",    uptime: 99.44, latency: 112, lastCheck: "۲ دقیقه پیش",  region: "اصفهان-۱",  version: "17.2.6"  },
  { id: "svc09", name: "RabbitMQ",           category: "Messaging",   status: "healthy",     uptime: 99.99, latency: 4,   lastCheck: "۳۰ ثانیه پیش", region: "تهران-۱",   version: "3.12.0"  },
  { id: "svc10", name: "MariaDB Galera",     category: "Database",    status: "healthy",     uptime: 100,   latency: 6,   lastCheck: "۳۰ ثانیه پیش", region: "تهران-۱",   version: "10.11.4" },
  { id: "svc11", name: "Magnum (K8s)",       category: "Container",   status: "healthy",     uptime: 99.91, latency: 44,  lastCheck: "۱ دقیقه پیش",  region: "تهران-۱",   version: "15.0.0"  },
  { id: "svc12", name: "Designate (DNS)",    category: "Network",     status: "healthy",     uptime: 99.98, latency: 22,  lastCheck: "۳۰ ثانیه پیش", region: "همه",        version: "17.0.0"  },
  { id: "svc13", name: "Heat (Orchestration)", category: "Automation", status: "down",       uptime: 97.8,  latency: 0,   lastCheck: "۱۰ دقیقه پیش", region: "مشهد-۱",    version: "21.0.0"  },
  { id: "svc14", name: "Barbican (Secrets)", category: "Security",    status: "healthy",     uptime: 100,   latency: 9,   lastCheck: "۳۰ ثانیه پیش", region: "تهران-۱",   version: "14.0.0"  },
];

const STATUS_STYLE: Record<string, string> = {
  healthy:     "bg-green-100 text-green-700",
  degraded:    "bg-amber-100 text-amber-700",
  down:        "bg-red-100 text-red-700",
  maintenance: "bg-blue-50 text-brand",
};
const STATUS_DOT: Record<string, string> = {
  healthy: "#16a34a", degraded: "#d97706", down: "#dc2626", maintenance: "#2554d8",
};
const STATUS_LABEL: Record<string, string> = { healthy: "سالم", degraded: "تنزل", down: "خاموش", maintenance: "نگهداری" };

export default function AdminMonitoringServicesPage() {
  const [filter, setFilter] = useState<string>("همه");

  const categories = ["همه", ...Array.from(new Set(SERVICES.map((s) => s.category)))];
  const filtered = filter === "همه" ? SERVICES : SERVICES.filter((s) => s.category === filter);

  const healthy     = SERVICES.filter((s) => s.status === "healthy").length;
  const degraded    = SERVICES.filter((s) => s.status === "degraded").length;
  const down        = SERVICES.filter((s) => s.status === "down").length;
  const maintenance = SERVICES.filter((s) => s.status === "maintenance").length;

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">وضعیت سرویس‌های پلتفرم</h1>
            <p className="text-[12px] text-text-muted mt-2">مانیتورینگ لحظه‌ای همه OpenStack و سرویس‌های زیرساختی</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>

        {/* status strip */}
        <div className="flex h-10 rounded-999 overflow-hidden gap-1 mb-10">
          {[
            { count: healthy,     color: "#16a34a" },
            { count: degraded,    color: "#d97706" },
            { count: maintenance, color: "#2554d8" },
            { count: down,        color: "#dc2626" },
          ].map((s, i) => (
            <div key={i} style={{ width: `${(s.count / SERVICES.length) * 100}%`, background: s.color }} className="h-full" />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "سالم",       value: healthy,     color: "#16a34a" },
            { label: "تنزل",       value: degraded,    color: "#d97706" },
            { label: "خاموش",      value: down,        color: "#dc2626" },
            { label: "نگهداری",    value: maintenance, color: "#2554d8" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14 flex flex-wrap gap-8">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all ${filter === c ? "bg-brand text-white" : "border border-border text-text-muted hover:text-text-main"}`}
          >{c}</button>
        ))}
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">سرویس</th>
              <th className="text-start py-12 font-medium">دسته</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">آپتایم</th>
              <th className="text-start py-12 font-medium">تأخیر</th>
              <th className="text-start py-12 font-medium">منطقه</th>
              <th className="text-start py-12 font-medium">نسخه</th>
              <th className="text-start py-12 font-medium">آخرین بررسی</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11">
                  <div className="flex items-center gap-8">
                    <div className="w-8 h-8 rounded-999 shrink-0" style={{ background: STATUS_DOT[s.status] }} />
                    <span className="font-medium text-text-main">{s.name}</span>
                  </div>
                </td>
                <td className="py-11 text-text-muted">{s.category}</td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${STATUS_STYLE[s.status]}`}>{STATUS_LABEL[s.status]}</span>
                </td>
                <td className={`py-11 font-mono ltr-text font-semibold ${s.uptime < 99 ? "text-red-600" : s.uptime < 99.9 ? "text-amber-600" : "text-green-700"}`} style={{ direction: "ltr" }}>
                  {s.uptime}%
                </td>
                <td className={`py-11 ltr-text ${s.latency === 0 ? "text-text-muted" : s.latency > 100 ? "text-red-600" : s.latency > 50 ? "text-amber-600" : "text-text-main"}`} style={{ direction: "ltr" }}>
                  {s.latency === 0 ? "—" : `${s.latency} ms`}
                </td>
                <td className="py-11 text-text-muted">{s.region}</td>
                <td className="py-11 text-text-muted font-mono ltr-text" style={{ direction: "ltr" }}>{s.version}</td>
                <td className="py-11 text-text-muted">{s.lastCheck}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
