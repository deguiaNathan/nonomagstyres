import React, { Suspense, createContext, lazy, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { 
  ShoppingCart, User, Phone, CheckCircle, 
  Star, ChevronRight, Menu, X, 
  ShieldCheck, MapPin, Package, ArrowRight, TrendingUp, ThumbsUp, Wrench
} from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import logoUrl from '../assets/logo.png';
import aboutPersonImg from '../assets/about-person.png';
import { CartProvider, useCart } from './components/CartContext';
import { ParallaxMedia, Reveal, RevealGroup, RevealItem } from './components/ScrollReveal';
import { formatCurrency, getInitialPageFromLocation, getUrlForPage, getWpRuntimeConfig } from './lib/wordpress';
const StyleguidePanel = import.meta.env.DEV
  ? lazy(() =>
      import('./components/StyleguidePanel').then((module) => ({ default: module.StyleguidePanel }))
    )
  : null;
const StorePage = lazy(() =>
  import('./components/StorePage').then((module) => ({ default: module.StorePage }))
);
const ProductPage = lazy(() =>
  import('./components/ProductPage').then((module) => ({ default: module.ProductPage }))
);
const CheckoutPage = lazy(() =>
  import('./components/CheckoutPage').then((module) => ({ default: module.CheckoutPage }))
);
const ImplementationPlan = import.meta.env.DEV
  ? lazy(() =>
      import('./components/ImplementationPlan').then((module) => ({ default: module.ImplementationPlan }))
    )
  : null;

// ─── Navigation context ───────────────────────────────────────────────────────
const NavCtx = createContext<{ page: string; navigate: (page: string, url?: string) => void }>({ page: 'home', navigate: () => {} });
const useNav = () => useContext(NavCtx);

const HERO_BG = "https://images.unsplash.com/photo-1762316817062-53ef18353891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9kZXJuJTIwc3BvcnRzJTIwY2FyJTIwZHJpdmluZ3xlbnwxfHx8fDE3NzQzNjI2NDd8MA&ixlib=rb-4.1.0&q=80&w=2000";
const TYRE_IMG = "https://images.unsplash.com/photo-1753030148904-16130157a3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB0eXJlJTIwdHJlYWR8ZW58MXx8fHwxNzc0MzYyNjUyfDA&ixlib=rb-4.1.0&q=80&w=1080";
const ALLOY_IMG = "https://images.unsplash.com/photo-1769899107195-aae414826ced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGxveSUyMHdoZWVsJTIwcmltfGVufDF8fHx8MTc3NDM2MjY1Mnww&ixlib=rb-4.1.0&q=80&w=1080";
const PRODUCT_TYRE = "https://images.unsplash.com/photo-1760836395760-552678e43a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2VzdG9uZSUyMGNhciUyMHR5cmUlMjBzdHVkaW8lMjBwcm9kdWN0fGVufDF8fHx8MTc3NDM2NDUwMHww&ixlib=rb-4.1.0&q=80&w=1080";
const PRODUCT_TYRE2 = "https://images.unsplash.com/photo-1765220625875-3083a2b387c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB0eXJlJTIwdHJlYWQlMjBjbG9zZSUyMHVwJTIwcnViYmVyfGVufDF8fHx8MTc3NDM2NDUwNHww&ixlib=rb-4.1.0&q=80&w=1080";
const PRODUCT_MAG = "https://images.unsplash.com/photo-1668639381936-fdca2dea792f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGxveSUyMHJpbSUyMHdoZWVsJTIwc2lsdmVyJTIwaXNvbGF0ZWQlMjBwcm9kdWN0fGVufDF8fHx8MTc3NDM2NDUwMHww&ixlib=rb-4.1.0&q=80&w=1080";
const PRODUCT_MAG2 = "https://images.unsplash.com/photo-1766917947934-6eb530590b85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMGNhciUyMHdoZWVsJTIwcmltJTIwY2hyb21lJTIwZGV0YWlsfGVufDF8fHx8MTc3NDM2NDUwNHww&ixlib=rb-4.1.0&q=80&w=1080";
const ABOUT_IMG = "https://images.unsplash.com/photo-1691840204491-f5c608613b68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwbWVjaGFuaWMlMjB3b3Jrc2hvcCUyMGZyaWVuZGx5fGVufDF8fHx8MTc3NDM2Mjg4N3ww&ixlib=rb-4.1.0&q=80&w=1080";
const PROMO_SALE_IMG = "https://images.unsplash.com/photo-1675034743126-0f250a5fee51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB0eXJlJTIwc2FsZSUyMGRpc2NvdW50JTIwc2hvcHxlbnwxfHx8fDE3NzQzNjQzMTB8MA&ixlib=rb-4.1.0&q=80&w=1080";
const PROMO_WHEEL_IMG = "https://images.unsplash.com/photo-1761756580701-e7ecb9baea13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGxveSUyMHdoZWVsJTIwdXBncmFkZSUyMHNwb3J0JTIwY2FyfGVufDF8fHx8MTc3NDM2NDMxMHww&ixlib=rb-4.1.0&q=80&w=1080";
const PROMO_WINTER_IMG = "https://images.unsplash.com/photo-1769475394584-b530afdca19d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBzbm93JTIwdHlyZSUyMHNlYXNvbnxlbnwxfHx8fDE3NzQzNjQzMTF8MA&ixlib=rb-4.1.0&q=80&w=1080";
const PROMO_FIT_IMG = "https://images.unsplash.com/photo-1619505372149-07875c35b313?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBtZWNoYW5pYyUyMHR5cmUlMjBmaXR0aW5nJTIwZ2FyYWdlfGVufDF8fHx8MTc3NDM2NDMxMXww&ixlib=rb-4.1.0&q=80&w=1080";
const PRODUCT_TYRE3 = "https://images.unsplash.com/photo-1752959807356-a4f7628f74a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXJlbGxpJTIwdHlyZSUyMHJ1YmJlciUyMGNsb3NlJTIwdXAlMjBwcm9kdWN0fGVufDF8fHx8MTc3NDM2NDcyNXww&ixlib=rb-4.1.0&q=80&w=1080";
const PROMO_PKG_IMG = "https://images.unsplash.com/photo-1672626923182-4cacabdafb76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0eXJlJTIwY29tYm8lMjBwYWNrYWdlJTIwZGVhbCUyMGJ1bmRsZSUyMGNhcnxlbnwxfHx8fDE3NzQzNjQ3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080";

// ─── Responsive container — single source of truth ───────────────────────────
// xl  (≥1280px): 1280px  → 67% fill at 1920px (1080p)
// 2xl (≥1536px): 1440px  → 75% fill at 1920px (1080p) | 56% at 2560px (1440p)
// Both breakpoints fire on 1080p desktops; 2xl also covers all 1440p monitors.
const CONTAINER = "max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10";

// Brand Colors
const COLORS = {
  navy: '#132043',
  navyDark: '#0B132C',
  orange: '#FF5C00',
  orangeHover: '#E05200',
  lightGray: '#F3F4F6',
  white: '#FFFFFF',
  textDark: '#1F2937',
  textMuted: '#6B7280'
};

const Header = () => {
  const { navigate } = useNav();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  const goToPage = (page: string) => {
    setMobileMenuOpen(false);
    navigate(page);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-40">
      {/* Top Bar */}
      <div className="w-full bg-[#132043] text-white py-2 text-xs font-medium" role="banner">
        <div className={`${CONTAINER} flex justify-between items-center`}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#FF5C00] font-bold">
              <TrendingUp size={14} aria-hidden="true" /> Flash Sale: Up to 30% Off Selected Tyres
            </span>
            <span className="hidden sm:inline-block opacity-40" aria-hidden="true">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <CheckCircle size={14} className="text-[#FF5C00]" aria-hidden="true" /> 100% Fitment Guarantee
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:08006666624" className="flex items-center gap-1 hover:text-[#FF5C00] transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5C00] rounded px-1">
              <Phone size={14} aria-hidden="true" /> 0800 NO NO MAGS
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`${CONTAINER} py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => goToPage('home')}
            className="flex-shrink-0 bg-transparent border-0 p-0 focus:outline-none focus:ring-2 focus:ring-[#FF5C00] rounded"
            aria-label="Home"
          >
            <img src={logoUrl} alt="Nono Mags N Tyres Logo" className="h-10 object-contain" />
          </button>
          
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-[#1F2937]" aria-label="Main Navigation">
            <button type="button" onClick={() => navigate('store')} className="bg-transparent border-0 p-0 hover:text-[#FF5C00] transition-colors border-b-2 border-transparent hover:border-[#FF5C00] py-1">Shop Tyres</button>
            <button type="button" onClick={() => navigate('home')} className="bg-transparent border-0 p-0 hover:text-[#FF5C00] transition-colors border-b-2 border-transparent hover:border-[#FF5C00] py-1">Mags & Wheels</button>
            <button type="button" onClick={() => navigate('home')} className="bg-transparent border-0 p-0 hover:text-[#FF5C00] transition-colors border-b-2 border-transparent hover:border-[#FF5C00] py-1">Combos</button>
            <button type="button" onClick={() => navigate('store')} className="bg-transparent border-0 p-0 text-[#FF5C00] hover:text-[#E05200] transition-colors flex items-center gap-1 py-1">
              <TagIcon /> Sale
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00]" aria-label="User Account">
            <User size={20} />
          </button>
          <button onClick={() => navigate('checkout')} className="flex items-center gap-2 bg-[#FF5C00] hover:bg-[#E05200] text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00]" aria-label="Shopping Cart">
            <ShoppingCart size={20} />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="bg-white text-[#FF5C00] text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center -ml-1">{totalItems}</span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
            aria-label="Open Menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-[#0B132C]/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              key="mobile-menu-panel"
              id="mobile-nav"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl lg:hidden flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                <img src={logoUrl} alt="Nono Mags N Tyres Logo" className="h-9 object-contain" />
                <button
                  ref={closeButtonRef}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-[#132043] hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                  aria-label="Close Menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <nav className="space-y-2" aria-label="Mobile Navigation">
                  <button
                    onClick={() => goToPage('store')}
                    className="w-full flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left hover:border-[#FF5C00] hover:bg-[#FF5C00]/5 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-[#132043]">Shop Tyres</p>
                      <p className="text-sm text-slate-500">Browse exact-fit tyres and best sellers.</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => goToPage('home')}
                    className="w-full flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left hover:border-[#FF5C00] hover:bg-[#FF5C00]/5 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-[#132043]">Mags & Wheels</p>
                      <p className="text-sm text-slate-500">Explore wheel upgrades and premium alloys.</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => goToPage('home')}
                    className="w-full flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left hover:border-[#FF5C00] hover:bg-[#FF5C00]/5 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-[#132043]">Combos</p>
                      <p className="text-sm text-slate-500">See wheel and tyre packages in one place.</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => goToPage('checkout')}
                    className="w-full flex items-center justify-between rounded-2xl border border-[#FF5C00]/30 bg-[#FF5C00]/5 px-4 py-4 text-left hover:bg-[#FF5C00]/10 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-[#132043]">Cart & Checkout</p>
                      <p className="text-sm text-slate-500">Review your fitment and finish the order.</p>
                    </div>
                    <ShoppingCart size={18} className="text-[#FF5C00]" />
                  </button>
                </nav>
              </div>

              <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
                <a
                  href="tel:08006666624"
                  className="flex items-center gap-3 rounded-2xl bg-[#132043] px-4 py-4 text-white"
                >
                  <div className="rounded-xl bg-white/10 p-3">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-300">Call our Kiwi experts</p>
                    <p className="font-bold">0800 NO NO MAGS</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42l-8.704-8.704z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
)

const HeroSearchWidget = () => {
  const { navigate } = useNav();

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full ml-auto border border-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 px-8 py-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF5C00]">Search by Size</p>
        <p className="mt-1 text-sm text-slate-600">Find the right tyres by entering your exact tyre size.</p>
      </div>

      <div className="p-8 bg-white">
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="size-width" className="block text-xs font-bold text-slate-800 mb-1.5">Width</label>
              <select id="size-width" className="w-full border-2 border-slate-300 rounded-lg px-2 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20">
                <option>205</option>
                <option>215</option>
                <option>225</option>
              </select>
            </div>
            <div>
              <label htmlFor="size-profile" className="block text-xs font-bold text-slate-800 mb-1.5">Profile</label>
              <select id="size-profile" className="w-full border-2 border-slate-300 rounded-lg px-2 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20">
                <option>55</option>
                <option>60</option>
                <option>65</option>
              </select>
            </div>
            <div>
              <label htmlFor="size-rim" className="block text-xs font-bold text-slate-800 mb-1.5">Rim</label>
              <select id="size-rim" className="w-full border-2 border-slate-300 rounded-lg px-2 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20">
                <option>16"</option>
                <option>17"</option>
                <option>18"</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => navigate('store')}
            className="w-full bg-[#FF5C00] hover:bg-[#E05200] text-white font-bold text-lg py-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00]"
          >
            Find My Tyres <ArrowRight size={20} aria-hidden="true" />
          </button>
          <p className="text-sm text-slate-600 text-center font-medium mt-4 flex items-center justify-center gap-1.5">
            <CheckCircle size={16} className="text-green-600" aria-hidden="true" /> 
            Access NZ's largest inventory.
          </p>
        </div>
      </div>
    </div>
  );
};

const TrustBar = () => {
  const items = [
    { icon: <ShieldCheck size={32} className="text-[#FF5C00]" aria-hidden="true" />, title: "100% Fitment Guarantee", desc: "If it doesn't fit, we replace it free." },
    { icon: <MapPin size={32} className="text-[#FF5C00]" aria-hidden="true" />, title: "200+ Fitting Stations", desc: "Local mechanics ready to install." },
    { icon: <Package size={32} className="text-[#FF5C00]" aria-hidden="true" />, title: "Fast NZ Delivery", desc: "Shipped directly to your fitter." },
  ];

  return (
    <section id="trust" className="bg-[#132043] w-full py-12 text-white relative z-10 -mt-8 shadow-xl border-t-4 border-[#FF5C00]">
      <RevealGroup className={`${CONTAINER} grid grid-cols-1 md:grid-cols-3 gap-8`} stagger={0.14}>
        {items.map((item, i) => (
          <RevealItem key={i}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-white/10 p-4 rounded-xl">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1.5">{item.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

const FeaturedProducts = () => {
  const { navigate } = useNav();
  const products = [
    {
      id: 1,
      name: "Michelin Pilot Sport 4",
      brand: "Michelin",
      type: "225/45 R17",
      image: PRODUCT_TYRE,
      price: 249.00,
      oldPrice: 310.00,
      rating: 4.9,
      reviews: 128,
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Goodyear Eagle F1",
      brand: "Goodyear",
      type: "245/40 R18",
      image: PRODUCT_TYRE2,
      price: 199.00,
      oldPrice: 255.00,
      rating: 4.7,
      reviews: 84,
      badge: "Save 22%"
    },
    {
      id: 3,
      name: "Rotiform KPS Matte Black",
      brand: "Rotiform",
      type: "18x8.5 5x112",
      image: PRODUCT_MAG,
      price: 389.00,
      oldPrice: null,
      rating: 4.8,
      reviews: 42,
      badge: "New Arrival"
    },
    {
      id: 4,
      name: "Enkei RPF1 Silver",
      brand: "Enkei",
      type: "17x9 5x114.3",
      image: PRODUCT_MAG2,
      price: 425.00,
      oldPrice: 490.00,
      rating: 5.0,
      reviews: 215,
      badge: "Top Rated"
    },
    {
      id: 5,
      name: "Pirelli P Zero Nero",
      brand: "Pirelli",
      type: "235/35 R19",
      image: PRODUCT_TYRE3,
      price: 289.00,
      oldPrice: 349.00,
      rating: 4.8,
      reviews: 97,
      badge: "Limited Stock"
    },
  ];

  return (
    <section id="featured" className="py-24 bg-white" aria-labelledby="featured-heading">
      <div className={CONTAINER}>
        <RevealGroup className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4" stagger={0.1}>
          <RevealItem>
            <div className="flex items-center gap-2 text-[#FF5C00] font-bold mb-2 uppercase tracking-wide text-sm">
              <TrendingUp size={20} aria-hidden="true" /> Today's Top Picks
            </div>
            <h2 id="featured-heading" className="text-3xl md:text-4xl font-extrabold text-[#132043]">Featured Deals</h2>
          </RevealItem>
          <RevealItem>
            <button
              type="button"
              onClick={() => navigate('store')}
              className="bg-transparent border-0 text-[#132043] font-bold hover:text-[#FF5C00] flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00] rounded px-2 py-1"
            >
              View All Deals <ChevronRight size={20} aria-hidden="true" />
            </button>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 2xl:gap-8" stagger={0.08} delayChildren={0.06}>
          {products.map((product) => (
            <RevealItem key={product.id} className="h-full">
              <article className="group flex h-full flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#FF5C00]">
                <div className="relative aspect-square bg-slate-100 overflow-hidden border-b border-slate-100">
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-[#FF5C00] text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                      {product.badge}
                    </div>
                  )}
                  <ParallaxMedia className="absolute inset-0 overflow-hidden" offset={56} startScale={1.1}>
                    <img 
                      src={product.image} 
                      alt={`${product.name} product shot`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </ParallaxMedia>
                </div>
                
                {/* Card Content grouped by Law of Proximity */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Product Metadata Group */}
                  <div className="mb-auto">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{product.brand}</div>
                    <h3 className="font-bold text-[#1F2937] text-lg leading-tight mb-2">
                      <button
                        type="button"
                        onClick={() => navigate('store')}
                        className="bg-transparent border-0 p-0 text-left outline-none before:absolute before:inset-0"
                      >
                        {product.name}
                      </button>
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">{product.type}</p>
                    
                    <div className="flex items-center gap-1.5" aria-label={`Rating ${product.rating} out of 5 stars from ${product.reviews} reviews`}>
                      <div className="flex text-[#FF5C00]">
                        <Star size={14} fill="currentColor" aria-hidden="true" />
                        <Star size={14} fill="currentColor" aria-hidden="true" />
                        <Star size={14} fill="currentColor" aria-hidden="true" />
                        <Star size={14} fill="currentColor" aria-hidden="true" />
                        <Star size={14} fill="currentColor" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-bold text-slate-600">({product.reviews})</span>
                    </div>
                  </div>

                  {/* Price & Action Group (Fitts's Law: Larger CTA) */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-end gap-2 mb-4">
                      <div className="text-2xl font-extrabold text-[#132043]">{formatCurrency(product.price)}</div>
                      {product.oldPrice && (
                        <div className="text-sm font-medium text-slate-500 line-through mb-1">
                          <span className="sr-only">Original price: </span>{formatCurrency(product.oldPrice)}
                        </div>
                      )}
                    </div>
                    
                    {/* Replaced Icon Button with Full Text Button for NN/g adherence */}
                    <button
                      type="button"
                      onClick={() => navigate('store')}
                      className="w-full bg-slate-100 hover:bg-[#FF5C00] text-[#132043] hover:text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00] relative z-10"
                    >
                      <ShoppingCart size={18} aria-hidden="true" />
                      <span>Browse Live Stock</span>
                    </button>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
};

const PromoSection = () => {
  const { navigate } = useNav();
  const [seconds, setSeconds] = React.useState(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(23, 59, 59, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  });
  React.useEffect(() => {
    const id = setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');

  const promos = [
    {
      id: 1,
      eyebrow: 'Flash Sale - This Week Only',
      name: 'Up to 30% Off\nSelected Tyres',
      detail: 'Michelin, Bridgestone, and Goodyear prices slashed for NZ drivers.',
      saving: 'Save up to $93 per tyre',
      image: PROMO_SALE_IMG,
      cta: 'Shop the Sale',
      badge: 'Flash Sale',
      badgeBg: 'bg-[#FF5C00]',
      hero: true,
    },
    {
      id: 2,
      eyebrow: 'Best Value',
      name: 'Mags + Tyres Combo',
      detail: 'Fitted from $899 - all sizes.',
      saving: 'Save $150 vs. separate',
      image: PROMO_WHEEL_IMG,
      cta: 'View Combos',
      badge: 'Bundle Deal',
      badgeBg: 'bg-white/20',
      hero: false,
    },
    {
      id: 3,
      eyebrow: 'Winter Ready',
      name: 'All-Weather Kits',
      detail: 'Built for NZ conditions.',
      saving: 'From $179 per tyre',
      image: PROMO_WINTER_IMG,
      cta: 'Shop Winter Kits',
      badge: 'Seasonal',
      badgeBg: 'bg-sky-500/80',
      hero: false,
    },
    {
      id: 4,
      eyebrow: 'Nationwide',
      name: 'Free Fitting on $500+',
      detail: '200+ certified fitters.',
      saving: 'Worth up to $80',
      image: PROMO_FIT_IMG,
      cta: 'Find a Fitter',
      badge: 'Free Service',
      badgeBg: 'bg-green-600/80',
      hero: false,
    },
    {
      id: 5,
      eyebrow: 'Exclusive',
      name: 'Pirelli P Zero + Alloys',
      detail: 'Complete wheel package.',
      saving: 'Save $200',
      image: PROMO_PKG_IMG,
      cta: 'Shop Combo',
      badge: 'Combo Offer',
      badgeBg: 'bg-[#FF5C00]/80',
      hero: false,
    },
  ];

  const promoHero = promos[0];
  const promoTiles = promos.slice(1);

  return (
    <section id="promotions" className="bg-[#0B132C] py-16" aria-labelledby="promo-heading">
      <div className={CONTAINER}>

        <RevealGroup className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10" stagger={0.1}>
          <RevealItem>
            <div>
              <div className="flex items-center gap-2 text-[#FF5C00] font-bold uppercase tracking-widest text-xs mb-3">
                <span className="block w-8 h-0.5 bg-[#FF5C00]" aria-hidden="true" />
                Exclusive Offers
              </div>
              <h2 id="promo-heading" className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Current Promotions
              </h2>
            </div>
          </RevealItem>
          <RevealItem>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 self-start sm:self-auto">
              <TrendingUp size={16} className="text-[#FF5C00] flex-shrink-0" aria-hidden="true" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Ends in</span>
              {[h, m, s].map((unit, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-extrabold text-white tabular-nums leading-none">{unit}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{['hrs', 'min', 'sec'][i]}</span>
                  </div>
                  {i < 2 && <span className="text-[#FF5C00] font-extrabold text-xl leading-none mb-1">:</span>}
                </React.Fragment>
              ))}
            </div>
          </RevealItem>
        </RevealGroup>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5" stagger={0.1} delayChildren={0.08}>

          <RevealItem className="lg:row-span-2" distance={36}>
            <article
              className="group relative h-full rounded-3xl overflow-hidden min-h-[340px] lg:min-h-0 focus-within:ring-2 focus-within:ring-[#FF5C00]"
              aria-label={promoHero.name.replace('\n', ' ')}
            >
              <ParallaxMedia className="absolute inset-0 overflow-hidden" offset={88} startScale={1.12}>
                <img src={promoHero.image} alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  aria-hidden="true"
                />
              </ParallaxMedia>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), rgba(0,0,0,0.1))' }} aria-hidden="true" />
              <div className="absolute top-0 inset-x-0 h-1 bg-[#FF5C00]" aria-hidden="true" />

              <div className="relative h-full flex flex-col justify-between p-7 lg:p-8 min-h-[340px] lg:min-h-[520px]">
                <div>
                  <span className={`inline-block ${promoHero.badgeBg} text-white text-xs font-extrabold px-3 py-1.5 rounded-full backdrop-blur-sm mb-4 shadow`}>
                    {promoHero.badge}
                  </span>
                  <p className="text-[#FF5C00] text-xs font-bold uppercase tracking-widest mb-2">{promoHero.eyebrow}</p>
                  <h3 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight whitespace-pre-line mb-4">
                    <button
                      type="button"
                      onClick={() => navigate('store')}
                      className="bg-transparent border-0 p-0 text-left outline-none before:absolute before:inset-0"
                    >
                      {promoHero.name}
                    </button>
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-xs">{promoHero.detail}</p>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
                    <CheckCircle size={12} aria-hidden="true" /> {promoHero.saving}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('store')}
                    className="flex items-center gap-2 bg-[#FF5C00] hover:bg-[#E05200] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-lg hover:shadow-[#FF5C00]/30 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00] relative z-10"
                  >
                    {promoHero.cta} <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          </RevealItem>

          {promoTiles.map((promo) => (
            <RevealItem key={promo.id}>
              <article
                className="group relative rounded-3xl overflow-hidden min-h-[200px] focus-within:ring-2 focus-within:ring-[#FF5C00]"
              >
                <ParallaxMedia className="absolute inset-0 overflow-hidden" offset={72} startScale={1.1}>
                  <img src={promo.image} alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    aria-hidden="true"
                  />
                </ParallaxMedia>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3), transparent)' }} aria-hidden="true" />

                <div className="relative h-full flex flex-col justify-between p-5 min-h-[200px] md:min-h-[240px]">
                  <div>
                    <span className={`inline-block ${promo.badgeBg} text-white text-xs font-extrabold px-2.5 py-1 rounded-full backdrop-blur-sm`}>
                      {promo.badge}
                    </span>
                  </div>
                  <div>
                    <p className="text-[#FF5C00] text-xs font-bold uppercase tracking-widest mb-1">{promo.eyebrow}</p>
                    <h3 className="font-extrabold text-white text-xl leading-snug mb-1">
                      <button
                        type="button"
                        onClick={() => navigate('store')}
                        className="bg-transparent border-0 p-0 text-left outline-none before:absolute before:inset-0"
                      >
                        {promo.name}
                      </button>
                    </h3>
                    <p className="text-slate-300 text-xs mb-3">{promo.detail}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-300 bg-green-500/15 border border-green-500/30 px-2.5 py-1 rounded-full">
                        <CheckCircle size={10} aria-hidden="true" /> {promo.saving}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate('store')}
                        className="flex items-center gap-1 text-white font-bold text-xs bg-white/10 hover:bg-[#FF5C00] border border-white/20 hover:border-[#FF5C00] px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00] relative z-10"
                      >
                        {promo.cta} <ArrowRight size={12} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-6 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4" delay={0.12}>
          <p className="text-slate-300 text-sm font-medium">
            <span className="text-white font-bold">50,000+ Kiwi drivers</span> have already saved with Nono Mags this year.
          </p>
          <button
            type="button"
            onClick={() => navigate('store')}
            className="bg-transparent border-0 p-0 flex items-center gap-2 text-[#FF5C00] font-bold text-sm hover:text-white transition-colors"
          >
            View All Promotions <ChevronRight size={16} aria-hidden="true" />
          </button>
        </Reveal>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const { navigate } = useNav();

  return (
    <section id="about" className="py-24 bg-slate-50 overflow-hidden" aria-labelledby="about-heading">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal className="relative" distance={40}>
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#132043]/10 to-[#FF5C00]/10 rounded-3xl transform -rotate-3" aria-hidden="true"></div>
            <ParallaxMedia className="relative overflow-hidden rounded-2xl shadow-2xl" offset={68} startScale={1.08}>
              <img 
                src={aboutPersonImg} 
                alt="Nono, founder of Nono Mags N Tyres, standing in front of the store" 
                className="w-full aspect-[4/3] object-cover" 
              />
            </ParallaxMedia>
            
            <Reveal className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-[220px]" delay={0.16} distance={20}>
              <div className="flex text-[#FF5C00] mb-3">
                <Star size={20} fill="currentColor" aria-hidden="true" />
                <Star size={20} fill="currentColor" aria-hidden="true" />
                <Star size={20} fill="currentColor" aria-hidden="true" />
                <Star size={20} fill="currentColor" aria-hidden="true" />
                <Star size={20} fill="currentColor" aria-hidden="true" />
              </div>
              <p className="font-extrabold text-[#132043] text-2xl mb-1">4.9/5 Rating</p>
              <p className="text-sm text-slate-600 font-medium leading-snug">Based on 12,000+ verified Kiwi reviews.</p>
            </Reveal>
          </Reveal>

          <RevealGroup className="space-y-8 lg:pl-8" stagger={0.12}>
            <RevealItem>
              <div>
                <div className="inline-flex items-center gap-2 text-[#FF5C00] font-bold mb-4 uppercase tracking-wider text-sm">
                  <ThumbsUp size={16} aria-hidden="true" /> Why Choose Us
                </div>
                <h2 id="about-heading" className="text-3xl md:text-5xl font-extrabold text-[#132043] leading-tight mb-6">
                  New Zealand's Most Trusted Tyre Network.
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  We've revolutionized how Kiwis buy tyres and mags. By removing the middleman, we bring you premium brands at wholesale prices, shipped directly to a local mechanic near you.
                </p>
              </div>
            </RevealItem>

            <div className="space-y-6">
              <RevealItem>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[#132043]/10 flex items-center justify-center text-[#132043]">
                    <Wrench size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#132043] text-lg mb-1">Local Expert Fitting</h4>
                    <p className="text-slate-600 leading-relaxed">Choose from over 200 vetted fitting stations nationwide. We ship directly to them, so you just show up.</p>
                  </div>
                </div>
              </RevealItem>
              
              <RevealItem>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[#FF5C00]/10 flex items-center justify-center text-[#FF5C00]">
                    <CheckCircle size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#132043] text-lg mb-1">Guaranteed Fitment</h4>
                    <p className="text-slate-600 leading-relaxed">Use our rego search tool. If the tyres don't fit your vehicle, we'll replace them at zero cost to you.</p>
                  </div>
                </div>
              </RevealItem>
            </div>

            <RevealItem>
              <button
                type="button"
                onClick={() => navigate('store')}
                className="bg-[#132043] hover:bg-[#0B132C] text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#132043]"
              >
                Learn More About Us <ArrowRight size={20} aria-hidden="true" />
              </button>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
};

const CategorySection = () => {
  const { navigate } = useNav();
  const categories = [
    { title: "Premium Tyres", subtitle: "Shop all major brands", image: TYRE_IMG },
    { title: "Mags & Alloys", subtitle: "Upgrade your ride's look", image: ALLOY_IMG },
    { title: "Complete Packages", subtitle: "Wheel + tyre combos", image: PROMO_WHEEL_IMG },
  ];

  return (
    <section id="categories" className="py-24 bg-white" aria-labelledby="category-heading">
      <div className={CONTAINER}>
        <Reveal className="text-center mb-16">
          <h2 id="category-heading" className="text-3xl md:text-5xl font-extrabold text-[#132043] mb-6">Shop by Category</h2>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto leading-relaxed">Explore our extensive range of premium products specifically chosen for New Zealand roads. Find exactly what you need.</p>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8" stagger={0.12}>
          {categories.map((cat, i) => (
            <RevealItem key={i}>
              <button
                type="button"
                onClick={() => navigate('store')}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] block w-full text-left shadow-lg focus:outline-none focus:ring-4 focus:ring-[#FF5C00] focus:ring-offset-4"
              >
                <ParallaxMedia className="absolute inset-0 overflow-hidden" offset={76} startScale={1.1}>
                  <img src={cat.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" aria-hidden="true" />
                </ParallaxMedia>
                <div className="absolute inset-0 bg-gradient-to-t from-[#132043]/90 via-[#132043]/30 to-transparent flex flex-col justify-end p-10">
                  <p className="text-[#FF5C00] font-bold mb-2 uppercase tracking-wider text-sm">{cat.subtitle}</p>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">{cat.title}</h3>
                  <div className="inline-flex items-center text-[#132043] font-bold gap-2 bg-white w-max px-6 py-3 rounded-lg hover:bg-[#FF5C00] hover:text-white transition-colors shadow-md">
                    Shop Category <ArrowRight size={20} aria-hidden="true" />
                  </div>
                </div>
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

const Footer = () => {
  const { navigate } = useNav();
  const runtimeConfig = getWpRuntimeConfig();
  const footerNavClass = "bg-transparent border-0 p-0 hover:text-[#FF5C00] transition-colors py-1 inline-block";
  const footerLegalClass = "bg-transparent border-0 p-0 hover:text-white transition-colors";
  const accountUrl = runtimeConfig.accountUrl || '';
  const homeSectionUrl = (sectionId: string) => `${runtimeConfig.homeUrl.replace(/#.*$/, '')}#${sectionId}`;

  return (
    <footer className="bg-[#0B132C] text-slate-300 py-24" role="contentinfo">
      <RevealGroup className={`${CONTAINER} grid grid-cols-1 md:grid-cols-4 gap-12`} stagger={0.08}>
        <div className="space-y-6 md:col-span-1">
          <button type="button" onClick={() => navigate('home')} className="bg-transparent border-0 p-0 focus:outline-none focus:ring-2 focus:ring-[#FF5C00] rounded">
            <img src={logoUrl} alt="Nono Mags N Tyres Logo" className="h-10 object-contain bg-white p-2 rounded" />
          </button>
          <p className="text-sm text-slate-400 leading-relaxed">
            New Zealand's premium destination for tyres, mags, and wheel packages. Guaranteed fitment and local professional installation.
          </p>
          <div className="flex gap-2 items-center">
            <div className="flex text-[#FF5C00]">
              <Star fill="currentColor" size={16} aria-hidden="true" />
              <Star fill="currentColor" size={16} aria-hidden="true" />
              <Star fill="currentColor" size={16} aria-hidden="true" />
              <Star fill="currentColor" size={16} aria-hidden="true" />
              <Star fill="currentColor" size={16} aria-hidden="true" />
            </div>
            <span className="text-sm font-bold text-white">4.9/5 Rating</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Shop Parts</h4>
          <ul className="space-y-4 text-sm">
            <li><button type="button" onClick={() => navigate('store')} className={footerNavClass}>Search Tyres by Vehicle</button></li>
            <li><button type="button" onClick={() => navigate('store')} className={footerNavClass}>Search Mags by Size</button></li>
            <li><button type="button" onClick={() => navigate('store')} className={footerNavClass}>Complete Wheel Combos</button></li>
            <li><button type="button" onClick={() => navigate('home', homeSectionUrl('promotions'))} className="bg-transparent border-0 p-0 text-[#FF5C00] font-bold hover:text-white transition-colors py-1 inline-block">Current Promotions</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Customer Care</h4>
          <ul className="space-y-4 text-sm">
            <li>
              {accountUrl ? (
                <a href={accountUrl} className={footerNavClass}>Track My Order</a>
              ) : (
                <button type="button" onClick={() => navigate('checkout')} className={footerNavClass}>Track My Order</button>
              )}
            </li>
            <li><button type="button" onClick={() => navigate('home', homeSectionUrl('about'))} className={footerNavClass}>Find a Fitting Station</button></li>
            <li><button type="button" onClick={() => navigate('home', homeSectionUrl('trust'))} className={footerNavClass}>Fitment Guarantee</button></li>
            <li><button type="button" onClick={() => navigate('home', homeSectionUrl('promotions'))} className={footerNavClass}>Returns & Refunds</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Need Help?</h4>
          <div className="space-y-4">
            <a href="tel:08006666624" className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00]">
              <div className="bg-[#FF5C00] p-3 rounded-lg text-white" aria-hidden="true">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1 font-medium">Call our Kiwi experts</p>
                <p className="text-white font-bold">0800 NO NO MAGS</p>
              </div>
            </a>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Available Mon-Fri, 8am - 5:30pm NZT.
            </p>
          </div>
        </div>
      </RevealGroup>
      <Reveal className={`${CONTAINER} mt-16 pt-8 border-t border-white/10 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4`} delay={0.08}>
        <p>Copyright 2026 Nono Mags N Tyres. All rights reserved.</p>
        <div className="flex gap-6">
          {runtimeConfig.privacyPolicyUrl ? (
            <a href={runtimeConfig.privacyPolicyUrl} className={footerLegalClass}>Privacy Policy</a>
          ) : (
            <button type="button" onClick={() => navigate('home')} className={footerLegalClass}>Privacy Policy</button>
          )}
          {runtimeConfig.termsUrl ? (
            <a href={runtimeConfig.termsUrl} className={footerLegalClass}>Terms of Service</a>
          ) : (
            <button type="button" onClick={() => navigate('home')} className={footerLegalClass}>Terms of Service</button>
          )}
        </div>
      </Reveal>
    </footer>
  )
}

export default function App() {
  const runtimeConfig = getWpRuntimeConfig();
  const [page, setPage] = useState(() => getInitialPageFromLocation());
  const scrollToHashTarget = useCallback((targetUrl?: string) => {
    if (typeof window === 'undefined') {
      return false;
    }

    const resolvedHash = targetUrl
      ? new URL(targetUrl, window.location.origin).hash
      : window.location.hash;
    const hash = decodeURIComponent(resolvedHash.replace('#', '').trim());
    if (!hash) {
      return false;
    }

    window.requestAnimationFrame(() => {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    return true;
  }, []);

  const navigate = useCallback((nextPage: string, nextUrl?: string) => {
    setPage(nextPage);

    if (typeof window === 'undefined') {
      return;
    }

    const targetUrl = nextUrl ?? getUrlForPage(nextPage);
    if (targetUrl) {
      const resolvedUrl = new URL(targetUrl, window.location.origin).toString();
      if (resolvedUrl !== window.location.href) {
        window.history.pushState({ page: nextPage }, '', resolvedUrl);
      }

      if (scrollToHashTarget(resolvedUrl)) {
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scrollToHashTarget]);

  useEffect(() => {
    const handlePopState = () => {
      setPage(getInitialPageFromLocation());
      if (!scrollToHashTarget()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [scrollToHashTarget]);

  const pageLoader = (
    <div className="min-h-[40vh] flex items-center justify-center px-6">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-[#132043] shadow-sm">
        Loading page...
      </div>
    </div>
  );

  return (
    <NavCtx.Provider value={{ page, navigate }}>
      <CartProvider>
        <MotionConfig reducedMotion="user">
          <div className="min-h-screen bg-white font-sans text-[#1F2937] overflow-x-clip">
          {runtimeConfig.showPrototypeTools && StyleguidePanel && (
            <Suspense fallback={null}>
              <StyleguidePanel />
            </Suspense>
          )}
          {runtimeConfig.showPrototypeTools && page !== 'implementation' && (
            <button
              onClick={() => navigate('implementation')}
              className="fixed bottom-4 left-52 z-50 bg-[#0B132C] text-white px-4 py-2 rounded-full font-bold shadow-lg hover:bg-[#132043] transition-colors flex items-center gap-2 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
              WP Plan
            </button>
          )}
          <Header />

          {page === 'store' ? (
            <Suspense fallback={pageLoader}>
              <StorePage onNavigate={navigate} />
            </Suspense>
          ) : page === 'checkout' ? (
            <Suspense fallback={pageLoader}>
              <CheckoutPage onNavigate={navigate} />
            </Suspense>
          ) : page.startsWith('product:') ? (
            <Suspense fallback={pageLoader}>
              <ProductPage productRef={page.slice('product:'.length)} onNavigate={navigate} />
            </Suspense>
          ) : runtimeConfig.showPrototypeTools && ImplementationPlan && page === 'implementation' ? (
            <Suspense fallback={pageLoader}>
              <ImplementationPlan onBack={() => navigate('home')} />
            </Suspense>
          ) : (
            <main className="overflow-x-clip">
              <section className="relative min-h-[640px] flex items-center pt-8 pb-24 overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[#0B132C]">
                  <ParallaxMedia className="absolute inset-0 overflow-hidden" offset={124} startScale={1.16}>
                    <img src={HERO_BG} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
                  </ParallaxMedia>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#132043]/95 via-[#132043]/80 to-transparent"></div>
                  <motion.div
                    aria-hidden="true"
                    className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#FF5C00]/18 blur-3xl"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 0.85, scale: 1 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                <div className={`relative z-10 w-full ${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-[40px] py-[0px]`}>
                  <RevealGroup className="text-white space-y-8" stagger={0.12}>
                    <RevealItem>
                      <div className="inline-flex items-center gap-2 bg-[rgba(255,92,0,0.2)] text-[#FF5C00] px-4 py-2 rounded-full font-bold text-sm border border-[rgba(255,92,0,0.3)] backdrop-blur-sm shadow-sm">
                        <Star size={16} fill="currentColor" aria-hidden="true" /> Rated #1 Tyre Network in NZ
                      </div>
                    </RevealItem>
                    <RevealItem distance={34}>
                      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mx-[0px] mt-[0px] mb-[16px]">
                        Get the Right Tyres. <span className="text-[#FF5C00]">Guaranteed.</span>
                      </h1>
                    </RevealItem>
                    <RevealItem distance={28}>
                      <p className="text-lg md:text-xl text-slate-200 max-w-lg leading-relaxed font-medium">
                        Enter your rego and we'll show you the exact tyres for your car. Shipped directly to your local fitter or right to your door.
                      </p>
                    </RevealItem>
                    <RevealItem distance={20}>
                      <div className="flex items-center gap-6 text-sm font-semibold">
                        <div className="flex items-center gap-2"><CheckCircle size={18} className="text-green-400" aria-hidden="true" /> Free Shipping</div>
                        <div className="flex items-center gap-2"><CheckCircle size={18} className="text-green-400" aria-hidden="true" /> 200+ Fitters</div>
                      </div>
                    </RevealItem>
                  </RevealGroup>

                  <Reveal distance={46} scale={0.96}>
                    <HeroSearchWidget />
                  </Reveal>
                </div>
              </section>

              <TrustBar />
              <PromoSection />
              <FeaturedProducts />
              <AboutSection />
              <CategorySection />
            </main>
          )}
          <Footer />
          </div>
        </MotionConfig>
      </CartProvider>
    </NavCtx.Provider>
  );
}
