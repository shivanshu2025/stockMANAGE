import { useState } from 'react';
import { Package } from 'lucide-react';

const ProductImage = ({ src, name, size = 'md', className = '' }) => {
  const [failed, setFailed] = useState(false);

  const sizes = {
    sm: 'h-10 w-10 rounded-lg',
    md: 'h-14 w-14 rounded-xl',
    lg: 'h-24 w-24 rounded-2xl sm:h-32 sm:w-32',
    xl: 'h-40 w-40 rounded-2xl sm:h-48 sm:w-48',
  };

  const fallback = (
    <span
      className={`${sizes[size]} flex shrink-0 items-center justify-center bg-primary/10 text-primary ${className}`}
      aria-hidden="true"
    >
      <Package className="h-1/2 w-1/2" strokeWidth={1.5} />
    </span>
  );

  if (!src || failed) return fallback;

  return (
    <img
      src={src}
      alt={name ? `${name} product image` : 'Product image'}
      loading="lazy"
      className={`${sizes[size]} shrink-0 object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
};

export default ProductImage;
