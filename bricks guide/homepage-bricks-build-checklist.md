# Homepage Bricks Build Checklist for Nono Mags

## Goal

This is a builder-ordered checklist for recreating the current `home` route from `src/app/App.tsx` as a WordPress homepage in Bricks.

It is intentionally limited to the parts that are safe to build now:

- header
- hero
- hero widget shell
- trust bar
- promo section shell
- featured products shell
- about section
- category section
- footer

It does **not** turn unresolved fitment, WooCommerce, query, or countdown logic into fake completed features.

## Assumptions

- Bricks version is `2.3+`.
- The homepage will be built as a normal WordPress page assigned as the static front page.
- Bricks theme is active and the current child theme remains available.
- You have builder access to:
  - page settings
  - templates
  - theme styles
  - color palettes
  - variables manager
  - class manager
  - components
- Current scope is the homepage only, not the full store migration.

If any of those controls are missing, check `Bricks > Settings > Builder access` first.

Sources:

- Bricks builder access: https://academy.bricksbuilder.io/article/builder-access/
- WordPress static front page: https://wordpress.org/documentation/article/create-a-static-front-page/

## Phase 1: Create and Assign the Homepage in WordPress

1. In WordPress admin, go to `Pages > Add New`.
2. Create a page named `Home`.
3. Publish the page.
4. Go to `Settings > Reading`.
5. In `Home page displays`, choose `A static page`.
6. In `Home page`, select `Home`.
7. If WordPress asks for a posts page, create one separately and assign it there.
8. Click `Save Changes`.

Expected result:

- WordPress homepage ownership is now attached to a real page instead of the default posts list.

WordPress source:

- https://wordpress.org/documentation/article/create-a-static-front-page/

## Phase 2: Confirm Bricks Permissions Before Building

1. Go to `Bricks > Settings > Builder access`.
2. Confirm your capability grants access to:
   - `Access page settings`
   - `Create templates`
   - `Edit templates`
   - `Access theme styles`
   - `Access color palettes`
   - `Access variables manager`
   - `Access class manager`
   - `Create global classes`
   - `Edit global classes`
   - `Insert components`
   - `Create components`
3. If any of those are missing, switch to a role/capability that has them or ask the site owner to adjust access.

Expected result:

- You can complete the checklist without getting blocked by hidden Bricks controls.

Bricks source:

- https://academy.bricksbuilder.io/article/builder-access/

## Phase 3: Enable the Bricks Paste Workflow

Do this only if you want to use the companion snippets in this folder.

1. Go to `Bricks > Settings > Builder`.
2. Find `HTML & CSS to Bricks`.
3. Set it to:
   - `Enabled (confirm on paste)` if you want a safety prompt, or
   - `Enabled (no confirm on paste)` if you already trust the snippet source.
4. Save settings.

Expected result:

- HTML and CSS pasted into Bricks can convert into native elements, classes, and variables.

Important note:

- If you paste JavaScript, Bricks routes it into a Code element for review/signing.

Bricks sources:

- https://academy.bricksbuilder.io/article/html-css-to-bricks/
- https://academy.bricksbuilder.io/article/custom-code/

## Phase 4: Build or Extend the Homepage Style Foundation

Open the `Home` page in Bricks before doing this so you can check the results in context.

### 4.1 Theme Style foundation

1. Open the `Home` page in Bricks.
2. Click the `Settings` gear in the builder toolbar.
3. Go to `Theme Styles`.
4. If the site already has a shared Theme Style, edit that instead of creating a competing campaign system.
5. If the site does not have one, create a Theme Style that will control the homepage foundation.
6. Set or confirm:
   - body font defaults
   - heading defaults
   - link defaults
   - button defaults
   - form defaults
   - visible focus outline

### 4.2 Color system

1. In the same builder settings area, open `Colors`.
2. Add or confirm these colors from the React app:
   - `brand` `#132043`
   - `brand-dark` `#0b132c`
   - `accent` `#ff5c00`
   - `accent-dark` `#e05200`
   - `text` `#1f2937`
   - `muted` `#64748b`
   - `surface` `#ffffff`
   - `surface-soft` `#f8fafc`

### 4.3 Variables and classes

1. Open `Style Manager > Variables`.
2. Add or confirm reusable values for:
   - container width
   - section spacing
   - card radius
   - button radius
   - card shadow
3. Open `Style Manager > Classes`.
4. Add or confirm reusable classes for:
   - content shell/container wrapper
   - primary button
   - secondary button
   - pill/eyebrow

