"use client";

import Link from "next/link";

const AUDIT = [
  { id: "b01", ts: "۱۴۰۵/۰۳/۰۷ ۰۹:۰۰", type: "invoice.generate", tenant: "همه مستاجران",   amount: null,      actor: "system",     note: "فاکتور ماهانه اردیبهشت ۱۴۰۵" },
  { id: "b02", ts: "۱۴۰۵/۰۳/۰۶ ۱۴:۳۰", type: "credit.add",        tenant: "سازمان پژوهش",  amount: 5_000_000, actor: "a.sarkhail",note: "شارژ دستی حساب" },
  { id: "b03", ts: "۱۴۰۵/۰۳/۰۶ ۱۱:۱۰", type: "discount.apply",    tenant: "استارتاپ سما",  amount: -150_000,  actor: "a.sarkhail",note: "تخفیف ۱۵٪ پلن ارتقا" },
  { id: "b04", ts: "۱۴۰۵/۰۳/۰۵ ۱۶:۴۵", type: "rate.update",       tenant: "—",              amount: null,      actor: "a.sarkhail",note: "نرخ Compute تغییر کرد: ۱۲۰۰→۱۳۵۰ تومان/ساعت" },
  { id: "b05", ts: "۱۴۰۵/۰۳/۰۵ ۰۹:۰۰", type: "invoice.void",      tenant: "موسسه نور",     amount: -150_000,  actor: "a.sarkhail",note: "ابطال فاکتور تکراری" },
  { id: "b06", ts: "۱۴۰۵/۰۳/۰۴ ۱۸:۲۰", type: "payment.received",  tenant: "شرکت لجستیک",  amount: 5_700_000, actor: "gateway",   note: "پرداخت فاکتور #INV-0421" },
];

const TYPE_STYLE: Record<string, string> = {
  "invoice.generate": "bg-blue-50 text-brand",
  "credit.add":       "bg-green-50 text-green-700",
  "discount.apply":   "bg-amber-50 text-amber-700",
  "rate.update":      "bg-red-50 text-red-700",
  "invoice.void":     "bg-slate-100 text-slate-600",
  "payment.received": "bg-green-100 text-green-700",
};

export default function BillingAuditPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">حسابرسی مالی</h1>
            <p className="text-[12px] text-text-muted mt-2">رویدادهای مالی حساس: فاکتور، اعتبار، نرخ‌ها</p>
          </div>
          <div className="flex gap-8">
            <Link href="/admin/audit/platform" className="text-[12px] text-brand hover:underline">← لاگ پلتفرم</Link>
            <Link href="/admin"                className="text-[12px] text-text-muted hover:text-brand">← ادمین</Link>
          </div>
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">زمان</th>
              <th className="text-start py-12 font-medium">نوع رویداد</th>
              <th className="text-start py-12 font-medium">مستاجر</th>
              <th className="text-start py-12 font-medium">مبلغ</th>
              <th className="text-start py-12 font-medium">توسط</th>
              <th className="text-start py-12 font-medium">توضیح</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT.map((a) => (
              <tr key={a.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 text-text-muted ltr-text text-[11px]" style={{ direction: "ltr" }}>{a.ts}</td>
                <td className="py-11"><span className={`px-8 py-3 rounded-5 text-[11px] font-mono font-medium ${TYPE_STYLE[a.type]}`}>{a.type}</span></td>
                <td className="py-11 text-text-main">{a.tenant}</td>
                <td className={`py-11 font-semibold ltr-text ${a.amount ? (a.amount > 0 ? "text-green-600" : "text-red-600") : "text-text-muted"}`} style={{ direction: "ltr" }}>
                  {a.amount ? `${a.amount > 0 ? "+" : ""}${a.amount.toLocaleString()}` : "—"}
                </td>
                <td className="py-11 font-mono text-[11px] text-text-muted ltr-text" style={{ direction: "ltr" }}>{a.actor}</td>
                <td className="py-11 text-text-muted max-w-[240px]">{a.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
