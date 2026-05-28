"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import DashboardShell from "@/components/layout/DashboardShell";
import MetricCard from "@/components/ui/MetricCard";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";

const REGIONS = [
  { id: "all", label: "همه مناطق" },
  { id: "tehran", label: "تهران" },
  { id: "isfahan", label: "اصفهان" },
  { id: "mashhad", label: "مشهد" },
];

type Priority = "critical" | "high" | "medium" | "low";
type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";

interface Ticket {
  id: string; title: string; category: string; priority: Priority;
  status: TicketStatus; region: string; created: string; updated: string; assignee: string;
}

const ALL_TICKETS: Ticket[] = [
  { id: "TKT-1041", title: "سرور تهران-۳ پاسخ نمی‌دهد",              category: "IaaS",       priority: "critical", status: "in_progress", region: "tehran",  created: "۱۴۰۳/۰۳/۰۴", updated: "۱۴۰۳/۰۳/۰۵", assignee: "علی رضایی"      },
  { id: "TKT-1040", title: "افزایش محدودیت ظرفیت شبکه",              category: "شبکه",       priority: "high",     status: "open",        region: "tehran",  created: "۱۴۰۳/۰۳/۰۳", updated: "۱۴۰۳/۰۳/۰۳", assignee: "منتظر تخصیص"   },
  { id: "TKT-1039", title: "خطای ۵۰۰ در پنل مدیریت",                 category: "پنل",        priority: "high",     status: "waiting",     region: "isfahan", created: "۱۴۰۳/۰۳/۰۲", updated: "۱۴۰۳/۰۳/۰۴", assignee: "سارا محمدی"     },
  { id: "TKT-1038", title: "درخواست فاکتور رسمی ماه اردیبهشت",       category: "صورتحساب",  priority: "medium",   status: "resolved",    region: "tehran",  created: "۱۴۰۳/۰۲/۳۰", updated: "۱۴۰۳/۰۳/۰۱", assignee: "پشتیبانی مالی"  },
  { id: "TKT-1037", title: "اسنپ‌شات خودکار اجرا نمی‌شود",           category: "IaaS",       priority: "medium",   status: "in_progress", region: "mashhad", created: "۱۴۰۳/۰۲/۲۸", updated: "۱۴۰۳/۰۳/۰۲", assignee: "علی رضایی"      },
  { id: "TKT-1036", title: "IP شناور به سرور متصل نمی‌شود",           category: "شبکه",       priority: "high",     status: "resolved",    region: "isfahan", created: "۱۴۰۳/۰۲/۲۶", updated: "۱۴۰۳/۰۲/۲۸", assignee: "سارا محمدی"     },
  { id: "TKT-1035", title: "سوال درباره مهاجرت داده به مشهد",         category: "مشاوره",     priority: "low",      status: "closed",      region: "mashhad", created: "۱۴۰۳/۰۲/۲۰", updated: "۱۴۰۳/۰۲/۲۴", assignee: "تیم فروش"       },
  { id: "TKT-1034", title: "کاهش سرعت دیسک پس از آپدیت",             category: "IaaS",       priority: "high",     status: "open",        region: "tehran",  created: "۱۴۰۳/۰۳/۰۴", updated: "۱۴۰۳/۰۳/۰۴", assignee: "منتظر تخصیص"   },
  { id: "TKT-1033", title: "فعال‌سازی قابلیت بکاپ روزانه",           category: "IaaS",       priority: "medium",   status: "open",        region: "isfahan", created: "۱۴۰۳/۰۳/۰۳", updated: "۱۴۰۳/۰۳/۰۳", assignee: "منتظر تخصیص"   },
  { id: "TKT-1032", title: "مشکل احراز هویت API",                     category: "API",        priority: "critical", status: "resolved",    region: "tehran",  created: "۱۴۰۳/۰۲/۲۵", updated: "۱۴۰۳/۰۲/۲۷", assignee: "تیم API"        },
  { id: "TKT-1031", title: "گزارش پهنای باند ماهانه ناقص است",        category: "صورتحساب",  priority: "low",      status: "closed",      region: "mashhad", created: "۱۴۰۳/۰۲/۱۵", updated: "۱۴۰۳/۰۲/۱۸", assignee: "پشتیبانی مالی"  },
  { id: "TKT-1030", title: "درخواست افزایش سقف اعتبار API",           category: "API",        priority: "medium",   status: "waiting",     region: "tehran",  created: "۱۴۰۳/۰۲/۲۸", updated: "۱۴۰۳/۰۳/۰۱", assignee: "تیم API"        },
];

