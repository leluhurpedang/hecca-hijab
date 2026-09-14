import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { Link } from 'react-router-dom';

export function AnnouncementBar() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { cms } = useCMS();
  const banner = cms.announcementBar || cms.bannerPromo || {};

  if (isDismissed || banner.isEnabled === false) return null;

  const content = (
    <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-1.5 flex-wrap">
      <span className="inline-flex items-center gap-1 text-gold-400 font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
      </span>
      <span>{banner.announcementText || 'Special Launch: Gratis Ongkir min. belanja Rp 250.000'}</span>
      {banner.voucherCode && (
        <>
          <span className="hidden sm:inline text-stone-500">•</span>
          <span className="hidden sm:inline">
            Gunakan kode <span className="underline font-bold text-cream-50 cursor-pointer hover:text-gold-300">{banner.voucherCode}</span> diskon {banner.discountPercentage || 10}%
          </span>
        </>
      )}
    </div>
  );

  return (
    <aside aria-label="Pengumuman promo" className="bg-espresso-950 text-cream-100 text-[11px] sm:text-xs py-2 px-4 transition-all relative z-40 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {banner.link ? (
          <Link to={banner.link} className="flex-1 hover:text-sand-200 transition-colors">
            {content}
          </Link>
        ) : (
          content
        )}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-stone-400 hover:text-cream-100 transition-colors p-0.5"
          aria-label="Tutup pengumuman"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
