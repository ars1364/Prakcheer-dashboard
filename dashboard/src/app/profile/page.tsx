"use client";

import { useState } from "react";

/* ─── mock data ─── */
const USER = {
  name:     "احمدرضا سرخایل",
  email:    "a.sarkhail@example.ir",
  phone:    "۰۹۱۲-۳۴۵-۶۷۸۹",
  role:     "مدیر سیستم",
  joined:   "۱۴۰۳/۰۶/۱۵",
  avatar:   "ا",
  company:  "شرکت نوآوری ابری",
  timezone: "Asia/Tehran (UTC+3:30)",
  lang:     "فارسی",
};

interface Session {
  id:      string;
  device:  string;
  browser: string;
  ip:      string;
  region:  string;
  lastSeen:string;
  current: boolean;
}

const SESSIONS: Session[] = [
  { id: "s1", device: "MacBook Pro 14″",   browser: "Chrome 124",     ip: "185.94.97.211", region: "تهران",    lastSeen: "همین الان",       current: true  },
  { id: "s2", device: "iPhone 15 Pro",      browser: "Safari Mobile",  ip: "185.94.97.212", region: "تهران",    lastSeen: "۲ ساعت پیش",      current: false },
  { id: "s3", device: "Windows 11 Desktop", browser: "Firefox 125",    ip: "5.63.14.88",    region: "اصفهان",   lastSeen: "دیروز ۲۲:۱۰",     current: false },
  { id: "s4", device: "Ubuntu 22.04",       browser: "Chromium 123",   ip: "78.39.22.55",   region: "مشهد",     lastSeen: "۳ روز پیش",       current: false },
];

interface ApiToken {
  id:      string;
  name:    string;
  prefix:  string;
  scopes:  string[];
  created: string;
  lastUsed:string;
  expires: string | null;
}

const API_TOKENS: ApiToken[] = [
  { id: "t1", name: "CI/CD Pipeline",      prefix: "pk_prod_4f2a",  scopes: ["servers:read","servers:write","volumes:read"], created: "۱۴۰۴/۱۲/۰۱", lastUsed: "۱ ساعت پیش",  expires: null             },
  { id: "t2", name: "Monitoring Agent",    prefix: "pk_prod_8c91",  scopes: ["metrics:read","alerts:read"],                  created: "۱۴۰۴/۱۰/۱۵", lastUsed: "۵ دقیقه پیش", expires: null             },
  { id: "t3", name: "Terraform Provider",  prefix: "pk_prod_2d77",  scopes: ["*:read","*:write"],                            created: "۱۴۰۴/۰۸/۲۰", lastUsed: "دیروز",        expires: "۱۴۰۵/۰۸/۲۰"  },
  { id: "t4", name: "Local Dev (expired)", prefix: "pk_dev_aa33",   scopes: ["servers:read"],                                created: "۱۴۰۴/۰۱/۰۱", lastUsed: "۴ ماه پیش",   expires: "۱۴۰۴/۰۷/۰۱"  },
];

