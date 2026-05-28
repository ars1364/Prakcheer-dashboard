"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Tenant {
  id:       string;
  name:     string;
  plan:     "free" | "basic" | "pro" | "enterprise";
  status:   "active" | "suspended" | "trial";
  projects: number;
  users:    number;
  cpu:      number;
  ram:      number;
  storage:  number;
  spend:    number;
  joined:   string;
  region:   string;
}

const TENANTS: Tenant[] = [
  { id: "t01", name: "شرکت نوآوری ابری",   plan: "enterprise", status: "active",    projects: 8,  users: 42,  cpu: 82, ram: 74, storage: 58, spend: 4_200_000, joined: "۱۴۰۲/۰۳", region: "تهران-۱"   },
  { id: "t02", name: "استارتاپ هوش‌مند",   plan: "pro",        status: "active",    projects: 4,  users: 18,  cpu: 61, ram: 55, storage: 42, spend: 1_800_000, joined: "۱۴۰۳/۰۱", region: "تهران-۱"   },
  { id: "t03", name: "آژانس دیجیتال آبان", plan: "pro",        status: "active",    projects: 6,  users: 25,  cpu: 45, ram: 38, storage: 71, spend: 2_100_000, joined: "۱۴۰۳/۰۵", region: "اصفهان-۱"  },
  { id: "t04", name: "سازمان پژوهش ملی",   plan: "enterprise", status: "active",    projects: 12, users: 87,  cpu: 91, ram: 88, storage: 94, spend: 8_500_000, joined: "۱۴۰۱/۱۱", region: "تهران-۱"   },
  { id: "t05", name: "تیم توسعه سما",      plan: "basic",      status: "trial",     projects: 2,  users: 7,   cpu: 28, ram: 33, storage: 24, spend: 320_000,   joined: "۱۴۰۵/۰۱", region: "مشهد-۱"    },
  { id: "t06", name: "فروشگاه آنلاین بام", plan: "pro",        status: "active",    projects: 3,  users: 11,  cpu: 35, ram: 41, storage: 55, spend: 1_200_000, joined: "۱۴۰۳/۰۸", region: "اصفهان-۱"  },
  { id: "t07", name: "موسسه آموزشی نور",   plan: "basic",      status: "suspended", projects: 1,  users: 4,   cpu: 0,  ram: 0,  storage: 18, spend: 150_000,   joined: "۱۴۰۴/۰۴", region: "مشهد-۱"    },
  { id: "t08", name: "شرکت لجستیک رهبان",  plan: "enterprise", status: "active",    projects: 7,  users: 34,  cpu: 68, ram: 72, storage: 63, spend: 5_700_000, joined: "۱۴۰۲/۰۷", region: "تهران-۱"   },
  { id: "t09", name: "کلینیک دیجیتال مهر", plan: "basic",      status: "active",    projects: 2,  users: 9,   cpu: 22, ram: 28, storage: 31, spend: 480_000,   joined: "۱۴۰۴/۰۲", region: "اصفهان-۱"  },
  { id: "t10", name: "پلتفرم پرداخت سپهر", plan: "enterprise", status: "active",    projects: 5,  users: 29,  cpu: 74, ram: 69, storage: 47, spend: 3_900_000, joined: "۱۴۰۲/۱۰", region: "تهران-۱"   },
];

const PLAN_STYLE: Record<string, string> = {
  free:       "bg-slate-100 text-slate-600",
  basic:      "bg-blue-50 text-brand",
  pro:        "bg-purple-100 text-purple-700",
  enterprise: "bg-amber-100 text-amber-700",
};

