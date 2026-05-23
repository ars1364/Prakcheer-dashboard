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
      { label: "داشبورد", href: "/", icon: "⊞" },
    ],
  },
  {
    group: "زیرساخت",
    items: [
      {
        label: "زیرساخت ابری", href: "/iaas", icon: "☁",
        children: [
          { label: "سرورها",  href: "/iaas/servers" },
          { label: "شبکه‌ها", href: "/iaas/networks" },
          { label: "فایروال", href: "/iaas/firewall" },
        ],
      },
    ],
  },
  {
    group: "خدمات",
    items: [
      { label: "پشتیبانی",  href: "/support",  icon: "◎" },
      { label: "صورتحساب", href: "/billing",  icon: "◈" },
      { label: "تنظیمات",  href: "/settings", icon: "⚙" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>("/iaas");

  return (
    <aside
      style={{ width: "var(--sidebar-width)" }}
      className="fixed top-0 start-0 h-full flex flex-col bg-bg-card border-e border-border z-20 overflow-y-auto"
    >
      {/* Brand */}
      <div className="flex items-center gap-12 px-20 h-[60px] border-b border-border shrink-0">
        <div className="w-32 h-32 rounded-8 bg-brand flex items-center justify-center text-white text-sm font-bold select-none shrink-0">P</div>
        <span className="text-[15px] font-semibold text-text-main">پراکچیر</span>
      </div>

      {/* Nav groups */}
      <nav className="flex flex-col gap-4 p-12 flex-1">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-8" : ""}>
            {group.group && (
              <p className="px-12 mb-4 text-[11px] font-semibold text-text-muted uppercase tracking-wider">{group.group}</p>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const isOpen   = expanded === item.href;

              return (
                <div key={item.href}>
                  <button
                    onClick={() => item.children ? setExpanded(isOpen ? null : item.href) : undefined}
                    className={`relative w-full flex items-center gap-10 px-12 py-9 rounded-8 text-sm font-medium transition-all text-start
                      ${isActive
                        ? "text-brand"
                        : "text-text-muted hover:bg-bg hover:text-text-main"}`}
                    style={isActive ? {
                      background: "linear-gradient(90deg, #eaf2ff, #dbeafe)",
                      borderInlineStart: "3px solid #2554d8",
                    } : {}}
                  >
                    <span className="text-base leading-none shrink-0">{item.icon}</span>
                    <span className="flex-1 text-start">{item.label}</span>
                    {item.children && (
                      <span className={`text-xs transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}>⌄</span>
                    )}
                  </button>

                  {item.children && isOpen && (
                    <div className="mt-2 flex flex-col gap-1 ms-12 border-s border-border ps-8">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
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

      {/* User */}
      <div className="p-12 border-t border-border">
        <div className="flex items-center gap-10 px-12 py-9 rounded-8 hover:bg-bg cursor-pointer transition-colors">
          <div className="w-32 h-32 rounded-999 bg-brand-light flex items-center justify-center text-brand font-semibold text-sm shrink-0">ا</div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-text-main truncate">احمدرضا سرخایل</p>
            <p className="text-[11px] text-text-muted truncate">مدیر سیستم</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
