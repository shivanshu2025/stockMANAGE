import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Textarea from './Textarea';
import ImageUpload from './ImageUpload';
import { PRODUCT_TYPES } from '../utils/helpers';
import { productApi, getErrorMessage } from '../services/api';

const ProductFormModal = ({ open, onClose, product, onSuccess }) => {
  const [name, setName] = useState(product?.name || '');
  const [type, setType] = useState(product?.type || '');
  const [size, setSize] = useState(product?.size || '');
  const [note, setNote] = useState(product?.note || '');
  const [image, setImage] = useState({ file: null, error: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Product name is required';
    if (!type) next.type = 'Type is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('type', type);
      formData.append('size', size.trim());
      formData.append('note', note.trim());
      if (image.file) formData.append('image', image.file);

      const res = await productApi.updateProduct(product._id, formData);
      onSuccess?.(res.data.data);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update product'));
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Product">
      <div className="space-y-5">
        <ImageUpload
          value={product?.image}
          onChange={setImage}
          error={image.error}
        />

        <Input
          id="edit-name"
          label="Product name"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="edit-type"
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
            id="edit-size"
            label="Size"
            placeholder="e.g. M"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>

        <Textarea
          id="edit-note"
          label="Short note"
          placeholder="Optional short note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />

        {error && <p className="rounded-lg bg-[#FBEFEB] px-3 py-2 text-sm text-[#8A3D2C]">{error}</p>}

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            CANCEL
          </Button>
          <Button fullWidth onClick={handleSubmit} loading={loading}>
            SAVE CHANGES
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductFormModal;
