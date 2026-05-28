"use client";

import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ActionMenu from "@/components/ui/ActionMenu";
import EmptyState from "@/components/ui/EmptyState";

const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

type Direction  = "inbound" | "outbound";
type Protocol   = "TCP" | "UDP" | "ICMP" | "Any";
type RuleAction = "allow" | "deny";
type RuleStatus = "active" | "inactive";

type FirewallRule = {
  id: string; name: string; region: string;
  direction: Direction; protocol: Protocol;
  portRange: string; source: string; destination: string;
  action: RuleAction; status: RuleStatus; priority: number; createdAt: string;
  hits: number; // mock traffic hits today
};

const ALL_RULES: FirewallRule[] = [
  { id: "fw-01", name: "allow-http",        region: "tehran",  direction: "inbound",  protocol: "TCP",  portRange: "80",     source: "0.0.0.0/0",      destination: "185.94.97.211", action: "allow", status: "active",   priority: 100, createdAt: "۱۴۰۲/۱۲/۰۱", hits: 14820 },
  { id: "fw-02", name: "allow-https",       region: "tehran",  direction: "inbound",  protocol: "TCP",  portRange: "443",    source: "0.0.0.0/0",      destination: "185.94.97.211", action: "allow", status: "active",   priority: 110, createdAt: "۱۴۰۲/۱۲/۰۱", hits: 32100 },
  { id: "fw-03", name: "allow-ssh-vpn",     region: "tehran",  direction: "inbound",  protocol: "TCP",  portRange: "22",     source: "10.0.0.0/8",     destination: "any",           action: "allow", status: "active",   priority: 120, createdAt: "۱۴۰۲/۱۲/۰۳", hits: 248   },
  { id: "fw-04", name: "allow-db-internal", region: "tehran",  direction: "inbound",  protocol: "TCP",  portRange: "5432",   source: "192.168.1.0/24", destination: "185.94.97.213", action: "allow", status: "active",   priority: 130, createdAt: "۱۴۰۲/۱۲/۰۵", hits: 5620  },
  { id: "fw-05", name: "block-telnet",      region: "tehran",  direction: "inbound",  protocol: "TCP",  portRange: "23",     source: "0.0.0.0/0",      destination: "any",           action: "deny",  status: "active",   priority: 200, createdAt: "۱۴۰۲/۱۲/۱۰", hits: 340   },
  { id: "fw-06", name: "allow-outbound",    region: "tehran",  direction: "outbound", protocol: "Any",  portRange: "any",    source: "any",            destination: "0.0.0.0/0",    action: "allow", status: "active",   priority: 900, createdAt: "۱۴۰۲/۱۲/۰۱", hits: 8900  },
  { id: "fw-07", name: "allow-icmp",        region: "tehran",  direction: "inbound",  protocol: "ICMP", portRange: "—",      source: "0.0.0.0/0",      destination: "any",           action: "allow", status: "inactive", priority: 150, createdAt: "۱۴۰۳/۰۱/۰۵", hits: 0     },
  { id: "fw-08", name: "allow-http-isf",    region: "isfahan", direction: "inbound",  protocol: "TCP",  portRange: "80,443", source: "0.0.0.0/0",      destination: "192.168.10.51", action: "allow", status: "active",   priority: 100, createdAt: "۱۴۰۳/۰۲/۰۵", hits: 7230  },
  { id: "fw-09", name: "block-rdp-isf",     region: "isfahan", direction: "inbound",  protocol: "TCP",  portRange: "3389",   source: "0.0.0.0/0",      destination: "any",           action: "deny",  status: "active",   priority: 210, createdAt: "۱۴۰۳/۰۲/۱۰", hits: 1820  },
  { id: "fw-10", name: "allow-ssh-isf",     region: "isfahan", direction: "inbound",  protocol: "TCP",  portRange: "22",     source: "10.0.0.0/8",     destination: "any",           action: "allow", status: "active",   priority: 120, createdAt: "۱۴۰۳/۰۲/۰۵", hits: 95    },
  { id: "fw-11", name: "allow-http-msh",    region: "mashhad", direction: "inbound",  protocol: "TCP",  portRange: "80,443", source: "0.0.0.0/0",      destination: "10.20.30.102",  action: "allow", status: "active",   priority: 100, createdAt: "۱۴۰۳/۰۱/۲۰", hits: 3410  },
  { id: "fw-12", name: "allow-db-msh",      region: "mashhad", direction: "inbound",  protocol: "TCP",  portRange: "5432",   source: "10.1.0.0/24",    destination: "10.20.30.101",  action: "allow", status: "active",   priority: 130, createdAt: "۱۴۰۳/۰۱/۲۵", hits: 1250  },
];

