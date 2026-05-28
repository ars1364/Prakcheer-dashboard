"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";

const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

type EventCategory = "server" | "network" | "billing" | "security" | "snapshot" | "iam" | "system";
type EventResult   = "success" | "failed" | "pending";

interface ActivityEvent {
  id: string;
  ts: string;
  user: string;
  action: string;
  resource: string;
  resourceId: string;
  category: EventCategory;
  result: EventResult;
  region: string;
  ip: string;
  detail: string | null;
}

const ALL_EVENTS: ActivityEvent[] = [
  { id: "evt-001", ts: "۱۴۰۳/۰۳/۰۵ ۱۱:۳۴", user: "احمدرضا ارس",     action: "ایجاد سرور",           resource: "Server",    resourceId: "srv-10", category: "server",   result: "success", region: "tehran",  ip: "185.47.10.1", detail: null },
  { id: "evt-002", ts: "۱۴۰۳/۰۳/۰۵ ۱۱:۲۲", user: "احمدرضا ارس",     action: "تغییر قانون فایروال",  resource: "Firewall",  resourceId: "fw-05",  category: "security", result: "success", region: "tehran",  ip: "185.47.10.1", detail: "deny TCP 23 ← allow" },
  { id: "evt-003", ts: "۱۴۰۳/۰۳/۰۵ ۱۰:۵۵", user: "سیستم",            action: "اسنپ‌شات خودکار",      resource: "Snapshot",  resourceId: "snap-003", category: "snapshot", result: "success", region: "tehran",  ip: "system", detail: "srv-01 → ۲۲ GB" },
  { id: "evt-004", ts: "۱۴۰۳/۰۳/۰۵ ۱۰:۴۲", user: "سارا محمدی",      action: "ریبوت سرور",           resource: "Server",    resourceId: "srv-07", category: "server",   result: "success", region: "isfahan", ip: "192.168.1.15", detail: null },
  { id: "evt-005", ts: "۱۴۰۳/۰۳/۰۵ ۱۰:۲۱", user: "احمدرضا ارس",     action: "پرداخت فاکتور",        resource: "Invoice",   resourceId: "inv-005", category: "billing",  result: "success", region: "all",     ip: "185.47.10.1", detail: "۹۸۰٬۰۰۰ ریال" },
  { id: "evt-006", ts: "۱۴۰۳/۰۳/۰۵ ۰۹:۵۸", user: "علی رضایی",       action: "حذف اسنپ‌شات",         resource: "Snapshot",  resourceId: "snap-010", category: "snapshot", result: "success", region: "tehran",  ip: "10.0.0.5", detail: null },
  { id: "evt-007", ts: "۱۴۰۳/۰۳/۰۵ ۰۹:۳۴", user: "سیستم",            action: "هشدار CPU",            resource: "Server",    resourceId: "srv-03", category: "system",   result: "failed",  region: "tehran",  ip: "system", detail: "CPU 83% > آستانه 80%" },
  { id: "evt-008", ts: "۱۴۰۳/۰۳/۰۵ ۰۹:۱۰", user: "احمدرضا ارس",     action: "اتصال IP شناور",       resource: "FloatingIP", resourceId: "fip-004", category: "network", result: "success", region: "tehran",  ip: "185.47.10.1", detail: "fip-004 → srv-10" },
  { id: "evt-009", ts: "۱۴۰۳/۰۳/۰۵ ۰۸:۵۵", user: "سارا محمدی",      action: "ایجاد شبکه",           resource: "Network",   resourceId: "net-05", category: "network",  result: "pending", region: "isfahan", ip: "192.168.1.15", detail: "isf-mgmt در حال ساخت" },
  { id: "evt-010", ts: "۱۴۰۳/۰۳/۰۵ ۰۸:۳۰", user: "علی رضایی",       action: "تغییر رمز عبور",      resource: "User",      resourceId: "usr-ali", category: "iam",     result: "success", region: "all",     ip: "10.0.0.5", detail: null },
  { id: "evt-011", ts: "۱۴۰۳/۰۳/۰۵ ۰۸:۰۵", user: "احمدرضا ارس",     action: "ایجاد کلید API",       resource: "APIKey",    resourceId: "key-003", category: "iam",    result: "success", region: "all",     ip: "185.47.10.1", detail: "key-003 ساخته شد" },
  { id: "evt-012", ts: "۱۴۰۳/۰۳/۰۵ ۰۷:۴۵", user: "ناشناس",           action: "ورود ناموفق",         resource: "Auth",      resourceId: "—",      category: "security", result: "failed",  region: "all",     ip: "45.88.12.3", detail: "تلاش ۵ بار از IP مشکوک" },
  { id: "evt-013", ts: "۱۴۰۳/۰۳/۰۵ ۰۷:۲۰", user: "سیستم",            action: "به‌روزرسانی خودکار",  resource: "System",    resourceId: "—",       category: "system",  result: "success", region: "all",     ip: "system", detail: null },
  { id: "evt-014", ts: "۱۴۰۳/۰۳/۰۴ ۲۳:۰۰", user: "سیستم",            action: "اسنپ‌شات خودکار",     resource: "Snapshot",  resourceId: "snap-001", category: "snapshot", result: "success", region: "tehran",  ip: "system", detail: null },
  { id: "evt-015", ts: "۱۴۰۳/۰۳/۰۴ ۲۲:۳۰", user: "احمدرضا ارس",     action: "حذف دیسک",            resource: "Volume",    resourceId: "vol-007", category: "server",  result: "success", region: "isfahan", ip: "185.47.10.1", detail: null },
  { id: "evt-016", ts: "۱۴۰۳/۰۳/۰۴ ۲۱:۱۰", user: "سارا محمدی",      action: "تغییر سایز سرور",     resource: "Server",    resourceId: "srv-05", category: "server",   result: "success", region: "isfahan", ip: "192.168.1.15", detail: "2vCPU → 4vCPU" },
  { id: "evt-017", ts: "۱۴۰۳/۰۳/۰۴ ۲۰:۴۵", user: "علی رضایی",       action: "ایجاد قانون فایروال", resource: "Firewall",  resourceId: "fw-12",  category: "security", result: "success", region: "mashhad", ip: "10.0.0.5", detail: "allow TCP 5432" },
  { id: "evt-018", ts: "۱۴۰۳/۰۳/۰۴ ۱۸:۰۰", user: "احمدرضا ارس",     action: "افزودن بکند",         resource: "LB",        resourceId: "lb-001", category: "network",  result: "success", region: "tehran",  ip: "185.47.10.1", detail: null },
  { id: "evt-019", ts: "۱۴۰۳/۰۳/۰۴ ۱۵:۳۰", user: "سیستم",            action: "تمدید گواهی SSL",     resource: "System",    resourceId: "cert-01", category: "system", result: "success", region: "tehran",  ip: "system", detail: null },
  { id: "evt-020", ts: "۱۴۰۳/۰۳/۰۴ ۱۴:۲۰", user: "سارا محمدی",      action: "تغییر نقش کاربر",    resource: "User",      resourceId: "usr-ali", category: "iam",    result: "success", region: "all",     ip: "192.168.1.15", detail: "viewer → operator" },
];

