export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <svg
        className="animate-spin h-10 w-10"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.25"
        />
        <path
          d="M12 2a10 10 0 019.95 9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <p className="mt-3 text-sm">Loading creators...</p>
    </div>
  );
}
