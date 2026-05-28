"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Job {
  id:       string;
  workflow: string;
  trigger:  string;
  status:   "success" | "failed" | "running";
  started:  string;
  duration: string;
  steps:    number;
  error:    string | null;
}

const JOBS: Job[] = [
  { id: "j001", workflow: "daily-snapshot",   trigger: "schedule",  status: "success", started: "۱۴۰۵/۰۲/۰۷ ۰۳:۰۰", duration: "۴ دقیقه",    steps: 4, error: null },
  { id: "j002", workflow: "scale-on-load",    trigger: "event",     status: "success", started: "۱۴۰۵/۰۲/۰۷ ۱۲:۳۱", duration: "۴۵ ثانیه",   steps: 6, error: null },
  { id: "j003", workflow: "deploy-staging",   trigger: "webhook",   status: "running", started: "۱۴۰۵/۰۲/۰۷ ۱۴:۱۰", duration: "در جریان",    steps: 10, error: null },
  { id: "j004", workflow: "scale-on-load",    trigger: "event",     status: "failed",  started: "۱۴۰۵/۰۲/۰۶ ۲۲:۱۵", duration: "۱ دقیقه",    steps: 6, error: "Quota exceeded: vcpus" },
  { id: "j005", workflow: "daily-snapshot",   trigger: "schedule",  status: "success", started: "۱۴۰۵/۰۲/۰۶ ۰۳:۰۰", duration: "۳ دقیقه",    steps: 4, error: null },
  { id: "j006", workflow: "weekly-cleanup",   trigger: "schedule",  status: "success", started: "۱۴۰۵/۰۱/۳۱ ۰۱:۰۰", duration: "۱۲ دقیقه",   steps: 8, error: null },
  { id: "j007", workflow: "deploy-staging",   trigger: "webhook",   status: "success", started: "۱۴۰۵/۰۲/۰۵ ۱۰:۴۴", duration: "۷ دقیقه",    steps: 10, error: null },
  { id: "j008", workflow: "cert-renewal",     trigger: "schedule",  status: "failed",  started: "۱۴۰۴/۱۱/۱۲ ۰۸:۰۰", duration: "۲ دقیقه",    steps: 3, error: "DNS challenge timeout" },
  { id: "j009", workflow: "billing-report",   trigger: "schedule",  status: "success", started: "۱۴۰۵/۰۲/۰۱ ۰۰:۰۰", duration: "۸ دقیقه",    steps: 5, error: null },
  { id: "j010", workflow: "deploy-staging",   trigger: "manual",    status: "success", started: "۱۴۰۵/۰۱/۲۸ ۱۶:۰۰", duration: "۶ دقیقه",    steps: 10, error: null },
];

export default function JobHistoryPage() {
  const [wf, setWf]         = useState("همه");
  const [status, setStatus] = useState("همه");

  const workflows = ["همه", ...Array.from(new Set(JOBS.map((j) => j.workflow)))];

  const filtered = useMemo(() => JOBS.filter((j) => {
    if (wf !== "همه" && j.workflow !== wf) return false;
    if (status !== "همه" && j.status !== status) return false;
    return true;
  }), [wf, status]);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">تاریخچه Job</h1>
            <p className="text-[12px] text-text-muted mt-2">نتایج اجرای گذشته workflow‌ها</p>
          </div>
          <Link href="/automation/workflows" className="text-[12px] text-text-muted hover:text-brand">← workflow‌ها</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل job",  value: JOBS.length,                                        color: "#2554d8" },
            { label: "موفق",    value: JOBS.filter((j) => j.status === "success").length,  color: "#16a34a" },
            { label: "در جریان",value: JOBS.filter((j) => j.status === "running").length,  color: "#d97706" },
            { label: "خطا",     value: JOBS.filter((j) => j.status === "failed").length,   color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14 flex flex-wrap gap-10 items-center">
        <select value={wf} onChange={(e) => setWf(e.target.value)}
          className="px-12 py-8 rounded-8 border border-border bg-bg text-[12px] outline-none focus:border-brand">
          {workflows.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
        {["همه", "success", "failed", "running"].map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-10 py-6 rounded-6 text-[12px] font-medium transition-all ${status === s ? "bg-brand text-white" : "border border-border text-text-muted"}`}>
            {s === "همه" ? "همه" : s === "success" ? "موفق" : s === "failed" ? "خطا" : "در جریان"}
          </button>
        ))}
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">شروع</th>
              <th className="text-start py-12 font-medium">Workflow</th>
              <th className="text-start py-12 font-medium">trigger</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">مدت</th>
              <th className="text-start py-12 font-medium">گام‌ها</th>
              <th className="text-start py-12 font-medium">خطا</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => (
              <tr key={j.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-10 text-text-muted text-[11px] ltr-text" style={{ direction: "ltr" }}>{j.started}</td>
                <td className="py-10 font-mono text-[11px] text-brand">{j.workflow}</td>
                <td className="py-10 text-text-muted">{j.trigger}</td>
                <td className="py-10">
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${j.status === "success" ? "bg-green-100 text-green-700" : j.status === "running" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                    {j.status === "success" ? "موفق" : j.status === "running" ? "در جریان" : "خطا"}
                    {j.status === "running" && <span className="ms-4 animate-pulse">●</span>}
                  </span>
                </td>
                <td className="py-10 text-text-muted">{j.duration}</td>
                <td className="py-10 text-text-main font-semibold">{j.steps}</td>
                <td className="py-10 pe-12 text-red-500 text-[11px]">{j.error ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
