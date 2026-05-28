"use client";

import { useState } from "react";

interface Runbook {
  id:       string;
  title:    string;
  category: "incident" | "maintenance" | "deployment" | "scaling";
  steps:    string[];
  author:   string;
  updated:  string;
  tags:     string[];
}

const RUNBOOKS: Runbook[] = [
  {
    id: "rb1", title: "بازیابی سرور پس از کرش",
    category: "incident",
    steps: [
      "وضعیت سرور را با GET /v1/instances/{id} بررسی کنید",
      "لاگ‌های console را از /v1/instances/{id}/console-log دریافت کنید",
      "در صورت لازم، hard reboot از طریق POST /v1/instances/{id}/action با body {\"action\":\"reboot\",\"type\":\"HARD\"} انجام دهید",
      "اگر سرور respond نکرد، snapshot بگیرید و سرور جدید بسازید",
      "پس از بازیابی، health check را تأیید کنید",
    ],
    author: "a.sarkhail", updated: "۱۴۰۵/۰۱", tags: ["compute", "incident", "recovery"],
  },
  {
    id: "rb2", title: "اضافه کردن نود به K8s Cluster",
    category: "scaling",
    steps: [
      "وضعیت کلاستر را با GET /v1/k8s/clusters/{id} بررسی کنید",
      "درخواست scale با PUT /v1/k8s/clusters/{id}/nodepool/{pool_id} ارسال کنید",
      "منتظر بمانید تا وضعیت به ACTIVE برگردد (polling هر ۳۰ ثانیه)",
      "با kubectl get nodes تأیید کنید که نود جدید Ready است",
      "workload مناسب روی نود جدید schedule کنید",
    ],
    author: "m.hosseini", updated: "۱۴۰۴/۱۲", tags: ["k8s", "scaling"],
  },
  {
    id: "rb3", title: "رویه نگهداری پیش از بروزرسانی",
    category: "maintenance",
    steps: [
      "snapshot از همه سرورهای تحت تأثیر بگیرید",
      "ترافیک را به سرورهای دیگر هدایت کنید (load balancer)",
      "سرورها را به حالت maintenance درآورید",
      "بروزرسانی را اجرا کنید",
      "smoke test را اجرا کنید و در صورت موفقیت ترافیک را برگردانید",
    ],
    author: "f.ahmadi", updated: "۱۴۰۴/۱۱", tags: ["maintenance", "compute"],
  },
  {
    id: "rb4", title: "Deploy اپلیکیشن با zero downtime",
    category: "deployment",
    steps: [
      "image جدید را به registry push کنید",
      "یک سرور جدید با تنظیمات مشابه بسازید",
      "health check را روی سرور جدید تأیید کنید",
      "ترافیک را به سرور جدید هدایت کنید",
      "سرور قدیمی را پس از ۵ دقیقه حذف کنید",
    ],
    author: "a.rezaei", updated: "۱۴۰۵/۰۲", tags: ["deployment", "compute", "zero-downtime"],
  },
  {
    id: "rb5", title: "بررسی و رفع اتمام فضای دیسک",
    category: "incident",
    steps: [
      "مصرف دیسک را با GET /v1/volumes/{id} بررسی کنید",
      "فایل‌های بزرگ و log های قدیمی را شناسایی کنید",
      "در صورت نیاز، resize با PUT /v1/volumes/{id} با size جدید انجام دهید",
      "پارتیشن را extend کنید: resize2fs /dev/vdb",
      "هشدار برای دیسک ≥۸۰٪ در پنل monitoring تنظیم کنید",
    ],
    author: "h.najafi", updated: "۱۴۰۴/۱۰", tags: ["storage", "incident"],
  },
];

const CAT_LABEL: Record<string, string> = { incident: "حادثه", maintenance: "نگهداری", deployment: "استقرار", scaling: "مقیاس‌دهی" };
const CAT_COLOR: Record<string, string> = { incident: "#dc2626", maintenance: "#d97706", deployment: "#2554d8", scaling: "#16a34a" };

export default function RunbooksPage() {
  const [cat, setCat]         = useState("همه");
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories = ["همه", "incident", "maintenance", "deployment", "scaling"];
  const filtered   = cat === "همه" ? RUNBOOKS : RUNBOOKS.filter((r) => r.category === cat);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Runbooks</h1>
            <p className="text-[12px] text-text-muted mt-2">رویه‌های عملیاتی گام‌به‌گام</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",       value: RUNBOOKS.length,                                               color: "#2554d8" },
            { label: "حادثه",    value: RUNBOOKS.filter((r) => r.category === "incident").length,      color: "#dc2626" },
            { label: "استقرار",  value: RUNBOOKS.filter((r) => r.category === "deployment").length,    color: "#2554d8" },
            { label: "نگهداری",  value: RUNBOOKS.filter((r) => r.category === "maintenance").length,   color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-12 py-6 rounded-8 text-[12px] font-medium transition-all ${cat === c ? "text-white" : "border border-border text-text-muted"}`}
            style={cat === c ? { background: CAT_COLOR[c] ?? "#2554d8" } : {}}>
            {c === "همه" ? "همه" : CAT_LABEL[c]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-10">
        {filtered.map((r) => {
          const open = expanded === r.id;
          return (
            <div key={r.id} className="glass rounded-16 border border-border overflow-hidden">
              <button className="w-full flex items-center gap-12 px-16 py-14 hover:bg-bg/40 transition-colors text-start"
                onClick={() => setExpanded(open ? null : r.id)}>
                <div className="w-8 h-8 rounded-2 shrink-0" style={{ background: CAT_COLOR[r.category] }} />
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-text-main">{r.title}</p>
                  <p className="text-[11px] text-text-muted mt-2">{r.steps.length} گام · {CAT_LABEL[r.category]} · {r.author}</p>
                </div>
                <div className="flex flex-wrap gap-4 shrink-0">
                  {r.tags.slice(0, 2).map((t) => <span key={t} className="px-6 py-2 rounded-4 bg-brand/10 text-brand text-[10px] font-mono">{t}</span>)}
                </div>
                <span className="text-text-muted text-[10px] shrink-0">{open ? "▲" : "▼"}</span>
              </button>
              {open && (
                <div className="px-16 pb-16 border-t border-border/50 pt-12">
                  <ol className="flex flex-col gap-8">
                    {r.steps.map((step, i) => (
                      <li key={i} className="flex gap-12">
                        <span className="w-20 h-20 rounded-full bg-brand/10 text-brand text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                        <p className="text-[12px] text-text-muted leading-relaxed pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                  <p className="text-[10px] text-text-muted mt-12">آخرین بروزرسانی: {r.updated} · نویسنده: {r.author}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
