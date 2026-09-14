import React, { useState, useEffect } from 'react';
import { Save, MessageCircle } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useCMS } from '../../context/CMSContext';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';

export function AdminWhatsAppCMS() {
  const { cms, updateCMS } = useCMS();
  const initialData = cms.whatsapp || cms.whatsappSettings || {};
  const [formData, setFormData] = useState({
    recipientNumber: initialData.recipientNumber || '6281234567890',
    greetingTemplate: initialData.greetingTemplate || 'Halo Admin Haecca Hijab, saya ingin memesan produk berikut:',
    defaultAdditionalNote: initialData.defaultAdditionalNote || initialData.orderNotes || 'Mohon info total pembayaran dan nomor rekening transfer resmi.',
    orderNotes: initialData.defaultAdditionalNote || initialData.orderNotes || 'Mohon info total pembayaran dan nomor rekening transfer resmi.',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const current = cms.whatsapp || cms.whatsappSettings;
    if (current) {
      setFormData({
        recipientNumber: current.recipientNumber || '6281234567890',
        greetingTemplate: current.greetingTemplate || 'Halo Admin Haecca Hijab, saya ingin memesan produk berikut:',
        defaultAdditionalNote: current.defaultAdditionalNote || current.orderNotes || 'Mohon info total pembayaran dan nomor rekening transfer resmi.',
        orderNotes: current.defaultAdditionalNote || current.orderNotes || 'Mohon info total pembayaran dan nomor rekening transfer resmi.',
      });
    }
  }, [cms.whatsapp, cms.whatsappSettings]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'defaultAdditionalNote') next.orderNotes = value;
      if (field === 'orderNotes') next.defaultAdditionalNote = value;
      return next;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCMS(
        'whatsapp',
        formData,
        'Pengaturan WhatsApp Checkout berhasil disimpan! ✨'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Generate sample template preview
  const sampleOrderMessage = `${formData.greetingTemplate || 'Halo Admin Haecca Hijab, saya ingin memesan produk berikut:'}

Nama: Sarah Amalia
No. WhatsApp: 081234567890
Alamat: Jl. Melati No. 15, Jakarta Selatan

Pesanan:
1. Haecca Voal Premium Ultrafine (Soft Sand) x 2 = Rp 178.000

Subtotal: Rp 178.000
Biaya Pengiriman: Rp 15.000
Diskon: Rp 0
TOTAL: Rp 193.000

Metode Pembayaran: Bank Transfer (BCA)
Catatan: ${formData.defaultAdditionalNote || 'Mohon info total pembayaran dan nomor rekening transfer.'}`;

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
              WhatsApp Checkout
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Konfigurasi nomor WhatsApp tujuan penerimaan pesanan dan format pesan checkout otomatis.
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

        {/* 1. Recipient Number & Greeting */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6">
          <div className="flex items-center gap-2 border-b border-sand-200 pb-3">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-espresso-950">
              Nomor WhatsApp Penerima Order
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Nomor WhatsApp Admin (Format Internasional Tanpa +)"
              value={formData.recipientNumber}
              onChange={(e) => handleChange('recipientNumber', e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="6281234567890"
              helperText="Awali dengan 62 (contoh: 6281234567890). Pesanan dari formulir checkout akan otomatis diarahkan ke nomor ini."
              required
            />

            <Input
              label="Kalimat Pembuka Pesan (Greeting Template)"
              value={formData.greetingTemplate}
              onChange={(e) => handleChange('greetingTemplate', e.target.value)}
              placeholder="Halo Admin Haecca Hijab, saya ingin memesan produk berikut:"
              required
            />

            <Textarea
              label="Catatan Tambahan Default di Akhir Pesan"
              value={formData.defaultAdditionalNote}
              onChange={(e) => handleChange('defaultAdditionalNote', e.target.value)}
              rows={2}
              placeholder="Mohon info total pembayaran dan nomor rekening transfer resmi."
            />
          </div>
        </div>

        {/* 2. Live Message Preview */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-4">
          <h2 className="text-lg font-bold text-espresso-950 border-b border-sand-200 pb-3 flex items-center justify-between">
            <span>Pratinjau Pesan yang Akan Diterima di WhatsApp</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 font-sans">
              Format Siap Kirim
            </span>
          </h2>

          <div className="p-4 bg-cream-50 rounded-2xl border border-sand-200 font-mono text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">
            {sampleOrderMessage}
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
            <span>Simpan Pengaturan WhatsApp</span>
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}
