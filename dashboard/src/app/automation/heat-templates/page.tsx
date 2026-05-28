"use client";

import { useState } from "react";
import Link from "next/link";

interface Template {
  id:      string;
  name:    string;
  desc:    string;
  version: string;
  params:  number;
  stacks:  number;
  updated: string;
  tags:    string[];
}

const TEMPLATES: Template[] = [
  { id: "t01", name: "web-app-3tier",      desc: "معماری ۳ لایه با load balancer، web server و database", version: "2.1.0", params: 12, stacks: 3, updated: "۱۴۰۵/۰۱", tags: ["web","ha","lb"]        },
  { id: "t02", name: "k8s-cluster",        desc: "کلاستر Kubernetes با master و worker های HA",          version: "1.4.2", params: 8,  stacks: 2, updated: "۱۴۰۴/۱۲", tags: ["k8s","ha"]             },
  { id: "t03", name: "vpc-baseline",       desc: "شبکه VPC پایه با subnet های عمومی و خصوصی",           version: "1.0.0", params: 5,  stacks: 5, updated: "۱۴۰۴/۰۹", tags: ["network","vpc"]        },
  { id: "t04", name: "ml-gpu-cluster",     desc: "خوشه GPU برای یادگیری ماشین با shared storage",       version: "1.2.0", params: 10, stacks: 1, updated: "۱۴۰۵/۰۲", tags: ["gpu","ml","storage"]    },
  { id: "t05", name: "database-ha",        desc: "PostgreSQL با replication و backup خودکار",            version: "3.0.1", params: 9,  stacks: 2, updated: "۱۴۰۴/۱۱", tags: ["database","ha","pg"]    },
  { id: "t06", name: "monitoring-stack",   desc: "Prometheus + Grafana + Alertmanager",                  version: "2.0.0", params: 6,  stacks: 1, updated: "۱۴۰۴/۱۰", tags: ["monitoring","observability"] },
  { id: "t07", name: "cdn-edge",           desc: "لبه CDN با cache nodes در چند region",                version: "1.1.0", params: 7,  stacks: 1, updated: "۱۴۰۵/۰۱", tags: ["cdn","network"]         },
  { id: "t08", name: "dev-sandbox",        desc: "محیط dev ایزوله با auto-cleanup",                     version: "1.3.0", params: 4,  stacks: 3, updated: "۱۴۰۵/۰۲", tags: ["dev","sandbox"]         },
];

export default function HeatTemplatesPage() {
  const [search, setSearch] = useState("");
  const filtered = TEMPLATES.filter((t) => !search || t.name.includes(search) || t.desc.includes(search));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">قالب‌های Heat</h1>
            <p className="text-[12px] text-text-muted mt-2">قالب‌های Infrastructure as Code برای OpenStack</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ قالب جدید</button>
            <Link href="/automation/stacks" className="text-[12px] text-brand hover:underline">Stack‌ها →</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل قالب",         value: TEMPLATES.length,                         color: "#2554d8" },
            { label: "پارامتر (میانگین)", value: Math.round(TEMPLATES.reduce((a, t) => a + t.params, 0) / TEMPLATES.length), color: "#7c3aed" },
            { label: "stack فعال",       value: TEMPLATES.reduce((a, t) => a + t.stacks, 0), color: "#16a34a" },
            { label: "بروزرسانی این ماه", value: TEMPLATES.filter((t) => t.updated.startsWith("۱۴۰۵/۰۲")).length, color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14">
        <input type="text" placeholder="جستجوی قالب..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-12 py-8 rounded-8 border border-border bg-bg text-[13px] outline-none focus:border-brand w-[240px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-14">
        {filtered.map((t) => (
          <div key={t.id} className="glass rounded-16 p-18 border border-border hover:border-brand/50 transition-colors">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[13px] font-bold font-mono text-text-main">{t.name}</p>
                <p className="text-[11px] text-text-muted mt-4">{t.desc}</p>
              </div>
              <span className="text-[11px] font-mono text-text-muted shrink-0 ltr-text">v{t.version}</span>
            </div>
            <div className="flex flex-wrap gap-4 mb-10">
              {t.tags.map((tag) => <span key={tag} className="px-6 py-2 rounded-4 bg-brand/10 text-brand text-[10px] font-mono">{tag}</span>)}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-12 text-[11px] text-text-muted">
                <span>{t.params} پارامتر</span>
                <span>{t.stacks} stack</span>
                <span>{t.updated}</span>
              </div>
              <button className="px-10 py-5 rounded-6 bg-brand text-white text-[11px] hover:bg-brand/90 transition-colors">استقرار</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