const STATUS_STYLE: Record<string, string> = {
  active:    "bg-green-100 text-green-700",
  trial:     "bg-blue-50 text-brand",
  suspended: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<string, string> = { active: "فعال", trial: "آزمایشی", suspended: "معلق" };

function UsageBar({ pct }: { pct: number }) {
  const color = pct > 85 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#2554d8";
  return (
    <div className="w-full h-5 rounded-999 bg-border overflow-hidden">
      <div className="h-full rounded-999" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function AdminTenantsPage() {
  const [search, setSearch]     = useState("");
  const [planFilter, setPlan]   = useState<string>("همه");
  const [statusFilter, setStatus] = useState<string>("همه");

  const filtered = useMemo(() => TENANTS.filter((t) => {
    if (search && !t.name.includes(search) && !t.id.includes(search)) return false;
    if (planFilter !== "همه" && t.plan !== planFilter) return false;
    if (statusFilter !== "همه" && t.status !== statusFilter) return false;
    return true;
  }), [search, planFilter, statusFilter]);

  const totalSpend = TENANTS.reduce((a, t) => a + t.spend, 0);
  const activeCount = TENANTS.filter((t) => t.status === "active").length;

  return (
    <div className="flex flex-col gap-20 p-20 min-h-full" dir="rtl">
      <div className="glass rounded-16 p-20">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-[18px] font-bold text-text-main">مستاجران</h1>
            <p className="text-[12px] text-text-muted mt-2">مدیریت سازمان‌ها و تیم‌های پلتفرم</p>
          </div>
          <Link href="/admin" className="text-[12px] text-text-muted hover:text-brand transition-colors">← پنل ادمین</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
          {[
            { label: "کل مستاجران",  value: TENANTS.length,  color: "#2554d8" },
            { label: "فعال",          value: activeCount,     color: "#16a34a" },
            { label: "Enterprise",    value: TENANTS.filter((t) => t.plan === "enterprise").length, color: "#d97706" },
            { label: "درآمد کل",     value: (totalSpend / 1_000_000).toFixed(1) + " M", color: "#7c3aed" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-12 p-14">
              <p className="text-[11px] text-text-muted mb-4">{s.label}</p>
              <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-16 p-16 flex flex-wrap gap-12 items-center">
        <input
          type="text" placeholder="جستجو..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-12 py-8 rounded-8 border border-border bg-bg text-[13px] outline-none focus:border-brand w-[200px]"
        />
        {["همه", "free", "basic", "pro", "enterprise"].map((p) => (
          <button key={p} onClick={() => setPlan(p)}
            className={`px-10 py-6 rounded-6 text-[12px] font-medium transition-all ${planFilter === p ? "bg-brand text-white" : "border border-border text-text-muted hover:text-text-main"}`}
          >{p === "همه" ? "همه پلن‌ها" : p}</button>
        ))}
        <div className="h-20 w-px bg-border" />
        {["همه", "active", "trial", "suspended"].map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-10 py-6 rounded-6 text-[12px] font-medium transition-all ${statusFilter === s ? "bg-brand text-white" : "border border-border text-text-muted hover:text-text-main"}`}
          >{s === "همه" ? "همه وضعیت‌ها" : STATUS_LABEL[s]}</button>
        ))}
        <span className="ms-auto text-[12px] text-text-muted">{filtered.length} مستاجر</span>
      </div>

      <div className="glass rounded-16 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border text-text-muted bg-bg/50">
                <th className="text-start px-16 py-12 font-medium">نام</th>
                <th className="text-start py-12 font-medium">پلن</th>
                <th className="text-start py-12 font-medium">وضعیت</th>
                <th className="text-start py-12 font-medium">پروژه/کاربر</th>
                <th className="text-start py-12 font-medium w-[180px]">مصرف CPU</th>
                <th className="text-start py-12 font-medium">هزینه ماه</th>
                <th className="text-start py-12 font-medium">منطقه</th>
                <th className="text-start py-12 font-medium">عضویت</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-bg/60 transition-colors">
                  <td className="px-16 py-12">
                    <p className="font-semibold text-text-main">{t.name}</p>
                    <p className="text-[10px] text-text-muted">{t.id}</p>
                  </td>
                  <td className="py-12">
                    <span className={`px-8 py-3 rounded-5 text-[11px] font-medium capitalize ${PLAN_STYLE[t.plan]}`}>{t.plan}</span>
                  </td>
                  <td className="py-12">
                    <span className={`px-8 py-3 rounded-5 text-[11px] font-medium ${STATUS_STYLE[t.status]}`}>{STATUS_LABEL[t.status]}</span>
                  </td>
                  <td className="py-12 text-text-muted">{t.projects} / {t.users}</td>
                  <td className="py-12 pe-12">
                    <div className="flex items-center gap-8">
                      <UsageBar pct={t.cpu} />
                      <span className="text-[11px] text-text-muted w-[28px] shrink-0">{t.cpu}%</span>
                    </div>
                  </td>
                  <td className="py-12 text-text-main font-medium">{(t.spend / 1000).toFixed(0)}K</td>
                  <td className="py-12 text-text-muted">{t.region}</td>
                  <td className="py-12 text-text-muted">{t.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
