import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { SafeImage } from '../common/SafeImage';
import { useCMS } from '../../context/CMSContext';

export function PromoBanner() {
  const { cms } = useCMS();
  const spotlight = cms.homepage?.spotlight || {
    isEnabled: true,
    eyebrow: 'Limited Edition Series',
    title: 'The Silk Harmony: Kemewahan yang Nyaman Seharian',
    description:
      'Dibuat dari benang sutra cradenza grade 6A dengan kilau shimmer natural yang memikat. Setiap pembelian seri ini mendapatkan kemasan exclusive rigid giftbox berpita satin emas.',
    image:
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85',
    ctaText: 'Miliki Sekarang',
    ctaLink: '/shop?category=pashmina',
  };

  if (spotlight.isEnabled === false) {
    return null;
  }

  const bannerImage =
    spotlight.image ||
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85';

  return (
    <section className="py-12 sm:py-16 bg-cream-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-espresso-950 text-cream-100 shadow-2xl border border-sand-200/50">
          {/* Background Image Scrim with SafeImage */}
          <div className="absolute inset-0 z-0">
            <SafeImage
              src={bannerImage}
              alt={spotlight.title || 'Promo Haecca Pure Silk'}
              className="w-full h-full object-cover object-center opacity-35 filter blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-espresso-950 via-espresso-950/80 to-espresso-950/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{spotlight.eyebrow || 'Limited Edition Series'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-cream-50 font-bold leading-tight">
              {spotlight.title || 'The Silk Harmony: Kemewahan yang Nyaman Seharian'}
            </h2>

            <p className="text-xs sm:text-sm lg:text-base text-stone-300 leading-relaxed max-w-xl">
              {spotlight.description ||
                'Dibuat dari benang sutra cradenza grade 6A dengan kilau shimmer natural yang memikat. Setiap pembelian seri ini mendapatkan kemasan exclusive rigid giftbox berpita satin emas.'}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link to={spotlight.ctaLink || '/shop?category=pashmina'}>
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-mocha-500 hover:bg-mocha-600 text-white shadow-lg group font-semibold"
                >
                  <span>{spotlight.ctaText || 'Miliki Sekarang'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
