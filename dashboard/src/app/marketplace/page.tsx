"use client";

import { useState, useMemo } from "react";

/* ─── types ─── */
type AppCategory = "پایگاه داده" | "مانیتورینگ" | "امنیت" | "DevOps" | "ذخیره‌سازی" | "شبکه" | "AI/ML" | "CMS";
type AppStatus   = "نصب شده" | "موجود" | "پرمیوم";

interface MarketApp {
  id: string;
  name: string;
  category: AppCategory;
  description: string;
  version: string;
  status: AppStatus;
  rating: number;
  installs: number;
  price: string;
  publisher: string;
  tags: string[];
  icon_color: string;
  icon_letter: string;
}

/* ─── mock data ─── */
const ALL_APPS: MarketApp[] = [
  { id: "a1",  name: "Prometheus",    category: "مانیتورینگ", description: "سیستم مانیتورینگ و آلارم منبع‌باز",                    version: "2.48",  status: "نصب شده", rating: 4.9, installs: 1240, price: "رایگان",    publisher: "CNCF",          tags: ["metrics", "alerting"],     icon_color: "#e67e22", icon_letter: "P" },
  { id: "a2",  name: "Grafana",       category: "مانیتورینگ", description: "پلتفرم مصورسازی داده و observability",                  version: "10.2",  status: "نصب شده", rating: 4.8, installs: 1180, price: "رایگان",    publisher: "Grafana Labs",   tags: ["dashboard", "visualization"],icon_color: "#f39c12", icon_letter: "G" },
  { id: "a3",  name: "PostgreSQL",    category: "پایگاه داده", description: "قدرتمندترین پایگاه داده رابطه‌ای منبع‌باز",            version: "16.1",  status: "نصب شده", rating: 4.9, installs: 980,  price: "رایگان",    publisher: "PostgreSQL.org", tags: ["sql", "relational"],       icon_color: "#336791", icon_letter: "P" },
  { id: "a4",  name: "Redis",         category: "پایگاه داده", description: "ذخیره‌ساز کلید-مقدار سریع در RAM",                     version: "7.2",   status: "نصب شده", rating: 4.8, installs: 860,  price: "رایگان",    publisher: "Redis Ltd",      tags: ["cache", "nosql"],          icon_color: "#dc382d", icon_letter: "R" },
  { id: "a5",  name: "Nginx",         category: "شبکه",        description: "وب‌سرور و reverse proxy پرسرعت",                       version: "1.25",  status: "نصب شده", rating: 4.7, installs: 1420, price: "رایگان",    publisher: "F5 Networks",    tags: ["webserver", "proxy"],      icon_color: "#009900", icon_letter: "N" },
  { id: "a6",  name: "MinIO",         category: "ذخیره‌سازی",  description: "سرویس object storage سازگار با S3",                    version: "RELEASE.2024", status: "موجود", rating: 4.6, installs: 540, price: "رایگان",   publisher: "MinIO Inc",      tags: ["s3", "storage"],           icon_color: "#c62a2a", icon_letter: "M" },
  { id: "a7",  name: "Vault",         category: "امنیت",       description: "مدیریت secret ها، رمزها و certificates",               version: "1.15",  status: "موجود",   rating: 4.7, installs: 420,  price: "رایگان",    publisher: "HashiCorp",      tags: ["secrets", "security"],     icon_color: "#1563ff", icon_letter: "V" },
  { id: "a8",  name: "ArgoCD",        category: "DevOps",      description: "GitOps continuous delivery برای Kubernetes",            version: "2.9",   status: "موجود",   rating: 4.8, installs: 380,  price: "رایگان",    publisher: "CNCF",           tags: ["gitops", "cd", "k8s"],     icon_color: "#ef7b4d", icon_letter: "A" },
  { id: "a9",  name: "Loki",          category: "مانیتورینگ", description: "سیستم aggregate کردن log مانند Prometheus",             version: "2.9",   status: "موجود",   rating: 4.6, installs: 340,  price: "رایگان",    publisher: "Grafana Labs",   tags: ["logs", "observability"],   icon_color: "#f7b731", icon_letter: "L" },
  { id: "a10", name: "Cert-Manager",  category: "امنیت",       description: "مدیریت خودکار TLS certificates در K8s",                 version: "1.13",  status: "نصب شده", rating: 4.7, installs: 680,  price: "رایگان",    publisher: "Jetstack",       tags: ["tls", "ssl", "k8s"],       icon_color: "#326ce5", icon_letter: "C" },
  { id: "a11", name: "Elasticsearch", category: "پایگاه داده", description: "موتور جستجو و آنالیز توزیع‌شده",                       version: "8.11",  status: "موجود",   rating: 4.5, installs: 280,  price: "رایگان",    publisher: "Elastic",        tags: ["search", "analytics"],     icon_color: "#f04e98", icon_letter: "E" },
  { id: "a12", name: "TensorFlow",    category: "AI/ML",       description: "پلتفرم یادگیری ماشین open-source گوگل",                version: "2.14",  status: "موجود",   rating: 4.6, installs: 220,  price: "رایگان",    publisher: "Google",         tags: ["ml", "deeplearning"],      icon_color: "#ff6f00", icon_letter: "T" },
  { id: "a13", name: "WordPress",     category: "CMS",         description: "محبوب‌ترین CMS دنیا با هزاران پلاگین",                  version: "6.4",   status: "موجود",   rating: 4.3, installs: 480,  price: "رایگان",    publisher: "WordPress.org",  tags: ["cms", "blog"],             icon_color: "#21759b", icon_letter: "W" },
  { id: "a14", name: "Datadog APM",   category: "مانیتورینگ", description: "پلتفرم monitoring و tracing سازمانی",                   version: "latest",status: "پرمیوم",  rating: 4.8, installs: 140,  price: "۲.۴M ت/ماه",publisher: "Datadog",        tags: ["apm", "tracing", "saas"],  icon_color: "#632ca6", icon_letter: "D" },
  { id: "a15", name: "Wazuh SIEM",    category: "امنیت",       description: "SIEM و HIDS open-source برای threat detection",         version: "4.7",   status: "موجود",   rating: 4.5, installs: 180,  price: "رایگان",    publisher: "Wazuh Inc",      tags: ["siem", "hids", "xdr"],     icon_color: "#009BDE", icon_letter: "W" },
  { id: "a16", name: "GitLab CI",     category: "DevOps",      description: "پلتفرم کامل DevSecOps با CI/CD یکپارچه",               version: "16.8",  status: "پرمیوم",  rating: 4.7, installs: 240,  price: "۴M ت/ماه",  publisher: "GitLab Inc",     tags: ["cicd", "devops", "git"],   icon_color: "#fc6d26", icon_letter: "G" },
];

