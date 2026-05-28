"use client";

import Link from "next/link";

const ITEMS = [
  { id: "ci01", name: "Instance - nano",    category: "Compute", unit: "ساعت", price: 850,   enabled: true,  plans: ["free","basic","pro","enterprise"] },
  { id: "ci02", name: "Instance - small",   category: "Compute", unit: "ساعت", price: 1_350, enabled: true,  plans: ["basic","pro","enterprise"]         },
  { id: "ci03", name: "Instance - medium",  category: "Compute", unit: "ساعت", price: 2_600, enabled: true,  plans: ["pro","enterprise"]                 },
  { id: "ci04", name: "Instance - large",   category: "Compute", unit: "ساعت", price: 5_100, enabled: true,  plans: ["enterprise"]                       },
  { id: "ci05", name: "Volume (HDD)",       category: "Storage", unit: "GB/ماه",price: 120,  enabled: true,  plans: ["free","basic","pro","enterprise"]  },
  { id: "ci06", name: "Volume (SSD)",       category: "Storage", unit: "GB/ماه",price: 280,  enabled: true,  plans: ["basic","pro","enterprise"]         },
  { id: "ci07", name: "Object Storage",     category: "Storage", unit: "GB/ماه",price: 80,   enabled: true,  plans: ["all"]                              },
  { id: "ci08", name: "Floating IP",        category: "Network", unit: "ماه",   price: 45_000,enabled: true, plans: ["basic","pro","enterprise"]         },
  { id: "ci09", name: "Load Balancer",      category: "Network", unit: "ساعت",  price: 3_200, enabled: true, plans: ["pro","enterprise"]                 },
  { id: "ci10", name: "Kubernetes Cluster", category: "K8s",     unit: "ساعت",  price: 8_500, enabled: true, plans: ["enterprise"]                       },
];

export default function CatalogItemsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[18px] font-bold text-text-main">آیتم‌های سرویس کاتالوگ</h1>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ آیتم جدید</button>
            <Link href="/admin/catalog/plans"        className="text-[12px] text-brand hover:underline">پلن‌ها →</Link>
            <Link href="/admin/catalog/tenant-access" className="text-[12px] text-brand hover:underline">دسترسی →</Link>
            <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← ادمین</Link>
          </div>
        </div>
      </div>
      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">نام</th>
              <th className="text-start py-12 font-medium">دسته</th>
              <th className="text-start py-12 font-medium">واحد</th>
              <th className="text-start py-12 font-medium">قیمت (تومان)</th>
              <th className="text-start py-12 font-medium">پلن‌ها</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item) => (
              <tr key={item.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-semibold text-text-main">{item.name}</td>
                <td className="py-11 text-text-muted">{item.category}</td>
                <td className="py-11 text-text-muted">{item.unit}</td>
                <td className="py-11 font-semibold text-text-main ltr-text" style={{ direction: "ltr" }}>{item.price.toLocaleString()}</td>
                <td className="py-11">
                  <div className="flex flex-wrap gap-4">
                    {item.plans.map((p) => (
                      <span key={p} className="px-6 py-2 rounded-4 bg-brand/10 text-brand text-[10px]">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${item.enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                    {item.enabled ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="py-11 pe-12">
                  <button className="px-10 py-4 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">ویرایش</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
