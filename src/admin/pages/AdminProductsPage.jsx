import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Package,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ProductFormModal } from '../components/ProductFormModal';
import { Button } from '../../components/common/Button';
import { formatRupiah } from '../../utils/currency';
import { useProducts } from '../../hooks/useProducts';
import { CATEGORIES } from '../../data/categories';
import { getCategories } from '../../lib/storage/dataProvider.js';
import { SEO } from '../../components/common/SEO';

export function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductVisibility } = useProducts();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const [availableCategories, setAvailableCategories] = useState(CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState(initialFilter); // 'all' | 'active' | 'draft' | 'low-stock'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  React.useEffect(() => {
    let isMounted = true;
    getCategories().then((cats) => {
      if (isMounted && Array.isArray(cats) && cats.length > 0) {
        setAvailableCategories(cats);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === 'active' && prod.isVisible === false) return false;
      if (statusFilter === 'draft' && prod.isVisible !== false) return false;
      if (statusFilter === 'low-stock' && (Number(prod.stock) || 0) > 10) return false;

      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (prod.name || '').toLowerCase().includes(q);
        const matchesCat = (prod.categoryLabel || '').toLowerCase().includes(q);
        const matchesMaterial = (prod.material || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesMaterial) return false;
      }

      return true;
    });
  }, [products, selectedCategory, statusFilter, searchQuery]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await addProduct(formData);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setStatusFilter('all');
  };

  return (
    <AdminLayout title="Kelola Katalog Produk">
      <SEO title="Kelola Produk - Haecca Hijab Admin CMS" noindex={true} />

      <div className="space-y-6 text-left">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-espresso-950">
              Daftar Produk ({filteredProducts.length})
            </h2>
            <p className="text-xs text-stone-500">
              Tambah, perbarui spesifikasi, atur galeri foto, atau nonaktifkan produk.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            className="self-start sm:self-auto shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Tambah Produk Baru</span>
          </Button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-sand-200/80 shadow-soft space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau bahan produk..."
                className="w-full pl-9 pr-4 py-2 bg-cream-50 border border-sand-200 rounded-xl text-xs text-espresso-900 placeholder:text-stone-400 focus:outline-none focus:border-mocha-500"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-sand-200 rounded-xl text-xs text-espresso-900 focus:outline-none focus:border-mocha-500"
              >
                <option value="all">Semua Kategori</option>
                {availableCategories.filter((c) => c.slug !== 'all' && c.id !== 'all').map((cat) => (
                  <option key={cat.slug || cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 border border-sand-200 rounded-xl text-xs text-espresso-900 focus:outline-none focus:border-mocha-500"
              >
                <option value="all">Semua Status</option>
                <option value="active">Hanya Aktif (Tampil)</option>
                <option value="draft">Hanya Draft (Sembunyi)</option>
                <option value="low-stock">Stok Menipis (≤ 10 pcs)</option>
              </select>
            </div>
          </div>

          {(searchQuery || selectedCategory !== 'all' || statusFilter !== 'all') && (
            <div className="flex items-center justify-between pt-2 border-t border-sand-100 text-xs">
              <span className="text-stone-500">
                Menampilkan {filteredProducts.length} dari {products.length} total produk
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-mocha-600 hover:text-mocha-800 font-semibold inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl border border-sand-200/80 shadow-soft overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-sand-100 text-mocha-500 flex items-center justify-center mx-auto">
                <Package className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-espresso-950">
                Tidak ada produk yang cocok
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau ubah filter kategori dan status.
              </p>
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Reset Filter
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-cream-50/80 border-b border-sand-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 pl-4 sm:pl-6">Foto & Produk</th>
                    <th className="py-3.5">Kategori</th>
                    <th className="py-3.5">Harga</th>
                    <th className="py-3.5 text-center">Stok</th>
                    <th className="py-3.5 text-center">Varian</th>
                    <th className="py-3.5 text-center">Visibilitas</th>
                    <th className="py-3.5 text-right pr-4 sm:pr-6">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100">
                  {filteredProducts.map((prod) => {
                    const fallbackImage =
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="%23FAF7F2"><rect width="80" height="80" fill="%23F4EFEB"/></svg>';
                    const thumb = prod.images && prod.images[0] ? prod.images[0] : fallbackImage;

                    return (
                      <tr key={prod.id} className="hover:bg-cream-50/40 transition-colors">
                        {/* Photo & Name */}
                        <td className="py-3.5 pl-4 sm:pl-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={thumb}
                              alt={prod.name}
                              className="w-12 h-14 rounded-xl object-cover bg-cream-100 border border-sand-200 shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              <h4 className="text-sm font-medium text-espresso-950 truncate">
                                {prod.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {prod.isBestSeller && (
                                  <span className="px-1.5 py-0.2 bg-gold-400/20 text-gold-700 text-[10px] font-bold rounded">
                                    Best Seller
                                  </span>
                                )}
                                {prod.isNew && (
                                  <span className="px-1.5 py-0.2 bg-mocha-500/10 text-mocha-700 text-[10px] font-bold rounded">
                                    New
                                  </span>
                                )}
                                <span className="text-[11px] text-stone-400">
                                  {prod.images?.length || 0} Foto
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 text-stone-600 font-medium">
                          {prod.categoryLabel}
                        </td>

                        {/* Price */}
                        <td className="py-3.5">
                          <div className="flex flex-col">
                            <span className="font-bold text-espresso-950">
                              {formatRupiah(prod.price)}
                            </span>
                            {prod.originalPrice && (
                              <span className="text-[10px] text-stone-400 line-through">
                                {formatRupiah(prod.originalPrice)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                              prod.stock <= 10
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {prod.stock <= 10 && <AlertTriangle className="w-3 h-3" />}
                            {prod.stock} pcs
                          </span>
                        </td>

                        {/* Color Variants */}
                        <td className="py-3.5 text-center">
                          <div className="flex items-center justify-center -space-x-1">
                            {(prod.colors || []).slice(0, 3).map((c, idx) => (
                              <span
                                key={idx}
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                                className="w-4 h-4 rounded-full border border-white shadow-sm inline-block"
                              />
                            ))}
                            {(prod.colors?.length || 0) > 3 && (
                              <span className="text-[10px] text-stone-400 pl-1.5">
                                +{(prod.colors?.length || 0) - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Visibility Toggle Button */}
                        <td className="py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => toggleProductVisibility(prod.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              prod.isVisible !== false
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                            }`}
                          >
                            {prod.isVisible !== false ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>Aktif</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5" />
                                <span>Draft</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 text-right pr-4 sm:pr-6">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(prod)}
                              className="p-1.5 text-stone-500 hover:text-mocha-600 rounded-lg hover:bg-sand-100 transition-colors"
                              title="Edit Produk"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(prod)}
                              className="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Create / Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        product={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 border border-sand-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-espresso-950">
                Hapus Produk Ini?
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Produk <strong>"{deleteTarget.name}"</strong> akan dihapus secara permanen dari database katalog.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <Button
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                size="md"
                className="flex-1"
                onClick={confirmDelete}
              >
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
