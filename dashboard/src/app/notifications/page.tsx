"use client";

import { useState, useMemo } from "react";

/* ─── types ─── */
type NType     = "هشدار" | "رویداد" | "صورتحساب" | "امنیت" | "سیستم" | "بروزرسانی";
type NSeverity = "critical" | "high" | "medium" | "low" | "info";

interface Notification {
  id:       string;
  ts:       string;        // Farsi datetime
  age:      string;        // relative label
  type:     NType;
  severity: NSeverity;
  title:    string;
  body:     string;
  read:     boolean;
  resource?: string;
  region?:  string;
  actionLabel?: string;
  actionHref?:  string;
}

/* ─── mock data ─── */
const ALL_NOTIFS: Notification[] = [
  {
    id: "n01", ts: "۱۴۰۵/۰۳/۰۷ ۱۳:۴۵", age: "۱۵ دقیقه پیش",
    type: "هشدار", severity: "critical", read: false,
    title: "CPU سرور web-prod-01 از آستانه گذشت",
    body: "میانگین CPU سرور web-prod-01 در تهران-۱ طی ۵ دقیقه اخیر به ۹۴٪ رسید. بررسی فوری توصیه می‌شود.",
    resource: "web-prod-01", region: "تهران-۱",
    actionLabel: "مشاهده سرور", actionHref: "/iaas/servers",
  },
  {
    id: "n02", ts: "۱۴۰۵/۰۳/۰۷ ۱۳:۲۲", age: "۳۸ دقیقه پیش",
    type: "امنیت", severity: "high", read: false,
    title: "تلاش ورود ناموفق مکرر به پنل",
    body: "۱۲ تلاش ورود ناموفق از IP 91.211.44.12 طی ۱۰ دقیقه. دسترسی این IP به صورت موقت مسدود شد.",
    resource: "IAM / احراز هویت", region: "—",
    actionLabel: "مشاهده گزارش امنیتی", actionHref: "/security",
  },
  {
    id: "n03", ts: "۱۴۰۵/۰۳/۰۷ ۱۲:۵۵", age: "۱ ساعت پیش",
    type: "صورتحساب", severity: "medium", read: false,
    title: "هزینه ماهانه به ۸۵٪ بودجه رسید",
    body: "هزینه جاری ماه تا کنون ۱۲٬۷۵۰٬۰۰۰ تومان است که معادل ۸۵٪ بودجه تعیین‌شده می‌باشد. در صورت ادامه روند فعلی تا پایان ماه ۱۵٬۰۰۰٬۰۰۰ تومان خواهد بود.",
    resource: "بودجه ماهانه",
    actionLabel: "مشاهده هزینه‌ها", actionHref: "/cost-explorer",
  },
  {
    id: "n04", ts: "۱۴۰۵/۰۳/۰۷ ۱۲:۳۰", age: "۱.۵ ساعت پیش",
    type: "رویداد", severity: "info", read: true,
    title: "اسنپ‌شات خودکار هفتگی ایجاد شد",
    body: "اسنپ‌شات snap-db-weekly با موفقیت برای ۳ دیسک در مشهد-۱ ایجاد شد. حجم: ۲۴.۳ GB.",
    resource: "snap-db-weekly", region: "مشهد-۱",
    actionLabel: "مشاهده اسنپ‌شات‌ها", actionHref: "/iaas/snapshots",
  },
  {
    id: "n05", ts: "۱۴۰۵/۰۳/۰۷ ۱۱:۴۸", age: "۲ ساعت پیش",
    type: "هشدار", severity: "medium", read: true,
    title: "دیسک data-vol-12 خطای I/O گزارش داد",
    body: "دیسک data-vol-12 در اصفهان-۱ ۱۴ خطای I/O طی ۳۰ دقیقه ثبت کرد. ممکن است نیاز به جایگزینی باشد.",
    resource: "data-vol-12", region: "اصفهان-۱",
    actionLabel: "مشاهده دیسک‌ها", actionHref: "/iaas/volumes",
  },
  {
    id: "n06", ts: "۱۴۰۵/۰۳/۰۷ ۱۱:۱۰", age: "۲.۵ ساعت پیش",
    type: "سیستم", severity: "info", read: true,
    title: "بروزرسانی Kubernetes 1.29.4 در دسترس",
    body: "نسخه جدید ۱.۲۹.۴ برای کلاسترهای Kubernetes در دسترس است. این نسخه شامل رفع مشکلات امنیتی CVE-2024-xxxx می‌باشد.",
    resource: "prod-main, staging",
    actionLabel: "مشاهده کلاسترها", actionHref: "/kubernetes",
  },
  {
    id: "n07", ts: "۱۴۰۵/۰۳/۰۷ ۱۰:۳۵", age: "۳ ساعت پیش",
    type: "امنیت", severity: "medium", read: true,
    title: "کلید SSH با تاریخ انقضای نزدیک",
    body: "کلید SSH با نام dev-laptop-key تا ۷ روز دیگر منقضی می‌شود. برای جلوگیری از قطع دسترسی، کلید جدید اضافه کنید.",
    resource: "dev-laptop-key",
    actionLabel: "مدیریت کلیدهای SSH", actionHref: "/ssh-keys",
  },
  {
    id: "n08", ts: "۱۴۰۵/۰۳/۰۷ ۰۹:۰۰", age: "۵ ساعت پیش",
    type: "صورتحساب", severity: "info", read: true,
    title: "فاکتور اردیبهشت ۱۴۰۵ آماده است",
    body: "فاکتور ماه اردیبهشت ۱۴۰۵ به مبلغ ۱۱٬۲۰۰٬۰۰۰ تومان صادر شده و در پنل بخش صورتحساب قابل دریافت است.",
    actionLabel: "مشاهده صورتحساب", actionHref: "/billing",
  },
  {
    id: "n09", ts: "۱۴۰۵/۰۳/۰۷ ۰۷:۳۰", age: "۶.۵ ساعت پیش",
    type: "رویداد", severity: "info", read: true,
    title: "پشتیبان‌گیری شبانه با موفقیت انجام شد",
    body: "پشتیبان‌گیری برنامه‌ریزی‌شده از ۵ سرور و ۳ پایگاه داده در تهران-۱ کامل شد. مجموع: ۱۱۲.۵ GB.",
    region: "تهران-۱",
    actionLabel: "مشاهده پشتیبان‌ها", actionHref: "/backup",
  },
  {
    id: "n10", ts: "۱۴۰۵/۰۳/۰۶ ۲۳:۱۵", age: "دیروز",
    type: "بروزرسانی", severity: "info", read: true,
    title: "پلتفرم: بروزرسانی نسخه ۳.۲.۱ اعمال شد",
    body: "بروزرسانی پلتفرم با موفقیت اعمال شد. قابلیت‌های جدید: مدیریت VPC پیشرفته، بهبود API Gateway و پشتیبانی از IPv6.",
    actionLabel: "مشاهده تغییرات", actionHref: "/settings",
  },
  {
    id: "n11", ts: "۱۴۰۵/۰۳/۰۶ ۱۸:۴۰", age: "دیروز",
    type: "هشدار", severity: "low", read: true,
    title: "پهنای باند CDN zone-eu-central نزدیک به محدودیت",
    body: "مصرف پهنای باند CDN zone-eu-central به ۷۸٪ سقف ماهانه رسید. در صورت نیاز سقف را افزایش دهید.",
    resource: "zone-eu-central",
    actionLabel: "مشاهده CDN", actionHref: "/cdn",
  },
  {
    id: "n12", ts: "۱۴۰۵/۰۳/۰۶ ۱۴:۰۰", age: "دیروز",
    type: "سیستم", severity: "info", read: true,
    title: "منطقه مشهد-۱: تعمیرات برنامه‌ریزی‌شده",
    body: "تعمیرات شبکه در مشهد-۱ فردا ۱۵ خرداد از ساعت ۰۲:۰۰ تا ۰۴:۰۰ انجام می‌شود. ممکن است وقفه کوتاهی وجود داشته باشد.",
    region: "مشهد-۱",
  },
];

