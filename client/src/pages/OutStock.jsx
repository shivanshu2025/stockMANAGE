import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Plus, X } from 'lucide-react';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import QuantitySelector from '../components/QuantitySelector';
import Textarea from '../components/Textarea';
import ProductImage from '../components/ProductImage';
import StatusBadge from '../components/StatusBadge';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import useProducts from '../hooks/useProducts';
import { stockApi, getErrorMessage } from '../services/api';

const OutStock = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { products, loading } = useProducts({ search, debounceMs: 400 });

  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleSelect = (product) => {
    setSelected(product);
    setQuantity(1);
    setNote('');
    setError('');
  };

  const handleConfirm = async () => {
    if (!selected) return;
    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    if (quantity > selected.quantity) {
      setError(`Only ${selected.quantity} unit${selected.quantity === 1 ? '' : 's'} available`);
      return;
    }
    setError('');
    setLoadingSubmit(true);
    try {
      await stockApi.outStock(selected._id, { quantity, note });
      setSuccess({ name: selected.name, quantity });
      setLoadingSubmit(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update stock'));
      setLoadingSubmit(false);
    }
  };

  if (success) {
    return (
      <div className="container-page flex flex-col items-center py-16 text-center sm:py-24">
        <CheckCircle2 className="mb-5 h-16 w-16 text-primary" aria-hidden="true" />
        <h1 className="heading-display text-3xl sm:text-4xl">Stock Updated</h1>
        <p className="mt-3 text-lg text-dark-soft">
          {success.name}
          <span className="mt-1 block text-sm text-dark-muted">
            {success.quantity} item{success.quantity === 1 ? '' : 's'} removed
          </span>
        </p>
        <Button size="lg" className="mt-8" onClick={() => navigate('/stock-list')}>
          DONE
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Stock out</p>
      <h1 className="heading-display mt-2 text-4xl sm:text-6xl">OUT STOCK</h1>
      <p className="mt-4 max-w-md text-dark-soft">
        Select a product and enter how many items are going out.
      </p>

      {!selected ? (
        <div className="mt-10 max-w-2xl">
          <span className="mb-2 block text-sm font-medium text-dark">Search product</span>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search product..."
            className="max-w-md"
          />

          <div className="mt-6">
            {loading ? (
              <p className="py-10 text-center text-sm text-dark-muted">Searching...</p>
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                description="Try a different search term, or add products first."
              />
            ) : (
              <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
                {products.map((product) => (
                  <li key={product._id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(product)}
                      className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-primary/5"
                    >
                      <ProductImage src={product.image} name={product.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-dark">{product.name}</p>
                        <p className="text-xs text-dark-soft">
                          {product.type}
                          {product.size ? ` · ${product.size}` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary-dark">
                          {product.quantity} available
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10 max-w-2xl">
          <div className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
            <ProductImage src={selected.image} name={selected.name} size="md" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl font-semibold text-dark">{selected.name}</p>
              <p className="mt-0.5 text-sm text-dark-soft">
                {selected.type}
                {selected.size ? ` · ${selected.size}` : ''}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-3">
                <StatusBadge status={selected.status} />
                <span className="text-sm text-dark">
                  Available:{' '}
                  <span className="font-semibold text-primary-dark">
                    {selected.quantity} units
                  </span>
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-lg p-1.5 text-dark-muted transition-colors hover:bg-black/5 hover:text-dark"
              aria-label="Change selected product"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-8">
            <span className="mb-2 block text-sm font-medium text-dark">How many?</span>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={selected.quantity}
              label="Going out quantity"
            />
          </div>

          <div className="mt-6 max-w-md">
            <Textarea
              id="out-stock-note"
              label="Optional note"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          <div className="mt-6 max-w-md space-y-2 rounded-2xl border border-line bg-white px-5 py-4">
            <div className="flex justify-between text-sm text-dark-soft">
              <span>Current Stock</span>
              <span className="font-medium text-dark">{selected.quantity}</span>
            </div>
            <div className="flex justify-between text-sm text-dark-soft">
              <span>Going Out</span>
              <span className="font-medium text-[#B3573F]">-{quantity}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2.5 text-sm">
              <span className="font-medium text-dark">Remaining</span>
              <span className="font-display text-2xl font-semibold text-dark">
                {Math.max(0, selected.quantity - quantity)}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-5 max-w-md">
              <ErrorMessage message={error} />
            </div>
          )}

          <div className="mt-8">
            <Button size="lg" onClick={handleConfirm} loading={loadingSubmit} disabled={loadingSubmit}>
              CONFIRM OUT STOCK
              {!loadingSubmit && <Plus className="h-4 w-4 rotate-45" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutStock;
