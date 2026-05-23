type BadgeVariant = "primary" | "success" | "warning" | "danger" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const VARIANTS: Record<BadgeVariant, string> = {
  primary: "bg-primary-light text-primary-text",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger:  "bg-danger-light text-danger",
  muted:   "bg-bg-subtle text-text-muted",
};

export default function Badge({ children, variant = "muted" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-8 py-2 rounded-999 text-xs font-medium ${VARIANTS[variant]}`}>
      {children}
    </span>
  );
}