const REGION_LABEL: Record<string, string> = { tehran: "تهران", isfahan: "اصفهان", mashhad: "مشهد" };

// Hit count bar
function HitBar({ hits }: { hits: number }) {
  const max = 35000;
  const pct = Math.min((hits / max) * 100, 100);
  const color = hits > 10000 ? "#1a4d8f" : hits > 1000 ? "#16a34a" : "#d97706";
  return (
    <div className="flex items-center gap-6 min-w-[90px]">
      <div className="flex-1 h-[5px] rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="ltr-text text-[11px] text-text-muted w-[40px] text-end">
        {hits >= 1000 ? `${(hits / 1000).toFixed(1)}K` : hits}
      </span>
    </div>
  );
}

// Traffic flow split bar
function FlowBar({ inbound, outbound }: { inbound: number; outbound: number }) {
  const total = inbound + outbound || 1;
  const inPct  = Math.round((inbound  / total) * 100);
  const outPct = 100 - inPct;
  return (
    <div>
      <div className="flex h-[12px] rounded-full overflow-hidden">
        <div className="transition-all" style={{ width: `${inPct}%`, background: "#1a4d8f" }} />
        <div className="transition-all" style={{ width: `${outPct}%`, background: "#16a34a" }} />
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-4"><span className="w-8 h-8 rounded-1 bg-brand inline-block" /><span className="text-[11px] text-text-muted">ورودی {inPct}%</span></div>
        <div className="flex items-center gap-4"><span className="w-8 h-8 rounded-1 inline-block" style={{ background: "#16a34a" }} /><span className="text-[11px] text-text-muted">خروجی {outPct}%</span></div>
      </div>
    </div>
  );
}

