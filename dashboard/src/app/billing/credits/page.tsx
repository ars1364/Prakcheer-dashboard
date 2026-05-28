"use client";

import Link from "next/link";

interface Credit {
  id:       string;
  type:     "promotional" | "support" | "referral" | "manual";
  desc:     string;
  amount:   number;
  used:     number;
  expires:  string | null;
  issued:   string;
}

const CREDITS: Credit[] = [
  { id: "cr01", type: "promotional", desc: "اعتبار خوش‌آمد‌گویی",          amount: 500000,  used: 500000,  expires: "۱۴۰۳/۰۳/۳۱", issued: "۱۴۰۲/۰۳" },
  { id: "cr02", type: "support",     desc: "جبران قطعی سرویس — حادثه ۰۴۴", amount: 180000,  used: 180000,  expires: null,           issued: "۱۴۰۴/۱۲" },
  { id: "cr03", type: "referral",    desc: "معرفی کاربر جدید",              amount: 200000,  used: 120000,  expires: "۱۴۰۵/۰۷/۳۱", issued: "۱۴۰۵/۰۱" },
  { id: "cr04", type: "promotional", desc: "اعتبار رویداد Cloud Summit",    amount: 300000,  used: 240000,  expires: "۱۴۰۵/۰۶/۳۰", issued: "۱۴۰۵/۰۱" },
  { id: "cr05", type: "manual",      desc: "تعدیل دستی توسط پشتیبانی",     amount: 100000,  used: 0,       expires: null,           issued: "۱۴۰۵/۰۲" },
];

const TYPE_COLOR: Record<string, string> = {
  promotional: "#d97706", support: "#2554d8", referral: "#16a34a", manual: "#7c3aed",
};
const TYPE_LABEL: Record<string, string> = {
  promotional: "تبلیغاتی", support: "پشتیبانی", referral: "معرفی", manual: "دستی",
};

export default function CreditsPage() {
  const totalBalance = CREDITS.reduce((a, c) => a + c.amount - c.used, 0);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">اعتبارات</h1>
            <p className="text-[12px] text-text-muted mt-2">اعتبارات و مبالغ کسر‌شده</p>
          </div>
          <Link href="/billing" className="text-[12px] text-text-muted hover:text-brand">← صورتحساب</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "موجودی کل",   value: (totalBalance / 10).toLocaleString() + " تومان", color: "#16a34a" },
            { label: "کل اعتبار",   value: CREDITS.length,                                   color: "#2554d8" },
            { label: "استفاده‌شده", value: CREDITS.filter((c) => c.used === c.amount).length, color: "#64748b" },
            { label: "منقضی‌نشده",  value: CREDITS.filter((c) => c.used < c.amount).length,  color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[18px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {CREDITS.map((c) => {
          const remaining = c.amount - c.used;
          const pct = Math.round((c.used / c.amount) * 100);
          return (
            <div key={c.id} className={`glass rounded-14 p-16 border ${remaining === 0 ? "opacity-60 border-transparent" : "border-border"}`}>
              <div className="flex items-start justify-between gap-12 mb-10">
                <div>
                  <div className="flex items-center gap-8 mb-4">
                    <p className="text-[13px] font-semibold text-text-main">{c.desc}</p>
                    <span className="px-7 py-2 rounded-4 text-[10px]" style={{ background: `${TYPE_COLOR[c.type]}15`, color: TYPE_COLOR[c.type] }}>{TYPE_LABEL[c.type]}</span>
                  </div>
                  <div className="flex gap-12 text-[11px] text-text-muted">
                    <span>صدور: {c.issued}</span>
                    {c.expires && <span>انقضا: {c.expires}</span>}
                  </div>
                </div>
                <div className="text-end shrink-0">
                  <p className="text-[13px] font-bold text-green-600">{(remaining / 10).toLocaleString()} تومان</p>
                  <p className="text-[10px] text-text-muted">از {(c.amount / 10).toLocaleString()}</p>
                </div>
              </div>
              <div className="h-3 rounded-full bg-bg overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct === 100 ? "#64748b" : TYPE_COLOR[c.type] }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
