"use client";

import { useState } from "react";
import Link from "next/link";

interface Rule {
  id:        string;
  name:      string;
  metric:    string;
  condition: string;
  severity:  "critical" | "warning" | "info";
  enabled:   boolean;
  firing:    boolean;
  channels:  string[];
}

const RULES: Rule[] = [
  { id: "r01", name: "CPU بحرانی",         metric: "cpu_usage",        condition: "> 90% برای ۵ دقیقه",   severity: "critical", enabled: true,  firing: false, channels: ["email","telegram"] },
  { id: "r02", name: "CPU هشدار",          metric: "cpu_usage",        condition: "> 75% برای ۱۰ دقیقه",  severity: "warning",  enabled: true,  firing: true,  channels: ["email"]            },
  { id: "r03", name: "RAM پر",             metric: "memory_usage",     condition: "> 85% برای ۵ دقیقه",   severity: "critical", enabled: true,  firing: false, channels: ["email","telegram"] },
  { id: "r04", name: "دیسک پر",            metric: "disk_usage",       condition: "> 80%",                 severity: "warning",  enabled: true,  firing: false, channels: ["email"]            },
  { id: "r05", name: "خطای K8s Pod",       metric: "k8s_pod_errors",   condition: "pod restart > 5",       severity: "critical", enabled: true,  firing: false, channels: ["telegram","slack"]  },
  { id: "r06", name: "نرخ خطا بالا",       metric: "error_rate",       condition: "> 1% برای ۳ دقیقه",    severity: "critical", enabled: true,  firing: false, channels: ["email","telegram"] },
  { id: "r07", name: "تأخیر API بالا",     metric: "api_latency_p99",  condition: "> 2000ms برای ۵ دقیقه",severity: "warning",  enabled: true,  firing: false, channels: ["email"]            },
  { id: "r08", name: "دیتابیس آهسته",      metric: "db_query_latency", condition: "> 500ms برای ۲ دقیقه", severity: "warning",  enabled: false, firing: false, channels: ["email"]            },
];

const SEV_STYLE: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  warning:  "bg-amber-100 text-amber-700",
  info:     "bg-blue-50 text-brand",
};

export default function MonitoringRulesPage() {
  const [rules, setRules] = useState(RULES);

  const toggle = (id: string) => setRules((r) => r.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">قوانین هشدار</h1>
            <p className="text-[12px] text-text-muted mt-2">شرط‌های trigger برای هشدارهای خودکار</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ قانون جدید</button>
            <Link href="/monitoring" className="text-[12px] text-text-muted hover:text-brand">← مانیتورینگ</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",       value: rules.length,                                         color: "#2554d8" },
            { label: "فعال",     value: rules.filter((r) => r.enabled).length,               color: "#16a34a" },
            { label: "در حال fire", value: rules.filter((r) => r.firing).length,            color: "#dc2626" },
            { label: "بحرانی",   value: rules.filter((r) => r.severity === "critical").length, color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {rules.map((r) => (
          <div key={r.id} className={`glass rounded-12 p-16 border transition-colors ${r.firing ? "border-red-300 bg-red-50/30" : r.enabled ? "border-border" : "border-transparent opacity-60"}`}>
            <div className="flex items-center gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-8 mb-4 flex-wrap">
                  <p className="text-[13px] font-bold text-text-main">{r.name}</p>
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${SEV_STYLE[r.severity]}`}>{r.severity}</span>
                  {r.firing && <span className="px-7 py-2 rounded-5 bg-red-600 text-white text-[10px] font-bold animate-pulse">FIRING</span>}
                </div>
                <p className="text-[11px] text-text-muted mb-4">
                  <span className="font-mono text-brand">{r.metric}</span> — {r.condition}
                </p>
                <div className="flex flex-wrap gap-4">
                  {r.channels.map((c) => <span key={c} className="px-6 py-2 rounded-4 bg-bg border border-border text-text-muted text-[10px]">{c}</span>)}
                </div>
              </div>
              <div className="flex gap-8 items-center shrink-0">
                <button className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">ویرایش</button>
                <button onClick={() => toggle(r.id)}
                  className={`w-[40px] h-[22px] rounded-full relative transition-colors ${r.enabled ? "bg-brand" : "bg-border"}`}>
                  <span className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${r.enabled ? "right-[2px]" : "left-[2px]"}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
