import React from 'react';
import { Feather, Scissors, Gift, Sparkles } from 'lucide-react';

export function ValueProps() {
  const values = [
    {
      icon: Feather,
      title: 'Material Adem & Ringan',
      desc: 'Diproduksi dari serat katun dan voal berpori alami. Sejuk di kulit kepala, tidak pengap, dan tidak membuat telinga berdengung.'
    },
    {
      icon: Scissors,
      title: 'Jahitan Standar Butik',
      desc: 'Dikerjakan dengan ketelitian laser cut terkomputerisasi serta jahitan tepi rapat tanpa ada benang bertumpuk atau mencuat.'
    },
    {
      icon: Gift,
      title: 'Packaging Mewah Siap Kado',
      desc: 'Setiap helai hijab dikemas rapi dalam pouch ramah lingkungan dan box premium, sangat cocok sebagai hadiah untuk orang tersayang.'
    },
    {
      icon: Sparkles,
      title: 'Tegak Paripurna di Dahi',
      desc: 'Memiliki struktur serat kain dengan drape presisi yang langsung melengkung rapi di dahi tanpa perlu disemprot cairan pelicin.'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-sand-200/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs tracking-[0.2em] font-semibold text-mocha-600 uppercase">
            Filosofi Kualitas
          </span>
          <h2 className="text-3xl sm:text-4xl text-espresso-950 font-bold tracking-tight">
            Mengapa Memilih Haecca Hijab?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Dedikasi kami dalam menghadirkan modest fashion yang tidak hanya memikat secara visual, namun memberi kenyamanan sejati sepanjang hari.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-cream-50/60 border border-sand-200/70 hover:border-mocha-300 transition-all hover:shadow-soft group"
              >
                <div className="w-12 h-12 rounded-xl bg-mocha-500/10 text-mocha-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-espresso-950 mb-2">
                  {v.title}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