/* ─── helpers ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-16 p-20">
      <h2 className="text-[14px] font-semibold text-text-main mb-16 pb-12 border-b border-border">{title}</h2>
      {children}
    </div>
  );
}

function InputRow({ label, value, type = "text", disabled = false }: { label: string; value: string; type?: string; disabled?: boolean }) {
  const [val, setVal] = useState(value);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-0">
      <label className="text-[12px] text-text-muted sm:w-[160px] shrink-0">{label}</label>
      <input
        type={type}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        disabled={disabled}
        className={`flex-1 px-12 py-8 rounded-8 border border-border bg-bg text-[13px] text-text-main outline-none focus:border-brand transition-colors
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

/* ─── component ─── */
export default function ProfilePage() {
  const [tab, setTab]             = useState<"info" | "security" | "tokens" | "sessions">("info");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [revoking,   setRevoking]   = useState<string | null>(null);
  const [tokens, setTokens]         = useState<ApiToken[]>(API_TOKENS);
  const [sessions, setSessions]     = useState<Session[]>(SESSIONS);

  const revokeToken  = (id: string) => { setRevoking(null); setTokens((t) => t.filter((x) => x.id !== id)); };
  const revokeSession= (id: string) => setSessions((s) => s.filter((x) => x.id !== id));

  const tabClass = (t: typeof tab) =>
    `px-14 py-8 rounded-8 text-[13px] font-medium transition-all
     ${tab === t ? "bg-brand text-white" : "border border-border text-text-muted hover:text-text-main"}`;

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">

      {/* ── profile header ── */}
      <div className="glass rounded-16 p-20">
        <div className="flex items-center gap-20">
          <div className="w-64 h-64 rounded-999 bg-brand flex items-center justify-center text-white text-[24px] font-bold shrink-0">
            {USER.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-bold text-text-main">{USER.name}</h1>
            <p className="text-[13px] text-text-muted mt-2">{USER.email} · {USER.role}</p>
            <p className="text-[11px] text-text-muted mt-4">{USER.company} · عضو از {USER.joined}</p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <span className="px-10 py-4 rounded-6 bg-brand/10 text-brand text-[11px] font-semibold">{USER.role}</span>
            <span className="text-[11px] text-text-muted">{USER.timezone}</span>
          </div>
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 mt-16">
          {[
            { label: "نشست‌های فعال",   value: sessions.length,                         color: "#2554d8" },
            { label: "توکن‌های API",     value: tokens.filter((t) => !t.expires || t.expires > "۱۴۰۵").length, color: "#16a34a" },
            { label: "احراز دو مرحله‌ای", value: mfaEnabled ? "فعال" : "غیرفعال",       color: mfaEnabled ? "#16a34a" : "#dc2626" },
            { label: "دسترسی اخیر",     value: "همین الان",                              color: "#64748b" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[18px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── tabs ── */}
      <div className="flex gap-8 flex-wrap">
        <button className={tabClass("info")}     onClick={() => setTab("info")}>اطلاعات شخصی</button>
        <button className={tabClass("security")} onClick={() => setTab("security")}>امنیت</button>
        <button className={tabClass("tokens")}   onClick={() => setTab("tokens")}>توکن‌های API</button>
        <button className={tabClass("sessions")} onClick={() => setTab("sessions")}>نشست‌های فعال</button>
      </div>

      {/* ── tab: info ── */}
      {tab === "info" && (
        <Section title="اطلاعات شخصی">
          <div className="flex flex-col gap-14">
            <InputRow label="نام کامل"           value={USER.name}     />
            <InputRow label="ایمیل"              value={USER.email}    type="email" />
            <InputRow label="شماره موبایل"       value={USER.phone}    type="tel" />
            <InputRow label="نام شرکت"           value={USER.company}  />
            <InputRow label="نقش"                value={USER.role}     disabled />
            <InputRow label="منطقه زمانی"        value={USER.timezone} disabled />

            <div className="flex items-center gap-6 pt-4">
              <label className="text-[12px] text-text-muted sm:w-[160px] shrink-0">زبان پنل</label>
              <select className="flex-1 px-12 py-8 rounded-8 border border-border bg-bg text-[13px] text-text-main outline-none focus:border-brand">
                <option>فارسی</option>
                <option>English</option>
              </select>
            </div>

            <div className="flex justify-end pt-8 border-t border-border">
              <button className="px-20 py-9 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand/90 transition-colors">
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </Section>
      )}

      {/* ── tab: security ── */}
      {tab === "security" && (
        <div className="flex flex-col gap-16">
          <Section title="تغییر رمز عبور">
            <div className="flex flex-col gap-14">
              <InputRow label="رمز عبور فعلی"   value="" type="password" />
              <InputRow label="رمز عبور جدید"   value="" type="password" />
              <InputRow label="تکرار رمز جدید"  value="" type="password" />
              <div className="flex justify-end pt-4 border-t border-border">
                <button className="px-20 py-9 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand/90 transition-colors">
                  تغییر رمز
                </button>
              </div>
            </div>
          </Section>

          <Section title="احراز هویت دو مرحله‌ای (2FA)">
            <div className="flex items-center justify-between gap-16">
              <div>
                <p className="text-[13px] text-text-main font-medium">احراز هویت دو مرحله‌ای</p>
                <p className="text-[12px] text-text-muted mt-4">
                  با فعال‌سازی 2FA، در هر ورود علاوه بر رمز عبور، کد تأیید از اپ احراز هویت درخواست می‌شود.
                </p>
              </div>
              <div className="flex items-center gap-10 shrink-0">
                <span className={`text-[12px] font-medium ${mfaEnabled ? "text-green-600" : "text-red-600"}`}>
                  {mfaEnabled ? "فعال" : "غیرفعال"}
                </span>
                <button
                  onClick={() => setMfaEnabled((v) => !v)}
                  className={`relative w-44 h-24 rounded-999 transition-colors
                    ${mfaEnabled ? "bg-brand" : "bg-border"}`}
                >
                  <span
                    className={`absolute top-3 w-18 h-18 rounded-999 bg-white shadow transition-all
                      ${mfaEnabled ? "right-3" : "left-3"}`}
                  />
                </button>
              </div>
            </div>
            {mfaEnabled && (
              <div className="mt-14 p-14 rounded-10 bg-green-50 border border-green-200 text-[12px] text-green-700">
                احراز دو مرحله‌ای فعال است. کدهای پشتیبان را در جای امن نگه دارید.
              </div>
            )}
          </Section>
        </div>
      )}

      {/* ── tab: tokens ── */}
      {tab === "tokens" && (
        <Section title="توکن‌های API">
          <div className="flex justify-end mb-14">
            <button className="px-16 py-8 rounded-8 bg-brand text-white text-[12px] font-medium hover:bg-brand/90 transition-colors">
              + توکن جدید
            </button>
          </div>
          <div className="flex flex-col gap-10">
            {tokens.map((tk) => {
              const expired = tk.expires && tk.expires < "۱۴۰۵/۰۳";
              return (
                <div key={tk.id} className={`rounded-12 border p-16 ${expired ? "opacity-60 bg-slate-50 border-slate-200" : "glass border-border"}`}>
                  <div className="flex items-start justify-between gap-12">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-10 flex-wrap">
                        <p className="text-[13px] font-semibold text-text-main">{tk.name}</p>
                        {expired && <span className="px-7 py-2 rounded-5 bg-red-100 text-red-700 text-[11px] font-medium">منقضی</span>}
                      </div>
                      <p className="text-[11px] text-text-muted mt-4 ltr-text font-mono" style={{ direction: "ltr" }}>
                        {tk.prefix}••••••••••••••••
                      </p>
                    </div>
                    {revoking === tk.id ? (
                      <div className="flex gap-6">
                        <button onClick={() => revokeToken(tk.id)} className="px-10 py-5 rounded-6 bg-red-600 text-white text-[11px] font-medium">تأیید حذف</button>
                        <button onClick={() => setRevoking(null)}  className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px]">انصراف</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRevoking(tk.id)}
                        className="px-10 py-5 rounded-6 border border-red-200 text-red-600 text-[11px] hover:bg-red-50 transition-colors"
                      >حذف</button>
                    )}
                  </div>

                  <div className="mt-10 flex flex-wrap gap-6">
                    {tk.scopes.map((sc) => (
                      <span key={sc} className="px-7 py-2 rounded-5 bg-brand/10 text-brand text-[10px] font-mono">{sc}</span>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap gap-x-16 gap-y-2 text-[11px] text-text-muted">
                    <span>ایجاد: {tk.created}</span>
                    <span>آخرین استفاده: {tk.lastUsed}</span>
                    {tk.expires && <span>انقضا: {tk.expires}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ── tab: sessions ── */}
      {tab === "sessions" && (
        <Section title="نشست‌های فعال">
          <div className="flex flex-col gap-10">
            {sessions.map((s) => (
              <div key={s.id} className={`rounded-12 border p-16 flex items-center gap-14 ${s.current ? "border-brand/30 bg-brand/3" : "glass border-border"}`}>
                {/* device icon */}
                <div className="w-40 h-40 rounded-10 bg-bg flex items-center justify-center text-[20px] text-text-muted shrink-0">
                  {s.device.includes("iPhone") ? "◎" : s.device.includes("Windows") || s.device.includes("Ubuntu") ? "◻" : "◱"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-8 flex-wrap">
                    <p className="text-[13px] font-semibold text-text-main">{s.device}</p>
                    {s.current && <span className="px-7 py-2 rounded-5 bg-green-100 text-green-700 text-[10px] font-medium">نشست جاری</span>}
                  </div>
                  <p className="text-[11px] text-text-muted mt-3">{s.browser}</p>
                  <div className="flex flex-wrap gap-x-12 gap-y-1 mt-4 text-[11px] text-text-muted">
                    <span className="ltr-text" style={{ direction: "ltr" }}>{s.ip}</span>
                    <span>{s.region}</span>
                    <span>{s.lastSeen}</span>
                  </div>
                </div>

                {!s.current && (
                  <button
                    onClick={() => revokeSession(s.id)}
                    className="px-10 py-6 rounded-8 border border-red-200 text-red-600 text-[11px] hover:bg-red-50 transition-colors shrink-0"
                  >پایان نشست</button>
                )}
              </div>
            ))}

            {sessions.filter((s) => !s.current).length > 0 && (
              <button
                onClick={() => setSessions((s) => s.filter((x) => x.current))}
                className="mt-4 w-full py-10 rounded-10 border border-red-200 text-red-600 text-[12px] font-medium hover:bg-red-50 transition-colors"
              >پایان همه نشست‌های دیگر</button>
            )}
          </div>
        </Section>
      )}
    </div>
  );
}
