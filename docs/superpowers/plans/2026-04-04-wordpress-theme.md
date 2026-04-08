# Nono Mags WordPress Theme — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a portable WordPress theme at `c:/Users/Nathes2/Desktop/Nono Mags/nonomags-theme/` that is a 1:1 visual match of the React app in `src/app/App.tsx`, using a hybrid PHP + React islands architecture with WooCommerce integration.

**Architecture:** PHP templates render all SEO-critical homepage content (header, hero text, trust bar, promos, featured products, about, categories, footer) with identical Tailwind classes. React "islands" mount into PHP-provided `<div id="...">` containers for interactive features (search widget, mobile menu, cart button, store page, product page, checkout). A bundled REST API in `includes/` serves WooCommerce product data in the `StorefrontProduct` format the React components already consume.

**Tech Stack:** WordPress/PHP 8+, WooCommerce, Tailwind CSS 4, Vite, React 18, TypeScript, Lucide icons (SVG in PHP / lucide-react in islands), Framer Motion (islands only).

**Source React app location:** `c:/Users/Nathes2/Desktop/Nono Mags/Redesign landing page/src/app/`

**Theme output location:** `c:/Users/Nathes2/Desktop/Nono Mags/nonomags-theme/`

---

## File Map

| File | Responsibility |
|------|---------------|
| `style.css` | WordPress theme header (metadata only — Tailwind output goes in `assets/`) |
| `functions.php` | Loads all `includes/*.php`, enqueues assets |
| `index.php` | Fallback template (required by WP) |
| `front-page.php` | Homepage — assembles template-parts |
| `header.php` | Top bar + main nav + mobile menu mount point |
| `footer.php` | 4-column footer + countdown JS snippet |
| `page-shop.php` | WooCommerce shop → React StorePage island |
| `page-checkout.php` | WooCommerce checkout → React CheckoutPage island |
| `single-product.php` | Product → SEO shell + React ProductPage island |
| `template-parts/hero.php` | Hero section + search widget mount point |
| `template-parts/trust-bar.php` | 3-item trust strip |
| `template-parts/promo-section.php` | Promo grid with countdown placeholder |
| `template-parts/featured-products.php` | WooCommerce product query → product cards + schema.org |
| `template-parts/about-section.php` | About/why-choose-us section |
| `template-parts/category-section.php` | Shop-by-category cards |
| `includes/class-theme-setup.php` | `add_theme_support`, `register_nav_menus`, WooCommerce support |
| `includes/class-config-inject.php` | `window.NonoMagsWp` via `wp_localize_script` |
| `includes/class-rest-api.php` | `/wp-json/nonomags/v1/products`, `/products/{ref}`, `/payment-methods` |
| `includes/class-woo-integration.php` | WC_Product → StorefrontProduct transformer |
| `src/main.tsx` | React island entry — conditional mounting |
| `src/islands/search-widget.tsx` | HeroSearchWidget island wrapper |
| `src/islands/mobile-menu.tsx` | Mobile menu island wrapper |
| `src/islands/cart-button.tsx` | Cart button island wrapper |
| `src/islands/store-island.tsx` | StorePage island wrapper |
| `src/islands/product-island.tsx` | ProductPage island wrapper |
| `src/islands/checkout-island.tsx` | CheckoutPage island wrapper |
| `src/components/CartContext.tsx` | Copied from React app (no changes needed) |
| `src/components/StorePage.tsx` | Copied from React app (no changes needed) |
| `src/components/ProductPage.tsx` | Copied from React app (no changes needed) |
| `src/components/CheckoutPage.tsx` | Copied from React app (no changes needed) |
| `src/lib/woocommerce.ts` | Copied from React app (no changes needed) |
| `src/lib/wordpress.ts` | Copied from React app (no changes needed) |
| `src/styles/tailwind.css` | Tailwind entry — scans both PHP and TSX |
| `src/styles/theme.css` | CSS custom properties (copied from React app) |
| `package.json` | Trimmed dependencies + build scripts |
| `vite.config.ts` | Vite build config for islands |
| `.gitignore` | Ignores `node_modules/`, `assets/js/`, `assets/css/` |

---

## Task 1: Scaffold Theme Skeleton + Build Tooling

**Files:**
- Create: `nonomags-theme/style.css`
- Create: `nonomags-theme/functions.php`
- Create: `nonomags-theme/index.php`
- Create: `nonomags-theme/package.json`
- Create: `nonomags-theme/vite.config.ts`
- Create: `nonomags-theme/.gitignore`
- Create: `nonomags-theme/src/styles/tailwind.css`
- Create: `nonomags-theme/src/styles/theme.css`
- Create: `nonomags-theme/src/main.tsx`

- [ ] **Step 1: Create `style.css`** (WordPress theme header)

```css
/*
Theme Name: Nono Mags N Tyres
Theme URI: https://nonomags.co.nz
Author: Nono Mags
Description: Hybrid PHP + React islands theme for Nono Mags N Tyres — NZ's premium tyre and wheel store. Requires WooCommerce.
Version: 1.0.0
Requires at least: 6.4
Requires PHP: 8.0
Text Domain: nonomags
*/
```

- [ ] **Step 2: Create `index.php`** (required fallback)

```php
<?php
/**
 * Fallback template — WordPress requires this file to exist.
 * All routing is handled by front-page.php, page-shop.php, single-product.php, etc.
 */
get_header();
?>
<main class="max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10 py-24">
    <h1 class="text-3xl font-extrabold text-[#132043]"><?php the_title(); ?></h1>
    <div class="prose mt-8"><?php the_content(); ?></div>
</main>
<?php
get_footer();
```

- [ ] **Step 3: Create `functions.php`**

```php
<?php
/**
 * Nono Mags N Tyres — Theme Functions
 *
 * Loads backend classes and enqueues frontend assets.
 */

defined('ABSPATH') || exit;

define('NONOMAGS_VERSION', '1.0.0');
define('NONOMAGS_DIR', get_template_directory());
define('NONOMAGS_URI', get_template_directory_uri());

// Backend classes
require_once NONOMAGS_DIR . '/includes/class-theme-setup.php';
require_once NONOMAGS_DIR . '/includes/class-config-inject.php';
require_once NONOMAGS_DIR . '/includes/class-woo-integration.php';
require_once NONOMAGS_DIR . '/includes/class-rest-api.php';

// Initialize
NonoMags_Theme_Setup::init();
NonoMags_Config_Inject::init();
NonoMags_Woo_Integration::init();
NonoMags_Rest_Api::init();
```

- [ ] **Step 4: Create `package.json`**

```json
{
  "name": "nonomags-theme",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "clsx": "2.1.1",
    "lucide-react": "0.487.0",
    "motion": "12.23.24",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "tailwind-merge": "3.2.0",
    "tw-animate-css": "1.3.8"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@types/react": "18.3.23",
    "@types/react-dom": "18.3.7",
    "@vitejs/plugin-react": "4.7.0",
    "tailwindcss": "4.1.12",
    "typescript": "5.8.3",
    "vite": "6.3.5"
  }
}
```

- [ ] **Step 5: Create `vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'assets',
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.tsx'),
      output: {
        entryFileNames: 'js/nonomags-islands.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/nonomags-theme.css';
          }
          return 'js/[name]-[hash][extname]';
        },
      },
    },
  },
});
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules/
assets/js/
assets/css/
```

- [ ] **Step 7: Create `src/styles/tailwind.css`**

```css
@import 'tailwindcss' source(none);
@source '../../templates/**/*.php';
@source '../../template-parts/**/*.php';
@source '../../header.php';
@source '../../footer.php';
@source '../../front-page.php';
@source '../../page-shop.php';
@source '../../page-checkout.php';
@source '../../single-product.php';
@source '../../index.php';
@source '../**/*.{ts,tsx}';

@import 'tw-animate-css';
```

- [ ] **Step 8: Copy `src/styles/theme.css`** from the React app

Copy the file at `c:/Users/Nathes2/Desktop/Nono Mags/Redesign landing page/src/styles/theme.css` to `nonomags-theme/src/styles/theme.css` verbatim. It contains the CSS custom properties for colors, radii, and base typography used by Tailwind.

- [ ] **Step 9: Create `src/main.tsx`** (island entry point)

```tsx
import './styles/tailwind.css';
import './styles/theme.css';
import { createRoot } from 'react-dom/client';
import React from 'react';

const islands: Record<string, () => Promise<{ mount: (el: HTMLElement) => void }>> = {
  'nonomags-search-widget': () => import('./islands/search-widget'),
  'nonomags-mobile-menu': () => import('./islands/mobile-menu'),
  'nonomags-cart-button': () => import('./islands/cart-button'),
  'nonomags-store': () => import('./islands/store-island'),
  'nonomags-product': () => import('./islands/product-island'),
  'nonomags-checkout': () => import('./islands/checkout-island'),
};

for (const [id, loader] of Object.entries(islands)) {
  const el = document.getElementById(id);
  if (el) {
    loader().then(({ mount }) => mount(el));
  }
}
```

- [ ] **Step 10: Run `npm install` and verify Vite builds without errors**

```bash
cd "c:/Users/Nathes2/Desktop/Nono Mags/nonomags-theme" && npm install
```

This will fail on build because island files don't exist yet — that's expected. The goal is to confirm `npm install` succeeds and dependencies resolve.

---

## Task 2: Copy React Source Files

**Files:**
- Create: `nonomags-theme/src/lib/wordpress.ts`
- Create: `nonomags-theme/src/lib/woocommerce.ts`
- Create: `nonomags-theme/src/components/CartContext.tsx`
- Create: `nonomags-theme/src/components/StorePage.tsx`
- Create: `nonomags-theme/src/components/ProductPage.tsx`
- Create: `nonomags-theme/src/components/CheckoutPage.tsx`

- [ ] **Step 1: Copy lib files**

Copy these files verbatim from the React app to the theme:
- `Redesign landing page/src/app/lib/wordpress.ts` → `nonomags-theme/src/lib/wordpress.ts`
- `Redesign landing page/src/app/lib/woocommerce.ts` → `nonomags-theme/src/lib/woocommerce.ts`

No modifications needed — these files already reference `window.NonoMagsWp` which the theme will inject.

- [ ] **Step 2: Copy component files**

Copy these files verbatim:
- `Redesign landing page/src/app/components/CartContext.tsx` → `nonomags-theme/src/components/CartContext.tsx`
- `Redesign landing page/src/app/components/StorePage.tsx` → `nonomags-theme/src/components/StorePage.tsx`
- `Redesign landing page/src/app/components/ProductPage.tsx` → `nonomags-theme/src/components/ProductPage.tsx`
- `Redesign landing page/src/app/components/CheckoutPage.tsx` → `nonomags-theme/src/components/CheckoutPage.tsx`

