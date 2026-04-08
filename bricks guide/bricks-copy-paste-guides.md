# Nono Mags Bricks Copy-Paste Guides

Use this file only for the parts of the homepage that are already safe to build as static Bricks sections.

## Before You Paste

- Bricks version: these snippets assume Bricks `2.3+`.
- Enable `Bricks > Settings > Builder > HTML & CSS to Bricks` before using them.
- Bricks can convert pasted HTML and CSS into native Builder structure, global classes, and global variables.
- If you paste JavaScript, Bricks routes it into a Code element for review/signing instead of silently running it.

Official Bricks sources:

- https://academy.bricksbuilder.io/article/html-css-to-bricks/
- https://academy.bricksbuilder.io/article/custom-code/

## Snippet 1: Token Seed CSS

Paste location:

- Paste this CSS into Bricks first if you want reusable variables and starter utility classes.

What it gives you:

- brand colors from the React app
- shared width, spacing, radii, and shadow values
- starter button and pill classes

```css
:root {
  --nm-color-brand: #132043;
  --nm-color-brand-dark: #0b132c;
  --nm-color-accent: #ff5c00;
  --nm-color-accent-dark: #e05200;
  --nm-color-text: #1f2937;
  --nm-color-muted: #64748b;
  --nm-color-border: #dbe3ee;
  --nm-color-surface: #ffffff;
  --nm-color-surface-soft: #f8fafc;
  --nm-color-success: #15803d;
  --nm-shadow-card: 0 12px 36px rgba(15, 23, 42, 0.12);
  --nm-radius-card: 24px;
  --nm-radius-button: 14px;
  --nm-space-section-y: clamp(4rem, 7vw, 7rem);
  --nm-width-content: min(100% - 2rem, 1200px);
}

.nm-shell {
  width: var(--nm-width-content);
  margin-inline: auto;
}

.nm-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 92, 0, 0.28);
  background: rgba(255, 92, 0, 0.16);
  color: var(--nm-color-accent);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.nm-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-height: 3.5rem;
  padding: 0.95rem 1.4rem;
  border: 0;
  border-radius: var(--nm-radius-button);
  font-weight: 800;
  text-decoration: none;
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.nm-button:hover {
  transform: translateY(-1px);
}

.nm-button--primary {
  background: var(--nm-color-accent);
  color: #ffffff;
}

.nm-button--primary:hover {
  background: var(--nm-color-accent-dark);
}

.nm-button--secondary {
  background: var(--nm-color-brand);
  color: #ffffff;
}

.nm-button--secondary:hover {
  background: var(--nm-color-brand-dark);
}
```

Cleanup note:

- After paste, review the generated global variables and classes in Bricks and rename only if you want a different project prefix.

## Snippet 2: Hero Shell With Static Search Widget Shell

Paste location:

- Paste into an empty homepage area in Bricks.
- This should convert into one hero `Section` with a left content column and a right widget column.

What it gives you:

- the homepage hero structure from `App.tsx`
- a static visual shell for the search widget
- no real rego or tyre-size logic yet

HTML:

```html
<section class="nm-home-hero">
  <div class="nm-shell nm-home-hero__inner">
    <div class="nm-home-hero__copy">
      <p class="nm-pill">Rated #1 Tyre Network in NZ</p>
      <h1 class="nm-home-hero__title">
        Get the Right Tyres. <span>Guaranteed.</span>
      </h1>
      <p class="nm-home-hero__text">
        Enter your rego and we'll show you the exact tyres for your car. Shipped directly to your local fitter or right to your door.
      </p>
      <ul class="nm-home-hero__checks">
        <li>Free Shipping</li>
        <li>200+ Fitters</li>
      </ul>
    </div>

    <aside class="nm-home-widget" aria-label="Vehicle search widget">
      <div class="nm-home-widget__tabs">
        <button class="nm-home-widget__tab is-active" type="button">Search by Rego</button>
        <button class="nm-home-widget__tab" type="button">Search by Size</button>
      </div>

      <div class="nm-home-widget__body">
        <label class="nm-home-widget__label" for="nm-rego-demo">Enter your license plate</label>
        <input class="nm-home-widget__input" id="nm-rego-demo" type="text" placeholder="e.g. ABC123" />
        <p class="nm-home-widget__hint">We'll find compatible tyres and wheels for your vehicle.</p>
        <button class="nm-button nm-button--primary" type="button">Find My Tyres</button>
      </div>
    </aside>
  </div>
</section>
```

