import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import QuantitySelector from './QuantitySelector';
import Textarea from './Textarea';
import ProductImage from './ProductImage';
import { stockApi, getErrorMessage } from '../services/api';

const OutStockModal = ({ open, onClose, product, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open || !product) return null;

  const available = product.quantity || 0;

  const reset = () => {
    setQuantity(1);
    setNote('');
    setError('');
    setLoading(false);
    setSuccess(false);
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    if (quantity > available) {
      setError(`Only ${available} unit${available === 1 ? '' : 's'} available`);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await stockApi.outStock(product._id, { quantity, note });
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.(res.data.data);
        handleClose();
      }, 900);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update stock'));
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title={success ? 'Stock Updated' : 'Out Stock'}>
      {success ? (
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 className="mb-4 h-12 w-12 text-primary" aria-hidden="true" />
          <p className="font-display text-lg font-semibold text-dark">{product.name}</p>
          <p className="mt-1 text-sm text-dark-soft">
            {quantity} item{quantity === 1 ? '' : 's'} removed
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center gap-4">
            <ProductImage src={product.image} name={product.name} size="md" />
            <div className="min-w-0">
              <p className="truncate font-medium text-dark">{product.name}</p>
              <p className="text-sm text-dark-soft">
                {product.type}
                {product.size ? ` · ${product.size}` : ''}
              </p>
              <p className="mt-1 text-sm text-dark">
                Available: <span className="font-semibold text-primary-dark">{available} units</span>
              </p>
            </div>
          </div>

          <div className="mb-5">
            <span className="mb-2 block text-sm font-medium text-dark">Going out</span>
            <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={available} label="Going out quantity" />
          </div>

          <div className="mb-5">
            <Textarea
              id="out-stock-note"
              label="Optional note"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          <div className="mb-6 space-y-1.5 rounded-xl bg-white px-4 py-3.5 text-sm">
            <div className="flex justify-between text-dark-soft">
              <span>Current stock</span>
              <span className="font-medium text-dark">{available}</span>
            </div>
            <div className="flex justify-between text-dark-soft">
              <span>Going out</span>
              <span className="font-medium text-[#B3573F]">-{quantity}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-1.5">
              <span className="font-medium text-dark">Remaining</span>
              <span className="font-display text-lg font-semibold text-dark">{Math.max(0, available - quantity)}</span>
            </div>
          </div>

          {error && <p className="mb-4 rounded-lg bg-[#FBEFEB] px-3 py-2 text-sm text-[#8A3D2C]">{error}</p>}

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={handleClose} disabled={loading}>
              CANCEL
            </Button>
            <Button fullWidth onClick={handleSubmit} loading={loading}>
              CONFIRM OUT STOCK
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default OutStockModal;
