import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  type = 'button',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'border border-line bg-white text-dark hover:border-primary hover:text-primary-dark',
    ghost: 'text-dark-soft hover:bg-black/5 hover:text-dark',
    dark: 'bg-dark text-white hover:bg-dark/90',
  };

  const sizes = {
    sm: 'h-9 px-3.5 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <LoadingSpinner size="sm" light />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
