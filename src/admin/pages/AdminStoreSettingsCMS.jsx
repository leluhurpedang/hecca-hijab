import React, { useState, useEffect } from 'react';
import { Save, Store, Truck } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { formatRupiah } from '../../utils/currency';

export function AdminStoreSettingsCMS() {
  const { cms, updateCMS } = useCMS();
  const [formData, setFormData] = useState(cms.store || cms.storeSettings || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cms.store || cms.storeSettings) {
      setFormData(cms.store || cms.storeSettings);
    }
  }, [cms.store, cms.storeSettings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCMS(
        'store',
        formData,
        'Pengaturan Profil Toko berhasil disimpan! ✨'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-8 text-left max-w-4xl mx-auto pb-12 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-mocha-600">
              Pengaturan
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-espresso-950">
              Pengaturan Toko
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Konfigurasi identitas resmi toko, kontak, alamat operasional, dan batas promo gratis ongkir.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </Button>
        </div>

        {/* 1. Store Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <Store className="w-5 h-5 text-mocha-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Profil & Kontak Bisnis
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Toko / Brand"
              value={formData.storeName || ''}
              onChange={(e) => handleChange('storeName', e.target.value)}
              placeholder="Haecca Hijab"
              required
            />

            <Input
              label="Slogan / Tagline Brand"
              value={formData.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="Sentuhan Keanggunan dalam Setiap Helai"
            />

            <Input
              label="Nomor WhatsApp Toko (Customer Service)"
              value={formData.whatsappNumber || ''}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              placeholder="6281234567890"
              helperText="Gunakan format internasional tanpa tanda plus (contoh: 628...)"
              required
            />

            <Input
              label="Email Resmi"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="hello@haeccahijab.com"
              required
            />

            <div className="sm:col-span-2">
              <Input
                label="Alamat Toko / Studio Fisik"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190"
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Jam Layanan Operasional"
                value={formData.operatingHours || ''}
                onChange={(e) => handleChange('operatingHours', e.target.value)}
                placeholder="Setiap Hari, 08:00 - 21:00 WIB"
              />
            </div>
          </div>
        </div>

        {/* 2. Free Shipping Threshold */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <Truck className="w-5 h-5 text-mocha-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Batas Minimal Belanja Gratis Ongkir
            </h2>
          </div>

          <div className="space-y-3">
            <Input
              label="Nominal Minimal Belanja untuk Gratis Ongkir (IDR)"
              type="number"
              value={formData.freeShippingThreshold || 250000}
              onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
              placeholder="250000"
              helperText={`Saat ini disetel ke: ${formatRupiah(formData.freeShippingThreshold || 250000)}`}
              required
            />
            <p className="text-xs text-stone-500 leading-relaxed">
              Progress bar di keranjang belanja akan secara otomatis menghitung selisih pembelanjaan pelanggan berdasarkan nominal ini.
            </p>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Toko</span>
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
