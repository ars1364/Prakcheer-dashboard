"use client";

import Link from "next/link";

interface DBInstance {
  id:      string;
  name:    string;
  engine:  "postgresql" | "mysql" | "redis" | "mongodb";
  version: string;
  flavor:  string;
  region:  string;
  storage: string;
  status:  "running" | "stopped" | "provisioning" | "backup";
  ha:      boolean;
  created: string;
  endpoint:string;
}

const INSTANCES: DBInstance[] = [
  { id: "db01", name: "prod-postgres",  engine: "postgresql", version: "16",   flavor: "db.c4.large",  region: "تهران-۱", storage: "500 GB", status: "running",      ha: true,  created: "۱۴۰۳/۰۸", endpoint: "db-prod.internal:5432"    },
  { id: "db02", name: "staging-pg",     engine: "postgresql", version: "15",   flavor: "db.c2.medium", region: "تهران-۱", storage: "100 GB", status: "running",      ha: false, created: "۱۴۰۴/۰۲", endpoint: "db-staging.internal:5432" },
  { id: "db03", name: "cache-redis",    engine: "redis",      version: "7.2",  flavor: "cache.c2.med", region: "تهران-۱", storage: "—",      status: "running",      ha: true,  created: "۱۴۰۳/۱۰", endpoint: "redis-prod.internal:6379" },
  { id: "db04", name: "ml-mongo",       engine: "mongodb",    version: "7.0",  flavor: "db.c4.xlarge", region: "تهران-۱", storage: "1 TB",   status: "running",      ha: false, created: "۱۴۰۴/۰۶", endpoint: "mongo-ml.internal:27017"  },
  { id: "db05", name: "analytics-pg",   engine: "postgresql", version: "16",   flavor: "db.c8.2xlarge",region: "تهران-۱", storage: "2 TB",   status: "backup",       ha: true,  created: "۱۴۰۴/۱۱", endpoint: "db-analytics.internal:5432"},
  { id: "db06", name: "dev-mysql",      engine: "mysql",      version: "8.0",  flavor: "db.c2.small",  region: "تهران-۱", storage: "50 GB",  status: "stopped",      ha: false, created: "۱۴۰۵/۰۱", endpoint: "db-dev.internal:3306"     },
];

const ENGINE_COLOR: Record<string, string> = {
  postgresql: "#2554d8", mysql: "#d97706", redis: "#dc2626", mongodb: "#16a34a",
};

const STATUS_STYLE: Record<string, string> = {
  running:      "bg-green-100 text-green-700",
  stopped:      "bg-slate-100 text-slate-600",
  provisioning: "bg-amber-100 text-amber-700",
  backup:       "bg-blue-50 text-brand",
};

export default function DatabaseInstancesPage() {
  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">نمونه‌های پایگاه داده</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت سرویس‌های Managed Database</p>
          </div>
          <div className="flex gap-8">
            <button className="px-14 py-7 rounded-8 bg-brand text-white text-[12px] hover:bg-brand/90">+ نمونه جدید</button>
            <Link href="/databases" className="text-[12px] text-text-muted hover:text-brand">← دیتابیس‌ها</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل",           value: INSTANCES.length,                                          color: "#2554d8" },
            { label: "در حال اجرا",  value: INSTANCES.filter((i) => i.status === "running").length,    color: "#16a34a" },
            { label: "HA فعال",      value: INSTANCES.filter((i) => i.ha).length,                     color: "#7c3aed" },
            { label: "متوقف",        value: INSTANCES.filter((i) => i.status === "stopped").length,    color: "#64748b" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {INSTANCES.map((db) => (
          <div key={db.id} className="glass rounded-16 p-16 border border-border">
            <div className="flex items-start justify-between gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-10 mb-6 flex-wrap">
                  <p className="text-[13px] font-bold font-mono text-text-main">{db.name}</p>
                  <span className="px-8 py-3 rounded-5 text-[11px] font-bold" style={{ background: `${ENGINE_COLOR[db.engine]}15`, color: ENGINE_COLOR[db.engine] }}>
                    {db.engine} {db.version}
                  </span>
                  <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${STATUS_STYLE[db.status]}`}>
                    {db.status === "running" ? "در حال اجرا" : db.status === "stopped" ? "متوقف" : db.status === "backup" ? "در حال بکاپ" : "در حال ساخت"}
                  </span>
                  {db.ha && <span className="px-7 py-2 rounded-5 bg-purple-100 text-purple-700 text-[10px] font-bold">HA</span>}
                </div>
                <div className="flex gap-12 text-[11px] text-text-muted flex-wrap">
                  <span>{db.flavor}</span>
                  <span>{db.region}</span>
                  <span>{db.storage}</span>
                  <code className="font-mono ltr-text text-brand" style={{ direction: "ltr" }}>{db.endpoint}</code>
                </div>
              </div>
              <div className="flex gap-6 shrink-0">
                <Link href="/databases/backups" className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">بکاپ‌ها</Link>
                <button className="px-10 py-5 rounded-6 border border-border text-text-muted text-[11px] hover:bg-bg">تنظیمات</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
