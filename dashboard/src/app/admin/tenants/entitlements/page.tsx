"use client";

import Link from "next/link";

const ENTITLEMENTS = [
  { tenant: "سازمان پژوهش",   cpu: 500, ram: 2000, storage: 50000, ips: 20, vms: 100, k8sClusters: 5  },
  { tenant: "شرکت نوآوری",    cpu: 200, ram: 800,  storage: 20000, ips: 10, vms: 50,  k8sClusters: 3  },
  { tenant: "شرکت لجستیک",   cpu: 300, ram: 1200, storage: 30000, ips: 15, vms: 80,  k8sClusters: 4  },
  { tenant: "استارتاپ هوش‌مند",cpu: 80, ram: 256,  storage: 5000,  ips: 5,  vms: 20,  k8sClusters: 2  },
  { tenant: "آژانس آبان",      cpu: 80, ram: 256,  storage: 5000,  ips: 5,  vms: 20,  k8sClusters: 2  },
  { tenant: "فروشگاه بام",     cpu: 40, ram: 128,  storage: 2000,  ips: 3,  vms: 10,  k8sClusters: 0  },
  { tenant: "تیم سما",         cpu: 16, ram: 64,   storage: 1000,  ips: 2,  vms: 5,   k8sClusters: 0  },
];

const FIELDS = [
  { key: "cpu", label: "vCPU" },
  { key: "ram", label: "RAM (GB)" },
  { key: "storage", label: "Storage (GB)" },
  { key: "ips", label: "Floating IPs" },
  { key: "vms", label: "VM" },
  { key: "k8sClusters", label: "K8s Clusters" },
];

export default function TenantEntitlementsPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <h1 className="text-[18px] font-bold text-text-main">استحقاقات مستاجران</h1>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">ویرایش دسته‌جمعی</button>
            <Link href="/admin/tenants" className="text-[12px] text-text-muted hover:text-brand">← مستاجران</Link>
          </div>
        </div>
        <p className="text-[12px] text-text-muted">سقف مجاز منابع هر مستاجر (quota ceiling)</p>
      </div>
      <div className="glass rounded-16 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">مستاجر</th>
              {FIELDS.map((f) => <th key={f.key} className="text-start py-12 font-medium">{f.label}</th>)}
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {ENTITLEMENTS.map((e) => (
              <tr key={e.tenant} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-semibold text-text-main">{e.tenant}</td>
                {FIELDS.map((f) => (
                  <td key={f.key} className="py-11 font-semibold text-text-main ltr-text" style={{ direction: "ltr" }}>{(e as Record<string, unknown>)[f.key] as number}</td>
                ))}
                <td className="py-11 pe-12"><button className="px-10 py-4 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">ویرایش</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
