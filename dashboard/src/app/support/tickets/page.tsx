"use client";

import { useState } from "react";
import Link from "next/link";

interface Ticket {
  id:       string;
  title:    string;
  category: "billing" | "technical" | "general" | "incident";
  priority: "critical" | "high" | "medium" | "low";
  status:   "open" | "in_progress" | "waiting" | "resolved" | "closed";
  created:  string;
  updated:  string;
  assignee: string | null;
}

const TICKETS: Ticket[] = [
  { id: "TKT-0044", title: "قطعی سرور production — کلاستر A",           category: "incident",  priority: "critical", status: "resolved",    created: "۱۴۰۴/۱۲/۱۵", updated: "۱۴۰۴/۱۲/۱۵", assignee: "تیم فنی"      },
  { id: "TKT-0048", title: "مشکل در اتصال به volume NFS",               category: "technical", priority: "high",     status: "resolved",    created: "۱۴۰۵/۰۱/۰۳", updated: "۱۴۰۵/۰۱/۰۵", assignee: "تیم فنی"      },
  { id: "TKT-0051", title: "درخواست افزایش سقف VM",                     category: "general",   priority: "medium",   status: "closed",      created: "۱۴۰۵/۰۱/۲۰", updated: "۱۴۰۵/۰۱/۲۲", assignee: "تیم فروش"     },
  { id: "TKT-0055", title: "سوال درباره هزینه bandwidth",               category: "billing",   priority: "low",      status: "in_progress", created: "۱۴۰۵/۰۲/۰۱", updated: "۱۴۰۵/۰۲/۰۵", assignee: "تیم مالی"     },
  { id: "TKT-0058", title: "K8s cluster upgrade به 1.30",               category: "technical", priority: "medium",   status: "waiting",     created: "۱۴۰۵/۰۲/۰۵", updated: "۱۴۰۵/۰۲/۰۶", assignee: null           },
  { id: "TKT-0061", title: "سرعت پایین container pull از registry",      category: "technical", priority: "high",     status: "open",        created: "۱۴۰۵/۰۲/۰۷", updated: "۱۴۰۵/۰۲/۰۷", assignee: null           },
];

const PRIORITY_STYLE: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high:     "bg-amber-100 text-amber-700",
  medium:   "bg-blue-50 text-brand",
  low:      "bg-slate-100 text-slate-600",
};

const STATUS_STYLE: Record<string, string> = {
  open:        "bg-red-100 text-red-700",
  in_progress: "bg-amber-100 text-amber-700",
  waiting:     "bg-purple-100 text-purple-700",
  resolved:    "bg-green-100 text-green-700",
  closed:      "bg-slate-100 text-slate-600",
};

const STATUS_LABEL: Record<string, string> = {
  open: "باز", in_progress: "در حال بررسی", waiting: "در انتظار", resolved: "حل‌شده", closed: "بسته",
};

export default function TicketsPage() {
  const [filter, setFilter] = useState("همه");
  const filtered = filter === "همه" ? TICKETS : TICKETS.filter((t) => t.status === filter);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">تیکت‌های پشتیبانی</h1>
            <p className="text-[12px] text-text-muted mt-2">درخواست‌های پشتیبانی</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ تیکت جدید</button>
            <Link href="/support" className="text-[12px] text-text-muted hover:text-brand">← پشتیبانی</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",       value: TICKETS.length,                                                                         color: "#2554d8" },
            { label: "باز",      value: TICKETS.filter((t) => t.status === "open" || t.status === "in_progress").length,        color: "#dc2626" },
            { label: "در انتظار",value: TICKETS.filter((t) => t.status === "waiting").length,                                   color: "#d97706" },
            { label: "حل‌شده",  value: TICKETS.filter((t) => t.status === "resolved" || t.status === "closed").length,         color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {["همه", "open", "in_progress", "waiting", "resolved"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all ${filter === s ? "bg-brand text-white" : "border border-border text-text-muted"}`}>
            {s === "همه" ? "همه" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {filtered.map((t) => (
          <div key={t.id} className="glass rounded-12 p-16 border border-border hover:border-brand/40 transition-colors">
            <div className="flex items-start justify-between gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-10 mb-6 flex-wrap">
                  <span className="font-mono text-[11px] text-text-muted ltr-text">{t.id}</span>
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span>
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${STATUS_STYLE[t.status]}`}>{STATUS_LABEL[t.status]}</span>
                </div>
                <p className="text-[13px] font-semibold text-text-main mb-4">{t.title}</p>
                <div className="flex gap-12 text-[11px] text-text-muted">
                  <span>ایجاد: {t.created}</span>
                  <span>بروز: {t.updated}</span>
                  {t.assignee && <span>تخصیص: <span className="text-brand">{t.assignee}</span></span>}
                </div>
              </div>
              <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg shrink-0">مشاهده</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
