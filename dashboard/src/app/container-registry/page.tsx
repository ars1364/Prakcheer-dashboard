"use client";

import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ─── types ─── */
type RepoVisibility = "خصوصی" | "عمومی";

interface ImageTag {
  tag: string;
  digest: string;
  size_mb: number;
  pushed: string;
  pulls: number;
  os: string;
  arch: string;
}

interface Repository {
  id: string;
  name: string;
  namespace: string;
  visibility: RepoVisibility;
  size_mb: number;
  tags: number;
  pulls_total: number;
  pulls_today: number;
  last_push: string;
  description: string;
  topTags: ImageTag[];
}

/* ─── mock data ─── */
const ALL_REPOS: Repository[] = [
  {
    id: "rep1", name: "api-gateway",    namespace: "prakcheer", visibility: "خصوصی", size_mb: 420,  tags: 18, pulls_total: 18400, pulls_today: 284,  last_push: "۲ ساعت پیش",    description: "Gateway سرویس اصلی API",
    topTags: [
      { tag: "latest",  digest: "sha256:a1b2c3...", size_mb: 84,  pushed: "۲ ساعت پیش",  pulls: 142, os: "linux", arch: "amd64" },
      { tag: "v2.4.1",  digest: "sha256:d4e5f6...", size_mb: 84,  pushed: "۱ روز پیش",   pulls: 98,  os: "linux", arch: "amd64" },
      { tag: "v2.4.0",  digest: "sha256:g7h8i9...", size_mb: 82,  pushed: "۷ روز پیش",   pulls: 44,  os: "linux", arch: "amd64" },
    ],
  },
  {
    id: "rep2", name: "user-service",   namespace: "prakcheer", visibility: "خصوصی", size_mb: 210,  tags: 24, pulls_total: 22800, pulls_today: 312,  last_push: "۱ ساعت پیش",    description: "سرویس مدیریت کاربران",
    topTags: [
      { tag: "latest",  digest: "sha256:j1k2l3...", size_mb: 42,  pushed: "۱ ساعت پیش",  pulls: 168, os: "linux", arch: "amd64" },
      { tag: "v3.1.0",  digest: "sha256:m4n5o6...", size_mb: 42,  pushed: "۳ روز پیش",   pulls: 120, os: "linux", arch: "amd64" },
    ],
  },
  {
    id: "rep3", name: "frontend",       namespace: "prakcheer", visibility: "خصوصی", size_mb: 180,  tags: 31, pulls_total: 31200, pulls_today: 420,  last_push: "۳۰ دقیقه پیش",  description: "تصویر Next.js فرانت‌اند",
    topTags: [
      { tag: "latest",  digest: "sha256:p7q8r9...", size_mb: 38,  pushed: "۳۰ دقیقه پیش",pulls: 210, os: "linux", arch: "amd64" },
      { tag: "v1.8.2",  digest: "sha256:s1t2u3...", size_mb: 37,  pushed: "۲ روز پیش",   pulls: 180, os: "linux", arch: "amd64" },
    ],
  },
  {
    id: "rep4", name: "ml-worker",      namespace: "prakcheer", visibility: "خصوصی", size_mb: 8400, tags: 8,  pulls_total: 4200,  pulls_today: 42,   last_push: "۱ روز پیش",    description: "worker پردازش ML با CUDA",
    topTags: [
      { tag: "cuda-12.1",digest: "sha256:v4w5x6...",size_mb: 8400,pushed: "۱ روز پیش",   pulls: 28,  os: "linux", arch: "amd64" },
    ],
  },
  {
    id: "rep5", name: "nginx-base",     namespace: "prakcheer", visibility: "عمومی",  size_mb: 28,   tags: 6,  pulls_total: 84000, pulls_today: 1240, last_push: "۳ روز پیش",    description: "تصویر base Nginx برای داخلی",
    topTags: [
      { tag: "1.25-alpine",digest: "sha256:y7z8a9...",size_mb: 12, pushed: "۳ روز پیش",  pulls: 840, os: "linux", arch: "amd64" },
      { tag: "1.24-alpine",digest: "sha256:b1c2d3...",size_mb: 11, pushed: "۱ ماه پیش",  pulls: 320, os: "linux", arch: "amd64" },
    ],
  },
  {
    id: "rep6", name: "payment-service",namespace: "prakcheer", visibility: "خصوصی", size_mb: 120,  tags: 15, pulls_total: 9800,  pulls_today: 140,  last_push: "۴ ساعت پیش",   description: "سرویس پرداخت و صورتحساب",
    topTags: [
      { tag: "latest",   digest: "sha256:e4f5g6...",size_mb: 48,  pushed: "۴ ساعت پیش",  pulls: 98,  os: "linux", arch: "amd64" },
    ],
  },
  {
    id: "rep7", name: "data-pipeline",  namespace: "data-team",  visibility: "خصوصی", size_mb: 620,  tags: 11, pulls_total: 3400,  pulls_today: 28,   last_push: "۱ هفته پیش",   description: "pipeline پردازش داده ETL",
    topTags: [
      { tag: "v0.9.2",   digest: "sha256:h7i8j9...",size_mb: 280, pushed: "۱ هفته پیش",  pulls: 24,  os: "linux", arch: "arm64" },
    ],
  },
];

