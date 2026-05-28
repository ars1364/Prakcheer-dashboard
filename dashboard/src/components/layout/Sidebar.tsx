"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: { label: string; href: string }[];
}

const NAV_GROUPS: { group?: string; items: NavItem[] }[] = [
  {
    items: [
      { label: "داشبورد", href: "/",       icon: "◻" },
      { label: "مناطق",   href: "/regions", icon: "◎" },
    ],
  },
  {
    group: "زیرساخت",
    items: [
      {
        label: "زیرساخت ابری", href: "/iaas", icon: "◉",
        children: [
          { label: "کاتالوگ",   href: "/iaas/catalog"        },
          { label: "سرورها",    href: "/iaas/servers"        },
          { label: "شبکه‌ها",  href: "/iaas/networks"       },
          { label: "فایروال",  href: "/iaas/firewall"       },
          { label: "دیسک‌ها",  href: "/iaas/volumes"        },
          { label: "IP شناور", href: "/iaas/floating-ips"   },
          { label: "اسنپ‌شات", href: "/iaas/snapshots"      },
        ],
      },
      {
        label: "VPC", href: "/vpc", icon: "◱",
        children: [
          { label: "شبکه‌ها",    href: "/vpc/networks" },
          { label: "زیرشبکه‌ها", href: "/vpc/subnets"  },
          { label: "مسیریابی",   href: "/vpc/routing"  },
          { label: "Peering",    href: "/vpc/peering"  },
        ],
      },
      {
        label: "ذخیره‌سازی ابری", href: "/object-storage", icon: "◫",
        children: [
          { label: "Bucket‌ها",      href: "/object-storage/buckets"      },
          { label: "کلیدهای دسترسی", href: "/object-storage/access-keys" },
        ],
      },
      {
        label: "کوبرنتیس", href: "/kubernetes", icon: "⬡",
        children: [
          { label: "کلاسترها",   href: "/kubernetes/clusters"   },
          { label: "Node Pool",  href: "/kubernetes/node-pools" },
          { label: "Workload‌ها",href: "/kubernetes/workloads"  },
        ],
      },
      {
        label: "رجیستری Container", href: "/container-registry", icon: "◫",
        children: [
          { label: "مخازن",  href: "/container-registry/repositories" },
          { label: "تصاویر", href: "/container-registry/images"       },
        ],
      },
      {
        label: "پایگاه داده", href: "/databases", icon: "◈",
        children: [
          { label: "نمونه‌ها",    href: "/databases/instances" },
          { label: "پشتیبان‌ها", href: "/databases/backups"   },
        ],
      },
      {
        label: "CDN", href: "/cdn", icon: "◉",
        children: [
          { label: "Zone‌ها",     href: "/cdn/zones"        },
          { label: "Origin‌ها",   href: "/cdn/origins"      },
          { label: "گواهی‌ها",   href: "/cdn/certificates" },
        ],
      },
      {
        label: "DNS", href: "/dns", icon: "◎",
        children: [
          { label: "Zone‌ها",    href: "/dns/zones"   },
          { label: "رکوردها",   href: "/dns/records" },
        ],
      },
    ],
  },
  {
    group: "مشاهده‌پذیری",
    items: [
      {
        label: "مانیتورینگ", href: "/monitoring", icon: "◑",
        children: [
          { label: "داشبوردها", href: "/monitoring/dashboards" },
          { label: "متریک‌ها",  href: "/monitoring/metrics"   },
          { label: "قوانین",    href: "/monitoring/rules"     },
          { label: "لاگ‌ها",    href: "/monitoring/logs"      },
        ],
      },
      { label: "هشدارها",   href: "/alerts",          icon: "◭" },
      { label: "اعلان‌ها",  href: "/notifications",   icon: "◎" },
      { label: "زمان‌بندی", href: "/scheduler",       icon: "◷" },
      { label: "لاگ فعالیت",href: "/activity-log",    icon: "◫" },
    ],
  },
  {
    group: "اتوماسیون",
    items: [
      {
        label: "اتوماسیون", href: "/automation", icon: "◫",
        children: [
          { label: "قالب‌های Heat",    href: "/automation/heat-templates" },
          { label: "Stack‌ها",          href: "/automation/stacks"         },
          { label: "رویدادهای Stack",  href: "/automation/stack-events"   },
          { label: "خروجی‌های Stack",  href: "/automation/stack-outputs"  },
          { label: "Workflow‌ها",       href: "/automation/workflows"      },
          { label: "تاریخچه Job",      href: "/automation/job-history"    },
        ],
      },
    ],
  },
  {
    group: "مدیریت پلتفرم",
    items: [
      {
        label: "پنل ادمین", href: "/admin", icon: "◨",
        children: [
          { label: "مستاجران",          href: "/admin/tenants"                   },
          { label: "کاربران",           href: "/admin/users"                     },
          { label: "تأییدیه‌ها",        href: "/admin/approvals/pending"         },
          { label: "مناطق",             href: "/admin/regions"                   },
          { label: "مانیتورینگ",        href: "/admin/monitoring/services"       },
          { label: "هشدارها",           href: "/admin/alerts"                    },
          { label: "حسابرسی",          href: "/admin/audit/platform"            },
          { label: "عملیات",            href: "/admin/operations/background-jobs"},
        ],
      },
    ],
  },
  {
    group: "DevKit",
    items: [
      {
        label: "DevKit", href: "/devkit/api-keys", icon: "◧",
        children: [
          { label: "کلیدهای API",  href: "/devkit/api-keys"    },
          { label: "مستندات API",  href: "/devkit/api-docs"    },
          { label: "Webhook‌ها",   href: "/devkit/webhooks"    },
          { label: "لاگ رویدادها", href: "/devkit/event-log"   },
          { label: "تست Webhook",  href: "/devkit/test-webhook"},
          { label: "نرخ محدودیت",  href: "/devkit/rate-limit"  },
          { label: "نمونه SDK",    href: "/devkit/sdk-samples" },
          { label: "Runbook‌ها",   href: "/devkit/runbooks"    },
          { label: "Mirror‌ها",    href: "/devkit/mirrors"     },
        ],
      },
    ],
  },
  {
    group: "خدمات",
    items: [
      { label: "لود بالانسر",  href: "/iaas/load-balancers", icon: "⊟" },
      { label: "API Gateway", href: "/api-gateway",         icon: "◉" },
      {
        label: "مدیریت دسترسی", href: "/iam", icon: "◨",
        children: [
          { label: "کاربران",         href: "/iam/users"            },
          { label: "گروه‌ها",         href: "/iam/groups"           },
          { label: "سرویس اکانت",    href: "/iam/service-accounts" },
          { label: "سیاست‌ها",       href: "/iam/policies"         },
        ],
      },
      { label: "کلیدهای SSH",   href: "/ssh-keys",  icon: "◧" },
      {
        label: "امنیت", href: "/security", icon: "◭",
        children: [
          { label: "گواهی‌های SSL",    href: "/security/certificates"     },
          { label: "سیاست‌های فایروال", href: "/security/firewall-policies" },
        ],
      },
      {
        label: "پشتیبان‌گیری", href: "/backup", icon: "◫",
        children: [
          { label: "سیاست‌ها", href: "/backup/policies" },
        ],
      },
      { label: "مارکت‌پلیس", href: "/marketplace",icon: "◩" },
      {
        label: "پشتیبانی", href: "/support", icon: "◎",
        children: [
          { label: "تیکت‌ها", href: "/support/tickets" },
        ],
      },
      {
        label: "صورتحساب", href: "/billing", icon: "◈",
        children: [
          { label: "فاکتورها",     href: "/billing/invoices"     },
          { label: "تراکنش‌ها",   href: "/billing/transactions" },
          { label: "اعتبارها",    href: "/billing/credits"      },
          { label: "بودجه",       href: "/billing/budget"       },
        ],
      },
      { label: "کاوشگر هزینه", href: "/cost-explorer",  icon: "◉" },
      { label: "پروفایل",   href: "/profile",  icon: "◨" },
      {
        label: "تنظیمات", href: "/settings", icon: "◧",
        children: [
          { label: "عمومی",       href: "/settings/general"  },
          { label: "زبان و منطقه", href: "/settings/language" },
        ],
      },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>("/iaas");

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{ width: "var(--sidebar-width)" }}
        className={`glass-shell fixed top-0 start-0 h-full flex flex-col border-e z-40 overflow-y-auto transition-transform duration-200
          ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between gap-12 px-20 h-[60px] border-b border-border shrink-0">
          <div className="flex items-center gap-12">
            <div className="w-32 h-32 rounded-8 bg-brand flex items-center justify-center text-white text-[13px] font-bold select-none shrink-0">P</div>
            <span className="text-[15px] font-semibold text-text-main">پراکچیر</span>
          </div>
          <button onClick={onClose} className="lg:hidden w-28 h-28 flex items-center justify-center text-text-muted hover:text-text-main rounded-8 hover:bg-bg transition-colors">✕</button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-4 p-12 flex-1">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "mt-8" : ""}>
              {group.group && (
                <p className="px-12 mb-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">{group.group}</p>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const isOpen2  = expanded === item.href;
                return (
                  <div key={item.href}>
                    {item.children ? (
                      <button
                        onClick={() => setExpanded(isOpen2 ? null : item.href)}
                        className="relative w-full flex items-center gap-10 px-12 py-9 rounded-8 text-[13px] font-medium transition-all text-start"
                        style={isActive ? {
                          background: "linear-gradient(270deg, #eaf2ff, #dbeafe)",
                          borderInlineStart: "3px solid #2554d8",
                          color: "#2554d8",
                        } : { color: "#64748b" }}
                      >
                        <span className="text-[15px] leading-none shrink-0">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        <span className={`text-[11px] transition-transform duration-150 ${isOpen2 ? "rotate-180" : ""}`}>▾</span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="relative w-full flex items-center gap-10 px-12 py-9 rounded-8 text-[13px] font-medium transition-all text-start"
                        style={isActive ? {
                          background: "linear-gradient(270deg, #eaf2ff, #dbeafe)",
                          borderInlineStart: "3px solid #2554d8",
                          color: "#2554d8",
                        } : { color: "#64748b" }}
                      >
                        <span className="text-[15px] leading-none shrink-0">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    )}

                    {item.children && isOpen2 && (
                      <div className="mt-2 flex flex-col gap-1 ms-12 border-s border-border ps-8">
                        {item.children.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className={`block px-12 py-7 rounded-6 text-[13px] transition-colors
                                ${childActive ? "text-brand font-semibold" : "text-text-muted hover:text-text-main"}`}
                            >
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User — compact */}
        <div className="px-12 py-10 border-t border-border">
          <div className="flex items-center gap-10 px-12 py-8 rounded-8 hover:bg-bg cursor-pointer transition-colors">
            <div className="w-28 h-28 rounded-999 bg-brand-light flex items-center justify-center text-brand font-semibold text-[12px] shrink-0">ا</div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-text-main truncate">احمدرضا سرخایل</p>
              <p className="text-[11px] text-text-muted truncate">مدیر سیستم</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
