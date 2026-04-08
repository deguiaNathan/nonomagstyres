# WooCommerce Template Map For Bricks

Use this file after the homepage is in place. The goal is to keep the exact React visual language while letting WooCommerce stay native for live data.

## 1. Header Template

Build once as a Bricks template/component and use it across all templates.

Recommended structure:

1. `Section`
2. `Container`
3. `Block` for top bar
4. `Block` for main header row
5. `Nav Menu`
6. `Icon` or text link for account
7. `Button` or Woo mini-cart trigger

Classes to assign:

- `nm-header-shell`
- `nm-topbar`
- `nm-topbar-inner`
- `nm-topbar-left`
- `nm-topbar-right`
- `nm-header`
- `nm-header-left`
- `nm-header-nav`
- `nm-header-right`
- `nm-logo-wrap`
- `nm-account-link`
- `nm-btn`
- `nm-btn-primary`
- `nm-cart-button`

Notes:

- Use the uploaded logo from `assets/nonomags-logo.png`.
- Point the cart button to Woo cart or use the Bricks/Woo mini-cart interaction you prefer.

## 2. Footer Template

Build once and reuse everywhere.

Recommended structure:

1. `Section`
2. `Container`
3. Four-column `Block` grid
4. `Nav Menu` or plain links for the middle/footer columns

Classes to assign:

- `nm-footer`
- `nm-footer-main`
- `nm-footer-col`
- `nm-footer-logo`
- `nm-footer-copy`
- `nm-footer-rating`
- `nm-footer-heading`
- `nm-footer-links`
- `nm-footer-help`
- `nm-footer-help-badge`
- `nm-footer-note`
- `nm-footer-bottom`
- `nm-footer-legal`

## 3. Shop Archive Template

Template condition:

- All product archives

Recommended structure:

1. `Section` for dark hero
2. `Container`
3. Breadcrumb row
4. Heading block
5. Sticky toolbar section
6. Main content section
7. `Container`
8. Two-column layout
9. Left sidebar for filters
10. Right content area for products

Bricks/Woo elements:

- Breadcrumbs or text links
- Products element or Query Loop for Woo products
- Native Woo widgets, filters, or attribute filters in the sidebar
- Optional sorting dropdown
- Optional pagination

Assign these classes:

- `nm-woo-shell`
- `nm-woo-hero`
- `nm-woo-breadcrumb`
- `nm-woo-toolbar`
- `nm-woo-layout`
- `nm-woo-sidebar`
- `nm-woo-product-grid`
- `nm-woo-card`
- `nm-empty-state`

Archive design notes from the React app:

- Dark navy hero with small orange kicker and product count
- White sticky toolbar under the hero
- Left filter rail in a white rounded card
- Product cards use:
  - large square image
  - orange badge
  - uppercase brand
  - bold title
  - muted size/category line
  - orange-accent price/action area

Important limitation:

- The exact React filter/search/sort behavior is not native Bricks + WooCommerce.
- If you want truly matching AJAX filtering, use a dedicated filter solution.
  `Inference`
- If you want the exact visual shell without extra tooling, keep the same layout and style native Woo widgets in the sidebar.

Empty state copy:

- If the whole catalog is empty: `No items, we are restocking.`
- If filters return nothing: `No tyres found`

## 4. Single Product Template

Template condition:

- Individual product

Recommended structure:

1. Dark hero/breadcrumb strip
2. Main product section
3. Two-column layout
4. Gallery column
5. Summary column
6. Secondary two-column info area
7. Specifications card
8. Reviews card

Bricks/Woo elements:

- Product Images
- Product Title
- Product Price
- Product Short Description
- Add To Cart
- Additional Info
- Product Reviews
- Related Products

Assign these classes:

- `nm-woo-shell`
- `nm-woo-hero`
- `nm-woo-breadcrumb`
- `nm-woo-pdp`
- `nm-woo-gallery`
- `nm-woo-summary`
- `nm-woo-spec-grid`
- `nm-woo-spec-card`
- `nm-woo-review-grid`
- `nm-woo-review-card`

Product-page design notes from the React app:

- Large gallery on the left
- White summary card on the right
- Huge price treatment
- Strong add-to-cart button in orange
- Small trust/benefit badges below CTA area
- Secondary white cards for specs and reviews

Important limitation:

- The React wishlist toggle and default quantity of 4 are custom UI behaviors.
- Keep the native Woo add-to-cart working first, then layer extras only if needed.

## 5. Cart Template

Template condition:

- Cart page

Recommended structure:

1. Dark breadcrumb strip
2. White main checkout/cart shell
3. Two-column layout
4. Cart table / cart items
5. Order summary card
6. Optional support band at bottom

Bricks/Woo elements:

- Woo Cart
- Cart totals
- Coupon if desired

Assign these classes:

- `nm-woo-shell`
- `nm-woo-hero`
- `nm-woo-breadcrumb`
- `nm-woo-checkout-grid`
- `nm-woo-checkout-card`
- `nm-woo-support-band`

## 6. Checkout Template

Template condition:

- Checkout page

Recommended structure:

1. Dark breadcrumb strip
2. Main content section
3. Two-column checkout grid
4. Checkout form card
5. Order review card

Bricks/Woo elements:

- Woo Checkout
- Optional notices

Assign these classes:

- `nm-woo-shell`
- `nm-woo-hero`
- `nm-woo-breadcrumb`
- `nm-woo-checkout-grid`
- `nm-woo-checkout-card`

Important limitation:

- The exact React multi-step checkout is not a default Woo/Bricks pattern.
- If you stay native, style the standard Woo checkout to match the React visual system.
- If you want the exact stepper flow, that becomes a custom-code task.

## 7. Reusable Components To Create In Bricks

Create these as Bricks components after the first pass:

1. Header
2. Footer
3. Featured product card
4. Promo tile card
5. Category card
6. Archive product card
7. Support/benefit band

## 8. Exactness Priority

If you want the fastest path to a faithful Bricks build, prioritize exactness in this order:

1. Global colors, spacing, radii, shadows
2. Header and footer
3. Homepage hero/promotions/featured/about/categories
4. Product card styling
5. Single product visual layout
6. Cart and checkout styling
7. Advanced filters and multi-step checkout behavior

That sequence gets the site feeling exact very quickly, even before the advanced interactions are rebuilt.
