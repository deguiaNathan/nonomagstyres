# Nono Mags WordPress Theme — Design Spec

**Date:** 2026-04-04
**Approach:** Hybrid — PHP-rendered shell + React islands
**Output:** `c:/Users/Nathes2/Desktop/Nono Mags/nonomags-theme/` (portable, manually copied into any WP install)

---

## 1. Overview

A self-contained WordPress theme that reproduces the Nono Mags N Tyres React landing page (`src/app/App.tsx`) as a 1:1 visual match, with full WooCommerce integration. The theme uses a hybrid architecture:

- **PHP templates** render all SEO-critical content (homepage sections, header, footer, product SEO data)
- **React islands** mount into PHP-provided containers for interactive features (search widget, store browsing, product page, checkout, mobile menu, cart button)
- **Custom REST API** endpoints are bundled inside the theme (in `includes/`) to serve product data in the `StorefrontProduct` format the React components expect
- **Build tooling** (Vite + Tailwind) compiles React islands and CSS into `assets/`

## 2. Theme File Structure

```
nonomags-theme/
├── style.css                    # WP theme header + base styles
├── functions.php                # Theme setup, enqueues, config injection
├── screenshot.png               # Theme preview
│
├── templates/
│   ├── header.php               # Sticky header (top bar + nav)
│   ├── footer.php               # 4-column footer
│   ├── front-page.php           # Homepage assembly
│   ├── page-shop.php            # Store → mounts React StorePage
│   ├── page-checkout.php        # Checkout → mounts React CheckoutPage
│   └── single-product.php       # Product → SEO shell + React ProductPage
│
├── template-parts/
│   ├── hero.php
│   ├── hero-search-widget.php
│   ├── trust-bar.php
│   ├── promo-section.php
│   ├── featured-products.php
│   ├── about-section.php
│   └── category-section.php
│
├── includes/
│   ├── class-theme-setup.php    # register_nav_menus, add_theme_support, WooCommerce support
│   ├── class-rest-api.php       # /wp-json/nonomags/v1/ endpoints
│   ├── class-config-inject.php  # window.NonoMagsWp via wp_localize_script
│   └── class-woo-integration.php # Product data transformers, attribute mapping
│
├── src/
│   ├── main.tsx                 # Entry: mounts React islands into PHP containers
│   ├── islands/
│   │   ├── search-widget.tsx
│   │   ├── store-island.tsx
│   │   ├── product-island.tsx
│   │   ├── checkout-island.tsx
│   │   └── mobile-menu.tsx
│   ├── components/
│   │   ├── CartContext.tsx
│   │   ├── StorePage.tsx
│   │   ├── ProductPage.tsx
│   │   └── CheckoutPage.tsx
│   ├── lib/
│   │   ├── woocommerce.ts
│   │   └── wordpress.ts
│   └── styles/
│       ├── tailwind.css
│       └── theme.css
│
├── assets/                      # Build output (git-ignored)
│   ├── js/nonomags-islands.js
│   └── css/nonomags-theme.css
│
├── package.json
└── vite.config.ts
```

## 3. PHP/React Boundary

### PHP-rendered (server HTML, SEO-indexed, cacheable)

| Section | Source partial | Why PHP |
|---------|--------------|---------|
| Header (top bar + main nav) | `header.php` | Static content, internal links, logo |
| Hero (text, bg image, badges) | `hero.php` | H1, key selling prop — must be in initial HTML |
| TrustBar | `trust-bar.php` | Static 3-item trust strip |
| PromoSection | `promo-section.php` | Promo content, images, links — SEO value |
| FeaturedProducts | `featured-products.php` | Product names/prices/images + schema.org structured data |
| AboutSection | `about-section.php` | Company story, rating — indexable content |
| CategorySection | `category-section.php` | Category links + images — internal linking |
| Footer | `footer.php` | Links, contact, legal |

### React islands (mounted into PHP-provided containers)

| Island | Mount target ID | Why React |
|--------|----------------|-----------|
| HeroSearchWidget | `nonomags-search-widget` | Tab switching, form state, rego lookup |
| MobileMenu | `nonomags-mobile-menu` | AnimatePresence slide animation, body scroll lock |
| CartButton | `nonomags-cart-button` | Live cart count badge. PHP renders the full cart button (orange bg, icon, "Cart" text) as a link to the checkout page. React replaces the inner content to add the live item-count badge and onClick navigation. Without JS, the button still works as a plain link. |
| StorePage | `nonomags-store` | Filters, sorting, pagination, add-to-cart |
| ProductPage | `nonomags-product` | Image gallery, qty selector, add-to-cart, reviews |
| CheckoutPage | `nonomags-checkout` | Multi-step form, shipping rates, payment, order placement |

### Special cases

- **Countdown timer** (PromoSection): PHP renders a static HTML shell with `data-end` timestamp attribute. A 15-line vanilla JS snippet ticks it down. No React island needed.
- **Framer Motion**: Only used in React islands (mobile menu, store page). PHP sections replicate hover effects with CSS transitions (already Tailwind utility classes).

## 4. WooCommerce Integration

### Custom REST API endpoints (class-rest-api.php)

| Endpoint | Method | Returns |
|----------|--------|---------|
| `/wp-json/nonomags/v1/products` | GET | `StorefrontProductsResponse` — list + filter metadata |
| `/wp-json/nonomags/v1/products/{slug-or-id}` | GET | `StorefrontProductResponse` — product + related + reviews |
| `/wp-json/nonomags/v1/payment-methods` | GET | `WooPaymentMethodsResponse` — available gateways |

Cart and checkout use WooCommerce's native Store API (`/wp-json/wc/store/v1/`) directly.

### Product data mapping (WooCommerce → StorefrontProduct)

