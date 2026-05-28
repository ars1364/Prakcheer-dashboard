"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header title="" onMenuToggle={() => setSidebarOpen((o) => !o)} />
      <main
        style={{
          paddingInlineStart: "var(--sidebar-width)",
          paddingTop: "var(--header-height)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