CSS:

```css
.nm-home-hero {
  position: relative;
  overflow: hidden;
  padding-block: clamp(5rem, 9vw, 8rem);
  background:
    radial-gradient(circle at top right, rgba(255, 92, 0, 0.18), transparent 25%),
    linear-gradient(135deg, rgba(11, 19, 44, 0.98), rgba(19, 32, 67, 0.94));
  color: #ffffff;
}

.nm-home-hero__inner {
  display: grid;
  grid-template-columns: 1.2fr minmax(320px, 420px);
  gap: clamp(2rem, 4vw, 4rem);
  align-items: center;
}

.nm-home-hero__copy {
  display: grid;
  gap: 1.5rem;
}

.nm-home-hero__title {
  margin: 0;
  font-size: clamp(2.8rem, 7vw, 4.6rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
  max-width: 12ch;
}

.nm-home-hero__title span {
  color: var(--nm-color-accent);
}

.nm-home-hero__text {
  max-width: 36rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.7;
}

.nm-home-hero__checks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem 1.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-weight: 700;
}

.nm-home-hero__checks li {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.nm-home-hero__checks li::before {
  content: "";
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.14);
}

.nm-home-widget {
  background: var(--nm-color-surface);
  color: var(--nm-color-text);
  border-radius: var(--nm-radius-card);
  box-shadow: var(--nm-shadow-card);
  overflow: hidden;
}

.nm-home-widget__tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background: #f1f5f9;
}

.nm-home-widget__tab {
  min-height: 3.6rem;
  padding: 1rem;
  border: 0;
  border-top: 4px solid transparent;
  background: transparent;
  color: #64748b;
  font-weight: 800;
}

.nm-home-widget__tab.is-active {
  border-top-color: var(--nm-color-accent);
  background: #ffffff;
  color: var(--nm-color-brand);
}

.nm-home-widget__body {
  display: grid;
  gap: 1rem;
  padding: 2rem;
}

.nm-home-widget__label {
  font-weight: 800;
  color: var(--nm-color-brand);
}

.nm-home-widget__input {
  min-height: 3.5rem;
  padding: 0.95rem 1rem;
  border: 2px solid #cbd5e1;
  border-radius: 14px;
  font: inherit;
  text-transform: uppercase;
}

.nm-home-widget__hint {
  margin: 0;
  font-size: 0.92rem;
  color: var(--nm-color-muted);
}

@media (max-width: 980px) {
  .nm-home-hero__inner {
    grid-template-columns: 1fr;
  }
}
```

Cleanup note:

- Replace the hero background with the real image in Bricks background controls after conversion.
- If you want clickable tab behavior or redirect behavior, use the prototype path described later in this file instead of pretending this HTML/CSS shell is functional.

## Snippet 3: Trust Bar

Paste location:

- Paste immediately below the hero.

What it gives you:

- the three-item trust strip from `TrustBar`
- a clean `Section > Container > Block` conversion target

HTML:

```html
<section class="nm-trust">
  <div class="nm-shell nm-trust__grid">
    <article class="nm-trust__item">
      <div class="nm-trust__icon">F</div>
      <div>
        <h3>100% Fitment Guarantee</h3>
        <p>If it doesn't fit, we replace it free.</p>
      </div>
    </article>
    <article class="nm-trust__item">
      <div class="nm-trust__icon">M</div>
      <div>
        <h3>200+ Fitting Stations</h3>
        <p>Local mechanics ready to install.</p>
      </div>
    </article>
    <article class="nm-trust__item">
      <div class="nm-trust__icon">D</div>
      <div>
        <h3>Fast NZ Delivery</h3>
        <p>Shipped directly to your fitter.</p>
      </div>
    </article>
  </div>
</section>
```

CSS:

```css
.nm-trust {
  position: relative;
  margin-top: -2rem;
  padding-block: 2.5rem;
  background: var(--nm-color-brand);
  border-top: 4px solid var(--nm-color-accent);
  color: #ffffff;
  box-shadow: 0 20px 40px rgba(11, 19, 44, 0.24);
}

.nm-trust__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.nm-trust__item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.nm-trust__icon {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  flex: 0 0 auto;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--nm-color-accent);
  font-weight: 900;
}

.nm-trust__item h3 {
  margin: 0 0 0.35rem;
  font-size: 1.1rem;
  color: #ffffff;
}

.nm-trust__item p {
  margin: 0;
  color: rgba(226, 232, 240, 0.92);
}

@media (max-width: 980px) {
  .nm-trust__grid {
    grid-template-columns: 1fr;
  }
}
```

