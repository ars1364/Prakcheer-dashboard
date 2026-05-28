"use client";

import { useState, useMemo } from "react";

interface Event {
  id:        string;
  type:      string;
  category:  "compute" | "network" | "storage" | "billing" | "auth" | "k8s";
  resource:  string;
  actor:     string;
  ts:        string;
  status:    "success" | "failure";
  payload:   string;
}

const EVENTS: Event[] = [
  { id: "e01", type: "instance.created",        category: "compute", resource: "vm-prod-01",      actor: "a.sarkhail",  ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۳۲", status: "success", payload: '{"flavor":"c4.xlarge","region":"تهران-۱"}' },
  { id: "e02", type: "instance.status_changed", category: "compute", resource: "vm-staging-03",   actor: "ci-bot",      ts: "۱۴۰۵/۰۲/۰۷ ۱۴:۱۸", status: "success", payload: '{"from":"stopped","to":"running"}' },
  { id: "e03", type: "payment.success",          category: "billing", resource: "inv-2405-0012",   actor: "system",      ts: "۱۴۰۵/۰۲/۰۷ ۱۳:۵۵", status: "success", payload: '{"amount":2400000,"currency":"IRR"}' },
  { id: "e04", type: "k8s.cluster.ready",        category: "k8s",     resource: "cluster-main",    actor: "system",      ts: "۱۴۰۵/۰۲/۰۷ ۱۲:۴۴", status: "success", payload: '{"nodes":3,"version":"1.29"}' },
  { id: "e05", type: "volume.attached",          category: "storage", resource: "vol-data-02",     actor: "m.hosseini",  ts: "۱۴۰۵/۰۲/۰۷ ۱۱:۳۰", status: "success", payload: '{"instance":"vm-prod-01","device":"/dev/vdb"}' },
  { id: "e06", type: "alert.fired",              category: "compute", resource: "vm-prod-02",      actor: "monitor",     ts: "۱۴۰۵/۰۲/۰۷ ۱۱:۱۵", status: "failure", payload: '{"metric":"cpu","value":97,"threshold":90}' },
  { id: "e07", type: "snapshot.created",         category: "storage", resource: "snap-weekly-09",  actor: "scheduler",   ts: "۱۴۰۵/۰۲/۰۷ ۰۳:۰۰", status: "success", payload: '{"size":40,"source":"vol-root-01"}' },
  { id: "e08", type: "auth.login",               category: "auth",    resource: "session",          actor: "a.sarkhail",  ts: "۱۴۰۵/۰۲/۰۶ ۰۸:۱۱", status: "success", payload: '{"ip":"185.x.x.x","mfa":true}' },
  { id: "e09", type: "network.floatingip.assign",category: "network", resource: "185.20.x.x",      actor: "terraform",   ts: "۱۴۰۵/۰۲/۰۶ ۰۷:۵۸", status: "success", payload: '{"instance":"vm-prod-01"}' },
  { id: "e10", type: "instance.deleted",         category: "compute", resource: "vm-temp-07",      actor: "a.rezaei",    ts: "۱۴۰۵/۰۲/۰۵ ۱۶:۴۵", status: "success", payload: '{"force":false}' },
  { id: "e11", type: "auth.login",               category: "auth",    resource: "session",          actor: "unknown",     ts: "۱۴۰۵/۰۲/۰۵ ۰۲:۳۳", status: "failure", payload: '{"ip":"91.x.x.x","mfa":false,"reason":"wrong_password"}' },
  { id: "e12", type: "payment.failed",           category: "billing", resource: "inv-2405-0011",   actor: "system",      ts: "۱۴۰۵/۰۲/۰۴ ۱۸:۰۰", status: "failure", payload: '{"amount":1200000,"error":"card_declined"}' },
];

const CAT_COLOR: Record<string, string> = {
  compute: "#2554d8", network: "#16a34a", storage: "#7c3aed",
  billing: "#d97706", auth: "#dc2626", k8s: "#0891b2",
};

export default function EventLogPage() {
  const [cat, setCat]      = useState("همه");
  const [status, setStatus] = useState("همه");
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories = ["همه", "compute", "network", "storage", "billing", "auth", "k8s"];

  const filtered = useMemo(() => EVENTS.filter((e) => {
    if (cat !== "همه" && e.category !== cat) return false;
    if (status === "success" && e.status !== "success") return false;
    if (status === "failure" && e.status !== "failure") return false;
    return true;
  }), [cat, status]);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">لاگ رویدادها</h1>
            <p className="text-[12px] text-text-muted mt-2">جریان رویدادهای پلتفرم در لحظه</p>
          </div>
          <div className="flex items-center gap-8">
            <span className="w-8 h-8 rounded-full bg-green-500 animate-pulse inline-block" />
            <span className="text-[11px] text-text-muted">زنده</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "امروز",      value: EVENTS.length,                                         color: "#2554d8" },
            { label: "موفق",       value: EVENTS.filter((e) => e.status === "success").length,    color: "#16a34a" },
            { label: "ناموفق",     value: EVENTS.filter((e) => e.status === "failure").length,   color: "#dc2626" },
            { label: "نرخ موفق",   value: Math.round(EVENTS.filter((e) => e.status === "success").length / EVENTS.length * 100) + "٪", color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-14 flex flex-wrap gap-8 items-center">
        <div className="flex flex-wrap gap-6">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-all ${cat === c ? "text-white" : "border border-border text-text-muted"}`}
              style={cat === c ? { background: CAT_COLOR[c] ?? "#2554d8" } : {}}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-6 ms-auto">
          {["همه", "success", "failure"].map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-10 py-5 rounded-6 text-[11px] transition-all ${status === s ? "bg-brand text-white" : "border border-border text-text-muted"}`}>
              {s === "همه" ? "همه" : s === "success" ? "موفق" : "ناموفق"}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        {filtered.map((e) => (
          <div key={e.id} className="border-b border-border/50 last:border-0">
            <button className="w-full flex items-center gap-12 px-16 py-11 hover:bg-bg/40 transition-colors text-start"
              onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
              <div className={`w-6 h-6 rounded-full shrink-0 ${e.status === "success" ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-[11px] font-mono w-[200px] shrink-0 ltr-text text-brand" style={{ direction: "ltr" }}>{e.type}</span>
              <span className="text-[11px] text-text-muted w-[120px] shrink-0">{e.resource}</span>
              <span className="text-[11px] text-text-muted flex-1">{e.actor}</span>
              <span className="text-[11px] text-text-muted ltr-text shrink-0" style={{ direction: "ltr" }}>{e.ts}</span>
              <span className={`px-6 py-2 rounded-4 text-[10px] font-medium shrink-0 ml-4`}
                style={{ background: `${CAT_COLOR[e.category]}20`, color: CAT_COLOR[e.category] }}>{e.category}</span>
            </button>
            {expanded === e.id && (
              <div className="px-16 pb-12 pt-2 bg-bg/30">
                <pre className="text-[11px] font-mono text-text-muted ltr-text overflow-x-auto" style={{ direction: "ltr" }}>{JSON.stringify(JSON.parse(e.payload), null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