// Activity by hour (last 24h)
const HOURLY_ACTIVITY = [
  { h: "۰۰", count: 3, failed: 0 },
  { h: "۰۲", count: 1, failed: 0 },
  { h: "۰۴", count: 2, failed: 0 },
  { h: "۰۶", count: 0, failed: 0 },
  { h: "۰۸", count: 5, failed: 1 },
  { h: "۱۰", count: 7, failed: 1 },
  { h: "۱۲", count: 4, failed: 0 },
  { h: "۱۴", count: 6, failed: 0 },
  { h: "۱۶", count: 3, failed: 0 },
  { h: "۱۸", count: 2, failed: 0 },
  { h: "۲۰", count: 2, failed: 0 },
  { h: "۲۲", count: 1, failed: 0 },
];

const CATEGORY_LABEL: Record<EventCategory, string> = {
  server: "سرور", network: "شبکه", billing: "صورتحساب",
  security: "امنیت", snapshot: "اسنپ‌شات", iam: "دسترسی", system: "سیستم",
};

const CATEGORY_COLOR: Record<EventCategory, string> = {
  server: "#1a4d8f", network: "#8b5cf6", billing: "#d97706",
  security: "#ef4444", snapshot: "#16a34a", iam: "#f59e0b", system: "#94a3b8",
};

