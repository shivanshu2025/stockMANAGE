import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import ProductImage from '../components/ProductImage';
import StatusBadge from '../components/StatusBadge';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import AddStockModal from '../components/AddStockModal';
import OutStockModal from '../components/OutStockModal';
import ProductFormModal from '../components/ProductFormModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { productApi, stockApi, getErrorMessage } from '../services/api';

const dayKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const dayLabel = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (dayKey(d) === dayKey(today)) return 'TODAY';
  if (dayKey(d) === dayKey(yesterday)) return 'YESTERDAY';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [addOpen, setAddOpen] = useState(false);
  const [outOpen, setOutOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([productApi.getProduct(id), stockApi.getMovements(id)])
      .then(([productRes, movementRes]) => {
        setProduct(productRes.data.data);
        setMovements(movementRes.data.data);
      })
      .catch((err) => setError(getErrorMessage(err, 'Could not load product')))
      .finally(() => setLoading(false));
  }, [id]);

  const refresh = async (updatedProduct) => {
    if (updatedProduct) setProduct(updatedProduct);
    try {
      const res = await stockApi.getMovements(id);
      setMovements(res.data.data);
    } catch {
      // movements already loaded; ignore
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await productApi.deleteProduct(id);
      navigate('/stock-list');
    } catch (err) {
      setToast({ message: getErrorMessage(err, 'Could not delete product'), type: 'error' });
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner label="Loading product..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-page py-16">
        <ErrorMessage message={error || 'Product not found'} />
        <Button variant="secondary" className="mt-6" onClick={() => navigate('/stock-list')}>
          BACK TO STOCK LIST
        </Button>
      </div>
    );
  }

  const groupedMovements = movements.reduce((acc, movement) => {
    const key = dayLabel(movement.createdAt);
    if (!acc[key]) acc[key] = [];
    acc[key].push(movement);
    return acc;
  }, {});

  return (
    <div className="container-page py-10 sm:py-14">
      <button
        type="button"
        onClick={() => navigate('/stock-list')}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-dark-soft transition-colors hover:text-primary-dark"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to stock list
      </button>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="shrink-0">
          <ProductImage src={product.image} name={product.name} size="xl" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={product.status} />
            <span className="text-xs text-dark-muted">{product.sku}</span>
          </div>
          <h1 className="heading-display mt-3 text-4xl sm:text-5xl">{product.name}</h1>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:max-w-lg">
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-dark-muted">Type</dt>
              <dd className="mt-1 text-sm font-medium text-dark">{product.type}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-dark-muted">Size</dt>
              <dd className="mt-1 text-sm font-medium text-dark">{product.size || '—'}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-dark-muted">Quantity</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-dark">{product.quantity}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-dark-muted">Note</dt>
              <dd className="mt-1 text-sm font-medium text-dark">{product.note || '—'}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => setAddOpen(true)}>
              <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
              ADD STOCK
            </Button>
            <Button variant="secondary" onClick={() => setOutOpen(true)}>
              <ArrowUpFromLine className="h-4 w-4" aria-hidden="true" />
              OUT STOCK
            </Button>
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
              EDIT
            </Button>
            <Button variant="secondary" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              DELETE
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="heading-display text-2xl sm:text-3xl">Stock Movement</h2>

        {movements.length === 0 ? (
          <EmptyState
            title="No movements yet"
            description="Add or remove stock to start tracking movement history."
            className="mt-4 !py-10"
          />
        ) : (
          <div className="mt-6 max-w-2xl space-y-8">
            {Object.entries(groupedMovements).map(([label, items]) => (
              <div key={label}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-dark-muted">{label}</p>
                <ul className="space-y-2">
                  {items.map((movement) => (
                    <li
                      key={movement._id}
                      className="flex items-center gap-4 rounded-xl border border-line bg-white px-4 py-3"
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          movement.type === 'IN' ? 'bg-primary/10 text-primary' : 'bg-dark/10 text-dark'
                        }`}
                        aria-hidden="true"
                      >
                        {movement.type === 'IN' ? (
                          <ArrowDownToLine className="h-4 w-4" />
                        ) : (
                          <ArrowUpFromLine className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-dark">
                          {movement.type === 'IN' ? '+' : '-'}
                          {movement.quantity} {movement.type === 'IN' ? 'Added Stock' : 'Out Stock'}
                        </p>
                        {movement.note && <p className="truncate text-xs text-dark-muted">{movement.note}</p>}
                      </div>
                      <span className="text-xs text-dark-muted">
                        {new Date(movement.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddStockModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        product={product}
        onSuccess={(updated) => {
          setProduct(updated);
          setToast({ message: 'Stock updated successfully.', type: 'success' });
          refresh(updated);
        }}
      />
      <OutStockModal
        open={outOpen}
        onClose={() => setOutOpen(false)}
        product={product}
        onSuccess={(updated) => {
          setProduct(updated);
          setToast({ message: 'Stock updated successfully.', type: 'success' });
          refresh(updated);
        }}
      />
      <ProductFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        product={product}
        onSuccess={(updated) => {
          setProduct(updated);
          setToast({ message: 'Product updated successfully.', type: 'success' });
        }}
      />
      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete this product?"
        message={`"${product.name}" and its stock history will be permanently removed.`}
        confirmLabel="DELETE"
      />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
    </div>
  );
};

export default ProductDetail;
