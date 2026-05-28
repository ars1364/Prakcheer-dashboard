"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

/* ─── types ─── */
type ZoneStatus = "فعال" | "غیرفعال" | "در انتظار";
type RecordType = "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS" | "SRV";

interface DnsRecord {
  type: RecordType;
  name: string;
  value: string;
  ttl: number;
  proxied: boolean;
}

interface DnsZone {
  id: string;
  domain: string;
  status: ZoneStatus;
  records: number;
  nameservers: string[];
  queries_today: number;
  queries_week: number;
  dnssec: boolean;
  updated: string;
  topRecords: DnsRecord[];
}

/* ─── mock data ─── */
const ALL_ZONES: DnsZone[] = [
  {
    id: "z1", domain: "prakcheer.ir", status: "فعال", records: 24, queries_today: 184200, queries_week: 1248000,
    dnssec: true, updated: "۱ ساعت پیش",
    nameservers: ["ns1.prakcheer.ir", "ns2.prakcheer.ir"],
    topRecords: [
      { type: "A",     name: "@",      value: "185.40.12.8",   ttl: 300,  proxied: true  },
      { type: "A",     name: "www",    value: "185.40.12.8",   ttl: 300,  proxied: true  },
      { type: "CNAME", name: "api",    value: "api.cloud.ir",  ttl: 600,  proxied: false },
      { type: "MX",    name: "@",      value: "mail.ir",       ttl: 3600, proxied: false },
      { type: "TXT",   name: "@",      value: "v=spf1 ...",    ttl: 3600, proxied: false },
    ],
  },
  {
    id: "z2", domain: "shop.prakcheer.ir", status: "فعال", records: 12, queries_today: 42100, queries_week: 298000,
    dnssec: false, updated: "۳ ساعت پیش",
    nameservers: ["ns1.prakcheer.ir", "ns2.prakcheer.ir"],
    topRecords: [
      { type: "A",     name: "@",      value: "185.40.12.20",  ttl: 300,  proxied: true  },
      { type: "CNAME", name: "cdn",    value: "cdn.cloud.ir",  ttl: 1800, proxied: false },
    ],
  },
  {
    id: "z3", domain: "api.internal",      status: "فعال", records: 8, queries_today: 320400, queries_week: 2184000,
    dnssec: true, updated: "۲ ساعت پیش",
    nameservers: ["ns1.internal", "ns2.internal"],
    topRecords: [
      { type: "A",     name: "gateway", value: "10.0.1.1",     ttl: 60,   proxied: false },
      { type: "A",     name: "auth",    value: "10.0.1.2",     ttl: 60,   proxied: false },
      { type: "SRV",   name: "_grpc",   value: "0 5 9000 ...", ttl: 120,  proxied: false },
    ],
  },
  {
    id: "z4", domain: "staging.prakcheer.ir", status: "فعال", records: 18, queries_today: 8400, queries_week: 52000,
    dnssec: false, updated: "۱ روز پیش",
    nameservers: ["ns1.prakcheer.ir", "ns2.prakcheer.ir"],
    topRecords: [
      { type: "A",     name: "@",      value: "185.40.12.50",  ttl: 60,  proxied: false },
      { type: "CNAME", name: "admin",  value: "admin.cloud.ir",ttl: 60,  proxied: false },
    ],
  },
  {
    id: "z5", domain: "oldsite.ir",          status: "غیرفعال", records: 5, queries_today: 0, queries_week: 1200,
    dnssec: false, updated: "۳۰ روز پیش",
    nameservers: ["ns1.prakcheer.ir", "ns2.prakcheer.ir"],
    topRecords: [],
  },
  {
    id: "z6", domain: "beta.prakcheer.ir",   status: "در انتظار", records: 3, queries_today: 210, queries_week: 820,
    dnssec: false, updated: "۵ دقیقه پیش",
    nameservers: ["ns1.prakcheer.ir", "ns2.prakcheer.ir"],
    topRecords: [
      { type: "A", name: "@", value: "185.40.12.99", ttl: 300, proxied: false },
    ],
  },
];

const QUERY_TIMELINE = [
  { h: "۰۰", q: 18400 }, { h: "۰۲", q: 11200 }, { h: "۰۴", q: 8100  },
  { h: "۰۶", q: 14200 }, { h: "۰۸", q: 38400 }, { h: "۱۰", q: 62100 },
  { h: "۱۲", q: 74800 }, { h: "۱۴", q: 68200 }, { h: "۱۶", q: 58400 },
  { h: "۱۸", q: 48100 }, { h: "۲۰", q: 32000 }, { h: "۲۲", q: 22400 },
];

