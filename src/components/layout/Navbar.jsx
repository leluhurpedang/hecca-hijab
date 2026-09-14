import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCMS } from '../../context/CMSContext';
import { SafeImage } from '../common/SafeImage';

export function Navbar({ onOpenMobileMenu }) {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { cms } = useCMS();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const brand = cms.brand || {};

  // Dynamic Navigation from CMS with fallback
  const navItems = cms.navigation?.items && cms.navigation.items.length > 0
    ? cms.navigation.items.filter((item) => item.isEnabled !== false)
    : [
        { id: '1', label: 'Beranda', path: '/' },
        { id: '2', label: 'Semua Produk', path: '/shop' },
        { id: '3', label: 'Pashmina', path: '/shop?category=pashmina' },
        { id: '4', label: 'Voal', path: '/shop?category=voal' },
        { id: '5', label: 'Hijab', path: '/shop?category=hijab' },
        { id: '6', label: 'Aksesoris', path: '/shop?category=accessories' },
        { id: '7', label: 'Tentang Kami', path: '/about' },
      ];

  return (
    <header className="sticky top-0 z-30 bg-cream-100/95 backdrop-blur-md border-b border-sand-200/80 transition-all font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={onOpenMobileMenu}
              className="p-2 -ml-2 text-espresso-900 hover:text-mocha-600 transition-colors focus:outline-none"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center-Left: Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex flex-col items-center lg:items-start group">
              {brand.logoImage ? (
                <SafeImage
                  src={brand.logoImage}
                  alt={brand.brandName || 'Haecca Hijab'}
                  className="h-8 sm:h-10 w-auto object-contain"
                />
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl tracking-[0.18em] font-bold text-espresso-950 group-hover:text-mocha-600 transition-colors">
                    {brand.logoText || 'HAECCA'}
                  </span>
                  <span className="text-[9px] tracking-[0.3em] font-medium text-stone-500 uppercase -mt-1 group-hover:text-mocha-500 transition-colors">
                    {brand.tagline || 'HIJAB & MODEST'}
                  </span>
                </>
              )}
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((link) => (
              <NavLink
                key={link.id || link.label}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `text-xs tracking-wider uppercase font-medium transition-all hover:text-mocha-600 relative py-1 ${
                    isActive
                      ? 'text-espresso-950 font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-mocha-500'
                      : 'text-stone-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Actions (Search, Wishlist, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-espresso-900 hover:text-mocha-600 transition-colors rounded-full hover:bg-sand-100"
              aria-label="Cari produk"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/shop"
              className="p-2 text-espresso-900 hover:text-mocha-600 transition-colors rounded-full hover:bg-sand-100 relative"
              aria-label="Wishlist produk"
              title="Lihat wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-mocha-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-espresso-900 hover:text-mocha-600 transition-colors rounded-full hover:bg-sand-100 relative group"
              aria-label="Buka keranjang belanja"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-mocha-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Search Bar */}
        {isSearchOpen && (
          <div className="py-3 border-t border-sand-200/80 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-stone-400 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pashmina silk, voal ultrafine, ciput..."
                className="w-full pl-10 pr-10 py-2 bg-white rounded-full border border-sand-200 text-xs sm:text-sm text-espresso-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-mocha-400/30 focus:border-mocha-500"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 text-stone-400 hover:text-espresso-900"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
