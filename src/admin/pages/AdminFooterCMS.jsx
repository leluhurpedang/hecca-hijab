import React, { useState, useEffect } from 'react';
import { Save, PanelBottom, Shield } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import { CMSImageUploader } from '../components/CMSImageUploader';

export function AdminFooterCMS() {
  const { cms, updateCMS } = useCMS();
  const [formData, setFormData] = useState(cms.footer || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cms.footer) {
      setFormData(cms.footer);
    }
  }, [cms.footer]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...(prev.socials || {}),
        [key]: value,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCMS('footer', formData, 'Pengaturan Footer berhasil disimpan! ✨');
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
              Footer CMS
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Kelola teks identitas brand, logo footer Blob, tautan kontak, copyright, dan opsi visibilitas portal admin.
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

        {/* 1. Brand Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <PanelBottom className="w-5 h-5 text-mocha-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Informasi Brand & Deskripsi
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Brand"
              value={formData.brandName || ''}
              onChange={(e) => handleChange('brandName', e.target.value)}
              placeholder="Haecca Hijab"
              required
            />

            <Input
              label="Tagline Singkat"
              value={formData.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="Premium Modest Fashion"
            />
          </div>

          <Textarea
            label="Deskripsi Footer Brand"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            placeholder="Tuliskan komitmen brand di footer..."
          />

          <Input
            label="Teks Copyright"
            value={formData.copyright || ''}
            onChange={(e) => handleChange('copyright', e.target.value)}
            placeholder="© 2026 Haecca Hijab. Seluruh hak cipta dilindungi undang-undang."
          />

          {/* Footer Logo Uploader */}
          <div className="pt-2">
            <CMSImageUploader
              label="Logo Gambar Footer Opsional (Blob Storage)"
              value={formData.footerLogoImage || ''}
              onChange={(val) => handleChange('footerLogoImage', val)}
              aspectRatio="aspect-[3/1]"
              recommendedSize="300 x 100 px (Transparan PNG/WebP)"
              helperText="Jika dikosongkan, footer akan otomatis menampilkan teks Nama Brand."
            />
          </div>
        </div>

        {/* 2. Social Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-4">
          <h2 className="text-lg font-bold text-espresso-950 border-b border-sand-200 pb-3">
            Tautan Media Sosial & Kontak
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="URL Instagram"
              value={formData.socials?.instagram || ''}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              placeholder="https://instagram.com/haeccahijab"
            />

            <Input
              label="URL WhatsApp"
              value={formData.socials?.whatsapp || ''}
              onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
              placeholder="https://wa.me/6281234567890"
            />

            <Input
              label="Alamat Email"
              value={formData.socials?.email || ''}
              onChange={(e) => handleSocialChange('email', e.target.value)}
              placeholder="hello@haeccahijab.com"
            />
          </div>
        </div>

        {/* 3. Visibility Options */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <Shield className="w-5 h-5 text-mocha-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Opsi Visibilitas Portal Admin di Footer Storefront
            </h2>
          </div>

          <label className="flex items-start gap-3 p-4 bg-cream-50 rounded-2xl border border-sand-200 cursor-pointer hover:bg-cream-100 transition-colors">
            <input
              type="checkbox"
              checked={formData.showAdminLink !== false}
              onChange={(e) => handleChange('showAdminLink', e.target.checked)}
              className="mt-1 w-4 h-4 text-mocha-600 rounded focus:ring-mocha-400"
            />
            <div>
              <span className="text-xs sm:text-sm font-bold text-espresso-950 block">
                Tampilkan Tautan "CMS Admin Portal" di Footer Toko
              </span>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                Berguna untuk demonstrasi portfolio agar reviewer dapat dengan mudah menemukan panel admin. Jika dinonaktifkan untuk produksi, tautan akan disembunyikan dari storefront umum dan hanya dapat diakses melalui URL /admin.
              </p>
            </div>
          </label>
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
            <span>Simpan Pengaturan Footer</span>
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
