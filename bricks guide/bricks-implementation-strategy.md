# Bricks Implementation Strategy for Nono Mags `App.tsx`

## Goal

This guide defines the safest way to recreate the current React homepage in WordPress using Bricks, without pretending that unresolved store, fitment, or account behavior is already solved.

It is based on:

- `src/app/App.tsx`
- `src/app/components/StorePage.tsx`
- `src/app/components/ProductPage.tsx`
- `src/app/components/CheckoutPage.tsx`
- `wordpress-theme/nonomags-child/functions.php`
- `wordpress-theme/nonomags-child/rego-search.php`

For WordPress-specific behavior, official WordPress documentation is the source of truth. For Bricks builder behavior, this guide follows Bricks Academy documentation plus clearly labeled implementation inferences.

## Decision: Use a Bricks-First Homepage Path

Recommended path:

1. Create or use a normal WordPress page for the homepage.
2. Set that page as the static front page in `Settings > Reading`.
3. Build the homepage layout in Bricks.
4. Build the header and footer as Bricks templates.
5. Do **not** create a competing custom `front-page.php` for this homepage workflow.

Why this is the cleanest path:

- WordPress supports assigning a static front page.  
  Source: https://wordpress.org/documentation/article/create-a-static-front-page/
- WordPress template hierarchy gives `front-page.php` precedence.  
  Source: https://developer.wordpress.org/themes/classic-themes/basics/template-hierarchy/
- `Inference:` because `front-page.php` takes precedence, introducing a separate PHP front-page template can bypass the Bricks page you are trying to build. For this project, keep the homepage owned by Bricks unless you intentionally choose a PHP-template route instead.

## What `App.tsx` Actually Contains

Confirmed from `src/app/App.tsx`:

- A persistent header and footer wrap the experience.
- The default `home` route renders one landing page made of:
  - hero
  - hero search widget
  - trust bar
  - promo section
  - featured products
  - about section
  - category section
- The SPA also switches to separate `store`, `checkout`, `product:*`, and `implementation` views.
- The current app uses client-side state for routing and cart behavior rather than real WordPress URLs or server-backed product data.

Relevant source anchors:

- Header: `src/app/App.tsx:64`
- Hero search widget: `src/app/App.tsx:273`
- Trust bar: `src/app/App.tsx:384`
- Featured products: `src/app/App.tsx:410`
- Promo section: `src/app/App.tsx:555`
- About section: `src/app/App.tsx:759`
- Category section: `src/app/App.tsx:832`
- Footer: `src/app/App.tsx:867`
- Homepage composition: `src/app/App.tsx:983`

## Ownership Model

Use WordPress for site ownership, Bricks for visual build, the child theme for narrow theme glue, and a plugin for business logic that should survive theme changes.

| Layer | Owns | Should not own |
|---|---|---|
| WordPress core/site config | static front page assignment, page URLs, menus, media library assets, plugin activation | detailed visual section assembly |
| Bricks | header template, footer template, homepage layout, reusable visual sections, page-level SEO and social settings | custom PHP request handling |
| Child theme | small enqueued CSS/JS refinements, theme supports, menu registration if needed | fitment logic, API integrations, search parsing |
| Custom plugin | rego lookup, tyre-size parsing, settings screens, API integrations, shortcode output if needed | whole-page visual layout |

WordPress sources behind this split:

- Static front page: https://wordpress.org/documentation/article/create-a-static-front-page/
- Child themes: https://developer.wordpress.org/themes/advanced-topics/child-themes/
- Navigation menus: https://developer.wordpress.org/themes/classic-themes/functionality/navigation-menus/
- `register_nav_menus()`: https://developer.wordpress.org/reference/functions/register_nav_menus/
- Plugin basics: https://developer.wordpress.org/plugins/plugin-basics/

## Bricks Setup Before You Build

Recommended Bricks setup sequence:

1. If you want to use the companion snippets in this folder, enable `Bricks > Settings > Builder > HTML & CSS to Bricks`.
2. Build or extend one shared token system for the homepage instead of styling every element ad hoc.
3. Use Bricks-native outer structure by default:
   - `Section` for each major homepage area
   - `Container` for constrained width
   - `Block` for rows and columns
   - `Div` only when a lightweight wrapper is genuinely helpful
