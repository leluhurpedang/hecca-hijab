import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <>
      <SEO
        title="404 - Halaman Tidak Ditemukan | Haecca Hijab"
        description="Mohon maaf, halaman yang Anda tuju tidak tersedia atau telah dipindahkan."
        noindex={true}
      />
      <main className="min-h-[75vh] flex items-center justify-center p-4 bg-cream-100/60">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-sand-200/80 shadow-soft text-center space-y-5">
          <span className="text-6xl sm:text-7xl font-bold text-mocha-500 block tracking-tight">
            404
          </span>
          <div className="space-y-2">
            <h1 className="text-2xl text-espresso-950 font-bold">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Mohon maaf, halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full">
                <Home className="w-4 h-4 mr-1.5" />
                <span>Ke Beranda</span>
              </Button>
            </Link>

            <Link to="/shop" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full">
                <ShoppingBag className="w-4 h-4 mr-1.5" />
                <span>Katalog Produk</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
