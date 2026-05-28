"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* ─── types ─── */
type KeyType   = "RSA-4096" | "RSA-2048" | "Ed25519" | "ECDSA-384";
type KeyStatus = "فعال" | "منقضی" | "لغو شده";

interface SshKey {
  id: string;
  name: string;
  fingerprint: string;
  key_type: KeyType;
  status: KeyStatus;
  owner: string;
  servers_count: number;
  created: string;
  last_used: string;
  expires: string | null;
  tags: string[];
}

/* ─── mock data ─── */
const ALL_KEYS: SshKey[] = [
  { id: "k1",  name: "deploy-prod",         fingerprint: "SHA256:xK8m2Pq...", key_type: "Ed25519",   status: "فعال",    owner: "احمدرضا",   servers_count: 28, created: "۱۴۰۲/۰۱/۱۵", last_used: "۱ ساعت پیش",   expires: null,          tags: ["prod", "deploy"] },
  { id: "k2",  name: "ci-runner-01",        fingerprint: "SHA256:aB3nRt...", key_type: "RSA-4096",  status: "فعال",    owner: "CI/CD",      servers_count: 42, created: "۱۴۰۲/۰۳/۲۰", last_used: "۱۰ دقیقه پیش", expires: null,          tags: ["ci", "automation"] },
  { id: "k3",  name: "backup-agent",        fingerprint: "SHA256:cD7pWx...", key_type: "RSA-4096",  status: "فعال",    owner: "سیستم",     servers_count: 35, created: "۱۴۰۲/۰۲/۰۸", last_used: "۵ دقیقه پیش",  expires: null,          tags: ["backup"] },
  { id: "k4",  name: "dev-laptop-ahmad",    fingerprint: "SHA256:eF1qYz...", key_type: "Ed25519",   status: "فعال",    owner: "احمدرضا",   servers_count: 8,  created: "۱۴۰۲/۰۶/۱۲", last_used: "۲ ساعت پیش",   expires: null,          tags: ["personal"] },
  { id: "k5",  name: "monitoring-scraper",  fingerprint: "SHA256:gH4rAs...", key_type: "ECDSA-384", status: "فعال",    owner: "مانیتورینگ",servers_count: 42, created: "۱۴۰۲/۰۴/۰۵", last_used: "۳ دقیقه پیش",  expires: null,          tags: ["monitoring"] },
  { id: "k6",  name: "staging-deploy",      fingerprint: "SHA256:iJ6tBv...", key_type: "RSA-2048",  status: "فعال",    owner: "احمدرضا",   servers_count: 14, created: "۱۴۰۲/۰۸/۱۱", last_used: "۱ روز پیش",    expires: null,          tags: ["staging"] },
  { id: "k7",  name: "contractor-ali",      fingerprint: "SHA256:kL9uCw...", key_type: "RSA-2048",  status: "لغو شده", owner: "علی رضایی", servers_count: 0,  created: "۱۴۰۲/۰۵/۲۰", last_used: "۳۰ روز پیش",  expires: null,          tags: ["contractor"] },
  { id: "k8",  name: "old-desktop-key",     fingerprint: "SHA256:mN2vDx...", key_type: "RSA-2048",  status: "منقضی",  owner: "احمدرضا",   servers_count: 0,  created: "۱۴۰۱/۰۹/۰۱", last_used: "۶ ماه پیش",    expires: "۱۴۰۳/۰۱/۰۱", tags: ["personal"] },
  { id: "k9",  name: "temp-access-ali",     fingerprint: "SHA256:oP5wEy...", key_type: "Ed25519",   status: "لغو شده", owner: "علی رضایی", servers_count: 0,  created: "۱۴۰۲/۱۱/۱۵", last_used: "۲ ماه پیش",    expires: "۱۴۰۳/۰۲/۱۵", tags: ["temp"] },
  { id: "k10", name: "ansible-controller",  fingerprint: "SHA256:qR8xFz...", key_type: "RSA-4096",  status: "فعال",    owner: "سیستم",     servers_count: 42, created: "۱۴۰۲/۰۱/۰۱", last_used: "۳۰ دقیقه پیش", expires: null,          tags: ["automation", "ansible"] },
];

