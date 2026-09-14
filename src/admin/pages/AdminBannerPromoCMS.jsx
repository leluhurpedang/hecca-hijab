import React, { useState, useEffect } from 'react';
import { Save, Megaphone } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export function AdminBannerPromoCMS() {
  const { cms, updateCMS } = useCMS();
  const [formData, setFormData] = useState(cms.announcementBar || cms.bannerPromo || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cms.announcementBar || cms.bannerPromo) {
      setFormData(cms.announcementBar || cms.bannerPromo);
    }
  }, [cms.announcementBar, cms.bannerPromo]);

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
        'announcementBar',
        formData,
        'Banner & Promo Pengumuman berhasil disimpan! ✨'
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
              Konten Website
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-espresso-950">
              Banner & Promo CMS
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Kelola teks pengumuman berjalan (announcement ticker) dan voucher diskon di header atas toko.
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

        {/* Live Preview of Announcement Bar */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Pratinjau Langsung (Live Preview)
          </span>
          {formData.isEnabled !== false ? (
            <div className="bg-espresso-950 text-cream-100 py-2.5 px-4 rounded-2xl text-center text-xs font-medium shadow-sm flex items-center justify-center gap-2 flex-wrap">
              <span>{formData.announcementText || 'Special Launch: Gratis Ongkir min. belanja Rp250.000'}</span>
              {formData.voucherCode && (
                <span className="px-2 py-0.5 rounded bg-mocha-500/30 text-mocha-300 font-bold tracking-wider text-[11px] border border-mocha-400/30">
                  {formData.voucherCode}
                </span>
              )}
            </div>
          ) : (
            <div className="bg-stone-100 text-stone-500 py-2.5 px-4 rounded-2xl text-center text-xs font-medium border border-dashed border-stone-300">
              Banner saat ini disembunyikan (Nonaktif)
            </div>
          )}
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-sand-200 pb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-mocha-600" />
              <h2 className="text-lg font-bold text-espresso-950">
                Pengaturan Announcement Bar
              </h2>
            </div>

            {/* Toggle Status Button */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isEnabled !== false}
                onChange={(e) => handleChange('isEnabled', e.target.checked)}
                className="w-4 h-4 text-mocha-600 rounded focus:ring-mocha-400"
              />
              <span className="text-xs font-bold text-espresso-950">
                {formData.isEnabled !== false ? 'Aktif di Toko' : 'Nonaktif'}
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <Input
              label="Teks Pesan Pengumuman"
              value={formData.announcementText || ''}
              onChange={(e) => handleChange('announcementText', e.target.value)}
              placeholder="Contoh: Special Launch: Gratis Ongkir min. belanja Rp250.000 • Gunakan kode HAECCANEW diskon 10%"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kode Voucher Diskon"
                value={formData.voucherCode || ''}
                onChange={(e) => handleChange('voucherCode', e.target.value)}
                placeholder="Contoh: HAECCANEW"
              />

              <Input
                label="Persentase Diskon (%)"
                type="number"
                value={formData.discountPercentage || 10}
                onChange={(e) => handleChange('discountPercentage', Number(e.target.value))}
                placeholder="10"
              />
            </div>

            <Input
              label="Tautan Opsional (Klik Banner)"
              value={formData.link || '/shop'}
              onChange={(e) => handleChange('link', e.target.value)}
              placeholder="/shop"
              helperText="Halaman yang dituju saat pelanggan mengklik banner pengumuman"
            />
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
            <span>Simpan Banner & Promo</span>
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
