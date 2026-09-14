import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { formatRupiah, calculateDiscount } from '../../utils/currency';
import { Badge } from '../common/Badge';
import { RatingStars } from '../common/RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors[0] ? product.colors[0].name : ''
  );
  const [imgSrc, setImgSrc] = useState(product.images ? product.images[0] : '');
  const [isHovered, setIsHovered] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  const fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="%23FAF7F2"><rect width="600" height="800" fill="%23F4EFEB"/><text x="50%" y="48%" font-family="sans-serif" font-size="28" font-weight="600" fill="%238C6D58" text-anchor="middle">HAECCA HIJAB</text><text x="50%" y="54%" font-family="sans-serif" font-size="14" fill="%23A88B77" text-anchor="middle">Premium Modest Fashion</text></svg>';

  // Second image on hover if available
  const displayImage = isHovered && product.images && product.images[1]
    ? product.images[1]
    : imgSrc;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor, 1, true);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative bg-white rounded-2xl p-2.5 sm:p-3 border border-sand-200/80 hover:border-mocha-300 transition-all duration-300 hover:shadow-card flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Consistent Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-cream-100 mb-3">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={displayImage || fallbackImage}
            alt={product.name}
            onError={() => setImgSrc(fallbackImage)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Badges Overlay (Preventing collision with wishlist button) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none max-w-[calc(100%-3.25rem)]">
          {product.isBestSeller && (
            <Badge variant="bestseller" size="sm">
              Best Seller
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="new" size="sm">
              New
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="discount" size="sm">
              Hemat {discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorite ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm text-espresso-900 hover:text-rose-600 transition-colors shadow-sm z-10"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-600'
            }`}
          />
        </button>

        {/* Quick Action Overlay (Desktop Hover) */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 bg-espresso-900 hover:bg-mocha-600 text-white text-xs font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            + Keranjang
          </button>
          <Link
            to={`/product/${product.slug}`}
            className="p-2 bg-white/95 hover:bg-white text-espresso-900 rounded-xl shadow-lg transition-colors"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 text-left px-0.5">
        {/* Color Swatches Dots with Flex Wrap */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2 flex-wrap py-0.5">
            {product.colors.slice(0, 5).map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(c.name);
                }}
                title={c.name}
                className={`w-3 h-3 rounded-full border border-black/10 transition-transform ${
                  selectedColor === c.name ? 'ring-2 ring-mocha-500 ring-offset-1 scale-110' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-stone-400 font-medium">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Category Label */}
        <span className="text-[10px] tracking-wider uppercase font-semibold text-mocha-600 mb-1">
          {product.categoryLabel}
        </span>

        {/* Title - Plus Jakarta Sans font for rapid and clean readability */}
        <Link
          to={`/product/${product.slug}`}
          className="font-sans text-sm sm:text-base text-espresso-950 font-semibold hover:text-mocha-600 transition-colors line-clamp-2 leading-snug mb-1.5 min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mb-2">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        </div>

        {/* Price & Mobile Add Button */}
        <div className="mt-auto pt-2 flex items-baseline justify-between gap-1 border-t border-sand-100">
          <div className="flex flex-col">
            <span className="font-semibold text-sm sm:text-base text-espresso-950">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-stone-400 line-through">
                {formatRupiah(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 rounded-full bg-mocha-500 text-white hover:bg-mocha-600 active:scale-95 transition-all shadow-sm"
            aria-label="Tambah ke keranjang"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
