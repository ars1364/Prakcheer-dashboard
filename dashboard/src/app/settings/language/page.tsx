"use client";

import { useState } from "react";

const LANGUAGES = [
  { code: "fa", name: "فارسی", native: "فارسی", rtl: true,  flag: "🇮🇷" },
  { code: "en", name: "English", native: "English", rtl: false, flag: "🇺🇸" },
  { code: "ar", name: "Arabic", native: "العربية", rtl: true,  flag: "🇸🇦" },
  { code: "tr", name: "Turkish", native: "Türkçe", rtl: false, flag: "🇹🇷" },
];

const TIMEZONES = [
  "Asia/Tehran",
  "UTC",
  "Europe/Istanbul",
  "Asia/Dubai",
  "Asia/Baghdad",
];

const DATE_FORMATS = [
  { id: "jalali",    label: "شمسی (۱۴۰۵/۰۲/۰۷)" },
  { id: "gregorian", label: "میلادی (2026/04/27)" },
  { id: "hijri",     label: "قمری (۱۴۴۷/۱۰/۲۷)" },
];

export default function LanguagePage() {
  const [lang, setLang]         = useState("fa");
  const [timezone, setTimezone] = useState("Asia/Tehran");
  const [dateFormat, setDateFormat] = useState("jalali");
  const [saved, setSaved]       = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <h1 className="text-[18px] font-bold text-text-main mb-2">زبان و منطقه</h1>
        <p className="text-[12px] text-text-muted">تنظیمات زبان، منطقه زمانی و قالب تاریخ</p>
      </div>

      <div className="glass rounded-16 p-20 flex flex-col gap-20">
        <div>
          <h2 className="text-[13px] font-bold text-text-main mb-12">زبان رابط کاربری</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {LANGUAGES.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`p-14 rounded-12 border transition-all text-start ${lang === l.code ? "border-brand bg-brand/5" : "border-border hover:border-border/80"}`}>
                <div className="text-[20px] mb-6">{l.flag}</div>
                <p className="text-[13px] font-semibold text-text-main">{l.native}</p>
                <p className="text-[11px] text-text-muted mt-2">{l.name}</p>
                {l.rtl && <span className="text-[10px] text-brand">RTL</span>}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[13px] font-bold text-text-main mb-10">منطقه زمانی</h2>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} dir="ltr"
            className="px-12 py-10 rounded-8 border border-border bg-bg text-[13px] outline-none focus:border-brand w-full max-w-[300px]">
            {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
          </select>
          <p className="text-[11px] text-text-muted mt-6">زمان جاری: <span className="font-mono ltr-text">14:32:00 (UTC+3:30)</span></p>
        </div>

        <div>
          <h2 className="text-[13px] font-bold text-text-main mb-10">قالب تاریخ</h2>
          <div className="flex flex-col gap-8">
            {DATE_FORMATS.map((f) => (
              <label key={f.id} className="flex items-center gap-10 cursor-pointer">
                <input type="radio" name="dateFormat" value={f.id} checked={dateFormat === f.id}
                  onChange={() => setDateFormat(f.id)} className="accent-brand w-14 h-14" />
                <span className="text-[13px] text-text-main">{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-10 pt-4">
          <button onClick={save} className="px-18 py-9 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand/90 transition-colors">
            {saved ? "ذخیره شد ✓" : "ذخیره تنظیمات"}
          </button>
        </div>
      </div>
    </div>
  );
}
