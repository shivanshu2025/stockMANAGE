const Input = ({ label, id, error, hint, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <input id={id} className={`input-base ${error ? '!border-[#B3573F]' : ''} ${className}`} {...props} />
      {hint && !error && <p className="mt-1.5 text-xs text-dark-muted">{hint}</p>}
      {error && <p className="mt-1.5 text-xs font-medium text-[#B3573F]">{error}</p>}
    </div>
  );
};

export default Input;
