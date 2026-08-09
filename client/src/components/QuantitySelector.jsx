import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ value, onChange, min = 0, max = Infinity, label = 'Quantity', size = 'lg' }) => {
  const handleIncrement = () => {
    const next = value + 1;
    if (next <= max) onChange(next);
  };

  const handleDecrement = () => {
    const next = value - 1;
    if (next >= min) onChange(next);
  };

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const next = raw === '' ? 0 : parseInt(raw, 10);
    if (next >= min) {
      onChange(Math.min(next, max));
    }
  };

  const iconClass = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div className="inline-flex items-center">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="flex h-12 w-12 items-center justify-center rounded-l-xl border border-line bg-white text-dark transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40 sm:h-14 sm:w-14"
        aria-label="Decrease quantity"
      >
        <Minus className={iconClass} aria-hidden="true" />
      </button>
      <div className="relative flex h-12 items-center border-y border-line bg-white sm:h-14">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleInput}
          aria-label={label}
          className="h-full w-20 bg-transparent text-center font-display font-semibold text-dark outline-none sm:w-24"
        />
      </div>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="flex h-12 w-12 items-center justify-center rounded-r-xl border border-line bg-white text-dark transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40 sm:h-14 sm:w-14"
        aria-label="Increase quantity"
      >
        <Plus className={iconClass} aria-hidden="true" />
      </button>
    </div>
  );
};

export default QuantitySelector;
