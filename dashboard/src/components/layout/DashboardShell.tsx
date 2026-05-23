"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface Region {
  id: string;
  label: string;
}

interface Props {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
  regions?: Region[];
  selectedRegion?: string;
  onRegionChange?: (id: string) => void;
}

export default function DashboardShell({ title, breadcrumbs, children, regions, selectedRegion, onRegionChange }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header
        title={title}
        breadcrumbs={breadcrumbs}
        onMenuToggle={() => setSidebarOpen(o => !o)}
        regions={regions}
        selectedRegion={selectedRegion}
        onRegionChange={onRegionChange}
      />
      <main
        style={{
          paddingInlineStart: "var(--sidebar-width)",
          paddingTop: "var(--header-height)",
        }}
        className="lg:ps-[var(--sidebar-width)]"
      >
        <div style={{ maxWidth: "var(--content-max)" }} className="mx-auto p-16 sm:p-24 flex flex-col gap-16 sm:gap-20">
          {children}
        </div>
      </main>
    </div>
  );
}
