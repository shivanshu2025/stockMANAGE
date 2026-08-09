import { useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

const ImageUpload = ({ value, onChange, error, className = '' }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value || null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      onChange({ error: 'Please choose a JPG, PNG or WEBP image' });
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onChange({ error: 'Image must be smaller than 5MB' });
      e.target.value = '';
      return;
    }
    onChange({ file, error: '' });
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreview(null);
    onChange({ file: null, error: '' });
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={className}>
      <span className="mb-1.5 block text-sm font-medium text-dark">Product Image</span>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Product preview"
              className="h-24 w-24 rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-dark shadow-card transition-colors hover:text-[#B3573F]"
              aria-label="Remove image"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line bg-white text-dark-muted transition-colors hover:border-primary hover:text-primary"
            aria-label="Upload product image"
          >
            <ImagePlus className="h-6 w-6" aria-hidden="true" />
            <span className="text-[11px] font-medium">Upload</span>
          </button>
        )}
        <div className="flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-dark transition-colors hover:border-primary hover:text-primary-dark"
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            {preview ? 'Change image' : 'Choose image'}
          </button>
          <p className="mt-2 text-xs text-dark-muted">JPG, PNG or WEBP. Max 5MB.</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
        aria-label="Product image file input"
      />
      {error && <p className="mt-1.5 text-xs font-medium text-[#B3573F]">{error}</p>}
    </div>
  );
};

export default ImageUpload;
