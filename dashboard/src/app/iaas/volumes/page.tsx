"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ActionMenu from "@/components/ui/ActionMenu";

const REGIONS = [
  { id: "all", label: "همه مناطق" },
  { id: "tehran", label: "تهران" },
  { id: "isfahan", label: "اصفهان" },
  { id: "mashhad", label: "مشهد" },
];

type VolumeStatus = "attached" | "available" | "creating" | "error";
type VolumeType = "SSD" | "HDD" | "NVMe";

interface Volume {
  id: string; name: string; size: number; type: VolumeType;
  status: VolumeStatus; region: string; attachedTo: string | null;
  created: string; iops: number; readMbps: number; writeMbps: number;
}

const ALL_VOLUMES: Volume[] = [
  { id: "vol-001", name: "دیسک-وب-اصلی",          size: 100, type: "SSD",  status: "attached",  region: "tehran",  attachedTo: "srv-01", created: "۱۴۰۳/۰۱/۱۰", iops: 3000,  readMbps: 280, writeMbps: 120 },
  { id: "vol-002", name: "دیسک-دیتابیس-تهران",     size: 500, type: "NVMe", status: "attached",  region: "tehran",  attachedTo: "srv-02", created: "۱۴۰۳/۰۱/۱۲", iops: 16000, readMbps: 890, writeMbps: 640 },
  { id: "vol-003", name: "دیسک-بکاپ-۱",            size: 200, type: "HDD",  status: "available", region: "tehran",  attachedTo: null,     created: "۱۴۰۳/۰۲/۰۵", iops: 500,   readMbps: 0,   writeMbps: 0   },
  { id: "vol-004", name: "دیسک-لود-بالانسر",        size: 50,  type: "SSD",  status: "attached",  region: "tehran",  attachedTo: "srv-10", created: "۱۴۰۳/۰۳/۰۱", iops: 3000,  readMbps: 95,  writeMbps: 40  },
  { id: "vol-005", name: "دیسک-وب-اصفهان",          size: 80,  type: "SSD",  status: "attached",  region: "isfahan", attachedTo: "srv-03", created: "۱۴۰۳/۰۱/۲۰", iops: 3000,  readMbps: 210, writeMbps: 85  },
  { id: "vol-006", name: "دیسک-دیتابیس-اصفهان",    size: 250, type: "NVMe", status: "attached",  region: "isfahan", attachedTo: "srv-04", created: "۱۴۰۳/۰۱/۲۲", iops: 16000, readMbps: 740, writeMbps: 520 },
  { id: "vol-007", name: "دیسک-آزاد-اصفهان",        size: 100, type: "SSD",  status: "available", region: "isfahan", attachedTo: null,     created: "۱۴۰۳/۰۲/۱۵", iops: 3000,  readMbps: 0,   writeMbps: 0   },
  { id: "vol-008", name: "دیسک-وب-مشهد",            size: 60,  type: "SSD",  status: "attached",  region: "mashhad", attachedTo: "srv-07", created: "۱۴۰۳/۰۲/۰۱", iops: 3000,  readMbps: 145, writeMbps: 60  },
  { id: "vol-009", name: "دیسک-بکاپ-مشهد",          size: 400, type: "HDD",  status: "available", region: "mashhad", attachedTo: null,     created: "۱۴۰۳/۰۲/۱۰", iops: 500,   readMbps: 0,   writeMbps: 0   },
  { id: "vol-010", name: "دیسک-در-حال-ساخت",        size: 150, type: "SSD",  status: "creating",  region: "tehran",  attachedTo: null,     created: "۱۴۰۳/۰۳/۰۵", iops: 3000,  readMbps: 0,   writeMbps: 0   },
  { id: "vol-011", name: "دیسک-خراب",               size: 200, type: "SSD",  status: "error",     region: "mashhad", attachedTo: null,     created: "۱۴۰۳/۰۲/۲۵", iops: 3000,  readMbps: 0,   writeMbps: 0   },
  { id: "vol-012", name: "دیسک-کش-تهران",           size: 50,  type: "NVMe", status: "attached",  region: "tehran",  attachedTo: "srv-11", created: "۱۴۰۳/۰۳/۰۲", iops: 16000, readMbps: 620, writeMbps: 410 },
];

const STATUS_LABEL: Record<VolumeStatus, string> = { attached: "متصل", available: "آزاد", creating: "در حال ساخت", error: "خطا" };
const STATUS_VARIANT: Record<VolumeStatus, "success"|"info"|"warning"|"danger"> = { attached: "success", available: "info", creating: "warning", error: "danger" };
const TYPE_COLOR: Record<VolumeType, string> = { NVMe: "#1a4d8f", SSD: "#16a34a", HDD: "#9ca3af" };
const TYPE_LABEL: Record<VolumeType, string> = { NVMe: "NVMe", SSD: "SSD", HDD: "HDD" };

