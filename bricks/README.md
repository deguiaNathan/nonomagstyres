# Nono Mags Bricks Conversion Kit

This folder converts the current React design into a Bricks-ready build kit.

What is included:

- `nonomags-bricks.css`
  Shared design tokens, global classes, homepage styling, and Woo wrapper styles.
- `nonomags-homepage.html`
  Paste-ready homepage markup for Bricks 2.3 `HTML & CSS to Bricks`.
- `woocommerce-template-map.md`
  Bricks-native build map for shop, single product, cart, and checkout templates.
- `media-manifest.md`
  The exact image sources used in the React app, plus the two local assets to upload.
- `assets/nonomags-logo.png`
  Local logo asset copied from the React app.
- `assets/nonomags-founder.png`
  Local founder/about image copied from the React app.

## Assumptions

- You are using Bricks 2.3 or newer.
- You are keeping Bricks as the active theme.
- You are using the free WooCommerce plugin.
- You want the same visual direction as the React app, but dynamic Woo areas should stay Bricks/Woo native.

## Important Reality Check

This kit gives you the exact design system and page structure, but a few React behaviors are not native Bricks features by default:

- The hero tab switcher is best rebuilt with Bricks Tabs or Nestable Tabs.
  `Inference`
- The live promo countdown needs custom code or a countdown element/plugin.
  `Inference`
- The exact AJAX filter/search/sort experience from the React store page needs extra query/filter tooling beyond core Bricks + WooCommerce.
  Without that, build the same visual layout and use native Woo widgets/filters.
- The exact multi-step checkout from the React app is not native Woo checkout.
  Use the Bricks Woo Checkout template styled to match, unless you want a custom-coded checkout flow.

## Recommended Setup Sequence

1. In WordPress, activate Bricks and install/activate WooCommerce.
2. Enable `Bricks > Settings > Builder > HTML & CSS to Bricks`.
3. Upload these two files to the WordPress media library:
   - `bricks/assets/nonomags-logo.png`
   - `bricks/assets/nonomags-founder.png`
4. In Bricks, create or open your homepage.
5. Paste the contents of `nonomags-bricks.css` so Bricks creates the variables and reusable classes.
6. Paste the contents of `nonomags-homepage.html` into the homepage.
7. Replace the two placeholder image URLs in the pasted homepage with the uploaded media URLs for the real logo and founder image.
8. Turn repeated pieces into Bricks components after conversion:
   - header
   - footer
   - featured product card
   - promo tile
   - category card
9. Build Woo templates using `woocommerce-template-map.md`.

## Best Bricks Workflow

- Use Theme Styles for body text, headings, links, buttons, and form defaults.
- Use the variables/classes from `nonomags-bricks.css` as the shared system.
- Use components for repeated cards and header/footer blocks.
- Use Bricks native Woo elements for anything tied to live product, cart, account, or checkout data.

## Suggested Template Order

1. Homepage
2. Header template
3. Footer template
4. Shop archive template
5. Single product template
6. Cart template
7. Checkout template

## What To Replace After Import

- Logo image
- Founder image
- Menu links
- Shop/archive/category URLs if your Woo slugs differ
- Legal page URLs

## What I Would Do Next

If you want a tighter Bricks handoff after this, the next best step is building:

- one native Bricks homepage from this kit
- one Bricks shop archive template
- one Bricks single product template

That gets the whole public storefront visually aligned before cart and checkout refinement.
