"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type ThreatLevel  = "بحرانی" | "بالا" | "متوسط" | "پایین";
type CveStatus    = "وصله نشده" | "وصله شده" | "در بررسی" | "نادیده";
type CheckStatus  = "قبول" | "رد" | "هشدار";

interface ThreatEvent {
  id: string;
  type: string;
  source_ip: string;
  source_country: string;
  target: string;
  level: ThreatLevel;
  timestamp: string;
  blocked: boolean;
  count: number;
}

interface CveEntry {
  id: string;
  cve_id: string;
  severity: ThreatLevel;
  service: string;
  component: string;
  cvss: number;
  status: CveStatus;
  published: string;
}

interface ComplianceCheck {
  category: string;
  check: string;
  status: CheckStatus;
  detail: string;
}

/* ─── mock data ─── */
const THREAT_EVENTS: ThreatEvent[] = [
  { id: "t1",  type: "Brute Force SSH",     source_ip: "185.234.218.12", source_country: "RU", target: "prod-vpc/bastion", level: "بالا",    timestamp: "۱۴ دقیقه پیش",  blocked: true,  count: 1842 },
  { id: "t2",  type: "SQL Injection",       source_ip: "103.42.181.90",  source_country: "CN", target: "api.internal",    level: "بحرانی",  timestamp: "۲ ساعت پیش",    blocked: true,  count: 14   },
  { id: "t3",  type: "Port Scan",           source_ip: "91.220.190.48",  source_country: "DE", target: "prod-vpc",        level: "پایین",   timestamp: "۳۵ دقیقه پیش",  blocked: true,  count: 482  },
  { id: "t4",  type: "DDoS — UDP Flood",    source_ip: "multiple",       source_country: "—",  target: "static.cdn.ir",   level: "بحرانی",  timestamp: "دیروز",          blocked: true,  count: 28000},
  { id: "t5",  type: "CVE Exploit Attempt", source_ip: "45.33.32.156",   source_country: "US", target: "logs-es",         level: "بالا",    timestamp: "۱ ساعت پیش",    blocked: false, count: 8    },
  { id: "t6",  type: "Credential Stuffing", source_ip: "multiple",       source_country: "—",  target: "auth-service",    level: "متوسط",   timestamp: "۶ ساعت پیش",    blocked: true,  count: 320  },
  { id: "t7",  type: "SSRF Probe",          source_ip: "93.158.200.14",  source_country: "NL", target: "api.internal",    level: "متوسط",   timestamp: "۳ ساعت پیش",    blocked: true,  count: 42   },
];

const CVE_LIST: CveEntry[] = [
  { id: "cv1",  cve_id: "CVE-2024-1086", severity: "بحرانی", service: "linux-kernel", component: "nf_tables",        cvss: 9.8, status: "وصله نشده", published: "۱۴۰۳/۰۱/۱۲" },
  { id: "cv2",  cve_id: "CVE-2023-4911", severity: "بالا",   service: "glibc",        component: "glibc-2.35",       cvss: 7.8, status: "وصله شده",   published: "۱۴۰۲/۰۷/۰۸" },
  { id: "cv3",  cve_id: "CVE-2024-0727", severity: "متوسط",  service: "openssl",      component: "openssl-3.0",      cvss: 5.5, status: "در بررسی",  published: "۱۴۰۳/۰۱/۲۵" },
  { id: "cv4",  cve_id: "CVE-2024-2961", severity: "بالا",   service: "glibc",        component: "iconv",            cvss: 8.8, status: "وصله نشده", published: "۱۴۰۳/۰۲/۱۰" },
  { id: "cv5",  cve_id: "CVE-2023-47038",severity: "متوسط",  service: "perl",         component: "perl-5.36",        cvss: 6.1, status: "وصله شده",   published: "۱۴۰۲/۰۸/۲۰" },
  { id: "cv6",  cve_id: "CVE-2024-21626",severity: "بالا",   service: "containerd",   component: "runc",             cvss: 8.6, status: "وصله شده",   published: "۱۴۰۳/۰۱/۳۱" },
  { id: "cv7",  cve_id: "CVE-2024-3094", severity: "بحرانی", service: "xz-utils",     component: "liblzma",          cvss: 10.0,status: "وصله شده",   published: "۱۴۰۳/۰۱/۱۲" },
];

