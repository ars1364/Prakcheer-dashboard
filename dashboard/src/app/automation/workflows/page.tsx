"use client";

import { useState } from "react";
import Link from "next/link";

interface Workflow {
  id:       string;
  name:     string;
  desc:     string;
  trigger:  "schedule" | "webhook" | "manual" | "event";
  schedule: string | null;
  lastRun:  string;
  nextRun:  string | null;
  status:   "active" | "paused" | "failed";
  steps:    number;
  runs:     number;
  success:  number;
}

const WORKFLOWS: Workflow[] = [
  { id: "wf1", name: "daily-snapshot",    desc: "گرفتن snapshot از همه سرورهای production",            trigger: "schedule", schedule: "هر روز ۰۳:۰۰",    lastRun: "دیروز ۰۳:۰۰",    nextRun: "فردا ۰۳:۰۰",   status: "active", steps: 4,  runs: 45, success: 45 },
  { id: "wf2", name: "scale-on-load",     desc: "مقیاس‌دهی خودکار بر اساس CPU load",                   trigger: "event",    schedule: null,               lastRun: "۲ ساعت پیش",       nextRun: null,           status: "active", steps: 6,  runs: 18, success: 17 },
  { id: "wf3", name: "weekly-cleanup",    desc: "حذف resource های orphan و snapshot های قدیمی",         trigger: "schedule", schedule: "هر شنبه ۰۱:۰۰",   lastRun: "شنبه گذشته",       nextRun: "شنبه آینده",   status: "active", steps: 8,  runs: 7,  success: 7  },
  { id: "wf4", name: "deploy-staging",    desc: "استقرار آخرین کد به محیط staging",                    trigger: "webhook",  schedule: null,               lastRun: "۵ ساعت پیش",       nextRun: null,           status: "active", steps: 10, runs: 32, success: 30 },
  { id: "wf5", name: "billing-report",    desc: "تولید گزارش ماهانه مصرف و ارسال ایمیل",              trigger: "schedule", schedule: "اول هر ماه",       lastRun: "۱۴۰۵/۰۲/۰۱",     nextRun: "۱۴۰۵/۰۳/۰۱", status: "active", steps: 5,  runs: 4,  success: 4  },
  { id: "wf6", name: "cert-renewal",      desc: "تجدید خودکار گواهی TLS",                              trigger: "schedule", schedule: "هر ۸۸ روز",        lastRun: "۱۴۰۴/۱۱/۱۲",     nextRun: "۱۴۰۵/۰۲/۰۸", status: "paused", steps: 3,  runs: 3,  success: 2  },
];

const TRIGGER_COLOR: Record<string, string> = { schedule: "#7c3aed", webhook: "#2554d8", manual: "#64748b", event: "#16a34a" };
const STATUS_STYLE: Record<string, string>  = { active: "bg-green-100 text-green-700", paused: "bg-slate-100 text-slate-600", failed: "bg-red-100 text-red-700" };

export default function WorkflowsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Workflow‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">جریان‌های کاری خودکار</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ workflow جدید</button>
            <Link href="/automation/job-history" className="text-[12px] text-brand hover:underline">تاریخچه →</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",     value: WORKFLOWS.length,                                       color: "#2554d8" },
            { label: "فعال",   value: WORKFLOWS.filter((w) => w.status === "active").length,  color: "#16a34a" },
            { label: "کل اجرا",value: WORKFLOWS.reduce((a, w) => a + w.runs, 0),              color: "#7c3aed" },
            { label: "موفق",   value: WORKFLOWS.reduce((a, w) => a + w.success, 0),           color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {WORKFLOWS.map((w) => {
          const open = selected === w.id;
          const rate = Math.round((w.success / w.runs) * 100);
          return (
            <div key={w.id} className="glass rounded-16 border border-border overflow-hidden">
              <button className="w-full flex items-center gap-12 px-16 py-14 hover:bg-bg/40 transition-colors text-start"
                onClick={() => setSelected(open ? null : w.id)}>
                <div className="flex-1">
                  <div className="flex items-center gap-10 mb-4 flex-wrap">
                    <p className="text-[13px] font-bold font-mono text-text-main">{w.name}</p>
                    <span className={`px-7 py-2 rounded-5 text-[11px] font-medium ${STATUS_STYLE[w.status]}`}>
                      {w.status === "active" ? "فعال" : w.status === "paused" ? "متوقف" : "خطا"}
                    </span>
                    <span className="px-7 py-2 rounded-5 text-[10px]" style={{ background: `${TRIGGER_COLOR[w.trigger]}15`, color: TRIGGER_COLOR[w.trigger] }}>{w.trigger}</span>
                  </div>
                  <p className="text-[12px] text-text-muted">{w.desc}</p>
                </div>
                <div className="flex gap-14 shrink-0 text-[11px] text-text-muted">
                  <span>{w.steps} گام</span>
                  <span>{w.runs} اجرا</span>
                  <span className={rate >= 90 ? "text-green-600" : rate >= 70 ? "text-amber-600" : "text-red-600"}>{rate}٪</span>
                </div>
                <span className="text-text-muted text-[10px]">{open ? "▲" : "▼"}</span>
              </button>
              {open && (
                <div className="px-16 pb-14 border-t border-border/50 pt-10 grid grid-cols-2 sm:grid-cols-4 gap-12 text-[12px]">
                  <div><p className="text-text-muted text-[11px] mb-2">آخرین اجرا</p><p className="text-text-main">{w.lastRun}</p></div>
                  <div><p className="text-text-muted text-[11px] mb-2">اجرای بعدی</p><p className="text-text-main">{w.nextRun ?? "رویداد‌محور"}</p></div>
                  <div><p className="text-text-muted text-[11px] mb-2">زمان‌بندی</p><p className="text-text-main">{w.schedule ?? "—"}</p></div>
                  <div className="flex gap-8 items-end">
                    <button className="px-10 py-5 rounded-6 bg-brand text-white text-[11px]">اجرای دستی</button>
                    <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px]">
                      {w.status === "active" ? "توقف" : "فعال‌سازی"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
