type StatusVariant = "success" | "warning" | "danger" | "info" | "muted";

interface StatusBadgeProps {
  variant?: StatusVariant;
  children: React.ReactNode;
  dot?: boolean;
}

const STYLES: Record<StatusVariant, string> = {
  success: "bg-success-light text-success-text",
  warning: "bg-warning-light text-warning-text",
  danger:  "bg-danger-light text-danger-text",
  info:    "bg-brand-light text-brand",
  muted:   "bg-bg-muted text-text-muted",
};
const DOT: Record<StatusVariant, string> = {
  success: "bg-success", warning: "bg-warning", danger: "bg-danger",
  info: "bg-brand", muted: "bg-text-muted",
};

export default function StatusBadge({ variant = "muted", children, dot = false }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-6 px-8 py-3 rounded-999 text-[12px] font-medium ${STYLES[variant]}`}>
      {dot && <span className={`w-6 h-6 rounded-999 shrink-0 ${DOT[variant]}`} />}
      {children}
    </span>
  );
}
