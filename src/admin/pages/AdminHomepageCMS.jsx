import React, { useState, useEffect } from 'react';
import {
  Save,
  Sparkles,
  Layout,
  Flame,
  Heading
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import { CMSImageUploader } from '../components/CMSImageUploader';
import { isSupabaseActive } from '../../lib/storage/dataProvider.js';

export function AdminHomepageCMS() {
  const { cms, updateCMS } = useCMS();
  const [formData, setFormData] = useState(cms.homepage || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (cms.homepage) {
      setFormData(cms.homepage);
    }
  }, [cms.homepage]);

  const handleHeroChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      hero: {
        ...(prev.hero || {}),
        [field]: value,
      },
    }));
  };

  const handleSpotlightChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      spotlight: {
        ...(prev.spotlight || {}),
        [field]: value,
      },
    }));
  };

  const handleSectionTitlesChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      sectionTitles: {
        ...(prev.sectionTitles || {}),
        [field]: value,
      },
    }));
  };

  const handleSectionToggle = (sectionKey) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...(prev.sections || {}),
        [sectionKey]: prev.sections ? !prev.sections[sectionKey] : false,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCMS('homepage', formData, 'Konten Homepage berhasil diperbarui! ✨');
    } finally {
      setIsSaving(false);
    }
  };

  const sectionLabels = [
    { key: 'showCategories', label: 'Shop by Category', desc: 'Menampilkan kartu 4 kategori utama' },
    { key: 'showNewArrivals', label: 'New Collection Grid', desc: 'Menampilkan rilisan produk terbaru' },
    { key: 'showSpotlight', label: 'Signature Spotlight Banner', desc: 'Banner promosi busana sutra eksklusif' },
    { key: 'showBestSellers', label: 'Best Sellers Section', desc: 'Produk favorit pelanggan' },
    { key: 'showValueProps', label: 'Value Propositions', desc: '4 pilar keunggulan material & butik' },
    { key: 'showTestimonials', label: 'Testimoni (#HaeccaLadies)', desc: 'Ulasan nyata dari pelanggan setia' },
    { key: 'showNewsletter', label: 'VIP Club / Newsletter', desc: 'Form pendaftaran voucher diskon 10%' },
  ];

  const hero = formData.hero || {};
  const spotlight = formData.spotlight || {};
  const sectionTitles = formData.sectionTitles || {};

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
              Homepage CMS
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Kelola hero banner, spotlight promosi, judul seksi, media visual, dan visibilitas tampilan beranda.
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

        {/* 1. Hero Section Content & Image */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <Sparkles className="w-5 h-5 text-mocha-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Hero Section (Banner Utama)
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Eyebrow / Label Kecil Atas"
              value={hero.eyebrow || ''}
              onChange={(e) => handleHeroChange('eyebrow', e.target.value)}
              placeholder="Contoh: Koleksi Signature 2026"
            />

            <Input
              label="Judul Utama (Headline)"
              value={hero.heading || ''}
              onChange={(e) => handleHeroChange('heading', e.target.value)}
              placeholder="Contoh: Sentuhan Keanggunan dalam Setiap Helai Hijab"
              required
            />

            <Textarea
              label="Deskripsi Hero"
              value={hero.description || ''}
              onChange={(e) => handleHeroChange('description', e.target.value)}
              rows={3}
              placeholder="Jelaskan keanggunan dan kualitas produk..."
            />

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Teks Tombol Utama (Primary CTA)"
                value={hero.primaryCtaText || ''}
                onChange={(e) => handleHeroChange('primaryCtaText', e.target.value)}
              />
              <Input
                label="Tautan Tombol Utama"
                value={hero.primaryCtaLink || ''}
                onChange={(e) => handleHeroChange('primaryCtaLink', e.target.value)}
              />

              <Input
                label="Teks Tombol Kedua (Secondary CTA)"
                value={hero.secondaryCtaText || ''}
                onChange={(e) => handleHeroChange('secondaryCtaText', e.target.value)}
              />
              <Input
                label="Tautan Tombol Kedua"
                value={hero.secondaryCtaLink || ''}
                onChange={(e) => handleHeroChange('secondaryCtaLink', e.target.value)}
              />
            </div>

            {/* Floating Card Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-sand-100">
              <Input
                label="Label Badge Melayang"
                value={hero.materialLabel || ''}
                onChange={(e) => handleHeroChange('materialLabel', e.target.value)}
              />
              <Input
                label="Judul Bahan"
                value={hero.materialTitle || ''}
                onChange={(e) => handleHeroChange('materialTitle', e.target.value)}
              />
              <Input
                label="Teks Harga Awal"
                value={hero.startingPrice || ''}
                onChange={(e) => handleHeroChange('startingPrice', e.target.value)}
              />
            </div>

            {/* Hero Image Uploader */}
            <div className="pt-2">
              <CMSImageUploader
                label="Foto Hero Utama"
                value={hero.heroImage || ''}
                onChange={(val) => handleHeroChange('heroImage', val)}
                aspectRatio="aspect-[3/4]"
                recommendedSize="1200 x 1600 px (Potret)"
                helperText={
                  isSupabaseActive
                    ? 'Mendukung JPG, PNG, WebP. Disimpan ke Supabase Storage dengan kompresi otomatis.'
                    : 'Mendukung JPG, PNG, WebP. Disimpan ke IndexedDB Blob storage dengan kompresi otomatis.'
                }
              />
            </div>
          </div>
        </div>

        {/* 2. Promotional Spotlight Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-mocha-600" />
              <h2 className="text-lg font-bold text-espresso-950">
                Signature Spotlight Banner
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={spotlight.isEnabled !== false}
                onChange={(e) => handleSpotlightChange('isEnabled', e.target.checked)}
                className="w-4 h-4 text-mocha-600 rounded focus:ring-mocha-400"
              />
              <span className="text-xs font-bold text-espresso-950">
                {spotlight.isEnabled !== false ? 'Aktif' : 'Nonaktif'}
              </span>
            </label>
          </div>

          <div className="space-y-4">
            <Input
              label="Eyebrow Spotlight"
              value={spotlight.eyebrow || ''}
              onChange={(e) => handleSpotlightChange('eyebrow', e.target.value)}
              placeholder="Contoh: Limited Edition Series"
            />

            <Input
              label="Judul Utama Spotlight"
              value={spotlight.title || ''}
              onChange={(e) => handleSpotlightChange('title', e.target.value)}
              placeholder="The Silk Harmony: Kemewahan yang Nyaman Seharian"
            />

            <Textarea
              label="Deskripsi Spotlight"
              value={spotlight.description || ''}
              onChange={(e) => handleSpotlightChange('description', e.target.value)}
              rows={3}
              placeholder="Jelaskan keistimewaan koleksi eksklusif ini..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Teks Tombol CTA"
                value={spotlight.ctaText || ''}
                onChange={(e) => handleSpotlightChange('ctaText', e.target.value)}
                placeholder="Miliki Sekarang"
              />
              <Input
                label="Tautan Tombol CTA"
                value={spotlight.ctaLink || ''}
                onChange={(e) => handleSpotlightChange('ctaLink', e.target.value)}
                placeholder="/shop?category=pashmina"
              />
            </div>

            {/* Spotlight Banner Image Uploader */}
            <CMSImageUploader
              label="Foto Latar Spotlight Banner (Blob Storage)"
              value={spotlight.image || ''}
              onChange={(val) => handleSpotlightChange('image', val)}
              aspectRatio="aspect-[16/9]"
              recommendedSize="1200 x 675 px (Lanskap)"
              helperText="Unggah foto estetis busana sutra/hijab. Disimpan sebagai Blob di database."
            />
          </div>
        </div>

        {/* 3. Section Titles & Subtitles */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <Heading className="w-5 h-5 text-mocha-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Judul & Subjudul Seksi Storefront
            </h2>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-sand-200 space-y-3">
              <span className="text-xs font-bold text-mocha-700 uppercase tracking-wider block">
                Seksi Kategori (Shop by Category)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Judul Kategori"
                  value={sectionTitles.categoriesTitle || ''}
                  onChange={(e) => handleSectionTitlesChange('categoriesTitle', e.target.value)}
                  placeholder="Pilihan Koleksi"
                />
                <Input
                  label="Subjudul Kategori"
                  value={sectionTitles.categoriesSubtitle || ''}
                  onChange={(e) => handleSectionTitlesChange('categoriesSubtitle', e.target.value)}
                  placeholder="Temukan padanan hijab sempurna untuk setiap momen istimewa"
                />
              </div>
            </div>

            {/* New Arrivals */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-sand-200 space-y-3">
              <span className="text-xs font-bold text-mocha-700 uppercase tracking-wider block">
                Seksi Koleksi Terbaru (New Collection)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Judul Koleksi Terbaru"
                  value={sectionTitles.newArrivalsTitle || ''}
                  onChange={(e) => handleSectionTitlesChange('newArrivalsTitle', e.target.value)}
                  placeholder="Koleksi Terbaru"
                />
                <Input
                  label="Subjudul Koleksi Terbaru"
                  value={sectionTitles.newArrivalsSubtitle || ''}
                  onChange={(e) => handleSectionTitlesChange('newArrivalsSubtitle', e.target.value)}
                  placeholder="Sentuhan warna & siluet terkini yang dirancang untuk muslimah modern"
                />
              </div>
            </div>

            {/* Best Sellers */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-sand-200 space-y-3">
              <span className="text-xs font-bold text-mocha-700 uppercase tracking-wider block">
                Seksi Produk Terlaris (Best Sellers)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Judul Best Sellers"
                  value={sectionTitles.bestSellersTitle || ''}
                  onChange={(e) => handleSectionTitlesChange('bestSellersTitle', e.target.value)}
                  placeholder="Produk Terlaris"
                />
                <Input
                  label="Subjudul Best Sellers"
                  value={sectionTitles.bestSellersSubtitle || ''}
                  onChange={(e) => handleSectionTitlesChange('bestSellersSubtitle', e.target.value)}
                  placeholder="Favorit ribuan #HaeccaLadies untuk kenyamanan dan keanggunan sehari-hari"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Sections Visibility Toggles */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <Layout className="w-5 h-5 text-mocha-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Pengaturan Tampilan Seksi Homepage
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sectionLabels.map((sec) => {
              const isChecked = formData.sections ? formData.sections[sec.key] !== false : true;

              return (
                <label
                  key={sec.key}
                  className="flex items-start gap-3 p-4 rounded-2xl border border-sand-200 bg-cream-50/60 hover:bg-cream-100 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSectionToggle(sec.key)}
                    className="mt-1 w-4 h-4 text-mocha-600 rounded focus:ring-mocha-400"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-espresso-950 block">
                      {sec.label}
                    </span>
                    <span className="text-[11px] text-stone-500 mt-0.5 block leading-relaxed">
                      {sec.desc}
                    </span>
                  </div>
                </label>
              );
            })}
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
            <span>Simpan Pengaturan Homepage</span>
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
