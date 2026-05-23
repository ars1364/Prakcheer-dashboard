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

const NAV: NavItem[] = [
  { label: "داشبورد",        href: "/",        icon: "⊞" },
  {
    label: "زیرساخت ابری",   href: "/iaas",    icon: "☁",
    children: [
      { label: "سرورها",     href: "/iaas/servers" },
      { label: "شبکه‌ها",    href: "/iaas/networks" },
      { label: "فایروال",    href: "/iaas/firewall" },
    ],
  },
  { label: "پشتیبانی",      href: "/support",  icon: "◎" },
  { label: "صورتحساب",      href: "/billing",  icon: "◈" },
  { label: "تنظیمات",       href: "/settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>("/iaas");

  return (
    // In RTL: inline-start = right side of screen. Sidebar sits on the right.
    <aside
      style={{ width: "var(--sidebar-width)" }}
      className="fixed top-0 start-0 h-full flex flex-col bg-bg-card border-e border-border shadow-panel z-20 overflow-y-auto"
    >
      {/* Brand */}
      <div className="flex items-center gap-12 px-20 h-[60px] border-b border-border shrink-0">
        <div className="w-32 h-32 rounded-8 bg-primary flex items-center justify-center text-white text-base font-bold select-none shrink-0">P</div>
        <span className="text-[15px] font-semibold text-text-main">پراکچیر</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-4 p-12 flex-1">
        {NAV.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const isOpen   = expanded === item.href;

          return (
            <div key={item.href}>
              <button
                onClick={() => {
                  if (item.children) setExpanded(isOpen ? null : item.href);
                }}
                className={`w-full flex items-center gap-12 px-12 py-10 rounded-8 text-sm font-medium transition-colors text-start
                  ${isActive
                    ? "bg-primary-light text-primary-text"
                    : "text-text-muted hover:bg-bg-subtle hover:text-text-main"}`}
              >
                <span className="text-base leading-none shrink-0">{item.icon}</span>
                <span className="flex-1 text-start">{item.label}</span>
                {item.children && (
                  <span className={`text-xs transition-transform duration-150 ${isOpen ? "-rotate-90" : "rotate-90"}`}>›</span>
                )}
              </button>

              {item.children && isOpen && (
                <div className="mt-4 flex flex-col gap-2 ms-8 border-s-2 border-surface ps-8">
                  {item.children.map((child) => {
                    const childActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`px-12 py-8 rounded-6 text-sm transition-colors block
                          ${childActive ? "text-primary font-semibold" : "text-text-muted hover:text-text-main"}`}
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
      </nav>

      {/* Footer — user profile */}
      <div className="p-12 border-t border-border">
        <div className="flex items-center gap-12 px-12 py-10 rounded-8 hover:bg-bg-subtle cursor-pointer transition-colors">
          <div className="w-32 h-32 rounded-999 bg-surface flex items-center justify-center text-primary font-bold text-sm shrink-0">A</div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-main truncate">احمدرضا</p>
            <p className="text-xs text-text-muted truncate">مدیر سیستم</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
