import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  Star,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle2,
  GripVertical
} from 'lucide-react';
import { uploadImage, validateImage, getImageUrl } from '../../services/imageStorage';
import { useToast } from '../../context/ToastContext';

export function ImageManager({
  images = [],
  onChange,
  maxImages = 8,
}) {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // Lightbox preview
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null); // Index pending delete
  const [replaceTargetIndex, setReplaceTargetIndex] = useState(null); // Index being replaced

  // Drag and drop state for reordering
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Resolved display URLs for any items that are persistent image IDs (img_...)
  const [resolvedUrls, setResolvedUrls] = useState({});

  React.useEffect(() => {
    let isCancelled = false;
    async function resolveAll() {
      const map = {};
      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        if (!item) continue;
        if (item.startsWith('blob:') || item.startsWith('http') || item.startsWith('/')) {
          map[i] = item;
        } else {
          map[i] = await getImageUrl(item);
        }
      }
      if (!isCancelled) {
        setResolvedUrls(map);
      }
    }
    resolveAll();
    return () => { isCancelled = true; };
  }, [images]);

  // Handle file selection (multi-file or single)
  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    const availableSlots = maxImages - images.length;

    if (availableSlots <= 0) {
      showToast(`Maksimum ${maxImages} foto telah tercapai. Hapus foto lama untuk menambah baru.`, 'error');
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      showToast(`Hanya ${availableSlots} foto pertama yang diunggah (batas maks. ${maxImages} foto).`, 'info');
    }

    setIsUploading(true);

    try {
      const uploadResults = [];
      for (const file of filesToUpload) {
        const validation = validateImage(file);
        if (!validation.valid) {
          showToast(`File "${file.name}": ${validation.error}`, 'error');
          continue;
        }

        // Upload and compress via imageStorage
        const result = await uploadImage(file);
        uploadResults.push(result.url);
      }

      if (uploadResults.length > 0) {
        const updated = [...images, ...uploadResults];
        onChange(updated);
        showToast(`${uploadResults.length} foto berhasil diunggah & dikompresi!`, 'success');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Terjadi kendala saat mengunggah foto: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Replace a specific image
  const handleReplaceFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || replaceTargetIndex === null) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      showToast(validation.error, 'error');
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      const updated = [...images];
      updated[replaceTargetIndex] = result.url;
      onChange(updated);
      showToast('Foto berhasil diganti!', 'success');
    } catch (err) {
      showToast('Gagal mengganti foto: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
      setReplaceTargetIndex(null);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  // Drag-and-drop dropzone handlers
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Reorder actions
  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  // Set as primary image (moves to index 0)
  const setAsPrimary = (index) => {
    if (index === 0) return;
    moveImage(index, 0);
    showToast('Foto utama produk berhasil diperbarui!', 'success');
  };

  // Confirm delete
  const handleDelete = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
    setDeleteConfirmIndex(null);
    showToast('Foto dihapus dari galeri', 'info');
  };

  // Drag to reorder tiles handlers
  const onTileDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onTileDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onTileDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    moveImage(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Header and Counter */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider">
            Galeri Foto Produk <span className="text-rose-500">*</span>
          </label>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Foto pertama otomatis menjadi foto sampul utama (Cover). Tarik atau gunakan tombol untuk mengatur urutan.
          </p>
        </div>

        {/* Image Counter Badge */}
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
            images.length === 0
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-sand-100 text-espresso-900 border-sand-200'
          }`}
        >
          {images.length} / {maxImages} Foto
        </span>
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplaceFile}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      {/* Drop Zone Area */}
      {images.length < maxImages && (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
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
                ? 'Mengompresi & mengunggah foto ke storage...'
                : 'Klik untuk memilih atau seret foto ke sini'}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              Mendukung JPG, PNG, WebP (Maks. 5 MB per foto). Otomatis dioptimalkan.
            </p>
          </div>
        </div>
      )}

      {/* Thumbnails Grid with Drag-and-Drop Reordering */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pt-2">
          {images.map((rawItem, index) => {
            const isPrimary = index === 0;
            const displaySrc =
              resolvedUrls[index] ||
              (rawItem && (rawItem.startsWith('blob:') || rawItem.startsWith('http') || rawItem.startsWith('/'))
                ? rawItem
                : '');

            return (
              <div
                key={index}
                draggable
                onDragStart={(e) => onTileDragStart(e, index)}
                onDragOver={(e) => onTileDragOver(e, index)}
                onDrop={(e) => onTileDrop(e, index)}
                className={`group relative bg-white rounded-2xl border p-2 shadow-soft transition-all ${
                  isPrimary
                    ? 'border-mocha-500 ring-2 ring-mocha-400/40'
                    : 'border-sand-200 hover:border-sand-300'
                } ${draggedIndex === index ? 'opacity-40 scale-95' : ''}`}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-cream-100">
                  <img
                    src={displaySrc}
                    alt={`Foto produk ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Primary Cover Badge */}
                  {isPrimary ? (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-mocha-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                      Foto Utama
                    </div>
                  ) : (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
                      #{index + 1}
                    </span>
                  )}

                  {/* Grip Icon hint */}
                  <div className="absolute top-2 right-2 p-1 rounded-md bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>

                  {/* Overlay Action Buttons on Hover */}
                  <div className="absolute inset-x-1 bottom-1 p-1 bg-espresso-950/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-between text-white text-xs">
                    {/* View full */}
                    <button
                      type="button"
                      onClick={() => setPreviewImage(displaySrc)}
                      className="p-1 hover:text-mocha-300 transition-colors"
                      title="Lihat Pratinjau Besar"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Replace file */}
                    <button
                      type="button"
                      onClick={() => {
                        setReplaceTargetIndex(index);
                        replaceInputRef.current?.click();
                      }}
                      className="p-1 hover:text-mocha-300 transition-colors"
                      title="Ganti Foto Ini"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Left */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveImage(index, index - 1)}
                      className="p-1 hover:text-mocha-300 disabled:opacity-30 transition-colors"
                      title="Pindahkan ke Kiri"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Move Right */}
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, index + 1)}
                      className="p-1 hover:text-mocha-300 disabled:opacity-30 transition-colors"
                      title="Pindahkan ke Kanan"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmIndex(index)}
                      className="p-1 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Bar: Set Primary quick button */}
                <div className="mt-2 flex items-center justify-between text-[11px] px-1">
                  {!isPrimary ? (
                    <button
                      type="button"
                      onClick={() => setAsPrimary(index)}
                      className="text-mocha-600 hover:text-mocha-800 font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <Star className="w-3 h-3" />
                      Jadikan Utama
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Sampul Aktif
                    </span>
                  )}
                </div>

                {/* Delete Confirmation Popup */}
                {deleteConfirmIndex === index && (
                  <div className="absolute inset-0 bg-white/95 rounded-2xl p-3 flex flex-col items-center justify-center text-center z-20 animate-fade-in border border-rose-200">
                    <AlertCircle className="w-6 h-6 text-rose-600 mb-1" />
                    <p className="text-xs font-semibold text-espresso-950">Hapus foto ini?</p>
                    <p className="text-[10px] text-stone-500 mb-3">Foto akan dihapus dari produk.</p>
                    <div className="flex gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="flex-1 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium"
                      >
                        Hapus
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmIndex(null)}
                        className="flex-1 py-1 bg-sand-100 hover:bg-sand-200 text-espresso-900 rounded-lg text-xs font-medium"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal for Large Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-2xl w-full bg-transparent flex flex-col items-center">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-sand-200 p-2 text-sm flex items-center gap-1"
            >
              <X className="w-5 h-5" />
              <span>Tutup</span>
            </button>
            <div className="rounded-2xl overflow-hidden bg-black max-h-[80vh] shadow-2xl border border-white/20">
              <img
                src={previewImage}
                alt="Pratinjau besar"
                className="max-h-[80vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