- [ ] **Step 3: Fix import paths in copied files**

The copied components import from `'../lib/woocommerce'` and `'../lib/wordpress'`. Since we've preserved the same relative directory structure (`components/` and `lib/` are siblings), these imports should work unchanged. Verify by scanning each file for import paths.

If `StorePage.tsx`, `ProductPage.tsx`, or `CheckoutPage.tsx` import from `'./CartContext'`, those paths also remain valid since all components are in the same `components/` folder.

---

## Task 3: Create React Island Wrappers

**Files:**
- Create: `nonomags-theme/src/islands/search-widget.tsx`
- Create: `nonomags-theme/src/islands/mobile-menu.tsx`
- Create: `nonomags-theme/src/islands/cart-button.tsx`
- Create: `nonomags-theme/src/islands/store-island.tsx`
- Create: `nonomags-theme/src/islands/product-island.tsx`
- Create: `nonomags-theme/src/islands/checkout-island.tsx`

- [ ] **Step 1: Create `src/islands/search-widget.tsx`**

This island reproduces the `HeroSearchWidget` component from `App.tsx` lines 276–391. It needs to be extracted as a standalone component since it's defined inline in App.tsx and not importable.

```tsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { getWpRuntimeConfig } from '../lib/wordpress';

const HeroSearchWidget = () => {
  const [activeTab, setActiveTab] = useState<'rego' | 'size'>('size');
  const shopUrl = getWpRuntimeConfig().shopUrl;

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full ml-auto border border-slate-200">
      <div className="flex w-full bg-slate-100" role="tablist">
        <button
          id="tab-rego"
          role="tab"
          aria-selected={activeTab === 'rego'}
          aria-controls="panel-rego"
          onClick={() => setActiveTab('rego')}
          className={`flex-1 py-4 text-sm font-bold text-center border-t-4 transition-colors ${
            activeTab === 'rego'
              ? 'border-t-[#FF5C00] text-[#132043] bg-white'
              : 'border-t-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-b border-b-slate-200'
          }`}
        >
          Search by Rego
        </button>
        <button
          id="tab-size"
          role="tab"
          aria-selected={activeTab === 'size'}
          aria-controls="panel-size"
          onClick={() => setActiveTab('size')}
          className={`flex-1 py-4 text-sm font-bold text-center border-t-4 transition-colors ${
            activeTab === 'size'
              ? 'border-t-[#FF5C00] text-[#132043] bg-white'
              : 'border-t-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-b border-b-slate-200'
          }`}
        >
          Search by Size
        </button>
      </div>

      <div className="p-8 bg-white">
        {activeTab === 'rego' ? (
          <div id="panel-rego" role="tabpanel" aria-labelledby="tab-rego" className="space-y-5">
            <div>
              <label htmlFor="rego-input" className="block text-sm font-bold text-slate-800 mb-2">
                Enter your license plate
              </label>
              <div className="relative">
                <input
                  id="rego-input"
                  type="text"
                  placeholder="e.g. ABC123"
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-3.5 text-xl font-bold uppercase tracking-wider text-center focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20 transition-all placeholder:text-slate-300 placeholder:font-normal"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-6 bg-black rounded flex items-center justify-center text-[10px] text-white font-bold pointer-events-none" aria-hidden="true">
                  NZ
                </div>
              </div>
            </div>
            <a
              href={shopUrl}
              className="w-full bg-[#FF5C00] hover:bg-[#E05200] text-white font-bold text-lg py-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00]"
            >
              Find My Tyres <ArrowRight size={20} aria-hidden="true" />
            </a>
            <p className="text-sm text-slate-600 text-center font-medium mt-4 flex items-center justify-center gap-1.5">
              <CheckCircle size={16} className="text-green-600" aria-hidden="true" />
              Guaranteed fit for your vehicle.
            </p>
          </div>
        ) : (
          <div id="panel-size" role="tabpanel" aria-labelledby="tab-size" className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="size-width" className="block text-xs font-bold text-slate-800 mb-1.5">Width</label>
                <select id="size-width" className="w-full border-2 border-slate-300 rounded-lg px-2 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20">
                  <option>205</option><option>215</option><option>225</option>
                </select>
              </div>
              <div>
                <label htmlFor="size-profile" className="block text-xs font-bold text-slate-800 mb-1.5">Profile</label>
                <select id="size-profile" className="w-full border-2 border-slate-300 rounded-lg px-2 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20">
                  <option>55</option><option>60</option><option>65</option>
                </select>
              </div>
              <div>
                <label htmlFor="size-rim" className="block text-xs font-bold text-slate-800 mb-1.5">Rim</label>
                <select id="size-rim" className="w-full border-2 border-slate-300 rounded-lg px-2 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#FF5C00] focus:ring-2 focus:ring-[#FF5C00]/20">
                  <option>16"</option><option>17"</option><option>18"</option>
                </select>
              </div>
            </div>
            <a
              href={shopUrl}
              className="w-full bg-[#FF5C00] hover:bg-[#E05200] text-white font-bold text-lg py-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00]"
            >
              Find My Tyres <ArrowRight size={20} aria-hidden="true" />
            </a>
            <p className="text-sm text-slate-600 text-center font-medium mt-4 flex items-center justify-center gap-1.5">
              <CheckCircle size={16} className="text-green-600" aria-hidden="true" />
              Access NZ's largest inventory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export function mount(el: HTMLElement) {
  createRoot(el).render(<HeroSearchWidget />);
}
```

- [ ] **Step 2: Create `src/islands/mobile-menu.tsx`**

