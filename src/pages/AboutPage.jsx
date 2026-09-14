import React from 'react';
import { Sparkles, Heart, Award, MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { SafeImage } from '../components/common/SafeImage';
import { useCMS } from '../context/CMSContext';

export function AboutPage() {
  const { cms } = useCMS();
  const about = cms?.about || {};
  const store = cms?.store || cms?.storeSettings || {};
  const whatsapp = cms?.whatsapp || cms?.whatsappSettings || {};

  const storyImage =
    about.aboutImage ||
    about.storyImageUrl ||
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80';

  const fabricImage =
    about.fabricImage ||
    about.fabricImageUrl ||
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80';

  let rawWa = about.whatsapp || whatsapp.recipientNumber || store.whatsappNumber || '6281234567890';
  let waPhone = rawWa.replace(/[^0-9]/g, '');
  if (waPhone.startsWith('08')) {
    waPhone = '62' + waPhone.slice(1);
  }

  return (
    <>
      <SEO
        title="Tentang Kami | Haecca Hijab"
        description="Pelajari kisah lahirnya Haecca Hijab, standar pemilihan bahan voal ultrafine & silk cradenza kami, serta komitmen menghadirkan modest fashion berkelas butik."
        url={typeof window !== 'undefined' ? `${window.location.origin}/about` : undefined}
      />

      <main className="min-h-screen bg-cream-100/50 pb-20 text-left font-sans">
        <div className="bg-white border-b border-sand-200/80 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={[{ label: 'Tentang Kami' }]} />
            <div className="mt-4 max-w-2xl space-y-2">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-mocha-600">
                {about.eyebrow || about.tagline || 'Our Story & Heritage'}
              </span>
              <h1 className="text-3xl sm:text-5xl text-espresso-950 font-bold tracking-tight">
                {about.heading || about.title || 'Menghadirkan Keanggunan yang Bersahaja'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed pt-1">
                {about.intro ||
                  about.description ||
                  'Lahir dari kecintaan pada keindahan hijab yang lembut, tidak merepotkan, dan memancarkan pesona percaya diri bagi setiap muslimah.'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5 text-stone-600 text-xs sm:text-sm leading-relaxed">
              <span className="text-xs font-semibold tracking-wider uppercase text-mocha-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> {about.storyLabel || 'Awal Mula Haecca'}
              </span>
              <h2 className="text-2xl sm:text-3xl text-espresso-950 font-bold leading-snug">
                {about.quote ||
                  '"Hijab seharusnya tidak hanya indah dipandang, namun terasa seperti hembusan angin sejuk saat dikenakan."'}
              </h2>
              <p>
                {about.storyP1 ||
                  about.story1 ||
                  'Haecca Hijab didirikan untuk menjawab keresahan wanita berhijab: kain yang licin dan mudah melorot, serat yang pekak di telinga, serta jahitan tepi yang mudah berkerut setelah beberapa kali dicuci.'}
              </p>
              <p>
                {about.storyP2 ||
                  about.story2 ||
                  'Melalui riset pemilihan serat benang katun impor dan voal ultrafine berdensitas tinggi, kami merancang setiap produk dengan standar butik haute couture, memastikan hijab tegak melengkung presisi di dahi sejak pemakaian pertama.'}
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-card border border-sand-200 aspect-[4/3] bg-cream-200">
                <SafeImage
                  src={storyImage}
                  alt="Haecca Hijab Atelier"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-sand-200/80 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-mocha-500/10 text-mocha-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-espresso-950">
                Kurasi Serat Grade A
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Kami hanya memakai voal ultrafine, sutra cradenza, dan katun paris pilihan dengan gramasi ideal yang tidak menerawang namun tetap sejuk sepanjang hari.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-sand-200/80 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-mocha-500/10 text-mocha-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-espresso-950">
                Presisi Laser Cut
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Tepian hijab dipotong dengan teknologi laser komputerisasi modern, menghasilkan pinggiran bergelombang bersih tanpa benang berantakan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-sand-200/80 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-mocha-500/10 text-mocha-600 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-espresso-950">
                Packaging Siap Kado
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Kemasannya didesain mewah dengan pouch reusable dan rigid sliding box, memberikan pengalaman unboxing tak terlupakan untuk diri sendiri atau orang terkasih.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sand-200/80 shadow-soft grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold tracking-wider uppercase text-mocha-600">
                Hubungi Kami
              </span>
              <h3 className="text-2xl sm:text-3xl text-espresso-950 font-bold leading-snug">
                {about.fabricStoryTitle || 'Boutique Studio & Layanan Pelanggan'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                {about.fabricStoryText ||
                  `Ada pertanyaan mengenai panduan warna, ketersediaan stok, atau pesanan khusus untuk acara pernikahan/bridesmaid? Tim konsultan hijab ${store.storeName || 'Haecca'} siap membantu Anda dengan senang hati.`}
              </p>

              <div className="space-y-3 pt-2 text-xs text-stone-600">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-mocha-500 shrink-0" />
                  <span>{about.studioAddress || store.address || 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-mocha-500 shrink-0" />
                  <span>WhatsApp: +{waPhone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-mocha-500 shrink-0" />
                  <span>{about.email || store.email || 'hello@haeccahijab.com'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-mocha-500 shrink-0" />
                  <span>{about.studioHours || store.operatingHours || 'Senin - Sabtu: 09.00 - 20.00 WIB | Minggu: 10.00 - 18.00 WIB'}</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="whatsapp" size="md">
                    <span>Chat WhatsApp Admin</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-sand-200 bg-cream-100">
              <SafeImage
                src={fabricImage}
                alt="Haecca Silk Fabric Texture"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