Fastest optional path:

1. Open [bricks-copy-paste-guides.md](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/bricks-copy-paste-guides.md).
2. Copy `Snippet 1: Token Seed CSS`.
3. Paste it into Bricks with the HTML/CSS-to-Bricks feature enabled.
4. Review the generated variables/classes in Bricks and keep only the ones you want.

Bricks sources:

- https://academy.bricksbuilder.io/article/theme-styles/
- https://academy.bricksbuilder.io/article/style-manager/
- https://academy.bricksbuilder.io/article/color-manager/
- https://academy.bricksbuilder.io/article/global-variables-manager/
- https://academy.bricksbuilder.io/article/global-class-manager/

## Phase 5: Create the Global Header Template

This header is based on `src/app/App.tsx:64`.

1. In WordPress admin, go to `Bricks > Templates`.
2. Click `Add New`.
3. Name it `Global Header`.
4. Set template type to `Header`.
5. Open it in Bricks.
6. Add one root `Section`.
7. Inside it, keep the default `Container`.
8. Add two top-level `Block` elements inside the container:
   - one for the top announcement bar
   - one for the main navigation row

### 5.1 Top announcement bar

1. In the first row, set the dark brand background.
2. Add the flash-sale copy.
3. Add the fitment-guarantee support text.
4. Add the phone CTA on the right.

### 5.2 Main navigation row

1. In the second row, add:
   - logo element/image
   - navigation
   - cart/account area
2. For the navigation, use a Bricks navigation/menu approach instead of hard-coded anchors.
3. If you need a custom responsive menu, use `Nav (nestable)` and configure its mobile behavior.
4. If you already manage links in WordPress, wire the menu to real WordPress pages/menus rather than using `#`.
5. Keep the account icon and cart state visual-only unless your store/account stack is already confirmed.

### 5.3 Header conditions

1. Open the template settings or conditions area for the header.
2. Apply it to `Entire website` if this is the site-wide header.
3. Use a narrower condition only if you intentionally want a homepage-only header.

Expected result:

- The homepage now loads through a reusable Bricks header template instead of duplicated page markup.

Bricks sources:

- https://academy.bricksbuilder.io/article/an-intro-to-templates/
- https://academy.bricksbuilder.io/article/menu-builder/
- https://academy.bricksbuilder.io/article/theme-styles/

## Phase 6: Create the Global Footer Template

This footer is based on `src/app/App.tsx:867`.

1. Go to `Bricks > Templates`.
2. Click `Add New`.
3. Name it `Global Footer`.
4. Set template type to `Footer`.
5. Open it in Bricks.
6. Add one root `Section` and keep the default `Container`.
7. Build a four-column footer layout for:
   - brand/logo and rating
   - shop links
   - customer care links
   - help CTA
8. Add a lower legal row for copyright and policy links.
9. Apply template conditions to `Entire website` unless you want a special homepage-only footer.
10. Replace placeholder links with real WordPress pages or menu destinations.

Expected result:

- Footer is global and reusable, matching the structure in the React app without hard-coding it into the page body.

Bricks source:

- https://academy.bricksbuilder.io/article/an-intro-to-templates/

## Phase 7: Build the Homepage Body in Bricks

Open the `Home` page in Bricks. The safest section order is the same as the current React homepage:

1. Hero
2. Trust bar
3. Promo section shell
4. Featured products shell
5. About section
6. Category section

Default Bricks structure for each major section:

- `Section > Container > Block`

Bricks sources:

- https://academy.bricksbuilder.io/article/layout/
- https://academy.bricksbuilder.io/article/section-element/
- https://academy.bricksbuilder.io/article/container-element/
- https://academy.bricksbuilder.io/article/block-element/

### 7.1 Hero section

This is based on `src/app/App.tsx:983`.

1. Add a new root `Section` to the page.
2. Keep the default `Container`.
3. Inside the container, add two sibling `Block` elements:
   - left block for hero copy
   - right block for the widget
4. In the left block add:
   - eyebrow/pill text
   - `H1`
   - supporting paragraph
   - proof/check row
5. Set the section background to a dark brand overlay first.
6. After layout is stable, replace the background with the real Media Library image and overlay styling.

Fastest optional path:

1. Open [bricks-copy-paste-guides.md](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/bricks-copy-paste-guides.md).
2. Copy `Snippet 2: Hero Shell With Static Search Widget Shell`.
3. Paste it into the page.
4. Review the converted structure and simplify wrappers if Bricks adds anything you do not need.