// 7-day ticket volume
const TICKET_VOLUME = [
  { day: "شنبه",    opened: 3, resolved: 2 },
  { day: "یکشنبه",  opened: 1, resolved: 3 },
  { day: "دوشنبه",  opened: 4, resolved: 2 },
  { day: "سه‌شنبه", opened: 2, resolved: 4 },
  { day: "چهارشنبه",opened: 5, resolved: 3 },
  { day: "پنجشنبه", opened: 3, resolved: 4 },
  { day: "جمعه",    opened: 2, resolved: 2 },
];

const PRIORITY_LABEL: Record<Priority, string> = { critical: "بحرانی", high: "بالا", medium: "متوسط", low: "پایین" };
const PRIORITY_VARIANT: Record<Priority, "danger" | "warning" | "info" | "success"> = { critical: "danger", high: "warning", medium: "info", low: "success" };
const STATUS_LABEL: Record<TicketStatus, string> = { open: "باز", in_progress: "در حال بررسی", waiting: "منتظر مشتری", resolved: "حل شده", closed: "بسته" };
const STATUS_VARIANT: Record<TicketStatus, "danger" | "warning" | "info" | "success"> = { open: "danger", in_progress: "warning", waiting: "info", resolved: "success", closed: "success" };

// SLA radial arc component
function SLAGauge({ pct }: { pct: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 90 ? "#16a34a" : pct >= 75 ? "#d97706" : "#ef4444";
  return (
    <div className="flex flex-col items-center gap-8">
      <svg width="120" height="70" viewBox="0 0 120 70">
        <path d={`M 10 60 A ${r} ${r} 0 0 1 110 60`} fill="none" stroke="rgba(94,168,161,0.2)" strokeWidth="10" strokeLinecap="round" />
        <path d={`M 10 60 A ${r} ${r} 0 0 1 110 60`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * (Math.PI * r)} ${Math.PI * r}`} />
        <text x="60" y="58" textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>{pct}%</text>
      </svg>
      <p className="text-[12px] text-text-muted text-center">تیکت‌های حل‌شده در SLA</p>
    </div>
  );
}

export default function SupportPage() {
  const [region, setRegion] = useState("all");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const byRegion = useMemo(
    () => region === "all" ? ALL_TICKETS : ALL_TICKETS.filter(t => t.region === region),
    [region]
  );

  const filtered = useMemo(() => {
    return byRegion.filter(t => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!t.id.toLowerCase().includes(q) && !t.title.includes(search) && !t.category.includes(search)) return false;
      }
      return true;
    });
  }, [byRegion, statusFilter, priorityFilter, search]);

  const kpis = useMemo(() => ({
    total:    byRegion.length,
    open:     byRegion.filter(t => t.status === "open" || t.status === "in_progress").length,
    critical: byRegion.filter(t => t.priority === "critical").length,
    resolved: byRegion.filter(t => t.status === "resolved" || t.status === "closed").length,
  }), [byRegion]);

  // Priority distribution for mini bars
  const priorityDist = useMemo(() => {
    const total = byRegion.length || 1;
    return [
      { label: "بحرانی", count: byRegion.filter(t => t.priority === "critical").length, color: "#ef4444" },
      { label: "بالا",   count: byRegion.filter(t => t.priority === "high").length,     color: "#f59e0b" },
      { label: "متوسط",  count: byRegion.filter(t => t.priority === "medium").length,   color: "#3b82f6" },
      { label: "پایین",  count: byRegion.filter(t => t.priority === "low").length,      color: "#16a34a" },
    ].map(p => ({ ...p, pct: Math.round((p.count / total) * 100) }));
  }, [byRegion]);

  return (
    <DashboardShell
      title="پشتیبانی"
      breadcrumbs={[{ label: "پراکچیر", href: "/" }, { label: "پشتیبانی" }]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={setRegion}
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
        <MetricCard icon="🎫" label="کل تیکت‌ها"      value={String(kpis.total)}    />
        <MetricCard icon="🔓" label="باز / در بررسی"  value={String(kpis.open)}     />
        <MetricCard icon="🚨" label="بحرانی"           value={String(kpis.critical)} />
        <MetricCard icon="✅" label="حل‌شده"           value={String(kpis.resolved)} />
      </div>

      {/* Ticket volume chart + SLA gauge + Priority distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
        {/* Ticket volume bar chart */}
        <div className="lg:col-span-2">
          <DashboardCard title="حجم تیکت‌ها — ۷ روز گذشته">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={TICKET_VOLUME} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,168,161,0.15)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#3d5957", fontFamily: "var(--font-vazirmatn)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#3d5957" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(94,168,161,0.3)", borderRadius: 8, fontSize: 12, fontFamily: "var(--font-vazirmatn)" }}
                  formatter={(val: number, name: string) => [val, name === "opened" ? "باز شده" : "حل شده"]}
                />
                <Bar dataKey="opened"   fill="#1a4d8f" radius={[4, 4, 0, 0]} maxBarSize={20} name="opened"   />
                <Bar dataKey="resolved" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={20} name="resolved" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-16 mt-4 justify-end">
              <div className="flex items-center gap-6"><span className="w-10 h-10 rounded-2 inline-block bg-brand" /><span className="text-[11px] text-text-muted">باز شده</span></div>
              <div className="flex items-center gap-6"><span className="w-10 h-10 rounded-2 inline-block" style={{ background: "#16a34a" }} /><span className="text-[11px] text-text-muted">حل شده</span></div>
            </div>
          </DashboardCard>
        </div>

        {/* SLA gauge + priority dist */}
        <div className="flex flex-col gap-16">
          <DashboardCard title="SLA رضایت">
            <SLAGauge pct={94} />
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div className="text-center p-10 rounded-8 bg-bg-muted/60">
                <p className="text-[20px] font-bold text-text-main ltr-text">18</p>
                <p className="text-[11px] text-text-muted">دقیقه — میانگین پاسخ</p>
              </div>
              <div className="text-center p-10 rounded-8 bg-bg-muted/60">
                <p className="text-[20px] font-bold text-danger ltr-text">2</p>
                <p className="text-[11px] text-text-muted">تیکت SLA در خطر</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="توزیع اولویت">
            <div className="flex flex-col gap-10">
              {priorityDist.map(p => (
                <div key={p.label} className="flex items-center gap-10">
                  <span className="text-[12px] text-text-muted w-[40px] shrink-0">{p.label}</span>
                  <div className="flex-1 h-[8px] rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.color }} />
                  </div>
                  <span className="text-[11px] text-text-muted ltr-text w-[20px] text-end">{p.count}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Filter bar */}
      <div className="glass rounded-12 px-16 py-12 mb-20 flex flex-wrap gap-12 items-center">
        <input type="text" placeholder="جستجو در تیکت‌ها..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] h-34 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main placeholder:text-text-placeholder outline-none focus:border-border-strong"
          dir="rtl" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none focus:border-border-strong cursor-pointer" dir="rtl">
          <option value="all">همه وضعیت‌ها</option>
          <option value="open">باز</option>
          <option value="in_progress">در حال بررسی</option>
          <option value="waiting">منتظر مشتری</option>
          <option value="resolved">حل شده</option>
          <option value="closed">بسته</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none focus:border-border-strong cursor-pointer" dir="rtl">
          <option value="all">همه اولویت‌ها</option>
          <option value="critical">بحرانی</option>
          <option value="high">بالا</option>
          <option value="medium">متوسط</option>
          <option value="low">پایین</option>
        </select>
        {(search || statusFilter !== "all" || priorityFilter !== "all") && (
          <button onClick={() => { setSearch(""); setStatusFilter("all"); setPriorityFilter("all"); }}
            className="h-34 px-14 rounded-8 text-[13px] text-brand border border-border hover:border-border-strong transition-colors bg-white/40">
            پاک کردن فیلترها
          </button>
        )}
        <span className="text-[12px] text-text-muted me-auto">{filtered.length} تیکت</span>
      </div>

      {/* Tickets table */}
      <DashboardCard padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">شماره</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">موضوع</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">دسته‌بندی</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">اولویت</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">وضعیت</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted hidden md:table-cell">منطقه</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted hidden lg:table-cell">آخرین به‌روزرسانی</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted hidden xl:table-cell">مسئول</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-40 text-text-muted text-[13px]">تیکتی یافت نشد</td></tr>
              ) : (
                filtered.map((ticket, i) => (
                  <tr key={ticket.id} className={`border-b border-border last:border-0 hover:bg-brand-light/40 transition-colors ${i % 2 === 0 ? "" : "bg-white/20"}`}>
                    <td className="px-16 py-12"><span className="ltr-text font-mono text-[12px] text-brand">{ticket.id}</span></td>
                    <td className="px-16 py-12 max-w-[220px]"><span className="text-text-main line-clamp-1">{ticket.title}</span></td>
                    <td className="px-16 py-12"><span className="text-[12px] px-8 py-3 rounded-6 bg-bg-muted text-text-muted border border-border">{ticket.category}</span></td>
                    <td className="px-16 py-12"><StatusBadge variant={PRIORITY_VARIANT[ticket.priority]}>{PRIORITY_LABEL[ticket.priority]}</StatusBadge></td>
                    <td className="px-16 py-12"><StatusBadge variant={STATUS_VARIANT[ticket.status]}>{STATUS_LABEL[ticket.status]}</StatusBadge></td>
                    <td className="px-16 py-12 hidden md:table-cell text-text-muted">
                      {ticket.region === "tehran" ? "تهران" : ticket.region === "isfahan" ? "اصفهان" : "مشهد"}
                    </td>
                    <td className="px-16 py-12 hidden lg:table-cell ltr-text text-text-muted">{ticket.updated}</td>
                    <td className="px-16 py-12 hidden xl:table-cell text-text-muted">{ticket.assignee}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
