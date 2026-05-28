"use client";

import { useState, useMemo } from "react";
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
  id: string;
  title: string;
  category: string;
  priority: Priority;
  status: TicketStatus;
  region: string;
  created: string;
  updated: string;
  assignee: string;
}

const ALL_TICKETS: Ticket[] = [
  { id: "TKT-1041", title: "سرور تهران-۳ پاسخ نمی‌دهد", category: "IaaS", priority: "critical", status: "in_progress", region: "tehran", created: "۱۴۰۳/۰۳/۰۴", updated: "۱۴۰۳/۰۳/۰۵", assignee: "علی رضایی" },
  { id: "TKT-1040", title: "افزایش محدودیت ظرفیت شبکه", category: "شبکه", priority: "high", status: "open", region: "tehran", created: "۱۴۰۳/۰۳/۰۳", updated: "۱۴۰۳/۰۳/۰۳", assignee: "منتظر تخصیص" },
  { id: "TKT-1039", title: "خطای ۵۰۰ در پنل مدیریت", category: "پنل", priority: "high", status: "waiting", region: "isfahan", created: "۱۴۰۳/۰۳/۰۲", updated: "۱۴۰۳/۰۳/۰۴", assignee: "سارا محمدی" },
  { id: "TKT-1038", title: "درخواست فاکتور رسمی ماه اردیبهشت", category: "صورتحساب", priority: "medium", status: "resolved", region: "tehran", created: "۱۴۰۳/۰۲/۳۰", updated: "۱۴۰۳/۰۳/۰۱", assignee: "پشتیبانی مالی" },
  { id: "TKT-1037", title: "اسنپ‌شات خودکار اجرا نمی‌شود", category: "IaaS", priority: "medium", status: "in_progress", region: "mashhad", created: "۱۴۰۳/۰۲/۲۸", updated: "۱۴۰۳/۰۳/۰۲", assignee: "علی رضایی" },
  { id: "TKT-1036", title: "IP شناور به سرور متصل نمی‌شود", category: "شبکه", priority: "high", status: "resolved", region: "isfahan", created: "۱۴۰۳/۰۲/۲۶", updated: "۱۴۰۳/۰۲/۲۸", assignee: "سارا محمدی" },
  { id: "TKT-1035", title: "سوال درباره مهاجرت داده به منطقه مشهد", category: "مشاوره", priority: "low", status: "closed", region: "mashhad", created: "۱۴۰۳/۰۲/۲۰", updated: "۱۴۰۳/۰۲/۲۴", assignee: "تیم فروش" },
  { id: "TKT-1034", title: "کاهش سرعت دیسک پس از آپدیت", category: "IaaS", priority: "high", status: "open", region: "tehran", created: "۱۴۰۳/۰۳/۰۴", updated: "۱۴۰۳/۰۳/۰۴", assignee: "منتظر تخصیص" },
  { id: "TKT-1033", title: "فعال‌سازی قابلیت بکاپ روزانه", category: "IaaS", priority: "medium", status: "open", region: "isfahan", created: "۱۴۰۳/۰۳/۰۳", updated: "۱۴۰۳/۰۳/۰۳", assignee: "منتظر تخصیص" },
  { id: "TKT-1032", title: "مشکل احراز هویت API", category: "API", priority: "critical", status: "resolved", region: "tehran", created: "۱۴۰۳/۰۲/۲۵", updated: "۱۴۰۳/۰۲/۲۷", assignee: "تیم API" },
  { id: "TKT-1031", title: "گزارش پهنای باند ماهانه ناقص است", category: "صورتحساب", priority: "low", status: "closed", region: "mashhad", created: "۱۴۰۳/۰۲/۱۵", updated: "۱۴۰۳/۰۲/۱۸", assignee: "پشتیبانی مالی" },
  { id: "TKT-1030", title: "درخواست افزایش سقف اعتبار API", category: "API", priority: "medium", status: "waiting", region: "tehran", created: "۱۴۰۳/۰۲/۲۸", updated: "۱۴۰۳/۰۳/۰۱", assignee: "تیم API" },
];

const PRIORITY_LABEL: Record<Priority, string> = {
  critical: "بحرانی",
  high: "بالا",
  medium: "متوسط",
  low: "پایین",
};

const PRIORITY_VARIANT: Record<Priority, "danger" | "warning" | "info" | "success"> = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "success",
};

const STATUS_LABEL: Record<TicketStatus, string> = {
  open: "باز",
  in_progress: "در حال بررسی",
  waiting: "منتظر مشتری",
  resolved: "حل شده",
  closed: "بسته",
};