For a tighter click-by-click walkthrough of just this section, use:

- [hero-widget-bricks-runbook.md](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/hero-widget-bricks-runbook.md)
- [hero-widget-bricks-runbook.html](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/hero-widget-bricks-runbook.html)

### 7.2 Hero widget shell

This is based on `src/app/App.tsx:273`.

Safe current path:

1. Keep this as a visual widget shell inside the hero right column.
2. Add the two tab labels visually.
3. Add either the rego input or the size fields visually.
4. Keep the CTA visual unless you are intentionally using the prototype redirect flow.

Prototype-only optional path:

1. Open `wordpress-theme/nonomags-child/rego-search.php`.
2. Copy the prototype markup/script.
3. Paste it into Bricks only if you accept that it is not finished WordPress functionality.
4. Review the resulting Code element, because Bricks requires JavaScript review/signing.

Do **not** treat the widget as complete until these are decided:

- rego lookup data source
- WordPress-side handling of `?rego=`
- WordPress-side handling of `?tyre_size=`
- product filtering/query logic

### 7.3 Trust bar

This is based on `src/app/App.tsx:384`.

1. Add a new root `Section` below the hero.
2. Set the dark brand background and orange top accent.
3. Add one `Container`.
4. Add three sibling `Block` or card items inside it.
5. In each item add:
   - icon
   - title
   - short description

Fastest optional path:

1. Copy `Snippet 3: Trust Bar` from [bricks-copy-paste-guides.md](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/bricks-copy-paste-guides.md).
2. Paste it into Bricks.
3. Replace placeholder icon letters with Bricks icons or SVGs.

### 7.4 Promo section shell

This is based on `src/app/App.tsx:555`.

1. Add a new root `Section` with the dark brand background.
2. Add one `Container`.
3. Add a top row for:
   - section eyebrow
   - section heading
   - countdown area
4. Add the card grid underneath.
5. Build:
   - one larger promo card
   - four smaller promo cards
   - one bottom CTA strip

Important limitation:

- Keep the countdown visual/static for now.
- Do not implement the browser timer as a finished production feature until promo date ownership is defined.

### 7.5 Featured products shell

This is based on `src/app/App.tsx:410`.

1. Add a new root `Section`.
2. Add one `Container`.
3. Create the heading row:
   - eyebrow or heading support text
   - section title
   - `View all deals` link
4. Add a card grid under the heading.
5. If you do not yet have a confirmed WooCommerce query model, keep this section as one of these:
   - a visual placeholder shell only, or
   - omitted for now

Do **not** paste the React mock product data into WordPress content.

### 7.6 About section

This is based on `src/app/App.tsx:759`.

1. Add a new root `Section`.
2. Set a soft surface background.
3. Add one `Container`.
4. Add two sibling `Block` elements:
   - media block on the left
   - content block on the right
5. In the media block add:
   - image
   - overlapping rating badge
6. In the content block add:
   - eyebrow
   - heading
   - supporting paragraph
   - two feature rows
   - CTA button

Fastest optional path:

1. Copy `Snippet 4: About Section` from [bricks-copy-paste-guides.md](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/bricks-copy-paste-guides.md).
2. Paste it into Bricks.
3. Replace the placeholder image and icon letters.

### 7.7 Category section

This is based on `src/app/App.tsx:832`.

1. Add a new root `Section`.
2. Add one `Container`.
3. Add a centered intro block with:
   - section heading
   - support paragraph
4. Add a three-card grid below it.
5. Each card should include:
   - image
   - short eyebrow/subtitle
   - main title
   - always-visible CTA
6. Replace every `#` link with the real WordPress destination before publishing.

Fastest optional path:

1. Copy `Snippet 5: Category Cards` from [bricks-copy-paste-guides.md](C:/Users/Nathes2/Desktop/Nono%20Mags/Redesign%20landing%20page/bricks%20guide/bricks-copy-paste-guides.md).
2. Paste it into Bricks.
3. Replace placeholder images and URLs.

## Phase 8: Extract Reusable Parts Only Where They Help

After the page body is stable, decide whether any repeated items should become components.

Good component candidates:

- trust item
- category card
- promo tile
- repeated CTA/button internals

Keep these as plain page sections unless you expect repeated reuse:

- hero
- about section
- category section wrapper

Bricks source:

- https://academy.bricksbuilder.io/article/components/

## Phase 9: Run the Responsive Pass

Bricks styles inherit from the base breakpoint down unless overridden, so do desktop/base first and then adjust smaller breakpoints.