| StorefrontProduct field | WooCommerce source |
|---|---|
| `brand` | Product attribute "Brand" or taxonomy `pa_brand` |
| `category` / `categories` | Product categories taxonomy |
| `size` | Product attribute "Size" |
| `width` | Product attribute "Width" |
| `badge` / `badgeColor` | Custom meta `_nonomags_badge`, `_nonomags_badge_color` |
| `specs` | All visible product attributes as key-value pairs |
| `image` / `images` | Featured image + product gallery |
| `rating` / `reviews` | WooCommerce average rating + review count |
| `originalPrice` | Regular price (when product is on sale) |
| `summary` | Short description |
| `description` | Full description |
| `hasOptions` | `$product->is_type('variable')` |
| `purchasable` | `$product->is_purchasable() && $product->is_in_stock()` |
| `inStock` | `$product->is_in_stock()` |
| `permalink` | `get_permalink($product->get_id())` |
| `slug` | `$product->get_slug()` |

### Runtime config injection (class-config-inject.php)

Injects `window.NonoMagsWp` via `wp_localize_script` with:
- `enabled: true`, `wooEnabled: class_exists('WooCommerce')`
- All WooCommerce page URLs (home, shop, cart, checkout, account, privacy, terms)
- `currentTemplate` — detected from the current page context
- `currentProduct` — `{id, slug, permalink}` on product pages
- `storeApiNonce` — `wp_create_nonce('wc_store_api')`
- `currency` — from WooCommerce settings
- `fittingStations` — from WP options (hardcoded initially)
- `showPrototypeTools: false`

This maps exactly to the existing `WordPressRuntimeConfig` type in `src/app/lib/wordpress.ts`.

## 5. Build Tooling

### Dependencies (package.json)

**Runtime:** react, react-dom, lucide-react, motion, tailwind-merge, clsx, tw-animate-css

**Dev:** vite, @vitejs/plugin-react, tailwindcss, @tailwindcss/vite

All unused deps from the prototype (Radix UI, MUI, recharts, react-router, canvas-confetti, etc.) are dropped.

### Vite config

- Entry: `src/main.tsx`
- Output: `assets/js/nonomags-islands.js` + `assets/css/nonomags-theme.css`
- Tailwind scans both `templates/**/*.php` and `src/**/*.tsx`

### npm scripts

- `npm run build` — production build to `assets/`
- `npm run dev` — Vite dev server with HMR, proxies to local WP

### Island mounting (src/main.tsx)

```tsx
const mountPoints = {
  'nonomags-search-widget': () => import('./islands/search-widget'),
  'nonomags-store': () => import('./islands/store-island'),
  'nonomags-product': () => import('./islands/product-island'),
  'nonomags-checkout': () => import('./islands/checkout-island'),
  'nonomags-mobile-menu': () => import('./islands/mobile-menu'),
};

// Only mount islands whose container exists on the current page
for (const [id, loader] of Object.entries(mountPoints)) {
  const el = document.getElementById(id);
  if (el) {
    loader().then(({ mount }) => mount(el));
  }
}
```

Each island lazy-loads only when its mount point exists. Zero wasted JS on pages that don't need it.

### WordPress enqueue

```php
wp_enqueue_style('nonomags-theme', get_template_directory_uri() . '/assets/css/nonomags-theme.css');
wp_enqueue_script('nonomags-islands', get_template_directory_uri() . '/assets/js/nonomags-islands.js', [], $version, true);
wp_localize_script('nonomags-islands', 'NonoMagsWp', $config);
```

JS loads in footer (`true`) — users see full PHP-rendered content immediately; React enhances after.

## 6. Template Details

### front-page.php

Assembles homepage from template parts. All content server-rendered. Search widget and mobile menu mount as React islands.

### header.php

- Top bar: navy background, flash sale text, phone number
- Main nav: logo, nav links (Shop Tyres, Mags & Wheels, Combos, Sale), user icon, cart button mount point, mobile menu trigger
- `<div id="nonomags-mobile-menu"></div>` — React mounts animated slide-out menu
- `<div id="nonomags-cart-button">` — React mounts live cart count
- Nav links use `<a href>` to real WP/WooCommerce URLs

### single-product.php

- Visually hidden SEO shell: `<h1>`, product image, short description, price, JSON-LD structured data
- `<div id="nonomags-product" data-product-ref="{slug}"></div>` — React mounts full interactive product page
- React reads `data-product-ref` to know which product to fetch

### page-shop.php / page-checkout.php

- Minimal PHP shell with page title
- React mount point for the full interactive page
- `<noscript>` fallback linking to native WooCommerce pages

## 7. Brand Constants

| Token | Value | Usage |
|-------|-------|-------|
| Navy | `#132043` | Headers, nav, dark sections |
| Navy Dark | `#0B132C` | Footer, promo section backgrounds |
| Orange | `#FF5C00` | CTAs, badges, accents, hover states |
| Orange Hover | `#E05200` | Button hover state |
| Light Gray | `#F3F4F6` | Section backgrounds |
| Text Dark | `#1F2937` | Body text |
| Text Muted | `#6B7280` | Secondary text |
| Container | `max-w-[1184px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-8 2xl:px-10` | All sections |

## 8. Installation

1. Copy `nonomags-theme/` into `wp-content/themes/`
2. `cd wp-content/themes/nonomags-theme && npm install && npm run build`
3. Activate theme in WP Admin → Appearance → Themes
4. Ensure WooCommerce is installed and active
5. Assign WooCommerce pages (Shop, Cart, Checkout) in WooCommerce → Settings → Advanced
6. Set front page to a static page in Settings → Reading
7. Add products with Brand, Size, Width attributes and `_nonomags_badge` meta for badges