/* ─── helpers ─── */
const SEV_COLOR: Record<NSeverity, string> = {
  critical: "#dc2626",
  high:     "#ea580c",
  medium:   "#d97706",
  low:      "#2554d8",
  info:     "#64748b",
};

const SEV_BG: Record<NSeverity, string> = {
  critical: "bg-red-100 text-red-700",
  high:     "bg-orange-100 text-orange-700",
  medium:   "bg-amber-100 text-amber-700",
  low:      "bg-blue-100 text-brand",
  info:     "bg-slate-100 text-slate-600",
};

const SEV_LABEL: Record<NSeverity, string> = {
  critical: "بحرانی",
  high:     "بالا",
  medium:   "متوسط",
  low:      "پایین",
  info:     "اطلاع",
};

const TYPE_ICON: Record<NType, string> = {
  "هشدار":      "◭",
  "رویداد":     "◉",
  "صورتحساب":  "◈",
  "امنیت":      "◨",
  "سیستم":      "◻",
  "بروزرسانی": "◎",
};

const TYPE_COLOR: Record<NType, string> = {
  "هشدار":      "#dc2626",
  "رویداد":     "#2554d8",
  "صورتحساب":  "#d97706",
  "امنیت":      "#7c3aed",
  "سیستم":      "#64748b",
  "بروزرسانی": "#16a34a",
};