const REGION_LABEL = (r: string) => ({ tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد" }[r] ?? r);

// Storage by region for bar chart
const REGION_STORAGE = [
  { region: "تهران",   nvme: 550, ssd: 350, hdd: 200 },
  { region: "اصفهان",  nvme: 250, ssd: 180, hdd: 0   },
  { region: "مشهد",    nvme: 0,   ssd: 260, hdd: 400  },
];

// IO throughput bar
function IOBar({ read, write }: { read: number; write: number }) {
  if (!read && !write) return <span className="text-[11px] text-text-placeholder">—</span>;
  const max = 1000;
  return (
    <div className="flex flex-col gap-2 min-w-[80px]">
      <div className="flex items-center gap-4">
        <span className="text-[9px] text-text-muted w-[8px]">R</span>
        <div className="flex-1 h-[4px] rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full bg-brand" style={{ width: `${(read / max) * 100}%` }} />
        </div>
        <span className="ltr-text text-[10px] text-text-muted">{read}M</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[9px] text-text-muted w-[8px]">W</span>
        <div className="flex-1 h-[4px] rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${(write / max) * 100}%`, background: "#16a34a" }} />
        </div>
        <span className="ltr-text text-[10px] text-text-muted">{write}M</span>
      </div>
    </div>
  );
}

export default function VolumesPage() {
  const [region, setRegion] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const byRegion = useMemo(
    () => region === "all" ? ALL_VOLUMES : ALL_VOLUMES.filter(v => v.region === region),
    [region]
  );

  const filtered = useMemo(() => {
    return byRegion.filter(v => {
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (typeFilter   !== "all" && v.type   !== typeFilter)   return false;
      if (search) {
        const q = search.toLowerCase();
        if (!v.id.toLowerCase().includes(q) && !v.name.includes(search) && !(v.attachedTo && v.attachedTo.includes(q))) return false;
      }
      return true;
    });
  }, [byRegion, statusFilter, typeFilter, search]);

  const kpis = useMemo(() => ({
    total:    byRegion.length,
    totalGB:  byRegion.reduce((s, v) => s + v.size, 0),
    attached: byRegion.filter(v => v.status === "attached").length,
    available:byRegion.filter(v => v.status === "available").length,
  }), [byRegion]);

  const typePie = useMemo(() => {
    const groups: Record<VolumeType, number> = { NVMe: 0, SSD: 0, HDD: 0 };
    byRegion.forEach(v => groups[v.type] += v.size);
    return Object.entries(groups).filter(([,v]) => v > 0).map(([k, v]) => ({
      name: k, value: v, color: TYPE_COLOR[k as VolumeType]
    }));
  }, [byRegion]);

  return (
    <DashboardShell
      title="دیسک‌ها"
      breadcrumbs={[
        { label: "پراکچیر", href: "/" },
        { label: "زیرساخت ابری", href: "/iaas" },
        { label: "دیسک‌ها" },
      ]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={setRegion}
    >
      {/* Storage capacity header */}
      <div className="glass rounded-16 px-20 py-16 mb-4">
        <div className="flex items-center justify-between mb-10">
          <span className="text-[13px] font-medium text-text-muted">ظرفیت ذخیره‌سازی</span>
          <span className="ltr-text text-[13px] font-semibold text-text-main">{kpis.totalGB.toLocaleString("fa-IR")} GB مجموع</span>
        </div>
        <div className="flex h-12 rounded-full overflow-hidden gap-[2px] mb-12">
          {(["NVMe", "SSD", "HDD"] as VolumeType[]).map(t => {
            const gb = byRegion.filter(v => v.type === t).reduce((s, v) => s + v.size, 0);
            return gb > 0 ? (
              <div key={t} className="transition-all" title={`${t}: ${gb} GB`}
                   style={{ flex: gb, background: TYPE_COLOR[t] }} />
            ) : null;
          })}
        </div>
        <div className="flex items-center flex-wrap gap-16 mb-14">
          {(["NVMe", "SSD", "HDD"] as VolumeType[]).map(t => {
            const gb = byRegion.filter(v => v.type === t).reduce((s, v) => s + v.size, 0);
            return gb > 0 ? (
              <div key={t} className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-2" style={{ background: TYPE_COLOR[t] }} />
                <span className="text-[12px] text-text-muted">{t}</span>
                <span className="ltr-text text-[12px] font-semibold text-text-main">{gb} GB</span>
              </div>
            ) : null;
          })}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
          {[
            { label: "کل دیسک‌ها", count: kpis.total,     color: "#1a4d8f", bg: "rgba(26,77,143,0.08)"  },
            { label: "متصل",        count: kpis.attached,  color: "#22c55e", bg: "rgba(34,197,94,0.08)"  },
            { label: "آزاد",        count: kpis.available, color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
            { label: "خطا / ساخت",  count: byRegion.filter(v => v.status === "error" || v.status === "creating").length, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center py-10 px-6 rounded-12" style={{ background: item.bg }}>
              <span className="text-[22px] font-bold ltr-text" style={{ color: item.color }}>{item.count}</span>
              <span className="text-[11px] text-text-muted text-center mt-2">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Type donut + Region storage chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
        <div className="lg:col-span-1">
          <DashboardCard title="توزیع نوع دیسک (GB)">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={typePie} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="value">
                  {typePie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(94,168,161,0.3)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number, n: string) => [`${v} GB`, n]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-8 mt-4">
              {typePie.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <span className="w-10 h-10 rounded-2 shrink-0" style={{ background: d.color }} />
                    <span className="text-[12px] text-text-muted ltr-text font-semibold">{d.name}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-text-main ltr-text">{d.value} GB</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="lg:col-span-2">
          <DashboardCard title="فضای ذخیره‌سازی بر اساس منطقه (GB)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={REGION_STORAGE} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,168,161,0.15)" vertical={false} />
                <XAxis dataKey="region" tick={{ fontSize: 12, fill: "#3d5957", fontFamily: "var(--font-vazirmatn)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#3d5957" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(94,168,161,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "var(--font-vazirmatn)" }}
                  formatter={(v: number, n: string) => [`${v} GB`, n]}
                />
                <Bar dataKey="nvme" stackId="a" fill="#1a4d8f" name="NVMe" />
                <Bar dataKey="ssd"  stackId="a" fill="#16a34a" name="SSD"  />
                <Bar dataKey="hdd"  stackId="a" fill="#9ca3af" name="HDD"  radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-16 mt-4 justify-end">
              {[{ c: "#1a4d8f", n: "NVMe" }, { c: "#16a34a", n: "SSD" }, { c: "#9ca3af", n: "HDD" }].map(l => (
                <div key={l.n} className="flex items-center gap-6">
                  <span className="w-10 h-10 rounded-2 inline-block" style={{ background: l.c }} />
                  <span className="text-[11px] text-text-muted ltr-text">{l.n}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Filter bar */}
      <div className="glass rounded-12 px-16 py-12 mb-20 flex flex-wrap gap-12 items-center">
        <input type="text" placeholder="جستجو در دیسک‌ها..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] h-34 rounded-8 border border-border bg-white/60 px-12 text-[13px] placeholder:text-text-placeholder outline-none focus:border-border-strong" dir="rtl" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] outline-none cursor-pointer" dir="rtl">
          <option value="all">همه وضعیت‌ها</option>
          <option value="attached">متصل</option>
          <option value="available">آزاد</option>
          <option value="creating">در حال ساخت</option>
          <option value="error">خطا</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] outline-none cursor-pointer" dir="rtl">
          <option value="all">همه انواع</option>
          <option value="NVMe">NVMe</option>
          <option value="SSD">SSD</option>
          <option value="HDD">HDD</option>
        </select>
        {(search || statusFilter !== "all" || typeFilter !== "all") && (
          <button onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}
            className="h-34 px-14 rounded-8 text-[13px] text-brand border border-border hover:border-border-strong transition-colors bg-white/40">
            پاک کردن
          </button>
        )}
        <button className="h-34 px-16 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors ms-auto">
          ساخت دیسک جدید
        </button>
      </div>

      {/* Table */}
      <DashboardCard padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">نام دیسک</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">نوع</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">حجم (GB)</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">وضعیت</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">متصل به</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted hidden lg:table-cell">منطقه</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted hidden xl:table-cell">Read/Write</th>
                <th className="px-16 py-12 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-40 text-text-muted">دیسکی یافت نشد</td></tr>
              ) : filtered.map((vol, i) => (
                <tr key={vol.id} className={`border-b border-border last:border-0 hover:bg-brand-light/40 transition-colors ${i % 2 !== 0 ? "bg-white/20" : ""}`}>
                  <td className="px-16 py-12">
                    <p className="font-medium text-text-main">{vol.name}</p>
                    <p className="text-[11px] text-text-muted ltr-text">{vol.id}</p>
                  </td>
                  <td className="px-16 py-12">
                    <span className="font-semibold text-[12px] ltr-text" style={{ color: TYPE_COLOR[vol.type] }}>{TYPE_LABEL[vol.type]}</span>
                  </td>
                  <td className="px-16 py-12 ltr-text font-medium text-text-main">{vol.size}</td>
                  <td className="px-16 py-12">
                    <StatusBadge variant={STATUS_VARIANT[vol.status]}>{STATUS_LABEL[vol.status]}</StatusBadge>
                  </td>
                  <td className="px-16 py-12">
                    {vol.attachedTo ? <span className="ltr-text text-brand font-mono text-[12px]">{vol.attachedTo}</span> : <span className="text-text-placeholder">—</span>}
                  </td>
                  <td className="px-16 py-12 hidden lg:table-cell text-text-muted">{REGION_LABEL(vol.region)}</td>
                  <td className="px-16 py-12 hidden xl:table-cell"><IOBar read={vol.readMbps} write={vol.writeMbps} /></td>
                  <td className="px-16 py-12">
                    <ActionMenu items={[
                      { label: "اتصال به سرور",   onClick: () => {} },
                      { label: "تغییر اندازه",     onClick: () => {} },
                      { label: "ساخت اسنپ‌شات",   onClick: () => {} },
                      { label: "حذف دیسک",        onClick: () => {}, danger: true },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
