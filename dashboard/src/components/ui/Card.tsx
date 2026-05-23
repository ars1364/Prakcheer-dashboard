interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({ children, className = "", padding = true }: CardProps) {
  return (
    <div className={`bg-bg-card rounded-16 border border-border shadow-card ${padding ? "p-20" : ""} ${className}`}>
      {children}
    </div>
  );
}
