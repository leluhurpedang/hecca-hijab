import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, ExternalLink, ArrowRight, Home } from 'lucide-react';
import { Button } from '../common/Button';

export function WhatsAppOrderSuccessModal({
  isOpen,
  whatsappUrl,
  customerName,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-sand-200 z-10 animate-fade-in space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-espresso-950">
            Pesanan Anda Siap Dikirim!
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Terima kasih, <strong>{customerName}</strong>. Halaman WhatsApp Anda telah dibuka dengan format pemesanan otomatis.
          </p>
        </div>

        <div className="p-4 bg-cream-50 rounded-2xl border border-sand-200 text-xs text-stone-600 text-left space-y-2">
          <p className="font-semibold text-espresso-900">
            Langkah selanjutnya:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-stone-500">
            <li>Tekan tombol kirim di ruang obrolan WhatsApp Anda</li>
            <li>Tunggu balasan konfirmasi ketersediaan stok & nomor rekening dari admin kami</li>
            <li>Kirimkan bukti transfer pembayaran</li>
          </ol>
        </div>

        {/* WhatsApp Manual Re-open Button */}
        <div className="space-y-2.5 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button
              variant="whatsapp"
              size="md"
              className="w-full flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Buka WhatsApp Lagi</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </a>

          <Link to="/" onClick={onClose} className="block w-full">
            <Button variant="secondary" size="md" className="w-full">
              <Home className="w-4 h-4 mr-1.5" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
