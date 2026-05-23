import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
}

export default function DashboardShell({ title, breadcrumbs, children }: Props) {
  return (
    <div className="min-h-dvh bg-bg">
      <Sidebar />
      <Header title={title} breadcrumbs={breadcrumbs} />
      {/* In RTL: sidebar is on the right (inline-start). Push main content left with padding-inline-start. */}
      <main
        style={{
          paddingInlineStart: "var(--sidebar-width)",
          paddingTop: "var(--header-height)",
        }}
        className="p-24"
      >
        {children}
      </main>
    </div>
  );
}