const PULL_TIMELINE = [
  { h: "۰۰", pulls: 480  }, { h: "۰۲", pulls: 320  }, { h: "۰۴", pulls: 220  },
  { h: "۰۶", pulls: 380  }, { h: "۰۸", pulls: 920  }, { h: "۱۰", pulls: 1840 },
  { h: "۱۲", pulls: 2480 }, { h: "۱۴", pulls: 2140 }, { h: "۱۶", pulls: 1820 },
  { h: "۱۸", pulls: 1480 }, { h: "۲۰", pulls: 1040 }, { h: "۲۲", pulls: 720  },
];

const TOP_REPOS_DATA = ALL_REPOS
  .sort((a, b) => b.pulls_today - a.pulls_today)
  .slice(0, 6)
  .map(r => ({ name: r.name, pulls: r.pulls_today }));

/* ─── colors ─── */
const VIS_COLOR: Record<RepoVisibility, string> = {
  "خصوصی": "#2554d8",
  "عمومی":  "#16a34a",
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

/* ─── size formatter ─── */
function fmtSize(mb: number): string {
  if (mb >= 1024) return `${(mb/1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

/* ─── page ─── */
export default function ContainerRegistryPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [nsFilter, setNsFilter] = useState<string>("all");

  const namespaces = useMemo(() => ["all", ...Array.from(new Set(ALL_REPOS.map(r => r.namespace)))], []);

  const filtered = useMemo(() => {
    let repos = ALL_REPOS;
    if (nsFilter !== "all") repos = repos.filter(r => r.namespace === nsFilter);
    if (search) repos = repos.filter(r => r.name.includes(search));
    return repos;
  }, [nsFilter, search]);

  const totalSize     = ALL_REPOS.reduce((s, r) => s + r.size_mb, 0);
  const totalPulls    = ALL_REPOS.reduce((s, r) => s + r.pulls_today, 0);
  const privateCount  = ALL_REPOS.filter(r => r.visibility === "خصوصی").length;
  const publicCount   = ALL_REPOS.filter(r => r.visibility === "عمومی").length;
  const totalTags     = ALL_REPOS.reduce((s, r) => s + r.tags, 0);

  /* visibility segmented bar */
  const maxSize = Math.max(...ALL_REPOS.map(r => r.size_mb));

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[14px] font-bold text-text-main">رجیستری Container</h2>
          <span className="text-[12px] text-text-muted ltr-text">{fmtSize(totalSize)} فضای مصرفی</span>
        </div>

        {/* repo size distribution bars */}
        <div className="flex flex-col gap-5 mb-14">
          <p className="text-[11px] text-text-muted mb-4">حجم به تفکیک مخزن</p>
          {ALL_REPOS.sort((a, b) => b.size_mb - a.size_mb).slice(0, 5).map(r => (
            <div key={r.id} className="flex items-center gap-10">
              <span className="text-[11px] text-text-muted ltr-text w-[140px] truncate shrink-0">{r.namespace}/{r.name}</span>
              <div className="flex-1 h-8 rounded-999 bg-[#e2e8f0] overflow-hidden">
                <div style={{ width: `${(r.size_mb / maxSize) * 100}%`, background: VIS_COLOR[r.visibility] }}
                  className="h-full rounded-999" />
              </div>
              <span className="text-[11px] text-text-muted ltr-text w-[52px] text-end shrink-0">{fmtSize(r.size_mb)}</span>
            </div>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "مخازن خصوصی",  value: privateCount,              color: "#2554d8" },
            { label: "مخازن عمومی",   value: publicCount,               color: "#16a34a" },
            { label: "Tag کل",       value: totalTags,                  color: "#8b5cf6" },
            { label: "Pull امروز",   value: totalPulls.toLocaleString(), color: "#d97706" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[22px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* pull timeline */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">Pull امروز — ساعتی</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PULL_TIMELINE} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="pullGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2554d8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2554d8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="h" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="pulls" name="Pull" stroke="#2554d8" fill="url(#pullGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* top repos by pulls */}
        <div className="glass rounded-16 p-16">
          <p className="text-[13px] font-semibold text-text-main mb-12">پرمصرف‌ترین مخازن امروز</p>
          <div className="ltr-text h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_REPOS_DATA} layout="vertical" margin={{ top: 0, right: 16, left: 110, bottom: 0 }} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)" }} width={110} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="pulls" name="Pull" fill="#2554d8" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─── repository table ─── */}
      <div className="glass rounded-16 p-16">
        <div className="flex flex-wrap items-center gap-10 mb-14">
          <h3 className="text-[13px] font-semibold text-text-main flex-1">مخازن</h3>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="جستجو مخزن..."
            className="border border-border rounded-8 px-10 py-6 text-[12px] bg-bg text-text-main w-[160px] outline-none"
          />
          {namespaces.map(ns => (
            <button key={ns} onClick={() => setNsFilter(ns)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ltr-text ${nsFilter === ns ? "bg-brand text-white" : "bg-bg text-text-muted hover:text-text-main border border-border"}`}>
              {ns === "all" ? "همه" : ns}
            </button>
          ))}
          <button className="flex items-center gap-6 px-12 py-6 rounded-8 text-[12px] font-medium bg-brand text-white hover:bg-brand/90 transition-colors">
            + مخزن جدید
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {filtered.map(repo => (
            <div key={repo.id} className="border border-border rounded-12 overflow-hidden">
              {/* repo row */}
              <div className="flex items-center gap-14 px-16 py-12 cursor-pointer hover:bg-bg/30 transition-colors"
                onClick={() => setExpanded(expanded === repo.id ? null : repo.id)}>
                <span className="text-text-muted text-[10px]">{expanded === repo.id ? "▲" : "▶"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-10 mb-3">
                    <span className="text-[12px] font-bold text-text-main ltr-text">{repo.namespace}/{repo.name}</span>
                    <span className="px-7 py-2 rounded-4 text-[10px] font-medium"
                      style={{ background: `${VIS_COLOR[repo.visibility]}15`, color: VIS_COLOR[repo.visibility] }}>
                      {repo.visibility}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted">{repo.description}</p>
                </div>
                <div className="hidden lg:flex items-center gap-20 text-[11px] text-text-muted shrink-0">
                  <div className="text-center">
                    <p className="font-mono text-text-main">{repo.tags}</p>
                    <p>Tag</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-text-main ltr-text">{fmtSize(repo.size_mb)}</p>
                    <p>حجم</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-text-main">{repo.pulls_today.toLocaleString()}</p>
                    <p>Pull/روز</p>
                  </div>
                  <div className="text-center">
                    <p className="text-text-main">{repo.last_push}</p>
                    <p>آخرین push</p>
                  </div>
                </div>
              </div>

              {/* expanded tags */}
              {expanded === repo.id && (
                <div className="border-t border-border bg-bg/30 p-14">
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-8">Tags</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="border-b border-border/40 text-text-muted">
                          <th className="text-start pb-6 font-medium">Tag</th>
                          <th className="text-start pb-6 font-medium">Digest</th>
                          <th className="text-start pb-6 font-medium">OS/Arch</th>
                          <th className="text-start pb-6 font-medium">حجم</th>
                          <th className="text-start pb-6 font-medium">Pull</th>
                          <th className="text-start pb-6 font-medium">Push شد</th>
                          <th className="pb-6 font-medium" />
                        </tr>
                      </thead>
                      <tbody>
                        {repo.topTags.map(t => (
                          <tr key={t.tag} className="border-b border-border/20 last:border-0">
                            <td className="py-7">
                              <span className="px-8 py-3 rounded-4 font-mono font-bold bg-[#2554d8]15 text-brand ltr-text">{t.tag}</span>
                            </td>
                            <td className="py-7 ltr-text font-mono text-text-muted text-[10px]">{t.digest}</td>
                            <td className="py-7 ltr-text text-text-muted">{t.os}/{t.arch}</td>
                            <td className="py-7 ltr-text text-text-muted">{fmtSize(t.size_mb)}</td>
                            <td className="py-7 ltr-text font-mono text-text-muted">{t.pulls.toLocaleString()}</td>
                            <td className="py-7 text-text-muted">{t.pushed}</td>
                            <td className="py-7 text-end">
                              <button className="px-8 py-3 rounded-4 text-[10px] border border-border text-text-muted hover:text-text-main hover:bg-bg transition-colors ltr-text">
                                docker pull
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