4. Style the base breakpoint first, then refine tablet and mobile breakpoints in Bricks responsive editing.
5. Set page metadata and social previews on the final homepage in Bricks Page Settings.
6. Review Bricks performance settings before launch.

Official Bricks references behind those steps:

- HTML & CSS to Bricks: https://academy.bricksbuilder.io/article/html-css-to-bricks/
- Layout: https://academy.bricksbuilder.io/article/layout/
- Section element: https://academy.bricksbuilder.io/article/section-element/
- Container element: https://academy.bricksbuilder.io/article/container-element/
- Block element: https://academy.bricksbuilder.io/article/block-element/
- Responsive editing: https://academy.bricksbuilder.io/article/responsive-editing/
- Page settings: https://academy.bricksbuilder.io/article/page-settings/
- Settings / Performance: https://academy.bricksbuilder.io/article/settings/
- Asset loading: https://academy.bricksbuilder.io/article/asset-loading/
- Accessibility: https://academy.bricksbuilder.io/article/accessibility/

## Concrete Page Mapping

| React view | Observed source | WordPress target | Bricks responsibility | Status |
|---|---|---|---|---|
| `home` | `src/app/App.tsx:983` | Static front page | Build as one Bricks page with reusable sections | Ready now |
| `store` | `src/app/App.tsx:966` | Shop/archive page | Archive styling only after the real data/query approach is confirmed | Defer logic |
| `product:*` | `src/app/App.tsx:974` | Single product page | Product template only after field mapping is confirmed | Defer logic |
| `checkout` | `src/app/App.tsx:970` | Cart/checkout flow | Do not port the React state machine into production | Platform-owned |
| `implementation` | `src/app/App.tsx:978` | No public page | Do not migrate | Skip |
| `StyleguidePanel` | `src/app/App.tsx:952` | No public page | Do not migrate | Skip |

## Homepage Section Map

This is the safest Bricks mapping for the current homepage.

| App section | Source | Recommended Bricks structure | Reuse method | Safe now | Notes |
|---|---|---|---|---|---|
| Header | `src/app/App.tsx:64` | Bricks `Header` template with two stacked rows | Template | Yes | Use WordPress menus; keep account/cart placeholders until stack is confirmed |
| Hero | `src/app/App.tsx:983` | `Section > Container > Block(2 columns)` | Direct build or section template | Yes | Background media should come from WordPress Media Library |
| Hero search widget | `src/app/App.tsx:273` | Widget shell inside hero right column | Direct build now; plugin/shortcode later if dynamic | Visual shell only | Use the existing `rego-search.php` only as a prototype |
| Trust bar | `src/app/App.tsx:384` | `Section > Container > Block(3 items)` | Trust item component if reused | Yes | Good candidate for a synced mini-component if reused elsewhere |
| Promo section | `src/app/App.tsx:555` | `Section > Container > Block(header) + Block(grid)` | Promo card component only if reused | Static layout only | Defer countdown logic until data ownership is decided |
| Featured products | `src/app/App.tsx:410` | `Section > Container > Block(header) + Block(grid)` | Product card component later if repeated | Shell only | Do not port fake product arrays into WordPress |
| About section | `src/app/App.tsx:759` | `Section > Container > Block(2 columns)` | Direct build or section template | Yes | Trust badge can stay plain content for now |
| Category section | `src/app/App.tsx:832` | `Section > Container > Block(3 cards)` | Category card component if reused | Yes | Replace `#` links with real WordPress URLs |
| Footer | `src/app/App.tsx:867` | Bricks `Footer` template | Template | Yes | Use real pages or menus, not placeholder anchors |

Bricks references behind the reuse choices:

- Templates intro: https://academy.bricksbuilder.io/article/an-intro-to-templates/
- Components: https://academy.bricksbuilder.io/article/components/
- Wireframe templates: https://academy.bricksbuilder.io/article/wireframe-templates/

## Component vs Template Decisions

Use this split so the build stays maintainable:

- Build as Bricks templates:
  - global header
  - global footer
- Build as section templates only if you expect repeated insertion with page-level edits later:
  - hero
  - trust strip
  - about section
  - category section
- Build as components only when synced global edits are actually useful:
  - trust item
  - category card
  - promo tile
  - repeatable CTA/button variants

