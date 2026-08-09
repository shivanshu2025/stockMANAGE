import { useNavigate } from 'react-router-dom';
import ProductImage from './ProductImage';
import StatusBadge from './StatusBadge';
import ProductActionsMenu from './ProductActionsMenu';

const ProductRow = ({ product, onEdit, onAddStock, onOutStock, onDelete }) => {
  const navigate = useNavigate();

  return (
    <tr className="border-b border-line transition-colors last:border-0 hover:bg-primary/5">
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => navigate(`/products/${product._id}`)}
          className="flex items-center gap-3.5 text-left"
        >
          <ProductImage src={product.image} name={product.name} size="sm" />
          <span className="min-w-0">
            <span className="block max-w-[240px] truncate font-medium text-dark">
              {product.name}
            </span>
            <span className="block text-xs text-dark-muted">{product.sku}</span>
          </span>
        </button>
      </td>
      <td className="px-5 py-4 text-sm text-dark-soft">{product.type}</td>
      <td className="px-5 py-4 text-sm text-dark-soft">{product.size || '—'}</td>
      <td className="px-5 py-4">
        <span className="font-display text-2xl font-semibold text-dark">{product.quantity}</span>
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={product.status} />
      </td>
      <td className="max-w-[200px] px-5 py-4">
        <p className="truncate text-sm text-dark-soft">{product.note || '—'}</p>
      </td>
      <td className="px-5 py-4 text-right">
        <ProductActionsMenu
          onView={() => navigate(`/products/${product._id}`)}
          onEdit={() => onEdit(product)}
          onAddStock={() => onAddStock(product)}
          onOutStock={() => onOutStock(product)}
          onDelete={() => onDelete(product)}
        />
      </td>
    </tr>
  );
};

export default ProductRow;
