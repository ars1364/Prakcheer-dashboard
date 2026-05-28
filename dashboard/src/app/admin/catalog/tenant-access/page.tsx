"use client";

import Link from "next/link";

const ACCESS = [
  { tenant: "سازمان پژوهش ملی",   plan: "enterprise", extra: ["GPU Compute","Bare Metal","50TB Object Storage"], blocked: []                },
  { tenant: "شرکت لجستیک رهبان",  plan: "enterprise", extra: ["GPU Compute"],                                    blocked: []                },
  { tenant: "استارتاپ هوش‌مند",   plan: "pro",        extra: ["K8s Enterprise"],                                 blocked: []                },
  { tenant: "آژانس دیجیتال آبان", plan: "pro",        extra: [],                                                 blocked: []                },
  { tenant: "فروشگاه آنلاین بام",  plan: "pro",        extra: [],                                                 blocked: ["Bare Metal"]    },
  { tenant: "موسسه آموزشی نور",    plan: "basic",      extra: [],                                                 blocked: ["K8s","GPU"]     },
  { tenant: "تیم توسعه سما",      plan: "basic",      extra: [],                                                 blocked: []                },
];

export default function TenantAccessPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[18px] font-bold text-text-main">دسترسی مستاجران به کاتالوگ</h1>
          <Link href="/admin/catalog/items" className="text-[12px] text-text-muted hover:text-brand">← آیتم‌ها</Link>
        </div>
      </div>
      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">مستاجر</th>
              <th className="text-start py-12 font-medium">پلن</th>
              <th className="text-start py-12 font-medium">دسترسی اضافه</th>
              <th className="text-start py-12 font-medium">محدودیت</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {ACCESS.map((a) => (
              <tr key={a.tenant} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-semibold text-text-main">{a.tenant}</td>
                <td className="py-11"><span className="px-8 py-3 rounded-5 bg-brand/10 text-brand text-[11px]">{a.plan}</span></td>
                <td className="py-11">
                  {a.extra.length ? (
                    <div className="flex flex-wrap gap-4">
                      {a.extra.map((e) => <span key={e} className="px-6 py-2 rounded-4 bg-green-50 text-green-700 text-[10px]">{e}</span>)}
                    </div>
                  ) : <span className="text-text-muted">—</span>}
                </td>
                <td className="py-11">
                  {a.blocked.length ? (
                    <div className="flex flex-wrap gap-4">
                      {a.blocked.map((b) => <span key={b} className="px-6 py-2 rounded-4 bg-red-50 text-red-700 text-[10px]">{b}</span>)}
                    </div>
                  ) : <span className="text-text-muted">—</span>}
                </td>
                <td className="py-11 pe-12"><button className="px-10 py-4 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">ویرایش</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
