"use client";

import { useState } from "react";
import Link from "next/link";

interface Approval {
  id:       string;
  tenant:   string;
  user:     string;
  type:     string;
  resource: string;
  detail:   string;
  ts:       string;
  priority: "critical" | "high" | "medium" | "low";
  status:   "pending" | "approved" | "rejected";
}

const APPROVALS: Approval[] = [
  { id: "ap01", tenant: "استارتاپ هوش‌مند",   user: "علی رضایی",    type: "افزایش سهمیه CPU",    resource: "۴۰ → ۸۰ vCPU",          detail: "پروژه ML-Training نیاز به CPU بیشتر دارد برای آموزش مدل.",          ts: "۲ ساعت پیش",   priority: "high",     status: "pending" },
  { id: "ap02", tenant: "آژانس دیجیتال آبان",  user: "مریم حسینی",   type: "دسترسی Kubernetes",   resource: "Enterprise Cluster",     detail: "پروژه جدید client نیاز به orchestration در مقیاس بالا دارد.",        ts: "۳ ساعت پیش",   priority: "medium",   status: "pending" },
  { id: "ap03", tenant: "پلتفرم پرداخت سپهر", user: "محمد کریمی",   type: "IP ثابت اختصاصی",     resource: "۳ IP ثابت",              detail: "برای load balancer های PCI-DSS محیط Production.",                    ts: "۵ ساعت پیش",   priority: "high",     status: "pending" },
  { id: "ap04", tenant: "سازمان پژوهش ملی",    user: "فاطمه احمدی",  type: "افزایش Object Storage","resource": "۱۰ → ۵۰ TB",           detail: "ذخیره داده‌های تحقیقاتی ژنومیک.",                                  ts: "۶ ساعت پیش",   priority: "medium",   status: "pending" },
  { id: "ap05", tenant: "شرکت لجستیک رهبان",   user: "حسین نجفی",    type: "ایجاد پروژه جدید",    resource: "پروژه Production-EU",    detail: "توسعه بین‌المللی به منطقه اروپا.",                                  ts: "دیروز ۱۵:۳۰", priority: "low",     status: "pending" },
  { id: "ap06", tenant: "تیم توسعه سما",       user: "رضا محمدی",    type: "ارتقای پلن",           resource: "Basic → Pro",            detail: "افزایش تیم و نیاز به منابع بیشتر.",                                 ts: "دیروز ۱۰:۱۵", priority: "low",     status: "pending" },
  { id: "ap07", tenant: "فروشگاه آنلاین بام",   user: "سارا میری",    type: "افزایش سهمیه RAM",    resource: "۳۲ → ۶۴ GB RAM",        detail: "peak فروش پیش از نوروز — redis و elasticsearch بیشتر نیاز دارند.", ts: "دیروز ۰۸:۴۴", priority: "critical", status: "pending" },
];

const PRIORITY_STYLE: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high:     "bg-orange-100 text-orange-700",
  medium:   "bg-amber-100 text-amber-700",
  low:      "bg-blue-50 text-brand",
};
const PRIORITY_LABEL: Record<string, string> = { critical: "بحرانی", high: "بالا", medium: "متوسط", low: "پایین" };

export default function ApprovalsPage() {
  const [items, setItems]   = useState<Approval[]>(APPROVALS);
  const [expanded, setExp]  = useState<string | null>(null);
  const [note, setNote]     = useState<Record<string, string>>({});

  const act = (id: string, action: "approved" | "rejected") => {
    setItems((prev) => prev.map((a) => a.id === id ? { ...a, status: action } : a));
  };

  const pending  = items.filter((a) => a.status === "pending");
  const resolved = items.filter((a) => a.status !== "pending");

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">درخواست‌های معلق</h1>
            <p className="text-[12px] text-text-muted mt-2">تأیید یا رد درخواست‌های مستاجران</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "در انتظار",     value: pending.length,  color: "#d97706" },
            { label: "بحرانی/بالا",  value: pending.filter((a) => a.priority === "critical" || a.priority === "high").length, color: "#dc2626" },
            { label: "تأییدشده امروز", value: resolved.filter((a) => a.status === "approved").length, color: "#16a34a" },
            { label: "ردشده امروز",   value: resolved.filter((a) => a.status === "rejected").length, color: "#64748b" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {[...pending, ...resolved].map((a) => {
          const isExp  = expanded === a.id;
          const isDone = a.status !== "pending";
          return (
            <div
              key={a.id}
              className={`glass rounded-16 border transition-all ${
                isDone ? "opacity-70 border-transparent" :
                a.priority === "critical" ? "border-red-300" :
                a.priority === "high"     ? "border-orange-200" : "border-transparent"
              }`}
            >
              <div
                className="flex items-start gap-14 p-16 cursor-pointer"
                onClick={() => setExp(isExp ? null : a.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-8 mb-6">
                    <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${PRIORITY_STYLE[a.priority]}`}>
                      {PRIORITY_LABEL[a.priority]}
                    </span>
                    <span className="text-[12px] font-semibold text-text-main">{a.type}</span>
                    <span className="text-[12px] text-text-muted">← {a.tenant}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-12 gap-y-2 text-[11px] text-text-muted">
                    <span>{a.user}</span>
                    <span className="font-mono ltr-text" style={{ direction: "ltr" }}>{a.resource}</span>
                    <span>{a.ts}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8 shrink-0">
                  {isDone ? (
                    <span className={`px-10 py-5 rounded-6 text-[11px] font-medium ${a.status === "approved" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                      {a.status === "approved" ? "تأییدشده" : "ردشده"}
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); act(a.id, "approved"); }}
                        className="px-12 py-6 rounded-8 bg-green-600 text-white text-[12px] font-medium hover:bg-green-700 transition-colors"
                      >تأیید</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); act(a.id, "rejected"); }}
                        className="px-12 py-6 rounded-8 border border-red-200 text-red-600 text-[12px] hover:bg-red-50 transition-colors"
                      >رد</button>
                    </>
                  )}
                  <span className={`text-text-muted text-[11px] transition-transform ${isExp ? "rotate-180" : ""}`}>▾</span>
                </div>
              </div>

              {isExp && (
                <div className="px-16 pb-16 border-t border-border/50 pt-14">
                  <p className="text-[12px] text-text-main leading-[1.7] mb-14">{a.detail}</p>
                  {!isDone && (
                    <div className="flex flex-col gap-8">
                      <textarea
                        rows={2}
                        placeholder="یادداشت اختیاری..."
                        value={note[a.id] ?? ""}
                        onChange={(e) => setNote((n) => ({ ...n, [a.id]: e.target.value }))}
                        className="w-full px-12 py-8 rounded-8 border border-border bg-bg text-[12px] text-text-main outline-none focus:border-brand resize-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
