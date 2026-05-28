"use client";

import { useState } from "react";
import Link from "next/link";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path:   string;
  desc:   string;
  tag:    string;
  auth:   boolean;
}

const ENDPOINTS: Endpoint[] = [
  { method: "GET",    path: "/v1/instances",          desc: "لیست همه سرورهای مجازی",               tag: "compute",  auth: true  },
  { method: "POST",   path: "/v1/instances",          desc: "ایجاد سرور مجازی جدید",                tag: "compute",  auth: true  },
  { method: "GET",    path: "/v1/instances/{id}",     desc: "مشخصات یک سرور مجازی",                 tag: "compute",  auth: true  },
  { method: "DELETE", path: "/v1/instances/{id}",     desc: "حذف سرور مجازی",                        tag: "compute",  auth: true  },
  { method: "POST",   path: "/v1/instances/{id}/action", desc: "اقدام روی سرور (start/stop/reboot)", tag: "compute",  auth: true  },
  { method: "GET",    path: "/v1/networks",           desc: "لیست شبکه‌ها",                          tag: "network",  auth: true  },
  { method: "POST",   path: "/v1/networks",           desc: "ایجاد شبکه جدید",                       tag: "network",  auth: true  },
  { method: "GET",    path: "/v1/floating-ips",       desc: "لیست IP شناور",                         tag: "network",  auth: true  },
  { method: "POST",   path: "/v1/floating-ips",       desc: "درخواست IP شناور جدید",                 tag: "network",  auth: true  },
  { method: "GET",    path: "/v1/volumes",            desc: "لیست دیسک‌های ذخیره‌سازی",             tag: "storage",  auth: true  },
  { method: "POST",   path: "/v1/volumes",            desc: "ایجاد دیسک جدید",                       tag: "storage",  auth: true  },
  { method: "PUT",    path: "/v1/volumes/{id}",       desc: "تغییر اندازه یا نام دیسک",             tag: "storage",  auth: true  },
  { method: "GET",    path: "/v1/snapshots",          desc: "لیست اسنپ‌شات‌ها",                     tag: "storage",  auth: true  },
  { method: "POST",   path: "/v1/snapshots",          desc: "ایجاد اسنپ‌شات",                        tag: "storage",  auth: true  },
  { method: "GET",    path: "/v1/k8s/clusters",       desc: "لیست کلاسترهای Kubernetes",            tag: "k8s",      auth: true  },
  { method: "POST",   path: "/v1/k8s/clusters",       desc: "ایجاد کلاستر K8s جدید",                tag: "k8s",      auth: true  },
  { method: "GET",    path: "/v1/k8s/clusters/{id}/kubeconfig", desc: "دریافت kubeconfig",          tag: "k8s",      auth: true  },
  { method: "GET",    path: "/v1/usage",              desc: "مصرف منابع در بازه زمانی",             tag: "billing",  auth: true  },
  { method: "GET",    path: "/v1/invoices",           desc: "لیست فاکتورها",                         tag: "billing",  auth: true  },
  { method: "GET",    path: "/v1/auth/token",         desc: "دریافت توکن دسترسی",                   tag: "auth",     auth: false },
  { method: "POST",   path: "/v1/auth/token/refresh", desc: "تجدید توکن",                           tag: "auth",     auth: false },
  { method: "DELETE", path: "/v1/auth/token",         desc: "ابطال توکن جاری",                      tag: "auth",     auth: true  },
];

const TAG_COLOR: Record<string, string> = {
  compute: "#2554d8", network: "#16a34a", storage: "#7c3aed",
  k8s: "#0891b2", billing: "#d97706", auth: "#dc2626",
};

const METHOD_COLOR: Record<string, string> = {
  GET: "#16a34a", POST: "#2554d8", PUT: "#d97706",
  DELETE: "#dc2626", PATCH: "#7c3aed",
};

export default function ApiDocsPage() {
  const [activeTag, setActiveTag] = useState("همه");
  const [expanded, setExpanded]   = useState<string | null>(null);

  const tags = ["همه", ...Array.from(new Set(ENDPOINTS.map((e) => e.tag)))];
  const filtered = activeTag === "همه" ? ENDPOINTS : ENDPOINTS.filter((e) => e.tag === activeTag);

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">مستندات API</h1>
            <p className="text-[12px] text-text-muted mt-2">مرجع کامل endpoint‌های REST API</p>
          </div>
          <div className="flex gap-8 items-center">
            <span className="text-[11px] text-text-muted ltr-text">base: <code className="bg-bg px-6 py-2 rounded-4">https://api.prakcheer.ir</code></span>
            <Link href="/devkit/api-keys" className="text-[12px] text-brand hover:underline">کلیدهای API →</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل endpoint",   value: ENDPOINTS.length,                               color: "#2554d8" },
            { label: "نیاز به auth",  value: ENDPOINTS.filter((e) => e.auth).length,         color: "#d97706" },
            { label: "GET",           value: ENDPOINTS.filter((e) => e.method === "GET").length, color: "#16a34a" },
            { label: "تغییردهنده",    value: ENDPOINTS.filter((e) => e.method !== "GET").length, color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        {tags.map((t) => (
          <button key={t} onClick={() => setActiveTag(t)}
            className={`px-12 py-6 rounded-8 text-[12px] font-medium transition-all ${activeTag === t ? "text-white" : "border border-border text-text-muted hover:text-text-main"}`}
            style={activeTag === t ? { background: TAG_COLOR[t] ?? "#2554d8" } : {}}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {filtered.map((ep) => {
          const key = ep.method + ep.path;
          const open = expanded === key;
          return (
            <div key={key} className="glass rounded-12 border border-border overflow-hidden">
              <button className="w-full flex items-center gap-12 px-16 py-12 hover:bg-bg/40 transition-colors text-start"
                onClick={() => setExpanded(open ? null : key)}>
                <span className="text-[11px] font-bold font-mono w-[52px] shrink-0" style={{ color: METHOD_COLOR[ep.method] }}>{ep.method}</span>
                <span className="text-[12px] font-mono text-text-main ltr-text flex-1" style={{ direction: "ltr" }}>{ep.path}</span>
                <span className="text-[11px] text-text-muted">{ep.desc}</span>
                {ep.auth && <span className="px-6 py-2 rounded-4 bg-amber-100 text-amber-700 text-[10px] font-medium">auth</span>}
                <span className="text-text-muted text-[10px]">{open ? "▲" : "▼"}</span>
              </button>
              {open && (
                <div className="px-16 pb-14 border-t border-border/50 pt-12 flex flex-col gap-10">
                  <div className="flex gap-8 flex-wrap">
                    <span className="px-8 py-3 rounded-5 text-[10px] font-mono" style={{ background: `${TAG_COLOR[ep.tag]}20`, color: TAG_COLOR[ep.tag] }}>{ep.tag}</span>
                    {ep.auth && <span className="px-8 py-3 rounded-5 bg-amber-50 text-amber-700 text-[10px]">Bearer token required</span>}
                  </div>
                  <p className="text-[12px] text-text-muted">{ep.desc}</p>
                  <div className="bg-bg rounded-8 p-12 ltr-text" style={{ direction: "ltr" }}>
                    <p className="text-[11px] font-mono text-text-muted">curl -X {ep.method} https://api.prakcheer.ir{ep.path} \</p>
                    {ep.auth && <p className="text-[11px] font-mono text-text-muted ms-4">{`-H "Authorization: Bearer YOUR_API_KEY"`}</p>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
