import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, ChevronDown, Sparkles, ArrowRight, Share2, Check } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { formatRupiah, calculateDiscount } from '../utils/currency';
import { SEO } from '../components/common/SEO';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { RatingStars } from '../components/common/RatingStars';
import { ProductGallery } from '../components/product/ProductGallery';
import { ColorPicker } from '../components/product/ColorPicker';
import { QuantityStepper } from '../components/product/QuantityStepper';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { ProductDetailSkeleton } from '../components/common/LoadingSkeleton';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProductBySlug, visibleProducts, isLoading } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = getProductBySlug(slug);

  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0].name);
      setQuantity(1);
    }
  }, [product]);

  if (isLoading && !product) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center p-4">
        <SEO title="Produk Tidak Ditemukan | Haecca Hijab" noindex={true} />
        <EmptyState
          title="Produk Tidak Ditemukan"
          description="Produk yang Anda cari mungkin telah dinonaktifkan atau tautan yang Anda tuju salah."
          actionLabel="Kembali ke Katalog Belanja"
          actionTo="/shop"
        />
      </main>
    );
  }

  const discount = calculateDiscount(product.originalPrice, product.price);
  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, quantity, false);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      showToast('Tautan produk berhasil disalin!', 'success');
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const relatedProducts = visibleProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const primaryImage =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=80';

  const productCanonicalUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/product/${product.slug}`
      : `https://haeccahijab.com/product/${product.slug}`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} koleksi modest fashion dari Haecca Hijab.`,
    image: Array.isArray(product.images) && product.images.length > 0 ? product.images : [primaryImage],
    sku: String(product.id || product.slug),
    category: product.categoryLabel || product.category || 'Hijab',
    brand: {
      '@type': 'Brand',
      name: 'Haecca Hijab',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'IDR',
      priceValidUntil: '2026-12-31',
      availability:
        Number(product.stock) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: productCanonicalUrl,
      seller: {
        '@type': 'Organization',
        name: 'Haecca Hijab',
      },
    },
    ...(Number(product.reviewCount) > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Number(product.rating) || 5,
        reviewCount: Number(product.reviewCount) || 1,
      },
    }),
  };

  return (
    <>
      <SEO
        title={`${product.name} | Haecca Hijab`}
        description={product.description}
        image={primaryImage}
        url={productCanonicalUrl}
        type="product"
        jsonLd={productSchema}
      />

      <main className="min-h-screen bg-cream-100/50 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <div className="text-left mb-4">
            <Breadcrumb
              items={[
                { label: 'Katalog', to: '/shop' },
                { label: product.categoryLabel, to: `/shop?category=${product.category}` },
                { label: product.name },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Gallery automatically utilizes the updated image array order */}
            <div className="lg:col-span-7">
              <ProductGallery images={product.images} title={product.name} />
            </div>

            <div className="lg:col-span-5 text-left bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/80 shadow-soft space-y-6">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-mocha-600">
                  {product.categoryLabel}
                </span>

                <div className="flex items-center gap-2">
                  {product.isBestSeller && <Badge variant="bestseller" size="sm">Best Seller</Badge>}
                  {product.isNew && <Badge variant="new" size="sm">New</Badge>}
                  {discount > 0 && <Badge variant="discount" size="sm">Hemat {discount}%</Badge>}
                </div>
              </div>

              <div className="space-y-1.5">
                <h1 className="font-sans text-2xl sm:text-3xl text-espresso-950 font-bold tracking-tight leading-snug">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-sans">
                  {product.tagline}
                </p>
              </div>

              <div className="flex items-center justify-between py-2 border-y border-sand-200/60">
                <RatingStars rating={product.rating || 5} reviewCount={product.reviewCount || 0} size="md" />

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-stone-500 hover:text-espresso-900 rounded-full hover:bg-sand-100 transition-colors"
                    title="Bagikan tautan produk"
                    aria-label="Bagikan produk"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 text-stone-500 hover:text-rose-600 rounded-full hover:bg-sand-100 transition-colors"
                    title={isFavorite ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
                    aria-label="Wishlist produk"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="font-sans text-2xl sm:text-3xl font-bold text-espresso-950 tracking-tight">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    Hemat {formatRupiah(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              <div className="pt-2">
                <ColorPicker
                  colors={product.colors}
                  selectedColor={selectedColor}
                  onChange={setSelectedColor}
                  size="md"
                />
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-500">Jumlah Pesanan:</span>
                  <span className={`font-semibold flex items-center gap-1 ${
                    (product.stock || 0) <= 5 ? 'text-amber-700' : 'text-emerald-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${
                      (product.stock || 0) <= 5 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    {(product.stock || 0) > 0 ? `Stok Tersedia (${product.stock} pcs)` : 'Stok Habis'}
                  </span>
                </div>
                <QuantityStepper
                  quantity={quantity}
                  onChange={setQuantity}
                  max={Math.max(1, product.stock || 1)}
                  size="md"
                />
              </div>

              {/* Purchase Action Buttons: Clean visual hierarchy without bulky styling */}
              <div className="space-y-2.5 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full flex items-center justify-center gap-2 py-3 shadow-soft hover:shadow-card font-medium transition-all"
                  onClick={handleAddToCart}
                  disabled={(product.stock || 0) === 0}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Tambah ke Keranjang</span>
                </Button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={(product.stock || 0) === 0}
                  className="w-full py-2.5 px-4 rounded-xl border border-espresso-900/20 hover:border-espresso-900 bg-transparent hover:bg-espresso-900/5 text-espresso-900 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Beli Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-4 border-t border-sand-200/80 grid grid-cols-3 gap-2 text-center text-[11px] text-stone-500">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-mocha-500" />
                  <span>Gratis Ongkir Min. 250rb</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-mocha-500" />
                  <span>100% Produk Original</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-mocha-500" />
                  <span>Garansi Tukar Warna</span>
                </div>
              </div>

              <div className="pt-4 border-t border-sand-200 space-y-3 text-left text-xs">
                <div className="border border-sand-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === 'desc' ? '' : 'desc')}
                    className="w-full px-4 py-3 bg-cream-50 font-semibold text-espresso-900 flex items-center justify-between"
                  >
                    <span>Deskripsi Produk</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeTab === 'desc' && (
                    <div className="p-4 bg-white text-stone-600 leading-relaxed space-y-3">
                      <p>{product.description}</p>
                      {product.features && (
                        <ul className="list-disc list-inside space-y-1 text-stone-500 pt-1">
                          {product.features.map((feat, idx) => (
                            <li key={idx}>{feat}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <div className="border border-sand-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === 'specs' ? '' : 'specs')}
                    className="w-full px-4 py-3 bg-cream-50 font-semibold text-espresso-900 flex items-center justify-between"
                  >
                    <span>Spesifikasi & Ukuran</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'specs' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeTab === 'specs' && (
                    <div className="p-4 bg-white text-stone-600 space-y-2">
                      <div className="grid grid-cols-3 py-1 border-b border-sand-100">
                        <span className="font-medium text-stone-400">Material</span>
                        <span className="col-span-2 text-espresso-900 font-medium">{product.material || '-'}</span>
                      </div>
                      <div className="grid grid-cols-3 py-1 border-b border-sand-100">
                        <span className="font-medium text-stone-400">Dimensi</span>
                        <span className="col-span-2 text-espresso-900 font-medium">{product.dimensions || '-'}</span>
                      </div>
                      <div className="grid grid-cols-3 py-1">
                        <span className="font-medium text-stone-400">Finishing</span>
                        <span className="col-span-2 text-espresso-900 font-medium">{product.finishing || '-'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border border-sand-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === 'care' ? '' : 'care')}
                    className="w-full px-4 py-3 bg-cream-50 font-semibold text-espresso-900 flex items-center justify-between"
                  >
                    <span>Petunjuk Perawatan</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeTab === 'care' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeTab === 'care' && (
                    <div className="p-4 bg-white text-stone-600 space-y-2">
                      <ul className="list-disc list-inside space-y-1.5 text-stone-500">
                        {(product.careInstructions || ['Cuci lembut dengan tangan', 'Setrika suhu rendah']).map((inst, i) => (
                          <li key={i}>{inst}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <section className="mt-20 pt-12 border-t border-sand-200 text-left">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-mocha-600">
                  Rekomendasi
                </span>
                <h3 className="text-2xl sm:text-3xl text-espresso-950 font-bold mt-1">
                  Lengkapi Penampilan Anda
                </h3>
              </div>

              <Link
                to="/shop"
                className="text-xs sm:text-sm font-semibold text-espresso-900 hover:text-mocha-600 transition-colors inline-flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