Cleanup note:

- Replace the placeholder icon letters with Bricks icons or SVGs after conversion.

## Snippet 4: About Section

Paste location:

- Paste after the product or promo area.

What it gives you:

- the two-column structure from `AboutSection`
- a media block, trust badge, supporting copy, and two feature rows

HTML:

```html
<section class="nm-about">
  <div class="nm-shell nm-about__grid">
    <div class="nm-about__media-wrap">
      <img class="nm-about__media" src="https://placehold.co/840x640/png" alt="Replace with founder image from the WordPress Media Library" />
      <aside class="nm-about__badge" aria-label="Customer rating">
        <p class="nm-about__badge-score">4.9/5 Rating</p>
        <p class="nm-about__badge-text">Based on 12,000+ verified Kiwi reviews.</p>
      </aside>
    </div>

    <div class="nm-about__content">
      <p class="nm-about__eyebrow">Why Choose Us</p>
      <h2>New Zealand's Most Trusted Tyre Network.</h2>
      <p class="nm-about__lead">
        We've revolutionized how Kiwis buy tyres and mags. By removing the middleman, we bring you premium brands at wholesale prices, shipped directly to a local mechanic near you.
      </p>

      <div class="nm-about__features">
        <article class="nm-about__feature">
          <div class="nm-about__feature-icon">W</div>
          <div>
            <h3>Local Expert Fitting</h3>
            <p>Choose from over 200 vetted fitting stations nationwide. We ship directly to them, so you just show up.</p>
          </div>
        </article>

        <article class="nm-about__feature">
          <div class="nm-about__feature-icon nm-about__feature-icon--accent">G</div>
          <div>
            <h3>Guaranteed Fitment</h3>
            <p>Use our rego search tool. If the tyres don't fit your vehicle, we'll replace them at zero cost to you.</p>
          </div>
        </article>
      </div>

      <a class="nm-button nm-button--secondary" href="#">Learn More About Us</a>
    </div>
  </div>
</section>
```

CSS:

```css
.nm-about {
  padding-block: var(--nm-space-section-y);
  background: #f8fafc;
}

.nm-about__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(2rem, 4vw, 4rem);
  align-items: center;
}

.nm-about__media-wrap {
  position: relative;
}

.nm-about__media {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 28px;
  box-shadow: var(--nm-shadow-card);
}

.nm-about__badge {
  position: absolute;
  right: -1.5rem;
  bottom: -1.5rem;
  max-width: 15rem;
  padding: 1.4rem;
  border: 1px solid var(--nm-color-border);
  border-radius: 22px;
  background: #ffffff;
  box-shadow: var(--nm-shadow-card);
}

.nm-about__badge-score {
  margin: 0 0 0.35rem;
  color: var(--nm-color-brand);
  font-size: 1.55rem;
  font-weight: 900;
}

.nm-about__badge-text {
  margin: 0;
  color: var(--nm-color-muted);
}

.nm-about__content {
  display: grid;
  gap: 1.5rem;
}

.nm-about__eyebrow {
  margin: 0;
  color: var(--nm-color-accent);
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nm-about__content h2 {
  margin: 0;
  color: var(--nm-color-brand);
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.04;
  letter-spacing: -0.03em;
}

.nm-about__lead {
  margin: 0;
  color: var(--nm-color-text);
  font-size: 1.06rem;
  line-height: 1.8;
}

.nm-about__features {
  display: grid;
  gap: 1.25rem;
}

.nm-about__feature {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
}

.nm-about__feature-icon {
  display: grid;
  place-items: center;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 999px;
  background: rgba(19, 32, 67, 0.1);
  color: var(--nm-color-brand);
  font-weight: 900;
}

.nm-about__feature-icon--accent {
  background: rgba(255, 92, 0, 0.14);
  color: var(--nm-color-accent);
}

.nm-about__feature h3 {
  margin: 0 0 0.35rem;
  color: var(--nm-color-brand);
}

.nm-about__feature p {
  margin: 0;
  color: var(--nm-color-muted);
  line-height: 1.7;
}

@media (max-width: 980px) {
  .nm-about__grid {
    grid-template-columns: 1fr;
  }

  .nm-about__badge {
    position: static;
    margin-top: 1rem;
  }
}
```

