"use client";

import { useState } from "react";
import Link from "next/link";

interface Stack {
  id:       string;
  name:     string;
  template: string;
  status:   "CREATE_COMPLETE" | "CREATE_IN_PROGRESS" | "UPDATE_COMPLETE" | "DELETE_IN_PROGRESS" | "CREATE_FAILED";
  region:   string;
  created:  string;
  updated:  string;
  resources:number;
}

const STACKS: Stack[] = [
  { id: "s01", name: "prod-web-app",      template: "web-app-3tier",    status: "CREATE_COMPLETE",      region: "تهران-۱",  created: "۱۴۰۴/۰۶/۱۰", updated: "۱۴۰۵/۰۱/۲۰", resources: 18 },
  { id: "s02", name: "staging-web-app",   template: "web-app-3tier",    status: "UPDATE_COMPLETE",      region: "تهران-۱",  created: "۱۴۰۴/۰۶/۱۵", updated: "۱۴۰۵/۰۲/۰۳", resources: 12 },
  { id: "s03", name: "k8s-main-cluster",  template: "k8s-cluster",      status: "CREATE_COMPLETE",      region: "تهران-۱",  created: "۱۴۰۴/۰۹/۰۱", updated: "۱۴۰۵/۰۱/۰۵", resources: 24 },
  { id: "s04", name: "dev-sandbox-ali",   template: "dev-sandbox",      status: "CREATE_COMPLETE",      region: "تهران-۱",  created: "۱۴۰۵/۰۲/۰۵", updated: "۱۴۰۵/۰۲/۰۵", resources: 5  },
  { id: "s05", name: "ml-gpu-train",      template: "ml-gpu-cluster",   status: "CREATE_IN_PROGRESS",   region: "تهران-۱",  created: "۱۴۰۵/۰۲/۰۷", updated: "۱۴۰۵/۰۲/۰۷", resources: 7  },
  { id: "s06", name: "base-network-prod", template: "vpc-baseline",     status: "CREATE_COMPLETE",      region: "تهران-۱",  created: "۱۴۰۳/۱۱/۰۱", updated: "۱۴۰۳/۱۱/۰۱", resources: 9  },
  { id: "s07", name: "monitoring",        template: "monitoring-stack",  status: "UPDATE_COMPLETE",      region: "تهران-۱",  created: "۱۴۰۴/۰۳/۱۰", updated: "۱۴۰۵/۰۲/۰۱", resources: 8  },
  { id: "s08", name: "db-ha-prod",        template: "database-ha",       status: "CREATE_FAILED",        region: "مشهد-۱",   created: "۱۴۰۵/۰۱/۲۸", updated: "۱۴۰۵/۰۱/۲۸", resources: 2  },
];

const STATUS_STYLE: Record<string, string> = {
  CREATE_COMPLETE:     "bg-green-100 text-green-700",
  UPDATE_COMPLETE:     "bg-blue-50 text-brand",
  CREATE_IN_PROGRESS: "bg-amber-100 text-amber-700",
  DELETE_IN_PROGRESS: "bg-red-100 text-red-600",
  CREATE_FAILED:      "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  CREATE_COMPLETE:    "ایجاد شد",
  UPDATE_COMPLETE:    "بروز شد",
  CREATE_IN_PROGRESS:"در حال ایجاد",
  DELETE_IN_PROGRESS:"در حال حذف",
  CREATE_FAILED:      "خطا در ایجاد",
};

export default function StacksPage() {
  const [filter, setFilter] = useState("همه");

  const statuses = ["همه", "CREATE_COMPLETE", "UPDATE_COMPLETE", "CREATE_IN_PROGRESS", "CREATE_FAILED"];
  const filtered = filter === "همه" ? STACKS : STACKS.filter((s) => s.status === filter);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">Stack‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">استک‌های اجراشده از قالب‌های Heat</p>
          </div>
          <div className="flex gap-8">
            <Link href="/automation/heat-templates" className="text-[12px] text-brand hover:underline">قالب‌ها →</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل stack",      value: STACKS.length,                                                       color: "#2554d8" },
            { label: "موفق",          value: STACKS.filter((s) => s.status.endsWith("COMPLETE")).length,          color: "#16a34a" },
            { label: "در حال اجرا",   value: STACKS.filter((s) => s.status.endsWith("IN_PROGRESS")).length,       color: "#d97706" },
            { label: "خطا",           value: STACKS.filter((s) => s.status.endsWith("FAILED")).length,            color: "#dc2626" },
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
            className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-all ${filter === s ? "bg-brand text-white" : "border border-border text-text-muted hover:text-text-main"}`}>
            {s === "همه" ? "همه" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">نام stack</th>
              <th className="text-start py-12 font-medium">قالب</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">منطقه</th>
              <th className="text-start py-12 font-medium">منابع</th>
              <th className="text-start py-12 font-medium">بروزرسانی</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono font-semibold text-[11px] text-text-main">{s.name}</td>
                <td className="py-11 font-mono text-[10px] text-brand">{s.template}</td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[10px] font-medium ${STATUS_STYLE[s.status]}`}>
                    {STATUS_LABEL[s.status]}
                    {s.status.endsWith("IN_PROGRESS") && <span className="ms-4 animate-pulse">●</span>}
                  </span>
                </td>
                <td className="py-11 text-text-muted">{s.region}</td>
                <td className="py-11 font-semibold text-text-main">{s.resources}</td>
                <td className="py-11 text-text-muted">{s.updated}</td>
                <td className="py-11 pe-12 flex gap-6">
                  <Link href="/automation/stack-events" className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">رویدادها</Link>
                  <Link href="/automation/stack-outputs" className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">خروجی</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