const COMPLIANCE: ComplianceCheck[] = [
  { category: "شبکه",      check: "فایروال بر تمام VM‌ها فعال است",         status: "قبول",   detail: "42/42 VM" },
  { category: "شبکه",      check: "دسترسی SSH فقط از IP مجاز",              status: "هشدار",  detail: "3 VM بدون محدودیت" },
  { category: "احراز هویت",check: "MFA برای تمام کاربران ادمین",            status: "رد",     detail: "2 از 5 ادمین بدون MFA" },
  { category: "احراز هویت",check: "رمز عبور قوی اجباری",                    status: "قبول",   detail: "policy فعال" },
  { category: "داده",       check: "رمزگذاری دیسک‌های ذخیره‌سازی",          status: "قبول",   detail: "همه دیسک‌ها" },
  { category: "داده",       check: "بکاپ روزانه با تأیید",                  status: "هشدار",  detail: "۱ بکاپ شکست خورده امروز" },
  { category: "لاگ",        check: "Flow Logs فعال در همه VPC‌ها",           status: "رد",     detail: "staging-vpc غیرفعال" },
  { category: "لاگ",        check: "Audit log برای IAM",                     status: "قبول",   detail: "فعال" },
  { category: "TLS",        check: "SSL معتبر برای همه دامنه‌های عمومی",    status: "قبول",   detail: "6/6 دامنه" },
  { category: "TLS",        check: "TLS 1.3 فعال",                          status: "قبول",   detail: "همه endpoint‌ها" },
];

const ATTACK_TIMELINE = [
  { h: "۰۰", blocked: 120, unblocked: 0 }, { h: "۰۲", blocked: 80,  unblocked: 0 },
  { h: "۰۴", blocked: 60,  unblocked: 0 }, { h: "۰۶", blocked: 140, unblocked: 1 },
  { h: "۰۸", blocked: 420, unblocked: 2 }, { h: "۱۰", blocked: 840, unblocked: 3 },
  { h: "۱۲", blocked: 1200,unblocked: 4 }, { h: "۱۴", blocked: 980, unblocked: 2 },
  { h: "۱۶", blocked: 720, unblocked: 1 }, { h: "۱۸", blocked: 580, unblocked: 2 },
  { h: "۲۰", blocked: 360, unblocked: 1 }, { h: "۲۲", blocked: 240, unblocked: 0 },
];

/* ─── colors ─── */
const THREAT_COLOR: Record<ThreatLevel, string> = {
  "بحرانی": "#ef4444",
  "بالا":   "#f97316",
  "متوسط":  "#d97706",
  "پایین":  "#16a34a",
};

const CVE_STATUS_COLOR: Record<CveStatus, string> = {
  "وصله نشده": "#ef4444",
  "وصله شده":  "#16a34a",
  "در بررسی":  "#d97706",
  "نادیده":    "#94a3b8",
};

const CHECK_COLOR: Record<CheckStatus, string> = {
  "قبول":  "#16a34a",
  "رد":    "#ef4444",
  "هشدار": "#d97706",
};

const CHECK_ICON: Record<CheckStatus, string> = {
  "قبول":  "✓",
  "رد":    "✗",
  "هشدار": "⚠",
};

