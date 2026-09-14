import React, { useState, useEffect } from 'react';
import { Save, BookOpen, Sparkles, MapPin, Image as ImageIcon } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import { CMSImageUploader } from '../components/CMSImageUploader';
import { isSupabaseActive } from '../../lib/storage/dataProvider.js';

export function AdminAboutCMS() {
  const { cms, updateCMS } = useCMS();
  const [formData, setFormData] = useState(cms.about);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cms.about) {
      setFormData(cms.about);
    }
  }, [cms.about]);

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
      await updateCMS('about', formData, 'Konten Halaman Tentang Kami berhasil disimpan! ✨');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-8 text-left max-w-5xl mx-auto pb-12 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-mocha-600">
              Konten Website
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-espresso-950">
              Tentang Kami CMS
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Kelola narasi brand, foto studio/kain berstandar Blob storage, kutipan filosofi, dan kontak butik Haecca Hijab.
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

        {/* 1. Header & Hero Intro */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <BookOpen className="w-5 h-5 text-mocha-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Header & Pengantar Halaman
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Eyebrow / Subtitle Kecil"
              value={formData.eyebrow || ''}
              onChange={(e) => handleChange('eyebrow', e.target.value)}
              placeholder="Tentang Haecca"
            />

            <Input
              label="Judul Utama (Heading)"
              value={formData.heading || ''}
              onChange={(e) => handleChange('heading', e.target.value)}
              placeholder="Merayakan Keanggunan Muslimah Melalui Kualitas Tanpa Kompromi"
              required
            />

            <Textarea
              label="Paragraf Pembuka (Intro Description)"
              value={formData.intro || ''}
              onChange={(e) => handleChange('intro', e.target.value)}
              rows={3}
              placeholder="Tuliskan komitmen Haecca terhadap kepuasan pelanggan..."
            />
          </div>
        </div>

        {/* 2. Brand Story, Quote & Studio Image */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <Sparkles className="w-5 h-5 text-mocha-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Cerita Brand, Kutipan & Foto Studio
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Label Seksi Cerita"
              value={formData.storyLabel || ''}
              onChange={(e) => handleChange('storyLabel', e.target.value)}
              placeholder="Awal Mula Haecca"
            />

            <Textarea
              label="Kutipan Filosofi Utama (Main Quote)"
              value={formData.quote || ''}
              onChange={(e) => handleChange('quote', e.target.value)}
              rows={2}
              placeholder="Kutipan inspiratif tentang sehelai hijab..."
            />

            <Textarea
              label="Paragraf Cerita 1"
              value={formData.storyP1 || ''}
              onChange={(e) => handleChange('storyP1', e.target.value)}
              rows={4}
              placeholder="Ceritakan awal mula pendirian brand..."
            />

            <Textarea
              label="Paragraf Cerita 2"
              value={formData.storyP2 || ''}
              onChange={(e) => handleChange('storyP2', e.target.value)}
              rows={4}
              placeholder="Jelaskan standar kualitas, finishing, dan packaging..."
            />

            {/* Image Uploader for Studio / Story Photo */}
            <CMSImageUploader
              label="Foto Studio / Atelier"
              value={formData.aboutImage || ''}
              onChange={(val) => handleChange('aboutImage', val)}
              aspectRatio="aspect-[4/3]"
              recommendedSize="1000 x 750 px"
              helperText={
                isSupabaseActive
                  ? 'Unggah foto studio atau atelier. Disimpan aman dalam Supabase Storage.'
                  : 'Unggah foto studio atau atelier. Disimpan aman dalam IndexedDB Blob storage.'
              }
            />
          </div>
        </div>

        {/* 3. Fabric Story & Texture Image */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <ImageIcon className="w-5 h-5 text-mocha-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Cerita Kain & Foto Tekstur
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Judul Seksi Hubungi Kami / Layanan"
              value={formData.fabricStoryTitle || ''}
              onChange={(e) => handleChange('fabricStoryTitle', e.target.value)}
              placeholder="Boutique Studio & Layanan Pelanggan"
            />

            <Textarea
              label="Deskripsi Layanan Pelanggan"
              value={formData.fabricStoryText || ''}
              onChange={(e) => handleChange('fabricStoryText', e.target.value)}
              rows={3}
              placeholder="Ada pertanyaan mengenai panduan warna, ketersediaan stok..."
            />

            {/* Image Uploader for Fabric Texture Photo */}
            <CMSImageUploader
              label="Foto Tekstur Kain / Fabric Showcase"
              value={formData.fabricImage || ''}
              onChange={(val) => handleChange('fabricImage', val)}
              aspectRatio="aspect-[4/3]"
              recommendedSize="1000 x 750 px"
              helperText={
                isSupabaseActive
                  ? 'Unggah foto detail kain hijab, serat sutra, atau laser cut. Disimpan dalam Supabase Storage.'
                  : 'Unggah foto detail kain hijab, serat sutra, atau laser cut. Disimpan dalam Blob IndexedDB.'
              }
            />
          </div>
        </div>

        {/* 4. Studio Contact & Operating Hours */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <MapPin className="w-5 h-5 text-mocha-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Lokasi Studio & Jam Operasional
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Alamat Studio Butik"
                value={formData.studioAddress || ''}
                onChange={(e) => handleChange('studioAddress', e.target.value)}
                placeholder="Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190"
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Jam Operasional"
                value={formData.studioHours || ''}
                onChange={(e) => handleChange('studioHours', e.target.value)}
                placeholder="Senin - Sabtu: 09.00 - 20.00 WIB | Minggu: 10.00 - 18.00 WIB"
              />
            </div>

            <Input
              label="Email Customer Care"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="hello@haeccahijab.com"
            />

            <Input
              label="WhatsApp Customer Care"
              value={formData.whatsapp || ''}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="6281234567890"
              helperText="Format internasional tanpa tanda plus (+), contoh: 6281234567890"
            />
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Konten Tentang Kami</span>
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