1. Stay on the `Home` page in Bricks.
2. Finish the desktop/base layout first.
3. Switch to `Tablet portrait`.
4. Switch to `Mobile landscape`.
5. Switch to `Mobile portrait`.
6. At each breakpoint, check:
   - hero columns stack correctly
   - widget width does not overflow
   - trust bar stacks cleanly
   - promo grid compresses without clipping
   - about section media and badge do not collide
   - category cards stack cleanly
   - header mobile menu opens and closes correctly

Specific adjustments you will probably need:

- hero: 2 columns to 1 column below tablet
- trust bar: 3 items to stacked layout on small screens
- about section: image/badge above content on small screens
- category grid: 3 columns to 1 column on small screens
- header nav: make sure mobile menu styling is edited on the breakpoint where mobile menu begins

Bricks source:

- https://academy.bricksbuilder.io/article/responsive-editing/
- https://academy.bricksbuilder.io/article/menu-builder/

## Phase 10: Finish Page Settings, SEO, and Performance

### 10.1 Homepage page settings

1. While editing the `Home` page, click the `Settings` gear.
2. Open `Page Settings`.
3. In `SEO`, set:
   - permalink
   - title
   - metadata
4. In `Social Media`, set the homepage share image and share text.
5. Leave header/footer enabled unless you intentionally need a landing page without them.

### 10.2 Performance pass

1. Go to `Bricks > Settings > Performance`.
2. Review whether the site needs:
   - emojis
   - embeds
   - jQuery migrate
3. If not needed, disable them.
4. In the performance/asset loading settings, try `CSS Loading Method: External Files`.
5. After switching CSS loading mode, click `Regenerate CSS files`.
6. Keep images sourced from the Media Library at the smallest appropriate size.
7. Prefer Bricks-managed styles, variables, and classes over page-specific code where possible.

### 10.3 Accessibility pass

1. Make sure the homepage keeps one clear `H1`.
2. Give informative images real alt text.
3. Keep focus outlines visible.
4. Keep descriptive labels on widget inputs.
5. Keep links descriptive instead of generic `click here` wording.

Project-specific note:

- `Inference:` the child theme currently loads Inter from Google in `wordpress-theme/nonomags-child/functions.php`. If you later want tighter performance control, consider moving font handling to Bricks-managed local fonts instead of keeping the external request forever.

Bricks sources:

- https://academy.bricksbuilder.io/article/page-settings/
- https://academy.bricksbuilder.io/article/settings/
- https://academy.bricksbuilder.io/article/asset-loading/
- https://academy.bricksbuilder.io/article/accessibility/
- https://academy.bricksbuilder.io/article/font-manager/

## Stop Here If These Are Still Unresolved

Do not continue into production-level implementation of these pieces until they are explicitly decided:

- rego lookup data source
- WordPress handling for `?rego=`
- WordPress handling for `?tyre_size=`
- shop filtering/query model
- account behavior
- real WooCommerce featured-products source
- countdown ownership

If any of those are still unknown, the correct move is to ship the visual shell only or leave that part out.

## Sources Used

### Bricks Academy

- Builder access  
  https://academy.bricksbuilder.io/article/builder-access/
- HTML & CSS to Bricks  
  https://academy.bricksbuilder.io/article/html-css-to-bricks/
- Custom Code  
  https://academy.bricksbuilder.io/article/custom-code/
- Theme Styles  
  https://academy.bricksbuilder.io/article/theme-styles/
- Style Manager  
  https://academy.bricksbuilder.io/article/style-manager/
- Color Manager  
  https://academy.bricksbuilder.io/article/color-manager/
- Global Variables Manager  
  https://academy.bricksbuilder.io/article/global-variables-manager/
- Global Class Manager  
  https://academy.bricksbuilder.io/article/global-class-manager/
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
- Menu Builder  
  https://academy.bricksbuilder.io/article/menu-builder/
- Responsive editing  
  https://academy.bricksbuilder.io/article/responsive-editing/
- Page settings  
  https://academy.bricksbuilder.io/article/page-settings/
- Settings  
  https://academy.bricksbuilder.io/article/settings/
- Asset loading  
  https://academy.bricksbuilder.io/article/asset-loading/
- Accessibility  
  https://academy.bricksbuilder.io/article/accessibility/
- Font manager  
  https://academy.bricksbuilder.io/article/font-manager/

### WordPress

- Create a static front page  
  https://wordpress.org/documentation/article/create-a-static-front-page/
