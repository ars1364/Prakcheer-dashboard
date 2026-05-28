"use client";

import { useState } from "react";
import Link from "next/link";

interface Output {
  stack:   string;
  key:     string;
  value:   string;
  desc:    string;
  type:    "ip" | "url" | "id" | "secret" | "string";
}

const OUTPUTS: Output[] = [
  { stack: "prod-web-app",     key: "lb_ip",            value: "185.20.14.44",                              desc: "آدرس IP load balancer",           type: "ip"     },
  { stack: "prod-web-app",     key: "web_server_ips",   value: "185.20.14.45, 185.20.14.46",                desc: "IP های web server",               type: "ip"     },
  { stack: "prod-web-app",     key: "db_endpoint",      value: "db-prod.internal:5432",                     desc: "آدرس اتصال به دیتابیس",           type: "url"    },
  { stack: "prod-web-app",     key: "db_password",      value: "••••••••",                                  desc: "رمز عبور دیتابیس",                type: "secret" },
  { stack: "k8s-main-cluster", key: "api_server_url",   value: "https://185.20.14.50:6443",                 desc: "آدرس Kubernetes API",             type: "url"    },
  { stack: "k8s-main-cluster", key: "cluster_id",       value: "kube-a7f92b",                               desc: "شناسه کلاستر",                    type: "id"     },
  { stack: "k8s-main-cluster", key: "node_count",       value: "3",                                         desc: "تعداد نود",                       type: "string" },
  { stack: "staging-web-app",  key: "lb_ip",            value: "185.20.14.48",                              desc: "آدرس IP load balancer staging",   type: "ip"     },
  { stack: "staging-web-app",  key: "app_url",          value: "https://staging.myapp.ir",                  desc: "آدرس staging environment",        type: "url"    },
  { stack: "monitoring",       key: "grafana_url",       value: "https://grafana.internal:3000",             desc: "آدرس Grafana dashboard",          type: "url"    },
  { stack: "monitoring",       key: "prometheus_url",    value: "https://prometheus.internal:9090",          desc: "آدرس Prometheus",                 type: "url"    },
  { stack: "base-network-prod",key: "vpc_id",            value: "net-vpc-c2d4f8",                            desc: "شناسه VPC اصلی",                  type: "id"     },
  { stack: "base-network-prod",key: "private_subnet",   value: "10.0.0.0/24",                               desc: "CIDR subnet خصوصی",               type: "string" },
];

const TYPE_COLOR: Record<string, string> = { ip: "#16a34a", url: "#2554d8", id: "#7c3aed", secret: "#dc2626", string: "#64748b" };

export default function StackOutputsPage() {
  const [stack, setStack]   = useState("همه");
  const [copied, setCopied] = useState<string | null>(null);

  const stacks = ["همه", ...Array.from(new Set(OUTPUTS.map((o) => o.stack)))];
  const filtered = stack === "همه" ? OUTPUTS : OUTPUTS.filter((o) => o.stack === stack);

  const copy = (val: string, key: string) => {
    if (val === "••••••••") return;
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">خروجی‌های Stack</h1>
            <p className="text-[12px] text-text-muted mt-2">مقادیر output استک‌های فعال</p>
          </div>
          <Link href="/automation/stacks" className="text-[12px] text-text-muted hover:text-brand">← stack‌ها</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل output",   value: OUTPUTS.length,                                       color: "#2554d8" },
            { label: "IP",          value: OUTPUTS.filter((o) => o.type === "ip").length,        color: "#16a34a" },
            { label: "URL",         value: OUTPUTS.filter((o) => o.type === "url").length,       color: "#2554d8" },
            { label: "secret",      value: OUTPUTS.filter((o) => o.type === "secret").length,    color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {stacks.map((s) => (
          <button key={s} onClick={() => setStack(s)}
            className={`px-10 py-5 rounded-6 text-[12px] font-medium transition-all ${stack === s ? "bg-brand text-white" : "border border-border text-text-muted"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {filtered.map((o) => (
          <div key={o.stack + o.key} className="glass rounded-12 p-14 border border-border flex items-center gap-12">
            <span className="px-7 py-2 rounded-4 text-[10px] font-medium shrink-0" style={{ background: `${TYPE_COLOR[o.type]}15`, color: TYPE_COLOR[o.type] }}>{o.type}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-8 mb-2">
                <p className="text-[11px] font-mono text-text-main">{o.stack}</p>
                <span className="text-text-muted text-[11px]">›</span>
                <p className="text-[11px] font-bold font-mono text-brand">{o.key}</p>
              </div>
              <p className="text-[11px] text-text-muted">{o.desc}</p>
            </div>
            <div className="flex items-center gap-8 shrink-0">
              <code className="text-[11px] font-mono text-text-main ltr-text" style={{ direction: "ltr" }}>{o.value}</code>
              <button onClick={() => copy(o.value, o.stack + o.key)}
                className="px-8 py-4 rounded-5 border border-border text-text-muted text-[10px] hover:bg-bg transition-colors">
                {copied === o.stack + o.key ? "✓" : "کپی"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