const USAGE_BY_TYPE: { type: KeyType; count: number; fill: string }[] = [
  { type: "Ed25519",   count: ALL_KEYS.filter(k => k.key_type === "Ed25519").length,   fill: "#2554d8" },
  { type: "RSA-4096",  count: ALL_KEYS.filter(k => k.key_type === "RSA-4096").length,  fill: "#8b5cf6" },
  { type: "RSA-2048",  count: ALL_KEYS.filter(k => k.key_type === "RSA-2048").length,  fill: "#d97706" },
  { type: "ECDSA-384", count: ALL_KEYS.filter(k => k.key_type === "ECDSA-384").length, fill: "#16a34a" },
];

const TOP_SERVERS = ALL_KEYS
  .filter(k => k.status === "فعال")
  .sort((a, b) => b.servers_count - a.servers_count)
  .slice(0, 6)
  .map(k => ({ name: k.name.length > 18 ? k.name.slice(0, 16) + "…" : k.name, servers: k.servers_count }));

/* ─── colors ─── */
const STATUS_COLOR: Record<KeyStatus, string> = {
  "فعال":     "#16a34a",
  "منقضی":   "#ef4444",
  "لغو شده": "#94a3b8",
};

const TYPE_COLOR: Record<KeyType, string> = {
  "Ed25519":   "#2554d8",
  "RSA-4096":  "#8b5cf6",
  "RSA-2048":  "#d97706",
  "ECDSA-384": "#16a34a",
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
export default function SshKeysPage() {
  const [statusFilter, setStatusFilter] = useState<KeyStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let keys = ALL_KEYS;
    if (statusFilter !== "all") keys = keys.filter(k => k.status === statusFilter);
    if (search) keys = keys.filter(k => k.name.includes(search) || k.owner.includes(search));
    return keys;
  }, [statusFilter, search]);

  const activeKeys    = ALL_KEYS.filter(k => k.status === "فعال").length;
  const revokedKeys   = ALL_KEYS.filter(k => k.status === "لغو شده").length;
  const expiredKeys   = ALL_KEYS.filter(k => k.status === "منقضی").length;
  const totalServers  = ALL_KEYS.filter(k => k.status === "فعال").reduce((s, k) => s + k.servers_count, 0);

  /* type segmented bar */
  const typeTotal = USAGE_BY_TYPE.reduce((s, t) => s + t.count, 0);

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[14px] font-bold text-text-main">کلیدهای SSH</h2>
          <div className="flex items-center gap-8">
            {expiredKeys > 0 && (
              <div className="flex items-center gap-6 px-10 py-5 rounded-8 text-[11px] font-medium"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
                ⚠ {expiredKeys} کلید منقضی
              </div>
            )}
          </div>
        </div>

        {/* key type segmented bar */}
        <div className="flex h-12 rounded-999 overflow-hidden gap-1 mb-8">
          {USAGE_BY_TYPE.filter(t => t.count > 0).map(t => (
            <div key={t.type} title={`${t.type}: ${t.count}`}
              style={{ flex: t.count, background: t.fill }}
              className="rounded-999" />
          ))}
        </div>
        <div className="flex flex-wrap gap-12 mb-14">
          {USAGE_BY_TYPE.map(t => (
            <div key={t.type} className="flex items-center gap-6 text-[11px] text-text-muted">
              <span className="w-8 h-8 rounded-999 shrink-0" style={{ background: t.fill }} />
              <span className="ltr-text">{t.type}</span>
              <span>({t.count})</span>
              <span>— {((t.count / typeTotal) * 100).toFixed(0)}٪</span>
            </div>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "کلیدهای فعال",    value: activeKeys,               color: "#16a34a" },
            { label: "لغو شده",         value: revokedKeys,              color: "#94a3b8" },
            { label: "منقضی",           value: expiredKeys,              color: "#ef4444" },
            { label: "سرورهای تحت پوشش",value: totalServers,            color: "#2554d8" },
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

        {/* top keys by server coverage */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">بیشترین پوشش سرور</p>
          <div className="ltr-text h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_SERVERS} layout="vertical" margin={{ top: 0, right: 16, left: 140, bottom: 0 }} barSize={14}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2554d8" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#2554d8" stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} width={140} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="servers" name="سرورها" fill="url(#barGrad)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* key type distribution bar */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">توزیع نوع کلید</p>
          <div className="ltr-text h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={USAGE_BY_TYPE.filter(t => t.count > 0)} margin={{ top: 4, right: 8, left: -10, bottom: 0 }} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="type" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="تعداد" radius={[4,4,0,0]}>
                  {USAGE_BY_TYPE.filter(t => t.count > 0).map((t, i) => (
                    <rect key={i} fill={t.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─── keys table ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex flex-wrap items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">کلیدهای SSH</h3>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="جستجو نام یا مالک..."
            className="border border-border rounded-8 px-10 py-6 text-[12px] bg-bg text-text-main w-[180px] outline-none"
          />
          {(["all", "فعال", "منقضی", "لغو شده"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ${statusFilter === s ? "bg-brand text-white" : "bg-bg text-text-muted hover:text-text-main border border-border"}`}>
              {s === "all" ? "همه" : s}
            </button>
          ))}
          <button className="flex items-center gap-6 px-12 py-6 rounded-8 text-[12px] font-medium bg-brand text-white hover:bg-brand/90 transition-colors">
            + افزودن کلید
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-start pb-8 font-medium">نام</th>
                <th className="text-start pb-8 font-medium">نوع</th>
                <th className="text-start pb-8 font-medium">Fingerprint</th>
                <th className="text-start pb-8 font-medium">وضعیت</th>
                <th className="text-start pb-8 font-medium">مالک</th>
                <th className="text-start pb-8 font-medium">سرورها</th>
                <th className="text-start pb-8 font-medium">آخرین استفاده</th>
                <th className="text-start pb-8 font-medium">برچسب‌ها</th>
                <th className="pb-8 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((k, i) => (
                <tr key={k.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-bg/20"} ${k.status !== "فعال" ? "opacity-60" : ""}`}>
                  <td className="py-10 ltr-text font-mono text-[11px] font-semibold text-text-main">{k.name}</td>
                  <td className="py-10">
                    <span className="px-8 py-3 rounded-4 text-[10px] font-semibold ltr-text"
                      style={{ background: `${TYPE_COLOR[k.key_type]}18`, color: TYPE_COLOR[k.key_type] }}>
                      {k.key_type}
                    </span>
                  </td>
                  <td className="py-10 ltr-text font-mono text-[10px] text-text-muted">{k.fingerprint}</td>
                  <td className="py-10">
                    <span className="px-8 py-3 rounded-4 text-[10px] font-medium"
                      style={{ background: `${STATUS_COLOR[k.status]}18`, color: STATUS_COLOR[k.status] }}>
                      {k.status}
                    </span>
                  </td>
                  <td className="py-10 text-text-muted">{k.owner}</td>
                  <td className="py-10 ltr-text text-text-muted font-mono">{k.servers_count}</td>
                  <td className="py-10 text-text-muted whitespace-nowrap">{k.last_used}</td>
                  <td className="py-10">
                    <div className="flex flex-wrap gap-4">
                      {k.tags.map(t => (
                        <span key={t} className="px-6 py-2 rounded-4 text-[10px] bg-[#e2e8f0] text-text-muted ltr-text">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-10 text-end">
                    <button className="px-10 py-4 rounded-6 text-[11px] border border-border text-text-muted hover:text-red-500 hover:border-red-200 transition-colors">
                      {k.status === "فعال" ? "لغو" : "حذف"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
