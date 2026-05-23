interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "دریافت اطلاعات ناموفق بود",
  description = "لطفاً اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-12 py-48 px-24 text-center">
      <div className="w-48 h-48 rounded-999 bg-danger-light flex items-center justify-center text-[22px]">!</div>
      <div>
        <p className="text-[15px] font-semibold text-text-main mb-4">{title}</p>
        <p className="text-[13px] text-text-muted">{description}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-20 py-9 rounded-8 bg-brand text-white text-[13px] font-medium hover:bg-brand-hover transition-colors"
        >
          تلاش مجدد
        </button>
      )}
    </div>
  );
}
