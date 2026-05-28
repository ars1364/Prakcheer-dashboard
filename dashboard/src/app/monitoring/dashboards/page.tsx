"use client";

import Link from "next/link";

interface Dashboard {
  id:       string;
  title:    string;
  category: string;
  panels:   number;
  updated:  string;
  starred:  boolean;
  shared:   boolean;
}

const DASHBOARDS: Dashboard[] = [
  { id: "d01", title: "سرورهای Production",  category: "compute",    panels: 12, updated: "۱ ساعت پیش",  starred: true,  shared: true  },
  { id: "d02", title: "کلاستر Kubernetes",   category: "k8s",        panels: 18, updated: "۳۰ دقیقه پیش",starred: true,  shared: true  },
  { id: "d03", title: "شبکه و ترافیک",       category: "network",    panels: 8,  updated: "دیروز",        starred: false, shared: true  },
  { id: "d04", title: "مصرف Object Storage", category: "storage",    panels: 6,  updated: "۲ روز پیش",   starred: false, shared: false },
  { id: "d05", title: "هزینه و مصرف",        category: "billing",    panels: 9,  updated: "۱ هفته پیش",  starred: true,  shared: false },
  { id: "d06", title: "API Gateway متریک",   category: "api",        panels: 10, updated: "دیروز",        starred: false, shared: true  },
  { id: "d07", title: "دیتابیس‌ها",         category: "database",   panels: 14, updated: "۴ ساعت پیش",  starred: true,  shared: false },
  { id: "d08", title: "CDN و Edge",          category: "cdn",        panels: 7,  updated: "۳ روز پیش",   starred: false, shared: true  },
];

const CAT_COLOR: Record<string, string> = {
  compute: "#2554d8", k8s: "#0891b2", network: "#16a34a", storage: "#7c3aed",
  billing: "#d97706", api: "#dc2626", database: "#64748b", cdn: "#16a34a",
};

export default function DashboardsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">داشبوردهای مانیتورینگ</h1>
            <p className="text-[12px] text-text-muted mt-2">نمودارهای متریک زنده</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ داشبورد جدید</button>
            <Link href="/monitoring" className="text-[12px] text-text-muted hover:text-brand">← مانیتورینگ</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل داشبورد", value: DASHBOARDS.length,                                      color: "#2554d8" },
            { label: "starred",    value: DASHBOARDS.filter((d) => d.starred).length,             color: "#d97706" },
            { label: "اشتراکی",    value: DASHBOARDS.filter((d) => d.shared).length,              color: "#16a34a" },
            { label: "کل panel",   value: DASHBOARDS.reduce((a, d) => a + d.panels, 0),           color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {DASHBOARDS.map((d) => (
          <button key={d.id} className="glass rounded-14 p-18 border border-border hover:border-brand/50 text-start transition-colors group">
            <div className="flex items-start justify-between mb-8">
              <div className="w-36 h-36 rounded-10 flex items-center justify-center text-[16px] shrink-0"
                style={{ background: `${CAT_COLOR[d.category]}20`, color: CAT_COLOR[d.category] }}>
                ◉
              </div>
              <div className="flex gap-4">
                {d.starred && <span className="text-[14px] text-amber-400">★</span>}
                {d.shared && <span className="text-[10px] text-text-muted bg-bg px-6 py-2 rounded-4">اشتراکی</span>}
              </div>
            </div>
            <p className="text-[13px] font-bold text-text-main mb-3 group-hover:text-brand transition-colors">{d.title}</p>
            <div className="flex items-center justify-between mt-8 text-[11px] text-text-muted">
              <span>{d.panels} panel</span>
              <span>{d.updated}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
