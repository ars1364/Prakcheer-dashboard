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
      <main
        style={{
          paddingInlineEnd: "var(--sidebar-width)",
          paddingTop: "var(--header-height)",
        }}
        className="p-24"
      >
        {children}
      </main>
    </div>
  );
}
