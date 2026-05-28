"use client";

import { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import DashboardCard from "@/components/ui/DashboardCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ActionMenu from "@/components/ui/ActionMenu";

const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

type UserStatus  = "active" | "inactive" | "locked";
type UserRole    = "owner" | "admin" | "operator" | "viewer" | "billing";

interface IAMUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  mfa: boolean;
  lastLogin: string;
  regions: string[];
  apiKeys: number;
  createdAt: string;
}

interface APIKey {
  id: string;
  name: string;
  userId: string;
  scope: string[];
  lastUsed: string;
  expiresAt: string | null;
  status: "active" | "expired" | "revoked";
}

const ALL_USERS: IAMUser[] = [
  { id: "usr-001", name: "احمدرضا ارس",   email: "admin@prakcheer.io",   role: "owner",    status: "active",   mfa: true,  lastLogin: "۱۴۰۳/۰۳/۰۵ ۱۱:۳۰", regions: ["tehran","isfahan","mashhad"], apiKeys: 2, createdAt: "۱۴۰۲/۱۰/۰۱" },
  { id: "usr-002", name: "سارا محمدی",    email: "sara@prakcheer.io",    role: "operator", status: "active",   mfa: true,  lastLogin: "۱۴۰۳/۰۳/۰۵ ۱۰:۴۲", regions: ["isfahan"],                  apiKeys: 1, createdAt: "۱۴۰۳/۰۱/۱۵" },
  { id: "usr-003", name: "علی رضایی",     email: "ali@prakcheer.io",     role: "operator", status: "active",   mfa: false, lastLogin: "۱۴۰۳/۰۳/۰۵ ۰۸:۳۰", regions: ["tehran","mashhad"],          apiKeys: 1, createdAt: "۱۴۰۳/۰۱/۲۰" },
  { id: "usr-004", name: "رضا کریمی",     email: "reza@prakcheer.io",    role: "viewer",   status: "active",   mfa: false, lastLogin: "۱۴۰۳/۰۳/۰۳ ۱۴:۱۰", regions: ["tehran"],                   apiKeys: 0, createdAt: "۱۴۰۳/۰۲/۰۵" },
  { id: "usr-005", name: "نیلوفر احمدی",  email: "niloofar@prakcheer.io",role: "billing",  status: "active",   mfa: true,  lastLogin: "۱۴۰۳/۰۳/۰۴ ۰۹:۱۵", regions: ["tehran","isfahan","mashhad"], apiKeys: 0, createdAt: "۱۴۰۳/۰۲/۱۰" },
  { id: "usr-006", name: "میثم قاسمی",    email: "meysam@prakcheer.io",  role: "viewer",   status: "inactive", mfa: false, lastLogin: "۱۴۰۳/۰۱/۲۰ ۱۶:۰۰", regions: ["mashhad"],                  apiKeys: 0, createdAt: "۱۴۰۳/۰۲/۱۵" },
  { id: "usr-007", name: "فاطمه حسینی",   email: "fatemeh@prakcheer.io", role: "admin",    status: "active",   mfa: true,  lastLogin: "۱۴۰۳/۰۳/۰۴ ۱۸:۴۵", regions: ["tehran","isfahan","mashhad"], apiKeys: 3, createdAt: "۱۴۰۲/۱۲/۰۵" },
  { id: "usr-008", name: "حسن صادقی",     email: "hasan@prakcheer.io",   role: "operator", status: "locked",   mfa: false, lastLogin: "۱۴۰۳/۰۲/۲۸ ۱۱:۰۰", regions: ["tehran"],                   apiKeys: 1, createdAt: "۱۴۰۳/۰۲/۲۰" },
];

