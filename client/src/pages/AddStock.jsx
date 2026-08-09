import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import QuantitySelector from '../components/QuantitySelector';
import ImageUpload from '../components/ImageUpload';
import ErrorMessage from '../components/ErrorMessage';
import { PRODUCT_TYPES } from '../utils/helpers';
import { productApi, getErrorMessage } from '../services/api';

const AddStock = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [image, setImage] = useState({ file: null, error: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Product name is required';
    if (!type) next.type = 'Type is required';
    if (image.error) next.image = image.error;
    if (quantity < 0) next.quantity = 'Quantity cannot be negative';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('type', type);
      formData.append('size', size.trim());
      formData.append('quantity', quantity);
      formData.append('note', note.trim());
      if (image.file) formData.append('image', image.file);

      const res = await productApi.createProduct(formData);
      setSuccess(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not add product. Please try again.'));
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container-page flex flex-col items-center py-16 text-center sm:py-24">
        <CheckCircle2 className="mb-5 h-16 w-16 text-primary" aria-hidden="true" />
        <h1 className="heading-display text-3xl sm:text-4xl">Product added</h1>
        <p className="mt-3 max-w-md text-dark-soft">
          {success.name} is now in your inventory with {success.quantity} unit
          {success.quantity === 1 ? '' : 's'} in stock.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => navigate('/add-stock')}>
            ADD ANOTHER
          </Button>
          <Button onClick={() => navigate('/stock-list')}>
            VIEW STOCK LIST
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Add</p>
      <h1 className="heading-display mt-2 text-4xl sm:text-6xl">
        ADD.
        <br />
        <span className="text-primary">NEW STOCK.</span>
      </h1>
      <p className="mt-4 max-w-md text-dark-soft">
        Add a new product to your inventory and keep your stock organized.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 max-w-2xl space-y-6" noValidate>
        <ImageUpload value="" onChange={setImage} error={errors.image || image.error} />

        <Input
          id="product-name"
          label="Product name"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Select
            id="product-type"
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            error={errors.type}
          >
            <option value="">Select type</option>
            {PRODUCT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Input
            id="product-size"
            label="Size"
            placeholder="e.g. M, 42, One Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-dark">Quantity</span>
          <QuantitySelector value={quantity} onChange={setQuantity} min={0} max={99999} label="Quantity" />
        </div>

        <Textarea
          id="product-note"
          label="Short note"
          placeholder="Optional note about this product"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />

        {error && <ErrorMessage message={error} />}

        <div className="pt-2">
          <Button type="submit" size="lg" loading={loading} disabled={loading}>
            {!loading && (
              <span className="text-lg leading-none">+</span>
            )}
            ADD STOCK
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStock;
