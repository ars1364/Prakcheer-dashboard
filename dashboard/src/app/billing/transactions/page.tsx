"use client";

import Link from "next/link";

interface Transaction {
  id:     string;
  type:   "charge" | "payment" | "refund" | "credit" | "adjustment";
  desc:   string;
  amount: number;
  ts:     string;
  ref:    string | null;
}

const TXS: Transaction[] = [
  { id: "tx001", type: "payment",    desc: "پرداخت فاکتور اردیبهشت",    amount: -2840000, ts: "۱۴۰۵/۰۲/۰۵ ۱۱:۳۰", ref: "inv-2405-0014" },
  { id: "tx002", type: "charge",     desc: "مصرف compute — اردیبهشت",   amount:  2840000, ts: "۱۴۰۵/۰۲/۰۱ ۰۰:۰۰", ref: "inv-2405-0014" },
  { id: "tx003", type: "credit",     desc: "اعتبار تبلیغاتی",           amount: -200000,  ts: "۱۴۰۵/۰۱/۲۸ ۱۴:۲۰", ref: null             },
  { id: "tx004", type: "payment",    desc: "پرداخت فاکتور فروردین",     amount: -2640000, ts: "۱۴۰۵/۰۱/۱۰ ۰۹:۱۵", ref: "inv-2404-0013" },
  { id: "tx005", type: "charge",     desc: "مصرف compute — فروردین",    amount:  2640000, ts: "۱۴۰۵/۰۱/۰۱ ۰۰:۰۰", ref: "inv-2404-0013" },
  { id: "tx006", type: "refund",     desc: "بازگشت هزینه outage",        amount: -180000,  ts: "۱۴۰۴/۱۲/۲۵ ۱۶:۰۰", ref: "INC-0044"      },
  { id: "tx007", type: "adjustment", desc: "تصحیح نرخ ارز",             amount:  50000,   ts: "۱۴۰۴/۱۲/۱۵ ۱۰:۳۰", ref: null             },
  { id: "tx008", type: "payment",    desc: "پرداخت فاکتور اسفند",       amount: -2400000, ts: "۱۴۰۴/۱۲/۱۰ ۱۱:۴۴", ref: "inv-2403-0012" },
];

const TYPE_COLOR: Record<string, string> = {
  charge:     "#dc2626", payment: "#16a34a", refund: "#2554d8",
  credit:     "#7c3aed", adjustment: "#64748b",
};
const TYPE_LABEL: Record<string, string> = {
  charge: "بدهکاری", payment: "پرداخت", refund: "استرداد", credit: "اعتبار", adjustment: "تعدیل",
};

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">تراکنش‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">تاریخچه تمام جابجایی‌های مالی</p>
          </div>
          <Link href="/billing/invoices" className="text-[12px] text-text-muted hover:text-brand">← فاکتورها</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل تراکنش",  value: TXS.length,                                         color: "#2554d8" },
            { label: "پرداخت",     value: TXS.filter((t) => t.type === "payment").length,     color: "#16a34a" },
            { label: "استرداد",    value: TXS.filter((t) => t.type === "refund").length,      color: "#2554d8" },
            { label: "اعتبار",     value: TXS.filter((t) => t.type === "credit").length,      color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        {TXS.map((tx, i) => (
          <div key={tx.id} className={`flex items-center gap-12 px-16 py-12 ${i < TXS.length - 1 ? "border-b border-border/50" : ""} hover:bg-bg/40`}>
            <div className="w-8 h-8 rounded-full shrink-0" style={{ background: TYPE_COLOR[tx.type] }} />
            <div className="flex-1">
              <p className="text-[12px] font-semibold text-text-main">{tx.desc}</p>
              <p className="text-[10px] text-text-muted mt-2">
                <span className="px-6 py-1 rounded-4 text-[10px]" style={{ background: `${TYPE_COLOR[tx.type]}15`, color: TYPE_COLOR[tx.type] }}>{TYPE_LABEL[tx.type]}</span>
                {tx.ref && <span className="ms-6 font-mono">{tx.ref}</span>}
              </p>
            </div>
            <div className="text-end shrink-0">
              <p className={`text-[13px] font-bold ltr-text ${tx.amount < 0 ? "text-green-600" : "text-red-600"}`} style={{ direction: "ltr" }}>
                {tx.amount < 0 ? "-" : "+"}{Math.abs(tx.amount / 10).toLocaleString()} تومان
              </p>
              <p className="text-[10px] text-text-muted mt-2">{tx.ts}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
