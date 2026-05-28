"use client";

import { useState } from "react";
import Link from "next/link";

interface Webhook {
  id:      string;
  url:     string;
  events:  string[];
  secret:  boolean;
  status:  "active" | "paused" | "failing";
  created: string;
  lastDelivery: string;
  successRate: number;
}

const WEBHOOKS: Webhook[] = [
  { id: "wh1", url: "https://ci.myapp.ir/hooks/cloud",        events: ["instance.created","instance.deleted"],           secret: true,  status: "active",  created: "۱۴۰۴/۰۸",  lastDelivery: "۵ دقیقه پیش", successRate: 99 },
  { id: "wh2", url: "https://alerts.myapp.ir/webhook",        events: ["alert.fired","alert.resolved"],                  secret: true,  status: "active",  created: "۱۴۰۴/۰۹",  lastDelivery: "۲ ساعت پیش",  successRate: 97 },
  { id: "wh3", url: "https://billing.partner.ir/notify",      events: ["invoice.issued","payment.success","payment.failed"], secret: false, status: "failing", created: "۱۴۰۴/۱۱",  lastDelivery: "۱ ساعت پیش",  successRate: 42 },
  { id: "wh4", url: "https://dev.myapp.ir/debug-hook",        events: ["*"],                                             secret: false, status: "paused",  created: "۱۴۰۵/۰۱",  lastDelivery: "دیروز",        successRate: 88 },
];

const EVENT_OPTIONS = [
  "instance.created","instance.deleted","instance.status_changed",
  "volume.attached","volume.detached","snapshot.created",
  "alert.fired","alert.resolved","invoice.issued",
  "payment.success","payment.failed","k8s.cluster.ready",
];

const STATUS_STYLE: Record<string, string> = {
  active:  "bg-green-100 text-green-700",
  paused:  "bg-slate-100 text-slate-600",
  failing: "bg-red-100 text-red-700",
};

export default function WebhooksPage() {
  const [hooks, setHooks] = useState(WEBHOOKS);
  const [showForm, setShowForm] = useState(false);

  const toggle = (id: string) => setHooks((h) => h.map((w) =>
    w.id === id ? { ...w, status: (w.status === "active" ? "paused" : "active") as Webhook["status"] } : w
  ));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Webhooks</h1>
            <p className="text-[12px] text-text-muted mt-2">ارسال رویدادها به سرویس‌های خارجی</p>
          </div>
          <div className="flex gap-8">
            <button onClick={() => setShowForm(!showForm)} className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ webhook جدید</button>
            <Link href="/devkit/test-webhook" className="text-[12px] text-brand hover:underline">تست webhook →</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",      value: hooks.length,                                  color: "#2554d8" },
            { label: "فعال",    value: hooks.filter((h) => h.status === "active").length,  color: "#16a34a" },
            { label: "خطادار",  value: hooks.filter((h) => h.status === "failing").length, color: "#dc2626" },
            { label: "متوقف",   value: hooks.filter((h) => h.status === "paused").length,  color: "#64748b" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="glass rounded-16 p-20">
          <h2 className="text-[14px] font-bold text-text-main mb-14">افزودن webhook جدید</h2>
          <div className="flex flex-col gap-12">
            <div>
              <label className="text-[11px] text-text-muted mb-4 block">آدرس URL</label>
              <input type="url" placeholder="https://example.com/webhook" dir="ltr"
                className="w-full px-12 py-8 rounded-8 border border-border bg-bg text-[12px] outline-none focus:border-brand" />
            </div>
            <div>
              <label className="text-[11px] text-text-muted mb-4 block">رویدادها</label>
              <div className="flex flex-wrap gap-6">
                {EVENT_OPTIONS.map((e) => (
                  <label key={e} className="flex items-center gap-5 cursor-pointer">
                    <input type="checkbox" className="accent-brand" />
                    <span className="text-[11px] font-mono text-text-muted">{e}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-8">
              <button className="px-14 py-8 rounded-8 bg-brand text-white text-[12px]">ذخیره</button>
              <button onClick={() => setShowForm(false)} className="px-14 py-8 rounded-8 border border-border text-text-muted text-[12px]">لغو</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-12">
        {hooks.map((w) => (
          <div key={w.id} className={`glass rounded-16 p-16 border ${w.status === "failing" ? "border-red-200" : "border-border"}`}>
            <div className="flex items-start justify-between gap-12">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-8 mb-6">
                  <p className="text-[12px] font-mono text-text-main ltr-text truncate" style={{ direction: "ltr" }}>{w.url}</p>
                  <span className={`px-7 py-2 rounded-5 text-[11px] font-medium shrink-0 ${STATUS_STYLE[w.status]}`}>
                    {w.status === "active" ? "فعال" : w.status === "paused" ? "متوقف" : "خطادار"}
                  </span>
                  {w.secret && <span className="px-7 py-2 rounded-5 bg-purple-50 text-purple-700 text-[10px]">secret</span>}
                </div>
                <div className="flex flex-wrap gap-4 mb-8">
                  {w.events.map((e) => <span key={e} className="px-6 py-2 rounded-4 bg-brand/10 text-brand text-[10px] font-mono">{e}</span>)}
                </div>
                <div className="flex gap-12 text-[11px] text-text-muted flex-wrap">
                  <span>ایجاد: {w.created}</span>
                  <span>آخرین ارسال: {w.lastDelivery}</span>
                  <span>موفق: <span className={w.successRate >= 90 ? "text-green-600" : w.successRate >= 70 ? "text-amber-600" : "text-red-600"}>{w.successRate}٪</span></span>
                </div>
              </div>
              <div className="flex gap-6 shrink-0">
                <button onClick={() => toggle(w.id)} className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg transition-colors">
                  {w.status === "active" ? "توقف" : "فعال‌سازی"}
                </button>
                <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg transition-colors">لاگ</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