/* ─── tooltip ─── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-8 px-10 py-8 text-[11px] shadow-lg" style={{ direction: "rtl" }}>
      <p className="font-semibold mb-4">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
};

/* ─── page ─── */
export default function SecurityPage() {
  const [tab, setTab] = useState<"threats" | "cve" | "compliance">("threats");

  const criticalThreats  = THREAT_EVENTS.filter(t => t.level === "بحرانی").length;
  const unblockedThreats = THREAT_EVENTS.filter(t => !t.blocked).length;
  const criticalCves     = CVE_LIST.filter(c => c.severity === "بحرانی" && c.status === "وصله نشده").length;
  const failedChecks     = COMPLIANCE.filter(c => c.status === "رد").length;
  const warnChecks       = COMPLIANCE.filter(c => c.status === "هشدار").length;
  const passChecks       = COMPLIANCE.filter(c => c.status === "قبول").length;
  const complianceScore  = Math.round((passChecks / COMPLIANCE.length) * 100);

  /* total events by level — for header strip */
  const levelCounts = useMemo(() => {
    const c: Partial<Record<ThreatLevel, number>> = {};
    THREAT_EVENTS.forEach(t => { c[t.level] = (c[t.level] || 0) + t.count; });
    return c;
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[14px] font-bold text-text-main">امنیت</h2>
          <div className="flex items-center gap-10">
            {criticalThreats > 0 && (
              <div className="flex items-center gap-6 px-10 py-5 rounded-8 text-[11px] font-bold"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
                ● {criticalThreats} تهدید بحرانی
              </div>
            )}
            {criticalCves > 0 && (
              <div className="flex items-center gap-6 px-10 py-5 rounded-8 text-[11px] font-bold"
                style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", color: "#f97316" }}>
                ⚠ {criticalCves} CVE بحرانی وصله نشده
              </div>
            )}
          </div>
        </div>

        {/* threat level segmented strip */}
        <div className="flex h-12 rounded-999 overflow-hidden gap-1 mb-8">
          {(["بحرانی", "بالا", "متوسط", "پایین"] as ThreatLevel[]).map(lvl => {
            const c = levelCounts[lvl] || 0;
            if (c === 0) return null;
            return (
              <div key={lvl} style={{ flex: c, background: THREAT_COLOR[lvl] }}
                className="rounded-999" title={`${lvl}: ${c.toLocaleString()}`} />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-12 mb-14">
          {(["بحرانی", "بالا", "متوسط", "پایین"] as ThreatLevel[]).filter(l => levelCounts[l]).map(lvl => (
            <div key={lvl} className="flex items-center gap-6 text-[11px] text-text-muted">
              <span className="w-8 h-8 rounded-999 shrink-0" style={{ background: THREAT_COLOR[lvl] }} />
              {lvl}: {(levelCounts[lvl] || 0).toLocaleString()}
            </div>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "تهدید غیرمسدود",  value: unblockedThreats,       color: "#ef4444" },
            { label: "CVE بحرانی باز",   value: criticalCves,           color: "#f97316" },
            { label: "بررسی‌های ناموفق", value: `${failedChecks}+${warnChecks}`,color: "#d97706" },
            { label: "امتیاز compliance", value: `${complianceScore}٪`, color: complianceScore >= 80 ? "#16a34a" : "#d97706" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[24px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* attack timeline */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">حملات مسدودشده — ۲۴ ساعت</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTACK_TIMELINE} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={16}>
                <defs>
                  <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.55} />
                  </linearGradient>
                  <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="h" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-vazirmatn)" }} />
                <Bar dataKey="blocked"   name="مسدودشده"   fill="url(#barGrad1)" radius={[3,3,0,0]} />
                <Bar dataKey="unblocked" name="رد نشده"    fill="url(#barGrad2)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* compliance score breakdown */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">وضعیت compliance</p>
          <div className="flex flex-col gap-10 mt-8">
            {[
              { label: "قبول",  count: passChecks,  color: "#16a34a" },
              { label: "هشدار", count: warnChecks,  color: "#d97706" },
              { label: "رد",    count: failedChecks,color: "#ef4444" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-12">
                <span className="text-[12px] font-medium w-[48px]" style={{ color: s.color }}>{s.label}</span>
                <div className="flex-1 h-14 rounded-999 bg-[#e2e8f0] overflow-hidden">
                  <div style={{ width: `${(s.count / COMPLIANCE.length) * 100}%`, background: s.color }}
                    className="h-full rounded-999 flex items-center justify-end px-8 transition-all">
                    <span className="text-white text-[10px] font-bold">{s.count}</span>
                  </div>
                </div>
                <span className="text-[11px] text-text-muted ltr-text w-[40px] text-end">{((s.count/COMPLIANCE.length)*100).toFixed(0)}٪</span>
              </div>
            ))}
            <div className="mt-8 rounded-12 px-16 py-12 text-center"
              style={{ background: `${complianceScore >= 80 ? "#16a34a" : "#d97706"}12`, border: `1px solid ${complianceScore >= 80 ? "#16a34a" : "#d97706"}25` }}>
              <p className="text-[11px] text-text-muted mb-2">امتیاز کل</p>
              <p className="text-[32px] font-bold" style={{ color: complianceScore >= 80 ? "#16a34a" : "#d97706" }}>{complianceScore}٪</p>
            </div>
          </div>
        </div>

      </div>

      {/* ─── tabs ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex gap-8 mb-14">
          {(["threats", "cve", "compliance"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-12 py-6 rounded-8 text-[12px] font-medium transition-colors ${tab === t ? "bg-brand text-white" : "bg-bg border border-border text-text-muted hover:text-text-main"}`}>
              {t === "threats" ? `رویدادهای تهدید (${THREAT_EVENTS.length})` : t === "cve" ? `CVE (${CVE_LIST.length})` : `بررسی‌های امنیتی (${COMPLIANCE.length})`}
            </button>
          ))}
        </div>

        {/* threats table */}
        {tab === "threats" && (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="text-start pb-8 font-medium">نوع حمله</th>
                  <th className="text-start pb-8 font-medium">سطح</th>
                  <th className="text-start pb-8 font-medium">IP منبع</th>
                  <th className="text-start pb-8 font-medium">کشور</th>
                  <th className="text-start pb-8 font-medium">هدف</th>
                  <th className="text-start pb-8 font-medium">وضعیت</th>
                  <th className="text-start pb-8 font-medium">تعداد</th>
                  <th className="text-start pb-8 font-medium">زمان</th>
                </tr>
              </thead>
              <tbody>
                {THREAT_EVENTS.map((t, i) => (
                  <tr key={t.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-bg/20"}`}>
                    <td className="py-10 font-medium text-text-main">{t.type}</td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-bold"
                        style={{ background: `${THREAT_COLOR[t.level]}15`, color: THREAT_COLOR[t.level] }}>
                        {t.level}
                      </span>
                    </td>
                    <td className="py-10 ltr-text font-mono text-[11px] text-text-muted">{t.source_ip}</td>
                    <td className="py-10 ltr-text font-mono text-[11px] text-text-muted">{t.source_country}</td>
                    <td className="py-10 ltr-text font-mono text-[11px] text-text-muted">{t.target}</td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-medium"
                        style={{ background: t.blocked ? "#16a34a15" : "#ef444415", color: t.blocked ? "#16a34a" : "#ef4444" }}>
                        {t.blocked ? "مسدود" : "رد نشده"}
                      </span>
                    </td>
                    <td className="py-10 ltr-text font-mono text-text-muted">{t.count.toLocaleString()}</td>
                    <td className="py-10 text-text-muted">{t.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CVE table */}
        {tab === "cve" && (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="text-start pb-8 font-medium">CVE</th>
                  <th className="text-start pb-8 font-medium">شدت</th>
                  <th className="text-start pb-8 font-medium">CVSS</th>
                  <th className="text-start pb-8 font-medium">سرویس</th>
                  <th className="text-start pb-8 font-medium">کامپوننت</th>
                  <th className="text-start pb-8 font-medium">وضعیت</th>
                  <th className="text-start pb-8 font-medium">انتشار</th>
                </tr>
              </thead>
              <tbody>
                {CVE_LIST.sort((a, b) => b.cvss - a.cvss).map((c, i) => (
                  <tr key={c.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-bg/20"}`}>
                    <td className="py-10 ltr-text font-mono text-[11px] font-bold text-text-main">{c.cve_id}</td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-bold"
                        style={{ background: `${THREAT_COLOR[c.severity]}15`, color: THREAT_COLOR[c.severity] }}>
                        {c.severity}
                      </span>
                    </td>
                    <td className="py-10 ltr-text font-mono font-bold" style={{ color: c.cvss >= 9 ? "#ef4444" : c.cvss >= 7 ? "#f97316" : "#d97706" }}>
                      {c.cvss.toFixed(1)}
                    </td>
                    <td className="py-10 ltr-text font-mono text-[11px] text-text-muted">{c.service}</td>
                    <td className="py-10 ltr-text font-mono text-[11px] text-text-muted">{c.component}</td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-medium"
                        style={{ background: `${CVE_STATUS_COLOR[c.status]}15`, color: CVE_STATUS_COLOR[c.status] }}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-10 text-text-muted">{c.published}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* compliance checklist */}
        {tab === "compliance" && (
          <div className="flex flex-col gap-6">
            {Array.from(new Set(COMPLIANCE.map(c => c.category))).map(cat => (
              <div key={cat}>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-6 mt-8">{cat}</p>
                {COMPLIANCE.filter(c => c.category === cat).map(c => (
                  <div key={c.check} className="flex items-start gap-12 px-12 py-10 rounded-8 mb-2"
                    style={{ background: `${CHECK_COLOR[c.status]}08`, border: `1px solid ${CHECK_COLOR[c.status]}20` }}>
                    <span className="text-[14px] font-bold shrink-0 mt-0.5" style={{ color: CHECK_COLOR[c.status] }}>{CHECK_ICON[c.status]}</span>
                    <div className="flex-1">
                      <p className="text-[12px] font-medium text-text-main">{c.check}</p>
                      <p className="text-[11px] text-text-muted mt-1">{c.detail}</p>
                    </div>
                    <span className="px-8 py-3 rounded-4 text-[10px] font-medium shrink-0"
                      style={{ background: `${CHECK_COLOR[c.status]}15`, color: CHECK_COLOR[c.status] }}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
