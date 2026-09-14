import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../data/reviews';

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20 bg-cream-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs tracking-[0.2em] font-semibold text-mocha-600 uppercase">
            Kata Mereka
          </span>
          <h2 className="text-3xl sm:text-4xl text-espresso-950 font-bold tracking-tight">
            Cerita Nyata dari #HaeccaLadies
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Pengalaman jujur para pelanggan setia kami dalam menemukan hijab impian untuk hari-hari mereka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-sand-200/80 shadow-soft flex flex-col justify-between text-left"
            >
              <div>
                {/* Rating & Quote */}
                <div className="flex items-center justify-between mb-3 text-gold-400">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-sand-300" />
                </div>

                <p className="text-xs sm:text-sm text-stone-600 italic leading-relaxed mb-4">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-sand-100 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-sand-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-bold text-espresso-950 truncate">
                      {review.name}
                    </h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Pembeli Terverifikasi" />
                  </div>
                  <p className="text-[11px] text-stone-400 truncate">
                    {review.city}
                  </p>
                  <p className="text-[10px] text-mocha-600 truncate font-medium mt-0.5">
                    {review.productPurchased}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
