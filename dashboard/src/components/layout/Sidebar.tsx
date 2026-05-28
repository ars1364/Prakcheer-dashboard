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
    items: [{ label: "داشبورد", href: "/", icon: "◻" }],
  },
  {
    group: "زیرساخت",
    items: [
      {
        label: "زیرساخت ابری", href: "/iaas", icon: "◉",
        children: [
          { label: "سرورها",    href: "/iaas/servers" },
          { label: "شبکه‌ها",  href: "/iaas/networks" },
          { label: "فایروال",  href: "/iaas/firewall" },
          { label: "دیسک‌ها",  href: "/iaas/volumes" },
          { label: "IP شناور", href: "/iaas/floating-ips" },
          { label: "اسنپ‌شات", href: "/iaas/snapshots" },
        ],
      },
      { label: "VPC",              href: "/vpc",             icon: "◱" },
      { label: "ذخیره‌سازی ابری", href: "/object-storage", icon: "◫" },
      { label: "کوبرنتیس",        href: "/kubernetes",      icon: "⬡" },
      { label: "پایگاه داده",     href: "/databases",       icon: "◈" },
      { label: "CDN",             href: "/cdn",             icon: "◉" },
      { label: "DNS",             href: "/dns",             icon: "◎" },
    ],
  },
  {
    group: "مشاهده‌پذیری",
    items: [
      { label: "مانیتورینگ", href: "/monitoring", icon: "◑" },
      { label: "لاگ فعالیت", href: "/activity-log", icon: "◫" },
    ],
  },
  {
    group: "خدمات",
    items: [
      { label: "لود بالانسر", href: "/iaas/load-balancers", icon: "⊟" },
      { label: "مدیریت دسترسی", href: "/iam", icon: "◨" },
      { label: "کلیدهای SSH",   href: "/ssh-keys", icon: "◧" },
      { label: "پشتیبانی",  href: "/support",  icon: "◎" },
      { label: "صورتحساب", href: "/billing",  icon: "◈" },
      { label: "تنظیمات",  href: "/settings", icon: "◧" },
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
