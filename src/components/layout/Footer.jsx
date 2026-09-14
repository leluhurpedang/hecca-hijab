import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, ShieldCheck, Truck, RefreshCw, Send, Lock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useCMS } from '../../context/CMSContext';
import { SafeImage } from '../common/SafeImage';

function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();
  const { cms } = useCMS();
  const footer = cms.footer || {};
  const brand = cms.brand || {};

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Terima kasih! Voucher diskon 10% telah dikirimkan ke email Anda ✨', 'success');
      setEmail('');
    }
  };

  let rawWa = footer.socials?.whatsapp || cms.whatsapp?.recipientNumber || '6281234567890';
  let waPhone = rawWa.replace(/[^0-9]/g, '');
  if (waPhone.startsWith('08')) {
    waPhone = '62' + waPhone.slice(1);
  }

  return (
    <footer className="bg-espresso-950 text-cream-100 border-t border-espresso-900 mt-auto pt-16 pb-8 font-sans">
      {/* Top Value Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-espresso-900/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-espresso-900/30">
            <div className="w-12 h-12 rounded-xl bg-mocha-500/10 text-mocha-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base text-cream-50 font-bold">Pengiriman Cepat</h4>
              <p className="text-xs text-stone-400 mt-0.5">Gratis Ongkir min. belanja Rp 250.000 ke seluruh kota.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-espresso-900/30">
            <div className="w-12 h-12 rounded-xl bg-mocha-500/10 text-mocha-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base text-cream-50 font-bold">100% Kualitas Butik</h4>
              <p className="text-xs text-stone-400 mt-0.5">Serat pilihan, tepian laser cut presisi & packaging eksklusif.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-2xl bg-espresso-900/30">
            <div className="w-12 h-12 rounded-xl bg-mocha-500/10 text-mocha-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base text-cream-50 font-bold">Garansi Kepuasan</h4>
              <p className="text-xs text-stone-400 mt-0.5">Dukungan tukar warna bila produk tidak sesuai ekspektasi.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 text-left">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              {footer.footerLogoImage ? (
                <SafeImage
                  src={footer.footerLogoImage}
                  alt={footer.brandName || brand.brandName || 'Haecca Hijab'}
                  className="h-8 w-auto object-contain mb-2"
                />
              ) : (
                <>
                  <span className="text-3xl tracking-[0.2em] font-bold text-cream-50">
                    {footer.brandName || brand.logoText || 'HAECCA'}
                  </span>
                  <span className="text-[9px] tracking-[0.35em] font-medium text-mocha-400 uppercase">
                    {footer.tagline || brand.tagline || 'HIJAB & MODEST'}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              {footer.description ||
                'Menghadirkan keanggunan yang bersahaja melalui kain voal ultrafine, pashmina silk, dan modest accessories berkualitas butik untuk wanita aktif Indonesia.'}
            </p>
            <div className="flex items-center gap-3 pt-2 text-stone-400">
              <a
                href={footer.socials?.instagram || 'https://instagram.com/haeccahijab'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-espresso-900 flex items-center justify-center hover:text-cream-100 hover:bg-mocha-600 transition-colors"
                aria-label="Instagram Haecca"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${waPhone}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-espresso-900 flex items-center justify-center hover:text-cream-100 hover:bg-[#25D366] transition-colors"
                aria-label="WhatsApp Haecca"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${footer.socials?.email || 'hello@haeccahijab.com'}`}
                className="w-8 h-8 rounded-full bg-espresso-900 flex items-center justify-center hover:text-cream-100 hover:bg-mocha-600 transition-colors"
                aria-label="Email Haecca"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h5 className="text-xs tracking-wider uppercase text-cream-100 font-bold">
              Koleksi
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/shop?category=pashmina" className="hover:text-mocha-300 transition-colors">
                  Pashmina Silk & Ceruty
                </Link>
              </li>
              <li>
                <Link to="/shop?category=voal" className="hover:text-mocha-300 transition-colors">
                  Voal Ultrafine Premium
                </Link>
              </li>
              <li>
                <Link to="/shop?category=hijab" className="hover:text-mocha-300 transition-colors">
                  Paris Square & Bergo
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="hover:text-mocha-300 transition-colors">
                  Inner Ciput & Scrunchie
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-mocha-300 transition-colors">
                  Semua Produk
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="text-xs tracking-wider uppercase text-cream-100 font-bold">
              Bantuan & Informasi
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/about" className="hover:text-mocha-300 transition-colors">
                  Tentang Haecca Hijab
                </Link>
              </li>
              <li>
                <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer" className="hover:text-mocha-300 transition-colors">
                  Konfirmasi Pembayaran
                </a>
              </li>
              <li>
                <Link to="/cart" className="hover:text-mocha-300 transition-colors">
                  Cek Keranjang
                </Link>
              </li>
              {/* Admin CMS Portal link - can be hidden via Footer CMS */}
              {footer.showAdminLink !== false && (
                <li>
                  <Link to="/admin" className="hover:text-mocha-300 transition-colors inline-flex items-center gap-1.5 font-medium text-cream-100 pt-1">
                    <Lock className="w-3 h-3 text-gold-400" />
                    <span>Admin CMS Portal</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-mocha-500/30 text-mocha-300 rounded font-semibold">Demo</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h5 className="text-xs tracking-wider uppercase text-cream-100 font-bold">
              Haecca VIP Club
            </h5>
            <p className="text-xs text-stone-400 leading-relaxed">
              Dapatkan info rilisan koleksi eksklusif & kupon diskon 10% untuk pesanan pertamamu.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan alamat email..."
                  className="w-full pl-3.5 pr-10 py-2.5 bg-espresso-900 rounded-xl border border-espresso-800 text-xs text-cream-50 placeholder:text-stone-500 focus:outline-none focus:border-mocha-400"
                />
                <button
                  type="submit"
                  aria-label="Kirim langganan newsletter"
                  className="absolute right-1.5 top-1.5 p-1.5 bg-mocha-500 hover:bg-mocha-600 text-white rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-espresso-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <p>{footer.copyright || `© ${new Date().getFullYear()} Haecca Hijab. Seluruh hak cipta dilindungi undang-undang.`}</p>
        <div className="flex items-center gap-2.5 text-[11px] text-stone-400 flex-wrap justify-center">
          <span className="px-2 py-0.5 bg-espresso-900 rounded text-stone-300">BCA</span>
          <span className="px-2 py-0.5 bg-espresso-900 rounded text-stone-300">Mandiri</span>
          <span className="px-2 py-0.5 bg-espresso-900 rounded text-stone-300">BSI</span>
          <span className="px-2 py-0.5 bg-espresso-900 rounded text-stone-300">QRIS</span>
          <span className="px-2 py-0.5 bg-espresso-900 rounded text-stone-300">WhatsApp Order</span>
        </div>
      </div>
    </footer>
  );
}
