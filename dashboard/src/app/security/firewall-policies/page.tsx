"use client";

import { useState } from "react";
import Link from "next/link";

interface Policy {
  id:       string;
  name:     string;
  desc:     string;
  type:     "ingress" | "egress";
  enabled:  boolean;
  rules:    number;
  priority: number;
  attached: string[];
}

const POLICIES: Policy[] = [
  { id: "fp01", name: "prod-web-ingress",     desc: "ترافیک ورودی به web servers",           type: "ingress", enabled: true,  rules: 8,  priority: 100, attached: ["vm-prod-01","vm-prod-02","lb-frontend"] },
  { id: "fp02", name: "prod-api-ingress",     desc: "ترافیک ورودی به API servers",           type: "ingress", enabled: true,  rules: 5,  priority: 100, attached: ["vm-api-01"] },
  { id: "fp03", name: "prod-db-ingress",      desc: "دسترسی به دیتابیس (فقط داخلی)",        type: "ingress", enabled: true,  rules: 3,  priority: 90,  attached: ["prod-postgres","db-primary"] },
  { id: "fp04", name: "default-egress",       desc: "ترافیک خروجی پیش‌فرض",                type: "egress",  enabled: true,  rules: 2,  priority: 50,  attached: ["همه VM های production"] },
  { id: "fp05", name: "dev-permissive",       desc: "سیاست آزاد برای dev",                  type: "ingress", enabled: true,  rules: 1,  priority: 200, attached: ["dev-cluster"] },
  { id: "fp06", name: "monitoring-scrape",    desc: "اجازه دسترسی Prometheus",              type: "ingress", enabled: true,  rules: 2,  priority: 80,  attached: ["همه"] },
  { id: "fp07", name: "block-old-ssh",        desc: "بلاک SSH از IP های خارج از whitelist", type: "ingress", enabled: false, rules: 1,  priority: 200, attached: [] },
];

export default function FirewallPoliciesPage() {
  const [policies, setPolicies] = useState(POLICIES);
  const toggle = (id: string) => setPolicies((p) => p.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">سیاست‌های فایروال</h1>
            <p className="text-[12px] text-text-muted mt-2">قوانین کنترل ترافیک شبکه</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ سیاست جدید</button>
            <Link href="/security" className="text-[12px] text-text-muted hover:text-brand">← امنیت</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",     value: policies.length,                                          color: "#2554d8" },
            { label: "فعال",   value: policies.filter((p) => p.enabled).length,               color: "#16a34a" },
            { label: "ingress",value: policies.filter((p) => p.type === "ingress").length,    color: "#d97706" },
            { label: "egress", value: policies.filter((p) => p.type === "egress").length,     color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {policies.map((p) => (
          <div key={p.id} className={`glass rounded-12 p-16 border transition-colors ${!p.enabled ? "opacity-60 border-transparent" : "border-border"}`}>
            <div className="flex items-center gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-10 mb-4 flex-wrap">
                  <p className="text-[13px] font-bold font-mono text-text-main">{p.name}</p>
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${p.type === "ingress" ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"}`}>{p.type}</span>
                  <span className="text-[11px] text-text-muted">priority {p.priority}</span>
                  <span className="text-[11px] text-text-muted">{p.rules} قانون</span>
                </div>
                <p className="text-[12px] text-text-muted mb-6">{p.desc}</p>
                <div className="flex flex-wrap gap-4">
                  {p.attached.slice(0, 3).map((a) => <span key={a} className="px-6 py-2 rounded-4 bg-bg border border-border text-text-muted text-[10px]">{a}</span>)}
                  {p.attached.length > 3 && <span className="text-[10px] text-text-muted">+{p.attached.length - 3}</span>}
                </div>
              </div>
              <div className="flex gap-8 items-center shrink-0">
                <button className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">قوانین</button>
                <button onClick={() => toggle(p.id)}
                  className={`w-[40px] h-[22px] rounded-full relative transition-colors ${p.enabled ? "bg-brand" : "bg-border"}`}>
                  <span className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${p.enabled ? "right-[2px]" : "left-[2px]"}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