`Inference:` do not turn every repeated block into a component on day one. Use components for elements that truly need synced updates across multiple pages; otherwise a direct page build or section template is simpler.

## Copy-Paste Guides Available Now

Use the companion files in this same folder when you want Bricks 2.3 starter code:

- `bricks-copy-paste-guides.md`
- `bricks-copy-paste-guides.html`
- `homepage-bricks-build-checklist.md`
- `homepage-bricks-build-checklist.html`
- `hero-widget-bricks-runbook.md`
- `hero-widget-bricks-runbook.html`

Those guides include safe snippets for:

- token seed CSS
- hero shell with a static search-widget shell
- trust bar
- about section
- category cards

They intentionally do **not** include finished implementations for:

- real rego lookup
- real tyre-size filtering
- WooCommerce product queries
- countdown logic backed by WordPress content

## Safe Strategy for the Existing `rego-search.php`

Current status of `wordpress-theme/nonomags-child/rego-search.php`:

- It is not a WordPress plugin.
- It is a Bricks-oriented front-end prototype.
- It redirects to `/shop/?rego=...` and `/shop/?tyre_size=...`.
- It does not define how WordPress should parse those values or filter products.

Safe use right now:

- use it as a UI reference
- use it as a prototype Bricks paste artifact
- do not treat it as completed WordPress functionality

Important Bricks note:

- Bricks 2.3 can convert pasted HTML/CSS into Builder elements and classes.
- JavaScript is routed to a Code element for manual review/signing rather than being silently executed.

Source:

- https://academy.bricksbuilder.io/article/html-css-to-bricks/
- https://academy.bricksbuilder.io/article/custom-code/

If this becomes a real WordPress feature later, the safest implementation path is:

1. Create a dedicated plugin under `wp-content/plugins`.
2. Add a proper plugin bootstrap file and header.
3. Use the Settings API if the feature needs options or API keys.
4. Sanitize incoming values.
5. Escape output late.
6. Optionally expose the widget through a shortcode so it can be placed inside Bricks content/templates.

WordPress sources:

- Plugin basics: https://developer.wordpress.org/plugins/plugin-basics/
- Plugin header requirements: https://developer.wordpress.org/plugins/plugin-basics/header-requirements/
- Shortcodes: https://developer.wordpress.org/plugins/shortcodes/
- Settings API: https://developer.wordpress.org/plugins/settings/settings-api/
- Sanitizing data: https://developer.wordpress.org/apis/security/sanitizing/
- Escaping data: https://developer.wordpress.org/apis/security/escaping/

## Performance, SEO, and Accessibility Baseline

Recommended Bricks checks before launch:

| Area | Recommended action | Type | Source |
|---|---|---|---|
| Performance | Try `Bricks > Settings > Performance > CSS Loading Method: External Files`, then regenerate CSS files | Official | https://academy.bricksbuilder.io/article/asset-loading/ |
| Performance | Disable emojis, embeds, or jQuery migrate only if the site does not need them | Official | https://academy.bricksbuilder.io/article/settings/ |
| Performance | Prefer local fonts through Bricks Font Manager or Custom Fonts instead of permanent external font requests | Official | https://academy.bricksbuilder.io/article/font-manager/ |
| Performance | Keep the homepage above the fold light and avoid unnecessary code elements | Inference | Bricks docs + performance practice |
| SEO | Set permalink, title, metadata, and social sharing details in Bricks Page Settings | Official | https://academy.bricksbuilder.io/article/page-settings/ |
| Accessibility | Keep labels, alt text, descriptive links, visible focus states, and semantic structure intact | Official | https://academy.bricksbuilder.io/article/accessibility/ |

Project-specific note:

- The current child theme enqueues Inter from Google in `wordpress-theme/nonomags-child/functions.php`.
- `Inference:` if this site is going to lean on Bricks for performance tuning, consider moving font handling to Bricks-managed local fonts later instead of keeping an external Google Fonts request indefinitely.

## What Should Not Be Ported 1:1

These pieces are React prototype logic, not safe WordPress implementation targets yet:

- `CartProvider` cart state in `App.tsx`
- mock product inventory in `StorePage.tsx`
- client-side filter logic in `StorePage.tsx`
- simulated order confirmation and totals in `CheckoutPage.tsx`
- hard-coded related product logic in `ProductPage.tsx`
- the `implementation` route
- the `StyleguidePanel`

