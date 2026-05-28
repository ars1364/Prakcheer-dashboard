"use client";

import { useState } from "react";
import Link from "next/link";

interface ServiceRequest {
  id:        string;
  service:   string;
  plan:      string;
  status:    "pending" | "approved" | "provisioning" | "active" | "rejected";
  requested: string;
  updated:   string;
  note:      string | null;
}

const REQUESTS: ServiceRequest[] = [
  { id: "req01", service: "K8s Cluster Pro",      plan: "pro",        status: "active",       requested: "۱۴۰۴/۰۹/۰۱", updated: "۱۴۰۴/۰۹/۰۳", note: null },
  { id: "req02", service: "GPU Instance (A100)",  plan: "enterprise", status: "active",       requested: "۱۴۰۵/۰۱/۱۵", updated: "۱۴۰۵/۰۱/۱۷", note: null },
  { id: "req03", service: "CDN Edge Node",        plan: "pro",        status: "provisioning", requested: "۱۴۰۵/۰۲/۰۵", updated: "۱۴۰۵/۰۲/۰۷", note: null },
  { id: "req04", service: "Managed Database HA",  plan: "pro",        status: "pending",      requested: "۱۴۰۵/۰۲/۰۷", updated: "۱۴۰۵/۰۲/۰۷", note: null },
  { id: "req05", service: "Dedicated Host",       plan: "enterprise", status: "rejected",     requested: "۱۴۰۴/۱۲/۱۰", updated: "۱۴۰۴/۱۲/۱۲", note: "سقف مجاز مستاجر تکمیل است. با پشتیبانی تماس بگیرید." },
  { id: "req06", service: "Object Storage 50TB",  plan: "basic",      status: "approved",     requested: "۱۴۰۵/۰۲/۰۶", updated: "۱۴۰۵/۰۲/۰۶", note: null },
];

const STATUS_STYLE: Record<string, string> = {
  pending:      "bg-amber-100 text-amber-700",
  approved:     "bg-blue-50 text-brand",
  provisioning: "bg-purple-100 text-purple-700",
  active:       "bg-green-100 text-green-700",
  rejected:     "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  pending:      "در انتظار بررسی",
  approved:     "تأیید شده",
  provisioning: "در حال راه‌اندازی",
  active:       "فعال",
  rejected:     "رد شده",
};

const PLAN_COLOR: Record<string, string> = { basic: "#64748b", pro: "#7c3aed", enterprise: "#d97706" };

export default function MyRequestsPage() {
  const [filter, setFilter] = useState("همه");

  const statuses = ["همه", "pending", "provisioning", "active", "rejected"];
  const filtered = filter === "همه" ? REQUESTS : REQUESTS.filter((r) => r.status === filter);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">درخواست‌های من</h1>
            <p className="text-[12px] text-text-muted mt-2">وضعیت سرویس‌های درخواست‌شده</p>
          </div>
          <Link href="/iaas" className="text-[12px] text-text-muted hover:text-brand">← IaaS</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",         value: REQUESTS.length,                                               color: "#2554d8" },
            { label: "فعال",       value: REQUESTS.filter((r) => r.status === "active").length,          color: "#16a34a" },
            { label: "در انتظار",  value: REQUESTS.filter((r) => r.status === "pending").length,         color: "#d97706" },
            { label: "رد شده",     value: REQUESTS.filter((r) => r.status === "rejected").length,        color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all ${filter === s ? "bg-brand text-white" : "border border-border text-text-muted"}`}>
            {s === "همه" ? "همه" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-10">
        {filtered.map((r) => (
          <div key={r.id} className={`glass rounded-14 p-16 border ${r.status === "rejected" ? "border-red-100" : "border-border"}`}>
            <div className="flex items-start justify-between gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-10 mb-6 flex-wrap">
                  <p className="text-[13px] font-bold text-text-main">{r.service}</p>
                  <span className={`px-7 py-2 rounded-5 text-[11px] font-medium ${STATUS_STYLE[r.status]}`}>
                    {STATUS_LABEL[r.status]}
                    {r.status === "provisioning" && <span className="ms-4 animate-pulse">●</span>}
                  </span>
                  <span className="px-7 py-2 rounded-5 text-[10px] font-medium" style={{ background: `${PLAN_COLOR[r.plan]}15`, color: PLAN_COLOR[r.plan] }}>
                    {r.plan}
                  </span>
                </div>
                <div className="flex gap-12 text-[11px] text-text-muted flex-wrap">
                  <span>درخواست: {r.requested}</span>
                  <span>بروزرسانی: {r.updated}</span>
                </div>
                {r.note && (
                  <div className="mt-8 p-10 rounded-8 bg-red-50 border border-red-100">
                    <p className="text-[11px] text-red-600">{r.note}</p>
                  </div>
                )}
              </div>
              {(r.status === "pending" || r.status === "rejected") && (
                <button className="px-12 py-6 rounded-8 border border-border text-text-muted text-[12px] hover:bg-bg shrink-0">لغو</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
