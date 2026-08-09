import { useEffect } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isError = type === 'error';
  const Icon = isError ? XCircle : CheckCircle2;

  return (
    <div
      role="status"
      className="fixed left-1/2 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border bg-white px-4 py-3.5 shadow-card"
    >
      <Icon
        className={`h-5 w-5 shrink-0 ${isError ? 'text-[#B3573F]' : 'text-primary'}`}
        aria-hidden="true"
      />
      <p className="flex-1 text-sm font-medium text-dark">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md p-1 text-dark-muted transition-colors hover:bg-black/5 hover:text-dark"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default Toast;
