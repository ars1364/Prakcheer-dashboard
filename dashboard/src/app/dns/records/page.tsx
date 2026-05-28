"use client";

import { useState } from "react";
import Link from "next/link";

interface Record {
  zone:  string;
  name:  string;
  type:  "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS" | "SRV";
  value: string;
  ttl:   number;
  proxy: boolean;
}

const RECORDS: Record[] = [
  { zone: "myapp.ir",        name: "@",              type: "A",     value: "185.20.14.44",                             ttl: 300,  proxy: true  },
  { zone: "myapp.ir",        name: "www",            type: "CNAME", value: "myapp.ir",                                 ttl: 300,  proxy: true  },
  { zone: "myapp.ir",        name: "api",            type: "A",     value: "185.20.14.45",                             ttl: 60,   proxy: false },
  { zone: "myapp.ir",        name: "staging",        type: "A",     value: "185.20.14.48",                             ttl: 60,   proxy: false },
  { zone: "myapp.ir",        name: "@",              type: "MX",    value: "10 mail.myapp.ir",                         ttl: 3600, proxy: false },
  { zone: "myapp.ir",        name: "@",              type: "TXT",   value: "v=spf1 include:mail.ir -all",              ttl: 3600, proxy: false },
  { zone: "api.myapp.ir",    name: "v1",             type: "CNAME", value: "api-gateway.internal",                     ttl: 60,   proxy: false },
  { zone: "api.myapp.ir",    name: "v2",             type: "CNAME", value: "api-gateway-v2.internal",                  ttl: 60,   proxy: false },
  { zone: "internal.nab.ir", name: "db-prod",        type: "A",     value: "10.0.0.10",                                ttl: 3600, proxy: false },
  { zone: "internal.nab.ir", name: "redis-prod",     type: "A",     value: "10.0.0.11",                                ttl: 3600, proxy: false },
];

const TYPE_COLOR: Record<string, string> = {
  A: "#2554d8", AAAA: "#0891b2", CNAME: "#7c3aed", MX: "#d97706",
  TXT: "#16a34a", NS: "#64748b", SRV: "#dc2626",
};

export default function DNSRecordsPage() {
  const [zone, setZone]   = useState("همه");
  const [type, setType]   = useState("همه");

  const zones = ["همه", ...Array.from(new Set(RECORDS.map((r) => r.zone)))];
  const types = ["همه", "A", "AAAA", "CNAME", "MX", "TXT", "NS"];

  const filtered = RECORDS.filter((r) =>
    (zone === "همه" || r.zone === zone) &&
    (type === "همه" || r.type === type)
  );

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">رکوردهای DNS</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت رکوردهای DNS</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ رکورد جدید</button>
            <Link href="/dns/zones" className="text-[12px] text-text-muted hover:text-brand">← zone‌ها</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل رکورد",   value: RECORDS.length,                                     color: "#2554d8" },
            { label: "A record",   value: RECORDS.filter((r) => r.type === "A").length,       color: "#2554d8" },
            { label: "CNAME",      value: RECORDS.filter((r) => r.type === "CNAME").length,   color: "#7c3aed" },
            { label: "proxy شده",  value: RECORDS.filter((r) => r.proxy).length,              color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14 flex flex-wrap gap-10">
        <select value={zone} onChange={(e) => setZone(e.target.value)} dir="ltr"
          className="px-12 py-8 rounded-8 border border-border bg-bg text-[12px] outline-none focus:border-brand">
          {zones.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
        <div className="flex flex-wrap gap-6">
          {types.map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium font-mono transition-all ${type === t ? "text-white" : "border border-border text-text-muted"}`}
              style={type === t ? { background: TYPE_COLOR[t] ?? "#2554d8" } : {}}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">نام</th>
              <th className="text-start py-12 font-medium">نوع</th>
              <th className="text-start py-12 font-medium">zone</th>
              <th className="text-start py-12 font-medium">مقدار</th>
              <th className="text-start py-12 font-medium">TTL</th>
              <th className="text-start py-12 font-medium">proxy</th>
              <th className="py-12" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-10 font-mono text-[11px] font-semibold text-text-main ltr-text" style={{ direction: "ltr" }}>{r.name}</td>
                <td className="py-10">
                  <span className="px-7 py-2 rounded-4 text-[10px] font-bold font-mono" style={{ background: `${TYPE_COLOR[r.type]}15`, color: TYPE_COLOR[r.type] }}>{r.type}</span>
                </td>
                <td className="py-10 font-mono text-[10px] text-brand ltr-text" style={{ direction: "ltr" }}>{r.zone}</td>
                <td className="py-10 font-mono text-[11px] text-text-muted ltr-text max-w-[240px] truncate" style={{ direction: "ltr" }} title={r.value}>{r.value}</td>
                <td className="py-10 ltr-text text-text-muted">{r.ttl}s</td>
                <td className="py-10">
                  {r.proxy ? <span className="px-6 py-2 rounded-4 bg-amber-100 text-amber-700 text-[10px]">proxy</span> : <span className="text-text-muted text-[10px]">—</span>}
                </td>
                <td className="py-10 pe-12">
                  <button className="px-8 py-4 rounded-6 border border-border text-text-muted text-[10px] hover:bg-bg">ویرایش</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
