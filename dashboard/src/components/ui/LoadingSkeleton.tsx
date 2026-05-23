interface SkeletonProps { className?: string }

function Bone({ className = "" }: SkeletonProps) {
  return (
    <div className={`rounded-8 bg-bg-muted animate-pulse ${className}`} />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-bg-card rounded-20 border border-border p-20 flex flex-col gap-12" style={{ minHeight: 148 }}>
      <div className="flex items-start justify-between">
        <Bone className="w-44 h-44 rounded-12" />
        <Bone className="w-16 h-12" />
      </div>
      <Bone className="w-24 h-12" />
      <Bone className="w-20 h-8" />
    </div>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-16 px-20 py-14">
          <Bone className="flex-1 h-12 max-w-[140px]" />
          <Bone className="w-60 h-20 rounded-999" />
          <Bone className="w-100 h-12 hidden sm:block" />
          <Bone className="w-80 h-12 hidden md:block" />
          <Bone className="w-32 h-32 rounded-8 ms-auto" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-20">
      <Bone className="h-80 rounded-20" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
        {Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)}
      </div>
      <Bone className="h-200 rounded-20" />
    </div>
  );
}
