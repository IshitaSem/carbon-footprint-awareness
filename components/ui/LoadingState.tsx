interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Loading your results...",
}: LoadingStateProps) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-earth-200 border-t-earth-600"
        aria-hidden
      />
      <p className="font-semibold text-carbon-600">{message}</p>
    </div>
  );
}
