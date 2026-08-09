const LoadingSpinner = ({ size = 'md', light = false, label }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-9 w-9',
  };

  return (
    <span className="inline-flex items-center gap-2.5" role="status" aria-live="polite">
      <svg
        className={`${sizes[size]} ${light ? 'text-white' : 'text-primary'} animate-spin`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
        />
      </svg>
      {label && <span className="text-sm text-dark-soft">{label}</span>}
    </span>
  );
};

export default LoadingSpinner;
