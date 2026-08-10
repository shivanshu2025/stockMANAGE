import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, File, GalleryHorizontalEnd, ImagePlus, RefreshCw, Trash2, X } from 'lucide-react';

const ImageUpload = ({ value, onChange, error, className = '' }) => {
  const galleryRef = useRef(null);
  const fileRef = useRef(null);
  const menuRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [preview, setPreview] = useState(value || null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameraLoading, setCameraLoading] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');

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

  useEffect(() => {
    if (!cameraOpen) return;
    startStream(facingMode);
    const handleKey = (e) => {
      if (e.key === 'Escape') closeCamera();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraOpen]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startStream = async (mode) => {
    setCameraError('');
    setCameraLoading(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera is not supported on this browser. Use Gallery or File instead.');
        return;
      }
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Allow camera access, or use Gallery/File instead.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError' || err.name === 'OverconstrainedError') {
        setCameraError('No camera found on this device. Use Gallery or File to upload an image.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another app. Close it and try again, or use Gallery/File.');
      } else {
        setCameraError('Could not start the camera. Use Gallery or File to upload an image.');
      }
    } finally {
      setCameraLoading(false);
    }
  };

  const setPreviewFromFile = (file) => {
    onChange({ file, error: '' });
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const openPicker = (ref) => {
    setMenuOpen(false);
    ref.current?.click();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setPreviewFromFile(file);
  };

  const openCamera = () => {
    setMenuOpen(false);
    setCameraError('');
    setFacingMode('environment');
    setCameraOpen(true);
  };

  const closeCamera = () => {
    setCameraOpen(false);
    stopStream();
  };

  const switchCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startStream(next);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
      closeCamera();
      setPreviewFromFile(file);
    }, 'image/jpeg', 0.9);
  };

  const clearImage = () => {
    setPreview(null);
    onChange({ file: null, error: '' });
    if (galleryRef.current) galleryRef.current.value = '';
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className={className}>
      <span className="mb-1.5 block text-sm font-medium text-dark">Product Image</span>
      <div className="flex items-center gap-4">
        <div ref={menuRef} className="relative">
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
          {menuOpen && (
            <div className="absolute left-0 top-full z-20 mt-2 w-44 rounded-xl border border-line bg-white p-1 shadow-card">
              <button
                type="button"
                onClick={openCamera}
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
      {cameraOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Take photo"
          onClick={() => {
            if (!cameraLoading) closeCamera();
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-card sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-dark">Take photo</h3>
              <button
                type="button"
                onClick={closeCamera}
                className="rounded-lg p-1.5 text-dark-muted transition-colors hover:bg-black/5 hover:text-dark"
                aria-label="Close camera"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-black">
              {cameraError ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                  <CameraOff className="h-8 w-8 text-white/70" aria-hidden="true" />
                  <p className="text-sm text-white/80">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => startStream(facingMode)}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/30 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    Try again
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="aspect-[3/4] w-full object-cover"
                />
              )}
            </div>

            {cameraError && (
              <p className="mt-3 text-center text-sm text-dark-soft">
                You can still use <span className="font-medium text-dark">Gallery</span> or{' '}
                <span className="font-medium text-dark">File</span> to upload an image.
              </p>
            )}

            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={switchCamera}
                disabled={cameraLoading || !!cameraError}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-dark transition-colors hover:border-primary hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Switch
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                disabled={cameraLoading || !!cameraError}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Capture photo"
              >
                <Camera className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={closeCamera}
                disabled={cameraLoading}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-medium text-dark transition-colors hover:border-primary hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;