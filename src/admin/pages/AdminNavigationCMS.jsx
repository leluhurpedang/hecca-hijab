import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Compass,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  Tag
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import { Button } from '../../components/common/Button';
import { CATEGORIES } from '../../data/categories';
import { useToast } from '../../context/ToastContext';

export function AdminNavigationCMS() {
  const { cms, updateCMS } = useCMS();
  const { showToast } = useToast();
  const [items, setItems] = useState(cms.navigation?.items || []);
  const [isSaving, setIsSaving] = useState(false);

  // New item modal/form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    label: '',
    type: 'page',
    path: '/',
    category: 'pashmina',
    isEnabled: true,
  });

  useEffect(() => {
    if (cms.navigation?.items) {
      setItems(cms.navigation.items);
    }
  }, [cms.navigation]);

  // Reorder items
  const moveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setItems(updated);
  };

  // Toggle enabled
  const toggleEnabled = (index) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      isEnabled: !updated[index].isEnabled,
    };
    setItems(updated);
  };

  // Delete item
  const deleteItem = (index) => {
    if (items.length <= 1) {
      showToast('Minimal harus ada 1 item menu navigasi.', 'error');
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    showToast('Item navigasi dihapus.', 'info');
  };

  // Add item
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.label.trim()) {
      showToast('Nama label menu wajib diisi.', 'error');
      return;
    }

    const itemToAdd = {
      id: `nav-${Date.now()}`,
      label: newItem.label.trim(),
      type: newItem.type,
      path: newItem.type === 'category' ? `/shop?category=${newItem.category}` : newItem.path.trim(),
      category: newItem.type === 'category' ? newItem.category : undefined,
      isEnabled: true,
    };

    setItems([...items, itemToAdd]);
    setShowAddForm(false);
    setNewItem({
      label: '',
      type: 'page',
      path: '/',
      category: 'pashmina',
      isEnabled: true,
    });
    showToast('Menu baru ditambahkan ke daftar.', 'success');
  };

  // Save all items to CMS
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCMS(
        'navigation',
        { key: 'navigation', items },
        'Struktur Navigasi Toko berhasil disimpan! ✨'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 text-left max-w-4xl mx-auto pb-12 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-mocha-600">
              Konten Website
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-espresso-950">
              Navigasi Toko Publik
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Atur urutan, tautan, dan visibilitas menu header storefront Haecca Hijab.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Menu</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSave}
              loading={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </Button>
          </div>
        </div>

        {/* Add Menu Item Form */}
        {showAddForm && (
          <div className="bg-cream-50 rounded-2xl p-5 border border-sand-300 shadow-sm animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-espresso-950 flex items-center gap-2">
                <Compass className="w-4 h-4 text-mocha-600" />
                Tambah Item Menu Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-stone-400 hover:text-espresso-900 text-xs font-semibold"
              >
                Batal
              </button>
            </div>

            <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-espresso-900 mb-1">
                  Label Menu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Voal Terbaru"
                  value={newItem.label}
                  onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-sand-200 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-mocha-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso-900 mb-1">
                  Tipe Tautan
                </label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-sand-200 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-mocha-500"
                >
                  <option value="page">Halaman Web (Path)</option>
                  <option value="category">Kategori Produk</option>
                </select>
              </div>

              <div>
                {newItem.type === 'category' ? (
                  <>
                    <label className="block text-xs font-semibold text-espresso-900 mb-1">
                      Pilih Kategori
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-sand-200 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-mocha-500"
                    >
                      {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <label className="block text-xs font-semibold text-espresso-900 mb-1">
                      Tujuan Path / URL
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: /about"
                      value={newItem.path}
                      onChange={(e) => setNewItem({ ...newItem, path: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-sand-200 rounded-xl text-xs text-espresso-950 focus:outline-none focus:border-mocha-500"
                      required
                    />
                  </>
                )}
              </div>

              <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddForm(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Tambahkan ke Menu
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Menu Items List */}
        <div className="bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
          <div className="p-4 sm:p-5 bg-cream-50 border-b border-sand-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Daftar Menu Aktif ({items.length} Item)
            </span>
            <span className="text-[11px] text-stone-400">
              Gunakan tombol panah untuk mengatur urutan
            </span>
          </div>

          <div className="divide-y divide-sand-100">
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="p-4 sm:p-4 flex items-center justify-between gap-3 hover:bg-cream-50/50 transition-colors"
              >
                {/* Left: Reorder & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveItem(index, -1)}
                      className="p-1 text-stone-400 hover:text-mocha-600 disabled:opacity-20 transition-colors"
                      title="Pindahkan ke atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={() => moveItem(index, 1)}
                      className="p-1 text-stone-400 hover:text-mocha-600 disabled:opacity-20 transition-colors"
                      title="Pindahkan ke bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-espresso-950">
                        {item.label}
                      </span>
                      {item.type === 'category' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-mocha-600 bg-mocha-50 px-2 py-0.5 rounded-full border border-mocha-200/60">
                          <Tag className="w-2.5 h-2.5" />
                          Kategori: {item.category || 'voal'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-500 bg-sand-100 px-2 py-0.5 rounded-full">
                          <LinkIcon className="w-2.5 h-2.5" />
                          Halaman
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400 block mt-0.5 font-mono truncate">
                      {item.path}
                    </span>
                  </div>
                </div>

                {/* Right: Toggle & Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleEnabled(index)}
                    className={`text-xs px-3 py-1 rounded-full font-semibold border transition-colors flex items-center gap-1.5 ${
                      item.isEnabled !== false
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-stone-100 text-stone-500 border-stone-200'
                    }`}
                  >
                    {item.isEnabled !== false ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aktif</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Nonaktif</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteItem(index)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-sand-100"
                    title="Hapus menu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleSave}
            loading={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Navigasi Toko</span>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