export default function FirewallPage() {
  const [region, setRegion]             = useState("all");
  const [search, setSearch]             = useState("");
  const [directionFilter, setDirection] = useState("all");
  const [actionFilter, setAction]       = useState("all");

  const byRegion = useMemo(
    () => region === "all" ? ALL_RULES : ALL_RULES.filter(r => r.region === region),
    [region]
  );

  const filtered = useMemo(() => {
    return byRegion.filter(r => {
      if (directionFilter !== "all" && r.direction !== directionFilter) return false;
      if (actionFilter    !== "all" && r.action    !== actionFilter)    return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.portRange.includes(q) && !r.source.includes(q)) return false;
      }
      return true;
    });
  }, [byRegion, directionFilter, actionFilter, search]);

  const kpis = useMemo(() => ({
    total:    byRegion.length,
    inbound:  byRegion.filter(r => r.direction === "inbound").length,
    outbound: byRegion.filter(r => r.direction === "outbound").length,
    denied:   byRegion.filter(r => r.action === "deny").length,
  }), [byRegion]);

  const totalHits     = useMemo(() => byRegion.reduce((s, r) => s + r.hits, 0), [byRegion]);
  const inboundHits   = useMemo(() => byRegion.filter(r => r.direction === "inbound").reduce((s, r) => s + r.hits, 0), [byRegion]);
  const outboundHits  = useMemo(() => byRegion.filter(r => r.direction === "outbound").reduce((s, r) => s + r.hits, 0), [byRegion]);
  const deniedHits    = useMemo(() => byRegion.filter(r => r.action === "deny").reduce((s, r) => s + r.hits, 0), [byRegion]);
  const allowedHits   = totalHits - deniedHits;

  // Top rules by hits
  const topRules = useMemo(() => [...byRegion].sort((a, b) => b.hits - a.hits).slice(0, 5), [byRegion]);

  return (
    <DashboardShell
      title="فایروال"
      breadcrumbs={[
        { label: "پراکچیر", href: "/" },
        { label: "زیرساخت ابری", href: "/iaas" },
        { label: "فایروال" },
      ]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={setRegion}
    >
      {/* Threat defense header */}
      <div className="glass rounded-16 px-20 py-16 mb-4">
        <div className="flex flex-wrap gap-16 items-center">
          <div className="rounded-14 px-20 py-14 flex flex-col items-center min-w-[130px]"
               style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <p className="text-[11px] text-text-muted mb-4">بلاک شده امروز</p>
            <p className="text-[36px] font-bold ltr-text leading-none" style={{ color: "#ef4444" }}>
              {deniedHits >= 1000 ? `${(deniedHits / 1000).toFixed(1)}K` : deniedHits}
            </p>
            <p className="text-[11px] text-text-muted mt-4">درخواست رد شده</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[12px] text-text-muted">نسبت مجاز به مسدود</span>
              <span className="ltr-text text-[12px] text-text-muted">{totalHits >= 1000 ? `${(totalHits / 1000).toFixed(1)}K` : totalHits} کل</span>
            </div>
            <div className="flex h-[14px] rounded-full overflow-hidden">
              <div style={{ width: `${totalHits > 0 ? Math.round((allowedHits / totalHits) * 100) : 0}%`, background: "#22c55e" }} />
              <div style={{ width: `${totalHits > 0 ? Math.round((deniedHits / totalHits) * 100) : 0}%`, background: "#ef4444" }} />
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full" style={{ background: "#22c55e" }} />
                <span className="text-[12px] text-text-muted">مجاز: {allowedHits >= 1000 ? `${(allowedHits / 1000).toFixed(1)}K` : allowedHits}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full" style={{ background: "#ef4444" }} />
                <span className="text-[12px] text-text-muted">مسدود: {deniedHits >= 1000 ? `${(deniedHits / 1000).toFixed(1)}K` : deniedHits}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {[
              { label: "کل قوانین", count: kpis.total,    color: "#1a4d8f", bg: "rgba(26,77,143,0.08)"  },
              { label: "مسدودساز", count: kpis.denied,   color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
              { label: "ورودی",     count: kpis.inbound,  color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
              { label: "خروجی",     count: kpis.outbound, color: "#22c55e", bg: "rgba(34,197,94,0.08)"  },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center py-8 px-12 rounded-10" style={{ background: item.bg }}>
                <span className="text-[18px] font-bold ltr-text" style={{ color: item.color }}>{item.count}</span>
                <span className="text-[11px] text-text-muted text-center mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic flow + Top rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1 flex flex-col gap-16">
          <DashboardCard title="جریان ترافیک امروز">
            <div className="mb-16">
              <p className="text-[12px] text-text-muted mb-8">ورودی در برابر خروجی</p>
              <FlowBar inbound={inboundHits} outbound={outboundHits} />
            </div>
            <div className="grid grid-cols-2 gap-10 mt-8">
              <div className="p-10 rounded-8 bg-bg-muted/60 border border-border text-center">
                <p className="text-[18px] font-bold text-brand ltr-text">{(inboundHits / 1000).toFixed(1)}K</p>
                <p className="text-[11px] text-text-muted">هیت ورودی</p>
              </div>
              <div className="p-10 rounded-8 bg-bg-muted/60 border border-border text-center">
                <p className="text-[18px] font-bold ltr-text" style={{ color: "#16a34a" }}>{(outboundHits / 1000).toFixed(1)}K</p>
                <p className="text-[11px] text-text-muted">هیت خروجی</p>
              </div>
            </div>
            <div className="mt-12 pt-10 border-t border-border">
              <p className="text-[12px] text-text-muted mb-8">مجاز در برابر مسدود</p>
              <div className="flex h-[10px] rounded-full overflow-hidden">
                <div style={{ width: `${Math.round((allowedHits / (totalHits || 1)) * 100)}%`, background: "#16a34a" }} />
                <div style={{ width: `${Math.round((deniedHits  / (totalHits || 1)) * 100)}%`, background: "#ef4444" }} />
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-[11px] text-text-muted">{Math.round((allowedHits / (totalHits || 1)) * 100)}٪ مجاز</span>
                <span className="text-[11px] text-danger">{Math.round((deniedHits / (totalHits || 1)) * 100)}٪ مسدود</span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="پرترافیک‌ترین قوانین">
            <div className="flex flex-col gap-10">
              {topRules.map((r, i) => (
                <div key={r.id} className="flex items-center gap-8">
                  <span className="text-[11px] font-bold text-text-muted w-[16px] shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-text-main ltr-text truncate">{r.name}</p>
                    <p className="text-[10px] text-text-muted ltr-text">{r.portRange !== "any" ? `port ${r.portRange}` : r.protocol}</p>
                  </div>
                  <HitBar hits={r.hits} />
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Rules table */}
        <div className="lg:col-span-2">
          <DashboardCard title="قوانین فایروال" padding={false}>
            <div className="flex items-center gap-10 px-16 py-12 border-b border-border flex-wrap">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="جستجو نام، پورت، مبدأ..."
                className="flex-1 min-w-[160px] h-34 rounded-8 border border-border bg-white/60 px-12 text-[13px] placeholder:text-text-placeholder outline-none focus:border-border-strong"
                dir="rtl" />
              <select value={directionFilter} onChange={e => setDirection(e.target.value)}
                className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] outline-none cursor-pointer" dir="rtl">
                <option value="all">همه جهت‌ها</option>
                <option value="inbound">ورودی</option>
                <option value="outbound">خروجی</option>
              </select>
              <select value={actionFilter} onChange={e => setAction(e.target.value)}
                className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] outline-none cursor-pointer" dir="rtl">
                <option value="all">همه قوانین</option>
                <option value="allow">مجاز</option>
                <option value="deny">مسدود</option>
              </select>
            </div>
            {filtered.length === 0 ? <EmptyState icon="⬡" title="قانونی یافت نشد" /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-start px-12 py-10 text-[12px] font-medium text-text-muted">نام قانون</th>
                      <th className="text-start px-12 py-10 text-[12px] font-medium text-text-muted">جهت</th>
                      <th className="text-start px-12 py-10 text-[12px] font-medium text-text-muted">عملکرد</th>
                      <th className="text-start px-12 py-10 text-[12px] font-medium text-text-muted hidden md:table-cell">پورت</th>
                      <th className="text-start px-12 py-10 text-[12px] font-medium text-text-muted hidden lg:table-cell">هیت‌های امروز</th>
                      <th className="px-12 py-10 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={r.id} className={`border-b border-border last:border-0 hover:bg-brand-light/30 transition-colors ${i % 2 !== 0 ? "bg-white/20" : ""}`}>
                        <td className="px-12 py-10">
                          <div className="flex items-center gap-8">
                            <span className={`w-7 h-7 rounded-full shrink-0 ${r.status === "active" ? "bg-success" : "bg-border-strong"}`} />
                            <span className="ltr-text text-[12px] font-medium text-text-main">{r.name}</span>
                          </div>
                        </td>
                        <td className="px-12 py-10">
                          <StatusBadge variant={r.direction === "inbound" ? "info" : "success"}>
                            {r.direction === "inbound" ? "ورودی" : "خروجی"}
                          </StatusBadge>
                        </td>
                        <td className="px-12 py-10">
                          <StatusBadge variant={r.action === "allow" ? "success" : "danger"}>
                            {r.action === "allow" ? "مجاز" : "مسدود"}
                          </StatusBadge>
                        </td>
                        <td className="px-12 py-10 hidden md:table-cell">
                          <span className="ltr-text font-mono text-[12px] text-text-muted">{r.portRange}</span>
                        </td>
                        <td className="px-12 py-10 hidden lg:table-cell"><HitBar hits={r.hits} /></td>
                        <td className="px-12 py-10">
                          <ActionMenu items={[
                            { label: "ویرایش قانون",  onClick: () => {} },
                            { label: r.status === "active" ? "غیرفعال کردن" : "فعال کردن", onClick: () => {} },
                            { label: "حذف قانون",     onClick: () => {}, danger: true },
                          ]} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </DashboardShell>
  );
}
