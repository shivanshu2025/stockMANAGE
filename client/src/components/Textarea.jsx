const Textarea = ({ label, id, error, className = '', rows = 3, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`input-base resize-none ${error ? '!border-[#B3573F]' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-[#B3573F]">{error}</p>}
    </div>
  );
};

export default Textarea;
