"use client";

import Link from "next/link";

const PLANS = [
  { id: "pl01", name: "free",       displayName: "رایگان",     price: 0,       cpu: 2,  ram: 2,  storage: 20,  vms: 2,   enabled: true  },
  { id: "pl02", name: "basic",      displayName: "پایه",        price: 500_000, cpu: 8,  ram: 16, storage: 100, vms: 5,   enabled: true  },
  { id: "pl03", name: "pro",        displayName: "حرفه‌ای",    price: 1_500_000,cpu: 32, ram: 64, storage: 500, vms: 20,  enabled: true  },
  { id: "pl04", name: "enterprise", displayName: "سازمانی",    price: null,    cpu: null,ram: null,storage: null,vms: null,enabled: true  },
];

export default function CatalogPlansPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[18px] font-bold text-text-main">پلن‌های اشتراک</h1>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ پلن جدید</button>
            <Link href="/admin/catalog/items"       className="text-[12px] text-brand hover:underline">← آیتم‌ها</Link>
            <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← ادمین</Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
        {PLANS.map((p) => (
          <div key={p.id} className="glass rounded-16 p-20">
            <p className="text-[16px] font-bold text-text-main mb-4">{p.displayName}</p>
            <p className="text-[20px] font-bold text-brand mb-14">
              {p.price === null ? "قرارداد اختصاصی" : p.price === 0 ? "رایگان" : `${p.price.toLocaleString()} ت/ماه`}
            </p>
            <div className="flex flex-col gap-6 text-[12px]">
              {[
                { label: "vCPU", value: p.cpu ?? "نامحدود" },
                { label: "RAM (GB)", value: p.ram ?? "نامحدود" },
                { label: "Storage (GB)", value: p.storage ?? "نامحدود" },
                { label: "VM", value: p.vms ?? "نامحدود" },
              ].map((s) => (
                <div key={s.label} className="flex justify-between border-b border-border pb-4">
                  <span className="text-text-muted">{s.label}</span>
                  <span className="font-semibold text-text-main">{s.value}</span>
                </div>
              ))}
            </div>
            <button className="mt-14 w-full py-8 rounded-8 border border-border text-text-muted text-[12px] hover:bg-bg transition-colors">ویرایش</button>
          </div>
        ))}
      </div>
    </div>
  );
}