Reason:

- WordPress pages and URLs should replace the SPA route switch in `App.tsx`.
- Store, product, cart, and checkout behavior need a real commerce stack rather than the current mocked data.

## Unknowns That Should Stay Unimplemented

Do not implement these until they are explicitly decided:

- the rego lookup data source
- the WordPress-side logic behind `?rego=`
- the WordPress-side logic behind `?tyre_size=`
- the exact shop filtering plugin or query model
- whether the account icon links to WordPress users, a custom account page, or nothing
- whether "Mags & Wheels" and "Combos" are categories, archives, or standalone landing pages
- whether the promo countdown is driven by post meta, options, or manual content updates

Implementation rule:

- if one of these is still unresolved, leave it out of the build instead of filling the gap with guessed behavior

## Recommended Build Sequence

1. Create the WordPress homepage page and set it as the static front page.
2. Do not introduce a competing `front-page.php` while using the Bricks-first homepage path.
3. Build the global Bricks header and footer templates.
4. Set up homepage tokens, classes, and page settings in Bricks.
5. Rebuild the homepage sections from `App.tsx` in this order:
   - hero
   - trust bar
   - promo section shell
   - featured products shell
   - about section
   - category section
6. Use the companion copy-paste guide where a static section can speed up the build.
7. Replace placeholder links, placeholder images, and temporary copy with real WordPress content.
8. Defer rego search behavior, product queries, countdown logic, and advanced shop filtering until the backend approach is confirmed.

## Sources Used

### Bricks Academy

- HTML & CSS to Bricks  
  https://academy.bricksbuilder.io/article/html-css-to-bricks/
- Custom Code  
  https://academy.bricksbuilder.io/article/custom-code/
- Layout  
  https://academy.bricksbuilder.io/article/layout/
- Section element  
  https://academy.bricksbuilder.io/article/section-element/
- Container element  
  https://academy.bricksbuilder.io/article/container-element/
- Block element  
  https://academy.bricksbuilder.io/article/block-element/
- Intro to templates  
  https://academy.bricksbuilder.io/article/an-intro-to-templates/
- Components  
  https://academy.bricksbuilder.io/article/components/
- Wireframe templates  
  https://academy.bricksbuilder.io/article/wireframe-templates/
- Responsive editing  
  https://academy.bricksbuilder.io/article/responsive-editing/
- Page settings  
  https://academy.bricksbuilder.io/article/page-settings/
- Settings  
  https://academy.bricksbuilder.io/article/settings/
- Asset loading  
  https://academy.bricksbuilder.io/article/asset-loading/
- Font manager  
  https://academy.bricksbuilder.io/article/font-manager/
- Accessibility  
  https://academy.bricksbuilder.io/article/accessibility/

### WordPress

- Create a static front page  
  https://wordpress.org/documentation/article/create-a-static-front-page/
- Child themes  
  https://developer.wordpress.org/themes/advanced-topics/child-themes/
- Template hierarchy  
  https://developer.wordpress.org/themes/classic-themes/basics/template-hierarchy/
- Navigation menus  
  https://developer.wordpress.org/themes/classic-themes/functionality/navigation-menus/
- `register_nav_menus()`  
  https://developer.wordpress.org/reference/functions/register_nav_menus/
- Including CSS & JavaScript  
  https://developer.wordpress.org/themes/classic-themes/basics/including-css-javascript/
- `wp_enqueue_style()`  
  https://developer.wordpress.org/reference/functions/wp_enqueue_style/
- `wp_enqueue_script()`  
  https://developer.wordpress.org/reference/functions/wp_enqueue_script/
- Plugin basics  
  https://developer.wordpress.org/plugins/plugin-basics/
- Plugin header requirements  
  https://developer.wordpress.org/plugins/plugin-basics/header-requirements/
- Shortcodes  
  https://developer.wordpress.org/plugins/shortcodes/
- Settings API  
  https://developer.wordpress.org/plugins/settings/settings-api/
- Sanitizing data  
  https://developer.wordpress.org/apis/security/sanitizing/
- Escaping data  
  https://developer.wordpress.org/apis/security/escaping/
