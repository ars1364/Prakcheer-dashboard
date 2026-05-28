"use client";

import { useState } from "react";
import Link from "next/link";

const FAILED = [
  { id: "fp01", resource: "VM: web-new-004",       tenant: "آژانس دیجیتال آبان", type: "Compute", ts: "۲۰ دقیقه پیش",  error: "No valid host was found. Insufficient compute capacity in AZ-A.", retry: 2 },
  { id: "fp02", resource: "Volume: vol-db-01",      tenant: "سازمان پژوهش ملی",  type: "Storage", ts: "۱ ساعت پیش",    error: "Cinder backend unavailable (ceph-pool-2 I/O error).",              retry: 3 },
  { id: "fp03", resource: "LB: lb-prod-new",        tenant: "پلتفرم پرداخت سپهر",type: "Network", ts: "۲ ساعت پیش",    error: "Octavia amphorae provisioning timeout after 300s.",                retry: 1 },
  { id: "fp04", resource: "K8s: ml-cluster-v2",     tenant: "استارتاپ هوش‌مند",  type: "K8s",     ts: "۳ ساعت پیش",    error: "Magnum: quota exceeded for clusters (limit 2).",                   retry: 0 },
  { id: "fp05", resource: "Floating IP: 185.x.x.44",tenant: "شرکت لجستیک رهبان", type: "Network", ts: "دیروز ۱۶:۱۰",  error: "Neutron: no free IPs available in external network pool.",         retry: 5 },
];

export default function FailedProvisioningPage() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = FAILED.filter((f) => !dismissed.has(f.id));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">پروویژن ناموفق</h1>
            <p className="text-[12px] text-text-muted mt-2">منابعی که فرآیند ساخت آن‌ها با خطا مواجه شده</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "ناموفق", value: visible.length, color: "#dc2626" },
            { label: "Compute", value: visible.filter((f) => f.type === "Compute").length, color: "#2554d8" },
            { label: "Storage", value: visible.filter((f) => f.type === "Storage").length, color: "#d97706" },
            { label: "Network", value: visible.filter((f) => f.type === "Network").length, color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {visible.map((f) => (
          <div key={f.id} className="glass rounded-16 border border-red-200 p-16">
            <div className="flex items-start justify-between gap-12">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-8 mb-6">
                  <span className="px-8 py-3 rounded-5 bg-slate-100 text-slate-600 text-[11px] font-medium">{f.type}</span>
                  <span className="text-[13px] font-semibold text-text-main">{f.resource}</span>
                  <span className="text-[11px] text-text-muted">← {f.tenant}</span>
                </div>
                <p className="text-[11px] font-mono text-red-700 bg-red-50 rounded-6 px-10 py-6 ltr-text leading-[1.6]" style={{ direction: "ltr" }}>{f.error}</p>
                <div className="flex gap-12 mt-6 text-[11px] text-text-muted">
                  <span>{f.ts}</span>
                  {f.retry > 0 && <span className="text-amber-600">{f.retry} بار تلاش مجدد</span>}
                </div>
              </div>
              <div className="flex gap-6 shrink-0">
                <button className="px-10 py-5 rounded-6 bg-brand text-white text-[11px] hover:bg-brand/90 transition-colors">تلاش مجدد</button>
                <button onClick={() => setDismissed((d) => new Set([...d, f.id]))} className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg transition-colors">رد</button>
              </div>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="glass rounded-16 p-32 text-center text-[13px] text-green-600">✓ هیچ پروویژن ناموفقی وجود ندارد</div>
        )}
      </div>
    </div>
  );
}
