import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import QuantitySelector from './QuantitySelector';
import Textarea from './Textarea';
import ProductImage from './ProductImage';
import { stockApi, getErrorMessage } from '../services/api';

const AddStockModal = ({ open, onClose, product, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open || !product) return null;

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
    setError('');
    setLoading(true);
    try {
      const res = await stockApi.addStock(product._id, { quantity, note });
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
    <Modal open={open} onClose={handleClose} title={success ? 'Stock Added' : 'Add Stock'}>
      {success ? (
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 className="mb-4 h-12 w-12 text-primary" aria-hidden="true" />
          <p className="font-display text-lg font-semibold text-dark">{product.name}</p>
          <p className="mt-1 text-sm text-dark-soft">
            {quantity} unit{quantity === 1 ? '' : 's'} added to stock
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
                Current: <span className="font-semibold text-primary-dark">{product.quantity} units</span>
              </p>
            </div>
          </div>

          <div className="mb-5">
            <span className="mb-2 block text-sm font-medium text-dark">Add quantity</span>
            <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={9999} label="Add quantity" />
          </div>

          <div className="mb-5">
            <Textarea
              id="add-stock-note"
              label="Optional note"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          <div className="mb-6 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm">
            <span className="text-dark-soft">New total</span>
            <span className="font-display text-xl font-semibold text-dark">{product.quantity + quantity} units</span>
          </div>

          {error && <p className="mb-4 rounded-lg bg-[#FBEFEB] px-3 py-2 text-sm text-[#8A3D2C]">{error}</p>}

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={handleClose} disabled={loading}>
              CANCEL
            </Button>
            <Button fullWidth onClick={handleSubmit} loading={loading}>
              + ADD STOCK
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default AddStockModal;
