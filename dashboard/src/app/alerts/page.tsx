"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type AlertSeverity = "بحرانی" | "هشدار" | "اطلاع";
type AlertStatus   = "فعال" | "بسته‌شده" | "در بررسی" | "خاموش";
type RuleStatus    = "فعال" | "غیرفعال";

interface Alert {
  id: string;
  title: string;
  resource: string;
  severity: AlertSeverity;
  status: AlertStatus;
  region: string;
  started: string;
  duration: string;
  value: string;
  threshold: string;
  rule: string;
  assignee: string | null;
}

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: string;
  severity: AlertSeverity;
  status: RuleStatus;
  fires_7d: number;
  resource_type: string;
}

/* ─── mock data ─── */
const ALL_ALERTS: Alert[] = [
  { id: "a1",  title: "CPU بالا — worker-4", resource: "prod-vpc/worker-4", severity: "هشدار",   status: "فعال",      region: "تهران",  started: "۱۴ دقیقه پیش",  duration: "14m",  value: "87٪",   threshold: ">80٪",  rule: "cpu-high",     assignee: "احمدرضا"  },
  { id: "a2",  title: "RAM بحرانی — gpu-2",  resource: "ml-cluster/gpu-2",  severity: "بحرانی",  status: "در بررسی", region: "مشهد",   started: "۲ ساعت پیش",    duration: "2h4m", value: "95٪",   threshold: ">90٪",  rule: "ram-critical", assignee: "علی رضایی" },
  { id: "a3",  title: "دیسک پر — logs-node", resource: "prod-vpc/logs-01",  severity: "هشدار",   status: "فعال",      region: "تهران",  started: "۱ ساعت پیش",    duration: "1h10m",value: "91٪",   threshold: ">85٪",  rule: "disk-high",    assignee: null        },
  { id: "a4",  title: "Latency P99 بالا",    resource: "api.internal",       severity: "هشدار",   status: "فعال",      region: "تهران",  started: "۳۲ دقیقه پیش",  duration: "32m",  value: "840ms", threshold: ">500ms",rule: "latency-p99",  assignee: "احمدرضا"  },
  { id: "a5",  title: "SSL در حال انقضا",    resource: "shop.prakcheer.ir",  severity: "اطلاع",   status: "فعال",      region: "تهران",  started: "۶ روز پیش",     duration: "6d",   value: "7d",    threshold: "<14d",  rule: "ssl-expiry",   assignee: null        },
  { id: "a6",  title: "Connection refused",  resource: "prod-postgres-main", severity: "بحرانی",  status: "بسته‌شده", region: "تهران",  started: "دیروز",          duration: "45m",  value: "—",     threshold: "—",     rule: "pg-health",    assignee: "احمدرضا"  },
  { id: "a7",  title: "Bandwidth spike",     resource: "static.cdn.ir",      severity: "اطلاع",   status: "بسته‌شده", region: "تهران",  started: "۲ روز پیش",     duration: "12m",  value: "18Gbps",threshold: ">10G",  rule: "bw-spike",     assignee: null        },
  { id: "a8",  title: "Backup failed",       resource: "backup-daily",       severity: "هشدار",   status: "فعال",      region: "اصفهان", started: "۳ ساعت پیش",    duration: "3h",   value: "—",     threshold: "—",     rule: "backup-check", assignee: "علی رضایی" },
];

const ALL_RULES: AlertRule[] = [
  { id: "r1",  name: "cpu-high",       metric: "cpu_usage_pct",      condition: ">",  threshold: "80٪",   severity: "هشدار",  status: "فعال",    fires_7d: 12, resource_type: "server"  },
  { id: "r2",  name: "ram-critical",   metric: "ram_usage_pct",      condition: ">",  threshold: "90٪",   severity: "بحرانی", status: "فعال",    fires_7d: 3,  resource_type: "server"  },
  { id: "r3",  name: "disk-high",      metric: "disk_usage_pct",     condition: ">",  threshold: "85٪",   severity: "هشدار",  status: "فعال",    fires_7d: 8,  resource_type: "server"  },
  { id: "r4",  name: "latency-p99",    metric: "http_latency_p99_ms",condition: ">",  threshold: "500ms", severity: "هشدار",  status: "فعال",    fires_7d: 5,  resource_type: "lb"      },
  { id: "r5",  name: "ssl-expiry",     metric: "ssl_days_remaining", condition: "<",  threshold: "14d",   severity: "اطلاع",  status: "فعال",    fires_7d: 2,  resource_type: "domain"  },
  { id: "r6",  name: "pg-health",      metric: "pg_is_healthy",      condition: "==", threshold: "false", severity: "بحرانی", status: "فعال",    fires_7d: 1,  resource_type: "db"      },
  { id: "r7",  name: "bw-spike",       metric: "bandwidth_gbps",     condition: ">",  threshold: "10",    severity: "اطلاع",  status: "فعال",    fires_7d: 4,  resource_type: "cdn"     },
  { id: "r8",  name: "backup-check",   metric: "backup_success",     condition: "==", threshold: "false", severity: "هشدار",  status: "فعال",    fires_7d: 6,  resource_type: "storage" },
  { id: "r9",  name: "cpu-critical",   metric: "cpu_usage_pct",      condition: ">",  threshold: "95٪",   severity: "بحرانی", status: "غیرفعال", fires_7d: 0,  resource_type: "server"  },
  { id: "r10", name: "packet-loss",    metric: "packet_loss_pct",    condition: ">",  threshold: "5٪",    severity: "هشدار",  status: "فعال",    fires_7d: 2,  resource_type: "network" },
];

