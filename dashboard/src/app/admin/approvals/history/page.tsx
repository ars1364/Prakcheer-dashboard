"use client";

import Link from "next/link";

const HISTORY = [
  { id: "h01", ts: "۱۴۰۵/۰۳/۰۷ ۱۰:۴۵", tenant: "شرکت نوآوری",   type: "افزایش سهمیه CPU",  resource: "۲۰→۴۰ vCPU",  actor: "a.sarkhail", result: "approved", note: "" },
  { id: "h02", ts: "۱۴۰۵/۰۳/۰۶ ۱۵:۳۰", tenant: "فروشگاه بام",    type: "ارتقای پلن",        resource: "Basic→Pro",    actor: "a.sarkhail", result: "approved", note: "" },
  { id: "h03", ts: "۱۴۰۵/۰۳/۰۶ ۱۲:۰۰", tenant: "موسسه نور",      type: "دسترسی سرویس",     resource: "K8s Starter",  actor: "a.sarkhail", result: "rejected", note: "عدم تکمیل مستندات قرارداد" },
  { id: "h04", ts: "۱۴۰۵/۰۳/۰۵ ۱۶:۲۰", tenant: "کلینیک مهر",     type: "ایجاد پروژه",       resource: "پروژه stage",  actor: "a.sarkhail", result: "approved", note: "" },
  { id: "h05", ts: "۱۴۰۵/۰۳/۰۵ ۰۹:۱۵", tenant: "سازمان پژوهش",  type: "افزایش Object Storage","resource": "۱۰→۲۰ TB", actor: "system",     result: "approved", note: "تأیید خودکار — پلن Enterprise" },
];

export default function ApprovalsHistoryPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[18px] font-bold text-text-main">تاریخچه تأییدیه‌ها</h1>
          <div className="flex gap-8">
            <Link href="/admin/approvals/pending"  className="text-[12px] text-brand hover:underline">در انتظار →</Link>
            <Link href="/admin/approvals/policies" className="text-[12px] text-brand hover:underline">سیاست‌ها →</Link>
            <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← ادمین</Link>
          </div>
        </div>
      </div>
      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">زمان</th>
              <th className="text-start py-12 font-medium">مستاجر</th>
              <th className="text-start py-12 font-medium">نوع</th>
              <th className="text-start py-12 font-medium">منبع</th>
              <th className="text-start py-12 font-medium">توسط</th>
              <th className="text-start py-12 font-medium">نتیجه</th>
              <th className="text-start py-12 font-medium">یادداشت</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((h) => (
              <tr key={h.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-10 text-text-muted ltr-text text-[11px]" style={{ direction: "ltr" }}>{h.ts}</td>
                <td className="py-10 text-text-main font-medium">{h.tenant}</td>
                <td className="py-10 text-text-muted">{h.type}</td>
                <td className="py-10 text-text-muted">{h.resource}</td>
                <td className="py-10 font-mono text-[11px] text-text-muted ltr-text" style={{ direction: "ltr" }}>{h.actor}</td>
                <td className="py-10">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${h.result === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {h.result === "approved" ? "تأییدشده" : "ردشده"}
                  </span>
                </td>
                <td className="py-10 text-text-muted max-w-[200px] truncate">{h.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
