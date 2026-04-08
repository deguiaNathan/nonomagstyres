import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  TrendingUp,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { useCart } from './CartContext';
import { Reveal, RevealGroup, RevealItem } from './ScrollReveal';
import { fetchStorefrontProducts, type StorefrontProduct } from '../lib/woocommerce';
import { formatCurrency } from '../lib/wordpress';

const CONTAINER = 'max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10';
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'New Arrivals' },
];

const StarRating = ({ rating, size = 12 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5 text-[#FF5C00]">
    {[1, 2, 3, 4, 5].map((value) => (
      <Star key={value} size={size} fill={value <= Math.round(rating) ? 'currentColor' : 'none'} strokeWidth={value <= Math.round(rating) ? 0 : 1.5} />
    ))}
  </div>
);

const FiltersPanel = ({
  categories,
  brands,
  widths,
  products,
  selectedCategories,
  selectedBrands,
  selectedWidths,
  inStockOnly,
  maxPrice,
  priceCeiling,
  minRating,
  searchQuery,
  setSearchQuery,
  setSelectedCategories,
  setSelectedBrands,
  setSelectedWidths,
  setInStockOnly,
  setMaxPrice,
  setMinRating,
}: {
  categories: string[];
  brands: string[];
  widths: string[];
  products: StorefrontProduct[];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedWidths: string[];
  inStockOnly: boolean;
  maxPrice: number;
  priceCeiling: number;
  minRating: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setSelectedCategories: (value: string[]) => void;
  setSelectedBrands: (value: string[]) => void;
  setSelectedWidths: (value: string[]) => void;
  setInStockOnly: (value: boolean) => void;
  setMaxPrice: (value: number) => void;
  setMinRating: (value: number) => void;
}) => {
  const toggle = <T,>(values: T[], nextValue: T, setter: (next: T[]) => void) => {
    setter(values.includes(nextValue) ? values.filter((value) => value !== nextValue) : [...values, nextValue]);
  };
  const brandCounts = useMemo(() => products.reduce<Record<string, number>>((acc, product) => {
    acc[product.brand] = (acc[product.brand] || 0) + 1;
    return acc;
  }, {}), [products]);

  const renderCheckboxList = (items: string[], selected: string[], setter: (next: string[]) => void, countResolver?: (value: string) => number) => (
    <div className="space-y-2">
      {items.map((item) => (
        <label key={item} className="flex items-center gap-2.5 cursor-pointer group py-1">
          <div
            onClick={() => toggle(selected, item, setter)}
            className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors cursor-pointer ${
              selected.includes(item) ? 'bg-[#FF5C00] border-[#FF5C00]' : 'border-slate-300 group-hover:border-[#FF5C00]'
            }`}
          >
            {selected.includes(item) && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className={`text-sm flex-1 ${selected.includes(item) ? 'font-bold text-[#132043]' : 'text-slate-600 group-hover:text-[#132043]'}`}>{item}</span>
          {countResolver && <span className="text-xs text-slate-400 font-mono">{countResolver(item)}</span>}
        </label>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search tyres..."
          className="w-full pl-9 pr-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#FF5C00]"
        />
      </div>
      <section>
        <h3 className="text-sm font-bold text-[#132043] uppercase tracking-wider mb-3">Category</h3>
        {renderCheckboxList(categories, selectedCategories, setSelectedCategories, (value) => products.filter((product) => product.category === value).length)}
      </section>
      <section>
        <h3 className="text-sm font-bold text-[#132043] uppercase tracking-wider mb-3">Brand</h3>
        {renderCheckboxList(brands, selectedBrands, setSelectedBrands, (value) => brandCounts[value] || 0)}
      </section>
      {widths.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-[#132043] uppercase tracking-wider mb-3">Tyre Width</h3>
          <div className="flex flex-wrap gap-2">
            {widths.map((width) => (
              <button
                key={width}
                onClick={() => toggle(selectedWidths, width, setSelectedWidths)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border-2 transition-colors ${
                  selectedWidths.includes(width) ? 'bg-[#FF5C00] border-[#FF5C00] text-white' : 'border-slate-200 text-slate-600 hover:border-[#FF5C00] hover:text-[#FF5C00]'
                }`}
              >
                {width}
              </button>
            ))}
          </div>
        </section>
      )}
      <section>
        <h3 className="text-sm font-bold text-[#132043] uppercase tracking-wider mb-3">Max Price</h3>
        <div className="flex justify-between text-xs font-bold text-slate-700 mb-3">
          <span>{formatCurrency(0)}</span>
          <span className="text-[#FF5C00]">Up to {formatCurrency(maxPrice)}</span>
        </div>
        <input type="range" min={0} max={priceCeiling} step={10} value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="w-full accent-[#FF5C00]" />
      </section>
      <section>
        <h3 className="text-sm font-bold text-[#132043] uppercase tracking-wider mb-3">Min Rating</h3>
        <div className="flex flex-wrap gap-2">
          {[3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 text-xs font-bold transition-colors ${
                minRating === rating ? 'bg-[#FF5C00] border-[#FF5C00] text-white' : 'border-slate-200 text-slate-600 hover:border-[#FF5C00]'
              }`}
            >
              <Star size={10} fill="currentColor" /> {rating}+
            </button>
          ))}
        </div>
      </section>
      <section>
        <label className="flex items-center gap-2.5 cursor-pointer group py-1">
          <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} className="accent-[#FF5C00]" />
          <span className="text-sm text-slate-600 group-hover:text-[#132043]">In Stock Only</span>
        </label>
      </section>
    </div>
  );
};

const ProductCard = ({ product, onNavigate }: { product: StorefrontProduct; onNavigate: (page: string, url?: string) => void }) => {
  const { addItem, cartLoading } = useCart();
  const canAddToCart = product.inStock && product.purchasable && !product.hasOptions;

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all overflow-hidden">
      <button className="relative aspect-square bg-slate-50 overflow-hidden border-b border-slate-100 text-left" onClick={() => onNavigate(`product:${product.slug}`, product.permalink)}>
        {product.badge && <div className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-sm`}>{product.badge}</div>}
        {!product.inStock && <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center"><span className="bg-slate-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span></div>}
        <img src={product.image} alt={`${product.brand} ${product.name}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </button>
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{product.brand}</div>
          <h3 className="font-bold text-[#1F2937] text-base leading-tight mb-0.5">{product.name}</h3>
          <p className="text-xs text-slate-500 mb-2">{product.size}</p>
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} />
            <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({product.reviews})</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="flex items-end gap-1.5">
                <span className="text-xl font-extrabold text-[#132043]">{formatCurrency(product.price)}</span>
                {product.originalPrice && <span className="text-xs text-slate-400 line-through mb-0.5">{formatCurrency(product.originalPrice)}</span>}
              </div>
              {product.originalPrice && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full mt-0.5">
                  <CheckCircle size={10} /> Save {formatCurrency(product.originalPrice - product.price)}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400">ea.</span>
          </div>
          <button
            disabled={!canAddToCart || cartLoading}
            onClick={() => canAddToCart && addItem({ id: product.id, name: `${product.brand} ${product.name}`, size: product.size, price: product.price, image: product.image, qty: 1, permalink: product.permalink })}
            className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
              canAddToCart ? 'bg-slate-100 hover:bg-[#FF5C00] text-[#132043] hover:text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={14} />
            {product.hasOptions ? 'Select Options' : canAddToCart ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </article>
  );
};

export const StorePage = ({ onNavigate }: { onNavigate: (page: string, url?: string) => void }) => {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedWidths, setSelectedWidths] = useState<string[]>([]);
  const [priceCeiling, setPriceCeiling] = useState(400);
  const [maxPrice, setMaxPrice] = useState(400);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    let cancelled = false;
    fetchStorefrontProducts().then((response) => {
      if (cancelled) return;
      setProducts(response.items);
      const nextCeiling = Math.max(response.filters.maxPrice || 0, 400);
      setPriceCeiling(nextCeiling);
      setMaxPrice(nextCeiling);
      setError(null);
    }).catch((nextError) => {
      if (!cancelled) setError(nextError instanceof Error ? nextError.message : 'Unable to load products.');
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category).filter(Boolean))), [products]);
  const brands = useMemo(() => Array.from(new Set(products.map((product) => product.brand).filter(Boolean))), [products]);
  const widths = useMemo(() => Array.from(new Set(products.map((product) => product.width).filter(Boolean))).sort(), [products]);

  const filtered = useMemo(() => {
    let nextProducts = products.filter((product) => product.price <= maxPrice);
    if (searchQuery) nextProducts = nextProducts.filter((product) => `${product.brand} ${product.name} ${product.size}`.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedCategories.length) nextProducts = nextProducts.filter((product) => selectedCategories.includes(product.category));
    if (selectedBrands.length) nextProducts = nextProducts.filter((product) => selectedBrands.includes(product.brand));
    if (selectedWidths.length) nextProducts = nextProducts.filter((product) => selectedWidths.includes(product.width));
    if (inStockOnly) nextProducts = nextProducts.filter((product) => product.inStock);
    if (minRating > 0) nextProducts = nextProducts.filter((product) => product.rating >= minRating);
    if (sortBy === 'price-asc') return [...nextProducts].sort((left, right) => left.price - right.price);
    if (sortBy === 'price-desc') return [...nextProducts].sort((left, right) => right.price - left.price);
    if (sortBy === 'rating') return [...nextProducts].sort((left, right) => right.rating - left.rating);
    if (sortBy === 'newest') return [...nextProducts].sort((left, right) => Number(Boolean(right.isNew)) - Number(Boolean(left.isNew)));
    return nextProducts;
  }, [inStockOnly, maxPrice, minRating, products, searchQuery, selectedBrands, selectedCategories, selectedWidths, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  useEffect(() => setCurrentPage((current) => Math.min(current, totalPages)), [totalPages]);
  const isStoreEmpty = !loading && !error && products.length === 0;

  const activeFilters = [
    ...selectedCategories.map((value) => ({ label: value, clear: () => setSelectedCategories(selectedCategories.filter((item) => item !== value)) })),
    ...selectedBrands.map((value) => ({ label: value, clear: () => setSelectedBrands(selectedBrands.filter((item) => item !== value)) })),
    ...selectedWidths.map((value) => ({ label: `${value}mm`, clear: () => setSelectedWidths(selectedWidths.filter((item) => item !== value)) })),
    ...(inStockOnly ? [{ label: 'In Stock', clear: () => setInStockOnly(false) }] : []),
    ...(minRating > 0 ? [{ label: `${minRating}+ stars`, clear: () => setMinRating(0) }] : []),
    ...(maxPrice < priceCeiling ? [{ label: `Under ${formatCurrency(maxPrice)}`, clear: () => setMaxPrice(priceCeiling) }] : []),
  ];
  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedWidths([]);
    setMaxPrice(priceCeiling);
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="bg-[#132043] text-white">
        <RevealGroup className={`${CONTAINER} py-8`} stagger={0.1}>
          <RevealItem>
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4" aria-label="Breadcrumb">
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors font-medium">Home</button>
              <ChevronRight size={12} />
              <span className="text-white font-medium">Shop Tyres</span>
            </nav>
          </RevealItem>
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <RevealItem>
              <div>
                <div className="flex items-center gap-2 text-[#FF5C00] font-bold text-sm uppercase tracking-wide mb-2"><TrendingUp size={14} /> Live WooCommerce Catalogue</div>
                <h1 className="text-4xl font-extrabold tracking-tight">Shop Tyres</h1>
                <p className="text-slate-300 mt-2 text-sm">
                  {loading ? 'Loading products...' : isStoreEmpty ? 'No items, we are restocking.' : `${filtered.length} products found - synced from WooCommerce`}
                </p>
              </div>
            </RevealItem>
            <RevealItem className="hidden md:flex gap-3">
              {['Best Sellers', 'New Arrivals', 'Clearance'].map((tag) => <button key={tag} className="bg-white/10 hover:bg-[#FF5C00] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors border border-white/20 hover:border-[#FF5C00]">{tag}</button>)}
            </RevealItem>
          </div>
        </RevealGroup>
      </div>

      <div className="bg-white border-b border-slate-200 sticky top-[65px] z-30 shadow-sm">
        <div className={`${CONTAINER} py-3 flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
            <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden flex items-center gap-2 bg-[#132043] text-white px-3 py-2 rounded-lg text-sm font-bold flex-shrink-0">
              <SlidersHorizontal size={14} /> Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
            </button>
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {activeFilters.map(({ label, clear }) => <button key={label} onClick={clear} className="flex items-center gap-1 bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/30 text-xs font-bold px-2.5 py-1 rounded-full hover:bg-[#FF5C00] hover:text-white transition-colors">{label} <X size={10} /></button>)}
                <button onClick={clearAll} className="text-xs text-slate-500 hover:text-[#132043] font-medium underline">Clear all</button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative hidden sm:block">
              <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="pl-8 pr-8 py-2 border-2 border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:border-[#FF5C00] appearance-none bg-white cursor-pointer">
                {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="flex border-2 border-slate-200 rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#132043] text-white' : 'text-slate-400 hover:text-[#132043]'}`}><LayoutGrid size={16} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#132043] text-white' : 'text-slate-400 hover:text-[#132043]'}`}><List size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${CONTAINER} py-8`}>
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Reveal className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-[121px]" distance={18}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-extrabold text-[#132043] text-base">Filters</h2>
                {activeFilters.length > 0 && <button onClick={clearAll} className="text-xs text-[#FF5C00] font-bold hover:underline">Clear all ({activeFilters.length})</button>}
              </div>
              <FiltersPanel {...{ categories, brands, widths, products, selectedCategories, selectedBrands, selectedWidths, inStockOnly, maxPrice, priceCeiling, minRating, searchQuery, setSearchQuery, setSelectedCategories, setSelectedBrands, setSelectedWidths, setInStockOnly, setMaxPrice, setMinRating }} />
            </Reveal>
          </aside>
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 2xl:gap-6">{Array.from({ length: 10 }).map((_, index) => <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"><div className="aspect-square bg-slate-100" /><div className="p-4 space-y-3"><div className="h-3 rounded bg-slate-100 w-1/3" /><div className="h-4 rounded bg-slate-200 w-4/5" /><div className="h-3 rounded bg-slate-100 w-1/2" /><div className="h-10 rounded bg-slate-100 w-full mt-4" /></div></div>)}</div>
            ) : error ? (
              <Reveal className="flex flex-col items-center justify-center py-24 text-center"><div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4"><X size={24} className="text-red-400" /></div><h3 className="font-bold text-[#132043] text-xl mb-2">Unable to load products</h3><p className="text-slate-500 text-sm mb-6 max-w-lg">{error}</p><button onClick={() => window.location.reload()} className="bg-[#FF5C00] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#E05200] transition-colors">Retry</button></Reveal>
            ) : isStoreEmpty ? (
              <Reveal className="flex flex-col items-center justify-center py-24 text-center"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><ShoppingCart size={24} className="text-slate-400" /></div><h3 className="font-bold text-[#132043] text-xl mb-2">No items, we are restocking.</h3><p className="text-slate-500 text-sm mb-6">Please check back soon for fresh stock.</p></Reveal>
            ) : filtered.length === 0 ? (
              <Reveal className="flex flex-col items-center justify-center py-24 text-center"><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Search size={24} className="text-slate-400" /></div><h3 className="font-bold text-[#132043] text-xl mb-2">No tyres found</h3><p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search query.</p><button onClick={clearAll} className="bg-[#FF5C00] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#E05200] transition-colors">Clear all filters</button></Reveal>
            ) : (
              <>
                <RevealGroup className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 2xl:gap-6' : 'space-y-4'} stagger={0.06}>
                  {paginated.map((product) => viewMode === 'grid' ? (
                    <RevealItem key={product.id}><ProductCard product={product} onNavigate={onNavigate} /></RevealItem>
                  ) : (
                    <RevealItem key={product.id}>
                      <button onClick={() => onNavigate(`product:${product.slug}`, product.permalink)} className="w-full text-left bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex gap-0 overflow-hidden group">
                        <div className="w-40 flex-shrink-0 bg-slate-50 relative overflow-hidden">{product.badge && <div className={`absolute top-2 left-2 ${product.badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full z-10`}>{product.badge}</div>}<img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                        <div className="flex-1 p-5 flex items-center justify-between gap-6"><div><div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{product.brand}</div><h3 className="font-bold text-[#132043] text-lg">{product.name}</h3><p className="text-sm text-slate-500 mb-2">{product.size} | {product.category}</p><div className="flex items-center gap-2"><StarRating rating={product.rating} size={13} /><span className="text-sm font-bold text-slate-700">{product.rating.toFixed(1)}</span><span className="text-xs text-slate-400">({product.reviews} reviews)</span></div></div><div className="flex-shrink-0 text-right"><div className="flex items-end gap-2 justify-end mb-1"><span className="text-2xl font-extrabold text-[#132043]">{formatCurrency(product.price)}</span>{product.originalPrice && <span className="text-sm text-slate-400 line-through mb-0.5">{formatCurrency(product.originalPrice)}</span>}</div><div className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors bg-slate-100 text-[#132043] group-hover:bg-slate-200">View Product</div></div></div>
                      </button>
                    </RevealItem>
                  ))}
                </RevealGroup>
                {filtered.length > ITEMS_PER_PAGE && (
                  <div className="mt-10 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing <span className="font-bold text-[#132043]">{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-bold text-[#132043]">{filtered.length}</span> tyres</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentPage((current) => Math.max(1, current - 1))} disabled={currentPage === 1} className="w-9 h-9 rounded-lg border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-[#FF5C00] hover:text-[#FF5C00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight size={16} className="rotate-180" /></button>
                      {Array.from({ length: totalPages }).map((_, index) => <button key={index} onClick={() => setCurrentPage(index + 1)} className={`w-9 h-9 rounded-lg border-2 font-bold text-sm transition-colors ${currentPage === index + 1 ? 'bg-[#FF5C00] border-[#FF5C00] text-white' : 'border-slate-200 text-slate-600 hover:border-[#FF5C00] hover:text-[#FF5C00]'}`}>{index + 1}</button>)}
                      <button onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))} disabled={currentPage === totalPages} className="w-9 h-9 rounded-lg border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-[#FF5C00] hover:text-[#FF5C00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#132043] mt-8">
        <RevealGroup className={`${CONTAINER} py-8 grid grid-cols-1 sm:grid-cols-3 gap-6`} stagger={0.1}>
          {[
            { icon: <CheckCircle size={22} className="text-[#FF5C00]" />, title: 'WooCommerce Powered', desc: 'Live products, real cart sessions, and synced checkout data.' },
            { icon: <ArrowRight size={22} className="text-[#FF5C00]" />, title: 'Shop URLs Preserved', desc: 'Real product permalinks and archive routes still work.' },
            { icon: <Star size={22} className="text-[#FF5C00]" fill="currentColor" />, title: 'Same Front-End UI', desc: 'The design stays aligned with the React storefront.' },
          ].map(({ icon, title, desc }) => <RevealItem key={title}><div className="flex items-start gap-4"><div className="flex-shrink-0 bg-white/10 p-3 rounded-xl">{icon}</div><div><div className="font-bold text-white text-sm">{title}</div><div className="text-slate-400 text-xs mt-0.5">{desc}</div></div></div></RevealItem>)}
        </RevealGroup>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div key="filters-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileFiltersOpen(false)} className="fixed inset-0 z-50 bg-black/50 lg:hidden" />
            <motion.div key="filters-panel" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed inset-y-0 left-0 z-[60] w-80 bg-white shadow-2xl lg:hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#132043]"><span className="font-extrabold text-white text-base">Filters</span><button onClick={() => setMobileFiltersOpen(false)} className="text-slate-400 hover:text-white p-1.5 rounded-lg"><X size={20} /></button></div>
              <div className="flex-1 overflow-y-auto px-5 py-4"><FiltersPanel {...{ categories, brands, widths, products, selectedCategories, selectedBrands, selectedWidths, inStockOnly, maxPrice, priceCeiling, minRating, searchQuery, setSearchQuery, setSelectedCategories, setSelectedBrands, setSelectedWidths, setInStockOnly, setMaxPrice, setMinRating }} /></div>
              <div className="border-t border-slate-200 p-4 flex gap-3"><button onClick={clearAll} className="flex-1 py-3 rounded-lg border-2 border-slate-200 font-bold text-sm text-slate-600">Clear All</button><button onClick={() => setMobileFiltersOpen(false)} className="flex-1 py-3 rounded-lg bg-[#FF5C00] font-bold text-sm text-white">Show {filtered.length} Results</button></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
