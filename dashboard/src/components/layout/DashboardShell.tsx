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
          paddingInlineStart: "var(--sidebar-width)",
          paddingTop: "var(--header-height)",
        }}
      >
        <div style={{ maxWidth: "var(--content-max)" }} className="mx-auto p-24 flex flex-col gap-20">
          {children}
        </div>
      </main>
    </div>
  );
}
