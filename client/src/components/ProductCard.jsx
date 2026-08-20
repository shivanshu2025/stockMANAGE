import { useNavigate } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import ProductImage from './ProductImage';
import StatusBadge from './StatusBadge';
import ProductActionsMenu from './ProductActionsMenu';

const ProductCard = ({ product, onEdit, onAddStock, onOutStock, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
      <div className="flex gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => navigate(`/products/${product._id}`)}
          className="shrink-0"
          aria-label={`View ${product.name}`}
        >
          <ProductImage src={product.image} name={product.name} size="md" />
        </button>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => navigate(`/products/${product._id}`)}
            className="block truncate text-left font-medium text-dark"
          >
            {product.name}
          </button>
          <p className="truncate text-xs text-dark-soft">
            {product.type}
            {product.size ? ` · ${product.size}` : ''}
          </p>
          <p className="mt-0.5 truncate text-xs text-dark-muted">{product.sku}</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-dark-soft">
              Stock: <span className="font-display text-lg font-semibold text-dark">{product.quantity}</span>
            </span>
            <StatusBadge status={product.status} />
          </div>
        </div>
        <ProductActionsMenu
          onView={() => navigate(`/products/${product._id}`)}
          onEdit={() => onEdit(product)}
          onAddStock={() => onAddStock(product)}
          onOutStock={() => onOutStock(product)}
          onDelete={() => onDelete(product)}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onAddStock(product)}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-primary/10 text-sm font-medium text-primary-dark transition-colors hover:bg-primary hover:text-white"
        >
          <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
          ADD
        </button>
        <button
          type="button"
          onClick={() => onOutStock(product)}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-line bg-white text-sm font-medium text-dark transition-colors hover:border-primary hover:text-primary-dark"
        >
          <ArrowUpFromLine className="h-4 w-4" aria-hidden="true" />
          OUT
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
