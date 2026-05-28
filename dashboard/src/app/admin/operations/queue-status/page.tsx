"use client";

import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const QUEUES = [
  { name: "compute",  pending: 3,  running: 2, failed: 1, rate: 42, workers: 4, latency: 320  },
  { name: "storage",  pending: 5,  running: 3, failed: 2, rate: 18, workers: 3, latency: 1200 },
  { name: "network",  pending: 1,  running: 1, failed: 0, rate: 65, workers: 2, latency: 180  },
  { name: "billing",  pending: 2,  running: 1, failed: 0, rate: 8,  workers: 2, latency: 550  },
  { name: "k8s",      pending: 0,  running: 1, failed: 1, rate: 5,  workers: 2, latency: 2100 },
  { name: "logging",  pending: 1,  running: 1, failed: 0, rate: 120,workers: 2, latency: 90   },
  { name: "email",    pending: 0,  running: 0, failed: 0, rate: 25, workers: 1, latency: 75   },
];

const THROUGHPUT = Array.from({ length: 12 }, (_, i) => ({
  h: `${String(i * 2).padStart(2, "0")}:00`,
  compute: 30 + Math.round(Math.random() * 25),
  storage: 12 + Math.round(Math.random() * 15),
  network: 50 + Math.round(Math.random() * 30),
}));

function ChartTooltip({ active, payload, label }: {active?:boolean;payload?:{name:string;value:number;color:string}[];label?:string}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] shadow-lg border border-border">
      <p className="text-text-muted mb-4">{label}</p>
      {payload.map((p) => <p key={p.name} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>)}
    </div>
  );
}

export default function QueueStatusPage() {
  const totalPending = QUEUES.reduce((a, q) => a + q.pending, 0);
  const totalFailed  = QUEUES.reduce((a, q) => a + q.failed, 0);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">وضعیت صف‌های پردازش</h1>
            <p className="text-[12px] text-text-muted mt-2">مانیتورینگ RabbitMQ و Celery Workers</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "صف‌های فعال",  value: QUEUES.length,  color: "#2554d8" },
            { label: "در انتظار",    value: totalPending,   color: "#d97706" },
            { label: "ناموفق",       value: totalFailed,    color: "#dc2626" },
            { label: "Worker فعال",  value: QUEUES.reduce((a, q) => a + q.workers, 0), color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-20">
        <h2 className="text-[14px] font-semibold text-text-main mb-16">توان عملیاتی — ۲۴ ساعت</h2>
        <div className="ltr-text" style={{ direction: "ltr" }}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={THROUGHPUT} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2554d8" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#2554d8" stopOpacity={0.55} />
                </linearGradient>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.55} />
                </linearGradient>
                <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.55} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="h"      tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="compute" fill="url(#barGrad1)" stackId="a" maxBarSize={24} />
              <Bar dataKey="storage" fill="url(#barGrad2)" stackId="a" maxBarSize={24} />
              <Bar dataKey="network" fill="url(#barGrad3)" stackId="a" maxBarSize={24} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">صف</th>
              <th className="text-start py-12 font-medium">در انتظار</th>
              <th className="text-start py-12 font-medium">در حال اجرا</th>
              <th className="text-start py-12 font-medium">ناموفق</th>
              <th className="text-start py-12 font-medium">نرخ (job/min)</th>
              <th className="text-start py-12 font-medium">Worker</th>
              <th className="text-start py-12 font-medium">تأخیر متوسط</th>
            </tr>
          </thead>
          <tbody>
            {QUEUES.map((q) => (
              <tr key={q.name} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono text-text-main font-medium">{q.name}</td>
                <td className={`py-11 font-semibold ${q.pending > 3 ? "text-amber-600" : "text-text-muted"}`}>{q.pending}</td>
                <td className="py-11 text-brand font-semibold">{q.running}</td>
                <td className={`py-11 font-semibold ${q.failed > 0 ? "text-red-600" : "text-text-muted"}`}>{q.failed}</td>
                <td className="py-11 text-text-muted ltr-text" style={{ direction: "ltr" }}>{q.rate}/min</td>
                <td className="py-11 text-green-700 font-semibold">{q.workers}</td>
                <td className={`py-11 ltr-text font-mono ${q.latency > 1000 ? "text-red-600" : q.latency > 500 ? "text-amber-600" : "text-text-muted"}`} style={{ direction: "ltr" }}>
                  {q.latency >= 1000 ? `${(q.latency / 1000).toFixed(1)}s` : `${q.latency}ms`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
