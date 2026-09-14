import React, { useState } from 'react';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { useCMS } from '../../context/CMSContext';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();
  const { cms } = useCMS();

  const voucherCode =
    cms.announcementBar?.voucherCode ||
    cms.bannerPromo?.voucherCode ||
    'HAECCANEW';

  const discountPercentage =
    cms.announcementBar?.discountPercentage ||
    cms.bannerPromo?.discountPercentage ||
    10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast(`Kupon diskon ${discountPercentage}% (Kode: ${voucherCode}) telah dikirimkan ke email Anda! 🎉`, 'success');
      setEmail('');
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-cream-50 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sand-200 shadow-card text-center relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-sand-100/50 pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-mocha-500/5 pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-100 text-mocha-600 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Privilege Member</span>
            </div>

            <h2 className="text-3xl sm:text-4xl text-espresso-950 font-bold tracking-tight">
              Dapatkan Diskon {discountPercentage}% untuk Pesanan Pertamamu
            </h2>

            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Jadilah yang pertama mengetahui peluncuran koleksi terbatas, restock warna populer, dan voucher eksklusif akhir pekan.
            </p>

            <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan alamat email Anda..."
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-sand-200 rounded-full text-xs sm:text-sm text-espresso-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-mocha-400/30 focus:border-mocha-500"
                />
              </div>
              <Button type="submit" variant="primary" size="md" className="shrink-0 font-semibold">
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>

            <p className="text-[11px] text-stone-400">
              Bebas spam. Anda dapat berhenti berlangganan kapan saja.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