/* ─── colors ─── */
const CAT_COLOR: Record<AppCategory, string> = {
  "پایگاه داده": "#2554d8",
  "مانیتورینگ":  "#f39c12",
  "امنیت":       "#ef4444",
  "DevOps":      "#16a34a",
  "ذخیره‌سازی": "#8b5cf6",
  "شبکه":        "#06b6d4",
  "AI/ML":       "#f97316",
  "CMS":         "#94a3b8",
};

const STATUS_COLOR: Record<AppStatus, string> = {
  "نصب شده": "#16a34a",
  "موجود":   "#2554d8",
  "پرمیوم":  "#d97706",
};

/* ─── star rating ─── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-3 ltr-text">
      {[1,2,3,4,5].map(i => (
        <span key={i} className="text-[10px]" style={{ color: i <= Math.round(rating) ? "#f59e0b" : "#e2e8f0" }}>★</span>
      ))}
      <span className="text-[11px] text-text-muted ms-2">{rating}</span>
    </div>
  );
}

/* ─── page ─── */
export default function MarketplacePage() {
  const [catFilter, setCatFilter] = useState<AppCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let apps = ALL_APPS;
    if (catFilter !== "all") apps = apps.filter(a => a.category === catFilter);
    if (statusFilter !== "all") apps = apps.filter(a => a.status === statusFilter);
    if (search) apps = apps.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.tags.some(t => t.includes(search)));
    return apps;
  }, [catFilter, statusFilter, search]);

  const installedCount = ALL_APPS.filter(a => a.status === "نصب شده").length;
  const availableCount = ALL_APPS.filter(a => a.status === "موجود").length;
  const premiumCount   = ALL_APPS.filter(a => a.status === "پرمیوم").length;

  /* category breakdown */
  const catCounts = useMemo(() => {
    const g: Partial<Record<AppCategory, number>> = {};
    ALL_APPS.forEach(a => { g[a.category] = (g[a.category] || 0) + 1; });
    return Object.entries(g).map(([cat, count]) => ({ cat: cat as AppCategory, count: count as number }));
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-32" style={{ direction: "rtl" }}>

      {/* ─── header stat panel ─── */}
      <div className="glass rounded-16 px-20 py-16">
        <div className="flex items-center justify-between mb-14">
          <h2 className="text-[14px] font-bold text-text-main">مارکت‌پلیس سرویس‌ها</h2>
          <span className="text-[12px] text-text-muted">{ALL_APPS.length} اپلیکیشن</span>
        </div>

        {/* category segmented bar */}
        <div className="flex h-12 rounded-999 overflow-hidden gap-1 mb-8">
          {catCounts.map(g => (
            <div key={g.cat} title={`${g.cat}: ${g.count}`}
              style={{ flex: g.count, background: CAT_COLOR[g.cat] }}
              className="rounded-999 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setCatFilter(catFilter === g.cat ? "all" : g.cat)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-10 mb-14">
          {catCounts.map(g => (
            <button key={g.cat} onClick={() => setCatFilter(catFilter === g.cat ? "all" : g.cat)}
              className={`flex items-center gap-5 text-[11px] transition-colors ${catFilter === g.cat ? "font-semibold" : "text-text-muted"}`}>
              <span className="w-7 h-7 rounded-999 shrink-0" style={{ background: CAT_COLOR[g.cat] }} />
              {g.cat} ({g.count})
            </button>
          ))}
        </div>

        {/* stat tiles */}
        <div className="grid grid-cols-3 gap-12">
          {[
            { label: "نصب شده",  value: installedCount, color: "#16a34a" },
            { label: "موجود",    value: availableCount, color: "#2554d8" },
            { label: "پرمیوم",   value: premiumCount,   color: "#d97706" },
          ].map(s => (
            <div key={s.label} className="rounded-12 px-14 py-10" style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
              <p className="text-[11px] text-text-muted mb-2">{s.label}</p>
              <p className="text-[26px] font-bold ltr-text" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── filters + view toggle ─── */}
      <div className="flex flex-wrap items-center gap-10">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="جستجو اپلیکیشن..."
          className="border border-border rounded-8 px-10 py-7 text-[12px] bg-[var(--color-glass)] text-text-main w-[200px] outline-none"
        />
        <div className="flex gap-6">
          {(["all", "نصب شده", "موجود", "پرمیوم"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-10 py-5 rounded-6 text-[11px] font-medium transition-colors ${statusFilter === s ? "bg-brand text-white" : "bg-[var(--color-glass)] text-text-muted hover:text-text-main border border-border"}`}>
              {s === "all" ? "همه" : s}
            </button>
          ))}
        </div>
        <div className="flex gap-4 ms-auto">
          <button onClick={() => setView("grid")}
            className={`px-10 py-5 rounded-6 text-[11px] transition-colors ${view === "grid" ? "bg-brand text-white" : "border border-border text-text-muted"}`}>
            ⊞ کارت
          </button>
          <button onClick={() => setView("list")}
            className={`px-10 py-5 rounded-6 text-[11px] transition-colors ${view === "list" ? "bg-brand text-white" : "border border-border text-text-muted"}`}>
            ≡ لیست
          </button>
        </div>
      </div>

      {/* ─── grid view ─── */}
      {view === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-14">
          {filtered.map(app => (
            <div key={app.id} className="glass rounded-16 p-16 flex flex-col gap-12 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-12">
                <div className="w-40 h-40 rounded-12 flex items-center justify-center text-white text-[16px] font-bold shrink-0"
                  style={{ background: app.icon_color }}>
                  {app.icon_letter}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-8 mb-2">
                    <p className="text-[13px] font-bold text-text-main ltr-text truncate">{app.name}</p>
                  </div>
                  <Stars rating={app.rating} />
                </div>
              </div>

              <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">{app.description}</p>

              <div className="flex flex-wrap gap-4">
                <span className="px-6 py-2 rounded-4 text-[10px] font-medium"
                  style={{ background: `${CAT_COLOR[app.category]}15`, color: CAT_COLOR[app.category] }}>
                  {app.category}
                </span>
                {app.tags.slice(0, 2).map(t => (
                  <span key={t} className="px-6 py-2 rounded-4 text-[10px] bg-[#e2e8f0] text-text-muted ltr-text">{t}</span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-8 border-t border-border/50">
                <div>
                  <p className="text-[11px] text-text-muted">v{app.version}</p>
                  <p className="text-[10px] text-text-muted">{app.installs.toLocaleString()} نصب</p>
                </div>
                <button
                  className="px-12 py-6 rounded-8 text-[11px] font-medium transition-colors"
                  style={app.status === "نصب شده"
                    ? { background: "#16a34a15", color: "#16a34a", border: "1px solid #16a34a30" }
                    : app.status === "پرمیوم"
                    ? { background: "#d9770615", color: "#d97706", border: "1px solid #d9770630" }
                    : { background: "var(--color-brand)", color: "white" }}>
                  {app.status === "نصب شده" ? "مدیریت" : app.status === "پرمیوم" ? `${app.price}` : "نصب"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── list view ─── */}
      {view === "list" && (
        <div className="glass rounded-16 p-16">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="text-start pb-8 font-medium">اپلیکیشن</th>
                  <th className="text-start pb-8 font-medium">دسته</th>
                  <th className="text-start pb-8 font-medium">نسخه</th>
                  <th className="text-start pb-8 font-medium">امتیاز</th>
                  <th className="text-start pb-8 font-medium">نصب‌ها</th>
                  <th className="text-start pb-8 font-medium">ناشر</th>
                  <th className="text-start pb-8 font-medium">قیمت</th>
                  <th className="pb-8 font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((app, i) => (
                  <tr key={app.id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-bg/20"}`}>
                    <td className="py-10">
                      <div className="flex items-center gap-10">
                        <div className="w-28 h-28 rounded-8 flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                          style={{ background: app.icon_color }}>
                          {app.icon_letter}
                        </div>
                        <div>
                          <p className="font-semibold text-text-main ltr-text">{app.name}</p>
                          <p className="text-[10px] text-text-muted mt-1 truncate max-w-[200px]">{app.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-10">
                      <span className="px-8 py-3 rounded-4 text-[10px] font-medium"
                        style={{ background: `${CAT_COLOR[app.category]}15`, color: CAT_COLOR[app.category] }}>
                        {app.category}
                      </span>
                    </td>
                    <td className="py-10 ltr-text font-mono text-[11px] text-text-muted">v{app.version}</td>
                    <td className="py-10"><Stars rating={app.rating} /></td>
                    <td className="py-10 ltr-text text-text-muted">{app.installs.toLocaleString()}</td>
                    <td className="py-10 ltr-text text-[11px] text-text-muted">{app.publisher}</td>
                    <td className="py-10 text-text-muted">{app.price}</td>
                    <td className="py-10 text-end">
                      <button
                        className="px-10 py-4 rounded-6 text-[11px] font-medium transition-colors"
                        style={app.status === "نصب شده"
                          ? { background: "#16a34a15", color: "#16a34a", border: "1px solid #16a34a30" }
                          : { background: "var(--color-brand)", color: "white", padding: "4px 12px", borderRadius: "6px" }}>
                        {app.status === "نصب شده" ? "نصب شده ✓" : "نصب"}
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
  );
}
