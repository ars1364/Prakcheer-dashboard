"use client";

import { useState } from "react";
import Link from "next/link";

interface Hypervisor {
  id:     string;
  host:   string;
  region: string;
  az:     string;
  cpu:    { total: number; used: number };
  ram:    { total: number; used: number };
  disk:   { total: number; used: number };
  vms:    number;
  status: "up" | "down" | "maintenance";
  kernel: string;
}

const HVS: Hypervisor[] = [
  { id: "hv01", host: "compute-01.teh1", region: "تهران-۱",  az: "AZ-A", cpu: { total: 64, used: 52 },  ram: { total: 256, used: 188 }, disk: { total: 4000, used: 2800 }, vms: 24, status: "up",          kernel: "5.15.0-91" },
  { id: "hv02", host: "compute-02.teh1", region: "تهران-۱",  az: "AZ-A", cpu: { total: 64, used: 48 },  ram: { total: 256, used: 201 }, disk: { total: 4000, used: 3100 }, vms: 28, status: "up",          kernel: "5.15.0-91" },
  { id: "hv03", host: "compute-03.teh1", region: "تهران-۱",  az: "AZ-B", cpu: { total: 128, used: 96 }, ram: { total: 512, used: 390 }, disk: { total: 8000, used: 5600 }, vms: 41, status: "up",          kernel: "5.15.0-91" },
  { id: "hv04", host: "compute-04.teh1", region: "تهران-۱",  az: "AZ-B", cpu: { total: 64, used: 0 },   ram: { total: 256, used: 0 },   disk: { total: 4000, used: 0 },    vms: 0,  status: "maintenance", kernel: "5.15.0-91" },
  { id: "hv05", host: "compute-01.isf1", region: "اصفهان-۱", az: "AZ-A", cpu: { total: 64, used: 38 },  ram: { total: 256, used: 142 }, disk: { total: 4000, used: 1900 }, vms: 18, status: "up",          kernel: "5.15.0-88" },
  { id: "hv06", host: "compute-02.isf1", region: "اصفهان-۱", az: "AZ-A", cpu: { total: 64, used: 61 },  ram: { total: 256, used: 210 }, disk: { total: 4000, used: 2400 }, vms: 22, status: "up",          kernel: "5.15.0-88" },
  { id: "hv07", host: "compute-01.msh1", region: "مشهد-۱",   az: "AZ-A", cpu: { total: 32, used: 18 },  ram: { total: 128, used: 72 },  disk: { total: 2000, used: 800 },  vms: 9,  status: "up",          kernel: "5.15.0-85" },
  { id: "hv08", host: "compute-02.msh1", region: "مشهد-۱",   az: "AZ-A", cpu: { total: 32, used: 0 },   ram: { total: 128, used: 0 },   disk: { total: 2000, used: 0 },    vms: 0,  status: "down",        kernel: "5.15.0-85" },
];

function UsageCell({ used, total, unit = "" }: { used: number; total: number; unit?: string }) {
  const pct   = Math.round((used / total) * 100);
  const color = pct > 85 ? "#ef4444" : pct > 65 ? "#f59e0b" : "#2554d8";
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-2">
        <span className="ltr-text" style={{ direction: "ltr" }}>{used}/{total}{unit}</span>
        <span style={{ color }} className="font-semibold">{pct}%</span>
      </div>
      <div className="w-full h-5 rounded-999 bg-border overflow-hidden">
        <div className="h-full rounded-999" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function AdminHypervisorsPage() {
  const [regionFilter, setRegion] = useState("همه");
  const regions = ["همه", "تهران-۱", "اصفهان-۱", "مشهد-۱"];
  const filtered = regionFilter === "همه" ? HVS : HVS.filter((h) => h.region === regionFilter);

  const upCount   = HVS.filter((h) => h.status === "up").length;
  const totalVMs  = HVS.reduce((a, h) => a + h.vms, 0);
  const totalCPU  = HVS.reduce((a, h) => a + h.cpu.total, 0);
  const usedCPU   = HVS.reduce((a, h) => a + h.cpu.used, 0);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">هایپروایزرها</h1>
            <p className="text-[12px] text-text-muted mt-2">وضعیت و مصرف سرورهای فیزیکی Compute</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "آنلاین / کل",   value: `${upCount}/${HVS.length}`, color: "#16a34a" },
            { label: "کل VM",          value: totalVMs,                   color: "#2554d8" },
            { label: "مصرف CPU",       value: `${Math.round((usedCPU / totalCPU) * 100)}%`, color: usedCPU/totalCPU > 0.8 ? "#dc2626" : "#d97706" },
            { label: "هسته‌های فیزیکی",value: totalCPU,                  color: "#64748b" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14 flex gap-8 flex-wrap">
        {regions.map((r) => (
          <button key={r} onClick={() => setRegion(r)}
            className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all ${regionFilter === r ? "bg-brand text-white" : "border border-border text-text-muted hover:text-text-main"}`}
          >{r}</button>
        ))}
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">هاست</th>
              <th className="text-start py-12 font-medium">منطقه / AZ</th>
              <th className="text-start py-12 font-medium w-[140px]">CPU</th>
              <th className="text-start py-12 font-medium w-[140px]">RAM (GB)</th>
              <th className="text-start py-12 font-medium w-[140px]">دیسک (GB)</th>
              <th className="text-start py-12 font-medium">VM</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">کرنل</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((h) => (
              <tr key={h.id} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono text-[11px] text-text-main ltr-text" style={{ direction: "ltr" }}>{h.host}</td>
                <td className="py-11 text-text-muted">{h.region} / {h.az}</td>
                <td className="py-11 pe-8"><UsageCell used={h.cpu.used} total={h.cpu.total} /></td>
                <td className="py-11 pe-8"><UsageCell used={h.ram.used} total={h.ram.total} /></td>
                <td className="py-11 pe-8"><UsageCell used={h.disk.used} total={h.disk.total} /></td>
                <td className="py-11 font-semibold text-text-main">{h.vms}</td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${h.status === "up" ? "bg-green-100 text-green-700" : h.status === "down" ? "bg-red-100 text-red-700" : "bg-blue-50 text-brand"}`}>
                    {h.status === "up" ? "آنلاین" : h.status === "down" ? "آفلاین" : "نگهداری"}
                  </span>
                </td>
                <td className="py-11 text-text-muted font-mono ltr-text text-[10px]" style={{ direction: "ltr" }}>{h.kernel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
