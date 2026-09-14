import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  ExternalLink,
  Eye,
  EyeOff,
  Edit,
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { AdminStatCard } from '../components/AdminStatCard';
import { ProductFormModal } from '../components/ProductFormModal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatRupiah } from '../../utils/currency';
import { useProducts } from '../../hooks/useProducts';
import { CATEGORIES } from '../../data/categories';
import { SEO } from '../../components/common/SEO';

export function AdminDashboardPage() {
  const { products, addProduct, updateProduct, toggleProductVisibility } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Computed Metrics
  const totalProducts = products.length;
  const totalCategories = CATEGORIES.filter((c) => c.id !== 'all').length;
  const totalStockCount = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const lowStockProducts = products.filter((p) => (Number(p.stock) || 0) <= 10);

  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, formData);
    } else {
      await addProduct(formData);
    }
  };

  return (
    <AdminLayout title="Dashboard Toko">
      <SEO title="Dashboard - Haecca Hijab Admin CMS" noindex={true} />

      <div className="space-y-8">
        {/* Welcome & Quick Action Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/80 shadow-soft text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-mocha-600">
              Overview Toko Online
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-espresso-950">
              Halo, Administrator Haecca 👋
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Pantau ringkasan katalog produk, stok ketersediaan, dan pembaharuan foto etalase Anda.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleOpenCreateModal}
              className="shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Tambah Produk Baru</span>
            </Button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <AdminStatCard
            title="Total Produk"
            value={totalProducts}
            subtitle="Koleksi terdaftar dalam database"
            icon={Package}
            variant="default"
          />

          <AdminStatCard
            title="Total Kategori"
            value={totalCategories}
            subtitle="Voal, Pashmina, Hijab, Aksesoris"
            icon={Layers}
            variant="gold"
          />

          <AdminStatCard
            title="Stok Tersedia"
            value={`${totalStockCount} pcs`}
            subtitle="Akumulasi seluruh varian produk"
            icon={CheckCircle2}
            variant="success"
          />

          <AdminStatCard
            title="Stok Menipis"
            value={`${lowStockProducts.length} Produk`}
            subtitle="Stok ≤ 10 pcs perlu diisi ulang"
            icon={AlertTriangle}
            variant={lowStockProducts.length > 0 ? 'warning' : 'default'}
          />
        </div>

        {/* Low Stock Alert Section if any */}
        {lowStockProducts.length > 0 && (
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-left space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <h4 className="text-sm font-semibold text-amber-950">
                  Perhatian: {lowStockProducts.length} Produk Menipis
                </h4>
              </div>
              <Link to="/admin/products?filter=low-stock" className="text-xs text-amber-800 font-semibold underline">
                Lihat Semua
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockProducts.slice(0, 3).map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white p-3 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-espresso-950 truncate">{prod.name}</p>
                    <p className="text-[11px] text-stone-500">{prod.categoryLabel}</p>
                  </div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md font-bold shrink-0">
                    Sisa {prod.stock} pcs
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Products Table */}
        <div className="bg-white rounded-3xl p-6 border border-sand-200/80 shadow-soft text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sand-200">
            <div>
              <h3 className="text-lg font-bold text-espresso-950">
                Produk Terbaru & Terdaftar
              </h3>
              <p className="text-xs text-stone-500">
                Menampilkan 5 produk terbaru dalam katalog Haecca Hijab.
              </p>
            </div>

            <Link
              to="/admin/products"
              className="text-xs font-semibold text-mocha-600 hover:text-mocha-800 inline-flex items-center gap-1"
            >
              <span>Kelola Semua Produk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sand-200 text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="pb-3 pl-2">Foto</th>
                  <th className="pb-3">Nama Produk</th>
                  <th className="pb-3">Kategori</th>
                  <th className="pb-3">Harga</th>
                  <th className="pb-3 text-center">Stok</th>
                  <th className="pb-3 text-center">Visibilitas</th>
                  <th className="pb-3 text-right pr-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {products.slice(0, 5).map((prod) => {
                  const fallbackImage =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="%23FAF7F2"><rect width="80" height="80" fill="%23F4EFEB"/></svg>';
                  const thumb = prod.images && prod.images[0] ? prod.images[0] : fallbackImage;

                  return (
                    <tr key={prod.id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="py-3 pl-2">
                        <img
                          src={thumb}
                          alt={prod.name}
                          className="w-10 h-12 rounded-lg object-cover bg-cream-100 border border-sand-200"
                        />
                      </td>
                      <td className="py-3 font-medium text-espresso-950 max-w-[200px] truncate">
                        {prod.name}
                        {prod.isBestSeller && (
                          <span className="ml-1.5 px-1.5 py-0.2 bg-gold-400/20 text-gold-600 text-[9px] font-bold rounded">
                            Best
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-stone-500">
                        {prod.categoryLabel}
                      </td>
                      <td className="py-3 font-semibold text-espresso-900">
                        {formatRupiah(prod.price)}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            prod.stock <= 10
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-sand-100 text-espresso-900'
                          }`}
                        >
                          {prod.stock} pcs
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleProductVisibility(prod.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                            prod.isVisible !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                          }`}
                        >
                          {prod.isVisible !== false ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(prod)}
                          className="text-stone-500 hover:text-mocha-600"
                        >
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </AdminLayout>
  );
}