const ALL_TYPES: NType[] = ["هشدار", "رویداد", "صورتحساب", "امنیت", "سیستم", "بروزرسانی"];
const ALL_SEVS: NSeverity[] = ["critical", "high", "medium", "low", "info"];

/* ─── component ─── */
export default function NotificationsPage() {
  const [filterType, setFilterType]       = useState<NType | "همه">("همه");
  const [filterSev,  setFilterSev]        = useState<NSeverity | "همه">("همه");
  const [showUnread, setShowUnread]       = useState(false);
  const [expanded,   setExpanded]         = useState<string | null>(null);
  const [readSet,    setReadSet]          = useState<Set<string>>(
    () => new Set(ALL_NOTIFS.filter((n) => n.read).map((n) => n.id))
  );

  const markRead   = (id: string) => setReadSet((s) => new Set([...s, id]));
  const markAllRead = () => setReadSet(new Set(ALL_NOTIFS.map((n) => n.id)));

  const filtered = useMemo(() => ALL_NOTIFS.filter((n) => {
    if (filterType !== "همه" && n.type !== filterType) return false;
    if (filterSev  !== "همه" && n.severity !== filterSev) return false;
    if (showUnread && readSet.has(n.id)) return false;
    return true;
  }), [filterType, filterSev, showUnread, readSet]);

  const unreadCount = ALL_NOTIFS.filter((n) => !readSet.has(n.id)).length;

  /* segmented bar: unread per type */
  const typeCounts = ALL_TYPES.map((t) => ({
    type: t, count: ALL_NOTIFS.filter((n) => n.type === t && !readSet.has(n.id)).length,
  })).filter((t) => t.count > 0);
  const totalUnread = typeCounts.reduce((a, t) => a + t.count, 0);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">

      {/* ── header ── */}
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div className="flex items-center gap-12">
            <h1 className="text-[18px] font-bold text-text-main">اعلان‌ها</h1>
            {unreadCount > 0 && (
              <span className="px-8 py-3 rounded-999 bg-brand text-white text-[11px] font-bold">{unreadCount} جدید</span>
            )}
          </div>
          <button
            onClick={markAllRead}
            className="text-[12px] text-brand hover:underline disabled:text-text-muted disabled:no-underline disabled:cursor-default"
            disabled={unreadCount === 0}
          >همه را خواندم</button>
        </div>

        {/* unread segmented bar */}
        {totalUnread > 0 ? (
          <>
            <div className="flex h-10 rounded-999 overflow-hidden gap-1 mb-8">
              {typeCounts.map((t) => (
                <div
                  key={t.type}
                  style={{ width: `${(t.count / totalUnread) * 100}%`, background: TYPE_COLOR[t.type] }}
                  className="h-full"
                  title={`${t.type}: ${t.count}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-14 gap-y-4 mb-16">
              {typeCounts.map((t) => (
                <span key={t.type} className="flex items-center gap-5 text-[11px] text-text-muted">
                  <span className="w-7 h-7 rounded-2" style={{ background: TYPE_COLOR[t.type] }} />
                  {t.type}: {t.count}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-8 mb-16 text-[12px] text-green-600 bg-green-50 rounded-8 px-12 py-8 w-fit">
            <span>✓</span><span>همه اعلان‌ها خوانده شده‌اند</span>
          </div>
        )}

        {/* stat tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل اعلان‌ها",    value: ALL_NOTIFS.length,                                   color: "#64748b" },
            { label: "خوانده‌نشده",    value: unreadCount,                                          color: unreadCount > 0 ? "#2554d8" : "#16a34a" },
            { label: "بحرانی / بالا",  value: ALL_NOTIFS.filter((n) => n.severity === "critical" || n.severity === "high").length, color: "#dc2626" },
            { label: "امنیت",          value: ALL_NOTIFS.filter((n) => n.type === "امنیت").length,   color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── filters ── */}
      <div className="glass rounded-16 p-16 flex flex-wrap items-center gap-12">
        {/* type filter */}
        <div className="flex gap-4 flex-wrap">
          {(["همه", ...ALL_TYPES] as (NType | "همه")[]).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all
                ${filterType === t ? "bg-brand text-white" : "border border-border text-text-muted hover:text-text-main"}`}
            >{t}</button>
          ))}
        </div>

        <div className="h-20 w-px bg-border mx-4 hidden sm:block" />

        {/* severity filter */}
        <div className="flex gap-4 flex-wrap">
          {(["همه", ...ALL_SEVS] as (NSeverity | "همه")[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterSev(s)}
              className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all
                ${filterSev === s
                  ? "bg-brand text-white"
                  : "border border-border text-text-muted hover:text-text-main"}`}
            >{s === "همه" ? "همه شدت‌ها" : SEV_LABEL[s]}</button>
          ))}
        </div>

        <div className="ms-auto flex items-center gap-8">
          <button
            onClick={() => setShowUnread((v) => !v)}
            className={`flex items-center gap-6 px-12 py-6 rounded-8 text-[12px] font-medium transition-all border
              ${showUnread ? "bg-brand text-white border-brand" : "border-border text-text-muted hover:text-text-main"}`}
          >
            <span className={`w-8 h-8 rounded-2 ${showUnread ? "bg-white" : "bg-brand"}`} />
            فقط خوانده‌نشده
          </button>
          <span className="text-[12px] text-text-muted">{filtered.length} اعلان</span>
        </div>
      </div>

      {/* ── notification list ── */}
      <div className="flex flex-col gap-8">
        {filtered.length === 0 ? (
          <div className="glass rounded-16 p-40 text-center text-text-muted text-[13px]">
            هیچ اعلانی با فیلترهای انتخابی یافت نشد
          </div>
        ) : (
          filtered.map((n) => {
            const isRead = readSet.has(n.id);
            const isExp  = expanded === n.id;
            return (
              <div
                key={n.id}
                className={`glass rounded-16 border transition-all ${
                  !isRead ? "border-brand/30 bg-brand/3" : "border-transparent"
                }`}
              >
                {/* main row */}
                <div
                  className="flex items-start gap-14 p-16 cursor-pointer"
                  onClick={() => {
                    setExpanded(isExp ? null : n.id);
                    if (!isRead) markRead(n.id);
                  }}
                >
                  {/* icon */}
                  <div
                    className="w-36 h-36 rounded-10 flex items-center justify-center shrink-0 mt-1"
                    style={{ background: TYPE_COLOR[n.type] + "18" }}
                  >
                    <span className="text-[18px]" style={{ color: TYPE_COLOR[n.type] }}>{TYPE_ICON[n.type]}</span>
                  </div>

                  {/* content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-8 mb-4">
                      <p className={`text-[13px] font-semibold ${!isRead ? "text-text-main" : "text-text-main/80"}`}>
                        {n.title}
                      </p>
                      {!isRead && (
                        <span className="w-7 h-7 rounded-999 bg-brand shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-8 text-[11px]">
                      <span className={`px-7 py-2 rounded-5 font-medium ${SEV_BG[n.severity]}`}>{SEV_LABEL[n.severity]}</span>
                      <span className="px-7 py-2 rounded-5 font-medium bg-slate-100 text-slate-600">{n.type}</span>
                      {n.resource && <span className="text-text-muted ltr-text" style={{ direction: "ltr" }}>{n.resource}</span>}
                      {n.region   && <span className="text-text-muted">{n.region}</span>}
                    </div>
                  </div>

                  {/* meta */}
                  <div className="flex flex-col items-end gap-6 shrink-0">
                    <span className="text-[11px] text-text-muted">{n.age}</span>
                    <span className={`text-[11px] transition-transform duration-150 text-text-muted ${isExp ? "rotate-180" : ""}`}>▾</span>
                  </div>
                </div>

                {/* expanded detail */}
                {isExp && (
                  <div className="px-16 pb-16 border-t border-border/50 pt-14">
                    <p className="text-[12px] text-text-main leading-[1.7] mb-14">{n.body}</p>
                    <div className="flex flex-wrap items-center gap-10">
                      <span className="text-[11px] text-text-muted ltr-text" style={{ direction: "ltr" }}>{n.ts}</span>
                      {n.actionLabel && n.actionHref && (
                        <a
                          href={n.actionHref}
                          className="ms-auto px-14 py-7 rounded-8 bg-brand text-white text-[12px] font-medium hover:bg-brand/90 transition-colors"
                        >{n.actionLabel} →</a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
