"use client";

import Link from "next/link";

interface Backup {
  id:        string;
  instance:  string;
  type:      "auto" | "manual" | "snapshot";
  status:    "completed" | "in_progress" | "failed";
  size:      string;
  created:   string;
  expires:   string | null;
  retentionDays: number;
}

const BACKUPS: Backup[] = [
  { id: "bk01", instance: "prod-postgres",  type: "auto",     status: "completed",   size: "14.2 GB", created: "۱۴۰۵/۰۲/۰۷ ۰۳:۰۰", expires: "۱۴۰۵/۰۴/۰۷", retentionDays: 60  },
  { id: "bk02", instance: "prod-postgres",  type: "auto",     status: "completed",   size: "14.1 GB", created: "۱۴۰۵/۰۲/۰۶ ۰۳:۰۰", expires: "۱۴۰۵/۰۴/۰۶", retentionDays: 60  },
  { id: "bk03", instance: "prod-postgres",  type: "manual",   status: "completed",   size: "14.3 GB", created: "۱۴۰۵/۰۲/۰۵ ۱۱:۱۵", expires: null,          retentionDays: -1  },
  { id: "bk04", instance: "analytics-pg",   type: "auto",     status: "in_progress", size: "—",       created: "۱۴۰۵/۰۲/۰۷ ۰۲:۳۰", expires: "۱۴۰۵/۰۴/۰۷", retentionDays: 60  },
  { id: "bk05", instance: "cache-redis",    type: "auto",     status: "completed",   size: "240 MB",  created: "۱۴۰۵/۰۲/۰۷ ۰۱:۰۰", expires: "۱۴۰۵/۰۳/۰۷", retentionDays: 30  },
  { id: "bk06", instance: "ml-mongo",       type: "snapshot", status: "completed",   size: "32.5 GB", created: "۱۴۰۵/۰۲/۰۴ ۱۶:۴۰", expires: null,          retentionDays: -1  },
  { id: "bk07", instance: "staging-pg",     type: "auto",     status: "failed",      size: "—",       created: "۱۴۰۵/۰۲/۰۶ ۰۳:۰۰", expires: null,          retentionDays: 14  },
];

const TYPE_LABEL: Record<string, string> = { auto: "خودکار", manual: "دستی", snapshot: "اسنپ‌شات" };
const TYPE_COLOR: Record<string, string> = { auto: "#16a34a", manual: "#2554d8", snapshot: "#7c3aed" };

const STATUS_STYLE: Record<string, string> = {
  completed:   "bg-green-100 text-green-700",
  in_progress: "bg-amber-100 text-amber-700",
  failed:      "bg-red-100 text-red-700",
};

export default function DatabaseBackupsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">پشتیبان‌گیری دیتابیس</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت بکاپ‌های پایگاه‌های داده</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ بکاپ دستی</button>
            <Link href="/databases/instances" className="text-[12px] text-text-muted hover:text-brand">← نمونه‌ها</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",          value: BACKUPS.length,                                              color: "#2554d8" },
            { label: "موفق",        value: BACKUPS.filter((b) => b.status === "completed").length,      color: "#16a34a" },
            { label: "در جریان",    value: BACKUPS.filter((b) => b.status === "in_progress").length,    color: "#d97706" },
            { label: "خطا",         value: BACKUPS.filter((b) => b.status === "failed").length,         color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">نمونه</th>
              <th className="text-start py-12 font-medium">نوع</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">حجم</th>
              <th className="text-start py-12 font-medium">ایجاد شده</th>
              <th className="text-start py-12 font-medium">انقضا</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {BACKUPS.map((b) => (
              <tr key={b.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono text-[11px] font-semibold text-brand">{b.instance}</td>
                <td className="py-11">
                  <span className="px-7 py-2 rounded-4 text-[10px]" style={{ background: `${TYPE_COLOR[b.type]}15`, color: TYPE_COLOR[b.type] }}>{TYPE_LABEL[b.type]}</span>
                </td>
                <td className="py-11">
                  <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${STATUS_STYLE[b.status]}`}>
                    {b.status === "completed" ? "موفق" : b.status === "in_progress" ? "در جریان" : "خطا"}
                    {b.status === "in_progress" && <span className="ms-4 animate-pulse">●</span>}
                  </span>
                </td>
                <td className="py-11 ltr-text text-text-muted">{b.size}</td>
                <td className="py-11 text-text-muted ltr-text text-[11px]" style={{ direction: "ltr" }}>{b.created}</td>
                <td className="py-11 text-text-muted">{b.expires ?? "دائمی"}</td>
                <td className="py-11 pe-12">
                  <button className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">بازیابی</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
