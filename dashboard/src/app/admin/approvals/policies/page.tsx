"use client";

import { useState } from "react";
import Link from "next/link";

const POLICIES = [
  { id: "p01", name: "افزایش سهمیه خودکار", trigger: "quota.increase", plan: "enterprise", autoApprove: true,  maxCPU: 40, notify: ["admin"]                },
  { id: "p02", name: "تأیید دستی K8s",       trigger: "k8s.cluster",   plan: "all",        autoApprove: false, maxCPU: null, notify: ["admin", "slack"]      },
  { id: "p03", name: "ارتقای پلن خودکار",   trigger: "plan.upgrade",  plan: "pro",        autoApprove: true,  maxCPU: null, notify: ["email"]               },
  { id: "p04", name: "حد IP شناور",         trigger: "floatingip",    plan: "basic",      autoApprove: false, maxCPU: null, notify: ["admin"]                },
];

export default function ApprovalPoliciesPage() {
  const [items, setItems] = useState(POLICIES);
  const toggle = (id: string) => setItems((p) => p.map((x) => x.id === id ? { ...x, autoApprove: !x.autoApprove } : x));

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[18px] font-bold text-text-main">سیاست‌های تأییدیه</h1>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ سیاست جدید</button>
            <Link href="/admin/approvals/pending" className="text-[12px] text-text-muted hover:text-brand">← تأییدیه‌ها</Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-12">
        {items.map((p) => (
          <div key={p.id} className="glass rounded-16 p-16 flex items-center gap-14">
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-text-main">{p.name}</p>
              <div className="flex flex-wrap gap-8 mt-6 text-[11px]">
                <span className="px-7 py-2 rounded-5 bg-bg border border-border text-text-muted font-mono">{p.trigger}</span>
                <span className="px-7 py-2 rounded-5 bg-brand/10 text-brand">پلن: {p.plan}</span>
                {p.maxCPU && <span className="px-7 py-2 rounded-5 bg-amber-50 text-amber-700">حداکثر CPU: {p.maxCPU}</span>}
                <span className="text-text-muted">اعلان: {p.notify.join(", ")}</span>
              </div>
            </div>
            <div className="flex items-center gap-10 shrink-0">
              <span className="text-[11px] text-text-muted">{p.autoApprove ? "خودکار" : "دستی"}</span>
              <button onClick={() => toggle(p.id)} className={`relative w-40 h-22 rounded-999 transition-colors ${p.autoApprove ? "bg-brand" : "bg-border"}`}>
                <span className={`absolute top-2 w-18 h-18 rounded-999 bg-white shadow transition-all ${p.autoApprove ? "right-2" : "left-2"}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
