interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon = "📭", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-12 py-48 px-24 text-center">
      <span className="text-[40px] select-none">{icon}</span>
      <div>
        <p className="text-[15px] font-semibold text-text-main mb-4">{title}</p>
        {description && <p className="text-[13px] text-text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