const RESULT_VARIANT: Record<EventResult, "success" | "danger" | "warning"> = {
  success: "success", failed: "danger", pending: "warning",
};
const RESULT_LABEL: Record<EventResult, string> = {
  success: "موفق", failed: "ناموفق", pending: "در انتظار",
};

const CATEGORIES: EventCategory[] = ["server", "network", "billing", "security", "snapshot", "iam", "system"];

const fontStyle = { fontFamily: "var(--font-vazirmatn)", fontSize: 11, fill: "#3d5957" };

export default function ActivityLogPage() {
  const [region, setRegion]       = useState("all");
  const [search, setSearch]       = useState("");
  const [catFilter, setCat]       = useState("all");
  const [resultFilter, setResult] = useState("all");

  const byRegion = useMemo(
    () => region === "all" ? ALL_EVENTS : ALL_EVENTS.filter(e => e.region === region || e.region === "all"),
    [region]
  );

  const filtered = useMemo(() => byRegion.filter(e => {
    if (catFilter    !== "all" && e.category !== catFilter) return false;
    if (resultFilter !== "all" && e.result   !== resultFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.action.includes(search) && !e.user.includes(search) && !e.resourceId.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [byRegion, catFilter, resultFilter, search]);

  const kpis = useMemo(() => ({
    total:   byRegion.length,
    success: byRegion.filter(e => e.result === "success").length,
    failed:  byRegion.filter(e => e.result === "failed").length,
    users:   [...new Set(byRegion.map(e => e.user))].filter(u => u !== "سیستم").length,
  }), [byRegion]);

  const catDist = useMemo(() => CATEGORIES.map(c => ({
    cat: c,
    count: byRegion.filter(e => e.category === c).length,
  })).filter(d => d.count > 0).sort((a, b) => b.count - a.count), [byRegion]);

  return (
    <div style={{ maxWidth: "var(--content-max)" }} className="mx-auto p-16 sm:p-24 flex flex-col gap-16 sm:gap-20">
      {/* Activity timeline header */}
      <div className="glass rounded-16 px-20 py-16 mb-20">
        <div className="flex flex-wrap gap-20 items-center">
          {/* Category color-coded event strip */}
          <div className="flex-1 min-w-[280px]">
            <p className="text-[12px] text-text-muted mb-8">نوع رویدادها</p>
            <div className="flex h-10 rounded-full overflow-hidden gap-[2px]">
              {catDist.map(d => (
                <div key={d.cat} style={{ flex: d.count, background: CATEGORY_COLOR[d.cat] }}
                     title={`${CATEGORY_LABEL[d.cat]}: ${d.count}`} />
              ))}
            </div>
            <div className="flex flex-wrap gap-10 mt-8">
              {catDist.slice(0, 5).map(d => (
                <div key={d.cat} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-2" style={{ background: CATEGORY_COLOR[d.cat] }} />
                  <span className="text-[11px] text-text-muted">{CATEGORY_LABEL[d.cat]} ({d.count})</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {[
              { label: "کل رویداد", count: kpis.total,   color: "#1a4d8f", bg: "rgba(26,77,143,0.08)"  },
              { label: "موفق",      count: kpis.success, color: "#22c55e", bg: "rgba(34,197,94,0.08)"  },
              { label: "ناموفق",    count: kpis.failed,  color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
              { label: "کاربران",   count: kpis.users,   color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center py-10 px-12 rounded-12" style={{ background: item.bg }}>
                <span className="text-[22px] font-bold ltr-text" style={{ color: item.color }}>{item.count}</span>
                <span className="text-[11px] text-text-muted mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mb-20">
        <div className="lg:col-span-2">
          <DashboardCard title="فعالیت ساعتی — ۲۴ ساعت گذشته">
            <div className="h-[180px] ltr-text">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HOURLY_ACTIVITY} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1a4d8f" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#1a4d8f" stopOpacity={0.55} />
                    </linearGradient>
                    <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.55} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="h" tick={fontStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={fontStyle} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "var(--font-vazirmatn)", fontSize: 12 }}
                    formatter={(v, n) => [v, n === "count" ? "رویداد" : "ناموفق"]} />
                  <Bar dataKey="count" fill="url(#barGrad1)" radius={[4, 4, 0, 0]} maxBarSize={24} name="count" stackId="a" />
                  <Bar dataKey="failed" fill="url(#barGrad2)" radius={[4, 4, 0, 0]} maxBarSize={24} name="failed" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
        <div>
          <DashboardCard title="توزیع دسته‌بندی">
            <div className="flex flex-col gap-8">
              {catDist.map(d => (
                <div key={d.cat} className="flex items-center gap-10">
                  <div className="w-10 h-10 rounded-2 shrink-0" style={{ background: CATEGORY_COLOR[d.cat] }} />
                  <span className="text-[12px] text-text-muted flex-1">{CATEGORY_LABEL[d.cat]}</span>
                  <div className="w-[80px] h-[6px] rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(d.count / kpis.total) * 100}%`, background: CATEGORY_COLOR[d.cat] }} />
                  </div>
                  <span className="ltr-text text-[12px] font-semibold text-text-main w-[20px] text-end">{d.count}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Filter bar */}
      <div className="glass rounded-12 px-16 py-12 mb-20 flex flex-wrap gap-12 items-center">
        <input
          type="text" placeholder="جستجو در رویدادها..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] h-34 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main placeholder:text-text-placeholder outline-none focus:border-border-strong"
          dir="rtl"
        />
        <select value={catFilter} onChange={e => setCat(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none focus:border-border-strong cursor-pointer" dir="rtl">
          <option value="all">همه دسته‌ها</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
        </select>
        <select value={resultFilter} onChange={e => setResult(e.target.value)}
          className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none focus:border-border-strong cursor-pointer" dir="rtl">
          <option value="all">همه نتایج</option>
          <option value="success">موفق</option>
          <option value="failed">ناموفق</option>
          <option value="pending">در انتظار</option>
        </select>
        {(search || catFilter !== "all" || resultFilter !== "all") && (
          <button onClick={() => { setSearch(""); setCat("all"); setResult("all"); }}
            className="h-34 px-14 rounded-8 text-[13px] text-brand border border-border hover:border-border-strong transition-colors bg-white/40">
            پاک کردن
          </button>
        )}
        <span className="text-[12px] text-text-muted ms-auto">{filtered.length} رویداد</span>
      </div>

      {/* Timeline event list */}
      <DashboardCard padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">زمان</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">کاربر</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">عملیات</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">منبع</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">دسته</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">نتیجه</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted hidden lg:table-cell">منطقه</th>
                <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted hidden xl:table-cell">IP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-40 text-text-muted">رویدادی یافت نشد</td></tr>
              ) : filtered.map((e, i) => (
                <tr key={e.id} className={`border-b border-border last:border-0 hover:bg-brand-light/30 transition-colors ${i % 2 !== 0 ? "bg-white/20" : ""}`}>
                  <td className="px-16 py-10 ltr-text text-[11px] text-text-muted font-mono">{e.ts}</td>
                  <td className="px-16 py-10">
                    <span className={`text-[12px] font-medium ${e.user === "سیستم" ? "text-text-muted" : e.user === "ناشناس" ? "text-danger" : "text-text-main"}`}>{e.user}</span>
                  </td>
                  <td className="px-16 py-10">
                    <p className="text-text-main text-[12px]">{e.action}</p>
                    {e.detail && <p className="text-[10px] text-text-muted mt-1 ltr-text">{e.detail}</p>}
                  </td>
                  <td className="px-16 py-10">
                    <span className="ltr-text text-[11px] font-mono text-brand">{e.resourceId}</span>
                  </td>
                  <td className="px-16 py-10">
                    <span className="inline-flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full" style={{ background: CATEGORY_COLOR[e.category] }} />
                      <span className="text-[12px] text-text-muted">{CATEGORY_LABEL[e.category]}</span>
                    </span>
                  </td>
                  <td className="px-16 py-10">
                    <StatusBadge variant={RESULT_VARIANT[e.result]}>{RESULT_LABEL[e.result]}</StatusBadge>
                  </td>
                  <td className="px-16 py-10 hidden lg:table-cell text-text-muted">
                    {e.region === "all" ? "همه" : e.region === "tehran" ? "تهران" : e.region === "isfahan" ? "اصفهان" : "مشهد"}
                  </td>
                  <td className="px-16 py-10 hidden xl:table-cell ltr-text font-mono text-[11px] text-text-muted">{e.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
