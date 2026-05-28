"use client";

import Link from "next/link";

const INTEGRATIONS = [
  { name: "LDAP / Active Directory", category: "Identity",  status: "healthy",  latency: 22,   lastSync: "۵ دقیقه پیش",  syncCount: 1_847, endpoint: "ldap://10.0.0.100:389"     },
  { name: "SMTP (ایمیل)",            category: "Notify",    status: "healthy",  latency: 310,  lastSync: "۲ ساعت پیش",   syncCount: 412,   endpoint: "smtp.example.ir:587"        },
  { name: "SMS Gateway",             category: "Notify",    status: "degraded", latency: 980,  lastSync: "۱۵ دقیقه پیش", syncCount: 88,    endpoint: "api.smsir.ir"               },
  { name: "Stripe / درگاه پرداخت",   category: "Billing",  status: "healthy",  latency: 180,  lastSync: "۱ ساعت پیش",   syncCount: 234,   endpoint: "api.stripe.com"             },
  { name: "Grafana",                 category: "Monitoring",status: "healthy",  latency: 45,   lastSync: "۱ دقیقه پیش",  syncCount: 9_200, endpoint: "grafana.internal:3000"      },
  { name: "Prometheus",              category: "Monitoring",status: "healthy",  latency: 12,   lastSync: "۳۰ ثانیه پیش", syncCount: 48_200,endpoint: "prometheus.internal:9090"   },
  { name: "S3-compatible (backup)",  category: "Storage",  status: "healthy",  latency: 88,   lastSync: "۳۰ دقیقه پیش", syncCount: 72,    endpoint: "s3.backup.internal"         },
  { name: "Vault (Secrets)",         category: "Security",  status: "healthy",  latency: 8,    lastSync: "۲ دقیقه پیش",  syncCount: 5_100, endpoint: "vault.internal:8200"        },
  { name: "GitLab CI",               category: "DevOps",    status: "down",     latency: 0,    lastSync: "۲ ساعت پیش",   syncCount: 14,    endpoint: "gitlab.internal"            },
  { name: "Slack Webhook",           category: "Notify",    status: "healthy",  latency: 420,  lastSync: "۳۰ دقیقه پیش", syncCount: 310,   endpoint: "hooks.slack.com"            },
];

const STATUS_DOT: Record<string, string> = { healthy: "#16a34a", degraded: "#d97706", down: "#dc2626" };
const STATUS_BG: Record<string, string>  = { healthy: "bg-green-100 text-green-700", degraded: "bg-amber-100 text-amber-700", down: "bg-red-100 text-red-700" };
const STATUS_LABEL: Record<string, string> = { healthy: "آنلاین", degraded: "تنزل", down: "آفلاین" };

export default function IntegrationHealthPage() {
  const healthy  = INTEGRATIONS.filter((i) => i.status === "healthy").length;
  const degraded = INTEGRATIONS.filter((i) => i.status === "degraded").length;
  const down     = INTEGRATIONS.filter((i) => i.status === "down").length;

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">سلامت یکپارچه‌سازی‌ها</h1>
            <p className="text-[12px] text-text-muted mt-2">وضعیت اتصال به سرویس‌های خارجی و داخلی</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand">← پنل ادمین</Link>
        </div>
        <div className="grid grid-cols-3 gap-12">
          {[{ label: "آنلاین", value: healthy, color: "#16a34a" }, { label: "تنزل", value: degraded, color: "#d97706" }, { label: "آفلاین", value: down, color: "#dc2626" }].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[22px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border text-text-muted bg-bg/50">
              <th className="text-start px-16 py-12 font-medium">یکپارچه‌سازی</th>
              <th className="text-start py-12 font-medium">دسته</th>
              <th className="text-start py-12 font-medium">وضعیت</th>
              <th className="text-start py-12 font-medium">تأخیر</th>
              <th className="text-start py-12 font-medium">آخرین همگام‌سازی</th>
              <th className="text-start py-12 font-medium">تعداد همگام</th>
              <th className="text-start py-12 font-medium">Endpoint</th>
            </tr>
          </thead>
          <tbody>
            {INTEGRATIONS.map((i) => (
              <tr key={i.name} className="border-b border-border/50 hover:bg-bg/60">
                <td className="px-16 py-11">
                  <div className="flex items-center gap-7">
                    <div className="w-6 h-6 rounded-999 shrink-0" style={{ background: STATUS_DOT[i.status] }} />
                    <span className="font-medium text-text-main">{i.name}</span>
                  </div>
                </td>
                <td className="py-11 text-text-muted">{i.category}</td>
                <td className="py-11">
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${STATUS_BG[i.status]}`}>{STATUS_LABEL[i.status]}</span>
                </td>
                <td className={`py-11 ltr-text font-mono text-[11px] ${i.latency === 0 ? "text-text-muted" : i.latency > 500 ? "text-amber-600" : "text-text-main"}`} style={{ direction: "ltr" }}>
                  {i.latency === 0 ? "—" : i.latency >= 1000 ? `${(i.latency/1000).toFixed(1)}s` : `${i.latency}ms`}
                </td>
                <td className="py-11 text-text-muted">{i.lastSync}</td>
                <td className="py-11 text-text-muted ltr-text font-mono" style={{ direction: "ltr" }}>{i.syncCount.toLocaleString()}</td>
                <td className="py-11 text-text-muted font-mono ltr-text text-[10px] truncate max-w-[180px]" style={{ direction: "ltr" }}>{i.endpoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
