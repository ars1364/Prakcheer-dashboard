"use client";

import Link from "next/link";

const STUCK = [
  { id: "sr01", type: "VM resize",        resource: "srv-web-04",         tenant: "شرکت نوآوری",        stuck: "۳ ساعت",   state: "resizing",      thread: "nova-conductor-01" },
  { id: "sr02", type: "Volume attach",    resource: "vol-db-backup-03",   tenant: "سازمان پژوهش",       stuck: "۱.۵ ساعت", state: "attaching",     thread: "cinder-volume-02" },
  { id: "sr03", type: "K8s node add",     resource: "ml-cluster / node-4", tenant: "استارتاپ هوش‌مند",  stuck: "۴۵ دقیقه", state: "provisioning",  thread: "magnum-conductor" },
  { id: "sr04", type: "LB member add",    resource: "lb-api-gw / pool-1", tenant: "پلتفرم پرداخت",       stuck: "۲۰ دقیقه", state: "pending_update",thread: "octavia-worker-03" },
  { id: "sr05", type: "Snapshot create",  resource: "data-vol-07",        tenant: "شرکت لجستیک",        stuck: "۱ ساعت",   state: "creating",      thread: "cinder-backup-01" },
];

export default function StuckRequestsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">درخواست‌های گیر</h1>
            <p className="text-[12px] text-text-muted mt-2">عملیاتی که بیش از حد انتظار در حال اجرا هستند</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        {STUCK.length > 0 && (
          <div className="mb-14 p-12 rounded-10 bg-amber-50 border border-amber-200 text-[12px] text-amber-800">
            ⚠ {STUCK.length} عملیات بیش از حد در حالت انتظار هستند. ممکن است نیاز به مداخله دستی باشد.
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "گیر کرده", value: STUCK.length, color: "#dc2626" },
            { label: "بیش از ۲ ساعت", value: STUCK.filter((s) => s.stuck.includes("۳") || s.stuck.includes("۱.۵")).length, color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {STUCK.map((s) => (
          <div key={s.id} className="glass rounded-16 border border-amber-200 p-16">
            <div className="flex items-start justify-between gap-12 flex-wrap">
              <div>
                <div className="flex flex-wrap items-center gap-8 mb-6">
                  <span className="px-8 py-3 rounded-5 bg-amber-100 text-amber-700 text-[11px] font-semibold">{s.stuck} گیر کرده</span>
                  <span className="text-[13px] font-semibold text-text-main">{s.type}</span>
                </div>
                <p className="text-[12px] text-text-muted mb-4">{s.resource} ← {s.tenant}</p>
                <div className="flex flex-wrap gap-x-12 gap-y-2 text-[11px]">
                  <span className="px-7 py-2 rounded-5 bg-bg border border-border text-text-muted font-mono">{s.state}</span>
                  <span className="text-text-muted ltr-text" style={{ direction: "ltr" }}>{s.thread}</span>
                </div>
              </div>
              <div className="flex gap-6 shrink-0">
                <button className="px-10 py-6 rounded-8 bg-amber-600 text-white text-[12px] hover:bg-amber-700 transition-colors">Force Complete</button>
                <button className="px-10 py-6 rounded-8 border border-red-200 text-red-600 text-[12px] hover:bg-red-50 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
