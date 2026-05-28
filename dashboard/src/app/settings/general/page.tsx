"use client";

import { useState } from "react";

interface Toggle {
  id:    string;
  label: string;
  desc:  string;
  value: boolean;
}

export default function GeneralSettingsPage() {
  const [displayName, setDisplayName] = useState("احمدرضا سرخایل");
  const [email, setEmail]             = useState("a.sarkhail@nab.ir");
  const [pageSize, setPageSize]       = useState("25");
  const [theme, setTheme]             = useState("system");
  const [saved, setSaved]             = useState(false);

  const [toggles, setToggles] = useState<Toggle[]>([
    { id: "email_notif",  label: "اعلان‌های ایمیلی",         desc: "دریافت هشدار و رویداد مهم از طریق ایمیل",            value: true  },
    { id: "desktop_notif",label: "اعلان‌های مرورگر",         desc: "نمایش notification در مرورگر",                       value: false },
    { id: "usage_alerts", label: "هشدار مصرف منابع",         desc: "هنگام رسیدن به ۸۰٪ سقف منابع اطلاع بده",            value: true  },
    { id: "invoice_email",label: "ارسال فاکتور به ایمیل",   desc: "هر فاکتور جدید به ایمیل ارسال شود",                  value: true  },
    { id: "beta_features",label: "ویژگی‌های آزمایشی",        desc: "دسترسی زودهنگام به قابلیت‌های جدید",                value: false },
    { id: "telemetry",    label: "ارسال آمار ناشناس",        desc: "کمک به بهبود پلتفرم با ارسال داده‌های آمار استفاده", value: true  },
  ]);

  const toggle = (id: string) => setToggles((t) => t.map((x) => x.id === id ? { ...x, value: !x.value } : x));
  const save   = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <h1 className="text-[18px] font-bold text-text-main mb-2">تنظیمات عمومی</h1>
        <p className="text-[12px] text-text-muted">تنظیمات پایه حساب کاربری و رابط کاربری</p>
      </div>

      <div className="glass rounded-16 p-20 flex flex-col gap-16">
        <h2 className="text-[13px] font-bold text-text-main">اطلاعات نمایشی</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-14">
          <div>
            <label className="text-[11px] text-text-muted mb-4 block">نام نمایشی</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-12 py-9 rounded-8 border border-border bg-bg text-[13px] outline-none focus:border-brand" />
          </div>
          <div>
            <label className="text-[11px] text-text-muted mb-4 block">ایمیل</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr"
              className="w-full px-12 py-9 rounded-8 border border-border bg-bg text-[13px] outline-none focus:border-brand" />
          </div>
        </div>
      </div>

      <div className="glass rounded-16 p-20 flex flex-col gap-14">
        <h2 className="text-[13px] font-bold text-text-main">ظاهر</h2>
        <div className="flex gap-10">
          {[
            { id: "light",  label: "روشن",   icon: "☀" },
            { id: "dark",   label: "تیره",   icon: "☾" },
            { id: "system", label: "سیستم",  icon: "⊕" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`flex-1 py-12 rounded-10 border transition-all flex flex-col items-center gap-6 ${theme === t.id ? "border-brand bg-brand/5" : "border-border hover:border-border/80"}`}>
              <span className="text-[20px]">{t.icon}</span>
              <span className="text-[12px] text-text-main">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-12">
          <label className="text-[12px] text-text-muted">تعداد ردیف در جدول‌ها</label>
          <select value={pageSize} onChange={(e) => setPageSize(e.target.value)} dir="ltr"
            className="px-10 py-6 rounded-8 border border-border bg-bg text-[12px] outline-none focus:border-brand">
            {["10", "25", "50", "100"].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="glass rounded-16 p-20 flex flex-col gap-12">
        <h2 className="text-[13px] font-bold text-text-main mb-2">اعلان‌ها و رفتار</h2>
        {toggles.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-12 py-8 border-b border-border/40 last:border-0">
            <div>
              <p className="text-[13px] text-text-main">{t.label}</p>
              <p className="text-[11px] text-text-muted mt-2">{t.desc}</p>
            </div>
            <button onClick={() => toggle(t.id)}
              className={`w-[44px] h-[24px] rounded-full transition-colors shrink-0 relative ${t.value ? "bg-brand" : "bg-border"}`}>
              <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${t.value ? "right-[3px]" : "left-[3px]"}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-10">
        <button onClick={save} className="px-18 py-9 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand/90 transition-colors">
          {saved ? "ذخیره شد ✓" : "ذخیره تنظیمات"}
        </button>
      </div>
    </div>
  );
}