const HOURLY_FIRES = [
  { h: "۰۰", critical: 0, warning: 1, info: 0 },
  { h: "۰۲", critical: 0, warning: 0, info: 1 },
  { h: "۰۴", critical: 0, warning: 0, info: 0 },
  { h: "۰۶", critical: 0, warning: 1, info: 0 },
  { h: "۰۸", critical: 1, warning: 2, info: 1 },
  { h: "۱۰", critical: 0, warning: 3, info: 2 },
  { h: "۱۲", critical: 2, warning: 4, info: 1 },
  { h: "۱۴", critical: 1, warning: 2, info: 1 },
  { h: "۱۶", critical: 0, warning: 2, info: 0 },
  { h: "۱۸", critical: 1, warning: 1, info: 2 },
  { h: "۲۰", critical: 0, warning: 1, info: 1 },
  { h: "۲۲", critical: 0, warning: 0, info: 0 },
];

const RULE_FIRES_7D = ALL_RULES.filter(r => r.fires_7d > 0)
  .sort((a, b) => b.fires_7d - a.fires_7d)
  .slice(0, 7)
  .map(r => ({ name: r.name, fires: r.fires_7d }));

/* ─── colors ─── */
const SEVERITY_COLOR: Record<AlertSeverity, string> = {
  "بحرانی": "#ef4444",
  "هشدار":  "#d97706",
  "اطلاع":  "#2554d8",
};

const ASTATUS_COLOR: Record<AlertStatus, string> = {
  "فعال":       "#ef4444",
  "بسته‌شده":  "#16a34a",
  "در بررسی":  "#d97706",
  "خاموش":     "#94a3b8",
};

