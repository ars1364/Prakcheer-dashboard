"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const LIMITS = [
  { endpoint: "GET /v1/instances",          tier: "همه",        rpm: 120, used: 87,  window: "۱ دقیقه" },
  { endpoint: "POST /v1/instances",         tier: "pro+",       rpm: 10,  used: 3,   window: "۱ دقیقه" },
  { endpoint: "GET /v1/volumes",            tier: "همه",        rpm: 120, used: 45,  window: "۱ دقیقه" },
  { endpoint: "POST /v1/volumes",           tier: "pro+",       rpm: 10,  used: 1,   window: "۱ دقیقه" },
  { endpoint: "GET /v1/networks",           tier: "همه",        rpm: 120, used: 30,  window: "۱ دقیقه" },
  { endpoint: "POST /v1/k8s/clusters",      tier: "enterprise", rpm: 5,   used: 0,   window: "۵ دقیقه" },
  { endpoint: "GET /v1/usage",              tier: "همه",        rpm: 30,  used: 29,  window: "۱ دقیقه" },
  { endpoint: "GET /v1/invoices",           tier: "همه",        rpm: 30,  used: 8,   window: "۱ دقیقه" },
];

const CHART_DATA = [
  { t: "۰۰:۰۰", req: 12 }, { t: "۰۲:۰۰", req: 8  }, { t: "۰۴:۰۰", req: 5  },
  { t: "۰۶:۰۰", req: 18 }, { t: "۰۸:۰۰", req: 54 }, { t: "۱۰:۰۰", req: 89 },
  { t: "۱۲:۰۰", req: 76 }, { t: "۱۴:۰۰", req: 95 }, { t: "۱۶:۰۰", req: 112 },
  { t: "۱۸:۰۰", req: 78 }, { t: "۲۰:۰۰", req: 43 }, { t: "۲۲:۰۰", req: 22 },
];

function UsageBar({ used, total }: { used: number; total: number }) {
  const pct = Math.round((used / total) * 100);
  const color = pct >= 90 ? "#dc2626" : pct >= 70 ? "#d97706" : "#16a34a";
  return (
    <div className="flex items-center gap-8">
      <div className="flex-1 h-4 rounded-full bg-bg overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[11px] font-mono w-[36px] text-end" style={{ color }}>{pct}٪</span>
    </div>
  );
}

export default function RateLimitPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">محدودیت نرخ</h1>
            <p className="text-[12px] text-text-muted mt-2">مصرف API و سقف‌های درخواست</p>
          </div>
          <div className="glass rounded-8 px-12 py-6 text-[11px] text-text-muted">
            پلن جاری: <span className="font-bold text-brand">Pro</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "درخواست امروز",  value: "۸۴۳",  color: "#2554d8" },
            { label: "در یک دقیقه",    value: "۸۷",   color: "#d97706" },
            { label: "نزدیک سقف",      value: LIMITS.filter((l) => (l.used / l.rpm) >= 0.9).length, color: "#dc2626" },
            { label: "HTTP 429 امروز", value: "۳",    color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-20">
        <h2 className="text-[13px] font-bold text-text-main mb-14">تعداد درخواست در ۲۴ ساعت</h2>
        <div className="ltr-text h-[160px]" style={{ direction: "ltr" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2554d8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2554d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)", fill: "var(--color-text-muted)" }} />
              <YAxis tick={{ fontSize: 10, fontFamily: "var(--font-vazirmatn)", fill: "var(--color-text-muted)" }} />
              <Tooltip contentStyle={{ background: "var(--color-glass)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="req" stroke="#2554d8" fill="url(#reqGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">Endpoint</th>
              <th className="text-start py-12 font-medium">پلن</th>
              <th className="text-start py-12 font-medium">سقف</th>
              <th className="text-start py-12 font-medium">مصرف</th>
              <th className="py-12 text-start font-medium w-[180px]">استفاده</th>
            </tr>
          </thead>
          <tbody>
            {LIMITS.map((l) => (
              <tr key={l.endpoint} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11 font-mono text-[11px] text-text-main ltr-text" style={{ direction: "ltr" }}>{l.endpoint}</td>
                <td className="py-11">
                  <span className="px-7 py-2 rounded-4 bg-brand/10 text-brand text-[10px] font-medium">{l.tier}</span>
                </td>
                <td className="py-11 text-text-muted">{l.rpm} / {l.window}</td>
                <td className="py-11 font-semibold text-text-main">{l.used}</td>
                <td className="py-11 pe-16 w-[180px]"><UsageBar used={l.used} total={l.rpm} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass rounded-16 p-16">
        <h3 className="text-[13px] font-bold text-text-main mb-10">هدرهای پاسخ</h3>
        <div className="flex flex-col gap-6 ltr-text text-[11px] font-mono text-text-muted" style={{ direction: "ltr" }}>
          <div className="flex gap-16"><span className="text-brand w-[220px]">X-RateLimit-Limit</span><span>120</span></div>
          <div className="flex gap-16"><span className="text-brand w-[220px]">X-RateLimit-Remaining</span><span>33</span></div>
          <div className="flex gap-16"><span className="text-brand w-[220px]">X-RateLimit-Reset</span><span>1714222800</span></div>
          <div className="flex gap-16"><span className="text-brand w-[220px]">Retry-After</span><span>در صورت 429 — ثانیه تا ریست</span></div>
        </div>
      </div>
    </div>
  );
}
