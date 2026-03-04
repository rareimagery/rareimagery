interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

export function LoadingSpinner({
  size = 40,
  message,
}: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="loading-spinner__icon"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M12 2a10 10 0 019.95 9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {message && <p className="loading-spinner__message">{message}</p>}
    </div>
  );
}
