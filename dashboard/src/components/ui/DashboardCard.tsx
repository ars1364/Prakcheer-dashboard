interface DashboardCardProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  padding?: boolean;
  className?: string;
}

export default function DashboardCard({ title, action, children, padding = true, className = "" }: DashboardCardProps) {
  return (
    <div
      className={`glass rounded-20 border flex flex-col ${className}`}
      style={{ boxShadow: "0 8px 32px rgba(15,50,47,0.10)" }}
    >
      {title && (
        <div className="flex items-center justify-between px-20 py-14 border-b border-border shrink-0">
          <h3 className="text-[14px] font-bold text-text-main">{title}</h3>
          {action}
        </div>
      )}
      <div className={padding ? "p-20" : ""}>{children}</div>
    </div>
  );
}
