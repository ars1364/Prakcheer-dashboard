"use client";

import Link from "next/link";

interface CatalogItem {
  id:       string;
  name:     string;
  category: string;
  desc:     string;
  icon:     string;
  plans:    number;
  popular:  boolean;
  href:     string;
}

const CATALOG: CatalogItem[] = [
  { id: "c01", name: "Virtual Machine",       category: "Compute",  desc: "سرورهای مجازی با انواع flavor",          icon: "◉", plans: 12, popular: true,  href: "/iaas/servers"       },
  { id: "c02", name: "Kubernetes Cluster",     category: "Container",desc: "کلاستر Kubernetes مدیریت‌شده",          icon: "⬡", plans: 4,  popular: true,  href: "/kubernetes/clusters"},
  { id: "c03", name: "Object Storage",         category: "Storage",  desc: "ذخیره‌سازی شیء سازگار با S3",           icon: "◫", plans: 3,  popular: true,  href: "/object-storage"     },
  { id: "c04", name: "Managed PostgreSQL",     category: "Database", desc: "پایگاه داده PostgreSQL مدیریت‌شده",     icon: "◈", plans: 5,  popular: true,  href: "/databases/instances"},
  { id: "c05", name: "Managed Redis",          category: "Database", desc: "Redis در حالت cluster/standalone",      icon: "◈", plans: 3,  popular: false, href: "/databases/instances"},
  { id: "c06", name: "Load Balancer",          category: "Network",  desc: "توزیع بار لایه ۴ و ۷",                 icon: "⊟", plans: 2,  popular: true,  href: "/iaas/load-balancers"},
  { id: "c07", name: "Container Registry",     category: "Container",desc: "رجیستری خصوصی Docker/OCI",              icon: "◫", plans: 2,  popular: false, href: "/container-registry" },
  { id: "c08", name: "Managed MongoDB",        category: "Database", desc: "MongoDB با replica set",                icon: "◈", plans: 3,  popular: false, href: "/databases/instances"},
  { id: "c09", name: "CDN",                    category: "Network",  desc: "شبکه توزیع محتوا با Edge node",        icon: "◉", plans: 3,  popular: false, href: "/cdn"                },
  { id: "c10", name: "Block Storage",          category: "Storage",  desc: "دیسک‌های NVMe/SAS قابل attach",        icon: "◱", plans: 4,  popular: false, href: "/iaas/volumes"       },
  { id: "c11", name: "DNS",                    category: "Network",  desc: "سرویس DNS با latency پایین",            icon: "◎", plans: 1,  popular: false, href: "/dns"                },
  { id: "c12", name: "VPC",                    category: "Network",  desc: "شبکه خصوصی مجازی ایزوله",             icon: "◱", plans: 1,  popular: false, href: "/vpc"                },
];

const CATEGORIES = ["همه", "Compute", "Storage", "Database", "Network", "Container"];

const CAT_COLOR: Record<string, string> = {
  Compute:   "bg-blue-50 text-brand",
  Storage:   "bg-purple-50 text-purple-700",
  Database:  "bg-green-50 text-green-700",
  Network:   "bg-amber-50 text-amber-700",
  Container: "bg-red-50 text-red-700",
};

import { useState } from "react";

export default function CatalogPage() {
  const [cat, setCat] = useState("همه");
  const items = cat === "همه" ? CATALOG : CATALOG.filter((c) => c.category === cat);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">کاتالوگ خدمات</h1>
            <p className="text-[12px] text-text-muted mt-2">سرویس‌های ابری قابل سفارش</p>
          </div>
          <div className="flex gap-8">
            <Link href="/iaas/catalog/my-requests" className="px-14 py-7 rounded-8 border border-border text-text-muted text-[12px] hover:bg-bg">درخواست‌های من</Link>
            <Link href="/iaas" className="text-[12px] text-text-muted hover:text-brand">← زیرساخت</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل خدمات",   value: CATALOG.length,                                          color: "#2554d8" },
            { label: "محبوب",      value: CATALOG.filter((c) => c.popular).length,                color: "#d97706" },
            { label: "Compute",    value: CATALOG.filter((c) => c.category === "Compute").length, color: "#2554d8" },
            { label: "Database",   value: CATALOG.filter((c) => c.category === "Database").length,color: "#16a34a" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all ${cat === c ? "bg-brand text-white" : "border border-border text-text-muted"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
        {items.map((item) => (
          <Link key={item.id} href={item.href}
            className="glass rounded-14 p-20 border border-border hover:border-brand/40 transition-colors flex flex-col gap-12">
            <div className="flex items-start justify-between">
              <div className="w-40 h-40 rounded-10 bg-brand-light flex items-center justify-center text-brand text-[18px]">{item.icon}</div>
              <div className="flex gap-6 items-center">
                {item.popular && <span className="px-7 py-2 rounded-5 bg-amber-100 text-amber-700 text-[10px] font-bold">محبوب</span>}
                <span className={`px-7 py-2 rounded-5 text-[10px] font-medium ${CAT_COLOR[item.category] ?? "bg-slate-100 text-slate-600"}`}>{item.category}</span>
              </div>
            </div>
            <div>
              <p className="text-[14px] font-bold text-text-main mb-4">{item.name}</p>
              <p className="text-[12px] text-text-muted leading-relaxed">{item.desc}</p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-10 border-t border-border">
              <span className="text-[11px] text-text-muted">{item.plans} پلن</span>
              <span className="text-[12px] text-brand font-medium">مشاهده ←</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
