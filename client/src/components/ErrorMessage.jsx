import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-xl border border-[#E5CFC7] bg-[#FBEFEB] px-4 py-3 text-sm text-[#8A3D2C] ${className}`}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