const ALL_APIKEYS: APIKey[] = [
  { id: "key-001", name: "deploy-ci",      userId: "usr-001", scope: ["servers:write","snapshots:write"], lastUsed: "۱۴۰۳/۰۳/۰۵",     expiresAt: null,             status: "active"  },
  { id: "key-002", name: "monitoring-ro",  userId: "usr-001", scope: ["servers:read","metrics:read"],     lastUsed: "۱۴۰۳/۰۳/۰۵",     expiresAt: null,             status: "active"  },
  { id: "key-003", name: "backup-script",  userId: "usr-007", scope: ["snapshots:write","volumes:read"],  lastUsed: "۱۴۰۳/۰۳/۰۴",     expiresAt: "۱۴۰۳/۰۶/۰۱",   status: "active"  },
  { id: "key-004", name: "isf-deploy",     userId: "usr-002", scope: ["servers:write"],                   lastUsed: "۱۴۰۳/۰۳/۰۳",     expiresAt: "۱۴۰۳/۰۴/۰۱",   status: "active"  },
  { id: "key-005", name: "ops-key-ali",    userId: "usr-003", scope: ["servers:read","networks:read"],    lastUsed: "۱۴۰۳/۰۲/۲۵",     expiresAt: "۱۴۰۳/۰۳/۰۱",   status: "expired" },
  { id: "key-006", name: "old-ci",         userId: "usr-008", scope: ["servers:write"],                   lastUsed: "۱۴۰۳/۰۲/۲۸",     expiresAt: "۱۴۰۳/۰۳/۰۱",   status: "revoked" },
  { id: "key-007", name: "msh-viewer",     userId: "usr-003", scope: ["servers:read"],                    lastUsed: "۱۴۰۳/۰۳/۰۲",     expiresAt: null,             status: "active"  },
  { id: "key-008", name: "admin-tools",    userId: "usr-007", scope: ["*"],                               lastUsed: "۱۴۰۳/۰۳/۰۵",     expiresAt: null,             status: "active"  },
  { id: "key-009", name: "billing-export", userId: "usr-007", scope: ["billing:read"],                    lastUsed: "۱۴۰۳/۰۳/۰۱",     expiresAt: "۱۴۰۳/۰۹/۰۱",   status: "active"  },
];

const ROLE_COLOR: Record<UserRole, string> = {
  owner:    "#ef4444",
  admin:    "#8b5cf6",
  operator: "#1a4d8f",
  viewer:   "#22c55e",
  billing:  "#d97706",
};
const ROLE_LABEL: Record<UserRole, string> = {
  owner: "مالک", admin: "ادمین", operator: "اپراتور", viewer: "بیننده", billing: "مالی",
};
const ROLE_PERMS: Record<UserRole, string> = {
  owner:    "دسترسی کامل",
  admin:    "مدیریت کاربران، منابع",
  operator: "ایجاد و حذف منابع",
  viewer:   "فقط خواندن",
  billing:  "مشاهده و پرداخت فاکتور",
};

const STATUS_VARIANT: Record<UserStatus, "success" | "warning" | "danger"> = {
  active: "success", inactive: "warning", locked: "danger",
};
const STATUS_LABEL: Record<UserStatus, string> = {
  active: "فعال", inactive: "غیرفعال", locked: "قفل شده",
};

const KEY_VARIANT: Record<"active"|"expired"|"revoked", "success"|"warning"|"danger"> = {
  active: "success", expired: "warning", revoked: "danger",
};
const KEY_LABEL = { active: "فعال", expired: "منقضی", revoked: "ابطال شده" };

const ROLE_ORDER: UserRole[] = ["owner", "admin", "operator", "viewer", "billing"];
const fontStyle = { fontFamily: "var(--font-vazirmatn)", fontSize: 11, fill: "#3d5957" };

