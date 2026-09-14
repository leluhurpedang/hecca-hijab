import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Search, ChevronRight, MessageCircle, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCMS } from '../../context/CMSContext';

export function MobileNav({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { cms } = useCMS();

  if (!isOpen) return null;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      onClose();
    }
  };

  const brand = cms.brand || {};
  let rawWa = cms.whatsapp?.recipientNumber || cms.whatsappSettings?.recipientNumber || cms.store?.whatsappNumber || '6281234567890';
  let waPhone = rawWa.replace(/[^0-9]/g, '');
  if (waPhone.startsWith('08')) {
    waPhone = '62' + waPhone.slice(1);
  }

  const categories = cms.navigation?.items && cms.navigation.items.length > 0
    ? cms.navigation.items.filter((item) => item.isEnabled !== false)
    : [
        { label: 'Semua Produk', path: '/shop' },
        { label: 'Pashmina', path: '/shop?category=pashmina' },
        { label: 'Voal', path: '/shop?category=voal' },
        { label: 'Hijab', path: '/shop?category=hijab' },
        { label: 'Aksesoris Hijab', path: '/shop?category=accessories' },
        { label: 'Tentang Haecca', path: '/about' },
      ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-cream-50 shadow-2xl flex flex-col z-10 animate-fade-in border-r border-sand-200">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-sand-200 bg-cream-100">
          <div className="flex flex-col text-left">
            <span className="text-xl tracking-[0.16em] font-bold text-espresso-950">
              {brand.logoText || 'HAECCA'}
            </span>
            <span className="text-[8px] tracking-[0.25em] font-medium text-stone-500 uppercase -mt-0.5">
              {brand.tagline || 'HIJAB & MODEST'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-espresso-900 rounded-full hover:bg-sand-200/50"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="p-4 border-b border-sand-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari hijab impianmu..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-sand-200 text-xs text-espresso-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-mocha-500"
            />
          </form>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="divide-y divide-sand-200/50">
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.label}
                to={cat.path || cat.to}
                onClick={onClose}
                className="flex items-center justify-between px-5 py-3.5 text-sm text-espresso-900 font-medium hover:bg-sand-100 hover:text-mocha-600 transition-colors"
              >
                <span>{cat.label || cat.name}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
            ))}
          </nav>

          {/* Quick Access Badges */}
          <div className="px-5 py-4 mt-2 border-t border-sand-200 space-y-2">
            <button
              onClick={() => {
                onClose();
                setIsCartOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-sand-200 text-xs text-espresso-900 font-medium hover:border-mocha-400 transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-mocha-500" />
                Keranjang Belanja
              </span>
              <span className="px-2 py-0.5 bg-mocha-500/10 text-mocha-600 rounded-full font-bold">
                {totalItems}
              </span>
            </button>

            <Link
              to="/shop"
              onClick={onClose}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-sand-200 text-xs text-espresso-900 font-medium hover:border-mocha-400 transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Wishlist Saya
              </span>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full font-bold">
                {wishlistCount}
              </span>
            </Link>
          </div>
        </div>

        {/* Footer info in drawer */}
        <div className="p-4 border-t border-sand-200 bg-cream-100 text-xs text-stone-500 space-y-2">
          <a
            href={`https://wa.me/${waPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366]/10 text-[#128C7E] font-semibold rounded-xl hover:bg-[#25D366]/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat Customer Service
          </a>
          <p className="text-[11px] text-center text-stone-400 pt-1">
            Senin - Sabtu: 09:00 - 18:00 WIB
          </p>
        </div>
      </div>
    </div>
  );
}
