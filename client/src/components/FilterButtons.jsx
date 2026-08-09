const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'in-stock', label: 'In Stock' },
  { key: 'low-stock', label: 'Low Stock' },
  { key: 'out-of-stock', label: 'Out of Stock' },
];

const FilterButtons = ({ value, onChange, className = '' }) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {FILTERS.map((filter) => {
      const active = value === filter.key;
      return (
        <button
          key={filter.key}
          type="button"
          onClick={() => onChange(filter.key)}
          aria-pressed={active}
          className={`h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
            active
              ? 'border-primary bg-primary text-white'
              : 'border-line bg-white text-dark-soft hover:border-primary hover:text-primary-dark'
          }`}
        >
          {filter.label}
        </button>
      );
    })}
  </div>
);

export default FilterButtons;