const RECORD_TYPE_DATA = [
  { name: "A",     value: 48, fill: "#2554d8" },
  { name: "CNAME", value: 22, fill: "#8b5cf6" },
  { name: "TXT",   value: 18, fill: "#d97706" },
  { name: "MX",    value: 8,  fill: "#16a34a" },
  { name: "AAAA",  value: 6,  fill: "#ef4444" },
  { name: "سایر",  value: 4,  fill: "#94a3b8" },
];

const TOP_DOMAINS = [
  { domain: "api.internal",         q: 320400 },
  { domain: "prakcheer.ir",         q: 184200 },
  { domain: "shop.prakcheer.ir",    q: 42100  },
  { domain: "staging.prakcheer.ir", q: 8400   },
  { domain: "beta.prakcheer.ir",    q: 210    },
];

/* ─── colors ─── */
const STATUS_COLOR: Record<ZoneStatus, string> = {
  "فعال":      "#16a34a",
  "غیرفعال":  "#ef4444",
  "در انتظار": "#d97706",
};

const RTYPE_COLOR: Record<RecordType, string> = {
  A: "#2554d8", AAAA: "#ef4444", CNAME: "#8b5cf6",
  MX: "#16a34a", TXT: "#d97706", NS: "#94a3b8", SRV: "#06b6d4",
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
export default function DnsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return ALL_ZONES;
    return ALL_ZONES.filter(z => z.domain.includes(search));
  }, [search]);

  const totalRecords   = ALL_ZONES.reduce((s, z) => s + z.records, 0);
  const totalQToday    = ALL_ZONES.reduce((s, z) => s + z.queries_today, 0);
  const activeZones    = ALL_ZONES.filter(z => z.status === "فعال").length;
  const dnssecZones    = ALL_ZONES.filter(z => z.dnssec).length;

  /* query share bars for header */
  const maxQ = Math.max(...ALL_ZONES.map(z => z.queries_today));

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-[14px] font-bold text-text-main">مدیریت DNS</h2>
          <span className="text-[12px] text-brand font-semibold ltr-text">{totalQToday.toLocaleString()} query/day</span>
        </div>

        {/* query share by zone — horizontal bars */}
        <div className="flex flex-col gap-6 mb-16">
          {ALL_ZONES.filter(z => z.queries_today > 0).slice(0, 4).map(z => (
            <div key={z.id} className="flex items-center gap-10">
              <span className="text-[11px] text-text-muted ltr-text w-[180px] truncate shrink-0">{z.domain}</span>
              <div className="flex-1 h-8 rounded-999 bg-[#e2e8f0] overflow-hidden">
                <div style={{ width: `${(z.queries_today / maxQ) * 100}%`, background: "#2554d8" }}
                  className="h-full rounded-999" />
              </div>
              <span className="text-[11px] text-text-muted ltr-text w-[64px] text-end shrink-0">{(z.queries_today/1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>

        {/* 4 stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "زون‌های فعال",    value: `${activeZones} / ${ALL_ZONES.length}`, color: "#16a34a" },
            { label: "رکوردهای کل",     value: totalRecords,                            color: "#2554d8" },
            { label: "کوئری‌ها/روز",    value: `${(totalQToday/1000).toFixed(0)}K`,    color: "#8b5cf6" },
            { label: "زون DNSSEC",      value: dnssecZones,                             color: "#d97706" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[22px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── charts row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* query timeline */}
        <div className="glass rounded-16 p-16 lg:col-span-2">
          <p className="text-[13px] font-semibold text-text-main mb-12">کوئری‌های DNS — امروز</p>
          <div className="ltr-text h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={QUERY_TIMELINE} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="dnsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2554d8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2554d8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="h" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="q" name="کوئری" stroke="#2554d8" fill="url(#dnsGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* record type pie */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">توزیع نوع رکورد</p>
          <div className="ltr-text h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={RECORD_TYPE_DATA} cx="50%" cy="50%" outerRadius={60} innerRadius={28}
                  dataKey="value" nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}٪`}
                  labelLine={false}
                  style={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }}>
                  {RECORD_TYPE_DATA.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─── top domains bar chart ─── */}
      <div className="glass rounded-16 p-16">
        <p className="text-[13px] font-semibold text-text-main mb-12">بیشترین کوئری‌ها به تفکیک دامنه</p>
        <div className="ltr-text h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TOP_DOMAINS} layout="vertical" margin={{ top: 0, right: 16, left: 140, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="domain" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} width={140} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="q" name="کوئری" fill="#2554d8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── zones table ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">زون‌های DNS</h3>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="جستجو دامنه..."
            className="border border-border rounded-8 px-10 py-6 text-[12px] bg-bg text-text-main w-[180px] outline-none"
          />
          <button className="flex items-center gap-6 px-12 py-6 rounded-8 text-[12px] font-medium bg-brand text-white hover:bg-brand/90 transition-colors">
            + افزودن زون
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-start pb-8 font-medium w-8" />
                <th className="text-start pb-8 font-medium">دامنه</th>
                <th className="text-start pb-8 font-medium">وضعیت</th>
                <th className="text-start pb-8 font-medium">رکوردها</th>
                <th className="text-start pb-8 font-medium">DNSSEC</th>
                <th className="text-start pb-8 font-medium">کوئری/روز</th>
                <th className="text-start pb-8 font-medium">آخرین تغییر</th>
                <th className="pb-8 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((zone, i) => (
                <>
                  <tr key={zone.id} className={`border-b border-border/50 cursor-pointer hover:bg-bg/40 transition-colors ${i % 2 === 0 ? "" : "bg-bg/20"}`}
                    onClick={() => setExpanded(expanded === zone.id ? null : zone.id)}>
                    <td className="py-10 text-center text-text-muted text-[10px]">
                      {expanded === zone.id ? "▲" : "▶"}
                    </td>
                    <td className="py-10 ltr-text font-semibold text-text-main">{zone.domain}</td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-medium" style={{ background: `${STATUS_COLOR[zone.status]}18`, color: STATUS_COLOR[zone.status] }}>
                        {zone.status}
                      </span>
                    </td>
                    <td className="py-10 ltr-text text-text-muted">{zone.records}</td>
                    <td className="py-10 text-center">
                      <span className={`text-[12px] ${zone.dnssec ? "text-green-600" : "text-text-muted"}`}>{zone.dnssec ? "✓" : "—"}</span>
                    </td>
                    <td className="py-10 ltr-text text-text-muted">{zone.queries_today.toLocaleString()}</td>
                    <td className="py-10 text-text-muted">{zone.updated}</td>
                    <td className="py-10 text-end">
                      <button className="px-10 py-4 rounded-6 text-[11px] border border-border text-text-muted hover:text-text-main hover:bg-bg transition-colors" onClick={e => e.stopPropagation()}>
                        مدیریت
                      </button>
                    </td>
                  </tr>

                  {/* expanded records */}
                  {expanded === zone.id && zone.topRecords.length > 0 && (
                    <tr key={`${zone.id}-exp`}>
                      <td colSpan={8} className="pb-10 px-0">
                        <div className="mx-8 my-2 rounded-10 border border-border/60 overflow-hidden bg-bg/40">
                          <div className="px-14 py-8 border-b border-border/40 flex items-center gap-8">
                            <span className="text-[11px] font-semibold text-text-muted">رکوردهای نمونه</span>
                            <span className="text-[10px] text-text-muted">({zone.records} رکورد کل)</span>
                          </div>
                          <table className="w-full text-[11px]">
                            <thead>
                              <tr className="text-text-muted border-b border-border/40">
                                <th className="text-start px-14 py-6 font-medium">نوع</th>
                                <th className="text-start px-14 py-6 font-medium">نام</th>
                                <th className="text-start px-14 py-6 font-medium">مقدار</th>
                                <th className="text-start px-14 py-6 font-medium">TTL</th>
                                <th className="text-start px-14 py-6 font-medium">Proxy</th>
                              </tr>
                            </thead>
                            <tbody>
                              {zone.topRecords.map((r, ri) => (
                                <tr key={ri} className="border-b border-border/20 last:border-0">
                                  <td className="px-14 py-7">
                                    <span className="px-6 py-2 rounded-4 font-mono font-bold text-[10px]"
                                      style={{ background: `${RTYPE_COLOR[r.type]}18`, color: RTYPE_COLOR[r.type] }}>
                                      {r.type}
                                    </span>
                                  </td>
                                  <td className="px-14 py-7 ltr-text font-mono text-text-main">{r.name}</td>
                                  <td className="px-14 py-7 ltr-text text-text-muted max-w-[200px] truncate">{r.value}</td>
                                  <td className="px-14 py-7 ltr-text text-text-muted">{r.ttl}s</td>
                                  <td className="px-14 py-7 text-center">
                                    <span className={r.proxied ? "text-brand" : "text-text-muted"}>{r.proxied ? "✓" : "—"}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
