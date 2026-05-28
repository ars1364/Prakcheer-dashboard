"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";

type Tab = "profile" | "security" | "api";

const API_KEYS = [
  { id: "key-1", name: "کلید تولید محیط", prefix: "pk_live_", suffix: "••••••••••••••••••••••••••••Xq9r", created: "۱۴۰۳/۰۱/۱۵", lastUsed: "۱۴۰۳/۰۳/۰۴", status: "active" as const },
  { id: "key-2", name: "کلید تست CI/CD", prefix: "pk_test_", suffix: "••••••••••••••••••••••••••••mN4k", created: "۱۴۰۳/۰۲/۱۰", lastUsed: "۱۴۰۳/۰۳/۰۳", status: "active" as const },
  { id: "key-3", name: "کلید قدیمی (deprecated)", prefix: "pk_live_", suffix: "••••••••••••••••••••••••••••aB1z", created: "۱۴۰۲/۱۱/۰۵", lastUsed: "۱۴۰۲/۱۲/۲۰", status: "inactive" as const },
];

const SESSIONS = [
  { id: "s1", device: "Chrome / macOS", ip: "185.47.22.11", location: "تهران", current: true, lastActive: "همین الان" },
  { id: "s2", device: "Firefox / Windows", ip: "91.98.44.77", location: "مشهد", current: false, lastActive: "۳ ساعت پیش" },
  { id: "s3", device: "Safari / iPhone", ip: "5.22.187.9", location: "تهران", current: false, lastActive: "دیروز" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profileName, setProfileName] = useState("احمدرضا سرخایل");
  const [profileEmail, setProfileEmail] = useState("a.sarkhail@prakcheer.io");
  const [profilePhone, setProfilePhone] = useState("۰۹۱۲۱۲۳۴۵۶۷");
  const [saved, setSaved] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "profile", label: "پروفایل", icon: "◎" },
    { id: "security", label: "امنیت", icon: "⬡" },
    { id: "api", label: "کلیدهای API", icon: "◇" },
  ];

  return (
    <DashboardShell
      title="تنظیمات"
      breadcrumbs={[{ label: "پراکچیر", href: "/" }, { label: "تنظیمات" }]}
    >
      <div className="flex gap-24 items-start">
        {/* Side tab navigation */}
        <div className="glass rounded-12 p-8 flex flex-col gap-2 min-w-[160px] shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-10 px-14 py-10 rounded-8 text-[13px] font-medium transition-all text-start w-full"
              style={activeTab === tab.id ? {
                background: "linear-gradient(270deg, #eaf2ff, #dbeafe)",
                borderInlineStart: "3px solid #2554d8",
                color: "#2554d8",
              } : { color: "#64748b" }}
            >
              <span className="text-[15px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">

          {/* Profile tab */}
          {activeTab === "profile" && (
            <DashboardCard title="اطلاعات پروفایل">
              <div className="flex items-center gap-20 mb-28 pb-20 border-b border-border">
                <div className="w-[72px] h-[72px] rounded-full bg-brand flex items-center justify-center text-white text-[28px] font-bold shrink-0">ا</div>
                <div>
                  <p className="text-[15px] font-semibold text-text-main mb-2">{profileName}</p>
                  <p className="text-[13px] text-text-muted">مدیر سیستم — پراکچیر</p>
                  <button className="mt-8 text-[12px] text-brand hover:text-brand-hover underline">تغییر تصویر</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
                <div>
                  <label className="block text-[12px] text-text-muted mb-6">نام و نام خانوادگی</label>
                  <input
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full h-40 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main outline-none focus:border-border-strong"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-text-muted mb-6">ایمیل</label>
                  <input
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    className="w-full h-40 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main outline-none focus:border-border-strong ltr-text"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-text-muted mb-6">شماره موبایل</label>
                  <input
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    className="w-full h-40 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main outline-none focus:border-border-strong ltr-text"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[12px] text-text-muted mb-6">نقش</label>
                  <input
                    value="مدیر سیستم"
                    readOnly
                    className="w-full h-40 rounded-8 border border-border bg-bg-muted/60 px-12 text-[13px] text-text-muted outline-none cursor-not-allowed"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="mt-20 flex items-center gap-12">
                <button
                  onClick={handleSave}
                  className="h-40 px-24 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors"
                >
                  ذخیره تغییرات
                </button>
                {saved && <span className="text-[13px] text-success animate-pulse">✓ ذخیره شد</span>}
              </div>
            </DashboardCard>
          )}

          {/* Security tab */}
          {activeTab === "security" && (
            <div className="flex flex-col gap-20">
              {/* Password */}
              <DashboardCard title="تغییر رمز عبور">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
                  <div className="sm:col-span-2">
                    <label className="block text-[12px] text-text-muted mb-6">رمز عبور فعلی</label>
                    <input type="password" placeholder="••••••••••••"
                      className="w-full h-40 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main outline-none focus:border-border-strong"
                      dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-[12px] text-text-muted mb-6">رمز عبور جدید</label>
                    <input type="password" placeholder="••••••••••••"
                      className="w-full h-40 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main outline-none focus:border-border-strong"
                      dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-[12px] text-text-muted mb-6">تکرار رمز عبور جدید</label>
                    <input type="password" placeholder="••••••••••••"
                      className="w-full h-40 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main outline-none focus:border-border-strong"
                      dir="ltr" />
                  </div>
                </div>
                <button className="mt-16 h-40 px-24 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors">
                  به‌روزرسانی رمز عبور
                </button>
              </DashboardCard>

              {/* 2FA */}
              <DashboardCard title="احراز هویت دو مرحله‌ای">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-text-main font-medium mb-4">
                      {twoFAEnabled ? "فعال — TOTP (Google Authenticator)" : "غیرفعال"}
                    </p>
                    <p className="text-[12px] text-text-muted">
                      {twoFAEnabled
                        ? "حساب شما با احراز هویت دو مرحله‌ای محافظت می‌شود."
                        : "احراز هویت دو مرحله‌ای را برای امنیت بیشتر فعال کنید."}
                    </p>
                  </div>
                  <button
                    onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                    className={`relative w-44 h-26 rounded-999 transition-colors shrink-0 ${twoFAEnabled ? "bg-brand" : "bg-border-strong"}`}
                    style={{ minWidth: 44 }}
                  >
                    <span
                      className="absolute top-3 w-20 h-20 rounded-full bg-white shadow transition-all"
                      style={{ [twoFAEnabled ? "right" : "left"]: 3 }}
                    />
                  </button>
                </div>
              </DashboardCard>

              {/* Active sessions */}
              <DashboardCard title="جلسات فعال">
                <div className="flex flex-col gap-12">
                  {SESSIONS.map(session => (
                    <div key={session.id} className="flex items-center justify-between p-14 rounded-8 bg-bg-muted/60 border border-border">
                      <div className="flex items-center gap-12">
                        <div className="w-36 h-36 rounded-8 bg-brand-light flex items-center justify-center text-brand text-[16px] shrink-0">
                          {session.device.includes("Chrome") ? "⬡" : session.device.includes("Firefox") ? "◎" : "◇"}
                        </div>
                        <div>
                          <p className="text-[13px] text-text-main font-medium">{session.device}</p>
                          <p className="text-[11px] text-text-muted ltr-text">{session.ip} — {session.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-12">
                        <span className="text-[12px] text-text-muted">{session.lastActive}</span>
                        {session.current ? (
                          <StatusBadge variant="success">این دستگاه</StatusBadge>
                        ) : (
                          <button className="text-[12px] text-danger hover:underline">خروج</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>
          )}

          {/* API Keys tab */}
          {activeTab === "api" && (
            <div className="flex flex-col gap-20">
              <DashboardCard
                title="کلیدهای API"
                action={
                  <button className="h-34 px-16 rounded-8 bg-brand text-white text-[12px] font-medium hover:bg-brand-hover transition-colors">
                    ساخت کلید جدید
                  </button>
                }
              >
                <div className="flex flex-col gap-12">
                  {API_KEYS.map(key => (
                    <div key={key.id} className="flex items-center justify-between p-14 rounded-8 bg-bg-muted/60 border border-border">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-10 mb-6">
                          <p className="text-[13px] font-medium text-text-main">{key.name}</p>
                          <StatusBadge variant={key.status === "active" ? "success" : "info"}>
                            {key.status === "active" ? "فعال" : "غیرفعال"}
                          </StatusBadge>
                        </div>
                        <p className="text-[12px] text-text-muted ltr-text font-mono">
                          {key.prefix}{key.suffix}
                        </p>
                        <p className="text-[11px] text-text-placeholder mt-4">
                          ایجاد: {key.created} — آخرین استفاده: {key.lastUsed}
                        </p>
                      </div>
                      <div className="flex items-center gap-8 shrink-0 ms-12">
                        <button className="h-32 px-12 rounded-8 text-[12px] text-brand border border-border hover:border-border-strong transition-colors bg-white/40">
                          کپی
                        </button>
                        <button className="h-32 px-12 rounded-8 text-[12px] text-danger border border-border hover:border-border-strong transition-colors bg-white/40">
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>

              <DashboardCard title="مستندات API">
                <p className="text-[13px] text-text-muted mb-16">
                  برای دسترسی به API پراکچیر از کلید بالا در هدر درخواست استفاده کنید:
                </p>
                <div className="rounded-8 bg-[rgba(15,31,30,0.06)] border border-border p-14 font-mono text-[12px] text-text-main ltr-text overflow-x-auto" dir="ltr">
                  Authorization: Bearer pk_live_...
                </div>
                <p className="mt-12 text-[12px] text-text-muted">
                  پایه آدرس: <span className="ltr-text font-mono text-text-main">https://api.prakcheer.io/v1</span>
                </p>
              </DashboardCard>
            </div>
          )}

        </div>
      </div>
    </DashboardShell>
  );
}
