import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Award } from 'lucide-react';
import { Button } from '../common/Button';
import { SafeImage } from '../common/SafeImage';
import { useCMS } from '../../context/CMSContext';

export function HeroSection() {
  const { cms } = useCMS();
  const hero = cms.homepage?.hero || {
    eyebrow: 'Koleksi Signature 2026',
    heading: 'Sentuhan Keanggunan dalam Setiap Helai Hijab',
    description:
      'Diciptakan dengan material voal ultrafine dan serat silk premium berstandar butik. Lembut, adem, tegak paripurna di dahi, serta memancarkan pesona anggun setiap muslimah modern.',
    primaryCtaText: 'Belanja Sekarang',
    primaryCtaLink: '/shop',
    secondaryCtaText: 'Lihat Voal Premium',
    secondaryCtaLink: '/shop?category=voal',
    heroImage:
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=80',
    materialLabel: 'Bahan Eksklusif',
    materialTitle: 'Ultrafine Voal Voile Import',
    startingPrice: 'Mulai Rp 89.000',
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-24 bg-gradient-to-b from-cream-100 via-cream-50 to-cream-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 text-left space-y-6 sm:space-y-8 z-10">
            {/* Launch Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200/60 border border-sand-300/80 text-xs text-espresso-950 font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-mocha-600" />
              <span>{hero.eyebrow || 'Koleksi Signature 2026'}</span>
            </div>

            {/* Main Title - Plus Jakarta Sans Bold */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-espresso-950 font-bold tracking-tight leading-[1.15]">
                {hero.heading}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-stone-600 leading-relaxed max-w-xl font-normal">
                {hero.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link to={hero.primaryCtaLink || '/shop'}>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-card group font-semibold"
                >
                  <span>{hero.primaryCtaText || 'Belanja Sekarang'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link to={hero.secondaryCtaLink || '/shop?category=voal'}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/80 font-medium"
                >
                  {hero.secondaryCtaText || 'Lihat Voal Premium'}
                </Button>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 sm:pt-8 border-t border-sand-200/80 grid grid-cols-3 gap-4 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-mocha-600">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-semibold text-espresso-900">Kualitas Butik</span>
                </div>
                <p className="text-[11px] text-stone-500">Serat halus & laser cut rapi</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-mocha-600">
                  <Truck className="w-4 h-4" />
                  <span className="text-xs font-semibold text-espresso-900">Gratis Ongkir</span>
                </div>
                <p className="text-[11px] text-stone-500">Min. belanja Rp 250.000</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-mocha-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-semibold text-espresso-900">Garansi Tukar</span>
                </div>
                <p className="text-[11px] text-stone-500">Jaminan kepuasan produk</p>
              </div>
            </div>
          </div>

          {/* Right Visual Image Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="absolute -inset-3 rounded-3xl bg-sand-200/50 -rotate-2 transform transition-transform group-hover:rotate-0" />
              
              {/* Main Photo Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-cream-200 border border-sand-300/80 aspect-[3/4]">
                <SafeImage
                  src={hero.heroImage || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=80'}
                  alt="Haecca Hijab Editorial Collection"
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Floating Aesthetic Overlay */}
                <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg text-left">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-mocha-600">
                    {hero.materialLabel || 'Bahan Eksklusif'}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-espresso-950 mt-0.5">
                    {hero.materialTitle || 'Ultrafine Voal Voile Import'}
                  </h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-sand-200/60 text-xs">
                    <span className="text-stone-500">Info Harga</span>
                    <span className="font-bold text-espresso-900">{hero.startingPrice || 'Mulai Rp 89.000'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
