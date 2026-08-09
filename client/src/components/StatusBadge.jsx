import { STOCK_STATUS } from '../utils/helpers';

const StatusBadge = ({ status, className = '' }) => {
  const label = STOCK_STATUS[status] || status;
  const isOut = status === 'out-of-stock';
  const isLow = status === 'low-stock';

  const styles = isOut
    ? 'bg-dark text-white'
    : isLow
    ? 'bg-primary/15 text-primary-dark'
    : 'bg-primary/15 text-primary-dark';

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${styles} ${className}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${isOut ? 'bg-white/80' : 'bg-primary'}`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
};

export default StatusBadge;