export default function IAMPage() {
  const [tab, setTab] = useState<"users" | "apikeys">("users");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = useMemo(() => ALL_USERS.filter(u => {
    if (roleFilter   !== "all" && u.role   !== roleFilter)   return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!u.name.includes(search) && !u.email.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [search, roleFilter, statusFilter]);

  const filteredKeys = useMemo(() => ALL_APIKEYS.filter(k => {
    if (search) {
      const q = search.toLowerCase();
      if (!k.name.toLowerCase().includes(q) && !k.id.includes(q)) return false;
    }
    return true;
  }), [search]);

  const kpis = useMemo(() => ({
    total:    ALL_USERS.length,
    active:   ALL_USERS.filter(u => u.status === "active").length,
    noMfa:    ALL_USERS.filter(u => !u.mfa && u.status === "active").length,
    apiKeys:  ALL_APIKEYS.filter(k => k.status === "active").length,
    expiring: ALL_APIKEYS.filter(k => k.status === "expired").length,
  }), []);

  const roleDist = useMemo(() =>
    ROLE_ORDER.map(r => ({
      role: r,
      count: ALL_USERS.filter(u => u.role === r).length,
    })).filter(d => d.count > 0),
  []);

  const pieData = roleDist.map(d => ({ name: ROLE_LABEL[d.role], value: d.count, color: ROLE_COLOR[d.role] }));

  const userForKey = (uid: string) => ALL_USERS.find(u => u.id === uid)?.name ?? uid;

  return (
    <div style={{ maxWidth: "var(--content-max)" }} className="mx-auto p-16 sm:p-24 flex flex-col gap-16 sm:gap-20">
      {/* Access control header */}
      <div className="glass rounded-16 px-20 py-16 mb-20">
        <div className="flex flex-wrap gap-20 items-center">
          {/* Role assignment bar */}
          <div className="flex-1 min-w-[200px]">
            <p className="text-[12px] text-text-muted mb-8">توزیع نقش‌ها</p>
            <div className="flex h-10 rounded-full overflow-hidden gap-[2px] mb-10">
              {roleDist.map(d => (
                <div key={d.role} style={{ flex: d.count, background: ROLE_COLOR[d.role] }}
                     title={`${ROLE_LABEL[d.role]}: ${d.count}`} />
              ))}
            </div>
            <div className="flex flex-wrap gap-10">
              {roleDist.map(d => (
                <div key={d.role} className="flex items-center gap-5">
                  <div className="w-8 h-8 rounded-2" style={{ background: ROLE_COLOR[d.role] }} />
                  <span className="text-[11px] text-text-muted">{ROLE_LABEL[d.role]} ({d.count})</span>
                </div>
              ))}
            </div>
          </div>
          {/* Security warning: no-MFA */}
          {kpis.noMfa > 0 && (
            <div className="rounded-14 px-16 py-12 flex flex-col items-center"
                 style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
              <p className="text-[11px] text-text-muted mb-2">بدون MFA</p>
              <p className="text-[32px] font-bold ltr-text leading-none" style={{ color: "#f59e0b" }}>{kpis.noMfa}</p>
              <p className="text-[11px] text-text-muted mt-2">کاربر فعال</p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {[
              { label: "کاربران",      count: kpis.total,    color: "#1a4d8f", bg: "rgba(26,77,143,0.08)"  },
              { label: "فعال",          count: kpis.active,   color: "#22c55e", bg: "rgba(34,197,94,0.08)"  },
              { label: "کلید API فعال", count: kpis.apiKeys,  color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
              { label: "منقضی شده",    count: kpis.expiring, color: "#ef4444", bg: "rgba(239,68,68,0.08)"  },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center py-10 px-12 rounded-12" style={{ background: item.bg }}>
                <span className="text-[22px] font-bold ltr-text" style={{ color: item.color }}>{item.count}</span>
                <span className="text-[11px] text-text-muted mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
        <DashboardCard title="توزیع نقش‌ها">
          <div className="flex items-center gap-20">
            <div className="h-[160px] w-[160px] ltr-text shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={44} outerRadius={72} dataKey="value" strokeWidth={2}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "var(--font-vazirmatn)", fontSize: 12 }}
                    formatter={(v, n) => [`${v} نفر`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-10 flex-1">
              {ROLE_ORDER.map(r => {
                const count = ALL_USERS.filter(u => u.role === r).length;
                if (!count) return null;
                return (
                  <div key={r} className="flex items-start gap-10">
                    <div className="w-10 h-10 rounded-2 mt-1 shrink-0" style={{ background: ROLE_COLOR[r] }} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-text-main">{ROLE_LABEL[r]}</span>
                        <span className="ltr-text text-[12px] font-bold text-text-main">{count}</span>
                      </div>
                      <p className="text-[10px] text-text-muted mt-1">{ROLE_PERMS[r]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="کلیدهای API بر اساس کاربر">
          <div className="h-[200px] ltr-text">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ALL_USERS.filter(u => u.apiKeys > 0).map(u => ({ name: u.name.split(" ")[0], keys: u.apiKeys }))}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ ...fontStyle, fontFamily: "var(--font-vazirmatn)" }} axisLine={false} tickLine={false} />
                <YAxis tick={fontStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "var(--font-vazirmatn)", fontSize: 12 }}
                  formatter={(v) => [`${v} کلید`]} />
                <Bar dataKey="keys" fill="url(#barGrad)" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* Tab + filter bar */}
      <div className="glass rounded-12 px-16 py-12 mb-20 flex flex-wrap gap-12 items-center">
        <div className="flex rounded-8 border border-border overflow-hidden bg-white/40">
          {(["users", "apikeys"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-16 h-34 text-[13px] transition-colors ${tab === t ? "bg-brand text-white font-medium" : "text-text-muted hover:bg-bg-muted/50"}`}>
              {t === "users" ? `کاربران (${ALL_USERS.length})` : `کلید API (${ALL_APIKEYS.length})`}
            </button>
          ))}
        </div>
        <input type="text" placeholder="جستجو..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[160px] h-34 rounded-8 border border-border bg-white/60 px-12 text-[13px] text-text-main placeholder:text-text-placeholder outline-none focus:border-border-strong"
          dir="rtl" />
        {tab === "users" && (
          <>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
              className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none cursor-pointer" dir="rtl">
              <option value="all">همه نقش‌ها</option>
              {ROLE_ORDER.map(r => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="h-34 rounded-8 border border-border bg-white/60 px-10 text-[13px] text-text-main outline-none cursor-pointer" dir="rtl">
              <option value="all">همه وضعیت‌ها</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
              <option value="locked">قفل شده</option>
            </select>
          </>
        )}
        <button className="h-34 px-16 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors ms-auto">
          {tab === "users" ? "دعوت کاربر" : "ایجاد کلید API"}
        </button>
      </div>

      {/* Users table */}
      {tab === "users" && (
        <DashboardCard padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">کاربر</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">نقش</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">وضعیت</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">MFA</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">آخرین ورود</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">مناطق</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">کلید API</th>
                  <th className="px-16 py-10 text-[12px] font-medium text-text-muted w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-40 text-text-muted">کاربری یافت نشد</td></tr>
                ) : filteredUsers.map((u, i) => (
                  <tr key={u.id} className={`border-b border-border last:border-0 hover:bg-brand-light/30 transition-colors ${i % 2 !== 0 ? "bg-white/20" : ""}`}>
                    <td className="px-16 py-10">
                      <div className="flex items-center gap-10">
                        <div className="w-32 h-32 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                             style={{ background: ROLE_COLOR[u.role] }}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-text-main">{u.name}</p>
                          <p className="ltr-text text-[11px] text-text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-16 py-10">
                      <span className="inline-flex items-center gap-6 px-10 py-4 rounded-6 text-[12px] font-medium border border-border"
                            style={{ background: `${ROLE_COLOR[u.role]}14`, color: ROLE_COLOR[u.role] }}>
                        {ROLE_LABEL[u.role]}
                      </span>
                    </td>
                    <td className="px-16 py-10"><StatusBadge variant={STATUS_VARIANT[u.status]} dot>{STATUS_LABEL[u.status]}</StatusBadge></td>
                    <td className="px-16 py-10">
                      {u.mfa
                        ? <span className="text-[12px] text-success font-medium">✓ فعال</span>
                        : <span className="text-[12px] text-warning font-medium">✕ غیرفعال</span>}
                    </td>
                    <td className="px-16 py-10 ltr-text text-[12px] text-text-muted">{u.lastLogin}</td>
                    <td className="px-16 py-10">
                      <div className="flex flex-wrap gap-4">
                        {u.regions.map(r => (
                          <span key={r} className="text-[10px] px-6 py-2 rounded-4 bg-bg-muted text-text-muted border border-border">
                            {r === "tehran" ? "تهران" : r === "isfahan" ? "اصفهان" : "مشهد"}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-16 py-10 ltr-text text-[13px] font-semibold text-text-main">{u.apiKeys}</td>
                    <td className="px-16 py-10">
                      <ActionMenu items={[
                        { label: "ویرایش نقش",   onClick: () => {} },
                        { label: "مدیریت MFA",   onClick: () => {} },
                        { label: "مشاهده لاگ",  onClick: () => {} },
                        { label: "غیرفعال کردن", onClick: () => {}, danger: true },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      )}

      {/* API keys table */}
      {tab === "apikeys" && (
        <DashboardCard padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">نام کلید</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">کاربر</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">دامنه دسترسی</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">وضعیت</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">آخرین استفاده</th>
                  <th className="text-start px-16 py-10 text-[12px] font-medium text-text-muted">انقضا</th>
                  <th className="px-16 py-10 text-[12px] font-medium text-text-muted w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredKeys.map((k, i) => (
                  <tr key={k.id} className={`border-b border-border last:border-0 hover:bg-brand-light/30 transition-colors ${i % 2 !== 0 ? "bg-white/20" : ""}`}>
                    <td className="px-16 py-10">
                      <p className="ltr-text text-[12px] font-mono font-semibold text-brand">{k.name}</p>
                      <p className="ltr-text text-[10px] text-text-placeholder">{k.id}</p>
                    </td>
                    <td className="px-16 py-10 text-text-muted">{userForKey(k.userId)}</td>
                    <td className="px-16 py-10">
                      <div className="flex flex-wrap gap-4">
                        {k.scope.map(s => (
                          <span key={s} className="ltr-text text-[10px] px-6 py-2 rounded-4 bg-bg-muted text-text-muted border border-border font-mono">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-16 py-10">
                      <StatusBadge variant={KEY_VARIANT[k.status]}>{KEY_LABEL[k.status]}</StatusBadge>
                    </td>
                    <td className="px-16 py-10 ltr-text text-[12px] text-text-muted">{k.lastUsed}</td>
                    <td className="px-16 py-10 ltr-text text-[12px] text-text-muted">
                      {k.expiresAt ?? <span className="text-text-placeholder">بدون انقضا</span>}
                    </td>
                    <td className="px-16 py-10">
                      <ActionMenu items={[
                        { label: "کپی کلید",  onClick: () => {} },
                        { label: "تمدید",     onClick: () => {} },
                        { label: "ابطال",     onClick: () => {}, danger: true },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      )}
    </div>
  );
}
