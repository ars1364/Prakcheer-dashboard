"use client";

import { useState } from "react";
import Link from "next/link";

interface Job {
  id:       string;
  name:     string;
  queue:    string;
  status:   "running" | "pending" | "completed" | "failed" | "retrying";
  progress: number;
  started:  string;
  duration: string;
  worker:   string;
  retries:  number;
}

const JOBS: Job[] = [
  { id: "j01", name: "snapshot-weekly-batch",     queue: "storage",  status: "running",   progress: 62, started: "۱۲ دقیقه پیش", duration: "در حال اجرا",  worker: "worker-03", retries: 0 },
  { id: "j02", name: "tenant-billing-reconcile",  queue: "billing",  status: "running",   progress: 88, started: "۳ دقیقه پیش",  duration: "در حال اجرا",  worker: "worker-01", retries: 0 },
  { id: "j03", name: "vm-resize-teh1-003",        queue: "compute",  status: "pending",   progress: 0,  started: "—",             duration: "—",            worker: "—",         retries: 0 },
  { id: "j04", name: "ssl-cert-renewal",          queue: "network",  status: "pending",   progress: 0,  started: "—",             duration: "—",            worker: "—",         retries: 0 },
  { id: "j05", name: "volume-backup-isf1",        queue: "storage",  status: "failed",    progress: 34, started: "۴۵ دقیقه پیش", duration: "۱۸ دقیقه",    worker: "worker-02", retries: 2 },
  { id: "j06", name: "dns-record-sync",           queue: "network",  status: "completed", progress: 100,started: "۱ ساعت پیش",   duration: "۴۲ ثانیه",    worker: "worker-01", retries: 0 },
  { id: "j07", name: "kubernetes-upgrade-patch",  queue: "k8s",      status: "retrying",  progress: 18, started: "۲۲ دقیقه پیش", duration: "در حال اجرا",  worker: "worker-04", retries: 1 },
  { id: "j08", name: "send-invoice-batch",        queue: "billing",  status: "completed", progress: 100,started: "۲ ساعت پیش",   duration: "۳ دقیقه",     worker: "worker-02", retries: 0 },
  { id: "j09", name: "floating-ip-cleanup",       queue: "network",  status: "completed", progress: 100,started: "۳ ساعت پیش",   duration: "۱۲ ثانیه",    worker: "worker-03", retries: 0 },
  { id: "j10", name: "log-archival-compress",     queue: "logging",  status: "running",   progress: 45, started: "۸ دقیقه پیش",  duration: "در حال اجرا",  worker: "worker-04", retries: 0 },
];

const STATUS_STYLE: Record<string, string> = {
  running:   "bg-blue-100 text-brand",
  pending:   "bg-slate-100 text-slate-600",
  completed: "bg-green-100 text-green-700",
  failed:    "bg-red-100 text-red-700",
  retrying:  "bg-amber-100 text-amber-700",
};
const STATUS_LABEL: Record<string, string> = { running: "در حال اجرا", pending: "در انتظار", completed: "کامل", failed: "ناموفق", retrying: "تلاش مجدد" };

export default function BackgroundJobsPage() {
  const [queueFilter, setQueue] = useState("همه");
  const queues = ["همه", ...Array.from(new Set(JOBS.map((j) => j.queue)))];
  const filtered = queueFilter === "همه" ? JOBS : JOBS.filter((j) => j.queue === queueFilter);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">پردازش‌های پس‌زمینه</h1>
            <p className="text-[12px] text-text-muted mt-2">وضعیت job های در حال اجرا و صف پردازش</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "در حال اجرا", value: JOBS.filter((j) => j.status === "running").length,   color: "#2554d8" },
            { label: "در انتظار",   value: JOBS.filter((j) => j.status === "pending").length,   color: "#d97706" },
            { label: "ناموفق",      value: JOBS.filter((j) => j.status === "failed" || j.status === "retrying").length, color: "#dc2626" },
            { label: "امروز کامل",  value: JOBS.filter((j) => j.status === "completed").length, color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14 flex gap-8 flex-wrap">
        {queues.map((q) => (
          <button key={q} onClick={() => setQueue(q)}
            className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all ${queueFilter === q ? "bg-brand text-white" : "border border-border text-text-muted hover:text-text-main"}`}
          >{q}</button>
        ))}
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">نام job</th>
              <th className="text-start py-12 font-medium">صف</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium w-[160px]">پیشرفت</th>
              <th className="text-start py-12 font-medium">شروع</th>
              <th className="text-start py-12 font-medium">مدت</th>
              <th className="text-start py-12 font-medium">Worker</th>
              <th className="text-start py-12 font-medium">تلاش</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => (
              <tr key={j.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono text-[11px] text-text-main ltr-text" style={{ direction: "ltr" }}>{j.name}</td>
                <td className="py-11 text-text-muted">{j.queue}</td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${STATUS_STYLE[j.status]}`}>{STATUS_LABEL[j.status]}</span>
                </td>
                <td className="py-11 pe-8">
                  {j.progress > 0 ? (
                    <div className="flex items-center gap-6">
                      <div className="flex-1 h-5 rounded-999 bg-border overflow-hidden">
                        <div className="h-full rounded-999 transition-all" style={{ width: `${j.progress}%`, background: j.status === "failed" ? "#ef4444" : j.status === "completed" ? "#16a34a" : "#2554d8" }} />
                      </div>
                      <span className="text-[10px] w-[26px] shrink-0">{j.progress}%</span>
                    </div>
                  ) : <span className="text-text-muted">—</span>}
                </td>
                <td className="py-11 text-text-muted">{j.started}</td>
                <td className="py-11 text-text-muted">{j.duration}</td>
                <td className="py-11 text-text-muted font-mono ltr-text text-[11px]" style={{ direction: "ltr" }}>{j.worker}</td>
                <td className={`py-11 font-semibold ${j.retries > 0 ? "text-amber-600" : "text-text-muted"}`}>{j.retries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
