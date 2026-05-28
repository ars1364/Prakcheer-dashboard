"use client";

import { useState } from "react";
import Link from "next/link";

interface BackupPolicy {
  id:       string;
  name:     string;
  target:   string;
  schedule: string;
  retention:number;
  enabled:  boolean;
  lastRun:  string;
  nextRun:  string;
  status:   "ok" | "failed" | "running";
}

const POLICIES: BackupPolicy[] = [
  { id: "bp01", name: "prod-daily",        target: "VM های production", schedule: "هر روز ۰۳:۰۰",  retention: 30, enabled: true,  lastRun: "دیروز ۰۳:۰۰",       nextRun: "فردا ۰۳:۰۰",  status: "ok"      },
  { id: "bp02", name: "db-hourly",         target: "prod-postgres",     schedule: "هر ساعت",        retention: 7,  enabled: true,  lastRun: "۱ ساعت پیش",         nextRun: "۱ ساعت دیگر", status: "ok"      },
  { id: "bp03", name: "volumes-weekly",    target: "دیسک‌های critical", schedule: "هر شنبه ۰۲:۰۰", retention: 90, enabled: true,  lastRun: "شنبه گذشته",         nextRun: "شنبه آینده",  status: "ok"      },
  { id: "bp04", name: "k8s-etcd",          target: "k8s-main-cluster",  schedule: "هر ۶ ساعت",     retention: 14, enabled: true,  lastRun: "۲ ساعت پیش",         nextRun: "۴ ساعت دیگر", status: "ok"      },
  { id: "bp05", name: "staging-daily",     target: "VM های staging",    schedule: "هر روز ۰۴:۰۰",  retention: 7,  enabled: false, lastRun: "۳ روز پیش",          nextRun: "غیرفعال",      status: "ok"      },
  { id: "bp06", name: "mongodb-daily",     target: "ml-mongo",          schedule: "هر روز ۰۵:۰۰",  retention: 30, enabled: true,  lastRun: "دیروز ۰۵:۰۰",       nextRun: "فردا ۰۵:۰۰",  status: "failed"  },
];

export default function BackupPoliciesPage() {
  const [policies, setPolicies] = useState(POLICIES);
  const toggle = (id: string) => setPolicies((p) => p.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">سیاست‌های پشتیبان‌گیری</h1>
            <p className="text-[12px] text-text-muted mt-2">برنامه‌ریزی خودکار بکاپ‌ها</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ سیاست جدید</button>
            <Link href="/backup" className="text-[12px] text-text-muted hover:text-brand">← پشتیبان‌گیری</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",     value: policies.length,                                         color: "#2554d8" },
            { label: "فعال",   value: policies.filter((p) => p.enabled).length,              color: "#16a34a" },
            { label: "خطا",    value: policies.filter((p) => p.status === "failed").length,  color: "#dc2626" },
            { label: "غیرفعال",value: policies.filter((p) => !p.enabled).length,             color: "#64748b" },
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
          <div key={p.id} className={`glass rounded-12 p-16 border transition-colors ${p.status === "failed" ? "border-red-200" : !p.enabled ? "opacity-60 border-transparent" : "border-border"}`}>
            <div className="flex items-center gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-10 mb-4 flex-wrap">
                  <p className="text-[13px] font-bold text-text-main">{p.name}</p>
                  {p.status === "failed" && <span className="px-7 py-2 rounded-5 bg-red-100 text-red-700 text-[10px] font-bold">خطا</span>}
                  {p.status === "running" && <span className="px-7 py-2 rounded-5 bg-amber-100 text-amber-700 text-[10px] animate-pulse">در حال اجرا</span>}
                </div>
                <p className="text-[12px] text-text-muted mb-6">{p.target} · {p.schedule} · نگهداری {p.retention} روز</p>
                <div className="flex gap-12 text-[11px] text-text-muted">
                  <span>آخرین: {p.lastRun}</span>
                  <span>بعدی: {p.nextRun}</span>
                </div>
              </div>
              <div className="flex gap-8 items-center shrink-0">
                {p.status === "failed" && <button className="px-8 py-4 rounded-6 bg-brand text-white text-[10px]">اجرای مجدد</button>}
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
