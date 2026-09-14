import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { getCategories } from '../../lib/storage/dataProvider.js';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import { ImageManager } from './ImageManager';
import { useToast } from '../../context/ToastContext';

export function ProductFormModal({
  isOpen,
  product = null, // if editing, product object; if creating, null
  onClose,
  onSave,
}) {
  const { showToast } = useToast();
  const isEditing = Boolean(product);
  const [availableCategories, setAvailableCategories] = useState(CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    getCategories().then((cats) => {
      if (isMounted && Array.isArray(cats) && cats.length > 0) {
        setAvailableCategories(cats);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    category: 'voal',
    price: '',
    originalPrice: '',
    stock: 20,
    rating: 5.0,
    reviewCount: 0,
    material: '',
    dimensions: '115 cm x 115 cm',
    finishing: 'Laser Cut 4 Sisi Halus',
    description: '',
    isBestSeller: false,
    isNew: false,
    isVisible: true,
    colors: [
      { name: 'Soft Sand', hex: '#E3D7CC' },
      { name: 'Dusty Rose', hex: '#D6A69A' },
      { name: 'Broken White', hex: '#F7F5F0' },
    ],
    images: [],
    features: ['Material adem & tidak berdengung di telinga', 'Tegak melengkung sempurna di dahi'],
    careInstructions: ['Cuci dengan tangan menggunakan detergen lembut', 'Setrika dengan suhu rendah'],
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // New color field input state
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#8C6D58');

  // Populate form when editing or resetting when creating
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        tagline: product.tagline || '',
        category: product.category || 'voal',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        stock: product.stock !== undefined ? product.stock : 20,
        rating: product.rating !== undefined ? product.rating : 5.0,
        reviewCount: product.reviewCount !== undefined ? product.reviewCount : 0,
        material: product.material || '',
        dimensions: product.dimensions || '',
        finishing: product.finishing || '',
        description: product.description || '',
        isBestSeller: Boolean(product.isBestSeller),
        isNew: Boolean(product.isNew),
        isVisible: product.isVisible !== false,
        colors: product.colors && product.colors.length > 0 ? product.colors : [],
        images: product.images || [],
        features: product.features || [],
        careInstructions: product.careInstructions || [],
      });
    } else {
      setFormData({
        name: '',
        tagline: '',
        category: 'voal',
        price: '',
        originalPrice: '',
        stock: 25,
        rating: 5.0,
        reviewCount: 0,
        material: 'Voal Ultrafine Premium Grade A',
        dimensions: '115 cm x 115 cm',
        finishing: 'Clean Laser Cut 4 Sisi',
        description: 'Koleksi hijab eksklusif dengan material lembut dan jahitan berkualitas butik.',
        isBestSeller: false,
        isNew: true,
        isVisible: true,
        colors: [
          { name: 'Soft Sand', hex: '#E3D7CC' },
          { name: 'Dusty Rose', hex: '#D6A69A' },
          { name: 'Broken White', hex: '#F7F5F0' },
        ],
        images: [],
        features: ['Material adem & breathable', 'Tegak sempurna di dahi'],
        careInstructions: ['Cuci dengan tangan', 'Setrika suhu sedang'],
      });
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Add new color swatch
  const handleAddColor = () => {
    if (!newColorName.trim()) {
      showToast('Masukkan nama warna terlebih dahulu', 'error');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }],
    }));
    setNewColorName('');
  };

  // Remove color swatch
  const handleRemoveColor = (index) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama produk wajib diisi.';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Harga wajib diisi dan lebih besar dari 0.';
    if (!formData.category) errs.category = 'Pilih kategori produk.';
    if (formData.stock < 0) errs.stock = 'Stok tidak boleh bernilai negatif.';
    if (formData.rating !== '' && (Number(formData.rating) < 0 || Number(formData.rating) > 5)) {
      errs.rating = 'Rating harus bernilai antara 0.0 sampai 5.0';
    }
    if (formData.reviewCount !== '' && Number(formData.reviewCount) < 0) {
      errs.reviewCount = 'Jumlah ulasan tidak boleh negatif';
    }
    if (!formData.images || formData.images.length === 0) errs.images = 'Minimal harus memiliki 1 foto produk.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Mohon periksa kolom yang ditandai merah.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Find category label
      const catObj = availableCategories.find((c) => c.slug === formData.category);
      const categoryLabel = catObj ? catObj.name : formData.category;

      const payload = {
        ...formData,
        categoryLabel,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
        rating:
          formData.rating !== ''
            ? Math.min(5, Math.max(0, Math.round(Number(formData.rating) * 10) / 10))
            : 5.0,
        reviewCount:
          formData.reviewCount !== ''
            ? Math.max(0, Math.floor(Number(formData.reviewCount)))
            : 0,
      };

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Save product error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-sand-200 z-10 animate-fade-in flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-sand-200 bg-cream-50 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-mocha-600">
              {isEditing ? 'Mode Edit Produk' : 'Tambah Produk Baru'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-espresso-950">
              {isEditing ? formData.name || 'Edit Produk' : 'Katalog Baru Haecca Hijab'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-espresso-950 rounded-full hover:bg-sand-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-left">
          {/* Section: Image Manager */}
          <div className="bg-cream-50/50 p-4 sm:p-5 rounded-2xl border border-sand-200">
            <ImageManager
              images={formData.images}
              onChange={(newImages) => handleFieldChange('images', newImages)}
              maxImages={8}
            />
            {errors.images && (
              <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.images}
              </p>
            )}
          </div>

          {/* Section: General Info */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-espresso-900 border-b border-sand-200 pb-2">
              Informasi Utama Produk
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Produk"
                name="name"
                required
                placeholder="Contoh: Haecca Voal Ultrafine Silk"
                value={formData.name}
                error={errors.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold text-espresso-900 uppercase tracking-wider mb-1.5">
                  Kategori Produk <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-sand-200 rounded-xl text-sm text-espresso-900 focus:outline-none focus:border-mocha-500"
                >
                  {availableCategories.filter((c) => c.slug !== 'all' && c.id !== 'all').map((cat) => (
                    <option key={cat.slug || cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Tagline / Subtitle Ringkas"
              name="tagline"
              placeholder="Contoh: Voal lembut berstandar butik dengan laser cut presisi"
              value={formData.tagline}
              onChange={(e) => handleFieldChange('tagline', e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Harga Jual (IDR)"
                name="price"
                type="number"
                required
                placeholder="89000"
                value={formData.price}
                error={errors.price}
                onChange={(e) => handleFieldChange('price', e.target.value)}
              />

              <Input
                label="Harga Coret / Asli (Opsional)"
                name="originalPrice"
                type="number"
                placeholder="119000"
                helperText="Kosongkan bila tidak ada diskon"
                value={formData.originalPrice}
                onChange={(e) => handleFieldChange('originalPrice', e.target.value)}
              />

              <Input
                label="Jumlah Stok"
                name="stock"
                type="number"
                required
                placeholder="25"
                value={formData.stock}
                error={errors.stock}
                onChange={(e) => handleFieldChange('stock', e.target.value)}
              />
            </div>

            {/* Rating & Review Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <Input
                label="Rating Produk (0.0 - 5.0)"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="4.9"
                helperText="Nilai bintang (1 desimal, contoh: 4.9)"
                value={formData.rating}
                error={errors.rating}
                onChange={(e) => handleFieldChange('rating', e.target.value)}
              />

              <Input
                label="Jumlah Ulasan / Review"
                name="reviewCount"
                type="number"
                step="1"
                min="0"
                placeholder="184"
                helperText="Total jumlah ulasan pembeli (contoh: 184)"
                value={formData.reviewCount}
                error={errors.reviewCount}
                onChange={(e) => handleFieldChange('reviewCount', e.target.value)}
              />
            </div>

            <Textarea
              label="Deskripsi Lengkap Produk"
              name="description"
              rows={3}
              placeholder="Jelaskan kenyamanan, karakteristik jatuh kain, dan keunggulan hijab ini..."
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
            />
          </div>

          {/* Section: Specifications */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-espresso-900 border-b border-sand-200 pb-2">
              Spesifikasi Bahan & Finishing
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Jenis Bahan / Material"
                name="material"
                placeholder="Ultrafine Voal Voile Import"
                value={formData.material}
                onChange={(e) => handleFieldChange('material', e.target.value)}
              />

              <Input
                label="Dimensi / Ukuran"
                name="dimensions"
                placeholder="115 cm x 115 cm"
                value={formData.dimensions}
                onChange={(e) => handleFieldChange('dimensions', e.target.value)}
              />

              <Input
                label="Tipe Jahitan / Finishing"
                name="finishing"
                placeholder="Clean Laser Cut 4 Sisi"
                value={formData.finishing}
                onChange={(e) => handleFieldChange('finishing', e.target.value)}
              />
            </div>
          </div>

          {/* Section: Color Swatches Manager */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-espresso-900 border-b border-sand-200 pb-2">
              Pilihan Warna Varian ({formData.colors.length} Warna)
            </h4>

            {/* Existing Color Chips */}
            <div className="flex flex-wrap gap-2 py-1">
              {formData.colors.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 bg-cream-50 border border-sand-200 rounded-full text-xs font-medium text-espresso-900"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(i)}
                    className="text-stone-400 hover:text-rose-600 p-0.5"
                    title="Hapus varian warna"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Color Form */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-10 h-10 p-1 rounded-xl border border-sand-200 cursor-pointer bg-white"
                title="Pilih kode hex warna"
              />
              <input
                type="text"
                placeholder="Nama warna (contoh: Sage Green)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-sand-200 rounded-xl text-xs text-espresso-900 focus:outline-none focus:border-mocha-500"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddColor}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah Warna
              </Button>
            </div>
          </div>

          {/* Section: Badges & Status */}
          <div className="space-y-3 pt-2">
            <h4 className="text-base font-bold text-espresso-900 border-b border-sand-200 pb-2">
              Pengaturan Tampilan & Status
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl border border-sand-200 cursor-pointer hover:bg-sand-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => handleFieldChange('isVisible', e.target.checked)}
                  className="w-4 h-4 text-mocha-600 rounded focus:ring-mocha-400"
                />
                <div>
                  <span className="text-xs font-semibold text-espresso-900 block">Tampilkan di Toko</span>
                  <span className="text-[11px] text-stone-500">Produk berstatus aktif</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl border border-sand-200 cursor-pointer hover:bg-sand-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) => handleFieldChange('isBestSeller', e.target.checked)}
                  className="w-4 h-4 text-gold-500 rounded focus:ring-gold-400"
                />
                <div>
                  <span className="text-xs font-semibold text-espresso-900 block">Badge Best Seller</span>
                  <span className="text-[11px] text-stone-500">Tampil di koleksi favorit</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl border border-sand-200 cursor-pointer hover:bg-sand-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => handleFieldChange('isNew', e.target.checked)}
                  className="w-4 h-4 text-mocha-600 rounded focus:ring-mocha-400"
                />
                <div>
                  <span className="text-xs font-semibold text-espresso-900 block">Badge New Release</span>
                  <span className="text-[11px] text-stone-500">Tampil di rilisan terbaru</span>
                </div>
              </label>
            </div>
          </div>
        </form>

        {/* Modal Footer Buttons */}
        <div className="p-4 sm:p-5 border-t border-sand-200 bg-cream-50 flex items-center justify-end gap-3 shrink-0">
          <Button variant="secondary" size="md" onClick={onClose} disabled={isSaving}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            loading={isSaving}
          >
            {isEditing ? 'Simpan Perubahan' : 'Terbitkan Produk'}
          </Button>
        </div>
      </div>
    </div>
  );
}
