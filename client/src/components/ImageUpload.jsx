import { useEffect, useRef, useState } from 'react';
import { Camera, File, GalleryHorizontalEnd, ImagePlus, Trash2 } from 'lucide-react';

const ImageUpload = ({ value, onChange, error, className = '' }) => {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const fileRef = useRef(null);
  const menuRef = useRef(null);
  const [preview, setPreview] = useState(value || null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const openPicker = (ref) => {
    setMenuOpen(false);
    ref.current?.click();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange({ file, error: '' });
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreview(null);
    onChange({ file: null, error: '' });
    if (cameraRef.current) cameraRef.current.value = '';
    if (galleryRef.current) galleryRef.current.value = '';
    if (fileRef.current) fileRef.current.value = '';
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
            onClick={() => setMenuOpen(true)}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line bg-white text-dark-muted transition-colors hover:border-primary hover:text-primary"
            aria-label="Upload product image"
          >
            <ImagePlus className="h-6 w-6" aria-hidden="true" />
            <span className="text-[11px] font-medium">Upload</span>
          </button>
        )}
        <div ref={menuRef} className="relative flex-1">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-dark transition-colors hover:border-primary hover:text-primary-dark"
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            {preview ? 'Change image' : 'Choose image'}
          </button>
          <p className="mt-2 text-xs text-dark-muted">Take a photo or choose an image</p>
          {menuOpen && (
            <div className="absolute left-0 top-full z-20 mt-2 w-44 rounded-xl border border-line bg-white p-1 shadow-card">
              <button
                type="button"
                onClick={() => openPicker(cameraRef)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-dark transition-colors hover:bg-[#F5F1EA] hover:text-primary-dark"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
                Take photo
              </button>
              <button
                type="button"
                onClick={() => openPicker(galleryRef)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-dark transition-colors hover:bg-[#F5F1EA] hover:text-primary-dark"
              >
                <GalleryHorizontalEnd className="h-4 w-4" aria-hidden="true" />
                Choose from gallery
              </button>
              <button
                type="button"
                onClick={() => openPicker(fileRef)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-dark transition-colors hover:bg-[#F5F1EA] hover:text-primary-dark"
              >
                <File className="h-4 w-4" aria-hidden="true" />
                Choose file
              </button>
            </div>
          )}
        </div>
      </div>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
        aria-label="Product image camera input"
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
        aria-label="Product image gallery input"
      />
      <input
        ref={fileRef}
        type="file"
        onChange={handleFile}
        className="hidden"
        aria-label="Product image file input"
      />
      {error && <p className="mt-1.5 text-xs font-medium text-[#B3573F]">{error}</p>}
    </div>
  );
};

export default ImageUpload;