Cleanup note:

- Replace the placeholder image and placeholder icon letters after conversion.

## Snippet 5: Category Cards

Paste location:

- Paste near the bottom of the homepage after the about section.

What it gives you:

- the `CategorySection` structure from `App.tsx`
- a three-card grid with permanent CTA visibility

HTML:

```html
<section class="nm-categories">
  <div class="nm-shell">
    <div class="nm-categories__intro">
      <h2>Shop by Category</h2>
      <p>
        Explore our extensive range of premium products specifically chosen for New Zealand roads. Find exactly what you need.
      </p>
    </div>

    <div class="nm-categories__grid">
      <a class="nm-category-card" href="#">
        <img src="https://placehold.co/720x540/png" alt="Replace with premium tyres category image from the WordPress Media Library" />
        <div class="nm-category-card__overlay">
          <p>Shop all major brands</p>
          <h3>Premium Tyres</h3>
          <span class="nm-category-card__cta">Shop Category</span>
        </div>
      </a>

      <a class="nm-category-card" href="#">
        <img src="https://placehold.co/720x540/png" alt="Replace with mags and alloys category image from the WordPress Media Library" />
        <div class="nm-category-card__overlay">
          <p>Upgrade your ride's look</p>
          <h3>Mags and Alloys</h3>
          <span class="nm-category-card__cta">Shop Category</span>
        </div>
      </a>

      <a class="nm-category-card" href="#">
        <img src="https://placehold.co/720x540/png" alt="Replace with complete packages category image from the WordPress Media Library" />
        <div class="nm-category-card__overlay">
          <p>Wheel plus tyre combos</p>
          <h3>Complete Packages</h3>
          <span class="nm-category-card__cta">Shop Category</span>
        </div>
      </a>
    </div>
  </div>
</section>
```

CSS:

```css
.nm-categories {
  padding-block: var(--nm-space-section-y);
  background: #ffffff;
}

.nm-categories__intro {
  max-width: 44rem;
  margin-inline: auto;
  margin-bottom: 3rem;
  text-align: center;
}

.nm-categories__intro h2 {
  margin: 0 0 1rem;
  color: var(--nm-color-brand);
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.04;
  letter-spacing: -0.03em;
}

.nm-categories__intro p {
  margin: 0;
  color: var(--nm-color-text);
  font-size: 1.05rem;
  line-height: 1.8;
}

.nm-categories__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.nm-category-card {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 28px;
  min-height: 26rem;
  box-shadow: var(--nm-shadow-card);
  text-decoration: none;
}

.nm-category-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 240ms ease;
}

.nm-category-card:hover img {
  transform: scale(1.04);
}

.nm-category-card__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 0.85rem;
  padding: 2rem;
  background: linear-gradient(to top, rgba(19, 32, 67, 0.92), rgba(19, 32, 67, 0.28), transparent);
}

.nm-category-card__overlay p {
  margin: 0;
  color: var(--nm-color-accent);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nm-category-card__overlay h3 {
  margin: 0;
  color: #ffffff;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  line-height: 1.04;
}

.nm-category-card__cta {
  width: fit-content;
  padding: 0.9rem 1.2rem;
  border-radius: 14px;
  background: #ffffff;
  color: var(--nm-color-brand);
  font-weight: 800;
}

@media (max-width: 980px) {
  .nm-categories__grid {
    grid-template-columns: 1fr;
  }
}
```

Cleanup note:

- Replace `#` links with real WordPress destinations before publishing.
- These cards are safe visually now, but their target URLs are still a project decision.

## Prototype-Only Option: Existing Rego Widget File

If you want a closer interactive prototype for the hero widget:

- Use `wordpress-theme/nonomags-child/rego-search.php`
- Treat it as a Bricks prototype file, not as finished WordPress logic
- Expect the script block to land in a Bricks Code element that still needs review/signing

Use it only when you accept these limitations:

- it redirects with query params only
- it does not resolve rego data
- it does not parse the shop results on the WordPress side

## Do Not Paste These As Finished Production Sections Yet

Leave these out until their data sources are confirmed:

- Featured products with real product cards
- Promo countdown logic
- Store page filters
- Checkout flow
- Account/cart behavior beyond visual placeholders

Reason:

- those pieces depend on a real WordPress/WooCommerce/plugin implementation, not just page structure