const STATUS_VARIANT: Record<TicketStatus, "danger" | "warning" | "info" | "success"> = {
  open: "danger",
  in_progress: "warning",
  waiting: "info",
  resolved: "success",
  closed: "success",
};

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
    total: byRegion.length,
    open: byRegion.filter(t => t.status === "open" || t.status === "in_progress").length,
    critical: byRegion.filter(t => t.priority === "critical").length,
    resolved: byRegion.filter(t => t.status === "resolved" || t.status === "closed").length,
  }), [byRegion]);

  const avgResolveMinutes = 18; // static mock

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
        <MetricCard icon="🎫" label="کل تیکت‌ها" value={String(kpis.total)} />
        <MetricCard icon="🔓" label="باز / در بررسی" value={String(kpis.open)} />
        <MetricCard icon="🚨" label="بحرانی" value={String(kpis.critical)} />
        <MetricCard icon="✅" label="حل‌شده" value={String(kpis.resolved)} />
      </div>

      {/* Filter bar */}
      <div className="glass rounded-12 px-16 py-12 mb-20 flex flex-wrap gap-12 items-center">
        <input
          type="text"
          placeholder="جستجو در تیکت‌ها..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] h-34 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main placeholder:text-text-placeholder outline-none focus:border-border-strong"
          dir="rtl"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none focus:border-border-strong cursor-pointer"
          dir="rtl"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="open">باز</option>
          <option value="in_progress">در حال بررسی</option>
          <option value="waiting">منتظر مشتری</option>
          <option value="resolved">حل شده</option>
          <option value="closed">بسته</option>
        </select>
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none focus:border-border-strong cursor-pointer"
          dir="rtl"
        >
          <option value="all">همه اولویت‌ها</option>
          <option value="critical">بحرانی</option>
          <option value="high">بالا</option>
          <option value="medium">متوسط</option>
          <option value="low">پایین</option>
        </select>
        {(search || statusFilter !== "all" || priorityFilter !== "all") && (
          <button
            onClick={() => { setSearch(""); setStatusFilter("all"); setPriorityFilter("all"); }}
            className="h-34 px-14 rounded-8 text-[13px] text-brand border border-border hover:border-border-strong transition-colors bg-white/40"
          >
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
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">منطقه</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">تاریخ ایجاد</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">آخرین به‌روزرسانی</th>
                <th className="text-start px-16 py-12 text-[12px] font-medium text-text-muted">مسئول</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-40 text-text-muted text-[13px]">
                    تیکتی یافت نشد
                  </td>
                </tr>
              ) : (
                filtered.map((ticket, i) => (
                  <tr
                    key={ticket.id}
                    className={`border-b border-border last:border-0 hover:bg-brand-light/40 transition-colors ${i % 2 === 0 ? "" : "bg-white/20"}`}
                  >
                    <td className="px-16 py-12">
                      <span className="ltr-text font-mono text-[12px] text-brand">{ticket.id}</span>
                    </td>
                    <td className="px-16 py-12 max-w-[260px]">
                      <span className="text-text-main line-clamp-1">{ticket.title}</span>
                    </td>
                    <td className="px-16 py-12">
                      <span className="text-[12px] px-8 py-3 rounded-6 bg-bg-muted text-text-muted border border-border">
                        {ticket.category}
                      </span>
                    </td>
                    <td className="px-16 py-12">
                      <StatusBadge variant={PRIORITY_VARIANT[ticket.priority]}>
                        {PRIORITY_LABEL[ticket.priority]}
                      </StatusBadge>
                    </td>
                    <td className="px-16 py-12">
                      <StatusBadge variant={STATUS_VARIANT[ticket.status]}>
                        {STATUS_LABEL[ticket.status]}
                      </StatusBadge>
                    </td>
                    <td className="px-16 py-12 text-text-muted">
                      {ticket.region === "tehran" ? "تهران" : ticket.region === "isfahan" ? "اصفهان" : "مشهد"}
                    </td>
                    <td className="px-16 py-12 ltr-text text-text-muted">{ticket.created}</td>
                    <td className="px-16 py-12 ltr-text text-text-muted">{ticket.updated}</td>
                    <td className="px-16 py-12 text-text-muted">{ticket.assignee}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 mt-20">
        <div className="glass rounded-12 px-20 py-16">
          <p className="text-[12px] text-text-muted mb-6">میانگین زمان پاسخ اولیه</p>
          <p className="text-[20px] font-semibold text-text-main ltr-text">{avgResolveMinutes} <span className="text-[13px] font-normal text-text-muted">دقیقه</span></p>
        </div>
        <div className="glass rounded-12 px-20 py-16">
          <p className="text-[12px] text-text-muted mb-6">رضایت مشتریان (ماه جاری)</p>
          <p className="text-[20px] font-semibold text-text-main ltr-text">۹۴٪</p>
        </div>
        <div className="glass rounded-12 px-20 py-16">
          <p className="text-[12px] text-text-muted mb-6">تیکت‌های SLA در خطر</p>
          <p className="text-[20px] font-semibold text-danger ltr-text">۲</p>
        </div>
      </div>
    </DashboardShell>
  );
}
