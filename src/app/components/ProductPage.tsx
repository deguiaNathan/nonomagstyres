import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';

import { useCart } from './CartContext';
import { ParallaxMedia, Reveal, RevealGroup, RevealItem } from './ScrollReveal';
import { fetchStorefrontProduct, type StorefrontProduct, type StorefrontReview } from '../lib/woocommerce';
import { formatCurrency } from '../lib/wordpress';

const CONTAINER = 'max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10';

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5 text-[#FF5C00]">
    {[1, 2, 3, 4, 5].map((value) => (
      <Star key={value} size={size} fill={value <= Math.round(rating) ? 'currentColor' : 'none'} strokeWidth={value <= Math.round(rating) ? 0 : 1.5} />
    ))}
  </div>
);

const LoadingState = () => (
  <div className="min-h-screen bg-[#F9FAFB]">
    <div className={`${CONTAINER} py-16`}>
      <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl bg-slate-200" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-10 w-3/4 rounded bg-slate-200" />
          <div className="h-4 w-40 rounded bg-slate-100" />
          <div className="h-32 w-full rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  </div>
);

export const ProductPage = ({
  productRef,
  onNavigate,
}: {
  productRef: string;
  onNavigate: (page: string, url?: string) => void;
}) => {
  const { addItem, cartLoading } = useCart();
  const [product, setProduct] = useState<StorefrontProduct | null>(null);
  const [related, setRelated] = useState<StorefrontProduct[]>([]);
  const [reviews, setReviews] = useState<StorefrontReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(4);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchStorefrontProduct(productRef).then((response) => {
      if (cancelled) return;
      setProduct(response.product);
      setRelated(response.related);
      setReviews(response.reviews);
      setError(null);
      setActiveImage(0);
    }).catch((nextError) => {
      if (!cancelled) setError(nextError instanceof Error ? nextError.message : 'Unable to load this product.');
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [productRef]);

  const gallery = useMemo(() => product?.images?.length ? product.images : product?.image ? [product.image] : [], [product]);

  if (loading) {
    return <LoadingState />;
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center max-w-lg px-6">
          <h2 className="text-2xl font-extrabold text-[#132043] mb-4">Product not found</h2>
          <p className="text-slate-500 mb-6">{error || 'This WooCommerce product could not be loaded.'}</p>
          <button onClick={() => onNavigate('store')} className="bg-[#FF5C00] text-white px-6 py-3 rounded-lg font-bold">
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  const selectedImage = gallery[activeImage] || product.image;
  const totalPrice = product.price * qty;
  const canAddToCart = product.inStock && product.purchasable && !product.hasOptions;
  const customerReviews = reviews.length ? reviews : [{
    id: 0,
    name: 'Nono Mags Customer',
    location: 'Verified buyer',
    rating: product.rating || 5,
    date: 'Recently',
    text: 'This product is live from WooCommerce, but no review text has been published yet.',
  }];

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="bg-[#132043] text-white">
        <div className={`${CONTAINER} py-6`}>
          <nav className="flex items-center gap-1.5 text-xs text-slate-400" aria-label="Breadcrumb">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors font-medium">Home</button>
            <ChevronRight size={12} />
            <button onClick={() => onNavigate('store')} className="hover:text-white transition-colors font-medium">Shop Tyres</button>
            <ChevronRight size={12} />
            <span className="text-white font-medium">{product.brand} {product.name}</span>
          </nav>
        </div>
      </div>

      <div className={`${CONTAINER} py-10`}>
        <RevealGroup className="grid grid-cols-1 lg:grid-cols-2 gap-12" stagger={0.12}>
          <RevealItem>
            <div>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden aspect-square relative group">
                {product.badge && <div className={`absolute top-4 left-4 ${product.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm`}>{product.badge}</div>}
                <ParallaxMedia className="absolute inset-0 overflow-hidden" offset={58} startScale={1.08}>
                  <img src={selectedImage} alt={`${product.brand} ${product.name}`} className="w-full h-full object-cover" />
                </ParallaxMedia>
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === index ? 'border-[#FF5C00]' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </RevealItem>

          <RevealItem distance={34}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#FF5C00] uppercase tracking-wider">{product.brand}</span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500 font-medium">{product.category}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#132043] mb-3">{product.brand} {product.name}</h1>
              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={product.rating} />
                <span className="font-bold text-[#132043]">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-slate-500">({product.reviews} reviews)</span>
              </div>

              <p className="text-slate-600 leading-relaxed mb-6">
                {product.summary || product.description || `Premium ${product.category.toLowerCase()} tyre in size ${product.size}.`}
              </p>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-4xl font-extrabold text-[#132043]">{formatCurrency(product.price)}</span>
                  {product.originalPrice && <span className="text-lg text-slate-400 line-through mb-1">{formatCurrency(product.originalPrice)}</span>}
                  <span className="text-sm text-slate-500 mb-1">per item</span>
                </div>
                {product.originalPrice && (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full mb-4">
                    <CheckCircle size={12} /> You save {formatCurrency(product.originalPrice - product.price)} per item
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <label className="text-sm font-bold text-[#132043]">Quantity:</label>
                  <div className="flex items-center border-2 border-slate-200 rounded-lg overflow-hidden">
                    <button onClick={() => setQty((current) => Math.max(1, current - 1))} className="px-3 py-2 hover:bg-slate-100 transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 font-bold text-[#132043] border-x-2 border-slate-200 min-w-[48px] text-center">{qty}</span>
                    <button onClick={() => setQty((current) => Math.min(8, current + 1))} className="px-3 py-2 hover:bg-slate-100 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-sm text-slate-500">{product.hasOptions ? 'Choose options in WooCommerce before purchase.' : '(Most drivers buy 4)'}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-slate-100 mb-4">
                  <span className="font-bold text-[#132043]">Total ({qty} items):</span>
                  <span className="text-2xl font-extrabold text-[#132043]">{formatCurrency(totalPrice)}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => canAddToCart && addItem({ id: product.id, name: `${product.brand} ${product.name}`, size: product.size, price: product.price, image: product.image, qty, permalink: product.permalink })}
                    disabled={!canAddToCart || cartLoading}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                      canAddToCart ? 'bg-[#FF5C00] hover:bg-[#E05200] text-white hover:shadow-xl' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={20} />
                    {product.hasOptions ? 'Select Options in Woo' : canAddToCart ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button onClick={() => setWishlisted((current) => !current)} className={`p-4 rounded-xl border-2 transition-colors ${wishlisted ? 'border-[#FF5C00] bg-[#FF5C00]/5 text-[#FF5C00]' : 'border-slate-200 text-slate-400 hover:border-[#FF5C00] hover:text-[#FF5C00]'}`}>
                    <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              <RevealGroup className="grid grid-cols-3 gap-3" stagger={0.08}>
                {[
                  { icon: <ShieldCheck size={20} className="text-[#FF5C00]" />, label: 'Woo Stock Sync' },
                  { icon: <Truck size={20} className="text-[#FF5C00]" />, label: 'Real Cart Session' },
                  { icon: <MapPin size={20} className="text-[#FF5C00]" />, label: 'Theme UI Match' },
                ].map((item) => (
                  <RevealItem key={item.label}>
                    <div className="flex flex-col items-center text-center bg-white rounded-xl border border-slate-200 p-3">
                      {item.icon}
                      <span className="text-xs font-bold text-[#132043] mt-1.5 leading-tight">{item.label}</span>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16" stagger={0.12}>
          <RevealItem>
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 className="text-xl font-extrabold text-[#132043] mb-6">Specifications</h2>
            <div className="divide-y divide-slate-100">
              <div className="flex justify-between py-3"><span className="text-sm text-slate-500">Size</span><span className="text-sm font-bold text-[#132043]">{product.size}</span></div>
              <div className="flex justify-between py-3"><span className="text-sm text-slate-500">Brand</span><span className="text-sm font-bold text-[#132043]">{product.brand}</span></div>
              <div className="flex justify-between py-3"><span className="text-sm text-slate-500">Category</span><span className="text-sm font-bold text-[#132043]">{product.category}</span></div>
              {product.specs.map((spec) => <div key={`${spec.label}-${spec.value}`} className="flex justify-between py-3"><span className="text-sm text-slate-500">{spec.label}</span><span className="text-sm font-bold text-[#132043]">{spec.value}</span></div>)}
            </div>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-[#132043]">Customer Reviews</h2>
              <div className="flex items-center gap-2"><StarRating rating={product.rating} size={14} /><span className="font-bold text-[#132043]">{product.rating.toFixed(1)}/5</span></div>
            </div>
            <div className="space-y-5">
              {customerReviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#132043] text-white flex items-center justify-center text-xs font-bold">{review.name.split(' ').map((chunk) => chunk[0]).join('').slice(0, 2)}</div>
                      <div>
                        <span className="text-sm font-bold text-[#132043]">{review.name}</span>
                        <span className="text-xs text-slate-400 ml-2">{review.location}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} size={12} />
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
            </div>
          </RevealItem>
        </RevealGroup>

        {related.length > 0 && (
          <div className="mt-16">
            <Reveal className="mb-8">
              <h2 className="text-2xl font-extrabold text-[#132043]">You May Also Like</h2>
            </Reveal>
            <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-6" stagger={0.08}>
              {related.map((relatedProduct) => (
                <RevealItem key={relatedProduct.id}>
                  <button onClick={() => onNavigate(`product:${relatedProduct.slug}`, relatedProduct.permalink)} className="group text-left bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all overflow-hidden">
                    <div className="aspect-square bg-slate-50 overflow-hidden">
                      <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{relatedProduct.brand}</div>
                      <h3 className="font-bold text-[#132043] text-sm mb-1">{relatedProduct.name}</h3>
                      <p className="text-xs text-slate-500 mb-2">{relatedProduct.size}</p>
                      <span className="text-lg font-extrabold text-[#132043]">{formatCurrency(relatedProduct.price)}</span>
                    </div>
                  </button>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        )}
      </div>
    </div>
  );
};