This island handles the animated slide-out mobile navigation. It reads the menu trigger button click from a custom event dispatched by the PHP header's hamburger button.

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronRight, Phone, ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getWpRuntimeConfig } from '../lib/wordpress';

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const config = getWpRuntimeConfig();

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener('nonomags:open-mobile-menu', handler);
    return () => document.removeEventListener('nonomags:open-mobile-menu', handler);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  const menuItems = [
    { label: 'Shop Tyres', desc: 'Browse exact-fit tyres and best sellers.', href: config.shopUrl, icon: null },
    { label: 'Mags & Wheels', desc: 'Explore wheel upgrades and premium alloys.', href: config.homeUrl, icon: null },
    { label: 'Combos', desc: 'See wheel and tyre packages in one place.', href: config.homeUrl, icon: null },
    { label: 'Cart & Checkout', desc: 'Review your fitment and finish the order.', href: config.checkoutUrl, icon: <ShoppingCart size={18} className="text-[#FF5C00]" /> },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
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
              <a href={config.homeUrl}>
                <img src={config.homeUrl + 'wp-content/themes/nonomags-theme/assets/images/logo.png'} alt="Nono Mags N Tyres Logo" className="h-9 object-contain" />
              </a>
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                className="p-2 text-slate-500 hover:text-[#132043] hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <nav className="space-y-2" aria-label="Mobile Navigation">
                {menuItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`w-full flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition-colors ${
                      item.icon
                        ? 'border-[#FF5C00]/30 bg-[#FF5C00]/5 hover:bg-[#FF5C00]/10'
                        : 'border-slate-200 hover:border-[#FF5C00] hover:bg-[#FF5C00]/5'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-[#132043]">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    {item.icon || <ChevronRight size={18} className="text-slate-400" />}
                  </a>
                ))}
              </nav>
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
              <a href="tel:08006666624" className="flex items-center gap-3 rounded-2xl bg-[#132043] px-4 py-4 text-white">
                <div className="rounded-xl bg-white/10 p-3"><Phone size={18} /></div>
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
  );
};

export function mount(el: HTMLElement) {
  createRoot(el).render(<MobileMenu />);
}
```

- [ ] **Step 3: Create `src/islands/cart-button.tsx`**

This replaces the PHP-rendered cart button's inner content with a live-updating version.

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ShoppingCart } from 'lucide-react';
import { CartProvider, useCart } from '../components/CartContext';
import { getWpRuntimeConfig } from '../lib/wordpress';

const CartButtonInner = () => {
  const { totalItems } = useCart();
  const config = getWpRuntimeConfig();

  return (
    <a
      href={config.checkoutUrl}
      className="flex items-center gap-2 bg-[#FF5C00] hover:bg-[#E05200] text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00]"
      aria-label="Shopping Cart"
    >
      <ShoppingCart size={20} />
      <span>Cart</span>
      {totalItems > 0 && (
        <span className="bg-white text-[#FF5C00] text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center -ml-1">
          {totalItems}
        </span>
      )}
    </a>
  );
};

export function mount(el: HTMLElement) {
  createRoot(el).render(
    <CartProvider>
      <CartButtonInner />
    </CartProvider>
  );
}
```

- [ ] **Step 4: Create `src/islands/store-island.tsx`**

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from '../components/CartContext';
import { StorePage } from '../components/StorePage';

export function mount(el: HTMLElement) {
  const onNavigate = (page: string, url?: string) => {
    if (url) {
      window.location.href = url;
    } else if (page === 'home') {
      window.location.href = '/';
    } else if (page.startsWith('product:')) {
      const ref = page.slice('product:'.length);
      window.location.href = `/product/${ref}/`;
    }
  };

  createRoot(el).render(
    <CartProvider>
      <StorePage onNavigate={onNavigate} />
    </CartProvider>
  );
}
```

- [ ] **Step 5: Create `src/islands/product-island.tsx`**

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from '../components/CartContext';
import { ProductPage } from '../components/ProductPage';

export function mount(el: HTMLElement) {
  const productRef = el.dataset.productRef || '';

  const onNavigate = (page: string, url?: string) => {
    if (url) {
      window.location.href = url;
    } else if (page === 'store') {
      window.location.href = '/shop/';
    } else if (page === 'checkout') {
      window.location.href = '/checkout/';
    } else if (page.startsWith('product:')) {
      const ref = page.slice('product:'.length);
      window.location.href = `/product/${ref}/`;
    }
  };

  createRoot(el).render(
    <CartProvider>
      <ProductPage productRef={productRef} onNavigate={onNavigate} />
    </CartProvider>
  );
}
```

- [ ] **Step 6: Create `src/islands/checkout-island.tsx`**

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from '../components/CartContext';
import { CheckoutPage } from '../components/CheckoutPage';

export function mount(el: HTMLElement) {
  const onNavigate = (page: string, url?: string) => {
    if (url) {
      window.location.href = url;
    } else if (page === 'store') {
      window.location.href = '/shop/';
    } else if (page === 'home') {
      window.location.href = '/';
    } else if (page.startsWith('product:')) {
      const ref = page.slice('product:'.length);
      window.location.href = `/product/${ref}/`;
    }
  };

  createRoot(el).render(
    <CartProvider>
      <CheckoutPage onNavigate={onNavigate} />
    </CartProvider>
  );
}
```

- [ ] **Step 7: Run `npm run build` and verify it compiles**

```bash
cd "c:/Users/Nathes2/Desktop/Nono Mags/nonomags-theme" && npm run build
```

Expected: Build succeeds. `assets/js/nonomags-islands.js` and `assets/css/nonomags-theme.css` are generated.

If there are import errors from copied components (e.g. missing `ScrollReveal` import), fix them by removing unused imports. The copied components should only import from `../lib/woocommerce`, `../lib/wordpress`, `./CartContext`, `lucide-react`, `motion/react`, and `react`.

---

## Task 4: Theme Setup + Config Injection (PHP Backend)

**Files:**
- Create: `nonomags-theme/includes/class-theme-setup.php`
- Create: `nonomags-theme/includes/class-config-inject.php`

- [ ] **Step 1: Create `includes/class-theme-setup.php`**

```php
<?php
defined('ABSPATH') || exit;

class NonoMags_Theme_Setup {

    public static function init() {
        add_action('after_setup_theme', [__CLASS__, 'setup']);
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_assets']);
    }

    public static function setup() {
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
        add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
        add_theme_support('woocommerce');

        register_nav_menus([
            'primary' => __('Primary Navigation', 'nonomags'),
        ]);
    }

    public static function enqueue_assets() {
        $theme_dir = NONOMAGS_URI;
        $version   = NONOMAGS_VERSION;

        // Compiled Tailwind + theme CSS
        $css_file = NONOMAGS_DIR . '/assets/css/nonomags-theme.css';
        if (file_exists($css_file)) {
            wp_enqueue_style(
                'nonomags-theme',
                $theme_dir . '/assets/css/nonomags-theme.css',
                [],
                $version
            );
        }

        // React islands bundle
        $js_file = NONOMAGS_DIR . '/assets/js/nonomags-islands.js';
        if (file_exists($js_file)) {
            wp_enqueue_script(
                'nonomags-islands',
                $theme_dir . '/assets/js/nonomags-islands.js',
                [],
                $version,
                true
            );
        }
    }
}
```

- [ ] **Step 2: Create `includes/class-config-inject.php`**

```php
<?php
defined('ABSPATH') || exit;

class NonoMags_Config_Inject {

    public static function init() {
        add_action('wp_enqueue_scripts', [__CLASS__, 'inject_config'], 20);
    }

    public static function inject_config() {
        if (!wp_script_is('nonomags-islands', 'enqueued')) {
            return;
        }

        $config = self::build_config();
        wp_localize_script('nonomags-islands', 'NonoMagsWp', $config);
    }

    private static function build_config(): array {
        $woo_active = class_exists('WooCommerce');

        $config = [
            'enabled'           => true,
            'wooEnabled'        => $woo_active,
            'restUrl'           => esc_url_raw(rest_url()),
            'apiBase'           => esc_url_raw(rest_url('nonomags/v1/')),
            'storeApiBase'      => esc_url_raw(rest_url('wc/store/v1/')),
            'homeUrl'           => esc_url_raw(home_url('/')),
            'shopUrl'           => $woo_active ? esc_url_raw(wc_get_page_permalink('shop')) : '/',
            'cartUrl'           => $woo_active ? esc_url_raw(wc_get_cart_url()) : '/',
            'checkoutUrl'       => $woo_active ? esc_url_raw(wc_get_checkout_url()) : '/',
            'nativeCheckoutUrl' => $woo_active ? esc_url_raw(add_query_arg('native-checkout', '1', wc_get_checkout_url())) : '/',
            'accountUrl'        => $woo_active ? esc_url_raw(wc_get_page_permalink('myaccount')) : '',
            'privacyPolicyUrl'  => esc_url_raw(get_privacy_policy_url()),
            'termsUrl'          => $woo_active ? esc_url_raw(wc_get_page_permalink('terms')) : '',
            'currentTemplate'   => self::detect_template(),
            'currentProduct'    => self::get_current_product(),
            'showPrototypeTools' => false,
            'storeApiNonce'     => wp_create_nonce('wc_store_api'),
            'currency'          => self::get_currency_config(),
            'fittingStations'   => self::get_fitting_stations(),
        ];

        return $config;
    }

    private static function detect_template(): string {
        if (is_front_page()) return 'home';
        if (function_exists('is_shop') && is_shop()) return 'store';
        if (function_exists('is_product') && is_product()) return 'product';
        if (function_exists('is_checkout') && is_checkout()) return 'checkout';
        if (function_exists('is_cart') && is_cart()) return 'checkout';
        return 'page';
    }

    private static function get_current_product(): array {
        if (!function_exists('is_product') || !is_product()) {
            return [];
        }

        global $product;
        if (!$product instanceof WC_Product) {
            $product = wc_get_product(get_the_ID());
        }

        if (!$product) {
            return [];
        }

        return [
            'id'        => $product->get_id(),
            'slug'      => $product->get_slug(),
            'permalink' => get_permalink($product->get_id()),
        ];
    }

    private static function get_currency_config(): array {
        if (!function_exists('get_woocommerce_currency')) {
            return [
                'currencyCode'      => 'NZD',
                'currencySymbol'    => '$',
                'currencyMinorUnit' => 2,
                'currencyPrefix'    => '$',
                'currencySuffix'    => '',
            ];
        }

        return [
            'currencyCode'      => get_woocommerce_currency(),
            'currencySymbol'    => get_woocommerce_currency_symbol(),
            'currencyMinorUnit' => wc_get_price_decimals(),
            'currencyPrefix'    => get_option('woocommerce_currency_pos') === 'left' ? get_woocommerce_currency_symbol() : '',
            'currencySuffix'    => get_option('woocommerce_currency_pos') === 'right' ? get_woocommerce_currency_symbol() : '',
        ];
    }

    private static function get_fitting_stations(): array {
        // Hardcoded initially — can be moved to WP options later
        return [
            ['value' => 'auckland-central', 'label' => 'Tyre Plus - Auckland Central', 'city' => 'Auckland', 'postcode' => '1010'],
            ['value' => 'auckland-east', 'label' => 'Fast Fit - East Auckland', 'city' => 'Auckland', 'postcode' => '2013'],
            ['value' => 'wellington', 'label' => 'Capital Tyres - Wellington CBD', 'city' => 'Wellington', 'postcode' => '6011'],
            ['value' => 'christchurch', 'label' => 'South Island Tyres - Christchurch', 'city' => 'Christchurch', 'postcode' => '8011'],
            ['value' => 'hamilton', 'label' => 'Waikato Wheel Works - Hamilton', 'city' => 'Hamilton', 'postcode' => '3204'],
        ];
    }
}
```

---

## Task 5: WooCommerce Integration (PHP Backend)

**Files:**
- Create: `nonomags-theme/includes/class-woo-integration.php`
- Create: `nonomags-theme/includes/class-rest-api.php`

- [ ] **Step 1: Create `includes/class-woo-integration.php`**

This class transforms WooCommerce products into the `StorefrontProduct` format.

```php
<?php
defined('ABSPATH') || exit;

class NonoMags_Woo_Integration {

    public static function init() {
        // Hooks can be added here later (e.g. custom product meta boxes)
    }

    /**
     * Transform a WC_Product into the StorefrontProduct shape.
     */
    public static function transform_product(WC_Product $product): array {
        $image_id  = $product->get_image_id();
        $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'large') : '';

        $gallery_ids = $product->get_gallery_image_ids();
        $images      = $image_url ? [$image_url] : [];
        foreach ($gallery_ids as $gid) {
            $url = wp_get_attachment_image_url($gid, 'large');
            if ($url) $images[] = $url;
        }

        $categories   = wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'names']);
        $brand        = self::get_attribute_value($product, 'brand') ?: self::get_taxonomy_value($product, 'pa_brand');
        $size         = self::get_attribute_value($product, 'size');
        $width        = self::get_attribute_value($product, 'width');
        $badge        = get_post_meta($product->get_id(), '_nonomags_badge', true);
        $badge_color  = get_post_meta($product->get_id(), '_nonomags_badge_color', true);
        $rating       = (float) $product->get_average_rating();
        $review_count = (int) $product->get_review_count();

        $regular_price = (float) $product->get_regular_price();
        $sale_price    = $product->get_sale_price();
        $active_price  = (float) $product->get_price();

        return [
            'id'            => $product->get_id(),
            'slug'          => $product->get_slug(),
            'permalink'     => get_permalink($product->get_id()),
            'brand'         => $brand ?: '',
            'name'          => $product->get_name(),
            'category'      => !empty($categories) ? $categories[0] : '',
            'categories'    => is_array($categories) ? $categories : [],
            'size'          => $size ?: '',
            'width'         => $width ?: '',
            'price'         => $active_price,
            'originalPrice' => ($sale_price !== '' && $sale_price !== null) ? $regular_price : null,
            'rating'        => $rating,
            'reviews'       => $review_count,
            'badge'         => $badge ?: null,
            'badgeColor'    => $badge_color ?: 'bg-[#FF5C00]',
            'inStock'       => $product->is_in_stock(),
            'image'         => $image_url ?: '',
            'images'        => $images,
            'isNew'         => (time() - strtotime($product->get_date_created())) < (30 * DAY_IN_SECONDS),
            'summary'       => $product->get_short_description(),
            'description'   => $product->get_description(),
            'specs'         => self::get_visible_specs($product),
            'hasOptions'    => $product->is_type('variable'),
            'purchasable'   => $product->is_purchasable() && $product->is_in_stock(),
        ];
    }

    /**
     * Get all visible product attributes as spec key-value pairs.
     */
    private static function get_visible_specs(WC_Product $product): array {
        $specs      = [];
        $attributes = $product->get_attributes();

        foreach ($attributes as $attribute) {
            if (!$attribute->get_visible()) continue;

            $label = wc_attribute_label($attribute->get_name(), $product);
            $value = $attribute->is_taxonomy()
                ? implode(', ', wc_get_product_terms($product->get_id(), $attribute->get_name(), ['fields' => 'names']))
                : implode(', ', $attribute->get_options());

            if ($value) {
                $specs[] = ['label' => $label, 'value' => $value];
            }
        }

        return $specs;
    }

    private static function get_attribute_value(WC_Product $product, string $name): string {
        $attributes = $product->get_attributes();
        foreach ($attributes as $attribute) {
            $attr_name = strtolower(is_object($attribute) ? $attribute->get_name() : '');
            if ($attr_name === strtolower($name) || $attr_name === 'pa_' . strtolower($name)) {
                if ($attribute->is_taxonomy()) {
                    $terms = wc_get_product_terms($product->get_id(), $attribute->get_name(), ['fields' => 'names']);
                    return implode(', ', $terms);
                }
                return implode(', ', $attribute->get_options());
            }
        }
        return '';
    }

    private static function get_taxonomy_value(WC_Product $product, string $taxonomy): string {
        $terms = wp_get_post_terms($product->get_id(), $taxonomy, ['fields' => 'names']);
        if (is_wp_error($terms)) return '';
        return implode(', ', $terms);
    }

    /**
     * Get product reviews in the StorefrontReview format.
     */
    public static function get_product_reviews(int $product_id, int $limit = 10): array {
        $comments = get_comments([
            'post_id' => $product_id,
            'type'    => 'review',
            'status'  => 'approve',
            'number'  => $limit,
            'orderby' => 'comment_date_gmt',
            'order'   => 'DESC',
        ]);

        $reviews = [];
        foreach ($comments as $comment) {
            $reviews[] = [
                'id'       => (int) $comment->comment_ID,
                'name'     => $comment->comment_author,
                'location' => get_comment_meta($comment->comment_ID, 'location', true) ?: 'New Zealand',
                'rating'   => (int) get_comment_meta($comment->comment_ID, 'rating', true),
                'date'     => $comment->comment_date,
                'text'     => $comment->comment_content,
            ];
        }

        return $reviews;
    }

    /**
     * Collect unique filter values from a list of transformed products.
     */
    public static function extract_filters(array $products): array {
        $categories = [];
        $brands     = [];
        $widths     = [];
        $max_price  = 0;

        foreach ($products as $p) {
            foreach ($p['categories'] as $cat) {
                $categories[$cat] = true;
            }
            if ($p['brand']) $brands[$p['brand']] = true;
            if ($p['width']) $widths[$p['width']] = true;
            if ($p['price'] > $max_price) $max_price = $p['price'];
        }

        return [
            'categories' => array_keys($categories),
            'brands'     => array_keys($brands),
            'widths'     => array_keys($widths),
            'maxPrice'   => $max_price,
        ];
    }
}
```

- [ ] **Step 2: Create `includes/class-rest-api.php`**

```php
<?php
defined('ABSPATH') || exit;

class NonoMags_Rest_Api {

    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
    }

    public static function register_routes() {
        $namespace = 'nonomags/v1';

        register_rest_route($namespace, '/products', [
            'methods'             => 'GET',
            'callback'            => [__CLASS__, 'get_products'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route($namespace, '/products/(?P<ref>[\\w-]+)', [
            'methods'             => 'GET',
            'callback'            => [__CLASS__, 'get_product'],
            'permission_callback' => '__return_true',
            'args'                => [
                'ref' => [
                    'required'          => true,
                    'validate_callback' => function ($value) {
                        return is_string($value) && strlen($value) > 0;
                    },
                ],
            ],
        ]);

        register_rest_route($namespace, '/payment-methods', [
            'methods'             => 'GET',
            'callback'            => [__CLASS__, 'get_payment_methods'],
            'permission_callback' => '__return_true',
        ]);
    }

    public static function get_products(WP_REST_Request $request): WP_REST_Response {
        if (!class_exists('WooCommerce')) {
            return new WP_REST_Response(['items' => [], 'filters' => ['categories' => [], 'brands' => [], 'widths' => [], 'maxPrice' => 0]], 200);
        }

        $args = [
            'status'  => 'publish',
            'limit'   => 100,
            'orderby' => 'date',
            'order'   => 'DESC',
        ];

        $wc_products = wc_get_products($args);
        $items = [];

        foreach ($wc_products as $wc_product) {
            $items[] = NonoMags_Woo_Integration::transform_product($wc_product);
        }

        $filters = NonoMags_Woo_Integration::extract_filters($items);

        return new WP_REST_Response(['items' => $items, 'filters' => $filters], 200);
    }

    public static function get_product(WP_REST_Request $request): WP_REST_Response {
        if (!class_exists('WooCommerce')) {
            return new WP_REST_Response(['code' => 'not_found', 'message' => 'Product not found.'], 404);
        }

        $ref = $request->get_param('ref');

        // Try by slug first, then by ID
        $product = null;
        if (!is_numeric($ref)) {
            $post = get_page_by_path($ref, OBJECT, 'product');
            if ($post) {
                $product = wc_get_product($post->ID);
            }
        } else {
            $product = wc_get_product((int) $ref);
        }

        if (!$product || !$product->is_visible()) {
            return new WP_REST_Response(['code' => 'not_found', 'message' => 'Product not found.'], 404);
        }

        $transformed = NonoMags_Woo_Integration::transform_product($product);

        // Related products
        $related_ids = wc_get_related_products($product->get_id(), 4);
        $related     = [];
        foreach ($related_ids as $rid) {
            $rp = wc_get_product($rid);
            if ($rp && $rp->is_visible()) {
                $related[] = NonoMags_Woo_Integration::transform_product($rp);
            }
        }

        // Reviews
        $reviews = NonoMags_Woo_Integration::get_product_reviews($product->get_id());

        return new WP_REST_Response([
            'product' => $transformed,
            'related' => $related,
            'reviews' => $reviews,
        ], 200);
    }

    public static function get_payment_methods(WP_REST_Request $request): WP_REST_Response {
        if (!class_exists('WooCommerce')) {
            return new WP_REST_Response(['methods' => []], 200);
        }

        $gateways = WC()->payment_gateways()->get_available_payment_gateways();
        $methods  = [];

        foreach ($gateways as $gateway) {
            $methods[] = [
                'id'                     => $gateway->id,
                'title'                  => $gateway->get_title(),
                'description'            => $gateway->get_description(),
                'orderButtonText'        => $gateway->order_button_text ?: 'Place Order',
                'requiresNativeCheckout' => in_array($gateway->id, ['stripe', 'ppcp-gateway', 'afterpay'], true),
                'supports'               => $gateway->supports ?? [],
            ];
        }

        return new WP_REST_Response(['methods' => $methods], 200);
    }
}
```

---

## Task 6: Header Template (PHP)

**Files:**
- Create: `nonomags-theme/header.php`
- Create: `nonomags-theme/assets/images/` (copy logo)

- [ ] **Step 1: Copy logo image**

Copy `Redesign landing page/src/assets/816c6100956f5aac7a092fa4154e0f1777af18d0.png` to `nonomags-theme/assets/images/logo.png`.

- [ ] **Step 2: Create `header.php`**

This reproduces the exact HTML from React `Header` component (App.tsx lines 70–269), converting `onClick` navigation to `<a href>` links, and replacing Lucide React components with inline SVGs.

```php
<?php defined('ABSPATH') || exit; ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class('min-h-screen bg-white font-sans text-[#1F2937]'); ?>>
<?php wp_body_open(); ?>

<?php
$home_url     = esc_url(home_url('/'));
$shop_url     = function_exists('wc_get_page_permalink') ? esc_url(wc_get_page_permalink('shop')) : $home_url;
$checkout_url = function_exists('wc_get_checkout_url') ? esc_url(wc_get_checkout_url()) : $home_url;
$logo_url     = esc_url(NONOMAGS_URI . '/assets/images/logo.png');
?>

<header class="w-full bg-white shadow-sm sticky top-0 z-40">
    <!-- Top Bar -->
    <div class="w-full bg-[#132043] text-white py-2 text-xs font-medium" role="banner">
        <div class="max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10 flex justify-between items-center">
            <div class="flex items-center gap-4">
                <span class="flex items-center gap-1 text-[#FF5C00] font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    Flash Sale: Up to 30% Off Selected Tyres
                </span>
                <span class="hidden sm:inline-block opacity-40" aria-hidden="true">|</span>
                <span class="hidden sm:flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#FF5C00]" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    100% Fitment Guarantee
                </span>
            </div>
            <div class="hidden md:flex items-center gap-6">
                <a href="tel:08006666624" class="flex items-center gap-1 hover:text-[#FF5C00] transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-[#FF5C00] rounded px-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    0800 NO NO MAGS
                </a>
            </div>
        </div>
    </div>

    <!-- Main Nav -->
    <div class="max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10 py-4 flex items-center justify-between">
        <div class="flex items-center gap-8">
            <a href="<?php echo $home_url; ?>" class="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#FF5C00] rounded" aria-label="Home">
                <img src="<?php echo $logo_url; ?>" alt="Nono Mags N Tyres Logo" class="h-10 object-contain">
            </a>

            <nav class="hidden lg:flex items-center gap-8 font-semibold text-[#1F2937]" aria-label="Main Navigation">
                <a href="<?php echo $shop_url; ?>" class="hover:text-[#FF5C00] transition-colors border-b-2 border-transparent hover:border-[#FF5C00] py-1">Shop Tyres</a>
                <a href="<?php echo $home_url; ?>" class="hover:text-[#FF5C00] transition-colors border-b-2 border-transparent hover:border-[#FF5C00] py-1">Mags &amp; Wheels</a>
                <a href="<?php echo $home_url; ?>" class="hover:text-[#FF5C00] transition-colors border-b-2 border-transparent hover:border-[#FF5C00] py-1">Combos</a>
                <a href="<?php echo $shop_url; ?>" class="text-[#FF5C00] hover:text-[#E05200] transition-colors flex items-center gap-1 py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42l-8.704-8.704z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                    Sale
                </a>
            </nav>
        </div>

        <div class="flex items-center gap-4">
            <?php if (function_exists('wc_get_page_permalink')) : ?>
            <a href="<?php echo esc_url(wc_get_page_permalink('myaccount')); ?>" class="hidden md:flex p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00]" aria-label="User Account">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </a>
            <?php endif; ?>

            <!-- Cart button: PHP fallback, React enhances -->
            <div id="nonomags-cart-button">
                <a href="<?php echo $checkout_url; ?>" class="flex items-center gap-2 bg-[#FF5C00] hover:bg-[#E05200] text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00]" aria-label="Shopping Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    <span>Cart</span>
                </a>
            </div>

            <!-- Mobile menu trigger -->
            <button
                onclick="document.dispatchEvent(new CustomEvent('nonomags:open-mobile-menu'))"
                class="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00]"
                aria-label="Open Menu"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
        </div>
    </div>
</header>

<!-- Mobile menu React island mount point -->
<div id="nonomags-mobile-menu"></div>
```

---

## Task 7: Footer Template (PHP)

**Files:**
- Create: `nonomags-theme/footer.php`

- [ ] **Step 1: Create `footer.php`**

This reproduces the React `Footer` component (App.tsx lines 937–1028), plus the countdown timer vanilla JS snippet.

```php
<?php
defined('ABSPATH') || exit;

$home_url     = esc_url(home_url('/'));
$shop_url     = function_exists('wc_get_page_permalink') ? esc_url(wc_get_page_permalink('shop')) : $home_url;
$checkout_url = function_exists('wc_get_checkout_url') ? esc_url(wc_get_checkout_url()) : $home_url;
$account_url  = function_exists('wc_get_page_permalink') ? esc_url(wc_get_page_permalink('myaccount')) : '';
$privacy_url  = esc_url(get_privacy_policy_url());
$terms_url    = function_exists('wc_get_page_permalink') ? esc_url(wc_get_page_permalink('terms')) : '';
$logo_url     = esc_url(NONOMAGS_URI . '/assets/images/logo.png');
$container    = 'max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10';
?>

<footer class="bg-[#0B132C] text-slate-300 py-24" role="contentinfo">
    <div class="<?php echo $container; ?> grid grid-cols-1 md:grid-cols-4 gap-12">
        <!-- Brand column -->
        <div class="space-y-6 md:col-span-1">
            <a href="<?php echo $home_url; ?>" class="inline-block focus:outline-none focus:ring-2 focus:ring-[#FF5C00] rounded">
                <img src="<?php echo $logo_url; ?>" alt="Nono Mags N Tyres Logo" class="h-10 object-contain bg-white p-2 rounded">
            </a>
            <p class="text-sm text-slate-400 leading-relaxed">
                New Zealand's premium destination for tyres, mags, and wheel packages. Guaranteed fitment and local professional installation.
            </p>
            <div class="flex gap-2 items-center">
                <div class="flex text-[#FF5C00]">
                    <?php for ($i = 0; $i < 5; $i++) : ?>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <?php endfor; ?>
                </div>
                <span class="text-sm font-bold text-white">4.9/5 Rating</span>
            </div>
        </div>

        <!-- Shop Parts -->
        <div>
            <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-sm">Shop Parts</h4>
            <ul class="space-y-4 text-sm">
                <li><a href="<?php echo $shop_url; ?>" class="hover:text-[#FF5C00] transition-colors py-1 inline-block">Search Tyres by Vehicle</a></li>
                <li><a href="<?php echo $shop_url; ?>" class="hover:text-[#FF5C00] transition-colors py-1 inline-block">Search Mags by Size</a></li>
                <li><a href="<?php echo $shop_url; ?>" class="hover:text-[#FF5C00] transition-colors py-1 inline-block">Complete Wheel Combos</a></li>
                <li><a href="<?php echo $home_url; ?>#promotions" class="text-[#FF5C00] font-bold hover:text-white transition-colors py-1 inline-block">Current Promotions</a></li>
            </ul>
        </div>

        <!-- Customer Care -->
        <div>
            <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-sm">Customer Care</h4>
            <ul class="space-y-4 text-sm">
                <li><a href="<?php echo $account_url ?: $checkout_url; ?>" class="hover:text-[#FF5C00] transition-colors py-1 inline-block">Track My Order</a></li>
                <li><a href="<?php echo $home_url; ?>#about" class="hover:text-[#FF5C00] transition-colors py-1 inline-block">Find a Fitting Station</a></li>
                <li><a href="<?php echo $home_url; ?>#trust" class="hover:text-[#FF5C00] transition-colors py-1 inline-block">Fitment Guarantee</a></li>
                <li><a href="<?php echo $home_url; ?>#promotions" class="hover:text-[#FF5C00] transition-colors py-1 inline-block">Returns &amp; Refunds</a></li>
            </ul>
        </div>

        <!-- Need Help -->
        <div>
            <h4 class="text-white font-bold mb-6 uppercase tracking-wider text-sm">Need Help?</h4>
            <div class="space-y-4">
                <a href="tel:08006666624" class="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00]">
                    <div class="bg-[#FF5C00] p-3 rounded-lg text-white" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                        <p class="text-xs text-slate-400 mb-1 font-medium">Call our Kiwi experts</p>
                        <p class="text-white font-bold">0800 NO NO MAGS</p>
                    </div>
                </a>
                <p class="text-xs text-slate-500 mt-4 leading-relaxed">
                    Available Mon-Fri, 8am - 5:30pm NZT.
                </p>
            </div>
        </div>
    </div>

    <!-- Bottom bar -->
    <div class="<?php echo $container; ?> mt-16 pt-8 border-t border-white/10 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; <?php echo date('Y'); ?> Nono Mags N Tyres. All rights reserved.</p>
        <div class="flex gap-6">
            <?php if ($privacy_url) : ?>
                <a href="<?php echo $privacy_url; ?>" class="hover:text-white transition-colors">Privacy Policy</a>
            <?php endif; ?>
            <?php if ($terms_url) : ?>
                <a href="<?php echo $terms_url; ?>" class="hover:text-white transition-colors">Terms of Service</a>
            <?php endif; ?>
        </div>
    </div>
</footer>

<!-- Countdown timer vanilla JS (used by promo-section.php) -->
<script>
(function() {
    var el = document.getElementById('nonomags-countdown');
    if (!el) return;
    var end = parseInt(el.dataset.end, 10) * 1000;
    function tick() {
        var diff = Math.max(0, Math.floor((end - Date.now()) / 1000));
        var h = String(Math.floor(diff / 3600)).padStart(2, '0');
        var m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        var s = String(diff % 60).padStart(2, '0');
        el.innerHTML =
            '<div class="flex flex-col items-center"><span class="text-2xl font-extrabold text-white tabular-nums leading-none">' + h + '</span><span class="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">hrs</span></div>' +
            '<span class="text-[#FF5C00] font-extrabold text-xl leading-none mb-1">:</span>' +
            '<div class="flex flex-col items-center"><span class="text-2xl font-extrabold text-white tabular-nums leading-none">' + m + '</span><span class="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">min</span></div>' +
            '<span class="text-[#FF5C00] font-extrabold text-xl leading-none mb-1">:</span>' +
            '<div class="flex flex-col items-center"><span class="text-2xl font-extrabold text-white tabular-nums leading-none">' + s + '</span><span class="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">sec</span></div>';
        if (diff > 0) requestAnimationFrame(function() { setTimeout(tick, 1000); });
    }
    tick();
})();
</script>

<?php wp_footer(); ?>
</body>
</html>
```

---

## Task 8: Homepage Template Parts (PHP)

**Files:**
- Create: `nonomags-theme/front-page.php`
- Create: `nonomags-theme/template-parts/hero.php`
- Create: `nonomags-theme/template-parts/trust-bar.php`
- Create: `nonomags-theme/template-parts/promo-section.php`
- Create: `nonomags-theme/template-parts/featured-products.php`
- Create: `nonomags-theme/template-parts/about-section.php`
- Create: `nonomags-theme/template-parts/category-section.php`

- [ ] **Step 1: Create `front-page.php`**

```php
<?php
/**
 * Homepage template — assembles all sections.
 */
get_header();
?>
<main>
    <?php get_template_part('template-parts/hero'); ?>
    <?php get_template_part('template-parts/trust-bar'); ?>
    <?php get_template_part('template-parts/promo-section'); ?>
    <?php get_template_part('template-parts/featured-products'); ?>
    <?php get_template_part('template-parts/about-section'); ?>
    <?php get_template_part('template-parts/category-section'); ?>
</main>
<?php
get_footer();
```

- [ ] **Step 2: Create `template-parts/hero.php`**

Reproduces App.tsx lines 1137–1167 (the hero section inside `<main>` on the homepage).

```php
<?php
defined('ABSPATH') || exit;
$shop_url  = function_exists('wc_get_page_permalink') ? esc_url(wc_get_page_permalink('shop')) : esc_url(home_url('/'));
$container = 'max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10';
$hero_bg   = 'https://images.unsplash.com/photo-1762316817062-53ef18353891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbW9kZXJuJTIwc3BvcnRzJTIwY2FyJTIwZHJpdmluZ3xlbnwxfHx8fDE3NzQzNjI2NDd8MA&ixlib=rb-4.1.0&q=80&w=2000';
?>
<section class="relative min-h-[640px] flex items-center pt-8 pb-24">
    <!-- Background -->
    <div class="absolute inset-0 z-0 bg-[#0B132C]">
        <img src="<?php echo esc_url($hero_bg); ?>" alt="" aria-hidden="true" class="w-full h-full object-cover opacity-60 mix-blend-luminosity">
        <div class="absolute inset-0 bg-gradient-to-r from-[#132043]/95 via-[#132043]/80 to-transparent"></div>
    </div>

    <div class="relative z-10 w-full <?php echo $container; ?> grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-[40px] py-[0px]">
        <!-- Hero Copy -->
        <div class="text-white space-y-8">
            <div class="inline-flex items-center gap-2 bg-[rgba(255,92,0,0.2)] text-[#FF5C00] px-4 py-2 rounded-full font-bold text-sm border border-[rgba(255,92,0,0.3)] backdrop-blur-sm shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Rated #1 Tyre Network in NZ
            </div>
            <h1 class="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mx-[0px] mt-[0px] mb-[16px]">
                Get the Right Tyres. <span class="text-[#FF5C00]">Guaranteed.</span>
            </h1>
            <p class="text-lg md:text-xl text-slate-200 max-w-lg leading-relaxed font-medium">
                Enter your rego and we'll show you the exact tyres for your car. Shipped directly to your local fitter or right to your door.
            </p>
            <div class="flex items-center gap-6 text-sm font-semibold">
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Free Shipping
                </div>
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    200+ Fitters
                </div>
            </div>
        </div>

        <!-- Search widget mount point -->
        <div id="nonomags-search-widget">
            <noscript>
                <a href="<?php echo $shop_url; ?>" class="inline-block bg-[#FF5C00] hover:bg-[#E05200] text-white font-bold text-lg px-8 py-4 rounded-lg shadow-md">
                    Browse All Tyres &rarr;
                </a>
            </noscript>
        </div>
    </div>
</section>
```

- [ ] **Step 3: Create `template-parts/trust-bar.php`**

Reproduces App.tsx `TrustBar` component (lines 393–420).

```php
<?php
defined('ABSPATH') || exit;
$container = 'max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10';

$items = [
    [
        'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#FF5C00]" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
        'title' => '100% Fitment Guarantee',
        'desc'  => "If it doesn't fit, we replace it free.",
    ],
    [
        'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#FF5C00]" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
        'title' => '200+ Fitting Stations',
        'desc'  => 'Local mechanics ready to install.',
    ],
    [
        'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#FF5C00]" aria-hidden="true"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
        'title' => 'Fast NZ Delivery',
        'desc'  => 'Shipped directly to your fitter.',
    ],
];
?>
<section id="trust" class="bg-[#132043] w-full py-12 text-white relative z-10 -mt-8 shadow-xl border-t-4 border-[#FF5C00]">
    <div class="<?php echo $container; ?> grid grid-cols-1 md:grid-cols-3 gap-8">
        <?php foreach ($items as $item) : ?>
        <div class="flex items-start gap-4">
            <div class="flex-shrink-0 bg-white/10 p-4 rounded-xl">
                <?php echo $item['icon']; ?>
            </div>
            <div>
                <h4 class="font-bold text-lg mb-1.5"><?php echo esc_html($item['title']); ?></h4>
                <p class="text-sm text-slate-300 leading-relaxed"><?php echo esc_html($item['desc']); ?></p>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>
```

- [ ] **Step 4: Create `template-parts/promo-section.php`**

Reproduces App.tsx `PromoSection` (lines 586–815). Uses the same image URLs, badge colors, and grid layout. The countdown timer placeholder uses `data-end` for the vanilla JS in footer.php.

```php
<?php
defined('ABSPATH') || exit;
$container = 'max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10';
$shop_url  = function_exists('wc_get_page_permalink') ? esc_url(wc_get_page_permalink('shop')) : esc_url(home_url('/'));

// Midnight tonight as unix timestamp
$midnight = mktime(23, 59, 59, (int) date('n'), (int) date('j'), (int) date('Y'));

$hero_promo = [
    'eyebrow' => 'Flash Sale - This Week Only',
    'name'    => "Up to 30% Off\nSelected Tyres",
    'detail'  => 'Michelin, Bridgestone, and Goodyear prices slashed for NZ drivers.',
    'saving'  => 'Save up to $93 per tyre',
    'image'   => 'https://images.unsplash.com/photo-1675034743126-0f250a5fee51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB0eXJlJTIwc2FsZSUyMGRpc2NvdW50JTIwc2hvcHxlbnwxfHx8fDE3NzQzNjQzMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'cta'     => 'Shop the Sale',
    'badge'   => 'Flash Sale',
    'badgeBg' => 'bg-[#FF5C00]',
];

$tiles = [
    ['eyebrow' => 'Best Value', 'name' => 'Mags + Tyres Combo', 'detail' => 'Fitted from $899 - all sizes.', 'saving' => 'Save $150 vs. separate', 'image' => 'https://images.unsplash.com/photo-1761756580701-e7ecb9baea13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGxveSUyMHdoZWVsJTIwdXBncmFkZSUyMHNwb3J0JTIwY2FyfGVufDF8fHx8MTc3NDM2NDMxMHww&ixlib=rb-4.1.0&q=80&w=1080', 'cta' => 'View Combos', 'badge' => 'Bundle Deal', 'badgeBg' => 'bg-white/20'],
    ['eyebrow' => 'Winter Ready', 'name' => 'All-Weather Kits', 'detail' => 'Built for NZ conditions.', 'saving' => 'From $179 per tyre', 'image' => 'https://images.unsplash.com/photo-1769475394584-b530afdca19d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBzbm93JTIwdHlyZSUyMHNlYXNvbnxlbnwxfHx8fDE3NzQzNjQzMTF8MA&ixlib=rb-4.1.0&q=80&w=1080', 'cta' => 'Shop Winter Kits', 'badge' => 'Seasonal', 'badgeBg' => 'bg-sky-500/80'],
    ['eyebrow' => 'Nationwide', 'name' => 'Free Fitting on $500+', 'detail' => '200+ certified fitters.', 'saving' => 'Worth up to $80', 'image' => 'https://images.unsplash.com/photo-1619505372149-07875c35b313?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBtZWNoYW5pYyUyMHR5cmUlMjBmaXR0aW5nJTIwZ2FyYWdlfGVufDF8fHx8MTc3NDM2NDMxMXww&ixlib=rb-4.1.0&q=80&w=1080', 'cta' => 'Find a Fitter', 'badge' => 'Free Service', 'badgeBg' => 'bg-green-600/80'],
    ['eyebrow' => 'Exclusive', 'name' => 'Pirelli P Zero + Alloys', 'detail' => 'Complete wheel package.', 'saving' => 'Save $200', 'image' => 'https://images.unsplash.com/photo-1672626923182-4cacabdafb76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0eXJlJTIwY29tYm8lMjBwYWNrYWdlJTIwZGVhbCUyMGJ1bmRsZSUyMGNhcnxlbnwxfHx8fDE3NzQzNjQ3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080', 'cta' => 'Shop Combo', 'badge' => 'Combo Offer', 'badgeBg' => 'bg-[#FF5C00]/80'],
];
?>
<section id="promotions" class="bg-[#0B132C] py-16" aria-labelledby="promo-heading">
    <div class="<?php echo $container; ?>">
        <!-- Section header + countdown -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
                <div class="flex items-center gap-2 text-[#FF5C00] font-bold uppercase tracking-widest text-xs mb-3">
                    <span class="block w-8 h-0.5 bg-[#FF5C00]" aria-hidden="true"></span>
                    Exclusive Offers
                </div>
                <h2 id="promo-heading" class="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                    Current Promotions
                </h2>
            </div>

            <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 self-start sm:self-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#FF5C00] flex-shrink-0" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wide">Ends in</span>
                <div id="nonomags-countdown" class="flex items-center gap-3" data-end="<?php echo $midnight; ?>">
                    <!-- JS populates this -->
                </div>
            </div>
        </div>

        <!-- Promo grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            <!-- Hero promo card -->
            <article class="group relative rounded-3xl overflow-hidden lg:row-span-2 min-h-[340px] lg:min-h-0 focus-within:ring-2 focus-within:ring-[#FF5C00]" aria-label="<?php echo esc_attr(str_replace("\n", ' ', $hero_promo['name'])); ?>">
                <img src="<?php echo esc_url($hero_promo['image']); ?>" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" aria-hidden="true">
                <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), rgba(0,0,0,0.1))" aria-hidden="true"></div>
                <div class="absolute top-0 inset-x-0 h-1 bg-[#FF5C00]" aria-hidden="true"></div>

                <div class="relative h-full flex flex-col justify-between p-7 lg:p-8 min-h-[340px] lg:min-h-[520px]">
                    <div>
                        <span class="inline-block <?php echo esc_attr($hero_promo['badgeBg']); ?> text-white text-xs font-extrabold px-3 py-1.5 rounded-full backdrop-blur-sm mb-4 shadow"><?php echo esc_html($hero_promo['badge']); ?></span>
                        <p class="text-[#FF5C00] text-xs font-bold uppercase tracking-widest mb-2"><?php echo esc_html($hero_promo['eyebrow']); ?></p>
                        <h3 class="text-4xl lg:text-5xl font-extrabold text-white leading-tight whitespace-pre-line mb-4">
                            <a href="<?php echo $shop_url; ?>" class="outline-none before:absolute before:inset-0"><?php echo nl2br(esc_html($hero_promo['name'])); ?></a>
                        </h3>
                        <p class="text-slate-300 text-sm leading-relaxed max-w-xs"><?php echo esc_html($hero_promo['detail']); ?></p>
                    </div>
                    <div>
                        <div class="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <?php echo esc_html($hero_promo['saving']); ?>
                        </div>
                        <a href="<?php echo $shop_url; ?>" class="flex items-center gap-2 bg-[#FF5C00] hover:bg-[#E05200] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-lg hover:shadow-[#FF5C00]/30 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00] relative z-10 w-max">
                            <?php echo esc_html($hero_promo['cta']); ?>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>
            </article>

            <!-- Tile cards -->
            <?php foreach ($tiles as $promo) : ?>
            <article class="group relative rounded-3xl overflow-hidden min-h-[200px] focus-within:ring-2 focus-within:ring-[#FF5C00]">
                <img src="<?php echo esc_url($promo['image']); ?>" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" aria-hidden="true">
                <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3), transparent)" aria-hidden="true"></div>

                <div class="relative h-full flex flex-col justify-between p-5 min-h-[200px] md:min-h-[240px]">
                    <div>
                        <span class="inline-block <?php echo esc_attr($promo['badgeBg']); ?> text-white text-xs font-extrabold px-2.5 py-1 rounded-full backdrop-blur-sm"><?php echo esc_html($promo['badge']); ?></span>
                    </div>
                    <div>
                        <p class="text-[#FF5C00] text-xs font-bold uppercase tracking-widest mb-1"><?php echo esc_html($promo['eyebrow']); ?></p>
                        <h3 class="font-extrabold text-white text-xl leading-snug mb-1">
                            <a href="<?php echo $shop_url; ?>" class="outline-none before:absolute before:inset-0"><?php echo esc_html($promo['name']); ?></a>
                        </h3>
                        <p class="text-slate-300 text-xs mb-3"><?php echo esc_html($promo['detail']); ?></p>
                        <div class="flex items-center justify-between gap-2">
                            <span class="inline-flex items-center gap-1 text-xs font-bold text-green-300 bg-green-500/15 border border-green-500/30 px-2.5 py-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <?php echo esc_html($promo['saving']); ?>
                            </span>
                            <a href="<?php echo $shop_url; ?>" class="flex items-center gap-1 text-white font-bold text-xs bg-white/10 hover:bg-[#FF5C00] border border-white/20 hover:border-[#FF5C00] px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00] relative z-10">
                                <?php echo esc_html($promo['cta']); ?>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>

        <!-- Bottom CTA strip -->
        <div class="mt-6 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p class="text-slate-300 text-sm font-medium">
                <span class="text-white font-bold">50,000+ Kiwi drivers</span> have already saved with Nono Mags this year.
            </p>
            <a href="<?php echo $shop_url; ?>" class="flex items-center gap-2 text-[#FF5C00] font-bold text-sm hover:text-white transition-colors">
                View All Promotions
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </a>
        </div>
    </div>
</section>
```

- [ ] **Step 5: Create `template-parts/featured-products.php`**

Queries WooCommerce for featured products and renders the same product card grid as App.tsx `FeaturedProducts` (lines 422–584). Falls back to hardcoded products if WooCommerce is not active.

```php
<?php
defined('ABSPATH') || exit;
$container = 'max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10';
$shop_url  = function_exists('wc_get_page_permalink') ? esc_url(wc_get_page_permalink('shop')) : esc_url(home_url('/'));

// Query featured products from WooCommerce
$products = [];
if (class_exists('WooCommerce')) {
    $wc_products = wc_get_products([
        'status'   => 'publish',
        'limit'    => 5,
        'featured' => true,
        'orderby'  => 'popularity',
        'order'    => 'DESC',
    ]);
    // If not enough featured, fill with recent
    if (count($wc_products) < 5) {
        $wc_products = wc_get_products([
            'status'  => 'publish',
            'limit'   => 5,
            'orderby' => 'date',
            'order'   => 'DESC',
        ]);
    }
    foreach ($wc_products as $wc_product) {
        $products[] = NonoMags_Woo_Integration::transform_product($wc_product);
    }
}

// Fallback hardcoded products (matches React app's static data)
if (empty($products)) {
    $products = [
        ['name' => 'Michelin Pilot Sport 4', 'brand' => 'Michelin', 'size' => '225/45 R17', 'image' => 'https://images.unsplash.com/photo-1760836395760-552678e43a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2VzdG9uZSUyMGNhciUyMHR5cmUlMjBzdHVkaW8lMjBwcm9kdWN0fGVufDF8fHx8MTc3NDM2NDUwMHww&ixlib=rb-4.1.0&q=80&w=1080', 'price' => 249.00, 'originalPrice' => 310.00, 'rating' => 4.9, 'reviews' => 128, 'badge' => 'Best Seller', 'permalink' => $shop_url],
        ['name' => 'Goodyear Eagle F1', 'brand' => 'Goodyear', 'size' => '245/40 R18', 'image' => 'https://images.unsplash.com/photo-1765220625875-3083a2b387c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB0eXJlJTIwdHJlYWQlMjBjbG9zZSUyMHVwJTIwcnViYmVyfGVufDF8fHx8MTc3NDM2NDUwNHww&ixlib=rb-4.1.0&q=80&w=1080', 'price' => 199.00, 'originalPrice' => 255.00, 'rating' => 4.7, 'reviews' => 84, 'badge' => 'Save 22%', 'permalink' => $shop_url],
        ['name' => 'Rotiform KPS Matte Black', 'brand' => 'Rotiform', 'size' => '18x8.5 5x112', 'image' => 'https://images.unsplash.com/photo-1668639381936-fdca2dea792f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGxveSUyMHJpbSUyMHdoZWVsJTIwc2lsdmVyJTIwaXNvbGF0ZWQlMjBwcm9kdWN0fGVufDF8fHx8MTc3NDM2NDUwMHww&ixlib=rb-4.1.0&q=80&w=1080', 'price' => 389.00, 'originalPrice' => null, 'rating' => 4.8, 'reviews' => 42, 'badge' => 'New Arrival', 'permalink' => $shop_url],
        ['name' => 'Enkei RPF1 Silver', 'brand' => 'Enkei', 'size' => '17x9 5x114.3', 'image' => 'https://images.unsplash.com/photo-1766917947934-6eb530590b85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMGNhciUyMHdoZWVsJTIwcmltJTIwY2hyb21lJTIwZGV0YWlsfGVufDF8fHx8MTc3NDM2NDUwNHww&ixlib=rb-4.1.0&q=80&w=1080', 'price' => 425.00, 'originalPrice' => 490.00, 'rating' => 5.0, 'reviews' => 215, 'badge' => 'Top Rated', 'permalink' => $shop_url],
        ['name' => 'Pirelli P Zero Nero', 'brand' => 'Pirelli', 'size' => '235/35 R19', 'image' => 'https://images.unsplash.com/photo-1752959807356-a4f7628f74a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXJlbGxpJTIwdHlyZSUyMHJ1YmJlciUyMGNsb3NlJTIwdXAlMjBwcm9kdWN0fGVufDF8fHx8MTc3NDM2NDcyNXww&ixlib=rb-4.1.0&q=80&w=1080', 'price' => 289.00, 'originalPrice' => 349.00, 'rating' => 4.8, 'reviews' => 97, 'badge' => 'Limited Stock', 'permalink' => $shop_url],
    ];
}

$star_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
?>
<section id="featured" class="py-24 bg-white" aria-labelledby="featured-heading">
    <div class="<?php echo $container; ?>">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
                <div class="flex items-center gap-2 text-[#FF5C00] font-bold mb-2 uppercase tracking-wide text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    Today's Top Picks
                </div>
                <h2 id="featured-heading" class="text-3xl md:text-4xl font-extrabold text-[#132043]">Featured Deals</h2>
            </div>
            <a href="<?php echo $shop_url; ?>" class="text-[#132043] font-bold hover:text-[#FF5C00] flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C00] rounded px-2 py-1">
                View All Deals
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6 2xl:gap-8">
            <?php foreach ($products as $product) :
                $link  = isset($product['permalink']) ? esc_url($product['permalink']) : $shop_url;
                $price = isset($product['price']) ? '$' . number_format((float) $product['price'], 2) : '';
                $old   = !empty($product['originalPrice']) ? '$' . number_format((float) $product['originalPrice'], 2) : '';
            ?>
            <article class="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#FF5C00]">
                <div class="relative aspect-square bg-slate-100 overflow-hidden border-b border-slate-100">
                    <?php if (!empty($product['badge'])) : ?>
                    <div class="absolute top-4 left-4 bg-[#FF5C00] text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                        <?php echo esc_html($product['badge']); ?>
                    </div>
                    <?php endif; ?>
                    <img src="<?php echo esc_url($product['image']); ?>" alt="<?php echo esc_attr($product['name']); ?> product shot" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                </div>

                <div class="p-6 flex flex-col flex-grow">
                    <div class="mb-auto">
                        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"><?php echo esc_html($product['brand']); ?></div>
                        <h3 class="font-bold text-[#1F2937] text-lg leading-tight mb-2">
                            <a href="<?php echo $link; ?>" class="outline-none before:absolute before:inset-0"><?php echo esc_html($product['name']); ?></a>
                        </h3>
                        <p class="text-sm text-slate-600 mb-3"><?php echo esc_html($product['size'] ?? ''); ?></p>

                        <div class="flex items-center gap-1.5" aria-label="Rating <?php echo esc_attr($product['rating']); ?> out of 5 stars from <?php echo esc_attr($product['reviews']); ?> reviews">
                            <div class="flex text-[#FF5C00]">
                                <?php echo str_repeat($star_svg, 5); ?>
                            </div>
                            <span class="text-xs font-bold text-slate-600">(<?php echo esc_html($product['reviews']); ?>)</span>
                        </div>
                    </div>

                    <div class="mt-6 pt-4 border-t border-slate-100">
                        <div class="flex items-end gap-2 mb-4">
                            <div class="text-2xl font-extrabold text-[#132043]"><?php echo $price; ?></div>
                            <?php if ($old) : ?>
                            <div class="text-sm font-medium text-slate-500 line-through mb-1">
                                <span class="sr-only">Original price: </span><?php echo $old; ?>
                            </div>
                            <?php endif; ?>
                        </div>

                        <a href="<?php echo $link; ?>" class="w-full bg-slate-100 hover:bg-[#FF5C00] text-[#132043] hover:text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5C00] relative z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                            <span>Browse Live Stock</span>
                        </a>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
```

- [ ] **Step 6: Create `template-parts/about-section.php`**

Reproduces App.tsx `AboutSection` (lines 817–894).

```php
<?php
defined('ABSPATH') || exit;
$container = 'max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10';
$shop_url  = function_exists('wc_get_page_permalink') ? esc_url(wc_get_page_permalink('shop')) : esc_url(home_url('/'));
$about_img = esc_url(NONOMAGS_URI . '/assets/images/about-person.png');
$about_bg  = 'https://images.unsplash.com/photo-1691840204491-f5c608613b68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwbWVjaGFuaWMlMjB3b3Jrc2hvcCUyMGZyaWVuZGx5fGVufDF8fHx8MTc3NDM2Mjg4N3ww&ixlib=rb-4.1.0&q=80&w=1080';
$star_svg  = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
?>
<section id="about" class="py-24 bg-slate-50 overflow-hidden" aria-labelledby="about-heading">
    <div class="<?php echo $container; ?>">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div class="relative">
                <div class="absolute -inset-4 bg-gradient-to-tr from-[#132043]/10 to-[#FF5C00]/10 rounded-3xl transform -rotate-3" aria-hidden="true"></div>
                <img src="<?php echo $about_bg; ?>" alt="Nono, founder of Nono Mags N Tyres, standing in front of the store" class="relative w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl">

                <div class="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-[220px]">
                    <div class="flex text-[#FF5C00] mb-3">
                        <?php echo str_repeat($star_svg, 5); ?>
                    </div>
                    <p class="font-extrabold text-[#132043] text-2xl mb-1">4.9/5 Rating</p>
                    <p class="text-sm text-slate-600 font-medium leading-snug">Based on 12,000+ verified Kiwi reviews.</p>
                </div>
            </div>

            <div class="space-y-8 lg:pl-8">
                <div>
                    <div class="inline-flex items-center gap-2 text-[#FF5C00] font-bold mb-4 uppercase tracking-wider text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                        Why Choose Us
                    </div>
                    <h2 id="about-heading" class="text-3xl md:text-5xl font-extrabold text-[#132043] leading-tight mb-6">
                        New Zealand's Most Trusted Tyre Network.
                    </h2>
                    <p class="text-lg text-slate-700 leading-relaxed">
                        We've revolutionized how Kiwis buy tyres and mags. By removing the middleman, we bring you premium brands at wholesale prices, shipped directly to a local mechanic near you.
                    </p>
                </div>

                <div class="space-y-6">
                    <div class="flex gap-4">
                        <div class="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[#132043]/10 flex items-center justify-center text-[#132043]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        </div>
                        <div>
                            <h4 class="font-bold text-[#132043] text-lg mb-1">Local Expert Fitting</h4>
                            <p class="text-slate-600 leading-relaxed">Choose from over 200 vetted fitting stations nationwide. We ship directly to them, so you just show up.</p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[#FF5C00]/10 flex items-center justify-center text-[#FF5C00]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div>
                            <h4 class="font-bold text-[#132043] text-lg mb-1">Guaranteed Fitment</h4>
                            <p class="text-slate-600 leading-relaxed">Use our rego search tool. If the tyres don't fit your vehicle, we'll replace them at zero cost to you.</p>
                        </div>
                    </div>
                </div>

                <a href="<?php echo $shop_url; ?>" class="inline-flex items-center gap-2 bg-[#132043] hover:bg-[#0B132C] text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#132043]">
                    Learn More About Us
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
            </div>
        </div>
    </div>
</section>
```

- [ ] **Step 7: Create `template-parts/category-section.php`**

Reproduces App.tsx `CategorySection` (lines 896–935).

```php
<?php
defined('ABSPATH') || exit;
$container = 'max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10';
$shop_url  = function_exists('wc_get_page_permalink') ? esc_url(wc_get_page_permalink('shop')) : esc_url(home_url('/'));

$categories = [
    [
        'title'    => 'Premium Tyres',
        'subtitle' => 'Shop all major brands',
        'image'    => 'https://images.unsplash.com/photo-1753030148904-16130157a3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB0eXJlJTIwdHJlYWR8ZW58MXx8fHwxNzc0MzYyNjUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    [
        'title'    => 'Mags & Alloys',
        'subtitle' => "Upgrade your ride's look",
        'image'    => 'https://images.unsplash.com/photo-1769899107195-aae414826ced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGxveSUyMHdoZWVsJTIwcmltfGVufDF8fHx8MTc3NDM2MjY1Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    [
        'title'    => 'Complete Packages',
        'subtitle' => 'Wheel + tyre combos',
        'image'    => 'https://images.unsplash.com/photo-1761756580701-e7ecb9baea13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGxveSUyMHdoZWVsJTIwdXBncmFkZSUyMHNwb3J0JTIwY2FyfGVufDF8fHx8MTc3NDM2NDMxMHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
];
?>
<section id="categories" class="py-24 bg-white" aria-labelledby="category-heading">
    <div class="<?php echo $container; ?>">
        <div class="text-center mb-16">
            <h2 id="category-heading" class="text-3xl md:text-5xl font-extrabold text-[#132043] mb-6">Shop by Category</h2>
            <p class="text-slate-700 text-lg max-w-2xl mx-auto leading-relaxed">Explore our extensive range of premium products specifically chosen for New Zealand roads. Find exactly what you need.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
            <?php foreach ($categories as $cat) : ?>
            <a href="<?php echo $shop_url; ?>" class="group relative rounded-3xl overflow-hidden aspect-[4/3] block w-full text-left shadow-lg focus:outline-none focus:ring-4 focus:ring-[#FF5C00] focus:ring-offset-4">
                <img src="<?php echo esc_url($cat['image']); ?>" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" aria-hidden="true">
                <div class="absolute inset-0 bg-gradient-to-t from-[#132043]/90 via-[#132043]/30 to-transparent flex flex-col justify-end p-10">
                    <p class="text-[#FF5C00] font-bold mb-2 uppercase tracking-wider text-sm"><?php echo esc_html($cat['subtitle']); ?></p>
                    <h3 class="text-3xl md:text-4xl font-extrabold text-white mb-6"><?php echo esc_html($cat['title']); ?></h3>
                    <div class="inline-flex items-center text-[#132043] font-bold gap-2 bg-white w-max px-6 py-3 rounded-lg hover:bg-[#FF5C00] hover:text-white transition-colors shadow-md">
                        Shop Category
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>
```

---

## Task 9: WooCommerce Page Templates (PHP)

**Files:**
- Create: `nonomags-theme/page-shop.php`
- Create: `nonomags-theme/page-checkout.php`
- Create: `nonomags-theme/single-product.php`

- [ ] **Step 1: Create `page-shop.php`**

This is the WooCommerce Shop page template. It renders a minimal SEO shell and mounts the React StorePage island.

```php
<?php
/**
 * Template Name: Shop
 * Template for the WooCommerce shop/product archive page.
 */
get_header();
$shop_url = function_exists('wc_get_page_permalink') ? esc_url(wc_get_page_permalink('shop')) : esc_url(home_url('/'));
?>
<main>
    <div id="nonomags-store">
        <noscript>
            <div class="max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10 py-24">
                <h1 class="text-3xl font-extrabold text-[#132043] mb-8">Shop Tyres &amp; Mags</h1>
                <p class="text-slate-600 mb-8">JavaScript is required to browse our full product catalogue. Please enable JavaScript or visit our products directly:</p>
                <?php if (class_exists('WooCommerce')) : ?>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <?php
                    $products = wc_get_products(['status' => 'publish', 'limit' => 12]);
                    foreach ($products as $product) :
                    ?>
                    <a href="<?php echo esc_url(get_permalink($product->get_id())); ?>" class="block p-4 border border-slate-200 rounded-lg hover:border-[#FF5C00]">
                        <?php echo $product->get_image('woocommerce_thumbnail', ['class' => 'w-full h-auto rounded']); ?>
                        <h3 class="font-bold text-[#132043] mt-3"><?php echo esc_html($product->get_name()); ?></h3>
                        <p class="text-[#FF5C00] font-bold"><?php echo $product->get_price_html(); ?></p>
                    </a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>
        </noscript>
    </div>
</main>
<?php
get_footer();
```

- [ ] **Step 2: Create `page-checkout.php`**

```php
<?php
/**
 * Template Name: Checkout
 * Template for the WooCommerce checkout page.
 */
get_header();
$checkout_url = function_exists('wc_get_checkout_url') ? esc_url(wc_get_checkout_url()) : esc_url(home_url('/'));
?>
<main>
    <div id="nonomags-checkout">
        <noscript>
            <div class="max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10 py-24">
                <h1 class="text-3xl font-extrabold text-[#132043] mb-8">Checkout</h1>
                <p class="text-slate-600">JavaScript is required for our checkout. Please enable JavaScript or <a href="<?php echo esc_url(add_query_arg('native-checkout', '1', $checkout_url)); ?>" class="text-[#FF5C00] font-bold underline">use our standard checkout</a>.</p>
            </div>
        </noscript>
    </div>
</main>
<?php
get_footer();
```

- [ ] **Step 3: Create `single-product.php`**

```php
<?php
/**
 * Single product template.
 * Renders SEO-critical content in hidden HTML, then mounts the React ProductPage island.
 */
get_header();

global $product;
if (!$product instanceof WC_Product) {
    $product = wc_get_product(get_the_ID());
}

if (!$product) {
    echo '<div class="max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10 py-24"><p>Product not found.</p></div>';
    get_footer();
    return;
}

$product_image = wp_get_attachment_image_url($product->get_image_id(), 'large');
$product_slug  = $product->get_slug();
?>
<main>
    <!-- SEO shell: visible to crawlers, visually hidden when React mounts -->
    <div class="nonomags-product-seo" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">
        <h1><?php the_title(); ?></h1>
        <?php if ($product_image) : ?>
        <img src="<?php echo esc_url($product_image); ?>" alt="<?php the_title_attribute(); ?>">
        <?php endif; ?>
        <p><?php echo wp_kses_post($product->get_short_description()); ?></p>
        <span class="price"><?php echo $product->get_price_html(); ?></span>

        <!-- JSON-LD Structured Data -->
        <script type="application/ld+json">
        <?php
        echo wp_json_encode([
            '@context'    => 'https://schema.org',
            '@type'       => 'Product',
            'name'        => $product->get_name(),
            'description' => wp_strip_all_tags($product->get_short_description()),
            'image'       => $product_image ?: '',
            'sku'         => $product->get_sku(),
            'brand'       => [
                '@type' => 'Brand',
                'name'  => NonoMags_Woo_Integration::transform_product($product)['brand'] ?: 'Nono Mags',
            ],
            'offers'      => [
                '@type'         => 'Offer',
                'url'           => get_permalink($product->get_id()),
                'priceCurrency' => get_woocommerce_currency(),
                'price'         => $product->get_price(),
                'availability'  => $product->is_in_stock()
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
            ],
            'aggregateRating' => $product->get_review_count() > 0 ? [
                '@type'       => 'AggregateRating',
                'ratingValue' => $product->get_average_rating(),
                'reviewCount' => $product->get_review_count(),
            ] : null,
        ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        ?>
        </script>
    </div>

    <!-- React ProductPage island -->
    <div id="nonomags-product" data-product-ref="<?php echo esc_attr($product_slug); ?>">
        <noscript>
            <div class="max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10 py-24">
                <h1 class="text-3xl font-extrabold text-[#132043] mb-4"><?php the_title(); ?></h1>
                <?php if ($product_image) : ?>
                <img src="<?php echo esc_url($product_image); ?>" alt="<?php the_title_attribute(); ?>" class="w-full max-w-lg rounded-2xl mb-6">
                <?php endif; ?>
                <p class="text-2xl font-extrabold text-[#132043] mb-4"><?php echo $product->get_price_html(); ?></p>
                <div class="prose"><?php echo wp_kses_post($product->get_short_description()); ?></div>
            </div>
        </noscript>
    </div>
</main>
<?php
get_footer();
```

---

## Task 10: Copy Static Assets + Build + Final Verification

**Files:**
- Create: `nonomags-theme/assets/images/about-person.png`
- Create: `nonomags-theme/screenshot.png`

- [ ] **Step 1: Copy about-person image**

Copy `Redesign landing page/src/assets/ae51a4f06283c94982306179570d9bc5f913f710.png` to `nonomags-theme/assets/images/about-person.png`.

- [ ] **Step 2: Create a screenshot.png**

Create a 1200x900 placeholder screenshot for the WordPress theme. This can be a simple image with the Nono Mags branding — navy background, orange "Nono Mags N Tyres" text, "WordPress Theme" subtitle. This file goes at `nonomags-theme/screenshot.png`.

- [ ] **Step 3: Run full build**

```bash
cd "c:/Users/Nathes2/Desktop/Nono Mags/nonomags-theme" && npm run build
```

Expected: Build succeeds. Check that `assets/js/nonomags-islands.js` and `assets/css/nonomags-theme.css` both exist and are non-empty.

- [ ] **Step 4: Verify file structure**

Run a listing of the theme directory and confirm all expected files exist:

```bash
find "c:/Users/Nathes2/Desktop/Nono Mags/nonomags-theme" -type f | grep -v node_modules | sort
```

Expected files (minimum):
- `style.css`, `functions.php`, `index.php`, `front-page.php`, `header.php`, `footer.php`
- `page-shop.php`, `page-checkout.php`, `single-product.php`
- `template-parts/hero.php`, `template-parts/trust-bar.php`, `template-parts/promo-section.php`, `template-parts/featured-products.php`, `template-parts/about-section.php`, `template-parts/category-section.php`
- `includes/class-theme-setup.php`, `includes/class-config-inject.php`, `includes/class-woo-integration.php`, `includes/class-rest-api.php`
- `src/main.tsx`, `src/islands/*.tsx`, `src/components/*.tsx`, `src/lib/*.ts`, `src/styles/*.css`
- `assets/js/nonomags-islands.js`, `assets/css/nonomags-theme.css`
- `assets/images/logo.png`, `assets/images/about-person.png`
- `package.json`, `vite.config.ts`, `.gitignore`, `screenshot.png`

- [ ] **Step 5: Verify PHP syntax**

```bash
find "c:/Users/Nathes2/Desktop/Nono Mags/nonomags-theme" -name "*.php" -not -path "*/node_modules/*" -exec php -l {} \;
```

Expected: No syntax errors.
