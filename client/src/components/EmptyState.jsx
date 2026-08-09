import { PackageOpen } from 'lucide-react';

const EmptyState = ({ title, description, action, className = '' }) => (
  <div className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}>
    <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden="true">
      <PackageOpen className="h-7 w-7" strokeWidth={1.5} />
    </span>
    <h3 className="font-display text-xl font-semibold text-dark">{title}</h3>
    {description && <p className="mt-2 max-w-sm text-sm text-dark-soft">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
