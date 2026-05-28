"use client";

import { useState } from "react";
import Link from "next/link";

const THRESHOLDS = [
  { id: "th01", name: "Compute CPU High",      metric: "nova.compute.cpu_pct",     warn: 80, crit: 90, duration: "5m",  enabled: true,  notify: ["slack", "email"] },
  { id: "th02", name: "Compute RAM High",      metric: "nova.compute.ram_pct",     warn: 85, crit: 95, duration: "5m",  enabled: true,  notify: ["slack"]          },
  { id: "th03", name: "Ceph OSD Errors",       metric: "ceph.osd.errors_per_min",  warn: 50, crit: 100,duration: "2m",  enabled: true,  notify: ["slack", "sms"]   },
  { id: "th04", name: "API Latency",           metric: "api.latency_p99_ms",       warn: 500,crit: 1000,duration: "3m", enabled: true,  notify: ["slack"]          },
  { id: "th05", name: "Tenant Budget",         metric: "billing.budget_pct",       warn: 80, crit: 95, duration: "daily",enabled: true, notify: ["email"]          },
  { id: "th06", name: "Failed Logins",         metric: "auth.failed_logins_10m",   warn: 5,  crit: 10, duration: "10m", enabled: true,  notify: ["slack", "sms"]   },
  { id: "th07", name: "Queue Depth",           metric: "celery.queue.depth",       warn: 20, crit: 50, duration: "5m",  enabled: false, notify: ["slack"]          },
];

export default function ThresholdsPage() {
  const [items, setItems] = useState(THRESHOLDS);
  const toggle = (id: string) => setItems((t) => t.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">آستانه‌های هشدار</h1>
            <p className="text-[12px] text-text-muted mt-2">پیکربندی حدود هشدار پلتفرم</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90 transition-colors">+ آستانه جدید</button>
            <Link href="/admin/alerts" className="text-[12px] text-text-muted hover:text-brand">← هشدارها</Link>
          </div>
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">نام</th>
              <th className="text-start py-12 font-medium">متریک</th>
              <th className="text-start py-12 font-medium">هشدار</th>
              <th className="text-start py-12 font-medium">بحرانی</th>
              <th className="text-start py-12 font-medium">مدت</th>
              <th className="text-start py-12 font-medium">کانال</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className={`border-b border-border/50 hover:bg-bg/60 ${!t.enabled ? "opacity-50" : ""}`}>
                <td className="px-16 py-11 font-semibold text-text-main">{t.name}</td>
                <td className="py-11 font-mono text-[10px] text-text-muted ltr-text" style={{ direction: "ltr" }}>{t.metric}</td>
                <td className="py-11 text-amber-600 font-semibold">≥ {t.warn}</td>
                <td className="py-11 text-red-600 font-semibold">≥ {t.crit}</td>
                <td className="py-11 text-text-muted font-mono">{t.duration}</td>
                <td className="py-11">
                  <div className="flex gap-4">
                    {t.notify.map((n) => (
                      <span key={n} className="px-6 py-2 rounded-4 bg-bg border border-border text-[10px] text-text-muted">{n}</span>
                    ))}
                  </div>
                </td>
                <td className="py-11">
                  <button
                    onClick={() => toggle(t.id)}
                    className={`relative w-40 h-22 rounded-999 transition-colors ${t.enabled ? "bg-brand" : "bg-border"}`}
                  >
                    <span className={`absolute top-2 w-18 h-18 rounded-999 bg-white shadow transition-all ${t.enabled ? "right-2" : "left-2"}`} />
                  </button>
                </td>
                <td className="py-11 pe-12">
                  <button className="px-10 py-4 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg transition-colors">ویرایش</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
