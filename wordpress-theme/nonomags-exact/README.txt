Nono Mags Exact Theme

This theme renders the current React storefront build directly inside WordPress for a 1:1 match with the app in this repository, with WooCommerce powering products, cart sessions, and checkout.

Files
- `front-page.php`, `index.php`, and the Woo templates output the app shell.
- `assets/app/` contains the copied Vite production build.
- `assets/css/wp-bridge.css` handles a few WordPress-specific layout quirks.
- `functions.php` injects runtime config and exposes the custom REST endpoints the React storefront uses.

Install
1. Upload `nonomags-exact.zip` in WordPress under Appearance > Themes > Add New > Upload Theme.
2. Make sure WooCommerce is installed and activated.
3. Activate the theme.
4. Visit the site front page. The React storefront will render there immediately.
5. Check your WooCommerce shop, single product, cart, and checkout routes. They should all mount the same storefront shell.

Notes
- Products, cart, and checkout depend on WooCommerce.
- Payment gateways that need the native Woo checkout flow will redirect to a styled fallback checkout page inside the theme.
- Standard WordPress content pages are not reproduced as separate bespoke React screens in this theme package.

Rebuild
- From the project root run `npm run build:wp-theme`.
- That rebuilds the Vite app, copies the new bundle into this theme, and recreates the zip package.
