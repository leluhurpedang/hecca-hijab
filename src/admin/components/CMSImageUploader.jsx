import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  X,
  Maximize2,
  RefreshCw,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import {
  uploadImage,
  validateImage,
  getImageUrl,
  resolvePersistentId,
  HAECCA_FALLBACK_IMAGE
} from '../../services/imageStorage.js';
import { useToast } from '../../context/ToastContext.jsx';
import { isSupabaseActive } from '../../lib/storage/dataProvider.js';

/**
 * Reusable single-image CMS uploader component.
 * Saves images as compressed Blobs in IndexedDB and emits persistent 'img_...' IDs.
 */
export function CMSImageUploader({
  label = 'Foto Banner / Media',
  value = '',
  onChange,
  aspectRatio = 'aspect-[16/9]',
  helperText = 'Mendukung format JPG, PNG, WebP (Maks. 5 MB). Otomatis dikompresi.',
  recommendedSize = '1200 x 800 px',
}) {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [displayUrl, setDisplayUrl] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Resolve display URL whenever value changes
  useEffect(() => {
    let isCancelled = false;

    async function resolveUrl() {
      if (!value) {
        setDisplayUrl('');
        return;
      }

      if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/') || value.startsWith('blob:')) {
        setDisplayUrl(value);
        return;
      }

      try {
        const url = await getImageUrl(value);
        if (!isCancelled) {
          setDisplayUrl(url || HAECCA_FALLBACK_IMAGE);
        }
      } catch (err) {
        console.error('[CMSImageUploader] Error resolving image URL:', err);
        if (!isCancelled) {
          setDisplayUrl(HAECCA_FALLBACK_IMAGE);
        }
      }
    }

    resolveUrl();

    return () => {
      isCancelled = true;
    };
  }, [value]);

  // Handle single file upload
  const handleUpload = async (file) => {
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      showToast(validation.error, 'error');
      return;
    }

    setIsUploading(true);

    try {
      // Compresses image and writes Blob to IndexedDB 'images' store
      const result = await uploadImage(file);
      // Immediately pass the persistent ID (img_...) to parent
      onChange(result.id);
      setDisplayUrl(result.url);
      showToast('Foto berhasil diunggah & disimpan ke database!', 'success');
    } catch (err) {
      console.error('[CMSImageUploader] Upload failed:', err);
      showToast('Gagal mengunggah foto: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  // Delete image
  const handleDelete = () => {
    onChange('');
    setDisplayUrl('');
    setShowDeleteConfirm(false);
    showToast('Foto berhasil dihapus.', 'info');
  };

  const hasImage = Boolean(value || displayUrl);

  return (
    <div className="space-y-2 text-left font-sans">
      {/* Label and Recommendation */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider">
          {label}
        </label>
        {recommendedSize && (
          <span className="text-[11px] text-stone-400 font-medium">
            Rekomendasi: {recommendedSize}
          </span>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      {/* Main Image Container or Upload Zone */}
      {hasImage ? (
        <div className="relative group rounded-2xl border border-sand-200 overflow-hidden bg-cream-100 shadow-soft">
          {/* Image Display */}
          <div className={`relative w-full ${aspectRatio} overflow-hidden bg-cream-100`}>
            <img
              src={displayUrl || HAECCA_FALLBACK_IMAGE}
              alt={label}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />

            {/* Persistent ID or status indicator */}
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>
                {value?.startsWith('img_')
                  ? (isSupabaseActive ? 'IndexedDB Fallback' : 'Tersimpan di IndexedDB')
                  : (isSupabaseActive ? 'Supabase Storage' : 'Foto Aktif')}
              </span>
            </div>

            {/* Action Bar on Hover */}
            <div className="absolute inset-x-2 bottom-2 p-1.5 bg-espresso-950/85 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-1">
                {/* Zoom / Lightbox Preview */}
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 text-xs font-medium"
                  title="Lihat Pratinjau Besar"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Lihat Penuh</span>
                </button>

                {/* Replace File */}
                <button
                  type="button"
                  onClick={() => replaceInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 text-xs font-medium"
                  title="Ganti Foto Ini"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Ganti</span>
                </button>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white transition-colors flex items-center gap-1 text-xs font-medium"
                title="Hapus Foto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>

          {/* Delete Confirmation Overlay */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-white/95 rounded-2xl p-4 flex flex-col items-center justify-center text-center z-20 animate-fade-in border border-rose-200">
              <AlertCircle className="w-7 h-7 text-rose-600 mb-1" />
              <p className="text-sm font-semibold text-espresso-950">Hapus foto ini?</p>
              <p className="text-xs text-stone-500 mb-3">Foto akan dihapus dari pengaturan tampilan.</p>
              <div className="flex gap-2 w-full max-w-xs">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
                >
                  Hapus
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-1.5 bg-sand-100 hover:bg-sand-200 text-espresso-900 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 ${
            dragActive
              ? 'border-mocha-500 bg-mocha-500/10 scale-[1.01]'
              : 'border-sand-300 hover:border-mocha-400 bg-cream-50/70 hover:bg-cream-100'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-sand-200/80 text-mocha-600 flex items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-mocha-600" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-xs sm:text-sm font-semibold text-espresso-900">
              {isUploading
                ? 'Mengompresi & mengunggah foto ke database...'
                : 'Klik untuk memilih atau seret foto ke sini'}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">{helperText}</p>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Large Preview */}
      {showPreviewModal && displayUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-3xl w-full bg-transparent flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-sand-200 p-2 text-sm flex items-center gap-1"
            >
              <X className="w-5 h-5" />
              <span>Tutup</span>
            </button>
            <div className="rounded-2xl overflow-hidden bg-black max-h-[85vh] shadow-2xl border border-white/20">
              <img
                src={displayUrl}
                alt="Pratinjau besar"
                className="max-h-[85vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