/* ─── tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] shadow-lg" style={{ direction: "rtl" }}>
      <p className="font-semibold mb-4">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

/* ─── page ─── */
export default function AlertsPage() {
  const [tab, setTab] = useState<"active" | "history" | "rules">("active");
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "all">("all");

  const activeAlerts  = ALL_ALERTS.filter(a => a.status === "فعال" || a.status === "در بررسی");
  const closedAlerts  = ALL_ALERTS.filter(a => a.status === "بسته‌شده");
  const criticalCount = activeAlerts.filter(a => a.severity === "بحرانی").length;
  const warningCount  = activeAlerts.filter(a => a.severity === "هشدار").length;
  const infoCount     = activeAlerts.filter(a => a.severity === "اطلاع").length;

  const displayAlerts = useMemo(() => {
    const base = tab === "history" ? closedAlerts : activeAlerts;
    if (severityFilter === "all") return base;
    return base.filter(a => a.severity === severityFilter);
  }, [tab, severityFilter, activeAlerts, closedAlerts]);

  /* header alert strip — active alerts as colored dots */
  const alertStrip = activeAlerts.slice(0, 12);

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[14px] font-bold text-text-main">هشدارها و آلارم‌ها</h2>
          {criticalCount > 0 && (
            <div className="flex items-center gap-6 px-10 py-5 rounded-8 text-[12px] font-bold"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
              ● {criticalCount} هشدار بحرانی فعال
            </div>
          )}
        </div>

        {/* alert severity dot strip */}
        <div className="flex flex-wrap gap-6 mb-14">
          {alertStrip.map(a => (
            <div key={a.id} title={a.title}
              className="w-16 h-16 rounded-4 flex items-center justify-center text-[8px] text-white font-bold shrink-0"
              style={{ background: SEVERITY_COLOR[a.severity] }}>
              {a.severity === "بحرانی" ? "C" : a.severity === "هشدار" ? "W" : "I"}
            </div>
          ))}
          {activeAlerts.length > 12 && (
            <div className="w-16 h-16 rounded-4 bg-text-muted/30 flex items-center justify-center text-[8px] text-text-muted">
              +{activeAlerts.length - 12}
            </div>
          )}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "بحرانی فعال",     value: criticalCount,             color: "#ef4444" },
            { label: "هشدار فعال",      value: warningCount,              color: "#d97706" },
            { label: "اطلاع فعال",      value: infoCount,                 color: "#2554d8" },
            { label: "قوانین فعال",     value: ALL_RULES.filter(r => r.status === "فعال").length, color: "#8b5cf6" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[26px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* hourly fires */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">هشدارهای ۲۴ ساعت اخیر</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_FIRES} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="h" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
                <Bar dataKey="critical" name="بحرانی" stackId="a" fill="#ef4444" />
                <Bar dataKey="warning"  name="هشدار"  stackId="a" fill="#d97706" />
                <Bar dataKey="info"     name="اطلاع"  stackId="a" fill="#2554d8" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* rule fires 7d */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">پرتکرارترین قوانین — ۷ روز</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RULE_FIRES_7D} layout="vertical" margin={{ top: 0, right: 16, left: 110, bottom: 0 }} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} width={110} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="fires" name="بار فعال" fill="#d97706" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─── alerts / rules tabs ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex flex-wrap items-center gap-10 mb-14">
          <div className="flex gap-8">
            {(["active", "history", "rules"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-12 py-6 rounded-8 text-[12px] font-medium transition-colors ${tab === t ? "bg-brand text-white" : "bg-bg border border-border text-text-muted hover:text-text-main"}`}>
                {t === "active" ? `فعال (${activeAlerts.length})` : t === "history" ? `تاریخچه (${closedAlerts.length})` : `قوانین (${ALL_RULES.length})`}
              </button>
            ))}
          </div>
          {tab !== "rules" && (
            <div className="flex gap-6 ms-auto">
              {(["all", "بحرانی", "هشدار", "اطلاع"] as const).map(s => (
                <button key={s} onClick={() => setSeverityFilter(s)}
                  className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ${severityFilter === s ? "bg-brand text-white" : "bg-bg text-text-muted hover:text-text-main border border-border"}`}>
                  {s === "all" ? "همه" : s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* alerts table */}
        {tab !== "rules" && (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="text-start pb-8 font-medium">عنوان</th>
                  <th className="text-start pb-8 font-medium">شدت</th>
                  <th className="text-start pb-8 font-medium">وضعیت</th>
                  <th className="text-start pb-8 font-medium">منبع</th>
                  <th className="text-start pb-8 font-medium">مقدار</th>
                  <th className="text-start pb-8 font-medium">آستانه</th>
                  <th className="text-start pb-8 font-medium">مدت</th>
                  <th className="text-start pb-8 font-medium">مسئول</th>
                  <th className="pb-8 font-medium" />
                </tr>
              </thead>
              <tbody>
                {displayAlerts.map((a, i) => (
                  <tr key={a.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-bg/20"}`}>
                    <td className="py-10 font-medium text-text-main">{a.title}</td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-bold"
                        style={{ background: `${SEVERITY_COLOR[a.severity]}15`, color: SEVERITY_COLOR[a.severity] }}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-medium"
                        style={{ background: `${ASTATUS_COLOR[a.status]}15`, color: ASTATUS_COLOR[a.status] }}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-10 ltr-text font-mono text-[11px] text-text-muted">{a.resource}</td>
                    <td className="py-10 ltr-text font-mono text-[11px]" style={{ color: SEVERITY_COLOR[a.severity] }}>{a.value}</td>
                    <td className="py-10 ltr-text font-mono text-[11px] text-text-muted">{a.threshold}</td>
                    <td className="py-10 ltr-text text-text-muted">{a.duration}</td>
                    <td className="py-10 text-text-muted">{a.assignee ?? "—"}</td>
                    <td className="py-10 text-end">
                      <button className="px-10 py-4 rounded-6 text-[11px] border border-border text-text-muted hover:text-text-main hover:bg-bg transition-colors">
                        {a.status === "فعال" ? "بررسی" : "جزئیات"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* rules table */}
        {tab === "rules" && (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="text-start pb-8 font-medium">نام قانون</th>
                  <th className="text-start pb-8 font-medium">متریک</th>
                  <th className="text-start pb-8 font-medium">شرط</th>
                  <th className="text-start pb-8 font-medium">شدت</th>
                  <th className="text-start pb-8 font-medium">وضعیت</th>
                  <th className="text-start pb-8 font-medium">نوع منبع</th>
                  <th className="text-start pb-8 font-medium">فعال‌شدن ۷ روز</th>
                  <th className="pb-8 font-medium" />
                </tr>
              </thead>
              <tbody>
                {ALL_RULES.map((r, i) => (
                  <tr key={r.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-bg/20"}`}>
                    <td className="py-10 ltr-text font-mono text-[11px] font-semibold text-text-main">{r.name}</td>
                    <td className="py-10 ltr-text font-mono text-[11px] text-text-muted">{r.metric}</td>
                    <td className="py-10 ltr-text font-mono text-[11px] text-text-muted">{r.condition} {r.threshold}</td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-bold"
                        style={{ background: `${SEVERITY_COLOR[r.severity]}15`, color: SEVERITY_COLOR[r.severity] }}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-medium"
                        style={{ background: r.status === "فعال" ? "#16a34a15" : "#94a3b815", color: r.status === "فعال" ? "#16a34a" : "#94a3b8" }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-10 ltr-text text-text-muted">{r.resource_type}</td>
                    <td className="py-10 ltr-text font-mono text-text-muted">{r.fires_7d}</td>
                    <td className="py-10 text-end">
                      <button className="px-10 py-4 rounded-6 text-[11px] border border-border text-text-muted hover:text-text-main hover:bg-bg transition-colors">ویرایش</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
